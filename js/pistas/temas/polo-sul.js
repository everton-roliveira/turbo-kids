// Turbo Kids · Pista: Polo Sul.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/gelo.js';
import {lin} from '../../nucleo/util.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Polo Sul',ico:'🐧',musica,
  ceu:0xbfe2ff,ceuTopo:0x5a9de0,nevoa:0xeef7ff,chao:0xf4f8fc,arvore:0x1f5e3a,tronco:0x5a4030,luz:0.92,
  decorar(h){
    const {mat,grupo,B}=h;
    // iglus
    grupo([[mesclar([new THREE.SphereGeometry(3.5,18,10,0,Math.PI*2,0,Math.PI/2),B(2.4,2.2,2.4,0,1.1,3.4)]),mat(0xeaf4ff)],
      [B(1.2,1.6,0.1,0,0.8,4.62),mat(0x2a3a55)]],12,6,[1,1.3]);
    // pinguins
    grupo([[mesclar([new THREE.SphereGeometry(1,12,10).scale(0.7,1.1,0.6).translate(0,1.1,0),new THREE.SphereGeometry(0.45,10,8).translate(0,2.2,0),
        new THREE.SphereGeometry(0.25,6,5).scale(0.5,1.4,0.8).translate(-0.72,1.2,0),new THREE.SphereGeometry(0.25,6,5).scale(0.5,1.4,0.8).translate(0.72,1.2,0)]),mat(0x1b1d24)],
      [mesclar([new THREE.SphereGeometry(1,12,10).scale(0.55,0.9,0.4).translate(0,1.0,0.25),new THREE.SphereGeometry(0.12,6,5).translate(-0.17,2.3,0.38),new THREE.SphereGeometry(0.12,6,5).translate(0.17,2.3,0.38)]),mat(0xffffff)],
      [mesclar([new THREE.ConeGeometry(0.12,0.4,6).rotateX(Math.PI/2).translate(0,2.15,0.55),B(0.35,0.1,0.5,-0.25,0.05,0.2),B(0.35,0.1,0.5,0.25,0.05,0.2)]),mat(0xff9a1f)]],70,2.5,[1.3,2],null,{f:(t,b)=>({roll:Math.sin(t*5+b.fase)*0.12,yaw:Math.sin(t*0.4+b.fase)*0.6})});
    // bonecos de neve
    grupo([[mesclar([new THREE.SphereGeometry(1.2,12,10).translate(0,1.1,0),new THREE.SphereGeometry(0.85,12,10).translate(0,2.8,0),new THREE.SphereGeometry(0.6,12,10).translate(0,4.0,0)]),mat(0xffffff)],
      [new THREE.ConeGeometry(0.12,0.6,6).rotateX(Math.PI/2).translate(0,4.0,0.85),mat(0xff7a1f)],
      [mesclar([new THREE.CylinderGeometry(0.45,0.45,0.7,12).translate(0,4.75,0),new THREE.CylinderGeometry(0.7,0.7,0.06,12).translate(0,4.42,0)]),mat(0x222222)]],24,2,[0.9,1.3]);
    // blocos de gelo
    grupo([[new THREE.DodecahedronGeometry(1.8,0).scale(1,0.8,1.2).translate(0,0.8,0),new THREE.MeshStandardMaterial({color:lin(0xbfe8ff),roughness:0.2,metalness:0.1})]],50,3,[0.6,2]);
  },
};
