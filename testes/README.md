# Testes do Turbo Kids

Cada script sobe um servidor local com o jogo, abre no Chrome sem tela (puppeteer-core) e confere uma parte do jogo. O Three.js vem do `node_modules` (a internet não é usada).

```bash
cd testes && npm install
# no Mac o Chrome é encontrado sozinho; em outro sistema: export CHROME=/caminho/do/chrome
node jogo.js .. saida            # garagem, uma corrida por cenário (1-6), pulo, moedas, resultado e álbum
node crianca.js .. 1,6,12,18,24,30 sem   # dificuldade: bot que só acelera e nunca vira (posição final por pista)
node cenarios.js .. saida 26,27,28       # fotos dos cenários das pistas escolhidas
node anim.js .. saida 7,9,16             # cenários com movimento (diz se cada grupo "mexe")
node mapa.js .. saida            # mapa de pistas: escolher, correr e avançar
node loja2.js .. saida CODIGO    # loja de carros e modo administrador (CODIGO = código do administrador)
node rodas.js .. saida           # loja de adesivos/rodas e fotos de perto de cada roda
node anuncios.js .. saida CODIGO # prêmios com anúncio simulado, limite do dia e administrador
node musica.js ..                # cada música toca e produz som
node carros4.js .. saida onibus,sirene 0.35,2.3   # fotos de carros em ângulos da garagem
```

- Rode um de cada vez: o Chrome sem tela pausa abas em segundo plano.
- `ERROS nenhum` no fim = sem erro de JavaScript na página. O aviso `net::ERR_FAILED` vem das fontes do Google bloqueadas no teste e pode ser ignorado.
- As fotos ficam na pasta de saída; abra para conferir o visual.
- O código do administrador não fica no repositório.
