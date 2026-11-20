// Turbo Kids · Tutorial, comemoração, telas, garagem (UI), controles e instalação.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';
/* ================= Ajuda na primeira corrida ================= */
const Tutorial={
  criar(){const passos=[];
    if(!save.auto)passos.push({id:'acel',alvo:['#bAcel'],txt:'Segure para andar',voz:'Segure o botão verde para andar!'});
    if(save.inclinar)passos.push({id:'virar',alvo:null,txt:'Incline o celular para virar',voz:'Incline o celular para virar!'});
    else passos.push({id:'virar',alvo:['#bEsq','#bDir'],txt:'Vire para desviar',voz:'Use as setas para virar!'});
    passos.push({id:'turbo',alvo:['#bTurbo'],txt:'Aperte o turbo!',voz:'Agora aperte o turbo!'});
    passos.push({id:'buzina',alvo:['#bBuzina'],txt:'Buzine! Fom fom!',voz:'Buzine para tirar o carro da frente!'});
    return{passos,i:0,t:0,falou:-1,fez:{acel:0,virar:0,turbo:false,buzina:false}};},
  atualizar(tu,dt){
    const el=$('#dica');const p=tu.passos[tu.i];
    if(!p){el.hidden=true;corrida.tut=null;save.tutorial=true;salvar();return;}
    if(modo!=='corrida'){el.hidden=true;return;}
    tu.t+=dt;const j=corrida.jogador;
    if(entrada.acel)tu.fez.acel+=dt;
    if(entrada.esq||entrada.dir||Math.abs(entrada.incl)>0.3)tu.fez.virar+=dt;
    if(tu.falou!==tu.i){tu.falou=tu.i;Voz.falar(p.voz,{urgente:true});}
    const feito={acel:tu.fez.acel>1.2,virar:tu.fez.virar>0.8,turbo:tu.fez.turbo,buzina:tu.fez.buzina}[p.id]||tu.t>12;
    if(feito){tu.i++;tu.t=0;if(p.id!=='acel')Voz.falar('Muito bem!',{urgente:true});return;}
    if(p.id==='turbo'&&j.turboCarga<30&&j.turboT<=0)j.turboCarga=30;
    el.hidden=false;el.querySelector('b').textContent=p.txt;
    let x=innerWidth/2,y=innerHeight*0.62;
    if(p.alvo){const rs=p.alvo.map(s=>$(s).getBoundingClientRect()).filter(r=>r.width);
      if(rs.length){x=rs.reduce((a,r)=>a+r.left+r.width/2,0)/rs.length;y=Math.min(...rs.map(r=>r.top))-6;}}
    x=clamp(x,110,innerWidth-110);el.style.left=x+'px';el.style.top=y+'px';
  },
};

