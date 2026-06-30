export const routeLoaders = {
  profile: () => import('./pages/Profile.jsx'),
  auth: () => import('./pages/Auth.jsx'),
  tarot: () => import('./pages/Tarot.jsx'),
  numerology: () => import('./pages/Numerology.jsx'),
  tuVi: () => import('./pages/TuVi.jsx'),
  laSoTuVi: () => import('./pages/LaSoTuVi.jsx'),
  soLaSo: () => import('./pages/SoLaSo.jsx'),
  zodiac: () => import('./pages/Zodiac.jsx'),
  iChing: () => import('./pages/IChing.jsx'),
  tuongHop: () => import('./pages/TuongHop.jsx'),
  sources: () => import('./pages/Sources.jsx'),
  diChua: () => import('./pages/DiChua.jsx'),
  diNhaTho: () => import('./pages/DiNhaTho.jsx'),
  collection: () => import('./pages/Collection.jsx'),
  conGiap: () => import('./pages/ConGiap.jsx'),
  hopTuoi: () => import('./pages/HopTuoi.jsx'),
  sinhNam: () => import('./pages/SinhNam.jsx'),
  notFound: () => import('./components/NotFound.jsx')
}

export const routePrefetchers = {
  '/ho-so': routeLoaders.profile,
  '/dang-nhap': routeLoaders.auth,
  '/tarot': routeLoaders.tarot,
  '/than-so-hoc': routeLoaders.numerology,
  '/tu-vi': routeLoaders.tuVi,
  '/la-so-tu-vi': routeLoaders.laSoTuVi,
  '/so-la-so': routeLoaders.soLaSo,
  '/cung-hoang-dao': routeLoaders.zodiac,
  '/kinh-dich': routeLoaders.iChing,
  '/tuong-hop': routeLoaders.tuongHop,
  '/di-chua': routeLoaders.diChua,
  '/di-nha-tho': routeLoaders.diNhaTho,
  '/bo-suu-tap': routeLoaders.collection,
  '/con-giap': routeLoaders.conGiap,
  '/hop-tuoi': routeLoaders.hopTuoi,
  '/sinh-nam': routeLoaders.sinhNam,
  '/nguon': routeLoaders.sources
}

const inflight = new Map()

function shouldPrefetch() {
  if (typeof navigator === 'undefined') return false
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  return !conn?.saveData
}

function cleanRoute(to) {
  const path = String(to || '').split(/[?#]/)[0].replace(/\/$/, '')
  return path || '/'
}

export function prefetchRouteChunk(to) {
  const path = cleanRoute(to)
  const loader = routePrefetchers[path]
  if (!loader || !shouldPrefetch()) return null
  if (inflight.has(path)) return inflight.get(path)
  const request = loader().catch(err => {
    inflight.delete(path)
    throw err
  })
  inflight.set(path, request)
  return request
}
