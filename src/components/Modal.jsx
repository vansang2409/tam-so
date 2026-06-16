import { useEffect } from 'react'

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  if (!open) return null
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-[#0d0803]/75 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-[520px] p-[30px] rounded-[18px] shadow-soft border border-gold/30"
        style={{ background: 'linear-gradient(160deg,#2a1d0d,#34230f)' }}>
        <button onClick={onClose} aria-label="Đóng"
          className="absolute top-3.5 right-4 bg-transparent border-0 text-muted text-[1.6rem] leading-none cursor-pointer">×</button>
        {children}
      </div>
    </div>
  )
}
