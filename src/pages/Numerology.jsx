import { useState } from 'react'
import {
  NUMEROLOGY, computeLifePath, reduceKeep, computeNameNumbers, personalYear, NUMBER_TYPE, PERSONAL_YEAR,
  loShu, LO_SHU_LAYOUT, LO_SHU_MISSING, maturity, karmicOf, KARMIC_DEBT, personalMonth, personalDay, PERSONAL_DAY_HINT, pinnacles, letterStats
} from '../data/numerology.js'
import { Badge } from '../components/Disclaimer.jsx'

const CUR = new Date()

export default function Numerology() {
  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Numerology · Hệ Pythagorean</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Thần Số Học</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">Từ ngày sinh và họ tên, rút ra những con số cốt lõi gợi ý thiên hướng, động lực và bài học của bạn.</p>
      </section>

      <LifePathTool />
      <NameTool />

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Ý nghĩa 12 con số</h2>
        <div className="max-w-[820px] mx-auto mt-5">
          {Object.keys(NUMEROLOGY).map(k => {
            const n = NUMEROLOGY[k]
            return (
              <details key={k} className="bg-white/[.045] border border-gold/20 rounded-xl mb-2.5 overflow-hidden">
                <summary className="cursor-pointer px-[18px] py-[15px] font-serif text-[1.12rem] font-semibold marker:content-none flex items-center gap-3"><span className="text-gold text-[.9rem]">✦</span>{n.title}</summary>
                <div className="px-[18px] pb-[18px]"><div className="flex gap-2 flex-wrap mb-2.5">{n.keys.map(x => <Badge key={x}>{x}</Badge>)}</div><p>{n.desc}</p><p className="note">Điểm mạnh: {n.strengths} — Cần lưu ý: {n.watch}</p></div>
              </details>
            )
          })}
        </div>
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Nguồn &amp; lưu ý.</b> Tham khảo <a href="https://www.numerology.com/articles/your-numerology-chart/core-numbers-numerology/" target="_blank" rel="noopener">Numerology.com</a> (Pythagorean). Phương pháp <b>Đỉnh cao &amp; Thử thách</b> theo <a href="https://www.worldnumerology.com/numerology-pinnacles/" target="_blank" rel="noopener">World Numerology</a>.
          Tên tiếng Việt được <b>bỏ dấu</b> rồi quy đổi (đ→d) — quy ước phổ biến, <span className="note">cần kiểm chứng theo trường phái</span>. Không phải khoa học.
        </div>
      </section>
    </>
  )
}

function LifePathTool() {
  const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const dd = +d, mm = +m, yy = +y
    if (!dd || !mm || !yy || dd < 1 || dd > 31 || mm < 1 || mm > 12 || yy < 1 || yy > 3000) { setErr('Nhập ngày, tháng, năm hợp lệ.'); setRes(null); return }
    setErr(''); setRes(computeLifePath(dd, mm, yy))
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">① Số Chủ Đạo <span className="note">(ngày sinh)</span></h2>
      <div className="panel p-[26px] max-w-[820px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center"><Field label="Ngày" value={d} set={setD} ph="22" /><Field label="Tháng" value={m} set={setM} ph="10" /><Field label="Năm" value={y} set={setY} ph="1990" /><button className="btn btn-primary" onClick={calc}>✦ Tính</button></div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade">
            <div className="big-number">{res.lp}</div>
            <p className="note text-center not-italic text-muted">Tháng {m}→{res.rm} · Ngày {d}→{res.rd} · Năm {y}→{res.ry} ⇒ {res.rm}+{res.rd}+{res.ry}={res.sum} → <b className="text-gold">{res.lp}</b>{res.info.master ? ' (bậc thầy)' : ''}</p>
            <h3 className="text-center mt-1.5">{res.info.title}</h3>
            <div className="flex gap-2 flex-wrap justify-center mb-3">{res.info.keys.map(k => <Badge key={k}>{k}</Badge>)}</div>
            <p>{res.info.desc}</p>
            <dl className="kv"><dt className="text-muted font-semibold">Điểm mạnh</dt><dd>{res.info.strengths}</dd><dt className="text-muted font-semibold">Cần lưu ý</dt><dd>{res.info.watch}</dd></dl>
          </div>
        )}
      </div>
    </section>
  )
}

