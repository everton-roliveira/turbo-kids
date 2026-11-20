// Turbo Kids · Qualidade gráfica automática (tira sombras e reduz resolução se o celular não aguentar).
import {clamp} from './util.js';
import {salvar,save} from './salvo.js';
import {redimensionar,renderer} from './render.js';
import {garagem} from '../garagem/cena.js';
import {corrida} from '../corrida/estado.js';

export const Qualidade={
  nivel:save.qualidade==null?2:clamp(save.qualidade,0,2),medT:0,medN:0,espera:3,
  aplicar(){const dpr=window.devicePixelRatio||1;
    renderer.setPixelRatio(this.nivel===2?Math.min(dpr,2):this.nivel===1?Math.min(dpr,1.5):1);
    const sombra=this.nivel===2;
    if(garagem&&garagem.luz)garagem.luz.castShadow=sombra;
    if(corrida&&corrida.sol)corrida.sol.castShadow=sombra;
    if(typeof redimensionar==='function')redimensionar();},
  medir(dt){if(this.nivel===0)return;if(this.espera>0){this.espera-=dt;return;}
    this.medT+=dt;this.medN++;
    if(this.medT>=3){const fps=this.medN/this.medT;this.medT=0;this.medN=0;
      if(fps<45){this.nivel--;save.qualidade=this.nivel;salvar();this.espera=2;this.aplicar();}}},
  reiniciar(){this.medT=0;this.medN=0;this.espera=3;},
};
