// Turbo Kids · Oficina: melhorias, preços e o que cada uma faz no carro.
import {save} from '../nucleo/salvo.js';

export const MELHORIAS=[
  {id:'motor',nome:'Motor',ico:'🔥',txt:'Mais velocidade'},
  {id:'acel',nome:'Aceleração',ico:'⚡',txt:'Arranca mais rápido'},
  {id:'amort',nome:'Amortecedor',ico:'🔧',txt:'Buraco atrapalha menos'},
  {id:'pneu',nome:'Pneus',ico:'🎯',txt:'Vira mais rápido'},
];
export const PRECOS=[200,400,700,1100,1600], MAX_UP=5;
export function statsJogador(){const u=save.up;return{
  vmax:52+u.motor*6, acel:19+u.acel*4, lat:13+u.pneu*1.6, rateLat:8+u.pneu,
  fatorLento:Math.min(0.95,0.68+u.amort*0.06), lentoDur:Math.max(0.4,1.1-u.amort*0.14), perdaBuraco:Math.min(0.95,0.68+u.amort*0.06)};}
