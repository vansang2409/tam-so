import {MathUtils} from 'three'

const eyeNames=['eyeBlinkLeft','eyeBlinkRight']
function blinkAt(phase){
  if(phase<.065)return MathUtils.smoothstep(phase,0,.065)
  if(phase<.105)return 1
  return 1-MathUtils.smoothstep(phase,.105,.265)
}

// Body lids and fitted lashes share the same semantic channels. Each cloned mesh
// owns its weights; geometry and texture resources remain immutable and shared.
export function createTempleFaceMotion(model,seed=0){
  const channels=[]
  model.traverse(mesh=>{
    if(!mesh.morphTargetDictionary||!mesh.morphTargetInfluences)return
    for(const name of eyeNames){
      const index=mesh.morphTargetDictionary[name]
      if(Number.isInteger(index)&&index>=0&&index<mesh.morphTargetInfluences.length)channels.push({mesh,index})
    }
  })
  const normalized=Number.isFinite(seed)?MathUtils.euclideanModulo(seed,1):0,period=4.6+normalized*1.8,offset=normalized*period
  return {get channelCount(){return channels.length},apply({pose='standing',amount=0,time=0,reduced=false}={}){
    const phase=MathUtils.euclideanModulo((Number.isFinite(time)?time:0)+offset,period)
    const ritual=pose==='meditating'?1:pose==='bowing'?MathUtils.smoothstep(Number.isFinite(amount)?amount:0,.2,.8):0
    const weight=Math.max(ritual,reduced?0:blinkAt(phase))
    for(const {mesh,index}of channels)mesh.morphTargetInfluences[index]=weight
    return weight
  }}
}
