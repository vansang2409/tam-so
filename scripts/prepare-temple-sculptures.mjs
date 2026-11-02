// Tối ưu mẫu quét được cấp phép; chỉ dùng dữ liệu công khai ghi trong tệp sources.
import fs from 'node:fs'
import path from 'node:path'
import {createHash} from 'node:crypto'
import * as THREE from 'three'
import {MeshoptSimplifier} from 'three/addons/libs/meshopt_simplifier.module.js'
const root=path.resolve(import.meta.dirname,'..'),raw=path.join(root,'.setest/raw-sculptures'),out=path.join(root,'public/dichua/models')
const sources=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'temple-sculpture-sources.json')))
await MeshoptSimplifier.ready
const types={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16},bytes={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4}
function decode(buffer){
  if(buffer.toString('ascii',0,4)!=='glTF')throw Error('Không phải GLB')
  const n=buffer.readUInt32LE(12),json=JSON.parse(buffer.toString('utf8',20,20+n)),bin=buffer.subarray(28+n)
  function accessor(id){const a=json.accessors[id],v=json.bufferViews[a.bufferView],k=types[a.type],b=bytes[a.componentType],stride=v.byteStride||k*b,data=new DataView(bin.buffer,bin.byteOffset,bin.byteLength),result=new Float32Array(a.count*k)
    const read={5120:'getInt8',5121:'getUint8',5122:'getInt16',5123:'getUint16',5125:'getUint32',5126:'getFloat32'}[a.componentType]
    for(let i=0;i<a.count;i++)for(let j=0;j<k;j++){let x=data[read]((v.byteOffset||0)+(a.byteOffset||0)+i*stride+j*b,true);if(a.normalized)x=a.componentType===5121?x/255:a.componentType===5123?x/65535:a.componentType===5120?Math.max(-1,x/127):a.componentType===5122?Math.max(-1,x/32767):x;result[i*k+j]=x}return result
  }
  return {json,bin,accessor}
}
for(const item of sources){
  if(!/^[a-z0-9-]+$/.test(item.file))throw Error('Tên tài nguyên không hợp lệ')
  const source=path.join(raw,item.file+'.glb')
  if(!fs.existsSync(source)){const r=await fetch(item.glb,{signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error(item.file+': HTTP '+r.status);fs.mkdirSync(raw,{recursive:true});fs.writeFileSync(source,Buffer.from(await r.arrayBuffer()))}
  const {json:j,bin,accessor}=decode(fs.readFileSync(source)),buffers=[],views=[],accessors=[],meshes=[],nodes=[],images=[],textures=[],materials=[]
  let offset=0
  function addBuffer(b,target){b=Buffer.from(b.buffer||b,b.byteOffset||0,b.byteLength||b.length);const pad=(4-offset%4)%4;if(pad){buffers.push(Buffer.alloc(pad));offset+=pad}const id=views.length;views.push({buffer:0,byteOffset:offset,byteLength:b.length,...(target?{target}:{})});buffers.push(b);offset+=b.length;return id}
  function addAccessor(array,type,componentType=5126,normalized=false){const count=array.length/types[type],a={bufferView:addBuffer(array,34962),componentType,count,type,...(normalized?{normalized:true}:{})};if(type==='VEC3'&&componentType===5126){a.min=[Infinity,Infinity,Infinity];a.max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<count;i++)for(let k=0;k<3;k++){a.min[k]=Math.min(a.min[k],array[i*3+k]);a.max[k]=Math.max(a.max[k],array[i*3+k])}}accessors.push(a);return accessors.length-1}
  // Không tải normal/specular/occlusion map nặng; giữ nguyên texture màu gốc.
  const materialMap=new Map()
  function material(id){if(materialMap.has(id))return materialMap.get(id);const m=j.materials[id]||{},pbr=m.pbrMetallicRoughness||{},ref=pbr.baseColorTexture;let baseColorTexture
    if(ref){const t=j.textures[ref.index],im=j.images[t.source??t.extensions?.EXT_texture_webp?.source],v=j.bufferViews[im.bufferView];const imageId=images.length;images.push({mimeType:im.mimeType,bufferView:addBuffer(bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength))});const textureId=textures.length;textures.push(im.mimeType==='image/webp'?{sampler:0,extensions:{EXT_texture_webp:{source:imageId}}}:{source:imageId,sampler:0});baseColorTexture={index:textureId,texCoord:ref.texCoord||0}}
    const mid=materials.length;materials.push({name:m.name||item.file,pbrMetallicRoughness:{baseColorFactor:pbr.baseColorFactor||[1,1,1,1],...(baseColorTexture?{baseColorTexture}:{}),metallicFactor:.06,roughnessFactor:.78},doubleSided:!!m.doubleSided});materialMap.set(id,mid);return mid
  }
  const world=new Map()
  function visit(id,parent){const n=j.nodes[id],local=n.matrix?new THREE.Matrix4().fromArray(n.matrix):new THREE.Matrix4().compose(new THREE.Vector3(...(n.translation||[0,0,0])),new THREE.Quaternion(...(n.rotation||[0,0,0,1])),new THREE.Vector3(...(n.scale||[1,1,1]))),w=parent.clone().multiply(local);world.set(id,w);for(const child of n.children||[])visit(child,w)}
  for(const id of j.scenes[j.scene||0].nodes)visit(id,new THREE.Matrix4())
  const totalFaces=j.meshes.reduce((s,m)=>s+m.primitives.reduce((v,p)=>v+j.accessors[p.indices].count/3,0),0),ratio=Math.min(1,(/^judge-/.test(item.file)?14000:65000)/totalFaces)
  let triangles=0,error=0
  for(const [id,w]of world){const node=j.nodes[id];if(node.mesh===undefined)continue
    for(const p of j.meshes[node.mesh].primitives){
      const position=accessor(p.attributes.POSITION),normal=p.attributes.NORMAL!==undefined?accessor(p.attributes.NORMAL):null,uv=p.attributes.TEXCOORD_0!==undefined?accessor(p.attributes.TEXCOORD_0):null,color=p.attributes.COLOR_0!==undefined?accessor(p.attributes.COLOR_0):null,n=position.length/3
      const skin=node.skin!==undefined?j.skins[node.skin]:null,joints=skin?accessor(p.attributes.JOINTS_0):null,weights=skin?accessor(p.attributes.WEIGHTS_0):null,ibm=skin?accessor(skin.inverseBindMatrices):null
      const jointMatrices=skin?skin.joints.map((bone,i)=>world.get(bone).clone().multiply(new THREE.Matrix4().fromArray(ibm,i*16))):null
      const point=new THREE.Vector3(),direction=new THREE.Vector3(),sum=new THREE.Vector3(),sumN=new THREE.Vector3(),normalMatrix=new THREE.Matrix3().getNormalMatrix(w)
      for(let i=0;i<n;i++){
        point.fromArray(position,i*3);if(normal)direction.fromArray(normal,i*3)
        if(skin){sum.set(0,0,0);sumN.set(0,0,0);for(let k=0;k<4;k++){const weight=weights[i*4+k];if(!weight)continue;const matrix=jointMatrices[joints[i*4+k]];sum.addScaledVector(point.clone().applyMatrix4(matrix),weight);if(normal)sumN.addScaledVector(direction.clone().transformDirection(matrix),weight)}point.copy(sum);if(normal)direction.copy(sumN).normalize()}
        else {point.applyMatrix4(w);if(normal)direction.applyMatrix3(normalMatrix).normalize()}
        point.toArray(position,i*3);if(normal)direction.toArray(normal,i*3)
      }
      let oldIndices=Uint32Array.from(accessor(p.indices))
      // Một số bản quét tách ba đỉnh cho từng tam giác: hàn theo vị trí/UV trước khi giảm lưới.
      const weld=new Map(),remap=new Uint32Array(n),unique=[]
      for(let i=0;i<n;i++){const key=Array.from(position.subarray(i*3,i*3+3),v=>v.toFixed(6)).join(',')+(uv?':'+Array.from(uv.subarray(i*2,i*2+2),v=>v.toFixed(5)).join(','):'');if(!weld.has(key)){weld.set(key,unique.length);unique.push(i)}remap[i]=weld.get(key)}
      for(let i=0;i<oldIndices.length;i++)oldIndices[i]=remap[oldIndices[i]]
      const packedPosition=new Float32Array(unique.length*3),packedUV=new Float32Array(unique.length*2)
      for(let i=0;i<unique.length;i++){packedPosition.set(position.subarray(unique[i]*3,unique[i]*3+3),i*3);if(uv)packedUV.set(uv.subarray(unique[i]*2,unique[i]*2+2),i*2)}
      const target=Math.max(300,Math.floor(oldIndices.length*ratio/3)*3),attrs=packedUV
      const [reduced,deviation]=MeshoptSimplifier.simplifyWithAttributes(oldIndices,packedPosition,3,attrs,2,[.05,.05],null,Math.min(target,oldIndices.length),.0015,[])
      error=Math.max(error,deviation);triangles+=reduced.length/3
      const lookup=new Map(),order=[],idx=new Uint32Array(reduced.length)
      for(let i=0;i<reduced.length;i++){const old=reduced[i];if(!lookup.has(old)){lookup.set(old,order.length);order.push(old)}idx[i]=lookup.get(old)}
      function compact(a,k){const out=new Float32Array(order.length*k);for(let i=0;i<order.length;i++)for(let c=0;c<k;c++)out[i*k+c]=a[unique[order[i]]*k+c];return out}
      const attributes={POSITION:addAccessor(compact(position,3),'VEC3')}
      if(normal)attributes.NORMAL=addAccessor(compact(normal,3),'VEC3')
      if(uv)attributes.TEXCOORD_0=addAccessor(compact(uv,2),'VEC2')
      if(color){const k=j.accessors[p.attributes.COLOR_0].type==='VEC4'?4:3,a=compact(color,k);attributes.COLOR_0=addAccessor(Uint8Array.from(a,v=>Math.round(THREE.MathUtils.clamp(v,0,1)*255)),k===4?'VEC4':'VEC3',5121,true)}
      const indices=order.length<=65535?new Uint16Array(idx):idx,ai={bufferView:addBuffer(indices,34963),componentType:order.length<=65535?5123:5125,count:indices.length,type:'SCALAR'};accessors.push(ai)
      const meshId=meshes.length;meshes.push({name:item.file,primitives:[{attributes,indices:accessors.length-1,material:material(p.material||0)}]});nodes.push({name:item.file,mesh:meshId})
    }
  }
  const result={asset:{version:'2.0',generator:'Tam Sở · MeshoptSimplifier',copyright:item.author,extras:{source:item.source,license:item.licenseUrl,changes:'Static pose baked, geometry simplified, original base color texture retained; other texture maps omitted.'}},...(images.some(i=>i.mimeType==='image/webp')?{extensionsUsed:['EXT_texture_webp'],extensionsRequired:['EXT_texture_webp']}:{}),scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,materials,textures,images,samplers:[{wrapS:10497,wrapT:10497,magFilter:9729,minFilter:9987}],accessors,bufferViews:views,buffers:[{byteLength:offset}]}
  const jsonBuffer=Buffer.from(JSON.stringify(result)),jsonPad=(4-jsonBuffer.length%4)%4,binary=Buffer.concat(buffers),binPad=(4-binary.length%4)%4,header=Buffer.alloc(20),binHeader=Buffer.alloc(8)
  header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+jsonBuffer.length+jsonPad+binary.length+binPad,8);header.writeUInt32LE(jsonBuffer.length+jsonPad,12);header.writeUInt32LE(0x4e4f534a,16);binHeader.writeUInt32LE(binary.length+binPad,0);binHeader.writeUInt32LE(0x004e4942,4)
  const output=Buffer.concat([header,jsonBuffer,Buffer.alloc(jsonPad,32),binHeader,binary,Buffer.alloc(binPad)]);fs.writeFileSync(path.join(out,item.file+'.glb'),output)
  item.optimizedBytes=output.length;item.triangles=triangles;item.error=error;item.sha256=createHash('sha256').update(output).digest('hex')
  console.log(item.file,triangles+' triangles',output.length+' bytes','error '+error.toFixed(5))
}
fs.writeFileSync(path.join(raw,'optimization-report.json'),JSON.stringify(sources,null,2)+'\n')

