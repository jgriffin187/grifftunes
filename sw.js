// Minimal service worker: lets GriffTunes install as an app and open even if the network blips.
const CACHE = 'grifftunes-shell-v3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })   // always check for a newer page, so updates show up on the next reload
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return r; })
      .catch(() => caches.match('./'))
  );
});
