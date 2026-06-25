import { useState } from 'react'
import { solar2lunar } from '../data/lunar.js'
import { dayCanChi, monthCanChi, tinhCanChi, gioHoangDao } from '../data/tuvi.js'

const WD = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const p2 = n => String(n).padStart(2, '0')

export default function LichVanNien() {
  const [offset, setOffset] = useState(0)
  const base = new Date(); base.setHours(12, 0, 0, 0)
  const date = new Date(base.getTime() + offset * 86400000)
  const d = date.getDate(), m = date.getMonth() + 1, y = date.getFullYear()
  const al = solar2lunar(d, m, y)
  const dcc = dayCanChi(y, m, d)
  const mcc = monthCanChi(al.year, al.month)
  const ycc = tinhCanChi(al.year)
  const hd = gioHoangDao(dcc.chi).filter(g => g.hoangdao)
  const isToday = offset === 0

  return (
    <section className="wrap py-6">
      <div className="panel p-5 md:p-7 max-w-[760px] mx-auto">
        <div className="text-center mb-4">
          <div className="text-gold text-kicker uppercase mb-2">Lịch vạn niên {isToday && <span className="text-muted normal-case tracking-normal font-normal">· hôm nay</span>}</div>
          <div className="inline-block border border-gold/30 rounded-xl px-6 py-2 font-serif text-[clamp(1.1rem,3vw,1.35rem)] text-cream">{WD[date.getDay()]}, {p2(d)}/{p2(m)}/{y}</div>
        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <button onClick={() => setOffset(o => o - 1)} aria-label="Ngày trước" className="shrink-0 px-4 py-6 text-gold/60 hover:text-gold text-[1.7rem] leading-none cursor-pointer transition">‹</button>
          <div className="grid grid-cols-2 flex-1 max-w-[480px] divide-x divide-gold/20">
            <div className="text-center px-2 sm:px-4">
              <div className="text-gold text-[.7rem] uppercase tracking-[.18em] mb-1">Dương lịch</div>
              <div className="font-serif text-[clamp(3rem,11vw,4rem)] leading-none text-cream">{d}</div>
              <div className="rule my-2.5 mx-auto" style={{ maxWidth: 120 }}></div>
              <div className="note m-0">Tháng {m} · Năm {y}</div>
            </div>
            <div className="text-center px-2 sm:px-4">
              <div className="text-gold text-[.7rem] uppercase tracking-[.18em] mb-1">Âm lịch</div>
              <div className="font-serif text-[clamp(3rem,11vw,4rem)] leading-none" style={{ color: '#a9772f' }}>{al.day}</div>
              <div className="rule my-2.5 mx-auto" style={{ maxWidth: 120 }}></div>
              <div className="note m-0">Tháng {al.month}{al.leap ? ' (nhuận)' : ''} · Năm {ycc.tenCanChi}</div>
            </div>
          </div>
          <button onClick={() => setOffset(o => o + 1)} aria-label="Ngày sau" className="shrink-0 px-4 py-6 text-gold/60 hover:text-gold text-[1.7rem] leading-none cursor-pointer transition">›</button>
        </div>

        <div className="text-center mt-4">
          <p className="m-0 leading-relaxed">Ngày <b className="text-cream">{dcc.tenCanChi}</b> · Tháng <b className="text-cream">{mcc.tenCanChi}</b> · Năm <b className="text-cream">{ycc.tenCanChi}</b></p>
          <p className="note mt-2 mb-0"><b className="text-cream">Giờ hoàng đạo:</b> {hd.map(g => g.chi + ' (' + g.range + 'h)').join(' · ')}</p>
          {!isToday && <button onClick={() => setOffset(0)} className="btn btn-ghost mt-3" style={{ padding: '8px 18px', fontSize: '.85rem' }}>↺ Về hôm nay</button>}
        </div>

        <p className="note text-center mt-4 mb-0 pt-3 border-t border-gold/15">Âm lịch &amp; Can Chi tính theo múi giờ +7 (Việt Nam). Bấm ‹ › để xem ngày khác — đây là dữ kiện lịch, không phải lời phán.</p>
      </div>
    </section>
  )
}
