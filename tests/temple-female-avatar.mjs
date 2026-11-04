import assert from 'node:assert/strict'
import fs from 'node:fs'
import {createHash} from 'node:crypto'
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {createDetailedVisitor} from '../src/components/templeDetailedVisitors.js'
import {prepareTempleVisitorClothing} from '../src/components/templeVisitorClothing.js'

const base=new URL('../public/dichua/models/',import.meta.url)
const manifest=JSON.parse(fs.readFileSync(new URL('female-lam-manifest.json',base),'utf8'))
const lineage=JSON.parse(fs.readFileSync(new URL('detail-manifest.json',base),'utf8')).find(a=>a.file===manifest.source)
const bytes=fs.readFileSync(new URL(manifest.file,base)),original=fs.readFileSync(new URL(manifest.source,base))
const hash=b=>createHash('sha256').update(b).digest('hex')
assert.equal(manifest.file,'visitor-female-lam.glb')
assert.equal(bytes.length,manifest.bytes);assert.equal(hash(bytes),manifest.sha256)
assert.equal(hash(original),manifest.sourceSha256);assert.equal(manifest.sourceSha256,lineage.sha256)
assert.equal(lineage.license,'CC0 1.0');assert.ok(lineage.licenseEvidence&&lineage.source)
assert.equal(manifest.profile,'female-lam-v1');assert.ok(manifest.build&&manifest.changes)

// Preserve material names/extras for outfit classification, but do not decode images in Node.
function geometryOnly(b){
  const length=b.readUInt32LE(12),json=JSON.parse(b.toString('utf8',20,20+length)),binary=b.subarray(28+length)
  assert.ok(json.images?.length,'The derivative retains embedded source textures')
  for(const image of json.images){const v=json.bufferViews[image.bufferView];assert.ok(v&&v.byteLength>0&&(v.byteOffset||0)+v.byteLength<=binary.length)}
  delete json.images;delete json.textures
  json.materials=json.materials.map(({name,extras})=>({name,extras}))
  const text=Buffer.from(JSON.stringify(json)),padding=(4-text.length%4)%4,header=Buffer.alloc(20),binHeader=Buffer.alloc(8)
  header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+text.length+padding+binary.length,8)
  header.writeUInt32LE(text.length+padding,12);header.writeUInt32LE(0x4e4f534a,16)
  binHeader.writeUInt32LE(binary.length);binHeader.writeUInt32LE(0x004e4942,4)
  const packed=Buffer.concat([header,text,Buffer.alloc(padding,32),binHeader,binary])
  return packed.buffer.slice(packed.byteOffset,packed.byteOffset+packed.length)
}
const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
const exported=await loader.parseAsync(geometryOnly(bytes),''),upstream=await loader.parseAsync(geometryOnly(original),'')
const source=exported.scene;source.animations=exported.animations
assert.equal(source.userData.templeCharacterProfile,'female-lam-v1')
// GLTFLoader sanitizes node names; production restores this name before rig creation.
const outfit=source.getObjectByName('Ao_lam_garment');assert.ok(outfit?.isGroup,'Material primitives import as a garment group')
outfit.name='Ao lam garment'
const pieces=[];outfit.traverse(o=>{if(o.isSkinnedMesh)pieces.push(o)})
assert.ok(pieces.length>=4,'Jacket/trousers/shoes/trim survive as separately classified primitives')
assert.ok(pieces.every(o=>o.material.userData.visitorClothing))
const walk=source.animations.find(a=>/walk/i.test(a.name)),sourceWalk=upstream.animations.find(a=>a.name===walk?.name)
assert.ok(walk&&sourceWalk,'Reviewed source Walk is preserved')
assert.equal(walk.tracks.length,sourceWalk.tracks.length)
for(let i=0;i<walk.tracks.length;i++){
  assert.equal(walk.tracks[i].name,sourceWalk.tracks[i].name)
  assert.deepEqual(walk.tracks[i].times,sourceWalk.tracks[i].times)
  assert.deepEqual(walk.tracks[i].values,sourceWalk.tracks[i].values)
}

