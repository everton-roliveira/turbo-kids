// Prêmios com anúncio (anúncio simulado) e modo administrador.
const puppeteer=require('puppeteer-core');const http=require('http');const fs=require('fs');const path=require('path');
const RAIZ=process.argv[2],SAIDA=process.argv[3],CODIGO=process.argv[4];
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const srv=http.createServer((q,r)=>{let f=path.join(RAIZ,decodeURIComponent(q.url.split('?')[0].split('#')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':tipos[path.extname(f)]||'application/octet-stream'});r.end(d);});});
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await new Promise(r=>srv.listen(0,r));const base=`http://localhost:${srv.address().port}/index.html`;
  const nav=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',protocolTimeout:600000,args:['--use-angle=metal','--mute-audio']});
  const pg=await nav.newPage();await pg.setViewport({width:960,height:440});await pg.setRequestInterception(true);const T=fs.readFileSync(path.join(__dirname,'node_modules/three/build/three.min.js'));
  pg.on('request',q=>{const u=q.url();if(u.includes('cdnjs'))q.respond({status:200,contentType:'text/javascript',body:T});else if(u.startsWith('http://localhost'))q.continue();else q.abort();});
  const erros=[];pg.on('pageerror',e=>erros.push(e.message));
  pg.on('dialog',async d=>{await d.accept(d.type()==='prompt'?CODIGO:undefined);});
  const vis=()=>pg.evaluate(()=>({turbo:!document.querySelector('#gTurboAnuncio').hidden,moedasBt:document.querySelector('#gMoedasAnuncio').hidden?null:document.querySelector('#gMoedasAnuncio').textContent,
    moedas:__tk.save().moedas,versao:document.querySelector('#gVersao').textContent,chip:!document.querySelector('#gAnuncios').hidden}));
  // 1) site normal: sem portal, sem botões
  await pg.goto(base+'#teste',{waitUntil:'domcontentloaded'});
  await pg.evaluate(()=>localStorage.setItem('corrida-turbo-v1',JSON.stringify({moedas:100,nivel:2,cor:'#d40000',modelo:'rosso',tutorial:true})));
  await pg.goto(base+'?a=1#teste',{waitUntil:'domcontentloaded'});await espera(1200);console.log('sem portal',JSON.stringify(await vis()));
  // 2) anúncio simulado
  await pg.goto(base+'?anuncios=teste#teste',{waitUntil:'domcontentloaded'});await espera(1200);console.log('teste',JSON.stringify(await vis()));
  await pg.click('#gMoedasAnuncio');await espera(1500);await pg.screenshot({path:`${SAIDA}/anuncio-tela.png`});await espera(3000);
  console.log('depois do anúncio',JSON.stringify(await vis()));
  await pg.evaluate(()=>document.querySelector('#gTurboAnuncio').click());await espera(4500);
  await espera(4500);console.log('corrida com turbos',await pg.evaluate(()=>({modo:!!__tk.corrida(),extra:__tk.corrida().turbosExtra})));
  await pg.keyboard.press('Space');await espera(300);console.log('após usar turbo',await pg.evaluate(()=>({extra:__tk.corrida().turbosExtra,carga:__tk.corrida().jogador.turboCarga,badge:document.querySelector('#bTurbo').dataset.extra})));
  // termina e dobra
  await pg.evaluate(()=>{const c=__tk.corrida(),j=c.jogador;j.prog=c.p.voltas*__tk.P().L-3;j.v=50;for(const o of c.carros)if(o!==j)o.prog=Math.min(o.prog,j.prog-50);});await espera(6500);
  const antes=await pg.evaluate(()=>({m:__tk.save().moedas,bt:document.querySelector('#rDobrar').textContent,vis:!document.querySelector('#rDobrar').hidden}));
  await pg.screenshot({path:`${SAIDA}/anuncio-resultado.png`});
  await pg.click('#rDobrar');await espera(4500);console.log('dobrar',JSON.stringify(antes),await pg.evaluate(()=>__tk.save().moedas));
  // limite do dia
  await pg.evaluate(()=>{const s=__tk.save();s.anuncios.n=6;});await pg.evaluate(()=>document.querySelector('#rGaragem').click());await espera(500);
  console.log('limite',JSON.stringify(await vis()));
  // 3) administrador: 5 toques na versão
  for(let i=0;i<5;i++){await pg.click('#gVersao');await espera(120);}await espera(800);
  console.log('adm',JSON.stringify(await vis()));
  const m0=await pg.evaluate(()=>__tk.save().moedas);await pg.click('#gMoedasAnuncio');await espera(400);console.log('adm moedas sem anúncio',m0,'->',await pg.evaluate(()=>__tk.save().moedas),'tela de anúncio?',await pg.evaluate(()=>!!document.querySelector('.anuncio-teste')));
  await pg.screenshot({path:`${SAIDA}/anuncio-adm.png`});
  // código errado não entra
  await pg.evaluate(()=>{__tk.save().adm=false;});
  console.log('ERROS',erros.length?erros:'nenhum');await nav.close();srv.close();})().catch(e=>{console.error('FALHOU',e.message);process.exit(1);});
