import * as THREE from 'three'

const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z)
function frame(direction,normal){
  const y=direction.clone().normalize(),z=normal.clone().addScaledVector(y,-normal.dot(y)).normalize()
  if(y.lengthSq()<.5||z.lengthSq()<.5)return null
  const x=V().crossVectors(y,z).normalize();z.crossVectors(x,y).normalize()
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z))
}

// GameEngine hands have actual finger joints. Derive palm axes from anatomy rather
// than assuming a particular importer's local bone X/Y/Z convention.
export function createTempleHumanoidHands(bones,holder){
  holder.updateWorldMatrix(true,true)
  const hands=[]
  for(const [side,suffix]of [[1,'l'],[-1,'r']]){
    const hand=bones.get('hand_'+suffix),index=bones.get('index_01_'+suffix),pinky=bones.get('pinky_01_'+suffix),middle=bones.get('middle_01_'+suffix),tip=bones.get('middle_02_'+suffix)
    if(!hand||!index||!pinky||!middle||!tip)continue
    // A proximal finger can be flexed relative to the palm. Use the wrist-to-knuckle
    // metacarpal axis so prayer aligns palm surfaces instead of just finger segments.
    const world=o=>o.getWorldPosition(V()),finger=world(middle).sub(world(hand)).normalize(),across=world(index).sub(world(pinky)).normalize()
    if(world(tip).distanceToSquared(world(middle))<1e-10)continue
    const palm=V().crossVectors(across,finger).multiplyScalar(-side).normalize(),inverse=hand.getWorldQuaternion(new THREE.Quaternion()).invert()
    const localFrame=frame(finger.applyQuaternion(inverse),palm.applyQuaternion(inverse))
    if(!localFrame)continue
    const fingers=[]
    for(const name of ['index','middle','ring','pinky','thumb'])for(let joint=1;joint<=3;joint++){
      const bone=bones.get(name+'_0'+joint+'_'+suffix)
      if(bone){
        const child=bone.children.find(object=>object.isBone),direction=child?world(child).sub(world(bone)):world(bone).sub(world(bone.parent))
        const localDirection=direction.normalize().applyQuaternion(bone.getWorldQuaternion(new THREE.Quaternion()).invert())
        fingers.push({bone,name,joint,localDirection})
      }
    }
    hands.push({hand,side,localFrame,fingers})
  }
  const parentQ=new THREE.Quaternion(),worldQ=new THREE.Quaternion(),delta=new THREE.Quaternion()
  return {get count(){return hands.length},apply({pose='standing',amount=0,moving=false}={}){
    for(const {hand,side,localFrame,fingers}of hands){
      let basis
      if(!moving){
        const direction=pose==='meditating'?V(-side,0,.14):pose==='bowing'?V(0,1-amount,amount):V(0,-1,.06)
        const normal=pose==='meditating'?V(0,1,0):pose==='bowing'?V(-side*(1-amount),-amount,0):V(-side,0,.16)
        basis=frame(direction.transformDirection(holder.matrixWorld),normal.transformDirection(holder.matrixWorld))
        if(basis){
          worldQ.copy(basis).multiply(localFrame.clone().invert())
          // Palm-up/down rotation comes mainly from the forearm, not a corkscrew
          // wrist. Twisting around the elbow-to-wrist axis keeps the IK endpoint fixed.
          const forearm=hand.parent
          if(forearm.isBone&&forearm.parent){
            const axis=hand.getWorldPosition(V()).sub(forearm.getWorldPosition(V())).normalize()
            const current=hand.getWorldQuaternion(new THREE.Quaternion()),relative=worldQ.clone().multiply(current.invert()).normalize()
            const signed=2*Math.atan2(relative.x*axis.x+relative.y*axis.y+relative.z*axis.z,relative.w),angle=Math.atan2(Math.sin(signed),Math.cos(signed))
            const twist=new THREE.Quaternion().setFromAxisAngle(axis,THREE.MathUtils.clamp(angle,-Math.PI/2,Math.PI/2)*.7)
            const forearmWorld=forearm.getWorldQuaternion(new THREE.Quaternion()).premultiply(twist)
            forearm.parent.getWorldQuaternion(parentQ).invert();forearm.quaternion.copy(parentQ.multiply(forearmWorld));forearm.updateWorldMatrix(false,true)
          }
          hand.parent.getWorldQuaternion(parentQ).invert();hand.quaternion.copy(parentQ.multiply(worldQ));hand.updateWorldMatrix(false,true)
        }
      }
      if(!basis)basis=hand.getWorldQuaternion(new THREE.Quaternion()).multiply(localFrame)
      const axis=V(1,0,0).applyQuaternion(basis)
      for(const {bone,name,joint,localDirection}of fingers){
        if((pose==='bowing'||pose==='meditating')&&((name!=='thumb'&&joint===1)||name==='thumb')){
            const from=localDirection.clone().applyQuaternion(bone.getWorldQuaternion(new THREE.Quaternion())).normalize(),normal=V(0,0,1).applyQuaternion(basis)
            const to=name==='thumb'?from.clone().addScaledVector(normal,-from.dot(normal)).normalize():V(0,1,0).applyQuaternion(basis)
            if(from.lengthSq()>.5){
              const parentWorld=bone.parent.getWorldQuaternion(new THREE.Quaternion())
              delta.setFromUnitVectors(from,to);delta.premultiply(parentWorld.clone().invert()).multiply(parentWorld)
              bone.quaternion.premultiply(delta);bone.updateWorldMatrix(false,true)
            }
        }
        const relaxed=pose==='standing'||moving,base=pose==='bowing'?0:pose==='meditating'?.02:name==='thumb'?.035:relaxed?({index:.14,middle:.19,ring:.25,pinky:.31}[name]):0
        const flex=base*(joint===2?1.25:joint===3?.65:1)
        bone.parent.getWorldQuaternion(parentQ).invert()
        const localAxis=axis.clone().applyQuaternion(parentQ).normalize()
        delta.setFromAxisAngle(localAxis,flex);bone.quaternion.premultiply(delta);bone.updateWorldMatrix(false,true)
      }
    }
  }}
}
