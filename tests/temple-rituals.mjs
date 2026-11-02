import assert from 'node:assert/strict'
import * as THREE from 'three'
import {bowFrame,BOW_DURATION,meditationSeconds} from '../src/data/templeRituals.js'
import {createTempleBowRig,bindTempleBowRig} from '../src/components/templeBowRig.js'
assert.equal(BOW_DURATION,12000)
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
const rig=createTempleBowRig({sphere,cylinder},parent),clone=rig.root.clone(true),remote=bindTempleBowRig(clone)
let frames=0
for(let i=0;i<=240;i++){
 const p=i/240;assert.equal(rig.apply(p),remote.apply(p));rig.root.updateMatrixWorld(true);clone.updateMatrixWorld(true)
 rig.root.traverse(o=>{assert.ok(o.matrixWorld.elements.every(Number.isFinite),'Tư thế không có ma trận NaN');if(o.isMesh){const v=new THREE.Vector3(),a=o.geometry.attributes.position;for(let j=0;j<a.count;j++){v.fromBufferAttribute(a,j).applyMatrix4(o.matrixWorld);assert.ok(v.y>=-.001,'Đỉnh mesh không xuyên sàn')}}})
 const box=new THREE.Box3().setFromObject(rig.root);assert.ok(box.max.y<1.8,'Không nhảy cao khi cúi')
 assert.ok(new THREE.Box3().setFromObject(clone).equals(box),'Khách online có cùng động tác');frames++
}
console.log('Hành lễ: ba lạy/12 giây, các nhịp chắp tay/cúi/nâng người, '+frames+' khung rig và bản sao, đồng hồ thiền pass.')