const renderedIds=mesh=>[...new Set(mesh.geometry.index?mesh.geometry.index.array:Array.from({length:mesh.geometry.attributes.position.count},(_,i)=>i))]
source.updateMatrixWorld(true)
// Quantized glTF can bake its position decode into inverse bind matrices. Compare
// rendered positions to the authoring reference, not compressed raw POSITION.
prepareTempleVisitorClothing(upstream.scene,{female:true});upstream.scene.updateMatrixWorld(true)
const reference=upstream.scene.getObjectByName('Ao lam garment'),referencePoints=new Map(),cell=.001
const point=new THREE.Vector3(),key=p=>[Math.floor(p.x/cell),Math.floor(p.y/cell),Math.floor(p.z/cell)]
for(const group of reference.geometry.groups){
  const kind=reference.material[group.materialIndex].userData.visitorClothing
  if(!referencePoints.has(kind))referencePoints.set(kind,new Map())
  const grid=referencePoints.get(kind),ids=new Set(reference.geometry.index.array.slice(group.start,group.start+group.count))
  for(const id of ids){reference.getVertexPosition(id,point).applyMatrix4(reference.matrixWorld);const k=key(point).join(':');if(!grid.has(k))grid.set(k,[]);grid.get(k).push(point.clone())}
}
function referenceDistance(p,kind){
  const grid=referencePoints.get(kind),[x,y,z]=key(p);let distance=Infinity
  assert.ok(grid,'Every exported garment material has an authoring reference')
  for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)for(const v of grid.get([x+dx,y+dy,z+dz].join(':'))||[])distance=Math.min(distance,p.distanceTo(v))
  return distance
}
for(const mesh of pieces){
  const geometry=mesh.geometry,joints=geometry.attributes.skinIndex,weights=geometry.attributes.skinWeight
  assert.equal(joints.count,geometry.attributes.position.count)
  for(const a of [...Object.values(geometry.attributes),...Object.values(geometry.morphAttributes).flat()])assert.ok([...a.array].every(Number.isFinite),'Exported attributes and morph deltas are finite')
  assert.equal(geometry.morphAttributes.position.length,5);assert.equal(geometry.morphAttributes.normal.length,5)
  for(const id of renderedIds(mesh)){
    let sum=0
    for(let k=0;k<4;k++){const weight=weights.getComponent(id,k),joint=joints.getComponent(id,k);assert.ok(weight>=0&&weight<=1);assert.ok(Number.isInteger(joint)&&joint>=0&&joint<mesh.skeleton.bones.length);sum+=weight}
    assert.ok(Math.abs(sum-1)<1e-5,'Exported skin weights remain normalized')
    point.copy(mesh.getVertexPosition(id,point)).applyMatrix4(mesh.matrixWorld)
    const distance=referenceDistance(point,mesh.material.userData.visitorClothing)
    assert.ok(distance<.001,'Exported world bind matches authored surface within 1mm: '+mesh.name+' vertex '+id+' delta '+distance)
  }
}

