// Turbo Kids · Carro Patrulha nº 190 (Carro de polícia).
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// personagem: nome, número, cor dos olhos e a garagem do carro. buzina: duas notas (Hz). preco: moedas para comprar.
import v8 from './v8.js';

// a Patrulha usa a carroceria do Tornado com sirene no teto
export default {
  id:'patrulha',
  modelo:Object.assign({},v8.modelo,{nome:'Patrulha',sub:'Carro de polícia',cor:'#1f3fb8',asa:null,capo:false,escape:[[-.5,.3]],
    cabine:v8.modelo.cabine.map(([z,w,t,n])=>[z,w,t+.06,n]),aro:'#d6d9de',pinca:'#2a2c31',
    extras:[['caixa',1.0,.08,.32,0,1.42,-.45,'carbono'],['caixa',.42,.14,.26,-.25,1.52,-.45,'luzA'],['caixa',.42,.14,.26,.25,1.52,-.45,'luzB']]}),
  personagem:{nome:'Patrulha',num:190,olho:'#3a6fd8',garagem:{parede:'#1a2a55',fundo:0x070c1c,piso:0x1d2433,anel:0x2a4fd0,destaque:'#f2f2f2',luz:0xdde6ff,itens:['cone','cone','caixa','cone','bandeira','cone','caixa','cone']}},
  buzina:[659,880],
  preco:3000,
};
