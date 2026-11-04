import assert from 'node:assert/strict'
import fs from 'node:fs'
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {createDetailedVisitor} from '../src/components/templeDetailedVisitors.js'
import {createTempleThumbPose} from '../src/components/templeThumbPose.js'
import {createTempleHumanoidHands} from '../src/components/templeHumanoidHands.js'
const bytes=fs.readFileSync(new URL('../public/dichua/models/visitor-female-human.glb',import.meta.url)),n=bytes.readUInt32LE(12),j=JSON.parse(bytes.toString('utf8',20,20+n)),bin=bytes.subarray(n+28)
delete j.images;delete j.textures
for(const m of j.materials){delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;delete m.pbrMetallicRoughness?.baseColorTexture;delete m.pbrMetallicRoughness?.metallicRoughnessTexture}
const jb=Buffer.from(JSON.stringify(j)),pad=(4-jb.length%4)%4,h=Buffer.alloc(20),bh=Buffer.alloc(8);h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(28+jb.length+pad+bin.length,8);h.writeUInt32LE(jb.length+pad,12);h.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4)
const data=Buffer.concat([h,jb,Buffer.alloc(pad,32),bh,bin]),gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.length),'');gltf.scene.animations=gltf.animations
const V=()=>new THREE.Vector3(),snap=rig=>new Map([...new Set(rig.bones.values())].map(b=>[b,{p:b.position.clone(),q:b.quaternion.clone(),world:b.getWorldPosition(V())}]))
function skinTips(rig){
  rig.root.parent.updateMatrixWorld(true);const points={l:[],r:[]}
  rig.model.traverse(mesh=>{
    if(!mesh.isSkinnedMesh||mesh.material.userData.templePart!=='skin')return
    const weights=mesh.geometry.attributes.skinWeight,indices=mesh.geometry.attributes.skinIndex
    for(const id of new Set(mesh.geometry.index.array))for(const suffix of ['l','r']){
      let weight=0;for(let k=0;k<4;k++)if(mesh.skeleton.bones[indices.getComponent(id,k)].name==='thumb_03_'+suffix)weight+=weights.getComponent(id,k)
      if(weight>=.95)points[suffix].push(rig.root.worldToLocal(mesh.getVertexPosition(id,V()).applyMatrix4(mesh.matrixWorld)))
    }
  });return points
}
function distance(tips){let min=Infinity;for(const a of tips.l)for(const b of tips.r)min=Math.min(min,a.distanceTo(b));return min}
const sourceState=[];gltf.scene.traverse(b=>{if(b.isBone)sourceState.push([...b.position.toArray(),...b.quaternion.toArray()])})
for(const yaw of [0,.83]){
  const parent=new THREE.Group();parent.position.set(2,3,-4);parent.rotation.y=yaw
  const rig=createDetailedVisitor(gltf.scene,parent),helper=createTempleThumbPose(rig.bones,rig.root,rig.model)
  assert.equal(helper.count,2,'Both thumbs calibrate from actual rendered source skin in the rest pose')
  const flatten=createTempleHumanoidHands(rig.bones,rig.root),fingerRest=new Map([...new Set(rig.bones.values())].filter(b=>/^(index|middle|ring|pinky|thumb)_0[123]_[lr]$/.test(b.name)).map(b=>[b,b.quaternion.clone()]))
  rig.update({pose:'meditating',reduced:true});parent.updateMatrixWorld(true)
  const integrated=snap(rig),integratedGap=distance(skinTips(rig))
  assert.ok(integratedGap<.008,'The integrated controller already joins the actual rendered thumb tips')
  // Reconstruct the pre-thumb palm-plane pose using the independent hand helper.
  // Restore every digit first, so its flex does not compound on an existing pose.
  for(const [bone,q]of fingerRest)bone.quaternion.copy(q)
  flatten.apply({pose:'meditating'})
  // Re-evaluating imported Float32 rotations shifts an unchanged wrist by ~0.6nm;
  // allow 10nm for this baseline reconstruction only. Solver endpoint checks stay at 1e-10.
  for(const [bone,state]of integrated)if(!bone.name.startsWith('thumb_')){
    assert.ok(bone.quaternion.clone().normalize().angleTo(state.q.clone().normalize())<1e-6,'Re-flattening cannot add forearm twist or alter other fingers')
    assert.ok(bone.getWorldPosition(V()).distanceTo(state.world)<1e-8,'The isolated baseline endpoint '+bone.name+' delta='+bone.getWorldPosition(V()).distanceTo(state.world))
  }
  const before=snap(rig),gapBefore=distance(skinTips(rig))
  assert.ok(helper.apply({pose:'meditating'}),'Current authored lap pose admits a bounded thumb solution')
  const after=snap(rig),tips=skinTips(rig),gap=distance(tips)
  assert.ok(Math.abs(gap-integratedGap)<1e-6,'Standalone and integrated thumb solving agree on rendered proximity')
  assert.ok(gap<.008&&gap<gapBefore*.5,'Actual thumb skin surfaces become close enough for a gentle joining gesture: '+gap)
  const highWrist=Math.max(...['l','r'].map(s=>rig.root.worldToLocal(rig.bones.get('hand_'+s).getWorldPosition(V())).y)),headY=rig.root.worldToLocal(rig.bones.get('head').getWorldPosition(V())).y
  for(const side of ['l','r']){
    const nearest=tips[side].reduce((best,p)=>Math.abs(p.x)<Math.abs(best.x)?p:best,tips[side][0])
    assert.ok(nearest.y>highWrist-.015&&nearest.y<highWrist+.05,'Joining thumb skin stays near the stacked palms')
    assert.ok(nearest.y<headY-.15,'The gesture remains below the face')
  }
  for(const [bone,state]of before){
    assert.ok([...bone.position.toArray(),...bone.quaternion.toArray()].every(Number.isFinite))
    assert.ok(bone.position.distanceTo(state.p)<1e-12,'No joint translations are authored')
    if(/^thumb_0[12]_[lr]$/.test(bone.name))assert.ok(bone.quaternion.clone().normalize().angleTo(state.q.clone().normalize())<=Math.PI/3+1e-6,'Thumb joint delta stays capped at 60 degrees')
    else{assert.deepEqual(bone.quaternion.toArray(),state.q.toArray(),'Wrist and non-thumb local rotations remain untouched');if(!bone.name.startsWith('thumb_'))assert.ok(bone.getWorldPosition(V()).distanceTo(state.world)<1e-10,'Wrist and other finger endpoints cannot move')}
  }
  for(let frame=0;frame<30;frame++){
    assert.ok(helper.apply({pose:'meditating'}))
    for(const [bone,state]of after)assert.ok(bone.quaternion.clone().normalize().angleTo(state.q.clone().normalize())<1e-6,'Repeated solving cannot accumulate thumb rotation')
  }
  for(const pose of ['standing','bowing']){const state=snap(rig);assert.equal(helper.apply({pose}),false);for(const [bone,value]of state)assert.deepEqual(bone.quaternion.toArray(),value.q.toArray(),'Other rituals are not changed')}
  rig.update({pose:'meditating',reduced:true});rig.bones.get('hand_r').position.x+=10;parent.updateMatrixWorld(true);const impossible=snap(rig)
  assert.equal(helper.apply({pose:'meditating'}),false,'Unreachable targets are rejected')
  for(const [bone,state]of impossible)assert.deepEqual(bone.quaternion.toArray(),state.q.toArray(),'Failed solve atomically restores both thumbs')
  rig.dispose()
}
const empty=new THREE.Group();assert.equal(createTempleThumbPose(new Map(),empty,empty).count,0,'Legacy or missing anatomy is not guessed')
const pristine=[];gltf.scene.traverse(b=>{if(b.isBone)pristine.push([...b.position.toArray(),...b.quaternion.toArray()])});assert.deepEqual(pristine,sourceState,'Independent actor solving leaves the shared source skeleton pristine')
console.log('Thumb pose: actual source skin calibration, gentle rendered-tip proximity, 60 degree caps, parent transforms, fixed wrists/non-thumb joints, stable repeats, ritual opt-in and atomic rollback pass. Surface proximity is not a triangle-intersection proof.')
