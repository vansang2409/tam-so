import assert from 'node:assert/strict'
import {connectTemplePresence,readVisitor,visitorName,resolveTempleRoom,TEMPLE_ROOM} from '../src/data/templePresence.js'
const qaRoom='tam-so-temple-qa-20261103-isolated-a'
assert.equal(resolveTempleRoom('?templeQaRoom='+qaRoom,true),qaRoom)
assert.equal(resolveTempleRoom('?view=world&templeQaRoom='+qaRoom,true),qaRoom)
for(const development of [undefined,false,null,0,'true'])assert.equal(resolveTempleRoom('?templeQaRoom='+qaRoom,development),TEMPLE_ROOM,'Only a development boolean may enable URL room selection')
for(const search of ['',null,undefined,'?templeQaRoom=','?templeQaRoom='+TEMPLE_ROOM,'?templeQaRoom=tam-so-temple-qa-short','?templeQaRoom=tam-so-temple-qa-'+('a'.repeat(48)),'?templeQaRoom='+qaRoom+'-','?templeQaRoom=tam-so-temple-qa--20261103','?templeQaRoom='+qaRoom+'%0A','?templeQaRoom='+qaRoom+'%20','?templeQaRoom='+qaRoom+'%2Fother','?templeQaRoom=TAM-SO-TEMPLE-QA-20261103','?templeQaRoom='+qaRoom+'&templeQaRoom='+qaRoom])assert.equal(resolveTempleRoom(search,true),TEMPLE_ROOM,'Invalid or ambiguous QA namespaces must preserve the default room')
const longestRoom='tam-so-temple-qa-'+('a'.repeat(47))
assert.equal(longestRoom.length,64);assert.equal(resolveTempleRoom('?templeQaRoom='+longestRoom,true),longestRoom)
const me='guest-self-1234',other='guest-other-1234',base={id:other,name:'Khách khác',x:1,z:20,yaw:0,seq:1,space:'courtyard',moving:false}
for(const name of [{toString:null},{},[],['guest'],42,null,true]){
 let result
 assert.doesNotThrow(()=>{result=readVisitor({...base,name})},'Malformed JSON names must not throw from a room callback')
 assert.equal(result,null,'Provided names must be strings')
}
const {name:unusedName,...unnamed}=base
assert.equal(readVisitor(unnamed).name,'Khách hành hương','Omitted legacy names keep their safe fallback')
assert.equal(visitorName('  <An>\n  lành  '),'An lành');assert.equal([...visitorName('a'.repeat(40))].length,24)
for(const patch of [{x:Infinity},{z:-999},{seq:-1},{seq:1.5},{space:'unknown'},{id:'__proto__'},{yaw:99}])assert.equal(readVisitor({...base,...patch}),null)
assert.equal(readVisitor(base).appearance,'male','Legacy clients use the default avatar')
assert.equal(readVisitor({...base,appearance:'female'}).appearance,'female')
assert.equal(readVisitor({...base,appearance:'unknown'}),null)
assert.equal(readVisitor(base).pose,'standing','Khách dùng bản cũ vẫn đứng bình thường')
assert.equal(readVisitor({...base,pose:'meditating'}).pose,'meditating')
assert.equal(readVisitor({...base,pose:'bowing',bowProgress:.5}).bowProgress,.5)
for(const patch of [{pose:'admin'},{pose:null},{bowProgress:NaN},{bowProgress:-.1},{bowProgress:1.01}])assert.equal(readVisitor({...base,...patch}),null,'Bỏ tư thế/nhịp không hợp lệ')
let t=1000,tick,callback,removed=0,cancelled=0,state={},sent=[],tracked=[],snapshots=[],handlers={}
const channel={on(type,filter,fn){handlers[type+':'+filter.event]=fn;return this},subscribe(fn){callback=fn;return this},send(p){sent.push(p.payload);return Promise.resolve('ok')},track(p){tracked.push({...p});return Promise.resolve('ok')},presenceState(){return state}}
const client={channel(room,{config}){assert.equal(room,TEMPLE_ROOM,'Omitted room keeps the production namespace');assert.equal(config.presence.key,me,'Room selection does not alter the visitor presence key');return channel},removeChannel(c){assert.equal(c,channel);removed++;return Promise.resolve('ok')}}
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
c.update({appearance:'female'});t+=250;tick();assert.equal(sent.at(-1).appearance,'female');assert.equal(tracked.at(-1).appearance,'female')
handlers['broadcast:move']({payload:{...base,appearance:'female',seq:5}});assert.equal(snapshots.at(-1).peers[0].appearance,'female')
handlers['presence:sync']();assert.equal(snapshots.at(-1).peers[0].appearance,'female','Older presence cannot revert a newer avatar broadcast')
c.rename('Tên mới');assert.equal(tracked.at(-1).name,'Tên mới')
t+=21000;tick();assert.equal(snapshots.at(-1).count,1,'Không đếm phiên mất heartbeat');assert.equal(snapshots.at(-1).peers.length,0)
for(let i=0;i<60;i++){t+=1000;handlers['presence:sync']();tick();assert.equal(snapshots.at(-1).count,1,'Unchanged cached presence cannot resurrect a heartbeat-expired visitor during sync churn')}
state[other]=[{...base,seq:4,name:'Cached profile'}];handlers['presence:sync']()
assert.equal(snapshots.at(-1).count,1,'A delayed presence version older than the last known heartbeat does not renew liveness')
handlers['broadcast:move']({payload:{...base,seq:5}});assert.equal(snapshots.at(-1).count,1,'A duplicate known heartbeat cannot revive the expired visitor')
handlers['broadcast:move']({payload:{...base,x:3,seq:6}});assert.equal(snapshots.at(-1).count,2);assert.equal(snapshots.at(-1).peers[0].x,3,'A genuinely newer heartbeat revives a known member')
state[other]=[{...base,seq:5,name:'Tên hiện tại'}];handlers['presence:sync']()
assert.equal(snapshots.at(-1).peers[0].name,'Tên hiện tại','Profile names still update after a newer movement packet arrived first')
t+=21000;tick();assert.equal(snapshots.at(-1).count,1)
handlers['presence:sync']();assert.equal(snapshots.at(-1).count,1,'The same known presence sequence remains expired')
state={[me]:[tracked.at(-1)]};handlers['presence:sync']()
state[other]=[{...base,seq:1}];handlers['presence:sync']();assert.equal(snapshots.at(-1).count,2,'A real leave followed by a new join can restart its sequence')
state[other]=[{...base,seq:3,x:4,name:'Latest ref'},{...base,seq:1,name:'Old ref'}];handlers['presence:sync']()
assert.equal(snapshots.at(-1).peers[0].x,4);assert.equal(snapshots.at(-1).peers[0].name,'Latest ref','Multiple presence refs cannot replace a newer profile with an older cached ref')
state={[me]:[tracked.at(-1)]};handlers['presence:sync']();assert.equal(snapshots.at(-1).peers.length,0,'Rời phòng xóa khách')
callback('CHANNEL_ERROR');assert.equal(snapshots.at(-1).phase,'reconnecting');assert.equal(snapshots.at(-1).count,0)
callback('SUBSCRIBED');assert.ok(tracked.length>=4,'Kết nối lại gửi presence mới')
c.close();const after=snapshots.length;callback('SUBSCRIBED');handlers['presence:sync']();tick();assert.equal(snapshots.length,after);assert.equal(removed,1);assert.equal(cancelled,1)
c.close();assert.equal(removed,1)
let unavailable;connectTemplePresence(null,{id:me,name:'Bạn',onChange:s=>unavailable=s});assert.equal(unavailable.phase,'unavailable');assert.equal(unavailable.count,0)

