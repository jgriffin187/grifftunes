// Minimal service worker: lets GriffTunes install as an app and open even if the network blips.
const CACHE = 'grifftunes-shell-v3';
// Files that never change once published, kept on the jukebox so they load instantly and work offline.
// (If one of these files is ever replaced, give it a new name or bump ASSETS.)
const ASSETS = 'grifftunes-assets-v1';
const KEEP = [/\/vendor\//, /\/photos\//, /\/efz-bell\.mp3$/];
// Fonts, the memorial's album cover and its photos (Wikimedia Commons): served from the copy on the jukebox, refreshed in the background.
const REFRESH = [/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, /^https:\/\/(upload|thumb)\.wikimedia\.org\/wikipedia\/commons\//, /^https:\/\/i\.scdn\.co\/image\/ab67616d0000b2737e12e3a6154eb79f0ee4b36c$/];
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('grifftunes-assets-') && k !== ASSETS).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const req = e.request, url = req.url;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req, { cache: 'no-cache' })   // always check for a newer page, so updates show up on the next reload
        .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return r; })
        .catch(() => caches.match('./'))
    );
    return;
  }
  if (req.method !== 'GET' || req.headers.has('range')) return;
  if (url.startsWith(self.location.origin) && KEEP.some(r => r.test(url.split('?')[0]))) {
    e.respondWith(caches.open(ASSETS).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const r = await fetch(req);
      if (r.ok) c.put(req, r.clone());
      return r;
    }));
    return;
  }
  if (REFRESH.some(r => r.test(url))) {
    e.respondWith(caches.open(ASSETS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; });
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net;
    }));
  }
});
