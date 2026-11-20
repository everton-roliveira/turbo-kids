// Turbo Kids · Controle do carro da criança.
import {clamp,mod} from '../nucleo/util.js';
import {save} from '../nucleo/salvo.js';
import {FAIXAS,P} from '../pistas/tracado.js';
import {corrida,entrada} from './estado.js';

export function controlarJogador(c){
  c.acelerando=save.auto||entrada.acel;
  let steer=(entrada.dir?1:0)-(entrada.esq?1:0);
  if(save.inclinar&&!steer)steer=entrada.incl;
  c.alvoVd=steer*c.lat*Math.min(1,0.4+c.v/25);
  // desvio no turbo (opção da garagem): só durante o turbo, de botão ou de faixa, e sem a criança virar
  if(!steer&&save.desvioTurbo&&c.turboT>0){const s=mod(c.prog,P.L);
    for(const b of corrida.obs.bloqueios){const a=mod(b.s-s,P.L);
      if(a>2&&a<30+c.v*0.9&&Math.abs(c.d-b.d)<4.2){
        const livre=FAIXAS.filter(f=>Math.abs(f-b.d)>=4.5).sort((x,y)=>Math.abs(x-c.d)-Math.abs(y-c.d))[0];
        if(livre!==undefined)c.alvoVd=clamp((livre-c.d)*3,-c.lat,c.lat);break;}}}
}
