import { useState, useEffect, useRef } from 'react'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { Link, useSearchParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { computeLifePath, lifePathCompat } from '../data/numerology.js'
import { xemHopTuoi } from '../data/tuvi.js'
import { getZodiac, zodiacCompat } from '../data/zodiac.js'

const VC = {
  'Rất hợp': 'text-emerald-800 dark:text-emerald-400', 'Hợp': 'text-emerald-800 dark:text-emerald-400', 'Đồng điệu': 'text-emerald-800 dark:text-emerald-400', 'Có điểm chung': 'text-emerald-800 dark:text-emerald-400',
  'Bổ sung cho nhau': 'text-amber-800 dark:text-amber-400', 'Bình hòa': 'text-amber-800 dark:text-amber-400', 'Trung bình': 'text-amber-800 dark:text-amber-400',
  'Cần dung hòa': 'text-rose-700 dark:text-rose-400', 'Cần lưu ý': 'text-rose-700 dark:text-rose-400', 'Khá xung khắc': 'text-rose-700 dark:text-rose-400'
}
const vc = v => VC[v] || 'text-cream'
const _POS = ['Rất hợp', 'Hợp', 'Đồng điệu', 'Có điểm chung']
const _NEG = ['Cần dung hòa', 'Cần lưu ý', 'Khá xung khắc']
function overall(res) {
  const vs = [res.num.verdict, res.canchi.verdict, res.zod && res.zod.verdict].filter(Boolean)
  let sc = 0; vs.forEach(v => { if (_POS.includes(v)) sc++; else if (_NEG.includes(v)) sc-- })
  const lean = sc >= 2 ? 'nghiêng nhiều về hòa hợp' : sc === 1 ? 'nghiêng về hòa hợp' : sc === 0 ? 'khá cân bằng — có phần hợp, có phần cần dung hòa' : 'cho thấy vài điểm cần vun đắp thêm'
  return 'Nhìn chung, ba hệ ' + lean + '. Điều đáng giá không nằm ở "điểm số" mà ở chỗ hai người hiểu và tôn trọng khác biệt của nhau.'
}

function build(P1, P2) {
  const ok = p => { const d = +p.d, m = +p.m, y = +p.y; return (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1 && y <= 3000) ? { d, m, y } : null }
  const a = ok(P1), b = ok(P2); if (!a || !b) return null
  const lp1 = computeLifePath(a.d, a.m, a.y).lp, lp2 = computeLifePath(b.d, b.m, b.y).lp
  const z1 = getZodiac(a.d, a.m), z2 = getZodiac(b.d, b.m)
  return { lp1, lp2, num: lifePathCompat(lp1, lp2), canchi: xemHopTuoi(a.y, b.y), z1, z2, zod: (z1 && z2) ? zodiacCompat(z1, z2) : null, n1: P1.name.trim() || 'Người 1', n2: P2.name.trim() || 'Người 2' }
}

function PersonFields({ idx, p, set }) {
  const f = (k, ph, w) => <input value={p[k]} onChange={e => set({ ...p, [k]: e.target.value })} placeholder={ph} className="field-input" style={{ width: w }} type={k === 'name' ? 'text' : 'number'} />
  return (
    <div className="panel p-5">
      <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-2">Người {idx}</div>
      <div className="flex gap-2 flex-wrap items-end">
        <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Tên (tùy chọn)</label>{f('name', idx === 1 ? 'Bạn' : 'Người ấy', '140px')}</div>
        <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Ngày</label>{f('d', '22', '70px')}</div>
        <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Tháng</label>{f('m', '10', '70px')}</div>
        <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Năm</label>{f('y', '1990', '90px')}</div>
      </div>
    </div>
  )
}

export default function TuongHop() {
  const [params, setParams] = useSearchParams()
  const [p1, setP1] = useState({ name: '', d: '', m: '', y: '' })
  const [p2, setP2] = useState({ name: '', d: '', m: '', y: '' })
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const [copied, setCopied] = useState(false); const [saving, setSaving] = useState(false)
  const shotRef = useRef(null)

  useEffect(() => {
    const g = k => params.get(k) || ''
    if (g('d1') && g('m1') && g('y1') && g('d2') && g('m2') && g('y2')) {
      const a = { name: g('n1'), d: g('d1'), m: g('m1'), y: g('y1') }, b = { name: g('n2'), d: g('d2'), m: g('m2'), y: g('y2') }
      setP1(a); setP2(b); const r = build(a, b); if (r) setRes(r)
    } // eslint-disable-next-line
  }, [])

  const qs = () => new URLSearchParams({ d1: p1.d, m1: p1.m, y1: p1.y, d2: p2.d, m2: p2.m, y2: p2.y, ...(p1.name.trim() ? { n1: p1.name.trim() } : {}), ...(p2.name.trim() ? { n2: p2.name.trim() } : {}) }).toString()
  const shareUrl = () => routeShareUrl('/tuong-hop', qs())
  const calc = () => {
    const r = build(p1, p2)
    if (!r) { setErr('Nhập đủ ngày/tháng/năm hợp lệ cho cả hai người.'); setRes(null); return }
    setErr(''); setRes(r); setParams(new URLSearchParams(qs()))
  }
  const copyLink = () => { navigator.clipboard?.writeText(shareUrl()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }) }
  const savePng = () => {
    if (!shotRef.current) return
    setSaving(true)
    toPng(shotRef.current, { pixelRatio: 2, backgroundColor: '#1b1206', cacheBust: true })
      .then(u => { const a = document.createElement('a'); a.download = 'tuong-hop-tam-so.png'; a.href = u; a.click() })
      .catch(() => alert('Không tạo được ảnh trên trình duyệt này.'))
      .finally(() => setSaving(false))
  }

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold text-kicker uppercase">Hai người · Ba hệ chiêm nghiệm</div>
        <h1 className="text-display my-3">Tương Hợp</h1>
        <p className="text-muted text-lead max-w-[680px] mx-auto">Nhập ngày sinh hai người để soi tương hợp qua <b>Số Chủ Đạo</b>, <b>Can Chi</b> và <b>Cung hoàng đạo</b> — rồi chia sẻ cho người ấy hoặc bạn bè. Một góc để hiểu nhau hơn, không phải phán xét duyên số.</p>
      </section>

      <section className="wrap py-6">
        <div className="panel route3d-panel p-[26px] max-w-[860px] mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <PersonFields idx={1} p={p1} set={setP1} />
            <PersonFields idx={2} p={p2} set={setP2} />
          </div>
          <div className="text-center mt-5"><button className="btn btn-primary" onClick={calc}>💞 Xem tương hợp</button></div>
          {err && <div className="disclaimer mt-5">{err}</div>}

          {res && (
            <div className="mt-6 animate-fade">
              <div className="flex gap-2 justify-center flex-wrap mb-4 no-print">
                <button className="btn btn-ghost" onClick={copyLink}>{copied ? '✓ Đã chép!' : '🔗 Sao chép liên kết'}</button>
                <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl())} target="_blank" rel="noopener">📘 Chia sẻ</a>
                <button className="btn btn-ghost" onClick={savePng} disabled={saving}>{saving ? '⏳ Đang tạo…' : '🖼️ Tải ảnh'}</button>
              </div>

              <div ref={shotRef} className="rounded-2xl p-3">
                <div className="text-center mb-3"><div className="font-serif text-gold text-[1.3rem]">✦ Tam Sở · Tương hợp</div><div className="font-serif text-cream text-[1.1rem]">{res.n1} ✕ {res.n2}</div></div>
                <div className="grid gap-4">
                  <div className="panel p-5">
                    <div className="flex items-center justify-between gap-2 flex-wrap"><div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Thần số học · Số Chủ Đạo</div><Link to="/than-so-hoc" className="note no-print">Chi tiết →</Link></div>
                    <div className="mt-1"><b>{res.n1}</b> số <b className="text-gold">{res.lp1}</b> ✕ <b>{res.n2}</b> số <b className="text-gold">{res.lp2}</b> → <span className={'font-serif text-[1.15rem] ' + vc(res.num.verdict)}>{res.num.verdict}</span></div>
                    <p className="note mt-1 mb-0">{res.num.note}</p>
                  </div>

                  <div className="panel p-5">
                    <div className="flex items-center justify-between gap-2 flex-wrap"><div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Can Chi · hợp tuổi</div><Link to="/tu-vi" className="note no-print">Chi tiết →</Link></div>
                    <div className="mt-1">{res.canchi.a.tenCanChi} ({res.canchi.a.conGiap}) ✕ {res.canchi.b.tenCanChi} ({res.canchi.b.conGiap}) → <span className={'font-serif text-[1.15rem] ' + vc(res.canchi.verdict)}>{res.canchi.verdict}</span></div>
                    <div className="flex gap-2 flex-wrap my-2">{res.canchi.notes.map((n, i) => <span key={i} className="badge">{n}</span>)}</div>
                    <p className="note m-0">Nạp âm: <span className={'pill h-' + res.canchi.a.menhHanh}>{res.canchi.a.menhHanh}</span> &amp; <span className={'pill h-' + res.canchi.b.menhHanh}>{res.canchi.b.menhHanh}</span> — {res.canchi.hanhRel.type}.</p>
                  </div>

                  {res.zod && (
                    <div className="panel p-5">
                      <div className="flex items-center justify-between gap-2 flex-wrap"><div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Cung hoàng đạo</div><Link to="/cung-hoang-dao" className="note no-print">Chi tiết →</Link></div>
                      <div className="mt-1"><span className="text-[1.3rem]">{res.z1.sym}</span> {res.z1.ten} ✕ <span className="text-[1.3rem]">{res.z2.sym}</span> {res.z2.ten} → <span className={'font-serif text-[1.15rem] ' + vc(res.zod.verdict)}>{res.zod.verdict}</span></div>
                      <p className="note mt-1 mb-0">{res.zod.note}</p>
                    </div>
                  )}
                </div>
                <div className="panel p-5 mt-4 text-center"><div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1">Tổng kết</div><p className="m-0">{overall(res)}</p></div>
                <p className="note text-center mt-3 mb-0">tamso · chiêm nghiệm để hiểu nhau — không phải lời phán về duyên phận.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="wrap py-8">
        <div className="disclaimer max-w-[900px] mx-auto"><b>Dữ kiện &amp; diễn giải.</b> Can–Chi–nạp âm là lịch pháp; còn tương hợp Can Chi, cung hoàng đạo và Số Chủ Đạo là <b>quan niệm truyền thống</b>, chỉ để tham khảo. Tương hợp Số Chủ Đạo ở đây dựa trên so khớp từ khóa (tham khảo <a href="https://www.numerology.com/articles/your-numerology-chart/core-numbers-numerology/" target="_blank" rel="noopener">Numerology.com</a>), không phải thước đo tuyệt đối. Không khẳng định điều gì về duyên số. Muốn đối chiếu thêm theo Tử Vi, xem <Link to="/so-la-so" className="text-gold">So đôi lá số</Link>.</div>
      </section>
    </>
  )
}
