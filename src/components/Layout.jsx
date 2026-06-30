import { useState, useEffect, useRef, Suspense } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary.jsx'
import { motion } from 'framer-motion'
const _reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const pageInit = _reduce ? false : { opacity: 0, y: 12 }
const pageAnim = { opacity: 1, y: 0 }
const pageTr = { duration: 0.34, ease: [0.22, 0.7, 0.3, 1] }
import Logo from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useAuth } from './AuthProvider.jsx'
import { countCollection } from '../data/collection.js'
import { prefetchRouteChunk } from '../routeLoaders.js'

const links = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/ho-so', label: 'Hồ sơ' },
  { to: '/dang-nhap', label: 'Đăng nhập' },
  { to: '/tarot', label: 'Tarot' },
  { to: '/than-so-hoc', label: 'Thần số học' },
  { to: '/tu-vi', label: 'Tử vi' },
  { to: '/la-so-tu-vi', label: 'Lá số Tử Vi' },
  { to: '/so-la-so', label: 'So đôi lá số' },
  { to: '/cung-hoang-dao', label: 'Cung hoàng đạo' },
  { to: '/tuong-hop', label: 'Tương hợp' },
  { to: '/kinh-dich', label: 'Kinh Dịch' },
  { to: '/di-chua', label: 'Đi chùa' },
  { to: '/di-nha-tho', label: 'Đi nhà thờ' },
  { to: '/nguon', label: 'Nguồn' }
]
const PRIMARY = ['/', '/tarot', '/than-so-hoc', '/tu-vi', '/kinh-dich'].map(to => links.find(l => l.to === to))
const MORE = ['/ho-so', '/dang-nhap', '/la-so-tu-vi', '/so-la-so', '/cung-hoang-dao', '/di-chua', '/di-nha-tho', '/tuong-hop', '/nguon'].map(to => links.find(l => l.to === to))

function prefetchProps(to) {
  return {
    onMouseEnter: () => prefetchRouteChunk(to),
    onFocus: () => prefetchRouteChunk(to)
  }
}

function AuthBtn() {
  const { user, loading } = useAuth()
  const label = loading ? '...' : (user?.user_metadata?.full_name || user?.email || '\u0110\u0103ng nh\u1eadp')
  const title = user ? 'T\u00e0i kho\u1ea3n Tam S\u1edf' : '\u0110\u0103ng nh\u1eadp / \u0110\u0103ng k\u00fd'
  const shown = user ? label.split('@')[0].slice(0, 16) : label
  const compact = user ? shown.slice(0, 1).toUpperCase() : '\u0110N'
  return (
    <NavLink to="/dang-nhap" {...prefetchProps('/dang-nhap')} aria-label={title} title={title}
      className={({ isActive }) => 'min-w-[40px] text-center px-2.5 sm:px-3 py-2 rounded-full text-[.86rem] font-semibold transition shrink-0 ' + (isActive ? 'text-gold bg-gold/10' : 'text-muted hover:text-cream hover:bg-black/5 dark:hover:bg-white/5')}>
      <span className="hidden sm:inline">{shown}</span><span className="sm:hidden" aria-hidden="true">{compact}</span>
    </NavLink>
  )
}

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
  const base = 'relative px-2.5 sm:px-3 py-2 rounded-full text-[1.1rem] leading-none transition shrink-0'
  return (
    <NavLink to="/bo-suu-tap" {...prefetchProps('/bo-suu-tap')} aria-label={'Bộ sưu tập đã lưu' + (n ? ', ' + n + ' mục' : '')} title="Bộ sưu tập đã lưu"
      className={({ isActive }) => isActive
        ? base + ' text-gold bg-gold/10'
        : base + ' text-muted hover:text-cream hover:bg-black/5 dark:hover:bg-white/5'}>
      <span aria-hidden="true">🔖</span>
      {n > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white text-[.62rem] font-bold flex items-center justify-center">{n}</span>}
    </NavLink>
  )
}

