import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePageSeo } from '../components/useSeo.js'
import SeoTag from '../components/SeoTag.jsx'
import NotFound from '../components/NotFound.jsx'
import RelatedLinks from '../components/RelatedLinks.jsx'
import { tinhCanChi, NAP_AM_NGHIA, CONGIAP_LUAN } from '../data/tuvi.js'
import { CONGIAP_SLUG, hopKhacChi } from '../data/congiap.js'

const EMOJI = { 'Tý': '🐭', 'Sửu': '🐂', 'Dần': '🐯', 'Mão': '🐱', 'Thìn': '🐲', 'Tỵ': '🐍', 'Ngọ': '🐴', 'Mùi': '🐐', 'Thân': '🐵', 'Dậu': '🐓', 'Tuất': '🐶', 'Hợi': '🐷' }
const NOW = 2026
const POPULAR = [1975, 1980, 1985, 1988, 1990, 1992, 1995, 1998, 2000, 2002, 2005, 2008, 2010, 2012, 2015, 2018, 2020]

function SinhNamDetail({ y }) {
  const cc = tinhCanChi(y)
  const hk = hopKhacChi(cc.chi)
  const nghia = NAP_AM_NGHIA[cc.napAm]
  const luan = CONGIAP_LUAN[cc.chi]
  const slug = CONGIAP_SLUG[cc.chi]
  usePageSeo({
    title: 'Sinh năm ' + y + ' (' + cc.tenCanChi + ') mệnh gì? Hợp tuổi nào, tính cách | Tam Sở',
    description: 'Người sinh năm ' + y + ' cầm tinh con ' + cc.conGiap + ' (' + cc.chi + '), Can Chi ' + cc.tenCanChi + ', ngũ hành nạp âm ' + cc.napAm + ' (mệnh ' + cc.menhHanh + '). Xem tính cách, hợp – khắc tuổi. Dữ kiện Can Chi, mang tính tham khảo.',
    path: '/sinh-nam/' + y,
    breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Sinh năm', path: '/sinh-nam' }, { name: 'Năm ' + y }]
  })
  return (
    <>
      <section className="wrap pt-[60px] pb-1 text-center">
        <p className="note mb-1"><Link to="/sinh-nam" className="text-gold">Sinh năm</Link> / {y}</p>
        <div className="text-[3.4rem] leading-none">{EMOJI[cc.chi]}</div>
        <h1 className="text-[clamp(1.7rem,4.2vw,2.5rem)] my-1">Sinh năm {y} — {cc.tenCanChi}</h1>
        <div className="flex gap-2 flex-wrap justify-center my-2">
          <span className="pill">Cầm tinh con {cc.conGiap}</span><span className="badge">Mệnh {cc.menhHanh}</span><span className="badge">{cc.canAmDuong}</span>
        </div>
        <p className="note m-0">Năm {NOW} khoảng {NOW - y} tuổi (dương). Can Chi là <b>dữ kiện</b> lịch pháp; phần luận là quan niệm dân gian để tham khảo.</p>
      </section>
      <section className="wrap pb-3"><div className="panel p-[26px] max-w-[680px] mx-auto leading-relaxed flex flex-col gap-1.5">
        <p className="m-0"><b className="text-cream">Ngũ hành nạp âm:</b> {cc.napAm} → mệnh {cc.menhHanh}.{nghia ? ' ' + nghia : ''}</p>
        <p className="m-0"><b className="text-cream">Thiên can:</b> {cc.can} (hành {cc.canHanh}, {cc.canAmDuong}) · <b className="text-cream">Địa chi:</b> {cc.chi} (con {cc.conGiap}).</p>
        {luan && <p className="m-0"><b className="text-cream">Tính cách (theo con giáp):</b> {luan}</p>}
        <div className="mt-2">
          <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1">Hợp · khắc tuổi (Can Chi — tham khảo)</div>
          <p className="m-0"><b className="text-cream">Tam hợp:</b> {hk.tamHop.join(' · ') || '—'} · <b className="text-cream">Lục hợp:</b> {hk.lucHop || '—'}</p>
          <p className="m-0"><b className="text-cream">Lục xung:</b> {hk.lucXung || '—'} · <b className="text-cream">Tứ hành xung:</b> {hk.tuHanhXung.join(' · ') || '—'}</p>
          <p className="note m-0 mt-1"><Link to={'/hop-tuoi/' + slug} className="text-gold">Xem chi tiết tuổi {cc.chi} hợp tuổi nào →</Link></p>
        </div>
        <p className="note mt-3 mb-0 text-[.78rem]">Hợp – khắc tuổi và luận mệnh là quan niệm dân gian; chỉ để chiêm nghiệm, không định đoạt cuộc đời ai.</p>
      </div></section>
      <RelatedLinks items={[
        { sys: 'Con giáp', to: '/con-giap/' + slug, title: 'Tử vi tuổi ' + cc.chi, note: 'Tính cách & tử vi hôm nay' },
        { sys: 'Hợp tuổi', to: '/hop-tuoi/' + slug, title: 'Tuổi ' + cc.chi + ' hợp tuổi nào', note: 'Tam hợp – lục hợp – lục xung' },
        { sys: 'Lá số', to: '/la-so-tu-vi', title: 'Lập lá số Tử Vi', note: 'Từ giờ – ngày – tháng – năm sinh' }
      ]} />
      <section className="wrap pb-9 text-center">
        <p className="text-gold text-kicker uppercase mb-3">Năm sinh lân cận</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-[640px] mx-auto">
          {[y - 2, y - 1, y + 1, y + 2].map(o => <Link key={o} to={'/sinh-nam/' + o} className="badge">{o} · {tinhCanChi(o).tenCanChi}</Link>)}
        </div>
      </section>
    </>
  )
}

