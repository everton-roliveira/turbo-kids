// Turbo Kids · Pista: Vale dos Dinossauros.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/tribal.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Vale dos Dinossauros',ico:'🦕',musica,
  ceu:0xa8d8ff,ceuTopo:0x4a90d9,nevoa:0xd6ecd2,chao:0x6a9a3a,arvore:0x2d6e2a,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,brilho,grupo,palmeiras}=h;
    palmeiras(110);
    // samambaias
    grupo([[new THREE.ConeGeometry(1.2,2.2,6).translate(0,1.1,0),mat(0x3f8a2e)]],150,1.5,[0.7,1.5]);
    // dinossauros pescoçudos com olhinhos
    const corpo=mesclar([new THREE.SphereGeometry(1,14,10).scale(1.6,1.4,2.6).translate(0,3.2,0),
      ...[[-0.9,-1.3],[0.9,-1.3],[-0.9,1.3],[0.9,1.3]].map(([x,z])=>new THREE.CylinderGeometry(0.4,0.45,2.6,8).translate(x,1.3,z)),
      new THREE.CylinderGeometry(0.35,0.6,5,8).rotateX(0.45).translate(0,6.05,3.29),
      new THREE.SphereGeometry(1,12,8).scale(0.6,0.55,0.95).translate(0,8.5,4.8),
      new THREE.ConeGeometry(0.6,4.5,8).rotateX(-1.88).translate(0,2.32,-4.54)]);
    grupo([[corpo,mat(0xffffff)],
      [mesclar([new THREE.SphereGeometry(0.2,8,6).translate(-0.45,8.68,5.2),new THREE.SphereGeometry(0.2,8,6).translate(0.45,8.68,5.2)]),mat(0xffffff)],
      [mesclar([new THREE.SphereGeometry(0.11,6,5).translate(-0.55,8.7,5.3),new THREE.SphereGeometry(0.11,6,5).translate(0.55,8.7,5.3)]),mat(0x111111)]],
      26,9,[0.8,1.3],[[0x6cc04a,0xff8a3d,0x8a6bff,0x3bb7e0,0xffc93c]],{f:(t,b)=>({yaw:Math.sin(t*0.35+b.fase)*0.6})});
    // vulcões ao longe
    grupo([[new THREE.CylinderGeometry(6,32,26,14).translate(0,13,0),mat(0x5a3b2a)],
      [new THREE.CylinderGeometry(5.6,5.6,0.6,14).translate(0,26,0),brilho(0xff5a1f)],
      [mesclar([new THREE.SphereGeometry(4,10,8).translate(0,31,0),new THREE.SphereGeometry(5,10,8).translate(2,37,1),new THREE.SphereGeometry(6,10,8).translate(-1,44,-1)]),
        mat(0xdddddd,{transparent:true,opacity:0.8})]],5,40,[0.9,1.2]);
  },
};
