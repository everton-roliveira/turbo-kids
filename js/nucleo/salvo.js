// Turbo Kids · Progresso salvo no aparelho (localStorage).
import {MODELOS,PRECO_CARRO} from '../carros/index.js';

export const carroLiberado=id=>!PRECO_CARRO[id]||save.carros.includes(id);
export const CHAVE='corrida-turbo-v1';
export const PADRAO=()=>({moedas:0,nivel:1,cor:'#d40000',modelo:'rosso',up:{motor:0,acel:0,amort:0,pneu:0},auto:false,som:true,
  musica:true,voz:true,desvioTurbo:false,tutorial:false,adesivo:'nenhum',aro:null,nome:'',inclinar:false,trofeus:{},qualidade:null,rosto:true,carros:[]});
export let save=PADRAO();
try{const s=JSON.parse(localStorage.getItem(CHAVE)||'null');if(s){save=Object.assign(PADRAO(),s);save.up=Object.assign(PADRAO().up,s.up||{});
  if(!save.trofeus||typeof save.trofeus!=='object')save.trofeus={};}}catch(e){}
if(!Array.isArray(save.carros))save.carros=[];
if(!MODELOS[save.modelo]||!carroLiberado(save.modelo))save.modelo='rosso';
export function salvar(){try{localStorage.setItem(CHAVE,JSON.stringify(save));}catch(e){}}
// troca o valor a partir de outros módulos (um import não pode ser reatribuído)
export function trocarSave(v){save=v;}
