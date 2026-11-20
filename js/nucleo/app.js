// Turbo Kids · Detecta se roda instalado como app e coloca em tela cheia.
export const ehApp=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
export const foraDeMoldura=(()=>{try{return window.self===window.top;}catch(e){return false;}})();
export function telaCheia(){
  if(!foraDeMoldura||ehApp()||!matchMedia('(pointer:coarse)').matches)return;
  const el=document.documentElement;if(document.fullscreenElement||!el.requestFullscreen)return;
  try{el.requestFullscreen({navigationUI:'hide'}).catch(()=>{});}catch(e){}
}
