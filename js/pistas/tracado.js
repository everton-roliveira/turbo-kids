// Turbo Kids · Traçado da pista e funções para posicionar coisas nela.
import {mod,mulberry32} from '../nucleo/util.js';
import {progresso} from './dificuldade.js';

export const HW=9, FAIXAS=[-6,0,6];
export let P=null;
export const A={x:0,z:0,tx:0,tz:1,rx:-1,rz:0,k:0};
export function construirPista(nivel){
  const rnd=mulberry32(nivel*7919+13);
  const cur=0.24+0.31*progresso(nivel), n=9+Math.min(nivel,7), pts=[];
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+(rnd()-0.5)*0.25;const r=230*(1-cur*0.5+rnd()*cur);pts.push(new THREE.Vector3(Math.cos(a)*r*1.25,0,Math.sin(a)*r));}
  const curva=new THREE.CatmullRomCurve3(pts,true,'centripetal');
  const L=curva.getLength(),N=Math.ceil(L/1.5),ds=L/N;
  const px=new Float32Array(N),pz=new Float32Array(N),tx=new Float32Array(N),tz=new Float32Array(N),rx=new Float32Array(N),rz=new Float32Array(N);
  let k=new Float32Array(N);
  for(let i=0;i<N;i++){const p=curva.getPointAt(i/N),t=curva.getTangentAt(i/N);const l=Math.hypot(t.x,t.z)||1;
    px[i]=p.x;pz[i]=p.z;tx[i]=t.x/l;tz[i]=t.z/l;rx[i]=-tz[i];rz[i]=tx[i];}
  for(let i=0;i<N;i++){const a=(i-1+N)%N,b=(i+1)%N;k[i]=((tx[b]-tx[a])*rx[i]+(tz[b]-tz[a])*rz[i])/(2*ds);}
  for(let p=0;p<3;p++){const k2=new Float32Array(N);for(let i=0;i<N;i++)k2[i]=(k[(i-1+N)%N]+k[i]+k[(i+1)%N])/3;k=k2;}
  return{L,N,ds,px,pz,tx,tz,rx,rz,k,rnd};
}
export function amostra(s,o){s=mod(s,P.L);const f=s/P.ds;const i=Math.floor(f)%P.N,j=(i+1)%P.N,a=f-Math.floor(f);
  o.x=P.px[i]+(P.px[j]-P.px[i])*a;o.z=P.pz[i]+(P.pz[j]-P.pz[i])*a;
  let tx=P.tx[i]+(P.tx[j]-P.tx[i])*a,tz=P.tz[i]+(P.tz[j]-P.tz[i])*a;const l=Math.hypot(tx,tz)||1;
  o.tx=tx/l;o.tz=tz/l;o.rx=-o.tz;o.rz=o.tx;o.k=P.k[i]+(P.k[j]-P.k[i])*a;return o;}
export function colocar(obj,s,d,y){amostra(s,A);obj.position.set(A.x+A.rx*d,y,A.z+A.rz*d);obj.rotation.y=Math.atan2(A.tx,A.tz);return obj;}
export function tira(i0,n,a,b,repV){const pos=[],uv=[],idx=[];const vs=n>=P.N?Math.max(1,Math.round(P.L/repV))/P.N:P.ds/repV;
  for(let i=0;i<=n;i++){const j=(i0+i)%P.N,v=i*vs;pos.push(...a(j),...b(j));uv.push(0,v,1,v);
    if(i<n){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);g.computeVertexNormals();return g;}
export const ptLat=(j,d,y)=>[P.px[j]+P.rx[j]*d,y,P.pz[j]+P.rz[j]*d];
export function fitaH(d0,d1,y,repV,i0=0,n=P.N){return tira(i0,n,j=>ptLat(j,d0,y),j=>ptLat(j,d1,y),repV);}
export function paredeV(d,y0,y1,repV,i0=0,n=P.N){return tira(i0,n,j=>ptLat(j,d,y0),j=>ptLat(j,d,y1),repV);}
export const idxDe=s=>Math.floor(mod(s,P.L)/P.ds);
// troca o valor a partir de outros módulos (um import não pode ser reatribuído)
export function usarPista(v){P=v;}
