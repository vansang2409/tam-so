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
import LaSoTuVi from './pages/LaSoTuVi.jsx'
import SoLaSo from './pages/SoLaSo.jsx'
import Zodiac from './pages/Zodiac.jsx'
import IChing from './pages/IChing.jsx'
import TuongHop from './pages/TuongHop.jsx'
import Sources from './pages/Sources.jsx'
import Collection from './pages/Collection.jsx'
import ConGiap from './pages/ConGiap.jsx'
import HopTuoi from './pages/HopTuoi.jsx'
import SinhNam from './pages/SinhNam.jsx'
import NotFound from './components/NotFound.jsx'

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
          <Route path="tarot/:slug" element={<Tarot />} />
          <Route path="than-so-hoc" element={<Numerology />} />
          <Route path="than-so-hoc/so/:n" element={<Numerology />} />
          <Route path="tu-vi" element={<TuVi />} />
          <Route path="la-so-tu-vi" element={<LaSoTuVi />} />
          <Route path="so-la-so" element={<SoLaSo />} />
          <Route path="cung-hoang-dao" element={<Zodiac />} />
          <Route path="cung-hoang-dao/:slug" element={<Zodiac />} />
          <Route path="con-giap" element={<ConGiap />} />
          <Route path="con-giap/:slug" element={<ConGiap />} />
          <Route path="hop-tuoi" element={<HopTuoi />} />
          <Route path="hop-tuoi/:slug" element={<HopTuoi />} />
          <Route path="sinh-nam" element={<SinhNam />} />
          <Route path="sinh-nam/:year" element={<SinhNam />} />
          <Route path="kinh-dich" element={<IChing />} />
          <Route path="tuong-hop" element={<TuongHop />} />
          <Route path="bo-suu-tap" element={<Collection />} />
          <Route path="nguon" element={<Sources />} />
          <Route path="*" element={<NotFound />} />
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
