// Turbo Kids · Carro Trilha nº 44 (Jipe de aventura).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
export default {
  id:'jipe',
  modelo:{nome:'Jipe',sub:'Jipe de aventura',cor:'#4f7a2a',rodaEsc:1.25,
    corpo:[[-2.0,.9,.5,1.08,7],[-1.9,.96,.45,1.12,7],[-.5,.96,.45,1.12,7],[.5,.96,.45,1.12,7],[1.6,.95,.45,1.05,7],[2.05,.9,.5,.95,6]],
    cabine:[[-1.85,.9,1.85,6],[-1.5,.92,1.9,6],[-.4,.92,1.9,6],[.2,.92,1.9,6],[.45,.91,1.72,5],[.72,.9,1.25,5]],
    teto:[-1.8,.25],vidroLat:[-1.4,.45],janela:[0.05,0.6],rodas:{f:1.35,t:-1.3},farol:'redondo',lanterna:'redonda',escape:[[.55,.55]],aro:'#2a2c31',pinca:'#ff9d2e',
    extras:[['estepe',0,0,0,0,1.0,-2.22,'pneu'],['caixa',1.3,.08,.08,0,.78,2.14,'cromo'],['caixa',.08,.42,.08,-.45,.72,2.14,'cromo'],['caixa',.08,.42,.08,.45,.72,2.14,'cromo'],
      ['caixa',1.3,.06,.1,0,1.95,.1,'carbono']]},
  personagem:{nome:'Trilha',num:44,olho:'#3aa64a',garagem:{parede:'#4a3a24',fundo:0x140e06,piso:0x3a2c1c,anel:0x4f7a2a,destaque:'#ff9d2e',luz:0xffe8c8,itens:['pneus','barril','pneus','pneus','barril','pneus','bandeira','barril']}},
  buzina:[294,370],
  preco:12000,
};
