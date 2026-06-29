import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom'
import { USE_PATH, BASENAME } from './data/site.js'
import './index.css'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

// Code-split: trang phu tai theo nhu cau (giam JS tai ban dau, tot cho mobile).
// Layout + Home eager de trang chu hien tuc thi, khong nhap nhay.
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Tarot = lazy(() => import('./pages/Tarot.jsx'))
const Numerology = lazy(() => import('./pages/Numerology.jsx'))
const TuVi = lazy(() => import('./pages/TuVi.jsx'))
const LaSoTuVi = lazy(() => import('./pages/LaSoTuVi.jsx'))
const SoLaSo = lazy(() => import('./pages/SoLaSo.jsx'))
const Zodiac = lazy(() => import('./pages/Zodiac.jsx'))
const IChing = lazy(() => import('./pages/IChing.jsx'))
const TuongHop = lazy(() => import('./pages/TuongHop.jsx'))
const Sources = lazy(() => import('./pages/Sources.jsx'))
const DiChua = lazy(() => import('./pages/DiChua.jsx'))
const Collection = lazy(() => import('./pages/Collection.jsx'))
const ConGiap = lazy(() => import('./pages/ConGiap.jsx'))
const HopTuoi = lazy(() => import('./pages/HopTuoi.jsx'))
const SinhNam = lazy(() => import('./pages/SinhNam.jsx'))
const NotFound = lazy(() => import('./components/NotFound.jsx'))

const Router = USE_PATH ? BrowserRouter : HashRouter
const routerProps = USE_PATH ? { basename: BASENAME } : {}

// Fallback toan trang (chi dung cho /di-chua o ngoai Layout); trong Layout
// co Suspense rieng bao quanh <Outlet/> de giu lai nav/footer.
function FullPageFallback() {
  return (
    <div className="page-fallback page-fallback--full" role="status" aria-live="polite" aria-label="Dang tai">
      <span className="page-fallback-spinner" aria-hidden="true" />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router {...routerProps}>
      <Routes>
        <Route path="/di-chua" element={<Suspense fallback={<FullPageFallback />}><DiChua /></Suspense>} />
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
