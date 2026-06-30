import { useState } from 'react'
import { Link } from 'react-router-dom'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { drawCards } from '../data/tarot.js'
import CardImage from './CardImage.jsx'
import { dayCanChi, gioHoangDao } from '../data/tuvi.js'
import { solar2lunar } from '../data/lunar.js'
import { castHexagram } from '../data/iching.js'
import Hexagram from './Hexagram.jsx'
import CountUp from './CountUp.jsx'
import { PERSONAL_DAY_HINT } from '../data/numerology.js'
import { weaveDay } from '../data/dayWeave.js'

const WD = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const tile = 'route3d-card bg-gold/5 border border-gold/20 rounded-xl p-4 text-center transition hover:-translate-y-1 hover:border-gold/40 block'
const cap = 'text-[.7rem] uppercase tracking-[.14em] text-gold mb-2'
const DAY_MSG = { 1: 'Ngày để khởi sự và dẫn dắt — một bước nhỏ cũng quý.', 2: 'Ngày của kết nối và kiên nhẫn — lắng nghe nhiều hơn.', 3: 'Ngày để biểu đạt và sáng tạo — chia sẻ điều bạn nghĩ.', 4: 'Ngày của nền nếp — làm cho xong một việc nhỏ.', 5: 'Ngày của đổi thay — linh hoạt và cởi mở với cái mới.', 6: 'Ngày của yêu thương — dành sự ấm áp cho người quanh bạn.', 7: 'Ngày để tĩnh lặng và suy ngẫm — cho mình một khoảng lặng.', 8: 'Ngày của thực thi — tập trung vào mục tiêu thiết thực.', 9: 'Ngày để buông và hoàn tất — dọn dẹp điều cũ.' }

// Câu gợi mở phản tư (xoay theo ngày) — KHÔNG phải dự đoán, chỉ là câu hỏi để tự ngẫm.
const REFLECT = [
  'Một điều nhỏ nào hôm nay xứng đáng để bạn biết ơn?',
  'Việc gì bạn đang trì hoãn mà thật ra chỉ mất mười phút là xong?',
  'Hôm nay bạn muốn người khác nhớ đến mình vì điều gì?',
  'Có cuộc trò chuyện nào bạn nên chủ động mở lời trước?',
  'Điều gì đang làm bạn phân tâm — và có thể tạm gác lại?',
  'Bạn đã tử tế với chính mình hôm nay chưa?',
  'Một ranh giới nào bạn cần nhẹ nhàng giữ vững?',
  'Nếu hôm nay chỉ làm xong một việc, bạn sẽ chọn việc nào?',
  'Điều gì khiến bạn mỉm cười trong một ngày qua?',
  'Bạn có đang ôm phần việc của người khác vào mình không?',
  'Một thói quen nhỏ nào đáng để bắt đầu ngay từ hôm nay?',
  'Cơ thể bạn đang cần gì hơn cả: nghỉ ngơi, uống nước, hay vận động?',
  'Lời cảm ơn nào bạn còn đang nợ một ai đó?',
  'Hôm nay bạn học được điều gì mới, dù rất nhỏ?'
]

