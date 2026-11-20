// Turbo Kids · Toca as músicas de audio/musicas/ (geradas na hora, sem arquivos de áudio).
import aventura from './musicas/aventura.js';
import {save} from '../nucleo/salvo.js';
import {Som} from './som.js';

export const NOTAS={C:0,'C#':1,Db:1,D:2,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,Ab:8,A:9,Bb:10,B:11};
export const TIPOS_ACORDE={'':[0,4,7],m:[0,3,7],'7':[0,4,7,10],m7:[0,3,7,10],maj7:[0,4,7,11]};
export function tonsAcorde(nome){const m=/^([A-G][#b]?)(.*)$/.exec(nome);let r=NOTAS[m[1]];if(r>6)r-=12;
  return(TIPOS_ACORDE[m[2]]||TIPOS_ACORDE[''] ).map(s=>261.63*Math.pow(2,(r+s)/12));}
export const Musica={tocando:false,timer:null,estilo:aventura,
  iniciar(estilo){if(estilo)this.estilo=estilo;
    if(!save.musica||!Som.ctx||this.tocando)return;const c=Som.ctx;
    this.g=c.createGain();this.g.gain.value=0.32;this.g.connect(Som.master);
    this.tocando=true;this.passo=0;this.prox=c.currentTime+0.1;
    this.timer=setInterval(()=>this.agendar(),40);},
  parar(){if(!this.tocando)return;this.tocando=false;clearInterval(this.timer);
    const g=this.g,t=Som.ctx.currentTime;g.gain.setTargetAtTime(0,t,0.05);setTimeout(()=>g.disconnect(),400);},
  nota(f,t,dur,vol,tipo){const c=Som.ctx,o=c.createOscillator(),g=c.createGain();o.type=tipo;o.frequency.value=f;
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(g);g.connect(this.g);o.start(t);o.stop(t+dur+0.02);},
  ruido(t,freq,tipoFiltro,vol,dur){if(!Som.buf)return;const c=Som.ctx,s=c.createBufferSource();s.buffer=Som.buf;const f=c.createBiquadFilter();f.type=tipoFiltro;f.frequency.value=freq;
    const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);s.connect(f);f.connect(g);g.connect(this.g);s.start(t,Math.random()*0.5);s.stop(t+dur+0.01);},
  batida(t,f0,f1,vol,dur){const c=Som.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur*0.85);
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(g);g.connect(this.g);o.start(t);o.stop(t+dur+0.01);},
  agendar(){const c=Som.ctx,E=this.estilo,col=60/E.bpm/2,n=E.passos||8;
    if(!E.tons)E.tons=E.acordes.map(tonsAcorde);
    const tem=(s,i)=>s&&s[i%s.length]==='x';
    while(this.prox<c.currentTime+0.2){const p=this.passo,t=this.prox,i=p%n,ac=E.tons[Math.floor(p/n)%E.tons.length];
      const b=E.baixo[i%E.baixo.length],fb=b==='R'?ac[0]/2:b==='O'?ac[0]:b==='F'?ac[2]/2:b==='L'?ac[0]/4:0;
      if(fb)this.nota(fb,t,col*(b==='L'?3:0.9),0.11,E.baixoTipo||'triangle');
      const a=E.arp[i%E.arp.length];if(a!=='.'){const k=+a;this.nota((ac[k%ac.length]||ac[0])*2*(k>=ac.length?2:1),t,col*(E.arpDur||0.6),E.arpVol||0.025,E.arpTipo||'square');}
      const m=E.mel[p%E.mel.length];if(m!=='.'){const k=+m;this.nota(k<3?ac[k]*2:ac[k-3]*4,t,col*(E.melDur||1.6),E.melVol||0.035,E.melTipo||'triangle');}
      if(tem(E.sino,i))this.nota(ac[0]*8,t,col*3,0.018,'sine');
      if(tem(E.bumbo,i))this.batida(t,140,45,0.18,0.14);
      if(tem(E.tom,i))this.batida(t,220,110,0.14,0.18);
      if(tem(E.caixa,i))this.ruido(t,1800,'bandpass',E.caixaVol||0.08,0.1);
      if(tem(E.chimbal,i))this.ruido(t,7000,'highpass',E.chimbalVol||0.05,0.04);
      this.passo++;this.prox+=col;}},
};
