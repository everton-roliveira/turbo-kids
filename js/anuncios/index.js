// Turbo Kids · Anúncios com prêmio: escolhe o portal, conta o limite do dia e pula o anúncio para o administrador.
import {salvar,save} from '../nucleo/salvo.js';
import {aoMudarModo} from '../nucleo/render.js';
import {Som} from '../audio/som.js';
import {CONFIG_ANUNCIOS} from './config.js';
import {ehAdmin} from './admin.js';
import poki from './provedores/poki.js';
import crazygames from './provedores/crazygames.js';
import teste from './provedores/teste.js';

const PROVEDORES={poki,crazygames,teste};
function descobrir(){
  const forcado=new URLSearchParams(location.search).get('anuncios');if(forcado)return forcado;
  if(CONFIG_ANUNCIOS.plataforma!=='auto')return CONFIG_ANUNCIOS.plataforma;
  let ref='';try{ref=document.referrer;}catch(e){}
  const onde=location.hostname+' '+ref;
  if(/poki(-gdn)?\.(com|io)/.test(onde))return 'poki';
  if(/crazygames\./.test(onde))return 'crazygames';
  return 'nenhum';
}
const hoje=()=>new Date().toISOString().slice(0,10);
export const Anuncios={
  provedor:null,pronto:false,
  async iniciar(){
    const p=PROVEDORES[descobrir()];if(!p)return;this.provedor=p;
    try{await p.carregar();this.pronto=true;p.carregou();}catch(e){this.provedor=null;}
    // avisa o portal quando a criança está jogando (os portais pedem isso)
    aoMudarModo.push((novo,antes)=>{if(!this.provedor)return;if(novo==='corrida')this.provedor.jogando();else if(antes==='corrida')this.provedor.parou();});
  },
  restantes(){if(!save.anuncios||save.anuncios.dia!==hoje())save.anuncios={dia:hoje(),n:0};return Math.max(0,CONFIG_ANUNCIOS.limiteDiario-save.anuncios.n);},
  // mostra os botões de prêmio? (administrador sempre vê; os pais podem desligar)
  disponivel(){if(ehAdmin())return true;return !!(this.provedor&&this.pronto)&&save.premiosAnuncio!==false&&this.restantes()>0;},
  // vê um anúncio com prêmio; devolve true se ganhou
  async verPremiado(){
    if(ehAdmin())return true;
    if(!this.disponivel())return false;
    Som.ligar(false);let ok=false;
    try{ok=await this.provedor.premiado();}finally{Som.ligar(save.som);}
    if(ok){this.restantes();save.anuncios.n++;salvar();}
    return ok;
  },
  // intervalo antes de uma corrida (o portal decide se mostra); o administrador pula
  async antesDaCorrida(){
    if(ehAdmin()||!CONFIG_ANUNCIOS.intervaloEntreCorridas||!this.provedor||!this.pronto)return;
    Som.ligar(false);try{await this.provedor.intervalo();}finally{Som.ligar(save.som);}
  },
};
