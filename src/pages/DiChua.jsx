import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SeoTag from '../components/SeoTag.jsx'
import Logo from '../components/Logo.jsx'
import TempleWorld from '../components/TempleWorld.jsx'
import TempleViewControls from '../components/TempleViewControls.jsx'
import TemplePlacePanel from '../components/TemplePlacePanel.jsx'
import { useTemplePresence } from '../components/useTemplePresence.js'
import { TempleActionIcon, TempleOptions } from '../components/TempleHud.jsx'
import IncenseCenser3D from '../components/IncenseCenser3D.jsx'
import ShakeXam from '../components/ShakeXam.jsx'
import XinKeo from '../components/XinKeo.jsx'
import { BOW_DURATION, bowFrame, meditationSeconds, templePose } from '../data/templeRituals.js'
import { WORLD_SPOTS } from '../data/templeWorld.js'
import { TEMPLE_DETAIL_CREDITS } from '../data/templeDetailCredits.js'
import { TEMPLE_ASSET_CREDITS } from '../data/templeAssetCredits.js'
import { loadLoiNguyen, addLoiNguyen, clearLoiNguyen, countThapHuong, thapHuong,
  loadXamLichSu, clearXamLichSu, xamBySo, loadKeoLichSu, clearKeoLichSu, keoById } from '../data/dichua.js'
import '../styles/temple-world.css'
import '../styles/temple-mobile.css'

