import * as THREE from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { updateTempleCloth } from './templeClothDeformation.js'
import { bowFrame } from '../data/templeRituals.js'

const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z)
// An independent skeleton/mixer per visitor; textures and geometry remain shared.
export function createDetailedVisitor(source,parent) {
  const holder=new THREE.Group(),model=clone(source);holder.name='Detailed visitor GLB';holder.add(model);parent.add(holder)
  const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(V()),center=bounds.getCenter(V()),scale=1.75/size.y
  model.scale.multiplyScalar(scale);model.position.add(V(-center.x*scale,-bounds.min.y*scale,-center.z*scale))
  const bones=new Map(),rest=new Map(),q=new THREE.Quaternion(),worldQ=new THREE.Quaternion(),delta=new THREE.Quaternion()
  model.traverse(o=>{if(o.isBone){bones.set(o.name,o);rest.set(o.name,{position:o.position.clone(),quaternion:o.quaternion.clone()})}if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false}})
  const required=['Hips','Spine02','Spine01','Spine','neck','Head',...['Left','Right'].flatMap(s=>[s+'Shoulder',s+'Arm',s+'ForeArm',s+'Hand',s+'UpLeg',s+'Leg',s+'Foot',s+'ToeBase'])]
  if(required.some(name=>!bones.has(name))){parent.remove(holder);throw Error('Visitor skeleton is incomplete')}
  const mixer=new THREE.AnimationMixer(model),walk=source.animations?.find(a=>/walk/i.test(a.name)),action=walk?mixer.clipAction(walk).play():null
  const worldPoint=p=>holder.localToWorld(p.clone())
  const position=name=>bones.get(name).getWorldPosition(V())
  function aim(name,child,target){
    const b=bones.get(name),from=position(child).sub(position(name)),to=worldPoint(target).sub(position(name))
    if(from.lengthSq()<1e-10||to.lengthSq()<1e-10)return
    delta.setFromUnitVectors(from.normalize(),to.normalize());b.getWorldQuaternion(worldQ);worldQ.premultiply(delta)
    b.parent.getWorldQuaternion(q).invert();b.quaternion.copy(q.multiply(worldQ));b.updateWorldMatrix(false,true)
  }
  function orientHand(name,direction){
    const hand=bones.get(name);hand.getWorldQuaternion(worldQ)
    const from=V(0,1,0).applyQuaternion(worldQ),to=direction.clone().transformDirection(holder.matrixWorld)
    delta.setFromUnitVectors(from.normalize(),to.normalize());worldQ.premultiply(delta)
    hand.parent.getWorldQuaternion(q).invert();hand.quaternion.copy(q.multiply(worldQ));hand.updateWorldMatrix(false,true)
  }
  function limb(upper,lower,end,target,hint){
    const a=position(upper),b=position(lower),c=position(end),dest=worldPoint(target),l1=a.distanceTo(b),l2=b.distanceTo(c)
    const direction=dest.clone().sub(a),distance=THREE.MathUtils.clamp(direction.length(),Math.abs(l1-l2)+.001,l1+l2-.001);direction.normalize()
    const bend=worldPoint(hint).sub(a);bend.addScaledVector(direction,-bend.dot(direction));if(bend.lengthSq()<1e-10)bend.set(0,0,1);bend.normalize()
    const along=(l1*l1-l2*l2+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,l1*l1-along*along))
    const elbow=a.clone().addScaledVector(direction,along).addScaledVector(bend,height)
    aim(upper,lower,holder.worldToLocal(elbow));aim(lower,end,target)
  }
  const rootRest=rest.get('Hips'),hip=bones.get('Hips'),garment=model.getObjectByName('Ao lam garment')
  let disposed=false
  return {root:holder,model,bones,update({pose='standing',moving=false,progress=0,time=0,dt=.016,reduced=false}={}){
    if(disposed)return
    for(const [name,b]of bones){const r=rest.get(name);b.position.copy(r.position);b.quaternion.copy(r.quaternion)}
    if(moving&&action&&!reduced){
      holder.position.y=.012;mixer.update(dt);hip.position.x=rootRest.position.x;hip.position.z=rootRest.position.z;model.updateWorldMatrix(true,true)
      updateTempleCloth(garment,{pose,moving,time,phase:action.time/walk.duration*Math.PI*2,dt,reduced});return
    }
    const amount=pose==='bowing'?bowFrame(reduced?0:progress).amount:0,seated=pose==='meditating',kneeling=pose==='bowing'
    holder.position.y=kneeling?.035+amount*.04:.012
    const hipY=seated?.32:kneeling?.56-amount*.20:.954+(reduced?0:Math.sin(time*1.35)*.001)
    holder.updateWorldMatrix(true,true);hip.position.copy(hip.parent.worldToLocal(worldPoint(V(!seated&&!kneeling?.018:0,hipY,0))));model.updateWorldMatrix(true,true)
    const angle=amount*1.85,relaxed=!seated&&!kneeling,up=relaxed?V(-.018,1,.014).normalize():V(0,Math.cos(angle),Math.sin(angle))
    for(const [a,b]of [['Hips','Spine02'],['Spine02','Spine01'],['Spine01','Spine'],['Spine','neck']]){
      const direction=a==='Hips'?(relaxed?V(.022,1,-.01).normalize():V(0,Math.cos(angle*.2),Math.sin(angle*.2))):up
      const target=holder.worldToLocal(position(a)).add(direction);aim(a,b,target)
    }
    for(const [side,prefix]of [[1,'Left'],[-1,'Right']]){
      // Shoulder line remains anatomical before the two-bone arm solve.
      const shoulder=holder.worldToLocal(position(prefix+'Shoulder'))
      aim(prefix+'Shoulder',prefix+'Arm',shoulder.add(V(side*.2,relaxed?-.012+side*.004:0,relaxed?.006:0)))
      const armPoint=holder.worldToLocal(position(prefix+'Arm')),elbowPoint=holder.worldToLocal(position(prefix+'ForeArm')),wristPoint=holder.worldToLocal(position(prefix+'Hand'))
      const armLength=armPoint.distanceTo(elbowPoint)+elbowPoint.distanceTo(wristPoint)
      const standingHand=armPoint.clone().add(V(side*.10,-armLength*.96,side>0?.025:.05))
      const hand=seated?V(side*.075,.31,.36):kneeling?V(side*(.035+.16*amount),.86-.78*amount,.26+.44*amount):standingHand
      const elbowHint=kneeling?V(side*.32,.57-amount*.34,.24+amount*.28):seated?V(side*.32,.36,.20):V(side*.55,1.15,.15)
      limb(prefix+'Arm',prefix+'ForeArm',prefix+'Hand',hand,elbowHint)
      // Giữ hình bàn tay gốc; ngón hướng vào lòng khi thiền, dựng lên/chạm sàn khi lạy.
      const wrist=bones.get(prefix+'Hand');wrist.quaternion.copy(rest.get(prefix+'Hand').quaternion)
      if(seated)orientHand(prefix+'Hand',V(-side,.10,.28))
      else if(kneeling)orientHand(prefix+'Hand',V(0,1-amount,amount))
      const foot=seated?V(-side*.18,.13,.32):kneeling?V(side*.14,.10,-.34+.22*amount):V(side*(side>0?.110:.105),.11,side>0?.055:-.025)
      limb(prefix+'UpLeg',prefix+'Leg',prefix+'Foot',foot,V(side*(seated?.65:.18),seated?.10:kneeling?.28-.06*amount:.45,kneeling?.40:.22))
      aim(prefix+'Foot',prefix+'ToeBase',foot.clone().add(V(relaxed?side*.032:0,0,seated?.14:kneeling?-.15:.15)))
    }
    if(relaxed&&!reduced)bones.get('Head').quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.012,-.035+Math.sin(time*.32)*.012,.012)))
    model.updateWorldMatrix(true,true)
    updateTempleCloth(garment,{pose,moving:false,time,amount,dt,reduced})
  },dispose(){if(disposed)return;disposed=true;mixer.stopAllAction();mixer.uncacheRoot(model);model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.dispose()});holder.removeFromParent()}}
}

