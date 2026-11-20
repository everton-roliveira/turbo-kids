// Turbo Kids · Obstáculos, corrida, física, IA e câmera.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';
/* ---- Obstáculos, rampas, faixas de turbo, moedas e estrelas ---- */
function gerarObstaculos(p,nivel){
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
function geoRampa(){const A1=[-2.6,0,-4.5],B=[2.6,0,-4.5],C=[-2.6,1.1,0],D=[2.6,1.1,0],E=[-2.6,0,0],F=[2.6,0,0];
  const tri=[[A1,C,B],[B,C,D],[E,F,C],[F,D,C],[A1,E,C],[B,D,F]],uvs=[[[0,0],[0,1],[1,0]],[[1,0],[0,1],[1,1]]];const pos=[],uv=[];
  tri.forEach((t,i)=>{for(let k=0;k<3;k++){pos.push(...t[k]);uv.push(...(uvs[i]||[[0,0],[0,0],[0,0]])[k]);}});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;}
function geoEstrela(){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?0.42:0.95;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);}
  const g=new THREE.ExtrudeGeometry(s,{depth:0.22,bevelEnabled:true,bevelThickness:0.06,bevelSize:0.06,bevelSegments:1});g.center();return g;}
function montarObstaculos(cena,obs){
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

/* ================= Corrida ================= */
let corrida=null;
const entrada={acel:false,esq:false,dir:false,incl:0};
const camPos=new THREE.Vector3(),camOlhar=new THREE.Vector3(),camDesejo=new THREE.Vector3();
let tremor=0;
const difProg=(a,b)=>mod(a.prog-b.prog+P.L/2,P.L)-P.L/2;
const ehApp=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
const foraDeMoldura=(()=>{try{return window.self===window.top;}catch(e){return false;}})();

function descartarCorrida(){if(!corrida)return;
  for(const c of corrida.carros)for(const o of c.mesh.userData.proprios||[])o.dispose();
  corrida.cena.traverse(o=>{if(o.geometry&&!geosFixas.has(o.geometry)&&!Object.values(geoCache).some(g=>g.corpo===o.geometry||g.cab===o.geometry))o.geometry.dispose();});
  if(corrida.cena.environment)corrida.cena.environment.dispose();corrida=null;}

function telaCheia(){
  if(!foraDeMoldura||ehApp()||!matchMedia('(pointer:coarse)').matches)return;
  const el=document.documentElement;if(document.fullscreenElement||!el.requestFullscreen)return;
  try{el.requestFullscreen({navigationUI:'hide'}).catch(()=>{});}catch(e){}
}

function iniciarCorrida(){
  Som.iniciar();prepararTexturas();descartarCorrida();telaCheia();Musica.parar();
  const nivel=save.nivel,p=paramsNivel(nivel);P=construirPista(nivel);
  const tema=temaDoNivel(nivel);
  const cena=new THREE.Scene();cena.background=lin(tema.ceu);cena.fog=new THREE.Fog(lin(tema.nevoa),160,720);
  cena.environment=criarAmbiente(tema.ceuTopo,tema.nevoa,tema.chao,tema.noite?[{p:[10,25,10],s:[4,4,4],i:1.5}]:[{p:[20,30,15],s:[5,5,5],i:14}]);
  cena.add(new THREE.HemisphereLight(lin(tema.ceu),lin(tema.chao),0.45*tema.luz+0.15));
  const sol=new THREE.DirectionalLight(0xfff4e0,1.5*tema.luz);sol.castShadow=Qualidade.nivel===2;sol.shadow.mapSize.set(1024,1024);
  Object.assign(sol.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:10,far:300});sol.shadow.bias=-0.0006;sol.shadow.normalBias=0.02;
  cena.add(sol,sol.target);
  const obs=gerarObstaculos(p,nivel);
  montarCenario(cena,tema,obs);
  const {moedasMesh}=montarObstaculos(cena,obs);
  // adversários: cada um é um modelo diferente
  const rivais=ORDEM_MODELOS.filter(id=>id!==save.modelo);
  for(let i=rivais.length-1;i>0;i--){const j=Math.floor(P.rnd()*(i+1));[rivais[i],rivais[j]]=[rivais[j],rivais[i]];}
  const usadas=new Set([save.cor.toLowerCase()]);const extras=CORES_EXTRA.slice();
  const carros=[],vagaJogador=3;let jogador=null;
  for(let i=0;i<6;i++){
    const eh=i===vagaJogador;let modelo,cor;
    if(eh){modelo=save.modelo;cor=save.cor;}
    else{modelo=rivais.pop();cor=MODELOS[modelo].cor;if(usadas.has(cor.toLowerCase()))cor=extras.find(c=>!usadas.has(c.toLowerCase()));usadas.add(cor.toLowerCase());}
    const mesh=criarCarro(modelo,cor,PERSONAGENS[modelo].num,eh?enfeiteJogador():{rosto:save.rosto});cena.add(mesh);
    const c={mesh,modelo,cor,ehJogador:eh,ia:!eh,prog:-6-Math.floor(i/2)*9,d:i%2?4:-4,vd:0,v:0,alvoVd:0,acelerando:false,multV:1,
      estado:'normal',tFora:0,dFora:0,dirFora:1,invul:0,lento:0,turboT:0,turboCarga:30,terminou:false,pulo:0,tBuraco:0,
      alt:0,valt:0,tRampa:0,tPad:0,
      decisao:{},faixaAlvo:i%2?6:-6,tDecide:0,ramT:0,afastaT:0};
    if(eh){Object.assign(c,statsJogador());jogador=c;}
    else Object.assign(c,{vmax:p.aiVmax+(P.rnd()*2-1)*4,acel:p.iaAcel,lat:7,latRam:nivel<=4?9:13,rateLat:5,fatorLento:0.5,lentoDur:1.5,perdaBuraco:0.45});
    carros.push(c);
  }
  corrida={cena,sol,p,obs,carros,jogador,tema,nivel,moedasMesh,ordem:[],contagem:3.6,ultimoNum:4,fimT:0,mostrou:false,
    pegas:0,posAnt:4,voltaAnt:0,turboAvisado:true,t:0,tut:null};
  const barra=$('#hProg');barra.innerHTML='';
  for(const c of carros){const el=document.createElement('i');el.className='ponto'+(c.ehJogador?' eu':'');el.style.background=c.cor;barra.appendChild(el);c.ponto=el;}
  $('#hud').classList.remove('chegou');$('#hud').hidden=false;$('#garagem').hidden=true;$('#resultado').hidden=true;$('#pausa').hidden=true;$('#album').hidden=true;
  $('#bAcel').classList.toggle('auto',save.auto);$('#bAcel').textContent=save.auto?'AUTO':'ACELERAR';
  document.body.classList.toggle('inclinar',!!save.inclinar);
  entrada.acel=entrada.esq=entrada.dir=false;
  Festa.parar();
  if(!save.tutorial)corrida.tut=Tutorial.criar();
  modo='contagem';redimensionar();Qualidade.reiniciar();
  for(const c of carros)atualizarVisual(c,0);
  atualizarMoedas(0);
  atualizarCamera(0,true);atualizarHUD();
  const ct=$('#contagem');ct.hidden=false;ct.className='';ct.textContent='';
}

