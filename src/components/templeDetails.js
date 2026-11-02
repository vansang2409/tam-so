import * as THREE from 'three'
import { createTempleFurnishings } from './templeFurnishings.js'
// Chi tiết kiến trúc và đồ thờ được dựng riêng theo vai trò từng khu.
export function createTempleDetails({box,sphere,cylinder,mesh,beam,label,mat,lantern,animated,models}) {
  const V=(x,y,z)=>new THREE.Vector3(x,y,z)
  function curve(points,r,color,parent) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>V(...p))),16,r,6,false),color,0,0,0,parent)
  }
  function lotusBase(x,y,z,r,parent,color=0xbda77e) {
    cylinder(r,r*1.1,.16,color,x,y,z,parent,32)
    for(let i=0;i<16;i++){const a=i*Math.PI/8;const petal=sphere(r*.19,color,x+Math.cos(a)*r*.8,y+.12,z+Math.sin(a)*r*.8,parent,.8,1.3,.5);petal.rotation.y=-a;petal.rotation.z=.4}
    cylinder(r*.84,r*.95,.13,color,x,y+.22,z,parent,28)
  }
  const furnishings=createTempleFurnishings({box,sphere,cylinder,mesh,beam,mat,label,curve,models})
  const {figure,scannedAltar,altar,offerings,shrineFrame,crane,candle,prayerMat,scroll}=furnishings
  function lattice(x,y,z,w,h,parent,color=0x5c4031) {
    box(w+.12,h+.12,.07,color,x,y,z,parent)
    box(w-.05,h-.05,.08,0x303d32,x,y,z+.01,parent)
    for(let dx=-w/2+.08;dx<w/2;dx+=.18)box(.026,h-.04,.05,0x947550,x+dx,y,z+.07,parent)
    for(let dy=-h/2+.08;dy<h/2;dy+=.2)box(w-.04,.026,.05,0x947550,x,y+dy,z+.07,parent)
  }
  function vase(x,y,z,parent,color=0xc1c4ab,flowers=false) {
    mesh(new THREE.LatheGeometry([[.09,0],[.1,.025],[.15,.08],[.16,.2],[.14,.28],[.07,.35],[.07,.41],[.095,.43]].map(p=>new THREE.Vector2(...p)),32),color,x,y,z,parent,{roughness:.32})
    for(const yy of [.045,.13,.27,.39]){const r=yy<.07?.11:yy<.3?.153:.076;const ring=mesh(new THREE.TorusGeometry(r,.006,6,24),0x596b7c,x,y+yy,z,parent);ring.rotation.x=Math.PI/2}
    for(let i=0;i<8;i++){const a=i*Math.PI/4;for(let j=0;j<3;j++)sphere(.013,0x647b87,x+Math.cos(a)*.155,y+.15+j*.025,z+Math.sin(a)*.155,parent,.7,1.5,.7)}
    if(flowers)for(let i=0;i<5;i++){const a=i*2.4,dx=Math.cos(a)*.13,dz=Math.sin(a)*.13;beam(V(x,y+.3,z),V(x+dx,y+.7+i%2*.1,z+dz),.009,0x5e7751,parent);for(let j=0;j<6;j++){const a=j*Math.PI/3,o=sphere(.04,i%2?0xc5939a:0xe1c9b4,x+dx+Math.cos(a)*.055,y+.7+i%2*.1,z+dz+Math.sin(a)*.055,parent,.8,.6,1.4);o.rotation.y=-a} sphere(.025,0xcbb47c,x+dx,y+.7+i%2*.1,z+dz,parent)}
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
    // Lam gỗ, nẹp chân tường và xà trần tạo chiều sâu khi nhìn ngang tầm mắt.
    for(const side of [-1,1]){
      box(.1,.13,d-.35,wood,side*(w/2-.1),.43,0,p)
      box(.1,.07,d-.35,0xa28859,side*(w/2-.1),1.25,0,p)
      for(let zz=-d/2+.5;zz<d/2-.5;zz+=.6)box(.035,.65,.5,wood,side*(w/2-.09),.85,zz,p)
    }
    for(let zz=-d/2+.7;zz<d/2;zz+=1.2){box(w-.4,.12,.14,wood,0,h+.08,zz,p);for(const side of [-1,1])beam(V(side*(w/2-.4),h-.24,zz),V(side*(w/2-.9),h+.05,zz),.045,wood,p)}
    if(spot.huong)for(const side of [-1,1]){
      box(.24,Math.min(1.5,h-1),.045,0x6f3029,side*(w/2-.6),1.95,-d/2+.2,p)
      for(let i=0;i<4;i++)scroll(side*(w/2-.6),1.5+i*.25,-d/2+.23,.065,p)
    }
    if(spot.huong) {
      const altarZ=-d/2+.8
      if(!['tam-bao','duoc-su'].includes(style)){altar(0,altarZ,w*(style==='thap-dien'?.88:.54),p,wood,1.04);offerings(0,1.16,altarZ+.32,p,Math.min(2.6,w*.47))}
      if(style==='tam-bao') {
        scannedAltar(0,.34,-d/2+1.57,3.65,3.1,2.8,p)
        shrineFrame(0,.37,-d/2+.2,4.3,3.65,p,wood)
        for(const side of [-1,1]){
          altar(side*3.4,altarZ,2,p,wood,1.02)
          figure('quan-am',side*3.4,1.14,altarZ-.08,.73,p)
          offerings(side*3.4,1.14,altarZ+.25,p,1.7)
          shrineFrame(side*3.4,1.03,altarZ-.4,1.8,2.05,p,wood)
          crane(side*2.35,.34,-1.35,p,side)
        }
        label('TỪ BI · TRÍ TUỆ',0,4.28,-d/2+.46,3.3,p)
        for(let x=-3;x<=3;x+=1.5)for(let z=.3;z<2;z+=.85)prayerMat(x,z,p)
      } else if(['phat-ba','quan-am'].includes(style)) {
        const arch=curve([[-1.05,1.1,altarZ-.18],[-1.05,2.6,altarZ-.18],[0,3.35,altarZ-.18],[1.05,2.6,altarZ-.18],[1.05,1.1,altarZ-.18]],.09,0xd5ccb0,p)
        figure('quan-am',0,1.15,altarZ-.12,.85,p)
        shrineFrame(0,1.05,altarZ-.4,2.3,2.05,p,0x847962,0xc6b795)
        for(const side of [-1,1]){crane(side*1.25,.34,altarZ+.65,p,side);candle(side*.6,1.17,altarZ+.35,p,0xe0cfaa)}
        for(const side of [-1,1])vase(side*.9,1.08,altarZ+.3,p,0xc8cbbd,true)
      } else if(style==='ngoc-hoang') {
        box(2.7,2.1,.07,0x742d27,0,2.1,altarZ-.47,p)
        shrineFrame(0,1.02,altarZ-.42,2.7,2.1,p,wood)
        label('NGỌC HOÀNG',0,3.3,altarZ-.3,2.25,p)
        figure('emperor',0,1.1,altarZ,.89,p)
        for(const side of [-1,1])figure('marshal',side*1.6,1.05,altarZ,.62,p)
        for(let i=-2;i<=2;i++)lantern(i*.8,h-.5,d/2+.15,p)
      } else if(style==='duoc-su') {
        scannedAltar(0,.34,-d/2+1.11,2.48,2.3,2.02,p,0x9c9e72)
        shrineFrame(0,.38,-d/2+.18,2.8,2.55,p,0x496355,0xb3a679)
        for(const side of [-1,1]){
          table(side*2,altarZ,.9,p,0x496355)
          box(.87,.44,.46,0x496355,side*2,.52,altarZ,p)
          for(let row=0;row<3;row++)for(let col=0;col<3;col++){box(.24,.11,.025,0x82907a,side*2+(col-1)*.27,.38+row*.13,altarZ+.25,p);sphere(.018,0xbba16b,side*2+(col-1)*.27,.38+row*.13,altarZ+.275,p)}
          for(let i=0;i<3;i++)vase(side*2+(i-1)*.24,.81,altarZ,p,0x9ba994)
        }
        for(let i=-3;i<=3;i++)candle(i*.28,.35,-.05,p,0x719188)
        for(const x of [-1.3,0,1.3])prayerMat(x,.75,p,0x6f8270)
      } else if(style==='thap-dien') {
        box(w*.8,.49,.42,wood,0,1.4,altarZ-.22,p)
        for(let row=0;row<2;row++)for(let i=0;i<5;i++){
          const x=(i-2)*.95,y=row?1.66:1.16,z=altarZ+(row?-.22:.17)
          box(.62,.055,.36,wood,x,y+.25,z-.025,p)
          box(.57,.46,.045,wood,x,y+.46,z-.18,p)
          for(const side of [-1,1])for(const zz of [-.13,.1])box(.045,.25,.045,wood,x+side*.25,y+.12,z+zz,p)
          figure((i+row)%2?'judge-b':'judge-a',x,y,z,.42,p)
        }
        label('SOI LẠI THÂN TÂM',0,2.6,altarZ-.25,2.7,p)
        shrineFrame(0,1,altarZ-.43,w*.83,1.4,p,wood,0x8d865e)
        for(let i=-4;i<=4;i++)box(.15,.33,.025,0x75634c,i*.29,1.8,altarZ-.2,p)
      } else if(style==='kim-hoa') {
        figure('mother',0,1.15,altarZ,.82,p)
        shrineFrame(0,1.02,altarZ-.4,2.5,2.13,p,0x823a35,0xc69b60)
        label('KIM HOA THÁNH MẪU',0,3.22,altarZ-.26,2.7,p)
        for(const side of [-1,1])for(let i=0;i<6;i++)figure('mother',side*(.85+i*.25),1.08,altarZ,.22,p)
        for(const x of [-2,2])vase(x,1.05,altarZ,p,0xb69081,true)
      } else if(style==='ong-to') {
        for(const side of [-1,1])figure(side<0?'matchmaker':'matron',side*.45,1.12,altarZ,.55,p)
        shrineFrame(0,1.04,altarZ-.37,1.8,1.5,p,0x79372d)
        curve([[-1.4,2.45,altarZ],[0,1.95,altarZ],[1.4,2.45,altarZ]],.018,0xa93830,p)
        for(let i=-3;i<=3;i++)box(.06,.23,.025,0xb94e43,i*.25,1.85-Math.abs(i)*.05,altarZ,p)
      } else if(style==='nha-to') {
        figure('patriarch',0,1.13,altarZ,.85,p)
        for(const side of [-1,1])for(let i=0;i<2;i++){const x=side*(1.05+i*.45);box(.3,.65,.12,wood,x,1.45,altarZ,p);label('TỔ',x,1.47,altarZ+.08,.18,p)}
        shrineFrame(0,1.03,altarZ-.35,3.3,1.75,p,wood,0xa38d5e)
        for(const side of [-1,1])for(let i=0;i<2;i++){const x=side*(1.05+i*.45);scroll(x,1.85,altarZ+.05,.12,p);box(.4,.08,.18,0xb39861,x,1.1,altarZ,p)}
        label('UỐNG NƯỚC NHỚ NGUỒN',0,2.95,altarZ-.2,3,p)
      } else if(style==='thanh-mau') {
        figure('mother',0,1.13,altarZ,.8,p)
        shrineFrame(0,1.03,altarZ-.38,2.5,1.85,p,0x53644a,0xa99c68)
        label('THIÊN Y THÁNH MẪU',0,2.96,altarZ-.22,2.8,p)
        for(let i=-2;i<=2;i++){vase(i*.43,1.08,altarZ+.4,p,0x6f8a70);for(let j=0;j<3;j++)sphere(.045,0x6d8052,i*.43,1.6+j*.06,altarZ+.4,p,1,.5,2)}
      } else if(['ho-phap','thanh-hoang'].includes(style)) {
        for(const side of [-1,1]){figure(style==='thanh-hoang'?'marshal':side<0?'guardian':'guardian-right',side*w*.23,1.05,altarZ,style==='ho-phap'?.65:.8,p)}
        shrineFrame(0,1.04,altarZ-.35,w*.64,Math.min(1.8,h-1.22),p,wood)
      } else {
        figure('earth',0,1.14,altarZ,.55,p)
        shrineFrame(0,1.04,altarZ-.3,w*.57,1.25,p,wood)
        cylinder(.12,.14,.08,0x9b8b64,.4,1.18,altarZ+.2,p,20)
      }
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
