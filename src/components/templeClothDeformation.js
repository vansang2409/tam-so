import * as THREE from 'three'

const names=['elbowFold','kneeFold','seatedDrape','stride','breathing']
const bell=(x,center,width)=>Math.exp(-Math.pow((x-center)/width,2))

// Rest-pose crease shapes are shared; each cloned visitor has independent morph weights.
export function addTempleClothMorphs(geometry,vertices,seams,height) {
  const base=geometry.attributes.position,normal=geometry.attributes.normal
  geometry.morphTargetsRelative=true
  geometry.morphAttributes.position=[];geometry.morphAttributes.normal=[]
  for(const name of names){
    const delta=new Float32Array(base.count*3)
    for(let i=0;i<vertices.length;i++){
      const m=vertices[i];if(!m)continue
      let radial=0,dx=0,dy=0,dz=0
      if(name==='elbowFold'&&m.kind==='sleeve')radial=height*.006*bell(m.t,.5,.19)*Math.sin(m.t*38+m.angle*2)
      if(name==='kneeFold'&&m.kind==='pants')radial=height*.007*bell(m.t,.52,.16)*Math.sin(m.t*43-m.angle*2)
      if(m.kind==='torso'){
        const hem=1-THREE.MathUtils.smoothstep(m.y,.49,.64),front=Math.max(0,Math.cos(m.angle))
        if(name==='seatedDrape'){dx=height*.012*hem*Math.sin(m.angle);dy=-height*.014*hem*(.65+.35*front);dz=height*.023*hem*front}
        if(name==='stride'){dx=height*.008*hem;dz=height*.005*hem*Math.sin(m.angle*3);radial=height*.002*hem*Math.sin(m.angle*5)}
        if(name==='breathing')radial=height*.0012*bell(m.y,.71,.065)*(.35+.65*front)
      }
      delta[i*3]=dx+m.radial.x*radial;delta[i*3+1]=dy+m.radial.y*radial;delta[i*3+2]=dz+m.radial.z*radial
    }
    const attribute=new THREE.Float32BufferAttribute(delta,3);attribute.name=name;geometry.morphAttributes.position.push(attribute)
    // Relative normal targets keep broad fabric creases shaded correctly throughout interpolation.
    const target=geometry.clone(),positions=new Float32Array(base.array.length)
    for(let i=0;i<positions.length;i++)positions[i]=base.array[i]+delta[i]
    target.morphAttributes={};target.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));smoothClothNormals(target,seams)
    const normalDelta=new Float32Array(normal.array.length)
    for(let i=0;i<normalDelta.length;i++)normalDelta[i]=target.attributes.normal.array[i]-normal.array[i]
    const normalAttribute=new THREE.Float32BufferAttribute(normalDelta,3);normalAttribute.name=name;geometry.morphAttributes.normal.push(normalAttribute);target.dispose()
  }
  geometry.userData.clothSeams=seams
}

export function smoothClothNormals(geometry,seams) {
  geometry.computeVertexNormals();const n=geometry.attributes.normal,v=new THREE.Vector3(),other=new THREE.Vector3()
  for(const [a,b]of seams){v.fromBufferAttribute(n,a).add(other.fromBufferAttribute(n,b)).normalize();n.setXYZ(a,v.x,v.y,v.z);n.setXYZ(b,v.x,v.y,v.z)}
}

export function updateTempleCloth(garment,{pose,moving,time=0,phase=0,amount=0,dt=.016,reduced=false}) {
  if(!garment?.morphTargetDictionary)return
  const seated=pose==='meditating',bowing=pose==='bowing'
  const targets={
    elbowFold:seated?.85:bowing?.65+amount*.25:moving?.24+.15*Math.abs(Math.sin(phase)):.12,
    kneeFold:seated?1:bowing?.85:moving?.35+.18*Math.abs(Math.sin(phase)):.12,
    seatedDrape:seated?1:bowing?.35+amount*.45:0,
    stride:moving&&!reduced?Math.sin(phase)*.45:0,
    breathing:!reduced&&!bowing?.5+.5*Math.sin(time*1.35):0,
  }
  const blend=reduced?1:1-Math.exp(-Math.max(0,dt)*10)
  for(const [name,value]of Object.entries(targets)){
    const index=garment.morphTargetDictionary[name]
    if(index!==undefined)garment.morphTargetInfluences[index]=THREE.MathUtils.lerp(garment.morphTargetInfluences[index],value,blend)
  }
}
