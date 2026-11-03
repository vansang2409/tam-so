import assert from 'node:assert/strict'
import fs from 'node:fs'
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {fitTempleModel} from '../src/components/templeModels.js'
import {createTempleIncense} from '../src/components/templeIncense.js'
import {createTempleFurnishings} from '../src/components/templeFurnishings.js'
import {createTempleDetails} from '../src/components/templeDetails.js'
import {WORLD_SPOTS,WORLD_OBSTACLES} from '../src/data/templeWorld.js'

const scene=new THREE.Group(),fallback=new THREE.Group(),outside=new THREE.Group(),inside=new THREE.Group(),texture=new THREE.Texture()
scene.add(fallback);fallback.add(outside);scene.add(inside);outside.position.set(4,0,8);inside.position.set(2,1,-3);inside.scale.setScalar(.7)
let textureDisposed=0,spriteGeometryDisposed=0,materialsDisposed=0
texture.addEventListener('dispose',()=>textureDisposed++)
const incense=createTempleIncense(scene,texture),outsideAnchor=incense.register('hall','outside',outside,{y:1.57}),insideAnchor=incense.register('hall','inside',inside,{y:.785,ceiling:2})
assert.equal(incense.root.children.length,5,'Inside and outside share one bounded pool')
const geometry=incense.root.children[0].geometry;geometry.addEventListener('dispose',()=>spriteGeometryDisposed++)
for(const puff of incense.root.children)puff.material.addEventListener('dispose',()=>materialsDisposed++)
const lit=new Set(['hall'])
assert.equal(incense.update(new Set(),null,1).visiblePuffs,0,'Unlit locations emit nothing')
fallback.visible=false;scene.updateMatrixWorld(true)
assert.equal(incense.update(lit,null,1).visiblePuffs,5,'A hidden architectural fallback cannot hide the independent smoke pool')
assert.ok(incense.root.visible&&incense.root.parent===scene)
const firstOutside=incense.root.children[0].getWorldPosition(new THREE.Vector3()),expectedOutside=outsideAnchor.getWorldPosition(new THREE.Vector3())
assert.ok(Math.abs(firstOutside.x-expectedOutside.x)<.04&&firstOutside.y>=expectedOutside.y)
incense.update(lit,'hall',1)
const firstInside=incense.root.children[0].getWorldPosition(new THREE.Vector3()),expectedInside=insideAnchor.getWorldPosition(new THREE.Vector3())
assert.ok(Math.abs(firstInside.x-expectedInside.x)<.04&&Math.abs(firstInside.z-expectedInside.z)<.03,'Smoke follows the selected inside anchor and vessel world scale')
assert.ok(Math.abs(expectedInside.y-(1+.785*.7))<1e-6,'The actual vessel scale determines the tip height')
const mergedMesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial());inside.add(mergedMesh);mergedMesh.removeFromParent();mergedMesh.geometry.dispose();mergedMesh.material.dispose()
incense.update(lit,'hall',1);assert.ok(insideAnchor.parent===inside&&insideAnchor.getWorldPosition(new THREE.Vector3()).distanceTo(expectedInside)<1e-8,'Removing static vessel meshes leaves its emitter transform intact')
for(const time of [0,.5,1,3,5,10,100]){
  incense.update(lit,'hall',time)
  for(const puff of incense.root.children){const p=puff.getWorldPosition(new THREE.Vector3());assert.ok(p.y+puff.scale.y/2<2,'Smoke remains below the inside ceiling');assert.ok(puff.material.opacity>=0&&puff.material.opacity<=.2,'Smoke has a faint, finite opacity envelope')}
}
incense.update(lit,'hall',1,{reduced:true});const fixed=incense.root.children.map(p=>[...p.position.toArray(),...p.scale.toArray(),p.material.opacity])
incense.update(lit,'hall',100,{reduced:true});assert.deepEqual(incense.root.children.map(p=>[...p.position.toArray(),...p.scale.toArray(),p.material.opacity]),fixed,'Reduced motion freezes smoke rather than drifting by wall time')
assert.equal(incense.update(lit,'hall',1,{quality:'low'}).visiblePuffs,2,'Low quality caps each location to two existing sprites')
incense.register('hall','inside',inside,{y:.785,ceiling:2});assert.equal(incense.root.children.length,5,'Retargeting does not allocate another particle pool')
assert.equal(inside.children.includes(insideAnchor),false,'Retargeting detaches the old anchor')
incense.register('unknown-inside','outside',outside,{y:1.57});assert.equal(incense.update(new Set(['unknown-inside']),'unknown-inside',1).visiblePuffs,0,'No inside anchor means no phantom smoke at an unverified altar')
for(const puff of incense.root.children.slice(5))puff.material.addEventListener('dispose',()=>materialsDisposed++)
incense.register('hall','inside',inside,{y:.785,ceiling:1.6});assert.equal(incense.update(lit,'hall',1).visiblePuffs,0,'A ceiling too close to the tip cannot push smoke through the roof')
assert.equal(incense.register('hall','roof',outside,{y:1}),null)
incense.dispose();incense.dispose();assert.equal(incense.root.parent,null);assert.equal(incense.root.children.length,0);assert.equal(materialsDisposed,10)
assert.equal(textureDisposed,0,'The caller keeps ownership of the shared smoke texture');assert.equal(spriteGeometryDisposed,0,'Engine-shared sprite geometry is never disposed by a pool')
assert.equal(incense.update(lit,'hall',1).visiblePuffs,0);assert.equal(incense.register('late','outside',outside),null)

