import * as THREE from 'three'

// Peltate lotus blades: a closed rim and a depressed centre, with no lily cleft.
// Three small indexed variants share the scene's existing geometry/material cache.
export function createTempleLotusLeafGeometry(variant=0) {
  const kind=((Math.trunc(variant)%3)+3)%3,segments=24,rings=3
  const positions=[0,0,0],uvs=[.5,.5],colors=[.9,.94,.88],indices=[]
  const cup=[.012,.023,.032][kind],phase=kind*1.7
  for(let ring=1;ring<=rings;ring++)for(let j=0;j<segments;j++){
    const t=ring/rings,a=j*Math.PI*2/segments
    const radius=.25*t*(1+.035*Math.sin(a*3+phase)+.025*Math.cos(a*5-phase))
    const y=cup*t*t+.004*t*t*(1+Math.sin(a*4+phase))
    positions.push(Math.cos(a)*radius,y,Math.sin(a)*radius)
    uvs.push(.5+Math.cos(a)*t*.5,.5+Math.sin(a)*t*.5)
    const vein=j%2===0?.025:0,shade=.89+.08*t+vein
    colors.push(shade,Math.min(1,shade+.025),shade-.025)
  }
  const at=(ring,j)=>1+(ring-1)*segments+(j%segments)
  for(let j=0;j<segments;j++)indices.push(0,at(1,j+1),at(1,j))
  for(let ring=1;ring<rings;ring++)for(let j=0;j<segments;j++){
    const a=at(ring,j),b=at(ring,j+1),c=at(ring+1,j),d=at(ring+1,j+1)
    indices.push(a,b,c,b,d,c)
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
  geometry.setIndex(indices);geometry.computeVertexNormals()
  geometry.computeBoundingBox();geometry.computeBoundingSphere()
  return geometry
}

export function createTempleLotusBudGeometry() {
  const segments=16,rings=7,positions=[0,0,0],uvs=[.5,0],colors=[.8,.8,.8],indices=[]
  for(let ring=1;ring<=rings;ring++)for(let j=0;j<segments;j++){
    const t=ring/(rings+1),a=j*Math.PI*2/segments
    const radius=.032*Math.pow(Math.sin(Math.PI*t),.8)*(1-.18*t)*(.96+.04*Math.cos(a*5))
    positions.push(Math.cos(a)*radius,.095*t,Math.sin(a)*radius)
    uvs.push(j/segments,t)
    const shade=.78+.2*t+.02*Math.cos(a*5);colors.push(shade,shade,shade)
  }
  const top=positions.length/3;positions.push(0,.095,0);uvs.push(.5,1);colors.push(1,1,1)
  const at=(ring,j)=>1+(ring-1)*segments+(j%segments)
  for(let j=0;j<segments;j++)indices.push(0,at(1,j),at(1,j+1),top,at(rings,j+1),at(rings,j))
  for(let ring=1;ring<rings;ring++)for(let j=0;j<segments;j++){
    const a=at(ring,j),b=at(ring,j+1),c=at(ring+1,j),d=at(ring+1,j+1)
    indices.push(a,c,b,b,c,d)
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
  geometry.setIndex(indices);geometry.computeVertexNormals()
  geometry.computeBoundingBox();geometry.computeBoundingSphere()
  return geometry
}
