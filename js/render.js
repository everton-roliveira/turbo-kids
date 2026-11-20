// Turbo Kids · Renderização, qualidade gráfica e texturas.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';
/* ================= Renderização ================= */
const renderer=new THREE.WebGLRenderer({canvas:$('#cena'),antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const camera=new THREE.PerspectiveCamera(62,1,0.1,1500);
let retrato=false, modo='garagem';

/* Qualidade automática: 2 = alta (sombras), 1 = média (sem sombras), 0 = leve (menos pixels).
   Se o celular não aguentar ~45 quadros por segundo na corrida, desce um degrau e lembra para a próxima vez. */
const Qualidade={
  nivel:save.qualidade==null?2:clamp(save.qualidade,0,2),medT:0,medN:0,espera:3,
  aplicar(){const dpr=window.devicePixelRatio||1;
    renderer.setPixelRatio(this.nivel===2?Math.min(dpr,2):this.nivel===1?Math.min(dpr,1.5):1);
    const sombra=this.nivel===2;
    if(garagem&&garagem.luz)garagem.luz.castShadow=sombra;
    if(corrida&&corrida.sol)corrida.sol.castShadow=sombra;
    if(typeof redimensionar==='function')redimensionar();},
  medir(dt){if(this.nivel===0)return;if(this.espera>0){this.espera-=dt;return;}
    this.medT+=dt;this.medN++;
    if(this.medT>=3){const fps=this.medN/this.medT;this.medT=0;this.medN=0;
      if(fps<45){this.nivel--;save.qualidade=this.nivel;salvar();this.espera=2;this.aplicar();}}},
  reiniciar(){this.medT=0;this.medN=0;this.espera=3;},
};

/* Reflexo do céu/estúdio na pintura (mapa de ambiente gerado) */
function criarAmbiente(topo,horiz,chao,luzes){
  const sc=new THREE.Scene();const g=new THREE.SphereGeometry(50,32,16);const p=g.attributes.position,cols=[];
  const ct=lin(topo),ch=lin(horiz),cg=lin(chao);
  for(let i=0;i<p.count;i++){const y=p.getY(i)/50;const c=y>0?ch.clone().lerp(ct,Math.pow(y,0.6)):ch.clone().lerp(cg,Math.min(1,-y*4));cols.push(c.r,c.g,c.b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
  sc.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
  for(const l of luzes){const m=new THREE.Mesh(new THREE.BoxGeometry(l.s[0],l.s[1],l.s[2]),new THREE.MeshBasicMaterial({color:new THREE.Color(l.i,l.i,l.i*0.95)}));
    m.position.set(l.p[0],l.p[1],l.p[2]);m.lookAt(0,0,0);sc.add(m);}
  const pm=new THREE.PMREMGenerator(renderer);const rt=pm.fromScene(sc,0.02);pm.dispose();
  sc.traverse(o=>{if(o.geometry)o.geometry.dispose();});return rt.texture;
}

function tex(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;}t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
let TEX=null;
function prepararTexturas(){
  if(TEX)return;TEX={};
  TEX.asfalto=tex(256,256,(x,w,h)=>{x.fillStyle='#3a3d43';x.fillRect(0,0,w,h);
    for(let i=0;i<3500;i++){const v=40+Math.random()*35|0;x.fillStyle=`rgb(${v},${v},${v+4})`;x.fillRect(Math.random()*w,Math.random()*h,2,2);}
    x.fillStyle='#f4f4ee';x.fillRect(w*0.035,0,6,h);x.fillRect(w*0.965-6,0,6,h);
    for(const f of [1/3,2/3])x.fillRect(w*f-3,0,6,h*0.5);},true);
  TEX.zebra=tex(16,64,(x,w,h)=>{x.fillStyle='#d8261c';x.fillRect(0,0,w,h/2);x.fillStyle='#f5f5f5';x.fillRect(0,h/2,w,h/2);},true);
  TEX.muro=tex(16,64,(x,w,h)=>{x.fillStyle='#1f5fbf';x.fillRect(0,0,w,h/2);x.fillStyle='#f0f0f0';x.fillRect(0,h/2,w,h/2);},true);
  TEX.listra=tex(128,32,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#ff6a00';
    for(let i=-2;i<10;i++){x.beginPath();x.moveTo(i*16,h);x.lineTo(i*16+8,h);x.lineTo(i*16+8+h,0);x.lineTo(i*16+h,0);x.fill();}});
  TEX.placa=tex(128,128,(x,w,h)=>{x.translate(64,64);x.rotate(Math.PI/4);x.fillStyle='#111';x.fillRect(-44,-44,88,88);
    x.fillStyle='#ffc400';x.fillRect(-38,-38,76,76);x.setTransform(1,0,0,1,0,0);x.fillStyle='#111';x.font='bold 70px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('!',64,68);});
  TEX.xadrez=tex(256,32,(x,w,h)=>{for(let i=0;i<16;i++)for(let j=0;j<2;j++){x.fillStyle=(i+j)%2?'#111':'#fafafa';x.fillRect(i*16,j*16,16,16);}});
  TEX.faixa=tex(512,64,(x,w,h)=>{x.fillStyle='#16181d';x.fillRect(0,0,w,h);
    for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=(i+j)%2?'#111':'#fafafa';x.fillRect(i*16,j*16,16,16);x.fillRect(w-64+i*16,j*16,16,16);}
    x.fillStyle='#fff';x.font='800 46px "Baloo 2", sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('LARGADA',w/2,h/2+4);});
  TEX.torcida=tex(256,64,(x,w,h)=>{x.fillStyle='#2b2f3a';x.fillRect(0,0,w,h);const cs=['#e3120b','#ffc21a','#ffffff','#1e5bd8','#10a050','#ff7300'];
    for(let i=0;i<260;i++){x.fillStyle=cs[i%cs.length];x.beginPath();x.arc(Math.random()*w,Math.random()*h,3,0,7);x.fill();}},true);
  const setas=(x,w,h,fundo,cor)=>{x.fillStyle=fundo;x.fillRect(0,0,w,h);x.fillStyle=cor;
    for(let k=0;k<2;k++){const y0=k*h/2;x.beginPath();x.moveTo(w*0.1,y0+h*0.42);x.lineTo(w/2,y0+h*0.1);x.lineTo(w*0.9,y0+h*0.42);
      x.lineTo(w*0.9,y0+h*0.3+h*0.12);x.lineTo(w*0.75,y0+h*0.42);x.lineTo(w/2,y0+h*0.25);x.lineTo(w*0.25,y0+h*0.42);x.closePath();x.fill();}};
  TEX.pad=tex(64,128,(x,w,h)=>{setas(x,w,h,'#0b6cff','#9ff3ff');x.strokeStyle='#ffffff';x.lineWidth=4;x.strokeRect(2,0,w-4,h);},true);
  TEX.rampa=tex(64,64,(x,w,h)=>{x.fillStyle='#ffc21a';x.fillRect(0,0,w,h);x.fillStyle='#111';
    for(let i=-1;i<5;i++){x.beginPath();x.moveTo(i*16,0);x.lineTo(i*16+8,0);x.lineTo(i*16+8+h,h);x.lineTo(i*16+h,h);x.fill();}});
  TEX.predio=tex(64,128,(x,w,h)=>{x.fillStyle='#ffffff';x.fillRect(0,0,w,h);
    for(let i=0;i<4;i++)for(let j=0;j<10;j++){x.fillStyle=Math.random()<0.25?'#ffe9a8':'#5b6f86';x.fillRect(4+i*15,6+j*12,10,7);}},true);
}
/* adesivos laterais e placa com o nome (desenhados na hora) */
function texAdesivo(tipo){
  return tex(512,128,(x,w,h)=>{x.clearRect(0,0,w,h);x.lineJoin='round';
    if(tipo==='raio'){for(const [ox,s] of [[40,1],[300,0.8]]){x.save();x.translate(ox,h*(1-s)/2);x.scale(s*1.6,s);x.beginPath();
        x.moveTo(0,40);x.lineTo(70,10);x.lineTo(62,46);x.lineTo(130,30);x.lineTo(40,118);x.lineTo(54,70);x.lineTo(0,86);x.closePath();
        x.fillStyle='#ffd400';x.fill();x.lineWidth=7;x.strokeStyle='#111';x.stroke();x.restore();}}
    else if(tipo==='chamas'){const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#fff27a');g.addColorStop(0.35,'#ffb300');g.addColorStop(0.75,'#ff4d00');g.addColorStop(1,'rgba(220,20,0,0)');
      x.fillStyle=g;x.beginPath();x.moveTo(0,20);x.lineTo(0,108);
      const pts=[[90,118],[150,92],[230,112],[290,82],[380,100],[470,70],[400,60],[470,34],[360,40],[300,14],[220,30],[150,8],[90,22]];
      for(let i=0;i<pts.length;i++){const [px,py]=pts[i],[qx,qy]=pts[Math.max(0,i-1)];x.quadraticCurveTo((px+qx)/2,(py+qy)/2+(i%2?14:-14),px,py);}
      x.closePath();x.fill();x.lineWidth=5;x.strokeStyle='rgba(120,10,0,.8)';x.stroke();}
    else if(tipo==='estrelas'){const estrela=(cx,cy,r)=>{x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*0.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.closePath();
        x.fillStyle='#ffffff';x.fill();x.lineWidth=5;x.strokeStyle='#111';x.stroke();};
      estrela(70,64,46);estrela(190,50,30);estrela(280,78,38);estrela(390,48,26);estrela(460,84,30);}
  });
}
function texPlaca(nome){
  return tex(256,64,(x,w,h)=>{x.fillStyle='#fafafa';x.beginPath();x.roundRect?x.roundRect(2,2,w-4,h-4,10):x.rect(2,2,w-4,h-4);x.fill();
    x.lineWidth=4;x.strokeStyle='#111';x.stroke();x.fillStyle='#111';x.textAlign='center';x.textBaseline='middle';
    let tam=46;x.font=`800 ${tam}px "Baloo 2", sans-serif`;while(x.measureText(nome).width>w-24&&tam>18){tam-=2;x.font=`800 ${tam}px "Baloo 2", sans-serif`;}
    x.fillText(nome,w/2,h/2+4);});
}
