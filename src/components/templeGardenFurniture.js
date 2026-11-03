import * as THREE from 'three'
import {LANDSCAPE_PROPS} from '../data/templeLandscape.js'

// Static, local geometry: stone seats face +X toward the pond. The scene owns
// disposal and can merge these meshes with its other static material batches.
export function createTempleGardenFurniture(parent,{box,mesh}) {
  const groups=[],records=[],stone=0xb2ae93
  const petalGeometry=new THREE.SphereGeometry(1,8,5)
  const stemGeometry=new THREE.CylinderGeometry(.006,.006,1,6)
  const potGeometry=new THREE.LatheGeometry([[.26,0],[.3,.025],[.33,.22],[.36,.27],[.36,.31],[.30,.31],[.29,.26],[.27,.08]].map(p=>new THREE.Vector2(...p)),24)
  const soilGeometry=new THREE.CylinderGeometry(.285,.27,.18,24)
  const ellipsoid=(color,x,y,z,sx,sy,sz,p)=>{const o=mesh(petalGeometry,color,x,y,z,p);o.scale.set(sx,sy,sz);return o}
  for(const prop of LANDSCAPE_PROPS){
    const root=new THREE.Group();root.name=prop.id;root.position.set(prop.x,0,prop.z);parent.add(root);groups.push(root)
    if(prop.kind==='bench'){
      const seatThickness=.10,seatBottom=prop.seatTop-seatThickness,legHeight=seatBottom-prop.groundY
      const seat=box(prop.halfX*2,seatThickness,prop.halfZ*2,stone,0,prop.seatTop-seatThickness/2,0,root,{surface:'stone'})
      const legs=[-1,1].map(side=>box(.36,legHeight,.22,stone,0,prop.groundY+legHeight/2,side*.56,root,{surface:'stone'}))
      const backSupports=[-1,1].map(side=>box(.08,.36,.12,stone,-prop.halfX+.04,prop.seatTop+.18,side*.56,root,{surface:'stone'}))
      const back=box(.08,.28,prop.halfZ*2,stone,-prop.halfX+.04,prop.seatTop+.36,0,root,{surface:'stone'})
      records.push({prop,root,seat,legs,backSupports,back})
    }else{
      const body=mesh(potGeometry,stone,0,prop.groundY,0,root,{surface:'stone'})
      const soil=mesh(soilGeometry,0x61533d,0,prop.soilTop-.09,0,root,{roughness:1})
      const stems=[],flowers=[],leaves=[]
      for(let i=0;i<5;i++){
        const angle=i*2.399963,radius=i===0?0:.145,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius
        const height=.28+(i%3)*.045,start=prop.soilTop-.004,end=prop.soilTop+height
        const stem=mesh(stemGeometry,0x647653,x,(start+end)/2,z,root);stem.scale.y=end-start;stems.push(stem)
        for(const side of [-1,1]){
          const a=angle+side*.9,leaf=ellipsoid(0x72835c,x+Math.sin(a)*.035,prop.soilTop+height*(side<0?.35:.62),z+Math.cos(a)*.035,.018,.008,.055,root)
          leaf.rotation.y=a;leaf.rotation.x=side*.23;leaves.push(leaf)
        }
        const flower=[]
        for(let j=0;j<5;j++){
          const a=j*Math.PI*2/5,o=ellipsoid(i%2?0xc7aca7:0xe2d3b8,x+Math.sin(a)*.025,end,z+Math.cos(a)*.025,.018,.008,.026,root)
          o.rotation.y=a;flower.push(o)
        }
        flower.push(ellipsoid(0xc5aa67,x,end+.004,z,.012,.012,.012,root));flowers.push(flower)
      }
      records.push({prop,root,body,soil,stems,flowers,leaves})
    }
  }
  return {groups,records}
}
