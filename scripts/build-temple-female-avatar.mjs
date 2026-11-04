// Local derivative of the reviewed CC0 female base; no model download or Blender dependency.
// The pinned optimizer may access the npm registry when not already cached.
import fs from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {deflateSync} from 'node:zlib'
import {spawnSync} from 'node:child_process'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {prepareTempleVisitorClothing} from '../src/components/templeVisitorClothing.js'

const base=new URL('../public/dichua/models/',import.meta.url),source=await fs.readFile(new URL('visitor-female.glb',base))
const hash=b=>createHash('sha256').update(b).digest('hex')
if(hash(source)!=='f2ec89e770a890dee204010c486de5b0340021316d1cc5fa7b5c9f6328812bab')throw Error('Female source changed; review license/topology before rebuilding')
const jsonLength=source.readUInt32LE(12),document=JSON.parse(source.toString('utf8',20,20+jsonLength)),binary=source.subarray(28+jsonLength)
function pack(json,bin){
  const text=Buffer.from(JSON.stringify(json)),jp=(4-text.length%4)%4,bp=(4-bin.length%4)%4,h=Buffer.alloc(20),bh=Buffer.alloc(8)
  h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(28+text.length+jp+bin.length+bp,8);h.writeUInt32LE(text.length+jp,12);h.writeUInt32LE(0x4e4f534a,16)
  bh.writeUInt32LE(bin.length+bp,0);bh.writeUInt32LE(0x004e4942,4)
  return Buffer.concat([h,text,Buffer.alloc(jp,32),bh,bin,Buffer.alloc(bp)])
}
// Geometry-only import preserves the original texture payload in the output without decoding images in Node.
const stripped=structuredClone(document);delete stripped.images;delete stripped.textures;delete stripped.materials
for(const mesh of stripped.meshes)for(const primitive of mesh.primitives)delete primitive.material
const input=pack(stripped,binary),gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(input.buffer.slice(input.byteOffset,input.byteOffset+input.byteLength),'')
prepareTempleVisitorClothing(gltf.scene,{female:true})
// Preserve rig calibration when optimizer prunes vertices hidden by the new outfit.
// Animation/IK targets use the same 1.75m canonical frame as the reviewed source.
const fitBounds=new THREE.Box3().setFromObject(gltf.scene)
const garment=gltf.scene.getObjectByName('Ao lam garment'),chunks=[binary];let length=binary.length
function view(data,target){
  const pad=(4-length%4)%4;if(pad){chunks.push(Buffer.alloc(pad));length+=pad}
  const bytes=Buffer.from(data.buffer,data.byteOffset,data.byteLength),index=document.bufferViews.length
  document.bufferViews.push({buffer:0,byteOffset:length,byteLength:bytes.length,...(target?{target}:{})});chunks.push(bytes);length+=bytes.length;return index
}
function accessor(attribute,{bounds=false,target=34962,type}={}){
  if(attribute.normalized||attribute.isInterleavedBufferAttribute){
    const values=new Float32Array(attribute.count*attribute.itemSize)
    for(let i=0;i<attribute.count;i++)for(let k=0;k<attribute.itemSize;k++)values[i*attribute.itemSize+k]=attribute.getComponent(i,k)
    attribute=new THREE.BufferAttribute(values,attribute.itemSize)
  }
  const arrays={Float32Array:5126,Uint16Array:5123,Uint32Array:5125},array=attribute.array,entry={bufferView:view(array,target),componentType:arrays[array.constructor.name],count:attribute.count,type:type||({1:'SCALAR',2:'VEC2',3:'VEC3',4:'VEC4'}[attribute.itemSize])}
  if(bounds){entry.min=[];entry.max=[];for(let k=0;k<attribute.itemSize;k++){let min=Infinity,max=-Infinity;for(let i=0;i<attribute.count;i++){const v=attribute.getComponent(i,k);min=Math.min(min,v);max=Math.max(max,v)}entry.min.push(min);entry.max.push(max)}}
  if(!entry.componentType)throw Error('Unsupported attribute type')
  return document.accessors.push(entry)-1
}
// Replace body indices/neck positions; retain source UV, textures, skeleton and Walk animation.
gltf.scene.traverse(object=>{
  if(!object.isSkinnedMesh||object===garment)return
  const node=document.nodes.find(n=>n.name===object.name&&n.mesh!==undefined)
  if(!node)throw Error('Cannot map source mesh '+object.name)
  const primitive=document.meshes[node.mesh].primitives[0]
  primitive.indices=accessor(object.geometry.index,{target:34963})
  primitive.attributes.POSITION=accessor(object.geometry.attributes.position,{bounds:true})
})
// PNG normal weave, embedded and shared by jacket/trousers/trim. No external texture request.
function crc32(data){let crc=0xffffffff;for(const byte of data){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function pngChunk(name,data){const tag=Buffer.from(name),h=Buffer.alloc(4),tail=Buffer.alloc(4);h.writeUInt32BE(data.length);tail.writeUInt32BE(crc32(Buffer.concat([tag,data])));return Buffer.concat([h,tag,data,tail])}
const pixels=Buffer.alloc(128*(1+128*3));for(let y=0;y<128;y++)for(let x=0;x<128;x++){const p=y*385+1+x*3;pixels[p]=128+Math.round(Math.sin(x*Math.PI/2)*12);pixels[p+1]=128+Math.round(Math.sin(y*Math.PI/2)*10);pixels[p+2]=255}
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(128,0);ihdr.writeUInt32BE(128,4);ihdr[8]=8;ihdr[9]=2
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk('IHDR',ihdr),pngChunk('IDAT',deflateSync(pixels)),pngChunk('IEND',Buffer.alloc(0))])
const image=document.images.push({bufferView:view(png),mimeType:'image/png'})-1
document.samplers??=[];const sampler=document.samplers.push({magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497})-1
const texture=document.textures.push({source:image,sampler})-1
document.extensionsUsed??=[];if(!document.extensionsUsed.includes('KHR_texture_transform'))document.extensionsUsed.push('KHR_texture_transform')
const materialIndices=garment.material.map(material=>document.materials.push({name:material.userData.visitorClothing,pbrMetallicRoughness:{baseColorFactor:[...material.color.toArray(),1],metallicFactor:0,roughnessFactor:material.roughness},extras:material.userData,...(material.bumpMap?{normalTexture:{index:texture,scale:.22,extensions:{KHR_texture_transform:{scale:[5,7]}}}}:{})})-1)
const geometry=garment.geometry,attributes={}
for(const [name,semantic]of [['position','POSITION'],['normal','NORMAL'],['uv','TEXCOORD_0'],['skinIndex','JOINTS_0'],['skinWeight','WEIGHTS_0']])attributes[semantic]=accessor(geometry.attributes[name],{bounds:name==='position'})
const targets=geometry.morphAttributes.position.map((position,i)=>({POSITION:accessor(position,{bounds:true}),NORMAL:accessor(geometry.morphAttributes.normal[i])}))
const primitives=geometry.groups.map(group=>({attributes,indices:accessor(new THREE.BufferAttribute(geometry.index.array.slice(group.start,group.start+group.count),1),{target:34963}),material:materialIndices[group.materialIndex],targets}))
const mesh=document.meshes.push({name:'Ao lam garment',primitives,weights:targets.map(()=>0),extras:{targetNames:geometry.morphAttributes.position.map(a=>a.name)}})-1
const inverse=new Float32Array(garment.skeleton.boneInverses.flatMap(m=>m.toArray())),skin=document.skins.push({inverseBindMatrices:accessor(new THREE.BufferAttribute(inverse,16),{type:'MAT4',target:0}),joints:garment.skeleton.bones.map(b=>{const index=document.nodes.findIndex(n=>n.name===b.name);if(index<0)throw Error('Missing bone '+b.name);return index})})-1
const node=document.nodes.push({name:'Ao lam garment',mesh,skin})-1
document.scenes[document.scene||0].nodes.push(node)
document.scenes[document.scene||0].extras={templeOutfit:true,templeCharacterProfile:'female-lam-v1',templeFitBounds:[...fitBounds.min.toArray(),...fitBounds.max.toArray()]}
document.asset.generator='Tam So female lam authoring v1; base Grab3D CC0'
document.buffers[0].byteLength=length
const raw=pack(document,Buffer.concat(chunks)),file='visitor-female-lam.glb',temporary=new URL('../.setest/female-avatar-build/',import.meta.url)
await fs.mkdir(temporary,{recursive:true});await fs.writeFile(new URL('uncompressed.glb',temporary),raw)
const args=['--yes','--package','@gltf-transform/cli@4.5.1','gltf-transform','meshopt',fileURLToPath(new URL('uncompressed.glb',temporary)),fileURLToPath(new URL(file,base)),'--level','medium']
const npmCli=path.join(path.dirname(process.execPath),'node_modules/npm/bin/npx-cli.js')
const result=spawnSync(process.platform==='win32'?process.execPath:'npx',process.platform==='win32'?[npmCli,...args]:args,{stdio:'inherit'})
if(result.status!==0)throw Error('Pinned glTF meshopt authoring failed')
const output=await fs.readFile(new URL(file,base))
await fs.writeFile(new URL('female-lam-manifest.json',base),JSON.stringify({file,bytes:output.length,sha256:hash(output),source:'visitor-female.glb',sourceSha256:hash(source),license:'CC0-1.0 base; project-authored garment',profile:'female-lam-v1',build:'node scripts/build-temple-female-avatar.mjs',optimizer:'@gltf-transform/cli@4.5.1 meshopt --level medium',changes:'Retained reviewed CC0 head/hair/hands/Walk; authored female jacket/trousers silhouette, shoulder skinning and baked garment mesh/morphs/materials.'},null,2)+'\n')
console.log(file,output.length,hash(output))
