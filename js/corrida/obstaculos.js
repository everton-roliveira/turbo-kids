// Turbo Kids · Obstáculos, rampas, faixas de turbo, moedas e estrelas.
import {lin} from '../nucleo/util.js';
import {TEX} from '../nucleo/texturas.js';
import {A,FAIXAS,P,amostra,colocar} from '../pistas/tracado.js';

export function gerarObstaculos(p,nivel){
  const rnd=P.rnd,L=P.L,blo=[],bur=[],rampas=[],pads=[],moedas=[],estrelas=[];
  const tunel=nivel>=2?{s:L*0.34,len:72}:null,ponte=nivel>=3?{s:L*0.68,len:56}:null;
  for(let b=0;b<p.bloqueios;b++)for(let t=0;t<40;t++){
    const s=90+rnd()*(L-150),len=12+rnd()*12;
    if(blo.every(o=>s+len<o.s-14||s>o.s+o.len+14)){blo.push({s,len,d:rnd()<0.5?-6:6});break;}}
  let id=0;
  for(let h=0;h<p.buracos;h++)for(let t=0;t<40;t++){
    const s=70+rnd()*(L-100),d=FAIXAS[Math.floor(rnd()*3)]+(rnd()-0.5)*2.4;
    if(blo.some(o=>s>o.s-10&&s<o.s+o.len+10))continue;
    if(bur.some(o=>Math.abs(o.s-s)<12))continue;
    bur.push({s,d,id:id++});break;}
  // trecho livre na faixa d (sem bloqueio, buraco, rampa ou faixa de turbo por perto)
  const livre=(s,d,folga)=>!blo.some(o=>s>o.s-folga&&s<o.s+o.len+folga&&Math.abs(o.d-d)<5)
    &&!bur.some(o=>Math.abs(o.s-s)<folga&&Math.abs(o.d-d)<4)
    &&!rampas.some(o=>Math.abs(o.s-s)<folga+20)&&!pads.some(o=>Math.abs(o.s-s)<folga&&Math.abs(o.d-d)<4);
  const nRampas=Math.min(1+Math.floor(nivel/2),5),nPads=Math.min(2+Math.floor(nivel/2),6);
  for(let r=0;r<nRampas;r++)for(let t=0;t<60;t++){const s=120+rnd()*(L-170),d=FAIXAS[Math.floor(rnd()*3)];
    if(tunel&&s>tunel.s-30&&s<tunel.s+tunel.len+10)continue;
    if(blo.some(o=>s>o.s-40&&s<o.s+o.len+45))continue;if(bur.some(o=>s>o.s-25&&s<o.s+45))continue;
    if(rampas.some(o=>Math.abs(o.s-s)<80))continue;rampas.push({s,d});break;}
  for(let k=0;k<nPads;k++)for(let t=0;t<60;t++){const s=60+rnd()*(L-100),d=FAIXAS[Math.floor(rnd()*3)];
    if(!livre(s,d,14)||pads.some(o=>Math.abs(o.s-s)<60))continue;pads.push({s,d});break;}
  // moedas: fileiras de 5 no chão e um arco no ar depois de cada rampa
  const fileiras=Math.round(L/70);
  for(let k=0;k<fileiras;k++)for(let t=0;t<30;t++){const s=40+rnd()*(L-80),d=FAIXAS[Math.floor(rnd()*3)];
    if(!livre(s,d,8)||!livre(s+16,d,8)||moedas.some(o=>Math.abs(o.s-s)<24))continue;
    for(let i=0;i<5;i++)moedas.push({s:s+i*4,d,y:0.9,volta:-1});break;}
  for(const r of rampas)for(let i=0;i<6;i++){const x=4+i*6,tt=x/55;moedas.push({s:r.s+x,d:r.d,y:0.9+9*tt-11*tt*tt+0.4,volta:-1});}
  for(const f of [0.22,0.5,0.8])for(let t=0;t<30;t++){const s=L*f+(rnd()-0.5)*60,d=FAIXAS[Math.floor(rnd()*3)];
    if(!livre(s,d,10))continue;estrelas.push({s,d,y:1.5,volta:-1});break;}
  return{bloqueios:blo,buracos:bur,rampas,pads,moedas,estrelas,tunel,ponte};
}
export function geoRampa(){const A1=[-2.6,0,-4.5],B=[2.6,0,-4.5],C=[-2.6,1.1,0],D=[2.6,1.1,0],E=[-2.6,0,0],F=[2.6,0,0];
  const tri=[[A1,C,B],[B,C,D],[E,F,C],[F,D,C],[A1,E,C],[B,D,F]],uvs=[[[0,0],[0,1],[1,0]],[[1,0],[0,1],[1,1]]];const pos=[],uv=[];
  tri.forEach((t,i)=>{for(let k=0;k<3;k++){pos.push(...t[k]);uv.push(...(uvs[i]||[[0,0],[0,0],[0,0]])[k]);}});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;}
