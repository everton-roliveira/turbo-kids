// Turbo Kids · Pista: Floresta dos Cogumelos.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/travessa.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Floresta dos Cogumelos',ico:'🍄',musica,
  ceu:0xc9f0d8,ceuTopo:0x5fb08a,nevoa:0xe2f7e8,chao:0x5aa84a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,grupo,arvoresRedondas}=h;
    // cogumelos gigantes com bolinhas
    const pintas=[];for(let i=0;i<9;i++){const t=i*2.4,f=0.45+(i%3)*0.3;pintas.push(new THREE.SphereGeometry(0.42,8,6).scale(1,0.5,1).translate(3*Math.sin(f)*Math.cos(t),5+1.8*Math.cos(f),3*Math.sin(f)*Math.sin(t)));}
    grupo([[new THREE.CylinderGeometry(0.7,1,5,12).translate(0,2.5,0),mat(0xf4ead8)],
      [new THREE.SphereGeometry(3,18,10,0,Math.PI*2,0,Math.PI/2).scale(1,0.6,1).translate(0,5,0),mat(0xffffff)],
      [mesclar(pintas),mat(0xffffff)]],70,4,[0.6,1.8],[null,[0xe8202a,0xff8a1f,0x9b5bd6,0x2f8fff]]);
    // florzinhas coloridas
    grupo([[new THREE.CylinderGeometry(0.05,0.06,1.2,5).translate(0,0.6,0),mat(0x3e8f2f)],
      [new THREE.IcosahedronGeometry(0.35,0).translate(0,1.3,0),mat(0xffffff)]],260,1,[0.8,1.5],[null,[0xff6fb5,0xffd21f,0xffffff,0xb36bff,0xff8a2b]],{f:(t,b)=>({roll:Math.sin(t*1.5+b.fase)*0.12})});
    arvoresRedondas(70,[0x3a8a34,0x4fa63f]);
  },
};