function NameTool() {
  const [name, setName] = useState(''); const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const nn = computeNameNumbers(name); const dd = +d, mm = +m, yy = +y
    if (!nn) { setErr('Nhập họ tên (có chữ cái).'); setRes(null); return }
    if (!dd || !mm || !yy) { setErr('Nhập đủ ngày, tháng, năm sinh.'); setRes(null); return }
    const lpObj = computeLifePath(dd, mm, yy)
    const py = personalYear(dd, mm, yy)
    const pm = personalMonth(py, CUR.getMonth() + 1)
    const karmic = [karmicOf(lpObj.sum), [13, 14, 16, 19].includes(dd) ? dd : null].filter(Boolean)
    setErr('')
    setRes({ ...nn, lp: lpObj.lp, birthday: dd, py, pm, pd: personalDay(pm, CUR.getDate()), maturity: maturity(lpObj.lp, nn.expression), karmic, lo: loShu(dd, mm, yy), pin: pinnacles(dd, mm, yy, lpObj.lp), stats: letterStats(name), attitude: reduceKeep(dd + mm) })
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">② Bộ số đầy đủ <span className="note">(họ tên + ngày sinh)</span></h2>
      <div className="panel p-[26px] max-w-[860px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Họ và tên</label><input value={name} onChange={e => setName(e.target.value)} placeholder="VD Nguyễn Văn An" className="field-input w-[230px]" /></div>
          <Field label="Ngày" value={d} set={setD} ph="22" /><Field label="Tháng" value={m} set={setM} ph="10" /><Field label="Năm" value={y} set={setY} ph="1990" />
          <button className="btn btn-primary" onClick={calc}>✦ Phân tích</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="mt-6 animate-fade">
            <div className="grid md:grid-cols-2 gap-4">
              <NumBlock label={NUMBER_TYPE.expression.label} n={res.expression} note={NUMBER_TYPE.expression.note} />
              <NumBlock label={NUMBER_TYPE.soulUrge.label} n={res.soulUrge} note={NUMBER_TYPE.soulUrge.note} />
              <NumBlock label={NUMBER_TYPE.personality.label} n={res.personality} note={NUMBER_TYPE.personality.note} />
              <NumBlock label="Số Trưởng Thành (Maturity)" n={res.maturity} note="Số Chủ Đạo + Số Vận Mệnh — đích bạn hướng tới ở nửa sau cuộc đời." />
              <NumBlock label="Số Thái Độ (Attitude)" n={res.attitude} note="Ngày + tháng sinh — ấn tượng ban đầu &amp; cách bạn phản ứng tức thì với đời." />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="panel p-5">
                <div className="text-[.9rem] text-muted font-semibold mb-2">Biểu đồ Lo Shu (cửu cung)</div>
                <div className="grid grid-cols-3 gap-1.5 max-w-[220px] mx-auto">
                  {LO_SHU_LAYOUT.flat().map(num => {
                    const c = res.lo.counts[num]
                    return <div key={num} className={`aspect-square flex items-center justify-center rounded-lg border text-[1rem] ${c ? 'border-gold/40 text-cream bg-white/[.05]' : 'border-white/10 text-white/25'}`}>{c ? String(num).repeat(c) : num}</div>
                  })}
                </div>
                <p className="note mt-3 mb-0">{res.lo.missing.length ? 'Số còn thiếu: ' + res.lo.missing.join(', ') + '.' : 'Đủ cả 9 số — hiếm gặp!'}</p>
                {res.lo.missing.slice(0, 2).map(mn => <p key={mn} className="note m-0">• {LO_SHU_MISSING[mn]}</p>)}
              </div>
              <div className="panel p-5">
                <div className="text-[.9rem] text-muted font-semibold mb-1">Năng lượng thời gian</div>
                <p className="m-0"><span className="badge badge-gold">Năm {CUR.getFullYear()}: {res.py}</span> {PERSONAL_YEAR[res.py].title}</p>
                <p className="m-0 mt-1.5">{PERSONAL_YEAR[res.py].desc}</p>
                <p className="m-0 mt-2"><b>Tháng cá nhân:</b> {res.pm} · <b>Ngày hôm nay:</b> {res.pd} — {PERSONAL_DAY_HINT[res.pd]}</p>
                {res.karmic.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[.9rem] text-pink-300 font-semibold">Nợ nghiệp (Karmic Debt)</div>
                    {res.karmic.map(k => <p key={k} className="note m-0">• {KARMIC_DEBT[k]}</p>)}
                  </div>
                )}
              </div>
            </div>
            <div className="panel p-5 mt-4">
              <div className="text-[.9rem] text-muted font-semibold mb-2">Đỉnh cao &amp; Thử thách <span className="note">(4 chu kỳ đời)</span></div>
              <div className="overflow-x-auto"><table className="data"><thead><tr><th>Chu kỳ</th><th>Tuổi</th><th>Đỉnh</th><th>Thử thách</th></tr></thead>
                <tbody>{res.pin.map((p, i) => <tr key={i}><td>{i + 1}</td><td>{p.from}–{p.to ?? '…'}</td><td><b className="text-gold">{p.p}</b>{NUMEROLOGY[p.p] ? ' · ' + NUMEROLOGY[p.p].keys[0] : ''}</td><td><b>{p.c}</b>{p.c === 0 ? ' · lựa chọn' : NUMEROLOGY[p.c] ? ' · ' + NUMEROLOGY[p.c].keys[0] : ''}</td></tr>)}</tbody></table></div>
              <p className="note mt-2 mb-0">Đỉnh = cơ hội của giai đoạn; Thử thách = bài học cần vượt (số 0 = "thử thách của sự lựa chọn"). Ý nghĩa từng số xem mục "12 con số" bên dưới.</p>
            </div>
            <div className="panel p-5 mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[.9rem] text-gold font-semibold mb-1">Đam mê tiềm ẩn</div>
                  {res.stats.passion.length ? <p className="m-0">{res.stats.passion.map(n => <span key={n} className="mr-3"><b className="text-cream">{n}</b> {NUMEROLOGY[n] ? '· ' + NUMEROLOGY[n].keys[0] : ''}</span>)}</p> : <p className="note m-0">—</p>}
                  <p className="note mt-1 mb-0">Con số lặp nhiều nhất trong tên — thiên hướng nổi trội.</p>
                </div>
                <div>
                  <div className="text-[.9rem] text-pink-300 font-semibold mb-1">Bài học nghiệp quả</div>
                  {res.stats.missing.length ? <p className="m-0">{res.stats.missing.map(n => <span key={n} className="mr-3"><b className="text-cream">{n}</b> {NUMEROLOGY[n] ? '· ' + NUMEROLOGY[n].keys[0] : ''}</span>)}</p> : <p className="note m-0">Đủ cả 9 — hiếm gặp!</p>}
                  <p className="note mt-1 mb-0">Con số vắng mặt trong tên — bài học cần trau dồi.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function NumBlock({ label, n, note }) {
  const info = NUMEROLOGY[n]
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-2"><span className="text-[.9rem] text-muted font-semibold">{label}</span><span className="font-serif text-[2rem] text-gold leading-none">{n}</span></div>
      <p className="note mt-1">{note}</p>
      <div className="flex gap-2 flex-wrap my-2">{info.keys.map(k => <Badge key={k}>{k}</Badge>)}</div>
      <p className="m-0 text-[.9rem] leading-relaxed"><b>{info.title.replace(/^(Số|Năm) \d+ — /, '')}.</b> {info.desc}</p>
    </div>
  )
}

function Field({ label, value, set, ph }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={ph} className="field-input w-[100px]" /></div>)
}
