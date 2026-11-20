// Confere que os cenários com movimento se mexem (matrizes mudam com o tempo) e sem erros.
const puppeteer=require('puppeteer-core');const http=require('http');const fs=require('fs');const path=require('path');
const RAIZ=process.argv[2],SAIDA=process.argv[3],NIVEIS=(process.argv[4]||'7,8,9').split(',').map(Number);
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const srv=http.createServer((q,r)=>{let f=path.join(RAIZ,decodeURIComponent(q.url.split('?')[0].split('#')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':tipos[path.extname(f)]||'application/octet-stream'});r.end(d);});});
const espera=ms=>new Promise(r=>setTimeout(r,ms));let K=0;
(async()=>{await new Promise(r=>srv.listen(0,r));const url=`http://localhost:${srv.address().port}/index.html#teste`;
  const nav=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',protocolTimeout:600000,args:['--use-angle=metal','--mute-audio']});
  const pg=await nav.newPage();await pg.setViewport({width:960,height:440});await pg.setRequestInterception(true);const T=fs.readFileSync(path.join(__dirname,'node_modules/three/build/three.min.js'));
  pg.on('request',q=>{const u=q.url();if(u.includes('cdnjs'))q.respond({status:200,contentType:'text/javascript',body:T});else if(u.startsWith('http://localhost'))q.continue();else q.abort();});
  const erros=[];pg.on('pageerror',e=>erros.push(e.message));
  await pg.goto(url,{waitUntil:'domcontentloaded'});
  for(const n of NIVEIS){
    await pg.evaluate(n=>localStorage.setItem('corrida-turbo-v1',JSON.stringify({moedas:100,nivel:n,cor:'#d40000',modelo:'rosso',tutorial:true,qualidade:2})),n);
    await pg.goto(url.replace('#','?k='+(++K)+'#'),{waitUntil:'domcontentloaded'});await espera(800);
    await pg.evaluate(()=>document.querySelector('#gCorrer').click());await espera(1500);
    const foto=()=>pg.evaluate(()=>__tk.corrida().animados.map(a=>a.custom?null:Array.from(a.ims[0].instanceMatrix.array.slice(0,16))));
    const a=await foto();await espera(1000);const b=await foto();
    const mexeu=a.map((m,i)=>m===null?'custom':m.some((v,k)=>Math.abs(v-b[i][k])>1e-4)?'mexe':'PARADO');
    // câmera de cima para ver o cenário
    console.log(n,await pg.evaluate(()=>__tk.corrida().tema.nome),JSON.stringify(mexeu));
    await pg.screenshot({path:`${SAIDA}/anim-${n}.png`});
  }
  console.log('ERROS',erros.length?erros:'nenhum');await nav.close();srv.close();})().catch(e=>{console.error('FALHOU',e.message);process.exit(1);});
