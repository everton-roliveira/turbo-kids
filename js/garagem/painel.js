// Turbo Kids · Painel da garagem: escolher carro, cor, adesivo, comprar carro, oficina e opções.
import {$} from '../nucleo/util.js';
import {BUZINAS,MODELOS,ORDEM_MODELOS,PERSONAGENS,PRECO_CARRO} from '../carros/index.js';
import {PADRAO,carroLiberado,salvar,save,trocarSave} from '../nucleo/salvo.js';
import {Som} from '../audio/som.js';
import {Voz,comNome} from '../audio/voz.js';
import {ADESIVOS,AROS,CORES} from './opcoes.js';
import {MAX_UP,MELHORIAS,PRECOS} from './oficina.js';
import {pintar} from '../carros/criar.js';
import {carroNaGaragem,garagem,trocarCarroGaragem} from './cena.js';
import {temaDoNivel} from '../pistas/temas/index.js';
import {pistaAtual} from '../pistas/escolha.js';
import {iniciarCorrida} from '../corrida/iniciar.js';
import {aviso} from '../interface/telas.js';
import {Inclinacao} from '../interface/inclinacao.js';

export function chip(txt,ligado){return(b)=>{b.textContent=txt;b.setAttribute('aria-pressed',String(ligado));};}
export function renderGaragem(){
  $('#gMoedas').textContent=save.moedas;const pa=pistaAtual();$('#gNivel').textContent=pa;$('#gTema').textContent=temaDoNivel(pa).ico+' '+temaDoNivel(pa).nome;
  const vid=carroNaGaragem(),mo=MODELOS[vid],pe=PERSONAGENS[vid];$('#gNomeCarro').innerHTML='';$('#gNomeCarro').append(pe.nome+' nº '+pe.num);
  const sm=document.createElement('small');sm.textContent=mo.sub;$('#gNomeCarro').append(sm);
  const ms=$('#gModelos');
  if(!ms.children.length)for(const id of ORDEM_MODELOS){const m=MODELOS[id];const b=document.createElement('button');b.className='modelo';b.dataset.id=id;
    const i=document.createElement('i');i.style.background=m.cor;const t=document.createElement('span');const nb=document.createElement('b');nb.textContent=PERSONAGENS[id].nome+' ';
    const nn=document.createElement('em');nn.textContent=PERSONAGENS[id].num;nb.append(nn);
    const ns=document.createElement('small');ns.textContent=m.sub;t.append(nb,ns);const pr=document.createElement('span');pr.className='preco';b.append(i,t,pr);ms.appendChild(b);}
  for(const b of ms.children){const id=b.dataset.id,livre=carroLiberado(id);b.setAttribute('aria-pressed',String(id===vid));
    b.classList.toggle('travado',!livre);b.querySelector('.preco').textContent=livre?'':'🔒 💰 '+PRECO_CARRO[id];}
  // compra do carro que está na garagem (prévia)
  const cp=$('#gCompra');cp.hidden=!garagem.previa;
  if(garagem.previa){const preco=PRECO_CARRO[vid],falta=preco-save.moedas;
    $('#gCompraTxt').textContent=falta>0?`O ${pe.nome} custa 💰 ${preco}. Faltam ${falta} moedas. Ganhe corridas para juntar!`:`O ${pe.nome} custa 💰 ${preco}.`;
    const bc=$('#gComprarCarro');bc.disabled=falta>0;bc.textContent='Comprar por 💰 '+preco;}
  const cores=$('#gCores');
  if(!cores.children.length)for(const [hex,nome] of CORES){const b=document.createElement('button');b.className='cor';b.style.background=hex;b.dataset.cor=hex;b.setAttribute('aria-label',nome);cores.appendChild(b);}
  for(const b of cores.children)b.setAttribute('aria-pressed',String(b.dataset.cor===save.cor));
  const ads=$('#gAdesivos');
  if(!ads.children.length)for(const [id,nome] of ADESIVOS){const b=document.createElement('button');b.className='chip';b.dataset.id=id;b.textContent=nome;ads.appendChild(b);}
  for(const b of ads.children)b.setAttribute('aria-pressed',String(b.dataset.id===save.adesivo));
  const aros=$('#gAros');
  if(!aros.children.length){const o=document.createElement('button');o.className='aro orig';o.dataset.aro='';o.textContent='Original';aros.appendChild(o);
    for(const [hex,nome] of AROS){const b=document.createElement('button');b.className='aro';b.style.backgroundColor=hex;b.dataset.aro=hex;b.setAttribute('aria-label','Rodas '+nome);aros.appendChild(b);}}
  for(const b of aros.children)b.setAttribute('aria-pressed',String((b.dataset.aro||null)===save.aro));
  const ni=$('#gNome');if(document.activeElement!==ni)ni.value=save.nome||'';
  $('#gMelhorias').innerHTML=MELHORIAS.map(m=>{const n=save.up[m.id],max=n>=MAX_UP,preco=PRECOS[n];
    return `<div class="melhoria"><div class="m-ico">${m.ico}</div><div class="m-info"><b>${m.nome}</b><small>${m.txt}</small></div>
      <div class="pips">${Array.from({length:MAX_UP},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div>
      <button class="m-comprar" data-id="${m.id}" ${max||save.moedas<preco?'disabled':''}>${max?'MÁXIMO':'💰 '+preco}</button></div>`;}).join('');
  chip(save.som?'🔊 Som ligado':'🔇 Som desligado',save.som)($('#gSom'));
  chip(save.musica?'🎵 Música ligada':'🎵 Música desligada',save.musica)($('#gMusica'));
  chip(save.voz?'🗣️ Voz ligada':'🗣️ Voz desligada',save.voz)($('#gVoz'));
  chip('Acelerar sozinho: '+(save.auto?'sim':'não'),save.auto)($('#gAuto'));
  chip('😀 Carinhas: '+(save.rosto?'sim':'não'),save.rosto)($('#gRosto'));
  chip('🛟 Desvio no turbo: '+(save.desvioTurbo?'sim':'não'),save.desvioTurbo)($('#gAjuda'));
  chip(save.inclinar?'📱 Virar inclinando: sim':'📱 Virar inclinando: não',save.inclinar)($('#gInclinar'));
  const n=Object.keys(save.trofeus).length;$('#gAlbum').textContent='🏆 Álbum'+(n?' ('+n+')':'');
}
export let tNome=0;
$('#gNome').addEventListener('input',e=>{const v=e.target.value.replace(/[^\p{L}\p{N} ]/gu,'').slice(0,10);if(v!==e.target.value)e.target.value=v;
  save.nome=v.trim();salvar();clearTimeout(tNome);tNome=setTimeout(trocarCarroGaragem,350);});
