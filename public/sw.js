/* みなと日和 - オフライン対応のためのキャッシュ制御 */
const VERSION = 'v1';
const CACHE = `minato-dayori-${VERSION}`;
const OFFLINE_URL = '/offline/';

const PRECACHE = [
  '/',
  OFFLINE_URL,
  '/gourmet/',
  '/shopping/',
  '/hours/',
  '/weather/',
  '/season/',
  '/access/',
  '/services/',
  '/plan/',
  '/heritage/',
  '/course/',
  '/faq/',
  '/favicon.svg',
  '/site.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apple-touch-icon.png',
  '/images/pia-bandai-hero.webp',
  '/images/whats-niigata.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => undefined)
        )
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    event.waitUntil(network);
    return cached;
  }

  const response = await network;
  if (response) return response;
  return new Response('', { status: 504, statusText: 'offline' });
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const offline = await cache.match(OFFLINE_URL);
    if (offline) return offline;
    return new Response('<h1>オフライン</h1><p>通信が回復したら再度お試しください。</p>', {
      status: 503,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (/\.(?:webp|png|jpg|jpeg|svg|ico|woff2?|css|js)$/i.test(url.pathname) || url.pathname === '/site.webmanifest') {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
