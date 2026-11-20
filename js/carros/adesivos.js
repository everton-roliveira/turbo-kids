// Turbo Kids · Geometria das listras (adesivo).
import {MODELOS} from './index.js';
import {geosModelo} from './geometria.js';

export function geoListras(id){
  const m=MODELOS[id],G=geosModelo(id),z0=m.corpo[0][0]+0.04,z1=m.corpo[m.corpo.length-1][0]-0.04;
  const c0=m.cabine[0][0],c1=m.cabine[m.cabine.length-1][0];const pos=[],idx=[];let ant=-1;
  for(let z=z0;z<=z1+1e-6;z+=0.05){
    const ytc=G.fc(z)[2];let y=ytc,vidro=false;
    if(z>c0&&z<c1){const yc=G.fcab(z)[2];if(yc>ytc+0.02){y=yc;vidro=!(z>m.teto[0]&&z<m.teto[1]);}}
    if(vidro){ant=-1;continue;}
    const base=pos.length/3;y+=0.016;
    for(const [a,b] of [[0.09,0.22],[-0.22,-0.09]])pos.push(a,y,z,b,y,z);
    if(ant>=0)for(let k=0;k<2;k++){const p=ant+k*2,q=base+k*2;idx.push(p,q,p+1,p+1,q,q+1);}
    ant=base;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
