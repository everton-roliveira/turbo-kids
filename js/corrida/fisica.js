// Turbo Kids · Física, batidas, obstáculos e chegada.
import {$,mod} from '../nucleo/util.js';
import {PERSONAGENS} from '../carros/index.js';
import {Som} from '../audio/som.js';
import {Voz} from '../audio/voz.js';
import {A,HW,P,amostra} from '../pistas/tracado.js';
import {corrida} from './estado.js';
import {aviso} from '../interface/telas.js';

export let tremor=0;
export const difProg=(a,b)=>mod(a.prog-b.prog+P.L/2,P.L)-P.L/2;
export function fisica(c,dt){
  if(c.estado==='fora'){c.tFora+=dt;if(c.tFora>2){c.estado='normal';c.d=0;c.vd=0;c.v=0;c.invul=2;c.faixaAlvo=0;c.alt=0;c.valt=0;c.mesh.rotation.set(0,0,0);}return;}
  c.invul=Math.max(0,c.invul-dt);c.lento=Math.max(0,c.lento-dt);c.tBuraco=Math.max(0,c.tBuraco-dt);c.tRampa=Math.max(0,c.tRampa-dt);c.tPad=Math.max(0,c.tPad-dt);
  if(c.turboT>0)c.turboT=Math.max(0,c.turboT-dt);else if(c.ehJogador)c.turboCarga=Math.min(30,c.turboCarga+dt);
  const turbo=c.turboT>0;
  const vmax=c.vmax*c.multV*(turbo?1.45:1)*(c.lento>0?c.fatorLento:1);
  const vAntes=c.v;
  if(c.acelerando){if(c.v<vmax)c.v=Math.min(vmax,c.v+c.acel*(turbo?2.2:1)*dt);else c.v=Math.max(vmax,c.v-30*dt);}
  else c.v=Math.max(0,c.v-14*dt);
  c.accel=dt>0?(c.v-vAntes)/dt:0;
  amostra(c.prog,A);
  c.vd+=(c.alvoVd-c.vd)*Math.min(1,c.rateLat*dt);
  if(c.alt<=0)c.vd-=A.k*c.v*c.v*corrida.p.drift*dt;
  c.d+=c.vd*dt;
  const lim=HW-1.1;
  if(Math.abs(c.d)>lim){const sg=Math.sign(c.d);c.d=sg*lim;if(c.vd*sg>0)c.vd=0;c.v*=1-0.5*dt;}
  c.prog+=c.v*dt;
  // pulo da rampa
  if(c.alt>0||c.valt>0){c.valt-=22*(corrida.tema.gravidade||1)*dt;c.alt+=c.valt*dt;
    if(c.alt<=0){const forte=c.valt<-4;c.alt=0;c.valt=0;
      if(forte){c.pulo=0.3;if(c.ehJogador){Som.pouso();tremor=Math.max(tremor,0.35);}}}}
}
export function derrubar(c,dir,atk){
  c.estado='fora';c.tFora=0;c.dFora=c.d;c.dirFora=dir;c.v=0;c.vd=0;c.turboT=0;c.alt=0;c.valt=0;Som.batida();
  reagir(c,'tonto',2.6);reagir(atk,'feliz',1.6);
  if(c.ehJogador){aviso('💥 TE JOGARAM PRA FORA!','ruim');tremor=1.2;Voz.falar('Ops! O '+PERSONAGENS[atk.modelo].nome+' bateu em você!',{chave:'fora',espera:4});}
  else if(atk.ehJogador){aviso('💥 BOOM! Tirou o '+PERSONAGENS[c.modelo].nome.toUpperCase()+'!','bom');tremor=0.5;Voz.falar('Bum! Tirou o '+PERSONAGENS[c.modelo].nome+' da pista!',{chave:'boom',espera:4});}
}
export function reagir(c,expr,dur){const r=c.mesh.userData.rosto;if(r)r.reagir(expr,dur);}
export function colisoes(){
  const cs=corrida.carros;
  for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){
    const a=cs[i],b=cs[j];if(a.estado!=='normal'||b.estado!=='normal')continue;
    if(Math.abs(a.alt-b.alt)>1)continue;
    const ds=difProg(b,a),dd=b.d-a.d;if(Math.abs(ds)>=4.4||Math.abs(dd)>=2.1)continue;
    const sd=Math.sign(dd)||1;
    if(Math.abs(ds)<3.0){
      const pa=a.vd*sd,pb=-b.vd*sd,atk=pa>=pb?a:b,vit=atk===a?b:a,forca=Math.max(pa,pb);
      if(forca>(vit.ehJogador?11:7.5)&&vit.invul<=0&&atk.invul<=0){derrubar(vit,atk===a?sd:-sd,atk);continue;}
      const pen=(2.1-Math.abs(dd))/2;a.d-=sd*pen;b.d+=sd*pen;const m=(a.vd+b.vd)/2;a.vd=m-sd*1.5;b.vd=m+sd*1.5;
    }else{const tras=ds>0?a:b,frente=tras===a?b:a;tras.v=Math.min(tras.v,frente.v*0.92);tras.prog-=(4.4-Math.abs(ds))*0.5;}
  }
}
export const distS=(s,alvo)=>mod(s-alvo+P.L/2,P.L)-P.L/2;
export function checarObstaculos(c){
  if(c.estado!=='normal')return;const s=mod(c.prog,P.L),ob=corrida.obs;
  if(c.invul<=0&&c.alt<1.2)for(const b of ob.bloqueios){const rel=mod(s+2.2-b.s,P.L);
    if(rel<b.len+4.4&&Math.abs(c.d-b.d)<3.8){
      c.v=0;c.vd=0;c.d=0;c.alvoVd=0;c.invul=1.5;c.turboT=0;c.faixaAlvo=0;reagir(c,'tonto',1.8);
      if(c.ehJogador){aviso('🚧 BATEU! Volta pro meio','ruim');tremor=0.9;Som.batida();Voz.falar('Cuidado com as placas!',{chave:'placa',espera:6});}
      break;}}
  if(c.alt<0.2)for(const h of ob.buracos){if(c.tBuraco>0)break;const ds=distS(s,h.s);
    if(Math.abs(ds)<2.0&&Math.abs(c.d-h.d)<1.9){c.v*=c.perdaBuraco;c.lento=c.lentoDur;c.tBuraco=1.2;c.pulo=0.4;reagir(c,'susto',1.1);
      if(c.ehJogador){aviso('🕳️ BURACO!','ruim');tremor=0.6;Som.buraco();Voz.falar('Buraco!',{chave:'buraco',espera:6});}break;}}
  if(c.tRampa<=0&&c.alt<=0)for(const r of ob.rampas){const ds=distS(s,r.s);
    if(ds>=0&&ds<2.5&&Math.abs(c.d-r.d)<2.7&&c.v>10){c.valt=4+c.v*0.09;c.alt=0.01;c.tRampa=1;reagir(c,'feliz',1.4);
      if(c.ehJogador){aviso('🚀 UAU!','bom');Som.turbo();Voz.falar('Uau! Que pulo!',{chave:'pulo',espera:5});}break;}}
  if(c.tPad<=0&&c.alt<0.3)for(const p of ob.pads){const ds=distS(s,p.s);
    if(ds>=0&&ds<7&&Math.abs(c.d-p.d)<2.6){c.turboT=Math.max(c.turboT,1.6);c.tPad=1;
      if(c.ehJogador){aviso('⚡ VUPT!','bom');Som.turbo();}break;}}
  if(!c.ehJogador)return;
  const volta=Math.floor(Math.max(0,c.prog)/P.L),cy=c.alt+0.6;
  for(const m of ob.moedas){if(m.volta===volta)continue;const ds=distS(s,m.s);
    if(Math.abs(ds)<1.6&&Math.abs(c.d-m.d)<1.9&&Math.abs(cy-m.y)<1.5){m.volta=volta;corrida.pegas++;Som.moeda();
      const el=$('#hMoedasBox');el.classList.remove('pega');void el.offsetWidth;el.classList.add('pega');}}
  for(const e of ob.estrelas){if(e.volta===volta)continue;const ds=distS(s,e.s);
    if(Math.abs(ds)<1.8&&Math.abs(c.d-e.d)<2.2&&Math.abs(cy-e.y)<1.8){e.volta=volta;c.turboCarga=30;Som.estrela();
      aviso('⭐ TURBO CHEIO!','bom');Voz.falar('Estrela! Turbo cheio!',{chave:'estrela',espera:3});corrida.turboAvisado=true;}}
}
export function checarChegada(c){
  if(c.terminou||c.prog<corrida.p.voltas*P.L)return;
  c.terminou=true;corrida.ordem.push(c);
  if(c.ehJogador){c.posFinal=corrida.ordem.length;c.ia=true;c.turboT=0;aviso('CHEGADA! 🏁','bom');}
}
// troca o valor a partir de outros módulos (um import não pode ser reatribuído)
export function definirTremor(v){tremor=v;}
