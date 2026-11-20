// Turbo Kids · Ferramentas que o decorar() de cada pista usa para espalhar objetos.
import {lin,reduzMov} from '../nucleo/util.js';
import {mesclar} from '../nucleo/mesclar.js';

export function criarFerramentas(cena,tema,base){
  const {plantar,instancia,dm,rnd,animados,centro}=base,[cx,cz]=centro;
  const mat=(c,x)=>new THREE.MeshLambertMaterial(Object.assign({color:lin(c)},x||{}));
  const brilho=c=>new THREE.MeshBasicMaterial({color:lin(c)});
  const cor=new THREE.Color();
  // peças que dividem a mesma posição; cores[k] = lista de cores da peça k (null = cor do material)
  // anim (opcional): {pecas:[índices das peças que se mexem] (padrão: todas), f:(t,b)=>({dx,dy,dz,yaw,roll,pitch,piv,ang})}
  const grupo=(pecas,qtd,raio,esc,cores,anim)=>{
    const ims=pecas.map(([g,m])=>instancia(g,m,qtd)),bases=[];
    const n=plantar(qtd,()=>({r:raio}),(i,x,z)=>{const sc=esc[0]+rnd()*(esc[1]-esc[0]),ry=rnd()*Math.PI*2;bases.push({x,z,ry,sc,fase:Math.random()*Math.PI*2});
      dm.position.set(x,0,z);dm.rotation.set(0,ry,0);dm.scale.set(sc,sc,sc);dm.updateMatrix();
      ims.forEach((im,k)=>{im.setMatrixAt(i,dm.matrix);if(cores&&cores[k])im.setColorAt(i,cor.copy(lin(cores[k][Math.floor(rnd()*cores[k].length)])));});});
    for(const im of ims){im.count=n;if(im.instanceColor)im.instanceColor.needsUpdate=true;}
    if(anim&&n&&!reduzMov)animados.push({ims:(anim.pecas||pecas.map((_,k)=>k)).map(k=>ims[k]),bases,f:anim.f});
    return{ims,bases,n};};
  // direção de quem anda em círculo (para o bicho olhar para onde vai)
  const rumo=(a,b)=>Math.atan2(-Math.sin(a),Math.cos(a))-b.ry;
  const arvoresRedondas=(qtd,copas)=>grupo([[new THREE.CylinderGeometry(0.35,0.5,2.6,7).translate(0,1.3,0),mat(tema.tronco)],
    [new THREE.IcosahedronGeometry(2.4,1).translate(0,4.4,0),mat(0xffffff)]],qtd,4,[0.7,1.4],[null,copas]);
  const B=(w,h,d,x,y,z)=>new THREE.BoxGeometry(w,h,d).translate(x,y,z);
  // palmeiras (praia, dinossauros, piratas)
  const palmeiras=qtd=>{const tr=instancia(new THREE.CylinderGeometry(0.28,0.45,8,7).translate(0,4,0).rotateZ(0.12),new THREE.MeshLambertMaterial({color:lin(tema.tronco)}),qtd);
    const folhas=[];for(let k=0;k<7;k++)folhas.push(new THREE.BoxGeometry(0.9,0.1,4.4).translate(0,0,2.1).rotateX(0.38).rotateY(k*Math.PI*2/7).translate(-0.96,7.95,0));
    const fo=instancia(mesclar(folhas),new THREE.MeshLambertMaterial({color:lin(tema.arvore),side:THREE.DoubleSide}),qtd);
    tr.count=fo.count=plantar(qtd,()=>({r:4}),(n,x,z)=>{const sc=0.75+rnd()*0.6;dm.position.set(x,0,z);dm.rotation.set(0,rnd()*Math.PI*2,0);dm.scale.set(sc,sc,sc);dm.updateMatrix();
      tr.setMatrixAt(n,dm.matrix);fo.setMatrixAt(n,dm.matrix);});};
  // pinheiros (campo, neve, noite)
  const pinheiros=qtd=>{
      const copa=instancia(new THREE.ConeGeometry(2.4,6,7),new THREE.MeshLambertMaterial({color:lin(tema.arvore)}),qtd);
      const tronco=instancia(new THREE.CylinderGeometry(0.4,0.55,1.8,6),new THREE.MeshLambertMaterial({color:lin(tema.tronco)}),qtd);
      copa.count=tronco.count=plantar(qtd,()=>({r:3}),(n,x,z)=>{const sc=0.7+rnd()*0.9;
        dm.rotation.set(0,0,0);dm.position.set(x,0.9*sc,z);dm.scale.set(sc,sc,sc);dm.updateMatrix();tronco.setMatrixAt(n,dm.matrix);
        dm.position.set(x,(1.8+3)*sc,z);dm.updateMatrix();copa.setMatrixAt(n,dm.matrix);});
  };
  return {cena,tema,rnd,dm,plantar,instancia,animados,cx,cz,mat,brilho,cor,grupo,rumo,arvoresRedondas,B,palmeiras,pinheiros};
}
