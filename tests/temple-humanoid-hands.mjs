import assert from 'node:assert/strict'
import * as THREE from 'three'
import {createTempleHumanoidHands} from '../src/components/templeHumanoidHands.js'
import {createDetailedVisitor} from '../src/components/templeDetailedVisitors.js'

const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z)
const aliases={Hips:'pelvis',Spine02:'spine_01',Spine01:'spine_02',Spine:'spine_03',neck:'neck_01',Head:'head',LeftShoulder:'clavicle_l',LeftArm:'upperarm_l',LeftForeArm:'lowerarm_l',LeftHand:'hand_l',LeftUpLeg:'thigh_l',LeftLeg:'calf_l',LeftFoot:'foot_l',LeftToeBase:'ball_l',RightShoulder:'clavicle_r',RightArm:'upperarm_r',RightForeArm:'lowerarm_r',RightHand:'hand_r',RightUpLeg:'thigh_r',RightLeg:'calf_r',RightFoot:'foot_r',RightToeBase:'ball_r'}
function fixture({height=1.65,anatomical=true,idle=false,fingerBend=0}={}){
  const source=new THREE.Group(),bones=new Map()
  function add(name,parent,position){const b=new THREE.Bone();b.name=name;b.position.copy(position);parent.add(b);bones.set(name,b);return b}
  const root=add('root',source,V()),pelvis=add('pelvis',root,V(0,.95,0)),s1=add('spine_01',pelvis,V(0,.12,.015)),s2=add('spine_02',s1,V(0,.12,.012)),s3=add('spine_03',s2,V(0,.12,-.012)),neck=add('neck_01',s3,V(0,.15,-.005))
  add('head',neck,V(0,.1,.005))
  for(const [side,suffix]of [[1,'l'],[-1,'r']]){
    const shoulder=add('clavicle_'+suffix,s3,V(side*.08,.09,0)),upper=add('upperarm_'+suffix,shoulder,V(side*.1,-.025,0)),lower=add('lowerarm_'+suffix,upper,V(side*.29,0,0)),hand=add('hand_'+suffix,lower,V(side*.25,0,0))
    // Change the imported hand's local coordinate convention while preserving the
    // anatomical rest palm. A controller assuming local Y must fail this fixture.
    const roll=new THREE.Quaternion().setFromEuler(new THREE.Euler(.31*side,-.43,.28*side)),inverse=roll.clone().invert();hand.quaternion.copy(roll)
    // In this palms-down T-pose both thumbs point +Z, so the actual palm surface
    // is -Y. This independent witness prevents copying the controller's cross-product sign.
    const palm=new THREE.Object3D();palm.name='palmWitness_'+suffix;palm.position.copy(V(0,-.01,0).applyQuaternion(inverse));hand.add(palm)
    for(const [i,name]of ['index','middle','ring','pinky','thumb'].entries()){
      const z=[.024,0,-.018,-.035,.045][i],first=add(name+'_01_'+suffix,hand,V(side*(name==='thumb'?.025:.055),0,z).applyQuaternion(inverse));first.quaternion.copy(inverse).multiply(new THREE.Quaternion().setFromAxisAngle(V(0,0,1),-side*fingerBend))
      const second=add(name+'_02_'+suffix,first,V(side*.035,0,0)),third=add(name+'_03_'+suffix,second,V(side*.025,0,0))
      const tip=new THREE.Object3D();tip.name='tipWitness';tip.position.set(side*.02,0,0);third.add(tip)
    }
    const thigh=add('thigh_'+suffix,pelvis,V(side*.09,-.02,0)),calf=add('calf_'+suffix,thigh,V(0,-.43,0)),foot=add('foot_'+suffix,calf,V(0,-.42,0));add('ball_'+suffix,foot,V(0,-.025,.12))
  }
  assert.equal(bones.size,53)
  source.updateMatrixWorld(true)
  const geometry=new THREE.BoxGeometry(.4,1.75,.2).translate(0,.875,0),weights=new Float32Array(geometry.attributes.position.count*4)
  for(let i=0;i<geometry.attributes.position.count;i++)weights[i*4]=1
  geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(new Uint16Array(weights.length),4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4))
  const mesh=new THREE.SkinnedMesh(geometry,new THREE.MeshStandardMaterial()),skeleton=new THREE.Skeleton([...bones.values()]);source.add(mesh);mesh.bind(skeleton)
  source.userData.templeHeight=height;if(anatomical)source.userData.templeRig='mpfb-gameengine'
  else for(const [alias,name]of Object.entries(aliases))bones.get(name).name=alias
  const hand=bones.get('hand_l'),turn=hand.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(V(0,0,1),.15))
  source.animations=[new THREE.AnimationClip('Walk',1,[new THREE.QuaternionKeyframeTrack(hand.name+'.quaternion',[0,.5,1],[...hand.quaternion.toArray(),...turn.toArray(),...hand.quaternion.toArray()])])]
  if(idle){
    const spine=bones.get('spine_02'),axis=V(0,0,1),rotation=angle=>new THREE.Quaternion().setFromAxisAngle(axis,angle).toArray()
    source.animations[0].tracks.push(new THREE.QuaternionKeyframeTrack(spine.name+'.quaternion',[0,.5,1],[...rotation(0),...rotation(.24),...rotation(0)]))
    source.animations.push(new THREE.AnimationClip('Idle',1,[new THREE.QuaternionKeyframeTrack(spine.name+'.quaternion',[0,.5,1],[...rotation(-.035),...rotation(.035),...rotation(-.035)])]))
    source.userData.templeWalkSpeed=1
  }
  return {source,bones,dispose(){geometry.dispose();mesh.material.dispose();skeleton.dispose()}}
}
const orientation=(bones,holder,suffix)=>{
  holder.updateWorldMatrix(true,true)
  const world=name=>bones.get(name+'_'+suffix).getWorldPosition(V()),hand=bones.get('hand_'+suffix)
  const direction=world('middle_01').sub(world('hand')).normalize(),normal=hand.getObjectByName('palmWitness_'+suffix).getWorldPosition(V()).sub(world('hand')).normalize()
  return {direction,normal}
}
const dot=(a,b)=>a.clone().normalize().dot(b.clone().normalize())
const first=fixture({fingerBend:Math.PI/9}),holder=first.source,rest=new Map([...first.bones].map(([name,b])=>[name,b.quaternion.clone()])),hands=createTempleHumanoidHands(first.bones,holder)
assert.equal(hands.count,2)
for(const suffix of ['l','r']){
  const metacarpal=first.bones.get('middle_01_'+suffix).getWorldPosition(V()).sub(first.bones.get('hand_'+suffix).getWorldPosition(V()))
  const proximal=first.bones.get('middle_02_'+suffix).getWorldPosition(V()).sub(first.bones.get('middle_01_'+suffix).getWorldPosition(V()))
  assert.ok(dot(metacarpal,proximal)<.95,'Fixture must distinguish the palm long axis from the flexed proximal finger axis')
}
for(const rotation of [0,.7,-1.2])for(const pose of ['standing','meditating','bowing'])for(const amount of pose==='bowing'?[0,.25,.5,.75,1]:[0]){
  for(const [name,b]of first.bones)b.quaternion.copy(rest.get(name))
  holder.rotation.set(.13,rotation,-.08);holder.updateMatrixWorld(true)
  const wrists=new Map(['l','r'].map(suffix=>[suffix,first.bones.get('hand_'+suffix).getWorldPosition(V())]))
  const forearms=new Map(['l','r'].map(suffix=>[suffix,first.bones.get('lowerarm_'+suffix).quaternion.clone()]))
  hands.apply({pose,amount})
  for(const [side,suffix]of [[1,'l'],[-1,'r']]){
    const palm=orientation(first.bones,holder,suffix),expectedDirection=(pose==='meditating'?V(-side,0,.14):pose==='bowing'?V(0,1-amount,amount):V(0,-1,.06)).transformDirection(holder.matrixWorld)
    const expectedNormal=(pose==='meditating'?V(0,1,0):pose==='bowing'?V(-side*(1-amount),-amount,0):V(-side,0,.16)).transformDirection(holder.matrixWorld)
    expectedNormal.addScaledVector(expectedDirection,-expectedNormal.dot(expectedDirection)).normalize()
    assert.ok(dot(palm.direction,expectedDirection)>.995,'Anatomical finger direction is correct despite arbitrary local hand axes: '+pose+'/'+suffix)
    assert.ok(dot(palm.normal,expectedNormal)>.97,'Palm faces inward/upward/down to the floor for '+pose+'/'+suffix)
    assert.ok(first.bones.get('hand_'+suffix).getWorldPosition(V()).distanceTo(wrists.get(suffix))<1e-10,'Forearm twist cannot move the solved wrist endpoint')
    assert.ok(first.bones.get('lowerarm_'+suffix).quaternion.angleTo(forearms.get(suffix))<=Math.PI*.35+1e-6,'Forearm receives only the bounded share of palm twist')
    if(pose==='bowing'||pose==='meditating'){
      for(const name of ['index','middle','ring','pinky']){
        const proximal=first.bones.get(name+'_02_'+suffix).getWorldPosition(V()).sub(first.bones.get(name+'_01_'+suffix).getWorldPosition(V())).normalize()
        assert.ok(dot(proximal,expectedDirection)>.999,'Prayer/meditation fingers align along the actual metacarpal palm, despite a 20 degree imported proximal bend')
      }
      for(let joint=1;joint<=2;joint++){
        const thumb=first.bones.get('thumb_0'+(joint+1)+'_'+suffix).getWorldPosition(V()).sub(first.bones.get('thumb_0'+joint+'_'+suffix).getWorldPosition(V())).normalize()
        assert.ok(Math.abs(thumb.dot(palm.normal))<.027,'Thumb segments remain almost flat in the ritual palm plane')
      }
    }
    if(pose==='standing')for(const name of ['index','middle','ring','pinky']){
      const base=first.bones.get(name+'_01_'+suffix).getWorldPosition(V()),tip=first.bones.get(name+'_03_'+suffix).getObjectByName('tipWitness').getWorldPosition(V())
      assert.ok(tip.sub(base).dot(palm.normal)>1e-4,'Relaxed fingers curl toward the actual palm surface, never its back')
    }
    for(const bone of first.bones.values())assert.ok(bone.quaternion.toArray().every(Number.isFinite))
  }
}
// Missing finger anatomy must leave legacy rigs untouched, not guess their axes.
const legacyBones=new Map([['LeftHand',first.bones.get('hand_l')],['RightHand',first.bones.get('hand_r')]]),legacy=createTempleHumanoidHands(legacyBones,holder),before=[...legacyBones.values()].map(b=>b.quaternion.toArray())
assert.equal(legacy.count,0);legacy.apply({pose:'bowing',amount:1});assert.deepEqual([...legacyBones.values()].map(b=>b.quaternion.toArray()),before)
first.dispose()
const degenerate=fixture()
for(const suffix of ['l','r'])degenerate.bones.get('middle_02_'+suffix).position.set(0,0,0)
degenerate.source.updateMatrixWorld(true)
const skipped=createTempleHumanoidHands(degenerate.bones,degenerate.source)
assert.equal(skipped.count,0,'Collapsed finger directions cannot create a guessed or invalid palm frame')
skipped.apply({pose:'bowing',amount:.5})
for(const bone of degenerate.bones.values())assert.ok(bone.quaternion.toArray().every(Number.isFinite))
degenerate.dispose()

