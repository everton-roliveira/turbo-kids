// Turbo Kids · Instalar como app e service worker.
import {$} from '../nucleo/util.js';
import {ehApp,foraDeMoldura} from '../nucleo/app.js';

export let pedidoInstalar=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();pedidoInstalar=e;$('#gInstalar').hidden=false;$('#gDicaInstalar').hidden=true;});
$('#gInstalar').addEventListener('click',async()=>{if(!pedidoInstalar)return;pedidoInstalar.prompt();try{await pedidoInstalar.userChoice;}catch(e){}pedidoInstalar=null;$('#gInstalar').hidden=true;});
if(foraDeMoldura&&!ehApp()&&/iPhone|iPad|iPod/.test(navigator.userAgent)){const d=$('#gDicaInstalar');d.hidden=false;
  d.textContent='📲 Para virar app: toque em Compartilhar e depois em “Adicionar à Tela de Início”.';}
if('serviceWorker' in navigator&&foraDeMoldura&&location.protocol==='https:'){
  addEventListener('load',()=>{navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});});}
