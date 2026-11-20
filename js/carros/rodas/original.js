// Turbo Kids · Roda original: a que vem com cada carro (5 raios, na cor do modelo).
import {GEO,matAro} from '../pecas.js';

export default {
  id:'original',nome:'Original',preco:0,
  criar({gira,m,enfeite,add}){add(gira,GEO.aro,matAro(m.aro));},
};
