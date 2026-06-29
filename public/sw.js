const CACHE = 'tamso-v4.0.2'
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
  if (new URL(req.url).origin !== location.origin) return
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try { const fresh = await fetch(req); const c = await caches.open(CACHE); c.put(req, fresh.clone()); return fresh }
      catch (_) { return (await caches.match(req)) || (await caches.match('./')) || Response.error() }
    })())
    return
  }
  e.respondWith((async () => {
    const hit = await caches.match(req)
    if (hit) return hit
    try { const fresh = await fetch(req); if (fresh && fresh.status === 200) { const c = await caches.open(CACHE); c.put(req, fresh.clone()) } return fresh }
    catch (_) { return hit || Response.error() }
  })())
})
