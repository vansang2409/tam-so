import {useEffect,useRef,useState} from 'react'
const compactQuery='(max-width:640px), (max-width:1000px) and (max-height:500px)'
const normalize=value=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').trim()
export default function TemplePlacePanel({spots,activeId,onGo,onClose,disabled,children}) {
  const [compact,setCompact]=useState(()=>window.matchMedia(compactQuery).matches)
  const [tab,setTab]=useState('list'),[query,setQuery]=useState(''),ref=useRef(null),close=useRef(null)
  const filtered=spots.filter(s=>normalize(s.ten).includes(normalize(query)))
  useEffect(()=>{
    const media=window.matchMedia(compactQuery),resize=()=>setCompact(media.matches);media.addEventListener('change',resize)
    const opener=document.activeElement;close.current?.focus({preventScroll:true})
    const escape=e=>{if(e.key==='Escape'){e.preventDefault();onClose()}}
    document.addEventListener('keydown',escape)
    return ()=>{media.removeEventListener('change',resize);document.removeEventListener('keydown',escape);if(opener?.isConnected)opener.focus({preventScroll:true})}
  },[])
  const trap=e=>{
    if(e.key!=='Tab'||!compact)return
    const els=[...ref.current.querySelectorAll('button:not(:disabled),input')].filter(el=>el.getClientRects().length),first=els[0],last=els.at(-1)
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
  }
  return <><button className="tw-map-backdrop" aria-label="Đóng bảng khu vực" tabIndex={-1} onClick={onClose}/><aside ref={ref} id="temple-place-panel" className="tw-places" data-map-tab={tab} role={compact?'dialog':undefined} aria-modal={compact||undefined} aria-label="Bản đồ chùa" onKeyDown={trap}><div className="tw-sheet-grip" aria-hidden="true"/><div className="tw-place-heading"><div><span className="tw-eyebrow">KHUÔN VIÊN LIỀN MẠCH</span><h2>23 chốn dừng chân</h2></div><button ref={close} aria-label="Đóng bản đồ" onClick={onClose}>×</button></div><div className="tw-map-tabs" role="group" aria-label="Cách xem khu vực"><button aria-pressed={tab==='list'} onClick={()=>setTab('list')}>Danh sách</button><button aria-pressed={tab==='map'} onClick={()=>setTab('map')}>Sơ đồ</button></div><div className="tw-map-search"><label className="tw-sr-only" htmlFor="temple-place-search">Tìm khu vực</label><input id="temple-place-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm điện, vườn, nhà…" autoComplete="off"/></div>{children}<p className="tw-map-hint">Chọn một khu để nhân vật tự đi tới.</p><nav aria-label="Danh sách khu vực">{filtered.map(s=><button key={s.id} onClick={()=>onGo(s.id)} disabled={disabled} aria-current={activeId===s.id?'location':undefined}><span>{String(spots.indexOf(s)+1).padStart(2,'0')}</span>{s.ten}<i>↗</i></button>)}</nav>{!filtered.length&&<p className="tw-map-empty" role="status">Chưa tìm thấy khu này. Bạn thử tên khác nhé.</p>}</aside></>
}
