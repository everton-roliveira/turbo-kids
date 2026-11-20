# Mapa do Turbo Kids

O que o jogo faz e onde fica cada parte do código. Leia junto com o [`CLAUDE.md`](../CLAUDE.md) (regras para mexer no projeto) e o [`PROXIMOS-PASSOS.md`](PROXIMOS-PASSOS.md) (o que fazer depois).

## 1. O jogo

Jogo de corrida 3D para crianças de uns 5 anos. Roda no navegador do celular (Android e iPhone) e no computador. Pode ser instalado como app e funciona sem internet.

- **Público:** criança pequena que joga com o pai. Textos curtos, ícones grandes e voz em português.
- **Onde roda:**
  - GitHub Pages: https://everton-roliveira.github.io/turbo-kids/ (sem anúncios).
  - Portais de jogos (Poki e CrazyGames), com anúncios com prêmio. Ainda não foi enviado.
  - Um Artifact do Claude.
- **Sem build:** o `index.html` carrega o Three.js r128 (cdnjs) e depois `js/main.js` como ES module.

### Como uma partida acontece

1. **Garagem**
   - Escolher o carro: só o Pipoca é grátis, os outros são comprados.
   - Escolher cor, adesivo, roda e o nome na placa.
   - Comprar melhorias na oficina.
   - Escolher a pista no mapa (só as já liberadas).
2. **CORRER**
   - O portal pode mostrar um intervalo antes (`Anuncios.antesDaCorrida`).
   - Depois vem a contagem 3, 2, 1.
3. **Corrida**
   - 3 voltas contra 5 adversários.
   - Botões: acelerar, esquerda, direita, turbo (recarrega em 30 s) e buzina, que tira o carro da frente.
   - Buraco deixa o carro lento.
   - Placa de interditado zera a velocidade e devolve o carro ao meio da pista.
   - Uma batida de lado tira o outro carro da pista (vale para os dois lados).
   - Na pista também tem rampas, faixas azuis de turbo, moedas e estrelas (a estrela enche o turbo).
4. **Chegada:** a câmera gira para a frente do carro e mostra a carinha feliz ou triste.
5. **Resultado**
   - Cada posição ganha um prêmio (`PREMIO = [500,300,200,100,60,30]`), mais as moedas pegas na pista.
   - Ficando entre os 3 primeiros, libera a próxima pista.
   - Opcional: dobrar as moedas assistindo a um anúncio.

### O que já existe

| Área | Resumo |
|---|---|
| Pistas | 30 cenários, cada um com música própria e objetos que se mexem. Túnel a partir da pista 2 e ponte a partir da 3. Depois da 30, os cenários se repetem com traçados novos |
| Dificuldade | Sobe aos poucos da pista 1 à 30 ([`pistas/dificuldade.js`](../js/pistas/dificuldade.js)): velocidade e aceleração dos adversários, buracos, placas, força das curvas e agressividade. Quem está muito na frente alivia até 15%, cada vez menos nas pistas finais |
| Carros | 12 personagens com olhos no para-brisa e boca no capô (expressões: normal, feliz, bravo, triste, tonto, susto). Cada um tem número, buzina e garagem própria |
| Loja | Carros (Pipoca grátis; do Amarelinho 💰500 ao Dragão 💰15.000, que solta fogo pelas laterais), adesivos (💰300–1.200) e rodas (6 modelos; a Neon 💰6.000 tem luz que troca de cor e rotor girando). Preço amarelo quando dá para comprar, cinza quando faltam moedas |
| Oficina | Motor, aceleração, amortecedor e pneus, 5 níveis cada (💰200–1.600) |
| Ajudas para crianças | Voz (contagem, "turbo pronto", posição e resultado), tutorial com mãozinha na primeira corrida, "acelerar sozinho", "desvio no turbo" (desvia sozinho das placas durante o turbo; vem desligado), virar inclinando o celular |
| Extras | Álbum de troféus, mapa de pistas, confete e fogos no pódio, qualidade gráfica automática |
| Anúncios | Prêmios opcionais (2 turbos extras na largada, dobrar moedas, +200 moedas), limite de 6 por dia e um botão para os pais desligarem. Só aparecem dentro de um portal |
| Administrador | 5 toques na versão (fim da garagem) e o código. Tudo liberado, sem anúncios e sem limite. O repositório guarda só o hash SHA-256 do código, em `js/anuncios/config.js` |

## 2. Estado compartilhado

| O quê | Onde | Como trocar de outro módulo |
|---|---|---|
| `save`: progresso salvo no `localStorage` (chave `corrida-turbo-v1`) | `nucleo/salvo.js` | Mudar campos direto e chamar `salvar()`. Para trocar o objeto inteiro, usar `trocarSave(v)` |
| `modo`: `'garagem'`, `'contagem'`, `'corrida'`, `'pausa'` ou `'fim'` | `nucleo/render.js` | `mudarModo(v)`. Avisa quem está em `aoMudarModo` |
| `corrida`: corrida atual (cena, carros, obstáculos, tempo...) | `corrida/estado.js` | `definirCorrida(v)` |
| `P`: traçado da pista atual (pontos, tangentes, curvatura, `rnd` com semente) | `pistas/tracado.js` | `usarPista(v)` |
| `tremor`: tremida da câmera | `corrida/fisica.js` | `definirTremor(v)` |
| `garagem`: cena 3D, carro mostrado, `previa` (carro olhado) e `previaItem` (adesivo ou roda olhado) | `garagem/cena.js` | Objeto (mudar campos) |

