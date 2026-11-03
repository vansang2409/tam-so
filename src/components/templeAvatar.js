import * as THREE from 'three'

const ROBE=0x819b99,SKIN=0xc99e83,HAIR=0x292824
// Shared geometry for the local visitor and every online pose; +Z is the face direction.
export function createVisitorAnatomy({mesh,sphere,cylinder}) {
  function cloth(points,x,y,z,parent,depth=.62) {
    const g=new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),32)
    const a=g.attributes.position
    for(let i=0;i<a.count;i++){
      const xx=a.getX(i),yy=a.getY(i),zz=a.getZ(i),angle=Math.atan2(xx,zz)
      const fold=1+.018*Math.sin(angle*13+yy*4)+.009*Math.sin(angle*23-yy*7)
      a.setXYZ(i,xx*fold,yy,zz*depth*fold)
    }
    g.computeVertexNormals();return mesh(g,ROBE,x,y,z,parent,{surface:'cloth',roughness:1})
  }
  function head(x,y,z,parent) {
    const group=new THREE.Group();group.position.set(x,y,z);parent.add(group)
    sphere(.105,SKIN,0,-.12,0,group,.7,1,.75)
    const face=sphere(.13,SKIN,0,0,0,group,.8,1.18,.9)
    // Taper the jaw instead of using a spherical toy head.
    const g=face.geometry.clone(),a=g.attributes.position
    for(let i=0;i<a.count;i++){const yy=a.getY(i);a.setX(i,a.getX(i)*(1-.2*Math.max(0,-yy/.13)))}g.computeVertexNormals();face.geometry=g
    const cap=mesh(new THREE.SphereGeometry(.133,24,16,0,Math.PI*2,0,Math.PI*.57),HAIR,0,.012,-.012,group,{roughness:1});cap.scale.set(.82,1.15,.94)
    sphere(.024,SKIN,0,-.005,.112,group,.52,1.3,1.1)
    for(const side of [-1,1]){
      sphere(.028,SKIN,side*.104,-.012,0,group,.46,1,.7)
      sphere(.012,0x39322c,side*.043,.026,.105,group,1,.35,.45)
      const brow=sphere(.019,HAIR,side*.043,.048,.102,group,1,.16,.35);brow.rotation.z=side*.08
    }
    sphere(.023,0x986955,0,-.062,.105,group,1,.16,.3)
    return group
  }
  function torso(parent,{y=.75,height=.68,width=1}={}) {
    const body=cloth([[.22,0],[.225,.025],[.19,height*.32],[.20,height*.64],[.235,height*.86],[.17,height*.97],[.09,height]],0,y,0,parent)
    body.scale.x=width
    for(const side of [-1,1]){
      const collar=cylinder(.012,.014,.19,0xb1c1ba,side*.047,y+height-.07,.105,parent,8);collar.rotation.z=side*.5
    }
    for(let i=0;i<4;i++)sphere(.008,0x627976,.025,y+height-.17-i*.085,.129,parent)
    return body
  }
  return {head,torso,cloth}
}

export function createTempleAvatar(parts,parent) {
  const {sphere,cylinder}=parts,anatomy=createVisitorAnatomy(parts)
  const standing=new THREE.Group(),seated=new THREE.Group();parent.add(standing,seated);seated.visible=false
  const body=anatomy.torso(standing),legs=[],arms=[]
  anatomy.head(0,1.58,0,standing)
  for(const side of [-1,1]){
    // Limbs rotate at hips/shoulders; feet and hands follow instead of remaining on the ground.
    const leg=new THREE.Group();leg.position.set(side*.105,.78,0);standing.add(leg);legs.push(leg)
    cylinder(.085,.065,.36,0x586d6b,0,-.18,0,leg,16)
    cylinder(.065,.055,.34,0x586d6b,0,-.51,.015,leg,16)
    sphere(.09,0x363c37,0,-.72,.06,leg,.78,.5,1.6)
    const arm=new THREE.Group();arm.position.set(side*.222,1.30,0);standing.add(arm);arms.push(arm)
    const sleeve=anatomy.cloth([[.085,0],[.075,.12],[.07,.26],[.09,.31]],0,-.30,0,arm,.9)
    sleeve.rotation.z=-side*.08
    cylinder(.06,.052,.24,ROBE,side*.018,-.405,.025,arm,16)
    sphere(.055,SKIN,side*.02,-.55,.035,arm,.65,1.12,.48)
    arm.rotation.z=side*.09
  }
  anatomy.torso(seated,{y:.28,height:.66});anatomy.head(0,1.09,0,seated)
  for(const side of [-1,1]){
    sphere(.21,ROBE,side*.20,.17,.12,seated,1.25,.55,1)
    const shin=cylinder(.085,.09,.39,0x586d6b,side*.12,.25,.25,seated,16);shin.rotation.z=side*1.1;shin.rotation.x=.5
    const sleeve=cylinder(.08,.065,.37,ROBE,side*.245,.62,.09,seated,20);sleeve.rotation.x=-.38;sleeve.rotation.z=side*.35
    const forearm=cylinder(.055,.05,.27,ROBE,side*.15,.42,.19,seated,16);forearm.rotation.z=-side*.9
    sphere(.052,SKIN,side*.065,.34,.26,seated,1,.5,1.3)
  }
  return {standing,seated,body,legs,arms,anatomy}
}
