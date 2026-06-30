import { usePageSeo } from '../components/useSeo.js'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { toPng } from 'html-to-image'
import { solar2lunar } from '../data/lunar.js'
import { anSao, CHINH_TINH, PHU_TINH, TU_HOA_NGHIA, CUNG_NGHIA, GIO_CHI, DO_SANG_LABEL, DO_SANG_NGHIA, doSangSummary } from '../data/tuvidauso.js'
import { SAO_CUNG } from '../data/tuvi-saocung.js'
import { SAO_KHUYEN } from '../data/saoKhuyen.js'

// Vị trí 12 chi trên lá số 4×4 [cột, hàng] (1-indexed)
const POS = { 5: [1, 1], 6: [2, 1], 7: [3, 1], 8: [4, 1], 4: [1, 2], 9: [4, 2], 3: [1, 3], 10: [4, 3], 2: [1, 4], 1: [2, 4], 0: [3, 4], 11: [4, 4] }
const GIO_LABEL = ['Tý (23–1h)', 'Sửu (1–3h)', 'Dần (3–5h)', 'Mão (5–7h)', 'Thìn (7–9h)', 'Tỵ (9–11h)', 'Ngọ (11–13h)', 'Mùi (13–15h)', 'Thân (15–17h)', 'Dậu (17–19h)', 'Tuất (19–21h)', 'Hợi (21–23h)']
const SAO_CLS = { chinh: 'text-cream font-semibold', cat: 'text-emerald-800 dark:text-emerald-400', sat: 'text-rose-700 dark:text-rose-400', khac: 'text-muted' }
const DO_CLS = { M:'bg-amber-300 text-amber-900', V:'bg-emerald-200 text-emerald-900', 'Đ':'bg-sky-200 text-sky-900', B:'bg-gray-200 text-gray-700', H:'bg-rose-100 text-rose-700 dark:text-rose-400' }
const HOA_CLS = { 'Lộc': 'bg-emerald-700', 'Quyền': 'bg-amber-700', 'Khoa': 'bg-sky-700', 'Kỵ': 'bg-rose-700' }

function StarLine({ s }) {
  return (
    <span className={'inline-flex items-center gap-0.5 mr-1.5 leading-tight ' + (SAO_CLS[s.loai] || '')}>
      {s.ten}{s.do && <sup className={'text-[.55rem] ml-0.5 px-0.5 rounded ' + (DO_CLS[s.do] || '')} title={(DO_SANG_LABEL[s.do]||'') + ' — ' + (DO_SANG_NGHIA[s.do]||'')}>{s.do}</sup>}
      {s.hoa && <sup className={'text-white text-[.55rem] px-1 rounded ' + (HOA_CLS[s.hoa] || 'bg-gray-600')}>{s.hoa}</sup>}
    </span>
  )
}

function Cell({ p, active, onClick, van, tp }) {
  const [col, row] = POS[p.chiIdx]
  return (
    <button onClick={onClick} aria-label={'Cung ' + p.cung + ' tại ' + p.chi} style={{ gridColumn: col, gridRow: row }}
      className={'text-left border rounded-lg p-1.5 min-h-[96px] transition ' +
        (active ? 'border-gold bg-gold/10' : 'border-gold/20 hover:border-gold/50 bg-gold/5') + (tp && !active ? ' ring-1 ring-gold/40' : '')}>
      <div className="flex items-center justify-between gap-1">
        <span className="text-gold font-semibold text-[.74rem] leading-none">{p.cung}</span>
        <span className="text-muted text-[.62rem] leading-none">{p.chi}</span>
      </div>
      <div className="flex gap-1 mt-0.5 flex-wrap">
        {p.isMenh && <span className="text-[.55rem] bg-gold text-white px-1 rounded font-bold">MỆNH</span>}
        {p.isThan && <span className="text-[.55rem] border border-gold text-gold px-1 rounded font-bold">THÂN</span>}
        {van && van.daiHanChi === p.chiIdx && <span className="text-[.5rem] bg-amber-700 text-white px-1 rounded">ĐH</span>}
        {van && van.tieuHanChi === p.chiIdx && <span className="text-[.5rem] bg-sky-700 text-white px-1 rounded">TH</span>}
        {van && van.luuNienChi === p.chiIdx && <span className="text-[.5rem] bg-rose-700 text-white px-1 rounded">LN</span>}
      </div>
      <div className="text-[.72rem] mt-1 leading-snug">
        {p.sao.length ? p.sao.map((s, i) => <StarLine key={i} s={s} />) : <span className="text-muted/60 italic">(vô chính diệu)</span>}
      </div>
      <div className="text-[.56rem] text-muted mt-1 leading-tight">{p.daihan && <span>ĐH {p.daihan.from}–{p.daihan.to}t</span>}{p.trangSinh && <span>{p.daihan ? ' · ' : ''}{p.trangSinh}</span>}</div>
    </button>
  )
}

