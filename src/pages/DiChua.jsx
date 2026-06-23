import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SeoTag from '../components/SeoTag.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import Modal from '../components/Modal.jsx'
import {
  DICHUA_LOCATIONS, locationById, rutXam,
  loadLoiNguyen, addLoiNguyen, countThapHuong, thapHuong
} from '../data/dichua.js'

const TONE_BG = {
  dawn: 'linear-gradient(180deg,#1e293b 0%,#334155 45%,#475569 100%)',
  day: 'linear-gradient(180deg,#1e293b 0%,#3f3320 55%,#57452a 100%)',
  gold: 'linear-gradient(180deg,#1c1410 0%,#3a2a14 55%,#5a3d18 100%)',
  dusk: 'linear-gradient(180deg,#1a1025 0%,#2d1b3d 55%,#46264f 100%)'
}

function IncenseBurner({ lit }) {
  return (
    <div className="relative mx-auto" style={{ width: 64, height: 70 }}>
      {lit && [0, 1, 2].map(i => (
        <span key={i} className="dichua-smoke" style={{ animationDelay: (i * 0.9) + 's', left: 22 + i * 8 }} />
      ))}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-[3px]">
        {[0, 1, 2].map(i => (
          <span key={i} className="block rounded-full" style={{ width: 2, height: 30 - i * 3, background: 'linear-gradient(180deg,#e8c27a,#9a6a24)', boxShadow: lit ? '0 -6px 10px -2px rgba(251,191,36,.8)' : 'none' }} />
        ))}
      </div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-t-full" style={{ width: 56, height: 26, background: 'linear-gradient(180deg,#caa454,#7a5420)', boxShadow: '0 6px 14px -4px rgba(0,0,0,.5)' }} />
    </div>
  )
}

function LocItem({ loc, active, onClick, compact }) {
  return (
    <button type="button" onClick={() => onClick(loc.id)}
      className={'dichua-side-item' + (active ? ' is-active' : '') + (!loc.mvp ? ' is-soon' : '') + (compact ? ' is-compact' : '')}
      title={loc.mvp ? loc.ten : loc.ten + ' (sắp ra mắt)'}>
      <span aria-hidden="true" className="text-[1.15rem]">{loc.icon}</span>
      <span className="dichua-side-label">{loc.ten}</span>
      {!loc.mvp && <span className="dichua-soon-badge">Sắp ra mắt</span>}
    </button>
  )
}

