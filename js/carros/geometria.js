// Turbo Kids · Carroceria por seções (loft).
import {clamp} from '../nucleo/util.js';
import {MODELOS} from './index.js';

export function catmull(p0,p1,p2,p3,t){const t2=t*t,t3=t2*t;return 0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);}
export function perfil(est){
  return z=>{let i=0;while(i<est.length-2&&z>est[i+1][0])i++;
    const a=est[i],b=est[i+1],t=clamp((z-a[0])/(b[0]-a[0]),0,1),p0=est[Math.max(0,i-1)],p3=est[Math.min(est.length-1,i+2)];
    const r=[];for(let k=1;k<a.length;k++)r.push(catmull(p0[k],a[k],b[k],p3[k],t));return r;};
}
export function loft(f,z0,z1,{aneis=44,ring=32,taper=0.1,grupo}){
  const pos=[],g0=[],g1=[];
  for(let i=0;i<=aneis;i++){const z=z0+(z1-z0)*i/aneis;const [w,yb,yt,n]=f(z);const yc=(yb+yt)/2,h=Math.max(0.005,(yt-yb)/2),e=2/n;
    for(let j=0;j<ring;j++){const th=j/ring*Math.PI*2-Math.PI/2,c=Math.cos(th),s=Math.sin(th);
      let x=w*Math.sign(c)*Math.pow(Math.abs(c),e);const y=yc+h*Math.sign(s)*Math.pow(Math.abs(s),e);
      x*=1-taper*Math.max(0,(y-yc)/h);pos.push(x,y,z);}}
  for(let i=0;i<aneis;i++)for(let j=0;j<ring;j++){
    const a=i*ring+j,b=i*ring+(j+1)%ring,c=(i+1)*ring+j,d=(i+1)*ring+(j+1)%ring;
    const sm=Math.sin((j+0.5)/ring*Math.PI*2-Math.PI/2),zm=z0+(z1-z0)*(i+0.5)/aneis;
    (grupo(sm,zm)?g1:g0).push(a,b,c,b,d,c);}
  for(const [fim,sinal] of [[0,-1],[aneis,1]]){const base=pos.length/3;const z=z0+(z1-z0)*fim/aneis;const [,yb,yt]=f(z);
    for(let j=0;j<ring;j++){const k=(fim*ring+j)*3;pos.push(pos[k],pos[k+1],pos[k+2]);}
    const ci=pos.length/3;pos.push(0,(yb+yt)/2,z);
    for(let j=0;j<ring;j++){const a=base+j,b=base+(j+1)%ring;if(sinal<0)g0.push(ci,b,a);else g0.push(ci,a,b);}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setIndex(g0.concat(g1));geo.addGroup(0,g0.length,0);geo.addGroup(g0.length,g1.length,1);geo.computeVertexNormals();return geo;
}
export const geoCache={};
export function geosModelo(id){
  if(geoCache[id])return geoCache[id];const m=MODELOS[id];
  const fc=perfil(m.corpo),fcab0=perfil(m.cabine);
  const fcab=z=>{const [w,yt,n]=fcab0(z);const yb=fc(z)[2]-0.12;return[w,yb,Math.max(yt,yb+0.01),n];};
  const corpo=loft(fc,m.corpo[0][0],m.corpo[m.corpo.length-1][0],{taper:0.1,grupo:s=>s<-0.5});
  const cab=loft(fcab,m.cabine[0][0],m.cabine[m.cabine.length-1][0],{aneis:30,taper:0.3,
    // janela: faixa (seno do ângulo) do vidro lateral e início do teto; carros quadrados (ônibus, jipe) usam faixas próprias
    grupo:(s,z)=>{const [j0,j1]=m.janela||[-0.2,0.7];return s>j1?!(z>m.teto[0]&&z<m.teto[1]):!(s>j0&&(z<m.vidroLat[0]||z>m.vidroLat[1]));}});
  return geoCache[id]={corpo,cab,fc,fcab};
}
