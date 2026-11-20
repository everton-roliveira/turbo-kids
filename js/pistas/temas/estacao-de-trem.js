// Turbo Kids · Pista: Estação de Trem.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/trem.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Estação de Trem',ico:'🚂',musica,
  ceu:0xa9d8ff,ceuTopo:0x4a8fe0,nevoa:0xdcefff,chao:0x7cbf4a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,grupo,arvoresRedondas,B}=h;
    // trens coloridos parados nos trilhos
    const rodas=[];for(const z of [4.6,3.2,1.8,-1.6,-3.4,-6.8,-8.6])for(const x of [-1.05,1.05])rodas.push(new THREE.CylinderGeometry(0.55,0.55,0.3,12).rotateZ(Math.PI/2).translate(x,0.75,z));
    const dormentes=[];for(let z=-11;z<=7;z+=1.4)dormentes.push(B(3.2,0.15,0.5,0,0.08,z));
    grupo([[mesclar([new THREE.CylinderGeometry(1.1,1.1,4,14).rotateX(Math.PI/2).translate(0,2,3.2),B(2.4,3.2,2.2,0,2.4,0.4)]),mat(0xffffff)],
      [mesclar([B(2.2,2,4.2,0,2.1,-2.6),B(2.2,2,4.2,0,2.1,-7.7)]),mat(0xffffff)],
      [mesclar([...rodas,new THREE.CylinderGeometry(0.35,0.45,1.4,10).translate(0,3.6,4.2),B(2.7,0.3,2.6,0,4.1,0.4),B(0.12,0.12,19,-0.8,0.2,-2),B(0.12,0.12,19,0.8,0.2,-2)]),mat(0x26272b)],
      [mesclar(dormentes),mat(0x6b4a2b)]],
      15,12,[1,1.2],[[0xe8202a,0x2f8fff,0x3fbf3f],[0xffc21f,0xff8a1f,0x3bc4ff,0xb36bff]]);
    // caixas d'água e estações
    grupo([[mesclar([new THREE.CylinderGeometry(2,2,3,14).translate(0,8,0),new THREE.ConeGeometry(2.3,1.4,14).translate(0,10.2,0)]),mat(0x8a5a3a)],
      [mesclar([[-1.3,-1.3],[1.3,-1.3],[-1.3,1.3],[1.3,1.3]].map(([x,z])=>B(0.3,6.5,0.3,x,3.25,z))),mat(0x4a3018)]],6,4,[1,1.2]);
    grupo([[B(12,4,5,0,2,0),mat(0xf0e2c4)],[mesclar([B(13.4,0.5,6.8,0,4.3,0),B(1.4,1.4,0.2,0,3.2,2.55)]),mat(0x8a2f24)],[new THREE.CylinderGeometry(0.55,0.55,0.1,16).rotateX(Math.PI/2).translate(0,3.2,2.7),mat(0xffffff)]],4,9,[1,1.2]);
    arvoresRedondas(80,[0x3a8a34,0x4fa63f]);
  },
};