/* ================= Comemoração (confete e fogos) ================= */
const Festa={raf:0,
  iniciar(pos){this.parar();if(pos>3)return;const cv=$('#festa'),x=cv.getContext('2d');cv.hidden=false;
    const dpr=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    const W=innerWidth,H=innerHeight,cores=['#e3120b','#ffc21a','#22b45a','#1e5bd8','#ff4fa3','#ffffff','#ff7300'];
    const conf=[];const qtd=reduzMov?40:(pos===1?170:90);
    for(let i=0;i<qtd;i++)conf.push({x:Math.random()*W,y:-20-Math.random()*H*0.8,vx:(Math.random()-0.5)*60,vy:80+Math.random()*120,
      r:Math.random()*6,vr:(Math.random()-0.5)*8,w:6+Math.random()*6,h:10+Math.random()*8,c:cores[i%cores.length],f:Math.random()*6});
    const fa=[];let tF=0,tempo=0,ultimo=performance.now();
    const passo=(t)=>{const dt=Math.min(0.05,(t-ultimo)/1000);ultimo=t;tempo+=dt;x.clearRect(0,0,W,H);
      if(pos===1&&!reduzMov&&tempo<5.5){tF-=dt;if(tF<=0){tF=0.45+Math.random()*0.4;const cx=W*(0.15+Math.random()*0.7),cy=H*(0.12+Math.random()*0.35),cor=cores[Math.floor(Math.random()*cores.length)];
        for(let k=0;k<46;k++){const a=k/46*Math.PI*2,v=120+Math.random()*90;fa.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,v:1,c:cor});}Som.fogos();}}
      for(let i=fa.length-1;i>=0;i--){const p=fa[i];p.vy+=160*dt;p.vx*=0.985;p.x+=p.vx*dt;p.y+=p.vy*dt;p.v-=dt*0.8;if(p.v<=0){fa.splice(i,1);continue;}
        x.globalAlpha=p.v;x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,2.6,0,7);x.fill();}
      x.globalAlpha=1;
      for(const c of conf){c.f+=dt*4;c.x+=(c.vx+Math.sin(c.f)*40)*dt;c.y+=c.vy*dt;c.r+=c.vr*dt;
        if(c.y>H+20&&tempo<4){c.y=-20;c.x=Math.random()*W;}
        x.save();x.translate(c.x,c.y);x.rotate(c.r);x.scale(1,Math.cos(c.f));x.fillStyle=c.c;x.fillRect(-c.w/2,-c.h/2,c.w,c.h);x.restore();}
      if(tempo<9)this.raf=requestAnimationFrame(passo);else this.parar();};
    this.raf=requestAnimationFrame(passo);},
  parar(){cancelAnimationFrame(this.raf);const cv=$('#festa');cv.hidden=true;},
};

function mostrarResultado(){
  corrida.mostrou=true;modo='fim';Musica.parar();$('#dica').hidden=true;redimensionar();
  const pos=corrida.jogador.posFinal,premio=PREMIO[pos-1]||0,passou=pos<=3,pegas=corrida.pegas,total=premio+pegas;
  const nv=corrida.nivel;save.trofeus[nv]=Math.min(save.trofeus[nv]||99,pos);
  // passou: libera a próxima (se esta era a última liberada) e já deixa a próxima escolhida
  save.moedas+=total;if(passou){if(nv>=save.nivel)save.nivel=nv+1;save.pista=nv+1;}salvar();
  const md=$('#rMedalha');md.textContent=['🏆','🥈','🥉'][pos-1]||'🚗';md.classList.toggle('gira',passou);
  $('#rTitulo').textContent=pos+'º lugar!';
  $('#rTexto').textContent=passou?(pos===1?'Você é o campeão! ':'Muito bem! ')+'Vamos para a pista '+save.pista+'!'
    :'Precisa chegar entre os 3 primeiros. Compre melhorias na garagem e tente de novo!';
  $('#rDetalhe').textContent=pegas?`prêmio ${premio} + moedas da pista ${pegas}`:'';
  $('#rCorrer').textContent=passou?'Próxima ▶':'De novo ▶';
  $('#resultado').hidden=false;
  const el=$('#rPremio');let v=0;const passo=Math.max(5,Math.round(total/30));
  const conta=()=>{v=Math.min(total,v+passo);el.textContent=v;if(v<total)requestAnimationFrame(conta);};conta();
  if(passou){Som.vitoria();Festa.iniciar(pos);}else Som.moedas();
  const ordinal=['primeiro','segundo','terceiro','quarto','quinto','sexto'][pos-1];
  Voz.falar(passou?(pos===1?comNome('Parabéns{n}! Você é o campeão!'):'Muito bem! Você ficou em '+ordinal+' lugar!')
    :'Você ficou em '+ordinal+' lugar. Vamos tentar de novo!',{urgente:true});
}
function irGaragem(){
  modo='garagem';$('#hud').hidden=true;$('#resultado').hidden=true;$('#pausa').hidden=true;$('#contagem').hidden=true;$('#dica').hidden=true;
  $('#turboFx').style.opacity='0';$('#garagem').hidden=false;Som.motorAtualizar(0,false,false);Musica.parar();Festa.parar();
  renderGaragem();redimensionar();
}
function pausar(){if(modo!=='corrida'&&modo!=='contagem')return;corrida.modoAntes=modo;modo='pausa';$('#pausa').hidden=false;$('#dica').hidden=true;
  Som.motorAtualizar(0,false,false);Musica.parar();try{speechSynthesis.cancel();}catch(e){}}
