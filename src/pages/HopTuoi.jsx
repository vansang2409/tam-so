import { useParams, Link } from 'react-router-dom'
import { usePageSeo } from '../components/useSeo.js'
import SeoTag from '../components/SeoTag.jsx'
import NotFound from '../components/NotFound.jsx'
import RelatedLinks from '../components/RelatedLinks.jsx'
import { CONGIAP, conGiapBySlug } from '../data/congiap.js'
import { hopTuoiChi } from '../data/tuvi.js'

const EMOJI = { 'Tý': '🐭', 'Sửu': '🐂', 'Dần': '🐯', 'Mão': '🐱', 'Thìn': '🐲', 'Tỵ': '🐍', 'Ngọ': '🐴', 'Mùi': '🐐', 'Thân': '🐵', 'Dậu': '🐓', 'Tuất': '🐶', 'Hợi': '🐷' }

// Thứ tự nhóm + nhãn trấn an (dữ kiện Can Chi, chỉ tham khảo).
const GROUPS = [
  { key: 'Tam hợp', label: 'Tam hợp — rất hợp', note: 'nâng đỡ, đồng điệu nhất', cls: 'text-emerald-800' },
  { key: 'Lục hợp', label: 'Lục hợp — hợp', note: 'hợp ý, dễ đồng hành', cls: 'text-emerald-800' },
  { key: 'Bình thường', label: 'Bình thường', note: 'không xung không hợp nổi bật', cls: 'text-amber-800' },
  { key: 'Tứ hành xung', label: 'Tứ hành xung — cần dung hòa', note: 'dễ khác nhịp, cần nhường nhau', cls: 'text-rose-700' },
  { key: 'Lục xung', label: 'Lục xung — cần lưu ý', note: 'dễ va chạm, cần kiên nhẫn', cls: 'text-rose-700' }
]

function groupBy(chi) {
  const g = {}
  for (const o of CONGIAP) {
    if (o.ten === chi) continue
    const r = hopTuoiChi(chi, o.ten)
    ;(g[r] = g[r] || []).push(o)
  }
  return g
}

function HopTuoiDetail({ c }) {
  const g = groupBy(c.ten)
  usePageSeo({
    title: 'Tuổi ' + c.ten + ' hợp tuổi nào? Hợp – khắc tuổi ' + c.ten + ' (' + c.con + ') | Tam Sở',
    description: 'Tuổi ' + c.ten + ' (' + c.con + ') hợp tuổi nào, khắc tuổi nào theo Tam hợp – Lục hợp – Lục xung (Can Chi). Dữ kiện truyền thống, mang tính tham khảo, không định đoạt mối quan hệ.',
    path: '/hop-tuoi/' + c.slug,
    breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Hợp tuổi', path: '/hop-tuoi' }, { name: 'Tuổi ' + c.ten }]
  })
  return (
    <>
      <section className="wrap pt-[60px] pb-1 text-center">
        <p className="note mb-1"><Link to="/hop-tuoi" className="text-gold">Hợp tuổi</Link> / Tuổi {c.ten}</p>
        <div className="text-[3.4rem] leading-none">{EMOJI[c.ten]}</div>
        <h1 className="text-[clamp(1.8rem,4.5vw,2.6rem)] my-1">Tuổi {c.ten} hợp tuổi nào?</h1>
        <p className="max-w-[600px] mx-auto note">Theo Can Chi: {c.ten} (con {c.con}, hành {c.hanh}). Bảng dưới xếp 12 con giáp theo quan hệ Tam hợp – Lục hợp – Lục xung — <b>dữ kiện</b> truyền thống để tham khảo.</p>
      </section>
      <section className="wrap pb-3"><div className="panel p-[26px] max-w-[680px] mx-auto flex flex-col gap-3">
        {GROUPS.map(grp => g[grp.key] && g[grp.key].length > 0 && (
          <div key={grp.key}>
            <div className={'text-[.95rem] font-semibold ' + grp.cls}>{grp.label} <span className="note font-normal">· {grp.note}</span></div>
            <div className="flex flex-wrap gap-2 mt-1">
              {g[grp.key].map(o => <Link key={o.ten} to={'/hop-tuoi/' + o.slug} className="badge">{EMOJI[o.ten]} {o.ten}</Link>)}
            </div>
          </div>
        ))}
        <p className="note m-0 mt-1 text-[.78rem]">Hợp – khắc tuổi là quan niệm dân gian để chiêm nghiệm. Một mối quan hệ tốt phụ thuộc vào thấu hiểu và vun đắp, <b>không</b> bị quyết định bởi tuổi. Muốn xét theo cả năm sinh (Thiên can + ngũ hành nạp âm), dùng công cụ <Link to="/tu-vi" className="text-gold">Xem hợp tuổi theo 2 năm sinh →</Link></p>
      </div></section>
      <RelatedLinks items={[
        { sys: 'Con giáp', to: '/con-giap/' + c.slug, title: 'Tử vi tuổi ' + c.ten, note: 'Tính cách & tử vi hôm nay của tuổi ' + c.ten },
        { sys: 'Tử vi', to: '/tu-vi', title: 'Xem hợp tuổi theo năm sinh', note: 'Thiên can + ngũ hành nạp âm' },
        { sys: 'Tương hợp', to: '/tuong-hop', title: 'Ghép đôi đa hệ', note: 'Thần số + cung + Can Chi' }
      ]} />
      <section className="wrap pb-9">
        <p className="text-center text-gold text-[.72rem] uppercase tracking-[.2em] mb-3">Xem tuổi khác</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-[760px] mx-auto">
          {CONGIAP.map(o => <Link key={o.ten} to={'/hop-tuoi/' + o.slug} className={'badge ' + (o.ten === c.ten ? 'badge-gold' : '')}>{EMOJI[o.ten]} {o.ten}</Link>)}
        </div>
      </section>
    </>
  )
}

