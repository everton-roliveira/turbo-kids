// Turbo Kids · Mapa de ambiente para os reflexos dos carros.
import {lin} from './util.js';
import {renderer} from './render.js';

export function criarAmbiente(topo,horiz,chao,luzes){
  const sc=new THREE.Scene();const g=new THREE.SphereGeometry(50,32,16);const p=g.attributes.position,cols=[];
  const ct=lin(topo),ch=lin(horiz),cg=lin(chao);
  for(let i=0;i<p.count;i++){const y=p.getY(i)/50;const c=y>0?ch.clone().lerp(ct,Math.pow(y,0.6)):ch.clone().lerp(cg,Math.min(1,-y*4));cols.push(c.r,c.g,c.b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
  sc.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
  for(const l of luzes){const m=new THREE.Mesh(new THREE.BoxGeometry(l.s[0],l.s[1],l.s[2]),new THREE.MeshBasicMaterial({color:new THREE.Color(l.i,l.i,l.i*0.95)}));
    m.position.set(l.p[0],l.p[1],l.p[2]);m.lookAt(0,0,0);sc.add(m);}
  const pm=new THREE.PMREMGenerator(renderer);const rt=pm.fromScene(sc,0.02);pm.dispose();
  sc.traverse(o=>{if(o.geometry)o.geometry.dispose();});return rt.texture;
}
