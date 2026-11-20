// Turbo Kids · Funções básicas usadas em todo o jogo ($, clamp, sorteio com semente, cor linear).
export const $=s=>document.querySelector(s);
export const mod=(a,n)=>((a%n)+n)%n;
export const clamp=(v,a,b)=>v<a?a:v>b?b:v;
export function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export const reduzMov=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!window.THREE){document.body.insertAdjacentHTML('beforeend','<div class="tela"><div class="cartao"><h2>Ops!</h2><p>O jogo não carregou. Verifique a internet e abra de novo.</p></div></div>');throw new Error('Three.js não carregou');}
export const lin=h=>new THREE.Color(h).convertSRGBToLinear();
