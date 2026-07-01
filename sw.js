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

// 網路優先策略：有網路就抓最新版，沒網路才用快取
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 抓到新版本，順便存進快取
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        // 沒網路，用快取
        return caches.match(event.request)
          .then(cached => cached || caches.match('/italy-travel-app/index.html'));
      })
  );
});
