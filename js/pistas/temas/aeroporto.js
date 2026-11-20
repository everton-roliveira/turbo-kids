// Turbo Kids · Pista: Aeroporto.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/aviao.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Aeroporto',ico:'✈️',musica,
  ceu:0xa8d8ff,ceuTopo:0x4a90e0,nevoa:0xe0f0ff,chao:0x8fb86a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,brilho,grupo,arvoresRedondas,B}=h;
    // aviões: ficam parados e de vez em quando decolam
    const aviao=[new THREE.CylinderGeometry(1,1,12,16).rotateX(Math.PI/2).translate(0,3,0),new THREE.SphereGeometry(1,16,10).scale(1,1,1.6).translate(0,3,6),
      new THREE.ConeGeometry(1,3,16).rotateX(-Math.PI/2).translate(0,3.2,-7.4),B(15,0.25,2.4,0,2.6,0.6),B(5.4,0.2,1.4,0,3.4,-7.2)];
    grupo([[mesclar(aviao),mat(0xf4f6f8)],
      [mesclar([new THREE.BoxGeometry(0.25,3,2).translate(0,5,-7.4),new THREE.CylinderGeometry(0.5,0.5,2,12).rotateX(Math.PI/2).translate(-3.6,2.1,0.8),new THREE.CylinderGeometry(0.5,0.5,2,12).rotateX(Math.PI/2).translate(3.6,2.1,0.8)]),mat(0xffffff)],
      [mesclar([B(2.04,0.35,9,0,3.4,0.5),new THREE.SphereGeometry(0.55,10,6).scale(1.6,0.5,1).translate(0,3.55,6.6)]),brilho(0x2a4a7a)],
      [mesclar([new THREE.CylinderGeometry(0.12,0.12,2,6).translate(0,1,4.5),new THREE.CylinderGeometry(0.12,0.12,2,6).translate(-2,1,0),new THREE.CylinderGeometry(0.12,0.12,2,6).translate(2,1,0)]),mat(0x26272b)]],
      16,16,[1,1.2],[null,[0xe8202a,0x2f8fff,0xffc21f,0x3fbf3f]],
      {f:(t,b)=>{const c=(t+b.fase*5)%34;if(c<20)return{};const d=(c-20)*(c-20)*0.9,s=Math.sin(b.ry),k=Math.cos(b.ry),sobe=Math.max(0,c-24);
        return{dx:s*d,dz:k*d,dy:sobe*sobe*0.7,pitch:-Math.min(0.3,sobe*0.08)};}});
    // torres de controle
    grupo([[mesclar([new THREE.CylinderGeometry(1.4,2,18,12).translate(0,9,0),new THREE.CylinderGeometry(3.4,3,0.6,12).translate(0,21.6,0),new THREE.ConeGeometry(3.6,1.6,12).translate(0,23.6,0)]),mat(0xe6e8ec)],
      [new THREE.CylinderGeometry(3.2,3,3,12).translate(0,19.6,0),brilho(0x8fd8ff)]],4,8,[1,1.2]);
    // hangares
    grupo([[new THREE.CylinderGeometry(7,7,16,16,1,false,0,Math.PI).rotateZ(Math.PI/2).rotateY(Math.PI/2).translate(0,0,0),mat(0xaab0b8,{side:THREE.DoubleSide})]],6,12,[1,1.2]);
    // birutas
    grupo([[new THREE.CylinderGeometry(0.07,0.07,4,6).translate(0,2,0),mat(0xdddddd)],[new THREE.ConeGeometry(0.45,2,10,1,true).rotateZ(Math.PI/2).translate(1.1,3.7,0),mat(0xff7a1f,{side:THREE.DoubleSide})]],
      24,1.5,[1,1.3],null,{pecas:[1],f:(t,b)=>({yaw:Math.sin(t*0.8+b.fase)*0.5})});
    arvoresRedondas(70,[0x3a8a34,0x4fa63f]);
  },
};
