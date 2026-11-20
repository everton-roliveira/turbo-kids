// Turbo Kids · Pista: Parque de Diversões.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/circo.js';
import {lin,reduzMov} from '../../nucleo/util.js';
import {mesclar} from '../../nucleo/mesclar.js';
import {TEX,tex} from '../../nucleo/texturas.js';

export default {
  nome:'Parque de Diversões',ico:'🎡',musica,
  ceu:0xffe0b8,ceuTopo:0x6a7fe0,nevoa:0xffe9d1,chao:0x7cc45a,arvore:0x3a8a34,tronco:0x6b4a2b,luz:1.0,
  decorar(h){
    const {dm,instancia,animados,mat,grupo,arvoresRedondas,B}=h;
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
    porCab(0);if(!reduzMov)animados.push({custom:porCab});
    // tendas de circo
    grupo([[new THREE.CylinderGeometry(6,6,5,20).translate(0,2.5,0),new THREE.MeshLambertMaterial({map:TEX.circo})],
      [new THREE.ConeGeometry(7,5,20).translate(0,7.5,0),new THREE.MeshLambertMaterial({map:TEX.circo})],
      [mesclar([new THREE.CylinderGeometry(0.08,0.08,2,6).translate(0,10.8,0),B(1.2,0.7,0.06,0.6,11.4,0)]),mat(0xffc21f)]],7,8,[0.9,1.2]);
    // balões coloridos
    grupo([[new THREE.SphereGeometry(0.8,12,10).scale(1,1.2,1).translate(0,6.5,0),mat(0xffffff)],[B(0.03,5.6,0.03,0,2.8,0),mat(0xeeeeee)]],
      60,1.5,[0.8,1.3],[[0xe8202a,0x2f8fff,0xffc21f,0x3fbf3f,0xff6fb5,0xb36bff]],{f:(t,b)=>({dy:Math.sin(t*0.9+b.fase)*0.8,roll:Math.sin(t*0.7+b.fase)*0.05})});
    arvoresRedondas(70,[0x3a8a34,0x4fa63f]);
  },
};
