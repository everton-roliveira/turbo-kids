// Turbo Kids · Carrega o script (SDK) de um portal só quando o jogo roda nele.
export function carregarScript(src){
  return new Promise((ok,erro)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=ok;s.onerror=erro;document.head.appendChild(s);});
}
