const CACHE = 'clauger-v15';
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
  './scripts/psv-data.js',
  './scripts/tutorial.js',
  './styles/main.css',
  './styles/login.css',
  './styles/forms.css',
  './styles/equipment.css',
  './styles/checklist.css',
  './styles/photos.css'
];

const PDFJS_FILES = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.7.2/mammoth.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(OFFLINE_FILES).then(() =>
        // PDF.js se precachea por separado: si la CDN falla, el install no se rompe
        Promise.allSettled(PDFJS_FILES.map(url => c.add(url)))
      )
    )
  );
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

  // Peticiones externas (CDN, etc): network-first, cachea en éxito para offline
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
