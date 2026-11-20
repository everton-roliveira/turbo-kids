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

/* ================= Música (gerada na hora, sem arquivos): um estilo para cada cenário ================= */
/* acordes: 'C','Am','G7'...  Por passo (colcheia): baixo R=tônica grave, O=tônica, F=quinta, L=tônica bem grave;
   arp/mel = índice da nota do acorde (mel 3-5 = uma oitava acima), '.' = pausa; bateria: x = toca */
const ESTILOS={
  aventura:{bpm:144,acordes:['C','G','Am','F'],baixo:'RORORORO',arp:'01210212',mel:'2210122.111.244.',bumbo:'x...x...',chimbal:'.x.x.x.x'},
  tropical:{bpm:116,acordes:['F','C','G','C'],baixo:'R..F.R..',arp:'.0.1.2.1',arpTipo:'sine',arpVol:0.05,mel:'2.4.3.2.1.2.0...',melTipo:'sine',bumbo:'x..x..x.',chimbal:'..x...x.',caixa:'....x...'},
  deserto:{bpm:108,acordes:['Dm','Eb','Dm','C'],baixo:'R.R.F.R.',arp:'0120.21.',arpTipo:'sawtooth',arpVol:0.015,mel:'0.1.2.1.0..2.1.0',melTipo:'triangle',tom:'x..x.x..',chimbal:'.x.x.x.x'},
  funk:{bpm:124,acordes:['Am7','Dm7','Am7','E7'],baixo:'R.OR.FR.',arp:'.2.2.2.3',arpTipo:'square',arpVol:0.02,mel:'4.3.2...3.4.5...',melTipo:'square',melVol:0.025,bumbo:'x..x..x.',caixa:'..x...x.',chimbal:'xxxxxxxx'},
  inverno:{bpm:132,acordes:['C','Am','F','G'],baixo:'R...F...',arp:'02120212',arpTipo:'sine',arpVol:0.04,mel:'4.3.2.3.4.4.4...',melTipo:'sine',sino:'x.......',chimbal:'xxxxxxxx',chimbalVol:0.03},
  noturna:{bpm:96,acordes:['Am','F','C','G'],baixo:'R.......',arp:'0.1.2.1.',arpTipo:'sine',arpVol:0.05,mel:'2...1...0...1...',melTipo:'triangle',bumbo:'x.......',chimbal:'....x...'},
  caixinha:{bpm:132,acordes:['F','Dm','Bb','C'],baixo:'R...R...',arp:'01231210',arpTipo:'sine',arpVol:0.045,mel:'5.4.3.4.5.5.5...',melTipo:'sine',sino:'x...x...',chimbal:'..x...x.'},
  tribal:{bpm:120,acordes:['Am','G','Am','Em'],baixo:'R..R..R.',arp:'.0..2..1',arpTipo:'triangle',arpVol:0.04,mel:'2.2.4.2.1...0...',melTipo:'triangle',tom:'x.xx.x..',bumbo:'x...x...'},
  espaco:{bpm:92,acordes:['Em','C','G','D'],baixo:'L.......',arp:'02120212',arpTipo:'sine',arpVol:0.04,arpDur:1.6,mel:'4.......3.......',melTipo:'sine',melDur:5},
  country:{bpm:150,acordes:['G','C','D','G'],baixo:'R.F.R.F.',arp:'.2.2.2.2',arpTipo:'triangle',arpVol:0.03,mel:'0.1.2.4.3.2.1...',melTipo:'square',melVol:0.025,bumbo:'x...x...',caixa:'..x...x.'},
  fantasia:{bpm:108,acordes:['D','Bm','G','A'],baixo:'R...R...',arp:'01234321',arpTipo:'triangle',arpVol:0.035,mel:'4...3.2.1...2...',melTipo:'sine',sino:'x.......',bumbo:'x.......'},
  pirata:{bpm:150,passos:6,acordes:['Dm','Gm','A7','Dm'],baixo:'R..F..',arp:'.12.12',arpTipo:'square',arpVol:0.02,mel:'0.12.24.32.1',melTipo:'triangle',bumbo:'x..x..',caixa:'...x..'},
  travessa:{bpm:126,acordes:['F','C','Dm','C'],baixo:'R.F.R.F.',arp:'0.2.1.2.',arpTipo:'square',arpVol:0.02,mel:'2.0.2.4.3.1.0...',melTipo:'triangle',chimbal:'.x.x.x.x',tom:'....x...'},
  gelo:{bpm:120,acordes:['Am','Em','F','C'],baixo:'R...F...',arp:'02120212',arpTipo:'sine',arpVol:0.045,mel:'2...3...4...3...',melTipo:'sine',melDur:3,sino:'x...x...'},
  rock:{bpm:140,acordes:['E','G','A','G'],baixo:'RRRRRRRR',baixoTipo:'sawtooth',arp:'0.0.0.0.',arpTipo:'square',arpVol:0.02,mel:'2.2.1.0...2.1.0.',melTipo:'square',melVol:0.03,bumbo:'x...x.x.',caixa:'..x...x.',chimbal:'xxxxxxxx'},
  circo:{bpm:168,passos:6,acordes:['C','G7','G7','C'],baixo:'R.....',arp:'..12..',arpTipo:'square',arpVol:0.02,mel:'2.34.53.21.0',melTipo:'square',melVol:0.03,bumbo:'x.....',chimbal:'..x.x.'},
  aquatica:{bpm:100,acordes:['Cmaj7','Am7','Fmaj7','G'],baixo:'R...F...',arp:'01232101',arpTipo:'sine',arpVol:0.04,arpDur:1.4,mel:'3...2...1...2...',melTipo:'sine',melDur:3,chimbal:'..x...x.',chimbalVol:0.02},
  savana:{bpm:112,acordes:['C','F','G','F'],baixo:'R..R.F..',arp:'0.1.2.1.',arpTipo:'triangle',arpVol:0.04,mel:'4.4.2.1.2...0...',melTipo:'triangle',tom:'x.x..x.x',chimbal:'.x.x.x.x'},
  synth:{bpm:118,acordes:['Am','F','C','G'],baixo:'RORORORO',baixoTipo:'sawtooth',arp:'01201201',arpTipo:'sawtooth',arpVol:0.018,mel:'4...3...2.3.4...',melTipo:'square',melVol:0.03,bumbo:'x...x...',caixa:'....x...',chimbal:'.x.x.x.x'},
  oriental:{bpm:100,acordes:['Am','Dm','Em','Am'],baixo:'R.......',arp:'0.2.1.0.',arpTipo:'triangle',arpVol:0.045,mel:'4.3.2...0.1.2...',melTipo:'triangle',tom:'x.......'},
  brinquedo:{bpm:138,acordes:['C','F','G','C'],baixo:'R.O.R.O.',arp:'0.1.2.1.',arpTipo:'square',arpVol:0.02,mel:'0.2.4.2.3.1.0...',melTipo:'sine',sino:'....x...',tom:'..x...x.'},
  sonho:{bpm:88,acordes:['Fmaj7','Em7','Dm7','Cmaj7'],baixo:'R.......',arp:'0123.321',arpTipo:'sine',arpVol:0.04,arpDur:2,mel:'3.......2.......',melTipo:'sine',melDur:5},
  jardim:{bpm:128,acordes:['G','Em','C','D'],baixo:'R.F.R.F.',arp:'.1.2.1.2',arpTipo:'triangle',arpVol:0.035,mel:'2.3.4.3.2...1...',melTipo:'sine',chimbal:'.x.x.x.x',caixa:'....x...'},
  natal:{bpm:136,acordes:['G','C','D7','G'],baixo:'R.F.R.F.',arp:'0.1.2.1.',arpTipo:'sine',arpVol:0.04,mel:'2.2.2...2.2.2...',melTipo:'sine',sino:'xxxxxxxx',bumbo:'x...x...'},
  trem:{bpm:156,acordes:['A','D','E','A'],baixo:'R.F.R.F.',arp:'.2.2.2.2',arpTipo:'triangle',arpVol:0.03,mel:'0.2.4...3.1.2...',melTipo:'square',melVol:0.025,caixa:'x.x.x.x.',caixaVol:0.03,bumbo:'x...x...'},
};
const NOTAS={C:0,'C#':1,Db:1,D:2,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,Ab:8,A:9,Bb:10,B:11};
const TIPOS_ACORDE={'':[0,4,7],m:[0,3,7],'7':[0,4,7,10],m7:[0,3,7,10],maj7:[0,4,7,11]};
function tonsAcorde(nome){const m=/^([A-G][#b]?)(.*)$/.exec(nome);let r=NOTAS[m[1]];if(r>6)r-=12;
  return(TIPOS_ACORDE[m[2]]||TIPOS_ACORDE[''] ).map(s=>261.63*Math.pow(2,(r+s)/12));}
const Musica={tocando:false,timer:null,estilo:ESTILOS.aventura,
  iniciar(nome){if(nome)this.estilo=ESTILOS[nome]||ESTILOS.aventura;
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

