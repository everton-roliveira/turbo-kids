// Turbo Kids · Dificuldade de cada pista (sobe aos poucos da primeira à última).
import {clamp} from '../nucleo/util.js';
import {TEMAS} from './temas/index.js';

export const progresso=n=>clamp((n-1)/(TEMAS.length-1),0,1);
export function paramsNivel(n){const t=progresso(n);return{
  aiVmax:49+24*t,
  iaAcel:13.8+9.2*t,
  buracos:Math.round(4+11*t),
  bloqueios:Math.round(2+8*t),
  drift:0.08+0.2*t,
  agressao:0.11+0.25*t,
  desvio:0.56+0.39*t,
  folga:1-0.3*t,
  voltas:2};}
