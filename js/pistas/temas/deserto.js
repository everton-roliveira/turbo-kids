// Turbo Kids · Pista: Deserto.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/deserto.js';
import {lin} from '../../nucleo/util.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Deserto',ico:'🌵',musica,
  ceu:0xffd9a0,ceuTopo:0x5aa0e8,nevoa:0xffe9c7,chao:0xd9b06a,arvore:0x4f8a3a,tronco:0x7a5a33,luz:1.05,
  decorar(h){
    const {tema,rnd,dm,plantar,instancia}=h;
    const g=mesclar([new THREE.CylinderGeometry(0.5,0.55,5,8).translate(0,2.5,0),new THREE.SphereGeometry(0.5,8,6).translate(0,5,0),
      new THREE.CylinderGeometry(0.3,0.3,1.4,7).rotateZ(Math.PI/2).translate(0.9,2.2,0),new THREE.CylinderGeometry(0.3,0.3,1.8,7).translate(1.5,3.0,0),new THREE.SphereGeometry(0.3,7,5).translate(1.5,3.9,0),
      new THREE.CylinderGeometry(0.28,0.28,1.2,7).rotateZ(Math.PI/2).translate(-0.8,3.0,0),new THREE.CylinderGeometry(0.28,0.28,1.4,7).translate(-1.3,3.6,0),new THREE.SphereGeometry(0.28,7,5).translate(-1.3,4.3,0)]);
    const im=instancia(g,new THREE.MeshLambertMaterial({color:lin(tema.arvore)}),150);
    const pedra=instancia(new THREE.DodecahedronGeometry(1.6,0),new THREE.MeshLambertMaterial({color:lin(0xb07a4a)}),60);
    im.count=plantar(150,()=>({r:3}),(n,x,z)=>{const sc=0.7+rnd()*0.8;dm.position.set(x,0,z);dm.rotation.set(0,rnd()*Math.PI*2,0);dm.scale.set(sc,sc,sc);dm.updateMatrix();im.setMatrixAt(n,dm.matrix);});
    pedra.count=plantar(60,()=>({r:3}),(n,x,z)=>{const sc=0.6+rnd()*1.6;dm.position.set(x,0.4*sc,z);dm.rotation.set(rnd()*3,rnd()*3,0);dm.scale.set(sc*1.3,sc*0.7,sc);dm.updateMatrix();pedra.setMatrixAt(n,dm.matrix);});
  },
};
