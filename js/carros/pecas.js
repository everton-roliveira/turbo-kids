// Turbo Kids · Peças e materiais compartilhados (pneu, aro, faróis...) e número de corrida.
import {lin} from '../nucleo/util.js';
import {mesclar} from '../nucleo/mesclar.js';
import {tex} from '../nucleo/texturas.js';

export const texNumeros={};
export function texNumero(n){if(texNumeros[n])return texNumeros[n];
  return texNumeros[n]=tex(128,128,(x)=>{x.fillStyle='#fafafa';x.beginPath();x.arc(64,64,58,0,7);x.fill();x.lineWidth=6;x.strokeStyle='#111';x.stroke();
    x.fillStyle='#111';x.font=`800 ${String(n).length>2?54:80}px "Baloo 2", sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),64,72);});}
export const GEO=(()=>{
  const perfilPneu=[[.235,-.155],[.31,-.16],[.338,-.15],[.35,-.12],[.352,-.06],[.352,.06],[.35,.12],[.338,.15],[.31,.16],[.235,.155]].map(p=>new THREE.Vector2(p[0],p[1]));
  const raios=[];for(let k=0;k<5;k++)raios.push(new THREE.BoxGeometry(.035,.05,.43).rotateX(k*Math.PI/5).translate(.12,0,0));
  return{
    pneu:new THREE.LatheGeometry(perfilPneu,28).rotateZ(-Math.PI/2),
    aro:mesclar([new THREE.CylinderGeometry(.24,.24,.27,24,1,true).rotateZ(Math.PI/2),...raios,
      new THREE.CylinderGeometry(.06,.06,.05,12).rotateZ(Math.PI/2).translate(.13,0,0),
      new THREE.TorusGeometry(.238,.012,6,28).rotateY(Math.PI/2).translate(.135,0,0)]),
    disco:new THREE.CylinderGeometry(.2,.2,.03,22).rotateZ(Math.PI/2).translate(.02,0,0),
    pinca:new THREE.BoxGeometry(.08,.12,.17),
    arco:new THREE.CircleGeometry(.44,24),
    aba:new THREE.TorusGeometry(.44,.04,6,20,Math.PI).rotateY(Math.PI/2),
    fogo:new THREE.ConeGeometry(.12,.9,8).rotateX(-Math.PI/2),
    escape:new THREE.CylinderGeometry(.06,.06,.16,12).rotateX(Math.PI/2),
    sombra:new THREE.PlaneGeometry(2.4,5).rotateX(-Math.PI/2),
    esfera:new THREE.SphereGeometry(1,16,10),
    lantRed:new THREE.CylinderGeometry(.075,.075,.04,16).rotateX(Math.PI/2),
    numero:new THREE.PlaneGeometry(.5,.5),
  };})();
export const MAT={
  carbono:new THREE.MeshStandardMaterial({color:lin(0x18191d),roughness:0.45,metalness:0.4}),
  vidro:new THREE.MeshPhysicalMaterial({color:lin(0x0a0e15),metalness:0.9,roughness:0.06,clearcoat:1}),
  pneu:new THREE.MeshStandardMaterial({color:lin(0x151516),roughness:0.92,side:THREE.DoubleSide}),
  disco:new THREE.MeshStandardMaterial({color:lin(0x77797e),metalness:0.9,roughness:0.45}),
  arco:new THREE.MeshBasicMaterial({color:lin(0x050506)}),
  farol:new THREE.MeshStandardMaterial({color:lin(0xeef4ff),emissive:lin(0xdfe9ff),emissiveIntensity:1.4,metalness:0.2,roughness:0.1}),
  lanterna:new THREE.MeshStandardMaterial({color:lin(0xff2010),emissive:lin(0xff1505),emissiveIntensity:1.2}),
  cromo:new THREE.MeshStandardMaterial({color:lin(0xdfe2e6),metalness:1,roughness:0.2}),
  fogo:new THREE.MeshBasicMaterial({color:lin(0xff8a1a)}),
  sombra:new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.3,depthWrite:false}),
};
export const matCache={};
export function matAro(hex){return matCache['a'+hex]||(matCache['a'+hex]=new THREE.MeshStandardMaterial({color:lin(hex),metalness:1,roughness:0.28,side:THREE.DoubleSide}));}
export function matCor(hex){return matCache['c'+hex]||(matCache['c'+hex]=new THREE.MeshStandardMaterial({color:lin(hex),roughness:0.4,metalness:0.3}));}
export function matNumero(n){return matCache['n'+n]||(matCache['n'+n]=new THREE.MeshStandardMaterial({map:texNumero(n),transparent:true,alphaTest:0.3,roughness:0.4}));}
export const geosFixas=new Set(Object.values(GEO));