export default function DiChua() {
  const [activeId, setActiveId] = useState('chanh-dien')
  const [showIntro, setShowIntro] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [prayer, setPrayer] = useState('')
  const [prayerCount, setPrayerCount] = useState(0)
  const [sentFlash, setSentFlash] = useState(false)
  const [litCount, setLitCount] = useState(0)
  const [xam, setXam] = useState(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [tienOpen, setTienOpen] = useState(false)

  useEffect(() => { setPrayerCount(loadLoiNguyen().length); setLitCount(countThapHuong()) }, [])

  const idx = DICHUA_LOCATIONS.findIndex(l => l.id === activeId)
  const loc = locationById(activeId) || DICHUA_LOCATIONS[0]
  const go = dir => setActiveId(DICHUA_LOCATIONS[(idx + dir + DICHUA_LOCATIONS.length) % DICHUA_LOCATIONS.length].id)

  const sendPrayer = () => {
    if (!prayer.trim()) return
    const list = addLoiNguyen(prayer)
    setPrayerCount(list.length); setPrayer(''); setSentFlash(true)
    setTimeout(() => setSentFlash(false), 2200)
  }
  const doThapHuong = () => setLitCount(thapHuong())
  const doXinXam = () => setXam(rutXam())

  return (
    <>
      <SeoTag title="Đi Chùa — Đại Tự Tâm Linh | Tam Sở"
        description="Trải nghiệm tham quan chùa hư cấu Đại Tự Tâm Linh: bước qua cổng, dạo sân, vào chính điện, thắp hương, khấn nguyện và xin thẻ xăm — tham khảo, không thay việc hành lễ thật."
        path="/di-chua" breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: 'Đi chùa' }]} />

      <section className="wrap text-center pt-[58px] pb-5">
        <div className="text-gold text-kicker uppercase">Thế giới tâm linh · MVP</div>
        <h1 className="text-display my-3">Đi Chùa</h1>
        <p className="text-muted text-lead max-w-[700px] mx-auto">
          <b className="text-cream">Đại Tự Tâm Linh</b> — một công trình hư cấu lấy cảm hứng từ nhiều ngôi chùa Việt, không sao chép địa điểm cụ thể nào.
          Bước qua cổng, dạo sân, vào chính điện, thắp một nén hương và xin một thẻ xăm.
        </p>
      </section>

      <section className="wrap pb-12">
        <div className="dichua-shell">
          <div className="dichua-topbar">
            <span className="dichua-brand">{loc.icon} <b>Đại Tự Tâm Linh</b></span>
            <span className="dichua-topbar-loc">{loc.ten}</span>
            <span className="flex gap-2 ml-auto">
              <button type="button" className="dichua-pill-btn" onClick={() => setHelpOpen(true)}>❔ Hướng dẫn</button>
              <button type="button" className="dichua-pill-btn" onClick={() => setTienOpen(true)}>🙏 Công đức</button>
            </span>
          </div>

          <div className="dichua-mobilenav lg:hidden">
            {DICHUA_LOCATIONS.map(l => <LocItem key={l.id} loc={l} active={l.id === activeId} onClick={setActiveId} compact />)}
          </div>

          <div className="dichua-body">
            <aside className="dichua-side hidden lg:flex">
              {DICHUA_LOCATIONS.map(l => <LocItem key={l.id} loc={l} active={l.id === activeId} onClick={setActiveId} />)}
            </aside>

            <div className="dichua-stage-wrap">
              <motion.div key={activeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                className="dichua-stage" style={{ background: TONE_BG[loc.tone] || TONE_BG.day }}>
                <div className="dichua-stage-inner" style={{ transform: 'scale(' + zoom + ')' }}>
                  <div className="dichua-signage">{loc.bienHieu}</div>
                  <div className="dichua-icon-big" aria-hidden="true">{loc.icon}</div>
                  {loc.mvp && <IncenseBurner lit={litCount > 0} />}
                  {!loc.mvp && <div className="dichua-soon-flag">🚧 Đang xây dựng — sắp ra mắt</div>}
                  {showIntro && <p className="dichua-caption">{loc.moTa}</p>}
                </div>

                <div className="dichua-ctrl-row">
                  <button type="button" aria-label="Hiện mô tả" onClick={() => setShowIntro(true)} className="dichua-ctrl">↑</button>
                  <button type="button" aria-label="Địa điểm trước" onClick={() => go(-1)} className="dichua-ctrl">←</button>
                  <button type="button" aria-label="Ẩn mô tả" onClick={() => setShowIntro(false)} className="dichua-ctrl">↓</button>
                  <button type="button" aria-label="Địa điểm sau" onClick={() => go(1)} className="dichua-ctrl">→</button>
                  <button type="button" aria-label="Thu nhỏ" onClick={() => setZoom(z => Math.max(1, +(z - 0.1).toFixed(2)))} className="dichua-ctrl">−</button>
                  <button type="button" aria-label="Phóng to" onClick={() => setZoom(z => Math.min(1.3, +(z + 0.1).toFixed(2)))} className="dichua-ctrl">+</button>
                </div>
                <p className="dichua-hint hidden sm:block">🖱️ Mũi tên đổi hướng/địa điểm · cuộn dải ảnh dưới để chọn nhanh</p>
              </motion.div>
            </div>

            <aside className="dichua-actions">
              {!loc.mvp && (
                <div className="dichua-card">
                  <div className="dichua-card-title">🚧 Chưa mở ở {loc.ten}</div>
                  <p className="dichua-card-desc">Khấn nguyện, thắp hương và xin xăm hiện chỉ có ở Cổng Tam Quan, Sân Chùa và Chánh Điện — các địa điểm khác đang được xây dựng.</p>
                  <button type="button" className="dichua-card-btn" onClick={() => setActiveId('chanh-dien')}>Đi tới Chánh Điện</button>
                </div>
              )}
              {loc.mvp && (
                <>
                  <div className="dichua-card">
                    <div className="dichua-card-title">🙏 Khấn Nguyện</div>
                    <textarea value={prayer} onChange={e => setPrayer(e.target.value)} maxLength={500}
                      placeholder="Viết lời nguyện của bạn…" className="dichua-textarea" rows={3} />
                    <button type="button" className="dichua-card-btn" onClick={sendPrayer} disabled={!prayer.trim()}>Gửi Lời Nguyện</button>
                    <p className="dichua-card-note">{sentFlash ? '✓ Đã ghi nhận lời nguyện của bạn.' : (prayerCount > 0 ? 'Bạn đã gửi ' + prayerCount + ' lời nguyện.' : 'Lưu riêng tư trong trình duyệt của bạn.')}</p>
                  </div>

                  <div className="dichua-card">
                    <div className="dichua-card-title">🕯️ Thắp Hương</div>
                    <p className="dichua-card-desc">Một nén hương tượng trưng — chỉ là cử chỉ chiêm nghiệm, không thay việc hành lễ thật.</p>
                    <button type="button" className="dichua-card-btn" onClick={doThapHuong}>{litCount > 0 ? '🔥 Thắp thêm hương' : '🔥 Thắp hương'}</button>
                    {litCount > 0 && <p className="dichua-card-note">Đã thắp {litCount} lượt (tượng trưng).</p>}
                  </div>

                  <div className="dichua-card">
                    <div className="dichua-card-title">🎋 Xin Xăm</div>
                    <p className="dichua-card-desc">Rút một trong 16 thẻ — diễn giải tham khảo dân gian, không phải lời tiên đoán chắc chắn.</p>
                    <button type="button" className="dichua-card-btn" onClick={doXinXam}>{xam ? 'Xin lại' : 'Xin một thẻ'}</button>
                    {xam && (
                      <div className="dichua-xam-result animate-fade">
                        <div className="dichua-xam-so">Thẻ số {xam.so} · {xam.bac}</div>
                        <p className="dichua-xam-cau">{xam.cau[0]}<br />{xam.cau[1]}</p>
                        <p className="dichua-card-desc">{xam.dienGiai}</p>
                        <p className="dichua-card-note">💡 {xam.loiKhuyen}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </aside>
          </div>

          <div className="dichua-slider">
            {DICHUA_LOCATIONS.map(l => (
              <button key={l.id} type="button" onClick={() => setActiveId(l.id)}
                className={'dichua-thumb' + (l.id === activeId ? ' is-active' : '')}>
                <span className="dichua-thumb-ic">{l.icon}</span>
                <span className="dichua-thumb-label">{l.ten}</span>
                {!l.mvp && <span className="dichua-soon-dot" title="Sắp ra mắt" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap pb-10">
        <Disclaimer>
          <b>Lưu ý.</b> "Đi chùa" là không gian mô phỏng mang tính chiêm nghiệm/thư giãn, <b>không thay thế</b> việc hành lễ ngoài đời.
          Đại Tự Tâm Linh là công trình <b>hư cấu</b>, lấy cảm hứng từ nhiều ngôi chùa Việt — không sao chép địa điểm cụ thể nào.
          Nội dung thẻ xăm do Tam Sở tự biên soạn theo thể loại dân gian, mang tính tham khảo để chiêm nghiệm, <span className="note">cần kiểm chứng thêm</span> với góc nhìn của riêng bạn.
        </Disclaimer>
      </section>

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)}>
        <h3 className="text-h3 mb-2">Hướng dẫn</h3>
        <ul className="text-[.92rem] leading-relaxed list-disc pl-5">
          <li>← → : chuyển địa điểm trước/sau</li>
          <li>↑ ↓ : hiện/ẩn mô tả địa điểm</li>
          <li>− + : thu nhỏ/phóng to khung cảnh</li>
          <li>Dải ảnh dưới cùng hoặc danh sách bên trái: chọn nhanh địa điểm</li>
          <li>3 thẻ bên phải: khấn nguyện, thắp hương, xin xăm</li>
        </ul>
      </Modal>
      <Modal open={tienOpen} onClose={() => setTienOpen(false)}>
        <h3 className="text-h3 mb-2">🙏 Công đức</h3>
        <p className="leading-relaxed">Đại Tự Tâm Linh <b>chưa có</b> hình thức cúng dường/công đức thật. Tính năng này cần một cổng thanh toán minh bạch và xác minh rõ ràng nên Tam Sở chưa triển khai.</p>
        <p className="note mt-2">Chúng tôi ưu tiên hoàn thiện trải nghiệm thật (thắp hương, khấn nguyện, xin xăm) trước khi thêm bất kỳ tính năng liên quan đến tiền.</p>
      </Modal>
    </>
  )
}
