import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { WORLD_SPOTS, WORLD_TREES } from '../data/templeWorld.js'

const COLORS = { roof:0x9b4937, edge:0xd59867, wood:0x604135, gold:0xd4a45d, stone:0xd2c8ae, leaf:0x486f53 }
export function createTempleWorld(scene) {
  const root=new THREE.Group();scene.add(root)
  const materials=new Map(), geometries=new Map(), animated={ ponds:[], smoke:[], bells:[], roofs:[], lanterns:[] }, targets=[],retired=new Set()
  const mat=(color,extra={})=>{
    const key=JSON.stringify([color,extra])
    if(!materials.has(key)) materials.set(key,new THREE.MeshStandardMaterial({color,roughness:0.87,...extra}))
    return materials.get(key)
  }
  const geo=(key,make)=>{if(!geometries.has(key))geometries.set(key,make());return geometries.get(key)}
  function mesh(g,color,x,y,z,parent=root,extra={}) {
    const m=new THREE.Mesh(g,mat(color,extra));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m
  }
  const box=(w,h,d,c,x,y,z,p=root)=>mesh(geo('b'+[w,h,d],()=>new THREE.BoxGeometry(w,h,d)),c,x,y,z,p)
  const sphere=(r,c,x,y,z,p=root,sx=1,sy=1,sz=1)=>{const m=mesh(geo('s'+r,()=>new THREE.SphereGeometry(r,14,10)),c,x,y,z,p);m.scale.set(sx,sy,sz);return m}
  const cylinder=(r1,r2,h,c,x,y,z,p=root,n=12)=>mesh(geo('c'+[r1,r2,h,n],()=>new THREE.CylinderGeometry(r1,r2,h,n)),c,x,y,z,p)
  const beam=(a,b,r,c,p)=>{
    const d=new THREE.Vector3().subVectors(b,a),m=cylinder(r,r,d.length(),c,...a.clone().add(b).multiplyScalar(.5).toArray(),p,8)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m
  }
  function label(text,x,y,z,width=4.8,parent=root,small=false) {
    const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128
    const ctx=canvas.getContext('2d');ctx.fillStyle=small?'#f2e6cb':'#4e342a';ctx.fillRect(0,0,768,128)
    ctx.strokeStyle='#c8a36a';ctx.lineWidth=5;ctx.strokeRect(6,6,756,116)
    ctx.fillStyle=small?'#513c30':'#f3d59c';ctx.font='600 43px system-ui, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,65,730)
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace
    const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width/6),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}))
    m.position.set(x,y,z);parent.add(m);return m
  }
  // Mặt mái võng và đầu đao cong, tự dựng bằng geometry thay vì model tải ngoài.
  function roof(w,d,y,p,tiers=1) {
    const roofs=new THREE.Group();p.add(roofs)
    for(let tier=0;tier<tiers;tier++) {
      const tw=w*(1-tier*.26),td=d*(1-tier*.24),base=y+tier*1.4
      for(const side of [-1,1]) {
        const vertices=[],indices=[],nx=20,nz=8
        for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++) {
          const u=ix/nx*2-1,v=iz/nz
          const x=u*tw/2,z=side*v*td/2
          const height=base+1.25*(1-v)**1.7+.42*Math.abs(u)**6*v**2+.18*v**8
          vertices.push(x,height,z)
        }
        for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++) {
          const a=iz*(nx+1)+ix,b=a+nx+1
          indices.push(a,b,a+1,a+1,b,b+1)
        }
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals()
        mesh(g,COLORS.roof,0,0,0,roofs,{side:THREE.DoubleSide})
        // Hàng ngói nổi và viền mái tạo chi tiết ngay cả khi nhìn từ trên cao.
        for(let ix=0;ix<=20;ix++) {
          const u=ix/20*2-1,points=[]
          for(let iz=0;iz<=8;iz++) {
            const v=iz/8;points.push(new THREE.Vector3(u*tw/2,base+1.25*(1-v)**1.7+.42*Math.abs(u)**6*v**2+.18*v**8+.035,side*v*td/2))
          }
          const curve=new THREE.CatmullRomCurve3(points)
          mesh(new THREE.TubeGeometry(curve,9,.024,4,false),0xb96146,0,0,0,roofs)
        }
        const edge=[]
        for(let i=0;i<=20;i++){const u=i/20*2-1;edge.push(new THREE.Vector3(u*tw/2,base+.18+.42*Math.abs(u)**6,side*td/2))}
        mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge),22,.075,6,false),COLORS.edge,0,0,0,roofs)
      }
      beam(new THREE.Vector3(-tw/2,base+1.3,0),new THREE.Vector3(tw/2,base+1.3,0),.11,COLORS.edge,roofs)
      for(const sign of [-1,1]) {
        const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(sign*tw/2,base+1.3,0),new THREE.Vector3(sign*(tw/2+.28),base+1.6,0),new THREE.Vector3(sign*(tw/2+.12),base+1.95,0)])
        mesh(new THREE.TubeGeometry(curve,12,.08,6,false),COLORS.gold,0,0,0,roofs)
      }
    }
    return roofs
  }
  function lantern(x,y,z,parent) {
    const l=sphere(.21,0xbd5d3f,x,y,z,parent,1,1.4,1)
    cylinder(.08,.08,.08,COLORS.gold,x,y+.3,z,parent)
    cylinder(.03,.03,.25,COLORS.gold,x,y-.4,z,parent,6);animated.lanterns.push(l)
  }
  function buddha(x,y,z,size,parent) {
    const p=new THREE.Group();p.position.set(x,y,z);p.scale.setScalar(size);parent.add(p)
    cylinder(.9,1.05,.23,0x987540,0,.1,0,p,20)
    sphere(.67,0xc7a269,0,.55,0,p,1.35,.55,.7)
    cylinder(.36,.65,1.05,COLORS.gold,0,1.13,0,p,18)
    sphere(.34,0xe0bb7b,0,1.98,0,p);sphere(.17,0x806039,0,2.26,0,p)
    sphere(.09,0xdab473,-.34,1.94,0,p,1,1.7,1);sphere(.09,0xdab473,.34,1.94,0,p,1,1.7,1)
    sphere(.16,0xe0bb7b,0,1.03,.43,p,1.5,.6,1)
    const halo=mesh(new THREE.TorusGeometry(.64,.035,8,44),0xe2ba70,0,1.95,-.26,p)
    halo.material=mat(0xe2ba70,{emissive:0x8b5521,emissiveIntensity:.35})
  }
  function censer(x,y,z,parent,id) {
    cylinder(.38,.29,.42,0x8b7050,x,y+.4,z,parent,18)
    cylinder(.43,.43,.08,COLORS.gold,x,y+.64,z,parent,20)
    for(const dx of [-.18,0,.18]) {
      cylinder(.017,.017,.63,0x7d3426,x+dx,y+1,z,parent,5)
      sphere(.03,0xff9a4c,x+dx,y+1.32,z,parent)
    }
    for(let i=0;i<5;i++) {
      const puff=sphere(.09,0xe6dfd1,x,y+1.5+i*.17,z,parent,1,1.5,1)
      puff.material=new THREE.MeshBasicMaterial({color:0xe6dfd1,transparent:true,opacity:0,depthWrite:false})
      animated.smoke.push({mesh:puff,y:y+1.5+i*.17,phase:i*1.3,id})
    }
  }
  function building(spot) {
    const {x,centerZ:z,kind,depth:d}=spot,w=kind==='main'?11:kind==='hall'||kind==='house'?6:3.4
    const h=kind==='main'?4.3:kind==='tower'?4.8:2.7,p=new THREE.Group();p.position.set(x,0,z);root.add(p)
    box(w+.7,.24,d+.8,COLORS.stone,0,.13,0,p)
    box(w+.3,.1,.55,0xe1d4b6,0,.08,d/2+.6,p)
    box(w,.1,d,0xb29a78,0,.28,0,p)
    // Bỏ vách trước để nhìn được nội điện, các vách bên vẫn có cửa sổ.
    box(w,.95,.18,0xba9c77,0,.75,-d/2,p)
    for(const side of [-1,1]) {
      box(.15,.8,d,0xc3aa85,side*w/2,.65,0,p)
      for(const zz of [-d/2,d/2]) {
        cylinder(.14,.19,h,COLORS.wood,side*(w/2-.35),h/2+.25,zz*.83,p)
        cylinder(.23,.27,.22,COLORS.stone,side*(w/2-.35),.4,zz*.83,p)
      }
      if(kind==='main') cylinder(.16,.2,h,COLORS.wood,side*2,h/2+.25,d/2-.4,p)
      lantern(side*(w/2-.65),h-.4,d/2+.3,p)
    }
    box(w,.23,.22,COLORS.wood,0,h+.12,d/2-.35,p)
    const r=roof(w+1.5,d+1.9,h+.15,p,kind==='main'||kind==='tower'?2:1)
    animated.roofs.push({mesh:r,x,z,w,d})
    label(spot.bienHieu,0,h-.18,d/2+.15,Math.min(w-.5,7),p)
    if(spot.huong) {
      box(w*.5,.8,.8,0x764839,0,.65,-d/2+.85,p)
      buddha(0,1.1,-d/2+.8,kind==='main'?1.15:.72,p)
      censer(0,.25,d/2+.3,p,spot.id)
      for(const side of [-1,1]) {
        cylinder(.12,.18,.42,0xdac5a1,side*w*.19,1.25,-d/2+1,p)
        for(let i=0;i<3;i++) sphere(.11,0xd48d9b,side*w*.19+(i-1)*.12,1.6+Math.sin(i)*.12,-d/2+1,p)
      }
    } else if(kind==='bell') {
      const bell=cylinder(.4,.67,1.12,0x9f8556,0,1.8,0,p,22)
      cylinder(.7,.7,.12,0x69593c,0,1.22,0,p,24);animated.bells.push({mesh:bell,id:spot.id})
      beam(new THREE.Vector3(-1,2.4,0),new THREE.Vector3(1,2.4,0),.09,COLORS.wood,p)
    } else {
      for(let i=-1;i<=1;i++) {
        box(.9,1.2,.35,COLORS.wood,i*1.5,1,-d/2+.5,p)
        for(let j=0;j<5;j++)box(.1,.65,.22,[0xa78960,0x7e9c8f,0xc7a375][j%3],i*1.5-.3+j*.14,1.05,-d/2+.73,p)
      }
    }
    targets.push({object:p,spot})
  }
  function tree(x,z,size=1) {
    const p=new THREE.Group();p.position.set(x,0,z);p.scale.setScalar(size);root.add(p)
    cylinder(.13,.24,1.8,0x79604b,0,.9,0,p,7)
    for(let i=0;i<4;i++) {
      const a=i*2.4;sphere(.9,[0x46694d,0x638265,0x78906b,0x527658][i],Math.cos(a)*.48,2.3+(i%2)*.55,Math.sin(a)*.45,p,1,.85,1)
    }
    cylinder(1.1,1.22,.12,0x92977c,0,.1,0,p,12)
  }
  function lotus(x,z,parent=root) {
    const leaf=cylinder(.3,.3,.025,0x587d5d,x,.18,z,parent,16)
    leaf.rotation.y=x
    for(let i=0;i<6;i++) {
      const a=i*Math.PI/3,petal=sphere(.12,0xe4b8b7,x+Math.cos(a)*.1,.27,z+Math.sin(a)*.1,parent,.7,1.2,1.8)
      petal.rotation.y=-a;petal.rotation.z=.35
    }
    sphere(.065,0xe7c474,x,.31,z,parent)
  }
  function pond(spot,sen=false) {
    const p=new THREE.Group();p.position.set(spot.x,0,spot.centerZ);root.add(p)
    box(6.4,.25,3.4,0xb2ae93,0,.13,0,p)
    const water=box(5.9,.035,2.9,0x639c95,0,.28,0,p)
    water.material=mat(0x639c95,{metalness:.2,roughness:.28});animated.ponds.push(water)
    for(let i=0;i<9;i++)lotus(-2.3+(i%4)*1.3,-.8+Math.floor(i/4)*.75,p)
    if(!sen) { sphere(.25,0x526c46,1.7,.4,.5,p,1,.4,1.3);sphere(.09,0x526c46,1.7,.4,.85,p) }
    targets.push({object:p,spot})
    label(spot.ten,0,.7,1.85,3.5,p,true)
  }
  // Sân gạch, trục hành lễ, đường ngang và hành lang nối toàn bộ 23 khu.
  box(55,.5,58,0x779278,0,-.3,0)
  box(50,.08,53,0xb8aa8a,0,0,0)
  for(let x=-24;x<=24;x+=2)for(let z=-25;z<=25;z+=2) {
    box(1.94,.015,1.94,((x+z)%6===0?0xc5b496:0xbfad90),x,.048,z)
  }
  box(4,.02,49,0xd7c5a7,0,.065,-.5)
  for(const z of [-21,-12,-1,9,20])box(49,.025,1.7,0xd4c4a6,0,.07,z)
  for(const x of [-16,16])box(1.7,.025,49,0xd4c4a6,x,.07,-.5)
  // Tường bao, ô thoáng và đèn đá.
  for(const side of [-1,1]) {
    box(.38,1.1,55,0xc7bda4,side*26, .5,-.5)
    box(52,1.1,.38,0xc7bda4,0,.5,side===-1?-27:26)
    for(let z=-25;z<=25;z+=5){box(.7,1.4,.7,0xdacfaf,side*26,.7,z);box(.8,.12,.8,COLORS.roof,side*26,1.45,z)}
  }
  for(const spot of WORLD_SPOTS) {
    if(spot.kind==='gate') {
      const p=new THREE.Group();p.position.set(0,0,spot.centerZ);root.add(p)
      for(const x of [-4,4]) {box(.85,3.8,.9,0xccc1a2,x,1.9,0,p);label('TÂM AN',x,2,.47,.65,p)}
      box(8.6,.7,.65,COLORS.wood,0,3.6,0,p);roof(10,2.6,4,p,2)
      label('CHÙA TAM SỞ',0,3.6,.5,5,p);targets.push({object:p,spot})
    } else if(spot.kind==='pond') pond(spot)
    else if(spot.kind==='garden') {
      pond({...spot,centerZ:spot.centerZ-1},true)

    } else if(spot.kind==='meditate') {
      const p=new THREE.Group();p.position.set(spot.x,0,spot.centerZ);root.add(p)
      cylinder(2.3,2.3,.12,0xc8c1a4,0,.1,0,p,32)
      for(const [x,z] of [[0,0],[-1,1],[1,1]])cylinder(.52,.6,.12,0x917655,x,.22,z,p,24)
      targets.push({object:p,spot})
      label(spot.ten,0,1,-1.4,3,p,true)
    } else if(spot.kind==='statue') {
      const p=new THREE.Group();p.position.set(spot.x,0,spot.centerZ);root.add(p)
      buddha(0,.1,0,1.2,p);targets.push({object:p,spot})
    } else building(spot)
  }
  for(const t of WORLD_TREES)tree(t.x,t.z,t.size)
  // Nhân vật khách áo lam; mô hình gốc tạo trong mã.
  const avatar=new THREE.Group();root.add(avatar)
  const standing=new THREE.Group();avatar.add(standing)
  const body=cylinder(.24,.38,.77,0x819b99,0,.86,0,standing,16)
  sphere(.24,0xd9b49a,0,1.48,0,standing)
  sphere(.245,0x3f3832,0,1.57,-.025,standing,1,.68,1)
  const legs=[cylinder(.09,.1,.44,0x425858,-.13,.29,0,standing),cylinder(.09,.1,.44,0x425858,.13,.29,0,standing)]
  const arms=[cylinder(.09,.12,.55,0x819b99,-.31,.91,0,standing),cylinder(.09,.12,.55,0x819b99,.31,.91,0,standing)]
  for(const dx of [-.13,.13])sphere(.12,0x3a4037,dx,.09,.07,standing,1,.5,1.6)
  const seated=new THREE.Group();avatar.add(seated);seated.visible=false
  cylinder(.22,.38,.55,0x819b99,0,.57,0,seated,16)
  sphere(.24,0xd9b49a,0,1.08,0,seated);sphere(.245,0x3f3832,0,1.17,-.025,seated,1,.68,1)
  for(const side of [-1,1]) {
    const knee=sphere(.25,0x617d7a,side*.23,.23,.14,seated,1.4,.65,1)
    const arm=cylinder(.08,.1,.48,0x819b99,side*.25,.54,.07,seated);arm.rotation.z=side*.5
    sphere(.08,0xd9b49a,side*.14,.34,.2,seated)
  }
  const ring=mesh(new THREE.RingGeometry(.47,.52,40),0xf6e2ad,0,.09,0,avatar,{side:THREE.DoubleSide,emissive:0xa6884b,emissiveIntensity:.4});ring.rotation.x=-Math.PI/2
  const marker=mesh(new THREE.RingGeometry(.28,.43,40),0xf8e0a6,0,.14,0,root,{side:THREE.DoubleSide,transparent:true,opacity:.9});marker.rotation.x=-Math.PI/2;marker.visible=false
  // Hào quang nhỏ để tìm thấy nhân vật khi xem toàn cảnh.
  const beacon=mesh(new THREE.ConeGeometry(.18,.4,5),0xffd18b,0,2.35,0,avatar);beacon.rotation.z=Math.PI
  const pathLine=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xf7dfa6,transparent:true,opacity:.9}));root.add(pathLine)
  // Gộp các hình tĩnh theo vật liệu để giảm draw call trên điện thoại.
  function mergeStatic(group, exclusions=new Set()) {
    group.updateWorldMatrix(true,true)
    const inverse=group.matrixWorld.clone().invert(),buckets=new Map(),remove=[]
    function collect(o) {
      if(exclusions.has(o))return
      if(o.isMesh && !Array.isArray(o.material)) {
        retired.add(o.geometry);const g=o.geometry.clone();g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld))
        const key=o.material;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(g);remove.push(o)
      }
      for(const child of o.children)collect(child)
    }
    for(const child of group.children)collect(child)
    for(const o of remove)o.removeFromParent()
    for(const [material,gs] of buckets) {
      const merged=mergeGeometries(gs,false)
      if(merged){const m=new THREE.Mesh(merged,material);m.castShadow=true;m.receiveShadow=true;group.add(m)}
      gs.forEach(g=>g.dispose())
    }
    // Geometry gốc trong cache vẫn được giải phóng cùng cảnh.
  }
  for(const r of animated.roofs)mergeStatic(r.mesh)
  const excluded=new Set([avatar,marker,pathLine,...animated.roofs.map(r=>r.mesh),...animated.smoke.map(s=>s.mesh),...animated.bells.map(b=>b.mesh),...animated.lanterns,...animated.ponds])
  mergeStatic(root,excluded)
  for(const target of targets) {
    const s=target.spot,w=s.kind==='main'?11:['hall','house'].includes(s.kind)?6:3.5
    const hit=new THREE.Mesh(new THREE.BoxGeometry(w,3,s.depth),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}))
    hit.position.set(s.x,1.5,s.centerZ);root.add(hit);target.object=hit
  }
  return {root,avatar,standing,seated,body,legs,arms,marker,beacon,animated,targets,pathLine,
    dispose(){
      const gs=new Set(),ms=new Set(),ts=new Set()
      root.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m){ms.add(m);if(m.map)ts.add(m.map)}})
      for(const g of geometries.values())gs.add(g);for(const g of retired)gs.add(g);
      gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());scene.remove(root)
    }
  }
}
