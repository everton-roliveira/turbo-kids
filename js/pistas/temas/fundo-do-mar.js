// Turbo Kids · Pista: Fundo do Mar.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/aquatica.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Fundo do Mar',ico:'🐠',musica,
  ceu:0x1f7fc0,ceuTopo:0x0b3f78,nevoa:0x3a9ad6,chao:0xe6d39a,arvore:0x2f9a4a,tronco:0x6b4a2b,luz:0.85,
  decorar(h){
    const {mat,brilho,grupo,rumo,B}=h;
    // corais coloridos
    grupo([[mesclar([new THREE.CylinderGeometry(0.25,0.35,2.6,7).translate(0,1.3,0),new THREE.CylinderGeometry(0.2,0.25,1.8,7).translate(0,0.9,0).rotateZ(0.6).translate(0,1.4,0),
      new THREE.CylinderGeometry(0.2,0.25,1.6,7).translate(0,0.8,0).rotateZ(-0.7).translate(0,1.0,0),new THREE.CylinderGeometry(0.18,0.22,1.4,7).translate(0,0.7,0).rotateX(0.7).translate(0,1.8,0),
      new THREE.SphereGeometry(0.3,7,5).translate(0,2.6,0)]),mat(0xffffff)]],130,2,[0.8,2],[[0xff6fb5,0xff8a3d,0xb36bff,0xffd23f,0xff4d4d]]);
    // algas
    const alga=[];for(let k=0;k<6;k++)alga.push(new THREE.BoxGeometry(0.35,1.3,0.1).translate(0,0.65,0).rotateZ((k%2?0.18:-0.18)).translate((k%2?0.12:-0.12),k*1.2,0));
    grupo([[mesclar(alga),mat(0x2f9a4a,{side:THREE.DoubleSide})]],150,1.2,[0.8,1.6],null,{f:(t,b)=>({roll:Math.sin(t*1.2+b.fase)*0.15})});
    // estrelas-do-mar
    grupo([[mesclar([0,1,2,3,4].map(k=>new THREE.ConeGeometry(0.28,1.1,5).rotateZ(-Math.PI/2).translate(0.55,0.12,0).rotateY(k*Math.PI*2/5))),mat(0xffffff)]],90,1.2,[0.9,1.6],[[0xff7a3d,0xff5e8a,0xffc23d]]);
    // peixinhos nadando
    grupo([[mesclar([new THREE.SphereGeometry(1,12,8).scale(0.45,0.7,1).translate(0,4,0),new THREE.ConeGeometry(0.55,0.8,4).rotateX(-Math.PI/2).scale(0.3,1,1).translate(0,4,-1.25)]),mat(0xffffff)],
      [mesclar([new THREE.SphereGeometry(0.13,6,5).translate(-0.38,4.2,0.55),new THREE.SphereGeometry(0.13,6,5).translate(0.38,4.2,0.55)]),mat(0x111111)]],
      90,2,[0.8,1.7],[[0xffb01f,0xff5e3a,0x3bc4ff,0xffe14d,0xb36bff]],{f:(t,b)=>{const a=t*0.4+b.fase;return{dx:Math.cos(a)*6,dz:Math.sin(a)*6,dy:Math.sin(t+b.fase)*0.5,yaw:rumo(a,b)};}});
    // submarinos amarelos
    grupo([[mesclar([new THREE.SphereGeometry(1,16,10).scale(1.5,1.5,3.6).translate(0,7,0),B(1,1.4,1.6,0,8.9,0.4),new THREE.CylinderGeometry(0.12,0.12,1.4,6).translate(0,10.2,0.8),
      B(2.6,0.1,0.6,0,7,-3.6)]),mat(0xffd21f)],
      [mesclar([-1.2,0,1.2].map(z=>new THREE.CylinderGeometry(0.35,0.35,3.1,12).rotateZ(Math.PI/2).translate(0,7.2,z))),brilho(0x9fe4ff)]],6,6,[1,1.3],null,{f:(t,b)=>({dy:Math.sin(t*0.6+b.fase)*0.8,yaw:Math.sin(t*0.1+b.fase)*0.8})});
    // bolhas
    grupo([[new THREE.SphereGeometry(0.3,8,6).translate(0,3,0),mat(0xdff6ff,{transparent:true,opacity:0.55})]],160,0.5,[0.6,3],null,{f:(t,b)=>({dy:(t*1.2+b.fase*3)%10})});
  },
};
