// Turbo Kids · Cena 3D da garagem e o carro girando.
import {lin} from '../nucleo/util.js';
import {MODELOS,PERSONAGENS} from '../carros/index.js';
import {save} from '../nucleo/salvo.js';
import {camera,retrato} from '../nucleo/render.js';
import {criarAmbiente} from '../nucleo/ambiente.js';
import {criarCarro,descartarCarro,enfeiteJogador,piscarSirenes,animarFogoLateral} from '../carros/criar.js';
import {montarGaragemTema} from './tema.js';

export const garagem={cena:new THREE.Scene(),ang:0.7};
(function(){const c=garagem.cena;c.background=lin(0x1b1e26);
  c.environment=criarAmbiente(0x2c313c,0x5a6070,0x15171c,[{p:[0,30,0],s:[30,1,8],i:6},{p:[25,15,10],s:[1,10,20],i:3},{p:[-25,12,-10],s:[1,8,20],i:2.5},{p:[0,10,-30],s:[20,6,1],i:2}]);
  garagem.hemi=new THREE.HemisphereLight(0xffffff,0x303540,0.35);c.add(garagem.hemi);
  const d=new THREE.DirectionalLight(0xffffff,1.6);d.position.set(4,9,5);d.castShadow=true;d.shadow.mapSize.set(1024,1024);garagem.luz=d;
  Object.assign(d.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:1,far:30});d.shadow.bias=-0.0005;c.add(d);
  const piso=new THREE.Mesh(new THREE.CylinderGeometry(5,5,0.25,64),new THREE.MeshStandardMaterial({color:lin(0x24272f),roughness:0.25,metalness:0.4}));
  piso.position.y=-0.125;piso.receiveShadow=true;c.add(piso);garagem.piso=piso;
  const anel=new THREE.Mesh(new THREE.TorusGeometry(5,0.07,8,80),new THREE.MeshBasicMaterial({color:lin(0xe3120b)}));anel.rotation.x=Math.PI/2;c.add(anel);garagem.anel=anel;
})();
export const carroNaGaragem=()=>garagem.previa||save.modelo;
export function trocarCarroGaragem(){if(garagem.carro){garagem.cena.remove(garagem.carro);descartarCarro(garagem.carro);}
  const id=carroNaGaragem();if(garagem.temaId!==id)montarGaragemTema(id);
  garagem.carro=criarCarro(id,garagem.previa?MODELOS[id].cor:save.cor,PERSONAGENS[id].num,enfeiteJogador());garagem.cena.add(garagem.carro);}
trocarCarroGaragem();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{garagem.temaId=null;trocarCarroGaragem();});
export const vCam=new THREE.Vector3();
export function atualizarGaragem(dt){garagem.ang+=dt*0.35;piscarSirenes(garagem.carro,performance.now()/1000);const r=retrato?9.5:8.5;
  camera.position.set(Math.sin(garagem.ang)*r,2.6,Math.cos(garagem.ang)*r);camera.lookAt(0,0.6,0);
  const u=garagem.carro.userData;
  for(const p of u.dianteiras)p.rotation.y=Math.sin(garagem.ang*0.7)*0.25;
  // os olhos acompanham a câmera
  if(u.rosto){vCam.copy(camera.position).normalize();u.rosto.atualizar(dt,vCam.z>0?vCam.x*1.6:0,'normal');}
  // o carro mais top solta fogo de vez em quando na garagem
  if(u.fogoLateral){const t=performance.now()/1000%3;animarFogoLateral(garagem.carro,t<1.1?1.3:0);}}
