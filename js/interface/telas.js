// Turbo Kids · Resultado, pausa e volta para a garagem.
import {$} from '../nucleo/util.js';
import {salvar,save} from '../nucleo/salvo.js';
import {modo,mudarModo,redimensionar} from '../nucleo/render.js';
import {Som} from '../audio/som.js';
import {Musica} from '../audio/musica.js';
import {Voz,comNome} from '../audio/voz.js';
import {corrida} from '../corrida/estado.js';
import {iniciarCorrida} from '../corrida/iniciar.js';
import {Festa} from './festa.js';
import {renderGaragem} from '../garagem/painel.js';

export const PREMIO=[500,300,200,100,60,30];
export function mostrarResultado(){
  corrida.mostrou=true;mudarModo('fim');Musica.parar();$('#dica').hidden=true;redimensionar();
  const pos=corrida.jogador.posFinal,premio=PREMIO[pos-1]||0,passou=pos<=3,pegas=corrida.pegas,total=premio+pegas;
  const nv=corrida.nivel;save.trofeus[nv]=Math.min(save.trofeus[nv]||99,pos);
  // passou: libera a próxima (se esta era a última liberada) e já deixa a próxima escolhida
  save.moedas+=total;if(passou){if(nv>=save.nivel)save.nivel=nv+1;save.pista=nv+1;}salvar();
  const md=$('#rMedalha');md.textContent=['🏆','🥈','🥉'][pos-1]||'🚗';md.classList.toggle('gira',passou);
  $('#rTitulo').textContent=pos+'º lugar!';
  $('#rTexto').textContent=passou?(pos===1?'Você é o campeão! ':'Muito bem! ')+'Vamos para a pista '+save.pista+'!'
    :'Precisa chegar entre os 3 primeiros. Compre melhorias na garagem e tente de novo!';
  $('#rDetalhe').textContent=pegas?`prêmio ${premio} + moedas da pista ${pegas}`:'';
  $('#rCorrer').textContent=passou?'Próxima ▶':'De novo ▶';
  $('#resultado').hidden=false;
  const el=$('#rPremio');let v=0;const passo=Math.max(5,Math.round(total/30));
  const conta=()=>{v=Math.min(total,v+passo);el.textContent=v;if(v<total)requestAnimationFrame(conta);};conta();
  if(passou){Som.vitoria();Festa.iniciar(pos);}else Som.moedas();
  const ordinal=['primeiro','segundo','terceiro','quarto','quinto','sexto'][pos-1];
  Voz.falar(passou?(pos===1?comNome('Parabéns{n}! Você é o campeão!'):'Muito bem! Você ficou em '+ordinal+' lugar!')
    :'Você ficou em '+ordinal+' lugar. Vamos tentar de novo!',{urgente:true});
}
export function irGaragem(){
  mudarModo('garagem');$('#hud').hidden=true;$('#resultado').hidden=true;$('#pausa').hidden=true;$('#contagem').hidden=true;$('#dica').hidden=true;
  $('#turboFx').style.opacity='0';$('#garagem').hidden=false;Som.motorAtualizar(0,false,false);Musica.parar();Festa.parar();
  renderGaragem();redimensionar();
}
export function pausar(){if(modo!=='corrida'&&modo!=='contagem')return;corrida.modoAntes=modo;mudarModo('pausa');$('#pausa').hidden=false;$('#dica').hidden=true;
  Som.motorAtualizar(0,false,false);Musica.parar();try{speechSynthesis.cancel();}catch(e){}}
export function continuar(){if(modo!=='pausa')return;mudarModo(corrida.modoAntes);$('#pausa').hidden=true;if(modo==='corrida')Musica.iniciar();}
export function aviso(txt,cls){const el=$('#aviso');el.textContent=txt;el.className='';void el.offsetWidth;el.className='mostra '+(cls||'');}
$('#rGaragem').addEventListener('click',irGaragem);
$('#rCorrer').addEventListener('click',iniciarCorrida);
$('#bPausa').addEventListener('click',pausar);
$('#pVoltar').addEventListener('click',continuar);
$('#pSair').addEventListener('click',irGaragem);
