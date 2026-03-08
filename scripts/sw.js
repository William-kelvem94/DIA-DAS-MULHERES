const CACHE_VERSION = '359f9eba-0a16a846';
const CACHE_NAME = 'dia-mulheres-' + CACHE_VERSION;
const urlsToCache = [
  '/',
  '/index.html',
  '/style.ba33ec11.css',
  '/app.f37d0b4b.js',
  '/The Weeknd_ Ariana Grande - Die For You (Remix _ Lyric Video)(MP3_320K)_1.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // dynamic caching for gallery photos
  if (url.pathname.startsWith('/FOTOS MOZINHO/')) {
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
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});