// Fotos dos carros novos de 3 ângulos na garagem.
const puppeteer=require('puppeteer-core');const http=require('http');const fs=require('fs');const path=require('path');
const RAIZ=process.argv[2],SAIDA=process.argv[3];
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const srv=http.createServer((q,r)=>{let f=path.join(RAIZ,decodeURIComponent(q.url.split('?')[0].split('#')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':tipos[path.extname(f)]||'application/octet-stream'});r.end(d);});});
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await new Promise(r=>srv.listen(0,r));const url=`http://localhost:${srv.address().port}/index.html#teste`;
  const nav=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',protocolTimeout:600000,args:['--use-angle=metal','--mute-audio']});
  const pg=await nav.newPage();await pg.setViewport({width:960,height:440});await pg.setRequestInterception(true);const T=fs.readFileSync(path.join(__dirname,'node_modules/three/build/three.min.js'));
  pg.on('request',q=>{const u=q.url();if(u.includes('cdnjs'))q.respond({status:200,contentType:'text/javascript',body:T});else if(u.startsWith('http://localhost'))q.continue();else q.abort();});
  const erros=[];pg.on('pageerror',e=>erros.push(e.message));
  await pg.goto(url,{waitUntil:'domcontentloaded'});
  await pg.evaluate(()=>localStorage.setItem('corrida-turbo-v1',JSON.stringify({moedas:5000,nivel:3,cor:'#d40000',modelo:'rosso',tutorial:true,carros:['patrulha','onibus','sirene','jipe']})));
  for(const id of (process.argv[4]||'patrulha,onibus,sirene,jipe').split(',')){
    await pg.evaluate(id=>{const s=JSON.parse(localStorage.getItem('corrida-turbo-v1'));s.modelo=id;s.cor={patrulha:'#1f3fb8',onibus:'#f5c400',sirene:'#e3120b',jipe:'#4f7a2a'}[id]||s.cor;localStorage.setItem('corrida-turbo-v1',JSON.stringify(s));},id);
    await pg.goto(url.replace('#','?'+id+'#'),{waitUntil:'domcontentloaded'});await espera(900);
    for(const a of (process.argv[5]||"0.75,2.3,3.9").split(",").map(Number)){await pg.evaluate(a=>{__tk.garagem.ang=a;},a);await espera(120);await pg.screenshot({path:`${SAIDA}/v-${id}-${a}.png`,clip:{x:0,y:0,width:520,height:440}});}}
  console.log('ERROS',erros.length?erros:'nenhum');await nav.close();srv.close();})().catch(e=>{console.error('FALHOU',e.message);process.exit(1);});
