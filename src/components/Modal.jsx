import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, children }) {
  const dialogRef = useRef(null)
  const prevFocus = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement
    const onKey = e => { if (e.key === 'Escape') onCloseRef.current() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => { dialogRef.current && dialogRef.current.focus() }, 0)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      clearTimeout(t)
      if (prevFocus.current && prevFocus.current.focus) prevFocus.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-3 sm:p-5 overflow-y-auto bg-[#0d0803]/75 backdrop-blur-sm animate-fade">
      <div ref={dialogRef} role="dialog" aria-modal="true" tabIndex={-1}
        className="relative w-full max-w-[520px] my-auto p-5 sm:p-[30px] rounded-[18px] shadow-soft border border-gold/30 max-h-[92vh] overflow-y-auto focus:outline-none"
        style={{ background: 'linear-gradient(160deg,#2a1d0d,#34230f)' }}>
        <button onClick={onClose} aria-label="Đóng"
          className="sticky top-0 float-right -mt-1 bg-transparent border-0 text-muted text-[1.6rem] leading-none cursor-pointer">×</button>
        {children}
      </div>
    </div>
  )
}
