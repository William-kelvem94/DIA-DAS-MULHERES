const CACHE_VERSION = 'v2-REPLACE_ME';
const CACHE_NAME = 'dia-mulheres-' + CACHE_VERSION;
const urlsToCache = [
  'index.html',
  './',
  'css/style.ba33ec11.css',
  'js/app.f37d0b4b.js',
  'assets/music/music.mp3',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k.startsWith('dia-mulheres-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // dynamic caching for gallery photos
  if (decodeURIComponent(url.pathname).includes('/FOTOS MOZINHO/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(resp =>
          resp || fetch(event.request).then(fetchResp => {
            cache.put(event.request, fetchResp.clone());
            return fetchResp;
          })
        )
      )
    );
    return;
  }

  // Prefer fresh HTML/CSS/JS to avoid stale UI after deploy.
  if (event.request.mode === 'navigate' || ['style', 'script'].includes(event.request.destination)) {
    event.respondWith(
      fetch(event.request)
        .then(networkResp => {
          const clone = networkResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return networkResp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});