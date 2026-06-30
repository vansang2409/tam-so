const CACHE = 'tamso-v4.3.8'
const ASSET_RE = /^\/assets\/.+\.(js|css|map)$/
const MEDIA_RE = /\.(png|jpg|jpeg|webp|gif|svg|ico|woff2?)$/i

async function putFresh(req, fresh) {
  if (!fresh || fresh.status !== 200) return
  const c = await caches.open(CACHE)
  await c.put(req, fresh.clone())
}

async function networkFirst(req) {
  try {
    const fresh = await fetch(req)
    await putFresh(req, fresh)
    return fresh
  } catch (_) {
    return (await caches.match(req)) || (await caches.match('./')) || Response.error()
  }
}

async function staleWhileRevalidate(req) {
  const hit = await caches.match(req)
  const refresh = fetch(req).then(fresh => putFresh(req, fresh).then(() => fresh)).catch(() => null)
  return hit || (await refresh) || Response.error()
}

async function cacheFirst(req) {
  const hit = await caches.match(req)
  if (hit) return hit
  try {
    const fresh = await fetch(req)
    await putFresh(req, fresh)
    return fresh
  } catch (_) {
    return Response.error()
  }
}

self.addEventListener('install', e => {
  e.waitUntil((async () => { try { const c = await caches.open(CACHE); await c.add('./') } catch (_) {} self.skipWaiting() })())
})
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    await self.clients.claim()
  })())
})
self.addEventListener('fetch', e => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== location.origin) return
  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req))
    return
  }
  if (ASSET_RE.test(url.pathname)) {
    e.respondWith(staleWhileRevalidate(req))
    return
  }
  if (MEDIA_RE.test(url.pathname)) {
    e.respondWith(cacheFirst(req))
    return
  }
  e.respondWith(staleWhileRevalidate(req))
})
