// Roda o jogo no Chrome sem tela: garagem, uma corrida por cenário, pulo/moedas e tela de resultado.
const puppeteer=require('puppeteer-core');const http=require('http');const fs=require('fs');const path=require('path');
const RAIZ=process.argv[2],SAIDA=process.argv[3];
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const srv=http.createServer((q,r)=>{let f=path.join(RAIZ,decodeURIComponent(q.url.split('?')[0].split('#')[0]));if(f.endsWith('/'))f+='index.html';
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':tipos[path.extname(f)]||'application/octet-stream'});r.end(d);});});
let K=0;const ERROS=[];const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  await new Promise(r=>srv.listen(0,r));const url=`http://localhost:${srv.address().port}/index.html#teste`;
  const nav=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',
    args:['--use-angle=metal','--autoplay-policy=no-user-gesture-required','--mute-audio']});
  const pg=await nav.newPage();await pg.setViewport({width:960,height:440,deviceScaleFactor:1});
  await pg.setRequestInterception(true);const THREEJS=fs.readFileSync(path.join(__dirname,'node_modules/three/build/three.min.js'));
  pg.on('request',q=>{const u=q.url();if(u.includes('cdnjs.cloudflare.com'))q.respond({status:200,contentType:'text/javascript',body:THREEJS});else if(u.startsWith('http://localhost'))q.continue();else q.abort();});
  const erros=ERROS;pg.on('pageerror',e=>erros.push('pageerror: '+e.message));
  pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')erros.push(m.type()+': '+m.text());});
  const salvar=async(nivel,extra)=>{await pg.evaluate((n,x)=>{localStorage.setItem('corrida-turbo-v1',JSON.stringify(Object.assign({moedas:5000,nivel:n,cor:'#d40000',modelo:'rosso',tutorial:true,qualidade:2},x)));},nivel,extra||{});};
  await pg.goto(url,{waitUntil:'domcontentloaded'});await espera(1500);
  // garagem com cada adesivo
  const ads=['raio','chamas','estrelas','listras'];const mods=['rosso','touro','flecha','gt','v8','proto'];
  for(let i=0;i<ads.length;i++){await salvar(1,{adesivo:ads[i],modelo:mods[i],nome:'PEDRO',aro:i%2?'#d4a017':null,cor:['#d40000','#9ccf00','#f2f2f2','#1e5bd8'][i]});
    await pg.goto(url.replace('#','?k='+(++K)+'#'),{waitUntil:'domcontentloaded'});await espera(1200);await pg.screenshot({path:`${SAIDA}/garagem-${ads[i]}.png`});}
  // uma corrida por cenário (níveis 1..6)
  for(let n=1;n<=6;n++){
    await salvar(n,{tutorial:n!==1,adesivo:'chamas',nome:'PEDRO'});await pg.goto(url.replace('#','?k='+(++K)+'#'),{waitUntil:'domcontentloaded'});await espera(800);
    await pg.evaluate(()=>document.querySelector('#gCorrer').click());await espera(4500);
    await pg.keyboard.down('ArrowUp');await espera(2500);
    const info=await pg.evaluate(()=>{const c=__tk.corrida(),o=c.obs;return{tema:c.tema.nome,L:Math.round(__tk.P().L),rampas:o.rampas.length,pads:o.pads.length,moedas:o.moedas.length,estrelas:o.estrelas.length,
      tunel:!!o.tunel,ponte:!!o.ponte,v:Math.round(c.jogador.v),dica:!document.querySelector('#dica').hidden,q:__tk.Qualidade.nivel};});
    console.log('nivel',n,JSON.stringify(info));
    await pg.screenshot({path:`${SAIDA}/corrida-${n}.png`});
    // leva o jogador até a rampa e confere o pulo
    const pulo=await pg.evaluate(async()=>{const c=__tk.corrida(),j=c.jogador,r=c.obs.rampas[0];j.prog=r.s-8;j.d=r.d;j.v=60;j.alvoVd=0;j.vd=0;
      let max=0;for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,25));max=Math.max(max,j.alt);}return Math.round(max*100)/100;});
    console.log('  altura do pulo',pulo);
    if(n===1){const m=await pg.evaluate(async()=>{const c=__tk.corrida(),j=c.jogador,mo=c.obs.moedas[0];j.prog=mo.s-6;j.d=mo.d;j.v=40;j.alt=0;j.valt=0;
      await new Promise(r=>setTimeout(r,1200));return c.pegas;});console.log('  moedas pegas',m);}
    if(n===4){await pg.evaluate(()=>{const c=__tk.corrida(),j=c.jogador;j.prog=c.obs.tunel.s+20;j.d=0;});await espera(500);await pg.screenshot({path:`${SAIDA}/tunel.png`});
      await pg.evaluate(()=>{const c=__tk.corrida(),j=c.jogador;j.prog=c.obs.ponte.s-25;j.d=0;});await espera(500);await pg.screenshot({path:`${SAIDA}/ponte.png`});}
    await pg.keyboard.up('ArrowUp');
    if(n===1){// termina em 1º para ver a comemoração
      await pg.evaluate(()=>{const c=__tk.corrida(),j=c.jogador;j.prog=c.p.voltas*__tk.P().L-3;j.v=50;for(const o of c.carros)if(o!==j)o.prog=Math.min(o.prog,j.prog-50);});
      await espera(6500);await pg.screenshot({path:`${SAIDA}/resultado.png`});
      const r=await pg.evaluate(()=>({vis:!document.querySelector('#resultado').hidden,txt:document.querySelector('#rTitulo').textContent,tro:__tk.save().trofeus,festa:!document.querySelector('#festa').hidden}));
      console.log('  resultado',JSON.stringify(r));
      await pg.evaluate(()=>document.querySelector('#rGaragem').click());await espera(600);await pg.evaluate(()=>document.querySelector('#gAlbum').click());await espera(300);await pg.screenshot({path:`${SAIDA}/album.png`});
    }
  }
  // tutorial da primeira corrida
  await salvar(1,{tutorial:false});await pg.goto(url.replace('#','?k='+(++K)+'#'),{waitUntil:'domcontentloaded'});await espera(800);await pg.evaluate(()=>document.querySelector('#gCorrer').click());await espera(4700);
  await pg.screenshot({path:`${SAIDA}/tutorial.png`});
  console.log('ERROS',erros.length?'\n'+[...new Set(erros)].join('\n'):'nenhum');
  await nav.close();srv.close();
})().catch(e=>{console.error('FALHOU',e.message);console.log([...new Set(ERROS)].join('\n'));process.exit(1);});
