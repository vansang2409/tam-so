// Helper SEO thuần (KHÔNG đụng DOM) — tạo URL tuyệt đối + JSON-LD BreadcrumbList.
// Tách riêng để test bằng node. Dùng cho các trang nội dung sâu (cung hoàng đạo, lá
// Tarot, số chủ đạo) giúp Google hiểu thứ bậc trang + có thể hiện breadcrumb rich result.

export const SITE_ORIGIN = 'https://vansang2409.github.io/tam-so'
export const OG_IMAGE = SITE_ORIGIN + '/og.png'

// routePath kiểu '/cung-hoang-dao/bach-duong'; '/' (hoặc rỗng) → trang gốc có dấu '/'.
export function absUrl(routePath) {
  if (!routePath || routePath === '/') return SITE_ORIGIN + '/'
  return SITE_ORIGIN + (routePath[0] === '/' ? routePath : '/' + routePath)
}

// items: [{ name, path? }] — phần tử cuối (trang hiện tại) thường KHÔNG cần path.
// Trả về object JSON-LD BreadcrumbList (đã gắn @context) để JSON.stringify.
export function breadcrumbLd(items) {
  const list = Array.isArray(items) ? items : []
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((it, i) => {
      const el = { '@type': 'ListItem', position: i + 1, name: it.name }
      if (it.path) el.item = absUrl(it.path)
      return el
    })
  }
}
