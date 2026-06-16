import { Link } from 'react-router-dom'
import { cardOfDay } from '../data/tarot.js'
import CardImage from './CardImage.jsx'
import { dayCanChi, gioHoangDao } from '../data/tuvi.js'
import { solar2lunar } from '../data/lunar.js'
import { hexagramOfDay, TRIGRAMS } from '../data/iching.js'
import { PERSONAL_DAY_HINT } from '../data/numerology.js'

const WD = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const tile = 'bg-white/[.04] border border-gold/20 rounded-xl p-4 text-center transition hover:-translate-y-1 hover:border-gold/40 block'
const cap = 'text-[.7rem] uppercase tracking-[.14em] text-gold mb-2'

export default function Today() {
  const now = new Date()
  const d = now.getDate(), m = now.getMonth() + 1, y = now.getFullYear()
  const al = solar2lunar(d, m, y)
  const day = dayCanChi(y, m, d)
  const tc = cardOfDay(now)
  const hex = hexagramOfDay(now)
  const hd = gioHoangDao(day.chi).filter(g => g.hoangdao).map(g => g.chi + ' ' + g.range + 'h')
  let nday = String(d).split('').concat(String(m).split(''), String(y).split('')).reduce((a, b) => a + +b, 0)
  while (nday > 9) nday = String(nday).split('').reduce((a, b) => a + +b, 0)

  return (
    <section className="wrap py-8">
      <div className="panel p-6 md:p-7">
        <div className="text-center mb-5">
          <div className="text-gold tracking-[.3em] uppercase text-[.72rem] font-semibold">Hôm nay</div>
          <h2 className="text-[clamp(1.4rem,3vw,2rem)] my-1">{WD[now.getDay()]}, {d}/{m}/{y}</h2>
          <p className="note m-0">Âm lịch {al.day}/{al.month}{al.leap ? ' (nhuận)' : ''}/{al.year} · Ngày <b className="text-cream">{day.tenCanChi}</b></p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/tarot" className={tile}>
            <div className={cap}>Lá bài hôm nay</div>
            <div className="w-[80px] mx-auto"><CardImage card={tc.card} w={140} reversed={!tc.up} imgClass="rounded-md w-full h-auto" fallbackClass="text-[2.4rem]" /></div>
            <div className="font-serif text-[1rem] mt-2 leading-tight">{tc.card.nameVi}</div>
            <div className={'text-[.75rem] font-semibold ' + (tc.up ? 'text-emerald-300' : 'text-pink-300')}>{tc.up ? '▲ Xuôi' : '▼ Ngược'}</div>
          </Link>
          <Link to="/kinh-dich" className={tile}>
            <div className={cap}>Quẻ hôm nay</div>
            <div className="text-[1.9rem] leading-none">{TRIGRAMS[hex.up].sym}<br />{TRIGRAMS[hex.lo].sym}</div>
            <div className="font-serif text-[1rem] mt-2 leading-tight">Quẻ {hex.n} · {hex.ten}</div>
            <div className="note mt-1 leading-snug">{hex.y}</div>
          </Link>
          <Link to="/tu-vi" className={tile}>
            <div className={cap}>Giờ hoàng đạo</div>
            <div className="text-[2rem] leading-none">🕒</div>
            <div className="text-[.9rem] mt-2 leading-relaxed text-cream">{hd.join(' · ')}</div>
          </Link>
          <Link to="/than-so-hoc" className={tile}>
            <div className={cap}>Con số ngày</div>
            <div className="font-serif text-[2rem] text-gold leading-none">{nday}</div>
            <div className="note mt-2 leading-snug">{PERSONAL_DAY_HINT[nday]}</div>
          </Link>
        </div>
        <p className="note text-center mt-4 mb-0">Lá bài &amp; quẻ "hôm nay" cố định theo ngày — mai sẽ khác. Bấm để mở công cụ tương ứng.</p>
      </div>
    </section>
  )
}
