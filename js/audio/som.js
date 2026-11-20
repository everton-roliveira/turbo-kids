// Turbo Kids · Contexto de áudio, motor e sons básicos; cada efeito fica em audio/efeitos/.
import batida from './efeitos/batida.js';
import buraco from './efeitos/buraco.js';
import turbo from './efeitos/turbo.js';
import moedas from './efeitos/moedas.js';
import moeda from './efeitos/moeda.js';
import estrela from './efeitos/estrela.js';
import pouso from './efeitos/pouso.js';
import buzina from './efeitos/buzina.js';
import vitoria from './efeitos/vitoria.js';
import fogos from './efeitos/fogos.js';
import {save} from '../nucleo/salvo.js';

export const Som={ctx:null,
  iniciar(){
    if(this.ctx){if(this.ctx.state==='suspended')this.ctx.resume();return;}
    try{
      const AC=window.AudioContext||window.webkitAudioContext;this.ctx=new AC();const c=this.ctx;
      this.master=c.createGain();this.master.gain.value=save.som?0.6:0;this.master.connect(c.destination);
      const o=c.createOscillator();o.type='sawtooth';const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=650;
      const g=c.createGain();g.gain.value=0;o.connect(f);f.connect(g);g.connect(this.master);o.start();this.motor={o,g};
      const b=c.createBuffer(1,c.sampleRate,c.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;this.buf=b;
    }catch(e){this.ctx=null;}
  },
  ligar(b){if(this.master)this.master.gain.value=b?0.6:0;},
  motorAtualizar(v,ligado,turbo){if(!this.motor)return;const t=this.ctx.currentTime;
    this.motor.o.frequency.setTargetAtTime(42+v*2.2+(turbo?45:0),t,0.08);this.motor.g.gain.setTargetAtTime(ligado?0.06:0,t,0.15);},
  bip(freq,dur=0.15,vol=0.15,tipo='square',quando=0){if(!this.ctx)return;const c=this.ctx,t=c.currentTime+quando;
    const o=c.createOscillator(),g=c.createGain();o.type=tipo;o.frequency.value=freq;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.connect(g);g.connect(this.master);o.start(t);o.stop(t+dur+0.02);},
  ruido(dur,freq,vol,tipo='lowpass',freqFim){if(!this.ctx)return;const c=this.ctx,t=c.currentTime;const s=c.createBufferSource();s.buffer=this.buf;
    const f=c.createBiquadFilter();f.type=tipo;f.frequency.setValueAtTime(freq,t);if(freqFim)f.frequency.exponentialRampToValueAtTime(freqFim,t+dur);
    const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);s.connect(f);f.connect(g);g.connect(this.master);s.start(t);s.stop(t+dur);},
  batida,
  buraco,
  turbo,
  moedas,
  moeda,
  estrela,
  pouso,
  buzina,
  vitoria,
  fogos,
};
