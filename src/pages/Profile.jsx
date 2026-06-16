import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { computeLifePath, computeNameNumbers, personalYear, PERSONAL_YEAR, NUMEROLOGY } from '../data/numerology.js'
import { tinhCanChi, cungPhi } from '../data/tuvi.js'
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

function compute(name, dd, mm, yy, gender) {
  return {
    name, lp: computeLifePath(dd, mm, yy), nn: name && name.trim() ? computeNameNumbers(name) : null,
    canChi: tinhCanChi(yy), zodiac: getZodiac(dd, mm), birth: birthCards(dd, mm, yy),
    py: personalYear(dd, mm, yy), cp: cungPhi(yy, gender), gender
  }
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
  const [params, setParams] = useSearchParams()
  const [name, setName] = useState(''); const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState(''); const [g, setG] = useState('nam')
  const [res, setRes] = useState(null); const [err, setErr] = useState(''); const [copied, setCopied] = useState(false); const [saving, setSaving] = useState(false)
  const shotRef = useRef(null)
  const today = cardOfDay()

  useEffect(() => {
    const n = params.get('n') || '', d0 = params.get('d'), m0 = params.get('m'), y0 = params.get('y'), g0 = params.get('g') || 'nam'
    if (d0 && m0 && y0) {
      setName(n); setD(d0); setM(m0); setY(y0); setG(g0)
      const dd = +d0, mm = +m0, yy = +y0
      if (dd && mm && yy) setRes(compute(n, dd, mm, yy, g0))
    } // eslint-disable-next-line
  }, [])

  const calc = () => {
    const dd = +d, mm = +m, yy = +y
    if (!dd || !mm || !yy || dd < 1 || dd > 31 || mm < 1 || mm > 12 || yy < 1 || yy > 3000) { setErr('Vui lòng nhập ngày, tháng, năm sinh hợp lệ.'); setRes(null); return }
    setErr(''); setRes(compute(name, dd, mm, yy, g))
    setParams({ ...(name ? { n: name } : {}), d: '' + dd, m: '' + mm, y: '' + yy, g })
  }
  const copyLink = () => {
    const qs = new URLSearchParams({ ...(name ? { n: name } : {}), d, m, y, g }).toString()
    const url = `${window.location.origin}${window.location.pathname}#/ho-so?${qs}`
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  const savePng = () => {
    if (!shotRef.current) return
    setSaving(true)
    toPng(shotRef.current, { pixelRatio: 2, backgroundColor: '#1b1206', cacheBust: true })
      .then(dataUrl => { const a = document.createElement('a'); a.download = 'ho-so-tam-so' + (res.name ? '-' + res.name.replace(/\s+/g, '_') : '') + '.png'; a.href = dataUrl; a.click() })
      .catch(() => alert('Không tạo được ảnh trên trình duyệt này. Bạn có thể dùng In / Lưu PDF thay thế.'))
      .finally(() => setSaving(false))
  }

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Tất cả trong một</div>
        <h1 className="gradient-text text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Hồ Sơ Tổng Hợp</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">Nhập họ tên &amp; ngày sinh một lần — xem bức chân dung từ cả năm hệ thống, kèm cung phi hợp hướng. Chia sẻ, tải ảnh hoặc lưu PDF.</p>
      </section>

      <section className="wrap py-6">
        <div className="panel p-[26px] max-w-[860px] mx-auto">
          <div className="flex gap-3 flex-wrap items-end justify-center">
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Họ và tên (tùy chọn)</label><input value={name} onChange={e => setName(e.target.value)} placeholder="VD Nguyễn Văn An" className="field-input w-[220px]" /></div>
            <Field label="Ngày" value={d} set={setD} ph="22" />
            <Field label="Tháng" value={m} set={setM} ph="10" />
            <Field label="Năm" value={y} set={setY} ph="1990" />
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Giới tính</label>
              <select value={g} onChange={e => setG(e.target.value)} className="field-input"><option value="nam">Nam</option><option value="nu">Nữ</option></select></div>
            <button className="btn btn-primary" onClick={calc}>✦ Lập hồ sơ</button>
          </div>
          {err && <div className="disclaimer mt-5">{err}</div>}

          {res && (
            <>
              <div className="flex gap-3 justify-center flex-wrap mt-5 no-print">
                <button className="btn btn-ghost" onClick={copyLink}>{copied ? '✓ Đã sao chép!' : '🔗 Sao chép liên kết'}</button>
                <button className="btn btn-ghost" onClick={savePng} disabled={saving}>{saving ? '⏳ Đang tạo ảnh…' : '🖼️ Tải ảnh PNG'}</button>
                <button className="btn btn-ghost" onClick={() => window.print()}>🖨️ In / Lưu PDF</button>
              </div>

              <div ref={shotRef} className="rounded-2xl p-3 mt-4">
                <div className="text-center mb-3">
                  <div className="font-serif text-gold text-[1.4rem]">✦ Tam Sở</div>
                  {res.name && <div className="font-serif text-[1.2rem] text-cream">{res.name}</div>}
                  <div className="note">{d}/{m}/{y} · {g === 'nam' ? 'Nam' : 'Nữ'}</div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade">
                  <Card to="/than-so-hoc" label="Số Chủ Đạo">
                    <div className="flex items-center gap-3"><span className="font-serif text-[3rem] text-gold leading-none">{res.lp.lp}</span><span className="font-serif text-[1.05rem]">{res.lp.info.title.replace(/^Số \d+ — /, '')}</span></div>
                  </Card>
                  {res.nn && (
                    <Card to="/than-so-hoc" label="Số Vận Mệnh">
                      <div className="flex items-center gap-3"><span className="font-serif text-[3rem] text-gold leading-none">{res.nn.expression}</span><span className="font-serif text-[1.05rem]">{NUMEROLOGY[res.nn.expression].title.replace(/^Số \d+ — /, '')}</span></div>
                    </Card>
                  )}
                  <Card to="/tu-vi" label="Tử vi · Can Chi">
                    <div className="font-serif text-[1.6rem]">{res.canChi.tenCanChi}</div>
                    <div className="mt-1">Tuổi <b>{res.canChi.conGiap}</b> · <span className={'pill h-' + res.canChi.menhHanh}>{res.canChi.napAm}</span></div>
                  </Card>
                  {res.zodiac && (
                    <Card to="/cung-hoang-dao" label="Cung hoàng đạo">
                      <div className="flex items-center gap-3"><span className="text-[2.4rem] leading-none">{res.zodiac.sym}</span>
                        <div><div className="font-serif text-[1.3rem]">{res.zodiac.ten}</div><span className={'pill ' + elColor[res.zodiac.nguyenTo]}>{res.zodiac.nguyenTo}</span></div></div>
                      <div className="note mt-2">Màu {LUCKY[res.zodiac.en].mau} · Số {LUCKY[res.zodiac.en].so}</div>
                    </Card>
                  )}
                  <Card to="/tu-vi" label="Cung phi · Bát Trạch">
                    <div className="font-serif text-[1.4rem]">Cung {res.cp.cung} <span className="note">({res.cp.menh})</span></div>
                    <div className="mt-1"><span className="badge badge-gold">{res.cp.menhTrach}</span></div>
                    <div className="note mt-2">Hướng tốt: {res.cp.good.map(x => x.dir).join(', ')}</div>
                  </Card>
                  <Card to="/tarot" label="Lá Tarot chủ đạo">
                    <div className="flex items-center gap-3"><span className="text-[2.4rem] leading-none">{res.birth.map(c => c.symbol).join(' ')}</span><span className="font-serif text-[1.1rem]">{res.birth.map(c => c.nameVi).join(' · ')}</span></div>
                  </Card>
                  <Card to="/than-so-hoc" label={'Năm cá nhân ' + CUR.getFullYear()}>
                    <div className="flex items-center gap-3"><span className="font-serif text-[3rem] text-gold leading-none">{res.py}</span><span className="font-serif text-[1.05rem]">{PERSONAL_YEAR[res.py].title.replace(/^Năm \d+ — /, '')}</span></div>
                  </Card>
                  <Card to="/tarot" label="Lá bài hôm nay">
                    <div className="flex items-center gap-3"><span className="text-[2.4rem] leading-none">{today.card.symbol}</span>
                      <div><div className="font-serif text-[1.2rem]">{today.card.nameVi}</div><span className={'text-[.8rem] font-semibold ' + (today.up ? 'text-emerald-300' : 'text-pink-300')}>{today.up ? '▲ Xuôi' : '▼ Ngược'}</span></div></div>
                  </Card>
                </div>
                <p className="note text-center mt-3 mb-0">tamso · chiêm nghiệm để hiểu mình — không phải lời tiên tri.</p>
              </div>
              <p className="note text-center mt-3 no-print">Nhấp từng thẻ để xem chi tiết. Mọi luận giải chỉ mang tính tham khảo — xem <Link to="/nguon">Nguồn &amp; Lưu ý</Link>.</p>
            </>
          )}
        </div>
      </section>
    </>
  )
}

function Field({ label, value, set, ph }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={ph} className="field-input w-[90px]" /></div>)
}