Um módulo não pode reatribuir uma variável importada (`import`). Por isso essas variáveis são trocadas por funções.

**Campos do `save`:**

| Campo | O que guarda |
|---|---|
| `moedas` | Moedas |
| `nivel` | Maior pista liberada |
| `pista` | Pista escolhida no mapa |
| `modelo` | Carro em uso |
| `cor` | Cor do carro |
| `adesivo`, `roda` | Adesivo e roda em uso |
| `carros`, `adesivosComprados`, `rodasCompradas` | O que foi comprado |
| `up` | Nível de cada melhoria: `{motor,acel,amort,pneu}` |
| `trofeus` | `{pista: melhor posição}` |
| `som`, `musica`, `voz`, `auto`, `desvioTurbo`, `rosto`, `inclinar` | Opções da garagem |
| `tutorial` | Se já viu o tutorial |
| `nome` | Nome na placa do carro |
| `qualidade` | Qualidade gráfica |
| `adm` | Modo administrador |
| `anuncios` | `{dia, n}`: anúncios vistos no dia |
| `premiosAnuncio` | Os pais podem desligar os prêmios com anúncio |
| `lojaV3` | Marca de migração |

As migrações ficam no fim de `nucleo/salvo.js`.

## 3. Módulos (`js/`)

### Entrada
- `main.js`: importa os módulos, roda o loop (`requestAnimationFrame`), chama `Anuncios.iniciar()`. Com `#teste` no endereço, expõe `window.__tk`.

### `nucleo/`: base
| Arquivo | O que faz |
|---|---|
| `util.js` | `$`, `mod`, `clamp`, `mulberry32` (sorteio com semente), `reduzMov`, `lin` (cor linear). Mostra erro se o Three.js não carregar |
| `mesclar.js` | Junta geometrias em uma só |
| `salvo.js` | `save`, `PADRAO`, `salvar`, `carroLiberado` e migrações |
| `render.js` | Renderizador, câmera, `retrato`, `modo`/`mudarModo`/`aoMudarModo`, `redimensionar` |
| `qualidade.js` | Mede o FPS e baixa a qualidade (sombras e depois resolução) |
| `ambiente.js` | Mapa de ambiente para os reflexos |
| `texturas.js` | `tex()` desenha em canvas; `TEX` guarda asfalto, zebra, placas, torcida, faixas...; adesivo e placa com o nome |
| `app.js` | Detecta se está instalado como app; tela cheia |

### `audio/`
| Arquivo | O que faz |
|---|---|
| `som.js` | Contexto de áudio, volume geral, ronco do motor, `bip`, `ruido`. Junta os efeitos de `efeitos/` |
| `efeitos/*.js` | Um efeito por arquivo, chamado como `Som.nome()`: batida, buraco, turbo, moedas, moeda, estrela, pouso, buzina, vitória, fogos |
| `musica.js` | Toca um estilo musical gerado na hora (acordes, baixo, arpejo, melodia e bateria) |
| `musicas/*.js` | 30 estilos, um por pista. Formato explicado no cabeçalho de cada arquivo |
| `voz.js` | `Voz.falar()` com voz pt-BR do aparelho; `comNome()` coloca o nome da criança na frase |

### `carros/`
| Arquivo | O que faz |
|---|---|
| `index.js` | Lista e ordem dos carros (ordem da garagem = mais barato ao mais caro). Exporta `MODELOS`, `PERSONAGENS`, `BUZINAS`, `PRECO_CARRO`, `ORDEM_MODELOS` |
| `modelos/*.js` | Um carro por arquivo: `modelo` (carroceria por seções, faróis, aerofólio, `extras`, `fogoLateral`, `rodaEsc`, `janela`), `personagem` (nome, número, olho, garagem), `buzina`, `preco` |
| `geometria.js` | Carroceria por loft (`perfil`, `loft`, `geosModelo` com cache) |
| `rosto.js` | Olhos e boca (canvas), expressões, piscar e olhar |
| `pecas.js` | Geometrias e materiais compartilhados (`GEO`, `MAT`), número de corrida, `geosFixas` (geometrias que não são apagadas) |
| `adesivos.js` | Geometria das listras |
| `criar.js` | `criarCarro(id, cor, numero, enfeite)`: rodas, faróis, escapamentos, sirenes, fogo lateral, adesivo, número, placa e rosto. Também `descartarCarro`, `pintar`, `animarRodas`, `animarFogoLateral`, `piscarSirenes` |
| `rodas/*.js` | Um modelo de roda por arquivo (`criar({gira, esp, add, anim})`). `rodas/index.js` tem a ordem; `rodas/util.js` tem as peças e materiais |

