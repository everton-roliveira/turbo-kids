// Turbo Kids · Pista: Vila do Natal.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/natal.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Vila do Natal',ico:'🎄',musica,
  ceu:0xc8dcf0,ceuTopo:0x6f8fc0,nevoa:0xeef4fa,chao:0xf4f8fc,arvore:0x1f6e35,tronco:0x6b4a2b,luz:0.92,
  decorar(h){
    const {mat,brilho,grupo,B}=h;
    // árvores de Natal com bolinhas e estrela
    const bolas=[];for(let i=0;i<10;i++){const a=i*2.1,y=1.6+(i%5)*0.95,r=2.3-(y-1.2)*0.38;bolas.push(new THREE.SphereGeometry(0.22,6,5).translate(r*Math.cos(a),y,r*Math.sin(a)));}
    grupo([[mesclar([new THREE.ConeGeometry(2.6,3,10).translate(0,2.4,0),new THREE.ConeGeometry(2.0,2.6,10).translate(0,4,0),new THREE.ConeGeometry(1.4,2.2,10).translate(0,5.4,0)]),mat(0x1f6e35)],
      [new THREE.CylinderGeometry(0.35,0.4,1,8).translate(0,0.5,0),mat(0x6b4a2b)],
      [mesclar(bolas),mat(0xffffff)],[new THREE.OctahedronGeometry(0.5,0).translate(0,6.8,0),brilho(0xffd21f)]],
      90,3.5,[0.8,1.6],[null,null,[0xe8202a,0xffc21f,0x2f8fff]]);
    // presentes
    grupo([[B(1.6,1.4,1.6,0,0.7,0),mat(0xffffff)],[mesclar([B(1.64,1.44,0.3,0,0.7,0),B(0.3,1.44,1.64,0,0.7,0),new THREE.TorusGeometry(0.3,0.08,6,12).translate(0,1.55,0)]),mat(0xffffff)]],
      80,1.5,[0.8,1.8],[[0xe8202a,0x2f8fff,0x3fbf3f,0xb36bff],[0xffd21f,0xffffff]]);
    // casinhas com neve no telhado
    const casa=new THREE.Shape([new THREE.Vector2(-3,0),new THREE.Vector2(3,0),new THREE.Vector2(3,4),new THREE.Vector2(0,6.5),new THREE.Vector2(-3,4)]);
    grupo([[new THREE.ExtrudeGeometry(casa,{depth:6,bevelEnabled:false}).translate(0,0,-3),mat(0xffffff)],
      [mesclar([new THREE.BoxGeometry(4.6,0.5,6.8).rotateZ(0.7).translate(-1.55,5.4,0),new THREE.BoxGeometry(4.6,0.5,6.8).rotateZ(-0.7).translate(1.55,5.4,0),B(0.9,2.4,0.9,1.6,6.6,-1.2)]),mat(0xf8fbff)],
      [mesclar([B(1.4,2.4,0.1,0,1.2,3.05),B(1.1,1.1,0.1,-1.8,2.4,3.05),B(1.1,1.1,0.1,1.8,2.4,3.05)]),brilho(0xffd98a)]],
      10,6,[1,1.3],[[0xc8322b,0x8a5a2b,0x2f6e9a,0x3f8a4a]]);
  },
};