export default function SinhNam() {
  const { year } = useParams()
  const nav = useNavigate()
  const [y, setY] = useState('')
  if (year) {
    const n = parseInt(year, 10)
    if (!/^\d{4}$/.test(year) || n < 1900 || n > 2100) return <NotFound title="Năm không hợp lệ" msg="Mời nhập năm sinh dương lịch trong khoảng 1900–2100." />
    return <SinhNamDetail y={n} />
  }
  const go = () => { const n = parseInt(y, 10); if (/^\d{4}$/.test(y) && n >= 1900 && n <= 2100) nav('/sinh-nam/' + n) }
  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <SeoTag title='Sinh năm bao nhiêu mệnh gì? Tra Can Chi – nạp âm – hợp tuổi theo năm | Tam Sở' description='Nhập năm sinh để biết cầm tinh con gì, Can Chi, ngũ hành nạp âm (mệnh), tính cách và hợp – khắc tuổi. Dữ kiện lịch pháp Can Chi, phần luận mang tính tham khảo.' path='/sinh-nam' breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: 'Sinh năm' }]} />
        <div className="text-gold text-kicker uppercase">Can Chi · nạp âm theo năm</div>
        <h1 className="text-display my-3">Sinh năm bao nhiêu, mệnh gì?</h1>
        <p className="text-muted text-lead max-w-[680px] mx-auto">Nhập năm sinh (dương lịch) để xem con giáp, Can Chi, ngũ hành nạp âm và hợp – khắc tuổi.</p>
        <div className="flex gap-2 justify-center items-center mt-4 flex-wrap">
          <input type="number" value={y} onChange={e => setY(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} placeholder="1990" className="field-input w-[140px]" />
          <button className="btn btn-primary" onClick={go}>Xem</button>
        </div>
      </section>
      <section className="wrap pb-10">
        <p className="text-center text-gold text-kicker uppercase mb-3">Năm hay tra</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-[820px] mx-auto">
          {POPULAR.map(o => <Link key={o} to={'/sinh-nam/' + o} className="badge">{o} · {tinhCanChi(o).tenCanChi}</Link>)}
        </div>
      </section>
      <section className="wrap pb-10">
        <div className="disclaimer max-w-[900px] mx-auto"><b>Lưu ý.</b> Can Chi và ngũ hành nạp âm tính từ năm sinh là <b>dữ kiện</b> lịch pháp (kiểm chứng được). Phần luận mệnh, tính cách và hợp – khắc tuổi là <b>quan niệm dân gian</b> để chiêm nghiệm, <span className="note">không phải khoa học</span> và không định đoạt cuộc đời.</div>
      </section>
    </>
  )
}
