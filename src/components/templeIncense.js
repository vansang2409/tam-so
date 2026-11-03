import * as THREE from 'three'

// One reusable five-puff pool per location, outside the hidden architectural shell.
// Ceiling values are world Y; anchors retain their parent's complete world transform.
// The caller owns the smoke texture, scene and engine-shared Sprite geometry.
export function createTempleIncense(parent,smokeTexture) {
  const root=new THREE.Group();root.name='Temple incense smoke';parent.add(root)
  const pools=new Map(),point=new THREE.Vector3(),position=new THREE.Vector3(),scale=new THREE.Vector3()
  let disposed=false
  function register(id,kind,source,{x=0,y=0,z=0,ceiling}={}){
    if(disposed||typeof id!=='string'||!id||!['inside','outside'].includes(kind)||!source?.isObject3D||![x,y,z].every(Number.isFinite))return null
    let pool=pools.get(id)
    if(!pool){
      const puffs=Array.from({length:5},()=>{
        const material=new THREE.SpriteMaterial({map:smokeTexture,color:0xe1dfd3,transparent:true,opacity:0,depthWrite:false})
        const puff=new THREE.Sprite(material);puff.visible=false;root.add(puff);return puff
      })
      pool={puffs};pools.set(id,pool)
    }
    pool[kind]?.anchor.removeFromParent()
    const anchor=new THREE.Object3D();anchor.name='Incense '+kind+' · '+id;anchor.position.set(x,y,z);source.add(anchor)
    pool[kind]={anchor,ceiling:Number.isFinite(ceiling)?ceiling:Infinity}
    return anchor
  }
  function update(litIds,insideId,time=0,{reduced=false,quality='standard'}={}){
    if(disposed)return {visiblePuffs:0,litLocations:0}
    root.updateWorldMatrix(true,false);root.getWorldScale(scale)
    const clock=Number.isFinite(time)?time:0,limit=quality==='low'?2:5
    let visiblePuffs=0,litLocations=0
    for(const [id,pool]of pools){
      const source=insideId===id?pool.inside:pool.outside
      let active=!!litIds?.has(id)&&!!source,maxRise=0
      if(active){source.anchor.getWorldPosition(point);maxRise=Math.min(.7,source.ceiling-point.y-.19);active=Number.isFinite(point.lengthSq())&&maxRise>0}
      if(active)litLocations++
      for(let i=0;i<pool.puffs.length;i++){
        const puff=pool.puffs[i];puff.visible=active&&i<limit
        if(!puff.visible){puff.material.opacity=0;continue}
        const phase=reduced?.12+i*.17:((clock*.18+i*.19)%1+1)%1
        position.copy(point);position.x+=Math.sin(phase*Math.PI*2+i)*.035;position.z+=Math.cos(phase*Math.PI*2+i)*.02;position.y+=phase*maxRise
        puff.position.copy(root.worldToLocal(position));puff.scale.set((.12+.14*phase)/Math.max(1e-6,Math.abs(scale.x)),(.18+.18*phase)/Math.max(1e-6,Math.abs(scale.y)),1)
        puff.material.opacity=.2*Math.pow(Math.sin(Math.PI*phase),1.6);visiblePuffs++
      }
    }
    return {visiblePuffs,litLocations}
  }
  function dispose(){
    if(disposed)return;disposed=true
    for(const pool of pools.values()){
      pool.inside?.anchor.removeFromParent();pool.outside?.anchor.removeFromParent()
      for(const puff of pool.puffs)puff.material.dispose()
    }
    pools.clear();root.clear();root.removeFromParent()
  }
  return {root,register,update,dispose}
}