const mats=new Map(),mat=c=>{if(!mats.has(c))mats.set(c,new THREE.MeshStandardMaterial({color:c}));return mats.get(c)}
const mesh=(g,c,x,y,z,p)=>{const m=new THREE.Mesh(g,mat(c));m.position.set(x,y,z);p.add(m);return m}
const box=(w,h,d,c,x,y,z,p)=>mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,p)
const cylinder=(a,b,h,c,x,y,z,p,n=8)=>mesh(new THREE.CylinderGeometry(a,b,h,n),c,x,y,z,p)
const sphere=(r,c,x,y,z,p,sx=1,sy=1,sz=1)=>{const m=mesh(new THREE.SphereGeometry(r,8,6),c,x,y,z,p);m.scale.set(sx,sy,sz);return m}
const beam=(a,b,r,c,p)=>{const m=cylinder(r,r,a.distanceTo(b),c,...a.clone().add(b).multiplyScalar(.5).toArray(),p);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());return m}
const models={place(file,p,options,fallback){const g=new THREE.Group();g.userData.asset={file,options};g.position.set(...(options.position||[0,0,0]));if(fallback)g.add(fallback);p.add(g);return g}}
const callbacks=[],fixtures=[],details=createTempleDetails({box,cylinder,sphere,mesh,beam,mat,label(){},lantern(){},animated:{bells:[]},models,incense:{register(...args){callbacks.push(args)}}})
for(const id of ['chanh-dien','dien-ngoc-hoang','trung-dien-duoc-su']){
  const s=WORLD_SPOTS.find(p=>p.id===id),room=new THREE.Group();room.position.set(s.x,0,s.centerZ)
  fixtures.push(room)
  details.decorate(s,room,s.width,s.depth,s.architecture.height)
  const registration=callbacks.find(c=>c[0]===id)
  if(id==='trung-dien-duoc-su'){assert.equal(registration,undefined,'A scanned altar without a verified vessel must not invent an emitter');continue}
  assert.equal(registration[1],'inside');assert.equal(registration[4],undefined)
  const [, ,vessel,options]=registration,tip=vessel.localToWorld(new THREE.Vector3(options.x,options.y,options.z))
  const base=vessel.getWorldPosition(new THREE.Vector3()),tops=[]
  room.updateMatrixWorld(true)
  room.traverse(o=>{if(o.isMesh&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height<=.1){const b=new THREE.Box3().setFromObject(o);if(base.x>=b.min.x&&base.x<=b.max.x&&base.z>=b.min.z&&base.z<=b.max.z&&b.max.y<=base.y+.05)tops.push(b.max.y)}})
  const expected=id==='chanh-dien'?new THREE.Vector3(0,Math.max(...tops)+options.y*vessel.scale.y,-4.8):new THREE.Vector3(-13,Math.max(...tops)+options.y*vessel.scale.y,-12.28)
  assert.ok(tip.distanceTo(expected)<1e-6,'Registered emitter matches the actual offering vessel, including its .7 scale')
  assert.equal(options.ceiling,s.architecture.height)
}

