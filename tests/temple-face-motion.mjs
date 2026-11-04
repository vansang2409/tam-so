import assert from 'node:assert/strict'
import * as THREE from 'three'
import {createTempleFaceMotion} from '../src/components/templeFaceMotion.js'
function fixture(){
  const model=new THREE.Group(),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0],3));geometry.morphAttributes.position=Array.from({length:4},()=>new THREE.Float32BufferAttribute([0,0,0],3))
  const material=new THREE.MeshBasicMaterial(),body=new THREE.Mesh(geometry,material),lashes=new THREE.Mesh(geometry,material)
  body.name='Body';lashes.name='Lashes';body.morphTargetDictionary={smile:0,eyeBlinkLeft:1,jaw:2,eyeBlinkRight:3};lashes.morphTargetDictionary={eyeBlinkRight:0,smile:1,jaw:2,eyeBlinkLeft:3}
  body.morphTargetInfluences=[.13,0,.27,0];lashes.morphTargetInfluences=[0,.17,.29,0];model.add(body,lashes)
  return {model,geometry,material,dispose(){geometry.dispose();material.dispose()}}
}
function channels(model){return model.children.flatMap(m=>['eyeBlinkLeft','eyeBlinkRight'].map(name=>m.morphTargetInfluences[m.morphTargetDictionary[name]]))}
function assertCoherent(model,expected){for(const value of channels(model)){assert.ok(Number.isFinite(value)&&value>=0&&value<=1);assert.ok(Math.abs(value-expected)<1e-12,'Semantic body/lash channels stay coherent despite different dictionary indices')}}
const f=fixture(),pristine=f.model.children.map(m=>m.morphTargetInfluences.slice()),a=f.model.clone(true),b=f.model.clone(true),face=createTempleFaceMotion(a,.37),peer=createTempleFaceMotion(b,.71)
assert.equal(face.channelCount,4)
assert.notEqual(a.children[0].morphTargetInfluences,b.children[0].morphTargetInfluences)
for(const seed of [0,.17,.71,-.3,1.7,NaN,Infinity]){
  const motion=createTempleFaceMotion(a,seed),starts=[],ends=[];let prior=motion.apply({time:0}),inside=prior>.01,maximum=0,openSamples=0
  for(let step=1;step<=20000;step++){
    const time=step/1000,value=motion.apply({time})
    assertCoherent(a,value);assert.ok(Math.abs(value-prior)<.03,'One millisecond cannot produce an abrupt eyelid jump')
    if(value>.01&&!inside){starts.push(time);inside=true}
    if(value<=.01&&inside){ends.push(time);inside=false}
    maximum=Math.max(maximum,value);if(value===0)openSamples++;prior=value
  }
  assert.equal(maximum,1,'A natural blink fully closes the lids')
  assert.ok(openSamples>17000,'Eyes remain open for the large majority of standing time')
  assert.ok(starts.length>=3,'Standing blinks recur over a twenty-second sample')
  for(let i=1;i<starts.length;i++)assert.ok(starts[i]-starts[i-1]>=4.59&&starts[i]-starts[i-1]<=6.41,'Natural blink spacing stays between about 4.6 and 6.4 seconds')
  for(const start of starts){const end=ends.find(t=>t>start);if(end!==undefined)assert.ok(end-start>.18&&end-start<.30,'Blink closes and reopens within a brief interval')}
}
assert.deepEqual(a.children.map(m=>[m.morphTargetInfluences[m.morphTargetDictionary.smile],m.morphTargetInfluences[m.morphTargetDictionary.jaw]]),[[.13,.27],[.17,.29]],'Unrelated facial expressions remain untouched')
for(const time of [-100,0,.05,8,999,NaN,Infinity]){
  assert.equal(face.apply({time,reduced:true}),0,'Reduced standing remains open regardless of clock')
  assertCoherent(a,0)
  assert.equal(face.apply({pose:'meditating',time,reduced:true}),1,'Meditation closes eyes even when motion is reduced')
  assertCoherent(a,1)
  assert.equal(face.apply({pose:'bowing',amount:1,time,reduced:true}),1,'Full prostration closes eyes')
  assert.equal(face.apply({pose:'bowing',amount:0,time,reduced:true}),0,'Prayer at upright start has open eyes without blink')
}
let previous=0
for(let step=0;step<=100;step++){
  const weight=face.apply({pose:'bowing',amount:step/100,reduced:true})
  assert.ok(weight>=previous&&weight-previous<.026,'Ritual lid closure progresses smoothly and monotonically');previous=weight
}
for(const amount of [NaN,Infinity,-2,2])assertCoherent(a,face.apply({pose:'bowing',amount,time:NaN}))
const untouched=b.children.map(m=>m.morphTargetInfluences.slice());face.apply({pose:'meditating'});assert.deepEqual(b.children.map(m=>m.morphTargetInfluences),untouched,'One actor cannot alter another actor eyelids')
assert.deepEqual(f.model.children.map(m=>m.morphTargetInfluences),pristine,'Shared source morph weights remain pristine')
let staggered=false
for(let step=0;step<700;step++){const time=step/100;if(Math.abs(peer.apply({time})-face.apply({time}))>.5)staggered=true}
assert.ok(staggered,'Actor seeds stagger their resting blink phase')
const empty=new THREE.Group(),plain=new THREE.Object3D();plain.morphTargetDictionary={smile:0,eyeBlinkLeft:-1,eyeBlinkRight:4};plain.morphTargetInfluences=[.42];empty.add(plain)
const absent=createTempleFaceMotion(empty);assert.equal(absent.channelCount,0);absent.apply({pose:'meditating'});assert.deepEqual(plain.morphTargetInfluences,[.42],'Missing/invalid semantic blink channels are a no-op')
f.dispose()
console.log('Face motion: smooth bounded natural blink spacing, semantic body/lash coherence, ritual closure, reduced determinism, unrelated morph preservation, independent clones and missing-channel fallback pass.')
