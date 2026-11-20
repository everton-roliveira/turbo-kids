// Turbo Kids · Carro Amarelinho nº 8 (Ônibus escolar).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
export default {
  id:'onibus',
  modelo:{nome:'Ônibus escolar',sub:'Ônibus escolar',cor:'#f5c400',
    corpo:[[-2.9,.94,.3,1.05,8],[-2.8,.98,.24,1.1,8],[-1,.98,.24,1.1,8],[1.6,.98,.24,1.1,8],[2.3,.97,.24,1.0,8],[2.6,.93,.27,.92,7]],
    cabine:[[-2.85,.92,2.05,8],[-2.6,.96,2.2,8],[-.5,.96,2.2,8],[1.4,.96,2.2,8],[1.7,.95,2.02,7],[1.95,.92,1.62,6],[2.12,.9,1.2,5]],
    teto:[-2.6,1.4],vidroLat:[-2.5,1.7],janela:[0.05,0.6],rodas:{f:1.9,t:-1.9},farol:'frente',lanterna:'redonda',escape:[[.6,.35]],aro:'#2a2c31',pinca:'#2a2c31',
    extras:[['caixa',.02,.07,4.9,-.99,1.0,-.4,'preto'],['caixa',.02,.07,4.9,.99,1.0,-.4,'preto'],['caixa',.02,.07,4.9,-.99,.62,-.4,'preto'],['caixa',.02,.07,4.9,.99,.62,-.4,'preto']]},
  personagem:{nome:'Amarelinho',num:8,olho:'#8a5a2b',garagem:{parede:'#8a6a10',fundo:0x2a2006,piso:0x3b3324,anel:0xf5c400,destaque:'#1b1b1f',luz:0xfff2cc,itens:['caixa','caixa','cone','caixa','bandeira','caixa','cone','caixa']}},
  buzina:[262,330],
  preco:5000,
};
