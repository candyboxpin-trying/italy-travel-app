const CACHE_NAME = 'italia-2026-v1';
const ASSETS = [
  '/italia-2026/',
  '/italia-2026/index.html',
  '/italia-2026/manifest.json',
  '/italia-2026/icon-192.png',
  '/italia-2026/icon-512.png'
];

// 安裝：預先快取所有檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 啟動：清除舊版快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 攔截請求：有網路就更新，沒網路就用快取
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
