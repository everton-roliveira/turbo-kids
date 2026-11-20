// Guarda o jogo no celular para abrir sem internet.
// Arquivos do próprio jogo: busca sempre a versão nova (sem o cache de 10 min do GitHub Pages) e usa o cache só sem internet.
// Three.js, fontes e ícones de fora: vêm do cache.
const CACHE = 'turbo-kids-v15';
const JS = ['dados', 'audio', 'render', 'carros', 'garagem', 'pista', 'cenarios', 'corrida', 'interface', 'principal'].map((n) => `./js/${n}.js`);
const ARQUIVOS = [
  './', './index.html', './css/jogo.css', ...JS, './manifest.webmanifest', './icone.svg', './icone-180.png', './icone-192.png', './icone-512.png',
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

const guardar = (chave, r) => { if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(chave, copia)); } return r; };

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req.url, { cache: 'no-store' }).then((r) => guardar('./index.html', r)).catch(() => caches.match('./index.html')));
    return;
  }
  if (url.origin === location.origin && /\.(js|css)$/.test(url.pathname)) {
    e.respondWith(fetch(url.href.split('?')[0], { cache: 'no-store' }).then((r) => guardar(req, r)).catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req).then((achou) => achou || fetch(req).then((r) => guardar(req, r))));
});
