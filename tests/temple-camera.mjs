import assert from 'node:assert/strict'
import {DEFAULT_PERSPECTIVE,thirdPersonPose} from '../src/data/templeCamera.js'
import {WORLD_SPOTS} from '../src/data/templeWorld.js'
assert.equal(DEFAULT_PERSPECTIVE,'third')
let poses=0
for(const s of WORLD_SPOTS.filter(s=>['main','hall','house','shrine','tower'].includes(s.kind))){
  const room={...s,indoor:true},position={x:s.x,y:.34,z:s.z}
  for(const yaw of [0,Math.PI/2,Math.PI,-Math.PI/2])for(const aspect of [.43,1.78])for(const elevation of [.03,.17,.7]){
    const pose=thirdPersonPose(position,room,{yaw,aspect,elevation,distance:7}),p=pose.position
    assert.ok(Object.values(p).every(Number.isFinite),'Camera có tọa độ hữu hạn')
    assert.ok(p.x>=s.x-s.width/2+.239&&p.x<=s.x+s.width/2-.239,s.id+' không xuyên vách bên')
    assert.ok(p.z>=s.centerZ-s.depth/2+.279&&p.z<=s.centerZ+s.depth/2+3.201,s.id+' không xuyên vách sau')
    assert.ok(p.y<=s.architecture.height-.279,s.id+' không xuyên trần')
    assert.ok(pose.fov>=60&&pose.fov<=70);poses++
  }
  const initial=thirdPersonPose(position,room,{aspect:.46})
  assert.ok(initial.position.z-position.z>1.8,s.id+' mặc định đủ lùi để thấy nhân vật')
}
const open=thirdPersonPose({x:0,y:.07,z:24.8},null,{yaw:Math.PI/4})
assert.ok(open.position.x>0&&open.position.z>24.8)
console.log('Camera: mặc định góc thứ ba, '+poses+' góc/khung hình ở 17 nội điện hữu hạn, không vượt vách/trần; đủ khoảng lùi ban đầu.')
