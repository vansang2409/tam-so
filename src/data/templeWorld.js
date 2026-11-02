import { DICHUA_LOCATIONS } from './dichua.js'
// Mỗi khu cũ có đúng một vị trí trong cùng khuôn viên; z tăng về phía cổng.
export const WORLD_BOUNDS = { minX: -26, maxX: 26, minZ: -28, maxZ: 27 }
const layout = {
  'cong-tam-quan': [0,23,'gate'], 'chanh-dien': [0,-3,'main'],
  'dien-ngoc-hoang': [-12,-11,'hall'], 'san-ho-rua': [-12,11,'pond'],
  'mieu-ho-phap': [-5.5,21,'shrine'], 'tien-dien-tho-dia': [-12,21,'shrine'],
  'trung-dien-duoc-su': [12,-11,'hall'], 'dien-thanh-hoang': [-21,-5,'hall'],
  'dien-thap-dien': [-21,-16,'hall'], 'dien-kim-hoa': [21,-16,'hall'],
  'thien-y-thanh-mau': [21,-5,'hall'], 'dien-ong-to': [21,5,'shrine'],
  'dien-phat-ba': [12,-2,'hall'], 'lau-quan-am': [-12,-2,'tower'],
  'nha-to': [0,-17,'hall'], 'thap-chuong': [-10,4,'bell'],
  'vuon-lam-ty-ni': [12,14,'garden'], 'giang-duong': [11,-23,'house'],
  'nha-khach': [-21,15,'house'], 'thu-vien': [-11,-23,'house'],
  'goc-thien': [-21,5,'meditate'], 'tuong-cau-nguyen': [6,12,'statue'],
  'cua-hang-phap-bao': [21,16,'house'],
}
export const WORLD_SPOTS = DICHUA_LOCATIONS.map(loc => {
  const [x,z,kind]=layout[loc.id]
  const depth=kind==='main'?7:kind==='hall'||kind==='house'?4.5:3
  const approach=kind==='gate'||kind==='meditate'?0:['main','hall','house','shrine','tower'].includes(kind)?depth/2-.8:kind==='pond'||kind==='garden'?2:depth/2+1
  return { ...loc, label:loc.ten, short:loc.ten, x, z:z+approach, centerZ:z, kind, depth,
    action:loc.huong?'incense':kind==='bell'?'bell':kind==='meditate'?'meditate':'visit', note:loc.moTa }
})
export const WORLD_TREES = [
  ...Array.from({length:10},(_,i)=>-24+i*5).flatMap(z=>[-24,24].map(x=>({x,z,size:.8+Math.abs(Math.sin(z))*.3}))),
  ...[[-6,13],[7,20],[-6,-13],[6,-13],[6,5],[-17,-23],[17,-23],[-17,20]].map(([x,z])=>({x,z,size:1})),
  ...[[-4,0],[4,-2],[3,3]].map(([dx,dz])=>({x:12+dx,z:14+dz,size:.85})),
  {x:-23,z:3,size:1.4},
]
export const WORLD_OBSTACLES = WORLD_SPOTS.flatMap(s => {
  const {x,centerZ:z,kind,depth}=s
  if(kind==='gate') return [[-4.4,-3.5,22,24],[3.5,4.4,22,24]]
  if(kind==='garden')return [[x-3.2,x+3.2,z-2.7,z+.7]]
  if(kind==='statue')return [[x-1,x+1,z-1,z+1]]
  if(kind==='meditate')return []
  const width=kind==='main'?11:kind==='hall'||kind==='house'?6:kind==='pond'?6:3.4
  if(['main','hall','house','shrine','tower'].includes(kind)) return [
    [x-width/2-.05,x-width/2+.12,z-depth/2,z+depth/2-.35],
    [x+width/2-.12,x+width/2+.05,z-depth/2,z+depth/2-.35],
    [x-width/2,x+width/2,z-depth/2-.1,z-depth/2+.2],
    [x-width*.27,x+width*.27,z-depth/2+.3,z-depth/2+1.3],
    ...(s.huong?[[x-.43,x+.43,z+depth/2+.1,z+depth/2+.65]]:[]),
  ]
  return [[x-width/2,x+width/2,z-depth/2,z+depth/2]]
})
export function isWalkable(x, z) {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return false
  const b = WORLD_BOUNDS, r = 0.26
  return x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ &&
    !WORLD_TREES.some(t=>Math.hypot(x-t.x,z-t.z)<.48*t.size) &&
    !WORLD_OBSTACLES.some(([x1,x2,z1,z2]) => x > x1-r && x < x2+r && z > z1-r && z < z2+r)
}
export function groundHeight(x, z) {
  const building=WORLD_SPOTS.find(s=>['main','hall','house','shrine','tower','bell'].includes(s.kind)&&Math.abs(x-s.x)<(s.kind==='main'?5.8:3.2)&&Math.abs(z-s.centerZ)<s.depth/2+.4)
  return building ? .34 : .07
}
export function nearestSpot(x,z, radius = 2.2) {
  return WORLD_SPOTS.reduce((best, spot) => {
    const d = Math.hypot(x-spot.x,z-spot.z)
    return d < radius && (!best || d < best.distance) ? { ...spot, distance:d } : best
  }, null)
}
let cachedWalkGrid=null
// BFS trên lưới 0,5 m, chỉ đi bốn hướng để tránh cắt xuyên góc vật cản.
export function findWorldPath(from, to) {
  if (!isWalkable(from.x,from.z) || !isWalkable(to.x,to.z)) return []
  const step = 0.5, b = WORLD_BOUNDS
  const cols = Math.round((b.maxX-b.minX)/step)+1, rows = Math.round((b.maxZ-b.minZ)/step)+1
  const point = id => ({ x:b.minX+(id%cols)*step, z:b.minZ+Math.floor(id/cols)*step })
  const snap = p => {
    const cx = Math.round((p.x-b.minX)/step), cz = Math.round((p.z-b.minZ)/step)
    let best = -1, distance = Infinity
    for (let dz=-1;dz<=1;dz++) for(let dx=-1;dx<=1;dx++) {
      const x=cx+dx,z=cz+dz
      if(x<0||x>=cols||z<0||z>=rows) continue
      const id=z*cols+x,q=point(id),d=Math.hypot(q.x-p.x,q.z-p.z)
      if(isWalkable(q.x,q.z)&&d<distance) {best=id;distance=d}
    }
    return best
  }
  if(!cachedWalkGrid)cachedWalkGrid=Uint8Array.from({length:cols*rows},(_,id)=>{const p=point(id);return isWalkable(p.x,p.z)?1:0})
  const start=snap(from), end=snap(to)
  if(start<0||end<0) return []
  const prev = new Int32Array(cols*rows).fill(-1), queue = [start]
  prev[start]=start
  for(let cursor=0;cursor<queue.length && prev[end]<0;cursor++) {
    const id=queue[cursor], x=id%cols, z=Math.floor(id/cols)
    for(const [dx,dz] of [[0,-1],[1,0],[0,1],[-1,0]]) {
      const nx=x+dx,nz=z+dz,next=nz*cols+nx
      if(nx<0||nx>=cols||nz<0||nz>=rows||prev[next]>=0) continue
      const p=point(next)
      if(!cachedWalkGrid[next]) continue
      prev[next]=id;queue.push(next)
    }
  }
  if(prev[end]<0) return []
  const path=[]
  for(let id=end;id!==start;id=prev[id]) path.push(point(id))
  path.reverse();path.unshift(point(start));path.push({x:to.x,z:to.z})
  return path.filter((p,i)=>{
    if(!i||i===path.length-1)return true
    const a=path[i-1],b=path[i+1],cross=(p.x-a.x)*(b.z-p.z)-(p.z-a.z)*(b.x-p.x)
    return Math.abs(cross)>.00001 || (p.x-a.x)*(b.x-p.x)+(p.z-a.z)*(b.z-p.z)<0
  })
}
