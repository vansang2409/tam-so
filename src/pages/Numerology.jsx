import { useState, useEffect } from 'react'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { useSearchParams } from 'react-router-dom'
import {
  NUMEROLOGY, NUM_SAO, computeLifePath, reduceKeep, computeNameNumbers, personalYear, NUMBER_TYPE, PERSONAL_YEAR,
  loShu, LO_SHU_LAYOUT, LO_SHU_MISSING, maturity, karmicOf, KARMIC_DEBT, personalMonth, personalDay, PERSONAL_DAY_HINT, pinnacles, letterStats, birthdayNumber, lifePathCompat
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
      <LifePathMatrix />

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Ý nghĩa 12 con số</h2>
        <div className="max-w-[820px] mx-auto mt-5">
          {Object.keys(NUMEROLOGY).map(k => {
            const n = NUMEROLOGY[k]
            return (
              <details key={k} className="bg-white/[.045] border border-gold/20 rounded-xl mb-2.5 overflow-hidden">
                <summary className="cursor-pointer px-[18px] py-[15px] font-serif text-[1.12rem] font-semibold marker:content-none flex items-center gap-3"><span className="text-gold text-[.9rem]">✦</span>{n.title}</summary>
                <div className="px-[18px] pb-[18px]"><div className="flex gap-2 flex-wrap mb-2.5">{n.keys.map(x => <Badge key={x}>{x}</Badge>)}</div><p>{n.desc}</p><p className="note">Điểm mạnh: {n.strengths} — Cần lưu ý: {n.watch}</p>{NUM_SAO[k] && <p className="note m-0 mt-1">🪐 Hành tinh liên hệ: {NUM_SAO[k]} <span className="opacity-70">(theo trường phái phổ biến, chỉ tham khảo)</span></p>}</div>
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

function LifePathMatrix() {
  const vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]
  const mark = { 'Đồng điệu': '◎', 'Có điểm chung': '○', 'Bổ sung cho nhau': '+' }
  const sty = {
    'Đồng điệu': { background: 'rgba(120,210,150,.34)', color: '#d6f5e0' },
    'Có điểm chung': { background: 'rgba(120,210,150,.16)', color: '#a7e6bf' },
    'Bổ sung cho nhau': { background: 'rgba(211,162,78,.18)', color: '#ecd198' }
  }
  return (
    <section className="wrap py-8">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">Bảng hợp Số Chủ Đạo</h2>
      <p className="note text-center max-w-[640px] mx-auto mb-4">Tra nhanh sự cộng hưởng giữa hai Số Chủ Đạo (kể cả số bậc thầy 11/22/33). Di chuột/chạm vào ô để xem chi tiết — chỉ mang tính tham khảo.</p>
      <p className="note text-center mb-2 sm:hidden">← vuốt ngang để xem đủ bảng →</p>
        <div className="panel p-4 max-w-[760px] mx-auto overflow-x-auto">
        <table className="border-collapse mx-auto" style={{ minWidth: 420 }}>
          <thead>
            <tr>
              <th className="p-1 text-gold">✦</th>
              {vals.map(v => <th key={v} className="p-1 text-[.85rem] font-semibold text-cream" style={{ minWidth: 26 }}>{v}</th>)}
            </tr>
          </thead>
          <tbody>
            {vals.map(a => (
              <tr key={a}>
                <th className="p-1 pr-2 text-[.85rem] font-semibold text-cream text-right">{a}</th>
                {vals.map(b => {
                  const v = lifePathCompat(a, b).verdict
                  return (
                    <td key={b} title={`Số ${a} × Số ${b}: ${v}`} className="p-0 text-center align-middle">
                      <div className="m-[2px] rounded-md flex items-center justify-center text-[.8rem] mx-auto" style={{ width: 28, height: 28, ...sty[v] }}>{mark[v]}</div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-3 flex-wrap justify-center mt-4 text-[.82rem] text-muted">
          {Object.keys(mark).map(v => <span key={v} className="inline-flex items-center gap-1.5"><span className="rounded inline-flex items-center justify-center" style={{ width: 22, height: 22, ...sty[v] }}>{mark[v]}</span>{v}</span>)}
        </div>
      </div>
    </section>
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
  const [params, setParams] = useSearchParams()
  const [name, setName] = useState(''); const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const [copied, setCopied] = useState('')

  const compute = (nm, dd, mm, yy) => {
    const nn = computeNameNumbers(nm)
    if (!nn || !dd || !mm || !yy) return null
    const lpObj = computeLifePath(dd, mm, yy)
    const py = personalYear(dd, mm, CUR.getFullYear())
    const pm = personalMonth(py, CUR.getMonth() + 1)
    const karmic = [karmicOf(lpObj.sum), [13, 14, 16, 19].includes(dd) ? dd : null].filter(Boolean)
    return { ...nn, name: nm, dd, mm, yy, lp: lpObj.lp, birthday: dd, py, pm, pd: personalDay(pm, CUR.getDate()), maturity: maturity(lpObj.lp, nn.expression), karmic, lo: loShu(dd, mm, yy), pin: pinnacles(dd, mm, yy, lpObj.lp), stats: letterStats(nm), attitude: reduceKeep(dd + mm), bday: birthdayNumber(dd) }
  }

  useEffect(() => {
    const g = k => params.get(k) || ''
    if (g('d') && g('m') && g('y')) {
      const nm = g('n'), dd = +g('d'), mm = +g('m'), yy = +g('y')
      setName(nm); setD(g('d')); setM(g('m')); setY(g('y'))
      const r = compute(nm, dd, mm, yy); if (r) setRes(r)
    } // eslint-disable-next-line
  }, [])

  const qs = () => new URLSearchParams({ d, m, y, ...(name.trim() ? { n: name.trim() } : {}) }).toString()
  const shareUrl = () => routeShareUrl('/than-so-hoc', qs())
  const calc = () => {
    const dd = +d, mm = +m, yy = +y
    if (!computeNameNumbers(name)) { setErr('Nhập họ tên (có chữ cái).'); setRes(null); return }
    if (!dd || !mm || !yy) { setErr('Nhập đủ ngày, tháng, năm sinh.'); setRes(null); return }
    setErr(''); setRes(compute(name, dd, mm, yy)); setParams(new URLSearchParams(qs()))
  }
  const doCopy = (txt, tag) => { navigator.clipboard?.writeText(txt).then(() => { setCopied(tag); setTimeout(() => setCopied(''), 2000) }) }
  const resultText = () => res ? [
    `✦ Thần số học — ${res.name || 'Bạn'} (${res.dd}/${res.mm}/${res.yy})`,
    `Số Chủ Đạo: ${res.lp}`,
    `Vận Mệnh: ${res.expression} · Linh Hồn: ${res.soulUrge} · Nhân Cách: ${res.personality}`,
    `Trưởng Thành: ${res.maturity} · Thái Độ: ${res.attitude} · Ngày Sinh: ${res.bday}`,
    `Năm cá nhân ${CUR.getFullYear()}: ${res.py} · Ngày hôm nay: ${res.pd}`,
    res.lo.missing.length ? `Lo Shu thiếu: ${res.lo.missing.join(', ')}` : 'Lo Shu: đủ 9 số',
    `— Tam Sở ${shareUrl()}`
  ].join('\n') : ''

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
            <div className="flex gap-2 justify-center flex-wrap mb-4 no-print">
              <button className="btn btn-ghost" onClick={() => doCopy(shareUrl(), 'link')}>{copied === 'link' ? '✓ Đã chép!' : '🔗 Sao chép liên kết'}</button>
              <button className="btn btn-ghost" onClick={() => doCopy(resultText(), 'text')}>{copied === 'text' ? '✓ Đã chép!' : '📋 Chép kết quả'}</button>
              <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl())} target="_blank" rel="noopener">📘 Chia sẻ</a>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <NumBlock label={NUMBER_TYPE.expression.label} n={res.expression} note={NUMBER_TYPE.expression.note} />
              <NumBlock label={NUMBER_TYPE.soulUrge.label} n={res.soulUrge} note={NUMBER_TYPE.soulUrge.note} />
              <NumBlock label={NUMBER_TYPE.personality.label} n={res.personality} note={NUMBER_TYPE.personality.note} />
              <NumBlock label="Số Trưởng Thành (Maturity)" n={res.maturity} note="Số Chủ Đạo + Số Vận Mệnh — đích bạn hướng tới ở nửa sau cuộc đời." />
              <NumBlock label="Số Thái Độ (Attitude)" n={res.attitude} note="Ngày + tháng sinh — ấn tượng ban đầu &amp; cách bạn phản ứng tức thì với đời." />
              <NumBlock label="Số Ngày Sinh (Birthday)" n={res.bday} note="Rút gọn ngày sinh — tài năng bẩm sinh, món quà tự nhiên của bạn." />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="panel p-5">
                <div className="text-[.9rem] text-muted font-semibold mb-2">Biểu đồ Lo Shu (cửu cung)</div>
                <div className="grid grid-cols-3 gap-1.5 max-w-[220px] mx-auto">
                  {LO_SHU_LAYOUT.flat().map(num => {
                    const c = res.lo.counts[num]
                    return <div key={num} className={`aspect-square flex items-center justify-center rounded-lg border text-[1rem] ${c ? 'border-gold/40 text-cream bg-white/[.05]' : 'border-black/10 text-black/30'}`}>{c ? String(num).repeat(c) : num}</div>
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
                <p className="note m-0 mt-2">Năm tới ({CUR.getFullYear() + 1}): số <b className="text-gold">{personalYear(res.dd, res.mm, CUR.getFullYear() + 1)}</b> · ({CUR.getFullYear() + 2}): số <b className="text-gold">{personalYear(res.dd, res.mm, CUR.getFullYear() + 2)}</b> — Năm cá nhân xoay vòng 1→9 rồi lặp lại.</p>
                {res.karmic.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[.9rem] text-rose-700 font-semibold">Nợ nghiệp (Karmic Debt)</div>
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
                  <div className="text-[.9rem] text-rose-700 font-semibold mb-1">Bài học nghiệp quả</div>
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
