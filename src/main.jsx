import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Tarot from './pages/Tarot.jsx'
import Numerology from './pages/Numerology.jsx'
import TuVi from './pages/TuVi.jsx'
import Zodiac from './pages/Zodiac.jsx'
import IChing from './pages/IChing.jsx'
import Sources from './pages/Sources.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ho-so" element={<Profile />} />
          <Route path="tarot" element={<Tarot />} />
          <Route path="than-so-hoc" element={<Numerology />} />
          <Route path="tu-vi" element={<TuVi />} />
          <Route path="cung-hoang-dao" element={<Zodiac />} />
          <Route path="kinh-dich" element={<IChing />} />
          <Route path="nguon" element={<Sources />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)

if (import.meta.env.PROD && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {})
  })
}
