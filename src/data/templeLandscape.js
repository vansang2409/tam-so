// Small resting places beside the pond; footprints are shared with navigation.
const bench=(id,z)=>Object.freeze({id,kind:'bench',x:-17.8,z,groundY:.07,halfX:.275,halfZ:.85,seatTop:.52})
const planter=(id,z,x=-17.8)=>Object.freeze({id,kind:'planter',x,z,groundY:.07,halfX:.36,halfZ:.36,radius:.36,soilTop:.335})
export const LANDSCAPE_PROPS=Object.freeze([
  bench('pond-bench-south',7.2),bench('pond-bench-north',11.5),
  planter('pond-planter-south',5.5),planter('pond-planter-north',13.2,-17.1),
])
export const LANDSCAPE_OBSTACLES=Object.freeze(LANDSCAPE_PROPS.map(p=>Object.freeze([p.x-p.halfX,p.x+p.halfX,p.z-p.halfZ,p.z+p.halfZ])))
