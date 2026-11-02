import assert from 'node:assert/strict'
import {connectTemplePresence,readVisitor,visitorName} from '../src/data/templePresence.js'
const me='guest-self-1234',other='guest-other-1234',base={id:other,name:'Khách khác',x:1,z:20,yaw:0,seq:1,space:'courtyard',moving:false}
assert.equal(visitorName('  <An>\n  lành  '),'An lành');assert.equal([...visitorName('a'.repeat(40))].length,24)
for(const patch of [{x:Infinity},{z:-999},{seq:-1},{seq:1.5},{space:'unknown'},{id:'__proto__'},{yaw:99}])assert.equal(readVisitor({...base,...patch}),null)
assert.equal(readVisitor(base).pose,'standing','Khách dùng bản cũ vẫn đứng bình thường')
assert.equal(readVisitor({...base,pose:'meditating'}).pose,'meditating')
assert.equal(readVisitor({...base,pose:'bowing',bowProgress:.5}).bowProgress,.5)
for(const patch of [{pose:'admin'},{pose:null},{bowProgress:NaN},{bowProgress:-.1},{bowProgress:1.01}])assert.equal(readVisitor({...base,...patch}),null,'Bỏ tư thế/nhịp không hợp lệ')
let t=1000,tick,callback,removed=0,cancelled=0,state={},sent=[],tracked=[],snapshots=[],handlers={}
const channel={on(type,filter,fn){handlers[type+':'+filter.event]=fn;return this},subscribe(fn){callback=fn;return this},send(p){sent.push(p.payload);return Promise.resolve('ok')},track(p){tracked.push({...p});return Promise.resolve('ok')},presenceState(){return state}}
const client={channel(){return channel},removeChannel(c){assert.equal(c,channel);removed++;return Promise.resolve('ok')}}
const c=connectTemplePresence(client,{id:me,name:'Bạn',onChange:s=>snapshots.push(s),now:()=>t,schedule:fn=>{tick=fn;return 1},cancel:()=>cancelled++})
callback('SUBSCRIBED');assert.equal(tracked.length,1)
state={[me]:[tracked[0]],[other]:[base]};handlers['presence:sync']();assert.equal(snapshots.at(-1).count,2);assert.equal(snapshots.at(-1).peers.length,1)
handlers['broadcast:move']({payload:{...base,x:2,seq:2}});assert.equal(snapshots.at(-1).peers[0].x,2)
handlers['broadcast:move']({payload:{...base,x:10,seq:1}});assert.equal(snapshots.at(-1).peers[0].x,2,'Bỏ gói cũ')
handlers['broadcast:move']({payload:{...base,id:'unknown-1234',seq:3}});assert.equal(snapshots.at(-1).peers.length,1,'Bỏ người không có presence')
handlers['broadcast:move']({payload:{...base,x:100,seq:3}});assert.equal(snapshots.at(-1).peers[0].x,2,'Bỏ tọa độ sai')
const n=sent.length;c.update({x:2,z:23,moving:true});t+=100;tick();assert.equal(sent.length,n);t+=150;tick();assert.equal(sent.length,n+1);assert.equal(sent.at(-1).x,2,'Gửi chuyển động tối đa 4Hz')
c.update({space:'chanh-dien'});t+=250;tick();assert.equal(tracked.at(-1).space,'chanh-dien')
c.update({pose:'meditating'});t+=250;tick();assert.equal(sent.at(-1).pose,'meditating','Tư thế thay đổi được gửi ngay nhịp kế')
c.update({pose:'bowing',bowProgress:.45});t+=250;tick();assert.equal(sent.at(-1).bowProgress,.45)
handlers['broadcast:move']({payload:{...base,pose:'bowing',bowProgress:.52,seq:4}});assert.equal(snapshots.at(-1).peers[0].pose,'bowing');assert.equal(snapshots.at(-1).peers[0].bowProgress,.52)
c.rename('Tên mới');assert.equal(tracked.at(-1).name,'Tên mới')
t+=21000;tick();assert.equal(snapshots.at(-1).count,1,'Không đếm phiên mất heartbeat');assert.equal(snapshots.at(-1).peers.length,0)
state={[me]:[tracked.at(-1)]};handlers['presence:sync']();assert.equal(snapshots.at(-1).peers.length,0,'Rời phòng xóa khách')
callback('CHANNEL_ERROR');assert.equal(snapshots.at(-1).phase,'reconnecting');assert.equal(snapshots.at(-1).count,0)
callback('SUBSCRIBED');assert.ok(tracked.length>=4,'Kết nối lại gửi presence mới')
c.close();const after=snapshots.length;callback('SUBSCRIBED');handlers['presence:sync']();tick();assert.equal(snapshots.length,after);assert.equal(removed,1);assert.equal(cancelled,1)
c.close();assert.equal(removed,1)
let unavailable;connectTemplePresence(null,{id:me,name:'Bạn',onChange:s=>unavailable=s});assert.equal(unavailable.phase,'unavailable');assert.equal(unavailable.count,0)
console.log('Phòng chung: giới hạn gói/tên/tọa độ, bỏ gói cũ, giới hạn 4Hz, đổi tên/khu, rời phòng và tái kết nối/cleanup pass.')
