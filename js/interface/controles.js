// Turbo Kids · Botões na tela e teclado.
import {$} from '../nucleo/util.js';
import {modo} from '../nucleo/render.js';
import {Som} from '../audio/som.js';
import {Musica} from '../audio/musica.js';
import {entrada} from '../corrida/estado.js';
import {buzinar,usarTurbo} from '../corrida/acoes.js';
import {continuar,pausar} from './telas.js';

export function segurar(el,on,off){
  el.addEventListener('pointerdown',e=>{e.preventDefault();try{el.setPointerCapture(e.pointerId);}catch(_){}el.classList.add('ativo');on();});
  const solta=()=>{el.classList.remove('ativo');off();};
  el.addEventListener('pointerup',solta);el.addEventListener('pointercancel',solta);el.addEventListener('lostpointercapture',solta);
  el.addEventListener('contextmenu',e=>e.preventDefault());
}
segurar($('#bEsq'),()=>entrada.esq=true,()=>entrada.esq=false);
segurar($('#bDir'),()=>entrada.dir=true,()=>entrada.dir=false);
segurar($('#bAcel'),()=>entrada.acel=true,()=>entrada.acel=false);
segurar($('#bTurbo'),usarTurbo,()=>{});
segurar($('#bBuzina'),buzinar,()=>{});
export const teclas={ArrowLeft:'esq',KeyA:'esq',ArrowRight:'dir',KeyD:'dir',ArrowUp:'acel',KeyW:'acel'};
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;
  if(teclas[e.code]){entrada[teclas[e.code]]=true;e.preventDefault();}
  else if(e.code==='Space'||e.code==='ShiftLeft'){usarTurbo();e.preventDefault();}
  else if(e.code==='KeyH'||e.code==='KeyB'){if(!e.repeat)buzinar();}
  else if(e.code==='KeyP'||e.code==='Escape'){modo==='pausa'?continuar():pausar();}});
addEventListener('keyup',e=>{if(teclas[e.code])entrada[teclas[e.code]]=false;});
document.addEventListener('touchmove',e=>{if(modo!=='garagem')e.preventDefault();},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden){pausar();Musica.parar();}});
addEventListener('pointerdown',()=>{if(Som.ctx&&Som.ctx.state==='suspended')Som.ctx.resume();},{passive:true});
$('#cena').addEventListener('pointerdown',()=>{if(modo==='garagem')buzinar();});
