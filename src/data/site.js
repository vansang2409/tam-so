// Cấu hình điều hướng & helper tạo URL chia sẻ.
// ENABLE_PATH_ROUTING=true: bản web (http) dùng URL thường (vd /tam-so/tarot) để Google index tốt hơn;
// file:// (mở double-click) luôn dùng HashRouter để vẫn chạy được.
// MUỐN REVERT: đặt ENABLE_PATH_ROUTING = false → cả router lẫn link chia sẻ quay về dạng #/...
export const ENABLE_PATH_ROUTING = true

function basename() {
  // Pages phục vụ ở /tam-so/ → basename '/tam-so'; localhost dev ở '/' → '' (để dev không bị trắng trang)
  if (typeof window === 'undefined' || !window.location) return ''
  return window.location.pathname.startsWith('/tam-so') ? '/tam-so' : ''
}
function pathMode() {
  return ENABLE_PATH_ROUTING && typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:'
}
export const BASENAME = basename()
export const USE_PATH = pathMode()

// routePath dạng '/tarot'; query là phần sau '?' (không gồm '?'), vd 'd=1&m=2'
export function shareUrl(routePath, query) {
  const q = query ? '?' + query : ''
  if (typeof window === 'undefined' || !window.location) return `#${routePath}${q}`
  const { origin, pathname } = window.location
  if (pathMode()) return `${origin}${basename()}${routePath}${q}`
  return `${origin}${pathname}#${routePath}${q}`
}
