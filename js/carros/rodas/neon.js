// Turbo Kids · Roda neon (a mais top): aro preto, anéis de luz que trocam de cor e um rotor cromado que gira sozinho, mesmo com o carro parado.
import {mesclar} from '../../nucleo/mesclar.js';
import {fixa,barril,raio,metal} from './util.js';

const ARO=fixa(mesclar([barril(),...Array.from({length:6},(_,k)=>raio(k*Math.PI/3,.035,.03,.06,.2))]));
const LUZ=fixa(mesclar([new THREE.TorusGeometry(.215,.03,8,32).rotateY(Math.PI/2).translate(.14,0,0),new THREE.TorusGeometry(.08,.02,8,20).rotateY(Math.PI/2).translate(.145,0,0)]));
const ROTOR=fixa(mesclar([...Array.from({length:3},(_,k)=>new THREE.BoxGeometry(.02,.05,.17).translate(0,.025,.1).rotateX(.35).rotateX(k*Math.PI*2/3)),
  new THREE.CylinderGeometry(.05,.05,.03,16).rotateZ(Math.PI/2)]));
export default {
  id:'neon',nome:'Neon',preco:6000,
  criar({gira,esp,add,anim}){
    add(gira,ARO,metal('#15161a'));
    // luz própria de cada carro (a cor muda com o tempo)
    const luz=new THREE.MeshBasicMaterial({color:0x19e0d0,toneMapped:false});
    add(gira,LUZ,luz);anim.neons.push(luz);anim.proprios.push(luz);
    // rotor fica fora do grupo que gira com a roda: ele gira por conta própria
    const r=add(esp,ROTOR,metal('#ffffff'));r.position.x=.16;anim.rotores.push(r);
  },
};
