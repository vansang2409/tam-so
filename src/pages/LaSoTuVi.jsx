import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { solar2lunar } from '../data/lunar.js'
import { anSao, CHINH_TINH, PHU_TINH, TU_HOA_NGHIA, CUNG_NGHIA, GIO_CHI } from '../data/tuvidauso.js'

// Vị trí 12 chi trên lá số 4×4 [cột, hàng] (1-indexed)
const POS = { 5: [1, 1], 6: [2, 1], 7: [3, 1], 8: [4, 1], 4: [1, 2], 9: [4, 2], 3: [1, 3], 10: [4, 3], 2: [1, 4], 1: [2, 4], 0: [3, 4], 11: [4, 4] }
const GIO_LABEL = ['Tý (23–1h)', 'Sửu (1–3h)', 'Dần (3–5h)', 'Mão (5–7h)', 'Thìn (7–9h)', 'Tỵ (9–11h)', 'Ngọ (11–13h)', 'Mùi (13–15h)', 'Thân (15–17h)', 'Dậu (17–19h)', 'Tuất (19–21h)', 'Hợi (21–23h)']
const SAO_CLS = { chinh: 'text-cream font-semibold', cat: 'text-emerald-800', sat: 'text-rose-700', khac: 'text-muted' }
const HOA_CLS = { 'Lộc': 'bg-emerald-700', 'Quyền': 'bg-amber-700', 'Khoa': 'bg-sky-700', 'Kỵ': 'bg-rose-700' }

function StarLine({ s }) {
  return (
    <span className={'inline-flex items-center gap-0.5 mr-1.5 leading-tight ' + (SAO_CLS[s.loai] || '')}>
      {s.ten}
      {s.hoa && <sup className={'text-white text-[.55rem] px-1 rounded ' + (HOA_CLS[s.hoa] || 'bg-gray-600')}>{s.hoa}</sup>}
    </span>
  )
}

function Cell({ p, active, onClick }) {
  const [col, row] = POS[p.chiIdx]
  return (
    <button onClick={onClick} style={{ gridColumn: col, gridRow: row }}
      className={'text-left border rounded-lg p-1.5 min-h-[92px] overflow-hidden transition ' +
        (active ? 'border-gold bg-gold/10' : 'border-gold/20 hover:border-gold/50 bg-white/[.03]')}>
      <div className="flex items-center justify-between gap-1">
        <span className="text-gold font-semibold text-[.74rem] leading-none">{p.cung}</span>
        <span className="text-muted text-[.62rem] leading-none">{p.chi}</span>
      </div>
      <div className="flex gap-1 mt-0.5 flex-wrap">
        {p.isMenh && <span className="text-[.55rem] bg-gold text-[#211606] px-1 rounded font-bold">MỆNH</span>}
        {p.isThan && <span className="text-[.55rem] border border-gold text-gold px-1 rounded font-bold">THÂN</span>}
      </div>
      <div className="text-[.72rem] mt-1 leading-snug">
        {p.sao.length ? p.sao.map((s, i) => <StarLine key={i} s={s} />) : <span className="text-muted/60 italic">(vô chính diệu)</span>}
      </div>
      {p.daihan && <div className="text-[.58rem] text-muted mt-1">ĐH {p.daihan.from}–{p.daihan.to}t</div>}
    </button>
  )
}