### `pistas/`
| Arquivo | O que faz |
|---|---|
| `temas/index.js` | Ordem das pistas (`TEMAS`) e `temaDoNivel(n)` |
| `temas/*.js` | Uma pista por arquivo: nome, ícone, música, cores (céu, névoa, chão, árvore, tronco), luz, `mar`, `gravidade` (Lua) e `decorar(h)`, que espalha os objetos |
| `ferramentas.js` | O que o `decorar()` recebe: `grupo` (instâncias com cores e animação), `mat`, `brilho`, `B`, `arvoresRedondas`, `palmeiras`, `pinheiros`, `rumo`, `plantar`, `instancia`, `animados`, `cx`/`cz` |
| `animacao.js` | `animarCenario()`: mexe as instâncias a cada quadro |
| `tracado.js` | `construirPista(n)` (curva fechada com semente), `amostra`, `colocar`, faixas e paredes ao longo da pista |
| `tunel.js`, `ponte.js` | Túnel e ponte com rio |
| `cenario.js` | Chão, asfalto, zebra, muro, largada, arquibancada, mar; chama `tema.decorar()` |
| `dificuldade.js` | `progresso(n)` vai de 0 a 1 entre a primeira e a última pista; `paramsNivel(n)` |
| `escolha.js` | `pistaAtual()`: pista escolhida no mapa |

### `corrida/`
| Arquivo | O que faz |
|---|---|
| `estado.js` | `corrida`, `entrada` (botões e teclas), `descartarCorrida` |
| `iniciar.js` | `iniciarCorrida()`: pista, cenário, obstáculos, 6 carros (rivais com rodas sorteadas), contagem |
| `obstaculos.js` | Gera e monta buracos, placas, rampas, faixas de turbo, moedas e estrelas |
| `jogador.js` | Controle do carro da criança, incluindo o desvio no turbo |
| `ia.js` | Adversários: escolha de faixa, tentativa de batida (depois de 8 s), alívio de quem está na frente |
| `fisica.js` | Velocidade, pulo, batidas, sair da pista, obstáculos e chegada |
| `visual.js` | Posição dos carros e efeitos (fogo, sirene, rodas, rosto); moedas girando |
| `camera.js` | Câmera atrás do carro, turbo e órbita na chegada |
| `hud.js` | Placar, barra de progresso, botão de turbo, narração por voz |
| `acoes.js` | `usarTurbo()` (inclui turbos extras do anúncio) e `buzinar()` |
| `atualizar.js` | Um quadro da corrida (contagem, física, câmera, cenário, chegada) |

### `garagem/`
| Arquivo | O que faz |
|---|---|
| `cena.js` | Cena 3D, carro girando, `trocarCarroGaragem()`, prévia de carro, adesivo e roda |
| `tema.js` | Garagem de cada personagem (parede com o nome, piso, anel, objetos) |
| `painel.js` | Toda a interface da garagem: carros, cores, adesivos, rodas, compra, oficina, opções, botões de anúncio, entrada do administrador, recomeçar |
| `loja.js` | `precoItem`, `itemLiberado`, `comprarItem` para adesivos e rodas |
| `oficina.js` | Melhorias, preços e `statsJogador()` |
| `opcoes.js` | Cores, cores extras dos rivais e adesivos (com preço) |

### `interface/`
`tutorial.js` (mãozinha), `festa.js` (confete e fogos), `telas.js` (resultado, pausa, garagem, `aviso()`), `album.js`, `mapa.js`, `controles.js` (botões e teclado), `inclinacao.js`, `instalar.js` (botão de instalar e service worker).

### `anuncios/`
| Arquivo | O que faz |
|---|---|
| `config.js` | Portal (`auto`, `poki`, `crazygames`, `teste`, `nenhum`), limite diário, prêmios, intervalo entre corridas e `HASH_ADMIN` |
| `index.js` | `Anuncios.iniciar()`, `disponivel()`, `verPremiado()`, `antesDaCorrida()`; avisa o portal quando começa e para de jogar |
| `admin.js` | `ehAdmin()`, `entrarAdmin(codigo)`, `sairAdmin()` |
| `provedores/` | `poki.js`, `crazygames.js` e `teste.js` (anúncio simulado com `?anuncios=teste`) |

## 4. Outros arquivos
| Arquivo | O que faz |
|---|---|
| `index.html` | Telas (garagem, HUD, resultado, álbum, mapa, pausa). Tem o texto da versão, que também está em `garagem/painel.js` |
| `css/jogo.css` | Estilos |
| `sw.js` | Service worker. Os arquivos do jogo vêm sempre da rede quando há internet, com o cache como reserva; os de fora, do cache. Tem a lista `JS` com todos os módulos e o nome do `CACHE` |
| `manifest.webmanifest`, `icone*` | Instalação como app |
| `testes/` | Testes automáticos no Chrome (veja `testes/README.md`) |
