import { useState, useEffect } from 'react'
import { usePageSeo } from '../components/useSeo.js'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import { ZODIAC, getZodiac, zodiacCompat, LUCKY, decanOf, ZODIAC_DEEP, dailyHoroscope, ZODIAC_SLUG, zodiacBySlug } from '../data/zodiac.js'
import NotFound from '../components/NotFound.jsx'
import SeoTag from '../components/SeoTag.jsx'
import RelatedLinks from '../components/RelatedLinks.jsx'
import { relatedForSign } from '../data/related.js'
import { ZODIAC_EXTRA } from '../data/zodiacDeep.js'

const elColor = { 'Lửa': 'h-Hỏa', 'Đất': 'h-Thổ', 'Khí': 'h-Kim', 'Nước': 'h-Thủy' }
const VC = { 'Rất hợp': 'text-emerald-800', 'Hợp': 'text-emerald-800', 'Cần dung hòa': 'text-rose-700', 'Trung bình': 'text-amber-800' }

function CompatMatrix() {
  const mark = { 'Rất hợp': '♥', 'Hợp': '+', 'Trung bình': '•', 'Cần dung hòa': '~' }
  const sty = {
    'Rất hợp': { background: 'rgba(120,210,150,.34)', color: '#d6f5e0' },
    'Hợp': { background: 'rgba(120,210,150,.16)', color: '#a7e6bf' },
    'Trung bình': { background: 'rgba(211,162,78,.18)', color: '#ecd198' },
    'Cần dung hòa': { background: 'rgba(235,120,120,.20)', color: '#f3aaaa' }
  }
  return (
    <section className="wrap py-8">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">Bảng tương hợp nhanh 12 cung</h2>
      <p className="note text-center max-w-[640px] mx-auto mb-4">Tra nhanh mức hợp giữa hai cung (theo nguyên tố &amp; góc chiếu). Di chuột/chạm vào ô để xem chi tiết — chỉ mang tính tham khảo.</p>
      <p className="note text-center mb-2 sm:hidden">← vuốt ngang để xem đủ bảng →</p>
        <div className="panel p-4 max-w-[900px] mx-auto overflow-x-auto">
        <table className="border-collapse mx-auto" style={{ minWidth: 460 }}>
          <thead>
            <tr>
              <th className="p-1 text-gold text-[1rem]">✦</th>
              {ZODIAC.map(z => <th key={z.en} title={z.ten} className="p-1 text-[1.05rem] font-normal text-cream">{z.sym}</th>)}
            </tr>
          </thead>
          <tbody>
            {ZODIAC.map(a => (
              <tr key={a.en}>
                <th title={a.ten} className="p-1 pr-2 text-[1.05rem] font-normal text-cream text-right whitespace-nowrap">{a.sym}</th>
                {ZODIAC.map(b => {
                  const v = zodiacCompat(a, b).verdict
                  return (
                    <td key={b.en} title={`${a.ten} × ${b.ten}: ${v}`} className="p-0 text-center align-middle">
                      <div className="m-[2px] rounded-md flex items-center justify-center text-[.82rem] mx-auto" style={{ width: 30, height: 30, ...sty[v] }}>{mark[v]}</div>
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

function CungReading({ z }) {
  const deep = ZODIAC_DEEP[z.en]
  const ex = ZODIAC_EXTRA[z.en]
  const today = new Date().toISOString().slice(0, 10)
  const dh = dailyHoroscope(z.en, today)
  return (
    <>
      {deep && (
        <div className="text-left max-w-[600px] mx-auto mt-2 flex flex-col gap-1.5 leading-relaxed">
          <div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Chân dung {z.ten}</div>
          {ex && <p className="m-0">{ex.tomTat}</p>}
          {ex && <p className="m-0"><b className="text-cream">Tính cách:</b> {ex.tinhCach}</p>}
          <p className="m-0"><b className="text-cream">Tình yêu:</b> {deep.tinhYeu}</p>
          <p className="m-0"><b className="text-cream">Công việc:</b> {deep.congViec}</p>
          <p className="m-0"><b className="text-cream">Tài chính:</b> {deep.taiChinh}</p>
          {ex && <p className="m-0"><b className="text-cream">Sức khỏe:</b> {ex.sucKhoe}</p>}
          <p className="m-0"><b className="text-cream">Điểm mạnh:</b> {deep.diemManh}</p>
          <p className="m-0"><b className="text-cream">Nên lưu ý:</b> {deep.luuY}</p>
          <p className="m-0"><b className="text-cream">Hợp với:</b> {deep.hopVoi.join(' · ')}</p>
          {ex && <p className="m-0 note"><b className="text-cream">Lời khuyên:</b> {ex.loiKhuyen}</p>}
        </div>
      )}
      <div className="text-left max-w-[600px] mx-auto mt-5 panel bg-gold/[.05] p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Tử vi hôm nay · {today.split('-').reverse().join('/')}</div>
          <div className="text-amber-700 text-[.95rem]" title="Mức năng lượng hôm nay (tham khảo)">{'★'.repeat(dh.nangLuong)}<span className="text-gray-300">{'★'.repeat(5 - dh.nangLuong)}</span></div>
        </div>
        <p className="m-0 mt-1.5 leading-relaxed">{dh.tongQuan}</p>
        <p className="m-0 mt-1"><b className="text-cream">Tình cảm:</b> {dh.tinhCam}</p>
        <p className="m-0"><b className="text-cream">Công việc:</b> {dh.congViec}</p>
        <p className="m-0"><b className="text-cream">Tài chính:</b> {dh.taiChinh}</p>
        <p className="note m-0 mt-1.5">💡 {dh.loiKhuyen}</p>
        <p className="note m-0 mt-1.5 text-[.7rem]">Gợi ý để chiêm nghiệm, làm mới mỗi ngày — không phải lời tiên đoán.</p>
      </div>
    </>
  )
}

function CungPage({ z }) {
  usePageSeo({
    title: z.ten + ' (' + z.en + ') — tính cách, tình yêu, công việc & tử vi hôm nay | Tam Sở',
    description: z.ten + ' (' + z.en + '): ' + z.net + ' Xem chân dung, tình yêu, công việc, tài chính, cung hợp và tử vi hôm nay tại Tam Sở.',
    path: '/cung-hoang-dao/' + ZODIAC_SLUG[z.en],
    breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Cung hoàng đạo', path: '/cung-hoang-dao' }, { name: z.ten }]
  })
  return (
    <>
      <section className="wrap pt-[60px] pb-1 text-center">
        <p className="note mb-1"><Link to="/cung-hoang-dao" className="text-gold">Cung hoàng đạo</Link> / {z.ten}</p>
        <div className="text-[3.6rem] leading-none">{z.sym}</div>
        <h1 className="text-[clamp(2rem,5vw,3rem)] my-1">{z.ten} <span className="note text-[1.1rem]">({z.en})</span></h1>
        <div className="flex gap-2 flex-wrap justify-center my-2"><span className={'pill ' + elColor[z.nguyenTo]}>Nguyên tố {z.nguyenTo}</span><span className="badge">{z.sao}</span><span className="badge">{z.from[1]}/{z.from[0]} – {z.to[1]}/{z.to[0]}</span></div>
        <p className="max-w-[560px] mx-auto">{z.net}</p>
        <p className="note m-0">Tính chất {z.tinh} · Cơ thể: {z.than} · Màu {LUCKY[z.en].mau} · Đá {LUCKY[z.en].da} · Số {LUCKY[z.en].so}</p>
      </section>
      <section className="wrap pb-3"><div className="panel p-[26px] max-w-[680px] mx-auto"><CungReading z={z} /></div></section>
      <RelatedLinks items={relatedForSign(z.en)} />
      <section className="wrap pb-9">
        <p className="text-center text-gold text-[.72rem] uppercase tracking-[.2em] mb-3">Khám phá cung khác</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-[760px] mx-auto">
          {ZODIAC.map(o => <Link key={o.en} to={'/cung-hoang-dao/' + ZODIAC_SLUG[o.en]} className={'badge ' + (o.en === z.en ? 'badge-gold' : '')}>{o.sym} {o.ten}</Link>)}
        </div>
        <p className="text-center mt-5"><Link to="/cung-hoang-dao" className="btn btn-ghost">← Về trang Cung hoàng đạo</Link></p>
      </section>
    </>
  )
}

export default function Zodiac() {
  const { slug } = useParams()
  if (slug) {
    const z = zodiacBySlug(slug)
    return z
      ? <CungPage z={z} />
      : <NotFound title="Không tìm thấy cung này" msg="Hoàng đạo phương Tây có 12 cung. Mời bạn chọn lại một cung hoặc tính cung của bạn theo ngày sinh." />
  }
  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <SeoTag title='12 cung hoàng đạo — xem cung theo ngày sinh & tử vi hôm nay | Tam Sở' description='Xác định cung hoàng đạo theo ngày sinh, xem nét tính cách 12 cung, tương hợp nguyên tố và tử vi hôm nay. Chiêm tinh phương Tây mang tính tham khảo.' path='/cung-hoang-dao' breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: 'Cung hoàng đạo' }]} /><div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Chiêm tinh phương Tây</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Cung Hoàng Đạo</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">12 cung theo vị trí Mặt Trời lúc bạn sinh, gom thành 4 nguyên tố Lửa – Đất – Khí – Nước.</p>
      </section>

      <SignTool />
      <CompatTool />
      <CompatMatrix />

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Toàn bộ 12 cung</h2>
        <p className="text-muted text-center max-w-[680px] mx-auto mb-7">Mốc ngày theo hệ phổ biến; người sinh sát ranh giới nên kiểm chứng theo năm cụ thể.</p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))' }}>
          {ZODIAC.map(z => (
            <Link key={z.en} to={'/cung-hoang-dao/' + ZODIAC_SLUG[z.en]} className="panel p-5 no-underline block transition hover:-translate-y-1 hover:border-gold/40">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[2rem]">{z.sym}</span>
                <div><div className="font-serif text-[1.2rem] text-cream">{z.ten}</div><div className="note">{z.from[1]}/{z.from[0]} – {z.to[1]}/{z.to[0]}</div></div>
              </div>
              <div className="flex gap-2 flex-wrap my-2"><span className={`pill ${elColor[z.nguyenTo]}`}>{z.nguyenTo}</span><span className="badge">{z.sao}</span></div>
              <p className="text-[.92rem] text-muted m-0">{z.net}</p>
              <p className="note mt-1 mb-0">Tính chất {z.tinh} · Cơ thể: {z.than}</p>
              <p className="note mt-2 mb-0">Màu {LUCKY[z.en].mau} · Đá {LUCKY[z.en].da} · Số {LUCKY[z.en].so}</p>
              <p className="text-gold font-semibold text-[.85rem] mt-2 mb-0">Xem chi tiết →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Lưu ý.</b> Chiêm tinh phương Tây là hệ thống biểu tượng – văn hóa, <b>không phải khoa học</b>. Mốc ngày có thể lệch ±1 ngày tùy năm;
          màu/đá/số may mắn theo quan niệm phổ biến, <span className="note">cần kiểm chứng thêm</span>.
        </div>
      </section>
    </>
  )
}

function SignTool() {
  const [params, setParams] = useSearchParams()
  const [d, setD] = useState(''); const [m, setM] = useState(''); const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const [copied, setCopied] = useState('')
  const compute = (dd, mm) => (dd && mm && dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12) ? { ...getZodiac(dd, mm), decan: decanOf(dd, mm) } : null
  useEffect(() => {
    const dd = +(params.get('d') || 0), mm = +(params.get('m') || 0)
    if (dd && mm) { setD(String(dd)); setM(String(mm)); const r = compute(dd, mm); if (r) setRes(r) }
    // eslint-disable-next-line
  }, [])
  useEffect(() => { if (res) { try { localStorage.setItem('tamso_cung', res.en) } catch (e) {} } }, [res])
  const qs = () => new URLSearchParams({ d, m }).toString()
  const shareUrl = () => routeShareUrl('/cung-hoang-dao', qs())
  const calc = () => {
    const dd = +d, mm = +m
    const r = compute(dd, mm)
    if (!r) { setErr('Vui lòng nhập ngày và tháng hợp lệ.'); setRes(null); return }
    setErr(''); setRes(r); setParams(new URLSearchParams(qs()))
  }
  const doCopy = (txt, tag) => { navigator.clipboard?.writeText(txt).then(() => { setCopied(tag); setTimeout(() => setCopied(''), 2000) }) }
  const resultText = () => res ? `✦ Cung hoàng đạo — ${res.ten} (${res.en}) · Nguyên tố ${res.nguyenTo} · ${res.sao}. Màu may mắn ${LUCKY[res.en].mau}, đá ${LUCKY[res.en].da}, số ${LUCKY[res.en].so}.\n— Tam Sở ${shareUrl()}` : ''

  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">① Xem cung của bạn</h2>
      <div className="panel p-[26px] max-w-[760px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <Field label="Ngày" value={d} set={setD} ph="16" /><Field label="Tháng" value={m} set={setM} ph="6" />
          <button className="btn btn-primary" onClick={calc}>♈ Xem cung</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade text-center">
            <div className="text-[3.4rem] leading-none">{res.sym}</div>
            <h3 className="text-[2rem] my-1">{res.ten} <span className="note">({res.en})</span></h3>
            <div className="flex gap-2 flex-wrap justify-center my-2"><span className={`pill ${elColor[res.nguyenTo]}`}>Nguyên tố {res.nguyenTo}</span><span className="badge">{res.sao}</span></div>
            <p className="max-w-[560px] mx-auto">{res.net}</p>
            <p className="note m-0">Tính chất {res.tinh} · Hành tinh {res.sao} · Cơ thể: {res.than}</p>
            <p className="note m-0">Màu may mắn {LUCKY[res.en].mau} · Đá {LUCKY[res.en].da} · Số {LUCKY[res.en].so}</p>
            {res.decan && <p className="note m-0 mt-2">Thập phân (decan) {res.decan.num}/3 — {res.decan.pure ? 'thuần ' + res.ten + ', nét đặc trưng đậm nhất' : 'mang thêm sắc thái ' + res.decan.sub.ten}</p>}
            <CungReading z={res} />
            <div className="flex gap-2 justify-center flex-wrap mt-4 no-print">
              <button className="btn btn-ghost" onClick={() => doCopy(shareUrl(), 'link')}>{copied === 'link' ? '✓ Đã chép!' : '🔗 Sao chép liên kết'}</button>
              <button className="btn btn-ghost" onClick={() => doCopy(resultText(), 'text')}>{copied === 'text' ? '✓ Đã chép!' : '📋 Chép kết quả'}</button>
              <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl())} target="_blank" rel="noopener">📘 Chia sẻ</a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function CompatTool() {
  const [d1, setD1] = useState(''); const [m1, setM1] = useState(''); const [d2, setD2] = useState(''); const [m2, setM2] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const a = getZodiac(+d1, +m1), b = getZodiac(+d2, +m2)
    if (!a || !b) { setErr('Vui lòng nhập đủ ngày/tháng của cả hai người.'); setRes(null); return }
    setErr(''); setRes(zodiacCompat(a, b))
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">② Tương hợp hai cung</h2>
      <div className="panel p-[26px] max-w-[760px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <Field label="Ngày (người 1)" value={d1} set={setD1} ph="16" /><Field label="Tháng" value={m1} set={setM1} ph="6" />
          <span className="text-gold pb-2">×</span>
          <Field label="Ngày (người 2)" value={d2} set={setD2} ph="23" /><Field label="Tháng" value={m2} set={setM2} ph="11" />
          <button className="btn btn-primary" onClick={calc}>💞 Xem hợp</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade text-center">
            <div className="flex items-center justify-center gap-4 flex-wrap mb-1">
              <span className="badge badge-gold">{res.a.sym} {res.a.ten}</span><span className="text-gold">×</span><span className="badge badge-gold">{res.b.sym} {res.b.ten}</span>
            </div>
            <div className={`font-serif text-[2.2rem] ${VC[res.verdict] || 'text-cream'}`}>{res.verdict}</div>
            <p className="max-w-[560px] mx-auto m-0">{res.note}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function Field({ label, value, set, ph }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={ph} className="field-input w-[90px]" /></div>)
}
