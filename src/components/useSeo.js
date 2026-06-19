import { useEffect } from 'react'
import { absUrl, breadcrumbLd, OG_IMAGE } from '../data/seo.js'

// Hook đặt meta cho 1 trang rồi TỰ KHÔI PHỤC khi rời trang (SPA không rò rỉ meta giữa route).
// Quản lý: <title>, meta description, link canonical, OG/Twitter, và <script> JSON-LD breadcrumb.
// Tham số: { title, description, path, breadcrumb:[{name,path?}], image? }.

function ensure(selector, make) {
  const found = document.querySelector(selector)
  if (found) return { el: found, created: false }
  const el = make(); document.head.appendChild(el)
  return { el, created: true }
}

export function usePageSeo({ title, description, path, breadcrumb, image }) {
  const bc = breadcrumb ? JSON.stringify(breadcrumb) : ''
  useEffect(() => {
    if (typeof document === 'undefined') return
    const restore = []
    const prevTitle = document.title
    if (title) { document.title = title; restore.push(() => { document.title = prevTitle }) }

    const url = path ? absUrl(path) : null
    const img = image || OG_IMAGE

    // Đặt 1 thuộc tính, nhớ giá trị cũ để hoàn nguyên (tag tạo mới thì gỡ hẳn).
    const put = (selector, make, attr, val) => {
      if (val == null) return
      const { el, created } = ensure(selector, make)
      if (created) { el.setAttribute(attr, val); restore.push(() => el.remove()); return }
      const prev = el.getAttribute(attr)
      el.setAttribute(attr, val)
      restore.push(() => { if (prev == null) el.removeAttribute(attr); else el.setAttribute(attr, prev) })
    }
    const meta = (kind, key, val) =>
      put('meta[' + kind + '="' + key + '"]', () => { const m = document.createElement('meta'); m.setAttribute(kind, key); return m }, 'content', val)

    meta('name', 'description', description)
    meta('property', 'og:title', title)
    meta('property', 'og:description', description)
    if (url) meta('property', 'og:url', url)
    meta('property', 'og:image', img)
    meta('name', 'twitter:title', title)
    meta('name', 'twitter:description', description)
    meta('name', 'twitter:image', img)
    if (url) put('link[rel="canonical"]', () => { const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l }, 'href', url)

    // JSON-LD breadcrumb: luôn tạo script mới rồi gỡ khi rời trang.
    let ld = null
    if (breadcrumb && breadcrumb.length) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.setAttribute('data-seo', 'breadcrumb')
      ld.textContent = JSON.stringify(breadcrumbLd(breadcrumb))
      document.head.appendChild(ld)
    }

    window.scrollTo(0, 0)
    return () => { while (restore.length) restore.pop()(); if (ld) ld.remove() }
  }, [title, description, path, image, bc])
}
