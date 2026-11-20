// Turbo Kids · Pista: Cidade do Futuro.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/synth.js';
import {lin} from '../../nucleo/util.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Cidade do Futuro',ico:'🛸',musica,
  ceu:0x2a1a5e,ceuTopo:0x0a0620,nevoa:0x3a2a70,chao:0x2a2c44,arvore:0x19e0d0,tronco:0x555560,luz:0.75,
  decorar(h){
    const {cena,rnd,cx,cz,brilho,grupo,B}=h;
    // torres de vidro com anéis de neon
    grupo([[new THREE.CylinderGeometry(3.6,4.2,30,12).translate(0,15,0),new THREE.MeshStandardMaterial({color:lin(0x2a3f7a),roughness:0.2,metalness:0.7})],
      [mesclar([8,16,24,30].map(y=>new THREE.TorusGeometry(4.2-y*0.02,0.25,6,24).rotateX(Math.PI/2).translate(0,y,0))),new THREE.MeshBasicMaterial({color:0xffffff})]],
      45,9,[0.8,2],[null,[0x19e0d0,0xff4fd8,0xffd21f,0x7aff5a]]);
    // discos voadores
    grupo([[new THREE.SphereGeometry(1,20,8).scale(3,0.55,3).translate(0,13,0),new THREE.MeshStandardMaterial({color:lin(0xbfc6d2),roughness:0.3,metalness:0.6})],
      [new THREE.SphereGeometry(1.3,14,10,0,Math.PI*2,0,Math.PI/2).translate(0,13.3,0),brilho(0x7fe8ff)],
      [mesclar([0,1,2,3,4,5,6,7].map(k=>new THREE.SphereGeometry(0.22,6,5).translate(2.9*Math.cos(k*Math.PI/4),12.9,2.9*Math.sin(k*Math.PI/4)))),brilho(0xffe14d)]],16,4,[0.9,1.4],null,{f:(t,b)=>{const a=t*0.3+b.fase;return{dx:Math.cos(a)*10,dz:Math.sin(a)*10,dy:Math.sin(t*1.3+b.fase)*1.2,yaw:t*1.5};}});
    // robozinhos
    grupo([[mesclar([B(1.2,1.4,0.8,0,1.5,0),B(0.9,0.8,0.8,0,2.65,0),B(0.3,0.8,0.3,-0.35,0.4,0),B(0.3,0.8,0.3,0.35,0.4,0),B(0.25,1,0.25,-0.75,1.5,0),B(0.25,1,0.25,0.75,1.5,0),
        new THREE.CylinderGeometry(0.04,0.04,0.5,5).translate(0,3.3,0)]),new THREE.MeshStandardMaterial({color:lin(0xd8dde6),roughness:0.4,metalness:0.5})],
      [mesclar([B(0.18,0.18,0.05,-0.2,2.7,0.41),B(0.18,0.18,0.05,0.2,2.7,0.41),B(0.5,0.3,0.05,0,1.6,0.41)]),brilho(0x19e0d0)],
      [new THREE.SphereGeometry(0.14,8,6).translate(0,3.6,0),brilho(0xff3b3b)]],34,1.5,[1,1.6],null,{f:(t,b)=>({roll:Math.sin(t*4+b.fase)*0.08,yaw:Math.sin(t*0.5+b.fase)*0.8})});
    // céu estrelado
    const pos=[];for(let i=0;i<900;i++){const t=rnd()*Math.PI*2,y=rnd()*0.95+0.03,r=Math.sqrt(1-y*y);pos.push(cx+Math.cos(t)*r*1000,y*1000-40,cz+Math.sin(t)*r*1000);}
    const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    cena.add(new THREE.Points(ge,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,fog:false})));
  },
};
