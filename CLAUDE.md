# Turbo Kids: regras para quem for mexer (pessoas ou IA)

Jogo de corrida 3D para crianças de uns 5 anos. Antes de mudar qualquer coisa, leia:
- [`docs/MAPA.md`](docs/MAPA.md): o que o jogo faz e o que cada módulo contém.
- [`docs/PROXIMOS-PASSOS.md`](docs/PROXIMOS-PASSOS.md): próximas features em ordem, com critério de pronto.

## Regras
1. **Português (pt-BR)** nos textos, comentários e nomes (`criarCarro`, `paramsNivel`, `save.moedas`). As respostas ao dono também são em pt-BR.
2. **Sem build:** ES modules carregados direto pelo navegador. O Three.js r128 vem do cdnjs (global `THREE`). Não usar bundler nem dependências novas no jogo.
3. **Um item por arquivo:** cada carro, pista, música, roda e efeito de som tem o seu arquivo, listado no `index.js` da pasta. Para criar um item novo, copie um arquivo parecido.
4. **Variáveis compartilhadas** (`save`, `modo`, `corrida`, `P`, `tremor`) se trocam pelas funções `trocarSave`, `mudarModo`, `definirCorrida`, `usarPista` e `definirTremor` (um `import` não pode ser reatribuído).
5. **Público infantil:**
   - nada de coletar dados nem enviar para servidor;
   - anúncios só com prêmio e opcionais, com limite diário e opção para os pais desligarem;
   - não copiar personagens, nomes ou marcas existentes (os carros são inspirados em estilos, sem marcas);
   - não aumentar a dificuldade sem o dono pedir.
6. **Administrador:** o código nunca entra no repositório (que é público). Só o hash SHA-256 fica em `js/anuncios/config.js`.
7. **Ao mudar arquivos do jogo:**
   - aumente o número do `CACHE` em `sw.js` e inclua arquivos novos na lista `JS`;
   - suba a versão mostrada na garagem: o texto "Turbo Kids · versão N" está em `index.html` e em `js/garagem/painel.js`.

## Testar
`cd testes && npm install`, depois rode os scripts com `..` como raiz (veja `testes/README.md`). Rode pelo menos o `jogo.js` (regressão). Rode também o teste da área mexida: `loja2.js` e `rodas.js` (loja), `anuncios.js`, `cenarios.js` e `anim.js` (pistas), `crianca.js` (dificuldade). Abra as fotos geradas para conferir o visual. Para ver o objeto `window.__tk`, abra o jogo com `#teste` no endereço.

## Publicar
- `git push` na `main` publica no GitHub Pages: https://everton-roliveira.github.io/turbo-kids/. Leva uns 2 minutos.
- Para conferir se o site já está na versão nova, procure "versão N" na página.
