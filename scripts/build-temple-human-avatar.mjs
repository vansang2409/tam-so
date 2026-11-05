// Build the reviewed editable glTF source; Blender/MPFB are not runtime dependencies.
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {spawnSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {deflateSync} from 'node:zlib'

const workspace=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2)
function option(name,fallback){const i=args.indexOf(name);if(i<0)return fallback;if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Missing '+name);return path.resolve(workspace,args[i+1])}
const variant=args.includes('--male')?'male':'female'
const height=variant==='male'?1.72:1.65
const walkSpeedSource=variant==='male'?1.0869267612568045:.9704703225507183
const sourcePath=option('--source',path.join(workspace,`assets-src/temple/${variant}-human-source.glb`))
const outputPath=option('--output',path.join(workspace,`public/dichua/models/visitor-${variant}-human.glb`))
if(!/\.glb$/i.test(outputPath)||sourcePath.toLowerCase()===outputPath.toLowerCase())throw Error('Write a separate .glb output; never overwrite the reviewed source')
const source=await fs.readFile(sourcePath),sha=bytes=>createHash('sha256').update(bytes).digest('hex')
if(source.toString('utf8',0,4)!=='glTF'||source.readUInt32LE(4)!==2)throw Error('Expected reviewed GLB2 source')
const n=source.readUInt32LE(12),json=JSON.parse(source.toString('utf8',20,20+n)),binary=source.subarray(n+28)
const activeMaterials=new Set(),visited=new Set()
function visitNode(id){
  if(visited.has(id))return;visited.add(id);const node=json.nodes[id]
  if(node.mesh!==undefined)for(const primitive of json.meshes[node.mesh].primitives)if(primitive.material!==undefined)activeMaterials.add(primitive.material)
  for(const child of node.children||[])visitNode(child)
}
for(const scene of json.scenes)for(const node of scene.nodes)visitNode(node)
if(!json.skins?.length||json.skins.some(skin=>skin.joints.length!==53))throw Error('This build profile requires the reviewed 53-joint GameEngine rig')
for(const name of ['pelvis','spine_03','head','hand_l','hand_r','middle_03_l','middle_03_r','ball_l','ball_r'])if(!json.nodes.some(node=>node.name===name))throw Error('Missing humanoid joint '+name)
const blinkMeshes=json.meshes.filter(mesh=>['eyeBlinkLeft','eyeBlinkRight'].every(name=>mesh.extras?.targetNames?.includes(name)))
if(blinkMeshes.length!==2||!json.animations?.some(clip=>clip.name==='Walk')||!json.animations.some(clip=>clip.name==='Idle'))throw Error('Source requires body/lash blinks and reviewed Walk/Idle')
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function chunk(name,bytes){const h=Buffer.alloc(4),tag=Buffer.from(name),tail=Buffer.alloc(4);h.writeUInt32BE(bytes.length);tail.writeUInt32BE(crc32(Buffer.concat([tag,bytes])));return Buffer.concat([h,tag,bytes,tail])}
const pixels=Buffer.alloc(128*385)
for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const i=y*385+1+x*3;pixels[i]=128+Math.round(Math.sin(x*Math.PI/2)*15);pixels[i+1]=128+Math.round(Math.sin(y*Math.PI/2)*13);pixels[i+2]=255
}
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(128);ihdr.writeUInt32BE(128,4);ihdr[8]=8;ihdr[9]=2
const weave=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))])
const padding=(4-binary.length%4)%4,view=json.bufferViews.push({buffer:0,byteOffset:binary.length+padding,byteLength:weave.length})-1
const image=json.images.push({name:'Tam So generated cotton weave',bufferView:view,mimeType:'image/png'})-1
json.samplers??=[];const sampler=json.samplers.push({magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497})-1
const texture=json.textures.push({name:'Cotton normal',source:image,sampler})-1
json.extensionsUsed??=[];if(!json.extensionsUsed.includes('KHR_texture_transform'))json.extensionsUsed.push('KHR_texture_transform')
for(let index=0;index<json.materials.length;index++){
  if(!activeMaterials.has(index))continue
  const material=json.materials[index]
  const name=material.name.toLowerCase(),part=name.endsWith('_skin')?'skin':name.endsWith('_shirt')?'shirt':name.endsWith('_pants')?'pants':name.endsWith('_eyes')?'eyes':name.includes('eyelashes')?'eyelashes':name.includes('eyebrows')?'eyebrows':name.includes('bob')||name.endsWith('_hair')?'hair':name.includes('shoes')?'shoes':name.includes('teeth')?'teeth':name.includes('tongue')?'tongue':null
  if(!part)throw Error('Unrecognized authored material; map it explicitly before building: '+material.name)
  material.extras={...material.extras,templePart:part}
  if(part==='shirt'||part==='pants'){
    material.extras.visitorClothing=part==='shirt'?'ao-lam':'trousers'
    material.pbrMetallicRoughness.baseColorFactor=part==='shirt'?[.27,.32,.37,1]:[.23,.28,.32,1]
    material.normalTexture={index:texture,scale:.18,extensions:{KHR_texture_transform:{scale:[14,14]}}}
  }
  if(part==='eyes')material.pbrMetallicRoughness.roughnessFactor=.18
}
const scene=json.scenes[json.scene||0]
scene.extras={...scene.extras,templeOutfit:true,templeCharacterProfile:`${variant}-human-v1`,templeRig:'mpfb-gameengine',templeHeight:height,templeWalkSpeed:walkSpeedSource}
json.asset.extras={...json.asset.extras,templeSourceSha256:sha(source),buildPipeline:'Tam So human avatar; glTF Transform4.5.1 WebP92/meshopt-medium'}
const bin=Buffer.concat([binary,Buffer.alloc(padding),weave]);json.buffers[0].byteLength=bin.length
function pack(document,bytes){
  const text=Buffer.from(JSON.stringify(document)),jp=(4-text.length%4)%4,bp=(4-bytes.length%4)%4,h=Buffer.alloc(20),bh=Buffer.alloc(8)
  h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(28+text.length+jp+bytes.length+bp,8);h.writeUInt32LE(text.length+jp,12);h.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bytes.length+bp);bh.writeUInt32LE(0x004e4942,4)
  return Buffer.concat([h,text,Buffer.alloc(jp,32),bh,bytes,Buffer.alloc(bp)])
}
const cache=path.join(workspace,`.setest/${variant}-human-avatar-build`);await fs.mkdir(cache,{recursive:true});await fs.mkdir(path.dirname(outputPath),{recursive:true})
await fs.writeFile(path.join(cache,'prepared.glb'),pack(json,bin))
function cli(command){
  const prefix=['--yes','--package','@gltf-transform/cli@4.5.1','gltf-transform'],npm=path.join(path.dirname(process.execPath),'node_modules/npm/bin/npx-cli.js')
  const result=spawnSync(process.platform==='win32'?process.execPath:'npx',process.platform==='win32'?[npm,...prefix,...command]:[...prefix,...command],{cwd:workspace,stdio:'inherit'})
  if(result.status!==0)throw Error('Pinned glTF build failed: '+command[0])
}
cli(['prune',path.join(cache,'prepared.glb'),path.join(cache,'pruned.glb'),'--keep-leaves','true','--keep-attributes','true','--keep-indices','true','--keep-solid-textures','true'])
cli(['webp',path.join(cache,'pruned.glb'),path.join(cache,'webp.glb'),'--quality','92','--effort','50'])
cli(['meshopt',path.join(cache,'webp.glb'),outputPath,'--level','medium','--quantize-position','16','--quantize-normal','12','--quantize-weight','16'])
const output=await fs.readFile(outputPath),jn=output.readUInt32LE(12),result=JSON.parse(output.toString('utf8',20,20+jn))
const report={file:path.basename(outputPath),bytes:output.length,sha256:sha(output),sourceSha256:sha(source),profile:scene.extras.templeCharacterProfile,rig:'mpfb-gameengine',height,walkSpeedSource,materials:result.materials.map(material=>({name:material.name,part:material.extras?.templePart})),joints:result.skins.map(skin=>skin.joints.length),blinks:result.meshes.filter(mesh=>mesh.extras?.targetNames?.includes('eyeBlinkLeft')).map(mesh=>mesh.extras.targetNames),animations:result.animations.map(clip=>clip.name),build:'node scripts/build-temple-human-avatar.mjs'+(variant==='male'?' --male':''),optimizer:'@gltf-transform/cli@4.5.1 WebP92; meshopt medium POSITION16 NORMAL12 WEIGHT16'}
await fs.writeFile(outputPath.replace(/\.glb$/i,'.json'),JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report,null,2))
