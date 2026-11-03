import assert from 'node:assert/strict'
import * as THREE from 'three'
import {createTempleDetails} from '../src/components/templeDetails.js'
import {templeBellAngle} from '../src/components/templeBell.js'
import {WORLD_SPOTS,isWalkable} from '../src/data/templeWorld.js'

const material=new THREE.MeshStandardMaterial()
const mesh=(g,c,x,y,z,p)=>{const o=new THREE.Mesh(g,material);o.position.set(x,y,z);p.add(o);return o}
const box=(w,h,d,c,x,y,z,p)=>mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,p)
const cylinder=(a,b,h,c,x,y,z,p,n=12)=>mesh(new THREE.CylinderGeometry(a,b,h,n),c,x,y,z,p)
const sphere=(r,c,x,y,z,p,sx=1,sy=1,sz=1)=>{const o=mesh(new THREE.SphereGeometry(r,14,10),c,x,y,z,p);o.scale.set(sx,sy,sz);return o}
const beam=(a,b,r,c,p)=>{const o=cylinder(r,r,a.distanceTo(b),c,...a.clone().add(b).multiplyScalar(.5).toArray(),p,8);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());return o}
const animated={bells:[]},root=new THREE.Group(),spot=WORLD_SPOTS.find(s=>s.id==='thap-chuong'),h=spot.architecture.height
createTempleDetails({mesh,box,cylinder,sphere,beam,animated,mat:()=>material,label(){},lantern(){},models:{}}).decorate(spot,root,spot.width,spot.depth,h)
const body=root.getObjectByName('Stationary temple bell'),hanger=root.getObjectByName('Bell suspension loop'),boss=root.getObjectByName('Bell striking boss'),log=root.getObjectByName('Bell wooden log')
const entry=animated.bells[0],ropes=[];root.traverse(o=>{if(o.name==='Bell striker rope')ropes.push(o)})
assert.equal(animated.bells.length,1);assert.equal(entry.axis,'x');assert.equal(entry.mesh,root.getObjectByName('Temple bell striker'))
assert.equal(ropes.length,2)
root.updateMatrixWorld(true)
const loopBounds=new THREE.Box3().setFromObject(hanger)
assert.ok(loopBounds.min.y<=body.position.y&&loopBounds.max.y>=h-.48,'Suspension loop connects body top and beam underside')
const initialBody=body.matrixWorld.clone(),logBounds=new THREE.Box3().setFromObject(log),bossBounds=new THREE.Box3().setFromObject(boss)
assert.ok(logBounds.min.z>bossBounds.max.z+.1,'Log rests clear of the bell')
assert.ok(logBounds.min.y<bossBounds.max.y&&logBounds.max.y>bossBounds.min.y,'Log can strike the raised boss height')
for(let step=0;step<=800;step++){
  const angle=templeBellAngle(step/100);assert.ok(Number.isFinite(angle)&&angle<=.1&&angle>=-.1)
  entry.mesh.rotation.x=angle;root.updateMatrixWorld(true)
  const face=new THREE.Vector3(0,-1.35,-.45).applyMatrix4(entry.mesh.matrixWorld)
  assert.ok(face.z>=.57-1e-8,'Striker face cannot pass through the strike surface')
  assert.ok(face.y>bossBounds.min.y-.1&&face.y<bossBounds.max.y+.1)
  assert.deepEqual(body.matrixWorld.elements,initialBody.elements,'Only the striker moves')
}
entry.mesh.rotation.x=templeBellAngle(0);root.updateMatrixWorld(true)
const face=new THREE.Vector3(0,-1.35,-.45).applyMatrix4(entry.mesh.matrixWorld)
assert.ok(Math.abs(face.z-bossBounds.max.z)<.002,'Actual log end reaches actual boss surface at the strike')
assert.ok(Math.abs(face.y-boss.position.y)<1e-8)
for(const rope of ropes){
  const upper=new THREE.Vector3(0,-rope.geometry.parameters.height/2,0).applyMatrix4(rope.matrixWorld)
  const lower=new THREE.Vector3(0,rope.geometry.parameters.height/2,0).applyMatrix4(rope.matrixWorld)
  assert.ok(Math.abs(upper.y-(h-.2))<.04&&upper.z>.65&&upper.z<1.7,'Rope top remains embedded in the support beam')
  const local=entry.mesh.worldToLocal(lower.clone())
  assert.ok(Math.abs(local.y+1.35)<1e-8&&Math.abs(local.z)<.45,'Rope lower end contacts the wooden log')
}
assert.equal(templeBellAngle(-1),0);assert.equal(templeBellAngle(Infinity),0);assert.equal(templeBellAngle(NaN),0)
assert.equal(templeBellAngle(.2,{reduced:true}),0);assert.equal(templeBellAngle(9),0)
assert.equal(isWalkable(spot.x,spot.centerZ),false,'Existing bell building collision remains blocked')
assert.ok(new THREE.Box3().setFromObject(root).max.y<h+.15,'No added detail pierces the roof')
const geometries=new Set();root.traverse(o=>{if(o.geometry){geometries.add(o.geometry);for(const a of Object.values(o.geometry.attributes))assert.ok([...a.array].every(Number.isFinite))}})
geometries.forEach(g=>g.dispose());material.dispose()
console.log('Temple bell: stationary shell, connected hanger, suspended striker contact/clearance, bounded recoil, reduced motion and collision checks pass.')
