import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {createHash} from 'node:crypto'
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js'
import {createDetailedVisitor} from '../src/components/templeDetailedVisitors.js'
const override=process.argv[2],file=override?path.resolve(override):new URL('../public/dichua/models/visitor-female-human.glb',import.meta.url)
const bytes=fs.readFileSync(file),report=JSON.parse(fs.readFileSync(override?path.resolve(override).replace(/\.glb$/i,'.json'):new URL('../public/dichua/models/visitor-female-human.json',import.meta.url),'utf8'))
const hash=b=>createHash('sha256').update(b).digest('hex')
assert.equal(bytes.length,report.bytes);assert.equal(hash(bytes),report.sha256);assert.equal(report.profile,'female-human-v1');assert.equal(report.rig,'mpfb-gameengine')
if(!override){
  assert.equal(report.file,'visitor-female-human.glb')
  assert.equal(hash(fs.readFileSync(new URL('../assets-src/temple/female-human-source.glb',import.meta.url))),report.sourceSha256)
  const provenance=JSON.parse(fs.readFileSync(new URL('../assets-src/temple/provenance.json',import.meta.url),'utf8'))
  assert.equal(provenance.sourceSha256,report.sourceSha256,'Source changes must update the rights/provenance manifest together with the build report')
}
assert.equal(bytes.toString('utf8',0,4),'glTF');assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length)
const n=bytes.readUInt32LE(12),json=JSON.parse(bytes.toString('utf8',20,20+n)),binary=bytes.subarray(n+28)
assert.ok(json.extensionsRequired.includes('EXT_meshopt_compression'),'Final payload actually uses meshopt')
assert.ok(json.extensionsUsed.includes('EXT_texture_webp'),'Final textures actually use WebP')
assert.ok(json.images.length>0)
// Structural payload validation only: Node has no pixel decoder. Actual WebP
// decode and texture appearance require browser QA; never substitute fake bitmaps.
for(const image of json.images){
  assert.equal(image.uri,undefined,'Runtime textures are embedded')
  const view=json.bufferViews[image.bufferView];assert.ok(view&&view.byteLength>12&&(view.byteOffset||0)+view.byteLength<=binary.length)
  const data=binary.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength)
  assert.equal(image.mimeType,'image/webp');assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');assert.equal(data.readUInt32LE(4)+8,data.length)
  let offset=12,frame=false
  while(offset<data.length){assert.ok(offset+8<=data.length);const kind=data.toString('ascii',offset,offset+4),length=data.readUInt32LE(offset+4);assert.ok(length>0&&offset+8+length<=data.length);if(kind==='VP8 '||kind==='VP8L')frame=true;offset+=8+length+(length%2)}
  assert.equal(offset,data.length);assert.ok(frame,'WebP has a complete compressed image frame')
}
for(const texture of json.textures)assert.ok(json.images[texture.extensions?.EXT_texture_webp?.source],'Every texture extension points to an embedded image')
const parts=new Set(json.materials.map(m=>m.extras?.templePart));for(const part of ['shirt','pants','skin','eyes','hair','eyelashes','shoes'])assert.ok(parts.has(part),'Semantic material remains available: '+part)
assert.ok(json.skins.every(s=>s.joints.length===53),'All primitives retain the full53joint rig')
function geometryOnly(){
  const j=structuredClone(json);delete j.images;delete j.textures
  for(const m of j.materials){delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;if(m.pbrMetallicRoughness){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture}}
  const text=Buffer.from(JSON.stringify(j)),pad=(4-text.length%4)%4,h=Buffer.alloc(20),bh=Buffer.alloc(8);h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(28+text.length+pad+binary.length,8);h.writeUInt32LE(text.length+pad,12);h.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(binary.length);bh.writeUInt32LE(0x004e4942,4)
  const data=Buffer.concat([h,text,Buffer.alloc(pad,32),bh,binary]);return data.buffer.slice(data.byteOffset,data.byteOffset+data.length)
}
const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(geometryOnly(),''),source=gltf.scene;source.animations=gltf.animations
assert.equal(source.userData.templeRig,'mpfb-gameengine');assert.equal(source.userData.templeCharacterProfile,'female-human-v1');assert.ok(source.userData.templeHeight>=1.4&&source.userData.templeHeight<=2);assert.ok(source.userData.templeWalkSpeed>0)
for(const name of ['Walk','Idle']){const clip=gltf.animations.find(c=>c.name===name);assert.ok(clip?.duration>0&&clip.tracks.length>20,'Actual authored clip remains usable: '+name);for(const track of clip.tracks)assert.ok([...track.times,...track.values].every(Number.isFinite))}
const skinned=[],blink=[];source.traverse(o=>{if(o.isSkinnedMesh)skinned.push(o);if(o.morphTargetDictionary?.eyeBlinkLeft!==undefined&&o.morphTargetDictionary?.eyeBlinkRight!==undefined)blink.push(o)})
assert.ok(skinned.length>=8);assert.equal(blink.length,2,'Body and lashes both retain semantic eyelid shapes')
for(const mesh of skinned){
  assert.equal(mesh.skeleton.bones.length,53);for(const name of ['pelvis','head','hand_l','hand_r','middle_03_l','middle_03_r','ball_l','ball_r'])assert.ok(mesh.skeleton.bones.some(b=>b.name===name))
  for(const attr of [...Object.values(mesh.geometry.attributes),...Object.values(mesh.geometry.morphAttributes).flat()])assert.ok([...attr.array].every(Number.isFinite),'Decoded attributes remain finite')
  const w=mesh.geometry.attributes.skinWeight,j=mesh.geometry.attributes.skinIndex
  for(let i=0;i<w.count;i++){let sum=0;for(let k=0;k<4;k++){const value=w.getComponent(i,k),joint=j.getComponent(i,k);assert.ok(value>=0&&value<=1);assert.ok(Number.isInteger(joint)&&joint>=0&&joint<53);sum+=value}assert.ok(Math.abs(sum-1)<1e-5,'Decoded skin weights normalize')}
}
source.updateMatrixWorld(true)
for(const mesh of blink)for(const name of ['eyeBlinkLeft','eyeBlinkRight']){
  const index=mesh.morphTargetDictionary[name],ids=[...new Set(mesh.geometry.index?.array||Array.from({length:mesh.geometry.attributes.position.count},(_,i)=>i))],a=new THREE.Vector3(),b=new THREE.Vector3();let displacement=0
  for(const id of ids){mesh.morphTargetInfluences[index]=0;mesh.getVertexPosition(id,a).applyMatrix4(mesh.matrixWorld);mesh.morphTargetInfluences[index]=1;mesh.getVertexPosition(id,b).applyMatrix4(mesh.matrixWorld);displacement=Math.max(displacement,a.distanceTo(b))}
  mesh.morphTargetInfluences[index]=0
  assert.ok(displacement>.001&&displacement<.08,'Blink channel actually moves the rendered eyelid/lash by a plausible distance: '+name+'/'+displacement)
}
const pristine=blink.map(m=>m.morphTargetInfluences.slice()),parent=new THREE.Group(),rig=createDetailedVisitor(source,parent),peer=createDetailedVisitor(source,new THREE.Group()),point=new THREE.Vector3(),meshes=[]
rig.model.traverse(mesh=>{if(mesh.isSkinnedMesh)meshes.push({mesh,ids:[...new Set(mesh.geometry.index?.array||Array.from({length:mesh.geometry.attributes.position.count},(_,i)=>i))]})})
assert.notEqual(rig.bones.get('Hips'),peer.bones.get('Hips'))
const sourceSnapshot=()=>[...new Set(peer.bones.values())].map(b=>[...b.position.toArray(),...b.quaternion.toArray()]),peerRest=sourceSnapshot()
function bounds(){rig.root.updateMatrixWorld(true);const box=new THREE.Box3();let support=Infinity;for(const {mesh,ids}of meshes)for(const id of ids){mesh.getVertexPosition(id,point).applyMatrix4(mesh.matrixWorld);assert.ok(point.toArray().every(Number.isFinite),'Actual posed rendered vertices remain finite');box.expandByPoint(point);if(['pants','shoes'].includes(mesh.material.userData.templePart))support=Math.min(support,point.y)}return {box,support}}
for(const pose of ['standing','meditating','bowing']){
  const frames=pose==='bowing'?25:1
  for(let frame=0;frame<frames;frame++){
    rig.update({pose,progress:frame/(frames-1||1),time:frame/10,dt:.1,reduced:pose!=='bowing'});const {box,support}=bounds()
    assert.ok(box.min.y>=-.006,pose+' cannot sink through the floor: '+box.min.y)
    assert.ok(Math.abs(support-.003)<.002,pose+' pants/shoes meet the actual parent floor: '+support)
    assert.ok(box.getSize(point).x<1.5&&box.getSize(point).z<1.6&&box.max.y<1.8,'Posed skin remains within human-scale bounds')
  }
}
for(const moving of [false,true,false])for(let frame=0;frame<40;frame++){
  rig.update({moving,time:frame*.05,dt:.05,speed:.97});const {box,support}=bounds();assert.ok(box.min.y>=-.006,'Idle/Walk skin cannot go below floor');assert.ok(Math.abs(support-.003)<.002,'Animated support remains in contact with the floor')
}
rig.update({pose:'meditating',reduced:true});const closed=[];rig.model.traverse(m=>{if(m.morphTargetDictionary?.eyeBlinkLeft!==undefined){closed.push(m);for(const name of ['eyeBlinkLeft','eyeBlinkRight'])assert.equal(m.morphTargetInfluences[m.morphTargetDictionary[name]],1)}});assert.equal(closed.length,2)
assert.deepEqual(blink.map(m=>m.morphTargetInfluences),pristine,'Runtime eyelids never alter the shared source')
assert.deepEqual(sourceSnapshot(),peerRest,'Posing/animation never changes an independent clone')
for(const m of closed){const other=peer.model.getObjectByName(m.name);assert.notEqual(m.morphTargetInfluences,other.morphTargetInfluences);assert.equal(m.geometry,other.geometry,'Immutable geometry is shared')}
// A cached ritual is local to the actor, and survives actual parent motion without
// freezing world coordinates or re-opening the eyes when reduced-motion changes.
const localState=r=>({rootY:r.root.position.y,bones:[...new Set(r.bones.values())].map(b=>[...b.position.toArray(),...b.quaternion.toArray()]),eyes:(()=>{const values=[];r.model.traverse(m=>{if(m.morphTargetDictionary?.eyeBlinkLeft!==undefined)values.push(...m.morphTargetInfluences)});return values})()})
const cached=localState(rig)
for(let frame=0;frame<60;frame++){rig.update({pose:'meditating',time:frame*7,dt:.1,reduced:frame%2===0});assert.deepEqual(localState(rig),cached,'Static meditation has no local drift across clocks/reduced switches')}
parent.position.set(7,2,-3);parent.rotation.y=.91;rig.root.rotation.y=-.37
rig.update({pose:'meditating',time:500,reduced:false});parent.updateMatrixWorld(true)
assert.deepEqual(localState(rig),cached,'Cached IK follows parent position/yaw through the scene transform')
let transformedSupport=Infinity
for(const {mesh,ids}of meshes)if(['pants','shoes'].includes(mesh.material.userData.templePart))for(const id of ids){mesh.getVertexPosition(id,point).applyMatrix4(mesh.matrixWorld);parent.worldToLocal(point);transformedSupport=Math.min(transformedSupport,point.y)}
assert.ok(Math.abs(transformedSupport-.003)<.002,'Parent movement does not detach cached support from its local floor')
for(const state of [{pose:'standing',reduced:true},{pose:'standing',dt:.1},{pose:'bowing',progress:1/6,dt:.1}]){
  rig.update(state);assert.notDeepEqual(localState(rig).bones,cached.bones,'Leaving meditation invalidates the cached IK')
  rig.update({pose:'meditating',reduced:true});const restored=localState(rig)
  for(let i=0;i<cached.bones.length;i++){
    assert.ok(new THREE.Vector3().fromArray(restored.bones[i]).distanceTo(new THREE.Vector3().fromArray(cached.bones[i]))<1e-7,'Re-entered meditation restores actor-local joint positions')
    assert.ok(new THREE.Quaternion().fromArray(restored.bones[i],3).normalize().angleTo(new THREE.Quaternion().fromArray(cached.bones[i],3).normalize())<1e-6,'Re-entered meditation restores the same physical joint orientation')
  }
  assert.deepEqual(restored.eyes,cached.eyes)
}
// Phase seeding must produce distinct real clip poses, while retaining correct
// support across those phases. Source clips and source skeleton stay pristine.
const sourceBones=[];source.traverse(b=>{if(b.isBone)sourceBones.push([...b.position.toArray(),...b.quaternion.toArray()])})
const actors=Array.from({length:8},()=>createDetailedVisitor(source,new THREE.Group())),idleSamples=[],walkSamples=[]
for(const actor of actors){
  actor.update({dt:0,time:0});idleSamples.push([...new Set(actor.bones.values())].flatMap(b=>b.quaternion.toArray()))
  for(let frame=0;frame<25;frame++)actor.update({moving:true,dt:.05,time:frame*.05,speed:1.35})
  walkSamples.push([...new Set(actor.bones.values())].flatMap(b=>b.quaternion.toArray()))
  actor.root.updateMatrixWorld(true);let support=Infinity
  actor.model.traverse(mesh=>{if(!mesh.isSkinnedMesh||!['pants','shoes'].includes(mesh.material.userData.templePart))return;for(const id of new Set(mesh.geometry.index.array)){mesh.getVertexPosition(id,point).applyMatrix4(mesh.matrixWorld);assert.ok(point.toArray().every(Number.isFinite));support=Math.min(support,point.y)}})
  assert.ok(Math.abs(support-.003)<.002,'Randomly phased real walkers retain support contact')
}
for(const samples of [idleSamples,walkSamples])assert.ok(samples.some(sample=>sample.some((v,i)=>Math.abs(v-samples[0][i])>1e-4)),'Authored actors cannot all share an identical Idle/Walk phase')
for(const actor of actors)actor.dispose()
const unchanged=[];source.traverse(b=>{if(b.isBone)unchanged.push([...b.position.toArray(),...b.quaternion.toArray()])});assert.deepEqual(unchanged,sourceBones)
// Independent Three.js mixer oracle at this actor's declared UUID phase. It
// samples untouched clips; no controller damping calculation is copied here.
const calmActor=createDetailedVisitor(source,new THREE.Group()),reference=source.clone(true),oracleMixer=new THREE.AnimationMixer(reference)
const idleClip=gltf.animations.find(c=>c.name==='Idle'),walkClip=gltf.animations.find(c=>c.name==='Walk'),oracleIdle=oracleMixer.clipAction(idleClip).play(),oracleWalk=oracleMixer.clipAction(walkClip).play(),seed=parseInt(calmActor.root.uuid.slice(0,8),16)/0x100000000
oracleIdle.time=seed*idleClip.duration;oracleWalk.time=seed*walkClip.duration;oracleWalk.setEffectiveWeight(0)
const headNames=['neck_01','head'],restHeads=new Map(headNames.map(name=>[name,source.getObjectByName(name).quaternion.clone().normalize()])),angle=(a,b)=>a.clone().normalize().angleTo(b.clone().normalize())
let retainedAmplitude=0,sourceAmplitude=0
function checkCalmIdle(){
  let sum=0
  for(const name of headNames){const actual=calmActor.bones.get(name).quaternion,raw=reference.getObjectByName(name).quaternion,rest=restHeads.get(name),rawAngle=angle(raw,rest),actualAngle=angle(actual,rest);sum+=rawAngle;sourceAmplitude=Math.max(sourceAmplitude,rawAngle);retainedAmplitude=Math.max(retainedAmplitude,actualAngle)
    if(rawAngle>.003)assert.ok(actualAngle>rawAngle*.4&&actualAngle<rawAngle*.85,'Quiet Idle reduces head/neck excursion while retaining real motion')
  }
  for(const name of ['spine_03','clavicle_l','pelvis'])assert.ok(angle(calmActor.bones.get(name).quaternion,reference.getObjectByName(name).quaternion)<1e-6,'Idle softening cannot alter the body posture')
  return sum
}
for(let frame=0;frame<160;frame++){calmActor.update({dt:.1,time:frame*.1});oracleMixer.update(.1);checkCalmIdle()}
assert.ok(sourceAmplitude>.03&&retainedAmplitude>.01,'The complete real Idle retains a visible nonzero head-motion amplitude')
// Seek a non-neutral sample so repeated damping would be detectable.
for(let frame=0;frame<160;frame++){calmActor.update({dt:.1});oracleMixer.update(.1);if(checkCalmIdle()>.12)break}
const fixedHeads=headNames.map(name=>calmActor.bones.get(name).quaternion.clone())
for(let frame=0;frame<100;frame++){calmActor.update({dt:0});for(let i=0;i<headNames.length;i++)assert.ok(angle(calmActor.bones.get(headNames[i]).quaternion,fixedHeads[i])<1e-6,'Cached mixer samples cannot accumulate head damping toward rest')}
let priorHeads=fixedHeads
oracleIdle.setEffectiveWeight(0);oracleWalk.setEffectiveWeight(1)
for(let frame=0;frame<40;frame++){
  calmActor.update({moving:true,dt:.05});oracleMixer.update(.05)
  const current=headNames.map(name=>calmActor.bones.get(name).quaternion.clone())
  for(let i=0;i<current.length;i++)assert.ok(angle(current[i],priorHeads[i])<.25,'Walking restores motion through a bounded head transition')
  priorHeads=current
}
for(const name of headNames)assert.ok(angle(calmActor.bones.get(name).quaternion,reference.getObjectByName(name).quaternion)<1e-5,'Settled Walk recovers the full independent mixer head sample')
calmActor.update({reduced:true})
for(const name of headNames)assert.ok(angle(calmActor.bones.get(name).quaternion,restHeads.get(name))<1e-6,'Reduced standing restores the imported neck/head rest orientation')
oracleIdle.setEffectiveWeight(1);oracleWalk.setEffectiveWeight(0);oracleMixer.update(0);calmActor.update({dt:0});checkCalmIdle()
calmActor.dispose();oracleMixer.stopAllAction();oracleMixer.uncacheRoot(reference)
// The head adjustment belongs to the authored human profile, not every rig with
// anatomical aliases. This negative control has the same real clips but no opt-in.
const otherSource=cloneSkeleton(source);otherSource.userData.templeCharacterProfile='other-anatomical-test';otherSource.animations=gltf.animations
const otherActor=createDetailedVisitor(otherSource,new THREE.Group()),otherReference=otherSource.clone(true),otherMixer=new THREE.AnimationMixer(otherReference);otherMixer.clipAction(idleClip).play()
for(let frame=0;frame<40;frame++){
  otherActor.update({dt:.1});otherMixer.update(.1)
  for(const name of headNames)assert.ok(angle(otherActor.bones.get(name).quaternion,otherReference.getObjectByName(name).quaternion)<1e-6,'Other anatomical profiles retain their original head animation')
}
otherActor.dispose();otherMixer.stopAllAction();otherMixer.uncacheRoot(otherReference)

