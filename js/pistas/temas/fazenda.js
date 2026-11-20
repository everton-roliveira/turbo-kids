// Turbo Kids · Pista: Fazenda.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/country.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Fazenda',ico:'🚜',musica,
  ceu:0x9fd6ff,ceuTopo:0x3d8ae0,nevoa:0xdff0ff,chao:0x7cbf4a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,grupo,arvoresRedondas,B}=h;
    // celeiros
    const fachada=new THREE.Shape([new THREE.Vector2(-5,0),new THREE.Vector2(5,0),new THREE.Vector2(5,7),new THREE.Vector2(0,9.6),new THREE.Vector2(-5,7)]);
    grupo([[new THREE.ExtrudeGeometry(fachada,{depth:14,bevelEnabled:false}).translate(0,0,-7),mat(0xc8322b)],
      [mesclar([new THREE.BoxGeometry(6,0.4,15).rotateZ(0.48).translate(-2.6,8.55,0),new THREE.BoxGeometry(6,0.4,15).rotateZ(-0.48).translate(2.6,8.55,0)]),mat(0x4d4f55)],
      [mesclar([B(3.6,4.6,0.2,0,2.3,7.05),B(1.8,1.4,0.2,0,7.4,7.05)]),mat(0xffffff)]],10,12,[1,1.2]);
    // fardos de feno
    grupo([[new THREE.CylinderGeometry(1.1,1.1,2,12).rotateZ(Math.PI/2).translate(0,1.1,0),mat(0xe8c55a)]],70,2,[0.9,1.2]);
    // girassóis
    grupo([[new THREE.CylinderGeometry(0.08,0.1,2.6,6).translate(0,1.3,0),mat(0x3e8f2f)],
      [new THREE.CylinderGeometry(0.75,0.75,0.08,10).rotateX(Math.PI/2).translate(0,2.7,0.05),mat(0xffd21f)],
      [new THREE.CylinderGeometry(0.38,0.38,0.12,10).rotateX(Math.PI/2).translate(0,2.7,0.1),mat(0x6b3f1d)]],220,1.2,[0.9,1.4]);
    // vaquinhas
    grupo([[mesclar([B(1.1,1.0,2.2,0,1.4,0),B(0.8,0.8,0.9,0,1.85,1.45)]),mat(0xf6f6f2)],
      [mesclar([B(0.25,0.9,0.25,-0.4,0.45,-0.8),B(0.25,0.9,0.25,0.4,0.45,-0.8),B(0.25,0.9,0.25,-0.4,0.45,0.8),B(0.25,0.9,0.25,0.4,0.45,0.8),
        B(1.14,0.55,0.8,0,1.55,-0.35),B(0.9,0.15,0.2,0,2.25,1.35)]),mat(0x222222)],
      [B(0.6,0.35,0.15,0,1.65,1.92),mat(0xf3a6b5)]],26,2,[1,1.2],null,{f:(t,b)=>({yaw:Math.sin(t*0.3+b.fase)*0.7})});
    arvoresRedondas(80,[0x3a8a34,0x4fa63f,0x2f7a2c]);
  },
};
