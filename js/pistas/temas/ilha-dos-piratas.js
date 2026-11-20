// Turbo Kids · Pista: Ilha dos Piratas.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/pirata.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Ilha dos Piratas',ico:'🏴‍☠️',musica,
  ceu:0x8fd8ff,ceuTopo:0x2a86d9,nevoa:0xd5f0ff,chao:0xe8d39a,arvore:0x2e8b3a,tronco:0x8a6a3e,luz:1.08,mar:true,
  decorar(h){
    const {mat,grupo,B,palmeiras}=h;
    palmeiras(110);
    // navios piratas encalhados na areia
    const velas=[[0,6.2,-2.6,4.6,3.2],[0,9,-2.6,3.6,2.4],[0,6.8,2.2,4.2,3]].map(([x,y,z,w,h])=>B(w,h,0.15,x,y,z));
    grupo([[mesclar([B(4.4,2.4,11,0,1.6,0),new THREE.ConeGeometry(2.2,4,4).rotateY(Math.PI/4).scale(1,1,1).rotateX(Math.PI/2).scale(1,0.55,1).translate(0,1.9,7.4),B(4.6,0.4,11.2,0,2.9,0),B(4.4,1.6,2.6,0,3.8,-4.2)]),mat(0x7a4a26)],
      [mesclar([new THREE.CylinderGeometry(0.18,0.22,10,8).translate(0,6,-2.6),new THREE.CylinderGeometry(0.16,0.2,8,8).translate(0,5,2.2)]),mat(0x4a3018)],
      [mesclar(velas),mat(0xf3ead2)],
      [B(1.6,1,0.08,0.8,11.6,-2.6),mat(0x111111)]],8,10,[1,1.3],null,{f:(t,b)=>({roll:Math.sin(t*0.9+b.fase)*0.06,pitch:Math.sin(t*0.7+b.fase)*0.03})});
    // baús de tesouro
    grupo([[mesclar([B(1.6,1,1,0,0.5,0),new THREE.CylinderGeometry(0.5,0.5,1.6,12,1,false,0,Math.PI).rotateZ(Math.PI/2).translate(0,1,0)]),mat(0x8a5a2b)],
      [mesclar([B(1.66,0.15,1.06,0,0.2,0),B(1.66,0.15,1.06,0,0.85,0),B(0.3,0.4,0.08,0,0.8,0.52)]),mat(0xffc93c)]],30,2,[0.9,1.4]);
    // barris
    grupo([[new THREE.CylinderGeometry(0.6,0.6,1.4,12).translate(0,0.7,0),mat(0x9a6a3a)]],40,1.5,[0.9,1.2]);
  },
};
