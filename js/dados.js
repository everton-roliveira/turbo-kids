// Turbo Kids · Funções básicas, carros, progresso salvo, cenários (TEMAS), dificuldade e oficina.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';
const $=s=>document.querySelector(s);
const mod=(a,n)=>((a%n)+n)%n;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const reduzMov=matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!window.THREE){document.body.insertAdjacentHTML('beforeend','<div class="tela"><div class="cartao"><h2>Ops!</h2><p>O jogo não carregou. Verifique a internet e abra de novo.</p></div></div>');throw new Error('Three.js não carregou');}
const lin=h=>new THREE.Color(h).convertSRGBToLinear();

/* ================= Carros (estilos inspirados em carros de corrida famosos, sem marcas) ================= */
/* corpo: [z, meia-largura, base, topo, curvatura]   cabine: [z, meia-largura, topo, curvatura]   frente do carro = +z */
const MODELOS={
  rosso:{nome:'Rosso',sub:'Supercarro italiano',cor:'#d40000',
    corpo:[[-2.28,.86,.30,.80,3.2],[-2.05,.96,.22,.88,4],[-1.45,1.0,.2,.93,4],[-.75,.95,.2,.88,4],[.1,.94,.2,.84,4],[.9,.98,.2,.76,4],[1.45,.97,.2,.68,3.8],[1.95,.9,.2,.56,3.4],[2.3,.74,.24,.42,2.8]],
    cabine:[[-1.55,.5,.98,3],[-.95,.64,1.13,3],[-.35,.69,1.2,3],[.25,.69,1.17,3],[.8,.62,.98,3],[1.2,.5,.8,3]],
    teto:[-.75,.4],vidroLat:[-.55,.75],rodas:{f:1.36,t:-1.42},farol:'fino',lanterna:'redonda',entrada:true,escape:[[-.22,.32],[.22,.32]],aro:'#d6d9de',pinca:'#ffd000'},
  touro:{nome:'Touro',sub:'Superesportivo bravo',cor:'#9ccf00',
    corpo:[[-2.3,.93,.26,.84,6],[-1.7,1.02,.2,.88,6],[-1.0,.99,.2,.86,6],[-.2,.97,.2,.8,6],[.7,.99,.2,.7,6],[1.4,.98,.2,.58,6],[1.95,.92,.2,.46,5.5],[2.35,.82,.2,.34,5]],
    cabine:[[-1.6,.48,.96,6],[-1.0,.62,1.1,5],[-.4,.66,1.13,5],[.3,.62,1.0,5],[.9,.52,.8,5],[1.25,.42,.68,5]],
    teto:[-.85,.1],vidroLat:[-.6,.6],rodas:{f:1.35,t:-1.4},asa:{z:-2.0,y:1.1,larg:1.9,corda:.36},farol:'fino',lanterna:'faixa',entrada:true,escape:[[-.12,.34],[.12,.34]],aro:'#2a2c31',pinca:'#ffd000'},
  flecha:{nome:'Flecha',sub:'Hipercarro inglês',cor:'#ff7a00',
    corpo:[[-2.3,.88,.28,.82,3],[-1.95,.97,.2,.88,3.4],[-1.4,1.0,.2,.9,3.4],[-.7,.94,.2,.82,3.2],[.2,.94,.2,.78,3.2],[.95,.98,.2,.72,3.4],[1.6,.95,.2,.6,3.2],[2.05,.86,.2,.48,3],[2.35,.7,.22,.38,2.6]],
    cabine:[[-1.9,.3,.92,2.6],[-1.3,.55,1.06,2.8],[-.6,.66,1.16,2.8],[.1,.67,1.17,2.8],[.7,.6,1.0,2.8],[1.15,.44,.78,2.8]],
    teto:[-.5,.3],vidroLat:[-.4,.75],rodas:{f:1.38,t:-1.38},asa:{z:-2.1,y:.98,larg:1.7,corda:.3},farol:'fino',lanterna:'faixa',escape:[[-.18,.62],[.18,.62]],aro:'#3a3d44',pinca:'#d6d9de'},
  gt:{nome:'GT Corrida',sub:'Esportivo alemão de pista',cor:'#a9b0b8',
    corpo:[[-2.25,.84,.28,.84,3],[-1.95,.97,.22,.9,3.2],[-1.4,1.0,.22,.93,3.2],[-.7,.92,.22,.87,3],[.3,.91,.22,.82,3],[1.1,.95,.22,.78,3],[1.7,.92,.22,.68,3],[2.1,.82,.24,.55,2.6],[2.25,.66,.28,.46,2.4]],
    cabine:[[-2.05,.5,.9,2.6],[-1.4,.6,1.08,2.6],[-.7,.66,1.27,2.6],[-.1,.67,1.3,2.6],[.45,.64,1.17,2.6],[.95,.55,.88,2.6]],
    teto:[-.75,.3],vidroLat:[-.6,.5],rodas:{f:1.3,t:-1.25},asa:{z:-1.85,y:1.4,larg:1.8,corda:.4},farol:'redondo',lanterna:'barra',escape:[[-.1,.3],[.1,.3]],aro:'#2a2c31',pinca:'#e3120b'},
  v8:{nome:'V8 Americano',sub:'Muscle car de corrida',cor:'#1e5bd8',
    corpo:[[-2.35,.92,.28,.88,4.5],[-1.85,.98,.22,.94,4.5],[-1.3,1.0,.22,.96,4.5],[-.4,.96,.22,.92,4.5],[.6,.95,.22,.88,4.5],[1.45,.97,.22,.86,4.5],[2.05,.95,.22,.82,4.5],[2.38,.88,.26,.7,4]],
    cabine:[[-1.95,.55,1.0,3.5],[-1.4,.66,1.2,3.5],[-.75,.7,1.32,3.5],[-.15,.7,1.32,3.5],[.4,.64,1.08,3.5],[.7,.52,.95,3.5]],
    teto:[-1.0,0],vidroLat:[-1.0,.25],rodas:{f:1.45,t:-1.35},asa:{z:-2.15,y:1.0,larg:1.7,corda:.24,baixa:true},farol:'frente',lanterna:'faixa',capo:true,escape:[[-.6,.3],[-.45,.3],[.45,.3],[.6,.3]],aro:'#d6d9de',pinca:'#e3120b'},
  proto:{nome:'Protótipo',sub:'Carro de corrida de 24 horas',cor:'#f2f2f2',
    corpo:[[-2.45,.95,.24,.72,4],[-1.9,1.0,.18,.8,4],[-1.35,1.03,.18,.86,3.5],[-.7,.86,.18,.66,3],[.3,.84,.18,.62,3],[1.15,1.02,.18,.82,3],[1.75,1.0,.16,.62,3.2],[2.25,.97,.14,.36,4],[2.45,.95,.13,.26,5]],
    cabine:[[-1.7,.22,.78,2.4],[-1.0,.44,1.0,2.4],[-.3,.52,1.1,2.4],[.35,.5,1.04,2.4],[.85,.38,.82,2.4],[1.1,.26,.7,2.4]],
    teto:[-.6,.2],vidroLat:[-.5,.5],rodas:{f:1.5,t:-1.5},asa:{z:-2.2,y:1.0,larg:2.0,corda:.42},aleta:true,farol:'fino',lanterna:'barra',escape:[[0,.5]],aro:'#2a2c31',pinca:'#ffd000'},
};
/* carros para comprar com moedas: extras = peças a mais [tipo, largura, altura, comprimento, x, y, z, material]
   (material: tinta, carbono, cromo, branco, preto, luzA/luzB = sirene que pisca) */
