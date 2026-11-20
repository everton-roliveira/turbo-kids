// Turbo Kids · Garagem de cada personagem (parede, piso e objetos).
import {lin} from '../nucleo/util.js';
import {PERSONAGENS} from '../carros/index.js';
import {tex} from '../nucleo/texturas.js';
import {garagem} from './cena.js';

export function texParede(id){const p=PERSONAGENS[id],g=p.garagem;
  const t=tex(4096,320,(x,w,h)=>{x.fillStyle=g.parede;x.fillRect(0,0,w,h);
    x.fillStyle='rgba(0,0,0,.2)';for(let i=0;i<64;i++)x.fillRect(i*64,0,4,h*0.74);
    x.fillStyle='rgba(0,0,0,.28)';x.fillRect(0,h*0.78,w,h*0.22);
    x.fillStyle=g.destaque;x.fillRect(0,h*0.74,w,h*0.04);
    x.textAlign='center';x.textBaseline='middle';
    for(let k=0;k<4;k++){const cx=(k+0.5)*w/4,cy=h*0.42;
      x.fillStyle='rgba(0,0,0,.35)';x.beginPath();if(x.roundRect)x.roundRect(cx-300,cy-70,600,140,36);else x.rect(cx-300,cy-70,600,140);x.fill();
      x.lineWidth=6;x.strokeStyle=g.destaque;x.stroke();
      x.font='800 96px "Baloo 2", sans-serif';x.lineWidth=10;x.strokeStyle='#111';x.strokeText(p.nome.toUpperCase(),cx-60,cy+8);
      x.fillStyle=g.destaque;x.fillText(p.nome.toUpperCase(),cx-60,cy+8);
      x.fillStyle='#fafafa';x.beginPath();x.arc(cx+210,cy,56,0,7);x.fill();x.lineWidth=7;x.strokeStyle='#111';x.stroke();
      x.fillStyle='#111';x.font='800 70px "Baloo 2", sans-serif';x.fillText(String(p.num),cx+210,cy+6);}
  },true);t.repeat.x=-1;return t;}
export function texQuadriculado(){return tex(64,64,(x,w,h)=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=(i+j)%2?'#111':'#fafafa';x.fillRect(i*16,j*16,16,16);}});}
export function montarGaragemTema(id){
  const c=garagem.cena,g=PERSONAGENS[id].garagem;
  if(garagem.tema){c.remove(garagem.tema);garagem.tema.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});}
  const grupo=new THREE.Group();garagem.tema=grupo;garagem.temaId=id;c.add(grupo);
  c.background=lin(g.fundo);garagem.hemi.color.copy(lin(g.luz));
  garagem.piso.material.color.copy(lin(g.piso));garagem.anel.material.color.copy(lin(g.anel));
  const parede=new THREE.Mesh(new THREE.CylinderGeometry(15,15,7,64,1,true),new THREE.MeshStandardMaterial({map:texParede(id),side:THREE.BackSide,roughness:0.8}));
  parede.position.y=3.3;grupo.add(parede);
  const chao=new THREE.Mesh(new THREE.CircleGeometry(15.2,64),new THREE.MeshStandardMaterial({color:lin(g.piso),roughness:0.55,metalness:0.2}));
  chao.rotation.x=-Math.PI/2;chao.position.y=-0.2;grupo.add(chao);
  const faixa=new THREE.Mesh(new THREE.RingGeometry(6.2,6.45,64),new THREE.MeshBasicMaterial({color:lin(g.anel)}));faixa.rotation.x=-Math.PI/2;faixa.position.y=-0.19;grupo.add(faixa);
  const mat=hex=>new THREE.MeshStandardMaterial({color:lin(hex),roughness:0.6,metalness:0.1});
  const borracha=mat(0x16171a),destaque=mat(g.destaque),branco=mat(0xf2f2f2),laranja=mat(0xff6a00),cinza=mat(0x6b6f78),vermelho=mat(0xc81010);
  const xadrez=new THREE.MeshStandardMaterial({map:texQuadriculado(),side:THREE.DoubleSide});
  const n=g.itens.length;
  g.itens.forEach((tipo,i)=>{const a=(i+0.5)/n*Math.PI*2,r=11.6,o=new THREE.Group();o.position.set(Math.sin(a)*r,-0.2,Math.cos(a)*r);o.rotation.y=a+Math.PI;grupo.add(o);
    const m=(geo,mt,x,y,z)=>{const k=new THREE.Mesh(geo,mt);k.position.set(x,y,z);o.add(k);return k;};
    if(tipo==='pneus')for(const [dx,dz,h] of [[-0.6,0,4],[0.6,0.1,3]])for(let k=0;k<h;k++){const p=m(new THREE.TorusGeometry(0.42,0.2,10,24),borracha,dx,0.2+k*0.4,dz);p.rotation.x=Math.PI/2;}
    else if(tipo==='barril')for(const dx of [-0.55,0.55]){m(new THREE.CylinderGeometry(0.45,0.45,1.3,20),destaque,dx,0.65,0);
      for(const y of [0.3,1.0])m(new THREE.CylinderGeometry(0.47,0.47,0.08,20),cinza,dx,y,0);}
    else if(tipo==='cone')for(const dx of [-0.8,0,0.8]){m(new THREE.ConeGeometry(0.32,0.9,16),laranja,dx,0.45,0);m(new THREE.CylinderGeometry(0.2,0.24,0.14,16),branco,dx,0.5,0);
      m(new THREE.BoxGeometry(0.75,0.06,0.75),laranja,dx,0.03,0);}
    else if(tipo==='caixa'){m(new THREE.BoxGeometry(1.8,1.3,0.7),vermelho,0,0.65,0);for(let k=0;k<4;k++)m(new THREE.BoxGeometry(1.6,0.04,0.02),cinza,0,0.25+k*0.28,0.36);
      m(new THREE.BoxGeometry(1.0,0.5,0.6),vermelho,0,1.55,0);}
    else if(tipo==='bandeira'){m(new THREE.CylinderGeometry(0.05,0.05,3.2,8),cinza,-0.5,1.6,0);const b=m(new THREE.PlaneGeometry(1.4,0.9),xadrez,0.2,2.7,0);b.rotation.y=0.2;}
  });
}
