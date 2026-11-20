// Turbo Kids · Carro Tornado nº 12 (Muscle car de corrida).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
export default {
  id:'v8',
  modelo:{nome:'V8 Americano',sub:'Muscle car de corrida',cor:'#1e5bd8',
    corpo:[[-2.35,.92,.28,.88,4.5],[-1.85,.98,.22,.94,4.5],[-1.3,1.0,.22,.96,4.5],[-.4,.96,.22,.92,4.5],[.6,.95,.22,.88,4.5],[1.45,.97,.22,.86,4.5],[2.05,.95,.22,.82,4.5],[2.38,.88,.26,.7,4]],
    cabine:[[-1.95,.55,1.0,3.5],[-1.4,.66,1.2,3.5],[-.75,.7,1.32,3.5],[-.15,.7,1.32,3.5],[.4,.64,1.08,3.5],[.7,.52,.95,3.5]],
    teto:[-1.0,0],vidroLat:[-1.0,.25],rodas:{f:1.45,t:-1.35},asa:{z:-2.15,y:1.0,larg:1.7,corda:.24,baixa:true},farol:'frente',lanterna:'faixa',capo:true,escape:[[-.6,.3],[-.45,.3],[.45,.3],[.6,.3]],aro:'#d6d9de',pinca:'#e3120b'},
  personagem:{nome:'Tornado',num:12,olho:'#2a6fdb',garagem:{parede:'#7a3424',fundo:0x24100a,piso:0x2c3037,anel:0x1e5bd8,destaque:'#f2f2f2',luz:0xffe9cf,itens:['pneus','barril','pneus','bandeira','barril','pneus','barril','pneus']}},
  buzina:[220,277],
  preco:3000,
};
