// Turbo Kids · Pista: Terra dos Doces.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/caixinha.js';
import {mesclar} from '../../nucleo/mesclar.js';
import {TEX,tex} from '../../nucleo/texturas.js';

export default {
  nome:'Terra dos Doces',ico:'🍭',musica,
  ceu:0xffd9f2,ceuTopo:0x8fb8ff,nevoa:0xffe6f6,chao:0xf090c4,arvore:0xff7ab8,tronco:0xf5f5f5,luz:1.05,
  decorar(h){
    const {mat,grupo,arvoresRedondas}=h;
    if(!TEX.pirulito)TEX.pirulito=tex(256,256,(x,w,h)=>{const c=['#ff3b6b','#ffd23f','#3bc4ff','#7bd85a','#b36bff','#ff8a2b'];x.fillStyle='#fff';x.fillRect(0,0,w,h);x.translate(w/2,h/2);
      for(let r=w/2;r>2;r-=3)for(let i=0;i<6;i++){const a=i*Math.PI/3+r*0.05;x.fillStyle=c[i];x.beginPath();x.moveTo(0,0);x.arc(0,0,r,a,a+Math.PI/3+0.02);x.fill();}});
    if(!TEX.bengala){TEX.bengala=tex(64,64,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#e8202a';
      for(let i=-1;i<3;i++){x.beginPath();x.moveTo(i*32,h);x.lineTo(i*32+14,h);x.lineTo(i*32+14+h,0);x.lineTo(i*32+h,0);x.fill();}},true);TEX.bengala.repeat.set(2,4);}
    // pirulitos
    grupo([[new THREE.CylinderGeometry(0.12,0.12,6.5,8).translate(0,3.25,0),mat(0xffffff)],
      [new THREE.CylinderGeometry(2.2,2.2,0.35,28).rotateX(Math.PI/2).translate(0,6.5,0),new THREE.MeshLambertMaterial({map:TEX.pirulito})]],70,3.5,[0.8,1.5],null,{f:(t,b)=>({yaw:t*0.8+b.fase})});
    // bengalas
    grupo([[mesclar([new THREE.CylinderGeometry(0.35,0.35,6,12).translate(0,3,0),new THREE.TorusGeometry(1.1,0.35,8,16,Math.PI).translate(1.1,6,0)]),
      new THREE.MeshLambertMaterial({map:TEX.bengala})]],45,3,[0.9,1.4]);
    // balinhas de goma
    grupo([[new THREE.SphereGeometry(1,14,10,0,Math.PI*2,0,Math.PI/2).scale(1,1.2,1),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.25})]],
      160,4,[0.8,2.2],[[0xff3b6b,0xffd23f,0x3bc4ff,0x7bd85a,0xb36bff,0xff8a2b]]);
    // árvores de algodão-doce
    arvoresRedondas(60,[0xff9ad5,0xb8e3ff,0xfff1a8]);
  },
};
