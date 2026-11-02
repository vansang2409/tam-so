import assert from 'node:assert/strict'
import fs from 'node:fs'
import {createHash} from 'node:crypto'
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {SCULPTURE_PROFILES} from '../src/data/templeSculptures.js'
import {TEMPLE_ASSET_CREDITS} from '../src/data/templeAssetCredits.js'
import {fitTempleModel,prepareTempleAsset,createTempleModels} from '../src/components/templeModels.js'
const manifest=JSON.parse(fs.readFileSync(new URL('../public/dichua/models/manifest.json',import.meta.url)))
let total=0
assert.equal(manifest.length,11)
assert.deepEqual(TEMPLE_ASSET_CREDITS.map(a=>a.file),manifest.map(a=>a.file))
for(const profile of Object.values(SCULPTURE_PROFILES))assert.ok(manifest.some(a=>a.file===profile.file+'.glb'),'Mỗi tượng có tài nguyên được ghi công')
function geometryOnly(bytes){
  const len=bytes.readUInt32LE(12),j=JSON.parse(bytes.toString('utf8',20,20+len)),bin=bytes.subarray(28+len)
  // Kiểm cấu trúc atlas trước khi tách hình ảnh để bộ giải mã hình học chạy được trên Node.
  for(const image of j.images||[]){assert.ok(image.bufferView!==undefined);const view=j.bufferViews[image.bufferView];assert.ok(view.byteLength>0&&(view.byteOffset||0)+view.byteLength<=bin.length)}
  delete j.images;delete j.textures;delete j.materials;delete j.samplers;delete j.extensionsRequired;delete j.extensionsUsed
  for(const m of j.meshes)for(const p of m.primitives)delete p.material
  const b=Buffer.from(JSON.stringify(j)),pad=(4-b.length%4)%4,h=Buffer.alloc(20),bh=Buffer.alloc(8);h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(28+b.length+pad+bin.length,8);h.writeUInt32LE(b.length+pad,12);h.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bin.length,0);bh.writeUInt32LE(0x004e4942,4)
  return Buffer.concat([h,b,Buffer.alloc(pad,32),bh,bin])
}
for(const item of manifest){
  const bytes=fs.readFileSync(new URL('../public/dichua/models/'+item.file,import.meta.url));total+=bytes.length
  assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256,'Tài nguyên phải đúng bản đã ghi công')
  assert.ok(['CC BY 4.0','CC0 1.0','CC BY-SA 4.0'].includes(item.license))
  assert.ok(bytes.length<4_500_000,'Mẫu được tối ưu dưới 4.5 MB')
  const geometry= ['altar.glb','qa.glb'].includes(item.file)?bytes:geometryOnly(bytes)
  const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(geometry.buffer.slice(geometry.byteOffset,geometry.byteOffset+geometry.byteLength),'')
  const file=item.file.replace('.glb',''),source=prepareTempleAsset(gltf.scene,file)
  source.traverse(o=>{if(o.isMesh){const n=o.geometry.attributes.normal;assert.ok(n);for(let i=0;i<n.count;i++)assert.ok(Number.isFinite(n.getX(i)+n.getY(i)+n.getZ(i)),'Normal phải hữu hạn');if(file==='altar'){assert.equal(o.geometry.groups.length,2);assert.ok(o.geometry.groups.every(g=>g.count>0));assert.equal(o.geometry.groups.reduce((s,g)=>s+g.count,0),o.geometry.index.count)}}})
  const limits=file==='altar'?{height:3.65,maxWidth:3.1,maxDepth:2.8}:file==='qa'?{height:2.4,maxWidth:.9,maxDepth:.8}:Object.values(SCULPTURE_PROFILES).find(p=>p.file===file)
  const first=fitTempleModel(source,limits),second=fitTempleModel(source,limits),box=new THREE.Box3().setFromObject(first),size=box.getSize(new THREE.Vector3())
  assert.ok(Math.abs(box.min.y)<.0001,'Đáy mẫu phải nằm đúng mặt sàn/bàn thờ')
  assert.ok(size.x<=limits.maxWidth+.0001&&size.z<=limits.maxDepth+.0001&&size.y<=limits.height+.0001,'Mẫu không vượt vùng bố trí')
  first.position.x+=10;assert.ok(Math.abs(second.position.x-first.position.x)>9,'Các bản dùng chung không được kéo nhau đi')
}
assert.ok(total<32_000_000,'Bộ tượng dưới 32 MB, được tải theo khu')
// Tải hỏng vẫn giữ tượng dự phòng; đóng cảnh trong lúc tải không chèn object trở lại.
const originalFetch=globalThis.fetch
try{
  globalThis.fetch=async()=>new Response('broken',{status:200})
  const library=createTempleModels(),parent=new THREE.Group(),fallback=new THREE.Group()
  const anchor=library.place('qa',parent,{height:2,material:new THREE.MeshStandardMaterial()},fallback)
  assert.equal(await library.ready,'partial');assert.equal(fallback.visible,true);assert.equal(anchor.children.length,1);library.dispose()
  let release;globalThis.fetch=()=>new Promise(resolve=>{release=resolve})
  const closing=createTempleModels(),group=new THREE.Group();closing.place('qa',group,{height:2,material:new THREE.MeshStandardMaterial()},new THREE.Group());closing.dispose();release(new Response('broken'))
  await Promise.resolve();assert.equal(group.children[0].children.length,1)
}finally{globalThis.fetch=originalFetch}
console.log('Tượng 3D: 11 GLB hợp lệ, normal/vật liệu/tỷ lệ/ghi công đúng; tải lỗi có dự phòng; '+total+' byte.')