export default function Today() {
  const now = new Date()
  const d = now.getDate(), m = now.getMonth() + 1, y = now.getFullYear()
  const al = solar2lunar(d, m, y)
  const day = dayCanChi(y, m, d)
  const hd = gioHoangDao(day.chi).filter(g => g.hoangdao).map(g => g.chi + ' ' + g.range + 'h')
  let nday = String(d).split('').concat(String(m).split(''), String(y).split('')).reduce((a, b) => a + +b, 0)
  while (nday > 9) nday = String(nday).split('').reduce((a, b) => a + +b, 0)
  const doy = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000)
  const reflect = REFLECT[doy % REFLECT.length]
  const [drawn, setDrawn] = useState(null)
  const [copied, setCopied] = useState(false)
  const draw = () => { const p = drawCards(1)[0]; setDrawn({ card: p.card, up: p.up, hex: castHexagram().present }); setCopied(false) }
  const shareCopy = () => {
    if (!drawn) return
    const txt = `✦ Tam Sở — quẻ hôm nay của tôi\n🃏 ${drawn.card.nameVi} (${drawn.up ? 'xuôi' : 'ngược'}): ${drawn.up ? drawn.card.up : drawn.card.rev}\n☯ Quẻ ${drawn.hex.n} ${drawn.hex.ten}: ${drawn.hex.y}\n— ${routeShareUrl('/')}`
    navigator.clipboard?.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <section className="wrap py-8">
      <div className="panel route3d-panel p-6 md:p-7">
        <div className="text-center mb-5">
          <div className="text-gold tracking-[.3em] uppercase text-[.72rem] font-semibold">Hôm nay</div>
          <h2 className="text-[clamp(1.4rem,3vw,2rem)] my-1">{WD[now.getDay()]}, {d}/{m}/{y}</h2>
          <p className="note m-0">Âm lịch {al.day}/{al.month}{al.leap ? ' (nhuận)' : ''}/{al.year} · Ngày <b className="text-cream">{day.tenCanChi}</b></p>
          <p className="mt-2 mb-0 max-w-[640px] mx-auto text-[.95rem]">✨ <b className="text-cream">Thông điệp hôm nay:</b> {DAY_MSG[nday]}</p>
          <p className="note mt-1 mb-0 max-w-[640px] mx-auto">💭 Gợi mở để ngẫm: {reflect}</p>
        </div>

        {!drawn ? (
          <div className="text-center py-4">
            <p className="max-w-[560px] mx-auto mb-4">Tĩnh tâm một nhịp, thầm nghĩ về điều bạn muốn hỏi — rồi rút lá bài &amp; gieo quẻ cho riêng mình hôm nay.</p>
            <button className="btn btn-primary" onClick={draw}>✨ Rút lá &amp; gieo quẻ</button>
            <p className="note mt-3 mb-0">Mỗi lần rút là một kết quả ngẫu nhiên — dành cho riêng người đang hỏi.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade" key={drawn.card.id + '-' + drawn.hex.n}>
              <Link to="/tarot" className={tile}>
                <div className={cap}>Lá bài của bạn</div>
                <div className="w-[80px] mx-auto"><CardImage card={drawn.card} w={140} reversed={!drawn.up} imgClass="rounded-md w-full h-auto" fallbackClass="text-[2.4rem]" /></div>
                <div className="font-serif text-[1rem] mt-2 leading-tight">{drawn.card.nameVi}</div>
                <div className={'text-[.75rem] font-semibold ' + (drawn.up ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400')}>{drawn.up ? '▲ Xuôi' : '▼ Ngược'}</div>
              </Link>
              <Link to="/kinh-dich" className={tile}>
                <div className={cap}>Quẻ của bạn</div>
                <div className="flex justify-center my-1"><Hexagram up={drawn.hex.up} lo={drawn.hex.lo} w={44} /></div>
                <div className="font-serif text-[1rem] mt-2 leading-tight">Quẻ {drawn.hex.n} · {drawn.hex.ten}</div>
                <div className="note mt-1 leading-snug">{drawn.hex.y}</div>
              </Link>
              <Link to="/tu-vi" className={tile}>
                <div className={cap}>Giờ hoàng đạo</div>
                <div className="text-[2rem] leading-none">🕒</div>
                <div className="text-[.9rem] mt-2 leading-relaxed text-cream">{hd.join(' · ')}</div>
              </Link>
              <Link to="/than-so-hoc" className={tile}>
                <div className={cap}>Con số ngày</div>
                <div className="font-serif text-[2rem] text-gold leading-none"><CountUp end={nday} /></div>
                <div className="note mt-2 leading-snug">{PERSONAL_DAY_HINT[nday]}</div>
              </Link>
            </div>
            <div className="panel p-5 mt-4 text-left max-w-[820px] mx-auto animate-fade">
              <p className="note mt-0 mb-3 leading-relaxed">Hãy đọc nhẹ nhàng như một lời gợi mở để soi chiếu tâm trạng hôm nay — <b className="text-cream">không phải lời phán về số phận</b>. Mọi quyết định vẫn nằm ở bạn.</p>
              <div className="panel p-4 mb-3 bg-gold/[.05]">
                <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1">✦ Dệt lại — lá &amp; quẻ nói gì cùng nhau</div>
                <p className="m-0 leading-relaxed">{weaveDay({ card: drawn.card, up: drawn.up, hex: drawn.hex, dayNum: nday })}</p>
              </div>
              <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1">🃏 Lá bài · {drawn.card.nameVi} ({drawn.up ? 'xuôi' : 'ngược'})</div>
              <p className="m-0 leading-relaxed">{drawn.up ? drawn.card.up : drawn.card.rev}</p>
              {drawn.card.advice && <p className="mt-2 mb-0"><span className="text-gold font-semibold">✦ Bạn có thể làm gì:</span> {drawn.card.advice}</p>}
              <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mt-4 mb-1">☯ Quẻ {drawn.hex.n} · {drawn.hex.ten}</div>
              <p className="m-0 leading-relaxed">{drawn.hex.y}</p>
              {drawn.hex.luan && drawn.hex.luan !== drawn.hex.y && <p className="note mt-1 mb-0 leading-relaxed">{drawn.hex.luan}</p>}
              {drawn.hex.an && <p className="mt-1 mb-0 leading-relaxed"><span className="text-gold font-semibold">💡 Hiểu nôm na:</span> {drawn.hex.an}</p>}
              {drawn.hex.src && <a href={drawn.hex.src} target="_blank" rel="noopener" className="inline-block mt-2 text-[.85rem] font-semibold">📖 Đọc nguyên văn thoán/hào từ →</a>}
              <p className="note mt-3 mb-0 leading-relaxed">Nếu lá bài hay quẻ có vẻ thử thách, hãy xem đó là lời nhắc để <b className="text-cream">chuẩn bị và chủ động</b> hơn — không điều gì ở đây là định sẵn.</p>
            </div>
            <div className="flex gap-2 justify-center flex-wrap mt-4 no-print">
              <button className="btn btn-ghost" onClick={draw}>🔄 Rút lại</button>
              <button className="btn btn-ghost" onClick={shareCopy}>{copied ? '✓ Đã chép!' : '📋 Chép kết quả'}</button>
              <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(routeShareUrl('/'))} target="_blank" rel="noopener">📘 Chia sẻ</a>
            </div>
            <p className="note text-center mt-3 mb-0">Lá bài &amp; quẻ ở đây là <b className="text-cream">ngẫu nhiên mỗi lần rút</b> (không cố định theo ngày). Giờ hoàng đạo &amp; con số ngày là dữ kiện lịch của hôm nay. Bấm vào ô để mở công cụ đầy đủ.</p>
          </>
        )}
      </div>
    </section>
  )
}
