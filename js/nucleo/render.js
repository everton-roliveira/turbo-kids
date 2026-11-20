// Turbo Kids · Renderizador, câmera e estado da tela (modo e orientação).
import {$} from './util.js';

export const renderer=new THREE.WebGLRenderer({canvas:$('#cena'),antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
export const camera=new THREE.PerspectiveCamera(62,1,0.1,1500);
export let retrato=false, modo='garagem';
export function redimensionar(){
  const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;retrato=h>w;
  if(modo==='garagem'){camera.fov=retrato?58:42;if(retrato)camera.setViewOffset(w,h,0,h*0.26,w,h);else camera.setViewOffset(w,h,w*0.23,0,w,h);}
  else if(modo==='fim'){if(retrato)camera.setViewOffset(w,h,0,h*0.2,w,h);else camera.setViewOffset(w,h,w*0.2,0,w,h);}
  else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
addEventListener('resize',redimensionar);
// troca o valor a partir de outros módulos (um import não pode ser reatribuído)
export function mudarModo(v){modo=v;}
