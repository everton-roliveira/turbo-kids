// Turbo Kids · Pista: Estádio de Futebol.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/torcida.js';
import {mesclar} from '../../nucleo/mesclar.js';
import {TEX,tex} from '../../nucleo/texturas.js';

export default {
  nome:'Estádio de Futebol',ico:'⚽',musica,
  ceu:0x8fd0ff,ceuTopo:0x2f80e0,nevoa:0xd8eeff,chao:0x3f9a3a,arvore:0x2f7d32,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {cx,mat,grupo,B}=h;
    if(!TEX.bola)TEX.bola=tex(128,64,(x,w,h)=>{x.fillStyle='#fafafa';x.fillRect(0,0,w,h);x.fillStyle='#151515';
      for(let j=0;j<3;j++)for(let i=0;i<6;i++){const cx=(i+(j%2)*0.5)*w/6,cy=(j+0.5)*h/3;x.beginPath();for(let k=0;k<5;k++){const a=k*Math.PI*2/5;x.lineTo(cx+Math.cos(a)*7,cy+Math.sin(a)*7);}x.fill();}});
    // traves com rede
    grupo([[mesclar([new THREE.CylinderGeometry(0.12,0.12,2.4,8).translate(-3.6,1.2,0),new THREE.CylinderGeometry(0.12,0.12,2.4,8).translate(3.6,1.2,0),
        new THREE.CylinderGeometry(0.12,0.12,7.4,8).rotateZ(Math.PI/2).translate(0,2.4,0)]),mat(0xffffff)],
      [mesclar([B(7.2,2.3,0.05,0,1.15,-1.5),B(7.2,0.05,1.5,0,2.3,-0.75),B(0.05,2.3,1.5,-3.6,1.15,-0.75),B(0.05,2.3,1.5,3.6,1.15,-0.75)]),mat(0xffffff,{transparent:true,opacity:0.35})]],12,6,[1,1.2]);
    // bolas gigantes quicando
    grupo([[new THREE.SphereGeometry(1.5,20,14).translate(0,1.5,0),new THREE.MeshStandardMaterial({map:TEX.bola,roughness:0.4})]],40,4,[1,2.4],null,
      {f:(t,b)=>({dy:Math.abs(Math.sin(t*2+b.fase))*3,yaw:t+b.fase})});
    // bandeirinhas
    grupo([[new THREE.CylinderGeometry(0.06,0.06,3,6).translate(0,1.5,0),mat(0xf2f2f2)],[new THREE.BoxGeometry(0.05,0.8,1.1).translate(0,2.55,0.55),mat(0xffffff)]],
      70,1.2,[0.9,1.3],[null,[0xe8202a,0xffd21f,0x2f8fff,0x3fbf3f]],{pecas:[1],f:(t,b)=>({yaw:Math.sin(t*3+b.fase)*0.4})});
    // arquibancadas com torcida
    if(!TEX.torcidaLonga){TEX.torcidaLonga=TEX.torcida.clone();TEX.torcidaLonga.wrapS=TEX.torcidaLonga.wrapT=THREE.RepeatWrapping;TEX.torcidaLonga.repeat.set(1,5);TEX.torcidaLonga.needsUpdate=true;}
    grupo([[mesclar([B(2,1.4,16,2,0.7,0),B(2,3,16,0,1.5,0),B(2,4.6,16,-2,2.3,0)]),new THREE.MeshLambertMaterial({map:TEX.torcidaLonga})]],8,10,[1,1.2]);
  },
};
