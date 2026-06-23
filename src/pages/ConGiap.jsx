import { useParams, Link } from 'react-router-dom'
import { usePageSeo } from '../components/useSeo.js'
import { CONGIAP, CONGIAP_SLUG, conGiapBySlug, dailyConGiap, hopKhacChi, relatedForConGiap, recentYears } from '../data/congiap.js'
import NotFound from '../components/NotFound.jsx'
import SeoTag from '../components/SeoTag.jsx'
import RelatedLinks from '../components/RelatedLinks.jsx'
import Reveal from '../components/Reveal.jsx'

const EMOJI = { 'Tý': '🐭', 'Sửu': '🐂', 'Dần': '🐯', 'Mão': '🐱', 'Thìn': '🐲', 'Tỵ': '🐍', 'Ngọ': '🐴', 'Mùi': '🐐', 'Thân': '🐵', 'Dậu': '🐓', 'Tuất': '🐶', 'Hợi': '🐷' }
const hClass = { 'Kim': 'h-Kim', 'Mộc': 'h-Mộc', 'Thủy': 'h-Thủy', 'Hỏa': 'h-Hỏa', 'Thổ': 'h-Thổ' }

function Fact({ k, v }) { return <p className="note m-0"><b className="text-cream">{k}:</b> {v}</p> }

function ConGiapReading({ c }) {
  const today = new Date().toISOString().slice(0, 10)
  const dc = dailyConGiap(c.ten, today)
  const hk = hopKhacChi(c.ten)
  return (
    <>
      <div className="text-left max-w-[600px] mx-auto mt-2 flex flex-col gap-1.5 leading-relaxed">
        <div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Chân dung tuổi {c.ten} ({c.con})</div>
        <p className="m-0">{c.luan}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
          <Fact k="Con vật" v={c.con} />
          <Fact k="Ngũ hành" v={c.hanh} />
          <Fact k="Âm/Dương" v={c.amduong} />
          <Fact k="Giờ" v={c.gio + ' h'} />
          <Fact k="Hướng" v={c.huong} />
          <Fact k="Mùa" v={c.mua} />
        </div>
      </div>

      <div className="text-left max-w-[600px] mx-auto mt-4 panel p-4">
        <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1">Hợp · khắc (theo Can Chi — tham khảo)</div>
        <p className="m-0"><b className="text-cream">Tam hợp:</b> {hk.tamHop.join(' · ') || '—'} <span className="note">(nâng đỡ nhau)</span></p>
        <p className="m-0"><b className="text-cream">Lục hợp:</b> {hk.lucHop || '—'} <span className="note">(hợp ý, dễ đồng hành)</span></p>
        <p className="m-0"><b className="text-cream">Lục xung:</b> {hk.lucXung || '—'} <span className="note">(dễ va chạm, cần dung hòa)</span></p>
        <p className="m-0"><b className="text-cream">Tứ hành xung:</b> {hk.tuHanhXung.join(' · ') || '—'}</p>
        <p className="note m-0 mt-1.5 text-[.7rem]">Hợp/khắc tuổi là quan niệm dân gian để chiêm nghiệm, không quyết định một mối quan hệ.</p>
      </div>

      <div className="text-left max-w-[600px] mx-auto mt-4 panel bg-gold/[.05] p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-gold text-[.72rem] uppercase tracking-[.18em]">Tử vi hôm nay · {today.split('-').reverse().join('/')}</div>
          <div className="text-amber-700 text-[.95rem]" title="Mức năng lượng hôm nay (tham khảo)">{'★'.repeat(dc.nangLuong)}<span className="text-gray-300">{'★'.repeat(5 - dc.nangLuong)}</span></div>
        </div>
        <p className="m-0 mt-1.5 leading-relaxed">{dc.tongQuan}</p>
        <p className="m-0 mt-1"><b className="text-cream">Tình cảm:</b> {dc.tinhCam}</p>
        <p className="m-0"><b className="text-cream">Công việc:</b> {dc.congViec}</p>
        <p className="m-0"><b className="text-cream">Tài chính:</b> {dc.taiChinh}</p>
        <p className="note m-0 mt-1.5">💡 {dc.loiKhuyen}</p>
        <p className="note m-0 mt-1.5 text-[.7rem]">Gợi ý để chiêm nghiệm, làm mới mỗi ngày — không phải lời tiên đoán.</p>
      </div>
    </>
  )
}

