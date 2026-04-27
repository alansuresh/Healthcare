/* MediSync Service Worker
 * - Lightweight runtime cache for static assets (PWA offline shell).
 * - Notification handling: receives messages from the app and shows
 *   browser notifications with click-through routing.
 */

const CACHE_VERSION = 'medisync-v1';
const APP_SHELL = ['/', '/index.html', '/favicon.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

// Network-first for navigation, cache-first for static assets.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match('/index.html')),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return res;
        }),
    ),
  );
});

// App-driven notifications. The page posts { type: 'NOTIFY', payload: {...} }.
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  if (type !== 'NOTIFY' || !payload) return;

  const { title, body, tag, url, icon } = payload;
  self.registration.showNotification(title || 'MediSync', {
    body: body || '',
    tag: tag || 'medisync',
    icon: icon || '/favicon.svg',
    badge: '/favicon.svg',
    data: { url: url || '/' },
    vibrate: [80, 40, 80],
    renotify: true,
  });
});

// Web push (if a push provider is wired up in production).
self.addEventListener('push', (event) => {
  let payload = { title: 'MediSync', body: 'You have a new alert.' };
  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag || 'medisync-push',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { url: payload.url || '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsList) => {
        for (const client of clientsList) {
          if ('focus' in client) {
            client.focus();
            client.postMessage({ type: 'NAVIGATE', url: targetUrl });
            return;
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      }),
  );
});
