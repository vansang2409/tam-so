import assert from 'node:assert/strict'
import * as THREE from 'three'
import {pickTempleGround} from '../src/components/templeGroundPicking.js'
import {WORLD_SPOTS,groundHeight} from '../src/data/templeWorld.js'

const rayTo=(origin,point)=>new THREE.Ray(origin.clone(),point.clone().sub(origin).normalize())
const pond=WORLD_SPOTS.find(s=>s.id==='san-ho-rua'),meditation=WORLD_SPOTS.find(s=>s.kind==='meditate')
const outdoor=new THREE.Vector3(pond.x,.07,pond.z+1)
const outdoorRay=rayTo(outdoor.clone().add(new THREE.Vector3(3,5,7)),outdoor)
assert.ok(pickTempleGround(outdoorRay).distanceTo(outdoor)<1e-5,'Selecting a pond must not shift a courtyard tap onto a .34m floor plane')
let samples=0
for(const [dx,dz]of [[0,0],[.55,0],[.58,0],[.9,0],[1,1],[1.55,1],[2,0],[2.5,0]]){
 const x=meditation.x+dx,z=meditation.centerZ+dz,point=new THREE.Vector3(x,groundHeight(x,z),z)
 // A close elevated view sees the top face/slope rather than an intervening step edge.
 const origin=point.clone().add(new THREE.Vector3(.1,5,.1)),hit=pickTempleGround(rayTo(origin,point))
 assert.ok(hit&&hit.distanceTo(point)<1e-4,'Pick follows platform, cushion slope and courtyard at '+dx+','+dz);samples++
}
for(const spot of WORLD_SPOTS){
 const point=new THREE.Vector3(spot.x,groundHeight(spot.x,spot.z),spot.z),ray=rayTo(point.clone().add(new THREE.Vector3(0,10,0)),point)
 assert.ok(pickTempleGround(ray).distanceTo(point)<1e-5,spot.id+' floor is picked at its actual height');samples++
}
assert.equal(pickTempleGround(new THREE.Ray(new THREE.Vector3(0,2,0),new THREE.Vector3(0,1,0))),null)
assert.equal(pickTempleGround(new THREE.Ray(new THREE.Vector3(0,2,0),new THREE.Vector3(1,0,0))),null)
const nearHorizon=new THREE.Ray(new THREE.Vector3(0,2,0),new THREE.Vector3(1,-.0001,0).normalize())
assert.equal(pickTempleGround(nearHorizon),null,'A near-horizon intersection beyond the camera range is rejected without an unbounded search')
const behindCushion=new THREE.Vector3(meditation.x,.16,meditation.centerZ-.8)
const obliqueOrigin=new THREE.Vector3(meditation.x,.6,meditation.centerZ+3)
const occlusion=pickTempleGround(rayTo(obliqueOrigin,behindCushion))
assert.ok(occlusion.z>meditation.centerZ&&occlusion.y>.27,'The front of a cushion intercepts an oblique ray before the platform behind it')
assert.ok(obliqueOrigin.distanceTo(occlusion)<obliqueOrigin.distanceTo(behindCushion))
console.log('Ground picking: '+samples+' platform/cushion/courtyard/room rays and sky/horizon rejection pass.')
