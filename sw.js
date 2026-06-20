/* MedHub PWA — cache leve só do shell (CSS, logo, tema). Conteúdo clínico sempre via rede. */
var SHELL_CACHE = 'medhub-shell-v1';
var SHELL_URLS = [
  '/manifest.webmanifest',
  '/theme.js',
  '/style.css',
  '/app-mobile.css',
  '/landing-mobile.css',
  '/auth-mobile.css',
  '/assets/medhub-logo.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

function isShellRequest (url) {
  var path = url.pathname;
  return SHELL_URLS.indexOf(path) !== -1;
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.addAll(SHELL_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== SHELL_CACHE; }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf('/api/') === 0) return;

  if (!isShellRequest(url)) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var network = fetch(event.request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(SHELL_CACHE).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return response;
      });
      return cached || network;
    })
  );
});
