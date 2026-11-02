import assert from 'node:assert/strict'
import { DICHUA_LOCATIONS } from '../src/data/dichua.js'
import { WORLD_SPOTS, WORLD_BOUNDS, isWalkable, findWorldPath, nearestSpot } from '../src/data/templeWorld.js'
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