export default function LaSoTuVi() {
  usePageSeo({ title: 'Lập lá số Tử Vi Đẩu Số online — an sao, Tứ Hóa, đại hạn | Tam Sở', description: 'Lập lá số Tử Vi Đẩu Số từ ngày giờ sinh: an 12 cung, chính tinh – phụ tinh, Tứ Hóa, độ sáng sao và dòng đại hạn. Diễn giải truyền thống để tham khảo.', path: '/la-so-tu-vi', breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Lá số Tử Vi' }] })

  const [params, setParams] = useSearchParams()
  const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('')
  const [h, setH] = useState('7'); const [g, setG] = useState('nam')
  const [ls, setLs] = useState(null); const [err, setErr] = useState(''); const [sel, setSel] = useState(0); const [copied, setCopied] = useState(''); const [saving, setSaving] = useState(false); const [hist, setHist] = useState([]); const shotRef = useRef(null)

  const compute = (dd, mm, yy, hh, gg) => {
    if (!(dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yy >= 1900 && yy <= 2100)) return null
    const al = solar2lunar(dd, mm, yy)
    const r = anSao({ lunarDay: al.day, lunarMonth: al.month, year: al.year, hourRank: +hh, gender: gg, viewYear: new Date().getFullYear() })
    return { ...r, solar: { d: dd, m: mm, y: yy }, lunar: al }
  }
  useEffect(() => {
    try { setHist(JSON.parse(localStorage.getItem('tamso_laso_hist') || '[]')) } catch (_) { }
    const dd = +(params.get('d') || 0), mm = +(params.get('m') || 0), yy = +(params.get('y') || 0)
    const hh = +(params.get('h') || 0), gg = params.get('g') === 'nu' ? 'nu' : 'nam'
    if (dd && mm && yy) {
      setD(String(dd)); setM(String(mm)); setY(String(yy)); if (hh) setH(String(hh)); setG(gg)
      const r = compute(dd, mm, yy, hh || 7, gg); if (r) { setLs(r); setSel(r.menhIdx); saveHist({ d: String(dd), m: String(mm), y: String(yy), h: String(hh || 7), g: gg }) }
    } // eslint-disable-next-line
  }, [])
  const qs = () => new URLSearchParams({ d, m, y, h, g }).toString()
  const shareUrl = () => routeShareUrl('/la-so-tu-vi', qs())
  const lap = () => {
    const r = compute(+d, +m, +y, +h, g)
    if (!r) { setErr('Nhập ngày/tháng/năm dương lịch hợp lệ (1900–2100).'); setLs(null); return }
    setErr(''); setLs(r); setSel(r.menhIdx); setParams(new URLSearchParams(qs())); saveHist({ d, m, y, h, g })
  }
  const demo = () => {
    setD('15'); setM('8'); setY('1990'); setH('7'); setG('nam')
    const r = compute(15, 8, 1990, 7, 'nam')
    if (r) { setErr(''); setLs(r); setSel(r.menhIdx); setParams(new URLSearchParams({ d: '15', m: '8', y: '1990', h: '7', g: 'nam' })); saveHist({ d: '15', m: '8', y: '1990', h: '7', g: 'nam' }) }
  }
  const saveHist = (e) => {
    setHist(prev => {
      const key = x => x.d + '-' + x.m + '-' + x.y + '-' + x.h + '-' + x.g
      const next = [e, ...prev.filter(x => key(x) !== key(e))].slice(0, 6)
      try { localStorage.setItem('tamso_laso_hist', JSON.stringify(next)) } catch (_) { }
      return next
    })
  }
  const loadLaso = (e) => {
    setD(e.d); setM(e.m); setY(e.y); setH(e.h); setG(e.g)
    const r = compute(+e.d, +e.m, +e.y, +e.h, e.g)
    if (r) { setErr(''); setLs(r); setSel(r.menhIdx); setParams(new URLSearchParams({ d: e.d, m: e.m, y: e.y, h: e.h, g: e.g })) }
    window.scrollTo(0, 0)
  }
  const savePng = () => {
    if (!shotRef.current) return
    setSaving(true)
    toPng(shotRef.current, { pixelRatio: 2, backgroundColor: '#f5ecd6', cacheBust: true })
      .then(u => { const a = document.createElement('a'); a.download = 'la-so-tu-vi-' + d + '-' + m + '-' + y + '.png'; a.href = u; a.click() })
      .catch(() => alert('Không tạo được ảnh trên trình duyệt này. Bạn có thể dùng In / Lưu PDF.'))
      .finally(() => setSaving(false))
  }
  const downloadTxt = () => {
    if (!ls) return
    const L = ['LÁ SỐ TỬ VI ĐẨU SỐ — TAM SỞ', '']
    L.push(ls.nam + ' · ' + ls.amDuong + ' · Cục ' + ls.cuc.ten + ' · Bản mệnh ' + ls.menhHanh)
    L.push('Sinh: DL ' + ls.solar.d + '/' + ls.solar.m + '/' + ls.solar.y + ' · ÂL ' + ls.lunar.day + '/' + ls.lunar.month + '/' + ls.lunar.year + ' · giờ ' + ls.gioChi)
    L.push('Mệnh tại ' + ls.menhChi + ' · Thân cư ' + ls.thanCu + ' · Cách cục Mệnh: ' + ls.menhCach.ten)
    L.push('', '— 12 CUNG —')
    const order = [...ls.palaces].sort((a, b) => ((a.chiIdx - ls.menhIdx + 12) % 12) - ((b.chiIdx - ls.menhIdx + 12) % 12))
    for (const p of order) {
      const stars = p.sao.map(s => s.ten + (s.do ? '(' + s.do + ')' : '') + (s.hoa ? '(Hóa ' + s.hoa + ')' : '') + (s.sang ? '[' + s.sang + ']' : '')).join(', ') || 'vô chính diệu'
      L.push('• ' + p.cung + ' (' + p.chi + ')' + (p.isMenh ? ' ★Mệnh' : '') + (p.isThan ? ' ◆Thân' : '') + ': ' + stars + (p.daihan ? ' | ĐH ' + p.daihan.from + '–' + p.daihan.to + 't' : '') + (p.trangSinh ? ' | ' + p.trangSinh : ''))
      for (const s of p.sao.filter(x => x.loai === 'chinh')) { const luan = SAO_CUNG[s.ten] && SAO_CUNG[s.ten][p.cung]; if (luan) L.push('    ↳ ' + s.ten + (s.do ? ' (' + DO_SANG_LABEL[s.do] + ')' : '') + ': ' + luan) }
    }
    if (ls.cachCuc && ls.cachCuc.length) { L.push('', '— CÁCH CỤC NỔI BẬT —'); ls.cachCuc.forEach(c => L.push('• ' + c.ten + ': ' + c.luan)) }
    if (ls.van) L.push('', '— VẬN NĂM ' + ls.van.year + ' (~' + ls.van.age + ' tuổi âm) —', 'Đại hạn: cung ' + ls.palaces[ls.van.daiHanChi].cung + ' (' + ls.palaces[ls.van.daiHanChi].chi + ') · Tiểu hạn: ' + ls.palaces[ls.van.tieuHanChi].chi + ' · Lưu niên: ' + ls.palaces[ls.van.luuNienChi].chi)
    L.push('', 'An sao là thuật toán cổ điển tất định; phần luận ý nghĩa chỉ mang tính tham khảo, không phải lời tiên đoán. — Tam Sở')
    const blob = new Blob([L.join('\n')], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'la-so-tu-vi-' + d + '-' + m + '-' + y + '.txt'; a.click(); URL.revokeObjectURL(a.href)
  }
  const doCopy = (txt, tag) => navigator.clipboard?.writeText(txt).then(() => { setCopied(tag); setTimeout(() => setCopied(''), 2000) })
  const menhStars = ls ? ls.palaces[ls.menhIdx].sao.filter(s => s.loai === 'chinh').map(s => s.ten).join(', ') || 'Vô chính diệu' : ''
  const resultText = () => ls ? `✦ Lá số Tử Vi — ${ls.nam} (${ls.amDuong}), Cục ${ls.cuc.ten}. Mệnh tại ${ls.menhChi}: ${menhStars}. Thân cư ${ls.thanCu}.\n— Tam Sở ${shareUrl()}` : ''
  const selP = ls ? ls.palaces[sel] : null
  const tpSet = ls ? new Set([sel, (sel + 4) % 12, (sel + 8) % 12, (sel + 6) % 12]) : new Set()

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold text-kicker uppercase">Tử Vi Đẩu Số · An sao lá số 12 cung</div>
        <h1 className="text-display my-3">Lá số Tử Vi</h1>
        <p className="text-muted text-lead max-w-[700px] mx-auto">Nhập ngày–giờ sinh để <b>an sao</b> 14 chính tinh, Tứ Hóa, lục cát – lục sát vào 12 cung, kèm Cục và đại hạn. Phần an sao là <b>thuật toán cổ điển tất định</b>; phần luận là tham khảo.</p>
      </section>

      <section className="wrap pb-4">
        <div className="panel route3d-panel p-[22px] max-w-[880px] mx-auto">
          <div className="flex gap-3 flex-wrap items-end justify-center">
            <Field label="Ngày *" value={d} set={setD} ph="15" w="78px" />
            <Field label="Tháng *" value={m} set={setM} ph="8" w="78px" />
            <Field label="Năm * (dương)" value={y} set={setY} ph="1990" w="120px" />
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Giờ sinh</label>
              <select value={h} onChange={e => setH(e.target.value)} className="field-input" style={{ width: '150px' }}>
                {GIO_LABEL.map((lb, i) => <option key={i} value={i + 1}>{lb}</option>)}
              </select></div>
            <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Giới tính</label>
              <select value={g} onChange={e => setG(e.target.value)} className="field-input" style={{ width: '100px' }}>
                <option value="nam">Nam</option><option value="nu">Nữ</option>
              </select></div>
            <button className="btn btn-primary" onClick={lap}>☆ Lập lá số</button>
            <button className="btn btn-ghost" onClick={demo}>Xem thử lá số mẫu</button>
          </div>
          {err && <div className="disclaimer mt-4">{err}</div>}
          <p className="note text-center mt-3 mb-0">Giờ sinh ảnh hưởng lớn tới lá số — nếu không chắc, hãy chọn giờ gần đúng nhất. Năm nhập theo <b>dương lịch</b>, hệ thống tự quy đổi âm lịch (Hồ Ngọc Đức). Nếu sinh vào <b>tháng nhuận</b>, lá số tính theo số tháng âm lịch — một số phái an sao xử lý tháng nhuận khác, cần chính xác tuyệt đối nên đối chiếu thêm.</p>
          <details className="mt-3 max-w-[760px] mx-auto no-print">
            <summary className="cursor-pointer text-gold text-[.9rem] font-semibold select-none">📖 Cách đọc lá số — chú giải nhanh</summary>
            <div className="note mt-2 leading-relaxed flex flex-col gap-1.5">
              <p className="m-0"><b className="text-cream">Mệnh / Thân:</b> Mệnh là bản chất gốc; Thân là phần thể hiện ra ngoài, nặng dần về hậu vận (trung niên trở đi).</p>
              <p className="m-0"><b className="text-cream">Cục:</b> ngũ hành cục (Thủy nhị → Hỏa lục) — quyết định cách an sao Tử Vi và mốc khởi đại hạn.</p>
              <p className="m-0"><b className="text-cream">Chính tinh / phụ tinh:</b> 14 chính tinh là "vai chính"; lục cát – lục sát, Lộc Tồn, Thiên Mã… là phụ tinh bổ trợ.</p>
              <p className="m-0"><b className="text-cream">Độ sáng:</b> <b>M</b> Miếu (sáng nhất) › <b>V</b> Vượng › <b>Đ</b> Đắc › <b>B</b> Bình (trung tính) › <b>H</b> Hãm (sao yếu, cần cát tinh hỗ trợ — không phải điềm xấu).</p>
              <p className="m-0"><b className="text-cream">Tứ Hóa:</b> bốn biến hóa theo can năm — <b>Lộc</b> (tài lộc), <b>Quyền</b> (quyền lực), <b>Khoa</b> (danh tiếng, thi cử), <b>Kỵ</b> (vướng mắc, nên lưu tâm).</p>
              <p className="m-0"><b className="text-cream">Tam phương tứ chính:</b> bốn cung soi chiếu nhau (Mệnh – Tài Bạch – Quan Lộc + cung đối) — luôn xét chung, không xem lẻ một cung.</p>
              <p className="m-0"><b className="text-cream">Đại hạn / tiểu hạn / lưu niên:</b> vận 10 năm / vận 1 năm / năm hiện tại (theo Thái Tuế).</p>
              <p className="m-0 text-muted">Lá số cần luận <b>tổng hòa</b> — là công cụ để chiêm nghiệm, không phải lời phán; mọi quyết định vẫn ở bạn.</p>
            </div>
          </details>
          {hist.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap items-center justify-center no-print">
              <span className="note">Gần đây:</span>
              {hist.map((e, i) => <button key={i} onClick={() => loadLaso(e)} className="badge cursor-pointer hover:text-gold">{e.d}/{e.m}/{e.y}</button>)}
            </div>
          )}
        </div>
      </section>

      {ls && (
        <>
          <section className="wrap pb-2">
            <div className="flex flex-wrap gap-2 justify-center mb-3 text-[.9rem]">
              <span className="badge badge-gold">{ls.nam}</span>
              <span className="badge">{ls.amDuong}</span>
              <span className="badge">Cục: {ls.cuc.ten}</span>
              <span className="badge">Mệnh tại {ls.menhChi}</span>
              <span className="badge">Thân cư {ls.thanCu}</span>
              <span className="badge">DL {ls.solar.d}/{ls.solar.m}/{ls.solar.y} · ÂL {ls.lunar.day}/{ls.lunar.month}</span>
            </div>
            <div className="panel route3d-panel p-[18px] max-w-[820px] mx-auto mb-3 bg-gold/[.05]">
              <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1.5">Tóm tắt lá số</div>
              <p className="m-0 leading-relaxed">Mệnh an tại <b className="text-cream">{ls.menhChi}</b> — <b className="text-cream">{menhStars}</b>, thuộc nhóm <b className="text-cream">{ls.menhCach.ten}</b>.{' '}
                {(() => {
                  const cat = ls.cachCuc.filter(c => c.tot === true).map(c => c.ten)
                  const xau = ls.cachCuc.filter(c => c.tot === false).map(c => c.ten)
                  return <>{cat.length > 0 && <>Điểm sáng nổi bật: <span className="text-emerald-800 dark:text-emerald-400 font-semibold">{cat.join(', ')}</span>. </>}{xau.length > 0 && <>Nên lưu tâm thêm: <span className="text-rose-700 dark:text-rose-400">{xau.join(', ')}</span> (đều có cách hóa giải, không phải điềm gở). </>}</>
                })()}
                {ls.van && <>Năm {ls.van.year} (~{ls.van.age} tuổi âm), đại hạn đang ở cung <b className="text-cream">{ls.palaces[ls.van.daiHanChi].cung}</b>.</>}</p>
              {(() => { const ds = doSangSummary(ls); return ds && ds.text ? <p className="mt-1.5 mb-0 leading-relaxed"><span className="text-gold font-semibold">Độ sáng Mệnh:</span> {ds.text}</p> : null })()}
              <p className="note mt-1.5 mb-0">Bức tranh tổng quan để chiêm nghiệm — không phải lời phán; lá số cần luận tổng hòa, và mọi quyết định vẫn ở bạn.</p>
            </div>
            <div ref={shotRef} className="panel p-2.5 md:p-3 max-w-[820px] mx-auto overflow-x-auto"><p className="note text-center mb-2 sm:hidden">← vuốt ngang để xem trọn lá số →</p>
              <div className="grid gap-1.5 mx-auto" style={{ gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(4, minmax(96px, auto))', minWidth: '468px' }}>
                {ls.palaces.map(p => <Cell key={p.chiIdx} p={p} active={sel === p.chiIdx} onClick={() => setSel(p.chiIdx)} van={ls.van} tp={tpSet.has(p.chiIdx) && p.chiIdx !== sel} />)}
                <div style={{ gridColumn: '2 / 4', gridRow: '2 / 4' }} className="border border-gold/25 rounded-lg p-3 bg-gold/[.05] flex flex-col items-center justify-center text-center">
                  <div className="font-serif text-gold text-[1.05rem]">✦ Thiên bàn</div>
                  <div className="text-[.82rem] mt-1.5 leading-relaxed">
                    <div><b className="text-cream">{ls.nam}</b> · {ls.amDuong}</div>
                    <div>Mệnh: <b className="text-cream">{menhStars}</b></div>
                    <div>Cục: {ls.cuc.ten} · Bản mệnh {ls.menhHanh}</div>
                    <div className="text-muted">Giờ {ls.gioChi} · Thân cư {ls.thanCu}</div>
                  </div>
                </div>
              </div>
              <p className="note text-center mt-2.5 mb-0">Chạm vào mỗi cung để xem chi tiết sao &amp; ý nghĩa bên dưới. <span className="text-cream">Màu sao:</span> <span className="text-cream font-semibold">chính tinh</span> · <span className="text-emerald-800 dark:text-emerald-400">cát tinh</span> · <span className="text-rose-700 dark:text-rose-400">sát tinh</span> · <span className="text-muted">sao khác</span>. Nhãn <sup className="bg-emerald-700 text-white text-[.55rem] px-1 rounded">Lộc</sup> = Tứ Hóa; các ký hiệu <sup className="bg-amber-300 text-amber-900 text-[.55rem] px-0.5 rounded">M</sup>, <sup className="bg-emerald-200 text-emerald-900 text-[.55rem] px-0.5 rounded">V</sup>, <sup className="bg-sky-200 text-sky-900 text-[.55rem] px-0.5 rounded">Đ</sup>, <sup className="bg-gray-200 text-gray-700 text-[.55rem] px-0.5 rounded">B</sup>, <sup className="bg-rose-100 text-rose-700 dark:text-rose-400 text-[.55rem] px-0.5 rounded">H</sup> = độ sáng chính tinh (Miếu, Vượng, Đắc, Bình, Hãm). Khi chọn một cung, <span className="text-gold">ba cung hội chiếu</span> (tam phương tứ chính) sẽ sáng nhẹ — nên đọc cùng nhau.</p>
            </div>
          </section>

          <section className="wrap py-3">
            <div className="grid md:grid-cols-2 gap-4 max-w-[820px] mx-auto">
              <div className="panel p-[22px]">
                <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1.5">Cách cục cung Mệnh — {ls.menhCach.ten}</div>
                <p className="m-0 leading-relaxed">{ls.menhCach.luan}</p>
                {ls.menhCach.muon && <p className="note mt-1.5 mb-0">Mệnh vô chính diệu nên mượn sao cung Thiên Di (đối diện) để luận.</p>}
                <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mt-3 mb-1.5">Tam phương tứ chính của Mệnh</div>
                <ul className="m-0 pl-0 list-none text-[.92rem] flex flex-col gap-0.5">
                  {ls.tamPhuong.map((ci, i) => { const pp = ls.palaces[ci]; const ch = pp.sao.filter(s => s.loai === 'chinh').map(s => s.ten).join(', ') || 'vô chính diệu'; return <li key={i}><b className="text-cream">{pp.cung}</b> ({pp.chi}): {ch}</li> })}
                </ul>
                <p className="note mt-1.5 mb-0">Bốn cung này (Mệnh · Tài Bạch · Quan Lộc · Thiên Di) hội chiếu nhau, cùng quyết định cốt cách — nên luận tổng hòa, đừng đọc rời từng sao.</p>
              </div>
              {ls.van && (
                <div className="panel p-[22px]">
                  <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1.5">Vận hạn năm {ls.van.year} (~{ls.van.age} tuổi âm)</div>
                  <VanRow label="Đại hạn (10 năm)" chi={ls.van.daiHanChi} ls={ls} cls="text-amber-800 dark:text-amber-400" />
                  <VanRow label="Tiểu hạn (năm)" chi={ls.van.tieuHanChi} ls={ls} cls="text-sky-800" />
                  <VanRow label="Lưu niên (Thái Tuế)" chi={ls.van.luuNienChi} ls={ls} cls="text-rose-700 dark:text-rose-400" />
                  <p className="note mt-2 mb-0">Vận hạn cho biết "sân khấu" của giai đoạn — cung nào được chiếu thì lĩnh vực đó nổi lên. Chỉ để chiêm nghiệm, không phải điều chắc chắn.</p>
                </div>
              )}
            </div>
          </section>

          <section className="wrap py-3">
            <div className="panel p-[22px] max-w-[820px] mx-auto">
              <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-2">Dòng đại hạn cả đời (mỗi vận 10 năm)</div>
              <ul className="m-0 pl-0 list-none grid sm:grid-cols-2 gap-x-5 gap-y-1 text-[.9rem]">
                {[...ls.palaces].sort((a, b) => a.daihan.from - b.daihan.from).map((p, i) => {
                  const ch = p.sao.filter(s => s.loai === 'chinh').map(s => s.ten + (s.do ? '(' + s.do + ')' : '')).join(', ') || 'vô chính diệu'
                  const cur = ls.van && ls.van.daiHanChi === p.chiIdx
                  return <li key={i} className={cur ? 'bg-amber-200/60 rounded px-1.5 -mx-1.5 font-semibold' : ''}><b className="text-cream">{p.daihan.from}–{p.daihan.to}</b> tuổi · {p.cung} ({p.chi}): {ch}{cur ? ' ← hiện tại' : ''}</li>
                })}
              </ul>
              <p className="note mt-2 mb-0">Đại hạn là "chương" 10 năm của đời, đi lần lượt qua 12 cung. Vận đang tô đậm là đại hạn hiện tại. Cốt cách vẫn do Mệnh và tam phương quyết định — đại hạn chỉ tô màu cho từng giai đoạn, không phải định mệnh cứng.</p>
            </div>
          </section>

          {ls.cachCuc && ls.cachCuc.length > 0 && (
            <section className="wrap py-3">
              <div className="panel p-[22px] max-w-[820px] mx-auto">
                <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-2">Cách cục / tổ hợp sao nổi bật</div>
                <ul className="m-0 pl-0 list-none flex flex-col gap-2">
                  {ls.cachCuc.map((c, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className={'font-semibold ' + (c.tot === true ? 'text-emerald-800 dark:text-emerald-400' : c.tot === false ? 'text-rose-700 dark:text-rose-400' : 'text-gold')}>{c.tot === true ? '✦ ' : c.tot === false ? '⚠ ' : '◇ '}{c.ten}</span>
                      <span className="note"> — {c.luan}</span>
                    </li>
                  ))}
                </ul>
                <p className="note mt-2 mb-0">Cách cục chỉ "thành" trọn vẹn khi xét cả độ sáng sao và toàn cục — đây là gợi ý tham khảo, không phải phán quyết.</p>
              </div>
            </section>
          )}

          {selP && (
            <section className="wrap py-3">
              <div className="panel p-[22px] max-w-[820px] mx-auto animate-fade">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-[1.5rem] m-0">Cung {selP.cung}</h3>
                  <span className="text-muted">tại {selP.chi}{selP.isMenh ? ' · cung Mệnh' : ''}{selP.isThan ? ' · cung Thân' : ''}{selP.daihan ? ` · đại hạn ${selP.daihan.from}–${selP.daihan.to} tuổi` : ''}</span>
                </div>
                <p className="note mt-1 mb-3">{CUNG_NGHIA[selP.cung]}</p>
                <p className="note mt-0 mb-3 text-[.7rem]">Độ sáng chính tinh: <b>M</b> Miếu · <b>V</b> Vượng · <b>Đ</b> Đắc · <b>B</b> Bình · <b>H</b> Hãm (sao yếu, cần cát tinh hỗ trợ — không phải điềm xấu tất định). Theo phái phổ biến, có dị bản.</p>
                {selP.sao.length === 0 && <p className="m-0">Cung này <b>vô chính diệu</b> (không có chính tinh) — theo truyền thống thường mượn sao ở cung đối diện để luận, và tính cách dễ uyển chuyển theo hoàn cảnh.</p>}
                {selP.sao.filter(s => s.loai === 'chinh').map((s, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-center gap-2"><span className="text-cream font-semibold text-[1.05rem]">{s.ten}</span>
                      <span className="note">{CHINH_TINH[s.ten] && CHINH_TINH[s.ten].tom}</span>
                      {s.do && <span className={'text-[.62rem] px-1.5 py-0.5 rounded font-semibold ' + (DO_CLS[s.do] || '')} title={DO_SANG_NGHIA[s.do] || ''}>{DO_SANG_LABEL[s.do]} ({s.do})</span>}
                      {s.sang && <span className={'text-[.62rem] px-1.5 py-0.5 rounded ' + (s.sang === 'sáng' ? 'bg-amber-200 text-amber-900' : s.sang === 'tối' ? 'bg-slate-300 text-slate-700' : 'bg-gray-200 text-gray-700')}>{s.sang === 'sáng' ? '☀ Sáng' : s.sang === 'tối' ? '☾ Tối' : 'Bình'}</span>}
                      {s.hoa && <span className={'text-white text-[.62rem] px-1.5 py-0.5 rounded ' + (HOA_CLS[s.hoa] || 'bg-gray-600')}>Hóa {s.hoa}</span>}
                    </div>
                    <p className="m-0 leading-relaxed">{CHINH_TINH[s.ten] && CHINH_TINH[s.ten].y}</p>
                    {SAO_CUNG[s.ten] && SAO_CUNG[s.ten][selP.cung] && <p className="mt-1 mb-0 leading-relaxed"><span className="text-gold font-semibold">Tại cung {selP.cung}:</span> {SAO_CUNG[s.ten][selP.cung]}</p>}
                    {SAO_KHUYEN[s.ten] && <p className="note mt-1 mb-0">✦ Lời khuyên (sao {s.ten}): {SAO_KHUYEN[s.ten]}</p>}
                    {s.hoa && <p className="note mt-0.5 mb-0">↳ {TU_HOA_NGHIA[s.hoa]}</p>}
                  </div>
                ))}
                {selP.sao.some(s => s.loai !== 'chinh') && (
                  <div className="mt-2">
                    <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1.5">Phụ tinh trong cung</div>
                    <ul className="m-0 pl-0 list-none flex flex-col gap-1">
                      {selP.sao.filter(s => s.loai !== 'chinh').map((s, i) => (
                        <li key={i} className="leading-snug"><span className={'font-semibold ' + (SAO_CLS[s.loai] || '')}>{s.ten}</span>
                          {s.hoa && <span className={'text-white text-[.55rem] px-1 rounded ml-1 ' + (HOA_CLS[s.hoa] || '')}>{s.hoa}</span>}
                          {PHU_TINH[s.ten] && <span className="note"> — {PHU_TINH[s.ten]}</span>}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="wrap pt-1 pb-4">
            <div className="flex gap-2 justify-center flex-wrap no-print">
              <button className="btn btn-ghost" onClick={() => doCopy(shareUrl(), 'link')}>{copied === 'link' ? '✓ Đã chép!' : '🔗 Sao chép liên kết'}</button>
              <button className="btn btn-ghost" onClick={() => doCopy(resultText(), 'text')}>{copied === 'text' ? '✓ Đã chép!' : '📋 Chép kết quả'}</button>
              <button className="btn btn-ghost" onClick={savePng} disabled={saving}>{saving ? '⏳ Đang tạo ảnh…' : '🖼️ Tải ảnh PNG'}</button>
              <button className="btn btn-ghost" onClick={() => window.print()}>🖨️ In / Lưu PDF</button>
              <button className="btn btn-ghost" onClick={downloadTxt}>📄 Tải .txt</button>
              <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl())} target="_blank" rel="noopener">📘 Chia sẻ</a>
            </div>
          </section>
        </>
      )}

      <section className="wrap py-8">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Dữ kiện &amp; diễn giải.</b> Việc <b>an sao</b> (xác định Mệnh/Thân, Cục, vị trí 14 chính tinh, Tứ Hóa, lục cát – lục sát, đại hạn) là <b>thuật toán cổ điển tất định</b>, kiểm chứng được — đã đối chiếu khớp nhiều nguồn và các cách đồng cung kinh điển. Phần <b>ý nghĩa sao và cung</b> là <b>diễn giải truyền thống, mang tính tham khảo</b>, không phải lời tiên đoán chắc chắn; một lá số đầy đủ cần luận tổng hòa cả tam phương tứ chính, không nên đọc rời từng sao. Thuật toán đối chiếu từ <a href="https://tracuutuvi.com/an-sao-tu-vi.html" target="_blank" rel="noopener">Tra Cứu Tử Vi</a>, <a href="https://tuvisaigon.vn/bai-1-an-menh-than-trong-tu-vi-dau-so.html" target="_blank" rel="noopener">Tử Vi Sài Gòn</a>; lịch âm <a href="https://www.informatik.uni-leipzig.de/~duc/amlich/" target="_blank" rel="noopener">Hồ Ngọc Đức</a>. Xem hai người? Thử <a href="#/so-la-so">So đôi lá số</a>.
        </div>
      </section>
    </>
  )
}

function VanRow({ label, chi, ls, cls }) {
  const p = ls.palaces[chi]
  const ch = p.sao.filter(s => s.loai === 'chinh').map(s => s.ten).join(', ') || 'vô chính diệu'
  return <div className="mb-1.5 leading-snug"><span className={'font-semibold ' + cls}>{label}:</span> cung <b className="text-cream">{p.cung}</b> tại {p.chi} — {ch}</div>
}

function Field({ label, value, set, ph, w = '120px' }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={ph} className="field-input" style={{ width: w }} /></div>)
}
