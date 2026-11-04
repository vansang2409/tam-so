import assert from 'node:assert/strict'
import './temple-ground-picking.mjs'
import './temple-pointer-input.mjs'
import './temple-atmosphere.mjs'
import './temple-landscape.mjs'
import './temple-flowers.mjs'
import './temple-lotus.mjs'
import * as THREE from 'three'
import {bowFrame,BOW_DURATION,meditationSeconds,templePose} from '../src/data/templeRituals.js'
import {createTempleBowRig,bindTempleBowRig} from '../src/components/templeBowRig.js'
assert.equal(BOW_DURATION,12000)
assert.equal(templePose(),'standing')
assert.equal(templePose({ritual:1000}),'bowing','Incense publishes its ritual pose even while rendering is paused')
assert.equal(templePose({ritual:null}),'standing','Expiring incense publishes standing without requiring a rendered frame')
assert.equal(templePose({meditating:true}),'meditating')
assert.equal(templePose({bowing:true,meditating:true}),'bowing')
assert.equal(templePose({moving:true,bowing:true,meditating:true,ritual:true}),'standing','Walking interrupts all stationary poses')
for(let n=0;n<3;n++){
 assert.equal(bowFrame((n+.1)/3).amount,0,'Chắp tay trước mỗi lạy')
 assert.equal(bowFrame((n+.5)/3).amount,1,'Cúi sát sàn đủ ba lần')
 assert.equal(bowFrame((n+.95)/3).amount,0,'Nâng người sau mỗi lạy')
 assert.equal(bowFrame((n+.5)/3).number,n+1)
}
assert.equal(bowFrame(1).finished,true);assert.equal(bowFrame(1).amount,0)
assert.equal(bowFrame(-1).amount,0);assert.equal(bowFrame(Infinity).number,1)
assert.equal(meditationSeconds(60000,1),60);assert.equal(meditationSeconds(60000,59999),1);assert.equal(meditationSeconds(60000,65000),0)
const parent=new THREE.Group()
const sphere=(r,color,x,y,z,g,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),new THREE.MeshBasicMaterial({color}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);g.add(m);return m}
const cylinder=(r1,r2,h,color,x,y,z,g,n)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n),new THREE.MeshBasicMaterial({color}));m.position.set(x,y,z);g.add(m);return m}
const mesh=(g,color,x,y,z,p)=>{const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color}));m.position.set(x,y,z);p.add(m);return m}
const rig=createTempleBowRig({mesh,sphere,cylinder},parent),clone=rig.root.clone(true),remote=bindTempleBowRig(clone)
let frames=0
for(let i=0;i<=240;i++){
 const p=i/240;assert.equal(rig.apply(p),remote.apply(p));rig.root.updateMatrixWorld(true);clone.updateMatrixWorld(true)
 rig.root.traverse(o=>{assert.ok(o.matrixWorld.elements.every(Number.isFinite),'Tư thế không có ma trận NaN');if(o.isMesh){const v=new THREE.Vector3(),a=o.geometry.attributes.position;for(let j=0;j<a.count;j++){v.fromBufferAttribute(a,j).applyMatrix4(o.matrixWorld);assert.ok(v.y>=-.001,'Đỉnh mesh không xuyên sàn')}}})
 const box=new THREE.Box3().setFromObject(rig.root);assert.ok(box.max.y<1.8,'Không nhảy cao khi cúi')
 assert.ok(new THREE.Box3().setFromObject(clone).equals(box),'Khách online có cùng động tác');frames++
}
console.log('Hành lễ: ba lạy/12 giây, các nhịp chắp tay/cúi/nâng người, '+frames+' khung rig và bản sao, đồng hồ thiền pass.')

