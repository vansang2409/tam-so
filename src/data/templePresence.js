import { WORLD_BOUNDS, WORLD_SPOTS } from './templeWorld.js'
export const TEMPLE_ROOM='tam-so-temple-v1'
export const MAX_VISIBLE_VISITORS=24
// QA room selection exists only in development; production always uses the public room.
export function resolveTempleRoom(search,development=false) {
  if(development!==true||typeof search!=='string')return TEMPLE_ROOM
  const values=new URLSearchParams(search).getAll('templeQaRoom')
  if(values.length!==1)return TEMPLE_ROOM
  const room=values[0],match=/^tam-so-temple-qa-[a-z0-9][a-z0-9-]{6,45}[a-z0-9]$/.exec(room)
  return match?.[0]===room?room:TEMPLE_ROOM
}
const spaces=new Set(['courtyard',...WORLD_SPOTS.filter(s=>s.architecture.style).map(s=>s.id)])
export const visitorName=value=>Array.from(String(value||'').normalize('NFC').replace(/[<>\u0000-\u001f\u007f-\u009f]/g,'').replace(/\s+/g,' ').trim()).slice(0,24).join('')||'Khách hành hương'
export function readVisitor(value) {
  if(!value||typeof value!=='object'||typeof value.id!=='string'||!/^[a-zA-Z0-9-]{8,64}$/.test(value.id))return null
  const {x,z,yaw,seq}=value,b=WORLD_BOUNDS
  if(![x,z,yaw,seq].every(Number.isFinite)||x<b.minX||x>b.maxX||z<b.minZ||z>b.maxZ||Math.abs(yaw)>Math.PI*4||!Number.isSafeInteger(seq)||seq<0||!spaces.has(value.space))return null
  if(value.name!==undefined&&typeof value.name!=='string')return null
  if(value.appearance!==undefined&&!['male','female'].includes(value.appearance))return null
  if(value.pose!==undefined&&!['standing','meditating','bowing'].includes(value.pose))return null
  if(value.bowProgress!==undefined&&(!Number.isFinite(value.bowProgress)||value.bowProgress<0||value.bowProgress>1))return null
  return {appearance:value.appearance||'male',pose:value.pose||'standing',bowProgress:value.bowProgress||0,id:value.id,name:visitorName(value.name),x,z,yaw,seq,space:value.space,moving:value.moving===true,color:Math.abs([...value.id].reduce((a,c)=>a+c.charCodeAt(0),0))%5}
}
// Presence chỉ giữ danh sách chậm thay đổi; chuyển động dùng Broadcast tối đa 4 lần/giây.
export function connectTemplePresence(client,{id,name,appearance='male',room=TEMPLE_ROOM,onChange,now=()=>Date.now(),schedule=setInterval,cancel=clearInterval}) {
  let stopped=false,joined=false,seq=0,phase=client?'connecting':'unavailable',lastSent=-Infinity,lastHeartbeat=0,lastTrack='',dirty=true
  let local={id,name:visitorName(name),appearance:appearance==='female'?'female':'male',x:0,z:24.8,yaw:0,seq,space:'courtyard',moving:false},members=new Map(),peers=new Map()
  const emit=()=>{if(!stopped)onChange({phase,peers:[...peers.values()].map(({seen,...p})=>p),count:joined?1+peers.size:0})}
  if(!client){emit();return {update(){},rename(){},close(){stopped=true}}}
  const channel=client.channel(room,{config:{broadcast:{self:false,ack:false},presence:{key:id},private:false}})
  // All callers share the same limit, including presence sync and rename bursts.
  function send(){if(!joined||stopped||now()-lastSent<250)return;local={...local,seq:++seq};channel.send({type:'broadcast',event:'move',payload:local}).catch(()=>{});lastSent=now();lastHeartbeat=now();dirty=false}
  function track(){const key=local.name+'|'+local.space+'|'+local.appearance;if(!joined||key===lastTrack)return;lastTrack=key;channel.track(local).then(result=>{if(result!=='ok')lastTrack=''}).catch(()=>{lastTrack=''})}
  function sync(){
    if(stopped||!joined)return
    const next=new Map()
    for(const [key,states] of Object.entries(channel.presenceState()))for(const raw of Array.isArray(states)?states:[]){
      const p=readVisitor(raw);if(!p||p.id!==key)continue
      // Presence can replay an old snapshot long after its movement heartbeat expired.
      // Retain activity separately from the profile snapshot until membership really leaves.
      const previous=next.get(p.id)||members.get(p.id),profile=previous&&previous.seq>p.seq?previous:p
      const lastSeq=Math.max(previous?.lastSeq??-1,p.seq),seen=!previous||p.seq>previous.lastSeq?now():previous.seen
      next.set(p.id,{...profile,lastSeq,seen})
      if(p.id!==id){
        const old=peers.get(p.id)
        if(now()-seen<=20000)peers.set(p.id,{...(old&&old.seq>=p.seq?old:p),name:profile.name,seen})
        else peers.delete(p.id)
      }
    }
    members=next
    for(const key of peers.keys())if(!members.has(key))peers.delete(key)
    dirty=true;emit();send()
  }
  channel.on('presence',{event:'sync'},sync).on('broadcast',{event:'move'},({payload})=>{
    if(stopped||!joined)return
    const p=readVisitor(payload),member=p&&members.get(p.id),old=p&&peers.get(p.id)
    if(!member||p.id===id||p.seq<=member.lastSeq||(old&&p.seq<=old.seq))return
    const seen=now();members.set(p.id,{...member,lastSeq:p.seq,seen})
    peers.set(p.id,{...p,name:member.name,color:member.color,seen});emit()
  }).subscribe(status=>{
    if(stopped)return
    const wasJoined=joined;joined=status==='SUBSCRIBED';phase=joined?'online':status==='CLOSED'?'offline':status==='CHANNEL_ERROR'||status==='TIMED_OUT'?'reconnecting':'connecting'
    if(joined){if(!wasJoined)lastSent=-Infinity;lastTrack='';track();send()}else {members.clear();peers.clear();lastTrack=''}emit()
  })
  const timer=schedule(()=>{
    if(stopped||!joined)return
    track()
    if((dirty&&now()-lastSent>=250)||now()-lastHeartbeat>=5000)send()
    let stale=false;for(const [key,p] of peers)if(now()-p.seen>20000){peers.delete(key);stale=true}if(stale)emit()
  },125)
  emit()
  return {
    update(p){const next=readVisitor({...local,...p,id,seq});if(!next)return;dirty=dirty||['x','z','yaw','space','moving','pose','bowProgress','appearance'].some(k=>next[k]!==local[k]);local=next},
    rename(value){local.name=visitorName(value);lastTrack='';dirty=true;track();send()},
    close(){if(stopped)return;stopped=true;joined=false;cancel(timer);client.removeChannel(channel).catch(()=>{});members.clear();peers.clear()}
  }
}