export function createDetailedVisitors(models,avatar,fallbacks) {
  const sources=new Map(),jobs=new Map(),remotes=new Map()
  let self=null,selfAppearance=null,requested='male',disposed=false
  const appearance=value=>value==='female'?'female':'male'
  function load(value){
    const key=appearance(value)
    if(!jobs.has(key))jobs.set(key,models.load('visitor-'+key).then(asset=>{if(!disposed)sources.set(key,asset);return !disposed}).catch(()=>false))
    return jobs.get(key)
  }
  const ready=load('male')
  return {ready,get remoteCount(){return remotes.size},get appearance(){return selfAppearance},get loaded(){return !!self},updateSelf(state){
    requested=appearance(state.appearance);const source=sources.get(requested)
    if(!source){load(requested);if(self)self.root.visible=false;return false}
    if(selfAppearance!==requested){self?.dispose();self=createDetailedVisitor(source,avatar);selfAppearance=requested}
    self.root.visible=true;for(const o of fallbacks)o.visible=false;self.update(state);return true
  },updateRemote(id,parent,state){
    const key=appearance(state.appearance),source=sources.get(key);if(!source){load(key);const previous=remotes.get(id);if(previous)previous.rig.root.visible=false;return false}
    let v=remotes.get(id)
    if(v?.appearance!==key){v?.rig.dispose();v={appearance:key,rig:createDetailedVisitor(source,parent)};remotes.set(id,v)}
    v.rig.root.visible=true;v.rig.update(state);return true
  },removeRemote(id){remotes.get(id)?.rig.dispose();remotes.delete(id)},dispose(){disposed=true;self?.dispose();for(const v of remotes.values())v.rig.dispose();remotes.clear()}}
}