const escada=[['caixa',.06,.06,3.2,-.38,1.72,-.85,'cromo'],['caixa',.06,.06,3.2,.38,1.72,-.85,'cromo'],
  ...[0,1,2,3,4,5,6,7,8].map(k=>['caixa',.76,.04,.05,0,1.72,-2.3+k*.36,'cromo'])];
Object.assign(MODELOS,{
  patrulha:Object.assign({},MODELOS.v8,{nome:'Patrulha',sub:'Carro de polícia',cor:'#1f3fb8',asa:null,capo:false,escape:[[-.5,.3]],
    cabine:MODELOS.v8.cabine.map(([z,w,t,n])=>[z,w,t+.06,n]),aro:'#d6d9de',pinca:'#2a2c31',
    extras:[['caixa',1.0,.08,.32,0,1.42,-.45,'carbono'],['caixa',.42,.14,.26,-.25,1.52,-.45,'luzA'],['caixa',.42,.14,.26,.25,1.52,-.45,'luzB']]}),
  onibus:{nome:'Ônibus escolar',sub:'Ônibus escolar',cor:'#f5c400',
    corpo:[[-2.9,.94,.3,1.05,8],[-2.8,.98,.24,1.1,8],[-1,.98,.24,1.1,8],[1.6,.98,.24,1.1,8],[2.3,.97,.24,1.0,8],[2.6,.93,.27,.92,7]],
    cabine:[[-2.85,.92,2.05,8],[-2.6,.96,2.2,8],[-.5,.96,2.2,8],[1.4,.96,2.2,8],[1.7,.95,2.02,7],[1.95,.92,1.62,6],[2.12,.9,1.2,5]],
    teto:[-2.6,1.4],vidroLat:[-2.5,1.7],janela:[0.05,0.6],rodas:{f:1.9,t:-1.9},farol:'frente',lanterna:'redonda',escape:[[.6,.35]],aro:'#2a2c31',pinca:'#2a2c31',
    extras:[['caixa',.02,.07,4.9,-.99,1.0,-.4,'preto'],['caixa',.02,.07,4.9,.99,1.0,-.4,'preto'],['caixa',.02,.07,4.9,-.99,.62,-.4,'preto'],['caixa',.02,.07,4.9,.99,.62,-.4,'preto']]},
  sirene:{nome:'Bombeiro',sub:'Caminhão de bombeiro',cor:'#e3120b',
    corpo:[[-2.6,.94,.28,1.5,8],[-2.5,.98,.22,1.6,8],[-1,.99,.22,1.62,8],[.5,.99,.22,1.62,8],[.85,.99,.22,1.6,8],[.95,.99,.22,1.2,8],[1.5,.99,.22,1.15,8],[2.2,.98,.22,1.1,8],[2.5,.94,.25,1.0,7]],
    cabine:[[.95,.92,1.95,7],[1.2,.95,2.0,7],[1.5,.95,2.0,7],[1.8,.94,1.8,6],[2.05,.9,1.42,5],[2.2,.88,1.2,5]],
    teto:[.95,1.45],vidroLat:[1.0,1.9],janela:[0.05,0.6],rodas:{f:1.75,t:-1.55},farol:'frente',lanterna:'barra',escape:[[.6,.35]],aro:'#d6d9de',pinca:'#d6d9de',
    extras:[...escada,['caixa',.9,.06,.26,0,2.02,1.25,'carbono'],['caixa',.34,.14,.22,-.28,2.11,1.25,'luzA'],['caixa',.34,.14,.22,.28,2.11,1.25,'luzB'],
      ['caixa',.02,.1,3.4,-1.0,.85,-.75,'branco'],['caixa',.02,.1,3.4,1.0,.85,-.75,'branco']]},
  jipe:{nome:'Jipe',sub:'Jipe de aventura',cor:'#4f7a2a',rodaEsc:1.25,
    corpo:[[-2.0,.9,.5,1.08,7],[-1.9,.96,.45,1.12,7],[-.5,.96,.45,1.12,7],[.5,.96,.45,1.12,7],[1.6,.95,.45,1.05,7],[2.05,.9,.5,.95,6]],
    cabine:[[-1.85,.9,1.85,6],[-1.5,.92,1.9,6],[-.4,.92,1.9,6],[.2,.92,1.9,6],[.45,.91,1.72,5],[.72,.9,1.25,5]],
    teto:[-1.8,.25],vidroLat:[-1.4,.45],janela:[0.05,0.6],rodas:{f:1.35,t:-1.3},farol:'redondo',lanterna:'redonda',escape:[[.55,.55]],aro:'#2a2c31',pinca:'#ff9d2e',
    extras:[['estepe',0,0,0,0,1.0,-2.22,'pneu'],['caixa',1.3,.08,.08,0,.78,2.14,'cromo'],['caixa',.08,.42,.08,-.45,.72,2.14,'cromo'],['caixa',.08,.42,.08,.45,.72,2.14,'cromo'],
      ['caixa',1.3,.06,.1,0,1.95,.1,'carbono']]},
});
const ORDEM_MODELOS=['rosso','touro','flecha','gt','v8','proto','patrulha','onibus','sirene','jipe'];
// preço dos carros que não vêm liberados
const PRECO_CARRO={patrulha:600,onibus:900,sirene:1200,jipe:1500};
const carroLiberado=id=>!PRECO_CARRO[id]||save.carros.includes(id);
/* personagens do Turbo Kids: nome, número, cor dos olhos e a garagem de cada um */
const PERSONAGENS={
  rosso:{nome:'Rubi',num:7,olho:'#2f7fe0',garagem:{parede:'#5a1414',fundo:0x1e0808,piso:0x2b1717,anel:0xe3120b,destaque:'#ffd000',luz:0xffe2cc,itens:['pneus','bandeira','caixa','pneus','bandeira','pneus','caixa','bandeira']}},
  touro:{nome:'Trovão',num:33,olho:'#3aa64a',garagem:{parede:'#26381a',fundo:0x0c1408,piso:0x1f2618,anel:0x9ccf00,destaque:'#ffd000',luz:0xf0ffd4,itens:['barril','pneus','barril','barril','pneus','barril','pneus','barril']}},
  flecha:{nome:'Cometa',num:21,olho:'#8a5a2b',garagem:{parede:'#14234a',fundo:0x060b1c,piso:0x161d30,anel:0xff7a00,destaque:'#ff9d2e',luz:0xd9e4ff,itens:['cone','cone','pneus','cone','cone','pneus','cone','cone']}},
  gt:{nome:'Barão',num:4,olho:'#4f6478',garagem:{parede:'#d8dce2',fundo:0x9aa1ab,piso:0xb9bec6,anel:0x2a2c31,destaque:'#e3120b',luz:0xffffff,itens:['caixa','pneus','caixa','caixa','pneus','caixa','bandeira','caixa']}},
  v8:{nome:'Tornado',num:12,olho:'#2a6fdb',garagem:{parede:'#7a3424',fundo:0x24100a,piso:0x2c3037,anel:0x1e5bd8,destaque:'#f2f2f2',luz:0xffe9cf,itens:['pneus','barril','pneus','bandeira','barril','pneus','barril','pneus']}},
  patrulha:{nome:'Patrulha',num:190,olho:'#3a6fd8',garagem:{parede:'#1a2a55',fundo:0x070c1c,piso:0x1d2433,anel:0x2a4fd0,destaque:'#f2f2f2',luz:0xdde6ff,itens:['cone','cone','caixa','cone','bandeira','cone','caixa','cone']}},
  onibus:{nome:'Amarelinho',num:8,olho:'#8a5a2b',garagem:{parede:'#8a6a10',fundo:0x2a2006,piso:0x3b3324,anel:0xf5c400,destaque:'#1b1b1f',luz:0xfff2cc,itens:['caixa','caixa','cone','caixa','bandeira','caixa','cone','caixa']}},
  sirene:{nome:'Sirene',num:193,olho:'#2f7fe0',garagem:{parede:'#7a1010',fundo:0x200606,piso:0x3a3a3a,anel:0xe3120b,destaque:'#ffd000',luz:0xffe0d0,itens:['cone','barril','cone','pneus','cone','barril','cone','bandeira']}},
  jipe:{nome:'Trilha',num:44,olho:'#3aa64a',garagem:{parede:'#4a3a24',fundo:0x140e06,piso:0x3a2c1c,anel:0x4f7a2a,destaque:'#ff9d2e',luz:0xffe8c8,itens:['pneus','barril','pneus','pneus','barril','pneus','bandeira','barril']}},
  proto:{nome:'Floco',num:24,olho:'#1fb6c9',garagem:{parede:'#0b0f16',fundo:0x020306,piso:0x10141b,anel:0x19e0d0,destaque:'#19e0d0',luz:0xd6fbff,itens:['cone','pneus','cone','bandeira','cone','pneus','cone','bandeira']}},
};

