// Turbo Kids · Objetos dos cenários das pistas 7 em diante.
// Os arquivos de js/ dividem o mesmo escopo global e são carregados em ordem pelo index.html.
'use strict';
/* cenários das pistas 7 a 11: doces, dinossauros, Lua, fazenda e castelos */
function decorarTema(cena,tema,o){
  const {plantar,instancia,dm,rnd,palmeiras}=o,[cx,cz]=o.centro;
  const mat=(c,x)=>new THREE.MeshLambertMaterial(Object.assign({color:lin(c)},x||{}));
  const brilho=c=>new THREE.MeshBasicMaterial({color:lin(c)});
  const cor=new THREE.Color();
  // peças que dividem a mesma posição; cores[k] = lista de cores da peça k (null = cor do material)
  // anim (opcional): {pecas:[índices das peças que se mexem] (padrão: todas), f:(t,b)=>({dx,dy,dz,yaw,roll,pitch,piv,ang})}
  const grupo=(pecas,qtd,raio,esc,cores,anim)=>{
    const ims=pecas.map(([g,m])=>instancia(g,m,qtd)),bases=[];
    const n=plantar(qtd,()=>({r:raio}),(i,x,z)=>{const sc=esc[0]+rnd()*(esc[1]-esc[0]),ry=rnd()*Math.PI*2;bases.push({x,z,ry,sc,fase:Math.random()*Math.PI*2});
      dm.position.set(x,0,z);dm.rotation.set(0,ry,0);dm.scale.set(sc,sc,sc);dm.updateMatrix();
      ims.forEach((im,k)=>{im.setMatrixAt(i,dm.matrix);if(cores&&cores[k])im.setColorAt(i,cor.copy(lin(cores[k][Math.floor(rnd()*cores[k].length)])));});});
    for(const im of ims){im.count=n;if(im.instanceColor)im.instanceColor.needsUpdate=true;}
    if(anim&&n&&!reduzMov)o.animados.push({ims:(anim.pecas||pecas.map((_,k)=>k)).map(k=>ims[k]),bases,f:anim.f});
    return{ims,bases,n};};
  // direção de quem anda em círculo (para o bicho olhar para onde vai)
  const rumo=(a,b)=>Math.atan2(-Math.sin(a),Math.cos(a))-b.ry;
  const arvoresRedondas=(qtd,copas)=>grupo([[new THREE.CylinderGeometry(0.35,0.5,2.6,7).translate(0,1.3,0),mat(tema.tronco)],
    [new THREE.IcosahedronGeometry(2.4,1).translate(0,4.4,0),mat(0xffffff)]],qtd,4,[0.7,1.4],[null,copas]);
  const B=(w,h,d,x,y,z)=>new THREE.BoxGeometry(w,h,d).translate(x,y,z);

  if(tema.veg==='doce'){
    if(!TEX.pirulito)TEX.pirulito=tex(256,256,(x,w,h)=>{const c=['#ff3b6b','#ffd23f','#3bc4ff','#7bd85a','#b36bff','#ff8a2b'];x.fillStyle='#fff';x.fillRect(0,0,w,h);x.translate(w/2,h/2);
      for(let r=w/2;r>2;r-=3)for(let i=0;i<6;i++){const a=i*Math.PI/3+r*0.05;x.fillStyle=c[i];x.beginPath();x.moveTo(0,0);x.arc(0,0,r,a,a+Math.PI/3+0.02);x.fill();}});
    if(!TEX.bengala){TEX.bengala=tex(64,64,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#e8202a';
      for(let i=-1;i<3;i++){x.beginPath();x.moveTo(i*32,h);x.lineTo(i*32+14,h);x.lineTo(i*32+14+h,0);x.lineTo(i*32+h,0);x.fill();}},true);TEX.bengala.repeat.set(2,4);}
    // pirulitos
    grupo([[new THREE.CylinderGeometry(0.12,0.12,6.5,8).translate(0,3.25,0),mat(0xffffff)],
      [new THREE.CylinderGeometry(2.2,2.2,0.35,28).rotateX(Math.PI/2).translate(0,6.5,0),new THREE.MeshLambertMaterial({map:TEX.pirulito})]],70,3.5,[0.8,1.5],null,{f:(t,b)=>({yaw:t*0.8+b.fase})});
    // bengalas
    grupo([[mesclar([new THREE.CylinderGeometry(0.35,0.35,6,12).translate(0,3,0),new THREE.TorusGeometry(1.1,0.35,8,16,Math.PI).translate(1.1,6,0)]),
      new THREE.MeshLambertMaterial({map:TEX.bengala})]],45,3,[0.9,1.4]);
    // balinhas de goma
    grupo([[new THREE.SphereGeometry(1,14,10,0,Math.PI*2,0,Math.PI/2).scale(1,1.2,1),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.25})]],
      160,4,[0.8,2.2],[[0xff3b6b,0xffd23f,0x3bc4ff,0x7bd85a,0xb36bff,0xff8a2b]]);
    // árvores de algodão-doce
    arvoresRedondas(60,[0xff9ad5,0xb8e3ff,0xfff1a8]);
  }else if(tema.veg==='dino'){
    palmeiras(110);
    // samambaias
    grupo([[new THREE.ConeGeometry(1.2,2.2,6).translate(0,1.1,0),mat(0x3f8a2e)]],150,1.5,[0.7,1.5]);
    // dinossauros pescoçudos com olhinhos
    const corpo=mesclar([new THREE.SphereGeometry(1,14,10).scale(1.6,1.4,2.6).translate(0,3.2,0),
      ...[[-0.9,-1.3],[0.9,-1.3],[-0.9,1.3],[0.9,1.3]].map(([x,z])=>new THREE.CylinderGeometry(0.4,0.45,2.6,8).translate(x,1.3,z)),
      new THREE.CylinderGeometry(0.35,0.6,5,8).rotateX(0.45).translate(0,6.05,3.29),
      new THREE.SphereGeometry(1,12,8).scale(0.6,0.55,0.95).translate(0,8.5,4.8),
      new THREE.ConeGeometry(0.6,4.5,8).rotateX(-1.88).translate(0,2.32,-4.54)]);
    grupo([[corpo,mat(0xffffff)],
      [mesclar([new THREE.SphereGeometry(0.2,8,6).translate(-0.45,8.68,5.2),new THREE.SphereGeometry(0.2,8,6).translate(0.45,8.68,5.2)]),mat(0xffffff)],
      [mesclar([new THREE.SphereGeometry(0.11,6,5).translate(-0.55,8.7,5.3),new THREE.SphereGeometry(0.11,6,5).translate(0.55,8.7,5.3)]),mat(0x111111)]],
      26,9,[0.8,1.3],[[0x6cc04a,0xff8a3d,0x8a6bff,0x3bb7e0,0xffc93c]],{f:(t,b)=>({yaw:Math.sin(t*0.35+b.fase)*0.6})});
    // vulcões ao longe
    grupo([[new THREE.CylinderGeometry(6,32,26,14).translate(0,13,0),mat(0x5a3b2a)],
      [new THREE.CylinderGeometry(5.6,5.6,0.6,14).translate(0,26,0),brilho(0xff5a1f)],
      [mesclar([new THREE.SphereGeometry(4,10,8).translate(0,31,0),new THREE.SphereGeometry(5,10,8).translate(2,37,1),new THREE.SphereGeometry(6,10,8).translate(-1,44,-1)]),
        mat(0xdddddd,{transparent:true,opacity:0.8})]],5,40,[0.9,1.2]);
  }else if(tema.veg==='lua'){
    // crateras, pedras e foguetes
    grupo([[new THREE.TorusGeometry(1,0.28,6,22).rotateX(Math.PI/2).scale(1,0.5,1).translate(0,0.06,0),mat(0x8a8a93)],
      [new THREE.CircleGeometry(0.95,22).rotateX(-Math.PI/2).translate(0,0.02,0),mat(0x6f6f78)]],60,10,[3,9]);
    grupo([[new THREE.DodecahedronGeometry(1.2,0).scale(1.3,0.7,1).translate(0,0.35,0),mat(0x85858d)]],80,2.5,[0.6,2]);
    const aletas=[0,1,2].map(k=>new THREE.BoxGeometry(0.2,2.4,1.6).translate(1.5,2.2,0).rotateY(k*Math.PI*2/3));
    grupo([[new THREE.CylinderGeometry(1.2,1.2,7,16).translate(0,4.5,0),mat(0xf4f4f4)],
      [mesclar([new THREE.ConeGeometry(1.2,3,16).translate(0,9.5,0),...aletas]),mat(0xe3262b)],
      [new THREE.SphereGeometry(0.45,10,8).scale(1,1,0.4).translate(0,6.5,1.15),brilho(0x7fd4ff)]],14,4,[1,1.4],null,{f:(t,b)=>{const c=(t+b.fase*4)%26;return{dy:c<16?0:(c-16)*(c-16)*1.8};}});
    // estrelas e a Terra no céu
    const pos=[];for(let i=0;i<1400;i++){const t=rnd()*Math.PI*2,y=rnd()*0.95+0.03,r=Math.sqrt(1-y*y);pos.push(cx+Math.cos(t)*r*1000,y*1000-40,cz+Math.sin(t)*r*1000);}
    const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    cena.add(new THREE.Points(ge,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,fog:false})));
    if(!TEX.terra)TEX.terra=tex(256,128,(x,w,h)=>{x.fillStyle='#2a6fdb';x.fillRect(0,0,w,h);const r=mulberry32(5);
      x.fillStyle='#3fae4a';for(let i=0;i<14;i++){x.beginPath();x.ellipse(r()*w,20+r()*(h-40),10+r()*26,8+r()*16,r()*3,0,Math.PI*2);x.fill();}
      x.fillStyle='rgba(255,255,255,0.85)';for(let i=0;i<22;i++){x.beginPath();x.ellipse(r()*w,r()*h,8+r()*22,3+r()*4,0,0,Math.PI*2);x.fill();}});
    const terra=new THREE.Mesh(new THREE.SphereGeometry(70,32,20),new THREE.MeshBasicMaterial({map:TEX.terra,fog:false}));
    terra.position.set(cx+200,150,cz-480);terra.rotation.z=0.4;cena.add(terra);o.animados.push({custom:t=>{terra.rotation.y=t*0.05;}});
  }else if(tema.veg==='fazenda'){
    // celeiros
    const fachada=new THREE.Shape([new THREE.Vector2(-5,0),new THREE.Vector2(5,0),new THREE.Vector2(5,7),new THREE.Vector2(0,9.6),new THREE.Vector2(-5,7)]);
    grupo([[new THREE.ExtrudeGeometry(fachada,{depth:14,bevelEnabled:false}).translate(0,0,-7),mat(0xc8322b)],
      [mesclar([new THREE.BoxGeometry(6,0.4,15).rotateZ(0.48).translate(-2.6,8.55,0),new THREE.BoxGeometry(6,0.4,15).rotateZ(-0.48).translate(2.6,8.55,0)]),mat(0x4d4f55)],
      [mesclar([B(3.6,4.6,0.2,0,2.3,7.05),B(1.8,1.4,0.2,0,7.4,7.05)]),mat(0xffffff)]],10,12,[1,1.2]);
    // fardos de feno
    grupo([[new THREE.CylinderGeometry(1.1,1.1,2,12).rotateZ(Math.PI/2).translate(0,1.1,0),mat(0xe8c55a)]],70,2,[0.9,1.2]);
    // girassóis
    grupo([[new THREE.CylinderGeometry(0.08,0.1,2.6,6).translate(0,1.3,0),mat(0x3e8f2f)],
      [new THREE.CylinderGeometry(0.75,0.75,0.08,10).rotateX(Math.PI/2).translate(0,2.7,0.05),mat(0xffd21f)],
      [new THREE.CylinderGeometry(0.38,0.38,0.12,10).rotateX(Math.PI/2).translate(0,2.7,0.1),mat(0x6b3f1d)]],220,1.2,[0.9,1.4]);
    // vaquinhas
    grupo([[mesclar([B(1.1,1.0,2.2,0,1.4,0),B(0.8,0.8,0.9,0,1.85,1.45)]),mat(0xf6f6f2)],
      [mesclar([B(0.25,0.9,0.25,-0.4,0.45,-0.8),B(0.25,0.9,0.25,0.4,0.45,-0.8),B(0.25,0.9,0.25,-0.4,0.45,0.8),B(0.25,0.9,0.25,0.4,0.45,0.8),
        B(1.14,0.55,0.8,0,1.55,-0.35),B(0.9,0.15,0.2,0,2.25,1.35)]),mat(0x222222)],
      [B(0.6,0.35,0.15,0,1.65,1.92),mat(0xf3a6b5)]],26,2,[1,1.2],null,{f:(t,b)=>({yaw:Math.sin(t*0.3+b.fase)*0.7})});
    arvoresRedondas(80,[0x3a8a34,0x4fa63f,0x2f7a2c]);
  }else if(tema.veg==='castelo'){
    // castelos com telhados coloridos
    grupo([[mesclar([B(10,12,10,0,6,0),...[[-6,-6],[6,-6],[-6,6],[6,6]].map(([x,z])=>new THREE.CylinderGeometry(2.2,2.2,16,14).translate(x,8,z))]),mat(0xf1e6d6)],
      [mesclar([...[[-6,-6],[6,-6],[-6,6],[6,6]].map(([x,z])=>new THREE.ConeGeometry(3,6,14).translate(x,19,z)),new THREE.ConeGeometry(7.6,7,4).rotateY(Math.PI/4).translate(0,15.5,0)]),mat(0xffffff)],
      [mesclar([B(3,5,0.3,0,2.5,5.05),B(0.8,1.4,0.3,-6,12,8.15),B(0.8,1.4,0.3,6,12,8.15),B(1.2,1.6,0.3,-2.5,9,5.05),B(1.2,1.6,0.3,2.5,9,5.05)]),mat(0x3a2c4a)]],
      11,14,[1,1.3],[null,[0xff6fb5,0x5aa0ff,0xa86bff,0xff9f3b]]);
    // arco-íris com nuvens nos pés
    const cores=[0xe8202a,0xff8a1f,0xffd21f,0x3fbf3f,0x2f8fff,0x4b3bd6,0x9b3bd6];
    grupo([...cores.map((c,i)=>[new THREE.TorusGeometry(20-i*1.6,0.85,6,48,Math.PI),brilho(c)]),
      [mesclar([1,-1].flatMap(l=>[new THREE.SphereGeometry(2.8,10,8).translate(l*15.2,1.2,0),new THREE.SphereGeometry(2.4,10,8).translate(l*18.4,1,0.6),new THREE.SphereGeometry(2.2,10,8).translate(l*12.6,1,-0.4)])),mat(0xffffff)]],
      6,26,[1,1.2]);
    arvoresRedondas(120,[0xff9ad5,0xd7a6ff,0xffc2e2]);
  }else if(tema.veg==='pirata'){
    palmeiras(110);
    // navios piratas encalhados na areia
    const velas=[[0,6.2,-2.6,4.6,3.2],[0,9,-2.6,3.6,2.4],[0,6.8,2.2,4.2,3]].map(([x,y,z,w,h])=>B(w,h,0.15,x,y,z));
    grupo([[mesclar([B(4.4,2.4,11,0,1.6,0),new THREE.ConeGeometry(2.2,4,4).rotateY(Math.PI/4).scale(1,1,1).rotateX(Math.PI/2).scale(1,0.55,1).translate(0,1.9,7.4),B(4.6,0.4,11.2,0,2.9,0),B(4.4,1.6,2.6,0,3.8,-4.2)]),mat(0x7a4a26)],
      [mesclar([new THREE.CylinderGeometry(0.18,0.22,10,8).translate(0,6,-2.6),new THREE.CylinderGeometry(0.16,0.2,8,8).translate(0,5,2.2)]),mat(0x4a3018)],
      [mesclar(velas),mat(0xf3ead2)],
      [B(1.6,1,0.08,0.8,11.6,-2.6),mat(0x111111)]],8,10,[1,1.3],null,{f:(t,b)=>({roll:Math.sin(t*0.9+b.fase)*0.06,pitch:Math.sin(t*0.7+b.fase)*0.03})});
    // baús de tesouro
    grupo([[mesclar([B(1.6,1,1,0,0.5,0),new THREE.CylinderGeometry(0.5,0.5,1.6,12,1,false,0,Math.PI).rotateZ(Math.PI/2).translate(0,1,0)]),mat(0x8a5a2b)],
      [mesclar([B(1.66,0.15,1.06,0,0.2,0),B(1.66,0.15,1.06,0,0.85,0),B(0.3,0.4,0.08,0,0.8,0.52)]),mat(0xffc93c)]],30,2,[0.9,1.4]);
    // barris
    grupo([[new THREE.CylinderGeometry(0.6,0.6,1.4,12).translate(0,0.7,0),mat(0x9a6a3a)]],40,1.5,[0.9,1.2]);
  }else if(tema.veg==='cogumelo'){
    // cogumelos gigantes com bolinhas
    const pintas=[];for(let i=0;i<9;i++){const t=i*2.4,f=0.45+(i%3)*0.3;pintas.push(new THREE.SphereGeometry(0.42,8,6).scale(1,0.5,1).translate(3*Math.sin(f)*Math.cos(t),5+1.8*Math.cos(f),3*Math.sin(f)*Math.sin(t)));}
    grupo([[new THREE.CylinderGeometry(0.7,1,5,12).translate(0,2.5,0),mat(0xf4ead8)],
      [new THREE.SphereGeometry(3,18,10,0,Math.PI*2,0,Math.PI/2).scale(1,0.6,1).translate(0,5,0),mat(0xffffff)],
      [mesclar(pintas),mat(0xffffff)]],70,4,[0.6,1.8],[null,[0xe8202a,0xff8a1f,0x9b5bd6,0x2f8fff]]);
    // florzinhas coloridas
    grupo([[new THREE.CylinderGeometry(0.05,0.06,1.2,5).translate(0,0.6,0),mat(0x3e8f2f)],
      [new THREE.IcosahedronGeometry(0.35,0).translate(0,1.3,0),mat(0xffffff)]],260,1,[0.8,1.5],[null,[0xff6fb5,0xffd21f,0xffffff,0xb36bff,0xff8a2b]],{f:(t,b)=>({roll:Math.sin(t*1.5+b.fase)*0.12})});
    arvoresRedondas(70,[0x3a8a34,0x4fa63f]);
  }else if(tema.veg==='polo'){
    // iglus
    grupo([[mesclar([new THREE.SphereGeometry(3.5,18,10,0,Math.PI*2,0,Math.PI/2),B(2.4,2.2,2.4,0,1.1,3.4)]),mat(0xeaf4ff)],
      [B(1.2,1.6,0.1,0,0.8,4.62),mat(0x2a3a55)]],12,6,[1,1.3]);
    // pinguins
    grupo([[mesclar([new THREE.SphereGeometry(1,12,10).scale(0.7,1.1,0.6).translate(0,1.1,0),new THREE.SphereGeometry(0.45,10,8).translate(0,2.2,0),
        new THREE.SphereGeometry(0.25,6,5).scale(0.5,1.4,0.8).translate(-0.72,1.2,0),new THREE.SphereGeometry(0.25,6,5).scale(0.5,1.4,0.8).translate(0.72,1.2,0)]),mat(0x1b1d24)],
      [mesclar([new THREE.SphereGeometry(1,12,10).scale(0.55,0.9,0.4).translate(0,1.0,0.25),new THREE.SphereGeometry(0.12,6,5).translate(-0.17,2.3,0.38),new THREE.SphereGeometry(0.12,6,5).translate(0.17,2.3,0.38)]),mat(0xffffff)],
      [mesclar([new THREE.ConeGeometry(0.12,0.4,6).rotateX(Math.PI/2).translate(0,2.15,0.55),B(0.35,0.1,0.5,-0.25,0.05,0.2),B(0.35,0.1,0.5,0.25,0.05,0.2)]),mat(0xff9a1f)]],70,2.5,[1.3,2],null,{f:(t,b)=>({roll:Math.sin(t*5+b.fase)*0.12,yaw:Math.sin(t*0.4+b.fase)*0.6})});
    // bonecos de neve
    grupo([[mesclar([new THREE.SphereGeometry(1.2,12,10).translate(0,1.1,0),new THREE.SphereGeometry(0.85,12,10).translate(0,2.8,0),new THREE.SphereGeometry(0.6,12,10).translate(0,4.0,0)]),mat(0xffffff)],
      [new THREE.ConeGeometry(0.12,0.6,6).rotateX(Math.PI/2).translate(0,4.0,0.85),mat(0xff7a1f)],
      [mesclar([new THREE.CylinderGeometry(0.45,0.45,0.7,12).translate(0,4.75,0),new THREE.CylinderGeometry(0.7,0.7,0.06,12).translate(0,4.42,0)]),mat(0x222222)]],24,2,[0.9,1.3]);
    // blocos de gelo
    grupo([[new THREE.DodecahedronGeometry(1.8,0).scale(1,0.8,1.2).translate(0,0.8,0),new THREE.MeshStandardMaterial({color:lin(0xbfe8ff),roughness:0.2,metalness:0.1})]],50,3,[0.6,2]);
  }else if(tema.veg==='obra'){
    // guindastes
    grupo([[B(1.2,22,1.2,0,11,0),mat(0xffc21f)],[B(3.4,0.6,3.4,0,0.3,0),mat(0x55585e)],
      [mesclar([B(1,1,22,0,22.5,5),B(1.6,1.6,1.6,0,21.4,0)]),mat(0xffc21f)],
      [mesclar([B(2.2,1.8,2.4,0,22.5,-5),B(0.06,8,0.06,0,18.5,13),B(0.5,0.6,0.3,0,14.4,13)]),mat(0x55585e)]],6,14,[0.9,1.2],null,
      {pecas:[2,3],f:(t,b)=>({yaw:Math.sin(t*0.15+b.fase)*1.6})});
    // caminhões basculantes
    const rodas=[[-1.2,1.6],[1.2,1.6],[-1.2,-0.8],[1.2,-0.8],[-1.2,-2],[1.2,-2]].map(([x,z])=>new THREE.CylinderGeometry(0.6,0.6,0.5,12).rotateZ(Math.PI/2).translate(x,0.6,z));
    grupo([[mesclar([B(2.2,1.8,1.6,0,1.9,2.2),B(2.4,1.4,3.6,0,2.2,-1.2)]),mat(0xffb01f)],
      [mesclar([B(2,0.4,5.4,0,1,0),...rodas]),mat(0x26272b)],
      [B(1.9,0.7,0.06,0,2.3,3.02),brilho(0x9fd8ff)]],16,4,[1,1.2]);
    // montes de terra, tubos de concreto e cones
    grupo([[new THREE.ConeGeometry(4,3,10).translate(0,1.5,0),mat(0x8a6a40)]],30,5,[0.6,1.4]);
    grupo([[new THREE.CylinderGeometry(1.2,1.2,2.6,16,1,true).rotateZ(Math.PI/2).translate(0,1.2,0),mat(0xa8a8a8,{side:THREE.DoubleSide})]],30,2,[0.9,1.1]);
    grupo([[new THREE.ConeGeometry(0.35,1,10).translate(0,0.5,0),mat(0xff6a00)],[new THREE.CylinderGeometry(0.24,0.28,0.18,10).translate(0,0.55,0),mat(0xffffff)]],90,1,[0.9,1.3]);
  }else if(tema.veg==='parque'){
    if(!TEX.circo){TEX.circo=tex(64,16,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?'#ffffff':'#e8202a';x.fillRect(i*8,0,8,h);}},true);TEX.circo.repeat.set(2,1);}
    // rodas-gigantes
    const raios=[];for(let k=0;k<10;k++)raios.push(B(0.25,12,0.25,0,0,0).translate(0,6,0).rotateZ(k*Math.PI/5).translate(0,14,0));
    const pernas=[[0.35,-2.4,1.5],[-0.35,2.4,1.5],[0.35,-2.4,-1.5],[-0.35,2.4,-1.5]].map(([r,x,z])=>B(0.5,15,0.5,0,7,0).rotateZ(r).translate(x,0,z));
    const rodas=grupo([[mesclar(pernas),mat(0xf2f2f2)],[mesclar([new THREE.TorusGeometry(12,0.35,6,48).translate(0,14,0),...raios]),mat(0xf2f2f2)]],5,14,[0.9,1.2],null,
      {pecas:[1],f:(t,b)=>({piv:14,ang:t*0.25+b.fase})});
    // cabines penduradas: giram com a roda e ficam sempre de pé
    const nc=rodas.n*10,cabs=instancia(B(1.6,1.6,1.6,0,0,0),mat(0xffffff),Math.max(1,nc));cabs.count=nc;
    const coresCab=[0xe8202a,0x2f8fff,0xffc21f,0x3fbf3f].map(lin);
    const porCab=t=>{rodas.bases.forEach((b,w)=>{const ang=t*0.25+b.fase,c=Math.cos(b.ry),sn=Math.sin(b.ry);
      for(let k=0;k<10;k++){const a=k*Math.PI/5+ang,lx=12*Math.cos(a)*b.sc,ly=(14+12*Math.sin(a)-1.3)*b.sc;
        dm.position.set(b.x+lx*c,ly,b.z-lx*sn);dm.rotation.set(0,b.ry,0);dm.scale.setScalar(b.sc);dm.updateMatrix();cabs.setMatrixAt(w*10+k,dm.matrix);}});
      cabs.instanceMatrix.needsUpdate=true;};
    for(let i=0;i<nc;i++)cabs.setColorAt(i,coresCab[Math.floor(i/10)%4]);if(cabs.instanceColor)cabs.instanceColor.needsUpdate=true;
    porCab(0);if(!reduzMov)o.animados.push({custom:porCab});
    // tendas de circo
    grupo([[new THREE.CylinderGeometry(6,6,5,20).translate(0,2.5,0),new THREE.MeshLambertMaterial({map:TEX.circo})],
      [new THREE.ConeGeometry(7,5,20).translate(0,7.5,0),new THREE.MeshLambertMaterial({map:TEX.circo})],
      [mesclar([new THREE.CylinderGeometry(0.08,0.08,2,6).translate(0,10.8,0),B(1.2,0.7,0.06,0.6,11.4,0)]),mat(0xffc21f)]],7,8,[0.9,1.2]);
    // balões coloridos
    grupo([[new THREE.SphereGeometry(0.8,12,10).scale(1,1.2,1).translate(0,6.5,0),mat(0xffffff)],[B(0.03,5.6,0.03,0,2.8,0),mat(0xeeeeee)]],
      60,1.5,[0.8,1.3],[[0xe8202a,0x2f8fff,0xffc21f,0x3fbf3f,0xff6fb5,0xb36bff]],{f:(t,b)=>({dy:Math.sin(t*0.9+b.fase)*0.8,roll:Math.sin(t*0.7+b.fase)*0.05})});
    arvoresRedondas(70,[0x3a8a34,0x4fa63f]);
  }else if(tema.veg==='fundo'){
    // corais coloridos
    grupo([[mesclar([new THREE.CylinderGeometry(0.25,0.35,2.6,7).translate(0,1.3,0),new THREE.CylinderGeometry(0.2,0.25,1.8,7).translate(0,0.9,0).rotateZ(0.6).translate(0,1.4,0),
      new THREE.CylinderGeometry(0.2,0.25,1.6,7).translate(0,0.8,0).rotateZ(-0.7).translate(0,1.0,0),new THREE.CylinderGeometry(0.18,0.22,1.4,7).translate(0,0.7,0).rotateX(0.7).translate(0,1.8,0),
      new THREE.SphereGeometry(0.3,7,5).translate(0,2.6,0)]),mat(0xffffff)]],130,2,[0.8,2],[[0xff6fb5,0xff8a3d,0xb36bff,0xffd23f,0xff4d4d]]);
    // algas
    const alga=[];for(let k=0;k<6;k++)alga.push(new THREE.BoxGeometry(0.35,1.3,0.1).translate(0,0.65,0).rotateZ((k%2?0.18:-0.18)).translate((k%2?0.12:-0.12),k*1.2,0));
    grupo([[mesclar(alga),mat(0x2f9a4a,{side:THREE.DoubleSide})]],150,1.2,[0.8,1.6],null,{f:(t,b)=>({roll:Math.sin(t*1.2+b.fase)*0.15})});
    // estrelas-do-mar
    grupo([[mesclar([0,1,2,3,4].map(k=>new THREE.ConeGeometry(0.28,1.1,5).rotateZ(-Math.PI/2).translate(0.55,0.12,0).rotateY(k*Math.PI*2/5))),mat(0xffffff)]],90,1.2,[0.9,1.6],[[0xff7a3d,0xff5e8a,0xffc23d]]);
    // peixinhos nadando
    grupo([[mesclar([new THREE.SphereGeometry(1,12,8).scale(0.45,0.7,1).translate(0,4,0),new THREE.ConeGeometry(0.55,0.8,4).rotateX(-Math.PI/2).scale(0.3,1,1).translate(0,4,-1.25)]),mat(0xffffff)],
      [mesclar([new THREE.SphereGeometry(0.13,6,5).translate(-0.38,4.2,0.55),new THREE.SphereGeometry(0.13,6,5).translate(0.38,4.2,0.55)]),mat(0x111111)]],
      90,2,[0.8,1.7],[[0xffb01f,0xff5e3a,0x3bc4ff,0xffe14d,0xb36bff]],{f:(t,b)=>{const a=t*0.4+b.fase;return{dx:Math.cos(a)*6,dz:Math.sin(a)*6,dy:Math.sin(t+b.fase)*0.5,yaw:rumo(a,b)};}});
    // submarinos amarelos
    grupo([[mesclar([new THREE.SphereGeometry(1,16,10).scale(1.5,1.5,3.6).translate(0,7,0),B(1,1.4,1.6,0,8.9,0.4),new THREE.CylinderGeometry(0.12,0.12,1.4,6).translate(0,10.2,0.8),
      B(2.6,0.1,0.6,0,7,-3.6)]),mat(0xffd21f)],
      [mesclar([-1.2,0,1.2].map(z=>new THREE.CylinderGeometry(0.35,0.35,3.1,12).rotateZ(Math.PI/2).translate(0,7.2,z))),brilho(0x9fe4ff)]],6,6,[1,1.3],null,{f:(t,b)=>({dy:Math.sin(t*0.6+b.fase)*0.8,yaw:Math.sin(t*0.1+b.fase)*0.8})});
    // bolhas
    grupo([[new THREE.SphereGeometry(0.3,8,6).translate(0,3,0),mat(0xdff6ff,{transparent:true,opacity:0.55})]],160,0.5,[0.6,3],null,{f:(t,b)=>({dy:(t*1.2+b.fase*3)%10})});
  }else if(tema.veg==='safari'){
    // acácias
    grupo([[mesclar([new THREE.CylinderGeometry(0.3,0.45,5,7).translate(0,2.5,0),new THREE.CylinderGeometry(0.15,0.2,2.2,6).rotateZ(0.7).translate(-0.7,5.4,0)]),mat(tema.tronco)],
      [new THREE.CylinderGeometry(4,3.2,1.2,12).translate(0,6.1,0),mat(tema.arvore)]],70,5,[0.8,1.3]);
    // capim
    grupo([[new THREE.ConeGeometry(0.6,1.4,5).translate(0,0.7,0),mat(0xb5b84a)]],180,1,[0.7,1.4]);
    // girafas
    const pernas=(x,z,h,r)=>[[-x,-z],[x,-z],[-x,z],[x,z]].map(([a,b])=>new THREE.CylinderGeometry(r,r,h,7).translate(a,h/2,b));
    grupo([[mesclar([new THREE.SphereGeometry(1,12,8).scale(0.9,0.9,1.5).translate(0,3.6,0),...pernas(0.5,0.9,3.4,0.15),
        new THREE.CylinderGeometry(0.22,0.35,4,8).rotateX(0.35).translate(0,6.0,1.6),new THREE.SphereGeometry(1,10,8).scale(0.35,0.35,0.6).translate(0,8,2.5)]),mat(0xf2c14e)],
      [mesclar([B(0.4,0.3,0.4,0.85,3.9,0.4),B(0.4,0.3,0.4,-0.85,3.6,-0.5),B(0.4,0.3,0.4,0.85,3.3,-0.7),B(0.4,0.3,0.4,-0.85,4.0,0.6),B(0.4,0.4,0.2,0,4.2,1.45),
        new THREE.CylinderGeometry(0.06,0.06,0.5,5).translate(-0.15,8.45,2.3),new THREE.CylinderGeometry(0.06,0.06,0.5,5).translate(0.15,8.45,2.3),
        new THREE.SphereGeometry(0.08,5,4).translate(-0.3,8.1,2.75),new THREE.SphereGeometry(0.08,5,4).translate(0.3,8.1,2.75)]),mat(0x7a4a1e)]],28,4,[1,1.4],null,{f:(t,b)=>({yaw:Math.sin(t*0.3+b.fase)*0.5})});
    // elefantes
    grupo([[mesclar([new THREE.SphereGeometry(1,14,10).scale(1.5,1.4,2.1).translate(0,2.9,0),...pernas(0.8,1.1,2.2,0.4),new THREE.SphereGeometry(0.95,12,10).translate(0,3.6,2.2),
        new THREE.CylinderGeometry(0.22,0.32,1.6,8).rotateX(0.25).translate(0,2.6,3.0),new THREE.CylinderGeometry(0.18,0.22,1.0,8).rotateX(-0.6).translate(0,1.65,3.35),
        new THREE.CylinderGeometry(1,1,0.12,14).rotateZ(Math.PI/2).rotateY(0.4).translate(-1,3.7,1.8),new THREE.CylinderGeometry(1,1,0.12,14).rotateZ(Math.PI/2).rotateY(-0.4).translate(1,3.7,1.8)]),mat(0x9b9ea6)],
      [mesclar([new THREE.SphereGeometry(0.12,6,5).translate(-0.45,3.9,2.95),new THREE.SphereGeometry(0.12,6,5).translate(0.45,3.9,2.95)]),mat(0x111111)]],20,5,[1,1.3],null,{f:(t,b)=>({yaw:Math.sin(t*0.25+b.fase)*0.5,roll:Math.sin(t*1.6+b.fase)*0.02})});
  }else if(tema.veg==='futuro'){
    // torres de vidro com anéis de neon
    grupo([[new THREE.CylinderGeometry(3.6,4.2,30,12).translate(0,15,0),new THREE.MeshStandardMaterial({color:lin(0x2a3f7a),roughness:0.2,metalness:0.7})],
      [mesclar([8,16,24,30].map(y=>new THREE.TorusGeometry(4.2-y*0.02,0.25,6,24).rotateX(Math.PI/2).translate(0,y,0))),new THREE.MeshBasicMaterial({color:0xffffff})]],
      45,9,[0.8,2],[null,[0x19e0d0,0xff4fd8,0xffd21f,0x7aff5a]]);
    // discos voadores
    grupo([[new THREE.SphereGeometry(1,20,8).scale(3,0.55,3).translate(0,13,0),new THREE.MeshStandardMaterial({color:lin(0xbfc6d2),roughness:0.3,metalness:0.6})],
      [new THREE.SphereGeometry(1.3,14,10,0,Math.PI*2,0,Math.PI/2).translate(0,13.3,0),brilho(0x7fe8ff)],
      [mesclar([0,1,2,3,4,5,6,7].map(k=>new THREE.SphereGeometry(0.22,6,5).translate(2.9*Math.cos(k*Math.PI/4),12.9,2.9*Math.sin(k*Math.PI/4)))),brilho(0xffe14d)]],16,4,[0.9,1.4],null,{f:(t,b)=>{const a=t*0.3+b.fase;return{dx:Math.cos(a)*10,dz:Math.sin(a)*10,dy:Math.sin(t*1.3+b.fase)*1.2,yaw:t*1.5};}});
    // robozinhos
    grupo([[mesclar([B(1.2,1.4,0.8,0,1.5,0),B(0.9,0.8,0.8,0,2.65,0),B(0.3,0.8,0.3,-0.35,0.4,0),B(0.3,0.8,0.3,0.35,0.4,0),B(0.25,1,0.25,-0.75,1.5,0),B(0.25,1,0.25,0.75,1.5,0),
        new THREE.CylinderGeometry(0.04,0.04,0.5,5).translate(0,3.3,0)]),new THREE.MeshStandardMaterial({color:lin(0xd8dde6),roughness:0.4,metalness:0.5})],
      [mesclar([B(0.18,0.18,0.05,-0.2,2.7,0.41),B(0.18,0.18,0.05,0.2,2.7,0.41),B(0.5,0.3,0.05,0,1.6,0.41)]),brilho(0x19e0d0)],
      [new THREE.SphereGeometry(0.14,8,6).translate(0,3.6,0),brilho(0xff3b3b)]],34,1.5,[1,1.6],null,{f:(t,b)=>({roll:Math.sin(t*4+b.fase)*0.08,yaw:Math.sin(t*0.5+b.fase)*0.8})});
    // céu estrelado
    const pos=[];for(let i=0;i<900;i++){const t=rnd()*Math.PI*2,y=rnd()*0.95+0.03,r=Math.sqrt(1-y*y);pos.push(cx+Math.cos(t)*r*1000,y*1000-40,cz+Math.sin(t)*r*1000);}
    const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    cena.add(new THREE.Points(ge,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,fog:false})));
  }else if(tema.veg==='cerejeira'){
    arvoresRedondas(150,[0xffb7d5,0xffc9e0,0xff9cc6,0xffffff]);
    // pagodes de três andares
    const paredes=[],telhados=[];for(let i=0;i<3;i++){const w=6-1.4*i,y=3.2*i;paredes.push(B(w,2.6,w,0,1.3+y,0));
      telhados.push(new THREE.ConeGeometry((w+2.6)*0.72,1.4,4).rotateY(Math.PI/4).translate(0,3.3+y,0));}
    telhados.push(new THREE.CylinderGeometry(0.12,0.2,2.4,6).translate(0,11.2,0));
    grupo([[mesclar(paredes),mat(0xf5ecd8)],[mesclar(telhados),mat(0xc8322b)]],7,8,[1,1.3]);
    // portais vermelhos
    grupo([[mesclar([new THREE.CylinderGeometry(0.35,0.4,6,10).translate(-2.6,3,0),new THREE.CylinderGeometry(0.35,0.4,6,10).translate(2.6,3,0),B(6,0.5,0.6,0,4.8,0)]),mat(0xe0352b)],
      [B(7.6,0.6,0.8,0,6.2,0),mat(0x222222)]],12,5,[0.9,1.2]);
    // lanternas de pedra
    grupo([[mesclar([B(0.6,1,0.6,0,0.5,0),B(1,0.7,1,0,1.35,0),new THREE.ConeGeometry(0.9,0.6,4).rotateY(Math.PI/4).translate(0,2,0)]),mat(0x9a9a92)],
      [B(0.6,0.4,1.02,0,1.35,0),brilho(0xffe08a)]],40,1.2,[0.9,1.3]);
  }else if(tema.veg==='brinquedo'){
    // blocos de montar
    const pinos=[];for(const x of [-0.5,0.5])for(const z of [-1.5,-0.5,0.5,1.5])pinos.push(new THREE.CylinderGeometry(0.3,0.3,0.3,10).translate(x,1.35,z));
    grupo([[mesclar([B(2,1.2,4,0,0.6,0),...pinos]),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.35})]],80,4,[1,2.6],[[0xe8202a,0x2f8fff,0xffc21f,0x3fbf3f,0xff8a1f]]);
    // bolas
    grupo([[new THREE.SphereGeometry(1.5,18,12).translate(0,1.5,0),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.3})]],40,4,[1,2.6],[[0xff3b6b,0x3bc4ff,0xffd23f,0x7bd85a,0xb36bff]],{f:(t,b)=>({dy:Math.abs(Math.sin(t*2.2+b.fase))*3})});
    // ursinhos de pelúcia
    grupo([[mesclar([new THREE.SphereGeometry(1.2,14,10).scale(1,1.15,0.9).translate(0,1.6,0),new THREE.SphereGeometry(0.9,14,10).translate(0,3.3,0),
        new THREE.SphereGeometry(0.32,8,6).translate(-0.7,4.0,0),new THREE.SphereGeometry(0.32,8,6).translate(0.7,4.0,0),
        new THREE.SphereGeometry(0.45,8,6).translate(-1.1,1.9,0.3),new THREE.SphereGeometry(0.45,8,6).translate(1.1,1.9,0.3),
        new THREE.SphereGeometry(0.5,8,6).translate(-0.6,0.45,0.6),new THREE.SphereGeometry(0.5,8,6).translate(0.6,0.45,0.6)]),mat(0xa86b3c)],
      [mesclar([new THREE.SphereGeometry(0.38,8,6).scale(1,0.8,0.7).translate(0,3.1,0.8),new THREE.SphereGeometry(0.7,10,8).scale(1,1.1,0.5).translate(0,1.7,0.8)]),mat(0xf1d6b0)],
      [mesclar([new THREE.SphereGeometry(0.1,6,5).translate(-0.32,3.5,0.8),new THREE.SphereGeometry(0.1,6,5).translate(0.32,3.5,0.8),new THREE.SphereGeometry(0.12,6,5).translate(0,3.2,1.08)]),mat(0x111111)]],
      14,5,[1.6,2.6]);
    // lápis gigantes deitados
    grupo([[new THREE.CylinderGeometry(0.5,0.5,7,6).rotateZ(Math.PI/2).translate(0,0.5,0),mat(0xffffff)],
      [new THREE.ConeGeometry(0.5,1.4,6).rotateZ(-Math.PI/2).translate(4.2,0.5,0),mat(0xf1d6b0)],
      [new THREE.ConeGeometry(0.17,0.45,6).rotateZ(-Math.PI/2).translate(4.7,0.5,0),mat(0x333333)]],24,5,[1.4,2.4],[[0xe8202a,0x2f8fff,0x3fbf3f,0xffc21f,0xb36bff]]);
  }else if(tema.veg==='nuvem'){
    // nuvens fofas no chão
    grupo([[mesclar([new THREE.SphereGeometry(2,12,10).translate(0,1,0),new THREE.SphereGeometry(1.6,12,10).translate(1.9,0.8,0.4),new THREE.SphereGeometry(1.5,12,10).translate(-1.8,0.7,-0.3),
      new THREE.SphereGeometry(1.3,12,10).translate(0.4,2.2,0.2)]),mat(0xffffff)]],110,5,[0.8,2.5]);
    // balões de ar quente
    grupo([[new THREE.SphereGeometry(3,18,14).scale(1,1.2,1).translate(0,15,0),mat(0xffffff)],
      [mesclar([new THREE.TorusGeometry(3.02,0.25,6,28).rotateX(Math.PI/2).translate(0,15,0),new THREE.TorusGeometry(2.6,0.25,6,28).rotateX(Math.PI/2).translate(0,13.2,0)]),mat(0xffffff)],
      [mesclar([B(1.6,1.2,1.6,0,9.2,0),...[[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7],[0.7,0.7]].map(([x,z])=>B(0.06,2.6,0.06,x,11,z))]),mat(0x8a5a2b)]],
      22,5,[1,1.5],[[0xe8202a,0x2f8fff,0xffc21f,0xff6fb5,0x3fbf3f,0xff8a1f],[0xffd21f,0xffffff]],{f:(t,b)=>({dy:Math.sin(t*0.4+b.fase)*3,yaw:t*0.08})});
  }else if(tema.veg==='joaninha'){
    // flores gigantes
    grupo([[new THREE.CylinderGeometry(0.25,0.3,8,8).translate(0,4,0),mat(0x3e8f2f)],
      [mesclar([0,1,2,3,4,5].map(k=>new THREE.SphereGeometry(1.2,10,8).scale(1,0.55,0.25).translate(1.3,0,0).rotateZ(k*Math.PI/3).translate(0,8.2,0.2))),mat(0xffffff)],
      [new THREE.SphereGeometry(0.8,12,10).scale(1,1,0.6).translate(0,8.2,0.5),mat(0xffd21f)]],
      55,7,[1.2,2],[null,[0xff6fb5,0xb36bff,0xffffff,0xff5e3a,0x3bc4ff]]);
    // joaninhas
    const pontos=[[0.5,0.55,0.2],[-0.5,0.55,0.2],[0.55,0.45,-0.5],[-0.55,0.45,-0.5],[0.3,0.75,-0.15],[-0.3,0.75,-0.15]].map(([x,y,z])=>new THREE.SphereGeometry(0.17,6,5).translate(x,y,z));
    grupo([[new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2).scale(0.9,0.85,1.1).translate(0,0.1,0),mat(0xe8202a)],
      [mesclar([new THREE.SphereGeometry(0.42,10,8).translate(0,0.3,1.05),B(0.05,0.02,2.1,0,0.95,-0.05),...pontos]),mat(0x151515)],
      [mesclar([new THREE.SphereGeometry(0.11,6,5).translate(-0.18,0.45,1.38),new THREE.SphereGeometry(0.11,6,5).translate(0.18,0.45,1.38)]),mat(0xffffff)]],45,3,[1.4,2.6],null,{f:(t,b)=>({yaw:t*0.15*(b.fase>Math.PI?1:-1)})});
    // abelhas voando
    grupo([[new THREE.SphereGeometry(1,12,10).scale(0.55,0.55,0.85).translate(0,5,0),mat(0xffc21f)],
      [mesclar([new THREE.TorusGeometry(0.55,0.08,6,16).scale(1,1,1).translate(0,5,0.15),new THREE.TorusGeometry(0.5,0.08,6,16).translate(0,5,-0.3),new THREE.SphereGeometry(0.1,6,5).translate(-0.2,5.15,0.78),new THREE.SphereGeometry(0.1,6,5).translate(0.2,5.15,0.78)]),mat(0x151515)],
      [mesclar([new THREE.SphereGeometry(0.5,8,6).scale(0.9,0.12,0.5).rotateZ(0.5).translate(-0.6,5.6,0),new THREE.SphereGeometry(0.5,8,6).scale(0.9,0.12,0.5).rotateZ(-0.5).translate(0.6,5.6,0)]),
        mat(0xffffff,{transparent:true,opacity:0.75})]],40,2,[1,1.6],null,{f:(t,b)=>{const a=t*1.2+b.fase;return{dx:Math.cos(a)*3,dz:Math.sin(a)*3,dy:Math.sin(t*3+b.fase)*0.4,yaw:rumo(a,b)};}});
    grupo([[new THREE.ConeGeometry(0.35,1.4,4).translate(0,0.7,0),mat(0x4fa63f)]],220,0.8,[0.8,1.6]);
  }else if(tema.veg==='natal'){
    // árvores de Natal com bolinhas e estrela
    const bolas=[];for(let i=0;i<10;i++){const a=i*2.1,y=1.6+(i%5)*0.95,r=2.3-(y-1.2)*0.38;bolas.push(new THREE.SphereGeometry(0.22,6,5).translate(r*Math.cos(a),y,r*Math.sin(a)));}
    grupo([[mesclar([new THREE.ConeGeometry(2.6,3,10).translate(0,2.4,0),new THREE.ConeGeometry(2.0,2.6,10).translate(0,4,0),new THREE.ConeGeometry(1.4,2.2,10).translate(0,5.4,0)]),mat(0x1f6e35)],
      [new THREE.CylinderGeometry(0.35,0.4,1,8).translate(0,0.5,0),mat(0x6b4a2b)],
      [mesclar(bolas),mat(0xffffff)],[new THREE.OctahedronGeometry(0.5,0).translate(0,6.8,0),brilho(0xffd21f)]],
      90,3.5,[0.8,1.6],[null,null,[0xe8202a,0xffc21f,0x2f8fff]]);
    // presentes
    grupo([[B(1.6,1.4,1.6,0,0.7,0),mat(0xffffff)],[mesclar([B(1.64,1.44,0.3,0,0.7,0),B(0.3,1.44,1.64,0,0.7,0),new THREE.TorusGeometry(0.3,0.08,6,12).translate(0,1.55,0)]),mat(0xffffff)]],
      80,1.5,[0.8,1.8],[[0xe8202a,0x2f8fff,0x3fbf3f,0xb36bff],[0xffd21f,0xffffff]]);
    // casinhas com neve no telhado
    const casa=new THREE.Shape([new THREE.Vector2(-3,0),new THREE.Vector2(3,0),new THREE.Vector2(3,4),new THREE.Vector2(0,6.5),new THREE.Vector2(-3,4)]);
    grupo([[new THREE.ExtrudeGeometry(casa,{depth:6,bevelEnabled:false}).translate(0,0,-3),mat(0xffffff)],
      [mesclar([new THREE.BoxGeometry(4.6,0.5,6.8).rotateZ(0.7).translate(-1.55,5.4,0),new THREE.BoxGeometry(4.6,0.5,6.8).rotateZ(-0.7).translate(1.55,5.4,0),B(0.9,2.4,0.9,1.6,6.6,-1.2)]),mat(0xf8fbff)],
      [mesclar([B(1.4,2.4,0.1,0,1.2,3.05),B(1.1,1.1,0.1,-1.8,2.4,3.05),B(1.1,1.1,0.1,1.8,2.4,3.05)]),brilho(0xffd98a)]],
      10,6,[1,1.3],[[0xc8322b,0x8a5a2b,0x2f6e9a,0x3f8a4a]]);
  }else if(tema.veg==='trem'){
    // trens coloridos parados nos trilhos
    const rodas=[];for(const z of [4.6,3.2,1.8,-1.6,-3.4,-6.8,-8.6])for(const x of [-1.05,1.05])rodas.push(new THREE.CylinderGeometry(0.55,0.55,0.3,12).rotateZ(Math.PI/2).translate(x,0.75,z));
    const dormentes=[];for(let z=-11;z<=7;z+=1.4)dormentes.push(B(3.2,0.15,0.5,0,0.08,z));
    grupo([[mesclar([new THREE.CylinderGeometry(1.1,1.1,4,14).rotateX(Math.PI/2).translate(0,2,3.2),B(2.4,3.2,2.2,0,2.4,0.4)]),mat(0xffffff)],
      [mesclar([B(2.2,2,4.2,0,2.1,-2.6),B(2.2,2,4.2,0,2.1,-7.7)]),mat(0xffffff)],
      [mesclar([...rodas,new THREE.CylinderGeometry(0.35,0.45,1.4,10).translate(0,3.6,4.2),B(2.7,0.3,2.6,0,4.1,0.4),B(0.12,0.12,19,-0.8,0.2,-2),B(0.12,0.12,19,0.8,0.2,-2)]),mat(0x26272b)],
      [mesclar(dormentes),mat(0x6b4a2b)]],
      15,12,[1,1.2],[[0xe8202a,0x2f8fff,0x3fbf3f],[0xffc21f,0xff8a1f,0x3bc4ff,0xb36bff]]);
    // caixas d'água e estações
    grupo([[mesclar([new THREE.CylinderGeometry(2,2,3,14).translate(0,8,0),new THREE.ConeGeometry(2.3,1.4,14).translate(0,10.2,0)]),mat(0x8a5a3a)],
      [mesclar([[-1.3,-1.3],[1.3,-1.3],[-1.3,1.3],[1.3,1.3]].map(([x,z])=>B(0.3,6.5,0.3,x,3.25,z))),mat(0x4a3018)]],6,4,[1,1.2]);
    grupo([[B(12,4,5,0,2,0),mat(0xf0e2c4)],[mesclar([B(13.4,0.5,6.8,0,4.3,0),B(1.4,1.4,0.2,0,3.2,2.55)]),mat(0x8a2f24)],[new THREE.CylinderGeometry(0.55,0.55,0.1,16).rotateX(Math.PI/2).translate(0,3.2,2.7),mat(0xffffff)]],4,9,[1,1.2]);
    arvoresRedondas(80,[0x3a8a34,0x4fa63f]);
  }
}

/* cenário com movimento: a cada quadro recalcula a posição das instâncias que se mexem */
const _anim=new THREE.Object3D(),_piv=new THREE.Matrix4(),_aux=new THREE.Matrix4();_anim.rotation.order='YXZ';
function animarCenario(lista,t){
  for(const a of lista){
    if(a.custom){a.custom(t);continue;}
    for(let i=0;i<a.bases.length;i++){const b=a.bases[i],r=a.f(t,b);
      _anim.position.set(b.x+(r.dx||0),r.dy||0,b.z+(r.dz||0));_anim.rotation.set(r.pitch||0,b.ry+(r.yaw||0),r.roll||0);_anim.scale.setScalar(b.sc);_anim.updateMatrix();
      if(r.piv!==undefined){_piv.makeTranslation(0,r.piv,0).multiply(_aux.makeRotationZ(r.ang)).multiply(_aux.makeTranslation(0,-r.piv,0));_anim.matrix.multiply(_piv);}
      for(const im of a.ims)im.setMatrixAt(i,_anim.matrix);}
    for(const im of a.ims)im.instanceMatrix.needsUpdate=true;}
}
