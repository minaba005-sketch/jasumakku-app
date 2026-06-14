const CACHE_NAME = 'jasumakku-v1';
const FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache=> cache.addAll(FILES))
  );
});

self.addEventListener('fetch', e=>{
  if(e.request.url.includes('script.google.com')) return; // API通信はキャッシュしない
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request))
  );
});
