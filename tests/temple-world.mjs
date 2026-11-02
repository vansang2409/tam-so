import assert from 'node:assert/strict'
import { DICHUA_LOCATIONS } from '../src/data/dichua.js'
import { WORLD_SPOTS, WORLD_BOUNDS, isWalkable, findWorldPath, nearestSpot, canWalkSegment } from '../src/data/templeWorld.js'
assert.equal(WORLD_SPOTS.length,23)
assert.deepEqual(WORLD_SPOTS.map(s=>s.id).sort(),DICHUA_LOCATIONS.map(s=>s.id).sort())
assert.equal(new Set(WORLD_SPOTS.map(s=>s.id)).size,23)
assert.equal(isWalkable(NaN,0),false)
assert.equal(isWalkable(Infinity,0),false)
assert.equal(isWalkable(WORLD_BOUNDS.maxX+1,0),false)
assert.deepEqual(findWorldPath({x:0,z:24.8},{x:100,z:0}),[])
assert.equal(nearestSpot(100,100),null)
let routes=0
for(const a of WORLD_SPOTS) {
  assert.ok(isWalkable(a.x,a.z),a.id+' phải có điểm đến hợp lệ')
  assert.equal(nearestSpot(a.x,a.z)?.id,a.id)
  for(const b of WORLD_SPOTS) {
    const path=findWorldPath(a,b)
    assert.ok(path.length,a.id+' phải nối được tới '+b.id)
    assert.deepEqual(path.at(-1),{x:b.x,z:b.z})
    for(let i=0;i<path.length;i++) {
      assert.ok(isWalkable(path[i].x,path[i].z),a.id+' → '+b.id+' không đi vào vật cản')
      if(i)for(let t=.1;t<1;t+=.1) {
        const x=path[i-1].x*(1-t)+path[i].x*t,z=path[i-1].z*(1-t)+path[i].z*t
        assert.ok(isWalkable(x,z),a.id+' → '+b.id+' không cắt xuyên góc')
      }
    }
    routes++
  }
}
const start=findWorldPath({x:0,z:24.8},WORLD_SPOTS.find(s=>s.id==='chanh-dien'))
assert.ok(start.length,'Từ cổng vào tới chính điện')
assert.ok(isWalkable(0,-3),'Nội điện có thể đi vào')
assert.ok(!isWalkable(-12,11),'Hồ rùa là vật cản')
console.log('Chùa 3D: đủ 23 khu, '+routes+' tuyến liên thông; đường đi không xuyên vật cản.')

// Các đích chuột không nằm đúng ô lưới vẫn phải nối an toàn tới đường đi.
for(const point of [{x:.15,z:24.8},{x:-.28,z:8.24},{x:16.12,z:8.82},{x:-16.17,z:8.3},{x:.19,z:-12.12},{x:16.72,z:-12.11}]){
  assert.ok(isWalkable(point.x,point.z));const path=findWorldPath({x:0,z:24.8},point);assert.ok(path.length);let previous={x:0,z:24.8};for(const next of path){assert.ok(canWalkSegment(previous,next),'Đích chuột không xuyên vật cản');previous=next}
}
console.log('Đích chuột giữa các ô lưới: đường nối hợp lệ.')

// Bàn thờ chi tiết chiếm chiều sâu lớn hơn: không được đi xuyên phần chân phía trước.
assert.equal(isWalkable(0,-5),false,'Chân bàn thờ Chánh Điện là vật cản')
assert.equal(isWalkable(12,-11.2),false,'Bàn thờ Dược Sư là vật cản')
assert.ok(isWalkable(0,-2.9),'Còn lối đứng hành lễ trước bàn thờ')

// Hàng cây cảnh quan ngoài tường không được mọc vào các điện sát ranh khuôn viên.
const {WORLD_TREES}=await import('../src/data/templeWorld.js')
for(const t of WORLD_TREES.filter(t=>Math.abs(t.x)>25))for(const s of WORLD_SPOTS.filter(s=>s.architecture.style)){
  const dx=Math.max(0,Math.abs(t.x-s.x)-s.width/2),dz=Math.max(0,Math.abs(t.z-s.centerZ)-s.depth/2)
  assert.ok(Math.hypot(dx,dz)>2.3*t.size,'Tán cây ngoài ranh không xuyên vào '+s.id)
}

// Đại điện mở rộng vẫn có trục đi giữa, cột/cửa và đồ tụng niệm không xuyên được.
const main=WORLD_SPOTS.find(s=>s.id==='chanh-dien')
assert.ok(main.width*main.depth>=190)
for(const [dx,dz] of main.architecture.pillars)assert.equal(isWalkable(main.x+dx,main.centerZ+dz),false,'Cột đại điện có va chạm')
for(const z of [-3.8,-2,0,2,4.3])assert.ok(isWalkable(0,z),'Trục giữa nối từ sân tới trước bàn thờ')
for(const x of [-6.65,6.65])assert.equal(isWalkable(x,main.centerZ+2.3),false,'Bục chuông mõ có va chạm')
for(const x of [-6.45,-3.9,3.9,6.45])assert.equal(isWalkable(x,main.centerZ+main.depth/2-.26),false,'Vách cửa bên có va chạm')
console.log('Đại điện: 192 m², trục giữa thông thoáng, cột/cửa/bàn thờ và bục chuông mõ có va chạm.')
