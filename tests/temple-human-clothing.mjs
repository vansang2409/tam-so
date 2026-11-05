import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {createDetailedVisitor} from '../src/components/templeDetailedVisitors.js'

// Camera witness from the actual V8 Idle exposure, not an assertion about weights.
// Frozen Node-controller replay cf75137a..., source public V8 5b6b63d5....
// Blender world (x,y,z) -> Three world (x,z,-y). The before ray hits skin;
// the corrected garment must become the first visible surface at this same pose.
const witness={
 sourceClipTime:2.5648067705333233,
 origin:[1.0216224193572998,1.3131364583969116,2.9680752754211426],
 direction:[-0.28720152378082275,-0.031911224126815796,-0.9573385119438171],
 maxDistance:4,
}
const started=performance.now()
const file=process.argv[2]?path.resolve(process.argv[2]):new URL('../public/dichua/models/visitor-female-human.glb',import.meta.url)
const raw=fs.readFileSync(file),length=raw.readUInt32LE(12),json=JSON.parse(raw.toString('utf8',20,20+length)),binary=raw.subarray(28+length)
delete json.images;delete json.textures
for(const material of json.materials){
 delete material.normalTexture;delete material.occlusionTexture;delete material.emissiveTexture
 delete material.pbrMetallicRoughness?.baseColorTexture;delete material.pbrMetallicRoughness?.metallicRoughnessTexture
}
const text=Buffer.from(JSON.stringify(json)),pad=(4-text.length%4)%4,header=Buffer.alloc(20),binHeader=Buffer.alloc(8)
header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+text.length+pad+binary.length,8);header.writeUInt32LE(text.length+pad,12);header.writeUInt32LE(0x4e4f534a,16)
binHeader.writeUInt32LE(binary.length);binHeader.writeUInt32LE(0x004e4942,4)
const bytes=Buffer.concat([header,text,Buffer.alloc(pad,32),binHeader,binary])
const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length),'')
gltf.scene.animations=gltf.animations
assert.equal(gltf.scene.userData.templeRig,'mpfb-gameengine','The regression targets the authored human rig')
assert.equal(gltf.scene.userData.templeCharacterProfile,'female-human-v1','Actor phase must follow the actual human controller')
const idle=gltf.animations.find(clip=>/^Idle$/i.test(clip.name));assert.ok(idle?.duration>witness.sourceClipTime,'Actual retargeted Idle clip is required')
const parent=new THREE.Group()
function prepare(rig){
 parent.updateMatrixWorld(true)
 const meshes=[];let body
 rig.model.traverse(mesh=>{
  if(!mesh.isSkinnedMesh)return
  mesh.skeleton.update()
  // Posed bounds are required: rest/A-pose bounds can reject a valid skin ray.
  mesh.computeBoundingBox();mesh.computeBoundingSphere();meshes.push(mesh)
  if(mesh.material.userData.templePart==='skin')body=mesh
 })
 assert.ok(body,'The semantic body skin remains available for the visibility oracle')
 return{rig,meshes,body}
}
function actorAt(mode,sourceTime,completeCycle=false){
 const rig=createDetailedVisitor(gltf.scene,parent)
 const clip=gltf.animations.find(candidate=>candidate.name===mode)
 assert.ok(clip?.duration>0,`Actual ${mode} animation is required`)
 const seed=parseInt(rig.root.uuid.slice(0,8),16)/0x100000000
 const delta=(sourceTime-seed*clip.duration+clip.duration)%clip.duration+(completeCycle?clip.duration:0)
 let elapsed=delta
 if(mode==='Walk'){
  // Invert cadence smoothing only to place this fixture at the requested clip
  // phase. One complete cycle also settles the Idle/Walk transition blend.
  const fit=gltf.scene.userData.templeFitBounds
  const height=fit?fit[4]-fit[1]:new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3()).y
  const scale=gltf.scene.userData.templeHeight/height
  assert.ok(Number.isFinite(scale)&&scale>0&&gltf.scene.userData.templeWalkSpeed>0,'Cadence metadata is finite and positive')
  const target=THREE.MathUtils.clamp(1.35/(gltf.scene.userData.templeWalkSpeed*scale),.65,1.8)
  let lower=0,upper=delta*2+2
  for(let iteration=0;iteration<60;iteration++){
   const mid=(lower+upper)/2
   const advance=mid*THREE.MathUtils.lerp(1,target,1-Math.exp(-mid*8))
   if(advance<delta)lower=mid;else upper=mid
  }
  elapsed=(lower+upper)/2
 }
 rig.update({pose:'standing',moving:mode==='Walk',speed:1.35,reduced:false,time:elapsed,dt:elapsed})
 return prepare(rig)
}
function cast(origin,direction,far,meshes){return new THREE.Raycaster(origin,direction,0,far).intersectObjects(meshes,false)}
const origin=new THREE.Vector3(...witness.origin),direction=new THREE.Vector3(...witness.direction).normalize()
const initial=actorAt('Idle',witness.sourceClipTime)
try{
 const hits=cast(origin,direction,witness.maxDistance,initial.meshes)
 const first=hits[0],part=first?.object.material.userData.templePart
 assert.ok(first,'The fixed outside camera witness must intersect the actor')
 assert.equal(part,'shirt',`Idle underarm exposure: first visible surface is ${part||first.object.name} at ${first.distance.toFixed(6)}m; the shirt must cover the known skin patch`)
 // Calibrate the body triangle independently of the outer garment. Its index is
 // looked up per asset, so optimization/vertex reordering cannot silently retarget it.
 const bodyHit=cast(origin,direction,witness.maxDistance,[initial.body])[0]
 assert.ok(bodyHit,'The diagnostic camera must also locate the underlying body')
 assert.ok(first.distance<bodyHit.distance,'The shirt must lie in front of the body on the diagnostic sightline')
 const ids=[bodyHit.face.a,bodyHit.face.b,bodyHit.face.c]
 const vertices=ids.map(id=>initial.body.getVertexPosition(id,new THREE.Vector3()).applyMatrix4(initial.body.matrixWorld))
 const barycentric=new THREE.Triangle(...vertices).getBarycoord(bodyHit.point,new THREE.Vector3())
 assert.ok(barycentric?.toArray().every(Number.isFinite),'The known body point has finite barycentric coordinates')
 let verified=1,selfOccluded=0
 const verifiedByMode={Idle:1,Walk:0}
 for(const mode of ['Idle','Walk'])for(let frame=0;frame<12;frame++){
  if(mode==='Idle'&&frame===0)continue // Reuse the camera/body pair above: 48 rays maximum in total.
  const clip=gltf.animations.find(candidate=>candidate.name===mode)
  assert.ok(clip?.duration>0,`Actual ${mode} animation is required for tracked visibility`)
  const actor=actorAt(mode,clip.duration*frame/12,true)
  try{
   const points=ids.map(id=>actor.body.getVertexPosition(id,new THREE.Vector3()).applyMatrix4(actor.body.matrixWorld))
   const triangle=new THREE.Triangle(...points),normal=triangle.getNormal(new THREE.Vector3())
   const point=points[0].clone().multiplyScalar(barycentric.x).addScaledVector(points[1],barycentric.y).addScaledVector(points[2],barycentric.z)
   assert.ok([...point.toArray(),...normal.toArray()].every(Number.isFinite)&&normal.lengthSq()>.99,'The tracked posed skin point and normal remain valid')
   const outside=point.clone().addScaledVector(normal,.08),inward=normal.clone().negate()
   const skin=cast(outside,inward,.10,[actor.body])[0]
   if(skin?.faceIndex!==bodyHit.faceIndex||skin.point.distanceTo(point)>.0001){selfOccluded++;continue}
   // A different body surface in front is self-occlusion, not a clothing pass.
   // Only the same witnessed body face permits this shirt-first assertion.
   const visible=cast(outside,inward,.10,actor.meshes)[0]
   assert.equal(visible?.object.material.userData.templePart,'shirt',`${mode} sample ${frame}/12 exposes the tracked underarm skin region`)
   assert.ok(visible.distance<skin.distance,'The tracked shirt surface stays in front of the body')
   verified++;verifiedByMode[mode]++
  }finally{actor.rig.dispose()}
 }
 assert.ok(verifiedByMode.Idle>0&&verifiedByMode.Walk>0,'Neither animation may pass by skipping all self-occluded samples')
 console.log(`Human clothing: ${verified}/24 verified underarm witnesses covered, ${selfOccluded} self-occluded samples skipped; at most48 rays, ${(performance.now()-started).toFixed(0)}ms. Bounded Idle/Walk visibility only, not universal cloth collision proof.`)
}finally{initial.rig.dispose()}

