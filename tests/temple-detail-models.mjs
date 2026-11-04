import assert from 'node:assert/strict'
import fs from 'node:fs'
import {createHash} from 'node:crypto'
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {prepareTempleVisitorClothing} from '../src/components/templeVisitorClothing.js'
import {createDetailedVisitor,createDetailedVisitors} from '../src/components/templeDetailedVisitors.js'
import {fitTempleModel} from '../src/components/templeModels.js'
import {TEMPLE_DETAIL_CREDITS} from '../src/data/templeDetailCredits.js'
const manifest=JSON.parse(fs.readFileSync(new URL('../public/dichua/models/detail-manifest.json',import.meta.url)))
assert.equal(manifest.length,10);assert.deepEqual(manifest.map(a=>a.file),TEMPLE_DETAIL_CREDITS.map(a=>a.file))
function geometryOnly(b){
 const n=b.readUInt32LE(12),j=JSON.parse(b.toString('utf8',20,20+n)),bin=b.subarray(28+n)
 assert.ok(j.images?.length,'Models retain texture images')
 delete j.images;delete j.textures;delete j.materials
 for(const m of j.meshes)for(const p of m.primitives)delete p.material
 const jb=Buffer.from(JSON.stringify(j)),pad=(4-jb.length%4)%4,h=Buffer.alloc(20),bh=Buffer.alloc(8)
 h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(28+jb.length+pad+bin.length,8);h.writeUInt32LE(jb.length+pad,12);h.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bin.length,0);bh.writeUInt32LE(0x004e4942,4)
 const out=Buffer.concat([h,jb,Buffer.alloc(pad,32),bh,bin]);return out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength)
}
let visitor;const variants=[]
for(const a of manifest){
 const b=fs.readFileSync(new URL('../public/dichua/models/'+a.file,import.meta.url))
 assert.equal(b.length,a.bytes);assert.equal(createHash('sha256').update(b).digest('hex'),a.sha256)
 assert.ok(a.licenseEvidence&&a.source&&a.download&&a.changes);assert.ok(b.length<2_500_000)
 const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(geometryOnly(b),'')
 const bounds=new THREE.Box3().setFromObject(gltf.scene);assert.ok(Number.isFinite(bounds.min.length()+bounds.max.length()))
 if(a.file.startsWith('visitor-')){visitor=gltf.scene;visitor.animations=gltf.animations;variants.push(visitor);assert.ok(gltf.animations.some(a=>/walk/i.test(a.name)))}
 else {const fitted=fitTempleModel(gltf.scene,{height:6,width:8,depth:5}),size=new THREE.Box3().setFromObject(fitted).getSize(new THREE.Vector3());for(const [value,expected]of [[size.x,8],[size.y,6],[size.z,5]])assert.ok(Math.abs(value-expected)<.001)}
}
for(const visitor of variants){
const sourceHeight=new THREE.Box3().setFromObject(visitor).getSize(new THREE.Vector3()).y
prepareTempleVisitorClothing(visitor)
const garment=visitor.getObjectByName('Ao lam garment');assert.ok(garment?.isSkinnedMesh,'Separate full-length skinned outfit')
assert.equal(garment.material[0].userData.visitorClothing,'ao-lam');assert.equal(garment.material[1].userData.visitorClothing,'trousers');assert.equal(garment.material[0].map,null)
assert.equal(garment.geometry.groups.reduce((n,g)=>n+g.count,0),garment.geometry.index.count)
const geometry=garment.geometry
assert.ok(garment.material.every(m=>m.userData.visitorClothing),'Mọi vật liệu trang phục, kể cả nẹp/cổ, phải tách khỏi da/tóc')
// Một thành phần liên thông ở thân–nách–tay, kể cả các đỉnh trùng tại đường UV.
const parent=Array.from({length:geometry.attributes.position.count},(_,i)=>i)
function leader(id){while(parent[id]!==id){parent[id]=parent[parent[id]];id=parent[id]}return id}
function join(a,b){parent[leader(a)]=leader(b)}
for(const [a,b]of geometry.userData.clothSeams)join(a,b)
const shirtGroups=geometry.groups.filter(g=>g.materialIndex===0),shirtVertices=new Set(),edges=new Map()
for(const group of shirtGroups)for(let i=group.start;i<group.start+group.count;i+=3){
 const ids=[0,1,2].map(k=>geometry.index.getX(i+k));ids.forEach(id=>shirtVertices.add(id));join(ids[0],ids[1]);join(ids[1],ids[2])
}
assert.equal(new Set([...shirtVertices].map(leader)).size,1,'Thân và hai tay áo phải được may liền bằng topology')
// Kiểm riêng đường biên, không dùng kết quả liên thông (nó đã gộp toàn bộ thân áo).
const weld=Array.from({length:parent.length},(_,i)=>i),canonical=id=>{while(weld[id]!==id)id=weld[id];return id}
for(const [a,b]of geometry.userData.clothSeams)weld[canonical(a)]=canonical(b)
for(const group of shirtGroups)for(let i=group.start;i<group.start+group.count;i+=3){
 const ids=[0,1,2].map(k=>canonical(geometry.index.getX(i+k)))
 for(let k=0;k<3;k++){const a=ids[k],b=ids[(k+1)%3],key=a<b?a+':'+b:b+':'+a;edges.set(key,(edges.get(key)||0)+1)}
}
const baseBounds=new THREE.Box3().setFromObject(visitor),basePoint=new THREE.Vector3()
for(const [key,count]of edges)if(count===1){
 const ids=key.split(':').map(Number),points=ids.map(id=>new THREE.Vector3().fromBufferAttribute(geometry.attributes.position,id)),y=points.reduce((n,p)=>n+(p.y-baseBounds.min.y)/sourceHeight,0)/2
 assert.ok(y<.69||y>.80,'Không được có biên hở trong vùng vai–nách: '+y)
}
// Mỗi tiết diện tay chạy đúng một vòng; chiếu lỗ nách sai sẽ tạo nửa vòng gập ngược.
const torsoVertices=new Set(geometry.index.array.slice(shirtGroups[0].start,shirtGroups[0].start+shirtGroups[0].count))
for(const group of shirtGroups.slice(1)){
 const ids=[...new Set([...geometry.index.array.slice(group.start,group.start+group.count)])].filter(id=>!torsoVertices.has(id)&&Math.abs(geometry.attributes.uv.getY(id)-.5)<1e-5).sort((a,b)=>geometry.attributes.uv.getX(a)-geometry.attributes.uv.getX(b))
 assert.ok(ids.length>=16)
 const points=ids.map(id=>new THREE.Vector3().fromBufferAttribute(geometry.attributes.position,id)),center=points.reduce((sum,p)=>sum.add(p),new THREE.Vector3()).divideScalar(points.length),area=new THREE.Vector3(),turns=[]
 for(let j=0;j<points.length;j++){const turn=new THREE.Vector3().crossVectors(points[j].clone().sub(center),points[(j+1)%points.length].clone().sub(center));turns.push(turn);area.add(turn)}
 assert.ok(turns.every(turn=>turn.dot(area)>0),'Tiết diện tay áo không tự gập/xoắn')
}
// Front fastenings must remain a sewn layer, not a rigid bar floating away from the chest.
const torsoGroup=geometry.groups[0],frontGroup=geometry.groups.at(-1),frontVertices=[...new Set([...geometry.index.array.slice(frontGroup.start,frontGroup.start+frontGroup.count)])]
const sampleVertices=frontVertices.filter((_id,i)=>i<66||i%7===0),closest=new THREE.Vector3(),point=new THREE.Vector3()
function checkTrim(at,height,label){
 const triangles=[]
 for(let i=torsoGroup.start;i<torsoGroup.start+torsoGroup.count;i+=3)triangles.push(new THREE.Triangle(at(geometry.index.getX(i)),at(geometry.index.getX(i+1)),at(geometry.index.getX(i+2))))
 for(const id of sampleVertices){point.copy(at(id));let distance=Infinity;for(const tri of triangles){tri.closestPointToPoint(point,closest);distance=Math.min(distance,point.distanceTo(closest))}assert.ok(distance<height*.006,'Front trim must stay within sewing thickness of the shirt ('+label+'): '+distance/height)}
}
for(const morph of [null,...geometry.morphAttributes.position]){
 const at=id=>{const p=new THREE.Vector3().fromBufferAttribute(geometry.attributes.position,id);if(morph)p.add(new THREE.Vector3().fromBufferAttribute(morph,id));return p}
 checkTrim(at,sourceHeight,morph?.name||'rest')
}
assert.equal(geometry.morphAttributes.position.length,5);assert.equal(geometry.morphAttributes.normal.length,5)
for(const attributes of [geometry.attributes.position,...geometry.morphAttributes.position,...geometry.morphAttributes.normal])assert.ok([...attributes.array].every(Number.isFinite),'Crease geometry and normals are finite')
for(const attributes of [geometry.attributes.position,...geometry.morphAttributes.position])for(const [a,b]of geometry.userData.clothSeams){const pa=new THREE.Vector3().fromBufferAttribute(attributes,a),pb=new THREE.Vector3().fromBufferAttribute(attributes,b);assert.ok(pa.distanceTo(pb)<1e-6,'UV seam cannot open as cloth bends')}
const sw=geometry.attributes.skinWeight
for(let i=0;i<sw.count;i++)assert.ok(Math.abs(sw.getX(i)+sw.getY(i)+sw.getZ(i)+sw.getW(i)-1)<1e-5,'Garment skin weights are normalized')
const root=new THREE.Group(),local=createDetailedVisitor(visitor,root),remote=createDetailedVisitor(visitor,new THREE.Group())
assert.notEqual(local.bones.get('Hips'),remote.bones.get('Hips'),'Online skeletons are independent')
const localCloth=local.model.getObjectByName('Ao lam garment'),remoteCloth=remote.model.getObjectByName('Ao lam garment')
assert.equal(localCloth.geometry,remoteCloth.geometry,'Visitors share immutable cloth geometry')
assert.notEqual(localCloth.morphTargetInfluences,remoteCloth.morphTargetInfluences,'Cloth state is independent per visitor')
local.update({pose:'standing',time:1,reduced:true})
local.root.updateMatrixWorld(true)
for(const group of geometry.groups.filter(g=>g.materialIndex===2)){
 const shoeBounds=new THREE.Box3()
 for(let i=group.start;i<group.start+group.count;i++)shoeBounds.expandByPoint(localCloth.getVertexPosition(geometry.index.getX(i),basePoint).applyMatrix4(localCloth.matrixWorld))
 const shoeSize=shoeBounds.getSize(new THREE.Vector3())
 assert.ok(shoeSize.y<Math.max(shoeSize.x,shoeSize.z)*.8,'Giày phải dài theo gót–mũi thay vì dựng đứng: '+JSON.stringify(shoeBounds))
 assert.ok(shoeBounds.min.y>=-.005&&shoeBounds.min.y<.035,'Đế giày đứng chạm gần mặt sàn: '+shoeBounds.min.y)
}
const neutral=localCloth.morphTargetInfluences.slice(),head=local.bones.get('Head').quaternion.toArray()
local.update({pose:'standing',time:70,reduced:true});assert.deepEqual(localCloth.morphTargetInfluences,neutral);assert.deepEqual(local.bones.get('Head').quaternion.toArray(),head,'Reduced motion disables idle movement')
const left=local.bones.get('LeftFoot').getWorldPosition(new THREE.Vector3()),right=local.bones.get('RightFoot').getWorldPosition(new THREE.Vector3())
assert.ok(Math.abs(left.z-right.z)>.03,'Relaxed stance staggers the feet')
for(let i=0;i<40;i++)local.update({pose:'meditating',dt:.016,time:i/60})
assert.ok(local.bones.get('Hips').getWorldPosition(new THREE.Vector3()).y<.36,'Thiền hạ hông xuống dáng ngồi')
assert.ok(localCloth.morphTargetInfluences[localCloth.morphTargetDictionary.kneeFold]>.9,'Bent knees gather trouser fabric')
assert.ok(localCloth.morphTargetInfluences[localCloth.morphTargetDictionary.seatedDrape]>.9,'Seated tunic drapes over the legs')
assert.ok(remoteCloth.morphTargetInfluences.every(v=>v===0),'Updating one visitor cannot animate another visitor cloth')
for(const pose of ['standing','meditating','bowing'])for(let i=0;i<=24;i++){
 local.update({pose,progress:i/24,time:i/10,dt:.016});local.root.updateMatrixWorld(true)
 let min=Infinity,max=-Infinity
 local.model.traverse(o=>{assert.ok(o.matrixWorld.elements.every(Number.isFinite));if(o.isSkinnedMesh){o.computeBoundingBox();const b=o.boundingBox.clone().applyMatrix4(o.matrixWorld);min=Math.min(min,b.min.y);max=Math.max(max,b.max.y)}})
 assert.ok(max<2.1&&min>=-.005,pose+' bounds '+min+' '+max)
 if(i===12||i===24)checkTrim(id=>localCloth.getVertexPosition(id,new THREE.Vector3()).applyMatrix4(localCloth.matrixWorld),1.75,pose+' skinned')
}
for(let i=0;i<80;i++){
 local.update({moving:true,dt:.016});local.root.updateMatrixWorld(true)
 local.model.traverse(o=>{if(o.isSkinnedMesh){o.computeBoundingBox();const b=o.boundingBox.clone().applyMatrix4(o.matrixWorld);assert.ok(b.min.y>-.06&&b.max.y<2.1,'Walk remains near the floor '+b.min.y+' '+b.max.y)}})
 if(i===20||i===60)checkTrim(id=>localCloth.getVertexPosition(id,new THREE.Vector3()).applyMatrix4(localCloth.matrixWorld),1.75,'Walk skinned')
}
local.update({pose:'bowing',progress:0,reduced:true});local.root.updateMatrixWorld(true)
const headY=local.bones.get('Head').getWorldPosition(new THREE.Vector3()).y
for(const name of ['LeftHand','RightHand'])assert.ok(local.bones.get(name).getWorldPosition(new THREE.Vector3()).y<headY-.1,'Prayer hands stay below the face')
local.update({pose:'bowing',progress:.5});local.update({moving:true,dt:.016});assert.equal(local.root.position.y,.012,'Walking after interrupting a bow resets ground offset')
local.update({pose:'standing'});assert.ok([...local.bones.values()].every(b=>b.quaternion.toArray().every(Number.isFinite)))
local.dispose();remote.dispose();assert.equal(root.children.length,0)
}
console.log('Model chi tiết: 10 GLB/texture/giấy phép/checksum, tỷ lệ vỏ điện, skeleton độc lập, 150 khung đứng/thiền/lạy và 160 khung Walk cho 2 nhân vật pass.')

