// Loja nova: jogador novo só tem o Pipoca; preços em ordem; administrador libera tudo; Dragão com fogo.
const puppeteer=require('puppeteer-core');const http=require('http');const fs=require('fs');const path=require('path');
const RAIZ=process.argv[2],SAIDA=process.argv[3],CODIGO=process.argv[4];
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const srv=http.createServer((q,r)=>{let f=path.join(RAIZ,decodeURIComponent(q.url.split('?')[0].split('#')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':tipos[path.extname(f)]||'application/octet-stream'});r.end(d);});});
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await new Promise(r=>srv.listen(0,r));const base=`http://localhost:${srv.address().port}/index.html`;
  const nav=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',protocolTimeout:600000,args:['--use-angle=metal','--mute-audio']});
  const pg=await nav.newPage();await pg.setViewport({width:960,height:440});await pg.setRequestInterception(true);const T=fs.readFileSync(path.join(__dirname,'node_modules/three/build/three.min.js'));
  pg.on('request',q=>{const u=q.url();if(u.includes('cdnjs'))q.respond({status:200,contentType:'text/javascript',body:T});else if(u.startsWith('http://localhost'))q.continue();else q.abort();});
  const erros=[];pg.on('pageerror',e=>erros.push(e.message));pg.on('dialog',async d=>{await d.accept(d.type()==='prompt'?CODIGO:undefined);});
  const lista=()=>pg.$$eval('#gModelos .modelo',bs=>bs.map(b=>b.dataset.id+(b.querySelector('.preco').textContent?':'+b.querySelector('.preco').textContent.replace(/\D/g,''):':livre')).join(' '));
  await pg.goto(base+'#teste',{waitUntil:'domcontentloaded'});await pg.evaluate(()=>localStorage.clear());
  await pg.goto(base+'?novo=1#teste',{waitUntil:'domcontentloaded'});await espera(1200);
  console.log('jogador novo',await pg.evaluate(()=>__tk.save().modelo),await lista());
  await pg.screenshot({path:`${SAIDA}/pipoca.png`});
  // save antigo (sem lojaV2) mantém os 6
  await pg.evaluate(()=>localStorage.setItem('corrida-turbo-v1',JSON.stringify({moedas:100,nivel:3,modelo:'touro',cor:'#9ccf00',carros:['onibus']})));
  await pg.goto(base+'?antigo=1#teste',{waitUntil:'domcontentloaded'});await espera(1000);console.log('save antigo',await pg.evaluate(()=>__tk.save().modelo),await lista());
  // administrador libera tudo
  await pg.evaluate(()=>localStorage.clear());await pg.goto(base+'?adm=1#teste',{waitUntil:'domcontentloaded'});await espera(1000);
  for(let i=0;i<5;i++){await pg.click('#gVersao');await espera(120);}await espera(800);console.log('adm',await lista());
  await pg.click('#gModelos .modelo[data-id="dragao"]');await espera(700);
  console.log('adm escolheu dragão',await pg.evaluate(()=>({modelo:__tk.save().modelo,compra:!document.querySelector('#gCompra').hidden})));
  for(const a of [0.75,0.35,2.3]){await pg.evaluate(a=>{__tk.garagem.ang=a;},a);await pg.waitForFunction(()=>__tk.garagem.carro.userData.fogoLateral.visible,{timeout:5000});await pg.screenshot({path:`${SAIDA}/dragao-${a}.png`,clip:{x:0,y:0,width:520,height:440}});}
  await pg.evaluate(()=>document.querySelector('#gCorrer').click());await espera(4500);await pg.keyboard.down('ArrowUp');await espera(2500);await pg.keyboard.press('Space');await espera(400);
  await pg.screenshot({path:`${SAIDA}/dragao-corrida.png`});await pg.keyboard.up('ArrowUp');
  await pg.evaluate(()=>document.querySelector('#bPausa').click());await espera(300);await pg.evaluate(()=>document.querySelector('#pSair').click());await espera(500);
  for(let i=0;i<5;i++){await pg.click('#gVersao');await espera(120);}await espera(800);
  console.log('saiu do adm',await pg.evaluate(()=>__tk.save().modelo),await lista());
  console.log('ERROS',erros.length?erros:'nenhum');await nav.close();srv.close();})().catch(e=>{console.error('FALHOU',e.message);process.exit(1);});
