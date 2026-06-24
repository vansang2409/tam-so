import { usePageSeo } from '../components/useSeo.js'
import { useState } from 'react'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { HEXAGRAMS, TRIGRAMS, castHexagram, HAO_VITRI, readingGuide, maiHoa } from '../data/iching.js'
import { weaveCast } from '../data/ichingSynth.js'
import { solar2lunar } from '../data/lunar.js'
import { addItem } from '../data/collection.js'
import Modal from '../components/Modal.jsx'
import Hexagram from '../components/Hexagram.jsx'
import Reveal from '../components/Reveal.jsx'

function Line({ yang, changing, delay = 0 }) {
  return (
    <div className="flex items-center justify-center gap-2 my-1 animate-castline" style={{ animationDelay: delay + 's' }}>
      {yang
        ? <span className="inline-block w-[120px] h-[12px] bg-gold rounded-sm" />
        : <><span className="inline-block w-[52px] h-[12px] bg-gold rounded-sm" /><span className="inline-block w-[52px] h-[12px] bg-gold rounded-sm" /></>}
      {changing && <span className="text-rose-700 dark:text-rose-400 text-[.8rem]">● động</span>}
    </div>
  )
}

function HexView({ hex }) {
  return (
    <div className="text-center">
      <div className="flex justify-center my-1"><Hexagram up={hex.up} lo={hex.lo} w={56} /></div>
      <h3 className="text-[1.5rem] my-1">Quẻ {hex.n} · {hex.ten}</h3>
      <p className="note m-0">Trên {hex.up} ({TRIGRAMS[hex.up].nghia}) · Dưới {hex.lo} ({TRIGRAMS[hex.lo].nghia})</p>
      <p className="mt-2 mb-0">{hex.y}</p>
      {hex.luan && <p className="note text-left mt-3 leading-relaxed">{hex.luan}</p>}
      {hex.tuong && <p className="text-left mt-2 mb-0 leading-relaxed"><span className="text-gold font-semibold">象 Đại Tượng:</span> {hex.tuong}</p>}
      {hex.thoan && <p className="text-left mt-2 mb-0 leading-relaxed"><span className="text-gold font-semibold">卦 Thoán từ:</span> {hex.thoan}</p>}
      {hex.hao && (
        <details className="text-left mt-2">
          <summary className="cursor-pointer text-gold font-semibold text-[.9rem] marker:content-none">▸ Lời 6 hào (hào từ)</summary>
          <div className="mt-1.5">
            {hex.hao.map((ht, i) => <p key={i} className="note mb-1 leading-relaxed">{ht}</p>)}
            {hex.dung && <p className="note mb-0 leading-relaxed">{hex.dung}</p>}
          </div>
        </details>
      )}
      {hex.an && <p className="text-left mt-2 mb-0 leading-relaxed"><span className="text-gold font-semibold">💡 Hiểu nôm na:</span> {hex.an}</p>}
      {hex.src && <a href={hex.src} target="_blank" rel="noopener" className="inline-block mt-3 text-[.85rem] font-semibold">📖 Đọc nguyên văn thoán từ &amp; hào từ →</a>}
    </div>
  )
}