function continuar(){if(modo!=='pausa')return;modo=corrida.modoAntes;$('#pausa').hidden=true;if(modo==='corrida')Musica.iniciar();}
function aviso(txt,cls){const el=$('#aviso');el.textContent=txt;el.className='';void el.offsetWidth;el.className='mostra '+(cls||'');}

/* ================= UI da garagem ================= */
function chip(txt,ligado){return(b)=>{b.textContent=txt;b.setAttribute('aria-pressed',String(ligado));};}
function renderGaragem(){
  $('#gMoedas').textContent=save.moedas;const pa=pistaAtual();$('#gNivel').textContent=pa;$('#gTema').textContent=temaDoNivel(pa).ico+' '+temaDoNivel(pa).nome;
  const mo=MODELOS[save.modelo],pe=PERSONAGENS[save.modelo];$('#gNomeCarro').innerHTML='';$('#gNomeCarro').append(pe.nome+' nº '+pe.num);
  const sm=document.createElement('small');sm.textContent=mo.sub;$('#gNomeCarro').append(sm);
  const ms=$('#gModelos');
  if(!ms.children.length)for(const id of ORDEM_MODELOS){const m=MODELOS[id];const b=document.createElement('button');b.className='modelo';b.dataset.id=id;
    const i=document.createElement('i');i.style.background=m.cor;const t=document.createElement('span');const nb=document.createElement('b');nb.textContent=PERSONAGENS[id].nome+' ';
    const nn=document.createElement('em');nn.textContent=PERSONAGENS[id].num;nb.append(nn);
    const ns=document.createElement('small');ns.textContent=m.sub;t.append(nb,ns);b.append(i,t);ms.appendChild(b);}
  for(const b of ms.children)b.setAttribute('aria-pressed',String(b.dataset.id===save.modelo));
  const cores=$('#gCores');
  if(!cores.children.length)for(const [hex,nome] of CORES){const b=document.createElement('button');b.className='cor';b.style.background=hex;b.dataset.cor=hex;b.setAttribute('aria-label',nome);cores.appendChild(b);}
  for(const b of cores.children)b.setAttribute('aria-pressed',String(b.dataset.cor===save.cor));
  const ads=$('#gAdesivos');
  if(!ads.children.length)for(const [id,nome] of ADESIVOS){const b=document.createElement('button');b.className='chip';b.dataset.id=id;b.textContent=nome;ads.appendChild(b);}
  for(const b of ads.children)b.setAttribute('aria-pressed',String(b.dataset.id===save.adesivo));
  const aros=$('#gAros');
  if(!aros.children.length){const o=document.createElement('button');o.className='aro orig';o.dataset.aro='';o.textContent='Original';aros.appendChild(o);
    for(const [hex,nome] of AROS){const b=document.createElement('button');b.className='aro';b.style.backgroundColor=hex;b.dataset.aro=hex;b.setAttribute('aria-label','Rodas '+nome);aros.appendChild(b);}}
  for(const b of aros.children)b.setAttribute('aria-pressed',String((b.dataset.aro||null)===save.aro));
  const ni=$('#gNome');if(document.activeElement!==ni)ni.value=save.nome||'';
  $('#gMelhorias').innerHTML=MELHORIAS.map(m=>{const n=save.up[m.id],max=n>=MAX_UP,preco=PRECOS[n];
    return `<div class="melhoria"><div class="m-ico">${m.ico}</div><div class="m-info"><b>${m.nome}</b><small>${m.txt}</small></div>
      <div class="pips">${Array.from({length:MAX_UP},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div>
      <button class="m-comprar" data-id="${m.id}" ${max||save.moedas<preco?'disabled':''}>${max?'MÁXIMO':'💰 '+preco}</button></div>`;}).join('');
  chip(save.som?'🔊 Som ligado':'🔇 Som desligado',save.som)($('#gSom'));
  chip(save.musica?'🎵 Música ligada':'🎵 Música desligada',save.musica)($('#gMusica'));
  chip(save.voz?'🗣️ Voz ligada':'🗣️ Voz desligada',save.voz)($('#gVoz'));
  chip('Acelerar sozinho: '+(save.auto?'sim':'não'),save.auto)($('#gAuto'));
  chip('😀 Carinhas: '+(save.rosto?'sim':'não'),save.rosto)($('#gRosto'));
  chip('🛟 Desvio no turbo: '+(save.desvioTurbo?'sim':'não'),save.desvioTurbo)($('#gAjuda'));
  chip(save.inclinar?'📱 Virar inclinando: sim':'📱 Virar inclinando: não',save.inclinar)($('#gInclinar'));
  const n=Object.keys(save.trofeus).length;$('#gAlbum').textContent='🏆 Álbum'+(n?' ('+n+')':'');
}
function abrirAlbum(){
  const grade=$('#aGrade');grade.innerHTML='';const ult=Math.max(TEMAS.length,save.nivel+1);let ouros=0;
  for(let n=1;n<=ult;n++){const pos=save.trofeus[n],t=temaDoNivel(n),d=document.createElement('div');
    d.className='selo'+(pos?'':' vazio')+(pos===1?' ouro':'');if(pos===1)ouros++;
    const a=document.createElement('span');a.className='t';a.textContent=t.ico;
    const b=document.createElement('span');b.className='m';b.textContent=pos?(['🏆','🥈','🥉'][pos-1]||'🚗'):'❔';
    const c=document.createElement('small');c.textContent='Pista '+n;d.append(a,b,c);grade.appendChild(d);}
  $('#aResumo').textContent=ouros?`Você venceu ${ouros} pista${ouros>1?'s':''}! 🏆`:'Ganhe corridas para encher o álbum!';
  $('#album').hidden=false;
}
/* mapa: escolher qualquer pista já liberada */
function abrirMapa(){
  const grade=$('#mGrade');grade.innerHTML='';const ult=Math.max(TEMAS.length,save.nivel),pa=pistaAtual();
  for(let n=1;n<=ult;n++){const pos=save.trofeus[n],t=temaDoNivel(n),livre=n<=save.nivel,b=document.createElement('button');
    b.className='selo'+(pos===1?' ouro':'')+(n===pa?' atual':'');b.disabled=!livre;b.dataset.n=n;
    const a=document.createElement('span');a.className='t';a.textContent=livre?t.ico:'🔒';
    const m=document.createElement('span');m.className='m';m.textContent=pos?(['🏆','🥈','🥉'][pos-1]||'🚗'):livre?'⭐':'';
    const c=document.createElement('small');c.textContent='Pista '+n;
    const nm=document.createElement('span');nm.className='nome';nm.textContent=livre?t.nome:'';
    b.append(a,m,c,nm);grade.appendChild(b);}
  $('#mResumo').textContent=`Você já liberou ${Math.min(save.nivel,ult)} de ${ult} pistas.`;
  $('#mapa').hidden=false;
  const atual=grade.querySelector('.atual');if(atual)atual.scrollIntoView({block:'nearest'});
}
$('#mGrade').addEventListener('click',e=>{const b=e.target.closest('button.selo');if(!b||b.disabled)return;
  const n=+b.dataset.n;save.pista=n;salvar();$('#mapa').hidden=true;renderGaragem();Som.iniciar();
  Voz.falar('Pista '+n+': '+temaDoNivel(n).nome,{urgente:true});});
