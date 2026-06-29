const CACHE = 'clauger-v11';
const VERSION = '26_02';

// Archivos solo para fallback offline
const OFFLINE_FILES = [
  './index.html',
  './manifest.json',
  './Clauger.png',
  './scripts/config.js',
  './scripts/state.js',
  './scripts/utils.js',
  './scripts/auth.js',
  './scripts/db.js',
  './scripts/app.js',
  './scripts/ayudante.js',
  './scripts/tutorial.js',
  './styles/main.css',
  './styles/login.css',
  './styles/forms.css',
  './styles/equipment.css',
  './styles/checklist.css',
  './styles/photos.css'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(OFFLINE_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => {
      return self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
        clients.forEach(client => client.postMessage({ type: 'APP_UPDATED', version: VERSION }));
      });
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isLocal = url.origin === self.location.origin;

  // Imágenes y fuentes: cache-first
  if (isLocal && (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|woff2?)$/))) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // HTML, JS, CSS: network-first, fallback a caché si hay error de red
  if (isLocal) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Peticiones externas (CDN, etc): network con fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
