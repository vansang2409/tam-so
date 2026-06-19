import { usePageSeo } from '../components/useSeo.js'
import { useState, useEffect } from 'react'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { useSearchParams } from 'react-router-dom'
import { THIEN_CAN, DIA_CHI, NGU_HANH, tinhCanChi, invSinh, invKhac, xemHopTuoi, dayCanChi, hourCanChi, gioHoangDao, tamTai, cungPhi, STAR_MEANING, CONGIAP_LUAN, NAP_AM_NGHIA, saoHan, SAO_HAN, hopTuoiChi } from '../data/tuvi.js'
import { solar2lunar } from '../data/lunar.js'

const VC = { 'Rất hợp': 'text-emerald-800', 'Hợp': 'text-emerald-800', 'Bình hòa': 'text-amber-800', 'Cần lưu ý': 'text-rose-700', 'Khá xung khắc': 'text-rose-700' }

export default function TuVi() {
  usePageSeo({ title: 'Tử vi & Can Chi — tuổi, âm lịch, hợp tuổi, sao hạn | Tam Sở', description: 'Tra Can Chi tuổi, ngày âm lịch, hợp tuổi – xung khắc, Tam Tai, Bát Trạch và sao hạn theo năm. Dữ kiện lịch pháp kèm diễn giải để tham khảo.', path: '/tu-vi', breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Tử vi & Can Chi' }] })

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Can Chi · Lục Thập Hoa Giáp · Bát Trạch</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Tử Vi · Can Chi</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">Tra Can Chi năm/ngày/giờ, ngũ hành nạp âm, hợp tuổi, giờ hoàng đạo, Tam Tai và cung phi – hướng hợp tuổi.</p>
      </section>

      <CanChiTool /><CompatTool /><DayTool /><CungPhiTool /><SaoHanTool />
      <CongiapMatrix />

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">10 Thiên Can &amp; 12 Địa Chi</h2>
        <div className="grid md:grid-cols-2 gap-5 mt-3.5">
          <div className="overflow-x-auto"><table className="data"><thead><tr><th>#</th><th>Thiên Can</th><th>Ngũ hành</th><th>Â/D</th><th>Hướng</th><th>Hình tượng</th></tr></thead>
            <tbody>{THIEN_CAN.map((c, i) => <tr key={c.ten}><td>{i + 1}</td><td><b>{c.ten}</b></td><td><span className={'pill h-' + c.hanh}>{c.hanh}</span></td><td>{c.amduong}</td><td>{c.huong}</td><td className="text-muted">{c.nghia}</td></tr>)}</tbody></table></div>
          <div className="overflow-x-auto"><table className="data"><thead><tr><th>#</th><th>Địa Chi</th><th>Con giáp</th><th>Ngũ hành</th><th>Giờ</th><th>Hướng</th></tr></thead>
            <tbody>{DIA_CHI.map((c, i) => <tr key={c.ten}><td>{i + 1}</td><td><b>{c.ten}</b></td><td>{c.con}</td><td><span className={'pill h-' + c.hanh}>{c.hanh}</span></td><td className="whitespace-nowrap">{c.gio}h</td><td>{c.huong}</td></tr>)}</tbody></table></div>
        </div>
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Dữ kiện &amp; diễn giải.</b> Can–Chi–nạp âm và Can Chi ngày/giờ là <b>lịch pháp, kiểm chứng được</b> (mốc 1/3/2000 = Mậu Ngọ).
          Hợp tuổi, giờ hoàng đạo, Tam Tai, cung phi/Bát Trạch là <b>quan niệm phong thủy truyền thống</b>, chỉ tham khảo. Ô <b>① Tra Can Chi</b> nếu nhập đủ ngày/tháng sẽ <b>tự quy đổi âm lịch</b> (thuật toán <a href="https://www.informatik.uni-leipzig.de/~duc/amlich/" target="_blank" rel="noopener">Hồ Ngọc Đức</a>) để chuẩn ranh giới Tết; ô cung phi vẫn nhập theo năm âm lịch.
          Nguồn: <a href="https://wiki.batdongsan.com.vn/wiki/thien-can-dia-chi-783653" target="_blank" rel="noopener">Wiki Batdongsan</a>, <a href="https://wiki.batdongsan.com.vn/wiki/cung-phi-la-gi-768289" target="_blank" rel="noopener">Cung phi Bát Trạch</a>, <a href="https://vi.wikipedia.org/wiki/Gi%E1%BB%9D_ho%C3%A0ng_%C4%91%E1%BA%A1o" target="_blank" rel="noopener">Giờ hoàng đạo</a>.
        </div>
      </section>
    </>
  )
}

function CongiapMatrix() {
  const mark = { 'Tam hợp': '◎', 'Lục hợp': '○', 'Lục xung': '✕', 'Tứ hành xung': '△', 'Cùng tuổi': '=', 'Bình thường': '·' }
  const sty = {
    'Tam hợp': { background: 'rgba(120,210,150,.34)', color: '#d6f5e0' },
    'Lục hợp': { background: 'rgba(120,210,150,.16)', color: '#a7e6bf' },
    'Lục xung': { background: 'rgba(235,120,120,.24)', color: '#f3aaaa' },
    'Tứ hành xung': { background: 'rgba(211,162,78,.20)', color: '#ecd198' },
    'Cùng tuổi': { background: 'rgba(255,255,255,.07)', color: '#e7d8b0' },
    'Bình thường': { background: 'rgba(255,255,255,.03)', color: '#9b8e72' }
  }
  return (
    <section className="wrap py-8">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">Bảng hợp tuổi 12 con giáp</h2>
      <p className="note text-center max-w-[660px] mx-auto mb-4">Tra nhanh quan hệ <b>Tam hợp · Lục hợp · Lục xung · Tứ hành xung</b> giữa các tuổi (theo địa chi). Di chuột/chạm vào ô để xem chi tiết — quan niệm dân gian, mang tính tham khảo.</p>
      <p className="note text-center mb-2 sm:hidden">← vuốt ngang để xem đủ bảng →</p>
        <div className="panel p-4 max-w-[920px] mx-auto overflow-x-auto">
        <table className="border-collapse mx-auto" style={{ minWidth: 470 }}>
          <thead>
            <tr>
              <th className="p-1 text-gold">✦</th>
              {DIA_CHI.map(z => <th key={z.ten} title={z.con} className="p-1 text-[.82rem] font-semibold text-cream">{z.ten}</th>)}
            </tr>
          </thead>
          <tbody>
            {DIA_CHI.map(a => (
              <tr key={a.ten}>
                <th title={a.con} className="p-1 pr-2 text-[.82rem] font-semibold text-cream text-right whitespace-nowrap">{a.ten}</th>
                {DIA_CHI.map(b => {
                  const v = hopTuoiChi(a.ten, b.ten)
                  return (
                    <td key={b.ten} title={`${a.ten} (${a.con}) × ${b.ten} (${b.con}): ${v}`} className="p-0 text-center align-middle">
                      <div className="m-[2px] rounded-md flex items-center justify-center text-[.82rem] mx-auto" style={{ width: 30, height: 30, ...sty[v] }}>{mark[v]}</div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-3 flex-wrap justify-center mt-4 text-[.82rem] text-muted">
          {['Tam hợp', 'Lục hợp', 'Lục xung', 'Tứ hành xung'].map(v => <span key={v} className="inline-flex items-center gap-1.5"><span className="rounded inline-flex items-center justify-center" style={{ width: 22, height: 22, ...sty[v] }}>{mark[v]}</span>{v}</span>)}
        </div>
      </div>
    </section>
  )
}

function CanChiTool() {
  const [params, setParams] = useSearchParams()
  const [y, setY] = useState(''); const [m, setM] = useState(''); const [d, setD] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const [copied, setCopied] = useState('')
  const compute = (yy, mm, dd) => {
    if (!yy || yy < 1 || yy > 3000) return null
    let al = null, ccYear = yy
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) { al = solar2lunar(dd, mm, yy); ccYear = al.year }
    const r = tinhCanChi(ccYear)
    const t = new Date(); const cur = tinhCanChi(solar2lunar(t.getDate(), t.getMonth() + 1, t.getFullYear()).year)
    return { ...r, yy, ccYear, al, tt: tamTai(ccYear), tuoiMu: cur.year - ccYear + 1, curCanChi: cur.tenCanChi, namTuoi: cur.chi === r.chi }
  }
  useEffect(() => {
    const yy = +(params.get('y') || 0)
    if (yy) { setY(String(yy)); const mm = +(params.get('m') || 0), dd = +(params.get('d') || 0); if (mm) setM(String(mm)); if (dd) setD(String(dd)); const r = compute(yy, mm, dd); if (r) setRes(r) }
    // eslint-disable-next-line
  }, [])
  const qs = () => new URLSearchParams({ y, ...(m ? { m } : {}), ...(d ? { d } : {}) }).toString()
  const shareUrl = () => routeShareUrl('/tu-vi', qs())
  const calc = () => {
    const r = compute(+y, +m, +d)
    if (!r) { setErr('Nhập năm sinh hợp lệ.'); setRes(null); return }
    setErr(''); setRes(r); setParams(new URLSearchParams(qs()))
  }
  const doCopy = (txt, tag) => { navigator.clipboard?.writeText(txt).then(() => { setCopied(tag); setTimeout(() => setCopied(''), 2000) }) }
  const resultText = () => res ? `✦ Tử vi · Can Chi — ${res.tenCanChi} (tuổi ${res.conGiap}) · Mệnh ${res.napAm} (${res.menhHanh}). Màu hợp mệnh: ${NGU_HANH.mau[res.menhHanh]}. Năm nay ${res.tuoiMu} tuổi âm.\n— Tam Sở ${shareUrl()}` : ''

  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">① Tra Can Chi <span className="note">(năm sinh)</span></h2>
      <div className="panel p-[26px] max-w-[820px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center"><Field label="Năm sinh *" value={y} set={setY} ph="1990" w="140px" /><Field label="Tháng" value={m} set={setM} ph="(cảnh báo Tết)" w="150px" /><Field label="Ngày" value={d} set={setD} ph="" w="100px" /><button className="btn btn-primary" onClick={calc}>☯ Tra</button></div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade">
            <div className="text-center flex gap-2 justify-center flex-wrap"><span className="badge badge-gold">{res.al ? 'Dương lịch ' + res.yy : 'Năm ' + res.yy}</span>{res.al && <span className="badge">Âm lịch {res.al.day}/{res.al.month}{res.al.leap ? ' (nhuận)' : ''}/{res.al.year}</span>}</div>
            <h3 className="text-center text-[2rem] my-1.5">{res.tenCanChi}</h3>
            <p className="text-center text-muted -mt-1.5">Tuổi <b>{res.conGiap}</b> · Mệnh <span className={'pill h-' + res.menhHanh}>{res.napAm}</span></p>
            <dl className="kv">
              <dt className="text-muted font-semibold">Thiên Can</dt><dd>{res.can} — {res.canHanh} ({res.canAmDuong})</dd>
              <dt className="text-muted font-semibold">Địa Chi</dt><dd>{res.chi} — {res.conGiap}</dd>
              <dt className="text-muted font-semibold">Nạp âm</dt><dd><span className={'pill h-' + res.menhHanh}>{res.menhHanh}</span> — {res.napAm}</dd>
              <dt className="text-muted font-semibold">Tương sinh / khắc</dt><dd>{res.menhHanh} sinh {NGU_HANH.sinh[res.menhHanh]}, khắc {NGU_HANH.khac[res.menhHanh]}</dd>
              <dt className="text-muted font-semibold">Màu hợp mệnh</dt><dd>{NGU_HANH.mau[res.menhHanh]}</dd>
              <dt className="text-muted font-semibold">Ý nghĩa nạp âm</dt><dd>{NAP_AM_NGHIA[res.napAm]}</dd>
              <dt className="text-muted font-semibold">Luận con giáp</dt><dd>{CONGIAP_LUAN[res.chi]}</dd>
              <dt className="text-muted font-semibold">Tam Tai</dt><dd>Tuổi {res.tt.nhom.join('-')} gặp Tam Tai vào các năm <b>{res.tt.nam.join(', ')}</b></dd>
              <dt className="text-muted font-semibold">Tuổi âm (mụ) năm nay</dt><dd>{res.tuoiMu} tuổi · năm nay {res.curCanChi}{res.namTuoi && <b className="text-gold"> — đúng NĂM TUỔI (cùng con giáp)!</b>}</dd>
            </dl>
            {!res.al && <div className="disclaimer mt-2"><span className="note">Mẹo: nhập thêm <b>ngày &amp; tháng sinh</b> để tự động quy đổi âm lịch — chuẩn cho người sinh quanh Tết.</span></div>}
            {res.al && res.ccYear !== res.yy && <div className="disclaimer mt-2"><b>Đã quy đổi theo Tết:</b> ngày sinh rơi vào <b>trước Tết</b> năm dương {res.yy}, nên tính theo năm âm lịch <b>{res.ccYear}</b> — tức tuổi <b>{res.tenCanChi}</b>.</div>}
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
  const [y1, setY1] = useState(''); const [y2, setY2] = useState(''); const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const a = +y1, b = +y2
    if (!a || !b || a < 1 || b < 1) { setErr('Nhập hai năm sinh hợp lệ.'); setRes(null); return }
    setErr(''); setRes(xemHopTuoi(a, b))
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">② Xem hợp tuổi <span className="note">(hai năm sinh)</span></h2>
      <div className="panel p-[26px] max-w-[820px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center"><Field label="Người 1" value={y1} set={setY1} ph="1990" w="140px" /><Field label="Người 2" value={y2} set={setY2} ph="1992" w="140px" /><button className="btn btn-primary" onClick={calc}>💑 Xem</button></div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade text-center">
            <div className="flex items-center justify-center gap-4 flex-wrap mb-2"><span className="badge badge-gold">{res.a.year}: {res.a.tenCanChi} ({res.a.conGiap})</span><span className="text-gold">✕</span><span className="badge badge-gold">{res.b.year}: {res.b.tenCanChi} ({res.b.conGiap})</span></div>
            <div className={'font-serif text-[2.4rem] ' + (VC[res.verdict] || 'text-cream')}>{res.verdict}</div>
            <div className="flex gap-2 flex-wrap justify-center my-3">{res.notes.map((n, i) => <span key={i} className="badge">{n}</span>)}</div>
            <p className="m-0">Nạp âm: <span className={'pill h-' + res.a.menhHanh}>{res.a.menhHanh}</span> &amp; <span className={'pill h-' + res.b.menhHanh}>{res.b.menhHanh}</span> — <b>{res.hanhRel.type}</b>.</p>
            <p className="note mt-2 mb-0">Theo quan niệm truyền thống, chỉ để tham khảo cho vui.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function DayTool() {
  const today = new Date()
  const [d, setD] = useState('' + today.getDate()); const [m, setM] = useState('' + (today.getMonth() + 1)); const [y, setY] = useState('' + today.getFullYear()); const [h, setH] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const dd = +d, mm = +m, yy = +y
    if (!dd || !mm || !yy || mm < 1 || mm > 12 || dd < 1 || dd > 31) { setErr('Nhập ngày/tháng/năm hợp lệ.'); setRes(null); return }
    const day = dayCanChi(yy, mm, dd)
    const hours = gioHoangDao(day.chi)
    const hour = (h !== '' && +h >= 0 && +h <= 23) ? hourCanChi(day.canIdx, +h) : null
    const al = solar2lunar(dd, mm, yy)
    setErr(''); setRes({ day, hours, hour, al })
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">③ Can Chi ngày &amp; giờ hoàng đạo</h2>
      <div className="panel p-[26px] max-w-[820px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center"><Field label="Ngày" value={d} set={setD} ph="16" w="90px" /><Field label="Tháng" value={m} set={setM} ph="6" w="90px" /><Field label="Năm" value={y} set={setY} ph="2026" w="110px" /><Field label="Giờ (0–23)" value={h} set={setH} ph="9" w="120px" /><button className="btn btn-primary" onClick={calc}>🕒 Xem ngày</button></div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade">
            <p className="text-center text-[1.4rem] font-serif m-0">Ngày <span className="text-gold">{res.day.tenCanChi}</span>{res.hour && <> · Giờ <span className="text-gold">{res.hour.tenCanChi}</span> ({res.hour.range}h)</>}</p>
            {res.al && <p className="note text-center mt-1 mb-0">Âm lịch {res.al.day}/{res.al.month}{res.al.leap ? ' (nhuận)' : ''}/{res.al.year}</p>}
            <p className="note text-center">Giờ hoàng đạo (tốt) tô vàng, hắc đạo để mờ:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {res.hours.map(g => (
                <div key={g.chi} className={'rounded-lg px-2 py-2 text-center border text-[.86rem] ' + (g.hoangdao ? 'border-gold/50 bg-[rgba(211,162,78,.14)] text-gold' : 'border-black/15 text-black/45')}>
                  <b>{g.chi}</b> <span className="opacity-80">{g.range}h</span><br />{g.hoangdao ? 'Hoàng đạo' : 'Hắc đạo'}
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="note text-center mt-4 mb-0">Mặc định là ngày hôm nay. Giờ Tý bắt đầu 23h.</p>
      </div>
    </section>
  )
}

function CungPhiTool() {
  const [y, setY] = useState(''); const [g, setG] = useState('nam')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const yy = +y
    if (!yy || yy < 1 || yy > 3000) { setErr('Nhập năm sinh hợp lệ.'); setRes(null); return }
    setErr(''); setRes(cungPhi(yy, g))
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">④ Cung phi &amp; hướng hợp tuổi <span className="note">(Bát Trạch)</span></h2>
      <div className="panel p-[26px] max-w-[820px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <Field label="Năm sinh (âm lịch)" value={y} set={setY} ph="1990" w="150px" />
          <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Giới tính</label>
            <select value={g} onChange={e => setG(e.target.value)} className="field-input"><option value="nam">Nam</option><option value="nu">Nữ</option></select></div>
          <button className="btn btn-primary" onClick={calc}>🧭 Xem cung phi</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade">
            <div className="text-center">
              <h3 className="text-[2rem] my-1">Cung {res.cung} <span className="note">({res.menh})</span></h3>
              <span className="badge badge-gold">{res.menhTrach}</span> <span className="badge">Hướng bản mệnh: {res.huongBanMenh}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-5">
              <div>
                <div className="text-emerald-800 font-semibold mb-2">4 hướng TỐT</div>
                {res.good.map(x => <div key={x.cung} className="flex justify-between gap-2 border-b border-white/5 py-1.5 text-[.92rem]"><span><b className="text-cream">{x.dir}</b> · {x.star}</span><span className="note text-right">{STAR_MEANING[x.star]}</span></div>)}
              </div>
              <div>
                <div className="text-rose-700 font-semibold mb-2">4 hướng XẤU</div>
                {res.bad.map(x => <div key={x.cung} className="flex justify-between gap-2 border-b border-white/5 py-1.5 text-[.92rem]"><span><b className="text-cream">{x.dir}</b> · {x.star}</span><span className="note text-right">{STAR_MEANING[x.star]}</span></div>)}
              </div>
            </div>
            <p className="note mt-4 mb-0">Dùng để chọn hướng nhà, hướng bếp, bàn làm việc… Người {res.menhTrach} nên ưu tiên các hướng tốt phía trên. Chỉ mang tính tham khảo phong thủy.</p>
          </div>
        )}
      </div>
    </section>
  )
}

const SAOC = { 'tốt': 'text-emerald-800', 'trung': 'text-amber-800', 'xấu': 'text-rose-700' }
function SaoHanTool() {
  const [y, setY] = useState(''); const [g, setG] = useState('nam')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const yy = +y
    if (!yy || yy < 1900 || yy > 2100) { setErr('Nhập năm sinh hợp lệ (1900–2100).'); setRes(null); return }
    const t = new Date(); const curLunar = solar2lunar(t.getDate(), t.getMonth() + 1, t.getFullYear()).year
    const tuoiMu = curLunar - yy + 1
    if (tuoiMu < 1) { setErr('Năm sinh chưa hợp lệ.'); setRes(null); return }
    setErr(''); setRes({ tuoiMu, cur: tinhCanChi(curLunar), sao: saoHan(tuoiMu, g) })
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">⑤ Sao hạn năm nay <span className="note">(Cửu Diệu)</span></h2>
      <div className="panel p-[26px] max-w-[820px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <Field label="Năm sinh (âm lịch)" value={y} set={setY} ph="1990" w="150px" />
          <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Giới tính</label>
            <select value={g} onChange={e => setG(e.target.value)} className="field-input"><option value="nam">Nam</option><option value="nu">Nữ</option></select></div>
          <button className="btn btn-primary" onClick={calc}>🌟 Xem sao hạn</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="panel p-[26px] mt-6 animate-fade text-center">
            <span className="badge badge-gold">Tuổi mụ {res.tuoiMu} · năm {res.cur.tenCanChi}</span>
            <h3 className={'text-[2rem] my-1.5 ' + (SAOC[res.sao.loai] || 'text-cream')}>{res.sao.ten}</h3>
            <div className="mb-2"><span className="badge">Sao {res.sao.loai}</span></div>
            <p className="max-w-[600px] mx-auto m-0">{res.sao.y}</p>
            <p className="note mt-3 mb-0">Chu kỳ sao đối chiếu <a href="https://quantrimang.com/cuoc-song/bang-sao-giai-han-theo-tuoi-169419" target="_blank" rel="noopener">bảng sao hạn 2026 (Quantrimang)</a>. Quan niệm dân gian, chỉ để tham khảo — không hù dọa.</p>
          </div>
        )}
      </div>
    </section>
  )
}
function Field({ label, value, set, ph, w = '120px' }) {
  return (<div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">{label}</label>
    <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={ph} className="field-input" style={{ width: w }} /></div>)
}
