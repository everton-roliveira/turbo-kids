// Turbo Kids · Rosto dos carros: olhos no para-brisa e boca no capô.
import {clamp} from '../nucleo/util.js';
import {MODELOS,PERSONAGENS} from './index.js';
import {geosModelo} from './geometria.js';

export function desenharOlhos(x,W,H,o){
  x.clearRect(0,0,W,H);const rx=W*0.215,ry=H*0.42,lw=Math.max(3,W*0.02);
  for(const lado of [-1,1]){const cx=W/2+lado*W*0.236,cy=H*0.52,dentro=-lado;
    x.save();x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);x.fillStyle='#fbfbf8';x.fill();x.clip();
    const ir=Math.min(rx,ry)*0.64,ix=cx+o.gx*rx*0.42,iy=cy+ry*0.08;
    if(o.expr==='tonto'){x.strokeStyle='#222';x.lineWidth=lw;x.beginPath();
      for(let a=0;a<15;a+=0.25){const r=a*ir*0.065;x.lineTo(ix+Math.cos(a*lado)*r,iy+Math.sin(a*lado)*r);}x.stroke();}
    else{const k=o.expr==='susto'?0.72:1;x.fillStyle=o.iris;x.beginPath();x.arc(ix,iy,ir*k,0,7);x.fill();
      x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.arc(ix,iy,ir*k,Math.PI*1.1,Math.PI*1.9);x.lineTo(ix,iy);x.fill();
      x.fillStyle='#0b0b0d';x.beginPath();x.arc(ix,iy,ir*0.5*k,0,7);x.fill();
      x.fillStyle='#fff';x.beginPath();x.arc(ix-ir*0.3,iy-ir*0.34,ir*0.2,0,7);x.fill();x.beginPath();x.arc(ix+ir*0.28,iy+ir*0.3,ir*0.08,0,7);x.fill();}
    // pálpebra de cima na cor do carro: altura no lado de dentro (yi) e de fora (ye), em fração de ry
    let yi,ye;
    switch(o.expr){case 'bravo':yi=-0.02;ye=-0.78;break;case 'triste':yi=-0.82;ye=-0.12;break;case 'susto':yi=ye=-1.3;break;case 'feliz':yi=ye=-0.85;break;default:yi=ye=-0.5;}
    const f=o.fecha||0;yi+=(1.2-yi)*f;ye+=(1.2-ye)*f;
    const xi=cx+dentro*rx*1.1,xe=cx-dentro*rx*1.1,meio=cy+((yi+ye)/2+0.12)*ry;
    x.fillStyle=o.cor;x.beginPath();x.moveTo(xi,cy-ry*1.3);x.lineTo(xi,cy+yi*ry);x.quadraticCurveTo(cx,meio,xe,cy+ye*ry);x.lineTo(xe,cy-ry*1.3);x.closePath();x.fill();
    x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=lw*0.8;x.beginPath();x.moveTo(xi,cy+yi*ry);x.quadraticCurveTo(cx,meio,xe,cy+ye*ry);x.stroke();
    if(o.expr==='feliz'&&f<0.5){x.fillStyle=o.cor;x.beginPath();x.ellipse(cx,cy+ry*1.5,rx*1.3,ry*0.7,0,0,Math.PI*2);x.fill();}
    x.restore();
    x.lineWidth=lw;x.strokeStyle='#15161a';x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);x.stroke();}
}
export function desenharBoca(x,W,H,expr){
  x.clearRect(0,0,W,H);const cx=W/2,cy=H*0.5,L=W*0.36,lw=Math.max(4,H*0.06),escuro='#3a0c0c';H*=0.85;
  x.lineCap=x.lineJoin='round';x.strokeStyle='#141414';x.lineWidth=lw;
  const dentes=(ate)=>{x.save();x.clip();x.fillStyle='#fff';x.fillRect(0,0,W,ate);x.restore();};
  if(expr==='feliz'){x.beginPath();x.moveTo(cx-L,cy-H*0.24);x.quadraticCurveTo(cx,cy-H*0.08,cx+L,cy-H*0.24);x.quadraticCurveTo(cx,cy+H*0.8,cx-L,cy-H*0.24);x.closePath();
    x.fillStyle=escuro;x.fill();x.save();x.clip();x.fillStyle='#e8606e';x.beginPath();x.ellipse(cx,cy+H*0.42,L*0.42,H*0.2,0,0,7);x.fill();x.restore();
    x.beginPath();x.moveTo(cx-L,cy-H*0.24);x.quadraticCurveTo(cx,cy-H*0.08,cx+L,cy-H*0.24);x.quadraticCurveTo(cx,cy+H*0.8,cx-L,cy-H*0.24);x.closePath();dentes(cy+H*0.04);x.stroke();}
  else if(expr==='bravo'){const a=H*0.2,x0=cx-L*0.8,lg=L*1.6;x.beginPath();if(x.roundRect)x.roundRect(x0,cy-a,lg,a*2,a*0.6);else x.rect(x0,cy-a,lg,a*2);
    x.fillStyle='#fff';x.fill();x.stroke();x.lineWidth=lw*0.5;x.beginPath();x.moveTo(x0,cy);x.lineTo(x0+lg,cy);
    for(let k=-3;k<=3;k++){x.moveTo(cx+k*L*0.22,cy-a);x.lineTo(cx+k*L*0.22,cy+a);}x.stroke();}
  else if(expr==='triste'){x.beginPath();x.moveTo(cx-L*0.75,cy+H*0.26);x.quadraticCurveTo(cx,cy-H*0.32,cx+L*0.75,cy+H*0.26);x.stroke();}
  else if(expr==='tonto'){x.beginPath();for(let i=0;i<=28;i++){const t=i/28;x.lineTo(cx-L*0.8+t*L*1.6,cy+Math.sin(t*Math.PI*4)*H*0.15);}x.stroke();}
  else if(expr==='susto'){x.beginPath();x.ellipse(cx,cy,L*0.2,H*0.32,0,0,7);x.fillStyle=escuro;x.fill();x.stroke();}
  else{x.beginPath();x.moveTo(cx-L,cy-H*0.26);x.quadraticCurveTo(cx,cy+H*0.02,cx+L,cy-H*0.26);x.quadraticCurveTo(cx,cy+H*0.7,cx-L,cy-H*0.26);x.closePath();
    x.fillStyle=escuro;x.fill();dentes(cy+H*0.0);x.stroke();}
}
export function faixaCurva(f,taper,za,zb,al,cache){
  const NU=16,NV=8,pos=[],uv=[],idx=[];
  const pt=(u,v)=>{const z=zb+(za-zb)*v,[w,yb,yt,n]=f(z),yc=(yb+yt)/2,h=(yt-yb)/2,e=2/n,th=Math.PI/2+al-2*al*u,c=Math.cos(th),s=Math.sin(th);
    const y=yc+h*Math.pow(Math.abs(s),e);let x=w*Math.sign(c)*Math.pow(Math.abs(c),e);x*=1-taper*Math.max(0,(y-yc)/h);
    const k=1.02;return[x*k,yc+(y-yc)*k+0.006,z+0.006];};
  for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){pos.push(...pt(i/NU,j/NV));uv.push(i/NU,j/NV);}
  for(let j=0;j<NV;j++)for(let i=0;i<NU;i++){const a=j*(NU+1)+i,b=a+1,c=a+NU+1,d=c+1;idx.push(a,b,c,b,d,c);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);g.computeVertexNormals();
  const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);let larg=0,alt=0;
  for(let i=0;i<NU;i++)larg+=dist(pt(i/NU,0.5),pt((i+1)/NU,0.5));for(let j=0;j<NV;j++)alt+=dist(pt(0.5,j/NV),pt(0.5,(j+1)/NV));
  return{geo:g,larg,alt};
}
export function geoParabrisa(id){
  const G=geosModelo(id);if(G.parabrisa)return G.parabrisa;const m=MODELOS[id];
  let zb=m.cabine[m.cabine.length-1][0];while(zb>m.teto[1]+0.25&&G.fcab(zb)[2]<G.fc(zb)[2]+0.05)zb-=0.02;
  return G.parabrisa=faixaCurva(G.fcab,0.3,m.teto[1]-0.12,zb,1.0);
}
export function geoBoca(id){
  const G=geosModelo(id);if(G.boca)return G.boca;const m=MODELOS[id],z1=m.corpo[m.corpo.length-1][0];
  return G.boca=faixaCurva(G.fc,0.1,z1-0.5,z1-0.03,0.62);
}
export function criarRosto(id,chassi,cor,proprios){
  const pb=geoParabrisa(id),bd=geoBoca(id),iris=PERSONAGENS[id].olho;
  const Wo=256,Ho=clamp(Math.round(256*pb.alt/pb.larg),96,256),Wb=512,Hb=clamp(Math.round(512*bd.alt/bd.larg),64,256);
  const co=document.createElement('canvas');co.width=Wo;co.height=Ho;const cb=document.createElement('canvas');cb.width=Wb;cb.height=Hb;
  const to=new THREE.CanvasTexture(co),tb=new THREE.CanvasTexture(cb);to.encoding=tb.encoding=THREE.sRGBEncoding;
  const mo=new THREE.MeshStandardMaterial({map:to,transparent:true,alphaTest:0.4,roughness:0.18,metalness:0.05,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2});
  const mb=new THREE.MeshStandardMaterial({map:tb,transparent:true,alphaTest:0.4,roughness:0.4,polygonOffset:true,polygonOffsetFactor:-2});
  proprios.push(to,tb,mo,mb);
  chassi.add(new THREE.Mesh(pb.geo,mo));chassi.add(new THREE.Mesh(bd.geo,mb));
  const r={cor,reacao:null,tReacao:0,tPisca:1+Math.random()*3,chOlho:'',chBoca:'',
    reagir(e,d){this.reacao=e;this.tReacao=d;},
    atualizar(dt,gx,base){
      this.tReacao-=dt;const e=this.tReacao>0?this.reacao:base;
      this.tPisca-=dt;let f=0;
      if(this.tPisca<0){f=Math.max(0,1-Math.abs(this.tPisca+0.08)/0.08);if(this.tPisca<-0.16)this.tPisca=2+Math.random()*3.5;}
      if(e==='tonto'||e==='susto')f=0;
      const g=Math.round(clamp(gx,-1,1)*8)/8,fq=Math.round(f*4)/4,kO=e+'|'+g+'|'+fq+'|'+this.cor;
      if(kO!==this.chOlho){this.chOlho=kO;desenharOlhos(co.getContext('2d'),Wo,Ho,{expr:e,gx:g,fecha:fq,cor:this.cor,iris});to.needsUpdate=true;}
      if(e!==this.chBoca){this.chBoca=e;desenharBoca(cb.getContext('2d'),Wb,Hb,e);tb.needsUpdate=true;}
    }};
  r.atualizar(0,0,'normal');return r;
}
