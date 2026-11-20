// Turbo Kids · Tamanho da tela e loop principal.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';

/* ================= Loop ================= */
function redimensionar(){
  const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;retrato=h>w;
  if(modo==='garagem'){camera.fov=retrato?58:42;if(retrato)camera.setViewOffset(w,h,0,h*0.26,w,h);else camera.setViewOffset(w,h,w*0.23,0,w,h);}
  else if(modo==='fim'){if(retrato)camera.setViewOffset(w,h,0,h*0.2,w,h);else camera.setViewOffset(w,h,w*0.2,0,w,h);}
  else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
addEventListener('resize',redimensionar);
let ultimo=performance.now();
function loop(t){
  requestAnimationFrame(loop);const bruto=(t-ultimo)/1000,dt=Math.min(bruto,1/20);ultimo=t;
  if(modo==='garagem'){atualizarGaragem(dt);renderer.render(garagem.cena,camera);}
  else if(corrida){if(modo!=='pausa')atualizarCorrida(dt);renderer.render(corrida.cena,camera);if(modo==='corrida'&&bruto<0.5)Qualidade.medir(bruto);}
}
if(location.hash==="#teste")window.__tk={corrida:()=>corrida,save:()=>save,P:()=>P,Qualidade,garagem};
Qualidade.aplicar();renderGaragem();redimensionar();requestAnimationFrame(loop);
