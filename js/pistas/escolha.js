// Turbo Kids · Pista escolhida no mapa.
import {clamp} from '../nucleo/util.js';
import {save} from '../nucleo/salvo.js';

export const pistaAtual=()=>clamp(Math.round(save.pista||save.nivel),1,save.nivel);
