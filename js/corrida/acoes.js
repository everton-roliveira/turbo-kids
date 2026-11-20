// Turbo Kids · Turbo e buzina.
import {BUZINAS} from '../carros/index.js';
import {save} from '../nucleo/salvo.js';
import {modo} from '../nucleo/render.js';
import {Som} from '../audio/som.js';
import {garagem} from '../garagem/cena.js';
import {FAIXAS} from '../pistas/tracado.js';
import {corrida} from './estado.js';
import {difProg} from './fisica.js';
import {aviso} from '../interface/telas.js';

export function usarTurbo(){const j=corrida&&corrida.jogador;if(!j||modo!=='corrida'||j.ia)return;
  if(j.turboCarga>=30&&j.turboT<=0&&j.estado==='normal'){j.turboT=3;j.turboCarga=0;corrida.turboAvisado=false;Som.turbo();aviso('TURBO! 🔥','bom');
    // turbo extra (prêmio do anúncio): já fica pronto de novo
    if(corrida.turbosExtra>0){corrida.turbosExtra--;j.turboCarga=30;corrida.turboAvisado=true;}
    if(corrida.tut)corrida.tut.fez.turbo=true;}}
export function buzinar(){
  Som.iniciar();
  if(modo==='garagem'){Som.buzina(BUZINAS[save.modelo]);const r=garagem.carro&&garagem.carro.userData.rosto;if(r)r.reagir(Math.random()<0.5?'feliz':'susto',1.2);return;}
  if(!corrida||modo!=='corrida')return;const j=corrida.jogador;
  Som.buzina(BUZINAS[j.modelo]);if(corrida.tut)corrida.tut.fez.buzina=true;
  // o carro logo à frente sai do caminho
  for(const c of corrida.carros){if(c===j||c.estado!=='normal'||c.terminou)continue;
    const ds=difProg(c,j);if(ds>2&&ds<30&&Math.abs(c.d-j.d)<3.5){
      const opcoes=FAIXAS.filter(f=>Math.abs(f-j.d)>4);c.faixaAlvo=opcoes.sort((a,b)=>Math.abs(a-c.d)-Math.abs(b-c.d))[0];c.afastaT=1.6;c.ramT=0;}}
}