export default function HopTuoi() {
  const { slug } = useParams()
  if (slug) {
    const c = conGiapBySlug(slug)
    return c ? <HopTuoiDetail c={c} /> : <NotFound title="Không tìm thấy tuổi này" msg="Có 12 con giáp: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi." />
  }
  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <SeoTag title='Hợp tuổi 12 con giáp — tuổi nào hợp tuổi nào? | Tam Sở' description='Tra hợp – khắc tuổi 12 con giáp theo Tam hợp, Lục hợp, Lục xung (Can Chi). Chọn tuổi để xem hợp với tuổi nào; hoặc xem theo 2 năm sinh. Quan niệm dân gian, mang tính tham khảo.' path='/hop-tuoi' breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: 'Hợp tuổi' }]} />
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Can Chi · hợp – khắc tuổi</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Hợp tuổi 12 con giáp</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">Chọn một tuổi để xem hợp với tuổi nào, cần dung hòa với tuổi nào — theo Tam hợp, Lục hợp, Lục xung.</p>
        <p className="note mt-2">Muốn xét cả năm sinh? <Link to="/tu-vi" className="text-gold">Xem hợp tuổi theo 2 năm sinh →</Link></p>
      </section>
      <section className="wrap pb-10">
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))' }}>
          {CONGIAP.map(c => (
            <Link key={c.ten} to={'/hop-tuoi/' + c.slug} className="panel p-4 no-underline block text-center transition hover:-translate-y-1 hover:border-gold/40">
              <div className="text-[2rem]">{EMOJI[c.ten]}</div>
              <div className="font-serif text-[1.1rem] text-cream">Tuổi {c.ten}</div>
              <div className="note">con {c.con}</div>
              <div className="text-gold font-semibold text-[.82rem] mt-1">hợp tuổi nào? →</div>
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap pb-10">
        <div className="disclaimer max-w-[900px] mx-auto"><b>Lưu ý.</b> Hợp – khắc tuổi là <b>quan niệm dân gian – văn hóa</b>, không phải khoa học. Đây là dữ kiện Can Chi để chiêm nghiệm; một mối quan hệ bền dựa trên thấu hiểu và vun đắp, <span className="note">không bị tuổi quyết định</span>.</div>
      </section>
    </>
  )
}
