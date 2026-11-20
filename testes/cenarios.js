// Abre pistas escolhidas (argumento: 7,8,9), tira 4 fotos de cada cenário e mede a altura do pulo na rampa.
const puppeteer=require('puppeteer-core');const http=require('http');const fs=require('fs');const path=require('path');
const RAIZ=process.argv[2],SAIDA=process.argv[3];
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const srv=http.createServer((q,r)=>{let f=path.join(RAIZ,decodeURIComponent(q.url.split('?')[0].split('#')[0]));if(f.endsWith('/'))f+='index.html';
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':tipos[path.extname(f)]||'application/octet-stream'});r.end(d);});});
const ERROS=[];const espera=ms=>new Promise(r=>setTimeout(r,ms));let K=0;
(async()=>{
  await new Promise(r=>srv.listen(0,r));const url=`http://localhost:${srv.address().port}/index.html#teste`;
  const nav=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',protocolTimeout:600000,args:['--use-angle=metal','--mute-audio']});
  const pg=await nav.newPage();await pg.setViewport({width:960,height:440});
  await pg.setRequestInterception(true);const THREEJS=fs.readFileSync(path.join(__dirname,'node_modules/three/build/three.min.js'));
  pg.on('request',q=>{const u=q.url();if(u.includes('cdnjs.cloudflare.com'))q.respond({status:200,contentType:'text/javascript',body:THREEJS});else if(u.startsWith('http://localhost'))q.continue();else q.abort();});
  pg.on('pageerror',e=>ERROS.push('pageerror: '+e.message));pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')ERROS.push(m.type()+': '+m.text());});
  await pg.goto(url,{waitUntil:'domcontentloaded'});
  for(const n of (process.argv[4]||"7,8,9,10,11").split(",").map(Number)){
    await pg.evaluate(n=>localStorage.setItem('corrida-turbo-v1',JSON.stringify({moedas:100,nivel:n,cor:'#d40000',modelo:'rosso',tutorial:true,qualidade:2})),n);
    await pg.goto(url.replace('#','?k='+(++K)+'#'),{waitUntil:'domcontentloaded'});await espera(900);
    const tema=await pg.evaluate(()=>document.querySelector('#gTema').textContent);
    await pg.evaluate(()=>document.querySelector('#gCorrer').click());await espera(4500);
    await pg.keyboard.down('ArrowUp');await espera(3000);
    await pg.screenshot({path:`${SAIDA}/pista-${n}a.png`});
    for(const f of [0.25,0.55,0.8]){await pg.evaluate(f=>{const c=__tk.corrida(),j=c.jogador;j.prog=__tk.P().L*f;for(const o of c.carros)if(o!==j)o.prog=j.prog-3-Math.random()*20;},f);await espera(1200);
      await pg.screenshot({path:`${SAIDA}/pista-${n}-${f}.png`});}
    const pulo=await pg.evaluate(async()=>{const c=__tk.corrida(),j=c.jogador,r=c.obs.rampas[0];j.prog=r.s-8;j.d=r.d;j.v=60;j.alvoVd=0;j.vd=0;
      let max=0;for(let i=0;i<80;i++){await new Promise(r=>setTimeout(r,25));max=Math.max(max,j.alt);}return Math.round(max*100)/100;});
    const fps=await pg.evaluate(()=>__tk.Qualidade.nivel);
    console.log(n,tema,'pulo',pulo,'qualidade',fps);
    await pg.keyboard.up('ArrowUp');
  }
  await pg.evaluate(()=>{document.querySelector('#gAlbum')&&0});
  console.log('ERROS',ERROS.length?'\n'+[...new Set(ERROS)].join('\n'):'nenhum');
  await nav.close();srv.close();
})().catch(e=>{console.error('FALHOU',e.message);console.log([...new Set(ERROS)].join('\n'));process.exit(1);});
