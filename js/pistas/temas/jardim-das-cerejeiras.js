// Turbo Kids · Pista: Jardim das Cerejeiras.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/oriental.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Jardim das Cerejeiras',ico:'🌸',musica,
  ceu:0xcfe8ff,ceuTopo:0x6aa6e8,nevoa:0xf5e6ef,chao:0x8cc46a,arvore:0xffb7d5,tronco:0x6b4a3b,luz:1.0,
  decorar(h){
    const {mat,brilho,grupo,arvoresRedondas,B}=h;
    arvoresRedondas(150,[0xffb7d5,0xffc9e0,0xff9cc6,0xffffff]);
    // pagodes de três andares
    const paredes=[],telhados=[];for(let i=0;i<3;i++){const w=6-1.4*i,y=3.2*i;paredes.push(B(w,2.6,w,0,1.3+y,0));
      telhados.push(new THREE.ConeGeometry((w+2.6)*0.72,1.4,4).rotateY(Math.PI/4).translate(0,3.3+y,0));}
    telhados.push(new THREE.CylinderGeometry(0.12,0.2,2.4,6).translate(0,11.2,0));
    grupo([[mesclar(paredes),mat(0xf5ecd8)],[mesclar(telhados),mat(0xc8322b)]],7,8,[1,1.3]);
    // portais vermelhos
    grupo([[mesclar([new THREE.CylinderGeometry(0.35,0.4,6,10).translate(-2.6,3,0),new THREE.CylinderGeometry(0.35,0.4,6,10).translate(2.6,3,0),B(6,0.5,0.6,0,4.8,0)]),mat(0xe0352b)],
      [B(7.6,0.6,0.8,0,6.2,0),mat(0x222222)]],12,5,[0.9,1.2]);
    // lanternas de pedra
    grupo([[mesclar([B(0.6,1,0.6,0,0.5,0),B(1,0.7,1,0,1.35,0),new THREE.ConeGeometry(0.9,0.6,4).rotateY(Math.PI/4).translate(0,2,0)]),mat(0x9a9a92)],
      [B(0.6,0.4,1.02,0,1.35,0),brilho(0xffe08a)]],40,1.2,[0.9,1.3]);
  },
};
