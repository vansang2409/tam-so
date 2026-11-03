import assert from 'node:assert/strict'
import {DEFAULT_PERSPECTIVE,thirdPersonPose,thirdPersonCameraStep} from '../src/data/templeCamera.js'
import {WORLD_SPOTS,isWalkable,groundHeight} from '../src/data/templeWorld.js'
assert.equal(DEFAULT_PERSPECTIVE,'third')
let poses=0
for(const s of WORLD_SPOTS.filter(s=>['main','hall','house','shrine','tower'].includes(s.kind))){
  const room={...s,indoor:true},position={x:s.x,y:.34,z:s.z}
  for(const yaw of [0,Math.PI/2,Math.PI,-Math.PI/2])for(const aspect of [.43,1.78])for(const elevation of [.03,.17,.7]){
    const pose=thirdPersonPose(position,room,{yaw,aspect,elevation,distance:7}),p=pose.position
    assert.ok(Object.values(p).every(Number.isFinite),'Camera có tọa độ hữu hạn')
    assert.ok(p.x>=s.x-s.width/2+.239&&p.x<=s.x+s.width/2-.239,s.id+' không xuyên vách bên')
    assert.ok(p.z>=s.centerZ-s.depth/2+.279&&p.z<=s.centerZ+s.depth/2+3.201,s.id+' không xuyên vách sau')
    assert.ok(p.y<=s.architecture.height-.279,s.id+' không xuyên trần')
    assert.ok(p.z<=22.101,s.id+' không lùi ra sau trụ cổng/tường sân phía nam')
    assert.ok(pose.fov>=60&&pose.fov<=88);poses++
  }
  const initial=thirdPersonPose(position,room,{aspect:.46})
  assert.ok(initial.position.z-position.z>1.8,s.id+' mặc định đủ lùi để thấy nhân vật')
}
const open=thirdPersonPose({x:0,y:.07,z:24.8},null,{yaw:Math.PI/4})
assert.ok(open.position.x>0&&open.position.z>24.8)

// A reachable side aisle could clamp the framing target onto the wall, collapsing
// the camera onto its own lookAt point, or placing the lens inside the actor's head.
const hall={...WORLD_SPOTS.find(s=>s.id==='chanh-dien'),indoor:true},corner={x:7.6,y:.34,z:-8.1}
assert.ok(isWalkable(corner.x,corner.z),'The camera regression position is reachable')
const separation=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)
for(const yaw of [.22,Math.PI/12,Math.PI/3]){
 const pose=thirdPersonPose(corner,hall,{yaw,elevation:.03,aspect:.46}),head={...corner,y:corner.y+1.5}
 assert.ok(separation(pose.position,pose.target)>=1,'LookAt must not collapse at the rear-right aisle')
 assert.ok(separation(pose.position,head)>=.8,'Camera lens must keep clear of the actor head')
}
let boundaryPoses=0
for(const s of WORLD_SPOTS.filter(s=>['main','hall','house','shrine','tower'].includes(s.kind))){
 const room={...s,indoor:true}
 const samples=(center,size)=>{const values=[center,center-size/2+.4,center+size/2-.4];for(let x=center-size/2+.4;x<=center+size/2-.4;x+=.5)values.push(x);return [...new Set(values.map(x=>Math.round(x*1000)/1000))]}
 for(const x of samples(s.x,s.width))for(const z of samples(s.centerZ,s.depth)){
  if(!isWalkable(x,z))continue
  const position={x,y:groundHeight(x,z),z}
  for(let i=0;i<16;i++)for(const elevation of [.03,.7])for(const distance of [2.8,10])for(const focusHeight of [1.1,1.5]){
   const pose=thirdPersonPose(position,room,{yaw:i*Math.PI/8,elevation,distance,aspect:.46,focusHeight}),p=pose.position,head={...position,y:position.y+focusHeight}
   assert.ok(Object.values(p).every(Number.isFinite),s.id+' boundary camera remains finite')
   assert.ok(p.x>=s.x-s.width/2+.239&&p.x<=s.x+s.width/2-.239,s.id+' boundary camera stays inside side walls')
   assert.ok(p.z>=s.centerZ-s.depth/2+.279&&p.z<=s.centerZ+s.depth/2+3.201&&p.z<=22.101,s.id+' boundary camera stays inside rear/front limits')
   assert.ok(p.y<=s.architecture.height-.279,s.id+' boundary camera stays below the ceiling')
   assert.ok(separation(p,pose.target)>=1,s.id+' boundary lookAt never collapses')
   assert.ok(separation(p,head)>=.8,s.id+' boundary camera keeps actor head clearance')
   boundaryPoses++
  }
 }
}

