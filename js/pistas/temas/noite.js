// Turbo Kids · Pista: Noite.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/noturna.js';

export default {
  nome:'Noite',ico:'🌙',musica,
  ceu:0x0c1430,ceuTopo:0x04081a,nevoa:0x16204a,chao:0x1f3d2b,arvore:0x123c22,tronco:0x3d2a1c,luz:0.55,noite:true,
  decorar(h){
    const {pinheiros}=h;
    pinheiros(180);
  },
};
