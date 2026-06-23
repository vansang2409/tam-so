import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SeoTag from '../components/SeoTag.jsx'
import Logo from '../components/Logo.jsx'
import TempleScene from '../components/TempleScene.jsx'
import ShakeXam from '../components/ShakeXam.jsx'
import {
  DICHUA_LOCATIONS, locationById,
  loadLoiNguyen, addLoiNguyen, countThapHuong, thapHuong
} from '../data/dichua.js'

const NAV = ['Trang Chủ', 'Chùa Online', 'Kinh Sách', 'Phật Pháp', 'Sự Kiện', 'Cộng Đồng']

// Ưu tiên ảnh thật public/dichua/<id>.jpg; thiếu/lỗi → tự quay về cảnh SVG (TempleScene)
function SceneView({ loc, className }) {
  const [err, setErr] = useState(false)
  const src = (import.meta.env.BASE_URL || '/') + 'dichua/' + loc.id + '.jpg'
  if (err) return <TempleScene scene={loc.scene} tone={loc.tone} className={className} />
  return <img src={src} alt={'Cảnh ' + loc.ten + ' — Chùa Tam Sở'} className={className} loading="lazy" onError={() => setErr(true)} />
}

function DcModal({ open, onClose, title, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => ref.current && ref.current.focus(), 0)
    return () => { document.removeEventListener('keydown', onKey); clearTimeout(t) }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="dc-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="dc-dialog" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <button className="dc-dialog-x" aria-label="Đóng" onClick={onClose}>×</button>
        {title && <h3 className="dc-dialog-title">{title}</h3>}
        {children}
      </div>
    </div>
  )
}

