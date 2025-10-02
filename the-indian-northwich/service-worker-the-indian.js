const PRECACHE = 'precache-theindian00155889658';
const RUNTIME = 'runtimetheindian008889656895';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/the-indian-northwich/index.html',
'/the-indian-northwich/jquery.rwdImageMaps.min.js',
'/the-indian-northwich/javascript-1.js',
'/the-indian-northwich/javascript-2.js',
'/the-indian-northwich/images/the-indian-northwich-local-app.png',
'/the-indian-northwich/images/share-email.png',
'/the-indian-northwich/images/share-text.png',
'/the-indian-northwich/images/share-top.png',
'/the-indian-northwich/images/icons/icon-72x72.png',
'/the-indian-northwich/images/icons/icon-96x96.png',
'/the-indian-northwich/images/icons/icon-128x128.png',
'/the-indian-northwich/images/icons/icon-144x144.png',
'/the-indian-northwich/images/icons/icon-152x152.png',
'/the-indian-northwich/images/icons/icon-192x192.png',
'/the-indian-northwich/images/icons/icon-384x384.png',
'/the-indian-northwich/images/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});