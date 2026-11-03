import * as THREE from 'three'
import {groundHeight} from '../data/templeWorld.js'

// Pick the navigation surface, including platforms and cushion slopes, rather than
// assuming that every point in the selected area has its centre's floor height.
export function pickTempleGround(ray,target=new THREE.Vector3()) {
  if(ray.direction.y>=-1e-6)return null
  const start=Math.max(0,(.34-ray.origin.y)/ray.direction.y),end=(.07-ray.origin.y)/ray.direction.y
  if(end<start||end>500)return null
  const clearance=t=>{
    const x=ray.origin.x+ray.direction.x*t,z=ray.origin.z+ray.direction.z*t
    return ray.origin.y+ray.direction.y*t-groundHeight(x,z)
  }
  // The search spans only the 27cm vertical band containing walkable surfaces.
  // At normal viewing angles this is a handful of samples; horizon rays are bounded.
  const samples=Math.min(256,Math.max(1,Math.ceil((end-start)*Math.hypot(ray.direction.x,ray.direction.z)/.04)))
  let previous=start
  if(clearance(start)<=0)return ray.at(start,target)
  for(let i=1;i<=samples;i++){
    const next=THREE.MathUtils.lerp(start,end,i/samples)
    if(clearance(next)<=1e-8){
      let low=previous,high=next
      for(let n=0;n<16;n++){const middle=(low+high)/2;if(clearance(middle)>0)low=middle;else high=middle}
      return ray.at(high,target)
    }
    previous=next
  }
  return null
}
