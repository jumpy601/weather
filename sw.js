const CACHE = 'tw-weather-v1';
const ASSETS = [
  '/weather/',
  '/weather/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // CWA API 請求永遠走網路（要取得即時資料）
  if (e.request.url.includes('opendata.cwa.gov.tw')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // 其他資源：有快取就用快取，沒有就抓網路
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
