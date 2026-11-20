// Turbo Kids · Junta várias geometrias em uma só.
export function mesclar(geos){const pos=[],nor=[];
  for(const g of geos){const n=g.index?g.toNonIndexed():g;n.computeVertexNormals();pos.push(...n.attributes.position.array);nor.push(...n.attributes.normal.array);}
  const r=new THREE.BufferGeometry();r.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));r.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return r;}
