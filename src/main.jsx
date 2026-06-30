import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom'
import { USE_PATH, BASENAME } from './data/site.js'
import './index.css'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './components/AuthProvider.jsx'
import { routeLoaders } from './routeLoaders.js'

// Code-split: trang phu tai theo nhu cau (giam JS tai ban dau, tot cho mobile).
// Layout + Home eager de trang chu hien tuc thi, khong nhap nhay.
const Profile = lazy(routeLoaders.profile)
const Admin = lazy(routeLoaders.admin)
const Blog = lazy(routeLoaders.blog)
const Auth = lazy(routeLoaders.auth)
const Tarot = lazy(routeLoaders.tarot)
const Numerology = lazy(routeLoaders.numerology)
const TuVi = lazy(routeLoaders.tuVi)
const LaSoTuVi = lazy(routeLoaders.laSoTuVi)
const SoLaSo = lazy(routeLoaders.soLaSo)
const Zodiac = lazy(routeLoaders.zodiac)
const IChing = lazy(routeLoaders.iChing)
const TuongHop = lazy(routeLoaders.tuongHop)
const Sources = lazy(routeLoaders.sources)
const DiChua = lazy(routeLoaders.diChua)
const DiNhaTho = lazy(routeLoaders.diNhaTho)
const Collection = lazy(routeLoaders.collection)
const ConGiap = lazy(routeLoaders.conGiap)
const HopTuoi = lazy(routeLoaders.hopTuoi)
const SinhNam = lazy(routeLoaders.sinhNam)
const NotFound = lazy(routeLoaders.notFound)
const Router = USE_PATH ? BrowserRouter : HashRouter
const routerProps = USE_PATH ? { basename: BASENAME } : {}

// Fallback toan trang (dung cho /di-chua va /di-nha-tho o ngoai Layout); trong Layout
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
    <AuthProvider>
      <Router {...routerProps}>
      <Routes>
        <Route path="/di-chua" element={<ErrorBoundary><Suspense fallback={<FullPageFallback />}><DiChua /></Suspense></ErrorBoundary>} />
        <Route path="/di-nha-tho" element={<ErrorBoundary><Suspense fallback={<FullPageFallback />}><DiNhaTho /></Suspense></ErrorBoundary>} />
        <Route path="/admin/*" element={<ErrorBoundary><Suspense fallback={<FullPageFallback />}><Admin /></Suspense></ErrorBoundary>} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ho-so" element={<Profile />} />
          <Route path="bai-viet" element={<Blog />} />
          <Route path="bai-viet/:slug" element={<Blog />} />
          <Route path="dang-nhap" element={<Auth />} />
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
    </AuthProvider>
  </React.StrictMode>
)
