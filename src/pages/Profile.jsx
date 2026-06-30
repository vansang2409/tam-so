import { usePageSeo } from '../components/useSeo.js'
import { useState, useEffect, useRef } from 'react'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { Link, useSearchParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { computeLifePath, computeNameNumbers, personalYear, PERSONAL_YEAR, NUMEROLOGY, pinnacles } from '../data/numerology.js'
import { tinhCanChi, cungPhi, dayCanChi, hourCanChi, saoHan, hopTuoiChi, DIA_CHI } from '../data/tuvi.js'
import { getZodiac, LUCKY, decanOf } from '../data/zodiac.js'
import { TAROT_CARDS, cardOfDay, birthCards } from '../data/tarot.js'
import { solar2lunar } from '../data/lunar.js'
import { anSao, hourToRank } from '../data/tuvidauso.js'
import { buildReport } from '../data/report.js'
import { useAuth } from '../components/AuthProvider.jsx'
import { PROFILE_SELECT, normalizeProfileForm, profileFormToRow, profileRowToForm, profileSyncErrorMessage } from '../data/supabaseProfile.js'

const CUR = new Date()
const elColor = { 'Lửa': 'h-Hỏa', 'Đất': 'h-Thổ', 'Khí': 'h-Kim', 'Nước': 'h-Thủy' }

function hopKhacLine(chi) {
  const g = { 'Tam hợp': [], 'Lục hợp': [], 'Lục xung': [], 'Tứ hành xung': [] }
  DIA_CHI.forEach(z => { const r = hopTuoiChi(chi, z.ten); if (g[r]) g[r].push(z.con) })
  return `Tuổi hợp/khắc — Tam hợp: ${g['Tam hợp'].join(', ') || '—'}; Lục hợp: ${g['Lục hợp'].join(', ') || '—'}; Lục xung: ${g['Lục xung'].join(', ') || '—'}; Tứ hành xung: ${g['Tứ hành xung'].join(', ') || '—'}.`
}

function compute(name, dd, mm, yy, gender, hour, topic, question) {
  const al = solar2lunar(dd, mm, yy)
  const lp = computeLifePath(dd, mm, yy)
  const pin = pinnacles(dd, mm, yy, lp.lp)
  const age = CUR.getFullYear() - yy
  const curPin = pin.find(p => p.to === null || age < p.to) || pin[pin.length - 1]
  const hourCC = (hour !== '' && hour != null && !isNaN(+hour) && +hour >= 0 && +hour <= 23) ? hourCanChi(dayCanChi(yy, mm, dd).canIdx, +hour) : null
  const nowL = solar2lunar(CUR.getDate(), CUR.getMonth() + 1, CUR.getFullYear()).year
  const sao = saoHan(nowL - al.year + 1, gender)
  const laso = (hour !== '' && hour != null && !isNaN(+hour) && +hour >= 0 && +hour <= 23) ? anSao({ lunarDay: al.day, lunarMonth: al.month, year: al.year, hourRank: hourToRank(+hour), gender }) : null
  let menhStars = ''
  if (laso) { const ms = laso.palaces[laso.menhIdx].sao.filter(s => s.loai === 'chinh').map(s => s.ten); menhStars = ms.join(', ') || 'Vô chính diệu' }
  const base = {
    name, lp, nn: name && name.trim() ? computeNameNumbers(name) : null,
    canChi: tinhCanChi(al.year), zodiac: getZodiac(dd, mm), birth: birthCards(dd, mm, yy),
    py: personalYear(dd, mm, CUR.getFullYear()), cp: cungPhi(al.year, gender), gender, al, curPin, age, decan: decanOf(dd, mm),
    hour: hour == null ? '' : ('' + hour), topic: topic || 'Tổng quan', question: (question || '').trim(),
    noHour: hour == null || hour === '' || isNaN(+hour), hourCC, sao
  }
  base.laso = laso; base.menhStars = menhStars
  base.report = buildReport(base, cardOfDay())
  return base
}

function Card({ to, label, children }) {
  return (
    <Link to={to} className="panel route3d-card p-5 block no-underline hover:-translate-y-1 hover:border-gold/40 transition">
      <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-2">{label}</div>
      {children}
    </Link>
  )
}

export default function Profile() {
  usePageSeo({ title: 'Hồ sơ huyền học tổng hợp — gộp mọi hệ vào một trang | Tam Sở', description: 'Nhập một lần ngày sinh để xem tổng hợp lá Tarot chủ đạo, Thần số học, Can Chi, lá số Tử Vi và cung hoàng đạo trong một báo cáo, xuất PDF/PNG.', path: '/ho-so', breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Hồ sơ tổng hợp' }] })

  const [params, setParams] = useSearchParams()
  const [name, setName] = useState(''); const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState(''); const [g, setG] = useState('nam')
  const [hour, setHour] = useState(''); const [topic, setTopic] = useState('Tổng quan'); const [question, setQuestion] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState(''); const [copied, setCopied] = useState(false); const [repCopied, setRepCopied] = useState(false); const [saving, setSaving] = useState(false)
  const [hist, setHist] = useState([])
  const [syncMsg, setSyncMsg] = useState('')
  const [syncKind, setSyncKind] = useState('note')
  const shotRef = useRef(null)
  const { user, configured, supabase } = useAuth()
  const canSyncProfile = Boolean(configured && supabase && user?.id)
  const showSyncWarning = Boolean(configured && syncKind === 'warn' && syncMsg)
  const today = cardOfDay()

  const buildProfileParams = (entry) => {
    const h = normalizeProfileForm(entry)
    return { ...(h.n ? { n: h.n } : {}), d: h.d, m: h.m, y: h.y, g: h.g, ...(h.h !== '' ? { h: h.h } : {}), t: h.t, ...(h.q ? { q: h.q } : {}) }
  }

  const applyProfile = (entry, opts = {}) => {
    const h = normalizeProfileForm(entry)
    setName(h.n); setD(h.d); setM(h.m); setY(h.y); setG(h.g); setHour(h.h); setTopic(h.t); setQuestion(h.q)
    if (h.d && h.m && h.y) {
      setErr('')
      setRes(compute(h.n, +h.d, +h.m, +h.y, h.g, h.h, h.t, h.q))
      if (opts.params) setParams(buildProfileParams(h))
      if (opts.local !== false) { try { localStorage.setItem('tamso_profile', JSON.stringify(h)) } catch (_) { } }
    }
  }

  const saveRemoteProfile = async (entry) => {
    if (!canSyncProfile) return
    setSyncKind('note'); setSyncMsg('Đang lưu hồ sơ lên Supabase...')
    const { error } = await supabase.from('profiles').upsert(profileFormToRow(user.id, entry), { onConflict: 'id' })
    if (error) { setSyncKind('warn'); setSyncMsg(profileSyncErrorMessage(error)); return }
    setSyncKind('ok'); setSyncMsg('Đã lưu hồ sơ lên Supabase.')
  }

  useEffect(() => {
    try { setHist(JSON.parse(localStorage.getItem('tamso_profile_hist') || '[]')) } catch (_) { }
    const n = params.get('n') || '', d0 = params.get('d'), m0 = params.get('m'), y0 = params.get('y'), g0 = params.get('g') || 'nam'
    const h0 = params.get('h') || '', t0 = params.get('t') || 'Tổng quan', q0 = params.get('q') || ''
    if (d0 && m0 && y0) {
      applyProfile({ n, d: d0, m: m0, y: y0, g: g0, h: h0, t: t0, q: q0 }, { local: false })
    } else {
      try {
        const sv = JSON.parse(localStorage.getItem('tamso_profile') || 'null')
        if (sv && sv.d && sv.m && sv.y) applyProfile(sv, { local: false })
      } catch (_) { }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!configured) { setSyncKind('warn'); setSyncMsg('Chưa nối Supabase nên hồ sơ chỉ lưu trên trình duyệt này.'); return undefined }
    if (!user || !supabase) { setSyncKind('note'); setSyncMsg('Đăng nhập để đồng bộ Hồ sơ tổng hợp giữa các thiết bị.'); return undefined }
    const hasSharedParams = Boolean(params.get('d') && params.get('m') && params.get('y'))
    if (hasSharedParams) { setSyncKind('note'); setSyncMsg('Bạn đang xem hồ sơ từ liên kết chia sẻ. Bấm “Lập hồ sơ” để lưu vào tài khoản Supabase.'); return undefined }
    let alive = true
    setSyncKind('note'); setSyncMsg('Đang tải hồ sơ từ Supabase...')
    supabase.from('profiles').select(PROFILE_SELECT).eq('id', user.id).maybeSingle().then(({ data, error }) => {
      if (!alive) return
      if (error) { setSyncKind('warn'); setSyncMsg(profileSyncErrorMessage(error)); return }
      if (!data) { setSyncKind('note'); setSyncMsg('Đã đăng nhập. Lập hồ sơ lần đầu để lưu lên Supabase.'); return }
      applyProfile(profileRowToForm(data), { local: true })
      setSyncKind('ok'); setSyncMsg('Đã tải hồ sơ từ Supabase.')
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, configured, supabase])

  const calc = () => {
    const dd = +d, mm = +m, yy = +y
    if (!dd || !mm || !yy || dd < 1 || dd > 31 || mm < 1 || mm > 12 || yy < 1 || yy > 3000) { setErr('Vui lòng nhập ngày, tháng, năm sinh hợp lệ.'); setRes(null); return }
    const entry = normalizeProfileForm({ n: name, d: '' + dd, m: '' + mm, y: '' + yy, g, h: '' + hour, t: topic, q: question })
    setErr(''); setRes(compute(entry.n, +entry.d, +entry.m, +entry.y, entry.g, entry.h, entry.t, entry.q))
    setParams(buildProfileParams(entry))
    try { localStorage.setItem('tamso_profile', JSON.stringify(entry)) } catch (_) { }
    saveHist(entry)
    saveRemoteProfile(entry)
  }
  const saveHist = (e) => {
    setHist(prev => {
      const key = x => (x.n || '') + x.d + '-' + x.m + '-' + x.y + '-' + x.g
      const next = [e, ...prev.filter(x => key(x) !== key(e))].slice(0, 6)
      try { localStorage.setItem('tamso_profile_hist', JSON.stringify(next)) } catch (_) { }
      return next
    })
  }
  const loadProfile = (h) => {
    applyProfile(h, { params: true, local: false })
    window.scrollTo(0, 0)
  }
  const clearHist = () => { setHist([]); try { localStorage.removeItem('tamso_profile_hist') } catch (_) { } }
  const copyReport = () => {
    if (!res || !res.report) return
    const r = res.report
    const txt = [r.intro, r.focus, r.topicNote, r.saoNote, r.tuVi, hopKhacLine(res.canChi.chi), 'Gợi ý 7 ngày tới:', ...r.week].filter(Boolean).join('\n\n')
    navigator.clipboard?.writeText(txt).then(() => { setRepCopied(true); setTimeout(() => setRepCopied(false), 2000) })
  }
  const downloadReport = () => {
    if (!res || !res.report) return
    const r = res.report
    const txt = ['TAM SỞ — BÁO CÁO TỔNG HỢP', res.name ? 'Tên: ' + res.name : '', d + '/' + m + '/' + y, '', r.intro, r.focus, r.topicNote, r.saoNote, r.tuVi, hopKhacLine(res.canChi.chi), 'Gợi ý 7 ngày tới:', ...r.week].filter(Boolean).join('\n\n')
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bao-cao-tam-so' + (res.name ? '-' + res.name.replace(/\s+/g, '_') : '') + '.txt'; a.click(); URL.revokeObjectURL(a.href)
  }
  const copyLink = () => {
    const qs = new URLSearchParams({ ...(name ? { n: name } : {}), d, m, y, g, ...(hour !== '' ? { h: hour } : {}), t: topic, ...(question.trim() ? { q: question.trim() } : {}) }).toString()
    const url = routeShareUrl('/ho-so', qs)
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
        <div className="text-gold text-kicker uppercase">Tất cả trong một</div>
        <h1 className="gradient-text text-display my-3">Hồ Sơ Tổng Hợp</h1>
        <p className="text-muted text-lead max-w-[680px] mx-auto">Nhập họ tên &amp; ngày sinh một lần — xem bức chân dung từ cả năm hệ thống, kèm cung phi hợp hướng. Chia sẻ, tải ảnh hoặc lưu PDF.</p>
      </section>

      <section className="wrap py-6">
        <div className="panel route3d-panel p-[26px] max-w-[860px] mx-auto">
          <div className="flex gap-3 flex-wrap items-end justify-center">
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Họ và tên (tùy chọn)</label><input value={name} onChange={e => setName(e.target.value)} placeholder="VD Nguyễn Văn An" className="field-input w-[220px]" /></div>
            <Field label="Ngày" value={d} set={setD} ph="22" />
            <Field label="Tháng" value={m} set={setM} ph="10" />
            <Field label="Năm" value={y} set={setY} ph="1990" />
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Giới tính</label>
              <select value={g} onChange={e => setG(e.target.value)} className="field-input"><option value="nam">Nam</option><option value="nu">Nữ</option></select></div>
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Giờ sinh (tùy chọn)</label>
              <input type="number" value={hour} onChange={e => setHour(e.target.value)} placeholder="0–23" className="field-input w-[110px]" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Chủ đề</label>
              <select value={topic} onChange={e => setTopic(e.target.value)} className="field-input"><option>Tổng quan</option><option>Tình yêu</option><option>Công việc</option><option>Tài chính</option></select></div>
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Câu hỏi (tùy chọn)</label>
              <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Điều bạn đang băn khoăn…" className="field-input w-[220px]" /></div>
            <button className="btn btn-primary" onClick={calc}>✦ Lập hồ sơ</button>
          </div>
          {err && <div className="disclaimer mt-5">{err}</div>}
          {showSyncWarning && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
              <b>Hồ sơ chưa đồng bộ.</b> {syncMsg}
            </div>
          )}
          {hist.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap items-center justify-center no-print">
              <span className="note">Gần đây:</span>
              {hist.map((h, i) => <button key={i} onClick={() => loadProfile(h)} className="badge cursor-pointer hover:text-gold">{h.n || (h.d + '/' + h.m + '/' + h.y)}</button>)}
              <button onClick={clearHist} className="note hover:text-rose-700 dark:text-rose-400">xóa</button>
            </div>
          )}

          {res && (
            <>
              <div className="flex gap-3 justify-center flex-wrap mt-5 no-print">
                <button className="btn btn-ghost" onClick={copyLink}>{copied ? '✓ Đã sao chép!' : '🔗 Sao chép liên kết'}</button>
                <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(routeShareUrl('/ho-so', new URLSearchParams({ ...(name ? { n: name } : {}), d, m, y, g, ...(hour !== '' ? { h: hour } : {}), t: topic, ...(question.trim() ? { q: question.trim() } : {}) }).toString()))} target="_blank" rel="noopener">📘 Chia sẻ</a>
                <button className="btn btn-ghost" onClick={savePng} disabled={saving}>{saving ? '⏳ Đang tạo ảnh…' : '🖼️ Tải ảnh PNG'}</button>
                <button className="btn btn-ghost" onClick={() => window.print()}>🖨️ In / Lưu PDF</button>
              </div>
              {res.noHour && <div className="disclaimer mt-4 no-print">Bạn chưa nhập giờ sinh nên phần tử vi chỉ được phân tích ở mức cơ bản.</div>}

              <div ref={shotRef} className="rounded-2xl p-3 mt-4">
                <div className="text-center mb-3">
                  <div className="font-serif text-gold text-[1.4rem]">✦ Tam Sở</div>
                  {res.name && <div className="font-serif text-[1.2rem] text-cream">{res.name}</div>}
                  <div className="note">{d}/{m}/{y}{res.hour !== '' ? ' · ' + res.hour + 'h' : ''} · {g === 'nam' ? 'Nam' : 'Nữ'} · {res.topic}</div>
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
                  {res.nn && (
                    <Card to="/than-so-hoc" label="Số Linh Hồn">
                      <div className="flex items-center gap-3"><span className="font-serif text-[3rem] text-gold leading-none">{res.nn.soulUrge}</span><span className="font-serif text-[1.05rem]">{NUMEROLOGY[res.nn.soulUrge].title.replace(/^Số \d+ — /, '')}</span></div>
                    </Card>
                  )}
                  {res.nn && (
                    <Card to="/than-so-hoc" label="Số Nhân Cách">
                      <div className="flex items-center gap-3"><span className="font-serif text-[3rem] text-gold leading-none">{res.nn.personality}</span><span className="font-serif text-[1.05rem]">{NUMEROLOGY[res.nn.personality].title.replace(/^Số \d+ — /, '')}</span></div>
                    </Card>
                  )}
                  <Card to="/tu-vi" label="Tử vi · Can Chi">
                    <div className="font-serif text-[1.6rem]">{res.canChi.tenCanChi}</div>
                    <div className="mt-1">Tuổi <b>{res.canChi.conGiap}</b> · <span className={'pill h-' + res.canChi.menhHanh}>{res.canChi.napAm}</span></div>
                    <div className="note mt-1">Âm lịch {res.al.day}/{res.al.month}{res.al.leap ? ' (nhuận)' : ''}/{res.al.year}</div>
                    {res.hourCC && <div className="note mt-1">Giờ sinh: <b className="text-cream">{res.hourCC.tenCanChi}</b> ({res.hourCC.range}h)</div>}
                  </Card>
                  {res.zodiac && (
                    <Card to="/cung-hoang-dao" label="Cung hoàng đạo">
                      <div className="flex items-center gap-3"><span className="text-[2.4rem] leading-none">{res.zodiac.sym}</span>
                        <div><div className="font-serif text-[1.3rem]">{res.zodiac.ten}</div><span className={'pill ' + elColor[res.zodiac.nguyenTo]}>{res.zodiac.nguyenTo}</span></div></div>
                      {res.decan && <div className="note mt-1">Decan {res.decan.num}{res.decan.pure ? ' (thuần)' : ' · ' + res.decan.sub.ten}</div>}
                      <div className="note mt-2">Màu {LUCKY[res.zodiac.en].mau} · Số {LUCKY[res.zodiac.en].so}</div>
                    </Card>
                  )}
                  <Card to="/tu-vi" label="Cung phi · Bát Trạch">
                    <div className="font-serif text-[1.4rem]">Cung {res.cp.cung} <span className="note">({res.cp.menh})</span></div>
                    <div className="mt-1"><span className="badge badge-gold">{res.cp.menhTrach}</span></div>
                    <div className="note mt-2">Hướng tốt: {res.cp.good.map(x => x.dir).join(', ')}</div>
                  </Card>
                  {res.laso && (
                    <Card to={'/la-so-tu-vi?' + new URLSearchParams({ d, m, y, h: String(hourToRank(+res.hour)), g }).toString()} label="Lá số Tử Vi (Mệnh)">
                      <div className="font-serif text-[1.4rem]">Mệnh tại {res.laso.menhChi}</div>
                      <div className="mt-1 leading-snug"><b className="text-cream">{res.menhStars}</b></div>
                      <div className="note mt-1">Cục {res.laso.cuc.ten} · Thân cư {res.laso.thanCu}</div>
                      <div className="note mt-0.5">Cách cục: <b className="text-cream">{res.laso.menhCach.ten}</b></div>
                    </Card>
                  )}
                  <Card to="/tu-vi" label="Tuổi hợp / khắc">
                    {(() => {
                      const me = res.canChi.chi
                      const g = { 'Tam hợp': [], 'Lục hợp': [], 'Lục xung': [], 'Tứ hành xung': [] }
                      DIA_CHI.forEach(z => { const r = hopTuoiChi(me, z.ten); if (g[r]) g[r].push(z.con) })
                      return (
                        <div className="text-[.95rem] leading-relaxed">
                          <div><span className="text-emerald-800 dark:text-emerald-400 font-semibold">Tam hợp:</span> {g['Tam hợp'].join(', ') || '—'}</div>
                          <div><span className="text-emerald-800 dark:text-emerald-400 font-semibold">Lục hợp:</span> {g['Lục hợp'].join(', ') || '—'}</div>
                          <div className="mt-0.5"><span className="text-rose-700 dark:text-rose-400 font-semibold">Lục xung:</span> {g['Lục xung'].join(', ') || '—'}</div>
                          <div className="note">Tứ hành xung: {g['Tứ hành xung'].join(', ') || '—'}</div>
                        </div>
                      )
                    })()}
                  </Card>
                  <Card to="/tarot" label="Lá Tarot chủ đạo">
                    <div className="flex items-center gap-3"><span className="text-[2.4rem] leading-none">{res.birth.map(c => c.symbol).join(' ')}</span><span className="font-serif text-[1.1rem]">{res.birth.map(c => c.nameVi).join(' · ')}</span></div>
                  </Card>
                  <Card to="/than-so-hoc" label={'Năm cá nhân ' + CUR.getFullYear()}>
                    <div className="flex items-center gap-3"><span className="font-serif text-[3rem] text-gold leading-none">{res.py}</span><span className="font-serif text-[1.05rem]">{PERSONAL_YEAR[res.py].title.replace(/^Năm \d+ — /, '')}</span></div>
                  </Card>
                  <Card to="/than-so-hoc" label={'Đỉnh hiện tại · ~' + res.age + ' tuổi'}>
                    <div className="flex items-center gap-3"><span className="font-serif text-[3rem] text-gold leading-none">{res.curPin.p}</span><div><div className="font-serif text-[1.05rem]">{NUMEROLOGY[res.curPin.p] ? NUMEROLOGY[res.curPin.p].title.replace(/^Số \d+ — /, '') : ''}</div><span className="note">Thử thách: {res.curPin.c}</span></div></div>
                  </Card>
                  <Card to="/tarot" label="Lá bài hôm nay">
                    <div className="flex items-center gap-3"><span className="text-[2.4rem] leading-none">{today.card.symbol}</span>
                      <div><div className="font-serif text-[1.2rem]">{today.card.nameVi}</div><span className={'text-[.8rem] font-semibold ' + (today.up ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400')}>{today.up ? '▲ Xuôi' : '▼ Ngược'}</span></div></div>
                  </Card>
                </div>
                <p className="note text-center mt-3 mb-0">tamso · chiêm nghiệm để hiểu mình — không phải lời tiên tri.</p>
              </div>
              {res.report && (
                <div className="panel p-5 mt-5 text-left">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Báo cáo tổng hợp <span className="note">(tự động · tham khảo)</span></div>
                    <div className="flex gap-1.5"><button onClick={downloadReport} className="btn btn-ghost text-[.78rem] py-1 px-2.5 no-print">📄 .txt</button><button onClick={copyReport} className="btn btn-ghost text-[.78rem] py-1 px-2.5 no-print">{repCopied ? '✓ Đã chép' : '📋 Chép'}</button></div>
                  </div>
                  {res.report.weave && <p className="m-0 mb-3 leading-relaxed text-cream border-l-2 border-gold/50 pl-3 italic">{res.report.weave}</p>}
                  <p className="m-0 mb-2 leading-relaxed">{res.report.intro}</p>
                  <p className="m-0 mb-3 leading-relaxed">{res.report.focus}</p>
                  {res.report.topicNote && <p className="m-0 mb-3 leading-relaxed text-cream">{res.report.topicNote}</p>}
                  {res.report.saoNote && <p className="m-0 mb-3 leading-relaxed note">{res.report.saoNote}</p>}
                  {res.report.tuVi && <p className="m-0 mb-3 leading-relaxed note">{res.report.tuVi}</p>}
                  <div className="text-gold text-[.9rem] font-semibold mb-1">Gợi ý 7 ngày tới</div>
                  <ol className="m-0 pl-5">{res.report.week.map((w, i) => <li key={i} className="text-[.95rem] mb-1">{w}</li>)}</ol>
                  <p className="note mt-3 mb-0">Tổng hợp tự động từ hồ sơ để bạn chiêm nghiệm — không phải lời tiên tri, không thay tư vấn chuyên môn.</p>
                </div>
              )}
              <p className="note text-center mt-3 no-print">Nhấp từng thẻ để xem chi tiết. Mọi luận giải chỉ mang tính tham khảo.</p>
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
