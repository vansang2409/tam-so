// Manual local QA only: Vite does not include this HTML entry in the production build.
import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js'
import {clone} from 'three/addons/utils/SkeletonUtils.js'
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js'
import {createDetailedVisitor} from '../src/components/templeDetailedVisitors.js'
import {createTempleModels} from '../src/components/templeModels.js'

const params=new URLSearchParams(location.search),actors=[]
const templeModels=createTempleModels()
const staticOnly=params.get('static')==='1',count=!staticOnly&&[1,4,8,24].includes(Number(params.get('count')))?Number(params.get('count')):1,solo=params.get('solo')==='1',low=params.get('quality')==='low'
let pose=staticOnly?'rest':'standing',turn=0,closeup=false,last=0,time=0
let statsAt=0,statsFrames=0,updateMs=0,submitMs=0,cadence=0,cpuUpdate=0,cpuSubmit=0
function assetUrl(key,fallback){
  const url=new URL(params.get(key)||fallback,location.origin)
  if(url.origin!==location.origin)throw Error('QA only accepts assets served by the same local origin')
  return url.href
}
function normalizeLegacy(asset){
  asset.scene.animations=asset.animations
  const gameEngine=!!asset.scene.getObjectByName('pelvis')&&!!asset.scene.getObjectByName('spine_03')
  if(gameEngine){asset.scene.userData.templeRig='mpfb-gameengine';asset.scene.userData.templeHeight=1.65;return}
  const outfit=asset.scene.getObjectByName('Ao_lam_garment')
  if(outfit)outfit.name='Ao lam garment'
  asset.scene.traverse(object=>{if(object.isMesh)for(const material of Array.isArray(object.material)?object.material:[object.material]){
    material.metalness=0;material.emissive?.setHex(0);material.emissiveIntensity=0
    if(!material.userData.visitorClothing){material.roughness=.7;material.normalScale?.setScalar(.65)}material.needsUpdate=true
  }})
}
async function load(canvas,url){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(1);renderer.shadowMap.enabled=!low;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1
  const context=renderer.getContext(),debugRenderer=context.getExtension('WEBGL_debug_renderer_info'),gpuLabel=context.getParameter(debugRenderer?debugRenderer.UNMASKED_RENDERER_WEBGL:context.RENDERER)
  canvas.dataset.gpu=gpuLabel
  const scene=new THREE.Scene();scene.background=new THREE.Color('#dedfd9')
  const camera=new THREE.PerspectiveCamera(40,1,.03,50)
  scene.add(new THREE.HemisphereLight(0xf0f2ef,0x747b70,.9))
  const light=new THREE.DirectionalLight(0xfff4e7,2.15);light.position.set(-2,4,3);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-2,right:2,top:3,bottom:-2});light.shadow.normalBias=.008;scene.add(light)
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.28;pmrem.dispose();room.dispose()
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshStandardMaterial({color:0xb7b9b2,roughness:.92}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.position.y=-.004;scene.add(ground)
  const liveMale=!staticOnly&&new URL(url).pathname==='/dichua/models/visitor-male.glb'
  const source=liveMale
    ? {scene:await templeModels.load('visitor-male')}
    : await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(url)
  if(!staticOnly&&!liveMale)normalizeLegacy(source)
  const rig=staticOnly?null:createDetailedVisitor(source.scene,scene),bind=clone(source.scene)
  // Vendor rigs can keep meshes before their skeleton hierarchy in scene order.
  // Update the whole hierarchy before measuring the actual current skinned pose.
  bind.updateMatrixWorld(true)
  const bounds=new THREE.Box3().setFromObject(bind,true),height=source.scene.userData.templeHeight||(staticOnly?1.65:1.75),scale=height/(bounds.max.y-bounds.min.y),center=bounds.getCenter(new THREE.Vector3())
  bind.traverse(object=>{if(object.isMesh){object.frustumCulled=false;object.castShadow=true;object.receiveShadow=true}})
  bind.scale.multiplyScalar(scale);bind.position.add(new THREE.Vector3(-center.x*scale,-bounds.min.y*scale,-center.z*scale));bind.visible=false;scene.add(bind)
  const rigs=rig?[rig]:[],columns=Math.ceil(Math.sqrt(count)),rows=Math.ceil(count/columns)
  for(let i=1;i<count;i++)rigs.push(createDetailedVisitor(source.scene,scene))
  if(count>1)for(let i=0;i<rigs.length;i++)rigs[i].root.position.set((i%columns-(columns-1)/2)*1.65,0,(Math.floor(i/columns)-(rows-1)/2)*1.65)
  const item={rig,rigs,bind,scene,camera,renderer,canvas,environment,url,columns,gpuLabel};actors.push(item)
  function resize(){const width=canvas.clientWidth,height=canvas.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()}
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize()
  return item
}
try{
  if(solo){document.querySelector('#before').closest('figure').hidden=true;document.querySelector('#after').closest('figure').style.width='min(94vw,1000px)'}
  await Promise.all([...(solo?[]:[load(document.querySelector('#before'),assetUrl('before','/dichua/models/visitor-female-lam.glb'))]),load(document.querySelector('#after'),assetUrl('after','/dichua/models/visitor-female-human.glb'))])
  document.querySelector('#status').textContent=`Studio QA cục bộ · ${count} nhân vật/khung · ${low?'không bóng':'có bóng'} · pixel ratio1. Cadence/CPU submit của studio không phải benchmark cảnh chùa hay GPU.`
  for(const button of document.querySelectorAll('[data-pose]')){button.disabled=staticOnly;button.onclick=()=>{pose=button.dataset.pose;time=0;for(const other of document.querySelectorAll('[data-pose]'))other.setAttribute('aria-pressed',String(other===button))}}
  document.querySelector('#turn').onclick=()=>{turn=(turn+1)%8}
  document.querySelector('#closeup').onclick=()=>{closeup=!closeup}
  function render(now){
    const dt=Math.min(last?(now-last)/1000:1/60,.05);last=now;time+=dt
    document.querySelector('#status').textContent=staticOnly?'Chỉ kiểm mesh/vật liệu tĩnh theo source. Chưa kiểm rig, chuyển động hay nghi thức; không phải nhân vật đã tích hợp.':`Studio QA cục bộ · ${pose==='rest'?1:count} nhân vật/khung · ${low?'không bóng':'có bóng'} · pixel ratio1. Cadence/CPU submit của studio không phải benchmark cảnh chùa hay GPU.`
    for(const {rigs,bind,scene,camera,renderer,canvas,columns}of actors){
      const updateAt=performance.now()
      bind.rotation.y=turn*Math.PI/4;bind.visible=pose==='rest'
      const animated=pose==='walk'||pose==='idle'
      for(const rig of rigs){rig.root.rotation.y=turn*Math.PI/4;rig.root.visible=pose!=='rest';if(pose!=='rest')rig.update({pose:animated?'standing':pose==='prayer'?'bowing':pose,moving:pose==='walk',progress:pose==='bowing'?1/6:0,time:animated?time:0,dt:animated?dt:1/60,reduced:!animated&&pose!=='bowing'})}
      updateMs+=performance.now()-updateAt
      if(count>1){
        camera.position.set(0,columns*.8,columns*2.7)
        camera.lookAt(0,.8,0)
      }else if(closeup&&pose==='meditating'){
        camera.position.set(0,.86,1.65)
        camera.lookAt(0,.48,.10)
      }else if(closeup&&(pose==='bowing'||pose==='prayer')){
        camera.position.set(0,.95,1.85)
        camera.lookAt(0,pose==='bowing'?.32:.60,.16)
      }else{
        camera.position.set(0,closeup?1.50:.96,closeup?1.15:3.25)
        camera.lookAt(0,closeup?1.46:.91,0)
      }
      const renderAt=performance.now();renderer.render(scene,camera);submitMs+=performance.now()-renderAt
      canvas.dataset.ready='true';canvas.dataset.pose=pose;canvas.dataset.calls=renderer.info.render.calls;canvas.dataset.triangles=renderer.info.render.triangles;canvas.dataset.turn=turn
    }
    if(!statsAt)statsAt=now;statsFrames++
    if(now-statsAt>=1000){cadence=statsFrames*1000/(now-statsAt);cpuUpdate=updateMs/statsFrames;cpuSubmit=submitMs/statsFrames;statsAt=now;statsFrames=0;updateMs=0;submitMs=0}
    document.querySelector('#metrics').textContent=actors.map(({canvas})=>`${canvas.id}: ${canvas.width}×${canvas.height}, ${canvas.dataset.calls} calls, ${canvas.dataset.triangles} triangles`).join(' · ')+` · ${cadence.toFixed(1)} RAF/s · CPU update${cpuUpdate.toFixed(2)}ms/submit${cpuSubmit.toFixed(2)}ms (cộng ${actors.length} view) · GPU ${[...new Set(actors.map(actor=>actor.gpuLabel))].join(' / ')}`
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}catch(error){document.querySelector('#error').textContent=error.stack}