// The garment guard is behavioral: a procedural breathing morph must continue
// updating, even when its actor uses the anatomical rig.
const garmentGeometry=new THREE.BufferGeometry();garmentGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0],3));garmentGeometry.morphAttributes.position=[new THREE.Float32BufferAttribute([0,0,0],3)];const garmentMaterial=new THREE.MeshBasicMaterial(),garment=new THREE.Mesh(garmentGeometry,garmentMaterial);garment.name='Ao lam garment';garment.morphTargetDictionary={breathing:0};garment.morphTargetInfluences=[0];source.add(garment)
const clothed=createDetailedVisitor(source,new THREE.Group());source.remove(garment)
clothed.update({pose:'meditating',time:0,dt:1});const breath=clothed.model.getObjectByName('Ao lam garment').morphTargetInfluences[0]
clothed.update({pose:'meditating',time:1,dt:1});assert.ok(Math.abs(clothed.model.getObjectByName('Ao lam garment').morphTargetInfluences[0]-breath)>.1,'Procedural garment motion is never frozen by authored meditation caching')
clothed.dispose();garmentGeometry.dispose();garmentMaterial.dispose()
rig.dispose();peer.dispose();assert.equal(parent.children.length,0)
console.log('Human avatar: actual meshopt geometry/animation decode, embedded WebP structure,53joint rig, eyelid semantics, normalized skinning, independent clones and rendered contact across rituals/Idle/Walk pass. WebP pixel decode remains browser QA.')
