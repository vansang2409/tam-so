import assert from 'node:assert/strict'
import * as THREE from 'three'
import {createTempleAtmosphere} from '../src/components/templeAtmosphere.js'
import {WORLD_SPOTS} from '../src/data/templeWorld.js'

const parent=new THREE.Group(),sky=createTempleAtmosphere(parent),root=sky.root
assert.equal(parent.children[0],root)
const instances=root.children.filter(o=>o.isInstancedMesh),clouds=root.children.filter(o=>o.isSprite)
assert.equal(instances.length,3,'Bird body and both wings stay within three draw calls')
assert.equal(clouds.length,6)
assert.ok(instances.every(o=>o.count===7&&o.castShadow===false),'Distant birds add no shadow pass')
assert.ok(instances.every(o=>o.material===instances[0].material),'Birds share one material')
assert.ok(clouds.every(o=>o.material===clouds[0].material),'Clouds share one material and texture')
assert.equal(clouds[0].material.depthTest,true);assert.equal(clouds[0].material.depthWrite,false);assert.equal(clouds[0].material.fog,false,'Ground haze must not erase the distant sky layer')

const texture=clouds[0].material.map,{data,width,height}=texture.image
const alpha=(x,y)=>data[(y*width+x)*4+3]
for(let x=0;x<width;x++){assert.equal(alpha(x,0),0);assert.equal(alpha(x,height-1),0)}
for(let y=0;y<height;y++){assert.equal(alpha(0,y),0);assert.equal(alpha(width-1,y),0)}
const alphas=Array.from({length:width*height},(_,i)=>data[i*4+3])
assert.ok(Math.max(...alphas)>100&&Math.max(...alphas)<230,'Cloud opacity stays soft rather than a solid card')
assert.ok(new Set(alphas).size>100,'Alpha texture contains a gradual density falloff')

const snapshot=()=>({birds:instances.map(o=>Array.from(o.instanceMatrix.array)),clouds:clouds.map(o=>o.position.toArray())})
const wingPose=()=>{const body=new THREE.Matrix4(),wing=new THREE.Matrix4();instances[0].getMatrixAt(0,body);instances[1].getMatrixAt(0,wing);return body.invert().multiply(wing).elements}
sky.update(2);const atTwo=snapshot();sky.update(8);assert.notDeepEqual(snapshot(),atTwo,'Flight, flapping and cloud drift change with time')
sky.update(2);const firstFlap=wingPose();sky.update(2.2);assert.notDeepEqual(wingPose(),firstFlap,'Wings flap relative to the moving body rather than staying rigid')
sky.update(2);assert.deepEqual(snapshot(),atTwo,'Absolute time produces a deterministic frame')
sky.update(1,{reduced:true});const still=snapshot();sky.update(900,{reduced:true});assert.deepEqual(snapshot(),still,'Reduced motion freezes birds and clouds, including after animated frames')
const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),vertex=new THREE.Vector3()
const roofEnvelope=Math.max(...WORLD_SPOTS.map(s=>(s.architecture.height||0)+.15+Math.max(0,(s.kind==='tower'?1:s.architecture.tiers||1)-1)*1.4+1.95))
for(const time of [0,1,8,50,200,1000,Number.MAX_VALUE,NaN,Infinity]){
 sky.update(time)
 for(const mesh of instances)for(let i=0;i<7;i++){
  mesh.getMatrixAt(i,matrix);assert.ok(matrix.elements.every(Number.isFinite),'Bird transforms remain finite')
  position.setFromMatrixPosition(matrix);assert.ok(position.y>=12.8,'Birds fly well above the tallest roofs')
  const a=mesh.geometry.attributes.position
  for(let j=0;j<a.count;j++){vertex.fromBufferAttribute(a,j).applyMatrix4(matrix);assert.ok(vertex.y>roofEnvelope+2,'Even a flapping wing stays at least 2m above the roof envelope')}
 }
 assert.ok(clouds.every(o=>o.position.toArray().every(Number.isFinite)&&o.position.y>69))
}
const geometries=instances.map(o=>o.geometry),material=instances[0].material
sky.update(20,{quality:'low'});assert.ok(instances.every(o=>o.count===3));assert.equal(clouds.filter(o=>o.visible).length,3)
assert.ok(clouds.some(o=>o.visible&&o.position.z<0)&&clouds.some(o=>o.visible&&o.position.z>0),'Low quality retains clouds in both sky hemispheres')
sky.update(20);assert.ok(instances.every(o=>o.count===7));assert.equal(clouds.filter(o=>o.visible).length,6)
assert.deepEqual(instances.map(o=>o.geometry),geometries);assert.equal(instances[0].material,material,'Quality switches allocate no geometry or material')
const measuredTriangles=instances.reduce((sum,o)=>sum+(o.geometry.index?.count||o.geometry.attributes.position.count)/3*o.count,0)+clouds.length*2
assert.equal(root.userData.resourceBudget.standardTriangles,measuredTriangles)
assert.ok(measuredTriangles<1800,'Sky geometry remains within its small rendering budget')
assert.equal(root.userData.resourceBudget.textureBaseBytes,32768);assert.equal(root.userData.resourceBudget.textureMipBytes,43692,'Budget includes the complete uncompressed RGBA8 mip chain')

const resources=[...instances,...geometries,material,clouds[0].material,texture],disposed=new Map()
for(const resource of resources){disposed.set(resource,0);resource.addEventListener('dispose',()=>disposed.set(resource,disposed.get(resource)+1))}
sky.dispose();sky.dispose();sky.update(21)
assert.equal(parent.children.length,0);assert.equal(root.children.length,0)
assert.ok([...disposed.values()].every(n=>n===1),'Every instance buffer, geometry, material and cloud texture is disposed exactly once')
console.log('Khí quyển: 7 chim/6 mây, '+measuredTriangles+' tam giác, 9 draw calls tiêu chuẩn/6 nhẹ, 1 texture 128×64 (43.692 byte cả mip); thời gian tất định, giảm chuyển động và cleanup pass.')
