// Turbo Kids · Estado da corrida atual e teclas/botões pressionados.
import {geoCache} from '../carros/geometria.js';
import {geosFixas} from '../carros/pecas.js';

export let corrida=null;
export const entrada={acel:false,esq:false,dir:false,incl:0};
export function descartarCorrida(){if(!corrida)return;
  for(const c of corrida.carros)for(const o of c.mesh.userData.proprios||[])o.dispose();
  corrida.cena.traverse(o=>{if(o.geometry&&!geosFixas.has(o.geometry)&&!Object.values(geoCache).some(g=>g.corpo===o.geometry||g.cab===o.geometry))o.geometry.dispose();});
  if(corrida.cena.environment)corrida.cena.environment.dispose();corrida=null;}
// troca o valor a partir de outros módulos (um import não pode ser reatribuído)
export function definirCorrida(v){corrida=v;}
