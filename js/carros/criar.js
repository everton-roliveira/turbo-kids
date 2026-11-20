// Turbo Kids · Monta um carro completo a partir do modelo.
import {lin} from '../nucleo/util.js';
import {MODELOS} from './index.js';
import {save} from '../nucleo/salvo.js';
import {texAdesivo,texPlaca} from '../nucleo/texturas.js';
import {nomeJogador} from '../audio/voz.js';
import {geoCache,geosModelo} from './geometria.js';
import {GEO,MAT,geosFixas,matAro,matCor,matNumero} from './pecas.js';
import {geoListras} from './adesivos.js';
import {criarRosto} from './rosto.js';
import {RODA} from './rodas/index.js';

// materiais do carro mais top: fogo claro de dentro da chama e neon embaixo
const fogoBrilho=c=>new THREE.MeshBasicMaterial({color:lin(c),transparent:true,opacity:0.85,blending:THREE.AdditiveBlending,depthWrite:false});
const MAT_CHAMAS=[fogoBrilho(0xff3a10),fogoBrilho(0xff8a1a),fogoBrilho(0xffe14d)],MAT_NEON=new THREE.MeshBasicMaterial({color:lin(0xb44aff)});
export function criarCarro(id,cor,numero,enfeite={}){
  const m=MODELOS[id],G=geosModelo(id),fc=G.fc,fcab=G.fcab,proprios=[];
  const raiz=new THREE.Group(),chassi=new THREE.Group();raiz.add(chassi);
  const tinta=new THREE.MeshPhysicalMaterial({color:lin(cor),metalness:0.5,roughness:0.3,clearcoat:1,clearcoatRoughness:0.06});
  const add=(pai,geo,mat,x,y,z,sombra)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);if(sombra)o.castShadow=true;pai.add(o);return o;};
  const caixa=(pai,sx,sy,sz,mat,x,y,z)=>add(pai,new THREE.BoxGeometry(sx,sy,sz),mat,x,y,z);
  add(chassi,G.corpo,[tinta,MAT.carbono],0,0,0,true);
  add(chassi,G.cab,[tinta,MAT.vidro],0,0,0,true);
  const z0=m.corpo[0][0],z1=m.corpo[m.corpo.length-1][0];
  const [w0,yb0,yt0]=fc(z0),yc0=(yb0+yt0)/2;
  // rodas (modelo escolhido na garagem; os da pasta carros/rodas/)
  const roda=RODA[enfeite.roda]||RODA.original,rodaAnim={neons:[],rotores:[],proprios};
  const re=m.rodaEsc||1,rodas=[],dianteiras=[],R=0.35*re,X=0.86;
  for(const [zz,frente] of [[m.rodas.f,true],[m.rodas.t,false]])for(const lado of [1,-1]){
    const piv=new THREE.Group();piv.position.set(lado*X,R,zz);raiz.add(piv);
    const esp=new THREE.Group();esp.scale.set(lado*re,re,re);piv.add(esp);
    const gira=new THREE.Group();esp.add(gira);
    add(gira,GEO.pneu,MAT.pneu,0,0,0,true);roda.criar({gira,esp,m,enfeite,add:(p,g,mt)=>add(p,g,mt,0,0,0),anim:rodaAnim});add(gira,GEO.disco,MAT.disco,0,0,0);
    add(esp,GEO.pinca,matCor(m.pinca),0.05,0.13,-0.12);
    rodas.push(gira);if(frente)dianteiras.push(piv);
    const w=fc(zz)[0];
    const arco=add(chassi,GEO.arco,MAT.arco,lado*(w*0.965),R,zz);arco.rotation.y=lado*Math.PI/2;arco.scale.setScalar(re);
    add(chassi,GEO.aba,tinta,lado*(w*0.975),R,zz).scale.setScalar(re);
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
  // fogo saindo pelas laterais (só o carro mais top): escapamento cromado e chamas para fora e para trás
  let fogoLateral=null;
  if(m.fogoLateral){fogoLateral=new THREE.Group();const zf=.35,[wf,ybf,ytf]=fc(zf),yf=(ybf+ytf)/2-.04;
    for(const s of [1,-1]){caixa(chassi,.12,.16,.4,MAT.cromo,s*(wf+.03),yf,zf);
      const ang=s>0?-1.0:1.0,dx=-Math.sin(ang),dz=-Math.cos(ang);
      // três chamas (vermelha por fora, amarela por dentro) que tremem e mudam de direção
      for(const [mat,esc,sobe,gira] of [[MAT_CHAMAS[0],1.9,0.04,0.12],[MAT_CHAMAS[1],1.45,-0.03,-0.1],[MAT_CHAMAS[2],0.95,0.01,0]]){
        const a=ang+s*gira,ex=-Math.sin(a),ez=-Math.cos(a);
        const f=add(fogoLateral,GEO.fogo,mat,s*(wf+.1)+ex*.45*esc,yf+sobe,zf+ez*.45*esc);f.rotation.y=a;f.scale.setScalar(esc);f.userData.esc=esc;f.userData.a=a;f.renderOrder=2;}}
    chassi.add(fogoLateral);}
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
  // peças a mais (escada, sirenes, estepe, para-choque de jipe...)
  let sirenes=null;
  if(m.extras){const mats={tinta,carbono:MAT.carbono,cromo:MAT.cromo,branco:matCor('#f2f2f2'),preto:matCor('#1b1b1f'),neon:MAT_NEON};
    if(m.extras.some(e=>e[7]==='luzA')){sirenes={a:new THREE.MeshBasicMaterial({color:0xff2020}),b:new THREE.MeshBasicMaterial({color:0x2060ff})};proprios.push(sirenes.a,sirenes.b);
      mats.luzA=sirenes.a;mats.luzB=sirenes.b;}
    for(const [tipo,sx,sy,sz,x,y,z,mk] of m.extras){
      if(tipo==='estepe'){const p=new THREE.Group();p.position.set(x,y,z);p.rotation.y=Math.PI/2;p.scale.setScalar(re);chassi.add(p);
        add(p,GEO.pneu,MAT.pneu,0,0,0,true);roda.criar({gira:p,esp:p,m,enfeite,add:(q,g,mt)=>add(q,g,mt,0,0,0),anim:rodaAnim});continue;}
      caixa(chassi,sx,sy,sz,mats[mk]||tinta,x,y,z);}}
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
  raiz.userData={tinta,rodas,dianteiras,chassi,fogo,fogoLateral,proprios,rosto,sirenes,rodaAnim};
  return raiz;
}
export function descartarCarro(c){const u=c&&c.userData;if(!u)return;u.tinta.dispose();for(const o of u.proprios||[])o.dispose();
  c.traverse(o=>{if(o.geometry&&!geosFixas.has(o.geometry)&&!Object.values(geoCache).some(g=>g.corpo===o.geometry||g.cab===o.geometry||(g.parabrisa&&g.parabrisa.geo===o.geometry)||(g.boca&&g.boca.geo===o.geometry)))o.geometry.dispose();});}
