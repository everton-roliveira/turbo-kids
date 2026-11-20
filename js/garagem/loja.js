// Turbo Kids · Loja de adesivos e rodas: preço, o que já é seu e compra. O administrador tem tudo liberado.
import {salvar,save} from '../nucleo/salvo.js';
import {ADESIVOS} from './opcoes.js';
import {RODAS} from '../carros/rodas/index.js';

// tipo: 'adesivo' ou 'roda' (é também o nome do campo escolhido no save)
const CATALOGO={adesivo:ADESIVOS,roda:RODAS};
const COMPRADOS={adesivo:'adesivosComprados',roda:'rodasCompradas'};
export const itensDo=tipo=>CATALOGO[tipo];
export const precoItem=(tipo,id)=>(CATALOGO[tipo].find(x=>x.id===id)||{preco:0}).preco;
export const itemComprado=(tipo,id)=>(save[COMPRADOS[tipo]]||[]).includes(id);
export const itemLiberado=(tipo,id)=>save.adm===true||!precoItem(tipo,id)||itemComprado(tipo,id);
export function comprarItem(tipo,id){const preco=precoItem(tipo,id);if(save.moedas<preco)return false;
  save.moedas-=preco;(save[COMPRADOS[tipo]]=save[COMPRADOS[tipo]]||[]).push(id);save[tipo]=id;salvar();return true;}
