// Turbo Kids · Carro Sirene nº 193 (Caminhão de bombeiro).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
// escada no teto do caminhão
const escada=[['caixa',.06,.06,3.2,-.38,1.72,-.85,'cromo'],['caixa',.06,.06,3.2,.38,1.72,-.85,'cromo'],
  ...[0,1,2,3,4,5,6,7,8].map(k=>['caixa',.76,.04,.05,0,1.72,-2.3+k*.36,'cromo'])];

export default {
  id:'sirene',
  modelo:{nome:'Bombeiro',sub:'Caminhão de bombeiro',cor:'#e3120b',
    corpo:[[-2.6,.94,.28,1.5,8],[-2.5,.98,.22,1.6,8],[-1,.99,.22,1.62,8],[.5,.99,.22,1.62,8],[.85,.99,.22,1.6,8],[.95,.99,.22,1.2,8],[1.5,.99,.22,1.15,8],[2.2,.98,.22,1.1,8],[2.5,.94,.25,1.0,7]],
    cabine:[[.95,.92,1.95,7],[1.2,.95,2.0,7],[1.5,.95,2.0,7],[1.8,.94,1.8,6],[2.05,.9,1.42,5],[2.2,.88,1.2,5]],
    teto:[.95,1.45],vidroLat:[1.0,1.9],janela:[0.05,0.6],rodas:{f:1.75,t:-1.55},farol:'frente',lanterna:'barra',escape:[[.6,.35]],aro:'#d6d9de',pinca:'#d6d9de',
    extras:[...escada,['caixa',.9,.06,.26,0,2.02,1.25,'carbono'],['caixa',.34,.14,.22,-.28,2.11,1.25,'luzA'],['caixa',.34,.14,.22,.28,2.11,1.25,'luzB'],
      ['caixa',.02,.1,3.4,-1.0,.85,-.75,'branco'],['caixa',.02,.1,3.4,1.0,.85,-.75,'branco']]},
  personagem:{nome:'Sirene',num:193,olho:'#2f7fe0',garagem:{parede:'#7a1010',fundo:0x200606,piso:0x3a3a3a,anel:0xe3120b,destaque:'#ffd000',luz:0xffe0d0,itens:['cone','barril','cone','pneus','cone','barril','cone','bandeira']}},
  buzina:[196,247],
  preco:8000,
};
