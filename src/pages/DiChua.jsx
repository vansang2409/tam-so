import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SeoTag from '../components/SeoTag.jsx'
import Logo from '../components/Logo.jsx'
import TempleScene from '../components/TempleScene.jsx'
import TempleScene3D from '../components/TempleScene3D.jsx'
import IncenseCenser3D from '../components/IncenseCenser3D.jsx'
import ShakeXam from '../components/ShakeXam.jsx'
import {
  DICHUA_LOCATIONS, locationById,
  loadLoiNguyen, addLoiNguyen, clearLoiNguyen, countThapHuong, thapHuong,
  loadXamLichSu, clearXamLichSu, xamBySo
} from '../data/dichua.js'

const NAV = ['Trang Chủ', 'Chùa Online', 'Kinh Sách', 'Phật Pháp', 'Sự Kiện', 'Cộng Đồng']
const dcAsset = name => (import.meta.env.BASE_URL || '/') + 'dichua/' + name
const sceneImage = (loc, ext) => dcAsset(loc.id + '.' + ext)

// Uu tien anh WebP; thieu/loi -> fallback JPG roi tu quay ve canh SVG (TempleScene).
function SceneView({ loc, className, loading = 'lazy' }) {
  const [err, setErr] = useState(false)
  if (err) return <TempleScene scene={loc.scene} tone={loc.tone} className={className} />
  return (
    <picture>
      <source srcSet={sceneImage(loc, 'webp')} type="image/webp" />
      <img src={sceneImage(loc, 'jpg')} alt={'Cảnh ' + loc.ten + ' — Chùa Tam Sở'} className={className} loading={loading} decoding="async" onError={() => setErr(true)} />
    </picture>
  )
}

function DcModal({ open, onClose, title, children, bgImage }) {
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
        {bgImage && <div className="dc-dialog-bg" style={{ backgroundImage: `url(${bgImage})` }} aria-hidden="true" />}
        <div className="dc-dialog-content">
          <button className="dc-dialog-x" aria-label="Đóng" onClick={onClose}>×</button>
          {title && <h3 className="dc-dialog-title">{title}</h3>}
          {children}
        </div>
      </div>
    </div>
  )
}

