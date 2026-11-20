// Turbo Kids · Carro Barão nº 4 (Esportivo alemão de pista).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
export default {
  id:'gt',
  modelo:{nome:'GT Corrida',sub:'Esportivo alemão de pista',cor:'#a9b0b8',
    corpo:[[-2.25,.84,.28,.84,3],[-1.95,.97,.22,.9,3.2],[-1.4,1.0,.22,.93,3.2],[-.7,.92,.22,.87,3],[.3,.91,.22,.82,3],[1.1,.95,.22,.78,3],[1.7,.92,.22,.68,3],[2.1,.82,.24,.55,2.6],[2.25,.66,.28,.46,2.4]],
    cabine:[[-2.05,.5,.9,2.6],[-1.4,.6,1.08,2.6],[-.7,.66,1.27,2.6],[-.1,.67,1.3,2.6],[.45,.64,1.17,2.6],[.95,.55,.88,2.6]],
    teto:[-.75,.3],vidroLat:[-.6,.5],rodas:{f:1.3,t:-1.25},asa:{z:-1.85,y:1.4,larg:1.8,corda:.4},farol:'redondo',lanterna:'barra',escape:[[-.1,.3],[.1,.3]],aro:'#2a2c31',pinca:'#e3120b'},
  personagem:{nome:'Barão',num:4,olho:'#4f6478',garagem:{parede:'#d8dce2',fundo:0x9aa1ab,piso:0xb9bec6,anel:0x2a2c31,destaque:'#e3120b',luz:0xffffff,itens:['caixa','pneus','caixa','caixa','pneus','caixa','bandeira','caixa']}},
  buzina:[392,494],
  preco:4000,
};
