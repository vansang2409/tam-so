import * as THREE from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { updateTempleCloth } from './templeClothDeformation.js'
import { bowFrame } from '../data/templeRituals.js'
import {createTempleHumanoidHands} from './templeHumanoidHands.js'
import {createTempleRigContact} from './templeRigContact.js'
import {createTempleFaceMotion} from './templeFaceMotion.js'
import {createTempleThumbPose} from './templeThumbPose.js'

const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z)
const gameEngineBones={Hips:'pelvis',Spine02:'spine_01',Spine01:'spine_02',Spine:'spine_03',neck:'neck_01',Head:'head',LeftShoulder:'clavicle_l',LeftArm:'upperarm_l',LeftForeArm:'lowerarm_l',LeftHand:'hand_l',LeftUpLeg:'thigh_l',LeftLeg:'calf_l',LeftFoot:'foot_l',LeftToeBase:'ball_l',RightShoulder:'clavicle_r',RightArm:'upperarm_r',RightForeArm:'lowerarm_r',RightHand:'hand_r',RightUpLeg:'thigh_r',RightLeg:'calf_r',RightFoot:'foot_r',RightToeBase:'ball_r'}
// An independent skeleton/mixer per visitor; textures and geometry remain shared.
export function createDetailedVisitor(source,parent) {
  const holder=new THREE.Group(),model=clone(source);holder.name='Detailed visitor GLB';holder.add(model);parent.add(holder)
  const canonical=source.userData.templeFitBounds,bounds=Array.isArray(canonical)&&canonical.length===6&&canonical.every(Number.isFinite)&&canonical[4]>canonical[1]?new THREE.Box3(V(...canonical.slice(0,3)),V(...canonical.slice(3))):new THREE.Box3().setFromObject(model)
  const targetHeight=Number.isFinite(source.userData.templeHeight)&&source.userData.templeHeight>=1.4&&source.userData.templeHeight<=2?source.userData.templeHeight:1.75
  const size=bounds.getSize(V()),center=bounds.getCenter(V()),scale=targetHeight/size.y
  model.scale.multiplyScalar(scale);model.position.add(V(-center.x*scale,-bounds.min.y*scale,-center.z*scale))
  const bones=new Map(),rest=new Map(),q=new THREE.Quaternion(),worldQ=new THREE.Quaternion(),delta=new THREE.Quaternion()
  model.traverse(o=>{if(o.isBone){bones.set(o.name,o);rest.set(o.name,{position:o.position.clone(),quaternion:o.quaternion.clone()})}if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false}})
  const anatomical=source.userData.templeRig==='mpfb-gameengine'
  if(anatomical)for(const [alias,name]of Object.entries(gameEngineBones))if(bones.has(name)){bones.set(alias,bones.get(name));rest.set(alias,rest.get(name))}
  const required=['Hips','Spine02','Spine01','Spine','neck','Head',...['Left','Right'].flatMap(s=>[s+'Shoulder',s+'Arm',s+'ForeArm',s+'Hand',s+'UpLeg',s+'Leg',s+'Foot',s+'ToeBase'])]
  if(required.some(name=>!bones.has(name))){parent.remove(holder);throw Error('Visitor skeleton is incomplete')}
  const mixer=new THREE.AnimationMixer(model),walk=source.animations?.find(a=>/walk/i.test(a.name)),action=walk?mixer.clipAction(walk).play():null
  const idle=anatomical?source.animations?.find(a=>/idle/i.test(a.name)):null,idleAction=idle?mixer.clipAction(idle).play():null
  if(idleAction){action?.setEffectiveWeight(0);idleAction.setEffectiveWeight(1)}
  const actorSeed=parseInt(holder.uuid.slice(0,8),16)/0x100000000
  const profile=source.userData.templeCharacterProfile
  const authoredHuman=profile==='female-human-v1'||profile==='male-human-v1'
  if(authoredHuman){
    if(action&&walk)action.time=actorSeed*walk.duration
    if(idleAction&&idle)idleAction.time=actorSeed*idle.duration
  }
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
  model.updateWorldMatrix(true,true)
  const rootRest=rest.get('Hips'),hip=bones.get('Hips'),garment=model.getObjectByName('Ao lam garment'),female=anatomical||model.userData.templeCharacterProfile==='female-lam-v1'
  const restHipY=holder.worldToLocal(position('Hips')).y,poseScale=anatomical?restHipY/.954:1,hands=anatomical?createTempleHumanoidHands(bones,holder):null
  const P=(x,y,z)=>V(x*poseScale,y*poseScale,z*poseScale),footRest={}
  if(anatomical)for(const prefix of ['Left','Right'])footRest[prefix]={height:holder.worldToLocal(position(prefix+'Foot')).y,direction:holder.worldToLocal(position(prefix+'ToeBase')).sub(holder.worldToLocal(position(prefix+'Foot')))}
  const spineChain=[['Hips','Spine02'],['Spine02','Spine01'],['Spine01','Spine'],['Spine','neck']],spineRest=new Map()
  if(anatomical)for(const [a,b]of spineChain)spineRest.set(a,holder.worldToLocal(position(b)).sub(holder.worldToLocal(position(a))).normalize())
  const groundContact=anatomical?createTempleRigContact(model,holder):null
  const face=anatomical?createTempleFaceMotion(model,actorSeed):null
  const thumbs=anatomical?createTempleThumbPose(bones,holder,model):null
  const seatedCloth=[]
  if(anatomical)model.traverse(mesh=>{
    if(!mesh.isSkinnedMesh)return
    const part=mesh.material?.userData?.templePart
    const target=part==='pants'?'templeSeatedPants':part==='shirt'?'templeSeatedShirt':null
    if(!target)return
    const index=mesh.morphTargetDictionary?.[target]
    const weights=mesh.morphTargetInfluences
    if(weights&&Number.isInteger(index)&&index>=0&&index<weights.length)
      seatedCloth.push({weights,index})
  })
  // PropertyMixer intentionally skips unchanged samples. Restore its previous unmodified
  // pose before sampling, rather than resetting animated joints to rest behind its cache.
  const animationState=[...new Set(bones.values())].map(bone=>({bone,position:bone.position.clone(),quaternion:bone.quaternion.clone()}))
  const restoreAnimation=()=>{for(const state of animationState){state.bone.position.copy(state.position);state.bone.quaternion.copy(state.quaternion)}}
  const captureAnimation=()=>{for(const state of animationState){state.position.copy(state.bone.position);state.quaternion.copy(state.bone.quaternion)}}
  let disposed=false,locomotionBlend=0,staticMeditation=false
  return {root:holder,model,bones,update({pose='standing',moving=false,progress=0,time=0,dt=.016,reduced=false,speed}={}){
    if(disposed)return
    // Authored meditation has fixed local IK, closed eyelids and no procedural
    // garment. Parent movement/yaw carries that pose without solving it again.
    const cacheMeditation=anatomical&&pose==='meditating'&&!garment
    if(cacheMeditation&&staticMeditation)return
    staticMeditation=false
    for(const {weights,index}of seatedCloth)weights[index]=pose==='meditating'?1:0
    if(anatomical&&!reduced&&pose==='standing'&&(moving?action:idleAction)){
      restoreAnimation()
      holder.position.y=0
      if(idleAction){locomotionBlend=THREE.MathUtils.lerp(locomotionBlend,moving?1:0,1-Math.exp(-Math.max(0,dt)*10));action?.setEffectiveWeight(locomotionBlend);idleAction.setEffectiveWeight(1-locomotionBlend)}
      const capturedSpeed=source.userData.templeWalkSpeed*scale
      if(action&&Number.isFinite(capturedSpeed)&&capturedSpeed>0&&Number.isFinite(speed))action.timeScale=THREE.MathUtils.lerp(action.timeScale,THREE.MathUtils.clamp(speed/capturedSpeed,.65,1.8),1-Math.exp(-Math.max(0,dt)*8))
      // The authored GameEngine clips are already in-place in world X/Z. Their rig
      // parent rotates local axes, so overwriting local Z would erase vertical contact.
      mixer.update(dt);model.updateWorldMatrix(true,true)
      captureAnimation()
      if(idleAction&&authoredHuman){
        // Preserve the sampled mocap above; soften only Idle looks for this quiet
        // setting. Walk smoothly regains its full head motion through the blend.
        const calm=.4*(1-locomotionBlend)
        for(const name of ['neck','Head'])bones.get(name).quaternion.slerp(rest.get(name).quaternion,calm)
        model.updateWorldMatrix(true,true)
      }
      groundContact?.apply()
      hands?.apply({pose:'standing',moving:true})
      face?.apply({pose:'standing',time,reduced})
      updateTempleCloth(garment,{pose,moving,time,phase:action&&walk?action.time/walk.duration*Math.PI*2:0,dt,reduced});return
    }
    if(moving&&action&&!reduced){
      restoreAnimation()
      holder.position.y=.012;mixer.update(dt);hip.position.x=rootRest.position.x;hip.position.z=rootRest.position.z;model.updateWorldMatrix(true,true)
      captureAnimation()
      hands?.apply({pose:'standing',moving:true})
      updateTempleCloth(garment,{pose,moving,time,phase:action.time/walk.duration*Math.PI*2,dt,reduced});return
    }
    for(const [name,b]of bones){const r=rest.get(name);b.position.copy(r.position);b.quaternion.copy(r.quaternion)}
    const amount=pose==='bowing'?bowFrame(reduced?0:progress).amount:0,seated=pose==='meditating',kneeling=pose==='bowing'
    if(anatomical){locomotionBlend=0;action?.setEffectiveWeight(idleAction?0:1);idleAction?.setEffectiveWeight(1)}
    holder.position.y=kneeling?.035+amount*.04:anatomical?0:.012
    const hipY=(seated?(anatomical?.17:.32):kneeling?.56-amount*.20:.954+(reduced?0:Math.sin(time*1.35)*.001))*poseScale
    holder.updateWorldMatrix(true,true);hip.position.copy(hip.parent.worldToLocal(worldPoint(V(!seated&&!kneeling?.018:0,hipY,0))));model.updateWorldMatrix(true,true)
    const angle=amount*1.85,relaxed=!seated&&!kneeling,up=relaxed?V(-.018,1,.014).normalize():V(0,Math.cos(angle),Math.sin(angle))
    for(const [a,b]of spineChain){
      const direction=anatomical?spineRest.get(a).clone().applyAxisAngle(V(1,0,0),a==='Hips'?angle*.2:angle):(a==='Hips'?(relaxed?V(.022,1,-.01).normalize():V(0,Math.cos(angle*.2),Math.sin(angle*.2))):up)
      const target=holder.worldToLocal(position(a)).add(direction);aim(a,b,target)
    }
    // Solve support limbs before the arms so palms can target the actual floor.
    for(const [side,prefix]of [[1,'Left'],[-1,'Right']]){
      const foot=seated?(anatomical?P(-side*.12,side>0?.10:.22,side>0?.21:.17):P(-side*.18,.13,.32)):kneeling?P(side*.14,.10,-.34+.22*amount):V(side*(side>0?.110:.105)*poseScale,anatomical?footRest[prefix].height:.11,(side>0?.055:-.025)*poseScale)
      const kneeHint=anatomical&&seated?P(side*.65,side>0?.16:.08,.23):V(side*(seated?.65:.18),seated?.10:kneeling?.28-.06*amount:.45,kneeling?.40:.22)
      limb(prefix+'UpLeg',prefix+'Leg',prefix+'Foot',foot,kneeHint)
      const toeTarget=anatomical&&relaxed?holder.worldToLocal(position(prefix+'Foot')).add(footRest[prefix].direction):anatomical&&seated?foot.clone().add(P(-side*.12,0,-.04)):foot.clone().add(V(relaxed?side*.032:0,0,seated?.14:kneeling?-.15:.15))
      aim(prefix+'Foot',prefix+'ToeBase',toeTarget)
    }
    if(anatomical)groundContact?.apply()
    for(const [side,prefix]of [[1,'Left'],[-1,'Right']]){
      // Shoulder line remains anatomical before the two-bone arm solve.
      const shoulder=holder.worldToLocal(position(prefix+'Shoulder'))
      if(!anatomical)aim(prefix+'Shoulder',prefix+'Arm',shoulder.add(V(side*.2,relaxed?-.012+side*.004:0,relaxed?.006:0)))
      const armPoint=holder.worldToLocal(position(prefix+'Arm')),elbowPoint=holder.worldToLocal(position(prefix+'ForeArm')),wristPoint=holder.worldToLocal(position(prefix+'Hand'))
      const armLength=armPoint.distanceTo(elbowPoint)+elbowPoint.distanceTo(wristPoint)
      const standingHand=armPoint.clone().add(V(side*(anatomical?.04:female?.005:.10),-armLength*(anatomical?.98:female?.995:.96),anatomical?.035:side>0?.025:.05))
      const hand=seated?(anatomical?P(side*.10,.29+(side<0?.035:0),.24+(side<0?.01:0)):P(side*.075,.31,.36)):kneeling?P(side*((anatomical?.029:.035)+.16*amount),.86-.78*amount,.26+.44*amount):standingHand
      if(anatomical&&kneeling)hand.y=THREE.MathUtils.lerp(.86*poseScale,.028-holder.position.y,amount)
      const elbowHint=kneeling?P(side*.32,.57-amount*.34,.24+amount*.28):seated?P(side*.32,.36,.20):female?armPoint.clone().add(V(side*.018,-.28,.10)):V(side*.55,1.15,.15)
      limb(prefix+'Arm',prefix+'ForeArm',prefix+'Hand',hand,elbowHint)
      // Giữ hình bàn tay gốc; ngón hướng vào lòng khi thiền, dựng lên/chạm sàn khi lạy.
      const wrist=bones.get(prefix+'Hand');wrist.quaternion.copy(rest.get(prefix+'Hand').quaternion)
      if(!anatomical&&seated)orientHand(prefix+'Hand',V(-side,.10,.28))
      else if(!anatomical&&kneeling)orientHand(prefix+'Hand',V(0,1-amount,amount))
    }
    if(relaxed&&!reduced)bones.get('Head').quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.012,-.035+Math.sin(time*.32)*.012,.012)))
    model.updateWorldMatrix(true,true)
    hands?.apply({pose,amount,moving:false})
    thumbs?.apply({pose})
    face?.apply({pose,amount,time,reduced})
    updateTempleCloth(garment,{pose,moving:false,time,amount,dt,reduced})
    staticMeditation=cacheMeditation
  },dispose(){if(disposed)return;disposed=true;mixer.stopAllAction();mixer.uncacheRoot(model);model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.dispose()});holder.removeFromParent()}}
}

export function createDetailedVisitors(models,avatar,fallbacks) {
  const sources=new Map(),jobs=new Map(),remotes=new Map()
  let self=null,selfAppearance=null,requested='male',disposed=false
  const appearance=value=>value==='female'?'female':'male'
  function load(value){
    const key=appearance(value)
    if(!jobs.has(key)){
      const request=key==='female'
        ? models.load('visitor-female-human')
        : models.load('visitor-male-human').catch(error=>{
          if(disposed)throw error
          return models.load('visitor-male')
        })
      jobs.set(key,request.then(asset=>{if(!disposed)sources.set(key,asset);return !disposed}).catch(()=>false))
    }
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
