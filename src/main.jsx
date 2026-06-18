import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom'
import { USE_PATH, BASENAME } from './data/site.js'
import './index.css'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Tarot from './pages/Tarot.jsx'
import Numerology from './pages/Numerology.jsx'
import TuVi from './pages/TuVi.jsx'
import Zodiac from './pages/Zodiac.jsx'
import IChing from './pages/IChing.jsx'
import TuongHop from './pages/TuongHop.jsx'
import Sources from './pages/Sources.jsx'

const Router = USE_PATH ? BrowserRouter : HashRouter
const routerProps = USE_PATH ? { basename: BASENAME } : {}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router {...routerProps}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ho-so" element={<Profile />} />
          <Route path="tarot" element={<Tarot />} />
          <Route path="than-so-hoc" element={<Numerology />} />
          <Route path="tu-vi" element={<TuVi />} />
          <Route path="cung-hoang-dao" element={<Zodiac />} />
          <Route path="kinh-dich" element={<IChing />} />
          <Route path="tuong-hop" element={<TuongHop />} />
          <Route path="nguon" element={<Sources />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
)

if (import.meta.env.PROD && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register((USE_PATH ? BASENAME + '/' : import.meta.env.BASE_URL) + 'sw.js').catch(() => {})
  })
}
