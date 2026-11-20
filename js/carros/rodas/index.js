// Turbo Kids · Modelos de roda (do mais barato ao mais caro). Para criar um novo, faça um arquivo nesta pasta e coloque aqui.
import original from './original.js';
import esportiva from './esportiva.js';
import estrela from './estrela.js';
import aventura from './aventura.js';
import dourada from './dourada.js';
import neon from './neon.js';

export const RODAS=[original,esportiva,estrela,aventura,dourada,neon];
export const RODA=Object.fromEntries(RODAS.map(r=>[r.id,r]));
