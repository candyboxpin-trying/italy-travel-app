const CACHE_NAME = 'italia-2026-v1';
const URLS_TO_CACHE = [
  '/italy-travel-app/',
  '/italy-travel-app/index.html',
  '/italy-travel-app/icon-192.png',
  '/italy-travel-app/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('/italy-travel-app/index.html'));
    })
  );
});