const snapshot=rig=>[...new Set(rig.bones.values())].map(b=>({position:b.position.toArray(),quaternion:b.quaternion.toArray()}))
const f=fixture(),parent=new THREE.Group(),rig=createDetailedVisitor(f.source,parent),peer=createDetailedVisitor(f.source,new THREE.Group())
for(const [alias,name]of Object.entries(aliases))assert.equal(rig.bones.get(alias),rig.model.getObjectByName(name),'Canonical alias points to the cloned anatomical bone: '+alias)
assert.notEqual(rig.bones.get('pelvis'),peer.bones.get('pelvis'))
rig.root.updateMatrixWorld(true)
const hipRest=rig.bones.get('Hips').getWorldPosition(V()).y,footRest=rig.bones.get('LeftToeBase').getWorldPosition(V()).sub(rig.bones.get('LeftFoot').getWorldPosition(V())).normalize()
const spineRest=rig.bones.get('Spine01').getWorldPosition(V()).sub(rig.bones.get('Spine02').getWorldPosition(V())).normalize()
rig.update({pose:'standing',reduced:true});rig.root.updateMatrixWorld(true)
assert.ok(Math.abs(rig.bones.get('Hips').getWorldPosition(V()).y-hipRest)<1e-5,'Standing hip height remains calibrated to this source, not legacy 0.954m')
assert.ok(dot(rig.bones.get('LeftToeBase').getWorldPosition(V()).sub(rig.bones.get('LeftFoot').getWorldPosition(V())),footRest)>.9999,'Imported foot direction survives standing calibration: dot='+dot(rig.bones.get('LeftToeBase').getWorldPosition(V()).sub(rig.bones.get('LeftFoot').getWorldPosition(V())),footRest)+' rest='+footRest.toArray()+' actual='+rig.bones.get('LeftToeBase').getWorldPosition(V()).sub(rig.bones.get('LeftFoot').getWorldPosition(V())).normalize().toArray())
assert.ok(dot(rig.bones.get('Spine01').getWorldPosition(V()).sub(rig.bones.get('Spine02').getWorldPosition(V())),spineRest)>.9999,'Standing keeps the imported spine curve')
assert.equal(rig.root.position.y,0,'Anatomical standing uses the source floor without the legacy hover offset')
for(const name of ['clavicle_l','clavicle_r'])assert.ok(rig.bones.get(name).quaternion.angleTo(f.bones.get(name).quaternion)<1e-6,'Imported clavicle rest is preserved')
const untouched=snapshot(peer)
for(const pose of ['standing','meditating','bowing']){
  rig.update({pose,progress:.42,time:0,reduced:true});const stable=snapshot(rig)
  for(let i=0;i<20;i++){rig.update({pose,progress:.42,time:i*10,reduced:true});assert.deepEqual(snapshot(rig),stable,'Alias resets prevent finger flex accumulating across '+pose+' frames')}
  assert.deepEqual(snapshot(peer),untouched,'Posing one clone cannot change another clone')
}
rig.update({moving:true,dt:0});const walking=snapshot(rig)
// Mixer tracks are Float32; first sampling may normalize a quaternion by ~1e-8.
// Bound angular error over many fixed-time updates, rather than permitting drift.
for(let frame=0;frame<100;frame++){
  rig.update({moving:true,dt:0});const current=snapshot(rig)
  for(let i=0;i<walking.length;i++){
    assert.ok(new THREE.Vector3().fromArray(current[i].position).distanceTo(new THREE.Vector3().fromArray(walking[i].position))<1e-7,'A fixed-time Walk cannot drift bone positions')
    const a=new THREE.Quaternion().fromArray(current[i].quaternion).normalize(),b=new THREE.Quaternion().fromArray(walking[i].quaternion).normalize()
    assert.ok(a.angleTo(b)<1e-6,'Finger curls cannot accumulate over fixed-time Walk samples')
  }
}
for(let i=0;i<=40;i++){rig.update({pose:'bowing',progress:i/40,time:i*.1});for(const b of new Set(rig.bones.values())){assert.ok([...b.position.toArray(),...b.quaternion.toArray()].every(Number.isFinite));assert.ok(Math.abs(b.quaternion.length()-1)<1e-5)}}
rig.dispose();peer.dispose();assert.equal(parent.children.length,0);f.dispose()
for(const height of [undefined,NaN,Infinity,-1,1.39,2.01,1.4,1.65,2]){
  const f=fixture();f.source.userData.templeHeight=height
  const rig=createDetailedVisitor(f.source,new THREE.Group()),expected=Number.isFinite(height)&&height>=1.4&&height<=2?height:1.75
  assert.ok(Math.abs(new THREE.Box3().setFromObject(rig.model).getSize(V()).y-expected)<1e-5,'Only valid height metadata calibrates the model')
  rig.dispose();f.dispose()
}
// Animate a spine track the hand solver does not overwrite: this proves both
// clips actually contribute rather than merely exercising the update branch.
const blended=fixture({idle:true}),blendRig=createDetailedVisitor(blended.source,new THREE.Group()),blendPeer=createDetailedVisitor(blended.source,new THREE.Group())
const blendPeerRest=snapshot(blendPeer),spine=blendRig.bones.get('spine_02')
blendRig.update({dt:.25});assert.ok(spine.quaternion.clone().normalize().angleTo(new THREE.Quaternion())<1e-6,'Idle is sampled at its neutral midpoint')
let previous=snapshot(blendRig),walkExcursion=0
for(const moving of [true,false,true,false])for(let frame=0;frame<120;frame++){
  blendRig.update({moving,dt:1/60,speed:frame%2?100:0,time:frame/60})
  assert.equal(blendRig.root.position.y,0,'Idle and Walk share the exact anatomical floor offset')
  const current=snapshot(blendRig)
  for(let i=0;i<current.length;i++){
    const q=new THREE.Quaternion().fromArray(current[i].quaternion),prior=new THREE.Quaternion().fromArray(previous[i].quaternion)
    assert.ok([...current[i].position,...current[i].quaternion].every(Number.isFinite),'Idle/Walk transition is finite')
    assert.ok(Math.abs(q.length()-1)<1e-5,'Blended animation keeps unit quaternions')
    assert.ok(q.clone().normalize().angleTo(prior.normalize())<.08,'Clip crossfade has bounded per-frame angular change')
  }
  if(moving)walkExcursion=Math.max(walkExcursion,spine.quaternion.angleTo(new THREE.Quaternion()))
  previous=current
}
assert.ok(walkExcursion>.08,'Walk contributes a distinct authored spine pose after Idle crossfade')
assert.deepEqual(snapshot(blendPeer),blendPeerRest,'Animation mixers cannot mutate an independent clone')
for(const speed of [undefined,NaN,Infinity,-Infinity]){
  blendRig.update({moving:true,speed,dt:1/60})
  assert.ok(snapshot(blendRig).every(b=>[...b.position,...b.quaternion].every(Number.isFinite)),'Invalid optional speed cannot poison animation')
}
blendRig.update({reduced:true,time:999});blendPeer.update({reduced:true,time:0})
assert.deepEqual(snapshot(blendRig),snapshot(blendPeer),'Reduced standing has no history-dependent pose jump from clip state')
const reducedRest=snapshot(blendRig)
for(let frame=0;frame<40;frame++){blendRig.update({reduced:true,moving:frame%2===0,time:frame*10,dt:1/60});assert.deepEqual(snapshot(blendRig),reducedRest,'Reduced rest cannot drift when movement flags change')}
blendRig.update({moving:true,dt:0});const fixedBlend=snapshot(blendRig)
for(let frame=0;frame<100;frame++){
  blendRig.update({moving:true,dt:0});const sample=snapshot(blendRig)
  for(let i=0;i<sample.length;i++){
    assert.ok(new THREE.Vector3().fromArray(sample[i].position).distanceTo(new THREE.Vector3().fromArray(fixedBlend[i].position))<1e-7)
    assert.ok(new THREE.Quaternion().fromArray(sample[i].quaternion).normalize().angleTo(new THREE.Quaternion().fromArray(fixedBlend[i].quaternion).normalize())<1e-6,'Fixed-time blended clips cannot accumulate rotations bone='+[...new Set(blendRig.bones.values())][i].name+' frame='+frame+' angle='+new THREE.Quaternion().fromArray(sample[i].quaternion).normalize().angleTo(new THREE.Quaternion().fromArray(fixedBlend[i].quaternion).normalize()))
  }
}
blendRig.dispose();blendPeer.dispose();blended.dispose()
const old=fixture({anatomical:false,height:NaN}),oldRig=createDetailedVisitor(old.source,new THREE.Group())
oldRig.update({pose:'bowing',progress:0,reduced:true})
for(const suffix of ['l','r'])for(const name of ['index','middle','ring','pinky','thumb'])for(let j=1;j<=3;j++)assert.deepEqual(oldRig.model.getObjectByName(name+'_0'+j+'_'+suffix).quaternion.toArray(),old.bones.get(name+'_0'+j+'_'+suffix).quaternion.toArray(),'Unmarked legacy rigs do not receive anatomical finger animation')
oldRig.dispose();old.dispose()
console.log('Humanoid hands: 53-bone fixture, anatomical palm axes/chirality, rotated holders, alias resets, independent clones, calibrated hip/spine/feet, validated height and legacy opt-in pass.')
