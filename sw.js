// Penyimpan sementara agar aplikasi tetap terbuka saat sinyal lemah. Selalu mencoba versi terbaru dulu (network-first).
var CACHE = 'tb-albarkah-1.15.0-db377bd5';
var INTI = ['./', './index.html', './config.js', './manifest.webmanifest', './ikon-192.png', './ikon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(INTI); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  // Hanya berkas dari situs ini sendiri. Panggilan data ke script.google.com tidak pernah disentuh.
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r && r.ok) { var salin = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, salin); }); }
    return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); }));
});
