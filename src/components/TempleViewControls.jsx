import {useEffect,useRef,useState} from 'react'
import {TempleActionIcon} from './TempleHud.jsx'
export default function TempleViewControls({onZoom,onReset,quality,onQuality,disabled}) {
  const [open,setOpen]=useState(false),ref=useRef(null),trigger=useRef(null)
  useEffect(()=>{
    if(!open)return
    const outside=e=>{if(!ref.current?.contains(e.target))setOpen(false)}
    const escape=e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus()}}
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape)
    return ()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}
  },[open])
  return <div ref={ref} className="tw-view-tools" data-open={open} aria-label="Góc nhìn"><button ref={trigger} className="tw-camera-toggle" aria-label="Góc nhìn" aria-expanded={open} aria-controls="temple-camera-controls" onClick={()=>setOpen(v=>!v)}><TempleActionIcon type="camera"/></button><div id="temple-camera-controls" className="tw-camera-buttons"><button onClick={()=>onZoom(-7)} disabled={disabled} aria-label="Phóng to" title="Phóng to"><TempleActionIcon type="plus"/><span>Gần hơn</span></button><button onClick={()=>onZoom(7)} disabled={disabled} aria-label="Thu nhỏ" title="Thu nhỏ"><TempleActionIcon type="minus"/><span>Xa hơn</span></button><button onClick={()=>{onReset();setOpen(false)}} disabled={disabled} aria-label="Xem toàn khuôn viên" title="Xem toàn khuôn viên"><TempleActionIcon type="overview"/><span>Toàn cảnh</span></button><button onClick={onQuality} aria-pressed={quality==='low'} aria-label={quality==='low'?'Bật chất lượng tiêu chuẩn':'Bật chế độ nhẹ'} title={quality==='low'?'Đang ở chế độ nhẹ · Bấm để tăng độ nét':'Giảm độ nét để máy chạy nhẹ hơn'}><TempleActionIcon type="quality"/><span>{quality==='low'?'Chế độ nhẹ':'Độ nét'}</span></button></div></div>
}
