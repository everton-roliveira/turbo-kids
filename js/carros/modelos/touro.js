// Turbo Kids · Carro Trovão nº 33 (Superesportivo bravo).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
export default {
  id:'touro',
  modelo:{nome:'Touro',sub:'Superesportivo bravo',cor:'#9ccf00',
    corpo:[[-2.3,.93,.26,.84,6],[-1.7,1.02,.2,.88,6],[-1.0,.99,.2,.86,6],[-.2,.97,.2,.8,6],[.7,.99,.2,.7,6],[1.4,.98,.2,.58,6],[1.95,.92,.2,.46,5.5],[2.35,.82,.2,.34,5]],
    cabine:[[-1.6,.48,.96,6],[-1.0,.62,1.1,5],[-.4,.66,1.13,5],[.3,.62,1.0,5],[.9,.52,.8,5],[1.25,.42,.68,5]],
    teto:[-.85,.1],vidroLat:[-.6,.6],rodas:{f:1.35,t:-1.4},asa:{z:-2.0,y:1.1,larg:1.9,corda:.36},farol:'fino',lanterna:'faixa',entrada:true,escape:[[-.12,.34],[.12,.34]],aro:'#2a2c31',pinca:'#ffd000'},
  personagem:{nome:'Trovão',num:33,olho:'#3aa64a',garagem:{parede:'#26381a',fundo:0x0c1408,piso:0x1f2618,anel:0x9ccf00,destaque:'#ffd000',luz:0xf0ffd4,itens:['barril','pneus','barril','barril','pneus','barril','pneus','barril']}},
  buzina:[330,415],
  preco:7000,
};