function ConGiapPage({ c }) {
  const years = recentYears(c.ten)
  usePageSeo({
    title: 'Tuổi ' + c.ten + ' (' + c.con + ') — tính cách, hợp tuổi & tử vi hôm nay | Tam Sở',
    description: 'Tuổi ' + c.ten + ' (con ' + c.con + ', hành ' + c.hanh + '): ' + c.net + '. Xem chân dung, hợp – khắc tuổi và tử vi hôm nay. Quan niệm dân gian, mang tính tham khảo.',
    path: '/con-giap/' + c.slug,
    breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: '12 con giáp', path: '/con-giap' }, { name: 'Tuổi ' + c.ten }]
  })
  return (
    <>
      <section className="wrap pt-[60px] pb-1 text-center">
        <p className="note mb-1"><Link to="/con-giap" className="text-gold">12 con giáp</Link> / Tuổi {c.ten}</p>
        <div className="text-[3.6rem] leading-none">{EMOJI[c.ten]}</div>
        <h1 className="text-[clamp(1.8rem,4.5vw,2.6rem)] my-1">Tuổi {c.ten} <span className="note text-[1.1rem]">(con {c.con})</span></h1>
        <div className="flex gap-2 flex-wrap justify-center my-2"><span className={'pill ' + (hClass[c.hanh] || '')}>Hành {c.hanh}</span><span className="badge">{c.amduong}</span><span className="badge">Giờ {c.gio}</span></div>
        <p className="max-w-[560px] mx-auto">{c.net}.</p>
        {years.length > 0 && <p className="note m-0">Một số năm sinh tuổi {c.ten}: {years.join(' · ')}… (cách nhau 12 năm)</p>}
      </section>
      <section className="wrap pb-3"><div className="panel p-[26px] max-w-[680px] mx-auto"><ConGiapReading c={c} /></div></section>
      <RelatedLinks items={relatedForConGiap(c.ten)} />
      <section className="wrap pb-9">
        <p className="text-center text-gold text-kicker uppercase mb-3">Xem con giáp khác</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-[760px] mx-auto">
          {CONGIAP.map(o => <Link key={o.ten} to={'/con-giap/' + o.slug} className={'badge ' + (o.ten === c.ten ? 'badge-gold' : '')}>{EMOJI[o.ten]} {o.ten}</Link>)}
        </div>
        <p className="text-center mt-5"><Link to="/con-giap" className="btn btn-ghost">← Về trang 12 con giáp</Link></p>
      </section>
    </>
  )
}

export default function ConGiap() {
  const { slug } = useParams()
  if (slug) {
    const c = conGiapBySlug(slug)
    return c
      ? <ConGiapPage c={c} />
      : <NotFound title="Không tìm thấy con giáp này" msg="Có 12 con giáp: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi. Mời bạn chọn lại." />
  }
  const today = new Date().toISOString().slice(0, 10)
  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <SeoTag title='Tử vi hôm nay 12 con giáp — Tý, Sửu, Dần… | Tam Sở' description='Xem tử vi hôm nay theo 12 con giáp, tính cách từng tuổi và hợp – khắc tuổi theo Can Chi. Quan niệm dân gian, mang tính tham khảo, làm mới mỗi ngày.' path='/con-giap' breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: '12 con giáp' }]} />
        <div className="text-gold text-kicker uppercase">Tử vi Á Đông · Can Chi</div>
        <h1 className="text-display my-3">Tử vi hôm nay theo 12 con giáp</h1>
        <p className="text-muted text-lead max-w-[680px] mx-auto">12 con giáp theo địa chi (Tý, Sửu, Dần…), mỗi tuổi một chân dung và một gợi ý chiêm nghiệm cho hôm nay — làm mới mỗi ngày.</p>
        <p className="note mt-2">Chưa biết mình tuổi gì? <Link to="/tu-vi" className="text-gold">Nhập năm sinh để tính Can Chi →</Link></p>
      </section>

      <section className="wrap pb-10">
        <Reveal base="stagger-parent" className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))' }}>
          {CONGIAP.map((c, i) => {
            const dc = dailyConGiap(c.ten, today)
            return (
              <Link key={c.ten} style={{ '--i': Math.min(i, 14) }} to={'/con-giap/' + c.slug} className="panel p-5 no-underline block transition hover:-translate-y-1 hover:border-gold/40">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[2rem]">{EMOJI[c.ten]}</span>
                  <div><div className="font-serif text-[1.2rem] text-cream">Tuổi {c.ten}</div><div className="note">con {c.con} · hành {c.hanh}</div></div>
                  <span className="ml-auto text-amber-700 text-[.85rem]" title="Năng lượng hôm nay">{'★'.repeat(dc.nangLuong)}</span>
                </div>
                <p className="text-[.92rem] text-muted m-0">{c.net}.</p>
                <p className="note mt-2 mb-0 line-clamp-2">Hôm nay: {dc.tongQuan}</p>
                <p className="text-gold font-semibold text-[.85rem] mt-2 mb-0">Xem tử vi hôm nay →</p>
              </Link>
            )
          })}
        </Reveal>
      </section>

      <section className="wrap pb-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Lưu ý.</b> Con giáp và luận hợp – khắc tuổi là <b>quan niệm dân gian – văn hóa</b>, không phải khoa học và không có giá trị tiên đoán đã kiểm chứng.
          Phần Can Chi (tính từ năm sinh) là <em>dữ kiện</em> kiểm chứng được; phần luận tính cách và "tử vi hôm nay" chỉ để <span className="note">chiêm nghiệm, tham khảo</span>.
        </div>
      </section>
    </>
  )
}
