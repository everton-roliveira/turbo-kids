// Turbo Kids · Pista: Céu das Nuvens.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/sonho.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Céu das Nuvens',ico:'🎈',musica,
  ceu:0x9fd4ff,ceuTopo:0x3a8ae0,nevoa:0xe6f4ff,chao:0xf2f8ff,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,grupo,B}=h;
    // nuvens fofas no chão
    grupo([[mesclar([new THREE.SphereGeometry(2,12,10).translate(0,1,0),new THREE.SphereGeometry(1.6,12,10).translate(1.9,0.8,0.4),new THREE.SphereGeometry(1.5,12,10).translate(-1.8,0.7,-0.3),
      new THREE.SphereGeometry(1.3,12,10).translate(0.4,2.2,0.2)]),mat(0xffffff)]],110,5,[0.8,2.5]);
    // balões de ar quente
    grupo([[new THREE.SphereGeometry(3,18,14).scale(1,1.2,1).translate(0,15,0),mat(0xffffff)],
      [mesclar([new THREE.TorusGeometry(3.02,0.25,6,28).rotateX(Math.PI/2).translate(0,15,0),new THREE.TorusGeometry(2.6,0.25,6,28).rotateX(Math.PI/2).translate(0,13.2,0)]),mat(0xffffff)],
      [mesclar([B(1.6,1.2,1.6,0,9.2,0),...[[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7],[0.7,0.7]].map(([x,z])=>B(0.06,2.6,0.06,x,11,z))]),mat(0x8a5a2b)]],
      22,5,[1,1.5],[[0xe8202a,0x2f8fff,0xffc21f,0xff6fb5,0x3fbf3f,0xff8a1f],[0xffd21f,0xffffff]],{f:(t,b)=>({dy:Math.sin(t*0.4+b.fase)*3,yaw:t*0.08})});
  },
};