// The real scanned cushion projected in front of the old procedural censer.
// Bounds-only room tests missed this occlusion, so exercise its actual triangles.
const bytes=fs.readFileSync(new URL('../public/dichua/models/altar.glb',import.meta.url))
const scanned=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'')
const mainRoom=fixtures[0];let scannedAnchor,table
mainRoom.traverse(o=>{
  if(o.userData.asset?.file==='altar')scannedAnchor=o
  if(o.isMesh&&o.geometry.type==='BoxGeometry'){
    const p=o.geometry.parameters
    if(Math.abs(p.width-5.58)<1e-6&&Math.abs(p.depth-.96)<1e-6)table=o
  }
})
assert.ok(scannedAnchor&&table,'The main hall has its scanned altar and supported frontal offering table')
const actual=fitTempleModel(scanned.scene,scannedAnchor.userData.asset.options);scannedAnchor.add(actual)
actual.traverse(o=>{if(o.isMesh)o.material.side=THREE.DoubleSide});mainRoom.updateMatrixWorld(true)
const mainVessel=callbacks.find(c=>c[0]==='chanh-dien')[2],vesselBounds=new THREE.Box3().setFromObject(mainVessel),scannedBounds=new THREE.Box3().setFromObject(actual),tableBounds=new THREE.Box3().setFromObject(table),center=mainVessel.getWorldPosition(new THREE.Vector3())
assert.ok(vesselBounds.min.z>scannedBounds.max.z+.01,'The entire censer, not only the smoke anchor, clears the scanned cushion')
assert.ok(vesselBounds.min.x>=tableBounds.min.x&&vesselBounds.max.x<=tableBounds.max.x&&vesselBounds.min.z>=tableBounds.min.z&&vesselBounds.max.z<=tableBounds.max.z,'The moved censer stays fully above the offering tabletop')
assert.ok(WORLD_OBSTACLES.some(([x1,x2,z1,z2])=>x1<=tableBounds.min.x&&x2>=tableBounds.max.x&&z1<=tableBounds.min.z&&z2>=tableBounds.max.z),'Existing altar collision still encloses the whole moved table')
let oldOccluded=false
for(const x of [-.042,0,.042])for(const y of [1.58,1.73,1.8155]){
  const ray=new THREE.Raycaster(new THREE.Vector3(center.x+x,y,3),new THREE.Vector3(0,0,-1)),first=ray.intersectObject(actual,true)[0]
  assert.ok(!first||first.point.z<center.z-.01,'The scanned altar no longer occludes a front view of the incense sticks')
  if(first&&first.point.z>center.z-.35)oldOccluded=true
}
assert.ok(oldOccluded,'The previous 35cm-rearward placement really was occluded by scanned triangles')
let cups=0
mainRoom.traverse(o=>{
  const p=o.geometry?.parameters?.points
  if(o.isMesh&&o.geometry.type==='LatheGeometry'&&p?.length===3&&p[0].x===.032){
    const b=new THREE.Box3().setFromObject(o);assert.ok(b.min.x>=tableBounds.min.x&&b.max.x<=tableBounds.max.x&&b.min.z>=tableBounds.min.z&&b.max.z<=tableBounds.max.z,'Offering cups move with the cluster and cannot overhang the tabletop');cups++
  }
})
assert.equal(cups,6,'Both rows of offering cups remain on the frontal table')
const legacy=createTempleFurnishings({box,cylinder,sphere,mesh,beam,mat,label(){},curve(){},models})
const legacyRoot=new THREE.Group();fixtures.push(legacyRoot)
assert.ok(legacy.vessel(0,0,0,legacyRoot).isGroup,'Optional registration preserves legacy furnishing callers')
const resources=new Set();for(const root of [scene,...fixtures])root.traverse(o=>{if(o.geometry)resources.add(o.geometry)});resources.forEach(g=>g.dispose());mats.forEach(m=>m.dispose())
scanned.scene.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()})
console.log('Incense: pooled inside/outside anchors, actual vessel transforms, hidden fallback, reduced/low/ceiling bounds, missing-anchor safety and cleanup pass.')
