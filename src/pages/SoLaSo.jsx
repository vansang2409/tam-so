import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { solar2lunar } from '../data/lunar.js'
import { anSao } from '../data/tuvidauso.js'
import { hopTuoiChi } from '../data/tuvi.js'

const GIO_LABEL = ['Tý (23–1h)', 'Sửu (1–3h)', 'Dần (3–5h)', 'Mão (5–7h)', 'Thìn (7–9h)', 'Tỵ (9–11h)', 'Ngọ (11–13h)', 'Mùi (13–15h)', 'Thân (15–17h)', 'Dậu (17–19h)', 'Tuất (19–21h)', 'Hợi (21–23h)']
const REL_CLS = { 'Tam hợp': 'text-emerald-800', 'Lục hợp': 'text-emerald-800', 'Lục xung': 'text-rose-700', 'Tứ hành xung': 'text-rose-700', 'Cùng tuổi': 'text-amber-800', 'Bình thường': 'text-muted' }
const REL_NOTE = {
  'Tam hợp': 'Hai chi nâng đỡ nhau (nhóm tam hợp) — thường dễ đồng điệu.',
  'Lục hợp': 'Hai chi tương hợp từng đôi — hợp tác, hòa thuận.',
  'Lục xung': 'Hai chi xung nhau — khác biệt rõ, cần dung hòa và lắng nghe.',
  'Tứ hành xung': 'Hai chi thuộc nhóm dễ va chạm — nên kiên nhẫn, mềm mỏng với nhau.',
  'Cùng tuổi': 'Cùng địa chi — đồng cảm nhưng đôi khi giống nhau quá nên thiếu bổ khuyết.',
  'Bình thường': 'Không hợp/xung nổi bật — tùy duyên và cách cư xử mỗi người.'
}

function person(d, m, y, h, g) {
  if (!(d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100)) return null
  const al = solar2lunar(d, m, y)
  const ls = anSao({ lunarDay: al.day, lunarMonth: al.month, year: al.year, hourRank: +h, gender: g, viewYear: new Date().getFullYear() })
  const star = cung => { const p = ls.palaces.find(x => x.cung === cung); if (!p) return { chi: '—', ten: '—' }; return { chi: p.chi, ten: p.sao.filter(s => s.loai === 'chinh').map(s => s.ten).join(', ') || 'vô chính diệu' } }
  return { ls, al, solar: { d, m, y }, menh: star('Mệnh'), phuThe: star('Phu Thê') }
}

function PersonCard({ label, p }) {
  return (
    <div className="panel p-5">
      <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1.5">{label}</div>
      <div className="font-serif text-[1.3rem]">{p.ls.nam} <span className="note">({p.ls.amDuong})</span></div>
      <div className="note mb-2">DL {p.solar.d}/{p.solar.m}/{p.solar.y} · Cục {p.ls.cuc.ten}</div>
      <p className="m-0 leading-relaxed"><b className="text-cream">Mệnh tại {p.menh.chi}:</b> {p.menh.ten}</p>
      <p className="note mt-0.5 mb-2">Cách cục: {p.ls.menhCach.ten} · Thân cư {p.ls.thanCu}</p>
      <p className="m-0 leading-relaxed"><b className="text-cream">Cung Phu Thê ({p.phuThe.chi}):</b> {p.phuThe.ten}</p>
    </div>
  )
}

