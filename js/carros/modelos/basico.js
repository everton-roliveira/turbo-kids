// Turbo Kids · Carro Pipoca nº 1 (Carrinho compacto). É o carro que vem liberado; os outros são comprados na garagem.
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz).
export default {
  id:'basico',
  modelo:{nome:'Pipoca',sub:'Carrinho compacto',cor:'#3bb4f2',
    corpo:[[-1.75,.86,.3,.82,3],[-1.6,.92,.24,.88,3.2],[-1.0,.93,.22,.9,3.2],[0,.92,.22,.86,3],[.9,.92,.22,.8,3],[1.45,.9,.24,.72,3],[1.8,.84,.3,.6,2.8]],
    cabine:[[-1.65,.72,1.42,3],[-1.2,.8,1.58,3],[-.3,.82,1.6,3],[.35,.8,1.54,3],[.85,.68,1.15,3],[1.05,.58,.92,3]],
    teto:[-1.45,.35],vidroLat:[-1.3,.7],rodas:{f:1.2,t:-1.15},farol:'redondo',lanterna:'redonda',escape:[[.4,.3]],aro:'#d6d9de',pinca:'#d6d9de'},
  personagem:{nome:'Pipoca',num:1,olho:'#8a5a2b',garagem:{parede:'#2a5a7a',fundo:0x0a1824,piso:0x23303a,anel:0x3bb4f2,destaque:'#ffd23f',luz:0xe6f4ff,itens:['caixa','pneus','caixa','cone','caixa','pneus','bandeira','caixa']}},
  buzina:[587,784],
};
