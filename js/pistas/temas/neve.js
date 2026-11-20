// Turbo Kids · Pista: Neve.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/inverno.js';

export default {
  nome:'Neve',ico:'⛄',musica,
  ceu:0xcfe3f5,ceuTopo:0x7aa6d6,nevoa:0xeef5fb,chao:0xf2f6fa,arvore:0x1f5e3a,tronco:0x5a4030,luz:0.9,
  decorar(h){
    const {pinheiros}=h;
    pinheiros(180);
  },
};
