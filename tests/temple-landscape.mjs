import assert from 'node:assert/strict'
import * as THREE from 'three'
import {LANDSCAPE_PROPS,LANDSCAPE_OBSTACLES} from '../src/data/templeLandscape.js'
import {createTempleGardenFurniture} from '../src/components/templeGardenFurniture.js'
import {createTempleBoxGeometry} from '../src/components/templeWorldScene.js'
import {groundHeight} from '../src/data/templeWorld.js'

assert.ok(Object.isFrozen(LANDSCAPE_PROPS)&&Object.isFrozen(LANDSCAPE_OBSTACLES))
assert.ok(LANDSCAPE_PROPS.every(Object.isFrozen)&&LANDSCAPE_OBSTACLES.every(Object.isFrozen))
assert.throws(()=>{LANDSCAPE_PROPS[0].x=0},TypeError)
const materials=new Map(),material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color}));return materials.get(color)}
const mesh=(g,color,x,y,z,p)=>{const o=new THREE.Mesh(g,material(color));o.position.set(x,y,z);p.add(o);return o}
const box=(w,h,d,color,x,y,z,p)=>mesh(createTempleBoxGeometry(w,h,d),color,x,y,z,p)
const root=new THREE.Group(),furniture=createTempleGardenFurniture(root,{box,mesh})
root.updateMatrixWorld(true)
const bounds=o=>new THREE.Box3().setFromObject(o),close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-6,message+' '+a+' / '+b)
assert.equal(furniture.records.length,LANDSCAPE_PROPS.length)
let triangles=0
for(const [i,record]of furniture.records.entries()){
  const {prop}=record,b=bounds(record.root),obstacle=LANDSCAPE_OBSTACLES[i]
  assert.equal(record.root.name,prop.id)
  close(b.min.x,obstacle[0],'Solid furniture fits its navigation footprint')
  close(b.max.x,obstacle[1],'Solid furniture fits its navigation footprint')
  close(b.min.z,obstacle[2],'Solid furniture fits its navigation footprint')
  close(b.max.z,obstacle[3],'Solid furniture fits its navigation footprint')
  close(b.min.y,prop.groundY,'Furniture stands on the courtyard without a gap')
  close(groundHeight(prop.x,prop.z),prop.groundY,'Furniture is not placed inside an existing raised building floor')
  record.root.traverse(o=>{if(o.isMesh){assert.ok(o.matrixWorld.elements.every(Number.isFinite));const g=o.geometry;assert.ok([...g.attributes.position.array].every(Number.isFinite));triangles+=(g.index?.count||g.attributes.position.count)/3}})
  if(prop.kind==='bench'){
    const seat=bounds(record.seat),back=bounds(record.back)
    close(seat.max.y,prop.seatTop,'Seat height is 45cm above the courtyard')
    for(const leg of record.legs){const foot=bounds(leg);close(foot.min.y,prop.groundY,'Stone legs reach the floor');close(foot.max.y,seat.min.y,'Stone legs touch the seat underside');close(groundHeight((foot.min.x+foot.max.x)/2,(foot.min.z+foot.max.z)/2),foot.min.y,'Legs stand on the actual terrain surface')}
    for(const support of record.backSupports){const b=bounds(support);close(b.min.y,seat.max.y,'Back supports touch the seat');assert.ok(b.max.y>=back.min.y&&b.min.x<=back.max.x&&b.max.x>=back.min.x,'Back panel meets its supports')}
    assert.ok(record.back.position.x<record.seat.position.x,'The back is west of the seat, so visitors face +X toward the pond')
  }else{
    const soil=bounds(record.soil)
    close(soil.max.y,prop.soilTop,'Plant stems emerge from a soil volume inside the pot')
    assert.ok(soil.max.x<prop.x+prop.radius&&soil.min.x>prop.x-prop.radius,'Soil stays inside the stone rim')
    for(let i=0;i<12;i++){const a=i*Math.PI/6;close(groundHeight(prop.x+Math.cos(a)*prop.radius,prop.z+Math.sin(a)*prop.radius),prop.groundY,'The planter rim footprint clears existing raised floors')}
    for(const [j,stem]of record.stems.entries()){
      const s=bounds(stem);assert.ok(s.min.y<=soil.max.y&&s.min.y>=soil.min.y,'Stems are embedded into the soil')
      for(const flower of record.flowers[j]){const f=bounds(flower);assert.ok(f.min.y<=s.max.y+.01&&f.max.y>=s.max.y,'Flowers meet the top of their stem')}
    }
    assert.ok(b.max.y-prop.groundY<.75,'Flowers remain small courtyard accents')
  }
}
assert.ok(triangles<9000,'Four small props, including the real beveled stone, have a bounded geometry cost')
const geometry=new Set();root.traverse(o=>{if(o.geometry)geometry.add(o.geometry)})
assert.ok(geometry.size<25,'Flowers and pots share source geometry instead of duplicating buffers')
geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose())
console.log('Landscape: '+furniture.records.length+' supported stone benches/planters, matching colliders, shared resources, '+triangles+' triangles pass.')
