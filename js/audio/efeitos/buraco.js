// Turbo Kids · Som: cair no buraco. Chamado como Som.buraco() (this = Som).
export default function buraco(){if(!this.ctx)return;const c=this.ctx,t=c.currentTime;const o=c.createOscillator(),g=c.createGain();o.type='sine';
    o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(40,t+0.3);g.gain.setValueAtTime(0.5,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.32);
    o.connect(g);g.connect(this.master);o.start(t);o.stop(t+0.35);this.ruido(0.2,500,0.25);}
