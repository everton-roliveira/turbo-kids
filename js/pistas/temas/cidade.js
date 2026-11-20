// Turbo Kids · Pista: Cidade.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/funk.js';
import {lin} from '../../nucleo/util.js';
import {TEX} from '../../nucleo/texturas.js';

export default {
  nome:'Cidade',ico:'🏙️',musica,
  ceu:0xa9d4f5,ceuTopo:0x4b88cc,nevoa:0xd6e4ef,chao:0x6f7377,arvore:0x2f7d32,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {rnd,dm,plantar,instancia}=h;
    const qtd=150,im=instancia(new THREE.BoxGeometry(1,1,1).translate(0,0.5,0),new THREE.MeshStandardMaterial({map:TEX.predio,roughness:0.6,metalness:0.1}),qtd);
    const cores=[0xe8d9c4,0xc9d6e3,0xf0c9a8,0xb8c4b0,0xd9d9d9,0xa9b8cf,0xe6b8b8,0xf2e1a6].map(lin);const cor=new THREE.Color();
    im.count=plantar(qtd,()=>{const w=8+rnd()*12,d=8+rnd()*12;return{w,d,h:14+rnd()*rnd()*60,r:Math.hypot(w,d)/2+2};},(n,x,z,o)=>{
      dm.position.set(x,0,z);dm.rotation.set(0,rnd()*Math.PI,0);dm.scale.set(o.w,o.h,o.d);dm.updateMatrix();im.setMatrixAt(n,dm.matrix);
      im.setColorAt(n,cor.copy(cores[n%cores.length]));});
    if(im.instanceColor)im.instanceColor.needsUpdate=true;
  },
};
