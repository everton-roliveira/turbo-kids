// Turbo Kids · Conta de administrador: com o código, os prêmios saem sem anúncio e sem limite (vale neste aparelho).
import {salvar,save} from '../nucleo/salvo.js';
import {HASH_ADMIN} from './config.js';

export const ehAdmin=()=>save.adm===true;
async function sha256(txt){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(txt));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function entrarAdmin(codigo){
  if(!codigo||!(window.crypto&&crypto.subtle))return false;
  const ok=(await sha256(codigo.trim().toLowerCase()))===HASH_ADMIN;if(ok){save.adm=true;salvar();}return ok;}
export function sairAdmin(){save.adm=false;salvar();}