$('#gPista').addEventListener('click',abrirMapa);
$('#mFechar').addEventListener('click',()=>{$('#mapa').hidden=true;});
let tNome=0;
$('#gNome').addEventListener('input',e=>{const v=e.target.value.replace(/[^\p{L}\p{N} ]/gu,'').slice(0,10);if(v!==e.target.value)e.target.value=v;
  save.nome=v.trim();salvar();clearTimeout(tNome);tNome=setTimeout(trocarCarroGaragem,350);});
$('#gNome').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur();});
$('#gModelos').addEventListener('click',e=>{const b=e.target.closest('.modelo');if(!b||b.dataset.id===save.modelo)return;
  save.modelo=b.dataset.id;salvar();trocarCarroGaragem();renderGaragem();Som.iniciar();Som.buzina(BUZINAS[save.modelo]);
  const r=garagem.carro.userData.rosto;if(r)r.reagir('feliz',1.5);
  Voz.falar('Oi! Eu sou o '+PERSONAGENS[save.modelo].nome+'!',{urgente:true});});
$('#gCores').addEventListener('click',e=>{const b=e.target.closest('.cor');if(!b)return;save.cor=b.dataset.cor;salvar();
  if(save.adesivo==='listras')trocarCarroGaragem();else pintar(garagem.carro,save.cor);renderGaragem();});
