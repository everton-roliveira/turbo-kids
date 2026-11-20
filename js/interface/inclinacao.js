// Turbo Kids · Virar inclinando o celular.
import {mod} from '../nucleo/util.js';
import {save} from '../nucleo/salvo.js';
import {entrada} from '../corrida/estado.js';

export const Inclinacao={ouvindo:false,
  async pedir(){
    if(!window.DeviceOrientationEvent)return false;
    try{if(typeof DeviceOrientationEvent.requestPermission==='function'){const r=await DeviceOrientationEvent.requestPermission();if(r!=='granted')return false;}}catch(e){return false;}
    this.ouvir();return true;},
  ouvir(){if(this.ouvindo)return;this.ouvindo=true;
    addEventListener('deviceorientation',e=>{if(e.beta==null||e.gamma==null)return;
      const b=e.beta*Math.PI/180,g=e.gamma*Math.PI/180;
      const ang=mod(Math.round(((screen.orientation&&screen.orientation.angle!=null)?screen.orientation.angle:(window.orientation||0))),360);
      const ux=-Math.cos(b)*Math.sin(g),uy=Math.sin(b);
      const t=ang===90?uy:ang===180?ux:ang===270?-uy:-ux;
      const zona=0.06,cheio=0.34,a=Math.abs(t);
      entrada.incl=a<zona?0:Math.sign(t)*Math.min(1,(a-zona)/(cheio-zona));});},
};
if(save.inclinar&&!(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function'))Inclinacao.ouvir();
else if(save.inclinar){// no iPhone a permissão precisa de um toque: pede no primeiro toque
  addEventListener('pointerdown',function f(){removeEventListener('pointerdown',f);Inclinacao.pedir();},{once:true});}
