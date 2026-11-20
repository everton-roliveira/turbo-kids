// Guarda o jogo no celular para abrir sem internet.
// A página sempre busca a versão nova (sem o cache de 10 min do GitHub Pages); o resto (Three.js, fontes, ícones) vem do cache.
const CACHE = 'turbo-kids-v5';
const ARQUIVOS = [
  './', './index.html', './manifest.webmanifest', './icone.svg', './icone-180.png', './icone-192.png', './icone-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-store' })
        .then((r) => { const copia = r.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copia)); return r; })
        .catch(() => caches.match('./index.html')),
    );
    return;
  }
  e.respondWith(
    caches.match(req).then((achou) => achou || fetch(req).then((r) => {
      if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return r;
    })),
  );
});
