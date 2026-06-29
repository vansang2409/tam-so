import { Suspense, lazy, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LichVanNien from '../components/LichVanNien.jsx'
import Reveal from '../components/Reveal.jsx'
import { ZODIAC, ZODIAC_SLUG, dailyHoroscope } from '../data/zodiac.js'

const Today = lazy(() => import('../components/Today.jsx'))

const pillars = [
  { ic: '🃏', title: 'Rút bài Tarot', to: '/tarot', desc: 'Một câu hỏi trong lòng — để lá bài gợi mở.' },
  { ic: '🔢', title: 'Thần số học', to: '/than-so-hoc', desc: 'Ngày sinh & họ tên ẩn chứa con số của bạn.' },
  { ic: '☆', title: 'Lá số Tử Vi', to: '/la-so-tu-vi', desc: 'An sao 12 cung theo giờ sinh của bạn.' }
]

const features = [
  { ic: '📜', title: 'Hồ sơ tổng hợp', to: '/ho-so', cta: 'Lập hồ sơ →', desc: 'Nhập một lần — xem ngay Số Chủ Đạo, Can Chi, cung hoàng đạo, lá Tarot chủ đạo và năm cá nhân trong một bức chân dung.' },
  { ic: '🃏', title: 'Tarot', to: '/tarot', cta: 'Vào phần Tarot →', desc: 'Bộ 78 lá đầy đủ, rút nhanh một lá, 6 kiểu trải (gồm Celtic Cross & Có/Không), lá chủ đạo theo ngày sinh, lưu lịch sử & lá yêu thích.' },
  { ic: '🔢', title: 'Thần số học', to: '/than-so-hoc', cta: 'Tính con số →', desc: 'Số Chủ Đạo, Vận Mệnh, Linh Hồn, Nhân Cách, Trưởng Thành, biểu đồ Lo Shu, nợ nghiệp, Đỉnh cao & Thử thách, năm/tháng/ngày cá nhân.' },
  { ic: '☯', title: 'Tử vi · Can Chi', to: '/tu-vi', cta: 'Tra Can Chi →', desc: 'Can Chi năm/ngày/giờ (tự quy đổi âm lịch), hợp tuổi, giờ hoàng đạo, Tam Tai, cung phi.' },
  { ic: '☆', title: 'Lá số Tử Vi', to: '/la-so-tu-vi', cta: 'Lập lá số →', desc: 'An sao Tử Vi Đẩu Số: 12 cung, 14 chính tinh, Tứ Hóa, lục cát – lục sát, Cục và đại hạn — thuật toán cổ điển tất định.' },
  { ic: '💞', title: 'So đôi lá số', to: '/so-la-so', cta: 'So hai lá số →', desc: 'Đặt hai lá số Tử Vi cạnh nhau: Mệnh, cung Phu Thê và quan hệ địa chi năm sinh — đối chiếu dữ kiện để cùng chiêm nghiệm.' },
  { ic: '♈', title: 'Cung hoàng đạo', to: '/cung-hoang-dao', cta: 'Xem cung →', desc: '12 cung phương Tây theo ngày sinh, tương hợp hai cung, màu/đá/số may mắn.' },
  { ic: '📖', title: 'Kinh Dịch', to: '/kinh-dich', cta: 'Gieo quẻ →', desc: 'Gieo quẻ ba đồng xu (hào động & quẻ biến), luận hào động, tra cứu đủ 64 quẻ Văn Vương.' },
  { ic: '💞', title: 'Tương hợp', to: '/tuong-hop', cta: 'Xem tương hợp →', desc: 'Ghép hai ngày sinh: tương hợp qua Số Chủ Đạo, Can Chi và cung hoàng đạo trong một trang.' }
]

export default function Home() {
  const [streak, setStreak] = useState(0)
  const [greet, setGreet] = useState('')
  const [cung, setCung] = useState(null)
  useEffect(() => {
    try {
      const key = new Date().toISOString().slice(0, 10)
      let d = JSON.parse(localStorage.getItem('tamso_streak') || 'null')
      if (!d || !d.last) d = { last: key, count: 1 }
      else if (d.last !== key) {
        const diff = Math.round((new Date(key) - new Date(d.last)) / 86400000)
        d = { last: key, count: diff === 1 ? (d.count || 1) + 1 : 1 }
      }
      localStorage.setItem('tamso_streak', JSON.stringify(d))
      setStreak(d.count || 1)
    } catch (e) { /* localStorage có thể bị chặn — bỏ qua */ }
    try { const c = localStorage.getItem('tamso_cung'); if (c) setCung(c) } catch (e2) {}
    const h = new Date().getHours()
    setGreet(h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối')
  }, [])
  let dateStr = ''
  try { dateStr = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }) } catch (e) { dateStr = '' }
  const cungObj = cung ? ZODIAC.find(z => z.en === cung) : null
  const dh = cungObj ? dailyHoroscope(cungObj.en, new Date().toISOString().slice(0, 10)) : null

  return (
    <>
      <section className="wrap text-center pt-[58px] pb-2">
        {greet && (
          <div className="text-muted text-[.92rem] mb-2.5">
            {greet}{dateStr ? ' · ' + dateStr : ''}
            {streak > 1 && <> · <span className="text-gold font-semibold">đã ghé {streak} ngày liền ✦</span></>}
          </div>
        )}
        <div className="text-gold text-kicker uppercase">Tarot · Thần số học · Tử vi · Chiêm tinh · Kinh Dịch</div>
        <h1 className="gradient-text shimmer-text text-display my-3">Năm ngả chiêm nghiệm,<br />một chốn dừng chân</h1>
        <p className="text-muted text-lead max-w-[700px] mx-auto mb-7">
          Tam Sở gom các hệ thống biểu tượng cổ xưa về cùng một nơi: lá bài Tarot, con số định mệnh, vòng Can Chi, cung hoàng đạo và quẻ Dịch.
          Công cụ để bạn soi chiếu bản thân — với nguồn dẫn rõ ràng và sự thành thật về ranh giới giữa <em>dữ kiện</em> và <em>diễn giải</em>.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/ho-so" className="btn btn-primary">📜 Lập hồ sơ tổng hợp</Link>
          <Link to="/tarot" className="btn btn-ghost">🔮 Rút một lá bài</Link>
        </div>
      </section>

      <Reveal><LichVanNien /></Reveal>

      <section className="wrap pt-4 pb-2">
        <p className="text-center text-gold text-kicker uppercase mb-3">Bạn muốn xem gì hôm nay?</p>
        <Reveal base="stagger-parent" className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[820px] mx-auto">
          {pillars.map((p, i) => (
            <Link key={p.to} style={{ '--i': i }} to={p.to} className="panel hover-lift p-6 text-center no-underline block hover:border-gold/40">
              <span className="block text-[2.4rem] mb-1">{p.ic}</span>
              <h3 className="text-cream text-h3 mb-1">{p.title}</h3>
              <p className="text-muted text-[.9rem] m-0">{p.desc}</p>
            </Link>
          ))}
        </Reveal>
      </section>

      <section className="wrap py-2">
        <div className="panel p-5 max-w-[680px] mx-auto bg-gold/[.05]">
          {cungObj && dh ? (
            <>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Tử vi hôm nay · {cungObj.sym} {cungObj.ten}</div>
                <div className="text-amber-700 text-[.95rem]" title="Mức năng lượng (tham khảo)">{'★'.repeat(dh.nangLuong)}<span className="text-gray-300">{'★'.repeat(5 - dh.nangLuong)}</span></div>
              </div>
              <p className="pull m-0">{dh.tongQuan}</p>
              <p className="note m-0 mt-1.5">💡 {dh.loiKhuyen}</p>
              <Link to={'/cung-hoang-dao/' + ZODIAC_SLUG[cungObj.en]} className="font-semibold inline-block mt-2">Xem đầy đủ tình cảm · công việc · tài chính →</Link>
            </>
          ) : (
            <div className="text-center">
              <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1">Tử vi hôm nay</div>
              <p className="m-0 text-muted">Chọn cung hoàng đạo của bạn để nhận một gợi ý chiêm nghiệm mới mỗi ngày.</p>
              <Link to="/cung-hoang-dao" className="btn btn-ghost mt-3">♈ Xem cung của tôi</Link>
            </div>
          )}
          <p className="note text-center m-0 mt-3 pt-3 border-t border-gold/15">Hoặc xem <Link to="/con-giap" className="text-gold font-semibold">tử vi hôm nay theo 12 con giáp</Link> (tuổi Tý, Sửu, Dần…)</p>
        </div>
      </section>

      <Reveal>
        <Suspense fallback={<div className="page-fallback" role="status" aria-live="polite" aria-label="Dang tai hom nay"><span className="page-fallback-spinner" aria-hidden="true" /></div>}>
          <Today />
        </Suspense>
      </Reveal>

      <section className="wrap pt-1 pb-3">
        <p className="note text-center max-w-[640px] mx-auto m-0">✦ Lá bài, quẻ Dịch và con số của ngày làm mới mỗi sáng — ghé lại ngày mai để nhận điều mới, và giữ chuỗi ngày của bạn.</p>
      </section>

      <Reveal as="section" className="wrap py-12">
        <p className="text-center text-gold text-kicker uppercase mb-8">Công cụ của Tam Sở</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
          {features.map(f => (
            <div key={f.to} className="group flex flex-col">
              <span className="block text-[2rem] mb-2">{f.ic}</span>
              <h3 className="text-h3 mb-1.5">{f.title}</h3>
              <p className="text-muted text-[.95rem] mb-3">{f.desc}</p>
              <Link to={f.to} className="font-semibold mt-auto inline-flex items-center gap-1 hover:gap-1.5 transition-all">{f.cta}</Link>
              <hr className="rule mt-4" />
            </div>
          ))}
        </div>
      </Reveal>

      <section className="wrap pb-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Một lời thành thật.</b> Tarot, Thần số học, Tử vi, Chiêm tinh và Kinh Dịch là những hệ thống <b>tín ngưỡng – văn hóa</b>, không phải khoa học
          và không có giá trị tiên đoán đã được kiểm chứng. Tam Sở phân biệt rạch ròi phần <em>tính toán</em> (kiểm chứng được) với phần <em>luận giải</em> (truyền thống, tham khảo).
        </div>
      </section>
    </>
  )
}
