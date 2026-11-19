# Turbo Kids

Jogo de corrida 3D para celular (Android e iPhone), feito para crianças pequenas.

## Como jogar
- Abra o jogo no navegador do celular. Com o GitHub Pages ativado, o endereço é `https://everton-roliveira.github.io/turbo-kids/`.
- Botões: acelerar, esquerda, direita, turbo (recarrega em 30 segundos) e buzina.
- Também dá para virar inclinando o celular (opção na garagem).
- No computador: setas ou WASD, Espaço para o turbo, H para a buzina, P ou Esc para pausar.

## Regras
- Fique entre os 3 primeiros para ir à próxima pista. Se não, corre de novo.
- Cada posição ganha moedas. Na pista também tem moedas para pegar.
- ⭐ Estrela enche o turbo. Faixa azul com setas dá um turbo rápido. Rampa faz o carro pular.
- Buraco deixa o carro lento. Bater numa faixa interditada zera a velocidade.
- Uma batida de lado tira o outro carro da pista, e os outros podem fazer o mesmo com você.
- A buzina faz o carro da frente sair do caminho.

## Garagem
- 6 carros (inspirados em estilos famosos, sem marcas), 12 cores, adesivos (raio, chamas, estrelas, listras), cor das rodas e o nome da criança na placa.
- Oficina com 4 melhorias: motor, aceleração, amortecedor e pneus.
- Álbum de troféus com a melhor posição em cada pista.

## Cenários
Campo, praia, deserto, cidade, neve e noite. A partir da pista 2 aparece um túnel, e a partir da pista 3 uma ponte.

## Para crianças pequenas
- Uma voz fala em português: contagem, "turbo pronto", posição e resultado (dá para desligar).
- A primeira corrida mostra uma mãozinha apontando cada botão.
- Quem está muito na frente diminui um pouco a velocidade, para a corrida não ficar frustrante.
- Música e comemoração com confete e fogos no pódio.

## Técnico
- Um único `index.html` com [Three.js](https://threejs.org/) r128. Não precisa de build.
- `manifest.webmanifest` + `sw.js`: dá para instalar como app e jogar sem internet.
- A qualidade gráfica baixa sozinha se o celular não aguentar (tira as sombras e depois reduz a resolução).
- O progresso fica salvo no próprio aparelho (`localStorage`).
- Abrir com `#teste` no fim do endereço expõe `window.__tk` para testes automatizados.
