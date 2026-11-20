// Turbo Kids · Começa uma corrida: pista, cenário, carros e adversários.
import {$,lin} from '../nucleo/util.js';
import {MODELOS,ORDEM_MODELOS,PERSONAGENS} from '../carros/index.js';
import {save} from '../nucleo/salvo.js';
import {mudarModo,redimensionar} from '../nucleo/render.js';
import {Qualidade} from '../nucleo/qualidade.js';
import {criarAmbiente} from '../nucleo/ambiente.js';
import {prepararTexturas} from '../nucleo/texturas.js';
import {telaCheia} from '../nucleo/app.js';
import {Som} from '../audio/som.js';
import {Musica} from '../audio/musica.js';
import {CORES_EXTRA} from '../garagem/opcoes.js';
import {statsJogador} from '../garagem/oficina.js';
import {criarCarro,enfeiteJogador} from '../carros/criar.js';
import {P,construirPista,usarPista} from '../pistas/tracado.js';
import {temaDoNivel} from '../pistas/temas/index.js';
import {pistaAtual} from '../pistas/escolha.js';
import {paramsNivel} from '../pistas/dificuldade.js';
import {montarCenario} from '../pistas/cenario.js';
import {corrida,definirCorrida,descartarCorrida,entrada} from './estado.js';
import {gerarObstaculos,montarObstaculos} from './obstaculos.js';
import {atualizarMoedas,atualizarVisual} from './visual.js';
import {atualizarCamera} from './camera.js';
import {atualizarHUD} from './hud.js';
import {Tutorial} from '../interface/tutorial.js';
import {Festa} from '../interface/festa.js';

export function iniciarCorrida(){
  Som.iniciar();prepararTexturas();descartarCorrida();telaCheia();Musica.parar();
  const nivel=pistaAtual(),p=paramsNivel(nivel);usarPista(construirPista(nivel));
  const tema=temaDoNivel(nivel);
  const cena=new THREE.Scene();cena.background=lin(tema.ceu);cena.fog=new THREE.Fog(lin(tema.nevoa),160,720);
  cena.environment=criarAmbiente(tema.ceuTopo,tema.nevoa,tema.chao,tema.noite?[{p:[10,25,10],s:[4,4,4],i:1.5}]:[{p:[20,30,15],s:[5,5,5],i:14}]);
  cena.add(new THREE.HemisphereLight(lin(tema.ceu),lin(tema.chao),0.45*tema.luz+0.15));
  const sol=new THREE.DirectionalLight(0xfff4e0,1.5*tema.luz);sol.castShadow=Qualidade.nivel===2;sol.shadow.mapSize.set(1024,1024);
  Object.assign(sol.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:10,far:300});sol.shadow.bias=-0.0006;sol.shadow.normalBias=0.02;
  cena.add(sol,sol.target);
  const obs=gerarObstaculos(p,nivel);
  const animados=montarCenario(cena,tema,obs);
  const {moedasMesh}=montarObstaculos(cena,obs);
  // adversários: cada um é um modelo diferente
  const rivais=ORDEM_MODELOS.filter(id=>id!==save.modelo);
  for(let i=rivais.length-1;i>0;i--){const j=Math.floor(P.rnd()*(i+1));[rivais[i],rivais[j]]=[rivais[j],rivais[i]];}
  const usadas=new Set([save.cor.toLowerCase()]);const extras=CORES_EXTRA.slice();
  const carros=[],vagaJogador=3;let jogador=null;
  for(let i=0;i<6;i++){
    const eh=i===vagaJogador;let modelo,cor;
    if(eh){modelo=save.modelo;cor=save.cor;}
    else{modelo=rivais.pop();cor=MODELOS[modelo].cor;if(usadas.has(cor.toLowerCase()))cor=extras.find(c=>!usadas.has(c.toLowerCase()));usadas.add(cor.toLowerCase());}
    const mesh=criarCarro(modelo,cor,PERSONAGENS[modelo].num,eh?enfeiteJogador():{rosto:save.rosto});cena.add(mesh);
    const c={mesh,modelo,cor,ehJogador:eh,ia:!eh,prog:-6-Math.floor(i/2)*9,d:i%2?4:-4,vd:0,v:0,alvoVd:0,acelerando:false,multV:1,
      estado:'normal',tFora:0,dFora:0,dirFora:1,invul:0,lento:0,turboT:0,turboCarga:30,terminou:false,pulo:0,tBuraco:0,
      alt:0,valt:0,tRampa:0,tPad:0,
      decisao:{},faixaAlvo:i%2?6:-6,tDecide:0,ramT:0,afastaT:0};
    if(eh){Object.assign(c,statsJogador());jogador=c;}
    else Object.assign(c,{vmax:p.aiVmax+(P.rnd()*2-1)*4,acel:p.iaAcel,lat:7,latRam:nivel<=4?9:13,rateLat:5,fatorLento:0.5,lentoDur:1.5,perdaBuraco:0.45});
    carros.push(c);
  }
  definirCorrida({cena,sol,p,obs,carros,jogador,tema,nivel,animados,tCen:0,moedasMesh,ordem:[],contagem:3.6,ultimoNum:4,fimT:0,mostrou:false,
    pegas:0,posAnt:4,voltaAnt:0,turboAvisado:true,t:0,tut:null,turbosExtra:0});
  const barra=$('#hProg');barra.innerHTML='';
  for(const c of carros){const el=document.createElement('i');el.className='ponto'+(c.ehJogador?' eu':'');el.style.background=c.cor;barra.appendChild(el);c.ponto=el;}
  $('#hud').classList.remove('chegou');$('#hud').hidden=false;$('#garagem').hidden=true;$('#resultado').hidden=true;$('#pausa').hidden=true;$('#album').hidden=true;
  $('#bAcel').classList.toggle('auto',save.auto);$('#bAcel').textContent=save.auto?'AUTO':'ACELERAR';
  document.body.classList.toggle('inclinar',!!save.inclinar);
  entrada.acel=entrada.esq=entrada.dir=false;
  Festa.parar();
  if(!save.tutorial)corrida.tut=Tutorial.criar();
  mudarModo('contagem');redimensionar();Qualidade.reiniciar();
  for(const c of carros)atualizarVisual(c,0);
  atualizarMoedas(0);
  atualizarCamera(0,true);atualizarHUD();
  const ct=$('#contagem');ct.hidden=false;ct.className='';ct.textContent='';
}