// Match the world renderer's 16ms-frame smoothing. Safe endpoints may lie on
// opposite sides of the actor; a straight lerp previously passed 4.6cm from the head.
const blend=1-Math.exp(-.016*7)
let trajectoryFrames=0
function assertTrajectory(position,room,fromYaw,toYaw){
 let camera=thirdPersonPose(position,room,{yaw:fromYaw,elevation:.03}).position
 const pose=thirdPersonPose(position,room,{yaw:toYaw,elevation:.03}),head={...position,y:position.y+1.5}
 for(let frame=0;frame<120;frame++){
  const next=thirdPersonCameraStep(camera,pose.position,position,room,blend)
  // Include the path between rendered frames, not only endpoints of the transition.
  for(let i=0;i<=8;i++){
   const t=i/8,p={x:camera.x+(next.x-camera.x)*t,y:camera.y+(next.y-camera.y)*t,z:camera.z+(next.z-camera.z)*t}
   assert.ok(separation(p,head)>=.8-1e-8,room.id+' camera transition cannot cut through the actor head')
   assert.ok(p.x>=room.x-room.width/2+.239&&p.x<=room.x+room.width/2-.239,room.id+' camera transition stays inside side walls')
   assert.ok(p.z>=room.centerZ-room.depth/2+.279&&p.z<=room.centerZ+room.depth/2+3.201&&p.z<=22.101,room.id+' camera transition stays inside rear/front limits')
   assert.ok(p.y<=room.architecture.height-.279,room.id+' camera transition stays below the ceiling')
  }
  assert.ok(separation(next,pose.target)>.5,room.id+' camera transition cannot collapse its lookAt')
  camera=next;trajectoryFrames++
 }
 assert.ok(separation(camera,pose.position)<.01,room.id+' camera transition converges instead of freezing at a safety boundary')
}
const tower={...WORLD_SPOTS.find(s=>s.id==='lau-quan-am'),indoor:true},towerAisle={x:-10.5,y:.34,z:-1.9}
assert.ok(isWalkable(towerAisle.x,towerAisle.z))
assertTrajectory(towerAisle,tower,1.675,1.68)
// Retain the original orbit-switch reproducer even after the deeper offering table
// moves this old point inside the furniture clearance.
assertTrajectory({...towerAisle,z:-2},tower,1.675,1.68)
for(const s of WORLD_SPOTS.filter(s=>['main','hall','house','shrine','tower'].includes(s.kind))){
 const room={...s,indoor:true}
 for(const x of [s.x-s.width/2+.4,s.x+s.width/2-.4,s.x])for(const z of [s.centerZ-s.depth/2+.4,s.centerZ+s.depth/2-.4,s.centerZ]){
  if(!isWalkable(x,z))continue
  const position={x,y:groundHeight(x,z),z}
  for(let i=0;i<24;i++)assertTrajectory(position,room,i*Math.PI/12,(i+1)*Math.PI/12)
 }
}
console.log('Camera: '+poses+' góc ban đầu, '+boundaryPoses+' góc sát vách và '+trajectoryFrames+' khung chuyển góc ở 17 nội điện; không vượt vách/trần, chui vào đầu hoặc kẹt quỹ đạo.')
