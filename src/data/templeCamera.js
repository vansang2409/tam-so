export const DEFAULT_PERSPECTIVE='third'
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
// Camera sau lưng có khoảng lùi qua cửa mở, nhưng không xuyên vách bên/hậu hay trần.
export function thirdPersonPose(position,room,{yaw=.22,elevation=.48,distance=6.8,aspect=1,focusHeight=1.5}={}) {
  const indoor=!!room?.indoor,ceiling=indoor?room.architecture.height-.28:Infinity
  const target={x:position.x-Math.sin(yaw)*1.4+Math.cos(yaw)*.55,y:Math.min(position.y+focusHeight,ceiling-.15),z:position.z-Math.cos(yaw)*1.4-Math.sin(yaw)*.55}
  const bounds=indoor?{minX:room.x-room.width/2+.24,maxX:room.x+room.width/2-.24,minZ:room.centerZ-room.depth/2+.28,maxZ:Math.min(room.centerZ+room.depth/2+3.2,22.1)}:null
  if(bounds){target.x=clamp(target.x,bounds.minX,bounds.maxX);target.z=clamp(target.z,bounds.minZ,bounds.maxZ)}
  const d=clamp(distance,2.8,10),angle=clamp(elevation,.03,.7),offset={x:Math.sin(yaw)*Math.cos(angle)*d,y:Math.sin(angle)*d,z:Math.cos(yaw)*Math.cos(angle)*d}
  let t=1
  if(bounds){for(const [axis,min,max] of [['x',bounds.minX,bounds.maxX],['z',bounds.minZ,bounds.maxZ]]){if(offset[axis]>0)t=Math.min(t,(max-target[axis])/offset[axis]);else if(offset[axis]<0)t=Math.min(t,(min-target[axis])/offset[axis])}}
  t=clamp(t,0,1)
  return {position:{x:target.x+offset.x*t,y:clamp(target.y+offset.y*t,.6,ceiling),z:target.z+offset.z*t},target,fov:aspect<.9?(indoor&&room.width<4.5?88:78):66}
}
