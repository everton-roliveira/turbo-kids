// Turbo Kids · Roda estrela: 5 raios largos cromados em forma de estrela.
import {mesclar} from '../../nucleo/mesclar.js';
import {fixa,barril,borda,cubo,raio,metal} from './util.js';

const PECA=fixa(mesclar([barril(),borda(),...Array.from({length:5},(_,k)=>raio(k*Math.PI*2/5,.1,.04,.03)),
  new THREE.SphereGeometry(.07,12,8).scale(.6,1,1).translate(.14,0,0)]));
export default {
  id:'estrela',nome:'Estrela',preco:1000,
  criar({gira,add}){add(gira,PECA,metal('#eef2f6'));},
};
