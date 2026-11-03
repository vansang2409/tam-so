import assert from 'node:assert/strict'
import * as THREE from 'three'
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js'
import {createTempleBouquets} from '../src/components/templeFlowers.js'

let calls=0
const materials=new Map()
function mesh(geometry,color,x,y,z,parent,extra={}){
  calls++
  const key=JSON.stringify([color,extra])
  if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,...extra}))
  const object=new THREE.Mesh(geometry,materials.get(key));object.position.set(x,y,z);parent.add(object);return object
}
function curve(points,r,color,parent){
  return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),16,r,6,false),color,0,0,0,parent)
}
const bouquets=createTempleBouquets({mesh,curve})
assert.equal(calls,0,'Unused bouquets do not instantiate mesh/material resources')
const scene=new THREE.Group(),first=bouquets.place(2,1,3,scene),second=bouquets.place(-2,0,-3,scene)
scene.updateMatrixWorld(true)
const named=(group,name)=>{const result=[];group.traverse(o=>{if(o.name===name)result.push(o)});return result}
const heads=named(first,'Cupped flower head'),stems=named(first,'Flower stem'),leaves=named(first,'Stem leaf')
assert.equal(heads.length,5);assert.equal(stems.length,5);assert.equal(leaves.length,10)
assert.equal(heads[0].geometry,heads[4].geometry)
assert.equal(heads[0].geometry,named(second,'Cupped flower head')[0].geometry)
assert.equal(leaves[0].geometry,named(second,'Stem leaf')[9].geometry)
const headBounds=heads[0].geometry.boundingBox
assert.ok(headBounds.max.x-headBounds.min.x>.12&&headBounds.max.x-headBounds.min.x<.18)
assert.ok(headBounds.max.y-headBounds.min.y>.03,'Cupped petals retain depth in side views')
function assertStemContact(stem,head){
  const heart=head.getObjectByName('Flower center'),position=stem.geometry.attributes.position
  const endStart=position.count-stem.geometry.parameters.radialSegments-1,point=new THREE.Vector3()
  for(let i=endStart;i<position.count;i++){
    point.fromBufferAttribute(position,i);stem.localToWorld(point);heart.worldToLocal(point)
    assert.ok(point.length()<heart.geometry.parameters.radius,'The actual stem end ring must be embedded inside the flower heart')
  }
}
for(let i=0;i<5;i++){
  const path=stems[i].geometry.parameters.path
  assert.ok(path.getPoint(0).y===.3&&Math.hypot(path.getPoint(0).x,path.getPoint(0).z)<.02,'Stem starts inside vase')
  assertStemContact(stems[i],heads[i])
  assert.ok(heads[i].position.y>=.65&&heads[i].position.y<=.8)
  for(let j=0;j<2;j++)assert.ok(leaves[i*2+j].position.distanceTo(path.getPoint(.4+j*.22))<1e-8,'Leaf base grows from stem')
}
// Stopping at the head's object origin used to pass despite the geometric gap.
const supportedStem=stems[0].geometry,points=supportedStem.parameters.path.points
stems[0].geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3([points[0],points[1],heads[0].position.clone()]),16,.0034,6,false)
assert.throws(()=>assertStemContact(stems[0],heads[0]),/embedded inside the flower heart/,'The old floating stem endpoint must fail the geometry contact check')
stems[0].geometry.dispose();stems[0].geometry=supportedStem
let triangles=0
const geometries=new Set(),all=[]
first.traverse(o=>{
  if(!o.isMesh)return
  geometries.add(o.geometry);all.push(o.geometry)
  triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3
  assert.equal(Object.keys(o.geometry.morphAttributes).length,0)
  for(const attribute of Object.values(o.geometry.attributes))assert.ok([...attribute.array].every(Number.isFinite))
  assert.equal(o.geometry.attributes.normal.count,o.geometry.attributes.position.count)
})
assert.ok(triangles<2500,`Bouquet budget: ${triangles}`)
const compatible=all.map(g=>{
  const copy=g.index?g.toNonIndexed():g.clone()
  if(!copy.attributes.color)copy.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(copy.attributes.position.count*3).fill(1),3))
  return copy
})
const merged=mergeGeometries(compatible)
assert.ok(merged,'Static scene can merge flowers with color-normal-uv geometry')
merged.dispose();compatible.forEach(g=>g.dispose())
const bounds=new THREE.Box3().setFromObject(first)
assert.ok(bounds.min.y>=1.29&&bounds.max.y<1.87,'Bouquet retains vase-relative bounds')
assert.ok(bounds.max.x-bounds.min.x<.5&&bounds.max.z-bounds.min.z<.5)
second.traverse(o=>{if(o.isMesh)geometries.add(o.geometry)})
let disposed=0
geometries.forEach(g=>g.addEventListener('dispose',()=>disposed++))
geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());scene.clear()
assert.equal(disposed,geometries.size,'Scene ownership can release every shared geometry once')
console.log(`Temple flowers: 5 cupped heads, 10 attached leaves, ${triangles} triangles/bouquet; shared geometry, finite normals, contact, merge and disposal checks pass.`)
