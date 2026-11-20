// Turbo Kids · Posição dos carros na tela e moedas girando.
import {clamp} from '../nucleo/util.js';
import {TEX} from '../nucleo/texturas.js';
import {piscarSirenes,animarFogoLateral,animarRodas} from '../carros/criar.js';
import {A,P,amostra} from '../pistas/tracado.js';
import {corrida} from './estado.js';

export function atualizarVisual(c,dt){
  const m=c.mesh,u=m.userData;piscarSirenes(m,corrida.tCen);animarRodas(m,corrida.tCen,dt);
  if(c.estado==='fora'){const t=Math.min(c.tFora,1);amostra(c.prog,A);const d=c.dFora+c.dirFora*t*16;
    m.position.set(A.x+A.rx*d,3.4*4*t*(1-t),A.z+A.rz*d);m.rotation.y+=dt*9*(1-t*0.7);m.rotation.z=-c.dirFora*0.5*t;m.visible=true;u.fogo.visible=false;animarFogoLateral(m,0);
    if(u.rosto)u.rosto.atualizar(dt,0,'tonto');return;}
  amostra(c.prog,A);
  m.position.x=A.x+A.rx*c.d;m.position.z=A.z+A.rz*c.d;
  let y=c.alt;if(c.pulo>0){c.pulo=Math.max(0,c.pulo-dt);y+=Math.sin((1-c.pulo/0.4)*Math.PI)*0.45;}m.position.y=y;
  const vv=Math.max(c.v,10);m.rotation.set(0,Math.atan2(A.tx*vv+A.rx*c.vd,A.tz*vv+A.rz*c.vd),0);
  for(const r of u.rodas)r.rotation.x+=c.v*dt/0.35;
  const giro=-clamp(c.alvoVd*0.035,-0.4,0.4);for(const p of u.dianteiras)p.rotation.y+=(giro-p.rotation.y)*Math.min(1,10*dt);
  u.chassi.rotation.z+=(clamp(-c.vd*0.005,-0.06,0.06)-u.chassi.rotation.z)*Math.min(1,6*dt);
  const alvoX=c.alt>0?clamp(-c.valt*0.025,-0.22,0.22):clamp(-(c.accel||0)*0.0015,-0.04,0.04);
  u.chassi.rotation.x+=(alvoX-u.chassi.rotation.x)*Math.min(1,(c.alt>0?8:5)*dt);
  u.fogo.visible=c.turboT>0;if(u.fogo.visible){const k=0.8+Math.random()*0.6;u.fogo.scale.set(1,1,k);}
  animarFogoLateral(m,c.v<6?0:c.turboT>0?1.9:1);
  m.visible=c.invul>0?Math.floor(c.invul*10)%2===0:true;
  if(u.rosto){const base=c.terminou?(c.ehJogador&&c.posFinal>3?'triste':'feliz'):c.ramT>0?'bravo':c.turboT>0?'feliz':'normal';
    u.rosto.atualizar(dt,-c.alvoVd*0.09,base);}
}
export const dmM=new THREE.Object3D();
export function atualizarMoedas(dt){
  const ob=corrida.obs,im=corrida.moedasMesh,j=corrida.jogador,volta=Math.floor(Math.max(0,j.prog)/P.L);corrida.t+=dt;
  const giro=corrida.t*3;
  ob.moedas.forEach((m,i)=>{dmM.position.set(m.x,m.y,m.z);dmM.rotation.set(0,giro+i*0.4,0);const s=m.volta===volta?0:1;dmM.scale.set(s,s,s);dmM.updateMatrix();im.setMatrixAt(i,dmM.matrix);});
  im.instanceMatrix.needsUpdate=true;
  for(const e of ob.estrelas){e.mesh.visible=e.volta!==volta;e.mesh.rotation.y=corrida.t*2.2;e.mesh.position.y=e.y+Math.sin(corrida.t*3)*0.25;}
  if(TEX.pad)TEX.pad.offset.y=-(corrida.t*1.6)%1;
}