// Dựng thật mọi nhánh nội thất để bắt lỗi chỉ xuất hiện khi bước vào một điện ít dùng.
const {createTempleDetails}=await import('../src/components/templeDetails.js')
const {WORLD_SPOTS}=await import('../src/data/templeWorld.js')
const materials=new Map(),mat=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color}));return materials.get(color)}
const mesh=(g,c,x,y,z,p)=>{const o=new THREE.Mesh(g,mat(c));o.position.set(x,y,z);p.add(o);return o}
const box=(w,h,d,c,x,y,z,p)=>mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,p)
const sphere=(r,c,x,y,z,p,sx=1,sy=1,sz=1)=>{const o=mesh(new THREE.SphereGeometry(r,8,6),c,x,y,z,p);o.scale.set(sx,sy,sz);return o}
const cylinder=(a,b,h,c,x,y,z,p,n=12)=>mesh(new THREE.CylinderGeometry(a,b,h,n),c,x,y,z,p)
const beam=(a,b,r,c,p)=>{const o=cylinder(r,r,a.distanceTo(b),c,...a.clone().add(b).multiplyScalar(.5).toArray(),p);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());return o}
const details=createTempleDetails({box,sphere,cylinder,mesh,beam,mat,label(){},lantern(){},animated:{bells:[]},models:{place(file,p,options,fallback){assert.ok(manifest.some(a=>a.file===file+'.glb'));const g=new THREE.Group();g.position.set(...(options.position||[0,0,0]));if(fallback)g.add(fallback);p.add(g);return g}}})
let interiors=0
for(const s of WORLD_SPOTS.filter(s=>s.architecture.style)){
  const root=new THREE.Group();details.decorate(s,root,s.width,s.depth,s.architecture.height)
  const bounds=new THREE.Box3().setFromObject(root);assert.ok(Number.isFinite(bounds.min.length()+bounds.max.length()),s.id+' có hình học hữu hạn')
  assert.ok(bounds.max.y<=s.architecture.height+1,s.id+' không xuyên phần đỉnh mái')
  assert.ok(bounds.max.x<=s.width/2+.6&&bounds.min.x>=-s.width/2-.6,s.id+' nội thất nằm trong bề ngang điện')
  const geometries=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry)});geometries.forEach(g=>g.dispose());interiors++
}
materials.forEach(m=>m.dispose());assert.equal(interiors,18);console.log('Nội thất: dựng đủ 18 hồ sơ kiến trúc, hình học hữu hạn và đúng bề ngang/chiều cao.')