$('#gAdesivos').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;save.adesivo=b.dataset.id;salvar();trocarCarroGaragem();renderGaragem();});
$('#gAros').addEventListener('click',e=>{const b=e.target.closest('.aro');if(!b)return;save.aro=b.dataset.aro||null;salvar();trocarCarroGaragem();renderGaragem();});
$('#gMelhorias').addEventListener('click',e=>{const b=e.target.closest('.m-comprar');if(!b||b.disabled)return;const id=b.dataset.id,n=save.up[id];
  if(n>=MAX_UP||save.moedas<PRECOS[n])return;Som.iniciar();save.moedas-=PRECOS[n];save.up[id]++;salvar();Som.moedas();renderGaragem();});
$('#gCorrer').addEventListener('click',()=>{Voz.falar(comNome('Vamos correr{n}!'),{urgente:true});iniciarCorrida();});
$('#gSom').addEventListener('click',()=>{save.som=!save.som;salvar();Som.ligar(save.som);renderGaragem();});
$('#gMusica').addEventListener('click',()=>{save.musica=!save.musica;salvar();renderGaragem();});
$('#gVoz').addEventListener('click',()=>{save.voz=!save.voz;salvar();renderGaragem();if(save.voz)Voz.falar('Oi! Eu vou falar com você na corrida!',{urgente:true});});
$('#gAuto').addEventListener('click',()=>{save.auto=!save.auto;salvar();renderGaragem();});
$('#gAjuda').addEventListener('click',()=>{save.desvioTurbo=!save.desvioTurbo;salvar();renderGaragem();});
$('#gRosto').addEventListener('click',()=>{save.rosto=!save.rosto;salvar();trocarCarroGaragem();renderGaragem();
  const r=garagem.carro.userData.rosto;if(r)r.reagir('feliz',1.5);});
$('#gInclinar').addEventListener('click',async()=>{
  if(!save.inclinar){const ok=await Inclinacao.pedir();if(!ok){aviso('Este aparelho não deixou usar a inclinação','ruim');return;}}
  save.inclinar=!save.inclinar;salvar();renderGaragem();});
$('#gAlbum').addEventListener('click',abrirAlbum);
$('#aFechar').addEventListener('click',()=>{$('#album').hidden=true;});
let zerarArmado=0;
$('#gZerar').addEventListener('click',()=>{const b=$('#gZerar');
  if(Date.now()-zerarArmado<4000){const q=save.qualidade;save=PADRAO();save.qualidade=q;salvar();zerarArmado=0;b.textContent='Recomeçar do zero';b.classList.remove('perigo');trocarCarroGaragem();renderGaragem();return;}
  zerarArmado=Date.now();b.textContent='Toque de novo para apagar moedas, melhorias e troféus';b.classList.add('perigo');
  setTimeout(()=>{if(Date.now()-zerarArmado>=4000){b.textContent='Recomeçar do zero';b.classList.remove('perigo');}},4100);});
$('#rGaragem').addEventListener('click',irGaragem);
$('#rCorrer').addEventListener('click',iniciarCorrida);
$('#bPausa').addEventListener('click',pausar);
$('#pVoltar').addEventListener('click',continuar);
$('#pSair').addEventListener('click',irGaragem);

