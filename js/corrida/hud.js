// Turbo Kids · Placar na tela e narração.
import {$,clamp} from '../nucleo/util.js';
import {Voz,comNome} from '../audio/voz.js';
import {P} from '../pistas/tracado.js';
import {corrida} from './estado.js';

export const hudCache={};
export function setTxt(id,v){if(hudCache[id]!==v){hudCache[id]=v;document.getElementById(id).textContent=v;}}
export function posicaoJogador(){const j=corrida.jogador;let pos=j.posFinal;if(!pos){pos=1;for(const c of corrida.carros)if(c!==j&&(c.terminou||c.prog>j.prog))pos++;}return pos;}
export function atualizarHUD(){
  const j=corrida.jogador,p=corrida.p;
  const pos=posicaoJogador();
  setTxt('hPos',pos+'º');
  setTxt('hVolta','Volta '+clamp(Math.floor(Math.max(0,j.prog)/P.L)+1,1,p.voltas)+'/'+p.voltas);
  setTxt('hVel',String(Math.round(j.v*4)));
  setTxt('hMoedas',String(corrida.pegas));
  for(const c of corrida.carros)c.ponto.style.left=(clamp(c.prog/(p.voltas*P.L),0,1)*100).toFixed(1)+'%';
  const bt=$('#bTurbo');bt.style.setProperty('--carga',(j.turboT>0?100:j.turboCarga/30*100).toFixed(0)+'%');
  bt.classList.toggle('pronto',j.turboCarga>=30&&j.turboT<=0);bt.classList.toggle('ligado',j.turboT>0);
  $('#turboFx').style.opacity=j.turboT>0?'1':'0';
}
export function narrar(){
  const j=corrida.jogador;if(j.terminou)return;
  if(!corrida.turboAvisado&&j.turboCarga>=30){corrida.turboAvisado=true;Voz.falar('Turbo pronto!',{chave:'turbo',espera:8});}
  const pos=posicaoJogador();
  if(pos!==corrida.posAnt&&corrida.t>4){
    if(pos===1)Voz.falar(comNome('Primeiro lugar{n}!'),{chave:'pos',espera:7});
    else if(pos<corrida.posAnt&&pos<=3)Voz.falar(pos+'º lugar!',{chave:'pos',espera:7});}
  corrida.posAnt=pos;
  const volta=Math.floor(Math.max(0,j.prog)/P.L);
  if(volta!==corrida.voltaAnt){corrida.voltaAnt=volta;if(volta===corrida.p.voltas-1)Voz.falar('Última volta!',{urgente:true});}
}
