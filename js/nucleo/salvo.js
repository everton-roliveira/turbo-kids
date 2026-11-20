// Turbo Kids · Progresso salvo no aparelho (localStorage).
import {MODELOS,PRECO_CARRO} from '../carros/index.js';

// carro liberado: o que vem grátis, os comprados e, para o administrador, todos
export const carroLiberado=id=>save.adm===true||!PRECO_CARRO[id]||save.carros.includes(id);
export const CHAVE='corrida-turbo-v1';
export const PADRAO=()=>({moedas:0,nivel:1,cor:'#3bb4f2',modelo:'basico',up:{motor:0,acel:0,amort:0,pneu:0},auto:false,som:true,
  musica:true,voz:true,desvioTurbo:false,tutorial:false,adesivo:'nenhum',aro:null,nome:'',inclinar:false,trofeus:{},qualidade:null,rosto:true,carros:[],lojaV3:true,roda:'original',adesivosComprados:[],rodasCompradas:[]});
export let save=PADRAO();
try{const s=JSON.parse(localStorage.getItem(CHAVE)||'null');if(s){save=Object.assign(PADRAO(),s);save.up=Object.assign(PADRAO().up,s.up||{});
  if(!save.trofeus||typeof save.trofeus!=='object')save.trofeus={};
  // loja nova: só o Pipoca é grátis; os 6 carros que antes eram grátis voltam a ser vendidos (os comprados continuam)
  if(!s.lojaV3){const antigos=['rosso','touro','flecha','gt','v8','proto'];save.carros=(Array.isArray(s.carros)?s.carros:[]).filter(id=>!antigos.includes(id));save.lojaV3=true;delete save.lojaV2;}}}catch(e){}
if(!Array.isArray(save.carros))save.carros=[];
// adesivos e rodas agora são vendidos: o que não foi comprado volta para o grátis (a roda antiga era só uma cor)
for(const k of ['adesivosComprados','rodasCompradas'])if(!Array.isArray(save[k]))save[k]=[];
delete save.aro;
if(save.adm!==true&&save.adesivo!=='nenhum'&&!save.adesivosComprados.includes(save.adesivo))save.adesivo='nenhum';
if(save.adm!==true&&save.roda!=='original'&&!save.rodasCompradas.includes(save.roda))save.roda='original';
if(!MODELOS[save.modelo]||!carroLiberado(save.modelo))save.modelo='basico';
export function salvar(){try{localStorage.setItem(CHAVE,JSON.stringify(save));}catch(e){}}
// troca o valor a partir de outros módulos (um import não pode ser reatribuído)
export function trocarSave(v){save=v;}
