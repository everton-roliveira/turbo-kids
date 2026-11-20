// Guarda o jogo no celular para abrir sem internet.
// Arquivos do próprio jogo: busca sempre a versão nova (sem o cache de 10 min do GitHub Pages) e usa o cache só sem internet.
// Three.js, fontes e ícones de fora: vêm do cache.
const CACHE = 'turbo-kids-v18';
// todos os módulos do jogo (gerado a partir da pasta js/)
const JS = [
  './js/anuncios/admin.js',
  './js/anuncios/config.js',
  './js/anuncios/index.js',
  './js/anuncios/provedores/carregarScript.js',
  './js/anuncios/provedores/crazygames.js',
  './js/anuncios/provedores/poki.js',
  './js/anuncios/provedores/teste.js',
  './js/audio/efeitos/batida.js',
  './js/audio/efeitos/buraco.js',
  './js/audio/efeitos/buzina.js',
  './js/audio/efeitos/estrela.js',
  './js/audio/efeitos/fogos.js',
  './js/audio/efeitos/moeda.js',
  './js/audio/efeitos/moedas.js',
  './js/audio/efeitos/pouso.js',
  './js/audio/efeitos/turbo.js',
  './js/audio/efeitos/vitoria.js',
  './js/audio/musica.js',
  './js/audio/musicas/alien.js',
  './js/audio/musicas/aquatica.js',
  './js/audio/musicas/aventura.js',
  './js/audio/musicas/aviao.js',
  './js/audio/musicas/brinquedo.js',
  './js/audio/musicas/caixinha.js',
  './js/audio/musicas/circo.js',
  './js/audio/musicas/country.js',
  './js/audio/musicas/deserto.js',
  './js/audio/musicas/espaco.js',
  './js/audio/musicas/fantasia.js',
  './js/audio/musicas/fogo.js',
  './js/audio/musicas/funk.js',
  './js/audio/musicas/gelo.js',
  './js/audio/musicas/inverno.js',
  './js/audio/musicas/jardim.js',
  './js/audio/musicas/lanche.js',
  './js/audio/musicas/natal.js',
  './js/audio/musicas/noturna.js',
  './js/audio/musicas/oriental.js',
  './js/audio/musicas/pirata.js',
  './js/audio/musicas/rock.js',
  './js/audio/musicas/savana.js',
  './js/audio/musicas/sonho.js',
  './js/audio/musicas/synth.js',
  './js/audio/musicas/torcida.js',
  './js/audio/musicas/travessa.js',
  './js/audio/musicas/trem.js',
  './js/audio/musicas/tribal.js',
  './js/audio/musicas/tropical.js',
  './js/audio/som.js',
  './js/audio/voz.js',
  './js/carros/adesivos.js',
  './js/carros/criar.js',
  './js/carros/geometria.js',
  './js/carros/index.js',
  './js/carros/modelos/basico.js',
  './js/carros/modelos/dragao.js',
  './js/carros/modelos/flecha.js',
  './js/carros/modelos/gt.js',
  './js/carros/modelos/jipe.js',
  './js/carros/modelos/onibus.js',
  './js/carros/modelos/patrulha.js',
  './js/carros/modelos/proto.js',
  './js/carros/modelos/rosso.js',
  './js/carros/modelos/sirene.js',
  './js/carros/modelos/touro.js',
  './js/carros/modelos/v8.js',
  './js/carros/pecas.js',
  './js/carros/rosto.js',
  './js/corrida/acoes.js',
  './js/corrida/atualizar.js',
  './js/corrida/camera.js',
  './js/corrida/estado.js',
  './js/corrida/fisica.js',
  './js/corrida/hud.js',
  './js/corrida/ia.js',
  './js/corrida/iniciar.js',
  './js/corrida/jogador.js',
  './js/corrida/obstaculos.js',
  './js/corrida/visual.js',
  './js/garagem/cena.js',
  './js/garagem/oficina.js',
  './js/garagem/opcoes.js',
  './js/garagem/painel.js',
  './js/garagem/tema.js',
  './js/interface/album.js',
  './js/interface/controles.js',
  './js/interface/festa.js',
  './js/interface/inclinacao.js',
  './js/interface/instalar.js',
  './js/interface/mapa.js',
  './js/interface/telas.js',
  './js/interface/tutorial.js',
  './js/main.js',
  './js/nucleo/ambiente.js',
  './js/nucleo/app.js',
  './js/nucleo/mesclar.js',
  './js/nucleo/qualidade.js',
  './js/nucleo/render.js',
  './js/nucleo/salvo.js',
  './js/nucleo/texturas.js',
  './js/nucleo/util.js',
  './js/pistas/animacao.js',
  './js/pistas/cenario.js',
  './js/pistas/dificuldade.js',
  './js/pistas/escolha.js',
  './js/pistas/ferramentas.js',
  './js/pistas/ponte.js',
  './js/pistas/temas/aeroporto.js',
  './js/pistas/temas/campo-verde.js',
  './js/pistas/temas/canteiro-de-obras.js',
  './js/pistas/temas/ceu-das-nuvens.js',
  './js/pistas/temas/cidade-do-futuro.js',
  './js/pistas/temas/cidade.js',
  './js/pistas/temas/deserto.js',
  './js/pistas/temas/estacao-de-trem.js',
  './js/pistas/temas/estadio-de-futebol.js',
  './js/pistas/temas/fazenda.js',
  './js/pistas/temas/festa-dos-lanches.js',
  './js/pistas/temas/floresta-dos-cogumelos.js',
  './js/pistas/temas/fundo-do-mar.js',
  './js/pistas/temas/ilha-dos-piratas.js',
  './js/pistas/temas/index.js',
  './js/pistas/temas/jardim-das-cerejeiras.js',
  './js/pistas/temas/jardim-das-joaninhas.js',
  './js/pistas/temas/lua.js',
  './js/pistas/temas/montanha-de-fogo.js',
  './js/pistas/temas/neve.js',
  './js/pistas/temas/noite.js',
  './js/pistas/temas/parque-de-diversoes.js',
  './js/pistas/temas/planeta-alienigena.js',
  './js/pistas/temas/polo-sul.js',
  './js/pistas/temas/praia.js',
  './js/pistas/temas/quarto-de-brinquedos.js',
  './js/pistas/temas/reino-encantado.js',
  './js/pistas/temas/safari.js',
  './js/pistas/temas/terra-dos-doces.js',
  './js/pistas/temas/vale-dos-dinossauros.js',
  './js/pistas/temas/vila-do-natal.js',
  './js/pistas/tracado.js',
  './js/pistas/tunel.js',
];
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