// Two independent clients exchange only transient presence/broadcast over an in-memory room.
// Freeze time to catch sync/rename bypassing the movement throttle, not just update/timer traffic.
{
 let clock=1000
 const channels=new Set(),timers=new Set(),messages=[]
 const syncRoom=()=>{for(const channel of channels)if(channel.joined)channel.handlers['presence:sync']?.()}
 function participant(id,room=TEMPLE_ROOM){
  let current
  const client={channel(namespace,{config}){
   current={room:namespace,key:config.presence.key,handlers:{},joined:false,presence:null,
    on(type,filter,fn){this.handlers[type+':'+filter.event]=fn;return this},
    subscribe(fn){this.status=fn;return this},
    presenceState(){return Object.fromEntries([...channels].filter(c=>c.joined&&c.presence&&c.room===this.room).map(c=>[c.key,[{...c.presence}]]))},
    track(value){this.presence={...value};syncRoom();return Promise.resolve('ok')},
    send({payload}){messages.push({from:this.key,at:clock,payload:{...payload}});for(const c of channels)if(c!==this&&c.joined&&c.room===this.room)c.handlers['broadcast:move']?.({payload:{...payload}});return Promise.resolve('ok')},
    join(){this.joined=true;this.status('SUBSCRIBED')},
    disconnect(){this.joined=false;this.presence=null;this.status('CHANNEL_ERROR');syncRoom()}}
   channels.add(current);return current
  },removeChannel(channel){channels.delete(channel);syncRoom();return Promise.resolve('ok')}}
  let state
  const connection=connectTemplePresence(client,{id,name:id,room,onChange:s=>state=s,now:()=>clock,schedule:fn=>{timers.add(fn);return fn},cancel:fn=>timers.delete(fn)})
  return {connection,channel:current,get state(){return state}}
 }
 const a=participant('qa-client-a'),b=participant('qa-client-b'),advance=ms=>{clock+=ms;for(const tick of timers)tick()}
 a.channel.join();b.channel.join()
 assert.equal(a.state.count,2);assert.equal(b.state.count,2)
 const initialMessages=messages.length
 for(let i=0;i<10;i++){syncRoom();a.connection.rename('Tên '+i)}
 a.connection.update({x:3,space:'chanh-dien',appearance:'female',pose:'bowing',bowProgress:.42})
 b.connection.update({z:22,pose:'meditating'})
 assert.equal(messages.length,initialMessages,'Sync and rename bursts cannot broadcast again at the same timestamp')
 advance(249);assert.equal(messages.length,initialMessages,'Queued latest states wait for the shared 250ms limit')
 advance(1)
 assert.equal(messages.length,initialMessages+2,'Each independent client sends once when the throttle opens')
 const seenByB=b.state.peers.find(p=>p.id==='qa-client-a')
 assert.deepEqual([seenByB.x,seenByB.space,seenByB.appearance,seenByB.pose,seenByB.bowProgress,seenByB.name],[3,'chanh-dien','female','bowing',.42,'Tên 9'])
 assert.equal(a.state.peers[0].pose,'meditating','Movement and pose flow in both directions')
 const beforeReconnect=messages.length
 a.channel.disconnect();assert.equal(a.state.phase,'reconnecting');assert.equal(b.state.count,1)
 a.connection.update({x:5,pose:'standing',bowProgress:0})
 a.channel.join()
 assert.equal(messages.length,beforeReconnect+1,'A real reconnect sends its fresh snapshot immediately, even within the old throttle window')
 assert.equal(a.state.phase,'online');assert.equal(b.state.count,2);assert.equal(b.state.peers[0].x,5)
 const afterReconnect=messages.length
 a.channel.status('SUBSCRIBED');assert.equal(messages.length,afterReconnect,'Duplicate subscribed callbacks cannot bypass the throttle')
 a.connection.close();assert.equal(b.state.count,1);assert.equal(b.state.peers.length,0)
 const qaA=participant('isolated-guest-a',resolveTempleRoom('?templeQaRoom='+qaRoom,true)),qaB=participant('isolated-guest-b',qaRoom)
 qaA.channel.join();qaB.channel.join()
 assert.equal(qaA.channel.room,qaRoom);assert.equal(qaA.state.count,2);assert.equal(qaB.state.count,2)
 assert.equal(b.state.count,1);assert.equal(b.state.peers.length,0,'QA presence cannot join the default room')
 qaA.connection.update({x:4,appearance:'female'});advance(250)
 assert.equal(qaB.state.peers[0].x,4);assert.equal(qaB.state.peers[0].appearance,'female')
 assert.equal(b.state.peers.length,0,'QA broadcasts cannot reach default-room peers')
 qaA.connection.close();qaB.connection.close()
 b.connection.close();assert.equal(channels.size,0);assert.equal(timers.size,0,'Both independent clients release timers and channels')
}
console.log('Phòng chung: giới hạn gói/tên/tọa độ, bỏ gói cũ, giới hạn 4Hz, đổi tên/khu, rời phòng và tái kết nối/cleanup pass.')
