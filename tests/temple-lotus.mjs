import assert from 'node:assert/strict'
import * as THREE from 'three'
import {createTempleLotusLeafGeometry,createTempleLotusBudGeometry} from '../src/components/templeLotusLeaves.js'

function inspect(g,closed=false){
  for(const attribute of Object.values(g.attributes))assert.ok([...attribute.array].every(Number.isFinite))
  assert.equal(g.attributes.position.count,g.attributes.normal.count)
  const p=g.attributes.position,edges=new Map(),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),cross=new THREE.Vector3()
  let signedVolume=0
  for(let i=0;i<g.index.count;i+=3){
    const ids=[0,1,2].map(j=>g.index.getX(i+j))
    a.fromBufferAttribute(p,ids[0]);b.fromBufferAttribute(p,ids[1]);c.fromBufferAttribute(p,ids[2])
    signedVolume+=a.dot(cross.crossVectors(b,c))/6
    cross.crossVectors(b.clone().sub(a),c.clone().sub(a))
    assert.ok(cross.length()>1e-9,'No collapsed polar triangles')
    if(!closed)assert.ok(cross.y>0,'Leaf faces point above the water')
    for(let j=0;j<3;j++){const edge=[ids[j],ids[(j+1)%3]].sort((a,b)=>a-b).join(':');edges.set(edge,(edges.get(edge)||0)+1)}
  }
  assert.ok([...edges.values()].every(n=>n===2||!closed&&n===1),'No non-manifold edges or open bud seams')
  if(closed)assert.ok(signedVolume>0,'Bud caps and side faces enclose an outward-facing solid')
  else assert.equal([...edges.values()].filter(n=>n===1).length,24,'Only the continuous outer leaf rim is open')
  g.computeBoundingBox();assert.equal(g.boundingBox.min.y,0)
  return g.boundingBox
}
const variants=[]
for(let kind=0;kind<3;kind++){
  const g=createTempleLotusLeafGeometry(kind),bounds=inspect(g)
  assert.ok(bounds.max.y>.01&&bounds.max.y<.05,'Leaf curvature remains a few centimetres')
  assert.ok(bounds.min.x>-.27&&bounds.max.x<.27&&bounds.min.z>-.27&&bounds.max.z<.27)
  const n=g.attributes.normal;for(let i=0;i<n.count;i++)assert.ok(n.getY(i)>.9,'No flipped or sharply folded leaf normals')
  assert.ok(g.index.count/3<=120,'Bounded leaf geometry budget')
  variants.push([...g.attributes.position.array])
  // The actual scene uses only positive uniform scale and yaw, preserving water clearance.
  for(let i=kind;i<19;i+=3){const copy=g.clone();copy.scale(.85+(Math.sin(i*4.71)+1)*.13,.85+(Math.sin(i*4.71)+1)*.13,.85+(Math.sin(i*4.71)+1)*.13);copy.rotateY(i*2.39996);copy.translate(0,.287,0);copy.computeBoundingBox();assert.ok(copy.boundingBox.min.y>.285);copy.dispose()}
  g.dispose()
}
assert.notDeepEqual(variants[0],variants[1]);assert.notDeepEqual(variants[1],variants[2])
const bud=createTempleLotusBudGeometry(),bounds=inspect(bud,true)
assert.ok(bounds.max.y>.09&&bounds.max.y<.1&&bounds.max.x<.04,'A closed bud stays smaller than an open flower')
assert.ok(bud.index.count/3<=224,'Bud geometry is shared and bounded')
bud.dispose()
console.log('Lotus: three cupped peltate blades, continuous rims/upward normals/water clearance and closed outward bud geometry pass.')
