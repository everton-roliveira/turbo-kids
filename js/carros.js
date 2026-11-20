// Turbo Kids · Rosto dos carros e geometria da carroceria.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';
/* ---- Rosto: olhos no para-brisa e boca no para-choque ---- */
/* expressões: normal, feliz, bravo, triste, tonto, susto */
function desenharOlhos(x,W,H,o){
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
function desenharBoca(x,W,H,expr){
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
/* faixa que acompanha a curva da carroceria (olhos no para-brisa, boca no capô) */
function faixaCurva(f,taper,za,zb,al,cache){
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
function geoParabrisa(id){
  const G=geosModelo(id);if(G.parabrisa)return G.parabrisa;const m=MODELOS[id];
  let zb=m.cabine[m.cabine.length-1][0];while(zb>m.teto[1]+0.25&&G.fcab(zb)[2]<G.fc(zb)[2]+0.05)zb-=0.02;
  return G.parabrisa=faixaCurva(G.fcab,0.3,m.teto[1]-0.12,zb,1.0);
}
function geoBoca(id){
  const G=geosModelo(id);if(G.boca)return G.boca;const m=MODELOS[id],z1=m.corpo[m.corpo.length-1][0];
  return G.boca=faixaCurva(G.fc,0.1,z1-0.5,z1-0.03,0.62);
}
function criarRosto(id,chassi,cor,proprios){
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
/* duas faixas de corrida em cima do carro, pulando os vidros */
function geoListras(id){
  const m=MODELOS[id],G=geosModelo(id),z0=m.corpo[0][0]+0.04,z1=m.corpo[m.corpo.length-1][0]-0.04;
  const c0=m.cabine[0][0],c1=m.cabine[m.cabine.length-1][0];const pos=[],idx=[];let ant=-1;
  for(let z=z0;z<=z1+1e-6;z+=0.05){
    const ytc=G.fc(z)[2];let y=ytc,vidro=false;
    if(z>c0&&z<c1){const yc=G.fcab(z)[2];if(yc>ytc+0.02){y=yc;vidro=!(z>m.teto[0]&&z<m.teto[1]);}}
    if(vidro){ant=-1;continue;}
    const base=pos.length/3;y+=0.016;
    for(const [a,b] of [[0.09,0.22],[-0.22,-0.09]])pos.push(a,y,z,b,y,z);
    if(ant>=0)for(let k=0;k<2;k++){const p=ant+k*2,q=base+k*2;idx.push(p,q,p+1,p+1,q,q+1);}
    ant=base;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
const texNumeros={};
function texNumero(n){if(texNumeros[n])return texNumeros[n];
  return texNumeros[n]=tex(128,128,(x)=>{x.fillStyle='#fafafa';x.beginPath();x.arc(64,64,58,0,7);x.fill();x.lineWidth=6;x.strokeStyle='#111';x.stroke();
    x.fillStyle='#111';x.font='800 80px "Baloo 2", sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),64,72);});}

/* ---- Geometria dos carros: carroceria por seções (loft) ---- */
function catmull(p0,p1,p2,p3,t){const t2=t*t,t3=t2*t;return 0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);}
function perfil(est){
  return z=>{let i=0;while(i<est.length-2&&z>est[i+1][0])i++;
    const a=est[i],b=est[i+1],t=clamp((z-a[0])/(b[0]-a[0]),0,1),p0=est[Math.max(0,i-1)],p3=est[Math.min(est.length-1,i+2)];
    const r=[];for(let k=1;k<a.length;k++)r.push(catmull(p0[k],a[k],b[k],p3[k],t));return r;};
}
function loft(f,z0,z1,{aneis=44,ring=32,taper=0.1,grupo}){
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
const geoCache={};
function geosModelo(id){
  if(geoCache[id])return geoCache[id];const m=MODELOS[id];
  const fc=perfil(m.corpo),fcab0=perfil(m.cabine);
  const fcab=z=>{const [w,yt,n]=fcab0(z);const yb=fc(z)[2]-0.12;return[w,yb,Math.max(yt,yb+0.01),n];};
  const corpo=loft(fc,m.corpo[0][0],m.corpo[m.corpo.length-1][0],{taper:0.1,grupo:s=>s<-0.5});
  const cab=loft(fcab,m.cabine[0][0],m.cabine[m.cabine.length-1][0],{aneis:30,taper:0.3,
    grupo:(s,z)=>s>0.7?!(z>m.teto[0]&&z<m.teto[1]):!(s>-0.2&&(z<m.vidroLat[0]||z>m.vidroLat[1]))});
  return geoCache[id]={corpo,cab,fc,fcab};
}
function mesclar(geos){const pos=[],nor=[];
  for(const g of geos){const n=g.index?g.toNonIndexed():g;n.computeVertexNormals();pos.push(...n.attributes.position.array);nor.push(...n.attributes.normal.array);}
  const r=new THREE.BufferGeometry();r.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));r.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return r;}
const GEO=(()=>{
  const perfilPneu=[[.235,-.155],[.31,-.16],[.338,-.15],[.35,-.12],[.352,-.06],[.352,.06],[.35,.12],[.338,.15],[.31,.16],[.235,.155]].map(p=>new THREE.Vector2(p[0],p[1]));
  const raios=[];for(let k=0;k<5;k++)raios.push(new THREE.BoxGeometry(.035,.05,.43).rotateX(k*Math.PI/5).translate(.12,0,0));
  return{
    pneu:new THREE.LatheGeometry(perfilPneu,28).rotateZ(-Math.PI/2),
    aro:mesclar([new THREE.CylinderGeometry(.24,.24,.27,24,1,true).rotateZ(Math.PI/2),...raios,
      new THREE.CylinderGeometry(.06,.06,.05,12).rotateZ(Math.PI/2).translate(.13,0,0),
      new THREE.TorusGeometry(.238,.012,6,28).rotateY(Math.PI/2).translate(.135,0,0)]),
    disco:new THREE.CylinderGeometry(.2,.2,.03,22).rotateZ(Math.PI/2).translate(.02,0,0),
    pinca:new THREE.BoxGeometry(.08,.12,.17),
    arco:new THREE.CircleGeometry(.44,24),
    aba:new THREE.TorusGeometry(.44,.04,6,20,Math.PI).rotateY(Math.PI/2),
    fogo:new THREE.ConeGeometry(.12,.9,8).rotateX(-Math.PI/2),
    escape:new THREE.CylinderGeometry(.06,.06,.16,12).rotateX(Math.PI/2),
    sombra:new THREE.PlaneGeometry(2.4,5).rotateX(-Math.PI/2),
    esfera:new THREE.SphereGeometry(1,16,10),
    lantRed:new THREE.CylinderGeometry(.075,.075,.04,16).rotateX(Math.PI/2),
    numero:new THREE.PlaneGeometry(.5,.5),
  };})();
const MAT={
  carbono:new THREE.MeshStandardMaterial({color:lin(0x18191d),roughness:0.45,metalness:0.4}),
  vidro:new THREE.MeshPhysicalMaterial({color:lin(0x0a0e15),metalness:0.9,roughness:0.06,clearcoat:1}),
  pneu:new THREE.MeshStandardMaterial({color:lin(0x151516),roughness:0.92,side:THREE.DoubleSide}),
  disco:new THREE.MeshStandardMaterial({color:lin(0x77797e),metalness:0.9,roughness:0.45}),
  arco:new THREE.MeshBasicMaterial({color:lin(0x050506)}),
  farol:new THREE.MeshStandardMaterial({color:lin(0xeef4ff),emissive:lin(0xdfe9ff),emissiveIntensity:1.4,metalness:0.2,roughness:0.1}),
  lanterna:new THREE.MeshStandardMaterial({color:lin(0xff2010),emissive:lin(0xff1505),emissiveIntensity:1.2}),
  cromo:new THREE.MeshStandardMaterial({color:lin(0xdfe2e6),metalness:1,roughness:0.2}),
  fogo:new THREE.MeshBasicMaterial({color:lin(0xff8a1a)}),
  sombra:new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.3,depthWrite:false}),
};
const matCache={};
function matAro(hex){return matCache['a'+hex]||(matCache['a'+hex]=new THREE.MeshStandardMaterial({color:lin(hex),metalness:1,roughness:0.28,side:THREE.DoubleSide}));}
function matCor(hex){return matCache['c'+hex]||(matCache['c'+hex]=new THREE.MeshStandardMaterial({color:lin(hex),roughness:0.4,metalness:0.3}));}
function matNumero(n){return matCache['n'+n]||(matCache['n'+n]=new THREE.MeshStandardMaterial({map:texNumero(n),transparent:true,alphaTest:0.3,roughness:0.4}));}

function criarCarro(id,cor,numero,enfeite={}){
  const m=MODELOS[id],G=geosModelo(id),fc=G.fc,fcab=G.fcab,proprios=[];
  const raiz=new THREE.Group(),chassi=new THREE.Group();raiz.add(chassi);
  const tinta=new THREE.MeshPhysicalMaterial({color:lin(cor),metalness:0.5,roughness:0.3,clearcoat:1,clearcoatRoughness:0.06});
  const add=(pai,geo,mat,x,y,z,sombra)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);if(sombra)o.castShadow=true;pai.add(o);return o;};
  const caixa=(pai,sx,sy,sz,mat,x,y,z)=>add(pai,new THREE.BoxGeometry(sx,sy,sz),mat,x,y,z);
  add(chassi,G.corpo,[tinta,MAT.carbono],0,0,0,true);
  add(chassi,G.cab,[tinta,MAT.vidro],0,0,0,true);
  const z0=m.corpo[0][0],z1=m.corpo[m.corpo.length-1][0];
  const [w0,yb0,yt0]=fc(z0),yc0=(yb0+yt0)/2;
  // rodas
  const rodas=[],dianteiras=[],R=0.35,X=0.86;
  for(const [zz,frente] of [[m.rodas.f,true],[m.rodas.t,false]])for(const lado of [1,-1]){
    const piv=new THREE.Group();piv.position.set(lado*X,R,zz);raiz.add(piv);
    const esp=new THREE.Group();esp.scale.x=lado;piv.add(esp);
    const gira=new THREE.Group();esp.add(gira);
    add(gira,GEO.pneu,MAT.pneu,0,0,0,true);add(gira,GEO.aro,matAro(enfeite.aro||m.aro),0,0,0);add(gira,GEO.disco,MAT.disco,0,0,0);
    add(esp,GEO.pinca,matCor(m.pinca),0.05,0.13,-0.12);
    rodas.push(gira);if(frente)dianteiras.push(piv);
    const w=fc(zz)[0];
    const arco=add(chassi,GEO.arco,MAT.arco,lado*(w*0.965),R,zz);arco.rotation.y=lado*Math.PI/2;
    add(chassi,GEO.aba,tinta,lado*(w*0.975),R,zz);
  }
  // faróis
  if(m.farol==='frente'){for(const s of [1,-1]){caixa(chassi,.34,.12,.05,MAT.farol,s*.6,.55,z1+.01);}
    caixa(chassi,.7,.2,.04,MAT.carbono,0,.5,z1+.01);}
  else{const zf=z1-(m.farol==='redondo'?.5:.38);const [wf,,ytf]=fc(zf);
    for(const s of [1,-1]){const l=add(chassi,GEO.esfera,MAT.farol,s*wf*.62,ytf-.035,zf);
      const k=enfeite.rosto?0.6:1;if(m.farol==='redondo')l.scale.set(.17*k,.12*k,.2*k);else{l.scale.set(.26*k,.05,.2*k);l.rotation.y=s*.25;}
      if(enfeite.rosto)l.position.x=s*wf*.74;}}
  // lanternas
  if(m.lanterna==='redonda'){for(const s of [1,-1])for(const x of [.48,.72]){add(chassi,GEO.lantRed,MAT.lanterna,s*x*w0/0.86,yc0+.1,z0-.01);}}
  else if(m.lanterna==='barra')caixa(chassi,w0*1.7,.06,.04,MAT.lanterna,0,yc0+.15,z0-.01);
  else for(const s of [1,-1])caixa(chassi,.5,.07,.04,MAT.lanterna,s*.55*w0/0.86,yc0+.14,z0-.01);
  // difusor e escapamentos
  caixa(chassi,w0*1.5,.14,.3,MAT.carbono,0,yb0+.06,z0+.1);
  const fogo=new THREE.Group();
  for(const [x,y] of m.escape){add(chassi,GEO.escape,MAT.cromo,x,y,z0-.03);const f=add(fogo,GEO.fogo,MAT.fogo,x,y,z0-.5);}
  fogo.visible=false;chassi.add(fogo);
  // retrovisores
  const zr=m.cabine[m.cabine.length-1][0]-.38,[wr]=fcab(zr),ytr=fc(zr)[2];
  for(const s of [1,-1]){caixa(chassi,.2,.11,.14,tinta,s*(wr+.16),ytr+.13,zr);caixa(chassi,.12,.03,.05,MAT.carbono,s*(wr+.05),ytr+.08,zr);}
  // entradas de ar laterais
  if(m.entrada){const ze=m.rodas.t+.75,[we,ybe,yte]=fc(ze);for(const s of [1,-1])caixa(chassi,.08,.22,.6,MAT.carbono,s*(we-.02),(ybe+yte)/2+.02,ze);}
  // tomada de ar no capô
  if(m.capo){const zc=1.2,[,,ytc]=fc(zc);caixa(chassi,.5,.1,.7,MAT.carbono,0,ytc+.03,zc);}
  // aleta central
  if(m.aleta){const za=-1.6,[,,yta]=fc(za);caixa(chassi,.03,.42,1.4,tinta,0,yta+.18,za);}
  // aerofólio
  if(m.asa){const a=m.asa,yt=fc(a.z)[2];
    caixa(chassi,a.larg,.05,a.corda,MAT.carbono,0,a.y,a.z);
    for(const s of [1,-1])caixa(chassi,.04,a.baixa?.12:.26,a.corda+.12,a.baixa?tinta:MAT.carbono,s*a.larg/2,a.y+(a.baixa?-.03:-.06),a.z);
    if(!a.baixa){const h=a.y-yt+.05;for(const s of [1,-1])caixa(chassi,.05,h,.14,MAT.carbono,s*a.larg*.28,yt+h/2-.05,a.z);}}
  // número de corrida nas portas
  // adesivo lateral (entre as rodas)
  let xNum=0;const ad=enfeite.adesivo;
  if(ad&&ad!=='nenhum'&&ad!=='listras'){
    const za=m.rodas.t+.5,zb=m.rodas.f-.5,zm=(za+zb)/2;let wmax=0;for(let z=za;z<=zb;z+=.1)wmax=Math.max(wmax,fc(z)[0]);
    const [,yba,yta]=fc(zm),t=texAdesivo(ad),t2=t.clone();t2.repeat.x=-1;t2.offset.x=1;t2.needsUpdate=true;proprios.push(t,t2);
    const g=new THREE.PlaneGeometry(zb-za,(zb-za)/4);proprios.push(g);
    for(const s of [1,-1]){const mt=new THREE.MeshStandardMaterial({map:s>0?t:t2,transparent:true,alphaTest:0.3,roughness:0.35,polygonOffset:true,polygonOffsetFactor:-2});proprios.push(mt);
      const p=add(chassi,g,mt,s*(wmax+.014),(yba+yta)/2+.01,zm);p.rotation.y=s*Math.PI/2;}
    xNum=wmax+.022;}
  if(ad==='listras'){const mt=new THREE.MeshStandardMaterial({color:lin(['#f2f2f2','#f5c400','#a9b0b8'].includes((cor||'').toLowerCase())?0x111111:0xfafafa),
      roughness:0.3,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2});proprios.push(mt);add(chassi,geoListras(id),mt,0,0,0);}
  // número de corrida nas portas
  if(numero){const zn=-.1,[wn,ybn,ytn]=fc(zn);for(const s of [1,-1]){const p=add(chassi,GEO.numero,matNumero(numero),s*Math.max(wn+.012,xNum),(ybn+ytn)/2+.02,zn);p.rotation.y=s*Math.PI/2;}}
  // placa com o nome atrás
  if(enfeite.nome){const t=texPlaca(enfeite.nome),mt=new THREE.MeshStandardMaterial({map:t,roughness:0.4}),larg=Math.min(.9,w0*1.15),g=new THREE.PlaneGeometry(larg,larg/4);
    proprios.push(t,mt,g);const p=add(chassi,g,mt,0,yc0-.1,z0-.03);p.rotation.y=Math.PI;}
  // olhos e boca (personagem)
  const rosto=enfeite.rosto?criarRosto(id,chassi,cor,proprios):null;
  const so=add(raiz,GEO.sombra,MAT.sombra,0,0.02,0);so.renderOrder=-1;
  raiz.userData={tinta,rodas,dianteiras,chassi,fogo,proprios,rosto};
  return raiz;
}
function descartarCarro(c){const u=c&&c.userData;if(!u)return;u.tinta.dispose();for(const o of u.proprios||[])o.dispose();
  c.traverse(o=>{if(o.geometry&&!geosFixas.has(o.geometry)&&!Object.values(geoCache).some(g=>g.corpo===o.geometry||g.cab===o.geometry||(g.parabrisa&&g.parabrisa.geo===o.geometry)||(g.boca&&g.boca.geo===o.geometry)))o.geometry.dispose();});}
const enfeiteJogador=()=>({adesivo:save.adesivo,aro:save.aro,nome:nomeJogador().toUpperCase(),rosto:save.rosto});
function pintar(carro,cor){carro.userData.tinta.color.copy(lin(cor));if(carro.userData.rosto)carro.userData.rosto.cor=cor;}