export function geoEstrela(){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?0.42:0.95;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);}
  const g=new THREE.ExtrudeGeometry(s,{depth:0.22,bevelEnabled:true,bevelThickness:0.06,bevelSize:0.06,bevelSegments:1});g.center();return g;}
export function montarObstaculos(cena,obs){
  const mTab=new THREE.MeshLambertMaterial({map:TEX.listra}),gTab=new THREE.BoxGeometry(5.6,0.85,0.25),gPerna=new THREE.BoxGeometry(0.15,0.6,0.15);
  const mCone=new THREE.MeshLambertMaterial({color:lin(0xff6a00)}),gCone=new THREE.ConeGeometry(0.38,1.0,10);
  const mBranco=new THREE.MeshLambertMaterial({color:lin(0xffffff)}),gFaixaCone=new THREE.CylinderGeometry(0.24,0.29,0.18,10);
  const mPlaca=new THREE.MeshBasicMaterial({map:TEX.placa,transparent:true,alphaTest:0.4,side:THREE.DoubleSide}),gPlaca=new THREE.PlaneGeometry(2.2,2.2);
  const gPoste=new THREE.CylinderGeometry(0.08,0.08,2.4,6);
  const cavalete=()=>{const g=new THREE.Group();const t=new THREE.Mesh(gTab,mTab);t.position.y=0.95;t.castShadow=true;g.add(t);
    for(const x of [-2.4,2.4]){const p=new THREE.Mesh(gPerna,mBranco);p.position.set(x,0.3,0);g.add(p);}return g;};
  for(const b of obs.bloqueios){
    cena.add(colocar(cavalete(),b.s,b.d,0));cena.add(colocar(cavalete(),b.s+b.len,b.d,0));
    const dIn=b.d-Math.sign(b.d)*2.8;
    for(let x=0;x<=b.len;x+=3.5){const c=new THREE.Group();const k=new THREE.Mesh(gCone,mCone);k.position.y=0.5;c.add(k);
      const f=new THREE.Mesh(gFaixaCone,mBranco);f.position.y=0.55;c.add(f);cena.add(colocar(c,b.s+x,dIn,0));}
    const pl=new THREE.Group();const po=new THREE.Mesh(gPoste,mBranco);po.position.y=1.2;pl.add(po);
    const sp=new THREE.Mesh(gPlaca,mPlaca);sp.position.y=2.9;pl.add(sp);cena.add(colocar(pl,b.s-0.6,b.d,0));
  }
  const gB=new THREE.CircleGeometry(2.0,22).rotateX(-Math.PI/2),gBorda=new THREE.RingGeometry(2.0,2.55,22).rotateX(-Math.PI/2);
  const mB=new THREE.MeshBasicMaterial({color:0x050505}),mBorda=new THREE.MeshLambertMaterial({color:lin(0x8a6a45)});
  for(const h of obs.buracos){cena.add(colocar(new THREE.Mesh(gBorda,mBorda),h.s,h.d,0.02));cena.add(colocar(new THREE.Mesh(gB,mB),h.s,h.d,0.03));}
  // rampas
  const gR=geoRampa(),mR=new THREE.MeshStandardMaterial({map:TEX.rampa,roughness:0.6});
  for(const r of obs.rampas){const m=new THREE.Mesh(gR,mR);m.castShadow=true;m.receiveShadow=true;cena.add(colocar(m,r.s,r.d,0));}
  // faixas de turbo (as setas andam)
  const mP=new THREE.MeshBasicMaterial({map:TEX.pad,transparent:true,opacity:0.92}),gP=new THREE.PlaneGeometry(4.4,7).rotateX(-Math.PI/2);
  for(const p of obs.pads)cena.add(colocar(new THREE.Mesh(gP,mP),p.s+3.5,p.d,0.03));
  // moedas
  const gM=new THREE.CylinderGeometry(0.55,0.55,0.14,20).rotateX(Math.PI/2);
  const mM=new THREE.MeshStandardMaterial({color:lin(0xffc21a),metalness:0.85,roughness:0.25,emissive:lin(0x6a4500),emissiveIntensity:0.6});
  const im=new THREE.InstancedMesh(gM,mM,obs.moedas.length);im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);cena.add(im);
  for(const m of obs.moedas){amostra(m.s,A);m.x=A.x+A.rx*m.d;m.z=A.z+A.rz*m.d;}
  // estrelas
  const gE=geoEstrela(),mE=new THREE.MeshStandardMaterial({color:lin(0xffe14a),emissive:lin(0xffb800),emissiveIntensity:0.8,metalness:0.3,roughness:0.3});
  for(const e of obs.estrelas){e.mesh=new THREE.Mesh(gE,mE);colocar(e.mesh,e.s,e.d,e.y);e.mesh.castShadow=true;cena.add(e.mesh);}
  return{moedasMesh:im};
}