function MhField({ label, value, set }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} className="field-input w-[90px]" /></div>)
}
function MaiHoaTool() {
  const now = new Date()
  const [d, setD] = useState('' + now.getDate()); const [m, setM] = useState('' + (now.getMonth() + 1)); const [y, setY] = useState('' + now.getFullYear()); const [h, setH] = useState('' + now.getHours())
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const dd = +d, mm = +m, yy = +y, hh = +h
    if (!dd || !mm || !yy || mm < 1 || mm > 12 || dd < 1 || dd > 31 || hh < 0 || hh > 23) { setErr('Nhập ngày/tháng/năm + giờ (0–23) hợp lệ.'); setRes(null); return }
    const al = solar2lunar(dd, mm, yy)
    setErr(''); setRes({ al, mh: maiHoa(al.year, al.month, al.day, hh) })
  }
  return (
    <section className="wrap py-8">
      <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Gieo quẻ theo ngày giờ <span className="note">(Mai Hoa Dịch Số)</span></h2>
      <p className="text-muted text-center max-w-[680px] mx-auto mb-5">Lập quẻ từ năm–tháng–ngày–giờ âm lịch theo phép Mai Hoa — tất định, không phụ thuộc may rủi.</p>
      <div className="panel p-[26px] max-w-[820px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <MhField label="Ngày" value={d} set={setD} /><MhField label="Tháng" value={m} set={setM} /><MhField label="Năm" value={y} set={setY} /><MhField label="Giờ (0–23)" value={h} set={setH} />
          <button className="btn btn-primary" onClick={calc}>🌸 Lập quẻ</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="mt-6 animate-fade">
            <p className="text-center note">Âm lịch {res.al.day}/{res.al.month}{res.al.leap ? ' (nhuận)' : ''}/{res.al.year} · Thượng {res.mh.upper} · Hạ {res.mh.lower} · Hào động {res.mh.dong}</p>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="panel p-5"><div className="text-gold text-[.8rem] uppercase tracking-wider mb-1">Quẻ chính</div><HexView hex={res.mh.present} /></div>
              <div className="panel p-5"><div className="text-gold text-[.8rem] uppercase tracking-wider mb-1">Quẻ biến (hào động {res.mh.dong})</div><HexView hex={res.mh.changed} /></div>
            </div>
            <p className="note text-left mt-3 mb-0"><b className="text-cream">{HAO_VITRI[res.mh.dong - 1].ten}:</b> {HAO_VITRI[res.mh.dong - 1].y}</p>
            <div className="panel p-5 mt-4 text-left">
              <div className="text-gold text-[.8rem] uppercase tracking-wider mb-2 text-center">Dệt lại — một đoạn để chiêm nghiệm</div>
              <p className="m-0 leading-relaxed">{weaveCast({ present: res.mh.present, changed: res.mh.changed, changingPos: [res.mh.dong] })}</p>
            </div>
            <p className="note text-center mt-2 mb-0">Phép Mai Hoa (Thiệu Khang Tiết) — <a href="https://vi.wikipedia.org/wiki/Mai_Hoa_D%E1%BB%8Bch_s%E1%BB%91" target="_blank" rel="noopener">tham khảo</a>. Chỉ để chiêm nghiệm.</p>
          </div>
        )}
      </div>
    </section>
  )
}
export default function IChing() {
  usePageSeo({ title: 'Kinh Dịch — gieo quẻ online & tra 64 quẻ (Thoán, hào) | Tam Sở', description: 'Gieo quẻ Kinh Dịch và tra ý nghĩa 64 quẻ với lời Thoán cùng 384 hào (bản Legge 1899). Tham khảo để chiêm nghiệm, không phải lời phán chắc chắn.', path: '/kinh-dich', breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Kinh Dịch' }] })

  const [cast, setCast] = useState(null)
  const [sel, setSel] = useState(null)
  const [castCopied, setCastCopied] = useState(false)
  const [savedCast, setSavedCast] = useState(null)

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold text-kicker uppercase">Kinh Dịch · I Ching</div>
        <h1 className="text-display my-3">Gieo Quẻ Dịch</h1>
        <p className="text-muted text-lead max-w-[680px] mx-auto">
          Tĩnh tâm, nghĩ về câu hỏi của bạn rồi gieo quẻ bằng ba đồng xu. Sáu hào dựng từ dưới lên; hào động sẽ sinh ra "quẻ biến".
        </p>
      </section>

      <section className="wrap py-8">
        <div className="panel p-[26px] max-w-[760px] mx-auto text-center">
          <button className="btn btn-primary" onClick={() => setCast({ ...castHexagram(), _id: Date.now() })}>🪙 Gieo quẻ</button>
          {cast && (
            <div className="mt-6 animate-fade">
              <div className="mb-4" key={cast._id}>{[...cast.lines].reverse().map((l, i) => <Line key={i} yang={l.yang} changing={l.changing} delay={i * 0.1} />)}</div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="panel p-5"><div className="text-gold text-[.8rem] uppercase tracking-wider mb-1">Quẻ chính</div><HexView hex={cast.present} /></div>
                {cast.changed
                  ? <div className="panel p-5"><div className="text-gold text-[.8rem] uppercase tracking-wider mb-1">Quẻ biến (hào động {cast.changingPos.join(', ')})</div><HexView hex={cast.changed} /></div>
                  : <div className="panel p-5 flex items-center justify-center text-muted">Không có hào động — chỉ xét quẻ chính.</div>}
              </div>
              {cast.changingPos.length > 0 && (
                <div className="panel p-5 mt-5 text-left">
                  <div className="text-gold text-[.8rem] uppercase tracking-wider mb-2 text-center">Luận hào động</div>
                  <p className="m-0 mb-3 text-center text-cream">{readingGuide(cast.changingPos)}</p>
                  {cast.changingPos.map(p => { const v = HAO_VITRI[p - 1]; const ht = cast.present.hao && cast.present.hao[p - 1]; return <div key={p} className="mb-2"><p className="note m-0"><b className="text-cream">{v.ten}:</b> {v.y}</p>{ht && <p className="m-0 leading-relaxed">📜 {ht}</p>}</div> })}
                </div>
              )}
              <div className="panel p-5 mt-5 text-left">
                <div className="text-gold text-[.8rem] uppercase tracking-wider mb-2 text-center">Dệt lại — một đoạn để chiêm nghiệm</div>
                <p className="m-0 leading-relaxed">{weaveCast(cast)}</p>
              </div>
              <div className="flex gap-2 justify-center flex-wrap mt-5 no-print">
                <button className="btn btn-ghost" onClick={() => { const u = routeShareUrl('/kinh-dich'); let t = `✦ Quẻ Dịch: ${cast.present.n} · ${cast.present.ten}`; if (cast.changed) t += ` → biến ${cast.changed.n} · ${cast.changed.ten} (hào động ${cast.changingPos.join(', ')})`; t += `\n${cast.present.y || ''}\n— Tam Sở ${u}`; navigator.clipboard?.writeText(t).then(() => { setCastCopied(true); setTimeout(() => setCastCopied(false), 2000) }) }}>{castCopied ? '✓ Đã chép!' : '📋 Chép quẻ'}</button>
                <button className="btn btn-ghost" onClick={() => { if (!cast) return; const lines = ['Quẻ chính: ' + cast.present.n + ' · ' + cast.present.ten]; if (cast.changed) lines.push('Quẻ biến: ' + cast.changed.n + ' · ' + cast.changed.ten + ' (hào động ' + cast.changingPos.join(', ') + ')'); else lines.push('Không có hào động.'); addItem({ kind: 'iching', sig: 'iching:' + cast._id, title: 'Quẻ ' + cast.present.n + ' · ' + cast.present.ten + (cast.changed ? ' → ' + cast.changed.n + ' · ' + cast.changed.ten : ''), lines, note: cast.present.y || '', url: routeShareUrl('/kinh-dich') }); setSavedCast(cast._id) }} disabled={savedCast === cast._id}>{savedCast === cast._id ? '🔖 Đã lưu' : '🔖 Lưu vào bộ sưu tập'}</button>
                <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(routeShareUrl('/kinh-dich'))} target="_blank" rel="noopener">📘 Chia sẻ</a>
              </div>
            </div>
          )}
          <p className="note mt-4 mb-0">Gieo bằng số ngẫu nhiên trên máy bạn (ngửa=3, sấp=2). Hào tổng 6/9 là hào động.</p>
        </div>
      </section>

      <MaiHoaTool />

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Bát Quái — 8 quẻ đơn</h2>
        <p className="note text-center max-w-[680px] mx-auto mb-5">Tám quái dựng nên 64 quẻ kép. Tương ứng theo Hậu Thiên Bát Quái (Văn Vương).</p>
        <div className="panel p-4 max-w-[920px] mx-auto overflow-x-auto">
          <p className="note text-center mb-2 sm:hidden">← vuốt ngang để xem đủ bảng →</p>
          <table className="data" style={{ minWidth: 660 }}>
            <thead><tr><th>Quái</th><th>Nghĩa</th><th>Ngũ hành</th><th>Người</th><th>Thân</th><th>Hướng</th><th>Tính chất</th></tr></thead>
            <tbody>
              {Object.entries(TRIGRAMS).map(([ten, t]) => (
                <tr key={ten}>
                  <td><div className="flex items-center gap-2"><Hexagram up={ten} w={24} /><b>{ten}</b></div></td>
                  <td>{t.nghia}</td>
                  <td><span className={'pill h-' + t.hanh}>{t.hanh}</span></td>
                  <td>{t.nguoi}</td>
                  <td>{t.than}</td>
                  <td className="whitespace-nowrap">{t.huong}</td>
                  <td className="text-muted">{t.tinh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Tra cứu 64 quẻ</h2>
        <p className="text-muted text-center max-w-[680px] mx-auto mb-6">Nhấp vào một quẻ để xem bát quái và ý nghĩa.</p>
        <Reveal base="stagger-parent" className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))' }}>
          {HEXAGRAMS.map((h, i) => (
            <button key={h.n} style={{ '--i': Math.min(i, 18) }} onClick={() => setSel(h)}
              className="bg-gold/5 border border-gold/20 rounded-xl px-2 py-3 text-center cursor-pointer transition hover:-translate-y-1 hover:border-gold/40">
              <div className="flex justify-center mb-1"><Hexagram up={h.up} lo={h.lo} w={38} /></div>
              <div className="text-muted text-[.72rem] mt-1">Quẻ {h.n}</div>
              <div className="text-[.86rem] font-semibold text-cream leading-tight">{h.ten}</div>
            </button>
          ))}
        </Reveal>
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Lưu ý.</b> Kinh Dịch là kinh điển triết học – bói toán phương Đông; lời quẻ ở đây là <b>gloss ngắn</b> mang tính tham khảo, không thay lời kinh đầy đủ.
          Ý nghĩa 6 ngôi hào và cách luận hào động theo <a href="https://horos.vn/blog/post/64-que-kinh-dich-bang-tra-cuu-day-du-huong-dan-gieo-que-va-giai-que" target="_blank" rel="noopener">phương pháp phổ biến (Horos)</a>; <b>nguyên văn thoán từ &amp; hào từ</b> từng quẻ xem ở liên kết trong mỗi quẻ (nguồn <a href="https://dich.kabala.vn/" target="_blank" rel="noopener">Dịch học Kabala</a>).
          Tên quẻ theo thứ tự Văn Vương; bát quái theo <a href="https://vi.wikipedia.org/wiki/Kinh_D%E1%BB%8Bch" target="_blank" rel="noopener">Kinh Dịch (Wikipedia)</a>. Không phải khoa học.
        </div>
      </section>

      <Modal open={!!sel} onClose={() => setSel(null)}>{sel && <HexView hex={sel} />}</Modal>
    </>
  )
}
