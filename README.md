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

## Personagens
Seis carros com nome, número e garagem própria:

| Carro | Estilo |
|---|---|
| Rubi nº 7 | Supercarro italiano |
| Trovão nº 33 | Superesportivo bravo |
| Cometa nº 21 | Hipercarro inglês |
| Barão nº 4 | Esportivo alemão de pista |
| Tornado nº 12 | Muscle car de corrida |
| Floco nº 24 | Carro de corrida de 24 horas |

Os carros têm olhos no para-brisa e boca no capô. Eles piscam, olham para a câmera e mudam de cara na corrida: ficam bravos quando vão bater, tontos quando são jogados para fora, assustados no buraco e felizes no turbo, no pulo e no pódio. Na chegada, a câmera vira para a frente do carro e mostra a carinha feliz ou triste antes do resultado. Dá para desligar as carinhas na garagem.

## Garagem
- Cada personagem tem a sua garagem, com cores, objetos e o nome na parede.
- 12 cores, adesivos (raio, chamas, estrelas, listras), cor das rodas e o nome da criança na placa.
- Oficina com 4 melhorias: motor, aceleração, amortecedor e pneus.
- Álbum de troféus com a melhor posição em cada pista.

## Cenários
20 pistas, cada uma com o seu cenário:

1. Campo Verde
2. Praia
3. Deserto
4. Cidade
5. Neve
6. Noite
7. Terra dos Doces: pirulitos, bengalas, balinhas e árvores de algodão-doce
8. Vale dos Dinossauros: dinossauros pescoçudos, palmeiras e vulcões
9. Lua: céu estrelado, a Terra no céu, crateras e foguetes. O pulo na rampa é mais alto
10. Fazenda: celeiros, vaquinhas, girassóis e fardos de feno
11. Reino Encantado: castelos coloridos, arco-íris e árvores cor-de-rosa
12. Ilha dos Piratas: navios piratas, baús de tesouro, barris e o mar
13. Floresta dos Cogumelos: cogumelos gigantes com bolinhas e florzinhas
14. Polo Sul: pinguins, iglus, bonecos de neve e blocos de gelo
15. Canteiro de Obras: guindastes, caminhões, montes de terra e cones
16. Parque de Diversões: rodas-gigantes, tendas de circo e balões
17. Fundo do Mar: corais, algas, peixinhos, estrelas-do-mar, bolhas e submarinos amarelos
18. Safári: girafas, elefantes, acácias e capim
19. Cidade do Futuro: torres com anéis de neon, discos voadores, robozinhos e céu estrelado
20. Jardim das Cerejeiras: cerejeiras floridas, pagodes, portais vermelhos e lanternas de pedra

A partir da pista 2 aparece um túnel, e a partir da pista 3 uma ponte. Depois da pista 20 os cenários se repetem com traçados novos.

## Para crianças pequenas
- Uma voz fala em português: contagem, "turbo pronto", posição e resultado (dá para desligar).
- A primeira corrida mostra uma mãozinha apontando cada botão.
- Dificuldade pensada para crianças: sobe um pouco a cada pista, desde a primeira, e tem um limite.
- Desvio no turbo (liga e desliga na garagem, começa desligado): durante o turbo, do botão ou da faixa azul, se a criança não estiver virando, o carro desvia sozinho das placas. Fora do turbo, quem vira é a criança.
- Os adversários não tentam bater nos primeiros 8 segundos, e até a pista 4 a batida deles só empurra.
- Quem está muito na frente diminui um pouco a velocidade.
- Música e comemoração com confete e fogos no pódio.

## Técnico
- Um único `index.html` com [Three.js](https://threejs.org/) r128. Não precisa de build.
- `manifest.webmanifest` + `sw.js`: dá para instalar como app e jogar sem internet.
- A qualidade gráfica baixa sozinha se o celular não aguentar (tira as sombras e depois reduz a resolução).
- O progresso fica salvo no próprio aparelho (`localStorage`).
- Abrir com `#teste` no fim do endereço expõe `window.__tk` para testes automatizados.
