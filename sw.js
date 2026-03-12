/*!
 * THE ALLIANCE — Service Worker
 * Required for PWA install prompt
 */

const CACHE = 'alliance-v1';

const PRECACHE = [
  '/',
  '/manifest.json',
  '/theavpi.png',
  '/imagebank/sword.png',
  '/imagebank/shield.png',
  '/imagebank/scroll.png',
  '/imagebank/icon-192.png',
  '/imagebank/icon-512.png',
  '/nav-wheel.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first, fall back to cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
