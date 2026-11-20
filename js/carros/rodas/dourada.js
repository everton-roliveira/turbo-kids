// Turbo Kids · Roda dourada de corrida: 7 pares de raios dourados e porca central vermelha.
import {mesclar} from '../../nucleo/mesclar.js';
import {fixa,barril,borda,raio,metal,pintado} from './util.js';

const RAIOS=fixa(mesclar([barril(),borda(.238,.016),...Array.from({length:7},(_,k)=>{const a=k*Math.PI*2/7;
  return [raio(a-.09,.026,.03,.05),raio(a+.09,.026,.03,.05)];}).flat()]));
const PORCA=fixa(new THREE.CylinderGeometry(.06,.06,.06,6).rotateZ(Math.PI/2).translate(.14,0,0));
export default {
  id:'dourada',nome:'Dourada',preco:3000,
  criar({gira,add}){add(gira,RAIOS,metal('#ffcc33'));add(gira,PORCA,pintado('#e3120b'));},
};
