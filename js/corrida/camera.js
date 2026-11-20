// Turbo Kids · Câmera da corrida e da chegada.
import {reduzMov} from '../nucleo/util.js';
import {camera,retrato} from '../nucleo/render.js';
import {A,amostra} from '../pistas/tracado.js';
import {corrida} from './estado.js';
import {definirTremor,tremor} from './fisica.js';

export const camPos=new THREE.Vector3(),camOlhar=new THREE.Vector3(),camDesejo=new THREE.Vector3();
export function atualizarCamera(dt,imediato){
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
  definirTremor(Math.max(0,tremor-dt*2.5));camera.lookAt(camOlhar);
  const fovAlvo=fimT>0?(retrato?62:48):(retrato?74:62)+(turbo?10:0);
  if(imediato)camera.fov=fovAlvo;else camera.fov+=(fovAlvo-camera.fov)*Math.min(1,4*dt);camera.updateProjectionMatrix();
  const mp=j.mesh.position,s=corrida.sol;s.position.set(mp.x+40,90,mp.z+25);s.target.position.set(mp.x,0,mp.z);s.target.updateMatrixWorld();
}