export const enfeiteJogador=()=>({adesivo:save.adesivo,roda:save.roda,nome:nomeJogador().toUpperCase(),rosto:save.rosto});
// fogo das laterais: chamas tremendo; forca 0 apaga, 1 normal, maior no turbo
export function animarFogoLateral(carro,forca){const g=carro.userData.fogoLateral;if(!g)return;g.visible=forca>0;if(!forca)return;
  for(const f of g.children){const e=f.userData.esc,k=forca*(0.6+Math.random()*0.7);f.scale.set(e*(0.8+Math.random()*0.4),e,e*k);f.rotation.y=f.userData.a+(Math.random()-0.5)*0.15;}}
// rodas especiais: rotor girando sozinho e luz neon trocando de cor
export function animarRodas(carro,t,dt){const a=carro.userData.rodaAnim;if(!a)return;
  for(const r of a.rotores)r.rotation.x+=dt*7;
  for(const l of a.neons)l.color.setHSL((t*0.12)%1,1,0.5);}
export function piscarSirenes(carro,t){const s=carro.userData.sirenes;if(!s)return;const f=Math.floor(t*5)%2;
  s.a.color.setHex(f?0xff2020:0x3a0808);s.b.color.setHex(f?0x0a1440:0x2060ff);}
export function pintar(carro,cor){carro.userData.tinta.color.copy(lin(cor));if(carro.userData.rosto)carro.userData.rosto.cor=cor;}
