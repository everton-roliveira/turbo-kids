// Turbo Kids · Pista: Campo Verde.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/aventura.js';

export default {
  nome:'Campo Verde',ico:'🌳',musica,
  ceu:0x8ccfff,ceuTopo:0x3f8fe0,nevoa:0xcfeaff,chao:0x4fa64a,arvore:0x2f7d32,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {pinheiros}=h;
    pinheiros(180);
  },
};
