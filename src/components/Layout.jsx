import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary.jsx'
import { countCollection } from '../data/collection.js'

const links = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/ho-so', label: 'Hồ sơ' },
  { to: '/tarot', label: 'Tarot' },
  { to: '/than-so-hoc', label: 'Thần số học' },
  { to: '/tu-vi', label: 'Tử vi' },
  { to: '/la-so-tu-vi', label: 'Lá số Tử Vi' },
  { to: '/so-la-so', label: 'So đôi lá số' },
  { to: '/cung-hoang-dao', label: 'Cung hoàng đạo' },
  { to: '/tuong-hop', label: 'Tương hợp' },
  { to: '/kinh-dich', label: 'Kinh Dịch' },
  { to: '/nguon', label: 'Nguồn' }
]

function CollBtn() {
  const [n, setN] = useState(0)
  const loc = useLocation()
  useEffect(() => {
    const upd = () => setN(countCollection())
    upd()
    window.addEventListener('tamso:collection', upd)
    window.addEventListener('storage', upd)
    return () => { window.removeEventListener('tamso:collection', upd); window.removeEventListener('storage', upd) }
  }, [])
  useEffect(() => { setN(countCollection()) }, [loc])
  const base = 'relative px-3 py-2 rounded-full text-[1.1rem] leading-none transition shrink-0'
  return (
    <NavLink to="/bo-suu-tap" aria-label={'Bộ sưu tập đã lưu' + (n ? ', ' + n + ' mục' : '')} title="Bộ sưu tập đã lưu"
      className={({ isActive }) => isActive
        ? base + ' text-[#211606] bg-gradient-to-br from-[#d3a24e] to-[#a9772f]'
        : base + ' text-muted hover:text-cream hover:bg-black/5'}>
      <span aria-hidden="true">🔖</span>
      {n > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white text-[.62rem] font-bold flex items-center justify-center">{n}</span>}
    </NavLink>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false) }, [loc])
  const base = 'px-3 py-2 rounded-full text-[.9rem] font-medium transition'
  const cls = ({ isActive }) => isActive
    ? `${base} text-[#211606] bg-gradient-to-br from-[#d3a24e] to-[#a9772f] font-semibold`
    : `${base} text-muted hover:text-cream hover:bg-black/5`
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#f3e8cf]/88 border-b border-gold/20">
      <nav className="flex items-center justify-between gap-3 px-[22px] py-3.5 max-w-content mx-auto">
        <Link to="/" className="flex items-center gap-2.5 font-serif text-[1.3rem] font-bold text-cream whitespace-nowrap no-underline hover:no-underline">
          ✦ Tam Sở<span className="text-gold">.</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <div id="navmenu" className={`${open ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:flex-wrap md:justify-end gap-1.5 absolute md:static top-[62px] right-3.5 left-3.5 md:inset-auto bg-ink2 md:bg-transparent border md:border-0 border-gold/20 rounded-2xl md:rounded-none p-2.5 md:p-0 shadow-soft md:shadow-none z-50`}>
            {links.map(l => (<NavLink key={l.to} to={l.to} end={l.end} className={cls}>{l.label}</NavLink>))}
          </div>
          <CollBtn />
          <button onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open} aria-controls="navmenu"
            className="md:hidden bg-transparent border border-gold/25 text-cream rounded-[10px] px-3 py-2 text-[1.1rem] cursor-pointer shrink-0">☰</button>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gold/20 mt-10 py-[30px] text-muted text-[.9rem]">
      <div className="wrap flex justify-between gap-4 flex-wrap items-center">
        <span>✦ Tam Sở — © {new Date().getFullYear()} · Tarot · Thần số học · Tử vi · Chiêm tinh · Kinh Dịch</span>
        <span className="flex gap-4 flex-wrap">
          <Link to="/bo-suu-tap" className="text-muted hover:text-gold">🔖 Bộ sưu tập</Link>
          <Link to="/nguon" className="text-muted hover:text-gold">Nguồn &amp; Lưu ý</Link>
        </span>
      </div>
    </footer>
  )
}

