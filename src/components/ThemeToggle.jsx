import { useEffect, useState } from 'react'

function getInitial() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(getInitial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('tamso-theme', dark ? 'dark' : 'light') } catch (e) {}
  }, [dark])

  return (
    <button type="button" onClick={() => setDark(d => !d)} className="theme-toggle"
      aria-label={dark ? 'Đổi sang giao diện sáng' : 'Đổi sang giao diện tối'}
      title={dark ? 'Giao diện sáng' : 'Giao diện tối'}>
      <span aria-hidden="true">{dark ? '☾' : '☀'}</span>
    </button>
  )
}
