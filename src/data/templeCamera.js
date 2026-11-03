export const DEFAULT_PERSPECTIVE='third'
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
const separation=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)
const indoorBounds=room=>room?.indoor?{minX:room.x-room.width/2+.24,maxX:room.x+room.width/2-.24,minZ:room.centerZ-room.depth/2+.28,maxZ:Math.min(room.centerZ+room.depth/2+3.2,22.1)}:null
// Camera sau lưng có khoảng lùi qua cửa mở, nhưng không xuyên vách bên/hậu hay trần.
export function thirdPersonPose(position,room,{yaw=.22,elevation=.48,distance=6.8,aspect=1,focusHeight=1.5}={}) {
  const indoor=!!room?.indoor,ceiling=indoor?room.architecture.height-.28:Infinity
  let target={x:position.x-Math.sin(yaw)*1.4+Math.cos(yaw)*.55,y:Math.min(position.y+focusHeight,ceiling-.15),z:position.z-Math.cos(yaw)*1.4-Math.sin(yaw)*.55}
  const bounds=indoorBounds(room)
  if(bounds){target.x=clamp(target.x,bounds.minX,bounds.maxX);target.z=clamp(target.z,bounds.minZ,bounds.maxZ)}
  const d=clamp(distance,2.8,10),angle=clamp(elevation,.03,.7)
  const boom=(focus,direction)=>{
    const offset={x:Math.sin(direction)*Math.cos(angle)*d,y:Math.sin(angle)*d,z:Math.cos(direction)*Math.cos(angle)*d}
    let t=1
    if(bounds){for(const [axis,min,max] of [['x',bounds.minX,bounds.maxX],['z',bounds.minZ,bounds.maxZ]]){if(offset[axis]>0)t=Math.min(t,(max-focus[axis])/offset[axis]);else if(offset[axis]<0)t=Math.min(t,(min-focus[axis])/offset[axis])}}
    t=clamp(t,0,1)
    return {x:focus.x+offset.x*t,y:clamp(focus.y+offset.y*t,.6,ceiling),z:focus.z+offset.z*t}
  }
  let camera=boom(target,yaw)
  const head={x:position.x,y:Math.min(position.y+focusHeight,ceiling-.15),z:position.z}
  if(bounds&&(separation(camera,target)<1||separation(camera,head)<.85)){
    // A framing target clamped to a wall can collapse the boom to zero. Look at the
    // actor instead and slide the camera orbit along the wall, retaining head clearance.
    target={x:clamp(head.x,bounds.minX,bounds.maxX),y:head.y,z:clamp(head.z,bounds.minZ,bounds.maxZ)}
    let best=boom(target,yaw),clearance=separation(best,target)
    for(const turn of [0,-Math.PI/4,Math.PI/4,-Math.PI/2,Math.PI/2,-Math.PI*3/4,Math.PI*3/4,Math.PI]){
      const candidate=boom(target,yaw+turn),gap=separation(candidate,target)
      if(gap>clearance){best=candidate;clearance=gap}
      if(gap>=1.5){best=candidate;break}
    }
    camera=best
  }
  return {position:camera,target,fov:aspect<.9?(indoor&&room.width<4.5?88:78):66}
}

// Endpoints alone are insufficient: a linear camera lerp can cut through the actor
// when a constrained boom switches sides. Use a bounded orbit only for that crossing.
export function thirdPersonCameraStep(current,destination,position,room,blend,{focusHeight=1.5}={}) {
  const bounds=indoorBounds(room),ceiling=bounds?room.architecture.height-.28:Infinity
  const bounded=p=>({x:bounds?clamp(p.x,bounds.minX,bounds.maxX):p.x,y:clamp(p.y,.6,ceiling),z:bounds?clamp(p.z,bounds.minZ,bounds.maxZ):p.z})
  const head={x:position.x,y:Math.min(position.y+focusHeight,ceiling-.15),z:position.z},start=bounded(current),end=bounded(destination),alpha=clamp(blend,0,1)
  const mix=(a,b,t)=>a+(b-a)*t
  const segmentGap=(a,b)=>{
    const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,length=dx*dx+dy*dy+dz*dz
    const t=length?clamp(((head.x-a.x)*dx+(head.y-a.y)*dy+(head.z-a.z)*dz)/length,0,1):0
    return separation({x:a.x+dx*t,y:a.y+dy*t,z:a.z+dz*t},head)
  }
  if(separation(start,head)<.8)return end
  if(segmentGap(start,end)>=.85)return {x:mix(start.x,end.x,alpha),y:mix(start.y,end.y,alpha),z:mix(start.z,end.z,alpha)}
  const from=Math.atan2(start.x-head.x,start.z-head.z),to=Math.atan2(end.x-head.x,end.z-head.z),turn=Math.atan2(Math.sin(to-from),Math.cos(to-from))
  const r0=Math.hypot(start.x-head.x,start.z-head.z),r1=Math.hypot(end.x-head.x,end.z-head.z)
  const arc=(t,rotation)=>{const angle=from+rotation*t,radius=mix(r0,r1,t);return bounded({x:head.x+Math.sin(angle)*radius,y:mix(start.y,end.y,t),z:head.z+Math.cos(angle)*radius})}
  for(const rotation of [turn,turn-(turn>=0?1:-1)*Math.PI*2]){
    let previous=start,safe=true
    for(let i=1;i<=16;i++){const p=arc(i/16,rotation);if(segmentGap(previous,p)<.8){safe=false;break}previous=p}
    const candidate=arc(alpha,rotation)
    if(safe&&segmentGap(start,candidate)>=.8)return candidate
  }
  return start
}
