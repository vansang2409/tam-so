import * as THREE from 'three'
import { bindTempleBowRig } from './templeBowRig.js'
import { bowFrame } from '../data/templeRituals.js'
import { groundHeight } from '../data/templeWorld.js'
import { MAX_VISIBLE_VISITORS } from '../data/templePresence.js'
// Dùng lại geometry nhân vật, chỉ thêm vật liệu áo và nhãn tên cho từng khách.
export function createTempleVisitors(world) {
  const visitors=new Map(),palette=[0x829b99,0xa79980,0x8c9b7b,0x9790a7,0xad8a77],legIndices=world.legs.map(o=>world.standing.children.indexOf(o))
  function nameTag(name){
    const c=document.createElement('canvas');c.width=512;c.height=96
    const ctx=c.getContext('2d');ctx.fillStyle='#28221dee';ctx.beginPath();ctx.roundRect(4,8,504,80,18);ctx.fill();ctx.strokeStyle='#c5a06a';ctx.lineWidth=2;ctx.stroke();ctx.font='500 32px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f1e1c5';ctx.fillText(name,256,49,470)
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace
    const material=new THREE.SpriteMaterial({map:texture,depthWrite:false}),sprite=new THREE.Sprite(material);sprite.position.y=2.12;sprite.scale.set(1.85,.35,1);return sprite
  }
  function remove(id){const v=visitors.get(id);if(!v)return;v.root.removeFromParent();v.shirt.dispose();v.tag.material.map.dispose();v.tag.material.dispose();visitors.delete(id)}
  return {
    update(peers,space,position,dt,time,reduced){
      const visible=peers.filter(p=>p.space===space).sort((a,b)=>Math.hypot(a.x-position.x,a.z-position.z)-Math.hypot(b.x-position.x,b.z-position.z)).slice(0,MAX_VISIBLE_VISITORS),ids=new Set(visible.map(p=>p.id))
      for(const id of visitors.keys())if(!ids.has(id))remove(id)
      for(const p of visible){
        let v=visitors.get(p.id)
        if(!v){const root=new THREE.Group(),body=world.standing.clone(true),seated=world.seated.clone(true),praying=world.praying.clone(true),shirt=world.body.material.clone();shirt.color.setHex(palette[p.color]);for(const pose of [body,seated,praying]){pose.traverse(o=>{if(o.isMesh&&o.material===world.body.material)o.material=shirt});root.add(pose)}const rig=bindTempleBowRig(praying),tag=nameTag(p.name);root.add(tag);root.position.set(p.x,groundHeight(p.x,p.z),p.z);world.root.add(root);v={root,body,seated,praying,rig,shirt,tag,name:p.name,progress:0};visitors.set(p.id,v)}
        if(v.name!==p.name){v.root.remove(v.tag);v.tag.material.map.dispose();v.tag.material.dispose();v.tag=nameTag(p.name);v.root.add(v.tag);v.name=p.name}
        const blend=reduced?1:1-Math.exp(-dt*12);v.root.position.lerp(new THREE.Vector3(p.x,groundHeight(p.x,p.z),p.z),blend)
        v.root.rotation.y+=Math.atan2(Math.sin(p.yaw-v.root.rotation.y),Math.cos(p.yaw-v.root.rotation.y))*blend
        v.body.visible=p.pose!=='meditating'&&p.pose!=='bowing';v.seated.visible=p.pose==='meditating';v.praying.visible=p.pose==='bowing';if(p.pose==='bowing'){v.progress=THREE.MathUtils.lerp(v.progress,p.bowProgress||0,blend);v.rig.apply(reduced?0:v.progress)}else v.progress=0;v.tag.position.y=p.pose==='meditating'?1.65:p.pose==='bowing'?1.7-bowFrame(v.progress).amount*.6:2.12
        const gait=p.moving&&!reduced?Math.sin(time*12)*.42:0;v.body.children[legIndices[0]].rotation.x=gait;v.body.children[legIndices[1]].rotation.x=-gait
        v.root.visible=space==='courtyard'||Math.hypot(p.x-position.x,p.z-position.z)>.65
      }
      return visible.length
    },
    dispose(){for(const id of visitors.keys())remove(id)}
  }
}
