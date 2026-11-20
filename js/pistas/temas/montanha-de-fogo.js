// Turbo Kids · Pista: Montanha de Fogo.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/fogo.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Montanha de Fogo',ico:'🌋',musica,
  ceu:0x6a3424,ceuTopo:0x1a0a08,nevoa:0x7a3a26,chao:0x2b2522,arvore:0x3a3030,tronco:0x2a2020,luz:0.85,
  decorar(h){
    const {mat,brilho,grupo}=h;
    // vulcões soltando fumaça
    grupo([[new THREE.CylinderGeometry(5,26,22,14).translate(0,11,0),mat(0x3a2622)],
      [new THREE.CylinderGeometry(4.6,4.6,0.6,14).translate(0,22,0),brilho(0xff5a1f)],
      [mesclar([new THREE.SphereGeometry(3,10,8).translate(0,25,0),new THREE.SphereGeometry(3.6,10,8).translate(1.5,29,0.5),new THREE.SphereGeometry(4,10,8).translate(-1,33,-0.5)]),
        mat(0x8a8a8a,{transparent:true,opacity:0.75})]],8,30,[0.9,1.3],null,{pecas:[2],f:(t,b)=>({dy:(t*1.5+b.fase*3)%8})});
    // poças de lava
    grupo([[new THREE.CircleGeometry(1,20).rotateX(-Math.PI/2).translate(0,0.03,0),brilho(0xff6a1f)],
      [new THREE.TorusGeometry(1,0.18,6,20).rotateX(Math.PI/2).scale(1,0.6,1).translate(0,0.05,0),mat(0x2a1e1a)]],45,9,[3,8]);
    // pedras de lava
    grupo([[new THREE.DodecahedronGeometry(1.3,0).scale(1.2,0.8,1).translate(0,0.5,0),mat(0x2e2725)]],100,2.5,[0.6,2.2]);
    grupo([[new THREE.OctahedronGeometry(0.6,0).scale(0.6,1.4,0.6).translate(0,0.8,0),brilho(0xffa020)]],60,1.2,[0.7,1.6],null,{f:(t,b)=>({yaw:t*0.6+b.fase})});
  },
};
