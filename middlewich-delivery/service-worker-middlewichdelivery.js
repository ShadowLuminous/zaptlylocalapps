const PRECACHE = 'precache-middlewichdelivery22255611110254512';
const RUNTIME = 'runtimemiddlewichdelivery22299811110212354';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/middlewich-delivery/index.html',
'/middlewich-delivery/jquery.rwdImageMaps.min.js',
'/middlewich-delivery/javascript-1.js',
'/middlewich-delivery/javascript-2.js',
'/middlewich-delivery/images/middlewich-and-district-local-app.png',
'/middlewich-delivery/images/share-email.png',
'/middlewich-delivery/images/share-text.png',
'/middlewich-delivery/images/share-top.png',
'/middlewich-delivery/images/icons/icon-72x72.png',
'/middlewich-delivery/images/icons/icon-96x96.png',
'/middlewich-delivery/images/icons/icon-128x128.png',
'/middlewich-delivery/images/icons/icon-144x144.png',
'/middlewich-delivery/images/icons/icon-152x152.png',
'/middlewich-delivery/images/icons/icon-192x192.png',
'/middlewich-delivery/images/icons/icon-384x384.png',
'/middlewich-delivery/images/icons/icon-512x512.png'
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