// Turbo Kids · Ponto de entrada: carrega os módulos, ajusta a tela e roda o loop.
import {save} from './nucleo/salvo.js';
import {camera,modo,redimensionar,renderer} from './nucleo/render.js';
import {Qualidade} from './nucleo/qualidade.js';
import {Som} from './audio/som.js';
import {Musica} from './audio/musica.js';
import {atualizarGaragem,garagem} from './garagem/cena.js';
import {P} from './pistas/tracado.js';
import {TEMAS} from './pistas/temas/index.js';
import {corrida} from './corrida/estado.js';
import {atualizarCorrida} from './corrida/atualizar.js';
import {renderGaragem} from './garagem/painel.js';
// módulos que só registram botões, teclas e telas
import './corrida/acoes.js';
import './interface/album.js';
import './interface/mapa.js';
import './interface/controles.js';
import './interface/instalar.js';

let ultimo=performance.now();
function loop(t){
  requestAnimationFrame(loop);const bruto=(t-ultimo)/1000,dt=Math.min(bruto,1/20);ultimo=t;
  if(modo==='garagem'){atualizarGaragem(dt);renderer.render(garagem.cena,camera);}
  else if(corrida){if(modo!=='pausa')atualizarCorrida(dt);renderer.render(corrida.cena,camera);if(modo==='corrida'&&bruto<0.5)Qualidade.medir(bruto);}
}
if(location.hash==="#teste")window.__tk={Som,Musica,TEMAS,corrida:()=>corrida,save:()=>save,P:()=>P,Qualidade,garagem};
Qualidade.aplicar();
renderGaragem();
redimensionar();
requestAnimationFrame(loop);
