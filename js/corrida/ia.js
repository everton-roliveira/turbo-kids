// Turbo Kids · Adversários.
import {clamp,mod} from '../nucleo/util.js';
import {FAIXAS,P} from '../pistas/tracado.js';
import {corrida} from './estado.js';
import {difProg} from './fisica.js';

export function controlarIA(c,dt){
  const p=corrida.p,s=mod(c.prog,P.L),j=corrida.jogador;
  c.tDecide-=dt;c.afastaT=Math.max(0,c.afastaT-dt);
  if(c.tDecide<=0&&c.afastaT<=0){c.tDecide=0.2;
    const olhar=22+c.v*0.75;let melhor=c.faixaAlvo,menor=Infinity;
    for(const f of FAIXAS){let k=Math.abs(f-c.d)*0.08+(f===c.faixaAlvo?0:0.6);
      for(const b of corrida.obs.bloqueios){const a=mod(b.s-s,P.L),den=mod(s-b.s,P.L);if((a<olhar||den<b.len+2)&&Math.abs(f-b.d)<4.5)k+=100;}
      for(const h of corrida.obs.buracos){const a=mod(h.s-s,P.L);if(a>1&&a<olhar&&Math.abs(f-h.d)<3.2){
        if(c.decisao[h.id]===undefined)c.decisao[h.id]=Math.random()<p.desvio;if(c.decisao[h.id])k+=20;}}
      for(const o of corrida.carros){if(o===c||o.estado!=='normal')continue;const a=mod(o.prog-c.prog,P.L);
        if(a>2&&a<18&&Math.abs(o.d-f)<2.5&&o.v<c.v-3)k+=4;}
      if(k<menor){menor=k;melhor=f;}}
    c.faixaAlvo=melhor;
    if(!c.ehJogador&&c.ramT<=0&&j.estado==='normal'&&j.invul<=0&&!j.terminou&&!corrida.tut&&corrida.t>8){
      const ds=difProg(j,c),dd=j.d-c.d;
      if(Math.abs(ds)<3.2&&Math.abs(dd)<6&&Math.abs(dd)>1.5&&Math.random()<p.agressao*0.25)c.ramT=0.8;}
  }
  if(c.ramT>0&&j.estado==='normal'){c.ramT-=dt;c.alvoVd=Math.sign(j.d-c.d)*c.latRam;}
  else{c.ramT=0;c.alvoVd=clamp((c.faixaAlvo-c.d)*2.6,-c.lat,c.lat);}
  c.acelerando=true;
  // quem está muito na frente do jogador alivia um pouco, quem ficou para trás acelera um pouco
  c.multV=1;if(!c.ehJogador){const diff=c.prog-j.prog,forca=corrida.p.folga;
    if(diff>20)c.multV=1-Math.min(0.15,(diff-20)/200)*forca;else if(diff<-30)c.multV=1+Math.min(0.1,(-diff-30)/250);}
}
