// Turbo Kids · Mapa para escolher a pista.
import {$} from '../nucleo/util.js';
import {salvar,save} from '../nucleo/salvo.js';
import {Som} from '../audio/som.js';
import {Voz} from '../audio/voz.js';
import {TEMAS,temaDoNivel} from '../pistas/temas/index.js';
import {pistaAtual} from '../pistas/escolha.js';
import {renderGaragem} from '../garagem/painel.js';

export function abrirMapa(){
  const grade=$('#mGrade');grade.innerHTML='';const ult=Math.max(TEMAS.length,save.nivel),pa=pistaAtual();
  for(let n=1;n<=ult;n++){const pos=save.trofeus[n],t=temaDoNivel(n),livre=n<=save.nivel,b=document.createElement('button');
    b.className='selo'+(pos===1?' ouro':'')+(n===pa?' atual':'');b.disabled=!livre;b.dataset.n=n;
    const a=document.createElement('span');a.className='t';a.textContent=livre?t.ico:'🔒';
    const m=document.createElement('span');m.className='m';m.textContent=pos?(['🏆','🥈','🥉'][pos-1]||'🚗'):livre?'⭐':'';
    const c=document.createElement('small');c.textContent='Pista '+n;
    const nm=document.createElement('span');nm.className='nome';nm.textContent=livre?t.nome:'';
    b.append(a,m,c,nm);grade.appendChild(b);}
  $('#mResumo').textContent=`Você já liberou ${Math.min(save.nivel,ult)} de ${ult} pistas.`;
  $('#mapa').hidden=false;
  const atual=grade.querySelector('.atual');if(atual)atual.scrollIntoView({block:'nearest'});
}
$('#mGrade').addEventListener('click',e=>{const b=e.target.closest('button.selo');if(!b||b.disabled)return;
  const n=+b.dataset.n;save.pista=n;salvar();$('#mapa').hidden=true;renderGaragem();Som.iniciar();
  Voz.falar('Pista '+n+': '+temaDoNivel(n).nome,{urgente:true});});
$('#gPista').addEventListener('click',abrirMapa);
$('#mFechar').addEventListener('click',()=>{$('#mapa').hidden=true;});