/* ================= Controles ================= */
function segurar(el,on,off){
  el.addEventListener('pointerdown',e=>{e.preventDefault();try{el.setPointerCapture(e.pointerId);}catch(_){}el.classList.add('ativo');on();});
  const solta=()=>{el.classList.remove('ativo');off();};
  el.addEventListener('pointerup',solta);el.addEventListener('pointercancel',solta);el.addEventListener('lostpointercapture',solta);
  el.addEventListener('contextmenu',e=>e.preventDefault());
}
segurar($('#bEsq'),()=>entrada.esq=true,()=>entrada.esq=false);
segurar($('#bDir'),()=>entrada.dir=true,()=>entrada.dir=false);
segurar($('#bAcel'),()=>entrada.acel=true,()=>entrada.acel=false);
segurar($('#bTurbo'),usarTurbo,()=>{});
segurar($('#bBuzina'),buzinar,()=>{});
const teclas={ArrowLeft:'esq',KeyA:'esq',ArrowRight:'dir',KeyD:'dir',ArrowUp:'acel',KeyW:'acel'};
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;
  if(teclas[e.code]){entrada[teclas[e.code]]=true;e.preventDefault();}
  else if(e.code==='Space'||e.code==='ShiftLeft'){usarTurbo();e.preventDefault();}
  else if(e.code==='KeyH'||e.code==='KeyB'){if(!e.repeat)buzinar();}
  else if(e.code==='KeyP'||e.code==='Escape'){modo==='pausa'?continuar():pausar();}});
addEventListener('keyup',e=>{if(teclas[e.code])entrada[teclas[e.code]]=false;});
document.addEventListener('touchmove',e=>{if(modo!=='garagem')e.preventDefault();},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden){pausar();Musica.parar();}});
addEventListener('pointerdown',()=>{if(Som.ctx&&Som.ctx.state==='suspended')Som.ctx.resume();},{passive:true});
// tocar no carro da garagem faz ele buzinar
$('#cena').addEventListener('pointerdown',()=>{if(modo==='garagem')buzinar();});

/* Virar inclinando o celular: mede quanto o lado direito da tela desceu */
const Inclinacao={ouvindo:false,
  async pedir(){
    if(!window.DeviceOrientationEvent)return false;
    try{if(typeof DeviceOrientationEvent.requestPermission==='function'){const r=await DeviceOrientationEvent.requestPermission();if(r!=='granted')return false;}}catch(e){return false;}
    this.ouvir();return true;},
  ouvir(){if(this.ouvindo)return;this.ouvindo=true;
    addEventListener('deviceorientation',e=>{if(e.beta==null||e.gamma==null)return;
      const b=e.beta*Math.PI/180,g=e.gamma*Math.PI/180;
      const ang=mod(Math.round(((screen.orientation&&screen.orientation.angle!=null)?screen.orientation.angle:(window.orientation||0))),360);
      const ux=-Math.cos(b)*Math.sin(g),uy=Math.sin(b);
      const t=ang===90?uy:ang===180?ux:ang===270?-uy:-ux;
      const zona=0.06,cheio=0.34,a=Math.abs(t);
      entrada.incl=a<zona?0:Math.sign(t)*Math.min(1,(a-zona)/(cheio-zona));});},
};
if(save.inclinar&&!(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function'))Inclinacao.ouvir();
else if(save.inclinar){// no iPhone a permissão precisa de um toque: pede no primeiro toque
  addEventListener('pointerdown',function f(){removeEventListener('pointerdown',f);Inclinacao.pedir();},{once:true});}

/* ================= Instalar como app ================= */
let pedidoInstalar=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();pedidoInstalar=e;$('#gInstalar').hidden=false;$('#gDicaInstalar').hidden=true;});
$('#gInstalar').addEventListener('click',async()=>{if(!pedidoInstalar)return;pedidoInstalar.prompt();try{await pedidoInstalar.userChoice;}catch(e){}pedidoInstalar=null;$('#gInstalar').hidden=true;});
if(foraDeMoldura&&!ehApp()&&/iPhone|iPad|iPod/.test(navigator.userAgent)){const d=$('#gDicaInstalar');d.hidden=false;
  d.textContent='📲 Para virar app: toque em Compartilhar e depois em “Adicionar à Tela de Início”.';}
if('serviceWorker' in navigator&&foraDeMoldura&&location.protocol==='https:'){
  addEventListener('load',()=>{navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});});}
