import * as THREE from 'three'
import {addTempleClothMorphs,smoothClothNormals} from './templeClothDeformation.js'

// A separate, fully skinned lay-practitioner outfit, not a recolored fitted base shirt.
export function prepareTempleVisitorClothing(root) {
  root.updateMatrixWorld(true,true)
  const body=[];root.traverse(o=>{if(o.isSkinnedMesh)body.push(o)})
  if(!body.length)throw Error('Visitor has no skinned body')
  const bounds=new THREE.Box3().setFromObject(root),height=bounds.max.y-bounds.min.y,center=bounds.getCenter(new THREE.Vector3())
  const skeleton=body[0].skeleton,bones=skeleton.bones,ids=new Map(bones.map((b,i)=>[b.name,i])),pos=name=>bones[ids.get(name)].getWorldPosition(new THREE.Vector3())
  const shirt=new THREE.MeshStandardMaterial({color:0x899b9e,roughness:1}),pants=new THREE.MeshStandardMaterial({color:0x829599,roughness:1}),shoe=new THREE.MeshStandardMaterial({color:0x383b37,roughness:.95}),edge=new THREE.MeshStandardMaterial({color:0x71878c,roughness:1})
  // Fine cotton weave; deterministic and local, with no external image dependency.
  const weaveData=new Uint8Array(128*128)
  for(let y=0;y<128;y++)for(let x=0;x<128;x++)weaveData[y*128+x]=128+Math.round(Math.sin(x*Math.PI/2)*22+Math.sin(y*Math.PI/2)*18)
  const weave=new THREE.DataTexture(weaveData,128,128,THREE.RedFormat);weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.magFilter=THREE.LinearFilter;weave.minFilter=THREE.LinearMipmapLinearFilter;weave.generateMipmaps=true;weave.needsUpdate=true
  shirt.bumpMap=pants.bumpMap=edge.bumpMap=weave;shirt.bumpScale=pants.bumpScale=edge.bumpScale=.001*height
  shirt.userData.visitorClothing='ao-lam';pants.userData.visitorClothing='trousers';shoe.userData.visitorClothing='shoes'
  // Retain the original detailed young face, hair, neck and hands. All base sportswear is hidden.
  for(const mesh of body){
    const g=mesh.geometry,index=g.index,keep=[]
    for(let i=0;i<(index?index.count:g.attributes.position.count);i+=3){
      const tri=[0,1,2].map(k=>index?index.getX(i+k):i+k);let head=0,neck=0,hands=0
      for(const id of tri)for(let k=0;k<4;k++){
        const name=mesh.skeleton.bones[g.attributes.skinIndex.getComponent(id,k)].name,w=g.attributes.skinWeight.getComponent(id,k)/3
        if(/head/i.test(name))head+=w;else if(name==='neck')neck+=w;else if(/Hand$/.test(name))hands+=w
      }
      if(head>.35||neck>.75||hands>.5)keep.push(...tri)
    }
    g.setIndex(keep);g.clearGroups();g.addGroup(0,keep.length,0);g.computeBoundingBox();g.computeBoundingSphere()
  }
  const positions=[],uvs=[],joints=[],weights=[],indices=[],groups=[],clothVertices=[],seams=[]
  const v=(x,y,z)=>new THREE.Vector3(center.x+x*height,bounds.min.y+y*height,center.z+z*height)
  const weight=(name)=>[[ids.get(name),1]]
  const spine=['Hips','Spine02','Spine01','Spine'].map(name=>({id:ids.get(name),y:pos(name).y})).sort((a,b)=>a.y-b.y)
  function torsoWeight(p){
    if(p.y<=spine[0].y)return [[spine[0].id,1]]
    for(let i=1;i<spine.length;i++)if(p.y<=spine[i].y){const t=(p.y-spine[i-1].y)/(spine[i].y-spine[i-1].y);return [[spine[i-1].id,1-t],[spine[i].id,t]]}
    return [[spine.at(-1).id,1]]
  }
  function vertex(p,w,u=0,t=0,cloth=null){const id=positions.length/3;positions.push(p.x,p.y,p.z);uvs.push(u,t);clothVertices.push(cloth);for(let k=0;k<4;k++){joints.push(w[k]?.[0]||0);weights.push(w[k]?.[1]||0)}return id}
  function part(material,build){const start=indices.length;build();groups.push({start,count:indices.length-start,materialIndex:material})}
  function rings(ringPoints,weightAt,segments=48,kind='torso',centers=null,sideVents=false){
    const rows=[]
    for(let row=0;row<ringPoints.length;row++){
      const ring=[],split=new Map(),y=(ringPoints[row](0).y-bounds.min.y)/height
      const gap=sideVents?.045*(1-THREE.MathUtils.smoothstep(y,.49,.55)):0
      const add=(j,angle)=>{
        const p=ringPoints[row](angle),w=weightAt(p,row,angle),origin=centers?.[row]||new THREE.Vector3(center.x,p.y,center.z)
        return vertex(p,w,j/segments,row/(ringPoints.length-1),{kind,t:row/(ringPoints.length-1),angle,y:(p.y-bounds.min.y)/height,radial:p.clone().sub(origin).normalize()})
      }
      for(let j=0;j<=segments;j++){
        const angle=j/segments*Math.PI*2,isSide=sideVents&&(j===segments/4||j===segments*3/4)
        ring.push(add(j,angle-(isSide?gap:0)))
        if(isSide){const other=add(j,angle+gap);split.set(j,other);if(gap===0)seams.push([ring[j],other])}
      }
      seams.push([ring[0],ring[segments]]);rows.push({ring,split})
    }
    for(let r=0;r<rows.length-1;r++)for(let j=0;j<segments;j++){
      const top=rows[r],bottom=rows[r+1],a=top.split.get(j)??top.ring[j],b=bottom.split.get(j)??bottom.ring[j],c=top.ring[j+1],d=bottom.ring[j+1]
      indices.push(a,b,c,c,b,d)
    }
  }
  // A loose lay-practitioner jacket ending just below the hips, not a continuous robe tube.
  const profile=[[.83,.047,.044],[.811,.048,.046],[.785,.104,.068],[.758,.126,.078],[.70,.126,.082],[.63,.122,.083],[.57,.128,.086],[.53,.135,.089],[.49,.137,.089]]
  function radiiAt(y){
    for(let i=0;i<profile.length-1;i++){
      const a=profile[i],b=profile[i+1]
      if(y>=b[0]){const t=THREE.MathUtils.clamp((a[0]-y)/(a[0]-b[0]),0,1);return [THREE.MathUtils.lerp(a[1],b[1],t),THREE.MathUtils.lerp(a[2],b[2],t)]}
    }
    return profile.at(-1).slice(1)
  }
  function drapedPoint(y,angle){
    const [rx,rz]=radiiAt(y),hanging=1-THREE.MathUtils.smoothstep(y,.73,.80),hem=1-THREE.MathUtils.smoothstep(y,.49,.55),front=Math.max(0,Math.cos(angle))
    const distance=a=>Math.atan2(Math.sin(angle-a),Math.cos(angle-a))
    // A few broad folds fall from the underarms and hips; they are not evenly spaced flutes.
    let ridge=0
    for(const [a,width,depth]of [[.68,.14,-.0038],[-.76,.18,-.0048],[2.35,.20,-.003],[-2.45,.16,-.0035]]){
      const d=distance(a+.08*Math.sin(y*7+a));ridge+=depth*Math.exp(-Math.pow(d/width,2))
    }
    ridge*=hanging
    const shoulderCrease=-.0035*Math.exp(-Math.pow((y-(.738-.033*Math.abs(Math.sin(angle))+.006*Math.sin(angle)))/.010,2))*front
    const waistCrease=.0015*Math.sin((y-.57)*65+angle)*Math.exp(-Math.pow((y-.59)/.042,2))*front
    const ripple=ridge+shoulderCrease+waistCrease,drape=hem*.002*(Math.sin(angle*3)+.35*Math.sin(angle*7+.4))
    return v(Math.sin(angle)*(rx+ripple),y+drape,Math.cos(angle)*(rz+ripple))
  }
  part(0,()=>{
    const rows=[]
    for(let i=0;i<profile.length-1;i++)for(let k=0;k<3;k++){
      const y=THREE.MathUtils.lerp(profile[i][0],profile[i+1][0],k/3)
      rows.push(angle=>drapedPoint(y,angle))
    }
    rows.push(angle=>drapedPoint(profile.at(-1)[0],angle))
    rings(rows,p=>{
      const base=torsoWeight(p),x=(p.x-center.x)/height,y=(p.y-bounds.min.y)/height
      const sleeveBlend=THREE.MathUtils.smoothstep(Math.abs(x),.075,.14)*THREE.MathUtils.smoothstep(y,.70,.77)*.65
      return [...base.map(([id,w])=>[id,w*(1-sleeveBlend)]),[ids.get((x>=0?'Left':'Right')+'Arm'),sleeveBlend]]
    },64,'torso',null,true)
  })
  function tube(points,radii,weightAt,kind='sleeve'){
    const rows=points.map((p,i)=>{
      const direction=points[Math.min(i+1,points.length-1)].clone().sub(points[Math.max(0,i-1)]).normalize(),axis=new THREE.Vector3(0,0,1)
      axis.addScaledVector(direction,-axis.dot(direction)).normalize();const cross=new THREE.Vector3().crossVectors(axis,direction).normalize()
      return angle=>{
        const t=i/(points.length-1),joint=Math.exp(-Math.pow((t-.5)/.17,2)),cuff=Math.exp(-Math.pow((t-.9)/.10,2))
        const fold=kind==='sleeve'?.065*joint*Math.sin(t*38+angle*2)+.025*cuff*Math.sin(t*52-angle):.025*Math.sin(angle*5+.2)*Math.sin(t*Math.PI)+.040*joint*Math.sin(t*35-angle*2)+.045*cuff*Math.sin(t*48+angle)
        const radius=radii[i]*(1+fold),o=p.clone().addScaledVector(axis,Math.cos(angle)*radius).addScaledVector(cross,Math.sin(angle)*radius)
        if(kind==='sleeve')o.y-=height*.004*Math.sin(t*Math.PI)
        return o
      }
    });rings(rows,weightAt,40,kind,points)
  }
  for(const prefix of ['Left','Right']){
    const shoulder=pos(prefix+'Arm'),elbow=pos(prefix+'ForeArm'),hand=pos(prefix+'Hand')
    // Full-length wide sleeves, with a separate cuff; follow upper arm and forearm skinning.
    const armPoints=[],armRadii=[],armWeights=[]
    for(let i=0;i<=24;i++){
      const t=i/24,p=t<.5?shoulder.clone().lerp(elbow,t*2):elbow.clone().lerp(hand,(t-.5)*2*.88)
      armPoints.push(p);armRadii.push(height*THREE.MathUtils.lerp(.052,.034,t));const blend=THREE.MathUtils.smoothstep(t,.36,.65);armWeights.push([[ids.get(prefix+'Arm'),1-blend],[ids.get(prefix+'ForeArm'),blend]])
    }
    part(0,()=>tube(armPoints,armRadii,(_p,row)=>armWeights[row]))
    part(3,()=>tube([armPoints.at(-2),armPoints.at(-1)],[armRadii.at(-2)+.001,armRadii.at(-1)+.001],()=>weight(prefix+'ForeArm'),'cuff'))
    const hip=pos(prefix+'UpLeg'),knee=pos(prefix+'Leg'),ankle=pos(prefix+'Foot'),legPoints=[],legRadii=[],legWeights=[]
    for(let i=0;i<=32;i++){
      const t=i/32,p=t<.5?hip.clone().add(new THREE.Vector3(0,height*.045,0)).lerp(knee,t*2):knee.clone().lerp(ankle,(t-.5)*2)
      legPoints.push(p);legRadii.push(height*THREE.MathUtils.lerp(.063,.043,t));const blend=THREE.MathUtils.smoothstep(t,.36,.65);legWeights.push([[ids.get(prefix+'UpLeg'),1-blend],[ids.get(prefix+'Leg'),blend]])
    }
    part(1,()=>tube(legPoints,legRadii,(_p,row)=>legWeights[row],'pants'))
    // Discreet closed slippers, without sports logos or white sneaker soles.
    part(2,()=>{
      const geo=new THREE.SphereGeometry(1,24,12),p=geo.attributes.position,start=positions.length/3
      const centerShoe=ankle.clone();centerShoe.y=bounds.min.y+height*.032;centerShoe.z+=height*.048
      for(let i=0;i<p.count;i++)vertex(new THREE.Vector3(p.getX(i)*height*.049,p.getY(i)*height*.027,p.getZ(i)*height*.086).add(centerShoe),weight(prefix+'Foot'))
      for(const id of geo.index.array)indices.push(start+id);geo.dispose()
    })
  }
  // Nẹp and cloth-covered buttons share the torso surface, weights and morphs, not a floating rail.
  function frontPoint(y,x,offset=0){
    const angle=Math.asin(x/radiiAt(y)[0]),p=drapedPoint(y,angle),radial=new THREE.Vector3(Math.sin(angle),0,Math.cos(angle))
    p.addScaledVector(radial,height*offset)
    return {p,cloth:{kind:'torso',t:0,angle,y:(p.y-bounds.min.y)/height,radial}}
  }
  part(3,()=>{
    const rows=[];for(let i=0;i<=32;i++)rows.push(THREE.MathUtils.lerp(.810,.491,i/32))
    const start=positions.length/3
    for(const y of rows)for(const x of [-.0045,.0045]){const {p,cloth}=frontPoint(y,x,.0008);vertex(p,torsoWeight(p),0,0,cloth)}
    for(let i=0;i<rows.length-1;i++){const a=start+i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3)}
    for(let i=0;i<5;i++){
      const button=frontPoint(.777-i*.058,0,.0012),g=new THREE.SphereGeometry(height*.0025,10,6),a=g.attributes.position,start=positions.length/3
      for(let k=0;k<a.count;k++){const p=new THREE.Vector3().fromBufferAttribute(a,k).add(button.p);vertex(p,torsoWeight(p),0,0,button.cloth)}for(const id of g.index.array)indices.push(start+id);g.dispose()
    }
  })
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(joints,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));geometry.setIndex(indices);for(const g of groups)geometry.addGroup(g.start,g.count,g.materialIndex);smoothClothNormals(geometry,seams);addTempleClothMorphs(geometry,clothVertices,seams,height)
  const outfit=new THREE.SkinnedMesh(geometry,[shirt,pants,shoe,edge]);outfit.name='Ao lam garment';root.add(outfit)
  // Garment is authored in the current rest pose, independently of the source mesh's bind space.
  const outfitSkeleton=new THREE.Skeleton(bones,bones.map(b=>b.matrixWorld.clone().invert()));outfit.bind(outfitSkeleton,new THREE.Matrix4());outfit.castShadow=true;outfit.receiveShadow=true
  root.userData.templeOutfit=true
}
