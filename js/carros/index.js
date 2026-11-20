import rosso from './modelos/rosso.js';
import touro from './modelos/touro.js';
import flecha from './modelos/flecha.js';
import gt from './modelos/gt.js';
import v8 from './modelos/v8.js';
import proto from './modelos/proto.js';
import patrulha from './modelos/patrulha.js';
import onibus from './modelos/onibus.js';
import sirene from './modelos/sirene.js';
import jipe from './modelos/jipe.js';

// a ordem aqui é a ordem na garagem; para criar um carro novo, faça um arquivo em modelos/ e coloque nesta lista
export const CARROS=[rosso,touro,flecha,gt,v8,proto,patrulha,onibus,sirene,jipe];
export const ORDEM_MODELOS=CARROS.map(c=>c.id);
export const MODELOS=Object.fromEntries(CARROS.map(c=>[c.id,c.modelo]));
export const PERSONAGENS=Object.fromEntries(CARROS.map(c=>[c.id,c.personagem]));
export const BUZINAS=Object.fromEntries(CARROS.map(c=>[c.id,c.buzina]));
// preço dos carros que não vêm liberados
export const PRECO_CARRO=Object.fromEntries(CARROS.filter(c=>c.preco).map(c=>[c.id,c.preco]));