export default function DiChua() {
  const [activeId, setActiveId] = useState('chanh-dien')
  const [zoom, setZoom] = useState(1)
  const [prayer, setPrayer] = useState('')
  const [prayerCount, setPrayerCount] = useState(0)
  const [sentFlash, setSentFlash] = useState(false)
  const [litCount, setLitCount] = useState(0)
  const [litFlash, setLitFlash] = useState(false)
  const [igniting, setIgniting] = useState(false)
  const [litLocs, setLitLocs] = useState({})
  const [modal, setModal] = useState(null) // 'help' | 'congduc' | 'xam' | 'soon' | 'lichsu'
  const [lichSuLN, setLichSuLN] = useState([])
  const [lichSuXam, setLichSuXam] = useState([])
  const huongTimers = useRef([])

  useEffect(() => { setPrayerCount(loadLoiNguyen().length); setLitCount(countThapHuong()) }, [])
  useEffect(() => { if (modal === 'lichsu') { setLichSuLN(loadLoiNguyen()); setLichSuXam(loadXamLichSu()) } }, [modal])
  useEffect(() => { document.body.classList.add('dc-lock'); return () => document.body.classList.remove('dc-lock') }, [])
  useEffect(() => () => { huongTimers.current.forEach(clearTimeout) }, [])

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
  const onClearLN = () => { setLichSuLN(clearLoiNguyen()); setPrayerCount(0) }
  const onClearXam = () => { setLichSuXam(clearXamLichSu()) }
  const fmtT = t => new Date(t).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  const clearHuongTimers = () => { huongTimers.current.forEach(clearTimeout); huongTimers.current = [] }
  const doThapHuong = () => {
    if (!canHuong || igniting) return
    clearHuongTimers()
    setIgniting(true); setLitFlash(false)
    huongTimers.current = [
      setTimeout(() => {
        setLitCount(thapHuong()); setLitLocs(prev => ({ ...prev, [activeId]: true })); setLitFlash(true)
      }, 520),
      setTimeout(() => setIgniting(false), 1500),
      setTimeout(() => setLitFlash(false), 3400)
    ]
  }

  return (
    <div className="dc-root">
      <div className="dc-page-bg" style={{ backgroundImage: `url(${sceneImage(loc, 'webp')})` }} aria-hidden="true" />
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
                <SceneView loc={l} className="dc-side-thumb" />
                <span className="dc-side-meta">
                  <span className="dc-side-name">{l.ten}</span>
                  <span className="dc-side-kicker">{l.bienHieu}</span>
                </span>
              </button>
            ))}
          </nav>
          <div className="dc-side-foot">
            <button type="button" className="dc-btn dc-btn-gold" onClick={() => setModal('congduc')}>◈ Công Đức</button>
            <button type="button" className="dc-btn dc-btn-ghost" onClick={() => setModal('lichsu')}>📜 Lịch Sử Của Bạn</button>
            <button type="button" className="dc-btn dc-btn-ghost" onClick={() => setModal('help')}>ⓘ Hướng Dẫn</button>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <div className="dc-stage">
          <motion.div key={activeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
            className="dc-scene dc-scene-3d">
            <TempleScene3D loc={loc} zoom={zoom} lit={sceneLit} bgImage={sceneImage(loc, 'webp')} className="dc-scene-webgl" />
          </motion.div>

          <div className="dc-sign">{loc.bienHieu}</div>

          {sceneLit && (
            <div className={'dc-scene-smoke' + (igniting ? ' is-igniting' : '')} aria-hidden="true">
              <span /><span /><span /><span /><span /><span />
            </div>
          )}

          <div className="dc-caption">
              <div className="dc-caption-kicker">{loc.icon} Đang ở</div>
              <div className="dc-caption-title">{loc.ten}</div>
              <p className="dc-caption-desc">{loc.moTa}</p>
          </div>

          <div className="dc-ctrl-row">
            <button className="dc-ctrl" aria-label="Khu trước" onClick={() => go(-1)}>←</button>
            <button className="dc-ctrl" aria-label="Khu sau" onClick={() => go(1)}>→</button>
            <button className="dc-ctrl" aria-label="Phóng to" onClick={() => setZoom(z => Math.min(1.4, +(z + 0.1).toFixed(2)))}>＋</button>
            <button className="dc-ctrl" aria-label="Thu nhỏ / về mặc định" onClick={() => setZoom(z => Math.max(1, +(z - 0.1).toFixed(2)))}>－</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="dc-right">
          <div className="dc-card">
            <div className="dc-card-title">🙏 Lời Cầu Nguyện</div>
            <textarea className="dc-textarea" rows={2} maxLength={500} value={prayer}
              onChange={e => setPrayer(e.target.value)} placeholder="Viết lời nguyện của bạn…" />
            <button type="button" className="dc-btn dc-btn-gold dc-btn-block" onClick={sendPrayer} disabled={!prayer.trim()}>Gửi Lời Nguyện</button>
            <p className="dc-card-note">{sentFlash ? '✓ Đã ghi nhận lời nguyện của bạn.' : (prayerCount > 0 ? 'Bạn đã gửi ' + prayerCount + ' lời nguyện (lưu riêng trên máy).' : 'Lưu riêng tư trong trình duyệt của bạn.')}</p>
          </div>

          <div className="dc-card">
            <div className="dc-card-title">🔥 Thắp Hương Online</div>
            {canHuong ? (
              <>
                <div className="dc-huong-ritual">
                  <IncenseCenser3D lit={litLocs[activeId] || igniting} igniting={igniting} />
                </div>
                <button type="button" className="dc-btn dc-btn-gold dc-btn-block" onClick={doThapHuong} disabled={igniting}>
                  {igniting ? 'Đang dâng hương...' : (litLocs[activeId] ? 'Thắp thêm một nén' : 'Thắp Hương tại ' + loc.ten)}
                </button>
                <p className="dc-card-note">{litFlash ? 'Hương đã được dâng tại ' + loc.ten + '.' : (sceneLit ? 'Khói hương đang lan nhẹ trong ' + loc.ten + '.' : (litCount > 0 ? 'Đã thắp tổng ' + litCount + ' nén (tượng trưng).' : 'Chạm để thắp một nén — cử chỉ chiêm nghiệm, không thay hành lễ thật.'))}</p>
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
          <div className="dc-card dc-xam-card">
            <div>
              <div className="dc-card-title">🎋 Xin Xăm</div>
              <p className="dc-card-desc">Lắc ống xăm xin một quẻ.</p>
            </div>
            <button type="button" className="dc-btn dc-btn-gold" onClick={() => setModal('xam')}>Lắc ngay</button>
          </div>
        </aside>
      </div>

      {/* OVERLAYS */}
      <DcModal open={modal === 'help'} onClose={() => setModal(null)} title="Hướng Dẫn">
        <ul className="dc-help-list">
          <li><b>←  →</b> : chuyển khu trước / sau</li>
          <li><b>＋  －</b> : phóng to / thu nhỏ khung cảnh</li>
          <li><b>Danh sách khu</b> : chọn nhanh một không gian trong chùa</li>
          <li><b>Lời Cầu Nguyện</b> : viết & lưu riêng trên máy bạn</li>
          <li><b>Thắp Hương</b> : cử chỉ tượng trưng</li>
          <li><b>Xin Xăm</b> : <b>lắc ống xăm</b> (kéo qua lại hoặc lắc điện thoại) đến khi que rơi ra</li>
        </ul>
      </DcModal>

      <DcModal open={modal === 'congduc'} onClose={() => setModal(null)} title="◈ Công Đức">
        <p className="leading-relaxed">Chùa Tam Sở <b>chưa có</b> hình thức cúng dường / công đức thật. Tính năng này cần một cổng thanh toán minh bạch và xác minh rõ ràng, nên Tam Sở chưa triển khai.</p>
        <p className="dc-card-note" style={{ marginTop: 10 }}>Chúng tôi ưu tiên hoàn thiện trải nghiệm thật (thắp hương, lời nguyện, xin xăm) trước khi thêm bất kỳ tính năng liên quan đến tiền. Sẽ không bao giờ có nút quyên góp giả ở đây.</p>
      </DcModal>

      <DcModal open={modal === 'xam'} onClose={() => setModal(null)} title="🎋 Xin Xăm — hãy lắc ống"
        bgImage={sceneImage(loc, 'webp')}>
        <ShakeXam />
      </DcModal>

      <DcModal open={modal === 'lichsu'} onClose={() => setModal(null)} title="📜 Lịch Sử Của Bạn">
        <div className="dc-history-section">
          <div className="dc-history-head"><b>🙏 Lời Nguyện đã viết ({lichSuLN.length})</b>
            {lichSuLN.length > 0 && <button type="button" className="dc-history-clear" onClick={onClearLN}>Xoá hết</button>}
          </div>
          {lichSuLN.length === 0 ? <p className="dc-card-note">Bạn chưa viết lời nguyện nào.</p> : (
            <ul className="dc-history-list">
              {lichSuLN.map((p, i) => <li key={i}><span className="dc-history-time">{fmtT(p.t)}</span>{p.text}</li>)}
            </ul>
          )}
        </div>
        <div className="dc-history-section">
          <div className="dc-history-head"><b>🎋 Thẻ Xăm đã rút ({lichSuXam.length})</b>
            {lichSuXam.length > 0 && <button type="button" className="dc-history-clear" onClick={onClearXam}>Xoá hết</button>}
          </div>
          {lichSuXam.length === 0 ? <p className="dc-card-note">Bạn chưa xin thẻ xăm nào.</p> : (
            <ul className="dc-history-list">
              {lichSuXam.map((h, i) => { const x = xamBySo(h.so); return <li key={i}><span className="dc-history-time">{fmtT(h.t)}</span>Thẻ số {h.so}{x ? ' · ' + x.bac + ' — “' + x.cau[0] + '”' : ''}</li> })}
            </ul>
          )}
        </div>
        <p className="dc-card-note" style={{ marginTop: 10 }}>Lưu riêng trên máy bạn, không gửi đi đâu. Xoá bất cứ lúc nào.</p>
      </DcModal>

      <DcModal open={modal === 'soon'} onClose={() => setModal(null)} title="Đang phát triển">
        <p className="leading-relaxed">Khu vực này (Kinh Sách / Phật Pháp / Sự Kiện / Cộng Đồng, tìm kiếm, thông báo) đang được xây dựng. Hiện <b>Chùa Online</b> là phần đã mở — mời bạn dạo các khu trong khuôn viên.</p>
      </DcModal>
    </div>
  )
}
