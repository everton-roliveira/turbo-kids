// Turbo Kids · Álbum de troféus.
import {$} from '../nucleo/util.js';
import {save} from '../nucleo/salvo.js';
import {TEMAS,temaDoNivel} from '../pistas/temas/index.js';

export function abrirAlbum(){
  const grade=$('#aGrade');grade.innerHTML='';const ult=Math.max(TEMAS.length,save.nivel+1);let ouros=0;
  for(let n=1;n<=ult;n++){const pos=save.trofeus[n],t=temaDoNivel(n),d=document.createElement('div');
    d.className='selo'+(pos?'':' vazio')+(pos===1?' ouro':'');if(pos===1)ouros++;
    const a=document.createElement('span');a.className='t';a.textContent=t.ico;
    const b=document.createElement('span');b.className='m';b.textContent=pos?(['🏆','🥈','🥉'][pos-1]||'🚗'):'❔';
    const c=document.createElement('small');c.textContent='Pista '+n;d.append(a,b,c);grade.appendChild(d);}
  $('#aResumo').textContent=ouros?`Você venceu ${ouros} pista${ouros>1?'s':''}! 🏆`:'Ganhe corridas para encher o álbum!';
  $('#album').hidden=false;
}
$('#gAlbum').addEventListener('click',abrirAlbum);
$('#aFechar').addEventListener('click',()=>{$('#album').hidden=true;});
