// Toca cada estilo de música e grava o áudio para conferir que todos produzem som sem erro.
const puppeteer=require('puppeteer-core');const http=require('http');const fs=require('fs');const path=require('path');
const RAIZ=process.argv[2];
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const srv=http.createServer((q,r)=>{let f=path.join(RAIZ,decodeURIComponent(q.url.split('?')[0].split('#')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':tipos[path.extname(f)]||'application/octet-stream'});r.end(d);});});
(async()=>{await new Promise(r=>srv.listen(0,r));const url=`http://localhost:${srv.address().port}/index.html#teste`;
  const nav=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',protocolTimeout:600000,args:['--use-angle=metal','--autoplay-policy=no-user-gesture-required','--mute-audio']});
  const pg=await nav.newPage();await pg.setRequestInterception(true);const T=fs.readFileSync(path.join(__dirname,'node_modules/three/build/three.min.js'));
  pg.on('request',q=>{const u=q.url();if(u.includes('cdnjs'))q.respond({status:200,contentType:'text/javascript',body:T});else if(u.startsWith('http://localhost'))q.continue();else q.abort();});
  const erros=[];pg.on('pageerror',e=>erros.push(e.message));
  await pg.goto(url,{waitUntil:'domcontentloaded'});await new Promise(r=>setTimeout(r,1000));
  const r=await pg.evaluate(async()=>{const {Som,Musica,TEMAS}=__tk;Som.iniciar();const c=Som.ctx;await c.resume();const an=c.createAnalyser();an.fftSize=2048;Som.master.connect(an);const buf=new Float32Array(2048);const out={};
    for(const t of TEMAS){Musica.parar();await new Promise(r=>setTimeout(r,450));Musica.iniciar(t.musica);let pico=0;
      for(let i=0;i<30;i++){await new Promise(r=>setTimeout(r,50));an.getFloatTimeDomainData(buf);for(const v of buf)pico=Math.max(pico,Math.abs(v));}
      out[t.nome]=t.musica.nome+' '+pico.toFixed(3);}
    Musica.parar();return out;});
  console.log(r);console.log('ERROS',erros.length?erros:'nenhum');await nav.close();srv.close();})().catch(e=>{console.error('FALHOU',e.message);process.exit(1);});