export default function DiChua() {
  const [activeId, setActiveId] = useState('chanh-dien')
  const [zoom, setZoom] = useState(1)
  const [showInfo, setShowInfo] = useState(true)
  const [prayer, setPrayer] = useState('')
  const [prayerCount, setPrayerCount] = useState(0)
  const [sentFlash, setSentFlash] = useState(false)
  const [litCount, setLitCount] = useState(0)
  const [litFlash, setLitFlash] = useState(false)
  const [igniting, setIgniting] = useState(false)
  const [litLocs, setLitLocs] = useState({})
  const [modal, setModal] = useState(null) // 'help' | 'congduc' | 'xam' | 'soon'

  useEffect(() => { setPrayerCount(loadLoiNguyen().length); setLitCount(countThapHuong()) }, [])
  useEffect(() => { document.body.classList.add('dc-lock'); return () => document.body.classList.remove('dc-lock') }, [])

  const idx = DICHUA_LOCATIONS.findIndex(l => l.id === activeId)
  const loc = locationById(activeId) || DICHUA_LOCATIONS[0]
  const go = dir => { setActiveId(DICHUA_LOCATIONS[(idx + dir + DICHUA_LOCATIONS.length) % DICHUA_LOCATIONS.length].id); setZoom(1) }
  const canHuong = !!loc.huong
  const huongPlaces = DICHUA_LOCATIONS.filter(l => l.huong)
  const sceneLit = canHuong && !!litLocs[activeId]

  const sendPrayer = () => {
    if (!prayer.trim()) return
    setPrayerCount(addLoiNguyen(prayer).length); setPrayer(''); setSentFlash(true)
    setTimeout(() => setSentFlash(false), 2400)
  }
  const doThapHuong = () => {
    if (!canHuong) return
    setLitCount(thapHuong()); setLitFlash(true); setIgniting(true)
    setLitLocs(prev => ({ ...prev, [activeId]: true }))
    setTimeout(() => setLitFlash(false), 2200)
    setTimeout(() => setIgniting(false), 1300)
  }

  return (
    <div className="dc-root">
      <SeoTag title="Đi Chùa — Chùa Tam Sở (không gian tâm linh online) | Tam Sở"
        description="Chùa Tam Sở — không gian chùa online (hư cấu): dạo Cổng Tam Quan, Chánh Điện, Tháp Chuông, vườn Lâm Tỳ Ni; thắp hương, viết lời nguyện và lắc ống xin xăm. Trải nghiệm tham khảo, không thay việc hành lễ thật."
        path="/di-chua" breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: 'Đi chùa' }]} />

      {/* HEADER */}
      <header className="dc-header">
        <Link to="/" className="dc-brand" title="Về Tam Sở">
          <Logo size={34} className="shrink-0" />
          <span className="dc-brand-txt"><b>Chùa Tam Sở</b><i>Không gian tâm linh online</i></span>
        </Link>
        <nav className="dc-nav">
          {NAV.map(n => n === 'Trang Chủ'
            ? <Link key={n} to="/" className="dc-nav-link">{n}</Link>
            : <button key={n} type="button" onClick={() => n !== 'Chùa Online' && setModal('soon')}
                className={'dc-nav-link' + (n === 'Chùa Online' ? ' is-active' : '')}>{n}</button>)}
        </nav>
        <div className="dc-head-right">
          <button className="dc-icon-btn" aria-label="Tìm kiếm" onClick={() => setModal('soon')}>🔍</button>
          <button className="dc-icon-btn" aria-label="Thông báo" onClick={() => setModal('soon')}>🔔</button>
          <Link to="/ho-so" className="dc-user" title="Hồ sơ">
            <span className="dc-avatar">P</span>
            <span className="dc-user-txt"><b>Phật Tử</b><i>Hồ Sơ</i></span>
          </Link>
        </div>
      </header>

      <div className="dc-body">
        {/* SIDEBAR */}
        <aside className="dc-sidebar">
          <nav className="dc-side-list">
            {DICHUA_LOCATIONS.map(l => (
              <button key={l.id} type="button" onClick={() => { setActiveId(l.id); setZoom(1) }}
                className={'dc-side-item' + (l.id === activeId ? ' is-active' : '')}>
                <span className="dc-side-ic" aria-hidden="true">{l.icon}</span>
                <span>{l.ten}</span>
              </button>
            ))}
          </nav>
          <div className="dc-side-foot">
            <button type="button" className="dc-btn dc-btn-gold" onClick={() => setModal('congduc')}>◈ Công Đức</button>
            <button type="button" className="dc-btn dc-btn-ghost" onClick={() => setModal('help')}>ⓘ Hướng Dẫn</button>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <div className="dc-stage">
          <motion.div key={activeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
            className="dc-scene" style={{ transform: `scale(${zoom})` }}>
            <SceneView loc={loc} className="dc-scene-svg" />
          </motion.div>

          <div className="dc-sign">{loc.bienHieu}</div>

          {sceneLit && (
            <div className="dc-scene-smoke" aria-hidden="true"><span /><span /><span /><span /></div>
          )}

          {showInfo && (
            <div className="dc-caption">
              <div className="dc-caption-kicker">{loc.icon} Đang ở</div>
              <div className="dc-caption-title">{loc.ten}</div>
              <p className="dc-caption-desc">{loc.moTa}</p>
            </div>
          )}

          <div className="dc-ctrl-row">
            <button className="dc-ctrl" aria-label="Hiện mô tả" onClick={() => setShowInfo(true)}>↑</button>
            <button className="dc-ctrl" aria-label="Khu trước" onClick={() => go(-1)}>←</button>
            <button className="dc-ctrl" aria-label="Ẩn mô tả" onClick={() => setShowInfo(false)}>↓</button>
            <button className="dc-ctrl" aria-label="Khu sau" onClick={() => go(1)}>→</button>
            <button className="dc-ctrl" aria-label="Phóng to" onClick={() => setZoom(z => Math.min(1.4, +(z + 0.1).toFixed(2)))}>＋</button>
            <button className="dc-ctrl" aria-label="Thu nhỏ / về mặc định" onClick={() => setZoom(z => Math.max(1, +(z - 0.1).toFixed(2)))}>－</button>
          </div>
          <p className="dc-stage-hint">🖱️ Mũi tên đổi khu · ＋－ phóng to · cảnh do Tam Sở tự vẽ (SVG), không phải ảnh chụp</p>
        </div>

        {/* RIGHT PANEL */}
        <aside className="dc-right">
          <div className="dc-card">
            <div className="dc-card-title">Lời Cầu Nguyện</div>
            <textarea className="dc-textarea" rows={2} maxLength={500} value={prayer}
              onChange={e => setPrayer(e.target.value)} placeholder="Viết lời nguyện của bạn…" />
            <div className="dc-pray-icon" aria-hidden="true">🙏</div>
            <button type="button" className="dc-btn dc-btn-gold dc-btn-block" onClick={sendPrayer} disabled={!prayer.trim()}>Gửi Lời Nguyện</button>
            <p className="dc-card-note">{sentFlash ? '✓ Đã ghi nhận lời nguyện của bạn.' : (prayerCount > 0 ? 'Bạn đã gửi ' + prayerCount + ' lời nguyện (lưu riêng trên máy).' : 'Lưu riêng tư trong trình duyệt của bạn.')}</p>
          </div>

          <div className="dc-card">
            <div className="dc-card-title">Thắp Hương Online</div>
            {canHuong ? (
              <>
                <div className={'dc-censer' + ((litLocs[activeId] || igniting) ? ' is-lit' : '') + (igniting ? ' is-igniting' : '')} aria-hidden="true">
                  <span className="dc-flame" />
                  <span className="dc-smoke" /><span className="dc-smoke" /><span className="dc-smoke" />
                  <span className="dc-incense" /><span className="dc-incense" /><span className="dc-incense" />
                  <div className="dc-pot"><i className="dc-pot-h dc-pot-h-l" /><i className="dc-pot-h dc-pot-h-r" /><i className="dc-pot-leg" style={{ left: '14px' }} /><i className="dc-pot-leg" style={{ right: '14px' }} /></div>
                </div>
                <button type="button" className="dc-btn dc-btn-gold dc-btn-block" onClick={doThapHuong} disabled={igniting}>{igniting ? '🔥 Đang thắp…' : (litLocs[activeId] ? 'Thắp thêm một nén' : 'Thắp Hương tại ' + loc.ten)}</button>
                <p className="dc-card-note">{litFlash ? '🔥 Một nén hương vừa được thắp tại ' + loc.ten + '.' : (litCount > 0 ? 'Đã thắp tổng ' + litCount + ' nén (tượng trưng).' : 'Chạm để thắp một nén — cử chỉ chiêm nghiệm, không thay hành lễ thật.')}</p>
              </>
            ) : (
              <>
                <p className="dc-card-desc">Khu này không có hương án. Mời bạn tới nơi có thể thắp hương:</p>
                <div className="dc-huong-places">
                  {huongPlaces.map(h => (
                    <button key={h.id} type="button" className="dc-chip" onClick={() => { setActiveId(h.id); setZoom(1) }}>{h.icon} {h.ten}</button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="dc-card">
            <div className="dc-card-title">Xin Xăm</div>
            <p className="dc-card-desc">Lắc ống xăm để xin một quẻ — 16 thẻ, diễn giải tham khảo dân gian.</p>
            <button type="button" className="dc-btn dc-btn-gold dc-btn-block" onClick={() => setModal('xam')}>🎋 Lắc Xin Xăm</button>
          </div>

          <div className="dc-card">
            <div className="dc-card-title">Công Đức</div>
            <p className="dc-card-desc">Tùy hỷ công đức xây dựng và hoằng pháp.</p>
            <button type="button" className="dc-btn dc-btn-ghost dc-btn-block" onClick={() => setModal('congduc')}>Công Đức Ngay</button>
          </div>
        </aside>
      </div>

      {/* SLIDER */}
      <div className="dc-slider">
        {DICHUA_LOCATIONS.map(l => (
          <button key={l.id} type="button" onClick={() => { setActiveId(l.id); setZoom(1) }}
            className={'dc-thumb' + (l.id === activeId ? ' is-active' : '')} title={l.ten}>
            <SceneView loc={l} className="dc-thumb-svg" />
            <span className="dc-thumb-label">{l.ten}</span>
          </button>
        ))}
      </div>

      {/* OVERLAYS */}
      <DcModal open={modal === 'help'} onClose={() => setModal(null)} title="Hướng Dẫn">
        <ul className="dc-help-list">
          <li><b>←  →</b> : chuyển khu trước / sau</li>
          <li><b>↑  ↓</b> : hiện / ẩn mô tả khu</li>
          <li><b>＋  －</b> : phóng to / thu nhỏ khung cảnh</li>
          <li><b>Sidebar trái</b> hoặc <b>dải ảnh dưới</b> : chọn nhanh một khu</li>
          <li><b>Lời Cầu Nguyện</b> : viết & lưu riêng trên máy bạn</li>
          <li><b>Thắp Hương</b> : cử chỉ tượng trưng</li>
          <li><b>Xin Xăm</b> : <b>lắc ống xăm</b> (kéo qua lại hoặc lắc điện thoại) đến khi que rơi ra</li>
        </ul>
      </DcModal>

      <DcModal open={modal === 'congduc'} onClose={() => setModal(null)} title="◈ Công Đức">
        <p className="leading-relaxed">Chùa Tam Sở <b>chưa có</b> hình thức cúng dường / công đức thật. Tính năng này cần một cổng thanh toán minh bạch và xác minh rõ ràng, nên Tam Sở chưa triển khai.</p>
        <p className="dc-card-note" style={{ marginTop: 10 }}>Chúng tôi ưu tiên hoàn thiện trải nghiệm thật (thắp hương, lời nguyện, xin xăm) trước khi thêm bất kỳ tính năng liên quan đến tiền. Sẽ không bao giờ có nút quyên góp giả ở đây.</p>
      </DcModal>

      <DcModal open={modal === 'xam'} onClose={() => setModal(null)} title="🎋 Xin Xăm — hãy lắc ống">
        <ShakeXam />
      </DcModal>

      <DcModal open={modal === 'soon'} onClose={() => setModal(null)} title="Đang phát triển">
        <p className="leading-relaxed">Khu vực này (Kinh Sách / Phật Pháp / Sự Kiện / Cộng Đồng, tìm kiếm, thông báo) đang được xây dựng. Hiện <b>Chùa Online</b> là phần đã mở — mời bạn dạo các khu trong khuôn viên.</p>
      </DcModal>
    </div>
  )
}
