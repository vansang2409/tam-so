import assert from 'node:assert/strict'
import { DICHUA_LOCATIONS } from '../src/data/dichua.js'
import { LANDSCAPE_PROPS } from '../src/data/templeLandscape.js'
import { WORLD_SPOTS, WORLD_BOUNDS, templeBasinCenterZ, TEMPLE_CENSER_HALF, TEMPLE_CENSER_FRONT_OFFSET, isWalkable, findWorldPath, nearestSpot, canWalkSegment, groundHeight } from '../src/data/templeWorld.js'
assert.equal(WORLD_SPOTS.length,23)
assert.deepEqual(WORLD_SPOTS.map(s=>s.id).sort(),DICHUA_LOCATIONS.map(s=>s.id).sort())
assert.equal(new Set(WORLD_SPOTS.map(s=>s.id)).size,23)
assert.equal(isWalkable(NaN,0),false)
assert.equal(isWalkable(Infinity,0),false)
for(const prop of LANDSCAPE_PROPS)assert.equal(isWalkable(prop.x,prop.z),false,prop.id+' is represented by a navigation obstacle')
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
for(let z=-3.8;z<=5;z+=.1)assert.ok(isWalkable(0,z),'Trục giữa nối từ sân tới trước bàn thờ, không bị bệ lư chắn')
for(const x of [-6.65,6.65])assert.equal(isWalkable(x,main.centerZ+2.3),false,'Bục chuông mõ có va chạm')
for(const x of [-6.45,-3.9,3.9,6.45])assert.equal(isWalkable(x,main.centerZ+main.depth/2-.26),false,'Vách cửa bên có va chạm')
console.log('Đại điện: 192 m², trục giữa thông thoáng, cột/cửa/bàn thờ và bục chuông mõ có va chạm.')

const library=WORLD_SPOTS.find(s=>s.id==='thu-vien')
assert.equal(isWalkable(library.x,library.centerZ-.5),false,'The front half of the library reading table blocks walking')
assert.ok(isWalkable(library.x,library.centerZ+.15),'A reading position remains in front of the table')
assert.ok(isWalkable(library.x+1.55,library.centerZ-.5),'The side aisle stays open around the reading table')

const meditation=WORLD_SPOTS.find(s=>s.kind==='meditate')
assert.equal(groundHeight(meditation.x,meditation.centerZ),.28,'The center cushion supports the visitor at its top')
for(const [x,z]of [[-1,1],[1,1]])assert.equal(groundHeight(meditation.x+x,meditation.centerZ+z),.28,'Both side cushions support the visitor')
assert.ok(Math.abs(groundHeight(meditation.x+.56,meditation.centerZ)-.22)<1e-10,'Cushion slope matches its tapered side')
assert.equal(groundHeight(meditation.x+.6,meditation.centerZ),.16,'Cushion edge returns to the platform')
assert.equal(groundHeight(meditation.x+1.8,meditation.centerZ),.16,'The circular stone platform is above the courtyard')
assert.equal(groundHeight(meditation.x+2.3,meditation.centerZ),.16,'The circular platform includes its edge')
assert.equal(groundHeight(meditation.x+2.31,meditation.centerZ),.07,'Outside the platform uses the courtyard height')
assert.equal(groundHeight(meditation.x+2,meditation.centerZ+2),.07,'Square corners outside the circular platform stay on the courtyard')

for(const spot of WORLD_SPOTS.filter(s=>s.kind==='pond'||s.kind==='garden')){
  const basinZ=templeBasinCenterZ(spot)
  for(const dz of [-1.4,1.4])assert.equal(isWalkable(spot.x,basinZ+dz),false,spot.id+' water and both stone rims follow the rendered basin offset')
  if(spot.kind==='garden')assert.equal(isWalkable(spot.x,spot.centerZ+1.4),true,'Garden dry approach stays open ahead of its offset basin')
  assert.equal(isWalkable(spot.x,spot.z),true,spot.id+' approach remains reachable outside the stone rim')
}

for(const spot of WORLD_SPOTS.filter(s=>s.huong&&s.architecture.style)){
  const x=spot.x+spot.censerX,z=spot.centerZ+spot.depth/2+TEMPLE_CENSER_FRONT_OFFSET
  for(const dx of [-TEMPLE_CENSER_HALF,0,TEMPLE_CENSER_HALF])for(const dz of [-TEMPLE_CENSER_HALF,0,TEMPLE_CENSER_HALF])assert.equal(groundHeight(x+dx,z+dz),.07,spot.id+' outdoor censer plinth stands on flat courtyard, not across the stair transition')
  assert.equal(isWalkable(x,z),false,spot.id+' censer plinth matches its obstacle')
  assert.ok(z-TEMPLE_CENSER_HALF>spot.centerZ+(spot.depth+1.2)/2,'Censer base clears the entire fitted shell envelope, including steps')
}
