// Turbo Kids · Pista: Safári.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/savana.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Safári',ico:'🦒',musica,
  ceu:0xffe0a0,ceuTopo:0x5aa0e8,nevoa:0xffe9c0,chao:0xd8b060,arvore:0x5f8a2a,tronco:0x6b4a2b,luz:1.05,
  decorar(h){
    const {tema,mat,grupo,B}=h;
    // acácias
    grupo([[mesclar([new THREE.CylinderGeometry(0.3,0.45,5,7).translate(0,2.5,0),new THREE.CylinderGeometry(0.15,0.2,2.2,6).rotateZ(0.7).translate(-0.7,5.4,0)]),mat(tema.tronco)],
      [new THREE.CylinderGeometry(4,3.2,1.2,12).translate(0,6.1,0),mat(tema.arvore)]],70,5,[0.8,1.3]);
    // capim
    grupo([[new THREE.ConeGeometry(0.6,1.4,5).translate(0,0.7,0),mat(0xb5b84a)]],180,1,[0.7,1.4]);
    // girafas
    const pernas=(x,z,h,r)=>[[-x,-z],[x,-z],[-x,z],[x,z]].map(([a,b])=>new THREE.CylinderGeometry(r,r,h,7).translate(a,h/2,b));
    grupo([[mesclar([new THREE.SphereGeometry(1,12,8).scale(0.9,0.9,1.5).translate(0,3.6,0),...pernas(0.5,0.9,3.4,0.15),
        new THREE.CylinderGeometry(0.22,0.35,4,8).rotateX(0.35).translate(0,6.0,1.6),new THREE.SphereGeometry(1,10,8).scale(0.35,0.35,0.6).translate(0,8,2.5)]),mat(0xf2c14e)],
      [mesclar([B(0.4,0.3,0.4,0.85,3.9,0.4),B(0.4,0.3,0.4,-0.85,3.6,-0.5),B(0.4,0.3,0.4,0.85,3.3,-0.7),B(0.4,0.3,0.4,-0.85,4.0,0.6),B(0.4,0.4,0.2,0,4.2,1.45),
        new THREE.CylinderGeometry(0.06,0.06,0.5,5).translate(-0.15,8.45,2.3),new THREE.CylinderGeometry(0.06,0.06,0.5,5).translate(0.15,8.45,2.3),
        new THREE.SphereGeometry(0.08,5,4).translate(-0.3,8.1,2.75),new THREE.SphereGeometry(0.08,5,4).translate(0.3,8.1,2.75)]),mat(0x7a4a1e)]],28,4,[1,1.4],null,{f:(t,b)=>({yaw:Math.sin(t*0.3+b.fase)*0.5})});
    // elefantes
    grupo([[mesclar([new THREE.SphereGeometry(1,14,10).scale(1.5,1.4,2.1).translate(0,2.9,0),...pernas(0.8,1.1,2.2,0.4),new THREE.SphereGeometry(0.95,12,10).translate(0,3.6,2.2),
        new THREE.CylinderGeometry(0.22,0.32,1.6,8).rotateX(0.25).translate(0,2.6,3.0),new THREE.CylinderGeometry(0.18,0.22,1.0,8).rotateX(-0.6).translate(0,1.65,3.35),
        new THREE.CylinderGeometry(1,1,0.12,14).rotateZ(Math.PI/2).rotateY(0.4).translate(-1,3.7,1.8),new THREE.CylinderGeometry(1,1,0.12,14).rotateZ(Math.PI/2).rotateY(-0.4).translate(1,3.7,1.8)]),mat(0x9b9ea6)],
      [mesclar([new THREE.SphereGeometry(0.12,6,5).translate(-0.45,3.9,2.95),new THREE.SphereGeometry(0.12,6,5).translate(0.45,3.9,2.95)]),mat(0x111111)]],20,5,[1,1.3],null,{f:(t,b)=>({yaw:Math.sin(t*0.25+b.fase)*0.5,roll:Math.sin(t*1.6+b.fase)*0.02})});
  },
};
