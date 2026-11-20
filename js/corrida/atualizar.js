// Turbo Kids · Um quadro da corrida.
import {$} from '../nucleo/util.js';
import {modo,mudarModo} from '../nucleo/render.js';
import {Som} from '../audio/som.js';
import {Musica} from '../audio/musica.js';
import {Voz,comNome} from '../audio/voz.js';
import {animarCenario} from '../pistas/animacao.js';
import {corrida} from './estado.js';
import {checarChegada,checarObstaculos,colisoes,fisica} from './fisica.js';
import {controlarJogador} from './jogador.js';
import {controlarIA} from './ia.js';
import {atualizarMoedas,atualizarVisual} from './visual.js';
import {atualizarCamera} from './camera.js';
import {atualizarHUD,narrar} from './hud.js';
import {Tutorial} from '../interface/tutorial.js';
import {mostrarResultado} from '../interface/telas.js';

export function atualizarCorrida(dt){
  corrida.tCen+=dt;animarCenario(corrida.animados,corrida.tCen);
  const ct=$('#contagem');
  atualizarMoedas(dt);
  if(modo==='contagem'){
    corrida.contagem-=dt;const n=Math.ceil(corrida.contagem-0.6);
    if(n!==corrida.ultimoNum){corrida.ultimoNum=n;
      if(n>0){ct.textContent=n;ct.className='';Som.bip(440,0.18,0.15);Voz.falar(['','Um','Dois','Três'][n]||String(n),{urgente:true});}
      else{ct.textContent='VAI!';ct.className='vai';Som.bip(880,0.4,0.18);Voz.falar(comNome('Vai{n}!'),{urgente:true});}}
    if(corrida.contagem<=0){mudarModo('corrida');Musica.iniciar(corrida.tema.musica);setTimeout(()=>{if(modo!=='contagem')ct.hidden=true;},700);}
    Som.motorAtualizar(0,true,false);atualizarCamera(dt,false);if(corrida.tut)Tutorial.atualizar(corrida.tut,0);return;
  }
  for(const c of corrida.carros){if(c.estado!=='normal')continue;if(c.ia)controlarIA(c,dt);else controlarJogador(c);}
  for(const c of corrida.carros)fisica(c,dt);
  colisoes();
  for(const c of corrida.carros){checarObstaculos(c);checarChegada(c);}
  for(const c of corrida.carros)atualizarVisual(c,dt);
  atualizarCamera(dt,false);atualizarHUD();narrar();
  if(corrida.tut)Tutorial.atualizar(corrida.tut,dt);
  const j=corrida.jogador;Som.motorAtualizar(j.v,true,j.turboT>0);
  if(j.terminou){if(!corrida.fimT)$('#hud').classList.add('chegou');corrida.fimT+=dt;j.vmax=Math.max(18,j.vmax-dt*22);if(corrida.fimT>4.6&&!corrida.mostrou)mostrarResultado();}
}