export default function SoLaSo() {
  const [params, setParams] = useSearchParams()
  const init = (k, dft) => params.get(k) || dft
  const [a, setA] = useState({ d: init('d1', ''), m: init('m1', ''), y: init('y1', ''), h: init('h1', '7'), g: init('g1', 'nam') })
  const [b, setB] = useState({ d: init('d2', ''), m: init('m2', ''), y: init('y2', ''), h: init('h2', '7'), g: init('g2', 'nu') })
  const [res, setRes] = useState(null); const [err, setErr] = useState(''); const [copied, setCopied] = useState(false)

  const compute = (A, B) => {
    const pa = person(+A.d, +A.m, +A.y, A.h, A.g), pb = person(+B.d, +B.m, +B.y, B.h, B.g)
    if (!pa || !pb) return null
    return { pa, pb, rel: hopTuoiChi(pa.ls.namChi, pb.ls.namChi) }
  }
  useEffect(() => {
    if (params.get('d1') && params.get('y1') && params.get('d2') && params.get('y2')) { const r = compute(a, b); if (r) setRes(r) } // eslint-disable-next-line
  }, [])
  const qs = () => new URLSearchParams({ d1: a.d, m1: a.m, y1: a.y, h1: a.h, g1: a.g, d2: b.d, m2: b.m, y2: b.y, h2: b.h, g2: b.g }).toString()
  const shareUrl = () => routeShareUrl('/so-la-so', qs())
  const go = () => {
    const r = compute(a, b)
    if (!r) { setErr('Nhập đủ ngày/tháng/năm dương lịch hợp lệ cho cả hai người (1900–2100).'); setRes(null); return }
    setErr(''); setRes(r); setParams(new URLSearchParams(qs()))
  }
  const copy = () => navigator.clipboard?.writeText(shareUrl()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold text-kicker uppercase">Tử Vi Đẩu Số · Đối chiếu hai lá số</div>
        <h1 className="text-display my-3">So đôi lá số</h1>
        <p className="text-muted text-lead max-w-[720px] mx-auto">Đặt hai lá số cạnh nhau để cùng nhìn — Mệnh, cung Phu Thê và quan hệ địa chi năm sinh. Đây là <b>đối chiếu dữ kiện để tham khảo</b>, không phải lời phán hợp hay không hợp.</p>
      </section>

      <section className="wrap pb-4">
        <div className="panel p-[22px] max-w-[900px] mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <PersonForm label="Người thứ nhất" p={a} set={setA} />
            <PersonForm label="Người thứ hai" p={b} set={setB} />
          </div>
          <div className="text-center mt-4"><button className="btn btn-primary" onClick={go}>💞 So hai lá số</button></div>
          {err && <div className="disclaimer mt-4">{err}</div>}
        </div>
      </section>

      {res && (
        <>
          <section className="wrap pb-2">
            <div className="grid md:grid-cols-2 gap-4 max-w-[900px] mx-auto animate-fade">
              <PersonCard label="Người thứ nhất" p={res.pa} />
              <PersonCard label="Người thứ hai" p={res.pb} />
            </div>
          </section>
          <section className="wrap py-3">
            <div className="panel p-[22px] max-w-[900px] mx-auto text-center">
              <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1.5">Quan hệ địa chi năm sinh</div>
              <div className="text-[1.5rem] font-serif">{res.pa.ls.namChi} &amp; {res.pb.ls.namChi} → <span className={REL_CLS[res.rel] || 'text-cream'}>{res.rel}</span></div>
              <p className="note mt-1 mb-0 max-w-[620px] mx-auto">{REL_NOTE[res.rel]}</p>
              <div className="flex gap-2 justify-center flex-wrap mt-4 no-print">
                <button className="btn btn-ghost" onClick={copy}>{copied ? '✓ Đã chép!' : '🔗 Sao chép liên kết'}</button>
                <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl())} target="_blank" rel="noopener">📘 Chia sẻ</a>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="wrap py-8">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Đối chiếu dữ kiện — không phải phán quyết.</b> Việc an sao hai lá số và quan hệ địa chi (tam hợp / lục hợp / lục xung / tứ hành xung) là <b>tính toán có cơ sở</b>. Nhưng <b>tử vi hợp đôi là việc rất phức tạp</b>: cần luận tổng hòa nhiều cung, độ sáng, tứ hóa và sự đồng thuận của hai người — nên đây <b>KHÔNG phải kết luận "hợp" hay "không hợp"</b>. Một quan hệ tốt đẹp phụ thuộc vào sự thấu hiểu và vun đắp của cả hai, hơn bất kỳ lá số nào. Xem thêm <a href="#/tuong-hop">Tương hợp</a> (Số Chủ Đạo · Can Chi · cung hoàng đạo).
        </div>
      </section>
    </>
  )
}

function PersonForm({ label, p, set }) {
  const u = (k, v) => set({ ...p, [k]: v })
  const fld = (k, lb, ph, w) => (
    <div className="flex flex-col gap-1.5"><label className="text-[.82rem] text-muted font-semibold">{lb}</label>
      <input type="number" value={p[k]} onChange={e => u(k, e.target.value)} placeholder={ph} className="field-input" style={{ width: w }} /></div>
  )
  return (
    <div className="border border-gold/20 rounded-xl p-4">
      <div className="font-semibold text-cream mb-2.5">{label}</div>
      <div className="flex gap-2.5 flex-wrap items-end">
        {fld('d', 'Ngày', '15', '64px')}{fld('m', 'Tháng', '8', '64px')}{fld('y', 'Năm (DL)', '1990', '92px')}
        <div className="flex flex-col gap-1.5"><label className="text-[.82rem] text-muted font-semibold">Giờ sinh</label>
          <select value={p.h} onChange={e => u('h', e.target.value)} className="field-input" style={{ width: '136px' }}>
            {GIO_LABEL.map((lb, i) => <option key={i} value={i + 1}>{lb}</option>)}
          </select></div>
        <div className="flex flex-col gap-1.5"><label className="text-[.82rem] text-muted font-semibold">Giới</label>
          <select value={p.g} onChange={e => u('g', e.target.value)} className="field-input" style={{ width: '88px' }}>
            <option value="nam">Nam</option><option value="nu">Nữ</option>
          </select></div>
      </div>
    </div>
  )
}
