// Turbo Kids · Carro Floco nº 24 (Carro de corrida de 24 horas).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz).
export default {
  id:'proto',
  modelo:{nome:'Protótipo',sub:'Carro de corrida de 24 horas',cor:'#f2f2f2',
    corpo:[[-2.45,.95,.24,.72,4],[-1.9,1.0,.18,.8,4],[-1.35,1.03,.18,.86,3.5],[-.7,.86,.18,.66,3],[.3,.84,.18,.62,3],[1.15,1.02,.18,.82,3],[1.75,1.0,.16,.62,3.2],[2.25,.97,.14,.36,4],[2.45,.95,.13,.26,5]],
    cabine:[[-1.7,.22,.78,2.4],[-1.0,.44,1.0,2.4],[-.3,.52,1.1,2.4],[.35,.5,1.04,2.4],[.85,.38,.82,2.4],[1.1,.26,.7,2.4]],
    teto:[-.6,.2],vidroLat:[-.5,.5],rodas:{f:1.5,t:-1.5},asa:{z:-2.2,y:1.0,larg:2.0,corda:.42},aleta:true,farol:'fino',lanterna:'barra',escape:[[0,.5]],aro:'#2a2c31',pinca:'#ffd000'},
  personagem:{nome:'Floco',num:24,olho:'#1fb6c9',garagem:{parede:'#0b0f16',fundo:0x020306,piso:0x10141b,anel:0x19e0d0,destaque:'#19e0d0',luz:0xd6fbff,itens:['cone','pneus','cone','bandeira','cone','pneus','cone','bandeira']}},
  buzina:[587,740],
};
