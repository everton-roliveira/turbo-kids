// Turbo Kids · Peças comuns das rodas. A face de fora da roda fica em +x (o lado esquerdo é espelhado).
import {lin} from '../../nucleo/util.js';
import {geosFixas} from '../pecas.js';

// geometria que fica guardada e reaproveitada (não é apagada quando um carro sai da tela)
export const fixa=g=>{geosFixas.add(g);return g;};
export const barril=()=>new THREE.CylinderGeometry(.24,.24,.27,24,1,true).rotateZ(Math.PI/2);
export const borda=(r=.238,e=.012)=>new THREE.TorusGeometry(r,e,6,28).rotateY(Math.PI/2).translate(.135,0,0);
export const cubo=(r=.06,lados=12)=>new THREE.CylinderGeometry(r,r,.05,lados).rotateZ(Math.PI/2).translate(.13,0,0);
// raio que vai do centro até a borda, girado no ângulo a
export const raio=(a,larg=.04,esp=.035,ini=0,fim=.225)=>new THREE.BoxGeometry(esp,larg,fim-ini).translate(.125,0,(ini+fim)/2).rotateX(a);
const cache={};
export const metal=hex=>cache['m'+hex]||(cache['m'+hex]=new THREE.MeshStandardMaterial({color:lin(hex),metalness:0.65,roughness:0.28,side:THREE.DoubleSide}));
export const fosco=hex=>cache['f'+hex]||(cache['f'+hex]=new THREE.MeshStandardMaterial({color:lin(hex),metalness:0.2,roughness:0.6,side:THREE.DoubleSide}));
export const pintado=hex=>cache['p'+hex]||(cache['p'+hex]=new THREE.MeshStandardMaterial({color:lin(hex),metalness:0.4,roughness:0.35}));