function MoreDropdown({ items }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const ref = useRef(null)
  useEffect(() => { setOpen(false) }, [loc])
  useEffect(() => {
    if (!open) return
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])
  const active = items.some(i => loc.pathname === i.to || loc.pathname.startsWith(i.to + '/'))
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="true" aria-expanded={open}
        className={'navlink' + (active ? ' is-active' : '')} style={{ background: 'transparent', border: 0, cursor: 'pointer', font: 'inherit' }}>
        Thêm <span aria-hidden="true" className={'inline-block text-[.7em] transition-transform duration-200 ' + (open ? 'rotate-180' : '')}>▾</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+12px)] min-w-[196px] flex flex-col gap-0.5 bg-white dark:bg-ink border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-lift z-50 animate-fade">
          {items.map(i => (<NavLink key={i.to} to={i.to} {...prefetchProps(i.to)} role="menuitem" className={({ isActive }) => 'navlink' + (isActive ? ' is-active' : '')}>{i.label}</NavLink>))}
        </div>
      )}
    </div>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false) }, [loc])
  const cls = ({ isActive }) => 'navlink' + (isActive ? ' is-active' : '')
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-ink/80 border-b border-slate-200/80 dark:border-slate-700/80">
      <nav className="flex items-center justify-between gap-3 px-3 sm:px-[22px] py-3.5 max-w-content mx-auto">
        <Link to="/" className="flex items-center gap-2.5 font-serif text-[1.3rem] font-bold text-cream whitespace-nowrap no-underline hover:no-underline">
          <Logo size={30} className="shrink-0" /> <span className="tamso-brand-text">Tam Sở<span className="text-gold">.</span></span>
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="hidden md:flex md:items-center md:gap-x-[18px]">
            {PRIMARY.map(l => (<NavLink key={l.to} to={l.to} {...prefetchProps(l.to)} end={l.end} className={cls}>{l.label}</NavLink>))}
            <MoreDropdown items={MORE} />
          </div>
          <div id="navmenu" className={`${open ? 'flex' : 'hidden'} md:hidden flex-col gap-0.5 absolute top-[64px] right-3.5 left-3.5 bg-white dark:bg-ink border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-lift z-50`}>
            {links.map(l => (<NavLink key={l.to} to={l.to} {...prefetchProps(l.to)} end={l.end} className={cls}>{l.label}</NavLink>))}
          </div>
          <ThemeToggle />
          <AuthBtn />
          <CollBtn />
          <button onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open} aria-controls="navmenu"
            className="md:hidden bg-transparent border border-slate-300 dark:border-slate-600 text-cream rounded-[10px] px-2.5 sm:px-3 py-2 text-[1.1rem] cursor-pointer shrink-0">☰</button>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 mt-10 py-[30px] text-muted text-[.9rem]">
      <div className="wrap flex justify-between gap-4 flex-wrap items-center">
        <span className="inline-flex items-center gap-1.5"><Logo size={18} className="shrink-0" /> Tam Sở — © {new Date().getFullYear()} · Tarot · Thần số học · Tử vi · Chiêm tinh · Kinh Dịch</span>
        <span className="flex gap-4 flex-wrap">
          <Link to="/bo-suu-tap" className="text-muted hover:text-gold">🔖 Bộ sưu tập</Link>
          <Link to="/nguon" className="text-muted hover:text-gold">Nguồn &amp; Lưu ý</Link>
        </span>
      </div>
    </footer>
  )
}

