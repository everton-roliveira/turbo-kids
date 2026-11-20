// Turbo Kids · Pista: Quarto de Brinquedos.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/brinquedo.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Quarto de Brinquedos',ico:'🧸',musica,
  ceu:0xfff2d6,ceuTopo:0xffd9a0,nevoa:0xfff0dc,chao:0xc9a27a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {mat,grupo,B}=h;
    // blocos de montar
    const pinos=[];for(const x of [-0.5,0.5])for(const z of [-1.5,-0.5,0.5,1.5])pinos.push(new THREE.CylinderGeometry(0.3,0.3,0.3,10).translate(x,1.35,z));
    grupo([[mesclar([B(2,1.2,4,0,0.6,0),...pinos]),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.35})]],80,4,[1,2.6],[[0xe8202a,0x2f8fff,0xffc21f,0x3fbf3f,0xff8a1f]]);
    // bolas
    grupo([[new THREE.SphereGeometry(1.5,18,12).translate(0,1.5,0),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.3})]],40,4,[1,2.6],[[0xff3b6b,0x3bc4ff,0xffd23f,0x7bd85a,0xb36bff]],{f:(t,b)=>({dy:Math.abs(Math.sin(t*2.2+b.fase))*3})});
    // ursinhos de pelúcia
    grupo([[mesclar([new THREE.SphereGeometry(1.2,14,10).scale(1,1.15,0.9).translate(0,1.6,0),new THREE.SphereGeometry(0.9,14,10).translate(0,3.3,0),
        new THREE.SphereGeometry(0.32,8,6).translate(-0.7,4.0,0),new THREE.SphereGeometry(0.32,8,6).translate(0.7,4.0,0),
        new THREE.SphereGeometry(0.45,8,6).translate(-1.1,1.9,0.3),new THREE.SphereGeometry(0.45,8,6).translate(1.1,1.9,0.3),
        new THREE.SphereGeometry(0.5,8,6).translate(-0.6,0.45,0.6),new THREE.SphereGeometry(0.5,8,6).translate(0.6,0.45,0.6)]),mat(0xa86b3c)],
      [mesclar([new THREE.SphereGeometry(0.38,8,6).scale(1,0.8,0.7).translate(0,3.1,0.8),new THREE.SphereGeometry(0.7,10,8).scale(1,1.1,0.5).translate(0,1.7,0.8)]),mat(0xf1d6b0)],
      [mesclar([new THREE.SphereGeometry(0.1,6,5).translate(-0.32,3.5,0.8),new THREE.SphereGeometry(0.1,6,5).translate(0.32,3.5,0.8),new THREE.SphereGeometry(0.12,6,5).translate(0,3.2,1.08)]),mat(0x111111)]],
      14,5,[1.6,2.6]);
    // lápis gigantes deitados
    grupo([[new THREE.CylinderGeometry(0.5,0.5,7,6).rotateZ(Math.PI/2).translate(0,0.5,0),mat(0xffffff)],
      [new THREE.ConeGeometry(0.5,1.4,6).rotateZ(-Math.PI/2).translate(4.2,0.5,0),mat(0xf1d6b0)],
      [new THREE.ConeGeometry(0.17,0.45,6).rotateZ(-Math.PI/2).translate(4.7,0.5,0),mat(0x333333)]],24,5,[1.4,2.4],[[0xe8202a,0x2f8fff,0x3fbf3f,0xffc21f,0xb36bff]]);
  },
};
