import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SeoTag from '../components/SeoTag.jsx'
import Logo from '../components/Logo.jsx'
import {
  NHATHO_SPACES, nhaThoSpaceById, prayerOfDay,
  loadNhaThoNotes, addNhaThoNote, clearNhaThoNotes,
  countNhaThoCandles, lightNhaThoCandle
} from '../data/nhatho.js'

const ntAsset = name => (import.meta.env.BASE_URL || '/') + 'nhatho/' + name

function NhaThoModal({ open, title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => ref.current?.focus(), 0)
    return () => { document.removeEventListener('keydown', onKey); clearTimeout(t) }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="nt-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="nt-dialog" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <button className="nt-dialog-x" type="button" onClick={onClose} aria-label="Đóng">×</button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default function DiNhaTho() {
  const [activeId, setActiveId] = useState('gian-chinh')
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState([])
  const [candles, setCandles] = useState(0)
  const [lit, setLit] = useState(false)
  const [modal, setModal] = useState(null)
  const active = nhaThoSpaceById(activeId) || NHATHO_SPACES[0]

  useEffect(() => {
    document.body.classList.add('nt-lock')
    setNotes(loadNhaThoNotes())
    setCandles(countNhaThoCandles())
    return () => document.body.classList.remove('nt-lock')
  }, [])

  const addNote = () => {
    if (!note.trim()) return
    setNotes(addNhaThoNote(note)); setNote('')
  }
  const lightCandle = () => {
    setCandles(lightNhaThoCandle()); setLit(true)
    setTimeout(() => setLit(false), 2800)
  }
  const clearNotes = () => setNotes(clearNhaThoNotes())
  const fmt = t => new Date(t).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="nt-root">
      <SeoTag title="Đi nhà thờ — không gian chiêm niệm online | Tam Sở"
        description="Đi nhà thờ Tam Sở: không gian nhà thờ online hư cấu để thắp nến tượng trưng, viết lời cầu nguyện riêng tư và chiêm niệm nhẹ nhàng; không thay việc tham dự Thánh lễ thật."
        path="/di-nha-tho" breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: 'Đi nhà thờ' }]} />
      <div className="nt-bg" style={{ backgroundImage: `url(${ntAsset('nha-tho-tam-so.webp')})` }} aria-hidden="true" />
      <picture className="nt-preload" aria-hidden="true"><source srcSet={ntAsset('nha-tho-tam-so.webp')} type="image/webp" /><source srcSet={ntAsset('nha-tho-tam-so.jpg')} type="image/jpeg" /><img src={ntAsset('nha-tho-tam-so.png')} alt="" loading="eager" decoding="async" /></picture>
      <div className="nt-lightfield" aria-hidden="true"><span /><span /><span /></div>

      <header className="nt-header">
        <Link to="/" className="nt-brand" title="Về Tam Sở"><Logo size={34} className="shrink-0" /><span><b>Nhà thờ Tam Sở</b><i>Không gian chiêm niệm online</i></span></Link>
        <nav className="nt-topnav" aria-label="Điều hướng nhà thờ">
          <button type="button" className="is-active">Nhà thờ online</button>
          <button type="button" onClick={() => setModal('about')}>Lưu ý</button>
          <button type="button" onClick={() => setModal('history')}>Lịch sử</button>
          <Link to="/di-chua">Đi chùa</Link><Link to="/">Trang chủ</Link>
        </nav>
      </header>

      <main className="nt-shell">
        <aside className="nt-sidebar" aria-label="Các khu trong nhà thờ">
          <p className="nt-eyebrow">Các khu</p>
          {NHATHO_SPACES.map(space => (
            <button key={space.id} type="button" onClick={() => setActiveId(space.id)} className={'nt-space-btn' + (activeId === space.id ? ' is-active' : '')} style={{ '--tone': space.tone }}>
              <span>{space.icon}</span><b>{space.ten}</b><i>{space.action}</i>
            </button>
          ))}
        </aside>

        <section className="nt-stage" aria-labelledby="nt-title">
          <motion.div key={active.id} className="nt-scene-card" initial={{ opacity: 0, y: 18, rotateX: 4 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: .45, ease: [.2,.8,.2,1] }}>
            <div className="nt-scene-glass" aria-hidden="true" /><div className="nt-orbit" aria-hidden="true"><span /><span /><span /></div>
            <p className="nt-eyebrow">{active.icon} · {active.ten}</p><h1 id="nt-title">{active.title}</h1><p>{active.desc}</p>
            <div className="nt-scene-actions"><button type="button" className="nt-btn nt-btn-primary" onClick={lightCandle}>Thắp một ngọn nến</button><button type="button" className="nt-btn nt-btn-ghost" onClick={() => setModal('about')}>Đọc lưu ý</button></div>
          </motion.div>
          <div className={'nt-candles' + (lit ? ' is-lit' : '')} aria-label={'Đã thắp ' + candles + ' ngọn nến tượng trưng'}>{Array.from({ length: 7 }).map((_, i) => <span key={i} style={{ '--i': i }} />)}</div>
        </section>

        <aside className="nt-panel">
          <div className="nt-card nt-prayer-card"><p className="nt-eyebrow">Lời gợi ý hôm nay</p><blockquote>{prayerOfDay()}</blockquote><p className="nt-note nt-honesty">Không gian này chỉ để chiêm niệm và ghi chú riêng tư, không thay Thánh lễ, bí tích, lời khuyên mục vụ hay việc cầu nguyện thật trong cộng đoàn.</p></div>
          <div className="nt-card"><h2>Viết lời cầu nguyện</h2><textarea value={note} maxLength={520} rows={4} onChange={e => setNote(e.target.value)} placeholder="Viết điều bạn muốn đặt xuống một lát..." /><button type="button" className="nt-btn nt-btn-primary nt-btn-block" onClick={addNote} disabled={!note.trim()}>Lưu riêng trên máy</button><p className="nt-note">{notes.length ? 'Đã lưu ' + notes.length + ' ghi chú riêng tư.' : 'Chỉ lưu trong trình duyệt của bạn.'}</p></div>
          <div className="nt-card nt-mini-grid"><button type="button" onClick={lightCandle}><b>{candles}</b><span>Nến đã thắp</span></button><button type="button" onClick={() => setModal('history')}><b>{notes.length}</b><span>Ghi chú</span></button></div>
        </aside>
      </main>

      <NhaThoModal open={modal === 'about'} onClose={() => setModal(null)} title="Lưu ý về không gian nhà thờ online"><p>Đây là không gian chiêm niệm hư cấu do Tam Sở tự tạo, dùng ảnh AI làm nền và các tương tác lưu cục bộ. Trải nghiệm này không thay Thánh lễ, bí tích, lời khuyên mục vụ hay việc cầu nguyện thật trong cộng đoàn.</p><p>Phần nến và lời cầu nguyện chỉ mang tính tượng trưng. Nếu bạn cần nâng đỡ tinh thần hoặc có việc hệ trọng, hãy tìm người thân, cộng đoàn hoặc linh mục/nhà chuyên môn phù hợp.</p></NhaThoModal>
      <NhaThoModal open={modal === 'history'} onClose={() => setModal(null)} title="Lịch sử riêng tư"><div className="nt-history-head"><p>Ghi chú chỉ nằm trên trình duyệt hiện tại.</p><button type="button" className="nt-btn nt-btn-ghost" onClick={clearNotes} disabled={!notes.length}>Xóa ghi chú</button></div>{notes.length ? <div className="nt-history-list">{notes.map(item => <article key={item.t}><time>{fmt(item.t)}</time><p>{item.text}</p></article>)}</div> : <p className="nt-note">Chưa có ghi chú nào. Một trang giấy trắng, cũng là một kiểu bình an nhỏ.</p>}</NhaThoModal>
    </div>
  )
}
