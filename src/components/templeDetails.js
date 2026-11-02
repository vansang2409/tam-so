import * as THREE from 'three'
// Chi tiết kiến trúc và đồ thờ được dựng riêng theo vai trò từng khu.
export function createTempleDetails({box,sphere,cylinder,mesh,beam,label,mat,lantern,animated}) {
  const V=(x,y,z)=>new THREE.Vector3(x,y,z)
  function curve(points,r,color,parent) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>V(...p))),16,r,6,false),color,0,0,0,parent)
  }
  function lotusBase(x,y,z,r,parent,color=0xbda77e) {
    cylinder(r,r*1.1,.16,color,x,y,z,parent,32)
    for(let i=0;i<16;i++){const a=i*Math.PI/8;const petal=sphere(r*.19,color,x+Math.cos(a)*r*.8,y+.12,z+Math.sin(a)*r*.8,parent,.8,1.3,.5);petal.rotation.y=-a;petal.rotation.z=.4}
    cylinder(r*.84,r*.95,.13,color,x,y+.22,z,parent,28)
  }
  function figure(type,x,y,z,size,parent) {
    const p=new THREE.Group();p.position.set(x,y,z);p.scale.setScalar(size);parent.add(p)
    const standing=type==='quan-am',imperial=['emperor','mother','guardian'].includes(type)
    const robe=standing?0xddd9c9:type==='medicine'?0x81928c:imperial?0xa98a50:0xc29a50
    const skin=standing?0xe7dfce:0xc5a15f
    lotusBase(0,.08,0,standing?.47:.75,p,standing?0xcec8b7:0xa88c54)
    const points=standing?[[.4,.3],[.45,.4],[.34,.85],[.26,1.2],[.25,1.55],[.3,1.65],[.18,1.8]]:[[.58,.35],[.63,.42],[.4,.65],[.36,1],[.43,1.25],[.25,1.38]]
    const body=mesh(new THREE.LatheGeometry(points.map(([r,h])=>new THREE.Vector2(r,h)),28),robe,0,0,0,p)
    const headY=standing?2.02:1.6
    sphere(.205,skin,0,headY,0,p,.9,1.15,.95)
    sphere(.04,skin,0,headY-.015,.195,p,.6,1.1,.7)
    for(const side of [-1,1]) {
      sphere(.052,skin,side*.19,headY-.03,-.01,p,.65,1.4,.8)
      curve([[side*.035,headY+.04,.185],[side*.075,headY+.05,.18],[side*.115,headY+.035,.15]],.009,0x65523e,p)
      const handY=standing?1.34:.69
      curve([[side*.3,standing?1.6:1.2,0],[side*.4,standing?1.2:.8,.12],[side*.12,handY,.32]],.075,robe,p)
      sphere(.07,skin,side*.1,handY,.34,p,1,.65,1)
      if(!standing)sphere(.37,robe,side*.32,.48,.16,p,1.15,.6,.86)
    }
    if(standing){
      const veil=mesh(new THREE.LatheGeometry([new THREE.Vector2(.23,1.6),new THREE.Vector2(.26,1.94),new THREE.Vector2(.2,2.2),new THREE.Vector2(.08,2.35)],24),0xd4d2c1,0,0,-.12,p)
      cylinder(.13,.18,.22,0xa99970,0,2.3,0,p,12)
      // Tịnh bình và cành lá nhỏ giúp nhận diện tượng Quan Âm từ xa.
      cylinder(.06,.09,.21,0xb8b9a3,.16,1.3,.38,p,12)
      curve([[-.13,1.4,.36],[-.2,1.65,.38],[-.27,1.8,.37]],.012,0x5f7654,p)
      for(let i=0;i<3;i++)sphere(.04,0x68815a,-.2-i*.025,1.6+i*.07,.38,p,1,.45,1.7)
    } else if(imperial) {
      box(.42,.14,.31,0x6b4c2b,0,headY+.25,0,p)
      cylinder(.12,.2,.24,0xb29453,0,headY+.38,0,p,8)
      if(type==='emperor')for(const side of [-1,1])box(.32,.035,.1,0x9d8246,side*.31,headY+.27,0,p)
      if(type==='mother')for(let i=0;i<5;i++){const a=i*Math.PI*.4;sphere(.035,0xe2bb68,Math.cos(a)*.15,headY+.42+Math.sin(a)*.07,.02,p)}
    } else {
      sphere(.207,0x514c3d,0,headY+.085,-.025,p,1,.65,1)
      sphere(.1,0x514c3d,0,headY+.26,-.015,p)
      for(let i=0;i<12;i++){const a=i*Math.PI/6;sphere(.027,0x716341,Math.cos(a)*.18,headY+.12,Math.sin(a)*.16,p)}
    }
    // Nếp áo có hình khối, tránh bề mặt trơn như đồ chơi.
    for(let i=-3;i<=3;i++) {
      const dx=i*.07
      curve([[dx*.55,standing?1.65:1.2,.27],[dx,standing?1:.72,.34],[dx*1.6,.4,.39]],.012,standing?0xc5c0ae:0x9d783e,p)
    }
    const halo=mesh(new THREE.TorusGeometry(standing?.5:.58,.025,8,48),0xc7b57b,0,headY,-.2,p)
    return p
  }
  function lattice(x,y,z,w,h,parent,color=0x5c4031) {
    box(w+.12,h+.12,.07,color,x,y,z,parent)
    box(w-.05,h-.05,.08,0x303d32,x,y,z+.01,parent)
    for(let dx=-w/2+.08;dx<w/2;dx+=.18)box(.026,h-.04,.05,0x947550,x+dx,y,z+.07,parent)
    for(let dy=-h/2+.08;dy<h/2;dy+=.2)box(w-.04,.026,.05,0x947550,x,y+dy,z+.07,parent)
  }
  function vase(x,y,z,parent,color=0xc1c4ab,flowers=false) {
    mesh(new THREE.LatheGeometry([[.09,0],[.15,.08],[.14,.26],[.07,.35],[.09,.4]].map(p=>new THREE.Vector2(...p)),18),color,x,y,z,parent)
    if(flowers)for(let i=0;i<5;i++){const a=i*2.4,dx=Math.cos(a)*.13,dz=Math.sin(a)*.13;beam(V(x,y+.3,z),V(x+dx,y+.7+i%2*.1,z+dz),.009,0x5e7751,parent);sphere(.085,i%2?0xc5939a:0xe1c9b4,x+dx,y+.7+i%2*.1,z+dz,parent,1,.7,1)}
  }
  function table(x,z,w,parent,color=0x60432c,y=.75) {
    box(w,.09,.65,color,x,y,z,parent)
    for(const side of [-1,1])for(const zz of [-.23,.23])box(.07,y-.3,.07,color,x+side*(w/2-.1),y/2+.12,z+zz,parent)
  }
  function decorate(spot,p,w,d,h) {
    const a=spot.architecture,style=a.style,wood=a.wood||0x604135
    // Cột có chân đá, đai đồng, đầu cột và hệ đấu đỡ mái.
    for(const side of [-1,1])for(const zz of [-d/2+.3,d/2-.3]) {
      const x=side*(w/2-.35)
      for(let j=0;j<3;j++)cylinder(.24-j*.025,.26-j*.02,.085,0xa7a294,x,.29+j*.08,zz,p,16)
      cylinder(.17,.18,.05,0xb5a075,x,h*.3,zz,p,16)
      box(.5,.16,.42,wood,x,h-.04,zz,p)
      for(const dx of [-1,1])beam(V(x,h-.42,zz),V(x+dx*.42,h-.05,zz),.055,wood,p)
    }
    // Xà gỗ nhiều lớp và họa tiết đục thoáng dưới diềm.
    for(let i=0;i<3;i++)box(w,.07,.19,wood,0,h-.2+i*.12,d/2-.25,p)
    for(let x=-w/2+.6;x<w/2-.3;x+=.4){const m=box(.16,.16,.045,0xa78955,x,h-.38,d/2-.19,p);m.rotation.z=Math.PI/4}
    for(const side of [-1,1]) {
      // Cửa sổ gỗ mặt hậu, tường bên có ô thoáng.
      lattice(side*w*.32,1.6,-d/2+.12,w*.2,.9,p,wood)
      for(let z=-d/2+.5;z<d/2-.4;z+=.55){box(.045,1.1,.045,wood,side*(w/2-.06),1.9,z,p)}
      box(.12,.1,d-.5,wood,side*(w/2-.06),2.48,0,p)
    }
    if(spot.huong) {
      const altarZ=-d/2+.8
      box(w*.54,.09,.95,wood,0,1.04,altarZ,p)
      for(let i=0;i<6;i++){const x=(i-2.5)*w*.075;const panel=box(w*.06,.5,.055,0x9e7943,x,.72,altarZ+.48,p);panel.rotation.z=i%2?.025:-.025}
      if(style==='tam-bao') {
        for(const x of [-2,0,2])figure('buddha',x,1.1,altarZ-.05,x===0?1.25:.88,p)
        for(const side of [-1,1]){
          lattice(side*3.65,2.05,altarZ-.1,1.1,2,p,wood)
          cylinder(.1,.17,.4,0x8f805d,side*1.4,1.11,altarZ+.35,p,14)
          sphere(.13,0xb39052,side*1.4,1.55,altarZ+.35,p,.7,1.8,.7)
        }
        label('TỪ BI · TRÍ TUỆ',0,3.35,-d/2+.2,3.5,p)
        for(let x=-3;x<=3;x+=1.5)for(let z=-.3;z<1.2;z+=1) cylinder(.28,.32,.04,0x8d7656,x,.36,z,p,20)
      } else if(['phat-ba','quan-am'].includes(style)) {
        const arch=curve([[-1.05,1.1,altarZ-.18],[-1.05,2.6,altarZ-.18],[0,3.35,altarZ-.18],[1.05,2.6,altarZ-.18],[1.05,1.1,altarZ-.18]],.09,0xd5ccb0,p)
        figure('quan-am',0,1.05,altarZ-.03,.85,p)
        for(const side of [-1,1])vase(side*.9,1.08,altarZ+.3,p,0xc8cbbd,true)
      } else if(style==='ngoc-hoang') {
        lattice(0,2,altarZ-.3,2.8,2.4,p,wood)
        figure('emperor',0,1.1,altarZ,1.05,p)
        for(const side of [-1,1])figure('guardian',side*1.6,1.05,altarZ,.62,p)
        for(let i=-2;i<=2;i++)lantern(i*.8,h-.5,d/2+.15,p)
        for(const side of [-1,1])curve([[side*1.5,1.05,altarZ],[side*1.65,1.8,altarZ],[side*1.45,2.55,altarZ]],.055,0xb09550,p)
      } else if(style==='duoc-su') {
        figure('medicine',0,1.1,altarZ,1,p)
        for(let i=-2;i<=2;i++)vase(i*.5,1.1,altarZ+.4,p,i%2?0x759c9a:0xaeb7a5)
        for(const side of [-1,1]){table(side*2,altarZ,.75,p);for(let i=0;i<3;i++)vase(side*2+(i-1)*.2,.8,altarZ,p,0x758c88)}
      } else if(style==='thap-dien') {
        for(const side of [-1,1])for(let i=0;i<5;i++)figure('emperor',side*(.5+i*.45),1.05,altarZ,.38,p)
        label('SOI LẠI THÂN TÂM',0,2.4,altarZ-.25,2.7,p)
      } else if(style==='kim-hoa') {
        figure('mother',0,1.1,altarZ,1.05,p)
        for(const side of [-1,1])for(let i=0;i<6;i++)figure('mother',side*(.85+i*.25),1.08,altarZ,.22,p)
        for(const x of [-2,2])vase(x,1.05,altarZ,p,0xb69081,true)
      } else if(style==='ong-to') {
        for(const side of [-1,1])figure('emperor',side*.45,1.1,altarZ,.55,p)
        curve([[-1.4,2.45,altarZ],[0,1.95,altarZ],[1.4,2.45,altarZ]],.018,0xa93830,p)
        for(let i=-3;i<=3;i++)box(.06,.23,.025,0xb94e43,i*.25,1.85-Math.abs(i)*.05,altarZ,p)
      } else if(style==='nha-to') {
        for(let i=-2;i<=2;i++){box(.32,.7,.12,wood,i*.55,1.45,altarZ,p);label('TỔ',i*.55,1.47,altarZ+.08,.2,p)}
        label('UỐNG NƯỚC NHỚ NGUỒN',0,2.7,altarZ-.2,3,p)
      } else if(style==='thanh-mau') {
        figure('mother',0,1.1,altarZ,.95,p)
        for(let i=-2;i<=2;i++){vase(i*.43,1.08,altarZ+.4,p,0x6f8a70);for(let j=0;j<3;j++)sphere(.045,0x6d8052,i*.43,1.6+j*.06,altarZ+.4,p,1,.5,2)}
      } else if(['ho-phap','thanh-hoang'].includes(style)) {
        for(const side of [-1,1]){figure('guardian',side*w*.23,1.05,altarZ,style==='ho-phap'?.65:.8,p);beam(V(side*w*.3,1.1,altarZ+.25),V(side*w*.3,2.8,altarZ+.25),.025,0x877052,p)}
      } else figure('mother',0,1.1,altarZ,.8,p)
      for(const side of [-1,1])vase(side*w*.38,1.05,altarZ+.2,p,0xbab6a0,true)
    } else if(style==='bell') {
      // Đại hồng chung: thân loe, vành dày, đai nổi, quai treo và chày gỗ.
      const pivot=new THREE.Group();pivot.position.set(0,h-.5,0);p.add(pivot)
      const points=[[.16,0],[.24,-.12],[.48,-.3],[.55,-1.1],[.7,-1.55],[.74,-1.65],[.61,-1.68],[.5,-.45]]
      mesh(new THREE.LatheGeometry(points.map(q=>new THREE.Vector2(...q)),32),0x8f7851,0,0,0,pivot,{metalness:.6,roughness:.6})
      for(const y of [-.4,-.55,-1.25,-1.5]){const r=y<-.8?.6:.49;const ring=mesh(new THREE.TorusGeometry(r,.025,8,32),0xb39b65,0,y,0,pivot);ring.rotation.x=Math.PI/2}
      for(let i=0;i<8;i++){const a=i*Math.PI/4;sphere(.065,0xb39b65,Math.cos(a)*.55,-.9,Math.sin(a)*.55,pivot,.6,1.4,.6)}
      animated.bells.push({mesh:pivot,id:spot.id})
      beam(V(-1.1,h-.35,0),V(1.1,h-.35,0),.13,wood,p)
      beam(V(-.85,1.6,.7),V(.85,1.6,.7),.12,0x71513a,p)
      for(const x of [-.7,.7])beam(V(x,1.6,.7),V(x,h-.2,.7),.014,0x4d493a,p)
    } else if(style==='thu-vien') {
      for(let i=-1;i<=1;i++) {
        const x=i*1.6;box(1.35,1.7,.3,wood,x,1.14,-d/2+.45,p)
        for(let row=0;row<3;row++){box(1.35,.055,.4,wood,x,.6+row*.49,-d/2+.65,p);for(let j=0;j<9;j++)box(.09,.36,.2,[0x9b7960,0x7d8970,0xb79d72,0x655d4c][(j+row)%4],x-.53+j*.13,.81+row*.49,-d/2+.7,p)}
      }
      table(0,-.7,2.4,p);box(.5,.03,.3,0xd9cba7,0,.81,-.7,p)
    } else if(style==='giang-duong') {
      table(0,-d/2+.6,2,p,wood,1)
      label('LẮNG NGHE · HIỂU THƯƠNG',0,2.1,-d/2+.14,3.3,p)
      for(let x=-2;x<=2;x+=1)for(let z=-.2;z<1.5;z+=.7)box(.64,.035,.44,0x8b7a5e,x,.35,z,p)
    } else if(style==='nha-khach') {
      for(const x of [-1.8,1.8]){table(x,-d/2+.7,1,p);for(const side of [-1,1]){box(.3,.3,.35,wood,x+side*.6,.5,-d/2+.7,p);box(.32,.48,.05,wood,x+side*.6,.83,-d/2+.86,p)}vase(x,.81,-d/2+.7,p,0xb8c0aa,true)}
      for(const side of [-1,1])box(.6,1,.08,0x516d5b,side*w*.36,1.6,-d/2+.18,p)
    } else if(style==='phap-bao') {
      table(0,-d/2+.85,4,p)
      for(let i=-3;i<=3;i++){const x=i*.5;vase(x,.8,-d/2+.85,p,[0x98a18d,0xb29977,0x858d8a][Math.abs(i)%3]);const chain=mesh(new THREE.TorusGeometry(.1,.021,6,16),0x74563b,x,.91,-d/2+1.1,p);chain.rotation.x=Math.PI/2}
      for(const x of [-1.5,0,1.5])lantern(x,2.1,-d/2+.5,p)
    }
  }
  return {decorate,figure,lattice,lotusBase,curve,vase}
}