const fallback=new THREE.Group(),failed=createDetailedVisitors({load:async()=>{throw Error('offline')}},new THREE.Group(),[fallback])
assert.equal(await failed.ready,false);assert.equal(failed.updateSelf({}),false);assert.equal(fallback.visible,true,'Model load failure retains the procedural fallback');failed.dispose()
let release;const lateRoot=new THREE.Group(),late=createDetailedVisitors({load:()=>new Promise(resolve=>{release=resolve})},lateRoot,[])
late.dispose();release(visitor);await late.ready;assert.equal(lateRoot.children.length,0,'Late loading after unmount cannot add a skeleton')

const requestedFiles=[],selectedRoot=new THREE.Group(),selected=createDetailedVisitors({load:async file=>{requestedFiles.push(file);return variants[file==='visitor-female-human'?1:0]}},selectedRoot,[])
await selected.ready;assert.equal(selected.updateSelf({appearance:'male'}),true);assert.equal(selected.appearance,'male')
selected.updateSelf({appearance:'female'});await Promise.resolve();await Promise.resolve();assert.equal(selected.updateSelf({appearance:'female'}),true);assert.equal(selected.appearance,'female');assert.equal(selectedRoot.children.length,1,'Switching avatar removes the old skeleton')
assert.deepEqual(requestedFiles,['visitor-male','visitor-female-human'],'Female appearance requests the authored humanoid outfit, male retains reviewed source')
const peerRoot=new THREE.Group();assert.equal(selected.updateRemote('peer',peerRoot,{appearance:'male'}),true);assert.equal(selected.updateRemote('peer',peerRoot,{appearance:'female'}),true);assert.equal(peerRoot.children.length,1);selected.removeRemote('peer');assert.equal(peerRoot.children.length,0);selected.dispose();assert.equal(selectedRoot.children.length,0)