export default function LaSoTuVi() {
  const [params, setParams] = useSearchParams()
  const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('')
  const [h, setH] = useState('7'); const [g, setG] = useState('nam')
  const [ls, setLs] = useState(null); const [err, setErr] = useState(''); const [sel, setSel] = useState(0); const [copied, setCopied] = useState('')

  const compute = (dd, mm, yy, hh, gg) => {
    if (!(dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yy >= 1900 && yy <= 2100)) return null
    const al = solar2lunar(dd, mm, yy)
    const r = anSao({ lunarDay: al.day, lunarMonth: al.month, year: al.year, hourRank: +hh, gender: gg })
    return { ...r, solar: { d: dd, m: mm, y: yy }, lunar: al }
  }
  useEffect(() => {
    const dd = +(params.get('d') || 0), mm = +(params.get('m') || 0), yy = +(params.get('y') || 0)
    const hh = +(params.get('h') || 0), gg = params.get('g') === 'nu' ? 'nu' : 'nam'
    if (dd && mm && yy) {
      setD(String(dd)); setM(String(mm)); setY(String(yy)); if (hh) setH(String(hh)); setG(gg)
      const r = compute(dd, mm, yy, hh || 7, gg); if (r) { setLs(r); setSel(r.menhIdx) }
    } // eslint-disable-next-line
  }, [])
  const qs = () => new URLSearchParams({ d, m, y, h, g }).toString()
  const shareUrl = () => routeShareUrl('/la-so-tu-vi', qs())
  const lap = () => {
    const r = compute(+d, +m, +y, +h, g)
    if (!r) { setErr('Nhập ngày/tháng/năm dương lịch hợp lệ (1900–2100).'); setLs(null); return }
    setErr(''); setLs(r); setSel(r.menhIdx); setParams(new URLSearchParams(qs()))
  }
  const doCopy = (txt, tag) => navigator.clipboard?.writeText(txt).then(() => { setCopied(tag); setTimeout(() => setCopied(''), 2000) })
  const menhStars = ls ? ls.palaces[ls.menhIdx].sao.filter(s => s.loai === 'chinh').map(s => s.ten).join(', ') || 'Vô chính diệu' : ''
  const resultText = () => ls ? `✦ Lá số Tử Vi — ${ls.nam} (${ls.amDuong}), Cục ${ls.cuc.ten}. Mệnh tại ${ls.menhChi}: ${menhStars}. Thân cư ${ls.thanCu}.\n— Tam Sở ${shareUrl()}` : ''
  const selP = ls ? ls.palaces[sel] : null

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Tử Vi Đẩu Số · An sao lá số 12 cung</div>
        <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] my-2.5">Lá số Tử Vi</h1>
        <p className="text-muted text-[1.1rem] max-w-[700px] mx-auto">Nhập ngày–giờ sinh để <b>an sao</b> 14 chính tinh, Tứ Hóa, lục cát – lục sát vào 12 cung, kèm Cục và đại hạn. Phần an sao là <b>thuật toán cổ điển tất định</b>; phần luận là tham khảo.</p>
      </section>

      <section className="wrap pb-4">
        <div className="panel p-[22px] max-w-[880px] mx-auto">
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
          </div>
          {err && <div className="disclaimer mt-4">{err}</div>}
          <p className="note text-center mt-3 mb-0">Giờ sinh ảnh hưởng lớn tới lá số — nếu không chắc, hãy chọn giờ gần đúng nhất. Năm nhập theo <b>dương lịch</b>, hệ thống tự quy đổi âm lịch (Hồ Ngọc Đức).</p>
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
            <div className="panel p-2.5 md:p-3 max-w-[820px] mx-auto">
              <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(4,1fr)' }}>
                {ls.palaces.map(p => <Cell key={p.chiIdx} p={p} active={sel === p.chiIdx} onClick={() => setSel(p.chiIdx)} />)}
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
              <p className="note text-center mt-2.5 mb-0">Chạm vào mỗi cung để xem chi tiết sao &amp; ý nghĩa bên dưới. <span className="text-cream">Màu sao:</span> <span className="text-cream font-semibold">chính tinh</span> · <span className="text-emerald-800">cát tinh</span> · <span className="text-rose-700">sát tinh</span> · <span className="text-muted">sao khác</span>. Nhãn <sup className="bg-emerald-700 text-white text-[.55rem] px-1 rounded">Lộc</sup> = Tứ Hóa.</p>
            </div>
          </section>

          {selP && (
            <section className="wrap py-3">
              <div className="panel p-[22px] max-w-[820px] mx-auto animate-fade">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-[1.5rem] m-0">Cung {selP.cung}</h3>
                  <span className="text-muted">tại {selP.chi}{selP.isMenh ? ' · cung Mệnh' : ''}{selP.isThan ? ' · cung Thân' : ''}{selP.daihan ? ` · đại hạn ${selP.daihan.from}–${selP.daihan.to} tuổi` : ''}</span>
                </div>
                <p className="note mt-1 mb-3">{CUNG_NGHIA[selP.cung]}</p>
                {selP.sao.length === 0 && <p className="m-0">Cung này <b>vô chính diệu</b> (không có chính tinh) — theo truyền thống thường mượn sao ở cung đối diện để luận, và tính cách dễ uyển chuyển theo hoàn cảnh.</p>}
                {selP.sao.filter(s => s.loai === 'chinh').map((s, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-center gap-2"><span className="text-cream font-semibold text-[1.05rem]">{s.ten}</span>
                      <span className="note">{CHINH_TINH[s.ten] && CHINH_TINH[s.ten].tom}</span>
                      {s.hoa && <span className={'text-white text-[.62rem] px-1.5 py-0.5 rounded ' + (HOA_CLS[s.hoa] || 'bg-gray-600')}>Hóa {s.hoa}</span>}
                    </div>
                    <p className="m-0 leading-relaxed">{CHINH_TINH[s.ten] && CHINH_TINH[s.ten].y}</p>
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
              <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl())} target="_blank" rel="noopener">📘 Chia sẻ</a>
            </div>
          </section>
        </>
      )}

      <section className="wrap py-8">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Dữ kiện &amp; diễn giải.</b> Việc <b>an sao</b> (xác định Mệnh/Thân, Cục, vị trí 14 chính tinh, Tứ Hóa, lục cát – lục sát, đại hạn) là <b>thuật toán cổ điển tất định</b>, kiểm chứng được — đã đối chiếu khớp nhiều nguồn và các cách đồng cung kinh điển. Phần <b>ý nghĩa sao và cung</b> là <b>diễn giải truyền thống, mang tính tham khảo</b>, không phải lời tiên đoán chắc chắn; một lá số đầy đủ cần luận tổng hòa cả tam phương tứ chính, không nên đọc rời từng sao. Thuật toán đối chiếu từ <a href="https://tracuutuvi.com/an-sao-tu-vi.html" target="_blank" rel="noopener">Tra Cứu Tử Vi</a>, <a href="https://tuvisaigon.vn/bai-1-an-menh-than-trong-tu-vi-dau-so.html" target="_blank" rel="noopener">Tử Vi Sài Gòn</a>; lịch âm <a href="https://www.informatik.uni-leipzig.de/~duc/amlich/" target="_blank" rel="noopener">Hồ Ngọc Đức</a>.
        </div>
      </section>
    </>
  )
}

function Field({ label, value, set, ph, w = '120px' }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={ph} className="field-input" style={{ width: w }} /></div>)
}
