import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SeoTag from '../components/SeoTag.jsx'
import Logo from '../components/Logo.jsx'
import TempleWorld from '../components/TempleWorld.jsx'
import IncenseCenser3D from '../components/IncenseCenser3D.jsx'
import ShakeXam from '../components/ShakeXam.jsx'
import XinKeo from '../components/XinKeo.jsx'
import { WORLD_SPOTS } from '../data/templeWorld.js'
import { TEMPLE_ASSET_CREDITS } from '../data/templeAssetCredits.js'
import { loadLoiNguyen, addLoiNguyen, clearLoiNguyen, countThapHuong, thapHuong,
  loadXamLichSu, clearXamLichSu, xamBySo, loadKeoLichSu, clearKeoLichSu, keoById } from '../data/dichua.js'
import '../styles/temple-world.css'

const Classic=lazy(()=>import('./DiChuaClassic.jsx'))
const spotById=id=>WORLD_SPOTS.find(s=>s.id===id)
const timeLabel=t=>new Date(t).toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
function TempleDialog({title,children,onClose,wide=false}) {
  const ref=useRef(null)
  useEffect(()=>{const el=ref.current;el.showModal();return ()=>el.close()},[])
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
  const world=useRef(null),audio=useRef(null),timer=useRef(null),flashTimer=useRef(null),ritualTimer=useRef(null)
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[mapOpen,setMapOpen]=useState(false)
  const [activeId,setActiveId]=useState('cong-tam-quan'),[modal,setModal]=useState(null)
  const [litIds,setLitIds]=useState(()=>new Set()),[litCount,setLitCount]=useState(()=>countThapHuong())
  const [prayers,setPrayers]=useState(()=>loadLoiNguyen()),[prayer,setPrayer]=useState('')
  const [history,setHistory]=useState({prayers:[],xam:[],keo:[]})
  const [status,setStatus]=useState({moving:false,position:{x:0,z:24.8},near:null})
  const [ritual,setRitual]=useState(null)
  const [notice,setNotice]=useState(''),[sound,setSound]=useState(false),[quality,setQuality]=useState('standard')
  const [minutes,setMinutes]=useState(1),[remaining,setRemaining]=useState(null),[completed,setCompleted]=useState(false)
  const loc=spotById(activeId),walking=status.moving,meditating=remaining!==null&&remaining>0
  useEffect(()=>{document.body.classList.add('tw-lock');return ()=>{document.body.classList.remove('tw-lock');clearInterval(timer.current);clearTimeout(flashTimer.current);clearTimeout(ritualTimer.current);audio.current?.close()}},[])
  useEffect(()=>{if(modal!=='meditate'){clearInterval(timer.current);setRemaining(null);setCompleted(false)}},[modal])
  const flash=message=>{setNotice(message);clearTimeout(flashTimer.current);flashTimer.current=setTimeout(()=>setNotice(''),4200)}
  const go=(id,action=null)=>{
    if(!ready||failed)return
    setMapOpen(false);setStatus(s=>({...s,moving:true,destination:spotById(id).ten}))
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
    if(type==='incense')setModal('incense')
    else if(type==='bell')ringBell()
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
    clearInterval(timer.current);setCompleted(false);setRemaining(minutes*60)
    const end=Date.now()+minutes*60000
    timer.current=setInterval(()=>{const left=Math.max(0,Math.ceil((end-Date.now())/1000));setRemaining(left);if(!left){clearInterval(timer.current);setCompleted(true)}},250)
  }
  const close=()=>setModal(null)
  return <main className="tw-root" data-ready={ready} data-models={status.assets||"loading"} data-walking={walking} data-location={activeId} data-view={status.view||"outside"} data-position={status.position.x.toFixed(1)+","+status.position.z.toFixed(1)}>
    <SeoTag title="Chùa Tam Sở 3D — Dạo 23 khu, dâng hương và tĩnh tâm | Tam Sở" description="Bước vào Chùa Tam Sở 3D: 23 khu liên thông từ Cổng Tam Quan, Chánh Điện tới hồ sen và vườn thiền. Di chuyển, dâng hương, lời nguyện và xin xăm. Công trình hư cấu." path="/di-chua" breadcrumb={[{name:'Trang chủ',path:'/'},{name:'Đi chùa'}]}/>
    <TempleWorld ref={world} litIds={litIds} meditating={meditating} ritual={ritual} paused={!!modal&&modal!=='meditate'} quality={quality} onArrive={arrive} onStatus={handleStatus} onReady={()=>setReady(true)} onError={()=>{setReady(true);setFailed(true)}}/>
    <header className="tw-header">
      <Link to="/" className="tw-brand"><Logo size={32}/><span><b>Chùa Tam Sở</b><small>MỘT CHỐN AN YÊN</small></span></Link>
      <nav aria-label="Điều khiển chùa"><button className={mapOpen?'is-active':''} onClick={()=>setMapOpen(v=>!v)} aria-expanded={mapOpen} aria-controls="temple-place-panel">Bản đồ <span className="tw-count">23</span></button><button onClick={openHistory}>Lịch sử</button><button onClick={toggleSound} aria-pressed={sound}>{sound?'Tắt tiếng':'Bật tiếng'}</button><button className="tw-help-button" onClick={()=>setModal('help')}>Hướng dẫn</button><Link className="tw-home-link" to="/">Trang chủ ↗</Link></nav>
    </header>
    <section className={"tw-intro"+(activeId!=="cong-tam-quan"||walking?" is-away":"")} aria-label="Giới thiệu không gian"><span className="tw-eyebrow">ĐẠI TỰ TÂM LINH · 3D</span><h1>Dạo chùa, tĩnh tâm.</h1><p><span className="tw-input-desktop">Bấm chuột trái xuống sân để bắt đầu.</span><span className="tw-input-touch">Chạm xuống sân để bắt đầu dạo chùa.</span></p></section>
    {status.view&&status.view!=='outside'&&<div className="tw-interior-bar"><div><span>{status.view==='inside'?'BẠN ĐANG Ở BÊN TRONG':'DỪNG CHÂN TẠI'}</span><h2>{status.roomName}</h2></div><button onClick={()=>world.current?.exit()}>← {status.view==='inside'?'Ra sân':'Về khuôn viên'}</button></div>}
    <div className="tw-view-tools" aria-label="Góc nhìn"><button onClick={()=>world.current?.zoom(-7)} disabled={failed||!ready} aria-label="Phóng to">＋</button><button onClick={()=>world.current?.zoom(7)} disabled={failed||!ready} aria-label="Thu nhỏ">−</button><button onClick={()=>world.current?.reset()} disabled={failed||!ready} aria-label="Xem toàn khuôn viên">⌂</button><button onClick={()=>setQuality(q=>q==='low'?'standard':'low')} aria-pressed={quality==='low'} title="Giảm độ nét để máy chạy nhẹ hơn">{quality==='low'?'Nhẹ':'Nét'}</button></div>
    {mapOpen&&<aside id="temple-place-panel" className="tw-places"><div className="tw-place-heading"><div><span className="tw-eyebrow">KHUÔN VIÊN LIỀN MẠCH</span><h2>23 chốn dừng chân</h2></div><button aria-label="Đóng bản đồ" onClick={()=>setMapOpen(false)}>×</button></div><TempleMap activeId={activeId} onGo={go} position={status.position}/><p className="tw-map-hint">Chọn số trên sơ đồ hoặc tên khu bên dưới để đi tới.</p><nav aria-label="Danh sách 23 khu">{WORLD_SPOTS.map((s,i)=><button key={s.id} onClick={()=>go(s.id)} disabled={failed||!ready} aria-current={activeId===s.id?'location':undefined}><span>{String(i+1).padStart(2,'0')}</span>{s.ten}<i>↗</i></button>)}</nav></aside>}
    {!mapOpen&&<button className="tw-open-map" onClick={()=>setMapOpen(true)}><span className="tw-map-symbol">⊞</span><span><b>Khám phá khuôn viên</b><small>23 khu · các lối đi liên thông</small></span><span>↗</span></button>}
    {!ready&&<div className="tw-loading"><div className="tw-loading-ring"/><b>Đang mở cổng chùa…</b><span>Chuẩn bị khuôn viên và 23 khu vực</span></div>}
    {ready&&!failed&&status.assets==='loading'&&<div className="tw-model-status" role="status">Đang hoàn thiện tượng và đồ thờ…</div>}
    {status.assets==='partial'&&<div className="tw-model-status" role="status">Một số mẫu tượng chưa tải được; đang dùng bản dự phòng. <button onClick={()=>window.location.reload()}>Tải lại</button></div>}
    <div className="tw-notice" role="status" aria-live="polite">{notice}</div>
    <section className="tw-place-card" aria-label="Khu vực hiện tại">
      <div className="tw-place-copy"><span className="tw-eyebrow">{walking?'ĐANG DẠO BƯỚC TỚI':'BẠN ĐANG Ở'}</span><h2>{walking?(status.destination||'Lối đi trong chùa'):loc.ten}</h2><p>{walking?'Theo lối sân gạch, đi chậm giữa những khoảng xanh.':loc.moTa}</p></div>
      <div className="tw-actions">
        {loc.huong?<button className="tw-primary" disabled={walking||!ready||failed} onClick={()=>actHere('incense')}>{litIds.has(activeId)?'Dâng thêm hương':'Dâng một nén hương'}</button>:loc.kind==='bell'?<button className="tw-primary" disabled={walking||!ready||failed} onClick={()=>actHere('bell')}>Thỉnh một tiếng chuông</button>:loc.kind==='meditate'?<button className="tw-primary" disabled={walking||!ready||failed} onClick={()=>actHere('meditate')}>Ngồi xuống, tĩnh tâm</button>:<button className="tw-primary" disabled={walking||!ready||failed} onClick={()=>go('chanh-dien')}>Dạo tới Chánh Điện</button>}
        <button disabled={walking||!ready||failed} onClick={()=>actHere('prayer')}>Viết lời nguyện</button>
        {loc.huong&&<><button disabled={walking||!ready||failed} onClick={()=>actHere('xam')}>Xin xăm</button><button disabled={walking||!ready||failed} onClick={()=>actHere('keo')}>Xin keo</button></>}
      </div>
    </section>
    <footer className="tw-footer"><span className="tw-input-desktop">Trái: đi · Giữ phải: nhìn · Lăn chuột: zoom</span><span className="tw-input-touch">Chạm để đi · Vuốt để nhìn · ＋/− để zoom</span><button onClick={onClassic}>Không gian ảnh ↗</button><button onClick={()=>setModal('credits')}>Ghi công 3D</button><span>Chùa hư cấu · Trải nghiệm chiêm nghiệm</span></footer>
    {modal==='credits'&&<TempleDialog title="Tác giả và nguồn mẫu tượng" onClose={close}><p>Các mẫu quét được sử dụng theo giấy phép riêng của từng tác phẩm, giữ ghi công và quyền tải lại bản chuyển đổi.</p><ul className="tw-asset-credits">{TEMPLE_ASSET_CREDITS.map(a=><li key={a.file}><a href={a.source} target="_blank" rel="noreferrer">{a.name}</a><span>{a.author} · <a href={a.licenseUrl} target="_blank" rel="noreferrer">{a.license}</a> · <a href={import.meta.env.BASE_URL+'dichua/models/'+a.file} download>Tải mẫu</a></span></li>)}</ul><p>Bản GLB công khai từ <a href="https://www.artheonmuseum.org/3d" target="_blank" rel="noreferrer">Artheon Museum</a> và <a href="https://tinhtam.kentjuno.com/" target="_blank" rel="noreferrer">Tịnh Tâm · kentjuno</a>. Tam Sở tối ưu lưới, đóng tư thế tĩnh, giữ bề mặt quét và phối lại tỷ lệ, bố cục. Các bản chuyển đổi CC BY-SA vẫn giữ giấy phép CC BY-SA.</p><p className="tw-note">Các điện là phỏng tác trong không gian hư cấu, kết hợp nhiều phong cách. Tên điện không xác nhận các mẫu quét là bản phục dựng đúng tôn tượng của một ngôi chùa cụ thể.</p><a href={import.meta.env.BASE_URL+'dichua/models/ATTRIBUTION.md'} target="_blank" rel="noreferrer">Xem ghi công đầy đủ và các thay đổi</a></TempleDialog>}
    {modal==='help'&&<TempleDialog title="Dạo chùa theo cách của bạn" onClose={close}><p>Chùa Tam Sở được phát triển từ không gian ảnh hiện có. Cả 23 khu nằm trong cùng một khuôn viên, nối bằng sân và lối đi.</p><ul><li><b>Chạm nền sân</b> để nhân vật đi tới. Chạm một công trình hoặc chọn trong Bản đồ để tới khu đó.</li><li><b>Chuột trái</b> để đi; giữ và rê chuột trái để đổi đích liên tục. <b>Giữ chuột phải</b> để xoay hoặc nhìn quanh khi ở bên trong; cuộn hoặc dùng nút ＋/− để đổi độ gần. Nút ⌂ đưa về toàn cảnh.</li><li><b>Bước vào từng khu</b>: góc nhìn chuyển ngang tầm mắt. Bấm nền để đi trong điện; giữ chuột phải để nhìn quanh, hoặc chọn Ra sân để trở lại khuôn viên.</li><li><b>Tới nơi rồi hành lễ</b>: dâng hương tại các điện, thỉnh chuông tại Tháp Chuông, ngồi thiền tại Góc Thiền.</li><li><b>Bàn phím</b>: Tab chọn các nút địa điểm, Enter để đi, Escape để đóng hộp thoại.</li><li><b>Máy chạy chậm?</b> Chọn chế độ Nhẹ hoặc Không gian ảnh.</li></ul><p className="tw-note">Lời nguyện và lịch sử lưu trên trình duyệt này, dùng chung với giao diện ảnh. Không gian hư cấu hỗ trợ chiêm nghiệm, không thay việc hành lễ thật.</p></TempleDialog>}
    {modal==='incense'&&<TempleDialog title={'Dâng hương · '+loc.ten} onClose={close}><div className="tw-ritual-censer"><IncenseCenser3D lit={litIds.has(activeId)}/></div><p>Một nén hương tượng trưng, gửi một điều an lành.</p><p className="tw-note">Bạn đã dâng {litCount} nén hương trên trình duyệt này.</p><button className="tw-primary tw-full" onClick={()=>{setRitual(Date.now());clearTimeout(ritualTimer.current);ritualTimer.current=setTimeout(()=>setRitual(null),2800);setLitCount(thapHuong());setLitIds(ids=>new Set([...ids,activeId]));setModal(null);flash('Hương đã được dâng tại '+loc.ten+'.')}}>Thành tâm dâng hương</button></TempleDialog>}
    {modal==='prayer'&&<TempleDialog title="Gửi một lời nguyện an lành" onClose={close}><form onSubmit={e=>{e.preventDefault();if(!prayer.trim())return;const next=addLoiNguyen(prayer);setPrayers(next);setPrayer('');setModal(null);flash('Đã lưu riêng lời nguyện trên trình duyệt của bạn.')}}><label className="tw-field-label" htmlFor="temple-prayer">Điều bạn muốn gửi gắm</label><textarea id="temple-prayer" rows={5} maxLength={500} value={prayer} onChange={e=>setPrayer(e.target.value)} placeholder="Mong cho mình và những người thương…" required/><div className="tw-input-note"><span>Lưu riêng trên trình duyệt · {prayers.length} lời nguyện</span><span>{prayer.length}/500</span></div><button className="tw-primary tw-full" disabled={!prayer.trim()}>Lưu lời nguyện</button></form></TempleDialog>}
    {modal==='xam'&&<TempleDialog title="Xin Xâm Bà" onClose={close}><ShakeXam/></TempleDialog>}
    {modal==='keo'&&<TempleDialog title="Xin keo âm dương" onClose={close}><XinKeo/></TempleDialog>}
    {modal==='meditate'&&<TempleDialog title="Một khoảng lặng cho mình" onClose={close}><div className={'tw-breath'+(meditating?' is-breathing':'')}><span>{completed?'An yên':meditating?((minutes*60-remaining)%8<4?'Hít vào':'Thở ra'):'Thảnh thơi'}</span></div>{remaining!==null?<><p className="tw-meditation-clock">{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</p><p>{completed?'Cảm ơn bạn đã dành thời gian cho chính mình.':'Thở tự nhiên, nhẹ nhàng; không cần nín thở.'}</p><button className="tw-primary tw-full" onClick={close}>{completed?'Trở về sân chùa':'Dừng phiên thiền'}</button></>:<><p>Chọn thời gian, ngồi thoải mái và thả lỏng vai.</p><div className="tw-duration">{[1,3,5].map(n=><button key={n} aria-pressed={minutes===n} className={minutes===n?'is-active':''} onClick={()=>setMinutes(n)}>{n} phút</button>)}</div><button className="tw-primary tw-full" onClick={startMeditation}>Bắt đầu tĩnh tâm</button></>}</TempleDialog>}
    {modal==='history'&&<TempleDialog title="Những điều đã gửi gắm" onClose={close}><p className="tw-note">Dùng chung lịch sử với chùa 2D, chỉ lưu trên trình duyệt này.</p>{[
      {key:'prayers',title:'Lời nguyện',clear:clearLoiNguyen,render:h=>h.text},
      {key:'xam',title:'Xâm Bà',clear:clearXamLichSu,render:h=>{const x=xamBySo(h.so);return 'Xâm số '+h.so+(x?' · '+x.bac+' · '+x.cau[0]:'')}},
      {key:'keo',title:'Xin keo',clear:clearKeoLichSu,render:h=>{const k=keoById(h.id);return k?k.ten+' · '+k.ket:h.id}},
    ].map(section=><section className="tw-history" key={section.key}><div><h3>{section.title} <span>({history[section.key].length})</span></h3>{history[section.key].length>0&&<button onClick={()=>{section.clear();setHistory(h=>({...h,[section.key]:[]}));if(section.key==='prayers')setPrayers([])}}>Xoá lịch sử {section.title.toLowerCase()}</button>}</div>{history[section.key].length?<ul>{history[section.key].map((h,i)=><li key={i}><time>{timeLabel(h.t)}</time><p>{section.render(h)}</p></li>)}</ul>:<p className="tw-note">Chưa có nội dung đã lưu.</p>}</section>)}</TempleDialog>}
  </main>
}