// Adult proportions and pivoted limbs remain valid for local/online standing and seated poses.
const {createTempleAvatar}=await import('../src/components/templeAvatar.js')
const visitor=createTempleAvatar({mesh,sphere,cylinder},new THREE.Group())
const standingBounds=new THREE.Box3().setFromObject(visitor.standing)
assert.ok(standingBounds.max.y>1.65&&standingBounds.max.y<1.85,'Adult standing height')
assert.ok(standingBounds.max.x-standingBounds.min.x<.85,'Shoulders stay within navigation clearance')
for(const phase of [0,.25,.5,.75,1]){
 const gait=Math.sin(phase*Math.PI*2)*.45
 visitor.legs[0].rotation.x=gait;visitor.legs[1].rotation.x=-gait
 visitor.arms[0].rotation.x=-gait*.6;visitor.arms[1].rotation.x=gait*.6
 visitor.standing.updateMatrixWorld(true)
 assert.ok(new THREE.Box3().setFromObject(visitor.standing).min.y>=-.001,'Walking feet stay above the floor')
 const copy=visitor.standing.clone(true);copy.updateMatrixWorld(true)
 assert.ok(new THREE.Box3().setFromObject(copy).equals(new THREE.Box3().setFromObject(visitor.standing)),'Online clone retains limb pivots')
}
const seatedBounds=new THREE.Box3().setFromObject(visitor.seated)
assert.ok(seatedBounds.min.y>=0&&seatedBounds.max.y<1.4,'Meditation stays seated above the floor')
console.log('Nhân vật: tỷ lệ trưởng thành, 5 nhịp đi/khớp chân tay, clone online và tư thế thiền pass.')

// Detailed online avatars must use the same interpolated bow progress as the fallback rig.
const {createTempleVisitors}=await import('../src/components/templeVisitors.js')
const originalDocument=globalThis.document,onlineRoot=new THREE.Group(),detailedFrames=[],removedPeers=[]
globalThis.document={createElement(){return {getContext(){return {beginPath(){},roundRect(){},fill(){},stroke(){},fillText(){}}}}}}
try{
 const online=createTempleVisitors({...visitor,root:onlineRoot,praying:rig.root,detailedVisitors:{updateRemote(id,root,frame){detailedFrames.push({...frame});return true},removeRemote:id=>removedPeers.push(id)}})
 const peer={id:'peer-bowing-1234',name:'Khách thử',color:0,appearance:'female',x:2,z:20,yaw:0,space:'courtyard',moving:false,pose:'bowing',bowProgress:.6}
 const position=new THREE.Vector3(0,0,20)
 online.update([peer],'courtyard',position,.016,1,false)
 const first=detailedFrames.at(-1).progress
 assert.ok(first>0&&first<peer.bowProgress,'GLB does not jump directly to a newly received bow packet')
 online.update([peer],'courtyard',position,.016,1.016,false)
 assert.ok(detailedFrames.at(-1).progress>first&&detailedFrames.at(-1).progress<peer.bowProgress,'GLB progresses smoothly between network packets')
 online.update([peer],'courtyard',position,.016,1.032,true)
 assert.equal(detailedFrames.at(-1).progress,peer.bowProgress,'Reduced motion does not interpolate idle or pose movement')
 online.update([{...peer,pose:'standing',bowProgress:.9}],'courtyard',position,.016,2,false)
 assert.equal(detailedFrames.at(-1).progress,0,'Leaving a bow clears progress before the next ritual')
 online.update([],'courtyard',position,.016,3,false)
 assert.deepEqual(removedPeers,[peer.id]);assert.equal(onlineRoot.children.length,0)
 online.dispose()
}finally{if(originalDocument===undefined)delete globalThis.document;else globalThis.document=originalDocument}

// Beveled architecture must still merge with round timber; mixed index formats hid columns.
const {createTempleBoxGeometry}=await import('../src/components/templeWorldScene.js')
const {mergeGeometries}=await import('three/addons/utils/BufferGeometryUtils.js')
for(const dimensions of [[2,.025,3],[.5,4,.8],[.035,1.65,.14]]){
 const box=createTempleBoxGeometry(...dimensions),column=new THREE.CylinderGeometry(.14,.19,3,12)
 const merged=mergeGeometries([box,column],false)
 assert.ok(merged,'Beveled timber and columns must merge without disappearing')
 assert.equal(merged.index.count,box.index.count+column.index.count,'Both geometries survive merging')
 assert.ok([...merged.attributes.position.array].every(Number.isFinite),'Bevel geometry is finite')
 box.dispose();column.dispose();merged.dispose()
}

await import('./temple-foliage.mjs')

await import('./temple-incense.mjs')

await import('./temple-bell.mjs')
