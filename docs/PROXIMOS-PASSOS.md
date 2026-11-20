# Próximos passos

Lista para a próxima pessoa ou IA seguir, em ordem de prioridade. Cada item diz o que fazer, onde mexer e quando está pronto. Antes de começar, leia o [`MAPA.md`](MAPA.md) e o [`CLAUDE.md`](../CLAUDE.md).

## 1. Enviar para um portal de jogos (Poki e, se não aprovarem, CrazyGames)
O dono vai criar a conta de desenvolvedor. A parte técnica:
- Gerar um zip só com o jogo: `index.html`, `css/`, `js/`, ícones e manifest. Sem `testes/`, `docs/` nem `README.md`.
- O service worker só é registrado fora de iframe (`interface/instalar.js`), então no portal ele não atrapalha. Confirmar.
- No portal, `js/anuncios/config.js` com `plataforma:'auto'` detecta Poki ou CrazyGames pelo endereço. Se o portal usar outro domínio, fixar a plataforma no zip.
- Testar com a ferramenta de cada portal (Poki Inspector ou o QA do CrazyGames):
  - carregamento (`carregou`);
  - `gameplayStart` e `gameplayStop` (vêm de `mudarModo`);
  - os três prêmios;
  - o intervalo entre corridas.
- **Pronto quando:** o portal aprovar o envio sem pedir mudança técnica.

## 2. Desempenho em celular simples
- Medir o FPS num Android antigo nas pistas mais cheias: Doces, Natal, Cogumelos, Fundo do Mar e Joaninhas.
- Quando `Qualidade.nivel` for 0, reduzir a quantidade de objetos dos cenários. O `grupo()` de `pistas/ferramentas.js` recebe `qtd`; multiplicar por um fator vindo de `nucleo/qualidade.js`.
- Os objetos usam `frustumCulled=false`. Se pesar, trocar por divisão em setores.
- **Pronto quando:** 30 FPS ou mais na pista mais cheia num celular de entrada.

## 3. Guardar o progresso por código ou QR code
- Na garagem, um botão "Guardar progresso" gera um código curto (ou QR) com o `save` compactado (JSON → base64, sem o campo `adm`).
- "Recuperar progresso" lê o código e substitui o `save` com `trocarSave()` e `salvar()`.
- Não enviar nada para servidor: não há backend e o público é infantil (LGPD).
- Colocar o código em `interface/` ou `nucleo/`, com um arquivo por função.
- **Pronto quando:** dá para levar moedas, carros, rodas, adesivos e troféus para outro aparelho.

## 4. Pai contra filho na mesma tela
- Tela dividida (`renderer.setScissor` e `setViewport`, uma câmera para cada jogador), dois carros controlados e quatro adversários.
- Controles: cada metade da tela tem os seus botões. No teclado, WASD para um e setas para o outro.
- `corrida/estado.js` precisa de duas entradas; `corrida/camera.js` e `corrida/hud.js`, uma instância por jogador.
- **Pronto quando:** duas pessoas correm juntas no mesmo celular deitado e o resultado mostra as duas posições.

## 5. Controle dos pais
- Área protegida por uma pergunta para adultos (por exemplo, uma conta de multiplicar). Opções:
  - tempo de jogo por dia, com aviso amigável ("mais 3 corridas");
  - dificuldade fácil, normal ou difícil, como um fator sobre `paramsNivel`;
  - desligar os anúncios (já existe `save.premiosAnuncio`).
- **Pronto quando:** a criança não consegue mudar sozinha e o limite de tempo funciona.

## 6. Fantasma do recorde
- Guardar a melhor volta de cada pista (`prog` e `d` a cada 0,1 s) e mostrar um carro transparente refazendo essa volta.
- **Pronto quando:** o fantasma aparece a partir da segunda corrida na pista.

## 7. Campeonatos
- Copas de 4 pistas seguidas, com pontos por posição e um troféu grande no fim (por exemplo, Copa dos Bichos: Dinossauros, Safári, Fazenda e Polo Sul).
- Mostrar no álbum.

## 8. Álbum de figurinhas
- Cada pista vencida em 1º dá uma figurinha do cenário (o pinguim, a girafa, o robô...), desenhada em canvas ou SVG simples.

## 9. Idiomas (inglês e espanhol)
- Juntar todos os textos da interface e da voz num arquivo por idioma (`js/idiomas/pt.js`, `en.js`, `es.js`) e escolher pelo idioma do aparelho.
- A voz usa `speechSynthesis` com o `lang` do idioma escolhido.
- Importante para os portais, que têm público do mundo todo.

## 10. Conteúdo novo (sempre que pedirem)
- **Pista:** arquivo em `js/pistas/temas/` e linha em `temas/index.js`. A dificuldade se redistribui sozinha. Conferir com `testes/crianca.js` se a curva continua boa.
- **Música:** arquivo em `js/audio/musicas/`, importado pela pista.
- **Carro:** arquivo em `js/carros/modelos/` (com `preco`, entra na loja) e linha em `carros/index.js`, na ordem de preço.
- **Roda:** arquivo em `js/carros/rodas/` e linha em `rodas/index.js`.
- **Adesivo:** desenho em `texAdesivo` (`nucleo/texturas.js`) e item em `ADESIVOS` (`garagem/opcoes.js`).

## Dívidas técnicas conhecidas
- O texto da versão está em dois lugares: `index.html` e `js/garagem/painel.js`. Seria bom ter uma constante só.
- `PADRAO` ainda tem `aro:null`, que é apagado na carga. Dá para remover.
- Alguns comentários de seção se perderam quando o código foi dividido em módulos.
- Os testes usam o Chrome local (`CHROME`) e não rodam em CI. Dá para criar um workflow no GitHub Actions com Chrome headless.
