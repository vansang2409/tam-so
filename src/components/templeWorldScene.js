import * as THREE from 'three'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { createTempleMaterials } from './templeMaterials.js'
import { createTempleSprigGeometry, populateTempleSprigs } from './templeFoliage.js'
import { createTempleIncense } from './templeIncense.js'
import { createTempleAtmosphere } from './templeAtmosphere.js'
import { createTemplePetalGeometry } from './templeFlowers.js'
import { createTempleGardenFurniture } from './templeGardenFurniture.js'
import { createTempleDetails } from './templeDetails.js'
import { createTempleMainHall } from './templeMainHall.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createDetailedVisitors } from './templeDetailedVisitors.js'
import { createTempleAvatar } from './templeAvatar.js'
import { createTempleBowRig } from './templeBowRig.js'
import { createTempleModels } from './templeModels.js'
import { WORLD_SPOTS, WORLD_TREES, templeBasinCenterZ, TEMPLE_CENSER_HALF, TEMPLE_CENSER_FRONT_OFFSET, TEMPLE_COURTYARD_BASE_TOP } from '../data/templeWorld.js'
import { createTempleLotusLeafGeometry, createTempleLotusBudGeometry } from './templeLotusLeaves.js'

const COLORS = { roof:0x9b4937, edge:0xd59867, wood:0x604135, gold:0xd4a45d, stone:0xd2c8ae, leaf:0x486f53 }
export function createTempleBoxGeometry(w,h,d) {
    // Small bevels catch light on stone steps, door frames and timber edges.
    const g=new RoundedBoxGeometry(w,h,d,1,Math.min(.035,w*.12,h*.12,d*.12)),uv=g.attributes.uv,a=g.attributes.position,n=g.attributes.normal
    for(let i=0;i<uv.count;i++){
      const nx=Math.abs(n.getX(i)),ny=Math.abs(n.getY(i)),nz=Math.abs(n.getZ(i))
      const u=nx>ny&&nx>nz?a.getZ(i):a.getX(i),v=ny>nx&&ny>nz?a.getZ(i):a.getY(i)
      uv.setXY(i,u*.5,v*.5)
    }const indexed=mergeVertices(g);g.dispose();return indexed
}
export function createTempleWorld(scene) {
  const root=new THREE.Group();scene.add(root)
  const materialSystem=createTempleMaterials(), geometries=new Map(), animated={ incenseTips:[], ponds:[], bells:[], roofs:[], lanterns:[],ripples:[] }, targets=[],retired=new Set()
  const incense=createTempleIncense(root,materialSystem.smoke)
  const models=createTempleModels(),interiors=[],porchItems=[],shells=[]
  const mat=materialSystem.material
  const geo=(key,make)=>{if(!geometries.has(key))geometries.set(key,make());return geometries.get(key)}
  function mesh(g,color,x,y,z,parent=root,extra={}) {
    const m=new THREE.Mesh(g,mat(color,extra));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m
  }
  const box=(w,h,d,c,x,y,z,p=root,extra={})=>mesh(geo('b'+[w,h,d],()=>{
    return createTempleBoxGeometry(w,h,d)
  }),c,x,y,z,p,extra)
  const sphere=(r,c,x,y,z,p=root,sx=1,sy=1,sz=1)=>{const m=mesh(geo('s'+r,()=>new THREE.SphereGeometry(r,14,10)),c,x,y,z,p);m.scale.set(sx,sy,sz);return m}
  const cylinder=(r1,r2,h,c,x,y,z,p=root,n=12)=>mesh(geo('c'+[r1,r2,h,n],()=>new THREE.CylinderGeometry(r1,r2,h,n)),c,x,y,z,p)
  const beam=(a,b,r,c,p)=>{
    const d=new THREE.Vector3().subVectors(b,a),m=cylinder(r,r,d.length(),c,...a.clone().add(b).multiplyScalar(.5).toArray(),p,8)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m
  }
  function label(text,x,y,z,width=4.8,parent=root,small=false) {
    const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128
    const ctx=canvas.getContext('2d');ctx.fillStyle=small?'#71664d':'#4e342a';ctx.fillRect(0,0,768,128)
    ctx.strokeStyle='#c8a36a';ctx.lineWidth=5;ctx.strokeRect(6,6,756,116)
    ctx.fillStyle=small?'#eee2bb':'#f3d59c';ctx.font='600 43px system-ui, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,65,730)
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace
    const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width/(small?7:9)),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}))
    m.position.set(x,y,z);parent.add(m);return m
  }
  // Mặt mái võng và đầu đao cong, tự dựng bằng geometry thay vì model tải ngoài.
  function roof(w,d,y,p,tiers=1,palette={}) {
    const roofs=new THREE.Group();p.add(roofs)
    for(let tier=0;tier<tiers;tier++) {
      const tw=w*(1-tier*.26),td=d*(1-tier*.24),base=y+tier*1.4
      for(const side of [-1,1]) {
        const vertices=[],indices=[],uvs=[],nx=20,nz=8
        for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++) {
          const u=ix/nx*2-1,v=iz/nz
          const x=u*tw/2,z=side*v*td/2
          const height=base+1.25*(1-v)**1.7+.42*Math.abs(u)**6*v**2+.18*v**8
          vertices.push(x,height,z);uvs.push((u+1)*tw*.25,v*td*.3)
        }
        for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++) {
          const a=iz*(nx+1)+ix,b=a+nx+1
          indices.push(a,b,a+1,a+1,b,b+1)
        }
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals()
        mesh(g,palette.roof||COLORS.roof,0,0,0,roofs,{side:THREE.DoubleSide})
        // Hàng ngói nổi và viền mái tạo chi tiết ngay cả khi nhìn từ trên cao.
        for(let ix=0;ix<=20;ix++) {
          const u=ix/20*2-1,points=[]
          for(let iz=0;iz<=8;iz++) {
            const v=iz/8;points.push(new THREE.Vector3(u*tw/2,base+1.25*(1-v)**1.7+.42*Math.abs(u)**6*v**2+.18*v**8+.035,side*v*td/2))
          }
          const curve=new THREE.CatmullRomCurve3(points)
          mesh(new THREE.TubeGeometry(curve,9,.024,4,false),palette.roof||0xb96146,0,0,0,roofs)
        }
        // Overlapping courses interrupt the smooth roof plane like individual clay tiles.
        for(let row=1;row<=7;row++){
          const v=row/8,points=[]
          for(let i=0;i<=40;i++){
            const u=i/40*2-1
            points.push(new THREE.Vector3(u*tw/2,base+1.25*(1-v)**1.7+.42*Math.abs(u)**6*v**2+.18*v**8+.018,side*v*td/2))
          }
          mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),40,.014,4,false),palette.roof||COLORS.roof,0,0,0,roofs)
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
  function lantern(x,y,z,parent,ceiling=y+.6,supportZ=z) {
    const l=sphere(.21,0xbd5d3f,x,y,z,parent,1,1.4,1)
    cylinder(.08,.08,.08,COLORS.gold,x,y+.3,z,parent)
    const cordTop=Math.max(y+.34,ceiling);beam(new THREE.Vector3(x,y+.34,z),new THREE.Vector3(x,cordTop,supportZ),.008,0x574b37,parent)
    cylinder(.03,.03,.25,COLORS.gold,x,y-.4,z,parent,6);animated.lanterns.push(l)
  }
  function buddha(x,y,z,size,parent){return details.figure('buddha',x,y,z,size,parent)}
  function censer(x,y,z,parent,id) {
    const bowl=cylinder(.38,.29,.42,0x8b7050,x,y+.4,z,parent,18)
    bowl.geometry.computeBoundingBox();const baseTop=bowl.position.y+bowl.geometry.boundingBox.min.y
    box(TEMPLE_CENSER_HALF*2,baseTop-TEMPLE_COURTYARD_BASE_TOP,TEMPLE_CENSER_HALF*2,COLORS.stone,x,(baseTop+TEMPLE_COURTYARD_BASE_TOP)/2,z,parent,{surface:'stone'})
    cylinder(.43,.43,.08,COLORS.gold,x,y+.64,z,parent,20)
    const tipMaterial=mat(0x563a2d,{name:"Incense tip · "+id,emissive:0xe09447,emissiveIntensity:0})
    animated.incenseTips.push({id,material:tipMaterial,lit:false})
    for(const dx of [-.18,0,.18]) {
      cylinder(.017,.017,.63,0x7d3426,x+dx,y+1,z,parent,5)
      sphere(.03,0x563a2d,x+dx,y+1.32,z,parent).material=tipMaterial
    }
    incense.register(id,'outside',parent,{x,y:y+1.35,z})
  }
  function building(spot) {
    const {x,centerZ:z,kind,depth:d,width:w,architecture:a}=spot
    const h=a.height||3,p=new THREE.Group();p.position.set(x,0,z);root.add(p)
    // Mặt tiền tách riêng để camera trong điện không bị cột/cửa che sát ống kính.
    const facade=new THREE.Group();p.add(facade);porchItems.push({mesh:facade,id:spot.id})
    box(w+.7,.24,d+.8,COLORS.stone,0,.13,0,p)
    box(w+.3,.1,.55,0xe1d4b6,0,.08,d/2+.6,p)
    box(w,.1,d,0xb29a78,0,.28,0,p)
    for(const side of [-1,1]){
      box(.22,.09,d+.5,0xa49b87,side*(w/2+.12),.29,0,p,{surface:'stone'})
      for(const zz of [-d/2+.3,d/2-.3]){
        const xx=side*(w/2-.35),g=zz>0?facade:p
        cylinder(.28,.31,.13,COLORS.stone,xx,.39,zz,g,24)
        cylinder(.20,.28,.16,COLORS.stone,xx,.53,zz,g,24)
        cylinder(.21,.16,.14,a.wood,xx,h-.06,zz,g,24)
        box(.5,.13,.43,a.wood,xx,h+.05,zz,g)
      }
    }
    // Deep eaves: rafters and purlins make the roof read as assembled timber.
    for(const side of [-1,1]){
      box(w+.25,.16,.16,a.wood,0,h-.10,side*(d/2+.15),p)
      for(let xx=-w/2;xx<=w/2;xx+=.55)box(.065,.1,.85,a.wood,xx,h+.02,side*(d/2+.14),p)
    }
    // Bỏ vách trước để nhìn được nội điện, các vách bên vẫn có cửa sổ.
    box(w,kind==='bell'?.9:h-.25,.18,a.wall,0,kind==='bell'?.75:.3+(h-.25)/2,-d/2,p)
    for(const side of [-1,1]) {
      box(.15,1.05,d,a.wall,side*w/2,.825,0,p)
      if(kind!=='bell')box(.15,Math.max(.2,h-2.65),d,a.wall,side*w/2,2.55+Math.max(.2,h-2.65)/2,0,p)
      for(const zz of [-d/2,d/2]) {
        cylinder(.14,.19,h,a.wood,side*(w/2-.35),h/2+.25,Math.sign(zz)*(d/2-.3),zz>0?facade:p)
        cylinder(.23,.27,.22,COLORS.stone,side*(w/2-.35),.4,zz*.83,zz>0?facade:p)
      }
      if(kind==='main')for(const [xx,zz] of a.pillars.filter(([xx])=>Math.sign(xx)===side)){cylinder(.2,.25,h,a.wood,xx,h/2+.25,zz,zz>5?facade:p,20);cylinder(.33,.38,.25,COLORS.stone,xx,.4,zz,zz>5?facade:p,20)}
      lantern(side*(w/2-.65),h-.6,d/2+.3,facade,h-.1,d/2+.15)
    }
    box(w,.23,.22,a.wood,0,h+.12,d/2-.35,facade)
    if(kind==='main')createTempleMainHall({box,sphere,cylinder,mesh,beam,label,mat}).exterior(facade,w,d,h,a)
    const r=roof(w+1.5,d+1.9,h+.15,p,kind==='tower'?1:a.tiers,a)
    if(kind==='tower'){const lower=roof(w+1,d+1,3,p,1,a);animated.roofs.push({mesh:lower,x,z,w,d});for(const side of [-1,1]){box(.12,.1,d+.6,a.wood,side*(w/2+.2),3.1,0,p);for(let z=-d/2;z<=d/2;z+=.35)cylinder(.025,.025,.6,a.wood,side*(w/2+.2),2.8,z,p,6)}}
    animated.roofs.push({mesh:r,x,z,w,d})
    label(spot.bienHieu,0,h-.18,d/2+.15,Math.min(w-.5,kind==='main'?5:4.5),facade)
    if(spot.huong){const porch=new THREE.Group();porch.position.set(x,0,z);root.add(porch);censer(spot.censerX,.25,d/2+TEMPLE_CENSER_FRONT_OFFSET,porch,spot.id);porchItems.push({mesh:porch,id:spot.id})}
    const interior=new THREE.Group();p.add(interior)
    const item={mesh:interior,spot,built:false,ensure(){
      if(item.built)return;item.built=true
      details.decorate(spot,interior,w,d,h)
      mergeStatic(interior,new Set([...models.anchors,...animated.bells.map(b=>b.mesh),...animated.lanterns]))
    }}
    interiors.push(item)
    const files={'chanh-dien':'main-shell','nha-to':'ancestor-shell','thap-chuong':'bell-shell','giang-duong':'lecture-shell','nha-khach':'guest-shell','thu-vien':'library-shell','cua-hang-phap-bao':'guest-shell'}
    const file=files[spot.id]||(['hall','shrine'].includes(kind)?'ancestor-shell':kind==='house'?'meditation-shell':null)
    if(file){
      const anchor=models.place(file,root,{height:h+1.8,width:w+1.2,depth:d+1.2,position:[x,0,z]})
      shells.push({anchor,fallback:p,id:spot.id})
    }
    targets.push({object:p,spot})
  }
  function tree(x,z,size=1) {
    const p=new THREE.Group();p.position.set(x,0,z);p.scale.setScalar(size);root.add(p)
    cylinder(.12,.24,2.8,0x79604b,0,1.4,0,p,10)
    for(let i=0;i<5;i++) {
      const a=i*2.4,dx=Math.cos(a)*.7,dz=Math.sin(a)*.7
      beam(new THREE.Vector3(0,1.7,0),new THREE.Vector3(dx,3.2+(i%2)*.3,dz),.075,0x79604b,p)
    }
    // Small leaf sprays on curved cards; one instanced draw per tree.
    const leaves=populateTempleSprigs(new THREE.InstancedMesh(geo('leaf-sprig',createTempleSprigGeometry),materialSystem.foliage,240))
    leaves.castShadow=true;leaves.receiveShadow=true;p.add(leaves)
    cylinder(.55,.65,.08,0x626c4b,0,.07,0,p,12)
  }
  function lotus(x,z,parent=root,index=0) {
    const variation=.85+(Math.sin(index*4.71)+1)*.13
    const leaf=mesh(geo('lotus-leaf-'+index%3,()=>createTempleLotusLeafGeometry(index%3)),index%3?0x587d5d:0x698568,x,.287,z,parent,{vertexColors:true,side:THREE.DoubleSide,roughness:.9})
    leaf.rotation.y=index*2.39996;leaf.scale.setScalar(variation)
    const flowerX=x+.045*Math.sin(index*2.4),flowerZ=z+.04*Math.cos(index*2.4),baseY=.37+(index%3)*.015
    cylinder(.004,.005,baseY+.015-.27,0x60794c,flowerX,(baseY+.015+.27)/2,flowerZ,parent,6)
    if(index%4===1){
      const bud=mesh(geo('lotus-bud',createTempleLotusBudGeometry),0xe4b8b7,flowerX,baseY,flowerZ,parent,{vertexColors:true,side:THREE.DoubleSide,roughness:.85})
      bud.scale.set(variation,1,variation);bud.rotation.y=index*2.39996
    }else{
      const bloom=mesh(geo('lotus-petals',createTemplePetalGeometry),index%3?0xe4b8b7:0xead1c1,flowerX,baseY,flowerZ,parent,{vertexColors:true,side:THREE.DoubleSide,roughness:.85})
      bloom.scale.setScalar(1.7*variation);bloom.rotation.y=index*2.39996
      sphere(.026,0xd1af62,flowerX,baseY+.02,flowerZ,parent,1,.55,1)
    }
  }
  function pond(spot,sen=false) {
    const p=new THREE.Group();p.position.set(spot.x,0,templeBasinCenterZ(spot));root.add(p)
    // A basin with open water volume, not a closed stone block under floating fish.
    box(6.4,.12,3.4,0x73806c,0,.01,0,p,{surface:'stone'})
    for(const side of [-1,1]){box(.25,.30,3.4,0xb2ae93,side*3.075,.21,0,p);box(5.9,.30,.25,0xb2ae93,0,.21,side*1.575,p)}
    const water=mesh(geo('pond-water',()=>new THREE.PlaneGeometry(5.9,2.9)),sen?0x456d62:0x4e6656,0,.285,0,p,{metalness:0,roughness:.22,transparent:true,opacity:.72,depthWrite:false})
    water.rotation.x=-Math.PI/2;water.castShadow=false;animated.ponds.push(water)
    if(sen)for(let i=0;i<19;i++)lotus(-2.35+(i%6)*.86+Math.sin(i*4.3)*.12,-.85+Math.floor(i/6)*.55+Math.cos(i*3.7)*.09,p,i)
    for(let i=0;i<4;i++){const ripple=new THREE.Mesh(new THREE.RingGeometry(.3,.313,40),new THREE.MeshBasicMaterial({color:0xaec2a1,transparent:true,opacity:.15,side:THREE.DoubleSide,depthWrite:false}));ripple.rotation.x=-Math.PI/2;ripple.position.set(-2+i*1.2,.291,Math.sin(i)*.7);p.add(ripple);animated.ripples.push({mesh:ripple,phase:i*.8})}
    for(let i=0;i<20;i++){const a=i*Math.PI/10;const rock=sphere(.23,0x929686,Math.cos(a)*3.05,.22,Math.sin(a)*1.53,p,1.4,.65,1);rock.rotation.y=a}
    for(let i=0;i<3;i++)sphere(.1,0xbd8961,-1.3+i*1.2,.18,Math.sin(i)*.6,p,.5,.2,2.7)

    if(!sen) {
      sphere(.25,0x526c46,1.7,.355,.5,p,1,.4,1.3);sphere(.09,0x526c46,1.7,.36,.87,p)
      for(const side of [-1,1]){
        sphere(.008,0x242c20,1.7+side*.071,.39,.91,p)
        for(const zz of [.28,.69])sphere(.055,0x526c46,1.7+side*.20,.28,zz,p,1.2,.3,1.7)
      }
      const shellRing=mesh(geo('turtle-shell-ring',()=>new THREE.TorusGeometry(.18,.004,4,24)),0x354b31,1.7,.425,.5,p);shellRing.rotation.x=-Math.PI/2
    }
    targets.push({object:p,spot})
    // A small supported placard on the rim leaves the pond visible at eye level.
    box(1.66,.27,.04,0x604135,-2,.7,1.6,p)
    for(const x of [-2.58,-1.42])box(.035,.53,.035,0x604135,x,.335,1.6,p)
    label(spot.ten,-2,.7,1.625,1.6,p,true)
  }
  const details=createTempleDetails({box,sphere,cylinder,mesh,beam,label,mat,lantern,animated,models,incense})
  // Sân gạch, trục hành lễ, đường ngang và hành lang nối toàn bộ 23 khu.
  // Extend the backdrop beyond the fog distance so the meadow has no visible table edge.
  const outsideGeometry=new THREE.PlaneGeometry(600,600);for(let i=0;i<outsideGeometry.attributes.uv.count;i++){const uv=outsideGeometry.attributes.uv;uv.setXY(i,uv.getX(i)*250,uv.getY(i)*250)}
  const outside=mesh(outsideGeometry,0x78805f,0,-.06,0,root,{surface:'grass'});outside.rotation.x=-Math.PI/2;outside.castShadow=false
  box(50,.1,53,0x7d8069,0,-.1,0)
  box(5.5,.035,19,0xb4aa8c,0,-.035,35,root,{surface:'brick'})
  box(50,TEMPLE_COURTYARD_BASE_TOP*2,53,0xb8aa8a,0,0,0)
  for(const x of [-24,24])box(1.7,.025,50,0x667449,x,.06,0)
  for(let x=-24;x<=24;x+=2)for(let z=-25;z<=25;z+=2) {
    box(1.94,.015,1.94,((x+z)%6===0?0xc5b496:0xbfad90),x,.048,z)
  }
  box(4,.02,49,0xd7c5a7,0,.065,-.5)
  for(const z of [-21,-12,-1,9,20])box(49,.025,1.7,0xd4c4a6,0,.07,z)
  for(const x of [-16,16])box(1.7,.025,49,0xd4c4a6,x,.07,-.5)
  // Tường bao, ô thoáng và đèn đá.
  for(const side of [-1,1]) {
    box(.38,1.1,50,0xc7bda4,side*26,.5,-2)
    if(side===-1)box(52,1.1,.38,0xc7bda4,0,.5,-27);else for(const direction of [-1,1])box(21.5,1.1,.38,0xc7bda4,direction*15.25,.5,23)
    for(let z=-25;z<=25;z+=5){box(.7,1.4,.7,0xdacfaf,side*26,.7,z);box(.8,.12,.8,COLORS.roof,side*26,1.45,z)}
  }
  for(const spot of WORLD_SPOTS) {
    if(spot.kind==='gate') {
      const p=new THREE.Group();p.position.set(0,0,spot.centerZ);root.add(p)
      for(const x of [-4,-2,2,4]){box(.5,4,.8,0xc5baa1,x,2,0,p);for(let j=0;j<3;j++)box(.66-j*.05,.1,.95-j*.06,0xa8a090,x,.1+j*.1,0,p);box(.6,.12,.94,0xbcae8a,x,3.45,0,p)}
      box(4.5,.6,.7,0x624936,0,3.8,0,p);const gateRoof=roof(5.5,2.6,4.2,p,2,{roof:0x714a36});animated.roofs.push({mesh:gateRoof,x:0,z:spot.centerZ,w:5.5,d:2.6})
      for(const side of [-1,1]){box(2.1,.4,.65,0x624936,side*3,2.9,0,p);roof(2.8,2.4,3.1,p,1,{roof:0x714a36});label('AN LẠC',side*3,2.9,.42,1.4,p)}
      label('CHÙA TAM SỞ',0,3.8,.5,3.5,p)
      for(const x of [-2,2])for(let j=0;j<4;j++)label(['TỪ','BI','HỶ','XẢ'][j],x,2.8-j*.42,.43,.24,p)
      const anchor=models.place('gate',root,{height:5.3,width:8.9,depth:2.8,position:[0,0,spot.centerZ]})
      shells.push({anchor,fallback:p,id:spot.id})
      targets.push({object:p,spot})
    } else if(spot.kind==='pond') pond(spot)
    else if(spot.kind==='garden') {
      pond(spot,true)

    } else if(spot.kind==='meditate') {
      const p=new THREE.Group();p.position.set(spot.x,0,spot.centerZ);root.add(p)
      cylinder(2.3,2.3,.12,0xc8c1a4,0,.1,0,p,32)
      for(const [x,z] of [[0,0],[-1,1],[1,1]])cylinder(.52,.6,.12,0x917655,x,.22,z,p,24)
      targets.push({object:p,spot})
      label(spot.ten,0,1,-1.4,3,p,true)
    } else if(spot.kind==='statue') {
      const p=new THREE.Group();p.position.set(spot.x,0,spot.centerZ);root.add(p)
      details.lotusBase(0,.12,0,1,p,0xb2afa0);details.figure('quan-am',0,.42,0,1.5,p);censer(0,.1,1.4,p,spot.id);targets.push({object:p,spot})
    } else building(spot)
  }
  for(const t of WORLD_TREES)tree(t.x,t.z,t.size)
  createTempleGardenFurniture(root,{box,mesh})
  // Shared adult visitor anatomy and articulated limbs, also cloned by online visitors.
  const avatar=new THREE.Group();root.add(avatar)
  const {standing,seated,body,legs,arms}=createTempleAvatar({mesh,sphere,cylinder},avatar)
  const bowRig=createTempleBowRig({mesh,cylinder,sphere},avatar),praying=bowRig.root;praying.visible=false
  const detailedVisitors=createDetailedVisitors(models,avatar,[standing,seated,praying])
  const ring=mesh(new THREE.RingGeometry(.47,.52,40),0xf6e2ad,0,.09,0,avatar,{side:THREE.DoubleSide,emissive:0xa6884b,emissiveIntensity:.4});ring.rotation.x=-Math.PI/2
  const marker=mesh(new THREE.RingGeometry(.28,.43,40),0xf8e0a6,0,.14,0,root,{side:THREE.DoubleSide,transparent:true,opacity:.9});marker.rotation.x=-Math.PI/2;marker.visible=false
  const hoverMarker=new THREE.Mesh(new THREE.RingGeometry(.3,.35,40),new THREE.MeshBasicMaterial({color:0xd8e3b9,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));hoverMarker.rotation.x=-Math.PI/2;hoverMarker.visible=false;root.add(hoverMarker)
  // Hào quang nhỏ để tìm thấy nhân vật khi xem toàn cảnh.
  const beacon=mesh(new THREE.ConeGeometry(.18,.4,5),0xffd18b,0,2.35,0,avatar);beacon.rotation.z=Math.PI
  const pathLine=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xf7dfa6,transparent:true,opacity:.9}));root.add(pathLine)
  // Gộp các hình tĩnh theo vật liệu để giảm draw call trên điện thoại.
  function mergeStatic(group, exclusions=new Set()) {
    group.updateWorldMatrix(true,true)
    const inverse=group.matrixWorld.clone().invert(),buckets=new Map(),remove=[]
    function collect(o) {
      if(exclusions.has(o)||o.isInstancedMesh)return
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
  for(const item of porchItems)mergeStatic(item.mesh,new Set(animated.lanterns))
  const excluded=new Set([incense.root,...shells.map(s=>s.fallback),...models.anchors,avatar,marker,hoverMarker,pathLine,...animated.roofs.map(r=>r.mesh),...porchItems.map(r=>r.mesh),...animated.bells.map(b=>b.mesh),...animated.lanterns,...animated.ponds,...animated.ripples.map(r=>r.mesh)])
  for(const interior of interiors)excluded.add(interior.mesh)
  for(const shell of shells)mergeStatic(shell.fallback,excluded)
  mergeStatic(root,excluded)
  for(const target of targets) {
    const s=target.spot,basin=s.kind==='pond'||s.kind==='garden',w=basin?6.4:s.width
    const hit=new THREE.Mesh(new THREE.BoxGeometry(w,3,basin?3.4:s.depth),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}))
    hit.position.set(s.x,1.5,basin?templeBasinCenterZ(s):s.centerZ);root.add(hit);target.object=hit
  }
  // Dynamic sky objects are created after static batching so flight transforms stay intact.
  const atmosphere=createTempleAtmosphere(root)
  return {root,models,interiors,porchItems,shells,detailedVisitors,avatar,standing,seated,praying,bowRig,body,legs,arms,marker,hoverMarker,beacon,animated,targets,pathLine,atmosphere,incense,
    dispose(){
      incense.dispose();atmosphere.dispose();detailedVisitors.dispose();models.dispose()
      const gs=new Set(),ms=new Set(),ts=new Set()
      root.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.geometry&&!o.geometry.userData.templeAsset)gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m&&!m.userData.templeAsset){ms.add(m);if(m.map)ts.add(m.map)}})
      for(const g of geometries.values())gs.add(g);for(const g of retired)gs.add(g);
      gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());materialSystem.dispose();scene.remove(root)
    }
  }
}
