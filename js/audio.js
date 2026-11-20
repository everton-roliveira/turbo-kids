// Turbo Kids · Som, música e voz.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';
/* ================= Som ================= */
const Som={ctx:null,
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
  batida(){this.ruido(0.45,900,0.7);this.bip(90,0.3,0.3,'sine');},
  buraco(){if(!this.ctx)return;const c=this.ctx,t=c.currentTime;const o=c.createOscillator(),g=c.createGain();o.type='sine';
    o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(40,t+0.3);g.gain.setValueAtTime(0.5,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.32);
    o.connect(g);g.connect(this.master);o.start(t);o.stop(t+0.35);this.ruido(0.2,500,0.25);},
  turbo(){this.ruido(0.9,300,0.45,'bandpass',2600);},
  moedas(){[660,880,1320].forEach((f,i)=>this.bip(f,0.14,0.12,'square',i*0.08));},
  moeda(){this.bip(1320,0.07,0.08,'square');this.bip(1760,0.12,0.08,'square',0.05);},
  estrela(){[784,988,1175,1568].forEach((f,i)=>this.bip(f,0.16,0.1,'triangle',i*0.06));},
  pouso(){this.ruido(0.25,350,0.4);this.bip(70,0.2,0.25,'sine');},
  buzina(freqs){if(!this.ctx)return;const c=this.ctx,t=c.currentTime;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=2200;
    const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.16,t+0.02);g.gain.setValueAtTime(0.16,t+0.38);
    g.gain.exponentialRampToValueAtTime(0.001,t+0.5);f.connect(g);g.connect(this.master);
    for(const fr of freqs){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=fr;o.connect(f);o.start(t);o.stop(t+0.52);}},
  vitoria(){[523,659,784,1047,784,1047].forEach((f,i)=>this.bip(f,i>3?0.5:0.18,0.12,'square',i*0.15));},
  fogos(){if(!this.ctx)return;this.ruido(0.5,1800,0.25,'bandpass',300);},
};

/* ================= Música (gerada na hora, sem arquivos) ================= */
const Musica={tocando:false,timer:null,
  iniciar(){if(!save.musica||!Som.ctx||this.tocando)return;const c=Som.ctx;
    this.g=c.createGain();this.g.gain.value=0.32;this.g.connect(Som.master);
    this.tocando=true;this.passo=0;this.prox=c.currentTime+0.1;
    this.timer=setInterval(()=>this.agendar(),40);},
  parar(){if(!this.tocando)return;this.tocando=false;clearInterval(this.timer);
    const g=this.g,t=Som.ctx.currentTime;g.gain.setTargetAtTime(0,t,0.05);setTimeout(()=>g.disconnect(),400);},
  nota(f,t,dur,vol,tipo){const c=Som.ctx,o=c.createOscillator(),g=c.createGain();o.type=tipo;o.frequency.value=f;
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(g);g.connect(this.g);o.start(t);o.stop(t+dur+0.02);},
  agendar(){const c=Som.ctx,colcheia=60/144/2;
    // Dó – Sol – Lá menor – Fá (uma progressão alegre)
    const acordes=[[261.6,329.6,392],[196,246.9,293.7],[220,261.6,329.6],[174.6,220,261.6]];
    const arp=[0,1,2,1,0,2,1,2],mel=[2,2,1,0,1,2,2,-1, 1,1,1,-1,2,4,4,-1];
    while(this.prox<c.currentTime+0.2){const p=this.passo,t=this.prox,ac=acordes[Math.floor(p/8)%4];
      this.nota(ac[0]/2*(p%2?2:1),t,colcheia*0.9,0.11,'triangle');
      this.nota(ac[arp[p%8]]*2,t,colcheia*0.6,0.025,'square');
      const m=mel[p%16];if(m>=0&&p%2===0){const f=m<3?ac[m]*2:ac[m-3]*4;this.nota(f,t,colcheia*1.6,0.035,'triangle');}
      if(p%4===0){const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(45,t+0.12);
        g.gain.setValueAtTime(0.18,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);o.connect(g);g.connect(this.g);o.start(t);o.stop(t+0.15);}
      if(p%2===1&&Som.buf){const s=c.createBufferSource();s.buffer=Som.buf;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=7000;
        const g=c.createGain();g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.04);s.connect(f);f.connect(g);g.connect(this.g);s.start(t);s.stop(t+0.05);}
      this.passo++;this.prox+=colcheia;}},
};

/* ================= Voz (o celular fala em português) ================= */
const Voz={voz:null,ultimo:{},
  escolher(){try{const vs=speechSynthesis.getVoices();this.voz=vs.find(v=>/pt[-_]BR/i.test(v.lang))||vs.find(v=>/^pt/i.test(v.lang))||null;}catch(e){}},
  falar(txt,{urgente=false,chave=null,espera=0}={}){
    if(!save.voz||!window.speechSynthesis)return;
    if(chave){const ag=performance.now();if(ag-(this.ultimo[chave]||-1e9)<espera*1000)return;this.ultimo[chave]=ag;}
    try{if(urgente)speechSynthesis.cancel();if(!this.voz)this.escolher();
      const u=new SpeechSynthesisUtterance(txt);u.lang='pt-BR';if(this.voz)u.voice=this.voz;u.rate=1.08;u.pitch=1.15;u.volume=1;
      speechSynthesis.speak(u);}catch(e){}},
};
try{if(window.speechSynthesis){Voz.escolher();speechSynthesis.addEventListener('voiceschanged',()=>Voz.escolher());}}catch(e){}
const nomeJogador=()=>(save.nome||'').trim();
const comNome=(txt)=>{const n=nomeJogador();return n?txt.replace('{n}',', '+n.charAt(0)+n.slice(1).toLowerCase()):txt.replace('{n}','');};

