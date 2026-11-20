// Turbo Kids · Roda aventura (off-road): disco fosco, 8 parafusos e anel vermelho.
import {mesclar} from '../../nucleo/mesclar.js';
import {fixa,barril,cubo,metal,fosco,pintado} from './util.js';

const DISCO=fixa(mesclar([barril(),new THREE.CylinderGeometry(.215,.215,.03,24).rotateZ(Math.PI/2).translate(.12,0,0)]));
const PARAFUSOS=fixa(mesclar([...Array.from({length:8},(_,k)=>{const a=k*Math.PI/4;
  return new THREE.CylinderGeometry(.016,.016,.04,8).rotateZ(Math.PI/2).translate(.14,Math.cos(a)*.19,Math.sin(a)*.19);}),cubo(.07,8)]));
const ANEL=fixa(new THREE.TorusGeometry(.225,.022,6,28).rotateY(Math.PI/2).translate(.135,0,0));
export default {
  id:'aventura',nome:'Aventura',preco:1800,
  criar({gira,add}){add(gira,DISCO,fosco('#3a3d44'));add(gira,PARAFUSOS,metal('#d6d9de'));add(gira,ANEL,pintado('#e3120b'));},
};