function usarTurbo(){const j=corrida&&corrida.jogador;if(!j||modo!=='corrida'||j.ia)return;
  if(j.turboCarga>=30&&j.turboT<=0&&j.estado==='normal'){j.turboT=3;j.turboCarga=0;corrida.turboAvisado=false;Som.turbo();aviso('TURBO! 🔥','bom');
    if(corrida.tut)corrida.tut.fez.turbo=true;}}
function buzinar(){
  Som.iniciar();
  if(modo==='garagem'){Som.buzina(BUZINAS[save.modelo]);const r=garagem.carro&&garagem.carro.userData.rosto;if(r)r.reagir(Math.random()<0.5?'feliz':'susto',1.2);return;}
  if(!corrida||modo!=='corrida')return;const j=corrida.jogador;
  Som.buzina(BUZINAS[j.modelo]);if(corrida.tut)corrida.tut.fez.buzina=true;
  // o carro logo à frente sai do caminho
  for(const c of corrida.carros){if(c===j||c.estado!=='normal'||c.terminou)continue;
    const ds=difProg(c,j);if(ds>2&&ds<30&&Math.abs(c.d-j.d)<3.5){
      const opcoes=FAIXAS.filter(f=>Math.abs(f-j.d)>4);c.faixaAlvo=opcoes.sort((a,b)=>Math.abs(a-c.d)-Math.abs(b-c.d))[0];c.afastaT=1.6;c.ramT=0;}}
}