// Cập nhật manifest và phần ghi công UI sau mỗi lần xuất lại tài nguyên.
const manifestFile=path.join(out,'manifest.json'),previous=JSON.parse(fs.readFileSync(manifestFile)),files=new Set(sources.map(a=>a.file+'.glb'))
const entries=sources.map(a=>({file:a.file+'.glb',name:a.name,author:a.author,source:a.source,uid:a.uid,license:a.license==='cc0'?'CC0 1.0':a.license==='by-sa'?'CC BY-SA 4.0':'CC BY 4.0',licenseUrl:a.licenseUrl.replace('http:','https:'),derivedFrom:a.glb,derivativeSource:a.derivativeSource,bytes:a.optimizedBytes,triangles:a.triangles,sha256:a.sha256,changes:'Tư thế được đóng thành mesh tĩnh; giảm lưới; giữ texture màu gốc, bỏ map phụ. Phối lại tỷ lệ/bố cục trong chùa hư cấu, không xác nhận là bản phục dựng đúng hình tượng thờ.'}))
const manifest=[...previous.filter(a=>!files.has(a.file)),...entries]
fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n')
fs.writeFileSync(path.join(root,'src/data/templeAssetCredits.js'),'// Sinh từ manifest tài nguyên; giấy phép áp dụng riêng cho từng mẫu.\nexport const TEMPLE_ASSET_CREDITS = '+JSON.stringify(manifest.map(({file,name,author,source,license,licenseUrl})=>({file,name,author,source,license,licenseUrl})),null,2)+'\n')
