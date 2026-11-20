// Turbo Kids · Anúncio simulado (3 segundos) para testar os prêmios sem portal.
const tela=(txt,seg)=>new Promise(fim=>{const d=document.createElement('div');d.className='tela anuncio-teste';
  d.innerHTML='<div class="cartao"><h2>📺 Anúncio de teste</h2><p></p></div>';document.body.appendChild(d);const p=d.querySelector('p');let s=seg;
  const passo=()=>{p.textContent=txt+' '+s+'…';if(s--<=0){d.remove();fim(true);}else setTimeout(passo,1000);};passo();});
export default {
  nome:'teste',
  async carregar(){},
  carregou(){},jogando(){},parou(){},
  premiado(){return tela('O prêmio chega em',3);},
  async intervalo(){await tela('Intervalo de teste',2);},
};
