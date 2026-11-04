import assert from 'node:assert/strict'
import * as THREE from 'three'
import {createTempleRigContact} from '../src/components/templeRigContact.js'
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z)
function fixture({morph=false,name='Imported pants',height=.08}={}){
  const parent=new THREE.Group();parent.position.set(2,3,-4);parent.rotation.y=.73
  const holder=new THREE.Group(),model=new THREE.Group();parent.add(holder);holder.add(model);holder.position.y=height
  const a=new THREE.Bone(),b=new THREE.Bone();a.position.set(.02,.04,-.01);b.position.set(0,.17,.02);a.add(b);model.add(a)
  // The unindexed vertex at origin must never determine the rendered minimum.
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Uint16BufferAttribute([8000,5000,10000,12000,5500,10000,8000,6000,13000,0,0,0],3,true));g.setIndex([0,1,2])
  g.setAttribute('skinIndex',new THREE.Uint8BufferAttribute([0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0],4))
  g.setAttribute('skinWeight',new THREE.Uint8BufferAttribute([128,127,0,0,64,191,0,0,200,55,0,0,255,0,0,0],4,true))
  if(morph){g.morphAttributes.position=[new THREE.Float32BufferAttribute([0,-.018,0,0,-.01,0,0,-.02,0,0,-2,0],3)];g.morphTargetsRelative=true}
  const mat=new THREE.MeshStandardMaterial();mat.name=name;const mesh=new THREE.SkinnedMesh(g,mat);mesh.name=name;mesh.position.set(.03,.01,-.04);mesh.rotation.set(.04,-.13,.07);model.add(mesh)
  parent.updateMatrixWorld(true);const skeleton=new THREE.Skeleton([a,b]);skeleton.calculateInverses()
  const bind=new THREE.Matrix4().compose(V(.015,-.012,.021),new THREE.Quaternion().setFromEuler(new THREE.Euler(.02,.03,-.04)),V(1.1,.9,1.05));mesh.bind(skeleton,bind)
  if(morph)mesh.morphTargetInfluences[0]=.6
  b.rotation.z=.12;a.rotation.x=-.08;parent.updateMatrixWorld(true)
  return {parent,holder,model,mesh,a,b,dispose(){g.dispose();mat.dispose();skeleton.dispose()}}
}
// Independent oracle: Three.js owns all skin/morph/bind calculations. Evaluate
// only actual indexed rendered vertices and transform to the floor parent's space.
function renderedMinimum(f){
  f.parent.updateMatrixWorld(true);let min=Infinity;const p=V()
  for(const id of new Set(f.mesh.geometry.index.array)){f.mesh.getVertexPosition(id,p);p.applyMatrix4(f.mesh.matrixWorld);f.parent.worldToLocal(p);min=Math.min(min,p.y)}
  return min
}
for(const morph of [false,true]){
  const f=fixture({morph}),helper=createTempleRigContact(f.model,f.holder)
  assert.equal(helper.sampleCount,3,'Unused indexed-out vertices cannot affect support')
  for(const angle of [.12,-.17,.23]){
    f.b.rotation.z=angle;f.holder.position.y=-.04;f.holder.position.y+=.08-renderedMinimum(f)
    const before=renderedMinimum(f),expected=THREE.MathUtils.clamp(.003-before,-.15,.15),oldY=f.holder.position.y
    assert.ok(Number.isFinite(before));const delta=helper.apply()
    assert.ok(Math.abs(delta-expected)<1e-9,'Optimized support equals independent rendered skin/morph minimum')
    assert.ok(Math.abs(f.holder.position.y-oldY-delta)<1e-12)
    assert.ok(Math.abs(renderedMinimum(f)-(before+delta))<1e-9,'Correction moves rendered support by the actual applied parent-space delta')
    assert.ok(Math.abs(renderedMinimum(f)-.003)<1e-8,'Pants meet parent floor: before='+before+' delta='+delta+' after='+renderedMinimum(f))
    const settled=f.holder.position.y
    for(let i=0;i<50;i++){assert.ok(Math.abs(helper.apply())<1e-8,'Repeated contact cannot accumulate');assert.ok(Math.abs(f.holder.position.y-settled)<1e-8)}
  }
  for(const height of [-2,2]){
    f.holder.position.y=height;const before=renderedMinimum(f),delta=helper.apply()
    assert.ok(Math.abs(delta)<=.15+1e-12,'Extreme poses cannot move the root more than 15cm per application')
    assert.ok(Math.abs(delta-THREE.MathUtils.clamp(.003-before,-.15,.15))<1e-9)
  }
  f.dispose()
}
const absent=fixture({name:'Head skin'}),none=createTempleRigContact(absent.model,absent.holder),original=absent.holder.position.clone()
assert.equal(none.sampleCount,0);assert.equal(none.apply(),0);assert.deepEqual(absent.holder.position.toArray(),original.toArray());absent.dispose()
console.log('Kneeling contact: independent Three.js rendered bounds agree for weighted normalized quantized attributes, arbitrary bind/mesh transforms, parent transforms, ignored unused vertices, morph fallback, bounded correction and stable contact.')