const TITLES = { '/': 'Tam Sở — Trang chủ', '/ho-so': 'Hồ sơ tổng hợp — Tam Sở', '/dang-nhap': 'Đăng nhập / Đăng ký — Tam Sở', '/tarot': 'Tarot — Tam Sở', '/than-so-hoc': 'Thần số học — Tam Sở', '/tu-vi': 'Tử vi · Can Chi — Tam Sở', '/la-so-tu-vi': 'Lá số Tử Vi — Tam Sở', '/so-la-so': 'So đôi lá số Tử Vi — Tam Sở', '/cung-hoang-dao': 'Cung hoàng đạo — Tam Sở', '/kinh-dich': 'Kinh Dịch — Tam Sở', '/di-chua': 'Đi chùa — Đại Tự Tâm Linh — Tam Sở', '/di-nha-tho': 'Đi nhà thờ — Tam Sở', '/tuong-hop': 'Tương hợp — Tam Sở', '/bo-suu-tap': 'Bộ sưu tập đã lưu — Tam Sở', '/nguon': 'Nguồn & Lưu ý — Tam Sở' }
const DESCS = {
  '/': 'Tam Sở gom Tarot, Thần số học, Tử vi/Can Chi, Cung hoàng đạo và Kinh Dịch về một nơi — xem lá bài, quẻ và Can Chi của hôm nay.',
  '/ho-so': 'Lập hồ sơ huyền học tổng hợp: Số Chủ Đạo, Can Chi, cung hoàng đạo, cung phi, lá Tarot chủ đạo, tuổi hợp/khắc và báo cáo theo chủ đề.',
  '/dang-nhap': 'Đăng nhập hoặc đăng ký tài khoản Tam Sở qua Supabase Auth; tài khoản là tuỳ chọn, các công cụ chính vẫn dùng được khi chưa đăng nhập.',
  '/tarot': 'Rút Tarot 78 lá Rider–Waite–Smith: lá hôm nay, nhiều kiểu trải bài, bài ngược, ý nghĩa xuôi/ngược và lời khuyên — chép & chia sẻ.',
  '/than-so-hoc': 'Tính Số Chủ Đạo và bộ số Pythagorean: Vận Mệnh, Linh Hồn, Lo Shu, Năm cá nhân, Đỉnh cao & Thử thách và bảng hợp Số Chủ Đạo.',
  '/tu-vi': 'Tra Can Chi năm/ngày/giờ, nạp âm, hợp tuổi, giờ hoàng đạo, Tam Tai, cung phi Bát Trạch, Sao hạn và bảng hợp tuổi 12 con giáp.',
  '/la-so-tu-vi': 'Lập lá số Tử Vi Đẩu Số: an Mệnh/Thân, định Cục, an 14 chính tinh, Tứ Hóa, lục cát – lục sát và đại hạn vào 12 cung — kèm luận giải tham khảo.',
  '/so-la-so': 'Đối chiếu hai lá số Tử Vi: Mệnh, cung Phu Thê và quan hệ địa chi năm sinh — dữ kiện tham khảo, không phải kết luận hợp/không hợp.',
  '/cung-hoang-dao': '12 cung hoàng đạo phương Tây: tính cung theo ngày sinh, decan, màu/đá/số may mắn và bảng tương hợp nhanh 12×12.',
  '/tuong-hop': 'Xem tương hợp hai người qua Số Chủ Đạo, Can Chi và cung hoàng đạo — chia sẻ kết quả cho người ấy và bạn bè.',
  '/kinh-dich': 'Gieo quẻ Kinh Dịch bằng 3 đồng xu hoặc Mai Hoa Dịch Số, luận hào động và tra cứu đủ 64 quẻ kèm nguyên văn thoán/hào từ.',
  '/di-chua': 'Đi chùa Đại Tự Tâm Linh (hư cấu): bước qua cổng, dạo sân, vào chính điện, thắp hương, khấn nguyện và xin thẻ xăm — trải nghiệm tham khảo, không thay việc hành lễ thật.',
  '/di-nha-tho': 'Đi nhà thờ Tam Sở (hư cấu): không gian chiêm niệm online với nến cầu nguyện, kính màu, thánh ca tĩnh lặng và ghi chú riêng tư — không thay Thánh lễ hay tư vấn mục vụ thật.',
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

function PageFallback() {
  return (<div className="page-fallback" role="status" aria-live="polite" aria-label="Dang tai"><span className="page-fallback-spinner" aria-hidden="true" /></div>)
}

export default function Layout() {
  const { pathname } = useLocation()
  return (<><ScrollToTop /><Navbar /><main><motion.div key={pathname} initial={pageInit} animate={pageAnim} transition={pageTr}><ErrorBoundary><Suspense fallback={<PageFallback />}><Outlet /></Suspense></ErrorBoundary></motion.div></main><Footer /><BackToTop /></>)
}
