/*!
 * THE ALLIANCE — Service Worker
 * Required for PWA install prompt
 * v2 — nav-wheel.js removed from precache, always network-fetched
 */
const CACHE = 'alliance-v2';
const PRECACHE = [
  '/',
  '/manifest.json',
  '/theavpi.png',
  '/imagebank/sword.png',
  '/imagebank/shield.png',
  '/imagebank/scroll.png',
  '/imagebank/icon-192.png',
  '/imagebank/icon-512.png',
];

// JS files that should NEVER be cached — always fetch fresh
const NEVER_CACHE = [
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
  const url = new URL(e.request.url);

  // Always go to network for nav-wheel.js — never serve from cache
  if (NEVER_CACHE.some(path => url.pathname === path)) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Network first, fall back to cache for everything else
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
