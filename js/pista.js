// Turbo Kids · Traçado da pista, túnel, ponte e cenário em volta.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';
/* ================= Pista ================= */
const HW=9, FAIXAS=[-6,0,6];
let P=null;
const A={x:0,z:0,tx:0,tz:1,rx:-1,rz:0,k:0};
function construirPista(nivel){
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
function amostra(s,o){s=mod(s,P.L);const f=s/P.ds;const i=Math.floor(f)%P.N,j=(i+1)%P.N,a=f-Math.floor(f);
  o.x=P.px[i]+(P.px[j]-P.px[i])*a;o.z=P.pz[i]+(P.pz[j]-P.pz[i])*a;
  let tx=P.tx[i]+(P.tx[j]-P.tx[i])*a,tz=P.tz[i]+(P.tz[j]-P.tz[i])*a;const l=Math.hypot(tx,tz)||1;
  o.tx=tx/l;o.tz=tz/l;o.rx=-o.tz;o.rz=o.tx;o.k=P.k[i]+(P.k[j]-P.k[i])*a;return o;}
function colocar(obj,s,d,y){amostra(s,A);obj.position.set(A.x+A.rx*d,y,A.z+A.rz*d);obj.rotation.y=Math.atan2(A.tx,A.tz);return obj;}
/* faixa contínua ao longo da pista (inteira ou só um trecho a partir do índice i0) */
function tira(i0,n,a,b,repV){const pos=[],uv=[],idx=[];const vs=n>=P.N?Math.max(1,Math.round(P.L/repV))/P.N:P.ds/repV;
  for(let i=0;i<=n;i++){const j=(i0+i)%P.N,v=i*vs;pos.push(...a(j),...b(j));uv.push(0,v,1,v);
    if(i<n){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);g.computeVertexNormals();return g;}
const ptLat=(j,d,y)=>[P.px[j]+P.rx[j]*d,y,P.pz[j]+P.rz[j]*d];
function fitaH(d0,d1,y,repV,i0=0,n=P.N){return tira(i0,n,j=>ptLat(j,d0,y),j=>ptLat(j,d1,y),repV);}
function paredeV(d,y0,y1,repV,i0=0,n=P.N){return tira(i0,n,j=>ptLat(j,d,y0),j=>ptLat(j,d,y1),repV);}
const idxDe=s=>Math.floor(mod(s,P.L)/P.ds);

/* túnel: paredes, teto (faz sombra de verdade) e luzes */
function montarTunel(cena,t){
  const i0=idxDe(t.s),n=Math.round(t.len/P.ds),W=HW+2.4,H=6.6;
  const mc=new THREE.MeshStandardMaterial({color:lin(0x8d929b),roughness:0.9,side:THREE.DoubleSide});
  for(const g of [paredeV(-W,0,H,8,i0,n),paredeV(W,0,H,8,i0,n),fitaH(-W,W,H,8,i0,n)]){const m=new THREE.Mesh(g,mc);m.castShadow=true;m.receiveShadow=true;cena.add(m);}
  const mp=new THREE.MeshStandardMaterial({color:lin(0x6d6258),roughness:0.85}),mf=new THREE.MeshLambertMaterial({map:TEX.rampa});
  for(const s of [t.s,t.s+t.len]){const p=new THREE.Group();
    const viga=new THREE.Mesh(new THREE.BoxGeometry(2*W+6,3.2,1.6),mp);viga.position.y=H+1.0;viga.castShadow=true;p.add(viga);
    const faixa=new THREE.Mesh(new THREE.BoxGeometry(2*W+6.1,0.7,1.7),mf);faixa.position.y=H-0.2;p.add(faixa);
    for(const x of [-(W+1.5),W+1.5]){const c=new THREE.Mesh(new THREE.BoxGeometry(3,H+2.6,1.6),mp);c.position.set(x,(H+2.6)/2,0);c.castShadow=true;p.add(c);}
    cena.add(colocar(p,s,0,0));}
  const ml=new THREE.MeshBasicMaterial({color:lin(0xfff1c4)}),gl=new THREE.BoxGeometry(0.15,0.35,1.6);
  for(let s=t.s+4;s<t.s+t.len-2;s+=8)for(const d of [-(W-0.1),W-0.1])cena.add(colocar(new THREE.Mesh(gl,ml),s,d,H-0.9));
}
/* ponte: rio cruzando a pista e arcos vermelhos dos dois lados */
function montarPonte(cena,pt){
  const meio=pt.s+pt.len/2;
  const agua=new THREE.MeshStandardMaterial({color:lin(0x1f7fc4),roughness:0.12,metalness:0.2,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4});
  cena.add(colocar(new THREE.Mesh(new THREE.PlaneGeometry(260,pt.len-12).rotateX(-Math.PI/2),agua),meio,0,-0.03));
  const ma=new THREE.MeshStandardMaterial({color:lin(0xd23a2a),roughness:0.5,metalness:0.3}),gb=new THREE.BoxGeometry(0.5,0.5,1),gv=new THREE.BoxGeometry(0.16,1,0.16);
  const K=16,ant=new THREE.Vector3(),b=new THREE.Vector3();
  for(const lado of [-1,1]){const d=lado*(HW+1.75);
    for(let k=0;k<=K;k++){const h=1.1+6.5*Math.sin(Math.PI*k/K);amostra(pt.s+pt.len*k/K,A);b.set(A.x+A.rx*d,h,A.z+A.rz*d);
      if(k>0){const m=new THREE.Mesh(gb,ma);m.position.copy(ant).add(b).multiplyScalar(0.5);m.scale.z=ant.distanceTo(b)+0.3;m.lookAt(b);m.castShadow=true;cena.add(m);}
      if(k>0&&k<K){const v=new THREE.Mesh(gv,ma);v.scale.y=h-1;v.position.set(b.x,1+(h-1)/2,b.z);cena.add(v);}
      ant.copy(b);}}
}
function montarCenario(cena,tema,extras){
  const rnd=P.rnd,animados=[];
  const chao=new THREE.Mesh(new THREE.PlaneGeometry(4000,4000).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({color:lin(tema.chao)}));chao.position.y=-0.06;chao.receiveShadow=true;cena.add(chao);
  const asf=new THREE.Mesh(fitaH(-HW,HW,0,20),new THREE.MeshStandardMaterial({map:TEX.asfalto,roughness:0.85,metalness:0,side:THREE.DoubleSide}));asf.receiveShadow=true;cena.add(asf);
  const mz=new THREE.MeshLambertMaterial({map:TEX.zebra,side:THREE.DoubleSide});
  for(const [a,b] of [[-HW-1.3,-HW],[HW,HW+1.3]]){const z=new THREE.Mesh(fitaH(a,b,0.01,4),mz);z.receiveShadow=true;cena.add(z);}
  const mm=new THREE.MeshLambertMaterial({map:TEX.muro,side:THREE.DoubleSide});
  cena.add(new THREE.Mesh(paredeV(-HW-1.5,0,1.0,8),mm));cena.add(new THREE.Mesh(paredeV(HW+1.5,0,1.0,8),mm));
  cena.add(colocar(new THREE.Mesh(new THREE.PlaneGeometry(HW*2,2).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({map:TEX.xadrez})),0,0,0.02));
  const portico=new THREE.Group();const mp=new THREE.MeshLambertMaterial({color:lin(0xdddddd)});
  for(const x of [-(HW+2.2),HW+2.2]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.6,7.5,0.6),mp);p.position.set(x,3.75,0);portico.add(p);}
  const faixa=new THREE.Mesh(new THREE.BoxGeometry(HW*2+5,1.8,0.4),new THREE.MeshBasicMaterial({map:TEX.faixa}));faixa.position.y=6.8;portico.add(faixa);
  cena.add(colocar(portico,0,0,0));
  const arq=new THREE.Group();const mt=new THREE.MeshLambertMaterial({map:TEX.torcida});
  for(let i=0;i<3;i++){const h=1.4+i*1.6;const b=new THREE.Mesh(new THREE.BoxGeometry(4,h,46),mt);b.position.set(i*4,h/2,0);arq.add(b);}
  cena.add(colocar(arq,8,-(HW+9),0));
  if(extras.tunel)montarTunel(cena,extras.tunel);
  if(extras.ponte)montarPonte(cena,extras.ponte);
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(let i=0;i<P.N;i++){minX=Math.min(minX,P.px[i]);maxX=Math.max(maxX,P.px[i]);minZ=Math.min(minZ,P.pz[i]);maxZ=Math.max(maxZ,P.pz[i]);}
  // mar na praia
  const marX=maxX+70;
  if(tema.mar){const mar=new THREE.Mesh(new THREE.PlaneGeometry(1800,4000).rotateX(-Math.PI/2),
      new THREE.MeshStandardMaterial({color:lin(0x1f8fd0),roughness:0.1,metalness:0.25,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4}));
    mar.position.set(marX+900,-0.03,0);cena.add(mar);}
  // onde não pode plantar: no mar e no rio
  let rio=null;if(extras.ponte){amostra(extras.ponte.s+extras.ponte.len/2,A);rio={x:A.x,z:A.z,tx:A.tx,tz:A.tz,meia:extras.ponte.len/2+6};}
  const livre=(x,z,r)=>{
    if(tema.mar&&x+r>marX-6)return false;
    if(rio){const dx=x-rio.x,dz=z-rio.z;if(Math.abs(dx*rio.tx+dz*rio.tz)<rio.meia+r&&Math.abs(-dx*rio.tz+dz*rio.tx)<136)return false;}
    for(let i=0;i<P.N;i+=3){const dx=P.px[i]-x,dz=P.pz[i]-z,lim=HW+5+r;if(dx*dx+dz*dz<lim*lim)return false;}
    return true;};
  const plantar=(qtd,raio,fn)=>{let n=0;for(let t=0;t<qtd*6&&n<qtd;t++){const x=minX-120+rnd()*(maxX-minX+240),z=minZ-120+rnd()*(maxZ-minZ+240),r=raio();
    if(!livre(x,z,r.r))continue;fn(n,x,z,r);n++;}return n;};
  const dm=new THREE.Object3D();
  // frustumCulled=false: as instâncias ficam espalhadas pelo mapa, longe da origem do objeto
  const instancia=(geo,mat,qtd,sombra)=>{const im=new THREE.InstancedMesh(geo,mat,qtd);im.frustumCulled=false;if(sombra)im.castShadow=true;cena.add(im);return im;};
  const palmeiras=qtd=>{const tr=instancia(new THREE.CylinderGeometry(0.28,0.45,8,7).translate(0,4,0).rotateZ(0.12),new THREE.MeshLambertMaterial({color:lin(tema.tronco)}),qtd);
    const folhas=[];for(let k=0;k<7;k++)folhas.push(new THREE.BoxGeometry(0.9,0.1,4.4).translate(0,0,2.1).rotateX(0.38).rotateY(k*Math.PI*2/7).translate(-0.96,7.95,0));
    const fo=instancia(mesclar(folhas),new THREE.MeshLambertMaterial({color:lin(tema.arvore),side:THREE.DoubleSide}),qtd);
    tr.count=fo.count=plantar(qtd,()=>({r:4}),(n,x,z)=>{const sc=0.75+rnd()*0.6;dm.position.set(x,0,z);dm.rotation.set(0,rnd()*Math.PI*2,0);dm.scale.set(sc,sc,sc);dm.updateMatrix();
      tr.setMatrixAt(n,dm.matrix);fo.setMatrixAt(n,dm.matrix);});};
  if(tema.veg==='predio'){
    const qtd=150,im=instancia(new THREE.BoxGeometry(1,1,1).translate(0,0.5,0),new THREE.MeshStandardMaterial({map:TEX.predio,roughness:0.6,metalness:0.1}),qtd);
    const cores=[0xe8d9c4,0xc9d6e3,0xf0c9a8,0xb8c4b0,0xd9d9d9,0xa9b8cf,0xe6b8b8,0xf2e1a6].map(lin);const cor=new THREE.Color();
    im.count=plantar(qtd,()=>{const w=8+rnd()*12,d=8+rnd()*12;return{w,d,h:14+rnd()*rnd()*60,r:Math.hypot(w,d)/2+2};},(n,x,z,o)=>{
      dm.position.set(x,0,z);dm.rotation.set(0,rnd()*Math.PI,0);dm.scale.set(o.w,o.h,o.d);dm.updateMatrix();im.setMatrixAt(n,dm.matrix);
      im.setColorAt(n,cor.copy(cores[n%cores.length]));});
    if(im.instanceColor)im.instanceColor.needsUpdate=true;
  }else if(tema.veg==='palmeira'){palmeiras(160);
  }else if(['doce','dino','lua','fazenda','castelo','pirata','cogumelo','polo','obra','parque','fundo','safari','futuro','cerejeira','brinquedo','nuvem','joaninha','natal','trem'].includes(tema.veg)){
    decorarTema(cena,tema,{plantar,instancia,dm,rnd,palmeiras,animados,centro:[(minX+maxX)/2,(minZ+maxZ)/2]});
  }else if(tema.veg==='cacto'){
    const g=mesclar([new THREE.CylinderGeometry(0.5,0.55,5,8).translate(0,2.5,0),new THREE.SphereGeometry(0.5,8,6).translate(0,5,0),
      new THREE.CylinderGeometry(0.3,0.3,1.4,7).rotateZ(Math.PI/2).translate(0.9,2.2,0),new THREE.CylinderGeometry(0.3,0.3,1.8,7).translate(1.5,3.0,0),new THREE.SphereGeometry(0.3,7,5).translate(1.5,3.9,0),
      new THREE.CylinderGeometry(0.28,0.28,1.2,7).rotateZ(Math.PI/2).translate(-0.8,3.0,0),new THREE.CylinderGeometry(0.28,0.28,1.4,7).translate(-1.3,3.6,0),new THREE.SphereGeometry(0.28,7,5).translate(-1.3,4.3,0)]);
    const im=instancia(g,new THREE.MeshLambertMaterial({color:lin(tema.arvore)}),150);
    const pedra=instancia(new THREE.DodecahedronGeometry(1.6,0),new THREE.MeshLambertMaterial({color:lin(0xb07a4a)}),60);
    im.count=plantar(150,()=>({r:3}),(n,x,z)=>{const sc=0.7+rnd()*0.8;dm.position.set(x,0,z);dm.rotation.set(0,rnd()*Math.PI*2,0);dm.scale.set(sc,sc,sc);dm.updateMatrix();im.setMatrixAt(n,dm.matrix);});
    pedra.count=plantar(60,()=>({r:3}),(n,x,z)=>{const sc=0.6+rnd()*1.6;dm.position.set(x,0.4*sc,z);dm.rotation.set(rnd()*3,rnd()*3,0);dm.scale.set(sc*1.3,sc*0.7,sc);dm.updateMatrix();pedra.setMatrixAt(n,dm.matrix);});
  }else{
    const nArv=180;const copa=instancia(new THREE.ConeGeometry(2.4,6,7),new THREE.MeshLambertMaterial({color:lin(tema.arvore)}),nArv);
    const tronco=instancia(new THREE.CylinderGeometry(0.4,0.55,1.8,6),new THREE.MeshLambertMaterial({color:lin(tema.tronco)}),nArv);
    copa.count=tronco.count=plantar(nArv,()=>({r:3}),(n,x,z)=>{const sc=0.7+rnd()*0.9;
      dm.rotation.set(0,0,0);dm.position.set(x,0.9*sc,z);dm.scale.set(sc,sc,sc);dm.updateMatrix();tronco.setMatrixAt(n,dm.matrix);
      dm.position.set(x,(1.8+3)*sc,z);dm.updateMatrix();copa.setMatrixAt(n,dm.matrix);});
  }
  return animados;
}

