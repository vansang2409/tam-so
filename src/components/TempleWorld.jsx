import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createTempleVisitors } from './templeVisitors.js'
import { createTempleWorld } from './templeWorldScene.js'
import { WORLD_SPOTS, findWorldPath, nearestSpot, groundHeight, isWalkable } from '../data/templeWorld.js'

import { BOW_DURATION, templePose } from '../data/templeRituals.js'
import { DEFAULT_PERSPECTIVE, thirdPersonPose, thirdPersonCameraStep } from '../data/templeCamera.js'
import { templeBellAngle } from './templeBell.js'
import { pickTempleGround } from './templeGroundPicking.js'
import { TEMPLE_MOUSE_BUTTONS, isTempleNavigateClick, isTempleNavigateDrag, isTempleLookDrag } from './templePointerInput.js'

const INDOOR_KINDS=new Set(['main','hall','house','shrine','tower'])
const TempleWorld=forwardRef(function TempleWorld({litIds,meditating,bowing,ritual,paused,quality,appearance,peers,onPresence,onMove,onArrive,onStatus,onReady,onError},ref) {
  const host=useRef(null),api=useRef(null),props=useRef({}),[failed,setFailed]=useState(false)
  props.current={litIds,meditating,bowing,ritual,paused,quality,appearance,peers,onPresence,onMove,onArrive,onStatus,onReady,onError}
  useImperativeHandle(ref,()=>({
    goTo(id,action){api.current?.goTo(id,action)},
    reset(){api.current?.reset()},
    exit(){api.current?.exit()},
    zoom(delta){api.current?.zoom(delta)},
    bell(){api.current?.bell()},
    togglePerspective(){api.current?.togglePerspective()},
    preparePose(){api.current?.preparePose()},
  }),[])
  useEffect(()=>{
    const container=host.current
    let renderer,world,visitors,controls,observer,environment,skyBackground,frame,disposed=false,contextLost=false,transitionTimer=null
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'})
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,props.current.quality==='low'?1:1.5))
      renderer.outputColorSpace=THREE.SRGBColorSpace
      renderer.shadowMap.enabled=props.current.quality!=='low';renderer.shadowMap.type=THREE.PCFShadowMap
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08
      renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement)
      const transition=document.createElement('div');transition.className='tw-scene-transition';transition.setAttribute('aria-hidden','true');container.appendChild(transition)
      const scene=new THREE.Scene();scene.background=new THREE.Color(0xdce5e4);scene.fog=new THREE.Fog(0xdce5e4,85,230)
      // A separate panorama gives the visible sky a soft horizon without changing reflections.
      const backdrop=document.createElement('canvas');backdrop.width=4;backdrop.height=128
      const backdropContext=backdrop.getContext('2d'),backdropGradient=backdropContext.createLinearGradient(0,0,0,128)
      for(const [stop,color] of [[0,'#779bb8'],[.35,'#b4cbd5'],[.49,'#dce5e4'],[.52,'#dce5e4'],[1,'#90977e']])backdropGradient.addColorStop(stop,color)
      backdropContext.fillStyle=backdropGradient;backdropContext.fillRect(0,0,4,128)
      skyBackground=new THREE.CanvasTexture(backdrop);skyBackground.colorSpace=THREE.SRGBColorSpace;skyBackground.mapping=THREE.EquirectangularReflectionMapping;scene.background=skyBackground
      // A local sky panorama supplies broad reflections for bronze, lacquer and water.
      const skyCanvas=document.createElement('canvas');skyCanvas.width=512;skyCanvas.height=256
      const skyContext=skyCanvas.getContext('2d'),skyGradient=skyContext.createLinearGradient(0,0,0,256)
      for(const [stop,color] of [[0,'#819fb8'],[.46,'#e1e7e3'],[.52,'#c2bba7'],[1,'#5d6651']])skyGradient.addColorStop(stop,color)
      skyContext.fillStyle=skyGradient;skyContext.fillRect(0,0,512,256)
      const glow=skyContext.createRadialGradient(150,75,0,150,75,44);glow.addColorStop(0,'rgba(255,246,224,.95)');glow.addColorStop(1,'rgba(255,246,224,0)');skyContext.fillStyle=glow;skyContext.fillRect(0,0,512,256)
      const skyTexture=new THREE.CanvasTexture(skyCanvas);skyTexture.colorSpace=THREE.SRGBColorSpace;skyTexture.mapping=THREE.EquirectangularReflectionMapping
      const pmrem=new THREE.PMREMGenerator(renderer);environment=pmrem.fromEquirectangular(skyTexture);scene.environment=environment.texture;scene.environmentIntensity=.4;pmrem.dispose();skyTexture.dispose()
      scene.add(new THREE.HemisphereLight(0xe5efff,0x9b9585,.9))
      const sun=new THREE.DirectionalLight(0xfff1dc,2.15);sun.position.set(-28,44,25);sun.castShadow=true
      // Keep the proven bias: lowering it reveals self-shadow stripes on the paving.
      sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38,near:1,far:130});sun.shadow.radius=3;sun.shadow.bias=-.00025;sun.shadow.normalBias=.055;scene.add(sun)
      // Keep the fill below the sun so eaves, folds and contact shadows retain depth.
      const skyFill=new THREE.DirectionalLight(0xdce9ff,.35);skyFill.position.set(18,16,-28);scene.add(skyFill)
      const interiorLight=new THREE.PointLight(0xffeed6,12,16,2);interiorLight.visible=false;scene.add(interiorLight)
      const altarLight=new THREE.SpotLight(0xffe7c2,24,22,Math.PI/3,.85,2);altarLight.visible=false;scene.add(altarLight,altarLight.target)
      const camera=new THREE.PerspectiveCamera(47,1,.1,500)
      controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.075
      Object.assign(controls.mouseButtons,TEMPLE_MOUSE_BUTTONS)
      controls.minDistance=7;controls.maxDistance=240;controls.minPolarAngle=.28;controls.maxPolarAngle=1.43
      world=createTempleWorld(scene);visitors=createTempleVisitors(world);world.avatar.position.set(0,.07,24.8)
      world.models.subscribe(assets=>{if(!disposed)props.current.onStatus?.({assets})});world.models.ready.then(assets=>{if(!disposed)props.current.onStatus?.({assets})})
      let path=[],pending=null,moving=false,follow=false,lastRender=0,time=0,statusAt=0,bellAt=-20,lastQuality='',room=null,suppressedEntry=null,yaw=0,pitch=.13,interiorFov=64,perspective=DEFAULT_PERSPECTIVE,thirdDistance=6.8,thirdElevation=.48,currentPose='standing',currentBowProgress=0,currentBowAmount=0,frameStatsAt=0,frameStatsFrames=0
      const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),hit=new THREE.Vector3()
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let firstResize=true
      const resize=()=>{
        const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return
        camera.aspect=w/h
        if(room||perspective==='first')camera.clearViewOffset();else camera.setViewOffset(w,h,0,h*.08,w,h)
        camera.updateProjectionMatrix();renderer.setSize(w,h)
        if(firstResize){const offset=new THREE.Vector3(10,9,26).normalize().multiplyScalar(Math.max(30,17/camera.aspect));controls.target.set(0,1.1,15);camera.position.copy(controls.target).add(offset);controls.update();firstResize=false}
      }
      const reportView=()=>props.current.onStatus?.({view:room?(room.indoor?'inside':'area'):'outside',roomId:room?.id||null,roomName:room?.ten||null,perspective,moving})
      function enterArea(spot,instant=false) {
        if(room?.id===spot.id)return
        room={...spot,indoor:INDOOR_KINDS.has(spot.kind)};yaw=perspective==='third'?.22:0;pitch=['pond','garden'].includes(spot.kind)?-.3:['duoc-su','thap-dien'].includes(spot.architecture.style)?-.06:spot.kind==='main'?.1:.04;interiorFov=64
        thirdDistance=room.indoor?6.8:7;thirdElevation=.48;world.avatar.rotation.y=Math.PI;controls.enabled=false;world.avatar.visible=perspective==='third'
        interiorLight.visible=room.indoor;interiorLight.intensity=spot.kind==='main'?30:14;interiorLight.distance=spot.kind==='main'?25:16;interiorLight.position.set(spot.x,spot.kind==='main'?4.5:3,spot.centerZ+.8)
        altarLight.visible=room.indoor;altarLight.intensity=spot.kind==='main'?45:18;altarLight.distance=Math.max(12,spot.depth+6)
        altarLight.position.set(spot.x,Math.min(spot.architecture.height||3,4.8),spot.centerZ+1)
        altarLight.target.position.set(spot.x,1.6,spot.centerZ-spot.depth/2+1.3)
        resize();reportView()
        // Màn chuyển nhẹ đánh dấu bước qua cửa, sau đó trả ngay quyền nhìn/đi trong cảnh.
        transition.textContent=(room.indoor?'Bước vào ':'Dừng chân tại ')+spot.ten
        transition.classList.remove('is-changing');void transition.offsetWidth;transition.classList.add('is-changing')
        clearTimeout(transitionTimer);transitionTimer=setTimeout(()=>transition.classList.remove('is-changing'),800)
        if(instant)placeLocalCamera(true,1)
      }
      function leaveArea() {
        if(!room)return
        props.current.onMove?.();suppressedEntry=room.id;room=null;world.avatar.visible=perspective==='third';interiorLight.visible=false;altarLight.visible=false;follow=perspective==='third'
        if(perspective==='third'){controls.target.copy(world.avatar.position).add(new THREE.Vector3(0,.9,0));camera.position.copy(controls.target).add(new THREE.Vector3(8,7,12));camera.fov=47}
        controls.enabled=perspective==='third';resize();if(controls.enabled)controls.update();reportView()
      }
      function placeLocalCamera(instant,blend) {
        if(perspective==='first'){
          const eye=world.avatar.position.clone().add(new THREE.Vector3(0,props.current.meditating?1.05:currentPose==='bowing'?1.3-currentBowAmount*.9:1.65,0)),rotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch-(currentPose==='bowing'&&!reduced?currentBowAmount*.55:0),yaw,0,'YXZ'))
          if(instant){camera.position.copy(eye);camera.quaternion.copy(rotation)}else {camera.position.lerp(eye,blend);camera.quaternion.slerp(rotation,blend)}
          camera.fov=instant?interiorFov:THREE.MathUtils.lerp(camera.fov,interiorFov,blend)
        }else {
          const focusHeight=currentPose==='standing'?1.5:1.1,pose=thirdPersonPose(world.avatar.position,room,{yaw,elevation:thirdElevation,distance:thirdDistance,aspect:camera.aspect,focusHeight})
          const next=instant?pose.position:thirdPersonCameraStep(camera.position,pose.position,world.avatar.position,room,blend,{focusHeight})
          camera.position.set(next.x,next.y,next.z)
          camera.lookAt(pose.target.x,pose.target.y,pose.target.z);camera.fov=instant?pose.fov:THREE.MathUtils.lerp(camera.fov,pose.fov,blend)
        }
        camera.updateProjectionMatrix()
      }
      function togglePerspective(){
        perspective=perspective==='third'?'first':'third';world.avatar.visible=perspective==='third'
        if(perspective==='first'){if(room)yaw=Math.atan2(world.avatar.position.x-room.x,world.avatar.position.z-(room.centerZ-room.depth/2+1.5));pitch=room?.kind==='main'?.1:.04;placeLocalCamera(true,1)}
        else if(room)placeLocalCamera(true,1)
        else {controls.target.copy(world.avatar.position).add(new THREE.Vector3(0,.9,0));camera.position.copy(controls.target).add(new THREE.Vector3(0,6,12));camera.fov=47;follow=true;controls.update()}
        controls.enabled=!room&&perspective==='third';resize();reportView()
      }
      const roomContains=point=>room&&Math.abs(point.x-room.x)<(room.indoor?room.width/2-.08:6)&&Math.abs(point.z-room.centerZ)<(room.indoor?room.depth/2+.1:6)
      function setPath(to,spot=null,action=null) {
        const next=findWorldPath(world.avatar.position,to)
        if(!next.length){props.current.onStatus?.({moving,message:'Điểm này có vật cản. Bạn chọn một lối đi hoặc một khu trên bản đồ nhé.'});return}
        props.current.onMove?.()
        if(room&&(!roomContains(to)||(spot&&spot.id!==room.id)))leaveArea()
        path=next;pending=spot?{spot,action}:null;moving=true;follow=!room
        world.marker.position.set(to.x,groundHeight(to.x,to.z)+.05,to.z);world.marker.visible=true
        world.pathLine.geometry.dispose();world.pathLine.geometry=new THREE.BufferGeometry().setFromPoints([world.avatar.position.clone(),...next.map(p=>new THREE.Vector3(p.x,groundHeight(p.x,p.z)+.06,p.z))])
        props.current.onStatus?.({moving:true,destination:spot?.ten||'Lối đi',position:{x:world.avatar.position.x,z:world.avatar.position.z}})
      }
      const goTo=(id,action)=>{const spot=WORLD_SPOTS.find(s=>s.id===id);if(spot){world.interiors.find(i=>i.spot.id===id)?.ensure();setPath(spot,spot,action)}}
      api.current={
        goTo,togglePerspective,preparePose(){
          path=[];pending=null;moving=false;world.marker.visible=false
          if(room?.indoor){const a=world.avatar.position,angle=Math.atan2(room.x-a.x,room.centerZ-room.depth/2+1.5-a.z);world.avatar.rotation.y=angle;yaw=angle-Math.PI+(perspective==='third'?.22:0)}
          else if(perspective==='third'){controls.target.copy(world.avatar.position).add(new THREE.Vector3(0,.8,0));camera.position.copy(controls.target).add(new THREE.Vector3(4,5,7));follow=false;controls.update()}
          reportView()
        },bell(){bellAt=time},
        exit(){const old=room;if(!old)return;leaveArea();setPath({x:old.x,z:old.centerZ+old.depth/2+1.3})},
        zoom(delta){if(room||perspective==='first'){if(perspective==='first')interiorFov=THREE.MathUtils.clamp(interiorFov+delta*1.4,42,82);else thirdDistance=THREE.MathUtils.clamp(thirdDistance+delta*.2,2.8,10);return}const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()+delta,7,240));camera.position.copy(controls.target).add(offset);follow=false},
        reset(){props.current.onMove?.();perspective='third';world.avatar.visible=true;leaveArea();follow=false;camera.fov=47;camera.position.set(43,47,60).normalize().multiplyScalar(Math.max(96,100/camera.aspect));controls.target.set(0,0,1);resize();controls.enabled=true;controls.update();reportView()},
      }
      controls.addEventListener('start',()=>{follow=false})
      let press=null,lastAim=0,lastDrag=0;const activePointers=new Map();let pinchDistance=null
      const pick=e=>{
        const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1)
        ray.setFromCamera(pointer,camera)
        const hits=ray.intersectObjects(world.targets.map(t=>t.object),false)
        if(hits.length){const target=world.targets.find(t=>t.object===hits[0].object);if(target.spot.id!==room?.id)return {spot:target.spot,point:{x:target.spot.x,z:target.spot.z}}}
        if(pickTempleGround(ray.ray,hit))return {spot:null,point:{x:hit.x,z:hit.z}}
        return null
      }
      const aim=e=>{
        const result=pick(e),valid=result&&isWalkable(result.point.x,result.point.z)
        renderer.domElement.style.cursor=e.pointerType==='mouse'&&e.buttons===1?'grabbing':valid?'pointer':'not-allowed'
        renderer.domElement.title=result?.spot?.ten||(room?'Chuột phải để đi · Giữ chuột trái để nhìn quanh':'Chuột phải để đi · Giữ chuột trái để xoay')
        world.hoverMarker.visible=!!valid&&e.pointerType!=='touch';if(valid)world.hoverMarker.position.set(result.point.x,groundHeight(result.point.x,result.point.z)+.05,result.point.z)
        return valid?result:null
      }
      const navigate=result=>{if(!result||props.current.paused)return;if(result.spot)goTo(result.spot.id);else setPath(result.point)}
      const down=e=>{
        activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(activePointers.size===2){const [a,b]=[...activePointers.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y)}press={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,pointer:e.pointerId,button:e.button,dragged:activePointers.size>1}
        if(room||perspective==='first'||isTempleNavigateClick(e))renderer.domElement.setPointerCapture(e.pointerId)
      }
      const move=e=>{
        if(props.current.paused)return
        if(activePointers.has(e.pointerId))activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY})
        if((room||perspective==='first')&&e.pointerType==='touch'&&activePointers.size===2){const [a,b]=[...activePointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance>0&&distance>0){if(perspective==='first')interiorFov=THREE.MathUtils.clamp(interiorFov*pinchDistance/distance,42,82);else thirdDistance=THREE.MathUtils.clamp(thirdDistance*pinchDistance/distance,2.8,10);}pinchDistance=distance;if(press)press.dragged=true;return}
        if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>7)press.dragged=true
        if((room||perspective==='first')&&press&&activePointers.size===1&&isTempleLookDrag(e)){
          yaw-=(e.clientX-press.lastX)*.0045;if(perspective==='first')pitch=THREE.MathUtils.clamp(pitch-(e.clientY-press.lastY)*.003,-.7,.8);else thirdElevation=THREE.MathUtils.clamp(thirdElevation+(e.clientY-press.lastY)*.003,.03,.7);press.lastX=e.clientX;press.lastY=e.clientY;return
        }
        const now=performance.now();if(now-lastAim<45)return;lastAim=now;const target=aim(e)
        if(isTempleNavigateDrag(e)&&press?.dragged&&now-lastDrag>220){lastDrag=now;navigate(target)}
      }
      const up=e=>{activePointers.delete(e.pointerId);pinchDistance=null;if(!press||press.dragged||e.pointerId!==press.pointer||e.button!==press.button||props.current.paused||!isTempleNavigateClick(e)){press=null;return}press=null;navigate(aim(e))}
      const cancel=()=>{press=null;pinchDistance=null;activePointers.clear();world.hoverMarker.visible=false}
      const leave=()=>{world.hoverMarker.visible=false}
      const context=e=>e.preventDefault()
      const wheel=e=>{if(room||perspective==='first'){e.preventDefault();if(perspective==='first')interiorFov=THREE.MathUtils.clamp(interiorFov+e.deltaY*.035,42,82);else thirdDistance=THREE.MathUtils.clamp(thirdDistance+e.deltaY*.01,2.8,10)}}
      renderer.domElement.addEventListener('pointerdown',down,true);renderer.domElement.addEventListener('pointermove',move,true);renderer.domElement.addEventListener('pointerup',up,true)
      renderer.domElement.addEventListener('pointercancel',cancel);renderer.domElement.addEventListener('pointerleave',leave);renderer.domElement.addEventListener('contextmenu',context);renderer.domElement.addEventListener('wheel',wheel,{passive:false})
      const lost=e=>{e.preventDefault();contextLost=true;setFailed(true);props.current.onError?.()};renderer.domElement.addEventListener('webglcontextlost',lost)
      observer=new ResizeObserver(resize);observer.observe(container);resize()
      function animate(now) {
        if(disposed)return
        frame=requestAnimationFrame(animate)
        if(document.hidden||contextLost){lastRender=now;frameStatsAt=now;frameStatsFrames=0;return}
        const p=props.current;controls.enabled=!p.paused&&!room&&perspective==='third'
        if(p.paused){lastRender=now;frameStatsAt=now;frameStatsFrames=0;return}
        if(p.quality!==lastQuality){renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,p.quality==='low'?1:1.5));renderer.shadowMap.enabled=p.quality!=='low';resize();lastQuality=p.quality}
        if(p.quality==='low'&&now-lastRender<32)return
        const elapsed=Math.min(1,(now-lastRender)/1000||.016),dt=Math.min(.1,elapsed);lastRender=now;time+=dt
        const avatar=world.avatar
        if(path.length){
          let budget=5.8*elapsed
          while(path.length&&budget>0){const next=path[0],dx=next.x-avatar.position.x,dz=next.z-avatar.position.z,d=Math.hypot(dx,dz);if(d>.001)avatar.rotation.y=Math.atan2(dx,dz);if(d<=budget){avatar.position.x=next.x;avatar.position.z=next.z;budget-=d;path.shift()}else{avatar.position.x+=dx/d*budget;avatar.position.z+=dz/d*budget;budget=0}}
          avatar.position.y=groundHeight(avatar.position.x,avatar.position.z)
          if(!path.length){moving=false;world.marker.visible=false;world.pathLine.geometry.dispose();world.pathLine.geometry=new THREE.BufferGeometry();if(pending){enterArea(pending.spot,!!pending.action);p.onArrive?.(pending.spot,pending.action);pending=null}}
        }
        // Bấm nền đi qua cửa cũng vào điện, không bắt buộc chọn nút địa điểm.
        if((!room||!room.indoor)&&!moving){const entered=WORLD_SPOTS.find(s=>INDOOR_KINDS.has(s.kind)&&Math.abs(avatar.position.x-s.x)<s.width/2-.4&&Math.abs(avatar.position.z-s.centerZ)<s.depth/2-.5);if(!entered)suppressedEntry=null;if(entered&&entered.id!==suppressedEntry)enterArea(entered)}
        const gait=moving&&!reduced?Math.sin(time*12)*.45:0
        world.legs[0].rotation.x=gait;world.legs[1].rotation.x=-gait;world.arms[0].rotation.x=-gait*.6;world.arms[1].rotation.x=gait*.6
        const showingRitual=!!p.ritual&&!moving&&!p.meditating&&!p.bowing
        currentBowProgress=p.bowing?THREE.MathUtils.clamp((Date.now()-p.bowing.at)/BOW_DURATION,0,1):showingRitual?THREE.MathUtils.clamp((Date.now()-p.ritual)/2800,0,1)/3:0
        currentPose=templePose({moving,bowing:p.bowing,meditating:p.meditating,ritual:showingRitual})
        currentBowAmount=world.bowRig.apply(reduced?0:currentBowProgress)
        world.standing.visible=currentPose==='standing';world.seated.visible=currentPose==='meditating';world.praying.visible=currentPose==='bowing'
        container.dataset.detailedVisitor=world.detailedVisitors.updateSelf({appearance:p.appearance,pose:currentPose,moving,progress:currentBowProgress,time,dt,reduced})
        container.dataset.appearance=world.detailedVisitors.appearance||p.appearance
        world.beacon.position.y=2.4+(reduced?0:Math.sin(time*2)*.1)
        world.avatar.visible=perspective==='third';world.beacon.visible=!room&&perspective==='third'&&currentPose==='standing';if(perspective==='first')world.avatar.rotation.y=yaw+Math.PI
        if(room||perspective==='first'){
          placeLocalCamera(false,reduced?1:1-Math.exp(-dt*7))
        } else if(follow){
          const dest=new THREE.Vector3(avatar.position.x,.9,avatar.position.z),delta=dest.sub(controls.target).multiplyScalar(1-Math.exp(-dt*3));camera.position.add(delta);controls.target.add(delta)
          const offset=camera.position.clone().sub(controls.target),spherical=new THREE.Spherical().setFromVector3(offset);spherical.radius=THREE.MathUtils.lerp(spherical.radius,19,1-Math.exp(-dt*1.2));spherical.phi=THREE.MathUtils.lerp(spherical.phi,1.1,1-Math.exp(-dt*1.2));offset.setFromSpherical(spherical);camera.position.copy(controls.target).add(offset)
        }
        for(const tip of world.animated.incenseTips){const lit=!!p.litIds?.has(tip.id);if(lit!==tip.lit){tip.lit=lit;tip.material.color.setHex(lit?0xff9a4c:0x563a2d);tip.material.emissiveIntensity=lit?.3:0}}
        world.incense.update(p.litIds,room?.indoor?room.id:null,time,{reduced,quality:p.quality})
        for(const ripple of world.animated.ripples){const phase=((reduced?0:time*.18)+ripple.phase)%1;ripple.mesh.scale.setScalar(.5+phase*2);ripple.mesh.material.opacity=(1-phase)*.18}
        world.atmosphere.update(time,{reduced,quality:p.quality})
        for(const b of world.animated.bells)b.mesh.rotation[b.axis||'z']=templeBellAngle(time-bellAt,{reduced})
        const actorHead=new THREE.Vector3(avatar.position.x,avatar.position.y+1.2,avatar.position.z),viewRay=new THREE.Ray(camera.position,actorHead.clone().sub(camera.position).normalize()),actorDistance=camera.position.distanceTo(actorHead),roofHit=new THREE.Vector3()
        for(const roof of world.animated.roofs){const activeRoom=room&&Math.abs(room.x-roof.x)<.1&&Math.abs(room.centerZ-roof.z)<.1;const inside=Math.abs(avatar.position.x-roof.x)<roof.w/2&&Math.abs(avatar.position.z-roof.z)<roof.d/2;roof.bounds??=new THREE.Box3().setFromObject(roof.mesh);const obstruction=!room&&viewRay.intersectBox(roof.bounds,roofHit);roof.mesh.visible=activeRoom||!(inside||(obstruction&&camera.position.distanceTo(roofHit)<actorDistance-.4))}
        // Nội thất nằm sau mái và vách: chỉ dựng điện đang ở hoặc các điện gần nhân vật.
        for(const interior of world.interiors){
          const visible=room?interior.spot.id===room.id:Math.hypot(avatar.position.x-interior.spot.x,avatar.position.z-interior.spot.centerZ)<13
          if(visible)interior.ensure();interior.mesh.visible=visible
        }
        for(const shell of world.shells){const inside=room?.id===shell.id;shell.fallback.visible=!shell.anchor.userData.loaded||inside;shell.anchor.visible=!!shell.anchor.userData.loaded&&!inside}
        container.dataset.modelShells=world.shells.filter(s=>s.anchor.userData.loaded).length
        container.dataset.visitors=visitors.update(p.peers||[],room?.indoor?room.id:'courtyard',avatar.position,dt,time,reduced)
        container.dataset.detailedPeers=world.detailedVisitors.remoteCount
        for(const porch of world.porchItems)porch.mesh.visible=porch.id!==room?.id
        container.dataset.pose=currentPose;container.dataset.peerPoses=(p.peers||[]).map(peer=>peer.pose||'standing').join(',');container.dataset.peerAppearances=(p.peers||[]).map(peer=>peer.appearance||'male').join(',');container.dataset.bowProgress=currentBowProgress.toFixed(2)
        container.dataset.perspective=perspective;container.dataset.selfVisible=world.avatar.visible
        if(!room&&perspective==='third')controls.update();renderer.render(scene,camera)
        if(import.meta.env.DEV){
          container.dataset.drawCalls=renderer.info.render.calls;container.dataset.triangles=renderer.info.render.triangles;container.dataset.shadows=renderer.shadowMap.enabled;container.dataset.geometries=renderer.info.memory.geometries;container.dataset.textures=renderer.info.memory.textures
          if(!frameStatsAt)frameStatsAt=now
          frameStatsFrames++
          if(now-frameStatsAt>=1000){container.dataset.fps=(frameStatsFrames*1000/(now-frameStatsAt)).toFixed(1);container.dataset.frameMs=((now-frameStatsAt)/frameStatsFrames).toFixed(1);frameStatsAt=now;frameStatsFrames=0}
        }
        if(now-statusAt>220){statusAt=now;p.onPresence?.({x:Math.round(avatar.position.x*100)/100,z:Math.round(avatar.position.z*100)/100,yaw:perspective==='first'?Math.atan2(Math.sin(yaw+Math.PI),Math.cos(yaw+Math.PI)):avatar.rotation.y,space:room?.indoor?room.id:'courtyard',moving,pose:currentPose,bowProgress:Math.round(currentBowProgress*100)/100});p.onStatus?.({moving,pose:currentPose,bowProgress:currentBowProgress,near:room||nearestSpot(avatar.position.x,avatar.position.z,4),position:{x:avatar.position.x,z:avatar.position.z}})}
      }
      frame=requestAnimationFrame(animate);reportView();props.current.onReady?.()
      return ()=>{
        disposed=true;cancelAnimationFrame(frame);clearTimeout(transitionTimer);observer.disconnect();controls.dispose();api.current=null
        for(const [type,fn,capture] of [['pointerdown',down,true],['pointermove',move,true],['pointerup',up,true],['pointercancel',cancel],['pointerleave',leave],['contextmenu',context],['wheel',wheel],['webglcontextlost',lost]])renderer.domElement.removeEventListener(type,fn,!!capture)
        visitors?.dispose();world.dispose();environment?.dispose();skyBackground?.dispose();renderer.dispose();renderer.domElement.remove();transition.remove()
      }
    } catch(error){disposed=true;cancelAnimationFrame(frame);clearTimeout(transitionTimer);observer?.disconnect();controls?.dispose();visitors?.dispose();world?.dispose();environment?.dispose();skyBackground?.dispose();renderer?.dispose();renderer?.domElement.remove();api.current=null;setFailed(true);props.current.onError?.();console.error('Không khởi tạo được cảnh chùa 3D:',error)}
  },[])
  return <div ref={host} className="tw-canvas" role={failed?undefined:'img'} aria-label="Khuôn viên Chùa Tam Sở 3D. Chuột phải để đi; giữ chuột trái để nhìn quanh. Mặc định góc nhìn thứ ba; dùng nút Góc 3/Góc 1 để đổi góc nhìn.">{failed&&<div className="tw-webgl-error"><h2>Thiết bị chưa mở được cảnh 3D</h2><p>Bạn vẫn có thể đi chùa bằng giao diện ảnh với đầy đủ các khu và nghi thức.</p><a href="?view=classic">Mở không gian ảnh</a></div>}</div>
})
export default TempleWorld
