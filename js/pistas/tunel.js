// Turbo Kids · Túnel.
import {lin} from '../nucleo/util.js';
import {TEX} from '../nucleo/texturas.js';
import {HW,P,colocar,fitaH,idxDe,paredeV} from './tracado.js';

export function montarTunel(cena,t){
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
