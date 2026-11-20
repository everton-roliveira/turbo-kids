// Turbo Kids · Carro Rubi nº 7 (Supercarro italiano).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
export default {
  id:'rosso',
  modelo:{nome:'Rosso',sub:'Supercarro italiano',cor:'#d40000',
    corpo:[[-2.28,.86,.30,.80,3.2],[-2.05,.96,.22,.88,4],[-1.45,1.0,.2,.93,4],[-.75,.95,.2,.88,4],[.1,.94,.2,.84,4],[.9,.98,.2,.76,4],[1.45,.97,.2,.68,3.8],[1.95,.9,.2,.56,3.4],[2.3,.74,.24,.42,2.8]],
    cabine:[[-1.55,.5,.98,3],[-.95,.64,1.13,3],[-.35,.69,1.2,3],[.25,.69,1.17,3],[.8,.62,.98,3],[1.2,.5,.8,3]],
    teto:[-.75,.4],vidroLat:[-.55,.75],rodas:{f:1.36,t:-1.42},farol:'fino',lanterna:'redonda',entrada:true,escape:[[-.22,.32],[.22,.32]],aro:'#d6d9de',pinca:'#ffd000'},
  personagem:{nome:'Rubi',num:7,olho:'#2f7fe0',garagem:{parede:'#5a1414',fundo:0x1e0808,piso:0x2b1717,anel:0xe3120b,destaque:'#ffd000',luz:0xffe2cc,itens:['pneus','bandeira','caixa','pneus','bandeira','pneus','caixa','bandeira']}},
  buzina:[440,554],
  preco:5500,
};