// Same camera as the seated portrait that exposed the two inward-folded
// armhole patches. Test the photographed sightlines, independently of indices.
const seated=createDetailedVisitor(gltf.scene,parent)
try{
 seated.update({pose:'meditating',reduced:true})
 const {meshes,body}=prepare(seated)
 const shirts=meshes.filter(mesh=>mesh.material.userData.templePart==='shirt')
 if(shirts.some(mesh=>mesh.morphTargetDictionary?.templeSeatedShirt!==undefined)){
  const camera=new THREE.PerspectiveCamera(40,580/570,.03,50)
  camera.position.set(0,.86,1.65)
  camera.lookAt(0,.48,.10)
  camera.updateMatrixWorld(true)
  const ray=new THREE.Raycaster(),screen=new THREE.Vector2(),normal=new THREE.Vector3()
  const foldedPixels=[[260,323],[260,324],[260,325],[260,326],[261,327],[403,318],[403,319]]
  for(const [x,y] of foldedPixels){
   screen.set((x-45)/572*2-1,1-(y-95)/563*2)
   ray.setFromCamera(screen,camera)
   const shirt=ray.intersectObjects(shirts,false)[0]
   const skin=ray.intersectObject(body,false)[0]
   assert.ok(shirt&&(!skin||shirt.distance<skin.distance),'The seated armhole patch covers the visible skin')
   normal.copy(shirt.face.normal).transformDirection(shirt.object.matrixWorld)
   assert.ok(normal.dot(ray.ray.direction)<0,`The shirt faces outward at seated witness ${x},${y}`)
  }
  console.log('Human clothing: seated shirt covers all seven previously folded sightlines with outward faces.')
 }
}finally{seated.dispose()}
