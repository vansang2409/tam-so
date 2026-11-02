import { useEffect, useRef, useState } from 'react'

const paths={
  person:<><circle cx="12" cy="5" r="3"/><path d="M6 21v-4a6 6 0 0 1 12 0v4M9 13v8m6-8v8"/></>,
  eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  camera:<><path d="M4 7h16M4 17h16M8 4v6m8 4v6"/><circle cx="8" cy="7" r="2"/><circle cx="16" cy="17" r="2"/></>,
  people:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/></>,
  map:<><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z"/><path d="M9 3v16m6-14v16"/></>,
  history:<><path d="M3 5v5h5"/><path d="M3.6 10a9 9 0 1 1 1.5 8M12 7v5l3 2"/></>,
  sound:<><path d="m11 4-5 4H3v8h3l5 4V4Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></>,
  muted:<><path d="m11 4-5 4H3v8h3l5 4V4Z"/><path d="m16 9 5 6m0-6-5 6"/></>,
  plus:<path d="M5 12h14M12 5v14"/>,
  minus:<path d="M5 12h14"/>,
  overview:<><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/></>,
  quality:<><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/></>,
  back:<path d="m10 5-7 7 7 7M3 12h18"/>,
  home:<><path d="m3 10 9-7 9 7M5 9v12h14V9m-9 12v-7h4v7"/></>,
  incense:<><path d="M5 14h14l-2 5H7l-2-5Z"/><path d="M8 14V8m4 6V5m4 9V8M9 21h6"/><path d="M8 5c-2-2 2-2 0-4m8 4c-2-2 2-2 0-4"/></>,
  prayer:<><path d="M6 3h9l3 3v15H6V3Z"/><path d="M14 3v5h4M9 12h6m-6 4h4"/></>,
  xam:<><path d="M6 10h12l-1 11H7L6 10Z"/><path d="m8 10-1-7m5 7V1m4 9 2-7M10 14h4m-4 3h4"/></>,
  keo:<><path d="M10 3C4 5 2 12 5 16c2 2 5 1 6-1l-1-12Z"/><path d="M14 21c6-2 8-9 5-13-2-2-5-1-6 1l1 12Z"/></>,
  bell:<><path d="M6 16V9a6 6 0 0 1 12 0v7l2 2H4l2-2Z"/><path d="M10 21h4M12 1v2"/></>,
  meditate:<><path d="M9 10a3 3 0 1 1 6 0M7 20c-6 0-4-4 0-4l2-3h6l2 3c4 0 6 4 0 4H7Z"/><path d="m10 16 2 2 2-2"/></>,
  visit:<><path d="m3 9 9-6 9 6H3Zm2 2v9m5-9v9m4-9v9m5-9v9M3 21h18"/></>,
}
export function TempleActionIcon({type}) {
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]||paths.visit}</svg>
}
export function TempleOptions({onHelp,onClassic,onCredits,onHistory,onSound,sound}) {
  const [open,setOpen]=useState(false),ref=useRef(null),trigger=useRef(null)
  useEffect(()=>{
    if(!open)return
    const outside=e=>{if(!ref.current?.contains(e.target))setOpen(false)}
    const escape=e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus()}}
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape)
    return ()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}
  },[open])
  const choose=handler=>{setOpen(false);trigger.current?.focus();handler()}
  return <div className="tw-options" ref={ref}>
    <button ref={trigger} type="button" className="tw-options-trigger" aria-label="Tuỳ chọn không gian" aria-expanded={open} aria-controls="temple-options" onClick={()=>setOpen(v=>!v)}><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg></button>
    {open&&<nav id="temple-options" className="tw-options-panel" aria-label="Tuỳ chọn không gian"><button className="tw-options-mobile" onClick={()=>choose(onHistory)}>Lịch sử hành lễ</button><button className="tw-options-mobile" onClick={()=>choose(onSound)}>{sound?'Tắt âm thanh':'Bật âm thanh'}</button><button onClick={()=>choose(onHelp)}>Hướng dẫn di chuyển</button><button onClick={()=>choose(onClassic)}>Không gian ảnh ↗</button><button onClick={()=>choose(onCredits)}>Ghi công 3D</button><p>Chùa hư cấu · Một không gian chiêm nghiệm</p></nav>}
  </div>
}
