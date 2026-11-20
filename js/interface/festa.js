// Turbo Kids · Comemoração com confete e fogos.
import {$,reduzMov} from '../nucleo/util.js';
import {Som} from '../audio/som.js';

export const Festa={raf:0,
  iniciar(pos){this.parar();if(pos>3)return;const cv=$('#festa'),x=cv.getContext('2d');cv.hidden=false;
    const dpr=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    const W=innerWidth,H=innerHeight,cores=['#e3120b','#ffc21a','#22b45a','#1e5bd8','#ff4fa3','#ffffff','#ff7300'];
    const conf=[];const qtd=reduzMov?40:(pos===1?170:90);
    for(let i=0;i<qtd;i++)conf.push({x:Math.random()*W,y:-20-Math.random()*H*0.8,vx:(Math.random()-0.5)*60,vy:80+Math.random()*120,
      r:Math.random()*6,vr:(Math.random()-0.5)*8,w:6+Math.random()*6,h:10+Math.random()*8,c:cores[i%cores.length],f:Math.random()*6});
    const fa=[];let tF=0,tempo=0,ultimo=performance.now();
    const passo=(t)=>{const dt=Math.min(0.05,(t-ultimo)/1000);ultimo=t;tempo+=dt;x.clearRect(0,0,W,H);
      if(pos===1&&!reduzMov&&tempo<5.5){tF-=dt;if(tF<=0){tF=0.45+Math.random()*0.4;const cx=W*(0.15+Math.random()*0.7),cy=H*(0.12+Math.random()*0.35),cor=cores[Math.floor(Math.random()*cores.length)];
        for(let k=0;k<46;k++){const a=k/46*Math.PI*2,v=120+Math.random()*90;fa.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,v:1,c:cor});}Som.fogos();}}
      for(let i=fa.length-1;i>=0;i--){const p=fa[i];p.vy+=160*dt;p.vx*=0.985;p.x+=p.vx*dt;p.y+=p.vy*dt;p.v-=dt*0.8;if(p.v<=0){fa.splice(i,1);continue;}
        x.globalAlpha=p.v;x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,2.6,0,7);x.fill();}
      x.globalAlpha=1;
      for(const c of conf){c.f+=dt*4;c.x+=(c.vx+Math.sin(c.f)*40)*dt;c.y+=c.vy*dt;c.r+=c.vr*dt;
        if(c.y>H+20&&tempo<4){c.y=-20;c.x=Math.random()*W;}
        x.save();x.translate(c.x,c.y);x.rotate(c.r);x.scale(1,Math.cos(c.f));x.fillStyle=c.c;x.fillRect(-c.w/2,-c.h/2,c.w,c.h);x.restore();}
      if(tempo<9)this.raf=requestAnimationFrame(passo);else this.parar();};
    this.raf=requestAnimationFrame(passo);},
  parar(){cancelAnimationFrame(this.raf);const cv=$('#festa');cv.hidden=true;},
};
