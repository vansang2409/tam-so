import * as THREE from 'three'
import {bowFrame} from '../data/templeRituals.js'
export function createTempleBowRig({cylinder,sphere},parent) {
  const root=new THREE.Group();parent.add(root);root.name='temple-bow-rig'
  const upper=new THREE.Group();upper.name='bow-upper';root.add(upper)
  cylinder(.23,.32,.66,0x819b99,0,.31,0,upper,16)
  sphere(.24,0xd9b49a,0,.91,0,upper);sphere(.245,0x3f3832,0,1,-.025,upper,1,.68,1)
  cylinder(.33,.4,.3,0x819b99,0,.29,-.12,root,16)
  for(const side of [-1,1]){
    sphere(.15,0x617d7a,side*.2,.15,.18,root,1.1,1,1.5)
    sphere(.1,0x425858,side*.17,.09,-.35,root,.9,.7,1.8)
    for(const part of ['upper','lower']){const arm=cylinder(.085,.105,1,0x819b99,0,0,0,root,12);arm.name='bow-arm-'+part+'-'+side}
    const hand=sphere(.065,0xd9b49a,0,0,0,root,.6,1.5,.7);hand.name='bow-hand-'+side
  }
  const rig=bindTempleBowRig(root);rig.apply(0);return rig
}
export function bindTempleBowRig(root) {
  const upper=root.getObjectByName('bow-upper'),up=new THREE.Vector3(0,1,0)
  const arms=[-1,1].map(side=>({side,upper:root.getObjectByName('bow-arm-upper-'+side),lower:root.getObjectByName('bow-arm-lower-'+side),hand:root.getObjectByName('bow-hand-'+side)}))
  const bone=(mesh,a,b)=>{const delta=b.clone().sub(a);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.scale.y=delta.length();mesh.quaternion.setFromUnitVectors(up,delta.normalize())}
  return {root,apply(progress){
    const amount=bowFrame(progress).amount,angle=amount*Math.PI/2,hip=.52-amount*.18
    upper.position.y=hip;upper.rotation.x=angle
    for(const arm of arms){
      const side=arm.side,shoulder=new THREE.Vector3(side*.27,hip+.55*Math.cos(angle),.55*Math.sin(angle)),hand=new THREE.Vector3(side*(.04+.24*amount),.95-.87*amount,.3+.88*amount)
      const direction=hand.clone().sub(shoulder),distance=Math.min(.75,direction.length()),bend=new THREE.Vector3(side,0,0)
      direction.normalize();bend.addScaledVector(direction,-bend.dot(direction)).normalize()
      const elbow=shoulder.clone().add(hand).multiplyScalar(.5).addScaledVector(bend,Math.sqrt(Math.max(0,.38**2-(distance/2)**2)))
      bone(arm.upper,shoulder,elbow);bone(arm.lower,elbow,hand);arm.hand.position.copy(hand);arm.hand.scale.set(.6,1.5-1.1*amount,.7+.5*amount)
    }
    return amount
  }}
}
