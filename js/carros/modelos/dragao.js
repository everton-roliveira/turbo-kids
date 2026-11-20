// Turbo Kids · Carro Dragão nº 99 (Supercarro lendário). O mais caro da loja: solta fogo pelas laterais, tem rodas douradas e luz neon embaixo.
// modelo: carroceria por seções — corpo [z, meia-largura, base, topo, curvatura], cabine [z, meia-largura, topo, curvatura]; frente = +z.
// fogoLateral: chamas saindo dos dois lados (ficam maiores no turbo).
import touro from './touro.js';

// carroceria do Trovão, mais larga e mais baixa
const corpo=touro.modelo.corpo.map(([z,w,b,t,n])=>[z,w*1.05,b,t-.04,n]);
export default {
  id:'dragao',
  modelo:Object.assign({},touro.modelo,{nome:'Dragão',sub:'Supercarro lendário',cor:'#6a1fd0',corpo,
    asa:{z:-2.05,y:1.25,larg:2.1,corda:.44},aro:'#d4a017',pinca:'#ffd000',fogoLateral:true,
    extras:[['caixa',1.5,.03,3.6,0,.1,0,'neon']]}),
  personagem:{nome:'Dragão',num:99,olho:'#ff9a1f',garagem:{parede:'#2a0a3a',fundo:0x0a0210,piso:0x1a0f24,anel:0xff5a1f,destaque:'#ffd000',luz:0xffd6b0,itens:['bandeira','pneus','barril','bandeira','pneus','barril','bandeira','pneus']}},
  buzina:[147,220],
  preco:15000,
};
