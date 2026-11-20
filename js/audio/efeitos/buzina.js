// Turbo Kids · Som: buzina (recebe as duas notas do carro). Chamado como Som.buzina() (this = Som).
export default function buzina(freqs){if(!this.ctx)return;const c=this.ctx,t=c.currentTime;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=2200;
    const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.16,t+0.02);g.gain.setValueAtTime(0.16,t+0.38);
    g.gain.exponentialRampToValueAtTime(0.001,t+0.5);f.connect(g);g.connect(this.master);
    for(const fr of freqs){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=fr;o.connect(f);o.start(t);o.stop(t+0.52);}}
