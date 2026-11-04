import * as THREE from 'three'

const V=()=>new THREE.Vector3()
// Opt-in for authored GameEngine visitors. The distal witness is calibrated from
// rendered skin, rather than guessing a missing terminal thumb bone's length.
export function createTempleThumbPose(bones,holder,model){
  const noop={count:0,apply(){return false}}
  if(model.userData.templeRig!=='mpfb-gameengine')return noop
  holder.parent?.updateWorldMatrix(true,false);holder.updateMatrixWorld(true)
  const chains=[]
  for(const [side,suffix]of [[1,'l'],[-1,'r']]){
    const hand=bones.get('hand_'+suffix),a=bones.get('thumb_01_'+suffix),b=bones.get('thumb_02_'+suffix),c=bones.get('thumb_03_'+suffix)
    if(!hand||!a||!b||!c||b.parent!==a||c.parent!==b)return noop
    const origin=c.getWorldPosition(V()),axis=origin.clone().sub(b.getWorldPosition(V())).normalize(),samples=[]
    model.traverse(mesh=>{
      if(!mesh.isSkinnedMesh||mesh.material?.userData.templePart!=='skin')return
      const joint=mesh.skeleton.bones.indexOf(c),weights=mesh.geometry.attributes.skinWeight,indices=mesh.geometry.attributes.skinIndex
      if(joint<0||!weights||!indices)return
      const ids=new Set(mesh.geometry.index?.array||Array.from({length:weights.count},(_,i)=>i))
      for(const id of ids){
        let weight=0;for(let k=0;k<4;k++)if(indices.getComponent(id,k)===joint)weight+=weights.getComponent(id,k)
        if(weight<.95)continue
        const point=mesh.getVertexPosition(id,V()).applyMatrix4(mesh.matrixWorld),offset=point.clone().sub(origin),projection=offset.dot(axis)
        if(projection>0&&offset.length()<.06)samples.push({point,projection})
      }
    })
    if(!samples.length)return noop
    const maximum=Math.max(...samples.map(sample=>sample.projection)),patch=samples.filter(sample=>sample.projection>=maximum-.002),tip=patch.reduce((sum,sample)=>sum.add(sample.point),V()).multiplyScalar(1/patch.length)
    const localTip=c.worldToLocal(tip.clone())
    chains.push({side,hand,a,b,c,localTip})
  }
  function tip(chain){return chain.c.localToWorld(chain.localTip.clone())}
  function aim(bone,from,to){
    const delta=new THREE.Quaternion().setFromUnitVectors(from.normalize(),to.normalize()),world=bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(delta),parent=bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert()
    bone.quaternion.copy(parent.multiply(world));bone.updateWorldMatrix(false,true)
  }
  return {count:chains.length,apply({pose='standing'}={}){
    if(pose!=='meditating')return false
    holder.parent?.updateWorldMatrix(true,false);holder.updateMatrixWorld(true)
    const states=chains.map(chain=>({chain,qa:chain.a.quaternion.clone(),qb:chain.b.quaternion.clone()}))
    const measured=chains.map(chain=>{
      const a=holder.worldToLocal(chain.a.getWorldPosition(V())),b=holder.worldToLocal(chain.b.getWorldPosition(V())),end=holder.worldToLocal(tip(chain)),wrist=holder.worldToLocal(chain.hand.getWorldPosition(V()))
      return {chain,a,b,end,wrist,l1:a.distanceTo(b),l2:b.distanceTo(end)}
    })
    const proximal=measured.reduce((sum,m)=>sum+m.l1,0)/2,reach=measured.reduce((sum,m)=>sum+m.l1+m.l2,0)/2
    const centerX=(measured[0].wrist.x+measured[1].wrist.x)/2,targetY=Math.max(...measured.map(m=>m.wrist.y))+proximal*.18,targetZ=(measured[0].a.z+measured[1].a.z)/2+reach*.58
    const head=bones.get('head'),headY=head?holder.worldToLocal(head.getWorldPosition(V())).y:Infinity
    let valid=Number.isFinite(targetY+targetZ+centerX)&&proximal>1e-5&&targetY<headY-reach*1.5
    for(const {chain,a,b,end,l1,l2}of measured){
      if(!valid)break
      const target=new THREE.Vector3(centerX+chain.side*proximal*.065,targetY,targetZ),direction=target.clone().sub(a),distance=direction.length()
      if(distance<=Math.abs(l1-l2)+.0005||distance>=l1+l2-.0005){valid=false;break}
      direction.normalize()
      const hint=new THREE.Vector3(chain.side*proximal*.3,proximal*.9,proximal*.8),bend=hint.addScaledVector(direction,-hint.dot(direction)).normalize()
      if(bend.lengthSq()<.5){valid=false;break}
      const along=(l1*l1-l2*l2+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,l1*l1-along*along)),elbow=a.clone().addScaledVector(direction,along).addScaledVector(bend,height)
      const aw=holder.localToWorld(a.clone()),bw=holder.localToWorld(b.clone()),ew=holder.localToWorld(elbow),tw=holder.localToWorld(target)
      aim(chain.a,bw.sub(aw),ew.sub(aw))
      const joint=chain.b.getWorldPosition(V());aim(chain.b,tip(chain).sub(joint),tw.sub(joint))
      const state=states.find(state=>state.chain===chain)
      if(chain.a.quaternion.angleTo(state.qa)>Math.PI/3||chain.b.quaternion.angleTo(state.qb)>Math.PI/3)valid=false
    }
    if(!valid){for(const {chain,qa,qb}of states){chain.a.quaternion.copy(qa);chain.b.quaternion.copy(qb)}holder.parent?.updateWorldMatrix(true,false);holder.updateMatrixWorld(true)}
    return valid
  }}
}
