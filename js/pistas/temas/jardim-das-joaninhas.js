// Turbo Kids · Pista: Jardim das Joaninhas.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/jardim.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Jardim das Joaninhas',ico:'🐞',musica,
  ceu:0xbfe8ff,ceuTopo:0x5aa8e8,nevoa:0xe4f6e0,chao:0x6fbf4a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,grupo,rumo,B}=h;
    // flores gigantes
    grupo([[new THREE.CylinderGeometry(0.25,0.3,8,8).translate(0,4,0),mat(0x3e8f2f)],
      [mesclar([0,1,2,3,4,5].map(k=>new THREE.SphereGeometry(1.2,10,8).scale(1,0.55,0.25).translate(1.3,0,0).rotateZ(k*Math.PI/3).translate(0,8.2,0.2))),mat(0xffffff)],
      [new THREE.SphereGeometry(0.8,12,10).scale(1,1,0.6).translate(0,8.2,0.5),mat(0xffd21f)]],
      55,7,[1.2,2],[null,[0xff6fb5,0xb36bff,0xffffff,0xff5e3a,0x3bc4ff]]);
    // joaninhas
    const pontos=[[0.5,0.55,0.2],[-0.5,0.55,0.2],[0.55,0.45,-0.5],[-0.55,0.45,-0.5],[0.3,0.75,-0.15],[-0.3,0.75,-0.15]].map(([x,y,z])=>new THREE.SphereGeometry(0.17,6,5).translate(x,y,z));
    grupo([[new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2).scale(0.9,0.85,1.1).translate(0,0.1,0),mat(0xe8202a)],
      [mesclar([new THREE.SphereGeometry(0.42,10,8).translate(0,0.3,1.05),B(0.05,0.02,2.1,0,0.95,-0.05),...pontos]),mat(0x151515)],
      [mesclar([new THREE.SphereGeometry(0.11,6,5).translate(-0.18,0.45,1.38),new THREE.SphereGeometry(0.11,6,5).translate(0.18,0.45,1.38)]),mat(0xffffff)]],45,3,[1.4,2.6],null,{f:(t,b)=>({yaw:t*0.15*(b.fase>Math.PI?1:-1)})});
    // abelhas voando
    grupo([[new THREE.SphereGeometry(1,12,10).scale(0.55,0.55,0.85).translate(0,5,0),mat(0xffc21f)],
      [mesclar([new THREE.TorusGeometry(0.55,0.08,6,16).scale(1,1,1).translate(0,5,0.15),new THREE.TorusGeometry(0.5,0.08,6,16).translate(0,5,-0.3),new THREE.SphereGeometry(0.1,6,5).translate(-0.2,5.15,0.78),new THREE.SphereGeometry(0.1,6,5).translate(0.2,5.15,0.78)]),mat(0x151515)],
      [mesclar([new THREE.SphereGeometry(0.5,8,6).scale(0.9,0.12,0.5).rotateZ(0.5).translate(-0.6,5.6,0),new THREE.SphereGeometry(0.5,8,6).scale(0.9,0.12,0.5).rotateZ(-0.5).translate(0.6,5.6,0)]),
        mat(0xffffff,{transparent:true,opacity:0.75})]],40,2,[1,1.6],null,{f:(t,b)=>{const a=t*1.2+b.fase;return{dx:Math.cos(a)*3,dz:Math.sin(a)*3,dy:Math.sin(t*3+b.fase)*0.4,yaw:rumo(a,b)};}});
    grupo([[new THREE.ConeGeometry(0.35,1.4,4).translate(0,0.7,0),mat(0x4fa63f)]],220,0.8,[0.8,1.6]);
  },
};
