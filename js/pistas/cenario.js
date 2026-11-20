// Turbo Kids · Chão, asfalto, largada, mar e o cenário de cada pista (decorar() do tema).
import {lin} from '../nucleo/util.js';
import {TEX} from '../nucleo/texturas.js';
import {A,HW,P,amostra,colocar,fitaH,paredeV} from './tracado.js';
import {montarTunel} from './tunel.js';
import {montarPonte} from './ponte.js';
import {criarFerramentas} from './ferramentas.js';

export function montarCenario(cena,tema,extras){
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
  // cada pista espalha os seus objetos (pistas/temas/)
  tema.decorar(criarFerramentas(cena,tema,{plantar,instancia,dm,rnd,animados,centro:[(minX+maxX)/2,(minZ+maxZ)/2]}));
  return animados;
}
