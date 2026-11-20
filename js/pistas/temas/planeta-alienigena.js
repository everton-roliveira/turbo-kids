// Turbo Kids · Pista: Planeta Alienígena.
// cores do céu, névoa, chão e árvores; luz = força do sol; decorar() espalha os objetos do cenário (veja pistas/ferramentas.js).
import musica from '../../audio/musicas/alien.js';
import {lin} from '../../nucleo/util.js';
import {mesclar} from '../../nucleo/mesclar.js';

export default {
  nome:'Planeta Alienígena',ico:'👽',musica,
  ceu:0x3a1060,ceuTopo:0x12052a,nevoa:0x4a1a70,chao:0x8a4fb0,arvore:0x5affe0,tronco:0x3a2a6a,luz:0.85,
  decorar(h){
    const {cena,rnd,animados,cx,cz,mat,grupo}=h;
    // cristais que brilham
    grupo([[mesclar([new THREE.OctahedronGeometry(1,0).scale(0.6,2.4,0.6).translate(0,2,0),new THREE.OctahedronGeometry(1,0).scale(0.45,1.6,0.45).rotateZ(0.5).translate(1,1.2,0.3),
      new THREE.OctahedronGeometry(1,0).scale(0.4,1.4,0.4).rotateZ(-0.6).translate(-0.9,1,-0.2)]),new THREE.MeshBasicMaterial({color:0xffffff})]],90,3,[0.7,2],[[0x5affe0,0xff6af0,0xb4ff4a,0x7a8aff]]);
    // plantas de bolinha que balançam
    grupo([[new THREE.CylinderGeometry(0.1,0.16,3,6).translate(0,1.5,0),mat(0x3a2a6a)],[new THREE.SphereGeometry(0.5,10,8).translate(0,3.2,0),new THREE.MeshBasicMaterial({color:0xffffff})]],
      140,1.2,[0.8,1.8],[null,[0xffe14d,0x5affe0,0xff6af0]],{f:(t,b)=>({roll:Math.sin(t*1.4+b.fase)*0.18})});
    // alienzinhos de um olho
    grupo([[mesclar([new THREE.SphereGeometry(0.7,12,10).scale(1,1.2,1).translate(0,0.9,0),new THREE.SphereGeometry(0.75,14,10).translate(0,2.2,0),
        new THREE.CylinderGeometry(0.04,0.04,0.7,5).rotateZ(0.4).translate(-0.4,3.1,0),new THREE.CylinderGeometry(0.04,0.04,0.7,5).rotateZ(-0.4).translate(0.4,3.1,0),
        new THREE.SphereGeometry(0.12,6,5).translate(-0.55,3.45,0),new THREE.SphereGeometry(0.12,6,5).translate(0.55,3.45,0)]),mat(0x6fdc4a)],
      [new THREE.SphereGeometry(0.36,12,10).scale(1,1,0.6).translate(0,2.3,0.58),mat(0xffffff)],[new THREE.SphereGeometry(0.17,8,6).translate(0,2.3,0.8),mat(0x111111)]],
      30,1.5,[1.2,1.8],null,{f:(t,b)=>({dy:Math.abs(Math.sin(t*2.5+b.fase))*0.8,yaw:Math.sin(t*0.6+b.fase)*0.8})});
    // céu: estrelas, planeta com anel e duas luas
    const pos=[];for(let i=0;i<1100;i++){const t=rnd()*Math.PI*2,y=rnd()*0.95+0.03,r=Math.sqrt(1-y*y);pos.push(cx+Math.cos(t)*r*1000,y*1000-40,cz+Math.sin(t)*r*1000);}
    const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    cena.add(new THREE.Points(ge,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,fog:false})));
    const planeta=new THREE.Group();planeta.position.set(cx-220,190,cz-520);
    planeta.add(new THREE.Mesh(new THREE.SphereGeometry(60,32,20),new THREE.MeshBasicMaterial({color:lin(0xff9a5a),fog:false})));
    const anel=new THREE.Mesh(new THREE.RingGeometry(80,115,48),new THREE.MeshBasicMaterial({color:lin(0xffd9a0),side:THREE.DoubleSide,fog:false,transparent:true,opacity:0.8}));
    anel.rotation.x=Math.PI/2.4;planeta.add(anel);cena.add(planeta);
    for(const [x,y,z,r,c] of [[260,230,-420,18,0xd9e6ff],[340,150,-300,10,0xb4ff9a]]){const l=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),new THREE.MeshBasicMaterial({color:lin(c),fog:false}));l.position.set(cx+x,y,cz+z);cena.add(l);}
    animados.push({custom:t=>{planeta.rotation.y=t*0.04;}});
  },
};
