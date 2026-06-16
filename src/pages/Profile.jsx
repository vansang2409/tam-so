import { useState } from 'react'
import { Link } from 'react-router-dom'
import { computeLifePath, computeNameNumbers, personalYear, PERSONAL_YEAR, NUMEROLOGY } from '../data/numerology.js'
import { tinhCanChi } from '../data/tuvi.js'
import { getZodiac, LUCKY } from '../data/zodiac.js'
import { TAROT_CARDS, cardOfDay } from '../data/tarot.js'

const CUR = new Date()
const elColor = { 'Lửa': 'h-Hỏa', 'Đất': 'h-Thổ', 'Khí': 'h-Kim', 'Nước': 'h-Thủy' }

function birthCards(d, m, y) {
  const sd = n => ('' + n).split('').reduce((a, b) => a + +b, 0)
  let t = d + m + y; while (t > 21) t = sd(t)
  let t2 = t; while (t2 > 9) t2 = sd(t2)
  const c1 = TAROT_CARDS.find(c => c.arcana === 'major' && c.id === t)
  const c2 = TAROT_CARDS.find(c => c.arcana === 'major' && c.id === t2)
  return t === t2 ? [c1] : [c1, c2]
}

function Card({ to, label, children }) {
  return (
    <Link to={to} className="panel p-5 block no-underline hover:-translate-y-1 hover:border-gold/40 transition">
      <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-2">{label}</div>
      {children}
    </Link>
  )
}

export default function Profile() {
  const [name, setName] = useState(''); const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const today = cardOfDay()

  const calc = () => {
    const dd = +d, mm = +m, yy = +y
    if (!dd || !mm || !yy || dd < 1 || dd > 31 || mm < 1 || mm > 12 || yy < 1 || yy > 3000) { setErr('Vui lòng nhập ngày, tháng, năm sinh hợp lệ.'); setRes(null); return }
    const lp = computeLifePath(dd, mm, yy)
    const nn = name.trim() ? computeNameNumbers(name) : null
    setErr('')
    setRes({
      lp, nn, canChi: tinhCanChi(yy), zodiac: getZodiac(dd, mm),
      birth: birthCards(dd, mm, yy), py: personalYear(dd, mm, yy)
    })
  }

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Tất cả trong một</div>
        <h1 className="gradient-text text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Hồ Sơ Tổng Hợp</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">Nhập họ tên &amp; ngày sinh một lần — xem ngay bức chân dung từ cả năm hệ thống: Thần số học, Tử vi, Chiêm tinh và Tarot.</p>
      </section>

      <section className="wrap py-6">
        <div className="panel p-[26px] max-w-[820px] mx-auto">
          <div className="flex gap-3 flex-wrap items-end justify-center">
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Họ và tên (tùy chọn)</label><input value={name} onChange={e => setName(e.target.value)} placeholder="VD Nguyễn Văn An" className="field-input w-[230px]" /></div>
            <Field label="Ngày" value={d} set={setD} ph="22" />
            <Field label="Tháng" value={m} set={setM} ph="10" />
            <Field label="Năm" value={y} set={setY} ph="1990" />
            <button className="btn btn-primary" onClick={calc}>✦ Lập hồ sơ</button>
          </div>
          {err && <div className="disclaimer mt-5">{err}</div>}

          {res && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 animate-fade">
              <Card to="/than-so-hoc" label="Số Chủ Đạo">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-[3rem] text-gold leading-none">{res.lp.lp}</span>
                  <span className="font-serif text-[1.05rem]">{res.lp.info.title.replace(/^Số \d+ — /, '')}</span>
                </div>
              </Card>

              {res.nn && (
                <Card to="/than-so-hoc" label="Số Vận Mệnh">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-[3rem] text-gold leading-none">{res.nn.expression}</span>
                    <span className="font-serif text-[1.05rem]">{NUMEROLOGY[res.nn.expression].title.replace(/^Số \d+ — /, '')}</span>
                  </div>
                </Card>
              )}

              <Card to="/tu-vi" label="Tử vi · Can Chi">
                <div className="font-serif text-[1.6rem]">{res.canChi.tenCanChi}</div>
                <div className="mt-1">Tuổi <b>{res.canChi.conGiap}</b> · <span className={'pill h-' + res.canChi.menhHanh}>{res.canChi.napAm}</span></div>
              </Card>

              {res.zodiac && (
                <Card to="/cung-hoang-dao" label="Cung hoàng đạo">
                  <div className="flex items-center gap-3">
                    <span className="text-[2.4rem] leading-none">{res.zodiac.sym}</span>
                    <div><div className="font-serif text-[1.3rem]">{res.zodiac.ten}</div>
                      <span className={'pill ' + elColor[res.zodiac.nguyenTo]}>{res.zodiac.nguyenTo}</span></div>
                  </div>
                  <div className="note mt-2">Màu {LUCKY[res.zodiac.en].mau} · Số {LUCKY[res.zodiac.en].so}</div>
                </Card>
              )}

              <Card to="/tarot" label="Lá Tarot chủ đạo">
                <div className="flex items-center gap-3">
                  <span className="text-[2.4rem] leading-none">{res.birth.map(c => c.symbol).join(' ')}</span>
                  <span className="font-serif text-[1.1rem]">{res.birth.map(c => c.nameVi).join(' · ')}</span>
                </div>
              </Card>

              <Card to="/than-so-hoc" label={'Năm cá nhân ' + CUR.getFullYear()}>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-[3rem] text-gold leading-none">{res.py}</span>
                  <span className="font-serif text-[1.05rem]">{PERSONAL_YEAR[res.py].title.replace(/^Năm \d+ — /, '')}</span>
                </div>
              </Card>

              <Card to="/tarot" label="Lá bài hôm nay">
                <div className="flex items-center gap-3">
                  <span className="text-[2.4rem] leading-none">{today.card.symbol}</span>
                  <div><div className="font-serif text-[1.2rem]">{today.card.nameVi}</div>
                    <span className={'text-[.8rem] font-semibold ' + (today.up ? 'text-emerald-300' : 'text-pink-300')}>{today.up ? '▲ Xuôi' : '▼ Ngược'}</span></div>
                </div>
              </Card>
            </div>
          )}
          {res && <p className="note text-center mt-5">Nhấp vào từng thẻ để xem chi tiết. Mọi luận giải chỉ mang tính tham khảo — xem <Link to="/nguon">Nguồn &amp; Lưu ý</Link>.</p>}
        </div>
      </section>
    </>
  )
}

function Field({ label, value, set, ph }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={ph} className="field-input w-[100px]" /></div>)
}
