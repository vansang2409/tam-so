import * as THREE from 'three'

// Imported pants and shoes define ground contact, not an assumed skeleton height.
// Cache static attributes and only evaluate the parent-space Y row of each skin matrix.
export function createTempleRigContact(model,holder){
  holder.parent?.updateWorldMatrix(true,false);holder.updateMatrixWorld(true)
  const supports=[]
  model.traverse(mesh=>{
    if(!mesh.isSkinnedMesh)return
    const names=[mesh.name,...(Array.isArray(mesh.material)?mesh.material:[mesh.material]).map(material=>material.name)].join(' ')
    if(!/shoes|sandal|pants|trousers/i.test(names))return
    const geometry=mesh.geometry,ids=[...new Set(geometry.index?.array||Array.from({length:geometry.attributes.position.count},(_,i)=>i))]
    const position=new Float64Array(ids.length*3),joints=new Uint16Array(ids.length*4),weights=new Float64Array(ids.length*4),used=new Set()
    for(let i=0;i<ids.length;i++){
      const id=ids[i]
      for(let k=0;k<3;k++)position[i*3+k]=geometry.attributes.position.getComponent(id,k)
      for(let k=0;k<4;k++){const joint=geometry.attributes.skinIndex.getComponent(id,k);joints[i*4+k]=joint;weights[i*4+k]=geometry.attributes.skinWeight.getComponent(id,k);if(weights[i*4+k])used.add(joint)}
    }
    supports.push({mesh,ids,position,joints,weights,used,rows:new Float64Array(mesh.skeleton.bones.length*4)})
  })
  const meshToParent=new THREE.Matrix4(),skin=new THREE.Matrix4(),combined=new THREE.Matrix4(),point=new THREE.Vector3()
  return {get sampleCount(){return supports.reduce((sum,support)=>sum+support.ids.length,0)},apply(){
    if(!supports.length)return 0
    // updateMatrixWorld also refreshes SkinnedMesh.bindMatrixInverse for attached skins.
    holder.parent?.updateWorldMatrix(true,false);holder.updateMatrixWorld(true)
    let minimum=Infinity
    for(const {mesh,ids,position,joints,weights,used,rows}of supports){
      if(mesh.geometry.morphAttributes.position?.length){
        for(const id of ids){mesh.getVertexPosition(id,point).applyMatrix4(mesh.matrixWorld);holder.parent.worldToLocal(point);minimum=Math.min(minimum,point.y)}
        continue
      }
      meshToParent.copy(holder.parent.matrixWorld).invert().multiply(mesh.matrixWorld).multiply(mesh.bindMatrixInverse)
      for(const joint of used){
        skin.multiplyMatrices(mesh.skeleton.bones[joint].matrixWorld,mesh.skeleton.boneInverses[joint]);combined.copy(meshToParent).multiply(skin).multiply(mesh.bindMatrix)
        const e=combined.elements;rows.set([e[1],e[5],e[9],e[13]],joint*4)
      }
      for(let i=0;i<ids.length;i++){
        const x=position[i*3],y=position[i*3+1],z=position[i*3+2];let height=0
        for(let k=0;k<4;k++){const offset=joints[i*4+k]*4;height+=weights[i*4+k]*(rows[offset]*x+rows[offset+1]*y+rows[offset+2]*z+rows[offset+3])}
        minimum=Math.min(minimum,height)
      }
    }
    const delta=THREE.MathUtils.clamp(.003-minimum,-.15,.15)
    holder.position.y+=delta;holder.updateMatrixWorld(true);return delta
  }}
}
