// Turbo Kids · Cenário com movimento.
export const _anim=new THREE.Object3D(),_piv=new THREE.Matrix4(),_aux=new THREE.Matrix4();
_anim.rotation.order='YXZ';
export function animarCenario(lista,t){
  for(const a of lista){
    if(a.custom){a.custom(t);continue;}
    for(let i=0;i<a.bases.length;i++){const b=a.bases[i],r=a.f(t,b);
      _anim.position.set(b.x+(r.dx||0),r.dy||0,b.z+(r.dz||0));_anim.rotation.set(r.pitch||0,b.ry+(r.yaw||0),r.roll||0);_anim.scale.setScalar(b.sc);_anim.updateMatrix();
      if(r.piv!==undefined){_piv.makeTranslation(0,r.piv,0).multiply(_aux.makeRotationZ(r.ang)).multiply(_aux.makeTranslation(0,-r.piv,0));_anim.matrix.multiply(_piv);}
      for(const im of a.ims)im.setMatrixAt(i,_anim.matrix);}
    for(const im of a.ims)im.instanceMatrix.needsUpdate=true;}
}
