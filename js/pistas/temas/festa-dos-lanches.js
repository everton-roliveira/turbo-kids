// Turbo Kids · Pista: Festa dos Lanches.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/lanche.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Festa dos Lanches',ico:'🍔',musica,
  ceu:0xffe6b0,ceuTopo:0xff9a5a,nevoa:0xfff0d0,chao:0x9fd46a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,grupo,B}=h;
    // hambúrgueres gigantes girando
    grupo([[mesclar([new THREE.CylinderGeometry(1.5,1.4,0.5,20).translate(0,0.25,0),new THREE.SphereGeometry(1.55,20,10,0,Math.PI*2,0,Math.PI/2).scale(1,0.7,1).translate(0,1.25,0)]),mat(0xe0a050)],
      [new THREE.CylinderGeometry(1.6,1.6,0.35,20).translate(0,0.68,0),mat(0x6b3a1f)],
      [B(2.6,0.1,2.6,0,0.9,0),mat(0xffd23f)],[new THREE.CylinderGeometry(1.7,1.7,0.1,14).translate(0,1.0,0),mat(0x5fbf3f)]],
      22,4,[1.6,2.6],null,{f:(t,b)=>({yaw:t*0.5+b.fase})});
    // batatas fritas
    const palitos=[];for(let i=0;i<9;i++)palitos.push(B(0.18,2,0.18,-0.5+(i%3)*0.5,1.9+(i%2)*0.3,-0.35+Math.floor(i/3)*0.35).rotateZ((i%3-1)*0.12));
    grupo([[new THREE.CylinderGeometry(1.1,0.8,2,4).rotateY(Math.PI/4).translate(0,1,0),mat(0xe8202a)],[mesclar(palitos),mat(0xffd23f)]],28,3,[1.2,2]);
    // sorvetes de casquinha
    grupo([[new THREE.ConeGeometry(0.7,2.4,12).rotateX(Math.PI).translate(0,1.2,0),mat(0xd9a05a)],
      [mesclar([new THREE.SphereGeometry(0.8,14,10).translate(0,2.6,0),new THREE.SphereGeometry(0.7,14,10).translate(0,3.6,0)]),mat(0xffffff)],
      [new THREE.SphereGeometry(0.18,8,6).translate(0,4.35,0),mat(0xd8202a)]],45,2,[1.2,2],[null,[0xff9ad5,0xfff1d0,0x7a4a2a,0x9fe4c0]]);
    // rosquinhas
    grupo([[new THREE.TorusGeometry(0.9,0.42,10,20).rotateX(Math.PI/2).translate(0,0.42,0),mat(0xd9a05a)],
      [new THREE.TorusGeometry(0.9,0.36,8,20,Math.PI*2).rotateX(Math.PI/2).scale(1,0.6,1).translate(0,0.62,0),mat(0xffffff)]],45,2.5,[1,2],[null,[0xff7ab8,0x7a4a2a,0xfff1a8]]);
  },
};
