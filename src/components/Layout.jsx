import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/tarot', label: 'Tarot' },
  { to: '/than-so-hoc', label: 'Thần số học' },
  { to: '/tu-vi', label: 'Tử vi' },
  { to: '/cung-hoang-dao', label: 'Cung hoàng đạo' },
  { to: '/kinh-dich', label: 'Kinh Dịch' },
  { to: '/nguon', label: 'Nguồn' }
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false) }, [loc])
  const base = 'px-3 py-2 rounded-full text-[.9rem] font-medium transition'
  const cls = ({ isActive }) => isActive
    ? `${base} text-[#1a1430] bg-gradient-to-br from-gold to-gold-soft font-semibold`
    : `${base} text-muted hover:text-cream hover:bg-white/5`
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0c0a1c]/70 border-b border-gold/20">
      <nav className="flex items-center justify-between gap-4 px-[22px] py-3.5 max-w-content mx-auto">
        <Link to="/" className="flex items-center gap-2.5 font-serif text-[1.3rem] font-bold text-cream whitespace-nowrap no-underline hover:no-underline">
          ✦ Tam Sở<span className="text-gold">.</span>
        </Link>
        <button onClick={() => setOpen(o => !o)} aria-label="Menu"
          className="md:hidden bg-transparent border border-gold/25 text-cream rounded-[10px] px-3 py-2 text-[1.1rem] cursor-pointer">☰</button>
        <div className={`${open ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-1.5 absolute md:static top-[62px] right-3.5 left-3.5 md:inset-auto bg-ink2 md:bg-transparent border md:border-0 border-gold/20 rounded-2xl md:rounded-none p-2.5 md:p-0 shadow-soft md:shadow-none z-50`}>
          {links.map(l => (<NavLink key={l.to} to={l.to} end={l.end} className={cls}>{l.label}</NavLink>))}
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
        <Link to="/nguon" className="text-muted hover:text-gold">Nguồn &amp; Lưu ý</Link>
      </div>
    </footer>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function Layout() {
  return (<><ScrollToTop /><Navbar /><main><Outlet /></main><Footer /></>)
}