/* ================= Progresso salvo ================= */
const CHAVE='corrida-turbo-v1';
const PADRAO=()=>({moedas:0,nivel:1,cor:'#d40000',modelo:'rosso',up:{motor:0,acel:0,amort:0,pneu:0},auto:false,som:true,
  musica:true,voz:true,desvioTurbo:false,tutorial:false,adesivo:'nenhum',aro:null,nome:'',inclinar:false,trofeus:{},qualidade:null,rosto:true,carros:[]});
let save=PADRAO();
try{const s=JSON.parse(localStorage.getItem(CHAVE)||'null');if(s){save=Object.assign(PADRAO(),s);save.up=Object.assign(PADRAO().up,s.up||{});
  if(!save.trofeus||typeof save.trofeus!=='object')save.trofeus={};}}catch(e){}
if(!Array.isArray(save.carros))save.carros=[];
if(!MODELOS[save.modelo]||!carroLiberado(save.modelo))save.modelo='rosso';
function salvar(){try{localStorage.setItem(CHAVE,JSON.stringify(save));}catch(e){}}

const CORES=[['#d40000','Vermelho'],['#f5c400','Amarelo'],['#ff7300','Laranja'],['#9ccf00','Verde-limão'],['#10a050','Verde'],['#1e5bd8','Azul'],['#19a7e0','Azul claro'],
  ['#ff4fa3','Rosa'],['#7d3cc8','Roxo'],['#1b1b1f','Preto'],['#f2f2f2','Branco'],['#a9b0b8','Prata']];