function controlarJogador(c){
  c.acelerando=save.auto||entrada.acel;
  let steer=(entrada.dir?1:0)-(entrada.esq?1:0);
  if(save.inclinar&&!steer)steer=entrada.incl;
  c.alvoVd=steer*c.lat*Math.min(1,0.4+c.v/25);
  // desvio no turbo (opção da garagem): só durante o turbo, de botão ou de faixa, e sem a criança virar
  if(!steer&&save.desvioTurbo&&c.turboT>0){const s=mod(c.prog,P.L);
    for(const b of corrida.obs.bloqueios){const a=mod(b.s-s,P.L);
      if(a>2&&a<30+c.v*0.9&&Math.abs(c.d-b.d)<4.2){
        const livre=FAIXAS.filter(f=>Math.abs(f-b.d)>=4.5).sort((x,y)=>Math.abs(x-c.d)-Math.abs(y-c.d))[0];
        if(livre!==undefined)c.alvoVd=clamp((livre-c.d)*3,-c.lat,c.lat);break;}}}
}
function controlarIA(c,dt){
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
function fisica(c,dt){
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
function derrubar(c,dir,atk){
  c.estado='fora';c.tFora=0;c.dFora=c.d;c.dirFora=dir;c.v=0;c.vd=0;c.turboT=0;c.alt=0;c.valt=0;Som.batida();
  reagir(c,'tonto',2.6);reagir(atk,'feliz',1.6);
  if(c.ehJogador){aviso('💥 TE JOGARAM PRA FORA!','ruim');tremor=1.2;Voz.falar('Ops! O '+PERSONAGENS[atk.modelo].nome+' bateu em você!',{chave:'fora',espera:4});}
  else if(atk.ehJogador){aviso('💥 BOOM! Tirou o '+PERSONAGENS[c.modelo].nome.toUpperCase()+'!','bom');tremor=0.5;Voz.falar('Bum! Tirou o '+PERSONAGENS[c.modelo].nome+' da pista!',{chave:'boom',espera:4});}
}
function reagir(c,expr,dur){const r=c.mesh.userData.rosto;if(r)r.reagir(expr,dur);}
function colisoes(){
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
const distS=(s,alvo)=>mod(s-alvo+P.L/2,P.L)-P.L/2;
function checarObstaculos(c){
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
function checarChegada(c){
  if(c.terminou||c.prog<corrida.p.voltas*P.L)return;
  c.terminou=true;corrida.ordem.push(c);
  if(c.ehJogador){c.posFinal=corrida.ordem.length;c.ia=true;c.turboT=0;aviso('CHEGADA! 🏁','bom');}
}
function atualizarVisual(c,dt){
  const m=c.mesh,u=m.userData;
  if(c.estado==='fora'){const t=Math.min(c.tFora,1);amostra(c.prog,A);const d=c.dFora+c.dirFora*t*16;
    m.position.set(A.x+A.rx*d,3.4*4*t*(1-t),A.z+A.rz*d);m.rotation.y+=dt*9*(1-t*0.7);m.rotation.z=-c.dirFora*0.5*t;m.visible=true;u.fogo.visible=false;
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
  m.visible=c.invul>0?Math.floor(c.invul*10)%2===0:true;
  if(u.rosto){const base=c.terminou?(c.ehJogador&&c.posFinal>3?'triste':'feliz'):c.ramT>0?'bravo':c.turboT>0?'feliz':'normal';
    u.rosto.atualizar(dt,-c.alvoVd*0.09,base);}
}
const dmM=new THREE.Object3D();
function atualizarMoedas(dt){
  const ob=corrida.obs,im=corrida.moedasMesh,j=corrida.jogador,volta=Math.floor(Math.max(0,j.prog)/P.L);corrida.t+=dt;
  const giro=corrida.t*3;
  ob.moedas.forEach((m,i)=>{dmM.position.set(m.x,m.y,m.z);dmM.rotation.set(0,giro+i*0.4,0);const s=m.volta===volta?0:1;dmM.scale.set(s,s,s);dmM.updateMatrix();im.setMatrixAt(i,dmM.matrix);});
  im.instanceMatrix.needsUpdate=true;
  for(const e of ob.estrelas){e.mesh.visible=e.volta!==volta;e.mesh.rotation.y=corrida.t*2.2;e.mesh.position.y=e.y+Math.sin(corrida.t*3)*0.25;}
  if(TEX.pad)TEX.pad.offset.y=-(corrida.t*1.6)%1;
}
function atualizarCamera(dt,imediato){
  const j=corrida.jogador;amostra(j.prog,A);
  const d=j.estado==='fora'?j.dFora+j.dirFora*Math.min(j.tFora,1)*9:j.d*0.85;
  const turbo=j.turboT>0,tras=turbo?13.5:11,alt=(turbo?4.4:5.0)+j.alt*0.6;
  const fimT=j.terminou?corrida.fimT:0;
  if(fimT>0){// chegada: a câmera dá a volta até a frente do carro para mostrar a carinha
    const k=Math.min(1,fimT/1.8),e=k*k*(3-2*k),phi=e*Math.PI*0.87,D=11-e*5.6,mp=j.mesh.position;
    camDesejo.set(mp.x+(-A.tx*Math.cos(phi)+A.rx*Math.sin(phi))*D,5-e*3.2,mp.z+(-A.tz*Math.cos(phi)+A.rz*Math.sin(phi))*D);
    camPos.copy(camDesejo);camOlhar.set(mp.x+A.tx*e*1.2,0.9+(1-e)*0.3,mp.z+A.tz*e*1.2);}
  else{
  camDesejo.set(A.x+A.rx*d-A.tx*tras,alt,A.z+A.rz*d-A.tz*tras);
  if(imediato)camPos.copy(camDesejo);else camPos.lerp(camDesejo,1-Math.exp(-5*dt));
  camOlhar.set(A.x+A.rx*d+A.tx*12,1.2+j.alt*0.8,A.z+A.rz*d+A.tz*12);}
  camera.position.copy(camPos);
  if(tremor>0&&!reduzMov){camera.position.x+=(Math.random()-0.5)*tremor;camera.position.y+=(Math.random()-0.5)*tremor;}
  tremor=Math.max(0,tremor-dt*2.5);camera.lookAt(camOlhar);
  const fovAlvo=fimT>0?(retrato?62:48):(retrato?74:62)+(turbo?10:0);
  if(imediato)camera.fov=fovAlvo;else camera.fov+=(fovAlvo-camera.fov)*Math.min(1,4*dt);camera.updateProjectionMatrix();
  const mp=j.mesh.position,s=corrida.sol;s.position.set(mp.x+40,90,mp.z+25);s.target.position.set(mp.x,0,mp.z);s.target.updateMatrixWorld();
}
const hudCache={};
function setTxt(id,v){if(hudCache[id]!==v){hudCache[id]=v;document.getElementById(id).textContent=v;}}
function posicaoJogador(){const j=corrida.jogador;let pos=j.posFinal;if(!pos){pos=1;for(const c of corrida.carros)if(c!==j&&(c.terminou||c.prog>j.prog))pos++;}return pos;}
function atualizarHUD(){
  const j=corrida.jogador,p=corrida.p;
  const pos=posicaoJogador();
  setTxt('hPos',pos+'º');
  setTxt('hVolta','Volta '+clamp(Math.floor(Math.max(0,j.prog)/P.L)+1,1,p.voltas)+'/'+p.voltas);
  setTxt('hVel',String(Math.round(j.v*4)));
  setTxt('hMoedas',String(corrida.pegas));
  for(const c of corrida.carros)c.ponto.style.left=(clamp(c.prog/(p.voltas*P.L),0,1)*100).toFixed(1)+'%';
  const bt=$('#bTurbo');bt.style.setProperty('--carga',(j.turboT>0?100:j.turboCarga/30*100).toFixed(0)+'%');
  bt.classList.toggle('pronto',j.turboCarga>=30&&j.turboT<=0);bt.classList.toggle('ligado',j.turboT>0);
  $('#turboFx').style.opacity=j.turboT>0?'1':'0';
}
/* o que a voz fala durante a corrida */
function narrar(){
  const j=corrida.jogador;if(j.terminou)return;
  if(!corrida.turboAvisado&&j.turboCarga>=30){corrida.turboAvisado=true;Voz.falar('Turbo pronto!',{chave:'turbo',espera:8});}
  const pos=posicaoJogador();
  if(pos!==corrida.posAnt&&corrida.t>4){
    if(pos===1)Voz.falar(comNome('Primeiro lugar{n}!'),{chave:'pos',espera:7});
    else if(pos<corrida.posAnt&&pos<=3)Voz.falar(pos+'º lugar!',{chave:'pos',espera:7});}
  corrida.posAnt=pos;
  const volta=Math.floor(Math.max(0,j.prog)/P.L);
  if(volta!==corrida.voltaAnt){corrida.voltaAnt=volta;if(volta===corrida.p.voltas-1)Voz.falar('Última volta!',{urgente:true});}
}
function atualizarCorrida(dt){
  const ct=$('#contagem');
  atualizarMoedas(dt);
  if(modo==='contagem'){
    corrida.contagem-=dt;const n=Math.ceil(corrida.contagem-0.6);
    if(n!==corrida.ultimoNum){corrida.ultimoNum=n;
      if(n>0){ct.textContent=n;ct.className='';Som.bip(440,0.18,0.15);Voz.falar(['','Um','Dois','Três'][n]||String(n),{urgente:true});}
      else{ct.textContent='VAI!';ct.className='vai';Som.bip(880,0.4,0.18);Voz.falar(comNome('Vai{n}!'),{urgente:true});}}
    if(corrida.contagem<=0){modo='corrida';Musica.iniciar();setTimeout(()=>{if(modo!=='contagem')ct.hidden=true;},700);}
    Som.motorAtualizar(0,true,false);atualizarCamera(dt,false);if(corrida.tut)Tutorial.atualizar(corrida.tut,0);return;
  }
  for(const c of corrida.carros){if(c.estado!=='normal')continue;if(c.ia)controlarIA(c,dt);else controlarJogador(c);}
  for(const c of corrida.carros)fisica(c,dt);
  colisoes();
  for(const c of corrida.carros){checarObstaculos(c);checarChegada(c);}
  for(const c of corrida.carros)atualizarVisual(c,dt);
  atualizarCamera(dt,false);atualizarHUD();narrar();
  if(corrida.tut)Tutorial.atualizar(corrida.tut,dt);
  const j=corrida.jogador;Som.motorAtualizar(j.v,true,j.turboT>0);
  if(j.terminou){if(!corrida.fimT)$('#hud').classList.add('chegou');corrida.fimT+=dt;j.vmax=Math.max(18,j.vmax-dt*22);if(corrida.fimT>4.6&&!corrida.mostrou)mostrarResultado();}
}