// Negative control: an off-surface bind translation must fail the same nearest-reference test.
const referenceKind=reference.material[reference.geometry.groups[0].materialIndex].userData.visitorClothing
const referenceVertices=[...referencePoints.get(referenceKind).values()].flat()
const rightmost=referenceVertices.reduce((a,b)=>a.x>b.x?a:b).clone();rightmost.x+=.01
assert.ok(referenceDistance(rightmost,referenceKind)>.001,'A 1cm incorrect export bind cannot pass the surface tolerance')
const prematureGeometryDisposals=new Set()
source.traverse(o=>{if(o.geometry)o.geometry.addEventListener('dispose',()=>prematureGeometryDisposals.add(o.geometry))})
const parent=new THREE.Group(),rig=createDetailedVisitor(source,parent),peer=createDetailedVisitor(source,new THREE.Group())
const children=actor=>{const result=[];actor.model.getObjectByName('Ao lam garment').traverse(o=>{if(o.isSkinnedMesh)result.push(o)});return result}
const clothing=children(rig),peerClothing=children(peer)
assert.notEqual(rig.bones.get('Hips'),peer.bones.get('Hips'))
for(let i=0;i<clothing.length;i++){
  assert.equal(clothing[i].geometry,peerClothing[i].geometry,'Clones share immutable exported geometry')
  assert.notEqual(clothing[i].morphTargetInfluences,peerClothing[i].morphTargetInfluences)
  assert.notEqual(clothing[i].skeleton.bones[0],peerClothing[i].skeleton.bones[0])
}
const meshes=[];rig.model.traverse(o=>{if(o.isSkinnedMesh)meshes.push({mesh:o,ids:renderedIds(o)})})
function checkFrame(frame,label,{floor=-.005,maxHeight=2.1,maxWidth=2.3,maxDepth=2.5}={}){
  rig.update(frame);rig.root.updateMatrixWorld(true)
  let lowest='';const bounds=new THREE.Box3().makeEmpty()
  for(const {mesh,ids}of meshes)for(const id of ids){mesh.getVertexPosition(id,point).applyMatrix4(mesh.matrixWorld);assert.ok(point.toArray().every(Number.isFinite),label+' has finite posed vertices');if(point.y<bounds.min.y)lowest=mesh.name+' vertex '+id;bounds.expandByPoint(point)}
  const size=bounds.getSize(new THREE.Vector3())
  assert.ok(bounds.min.y>=floor,label+' penetrates floor: '+bounds.min.y+' ('+lowest+')')
  assert.ok(bounds.max.y<maxHeight&&size.x<maxWidth&&size.z<maxDepth,label+' pose escapes its anatomical envelope: '+JSON.stringify({min:bounds.min.toArray(),max:bounds.max.toArray()}))
  return bounds
}
checkFrame({pose:'standing',time:0,reduced:true},'Standing')
const peerBefore=peerClothing.map(o=>o.morphTargetInfluences.slice())
checkFrame({pose:'meditating',time:1,reduced:true},'Meditating')
for(const piece of clothing)assert.ok(piece.morphTargetInfluences[piece.morphTargetDictionary.seatedDrape]>.9,'Every GLTF material primitive receives the seated drape update')
assert.deepEqual(peerClothing.map(o=>o.morphTargetInfluences),peerBefore,'One visitor cannot change another visitor cloth state')
const frozen=()=>({bones:[...rig.bones.values()].map(b=>[...b.position.toArray(),...b.quaternion.toArray()]),cloth:clothing.map(o=>o.morphTargetInfluences.slice())})
const first=frozen();checkFrame({pose:'meditating',time:1000,reduced:true},'Reduced meditation');assert.deepEqual(frozen(),first)
for(let i=0;i<=40;i++)checkFrame({pose:'bowing',progress:i/40,time:i*.3,dt:.1},'Bow frame '+i)
for(let i=0;i<80;i++)checkFrame({pose:'standing',moving:true,time:i*.016,dt:.016},'Walk frame '+i,{floor:-.06,maxWidth:1.3,maxDepth:1.4})
assert.ok(clothing.every(o=>Math.abs(o.morphTargetInfluences[o.morphTargetDictionary.stride])>1e-4),'Walk updates stride across all grouped primitives')
checkFrame({pose:'standing',moving:true,reduced:true,time:10},'Reduced walk')
const staticWalk=frozen();checkFrame({pose:'standing',moving:true,reduced:true,time:100},'Reduced walk later');assert.deepEqual(frozen(),staticWalk)
rig.dispose();peer.update({pose:'standing',reduced:true});peer.dispose()
assert.equal(parent.children.length,0,'Disposal removes the avatar')
assert.equal(prematureGeometryDisposals.size,0,'Visitor disposal cannot free source geometry still shared by another clone')
const resources=new Set();for(const root of [source,upstream.scene])root.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m)})
resources.forEach(o=>o.dispose())
console.log('Female lam GLB: source/hash/Walk lineage, world bind, grouped morphs, skin weights, independent clones, floor/pose/Walk envelopes and reduced motion pass.')
