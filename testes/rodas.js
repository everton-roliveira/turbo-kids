// Loja de rodas e adesivos + fotos de perto de cada roda.
const puppeteer=require('puppeteer-core');const http=require('http');const fs=require('fs');const path=require('path');
const RAIZ=process.argv[2],SAIDA=process.argv[3];const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const srv=http.createServer((q,r)=>{let f=path.join(RAIZ,decodeURIComponent(q.url.split('?')[0].split('#')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':tipos[path.extname(f)]||'application/octet-stream'});r.end(d);});});
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await new Promise(r=>srv.listen(0,r));const base=`http://localhost:${srv.address().port}/index.html`;
  const nav=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',protocolTimeout:600000,args:['--use-angle=metal','--mute-audio']});
  const pg=await nav.newPage();await pg.setViewport({width:960,height:440});await pg.setRequestInterception(true);const T=fs.readFileSync(path.join(__dirname,'node_modules/three/build/three.min.js'));
  pg.on('request',q=>{const u=q.url();if(u.includes('cdnjs'))q.respond({status:200,contentType:'text/javascript',body:T});else if(u.startsWith('http://localhost'))q.continue();else q.abort();});
  const erros=[];pg.on('pageerror',e=>erros.push(e.message));
  await pg.goto(base+'#teste',{waitUntil:'domcontentloaded'});
  // jogador antigo usando chamas (não comprado) e roda dourada antiga (cor)
  await pg.evaluate(()=>localStorage.setItem('corrida-turbo-v1',JSON.stringify({moedas:1000,nivel:2,modelo:'basico',adesivo:'chamas',aro:'#d4a017',lojaV3:true})));
  await pg.goto(base+'?a#teste',{waitUntil:'domcontentloaded'});await espera(1200);
  const precos=async sel=>pg.$$eval(sel+' .item',bs=>bs.map(b=>b.dataset.id+':'+b.querySelector('.preco').textContent+(b.querySelector('.preco').classList.contains('caro')?'(cinza)':'')).join(' | '));
  console.log('migrou',await pg.evaluate(()=>({ad:__tk.save().adesivo,roda:__tk.save().roda,aro:__tk.save().aro})));
  console.log('adesivos',await precos('#gAdesivos'));console.log('rodas',await precos('#gRodas'));
  await pg.click('#gRodas .item[data-id="estrela"]');await espera(400);
  console.log('prévia estrela',await pg.evaluate(()=>({caixa:!document.querySelector('#gCompraRoda').hidden,txt:document.querySelector('#gCompraRoda p').textContent,roda:__tk.save().roda})));
  await pg.click('#gCompraRoda button');await espera(400);
  console.log('comprou estrela',await pg.evaluate(()=>({moedas:__tk.save().moedas,roda:__tk.save().roda,comp:__tk.save().rodasCompradas})),await precos('#gRodas'));
  await pg.screenshot({path:`${SAIDA}/loja-rodas.png`});
  // fotos de perto de cada roda (administrador para usar todas)
  await pg.evaluate(()=>{__tk.save().adm=true;});
  for(const id of ['original','esportiva','estrela','aventura','dourada','neon']){
    await pg.click(`#gRodas .item[data-id="${id}"]`);await espera(500);
    const url=await pg.evaluate(()=>{window.requestAnimationFrame=()=>0;const {renderer,camera,garagem}=__tk;const u=garagem.carro.userData;
      const roda=u.rodas[0];const p=new THREE.Vector3();roda.getWorldPosition(p);
      camera.clearViewOffset();camera.fov=30;camera.aspect=1;camera.position.set(p.x+2.2,p.y+0.5,p.z+0.6);camera.lookAt(p);camera.updateProjectionMatrix();
      renderer.setSize(440,440,false);renderer.render(garagem.cena,camera);return renderer.domElement.toDataURL('image/png');});
    fs.writeFileSync(`${SAIDA}/roda-${id}.png`,Buffer.from(url.split(',')[1],'base64'));
    await pg.goto(base+'?r'+id+'#teste',{waitUntil:'domcontentloaded'});await espera(900);await pg.evaluate(()=>{__tk.save().adm=true;});}
  console.log('ERROS',erros.length?erros:'nenhum');await nav.close();srv.close();})().catch(e=>{console.error('FALHOU',e.message);process.exit(1);});
