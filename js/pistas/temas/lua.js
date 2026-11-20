// Turbo Kids · Pista: Lua.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/espaco.js';
import {mulberry32} from '../../nucleo/util.js';
import {mesclar} from '../../nucleo/mesclar.js';
import {TEX,tex} from '../../nucleo/texturas.js';

export default {
  nome:'Lua',ico:'🌕',musica,
  ceu:0x05060f,ceuTopo:0x000000,nevoa:0x0b0d1c,chao:0x8c8c94,arvore:0x777780,tronco:0x555560,luz:0.95,gravidade:0.55,
  decorar(h){
    const {cena,rnd,animados,cx,cz,mat,brilho,grupo}=h;
    // crateras, pedras e foguetes
    grupo([[new THREE.TorusGeometry(1,0.28,6,22).rotateX(Math.PI/2).scale(1,0.5,1).translate(0,0.06,0),mat(0x8a8a93)],
      [new THREE.CircleGeometry(0.95,22).rotateX(-Math.PI/2).translate(0,0.02,0),mat(0x6f6f78)]],60,10,[3,9]);
    grupo([[new THREE.DodecahedronGeometry(1.2,0).scale(1.3,0.7,1).translate(0,0.35,0),mat(0x85858d)]],80,2.5,[0.6,2]);
    const aletas=[0,1,2].map(k=>new THREE.BoxGeometry(0.2,2.4,1.6).translate(1.5,2.2,0).rotateY(k*Math.PI*2/3));
    grupo([[new THREE.CylinderGeometry(1.2,1.2,7,16).translate(0,4.5,0),mat(0xf4f4f4)],
      [mesclar([new THREE.ConeGeometry(1.2,3,16).translate(0,9.5,0),...aletas]),mat(0xe3262b)],
      [new THREE.SphereGeometry(0.45,10,8).scale(1,1,0.4).translate(0,6.5,1.15),brilho(0x7fd4ff)]],14,4,[1,1.4],null,{f:(t,b)=>{const c=(t+b.fase*4)%26;return{dy:c<16?0:(c-16)*(c-16)*1.8};}});
    // estrelas e a Terra no céu
    const pos=[];for(let i=0;i<1400;i++){const t=rnd()*Math.PI*2,y=rnd()*0.95+0.03,r=Math.sqrt(1-y*y);pos.push(cx+Math.cos(t)*r*1000,y*1000-40,cz+Math.sin(t)*r*1000);}
    const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    cena.add(new THREE.Points(ge,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,fog:false})));
    if(!TEX.terra)TEX.terra=tex(256,128,(x,w,h)=>{x.fillStyle='#2a6fdb';x.fillRect(0,0,w,h);const r=mulberry32(5);
      x.fillStyle='#3fae4a';for(let i=0;i<14;i++){x.beginPath();x.ellipse(r()*w,20+r()*(h-40),10+r()*26,8+r()*16,r()*3,0,Math.PI*2);x.fill();}
      x.fillStyle='rgba(255,255,255,0.85)';for(let i=0;i<22;i++){x.beginPath();x.ellipse(r()*w,r()*h,8+r()*22,3+r()*4,0,0,Math.PI*2);x.fill();}});
    const terra=new THREE.Mesh(new THREE.SphereGeometry(70,32,20),new THREE.MeshBasicMaterial({map:TEX.terra,fog:false}));
    terra.position.set(cx+200,150,cz-480);terra.rotation.z=0.4;cena.add(terra);animados.push({custom:t=>{terra.rotation.y=t*0.05;}});
  },
};
