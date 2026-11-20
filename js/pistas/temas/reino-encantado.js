// Turbo Kids · Pista: Reino Encantado.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/fantasia.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Reino Encantado',ico:'🏰',musica,
  ceu:0xd9c8ff,ceuTopo:0x7a6ae0,nevoa:0xece4ff,chao:0x8fd47a,arvore:0xff9ad5,tronco:0x7a5236,luz:1.0,
  decorar(h){
    const {mat,brilho,grupo,arvoresRedondas,B}=h;
    // castelos com telhados coloridos
    grupo([[mesclar([B(10,12,10,0,6,0),...[[-6,-6],[6,-6],[-6,6],[6,6]].map(([x,z])=>new THREE.CylinderGeometry(2.2,2.2,16,14).translate(x,8,z))]),mat(0xf1e6d6)],
      [mesclar([...[[-6,-6],[6,-6],[-6,6],[6,6]].map(([x,z])=>new THREE.ConeGeometry(3,6,14).translate(x,19,z)),new THREE.ConeGeometry(7.6,7,4).rotateY(Math.PI/4).translate(0,15.5,0)]),mat(0xffffff)],
      [mesclar([B(3,5,0.3,0,2.5,5.05),B(0.8,1.4,0.3,-6,12,8.15),B(0.8,1.4,0.3,6,12,8.15),B(1.2,1.6,0.3,-2.5,9,5.05),B(1.2,1.6,0.3,2.5,9,5.05)]),mat(0x3a2c4a)]],
      11,14,[1,1.3],[null,[0xff6fb5,0x5aa0ff,0xa86bff,0xff9f3b]]);
    // arco-íris com nuvens nos pés
    const cores=[0xe8202a,0xff8a1f,0xffd21f,0x3fbf3f,0x2f8fff,0x4b3bd6,0x9b3bd6];
    grupo([...cores.map((c,i)=>[new THREE.TorusGeometry(20-i*1.6,0.85,6,48,Math.PI),brilho(c)]),
      [mesclar([1,-1].flatMap(l=>[new THREE.SphereGeometry(2.8,10,8).translate(l*15.2,1.2,0),new THREE.SphereGeometry(2.4,10,8).translate(l*18.4,1,0.6),new THREE.SphereGeometry(2.2,10,8).translate(l*12.6,1,-0.4)])),mat(0xffffff)]],
      6,26,[1,1.2]);
    arvoresRedondas(120,[0xff9ad5,0xd7a6ff,0xffc2e2]);
  },
};
