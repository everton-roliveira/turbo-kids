// Turbo Kids · Carro Cometa nº 21 (Hipercarro inglês).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
export default {
  id:'flecha',
  modelo:{nome:'Flecha',sub:'Hipercarro inglês',cor:'#ff7a00',
    corpo:[[-2.3,.88,.28,.82,3],[-1.95,.97,.2,.88,3.4],[-1.4,1.0,.2,.9,3.4],[-.7,.94,.2,.82,3.2],[.2,.94,.2,.78,3.2],[.95,.98,.2,.72,3.4],[1.6,.95,.2,.6,3.2],[2.05,.86,.2,.48,3],[2.35,.7,.22,.38,2.6]],
    cabine:[[-1.9,.3,.92,2.6],[-1.3,.55,1.06,2.8],[-.6,.66,1.16,2.8],[.1,.67,1.17,2.8],[.7,.6,1.0,2.8],[1.15,.44,.78,2.8]],
    teto:[-.5,.3],vidroLat:[-.4,.75],rodas:{f:1.38,t:-1.38},asa:{z:-2.1,y:.98,larg:1.7,corda:.3},farol:'fino',lanterna:'faixa',escape:[[-.18,.62],[.18,.62]],aro:'#3a3d44',pinca:'#d6d9de'},
  personagem:{nome:'Cometa',num:21,olho:'#8a5a2b',garagem:{parede:'#14234a',fundo:0x060b1c,piso:0x161d30,anel:0xff7a00,destaque:'#ff9d2e',luz:0xd9e4ff,itens:['cone','cone','pneus','cone','cone','pneus','cone','cone']}},
  buzina:[523,659],
  preco:9000,
};
