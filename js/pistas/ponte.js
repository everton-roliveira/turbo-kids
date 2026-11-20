// Turbo Kids · Ponte sobre o rio.
import {lin} from '../nucleo/util.js';
import {A,HW,amostra,colocar} from './tracado.js';

export function montarPonte(cena,pt){
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
