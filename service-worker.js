const CACHE = 'clauger-v2';
const FILES = [
  './index.html',
  './manifest.json',
  './Clauger.png',
  './scripts/config.js',
  './scripts/state.js',
  './scripts/utils.js',
  './scripts/auth.js',
  './scripts/app.js',
  './styles/main.css',
  './styles/login.css',
  './styles/forms.css',
  './styles/equipment.css',
  './styles/checklist.css',
  './styles/photos.css'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});