const Classic=lazy(()=>import('./DiChuaClassic.jsx'))
const spotById=id=>WORLD_SPOTS.find(s=>s.id===id)
const timeLabel=t=>new Date(t).toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
function TempleDialog({title,children,onClose,wide=false}) {
  const ref=useRef(null)
  useEffect(()=>{const el=ref.current,opener=document.activeElement;el.showModal();return ()=>{el.close();const target=opener?.isConnected&&opener!==document.body?opener:document.querySelector('.tw-options-trigger');target?.focus({preventScroll:true})}},[])
  return <dialog ref={ref} className={'tw-dialog'+(wide?' tw-dialog-wide':'')} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}} aria-labelledby="temple-dialog-title">
    <div className="tw-dialog-heading"><h2 id="temple-dialog-title">{title}</h2><button type="button" onClick={onClose} aria-label="Đóng hộp thoại">×</button></div>{children}
  </dialog>
}
function TempleMap({activeId,onGo,position}) {
  return <div className="tw-map" aria-label="Sơ đồ đầy đủ 23 khu trong Chùa Tam Sở">
    <div className="tw-map-axis"/><div className="tw-map-cross"/><span className="tw-map-north">BẮC · NỘI ĐIỆN</span>
    {WORLD_SPOTS.map((s,i)=><button key={s.id} className={'tw-map-place tw-map-'+s.kind+(activeId===s.id?' is-selected':'')} style={{left:((s.x+27)/54*100)+'%',top:((s.centerZ+29)/58*100)+'%'}} onClick={()=>onGo(s.id)} title={s.ten} aria-label={'Đi đến '+s.ten}><span/><em>{i+1}</em></button>)}
    <span className="tw-map-you" style={{left:((position.x+27)/54*100)+'%',top:((position.z+29)/58*100)+'%'}} title="Vị trí của bạn"/>
    <span className="tw-map-south">NAM · CỔNG VÀO</span>
  </div>
}
export default function DiChua() {
  const [params,setParams]=useSearchParams()
  if(params.get('view')==='classic')return <><div className="tw-classic-return"><button onClick={()=>setParams({})}>← Vào khuôn viên 3D</button></div><Suspense fallback={<div className="tw-loading">Đang mở không gian ảnh…</div>}><Classic/></Suspense></>
  return <TempleExperience onClassic={()=>setParams({view:'classic'})}/>
}
function TempleExperience({onClassic}) {
  const root=useRef(null),world=useRef(null),audio=useRef(null),timer=useRef(null),flashTimer=useRef(null),ritualTimer=useRef(null),bowTimer=useRef(null)
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[mapOpen,setMapOpen]=useState(false)
  const [activeId,setActiveId]=useState('cong-tam-quan'),[modal,setModal]=useState(null)
  const [litIds,setLitIds]=useState(()=>new Set()),[litCount,setLitCount]=useState(()=>countThapHuong())
  const [prayers,setPrayers]=useState(()=>loadLoiNguyen()),[prayer,setPrayer]=useState('')
  const [history,setHistory]=useState({prayers:[],xam:[],keo:[]})
  const [status,setStatus]=useState({moving:false,position:{x:0,z:24.8},near:null})
  const [ritual,setRitual]=useState(null)
  const [notice,setNotice]=useState(''),[sound,setSound]=useState(false),[quality,setQuality]=useState('standard')
  const online=useTemplePresence(ready&&!failed),[visitorDraft,setVisitorDraft]=useState('')
  const onlineLabel=online.phase==='online'?online.count+' người đang online':online.phase==='connecting'?'Đang vào phòng chung':online.phase==='unavailable'?'Chưa mở phòng chung':'Đang kết nối lại'
  const [minutes,setMinutes]=useState(1),[remaining,setRemaining]=useState(null),[bow,setBow]=useState(null)
  const loc=spotById(activeId),walking=status.moving,meditating=remaining!==null&&remaining>0
  useEffect(()=>{const meta=document.querySelector('meta[name="viewport"]'),original=meta?.content;if(meta&&!original.includes('viewport-fit'))meta.content=original+', viewport-fit=cover';document.body.classList.add('tw-lock');return ()=>{if(meta&&original)meta.content=original;document.body.classList.remove('tw-lock');clearInterval(timer.current);clearTimeout(flashTimer.current);clearTimeout(ritualTimer.current);clearTimeout(bowTimer.current);audio.current?.close()}},[])
  const flash=message=>{setNotice(message);clearTimeout(flashTimer.current);flashTimer.current=setTimeout(()=>setNotice(''),4200)}
  // Gửi kết thúc tư thế cả khi hộp thoại đang tạm dừng cảnh 3D.
  useEffect(()=>{online.update({pose:templePose({bowing:bow,meditating,ritual}),bowProgress:0})},[bow,meditating,ritual,online.update])
  const stopPose=()=>{clearInterval(timer.current);clearTimeout(bowTimer.current);setRemaining(null);setBow(null);setRitual(null);clearTimeout(ritualTimer.current)}
  const go=(id,action=null)=>{
    if(!ready||failed)return
    stopPose();setMapOpen(false);setStatus(s=>({...s,moving:true,destination:spotById(id).ten}))
    world.current?.goTo(id,action)
  }
  const ringBell=()=>{
    world.current?.bell();flash('Một tiếng chuông, một khoảng lặng.');
    if(!sound||!audio.current)return
    const ctx=audio.current,now=ctx.currentTime
    // Âm chuông tổng hợp tại máy, chỉ phát sau khi người dùng bật âm thanh.
    for(const [i,f] of [220,587,880,1193].entries()) {
      const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=f
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.13/(i+1),now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+5.5)
      osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+5.6);osc.onended=()=>{osc.disconnect();gain.disconnect()}
    }
  }
  const action=(type,spot=loc)=>{
    stopPose()
    if(type==='incense')setModal('incense')
    else if(type==='bell')ringBell()
    else if(type==='bow')startBow()
    else if(type==='meditate')setModal('meditate')
    else if(['prayer','xam','keo'].includes(type))setModal(type)
    else flash(spot.moTa)
  }
  const arrive=(spot,requested)=>{setActiveId(spot.id);setStatus(s=>({...s,moving:false,destination:null,near:spot}));if(requested)action(requested,spot)}
  const handleStatus=update=>{if(update.message){flash(update.message);setStatus(s=>({...s,moving:!!update.moving}));return}if(update.near&&!update.moving)setActiveId(update.near.id);setStatus(s=>({...s,...update}))}
  const actHere=type=>{if(walking)return;if(Math.hypot(status.position.x-loc.x,status.position.z-loc.z)<1)action(type);else go(activeId,type)}
  const openHistory=()=>{setHistory({prayers:loadLoiNguyen(),xam:loadXamLichSu(),keo:loadKeoLichSu()});setModal('history')}
  const toggleSound=async()=>{
    if(sound){await audio.current?.suspend();setSound(false);return}
    try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error();audio.current??=new Audio();await audio.current.resume();setSound(true)}catch{flash('Thiết bị này chưa bật được âm thanh. Bạn vẫn có thể trải nghiệm cảnh chùa.')}
  }
  const startMeditation=()=>{
    stopPose();world.current?.preparePose();setRemaining(minutes*60);setModal(null)
    const end=Date.now()+minutes*60000
    timer.current=setInterval(()=>{const left=meditationSeconds(end);if(!left){clearInterval(timer.current);setRemaining(null);flash('Phiên thiền đã hoàn thành. Chúc bạn một ngày an lành.')}else setRemaining(left)},250)
  }
  const startBow=()=>{stopPose();world.current?.preparePose();setBow({at:Date.now()});setModal(null)}
  const bowHere=()=>{if(bow){stopPose();return}if(status.view==='inside'&&loc.huong)startBow();else go(loc.huong?loc.id:'chanh-dien','bow')}
  useEffect(()=>{
    if(!bow)return
    bowTimer.current=setTimeout(()=>{setBow(null);flash('Đã hoàn thành ba lạy.')},Math.max(0,BOW_DURATION-(Date.now()-bow.at)))
    return ()=>clearTimeout(bowTimer.current)
  },[bow])
  useEffect(()=>{
    const viewport=window.visualViewport
    const resize=()=>{const height=viewport?.height||window.innerHeight,inset=Math.max(0,window.innerHeight-height-(viewport?.offsetTop||0));root.current?.style.setProperty('--tw-visible-height',height+'px');root.current?.style.setProperty('--tw-keyboard-inset',inset>120?inset+'px':'0px')}
    resize();viewport?.addEventListener('resize',resize);viewport?.addEventListener('scroll',resize);window.addEventListener('resize',resize)
    return ()=>{viewport?.removeEventListener('resize',resize);viewport?.removeEventListener('scroll',resize);window.removeEventListener('resize',resize)}
  },[])
  const close=()=>setModal(null)
  return <main ref={root} className="tw-root" data-ready={ready} data-models={status.assets||"loading"} data-walking={walking} data-location={activeId} data-view={status.view||"outside"} data-perspective={status.perspective||"third"} data-pose={templePose({bowing:bow,meditating,ritual})} data-position={status.position.x.toFixed(1)+","+status.position.z.toFixed(1)}>
    <SeoTag title="Chùa Tam Sở 3D — Dạo 23 khu, dâng hương và tĩnh tâm | Tam Sở" description="Bước vào Chùa Tam Sở 3D: 23 khu liên thông từ Cổng Tam Quan, Chánh Điện tới hồ sen và vườn thiền. Di chuyển, dâng hương, lời nguyện và xin xăm. Công trình hư cấu." path="/di-chua" breadcrumb={[{name:'Trang chủ',path:'/'},{name:'Đi chùa'}]}/>
    <TempleWorld ref={world} litIds={litIds} meditating={meditating} bowing={bow} ritual={ritual} paused={!!modal} onMove={stopPose} quality={quality} appearance={online.appearance} peers={online.peers} onPresence={online.update} onArrive={arrive} onStatus={handleStatus} onReady={()=>setReady(true)} onError={()=>{setReady(true);setFailed(true)}}/>
    <header className="tw-header">
      <Link to="/" className="tw-brand" aria-label="Chùa Tam Sở · Về trang chủ"><Logo size={28}/><span><b><span className="tw-brand-full">Chùa Tam Sở</span><span className="tw-brand-short">Tam Sở</span></b><small>MỘT CHỐN AN YÊN</small></span></Link>
      <nav className="tw-header-nav" aria-label="Điều khiển chùa"><button className={mapOpen?'is-active':''} onClick={()=>setMapOpen(v=>!v)} aria-label="Bản đồ 23" title="Bản đồ 23 khu" aria-expanded={mapOpen} aria-controls="temple-place-panel"><TempleActionIcon type="map"/><span className="tw-nav-label">Bản đồ</span><span className="tw-count">23</span></button><button className="tw-nav-history" onClick={openHistory} aria-label="Lịch sử" title="Lịch sử hành lễ"><TempleActionIcon type="history"/><span className="tw-nav-label">Lịch sử</span></button><button className="tw-nav-sound" onClick={toggleSound} aria-label={sound?'Tắt tiếng':'Bật tiếng'} title={sound?'Tắt tiếng':'Bật tiếng'} aria-pressed={sound}><TempleActionIcon type={sound?'sound':'muted'}/><span className="tw-nav-label">{sound?'Tắt tiếng':'Bật tiếng'}</span></button><button className="tw-nav-people" onClick={()=>{setVisitorDraft(online.name);setModal('visitors')}} aria-label={onlineLabel} title={onlineLabel}><TempleActionIcon type="people"/><span className="tw-online-count">{online.phase==='online'?online.count:'·'}</span><span className="tw-nav-label">online</span></button><TempleOptions onCharacter={()=>{setVisitorDraft(online.name);setModal('visitors')}} onHelp={()=>setModal('help')} onClassic={onClassic} onCredits={()=>setModal('credits')} onHistory={openHistory} onSound={toggleSound} sound={sound}/><Link className="tw-home-link" to="/" title="Về trang chủ"><TempleActionIcon type="home"/><span>Trang chủ</span></Link></nav>
    </header>
    <section className={"tw-intro"+(activeId!=="cong-tam-quan"||walking?" is-away":"")} aria-label="Giới thiệu không gian"><span className="tw-eyebrow">ĐẠI TỰ TÂM LINH · 3D</span><h1>Dạo chùa, tĩnh tâm.</h1><p><span className="tw-input-desktop">Bấm chuột phải xuống sân để bắt đầu.</span><span className="tw-input-touch">Chạm để đi · Vuốt để nhìn quanh.</span></p></section>
    {status.view&&status.view!=='outside'&&<div className="tw-interior-bar"><div><span>{status.view==='inside'?'BẠN ĐANG Ở BÊN TRONG':'DỪNG CHÂN TẠI'}</span><h2>{status.roomName}</h2></div><button onClick={()=>world.current?.exit()}><TempleActionIcon type="back"/><span>{status.view==='inside'?'Ra sân':'Về khuôn viên'}</span></button></div>}
    <TempleViewControls perspective={status.perspective||'third'} onPerspective={()=>world.current?.togglePerspective()} onZoom={delta=>world.current?.zoom(delta)} onReset={()=>world.current?.reset()} quality={quality} onQuality={()=>setQuality(q=>q==='low'?'standard':'low')} disabled={failed||!ready}/>
    {mapOpen&&<TemplePlacePanel spots={WORLD_SPOTS} activeId={activeId} onGo={go} onClose={()=>setMapOpen(false)} disabled={failed||!ready}><TempleMap activeId={activeId} onGo={go} position={status.position}/></TemplePlacePanel>}
    {!mapOpen&&<button className="tw-open-map" onClick={()=>setMapOpen(true)}><span className="tw-map-symbol">⊞</span><span><b>Khám phá khuôn viên</b><small>23 khu · các lối đi liên thông</small></span><span>↗</span></button>}
    {!ready&&<div className="tw-loading"><div className="tw-loading-ring"/><b>Đang mở cổng chùa…</b><span>Chuẩn bị khuôn viên và 23 khu vực</span></div>}
    {ready&&!failed&&status.assets==='loading'&&<div className="tw-model-status" role="status">Đang tải chi tiết không gian…</div>}
    {status.assets==='partial'&&<div className="tw-model-status" role="status">Một số chi tiết chưa tải được; đang dùng bản dự phòng. <button onClick={()=>window.location.reload()}>Tải lại</button></div>}
    <div className="tw-notice" role="status" aria-live="polite">{notice}</div>
    <section className="tw-place-card" aria-label="Khu vực hiện tại">
      <div className="tw-place-copy"><span className="tw-eyebrow">{walking?'ĐANG DẠO BƯỚC TỚI':'BẠN ĐANG Ở'}</span><h2>{walking?(status.destination||'Lối đi trong chùa'):loc.ten}</h2><p>{walking?'Theo lối sân gạch, đi chậm giữa những khoảng xanh.':loc.moTa}</p></div>
      <div className="tw-pose-actions" role="group" aria-label="Tư thế nhân vật"><button className={meditating?'is-active':''} disabled={walking||!ready||failed||!!bow} aria-pressed={meditating} aria-label={meditating?'Đứng dậy':'Ngồi thiền'} onClick={()=>meditating?stopPose():setModal('meditate')}><TempleActionIcon type="meditate"/><span>{meditating?'Đứng dậy':'Ngồi thiền'}</span>{meditating&&<small>{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</small>}</button><button className={bow?'is-active':''} disabled={walking||!ready||failed||meditating} aria-pressed={!!bow} aria-label={bow?'Dừng lễ Phật':'Lễ Phật'} onClick={bowHere}><TempleActionIcon type="bow"/><span>{bow?'Dừng lạy':'Lễ Phật'}</span>{bow&&<small>{bowFrame(status.bowProgress||0).number}/3</small>}</button></div>
      <div className="tw-actions" role="group" aria-label="Hành lễ tại khu vực">
        {loc.huong?<button className="tw-primary" disabled={walking||!ready||failed} onClick={()=>actHere('incense')} aria-label={litIds.has(activeId)?'Dâng thêm hương':'Dâng một nén hương'}><TempleActionIcon type="incense"/><span>Dâng hương</span></button>:loc.kind==='bell'?<button className="tw-primary" disabled={walking||!ready||failed} onClick={()=>actHere('bell')}><TempleActionIcon type="bell"/><span>Thỉnh chuông</span></button>:loc.kind==='meditate'?<button className="tw-primary" disabled={walking||!ready||failed} onClick={()=>actHere('meditate')}><TempleActionIcon type="meditate"/><span>Tĩnh tâm</span></button>:<button className="tw-primary" disabled={walking||!ready||failed} onClick={()=>go('chanh-dien')}><TempleActionIcon type="visit"/><span>Tới Chánh Điện</span></button>}
        <button disabled={walking||!ready||failed} onClick={()=>actHere('prayer')}><TempleActionIcon type="prayer"/><span>Lời nguyện</span></button>
        {loc.huong&&<><button disabled={walking||!ready||failed} onClick={()=>actHere('xam')}><TempleActionIcon type="xam"/><span>Xin xăm</span></button><button disabled={walking||!ready||failed} onClick={()=>actHere('keo')}><TempleActionIcon type="keo"/><span>Xin keo</span></button></>}
      </div>
    </section>
    <div className="tw-control-hint" aria-hidden="true"><span>Phải để đi</span><i>·</i><span>Giữ trái để nhìn</span><i>·</i><span>Lăn để zoom</span></div>
    {modal==='visitors'&&<TempleDialog title="Cùng dạo chùa" onClose={close}><p className="tw-online-status" role="status"><i className={online.phase==='online'?'is-connected':''}/>{onlineLabel}</p><p>Mọi người trong cùng khu vực sẽ thấy nhân vật và biệt danh của nhau.</p><fieldset className="tw-avatar-choice"><legend>Nhân vật của bạn</legend><div>{[['male','Nam trẻ'],['female','Nữ trẻ']].map(([value,label])=><button key={value} type="button" aria-pressed={online.appearance===value} onClick={()=>online.chooseAppearance(value)}>{label}</button>)}</div><p>Đồ lam dáng rộng, tay dài và quần suông.</p></fieldset><form className="tw-visitor-form" onSubmit={e=>{e.preventDefault();setVisitorDraft(online.rename(visitorDraft));flash('Đã đổi biệt danh trong chùa.')}}><label htmlFor="temple-visitor-name">Biệt danh của bạn</label><div><input id="temple-visitor-name" value={visitorDraft} onChange={e=>setVisitorDraft(e.target.value)} maxLength={24} autoComplete="off" placeholder="Khách hành hương"/><button className="tw-primary" type="submit">Lưu tên</button></div></form>{online.phase==='online'&&<ul className="tw-visitor-list"><li><b>{online.name} <small>· Bạn</small></b><span>{loc.ten}</span></li>{online.peers.map(p=><li key={p.id}><b>{p.name}</b><span>{(p.space==='courtyard'?'Khuôn viên':spotById(p.space)?.ten||'Đang dạo chùa')+(p.pose==='meditating'?' · Ngồi thiền':p.pose==='bowing'?' · Lễ Phật':'')}</span></li>)}</ul>}{online.phase==='unavailable'&&<p>Phòng chung chưa được cấu hình ở bản này. Bạn vẫn có thể dạo chùa bình thường.</p>}{['offline','reconnecting'].includes(online.phase)&&<p>Kết nối đang gián đoạn. Phòng chung sẽ tự kết nối lại; bạn vẫn có thể di chuyển và hành lễ.</p>}<p className="tw-note">Chỉ biệt danh, mẫu nhân vật, vị trí và tư thế được chia sẻ khi bạn ở chùa 3D. Lời nguyện, lịch sử hành lễ và thông tin tài khoản vẫn riêng tư. Mỗi tab là một khách; khi đông, cảnh hiển thị tối đa 24 khách gần bạn.</p></TempleDialog>}
    {modal==='credits'&&<TempleDialog title="Tác giả và nguồn model 3D" onClose={close}><p>Các model tượng, kiến trúc và nhân vật được sử dụng theo giấy phép riêng của từng tác phẩm, giữ ghi công và quyền tải lại bản chuyển đổi.</p><ul className="tw-asset-credits">{[...TEMPLE_ASSET_CREDITS,...TEMPLE_DETAIL_CREDITS].map(a=><li key={a.file}><a href={a.source} target="_blank" rel="noreferrer">{a.name}</a><span>{a.author} · <a href={a.licenseUrl} target="_blank" rel="noreferrer">{a.license}</a> · <a href={import.meta.env.BASE_URL+'dichua/models/'+(a.downloadFile||a.file)} download>Tải mẫu</a></span></li>)}</ul><p>Bản GLB công khai từ <a href="https://www.artheonmuseum.org/3d" target="_blank" rel="noreferrer">Artheon Museum</a> và <a href="https://tinhtam.kentjuno.com/" target="_blank" rel="noreferrer">Tịnh Tâm · kentjuno</a>. Tam Sở tối ưu các mẫu tượng và phối lại tỷ lệ, bố cục; model kiến trúc giữ texture gốc, nhân vật giữ skeleton và được bổ sung tư thế thiền/lạy. Các bản chuyển đổi CC BY-SA vẫn giữ giấy phép CC BY-SA.</p><p className="tw-note">Các điện là phỏng tác trong không gian hư cấu, kết hợp nhiều phong cách. Tên điện không xác nhận các mẫu quét là bản phục dựng đúng tôn tượng của một ngôi chùa cụ thể.</p><a href={import.meta.env.BASE_URL+'dichua/models/ATTRIBUTION.md'} target="_blank" rel="noreferrer">Xem ghi công đầy đủ và các thay đổi</a></TempleDialog>}
    {modal==='help'&&<TempleDialog title="Dạo chùa theo cách của bạn" onClose={close}><p>Chùa Tam Sở được phát triển từ không gian ảnh hiện có. Cả 23 khu nằm trong cùng một khuôn viên, nối bằng sân và lối đi.</p><ul><li><b>Chạm nền sân</b> để nhân vật đi tới. Chạm một công trình hoặc chọn trong Bản đồ để tới khu đó.</li><li><b>Chuột phải</b> để đi; giữ và rê chuột phải để đổi đích liên tục. <b>Giữ chuột trái</b> để xoay hoặc nhìn quanh khi ở bên trong; cuộn hoặc dùng nút ＋/− để đổi độ gần. Nút ⌂ đưa về toàn cảnh.</li><li><b>Góc nhìn</b>: mặc định góc thứ ba để thấy nhân vật khi đi lại, kể cả trong điện. Bấm nút Góc 3/Góc 1 để đổi sang góc thứ nhất hoặc trở lại góc thứ ba. Lựa chọn được giữ khi chuyển khu. Bấm nền để đi trong điện; giữ chuột trái để nhìn quanh, hoặc chọn Ra sân để trở lại khuôn viên.</li><li><b>Ngồi thiền và lễ Phật</b>: dùng hai nút ngay trên thanh hành lễ. Thiền 1/3/5 phút hoặc lễ ba lạy; bấm Đứng dậy/Dừng lạy để dừng. Chạm nền hoặc chọn khu khác cũng kết thúc tư thế.</li><li><b>Tới nơi rồi hành lễ</b>: dâng hương tại các điện, thỉnh chuông tại Tháp Chuông, ngồi thiền tại Góc Thiền.</li><li><b>Bàn phím</b>: Tab chọn các nút địa điểm, Enter để đi, Escape để đóng hộp thoại.</li><li><b>Trên điện thoại</b>: chạm để đi, vuốt để nhìn quanh; trong điện dùng hai ngón để phóng to/thu nhỏ. Mở Góc nhìn để chọn chế độ Nhẹ.</li><li><b>Máy chạy chậm?</b> Chọn chế độ Nhẹ hoặc Không gian ảnh.</li></ul><p className="tw-note">Lời nguyện và lịch sử lưu trên trình duyệt này, dùng chung với giao diện ảnh. Không gian hư cấu hỗ trợ chiêm nghiệm, không thay việc hành lễ thật.</p></TempleDialog>}
    {modal==='incense'&&<TempleDialog title={'Dâng hương · '+loc.ten} onClose={close}><div className="tw-ritual-censer"><IncenseCenser3D lit={litIds.has(activeId)}/></div><p>Một nén hương tượng trưng, gửi một điều an lành.</p><p className="tw-note">Bạn đã dâng {litCount} nén hương trên trình duyệt này.</p><button className="tw-primary tw-full" onClick={()=>{setRitual(Date.now());clearTimeout(ritualTimer.current);ritualTimer.current=setTimeout(()=>setRitual(null),2800);setLitCount(thapHuong());setLitIds(ids=>new Set([...ids,activeId]));setModal(null);flash('Hương đã được dâng tại '+loc.ten+'.')}}>Thành tâm dâng hương</button></TempleDialog>}
    {modal==='prayer'&&<TempleDialog title="Gửi một lời nguyện an lành" onClose={close}><form onSubmit={e=>{e.preventDefault();if(!prayer.trim())return;const next=addLoiNguyen(prayer);setPrayers(next);setPrayer('');setModal(null);flash('Đã lưu riêng lời nguyện trên trình duyệt của bạn.')}}><label className="tw-field-label" htmlFor="temple-prayer">Điều bạn muốn gửi gắm</label><textarea id="temple-prayer" rows={5} maxLength={500} value={prayer} onChange={e=>setPrayer(e.target.value)} placeholder="Mong cho mình và những người thương…" required/><div className="tw-input-note"><span>Lưu riêng trên trình duyệt · {prayers.length} lời nguyện</span><span>{prayer.length}/500</span></div><button className="tw-primary tw-full" disabled={!prayer.trim()}>Lưu lời nguyện</button></form></TempleDialog>}
    {modal==='xam'&&<TempleDialog title="Xin Xâm Bà" onClose={close}><ShakeXam/></TempleDialog>}
    {modal==='keo'&&<TempleDialog title="Xin keo âm dương" onClose={close}><XinKeo/></TempleDialog>}
    {modal==='meditate'&&<TempleDialog title="Ngồi thiền trong cảnh chùa" onClose={close}><p>Nhân vật sẽ ngồi tại vị trí hiện tại. Bạn có thể đứng dậy bất cứ lúc nào hoặc chạm nền để đi tiếp.</p><div className="tw-duration">{[1,3,5].map(n=><button key={n} aria-pressed={minutes===n} className={minutes===n?'is-active':''} onClick={()=>setMinutes(n)}>{n} phút</button>)}</div><button className="tw-primary tw-full" onClick={startMeditation}>Bắt đầu ngồi thiền</button><p className="tw-note">Thở tự nhiên, nhẹ nhàng; không cần nín thở.</p></TempleDialog>}
    {modal==='history'&&<TempleDialog title="Những điều đã gửi gắm" onClose={close}><p className="tw-note">Dùng chung lịch sử với chùa 2D, chỉ lưu trên trình duyệt này.</p>{[
      {key:'prayers',title:'Lời nguyện',clear:clearLoiNguyen,render:h=>h.text},
      {key:'xam',title:'Xâm Bà',clear:clearXamLichSu,render:h=>{const x=xamBySo(h.so);return 'Xâm số '+h.so+(x?' · '+x.bac+' · '+x.cau[0]:'')}},
      {key:'keo',title:'Xin keo',clear:clearKeoLichSu,render:h=>{const k=keoById(h.id);return k?k.ten+' · '+k.ket:h.id}},
    ].map(section=><section className="tw-history" key={section.key}><div><h3>{section.title} <span>({history[section.key].length})</span></h3>{history[section.key].length>0&&<button onClick={()=>{section.clear();setHistory(h=>({...h,[section.key]:[]}));if(section.key==='prayers')setPrayers([])}}>Xoá lịch sử {section.title.toLowerCase()}</button>}</div>{history[section.key].length?<ul>{history[section.key].map((h,i)=><li key={i}><time>{timeLabel(h.t)}</time><p>{section.render(h)}</p></li>)}</ul>:<p className="tw-note">Chưa có nội dung đã lưu.</p>}</section>)}</TempleDialog>}
  </main>
}