const CORES_EXTRA=['#f5c400','#10a050','#19a7e0','#ff4fa3','#7d3cc8','#1b1b1f','#d40000','#ff7300'];
const MELHORIAS=[
  {id:'motor',nome:'Motor',ico:'🔥',txt:'Mais velocidade'},
  {id:'acel',nome:'Aceleração',ico:'⚡',txt:'Arranca mais rápido'},
  {id:'amort',nome:'Amortecedor',ico:'🔧',txt:'Buraco atrapalha menos'},
  {id:'pneu',nome:'Pneus',ico:'🎯',txt:'Vira mais rápido'},
];
const PRECOS=[200,400,700,1100,1600], MAX_UP=5;
const PREMIO=[500,300,200,100,60,30];
const TEMAS=[
  {nome:'Campo Verde',musica:'aventura',ico:'🌳',ceu:0x8ccfff,ceuTopo:0x3f8fe0,nevoa:0xcfeaff,chao:0x4fa64a,arvore:0x2f7d32,tronco:0x6b4a2b,luz:1.0,veg:'arvore'},
  {nome:'Praia',musica:'tropical',ico:'🏖️',ceu:0x9fdcff,ceuTopo:0x2f8be0,nevoa:0xd9f1ff,chao:0xe6cf94,arvore:0x2e8b3a,tronco:0x8a6a3e,luz:1.08,veg:'palmeira',mar:true},
  {nome:'Deserto',musica:'deserto',ico:'🌵',ceu:0xffd9a0,ceuTopo:0x5aa0e8,nevoa:0xffe9c7,chao:0xd9b06a,arvore:0x4f8a3a,tronco:0x7a5a33,luz:1.05,veg:'cacto'},
  {nome:'Cidade',musica:'funk',ico:'🏙️',ceu:0xa9d4f5,ceuTopo:0x4b88cc,nevoa:0xd6e4ef,chao:0x6f7377,arvore:0x2f7d32,tronco:0x6b4a2b,luz:1.0,veg:'predio'},
  {nome:'Neve',musica:'inverno',ico:'⛄',ceu:0xcfe3f5,ceuTopo:0x7aa6d6,nevoa:0xeef5fb,chao:0xf2f6fa,arvore:0x1f5e3a,tronco:0x5a4030,luz:0.9,veg:'arvore'},
  {nome:'Noite',musica:'noturna',ico:'🌙',ceu:0x0c1430,ceuTopo:0x04081a,nevoa:0x16204a,chao:0x1f3d2b,arvore:0x123c22,tronco:0x3d2a1c,luz:0.55,noite:true,veg:'arvore'},
  {nome:'Terra dos Doces',musica:'caixinha',ico:'🍭',ceu:0xffd9f2,ceuTopo:0x8fb8ff,nevoa:0xffe6f6,chao:0xf090c4,arvore:0xff7ab8,tronco:0xf5f5f5,luz:1.05,veg:'doce'},
  {nome:'Vale dos Dinossauros',musica:'tribal',ico:'🦕',ceu:0xa8d8ff,ceuTopo:0x4a90d9,nevoa:0xd6ecd2,chao:0x6a9a3a,arvore:0x2d6e2a,tronco:0x6b4a2b,luz:1.0,veg:'dino'},
  {nome:'Lua',musica:'espaco',ico:'🌕',ceu:0x05060f,ceuTopo:0x000000,nevoa:0x0b0d1c,chao:0x8c8c94,arvore:0x777780,tronco:0x555560,luz:0.95,veg:'lua',gravidade:0.55},
  {nome:'Fazenda',musica:'country',ico:'🚜',ceu:0x9fd6ff,ceuTopo:0x3d8ae0,nevoa:0xdff0ff,chao:0x7cbf4a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,veg:'fazenda'},
  {nome:'Reino Encantado',musica:'fantasia',ico:'🏰',ceu:0xd9c8ff,ceuTopo:0x7a6ae0,nevoa:0xece4ff,chao:0x8fd47a,arvore:0xff9ad5,tronco:0x7a5236,luz:1.0,veg:'castelo'},
  {nome:'Ilha dos Piratas',musica:'pirata',ico:'🏴‍☠️',ceu:0x8fd8ff,ceuTopo:0x2a86d9,nevoa:0xd5f0ff,chao:0xe8d39a,arvore:0x2e8b3a,tronco:0x8a6a3e,luz:1.08,veg:'pirata',mar:true},
  {nome:'Floresta dos Cogumelos',musica:'travessa',ico:'🍄',ceu:0xc9f0d8,ceuTopo:0x5fb08a,nevoa:0xe2f7e8,chao:0x5aa84a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,veg:'cogumelo'},
  {nome:'Polo Sul',musica:'gelo',ico:'🐧',ceu:0xbfe2ff,ceuTopo:0x5a9de0,nevoa:0xeef7ff,chao:0xf4f8fc,arvore:0x1f5e3a,tronco:0x5a4030,luz:0.92,veg:'polo'},
  {nome:'Canteiro de Obras',musica:'rock',ico:'🏗️',ceu:0xb9dcf5,ceuTopo:0x4f8fd0,nevoa:0xe4eef5,chao:0xb08a5a,arvore:0x2f7d32,tronco:0x6b4a2b,luz:1.0,veg:'obra'},
  {nome:'Parque de Diversões',musica:'circo',ico:'🎡',ceu:0xffe0b8,ceuTopo:0x6a7fe0,nevoa:0xffe9d1,chao:0x7cc45a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,veg:'parque'},
  {nome:'Fundo do Mar',musica:'aquatica',ico:'🐠',ceu:0x1f7fc0,ceuTopo:0x0b3f78,nevoa:0x3a9ad6,chao:0xe6d39a,arvore:0x2f9a4a,tronco:0x6b4a2b,luz:0.85,veg:'fundo'},
  {nome:'Safári',musica:'savana',ico:'🦒',ceu:0xffe0a0,ceuTopo:0x5aa0e8,nevoa:0xffe9c0,chao:0xd8b060,arvore:0x5f8a2a,tronco:0x6b4a2b,luz:1.05,veg:'safari'},
  {nome:'Cidade do Futuro',musica:'synth',ico:'🛸',ceu:0x2a1a5e,ceuTopo:0x0a0620,nevoa:0x3a2a70,chao:0x2a2c44,arvore:0x19e0d0,tronco:0x555560,luz:0.75,veg:'futuro'},
  {nome:'Jardim das Cerejeiras',musica:'oriental',ico:'🌸',ceu:0xcfe8ff,ceuTopo:0x6aa6e8,nevoa:0xf5e6ef,chao:0x8cc46a,arvore:0xffb7d5,tronco:0x6b4a3b,luz:1.0,veg:'cerejeira'},
  {nome:'Quarto de Brinquedos',musica:'brinquedo',ico:'🧸',ceu:0xfff2d6,ceuTopo:0xffd9a0,nevoa:0xfff0dc,chao:0xc9a27a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,veg:'brinquedo'},
  {nome:'Céu das Nuvens',musica:'sonho',ico:'🎈',ceu:0x9fd4ff,ceuTopo:0x3a8ae0,nevoa:0xe6f4ff,chao:0xf2f8ff,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,veg:'nuvem'},
  {nome:'Jardim das Joaninhas',musica:'jardim',ico:'🐞',ceu:0xbfe8ff,ceuTopo:0x5aa8e8,nevoa:0xe4f6e0,chao:0x6fbf4a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,veg:'joaninha'},
  {nome:'Vila do Natal',musica:'natal',ico:'🎄',ceu:0xc8dcf0,ceuTopo:0x6f8fc0,nevoa:0xeef4fa,chao:0xf4f8fc,arvore:0x1f6e35,tronco:0x6b4a2b,luz:0.92,veg:'natal'},
  {nome:'Estação de Trem',musica:'trem',ico:'🚂',ceu:0xa9d8ff,ceuTopo:0x4a8fe0,nevoa:0xdcefff,chao:0x7cbf4a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,veg:'trem'},
];
const temaDoNivel=n=>TEMAS[(n-1)%TEMAS.length];
// pista escolhida no mapa (só as já liberadas; sem escolha = a última liberada)
const pistaAtual=()=>clamp(Math.round(save.pista||save.nivel),1,save.nivel);
const ADESIVOS=[['nenhum','Nenhum'],['raio','⚡ Raio'],['chamas','🔥 Chamas'],['estrelas','⭐ Estrelas'],['listras','🏁 Listras']];
const AROS=[['#d6d9de','Prata'],['#2a2c31','Preto'],['#d4a017','Dourado'],['#f2f2f2','Branco'],['#d40000','Vermelho'],['#1e5bd8','Azul']];
/* cada carro tem sua buzina (duas notas) */
const BUZINAS={rosso:[440,554],touro:[330,415],flecha:[523,659],gt:[392,494],v8:[220,277],proto:[587,740],patrulha:[659,880],onibus:[262,330],sirene:[196,247],jipe:[294,370]};
// 0 na pista 1 e 1 na última: a dificuldade sobe aos poucos por todas as pistas
const progresso=n=>clamp((n-1)/(TEMAS.length-1),0,1);
function paramsNivel(n){const t=progresso(n);return{
  aiVmax:47+21*t,
  iaAcel:13.8+8.2*t,
  buracos:Math.round(4+10*t),
  bloqueios:Math.round(2+7*t),
  drift:0.08+0.2*t,
  agressao:0.11+0.25*t,
  desvio:0.56+0.39*t,
  folga:1-0.3*t,
  voltas:2};}
function statsJogador(){const u=save.up;return{
  vmax:52+u.motor*6, acel:19+u.acel*4, lat:13+u.pneu*1.6, rateLat:8+u.pneu,
  fatorLento:Math.min(0.95,0.68+u.amort*0.06), lentoDur:Math.max(0.4,1.1-u.amort*0.14), perdaBuraco:Math.min(0.95,0.68+u.amort*0.06)};}

