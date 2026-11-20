// Turbo Kids · Mãozinha que ensina os botões na primeira corrida.
import {$,clamp} from '../nucleo/util.js';
import {salvar,save} from '../nucleo/salvo.js';
import {modo} from '../nucleo/render.js';
import {Voz} from '../audio/voz.js';
import {corrida,entrada} from '../corrida/estado.js';

export const Tutorial={
  criar(){const passos=[];
    if(!save.auto)passos.push({id:'acel',alvo:['#bAcel'],txt:'Segure para andar',voz:'Segure o botão verde para andar!'});
    if(save.inclinar)passos.push({id:'virar',alvo:null,txt:'Incline o celular para virar',voz:'Incline o celular para virar!'});
    else passos.push({id:'virar',alvo:['#bEsq','#bDir'],txt:'Vire para desviar',voz:'Use as setas para virar!'});
    passos.push({id:'turbo',alvo:['#bTurbo'],txt:'Aperte o turbo!',voz:'Agora aperte o turbo!'});
    passos.push({id:'buzina',alvo:['#bBuzina'],txt:'Buzine! Fom fom!',voz:'Buzine para tirar o carro da frente!'});
    return{passos,i:0,t:0,falou:-1,fez:{acel:0,virar:0,turbo:false,buzina:false}};},
  atualizar(tu,dt){
    const el=$('#dica');const p=tu.passos[tu.i];
    if(!p){el.hidden=true;corrida.tut=null;save.tutorial=true;salvar();return;}
    if(modo!=='corrida'){el.hidden=true;return;}
    tu.t+=dt;const j=corrida.jogador;
    if(entrada.acel)tu.fez.acel+=dt;
    if(entrada.esq||entrada.dir||Math.abs(entrada.incl)>0.3)tu.fez.virar+=dt;
    if(tu.falou!==tu.i){tu.falou=tu.i;Voz.falar(p.voz,{urgente:true});}
    const feito={acel:tu.fez.acel>1.2,virar:tu.fez.virar>0.8,turbo:tu.fez.turbo,buzina:tu.fez.buzina}[p.id]||tu.t>12;
    if(feito){tu.i++;tu.t=0;if(p.id!=='acel')Voz.falar('Muito bem!',{urgente:true});return;}
    if(p.id==='turbo'&&j.turboCarga<30&&j.turboT<=0)j.turboCarga=30;
    el.hidden=false;el.querySelector('b').textContent=p.txt;
    let x=innerWidth/2,y=innerHeight*0.62;
    if(p.alvo){const rs=p.alvo.map(s=>$(s).getBoundingClientRect()).filter(r=>r.width);
      if(rs.length){x=rs.reduce((a,r)=>a+r.left+r.width/2,0)/rs.length;y=Math.min(...rs.map(r=>r.top))-6;}}
    x=clamp(x,110,innerWidth-110);el.style.left=x+'px';el.style.top=y+'px';
  },
};