const TITLES = { '/': 'Tam Sở — Trang chủ', '/ho-so': 'Hồ sơ tổng hợp — Tam Sở', '/tarot': 'Tarot — Tam Sở', '/than-so-hoc': 'Thần số học — Tam Sở', '/tu-vi': 'Tử vi · Can Chi — Tam Sở', '/la-so-tu-vi': 'Lá số Tử Vi — Tam Sở', '/so-la-so': 'So đôi lá số Tử Vi — Tam Sở', '/cung-hoang-dao': 'Cung hoàng đạo — Tam Sở', '/kinh-dich': 'Kinh Dịch — Tam Sở', '/tuong-hop': 'Tương hợp — Tam Sở', '/bo-suu-tap': 'Bộ sưu tập đã lưu — Tam Sở', '/nguon': 'Nguồn & Lưu ý — Tam Sở' }
const DESCS = {
  '/': 'Tam Sở gom Tarot, Thần số học, Tử vi/Can Chi, Cung hoàng đạo và Kinh Dịch về một nơi — xem lá bài, quẻ và Can Chi của hôm nay.',
  '/ho-so': 'Lập hồ sơ huyền học tổng hợp: Số Chủ Đạo, Can Chi, cung hoàng đạo, cung phi, lá Tarot chủ đạo, tuổi hợp/khắc và báo cáo theo chủ đề.',
  '/tarot': 'Rút Tarot 78 lá Rider–Waite–Smith: lá hôm nay, nhiều kiểu trải bài, bài ngược, ý nghĩa xuôi/ngược và lời khuyên — chép & chia sẻ.',
  '/than-so-hoc': 'Tính Số Chủ Đạo và bộ số Pythagorean: Vận Mệnh, Linh Hồn, Lo Shu, Năm cá nhân, Đỉnh cao & Thử thách và bảng hợp Số Chủ Đạo.',
  '/tu-vi': 'Tra Can Chi năm/ngày/giờ, nạp âm, hợp tuổi, giờ hoàng đạo, Tam Tai, cung phi Bát Trạch, Sao hạn và bảng hợp tuổi 12 con giáp.',
  '/la-so-tu-vi': 'Lập lá số Tử Vi Đẩu Số: an Mệnh/Thân, định Cục, an 14 chính tinh, Tứ Hóa, lục cát – lục sát và đại hạn vào 12 cung — kèm luận giải tham khảo.',
  '/so-la-so': 'Đối chiếu hai lá số Tử Vi: Mệnh, cung Phu Thê và quan hệ địa chi năm sinh — dữ kiện tham khảo, không phải kết luận hợp/không hợp.',
  '/cung-hoang-dao': '12 cung hoàng đạo phương Tây: tính cung theo ngày sinh, decan, màu/đá/số may mắn và bảng tương hợp nhanh 12×12.',
  '/tuong-hop': 'Xem tương hợp hai người qua Số Chủ Đạo, Can Chi và cung hoàng đạo — chia sẻ kết quả cho người ấy và bạn bè.',
  '/kinh-dich': 'Gieo quẻ Kinh Dịch bằng 3 đồng xu hoặc Mai Hoa Dịch Số, luận hào động và tra cứu đủ 64 quẻ kèm nguyên văn thoán/hào từ.',
  '/bo-suu-tap': 'Bộ sưu tập cá nhân: lưu lại trải bài Tarot và quẻ Kinh Dịch yêu thích ngay trong trình duyệt máy bạn để ngẫm lại sau, có thể chép hoặc tải về .txt.',
  '/nguon': 'Nguồn tham khảo và lưu ý của Tam Sở: phân biệt rõ dữ kiện kiểm chứng được và phần luận giải truyền thống; kèm FAQ minh bạch.'
}
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Lên đầu trang" title="Lên đầu trang" className="fixed bottom-5 right-5 z-50 btn btn-ghost rounded-full no-print" style={{ width: 46, height: 46, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>↑</button>
}
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = TITLES[pathname] || 'Tam Sở — Tarot · Thần số học · Tử vi · Chiêm tinh · Kinh Dịch'
    const md = document.querySelector('meta[name="description"]')
    if (md && DESCS[pathname]) md.setAttribute('content', DESCS[pathname])
  }, [pathname])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  return (<><ScrollToTop /><Navbar /><main><ErrorBoundary key={pathname}><Outlet /></ErrorBoundary></main><Footer /><BackToTop /></>)
}
