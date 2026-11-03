import * as THREE from 'three'
// Đại điện riêng: năm gian, trục hành lễ thoáng, một tôn tượng trung tâm.
export function createTempleMainHall({box,sphere,cylinder,mesh,beam,label,mat,curve,scannedAltar,altar,offerings,shrineFrame,crane,candle,prayerMat,scroll,vase}) {
  const V=(...p)=>new THREE.Vector3(...p),gold=0xb99a5c,wood=0x493024
  function exterior(p,w,d,h,a) {
    // Hiên và ba bậc rộng; cao độ lối đi giữ đồng nhất với hệ điều hướng.
    for(let i=0;i<3;i++)box(w-1-i*.35,.075,d*.08,0xc5b496,0,.045+i*.075,d/2+.9-i*.3,p,{surface:'stone'})
    for(const side of [-1,1]){
      for(const z of [-d/2+.5,d/2-.6])box(.36,h-.4,.38,a.wood,side*(w/2-.32),h/2+.3,z,p)
      for(const x of [side*3.9,side*6.45]){
        box(2.05,2.5,.12,a.wood,x,1.6,d/2-.26,p)
        for(let j=-4;j<=4;j++)box(.035,1.65,.14,0x9a7548,x+j*.19,1.93,d/2-.18,p)
        box(2,.13,.18,gold,x,1.05,d/2-.15,p)
      }
    }
    // Xà ngang và chống xiên làm rõ các nhịp gian ở mặt tiền.
    for(const [x,z] of a.pillars){
      box(.68,.22,.6,a.wood,x,h-.02,z,p)
      for(const sign of [-1,1])beam(V(x,h-.8,z),V(x+sign*.7,h-.05,z),.09,a.wood,p)
    }
    box(w-.5,.3,.35,a.wood,0,h-.13,d/2-.25,p)
    // Bờ nóc và đôi đầu hồi uốn lên, không đặt biểu tượng ngoại lai trên mái.
    for(const side of [-1,1])for(let i=0;i<5;i++){
      const x=side*(w*.31+i*.32),y=h+2.9+i*.065
      cylinder(.09,.12,.22,gold,x,y,0,p,8)
    }
  }
  function interior(p,w,d,h,a) {
    const rear=-d/2,altarZ=rear+2.15
    // Bệ thờ cao, ốp gỗ nhiều lớp và vách hậu kín sau tôn tượng.
    box(12.5,.23,4.1,0x725340,0,.45,rear+2.25,p,{surface:'wood'})
    box(12.7,.07,4.2,gold,0,.59,rear+2.25,p)
    box(11.9,4.9,.14,wood,0,3.08,rear+.17,p,{surface:'wood'})
    for(let x=-5.6;x<=5.6;x+=.35)box(.028,4.7,.035,0x82613d,x,3.08,rear+.26,p)
    scannedAltar(0,.64,altarZ,4.8,4.9,3.65,p,0xc7a35f)
    shrineFrame(0,.64,rear+.38,6.35,4.65,p,wood,gold)
    label('ĐẠI HÙNG BẢO ĐIỆN',0,5.72,rear+.56,4.9,p)
    // Hai bên là đèn và tủ kinh, không nhân đôi tôn tượng Quan Âm.
    for(const side of [-1,1]){
      const x=side*4.95
      box(2.15,1.25,.65,wood,x,1.25,altarZ-.45,p,{surface:'wood'})
      for(let row=0;row<3;row++){
        box(2.1,.045,.68,gold,x,.78+row*.37,altarZ-.42,p)
        for(let j=0;j<8;j++)box(.16,.26,.36,[0x967344,0x6a3428,0xa99b70][j%3],x-.82+j*.23,.94+row*.37,altarZ-.35,p)
      }
      shrineFrame(x,.64,rear+.4,2.15,3.3,p,wood,gold)
      for(let row=0;row<3;row++)for(let j=-1;j<=1;j++)candle(x+j*.46,2.04+row*.33,altarZ-.6-row*.12,p,0xa86e37)
      crane(side*3.6,.64,rear+3.65,p,side)
      vase(side*5.75,.625,rear+3.4,p,0xbac3b4,true)
      // Câu đối dọc trên trụ khám, giữ chữ Việt rõ nét ở góc nhìn gần.
      for(const [i,t] of (side<0?['TỪ','BI','HỶ','XẢ']:['TRÍ','TUỆ','AN','NHIÊN']).entries())label(t,side*3.32,4.65-i*.54,rear+.55,.33,p)
    }
    // Keep the offering cluster in front of the scanned altar's projecting cushion.
    const frontAltar=altar(0,rear+4.1,5.4,p,wood,1.16,{legBaseY:.625,frontLegInset:.2});offerings(0,1.28,rear+4.2,p,3.65,frontAltar)
    for(const side of [-1,1])vase(side*2.15,1.2475,rear+4.05,p,0xc0c5b3,true)
    // Nền gạch, đường viền và các hàng bồ đoàn để nhận ra chiều sâu thực.
    box(w-.4,.018,d-4.8,0xb6a184,0,.344,2.15,p,{surface:'stone'})
    for(let z=-.1;z<d/2;z+=.85)box(w-.45,.012,.018,0x796b57,0,.36,z,p)
    for(let x=-w/2+.65;x<w/2;x+=.85)box(.018,.012,d-4.8,0x796b57,x,.36,2.15,p)
    box(1.65,.022,d-4.9,0x74372d,0,.37,2.15,p,{surface:'wood'})
    for(const side of [-1,1])for(let z=.15;z<4.7;z+=1.35)for(let col=0;col<3;col++)prayerMat(side*(1.6+col*1.05),z,p,0x80694b)
    // Hệ cột nội điện chia gian và trần gỗ có ô, đèn treo riêng từng nhịp.
    for(const [x,z] of a.pillars.filter(([,z])=>z<5)){
      cylinder(.22,.25,h,wood,x,h/2+.25,z,p,24)
      cylinder(.36,.39,.22,0xa7a294,x,.44,z,p,24)
      cylinder(.24,.24,.1,gold,x,1.25,z,p,24)
    }
    for(const z of [-4.6,0,4.6]){
      box(w-.4,.22,.25,wood,0,h-.04,z,p)
      for(const side of [-1,1])beam(V(side*5.2,h-.8,z),V(side*4.4,h-.08,z),.09,wood,p)
    }
    for(const x of [-5.2,-2.6,0,2.6,5.2])box(.13,.15,d-.4,wood,x,h+.02,0,p)
    for(const z of [-1.2,3]){
      // Đèn lồng bát giác bằng đồng, ánh vàng dịu thay cho đèn chùm hiện đại.
      cylinder(.018,.018,.5,gold,0,h-.45,z,p,8)
      cylinder(.12,.42,.18,wood,0,h-.78,z,p,8)
      const shade=cylinder(.3,.34,.52,0xc6a76f,0,h-1.12,z,p,8)
      shade.material=mat(0xc6a76f,{emissive:0xb07938,emissiveIntensity:.3,roughness:.75})
      for(let i=0;i<8;i++){const t=i*Math.PI/4;beam(V(Math.cos(t)*.3,h-.86,z+Math.sin(t)*.3),V(Math.cos(t)*.34,h-1.38,z+Math.sin(t)*.34),.018,wood,p)}
      for(const y of [h-.86,h-1.38])cylinder(.36,.36,.055,gold,0,y,z,p,8)
      cylinder(.16,.3,.14,wood,0,h-1.46,z,p,8)
      cylinder(.022,.022,.2,gold,0,h-1.62,z,p,8)
    }
    // Chuông nhỏ và mõ trên hai bục gỗ phục vụ gian tụng niệm.
    for(const side of [-1,1]){
      const x=side*6.65,z=2.3
      box(.9,.48,.8,wood,x,.59,z,p)
      if(side<0){sphere(.31,0x5f3527,x,.99,z,p,1.15,.8,1);box(.32,.025,.035,0x291e16,x,1.17,z+.12,p)}
      else {cylinder(.34,.26,.12,0x9d804d,x,.91,z,p,32);sphere(.29,0x9d804d,x,.92,z,p,1,.6,1)}
      beam(V(x-.25,.9,z+.28),V(x+.2,1.05,z+.28),.025,0xa57c4d,p)
    }
  }
  return {exterior,interior}
}