$('#gNome').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur();});
$('#gModelos').addEventListener('click',e=>{const b=e.target.closest('.modelo');if(!b)return;const id=b.dataset.id;if(id===carroNaGaragem())return;
  // carro liberado: vira o carro da criança; travado: só aparece na garagem para ver e comprar
  if(carroLiberado(id)){save.modelo=id;garagem.previa=null;salvar();}else garagem.previa=id;
  trocarCarroGaragem();renderGaragem();Som.iniciar();Som.buzina(BUZINAS[id]);
  const r=garagem.carro.userData.rosto;if(r)r.reagir('feliz',1.5);
  Voz.falar('Oi! Eu sou o '+PERSONAGENS[id].nome+'!'+(carroLiberado(id)?'':' Quer me comprar?'),{urgente:true});});
$('#gComprarCarro').addEventListener('click',()=>{const id=garagem.previa,preco=PRECO_CARRO[id];if(!id||save.moedas<preco)return;
  save.moedas-=preco;save.carros.push(id);save.modelo=id;save.cor=MODELOS[id].cor;garagem.previa=null;salvar();
  trocarCarroGaragem();renderGaragem();Som.moedas();const r=garagem.carro.userData.rosto;if(r)r.reagir('feliz',2);
  Voz.falar('Oba! Agora o '+PERSONAGENS[id].nome+' é seu!',{urgente:true});});
$('#gCores').addEventListener('click',e=>{const b=e.target.closest('.cor');if(!b)return;save.cor=b.dataset.cor;salvar();
  if(save.adesivo==='listras')trocarCarroGaragem();else pintar(garagem.carro,save.cor);renderGaragem();});
$('#gAdesivos').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;save.adesivo=b.dataset.id;salvar();trocarCarroGaragem();renderGaragem();});
$('#gAros').addEventListener('click',e=>{const b=e.target.closest('.aro');if(!b)return;save.aro=b.dataset.aro||null;salvar();trocarCarroGaragem();renderGaragem();});
$('#gMelhorias').addEventListener('click',e=>{const b=e.target.closest('.m-comprar');if(!b||b.disabled)return;const id=b.dataset.id,n=save.up[id];
  if(n>=MAX_UP||save.moedas<PRECOS[n])return;Som.iniciar();save.moedas-=PRECOS[n];save.up[id]++;salvar();Som.moedas();renderGaragem();});
$('#gCorrer').addEventListener('click',()=>{if(garagem.previa){garagem.previa=null;trocarCarroGaragem();renderGaragem();}Voz.falar(comNome('Vamos correr{n}!'),{urgente:true});iniciarCorrida();});
$('#gSom').addEventListener('click',()=>{save.som=!save.som;salvar();Som.ligar(save.som);renderGaragem();});
$('#gMusica').addEventListener('click',()=>{save.musica=!save.musica;salvar();renderGaragem();});
$('#gVoz').addEventListener('click',()=>{save.voz=!save.voz;salvar();renderGaragem();if(save.voz)Voz.falar('Oi! Eu vou falar com você na corrida!',{urgente:true});});
$('#gAuto').addEventListener('click',()=>{save.auto=!save.auto;salvar();renderGaragem();});
$('#gAjuda').addEventListener('click',()=>{save.desvioTurbo=!save.desvioTurbo;salvar();renderGaragem();});
$('#gRosto').addEventListener('click',()=>{save.rosto=!save.rosto;salvar();trocarCarroGaragem();renderGaragem();
  const r=garagem.carro.userData.rosto;if(r)r.reagir('feliz',1.5);});
$('#gInclinar').addEventListener('click',async()=>{
  if(!save.inclinar){const ok=await Inclinacao.pedir();if(!ok){aviso('Este aparelho não deixou usar a inclinação','ruim');return;}}
  save.inclinar=!save.inclinar;salvar();renderGaragem();});
export let zerarArmado=0;
$('#gZerar').addEventListener('click',()=>{const b=$('#gZerar');
  if(Date.now()-zerarArmado<4000){const q=save.qualidade;trocarSave(PADRAO());save.qualidade=q;salvar();zerarArmado=0;b.textContent='Recomeçar do zero';b.classList.remove('perigo');trocarCarroGaragem();renderGaragem();return;}
  zerarArmado=Date.now();b.textContent='Toque de novo para apagar moedas, melhorias e troféus';b.classList.add('perigo');
  setTimeout(()=>{if(Date.now()-zerarArmado>=4000){b.textContent='Recomeçar do zero';b.classList.remove('perigo');}},4100);});
