import * as THREE from 'three'
import { SCULPTURE_PROFILES } from '../data/templeSculptures.js'
// Đồ thờ tự dựng, phân biệt chất liệu gỗ sơn son, đồng cũ, gốm và gấm.
export function createTempleFurnishings({box,sphere,cylinder,mesh,beam,mat,label,curve,models}) {
  const V=(...p)=>new THREE.Vector3(...p),gold=0xb5914e,bronze=0x806c42,lacquer=0x722e27
  const marble=mat(0xd8d4c3,{roughness:.62})
  function ring(r,t,x,y,z,p,c=gold,flat=false){const o=mesh(new THREE.TorusGeometry(r,t,8,36),c,x,y,z,p);if(flat)o.rotation.x=Math.PI/2;return o}
  function lathe(points,color,x,y,z,p){return mesh(new THREE.LatheGeometry(points.map(q=>new THREE.Vector2(...q)),40),color,x,y,z,p)}
  function scroll(x,y,z,s,p,c=gold) {
    for(const side of [-1,1]){const pts=[];for(let i=0;i<=24;i++){const a=i/24*Math.PI*3,r=s*(1-i/30);pts.push([x+side*(s*.35+Math.cos(a)*r),y+Math.sin(a)*r,z])}curve(pts,.012,c,p)}
  }
  function lotus(x,y,z,r,p,c=gold) {
    for(let layer=0;layer<2;layer++)for(let i=0;i<12;i++){const a=i*Math.PI/6+layer*.26,o=sphere(r*.18,c,x+Math.cos(a)*r*.7,y+layer*.08,z+Math.sin(a)*r*.7,p,.65,.55,1.7);o.rotation.y=-a+Math.PI/2;o.rotation.z=.22}
    cylinder(r*.6,r*.85,.1,c,x,y+.12,z,p,32)
  }
  function drapedRobe(points,color,p) {
    const profile=new THREE.SplineCurve(points.map(q=>new THREE.Vector2(...q))).getPoints(40)
    const g=new THREE.LatheGeometry(profile,64),pos=g.attributes.position
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),a=Math.atan2(x,z)
      const wave=1+.018*Math.sin(a*19+y*7)+.009*Math.sin(a*31-y*4)
      pos.setXYZ(i,x*wave,y,z*wave)
    }g.computeVertexNormals();return mesh(g,color,0,0,0,p)
  }
  function hand(x,y,z,p,c,side=1) {
    sphere(.055,c,x,y,z,p,.9,.43,1.3)
    for(let i=0;i<4;i++){const xx=x+(i-1.5)*.023;curve([[xx,y,z+.035],[xx,y-.005,z+.09+(i===1?.014:0)],[xx,y-.015,z+.12]],.009,c,p)}
    curve([[x+side*.04,y,z],[x+side*.07,y+.015,z+.04],[x+side*.06,y+.01,z+.07]],.012,c,p)
  }
  function face(y,p,c,{beard=false,fierce=false}={}) {
    // Mặt có gò má, sống mũi, mí mắt khép, môi và dái tai; không ghép đầu cầu trơn.
    const g=new THREE.SphereGeometry(1,40,32),a=g.attributes.position
    for(let i=0;i<a.count;i++){
      const x=a.getX(i),yy=a.getY(i),zz=a.getZ(i),front=Math.max(0,zz),jaw=1-.18*Math.max(0,-yy)
      a.setXYZ(i,x*.19*jaw,yy*.245,zz*.165+front*.026*Math.exp(-(((yy+.15)/.4)**2)))
    }g.computeVertexNormals();mesh(g,c,0,y,0,p)
    sphere(.037,c,0,y+.005,.183,p,.55,1.7,1.15)
    sphere(.029,c,0,y-.035,.211,p,.82,.62,.8)
    for(const side of [-1,1]) {
      sphere(.048,c,side*.184,y-.035,-.005,p,.6,1.9,.65)
      curve([[side*.19,y+.04,.015],[side*.204,y-.015,.02],[side*.19,y-.09,.017]],.01,0x957d51,p)
      const brow=fierce?.065:.04
      curve([[side*.026,y+brow,.16],[side*.08,y+brow+.014,.165],[side*.129,y+brow-.005,.129]],.009,0x574b36,p)
      curve([[side*.035,y+.005,.178],[side*.077,y-.006,.177],[side*.117,y+.005,.149]],.006,0x796348,p)
      sphere(.012,0x90724a,side*.024,y-.045,.213,p,1,.5,.7)
    }
    curve([[-.049,y-.092,.161],[0,y-.1,.181],[.049,y-.092,.161]],.006,0x8d5c43,p)
    curve([[-.035,y-.109,.158],[0,y-.115,.171],[.035,y-.109,.158]],.004,0xba9464,p)
    if(beard)for(let i=-3;i<=3;i++)curve([[i*.018,y-.13,.14],[i*.024,y-.28,.15],[i*.012,y-.45,.13]],.013,0x605747,p)
  }
  function sculpt(type,p) {
    const mother=type==='mother',guardian=type==='guardian',imperial=mother||guardian||type==='emperor',standing=type==='quan-am'
    const robe=standing?0xd5d0bc:mother?0x8c3e39:guardian?0x49625a:type==='medicine'?0x718d82:imperial?0x8b4d30:0xb89953
    const skin=standing?0xddd8c6:imperial?0xc2a079:0xc4a45e,head=standing?1.94:1.66
    if(imperial){
      box(1.12,.16,.83,0x5d3025,0,.3,0,p);box(1.05,1.25,.14,0x5d3025,0,.98,-.32,p)
      for(const side of [-1,1]){lathe([[.06,0],[.08,.12],[.055,.25],[.07,.38]],gold,side*.5,.38,.24,p);sphere(.08,gold,side*.5,.81,.24,p);scroll(side*.28,1.4,-.22,.16,p)}
    }else lotus(0,.2,0,standing?.43:.68,p,standing?0xb7b5a4:gold)
    drapedRobe(standing?[[.37,.32],[.4,.42],[.32,.8],[.23,1.3],[.3,1.56],[.17,1.7]]:[[.43,.36],[.5,.46],[.4,.7],[.27,.9],[.29,1.2],[.24,1.37],[.13,1.44]],robe,p)
    // Vai, tay áo và các nếp áo hội tụ về bàn tay.
    for(const side of [-1,1]) {
      sphere(.145,robe,side*.22,1.25,-.015,p,1,1.35,1)
      curve([[side*.27,1.26,0],[side*.36,1.02,.06],[side*.25,.87,.26],[side*.13,.9,.37]],.09,robe,p)
      for(let j=0;j<4;j++)curve([[side*(.26+j*.018),1.3-j*.035,.12],[side*(.37+j*.012),1.04-j*.025,.18],[side*(.2+j*.02),.8-j*.02,.38]],.004,robe,p)
      hand(side*.105,.9,.39,p,skin,side)
      if(!standing){sphere(.23,robe,side*.26,.51,.17,p,1.3,.8,1.1);for(let i=0;i<6;i++)curve([[side*.06,.79-i*.045,.3],[side*.24,.67-i*.035,.38],[side*.46,.46-i*.012,.32]],.005,robe,p)}
      if(imperial){sphere(.1,0x463b2c,side*.22,.37,.36,p,.8,.6,1.5);scroll(side*.26,.69,.43,.085,p)}
    }
    for(let i=-5;i<=5;i++)curve([[i*.021,1.31,.27],[i*.04,.98,.3],[i*.055,.58,.39],[i*.068,.42,.41]],.004,robe,p)
    face(head,p,skin,{beard:type==='emperor',fierce:guardian})
    if(imperial) {
      lathe([[.17,0],[.2,.08],[.16,.19],[.07,.25]],0x493e2d,0,head+.18,0,p)
      ring(.19,.018,0,head+.23,0,p,gold,true)
      if(mother){
        for(let i=-3;i<=3;i++){const x=i*.065,yy=head+.33+(3-Math.abs(i))*.045;curve([[0,head+.28,0],[x*.7,yy,.02],[x,yy+.08,.05]],.013,gold,p);sphere(.028,0xbdaa72,x,yy+.08,.05,p);for(let k=0;k<3;k++)sphere(.014,0xcda363,x,yy-k*.055,.09,p)}
        for(let i=0;i<13;i++){const a=i/12*Math.PI;sphere(.018,gold,Math.cos(a)*.17,1.25-Math.sin(a)*.18,.29,p)}
      }else{
        box(.43,.06,.32,0x292c25,0,head+.39,0,p)
        if(type==='emperor')for(const side of [-1,1]){box(.28,.025,.12,gold,side*.3,head+.39,0,p);for(let i=0;i<5;i++){curve([[side*.13,head+.38,.18],[side*.13,head+.16-i*.018,.19]],.005,gold,p);sphere(.012,gold,side*.13,head+.16-i*.018,.19,p)}}
      }
      // Tấm ngọc, đai lưng và huy hiệu trước ngực riêng của tượng quan phục.
      if(!mother){const tablet=box(.13,.33,.035,0xc6bea0,0,1.06,.43,p);tablet.rotation.x=-.1;ring(.08,.013,0,1.22,.31,p)}
      for(let i=-3;i<=3;i++)sphere(.024,gold,i*.07,.84,.34,p)
      if(guardian){for(const side of [-1,1])for(let j=0;j<3;j++){const plate=box(.19,.09,.05,gold,side*.24,1.16-j*.1,.28,p);plate.rotation.z=side*.15}beam(V(.6,.35,.08),V(.6,1.9,.08),.025,0x6f5533,p);const blade=mesh(new THREE.ConeGeometry(.08,.35,4),0x999b8e,.6,2.06,.08,p)}
    }else if(standing){
      lathe([[.2,1.55],[.24,1.85],[.2,2.09],[.07,2.23]],0xd2cebd,0,0,-.06,p)
    }else{
      sphere(.192,0x4b4b3d,0,head+.14,-.025,p,1,.7,1);sphere(.078,0x4b4b3d,0,head+.31,-.03,p)
      for(let row=0;row<3;row++)for(let i=0;i<15;i++){const a=i/15*Math.PI*2;sphere(.021,0x5f5a40,Math.cos(a)*(.18-row*.025),head+.16+row*.038,Math.sin(a)*(.17-row*.026)-.025,p)}
      ring(.53,.018,0,head,-.22,p)
      for(let i=0;i<24;i++){const a=i*Math.PI/12;beam(V(Math.cos(a)*.54,head+Math.sin(a)*.54,-.22),V(Math.cos(a)*.62,head+Math.sin(a)*.62,-.22),.008,gold,p)}
    }
  }
  function figure(type,x,y,z,size,parent) {
    const p=new THREE.Group();p.position.set(x,y,z);p.scale.setScalar(size);parent.add(p)
    const fallback=new THREE.Group()
    const fallbackType=['guardian','guardian-right','marshal'].includes(type)?'guardian':['mother','matron'].includes(type)?'mother':type==='quan-am'?'quan-am':'emperor'
    sculpt(fallbackType,fallback)
    const profile=SCULPTURE_PROFILES[type]
    if(type==='quan-am')models.place('qa',p,{height:2.4,maxWidth:.9,maxDepth:.8,material:marble},fallback)
    else if(profile)models.place(profile.file,p,profile,fallback)
    else p.add(fallback)
    return p
  }
  function scannedAltar(x,y,z,height,width,depth,p,tint=0xb49a5e) {
    const fallback=new THREE.Group();altar(0,0,width*.9,fallback,0x593a29);const statue=new THREE.Group();statue.position.y=1;statue.scale.setScalar(Math.max(.5,(height-1)/2.3));fallback.add(statue);sculpt('buddha',statue)
    return models.place('altar',p,{position:[x,y,z],height,maxWidth:width,maxDepth:depth,material:[mat(tint,{metalness:.56,roughness:.47}),mat(0x593a28,{surface:'wood',roughness:.7,metalness:.08})]},fallback)
  }
  function altar(x,z,w,p,wood=0x593a29,y=.97) {
    box(w+.12,.09,.9,wood,x,y,z,p);box(w+.18,.045,.96,gold,x,y+.065,z,p)
    box(w,.46,.09,wood,x,y-.29,z+.37,p)
    for(let xx=-w/2+.22;xx<w/2;xx+=.35){scroll(x+xx,y-.28,z+.43,.09,p);lotus(x+xx,y-.39,z+.44,.07,p)}
    for(const side of [-1,1])for(const zz of [-.3,.3]){
      const px=x+side*(w/2-.12);lathe([[.055,0],[.085,.05],[.06,.16],[.05,.4],[.085,.55]],wood,px,.34,z+zz,p)
      curve([[px,.42,z+zz],[px+side*.06,.37,z+zz+.04],[px+side*.08,.34,z+zz+.1]],.04,wood,p)
    }
    // Tấm gấm phủ mặt và tua vàng; không dùng mảng hộp đơn sắc ở mặt bàn.
    box(w*.62,.025,.56,lacquer,x,y+.1,z+.08,p)
    box(w*.62,.24,.018,lacquer,x,y-.025,z+.37,p)
    for(let i=-3;i<=3;i++){scroll(x+i*w*.075,y-.03,z+.385,.035,p);cylinder(.009,.009,.1,gold,x+i*w*.075,y-.18,z+.4,p,6)}
  }
  function vessel(x,y,z,p,scale=1) {
    const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(scale);p.add(g)
    lathe([[.18,.05],[.25,.1],[.28,.32],[.22,.4],[.3,.43]],bronze,0,0,0,g)
    ring(.28,.018,0,.43,0,g,gold,true);ring(.24,.012,0,.16,0,g,gold,true)
    for(const side of [-1,1]){curve([[side*.23,.22,0],[side*.4,.3,0],[side*.38,.48,0],[side*.26,.42,0]],.024,bronze,g);scroll(side*.1,.27,.24,.07,g)}
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3;beam(V(Math.cos(a)*.16,.12,Math.sin(a)*.16),V(Math.cos(a)*.23,0,Math.sin(a)*.23),.025,bronze,g)}
    cylinder(.22,.22,.016,0x766851,0,.415,0,g,24)
    for(let i=-1;i<=1;i++)cylinder(.006,.006,.35,0x8e4d32,i*.06,.59,0,g,6)
  }
  function candle(x,y,z,p,c=0x9f3e2f) {
    lathe([[.11,0],[.13,.04],[.06,.09],[.033,.28],[.08,.34],[.08,.37]],bronze,x,y,z,p)
    cylinder(.037,.037,.25,c,x,y+.5,z,p,16)
    const flame=mesh(new THREE.SphereGeometry(.035,12,12),0xf7cb7c,x,y+.66,z,p,{emissive:0xf6a84b,emissiveIntensity:1.3,roughness:.5});flame.scale.set(.55,1.6,.55)
  }
  function offerings(x,y,z,p,w=2.2) {
    vessel(x,y,z,p,.7)
    for(const side of [-1,1]){
      candle(x+side*w*.38,y,z+.02,p)
      cylinder(.19,.13,.045,0xd6d1b8,x+side*w*.23,y+.02,z+.15,p,24)
      for(let i=0;i<4;i++){const a=i*2.4;sphere(.067,i%2?0xa9a35c:0xc18c46,x+side*w*.23+Math.cos(a)*.08,y+.09+(i===3?.06:0),z+.15+Math.sin(a)*.07,p)}
      for(let i=0;i<3;i++){lathe([[.032,0],[.035,.045],[.025,.07]],0xdbd2b9,x+side*(.14+i*.09),y,z+.32,p)}
    }
  }
  function shrineFrame(x,y,z,w,h,p,wood=0x5a3027,accent=gold) {
    for(const side of [-1,1]){
      lathe([[.1,0],[.14,.08],[.1,.15],[.085,h-.2],[.14,h-.1],[.13,h]],wood,x+side*w/2,y,z,p)
      for(let i=0;i<5;i++)scroll(x+side*w/2,y+.3+i*(h-.5)/5,z+.1,.07,p,accent)
      box(.14,h*.7,.028,accent,x+side*(w/2+.16),y+h*.47,z+.03,p)
    }
    box(w+.4,.16,.22,wood,x,y+h,z,p);box(w+.36,.04,.26,accent,x,y+h+.09,z,p)
    for(let i=-3;i<=3;i++)scroll(x+i*w*.12,y+h-.13,z+.14,.09,p,accent)
    curve([[x-w*.57,y+h+.1,z],[x-w*.3,y+h+.19,z],[x,y+h+.4,z],[x+w*.3,y+h+.19,z],[x+w*.57,y+h+.1,z]],.055,wood,p)
    lotus(x,y+h+.29,z,.12,p,accent)
  }
  function crane(x,y,z,p,side=1) {
    const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(.65);p.add(g)
    sphere(.18,bronze,0,.05,0,g,1.4,.4,1.6)
    for(const dx of [-.08,.08])beam(V(dx,.12,0),V(dx,.82,0),.018,bronze,g)
    sphere(.16,bronze,0,.92,0,g,1,.85,1.8)
    curve([[0,1,.1],[0,1.3,.24],[0,1.65,.12],[0,1.75,.23]],.035,bronze,g)
    sphere(.061,gold,0,1.75,.23,g,1,.8,1.3);beam(V(0,1.75,.27),V(0,1.74,.48),.017,gold,g)
    for(let i=0;i<5;i++)curve([[side*.08,.99,-.05],[side*(.15+i*.01),.96-i*.015,-.2],[side*.04,.9,-.42]],.012,gold,g)
    lotus(0,1.85,.24,.12,g)
  }
  function prayerMat(x,z,p,color=0x8c7052) {
    const o=cylinder(.31,.34,.065,color,x,.375,z,p,40);o.scale.z=.83
    for(const r of [.12,.2,.27])ring(r,.006,x,.411,z,p,0xb49b70,true).scale.z=.83
  }
  return {figure,scannedAltar,altar,offerings,shrineFrame,crane,candle,vessel,prayerMat,scroll,lotus}
}
