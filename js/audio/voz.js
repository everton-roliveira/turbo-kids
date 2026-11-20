// Turbo Kids · Voz em português (o celular fala).
import {save} from '../nucleo/salvo.js';

export const Voz={voz:null,ultimo:{},
  escolher(){try{const vs=speechSynthesis.getVoices();this.voz=vs.find(v=>/pt[-_]BR/i.test(v.lang))||vs.find(v=>/^pt/i.test(v.lang))||null;}catch(e){}},
  falar(txt,{urgente=false,chave=null,espera=0}={}){
    if(!save.voz||!window.speechSynthesis)return;
    if(chave){const ag=performance.now();if(ag-(this.ultimo[chave]||-1e9)<espera*1000)return;this.ultimo[chave]=ag;}
    try{if(urgente)speechSynthesis.cancel();if(!this.voz)this.escolher();
      const u=new SpeechSynthesisUtterance(txt);u.lang='pt-BR';if(this.voz)u.voice=this.voz;u.rate=1.08;u.pitch=1.15;u.volume=1;
      speechSynthesis.speak(u);}catch(e){}},
};
try{if(window.speechSynthesis){Voz.escolher();speechSynthesis.addEventListener('voiceschanged',()=>Voz.escolher());}}catch(e){}
export const nomeJogador=()=>(save.nome||'').trim();
export const comNome=(txt)=>{const n=nomeJogador();return n?txt.replace('{n}',', '+n.charAt(0)+n.slice(1).toLowerCase()):txt.replace('{n}','');};
