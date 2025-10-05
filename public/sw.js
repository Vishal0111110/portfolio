// Service Worker for PWA functionality
const CACHE_NAME = 'vishal-portfolio-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/cf-image.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
];

// Cache static assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first strategy for dynamic content, cache-first for static
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip external requests
  if (!url.origin.includes(self.location.origin) &&
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com')) return;

  // Network-first for API calls and external fonts
  if (url.pathname.includes('formspree') ||
      url.origin.includes('fonts.googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache errors
          if (!response.ok) return response;

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache errors or non-GET responses
            if (!response.ok || response.type !== 'basic') {
              return response;
            }

            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          });
      })
  );
});

// Background sync for form submissions when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline form submissions
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();

  const formRequests = keys.filter(request =>
    request.url.includes('formspree.io')
  );

  await Promise.all(
    formRequests.map(async (request) => {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.log('Background sync failed, will retry later');
      }
    })
  );
}

// Push notification support (placeholder for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
