// Turbo Kids · Roda esportiva: 10 raios finos pretos, borda e cubo vermelhos.
import {mesclar} from '../../nucleo/mesclar.js';
import {fixa,barril,borda,cubo,raio,metal,pintado} from './util.js';

const RAIOS=fixa(mesclar([barril(),...Array.from({length:10},(_,k)=>raio(k*Math.PI/5,.028,.03))]));
const DETALHE=fixa(mesclar([borda(.236,.02),cubo(.055)]));
export default {
  id:'esportiva',nome:'Esportiva',preco:500,
  criar({gira,add}){add(gira,RAIOS,metal('#1b1b1f'));add(gira,DETALHE,pintado('#e3120b'));},
};
