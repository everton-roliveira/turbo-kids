// Turbo Kids · Pista: Canteiro de Obras.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/rock.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Canteiro de Obras',ico:'🏗️',musica,
  ceu:0xb9dcf5,ceuTopo:0x4f8fd0,nevoa:0xe4eef5,chao:0xb08a5a,arvore:0x2f7d32,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,brilho,grupo,B}=h;
    // guindastes
    grupo([[B(1.2,22,1.2,0,11,0),mat(0xffc21f)],[B(3.4,0.6,3.4,0,0.3,0),mat(0x55585e)],
      [mesclar([B(1,1,22,0,22.5,5),B(1.6,1.6,1.6,0,21.4,0)]),mat(0xffc21f)],
      [mesclar([B(2.2,1.8,2.4,0,22.5,-5),B(0.06,8,0.06,0,18.5,13),B(0.5,0.6,0.3,0,14.4,13)]),mat(0x55585e)]],6,14,[0.9,1.2],null,
      {pecas:[2,3],f:(t,b)=>({yaw:Math.sin(t*0.15+b.fase)*1.6})});
    // caminhões basculantes
    const rodas=[[-1.2,1.6],[1.2,1.6],[-1.2,-0.8],[1.2,-0.8],[-1.2,-2],[1.2,-2]].map(([x,z])=>new THREE.CylinderGeometry(0.6,0.6,0.5,12).rotateZ(Math.PI/2).translate(x,0.6,z));
    grupo([[mesclar([B(2.2,1.8,1.6,0,1.9,2.2),B(2.4,1.4,3.6,0,2.2,-1.2)]),mat(0xffb01f)],
      [mesclar([B(2,0.4,5.4,0,1,0),...rodas]),mat(0x26272b)],
      [B(1.9,0.7,0.06,0,2.3,3.02),brilho(0x9fd8ff)]],16,4,[1,1.2]);
    // montes de terra, tubos de concreto e cones
    grupo([[new THREE.ConeGeometry(4,3,10).translate(0,1.5,0),mat(0x8a6a40)]],30,5,[0.6,1.4]);
    grupo([[new THREE.CylinderGeometry(1.2,1.2,2.6,16,1,true).rotateZ(Math.PI/2).translate(0,1.2,0),mat(0xa8a8a8,{side:THREE.DoubleSide})]],30,2,[0.9,1.1]);
    grupo([[new THREE.ConeGeometry(0.35,1,10).translate(0,0.5,0),mat(0xff6a00)],[new THREE.CylinderGeometry(0.24,0.28,0.18,10).translate(0,0.55,0),mat(0xffffff)]],90,1,[0.9,1.3]);
  },
};
