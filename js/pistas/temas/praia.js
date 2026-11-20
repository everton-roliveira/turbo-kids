// Turbo Kids · Pista: Praia.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/tropical.js';

export default {
  nome:'Praia',ico:'🏖️',musica,
  ceu:0x9fdcff,ceuTopo:0x2f8be0,nevoa:0xd9f1ff,chao:0xe6cf94,arvore:0x2e8b3a,tronco:0x8a6a3e,luz:1.08,mar:true,
  decorar(h){
    const {palmeiras}=h;
    palmeiras(160);
  },
};
