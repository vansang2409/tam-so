import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

// Mẫu quét CC BY 4.0; nguồn, tác giả và thay đổi ở /dichua/models/ATTRIBUTION.md.
export function fitTempleModel(source,{height,maxWidth=Infinity,maxDepth=Infinity}) {
  const object=source.clone(true),bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3())
  if(!size.y||!Number.isFinite(size.length()))throw new Error('Mô hình không có kích thước hợp lệ')
  object.scale.multiplyScalar(Math.min(height/size.y,maxWidth/size.x,maxDepth/size.z))
  bounds.setFromObject(object);const center=bounds.getCenter(new THREE.Vector3())
  object.position.x-=center.x;object.position.z-=center.z;object.position.y-=bounds.min.y
  return object
}
export function prepareTempleAsset(root,file) {
  root.updateMatrixWorld(true,true)
  const bounds=new THREE.Box3().setFromObject(root),height=bounds.max.y-bounds.min.y
  root.traverse(o=>{if(!o.isMesh)return
    const old=o.geometry
    if(file==='altar'){
      // Giữ cạnh bàn gỗ rõ nét, đồng thời làm mềm khuôn mặt và nếp áo.
      o.geometry=toCreasedNormals(old,Math.PI*.28);old.dispose()
      const g=o.geometry,a=g.attributes.position,indices=[[],[]],point=new THREE.Vector3()
      for(let i=0;i<a.count;i+=3){let y=0;for(let j=0;j<3;j++){point.fromBufferAttribute(a,i+j).applyMatrix4(o.matrixWorld);y+=point.y/3}
        const h=(y-bounds.min.y)/height
        indices[h<.4?1:0].push(i,i+1,i+2)
      }
      g.setIndex([...indices[0],...indices[1]]);g.clearGroups();g.addGroup(0,indices[0].length,0);g.addGroup(indices[0].length,indices[1].length,1)
    }else o.geometry.computeVertexNormals()
    o.geometry.userData.templeAsset=true;o.castShadow=true;o.receiveShadow=true
  })
  return root
}
export function createTempleModels() {
  const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder),cache=new Map(),jobs=[],anchors=[],controllers=new Set(),resources=new Set()
  let disposed=false
  function load(file) {
    if(!cache.has(file))cache.set(file,(async()=>{
      const controller=new AbortController();controllers.add(controller)
      const timer=setTimeout(()=>controller.abort(),15000)
      try {
        const response=await fetch((import.meta.env?.BASE_URL||'/')+'dichua/models/'+file+'.glb',{signal:controller.signal})
        if(!response.ok)throw new Error('Không tải được mô hình '+file)
        const gltf=await loader.parseAsync(await response.arrayBuffer(),'')
        prepareTempleAsset(gltf.scene,file)
        gltf.scene.traverse(o=>{if(o.isMesh){
          // GLB giảm lưới không chứa normal: tính lại để mặt và nếp áo không bị gãy cạnh.
          resources.add(o.geometry)
          for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()
          o.castShadow=true;o.receiveShadow=true
        }})
        if(disposed){resources.forEach(g=>g.dispose());throw new Error('Cảnh đã đóng')}
        return gltf.scene
      } finally {clearTimeout(timer);controllers.delete(controller)}
    })())
    return cache.get(file)
  }
  function place(file,parent,options,fallback) {
    const anchor=new THREE.Group();anchor.name='Chi tiết quét 3D · '+file
    anchor.position.set(...(options.position||[0,0,0]));parent.add(anchor);anchors.push(anchor)
    if(fallback)anchor.add(fallback)
    const task=load(file).then(source=>{
      if(disposed)return
      const object=fitTempleModel(source,options)
      object.traverse(o=>{if(o.isMesh)o.material=options.material})
      anchor.add(object);if(fallback)fallback.visible=false
      anchor.userData.loaded=true
    }).catch(()=>{anchor.userData.failed=true})
    jobs.push(task);return anchor
  }
  return {place,anchors,get ready(){return Promise.allSettled([load('altar'),load('qa'),...jobs]).then(results=>results.every(r=>r.status==='fulfilled')&&!anchors.some(a=>a.userData.failed)?'ready':'partial')},dispose(){disposed=true;controllers.forEach(c=>c.abort());resources.forEach(g=>g.dispose())}}
}
