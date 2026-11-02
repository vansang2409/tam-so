import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createTempleWorld } from './templeWorldScene.js'
import { WORLD_SPOTS, findWorldPath, nearestSpot, groundHeight, isWalkable } from '../data/templeWorld.js'

const INDOOR_KINDS=new Set(['main','hall','house','shrine','tower'])
const TempleWorld=forwardRef(function TempleWorld({litIds,meditating,ritual,paused,quality,onArrive,onStatus,onReady,onError},ref) {
  const host=useRef(null),api=useRef(null),props=useRef({}),[failed,setFailed]=useState(false)
  props.current={litIds,meditating,ritual,paused,quality,onArrive,onStatus,onReady,onError}
  useImperativeHandle(ref,()=>({
    goTo(id,action){api.current?.goTo(id,action)},
    reset(){api.current?.reset()},
    exit(){api.current?.exit()},
    zoom(delta){api.current?.zoom(delta)},
    bell(){api.current?.bell()},
  }),[])
  useEffect(()=>{
    const container=host.current
    let renderer,world,controls,observer,frame,disposed=false,contextLost=false,transitionTimer=null
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'})
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,props.current.quality==='low'?1:1.5))
      renderer.outputColorSpace=THREE.SRGBColorSpace
      renderer.shadowMap.enabled=props.current.quality!=='low';renderer.shadowMap.type=THREE.PCFShadowMap
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1
      renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement)
      const transition=document.createElement('div');transition.className='tw-scene-transition';transition.setAttribute('aria-hidden','true');container.appendChild(transition)
      const scene=new THREE.Scene();scene.background=new THREE.Color(0xcbd2c4);scene.fog=new THREE.Fog(0xcbd2c4,75,230)
      scene.add(new THREE.HemisphereLight(0xe2e7d8,0x53614d,1.5))
      const sun=new THREE.DirectionalLight(0xffe5bc,2.8);sun.position.set(-28,44,25);sun.castShadow=true
      sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38,near:1,far:130});sun.shadow.bias=-.00025;sun.shadow.normalBias=.055;scene.add(sun)
      const interiorLight=new THREE.PointLight(0xffdcad,12,16,2);interiorLight.visible=false;scene.add(interiorLight)
      const camera=new THREE.PerspectiveCamera(47,1,.1,500)
      controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.075
      controls.mouseButtons.LEFT=null;controls.mouseButtons.RIGHT=THREE.MOUSE.ROTATE;controls.mouseButtons.MIDDLE=THREE.MOUSE.DOLLY
      controls.minDistance=7;controls.maxDistance=240;controls.minPolarAngle=.28;controls.maxPolarAngle=1.43
      world=createTempleWorld(scene);world.avatar.position.set(0,.07,24.8)
      let path=[],pending=null,moving=false,follow=false,lastRender=0,time=0,statusAt=0,bellAt=-20,lastQuality='',room=null,suppressedEntry=null,yaw=0,pitch=.13,interiorFov=64
      const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.07),hit=new THREE.Vector3()
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let firstResize=true
      const resize=()=>{
        const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return
        camera.aspect=w/h
        if(room)camera.clearViewOffset();else camera.setViewOffset(w,h,0,h*.08,w,h)
        camera.updateProjectionMatrix();renderer.setSize(w,h)
        if(firstResize){const offset=new THREE.Vector3(10,9,26).normalize().multiplyScalar(Math.max(30,17/camera.aspect));controls.target.set(0,1.1,15);camera.position.copy(controls.target).add(offset);controls.update();firstResize=false}
      }
      const reportView=()=>props.current.onStatus?.({view:room?(room.indoor?'inside':'area'):'outside',roomId:room?.id||null,roomName:room?.ten||null,moving})
      function enterArea(spot,instant=false) {
        if(room?.id===spot.id)return
        room={...spot,indoor:INDOOR_KINDS.has(spot.kind)};yaw=0;pitch=['pond','garden'].includes(spot.kind)?-.3:.13;interiorFov=64
        controls.enabled=false;world.avatar.visible=false
        interiorLight.visible=room.indoor;interiorLight.position.set(spot.x,3,spot.centerZ-.3)
        resize();reportView()
        // Màn chuyển nhẹ đánh dấu bước qua cửa, sau đó trả ngay quyền nhìn/đi trong cảnh.
        transition.textContent=(room.indoor?'Bước vào ':'Dừng chân tại ')+spot.ten
        transition.classList.remove('is-changing');void transition.offsetWidth;transition.classList.add('is-changing')
        clearTimeout(transitionTimer);transitionTimer=setTimeout(()=>transition.classList.remove('is-changing'),800)
        if(instant){camera.position.copy(world.avatar.position).add(new THREE.Vector3(0,1.65,0));camera.rotation.set(pitch,yaw,0,'YXZ');camera.fov=interiorFov;camera.updateProjectionMatrix()}
      }
      function leaveArea() {
        if(!room)return
        suppressedEntry=room.id;room=null;world.avatar.visible=true;interiorLight.visible=false;follow=true
        controls.target.copy(world.avatar.position).add(new THREE.Vector3(0,.9,0));camera.position.copy(controls.target).add(new THREE.Vector3(8,7,12))
        camera.fov=47;controls.enabled=true;resize();controls.update();reportView()
      }
      const roomContains=point=>room&&Math.abs(point.x-room.x)<(room.indoor?room.width/2-.08:6)&&Math.abs(point.z-room.centerZ)<(room.indoor?room.depth/2+.1:6)
      function setPath(to,spot=null,action=null) {
        const next=findWorldPath(world.avatar.position,to)
        if(!next.length){props.current.onStatus?.({moving,message:'Điểm này có vật cản. Bạn chọn một lối đi hoặc một khu trên bản đồ nhé.'});return}
        if(room&&(!roomContains(to)||(spot&&spot.id!==room.id)))leaveArea()
        path=next;pending=spot?{spot,action}:null;moving=true;follow=!room
        world.marker.position.set(to.x,groundHeight(to.x,to.z)+.05,to.z);world.marker.visible=true
        world.pathLine.geometry.dispose();world.pathLine.geometry=new THREE.BufferGeometry().setFromPoints([world.avatar.position.clone(),...next.map(p=>new THREE.Vector3(p.x,groundHeight(p.x,p.z)+.06,p.z))])
        props.current.onStatus?.({moving:true,destination:spot?.ten||'Lối đi',position:{x:world.avatar.position.x,z:world.avatar.position.z}})
      }
      const goTo=(id,action)=>{const spot=WORLD_SPOTS.find(s=>s.id===id);if(spot)setPath(spot,spot,action)}
      api.current={
        goTo,bell(){bellAt=time},
        exit(){const old=room;if(!old)return;leaveArea();setPath({x:old.x,z:old.centerZ+old.depth/2+1.3})},
        zoom(delta){if(room){interiorFov=THREE.MathUtils.clamp(interiorFov+delta*1.4,42,82);return}const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()+delta,7,240));camera.position.copy(controls.target).add(offset);follow=false},
        reset(){leaveArea();follow=false;camera.fov=47;camera.position.set(43,47,60).normalize().multiplyScalar(Math.max(96,100/camera.aspect));controls.target.set(0,0,1);resize();controls.update()},
      }
      controls.addEventListener('start',()=>{follow=false})
      let press=null,lastAim=0,lastDrag=0;const activePointers=new Set()
      const pick=e=>{
        const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1)
        ray.setFromCamera(pointer,camera)
        const hits=ray.intersectObjects(world.targets.map(t=>t.object),false)
        if(hits.length){const target=world.targets.find(t=>t.object===hits[0].object);if(target.spot.id!==room?.id)return {spot:target.spot,point:{x:target.spot.x,z:target.spot.z}}}
        plane.constant=room?-.34:-.07
        if(ray.ray.intersectPlane(plane,hit))return {spot:null,point:{x:hit.x,z:hit.z}}
        return null
      }
      const aim=e=>{
        const result=pick(e),valid=result&&isWalkable(result.point.x,result.point.z)
        renderer.domElement.style.cursor=e.buttons===2?'grabbing':valid?'pointer':'not-allowed'
        renderer.domElement.title=result?.spot?.ten||(room?'Chuột trái để đi · Giữ chuột phải để nhìn quanh':'Chuột trái để đi · Giữ chuột phải để xoay')
        world.hoverMarker.visible=!!valid&&e.pointerType!=='touch';if(valid)world.hoverMarker.position.set(result.point.x,groundHeight(result.point.x,result.point.z)+.05,result.point.z)
        return valid?result:null
      }
      const navigate=result=>{if(!result||props.current.paused)return;if(result.spot)goTo(result.spot.id);else setPath(result.point)}
      const down=e=>{
        activePointers.add(e.pointerId);press={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,pointer:e.pointerId,button:e.button,dragged:activePointers.size>1}
        if(room||(e.pointerType==='mouse'&&e.button===0))renderer.domElement.setPointerCapture(e.pointerId)
      }
      const move=e=>{
        if(props.current.paused)return
        if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>7)press.dragged=true
        if(room&&press&&activePointers.size===1&&(e.buttons===2||e.pointerType==='touch')){
          yaw-=(e.clientX-press.lastX)*.0045;pitch=THREE.MathUtils.clamp(pitch-(e.clientY-press.lastY)*.003,-.7,.8);press.lastX=e.clientX;press.lastY=e.clientY;return
        }
        const now=performance.now();if(now-lastAim<45)return;lastAim=now;const target=aim(e)
        if(e.pointerType==='mouse'&&e.buttons===1&&press?.dragged&&now-lastDrag>220){lastDrag=now;navigate(target)}
      }
      const up=e=>{activePointers.delete(e.pointerId);if(!press||press.dragged||e.pointerId!==press.pointer||props.current.paused||e.button!==0){press=null;return}press=null;navigate(aim(e))}
      const cancel=()=>{press=null;activePointers.clear();world.hoverMarker.visible=false}
      const leave=()=>{world.hoverMarker.visible=false}
      const context=e=>e.preventDefault()
      const wheel=e=>{if(room){e.preventDefault();interiorFov=THREE.MathUtils.clamp(interiorFov+e.deltaY*.035,42,82)}}
      renderer.domElement.addEventListener('pointerdown',down,true);renderer.domElement.addEventListener('pointermove',move,true);renderer.domElement.addEventListener('pointerup',up,true)
      renderer.domElement.addEventListener('pointercancel',cancel);renderer.domElement.addEventListener('pointerleave',leave);renderer.domElement.addEventListener('contextmenu',context);renderer.domElement.addEventListener('wheel',wheel,{passive:false})
      const lost=e=>{e.preventDefault();contextLost=true;setFailed(true);props.current.onError?.()};renderer.domElement.addEventListener('webglcontextlost',lost)
      observer=new ResizeObserver(resize);observer.observe(container);resize()
      function animate(now) {
        if(disposed)return
        frame=requestAnimationFrame(animate)
        if(document.hidden||contextLost){lastRender=now;return}
        const p=props.current;controls.enabled=!p.paused&&!room
        if(p.paused){lastRender=now;return}
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
        const showingRitual=!!p.ritual&&!moving&&!p.meditating
        world.standing.visible=!p.meditating&&!showingRitual;world.seated.visible=!!p.meditating;world.praying.visible=showingRitual
        if(showingRitual){const phase=THREE.MathUtils.clamp((Date.now()-p.ritual)/2800,0,1);world.praying.rotation.x=.1+Math.sin(phase*Math.PI)**2*.4}
        world.beacon.position.y=2.4+(reduced?0:Math.sin(time*2)*.1)
        if(room){
          const blend=reduced?1:1-Math.exp(-dt*7),eye=avatar.position.clone().add(new THREE.Vector3(0,p.meditating?1.05:1.65,0))
          camera.position.lerp(eye,blend);camera.quaternion.slerp(new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ')),blend);camera.fov=THREE.MathUtils.lerp(camera.fov,interiorFov,blend);camera.updateProjectionMatrix()
        } else if(follow){
          const dest=new THREE.Vector3(avatar.position.x,.9,avatar.position.z),delta=dest.sub(controls.target).multiplyScalar(1-Math.exp(-dt*3));camera.position.add(delta);controls.target.add(delta)
          const offset=camera.position.clone().sub(controls.target),spherical=new THREE.Spherical().setFromVector3(offset);spherical.radius=THREE.MathUtils.lerp(spherical.radius,19,1-Math.exp(-dt*1.2));spherical.phi=THREE.MathUtils.lerp(spherical.phi,1.1,1-Math.exp(-dt*1.2));offset.setFromSpherical(spherical);camera.position.copy(controls.target).add(offset)
        }
        for(const smoke of world.animated.smoke){const active=p.litIds?.has(smoke.id);smoke.mesh.visible=!!active;smoke.mesh.material.opacity=active?.45:0;if(active){smoke.mesh.position.y=smoke.y+(time*.2+smoke.phase)%1.1;smoke.mesh.position.x=smoke.x+Math.sin(time+smoke.phase)*.1;const growth=(time*.2+smoke.phase)%1.1;smoke.mesh.scale.set(.3+growth*.25,.45+growth*.5,1)}}
        for(const ripple of world.animated.ripples){const phase=(time*.18+ripple.phase)%1;ripple.mesh.scale.setScalar(.5+phase*2);ripple.mesh.material.opacity=(1-phase)*.18}
        for(const b of world.animated.bells)b.mesh.rotation.z=Math.exp(-(time-bellAt)*1.6)*Math.sin((time-bellAt)*14)*.16
        const actorHead=new THREE.Vector3(avatar.position.x,avatar.position.y+1.2,avatar.position.z),viewRay=new THREE.Ray(camera.position,actorHead.clone().sub(camera.position).normalize()),actorDistance=camera.position.distanceTo(actorHead),roofHit=new THREE.Vector3()
        for(const roof of world.animated.roofs){const activeRoom=room&&Math.abs(room.x-roof.x)<.1&&Math.abs(room.centerZ-roof.z)<.1;const inside=Math.abs(avatar.position.x-roof.x)<roof.w/2&&Math.abs(avatar.position.z-roof.z)<roof.d/2;roof.bounds??=new THREE.Box3().setFromObject(roof.mesh);const obstruction=!room&&viewRay.intersectBox(roof.bounds,roofHit);roof.mesh.visible=activeRoom||!(inside||(obstruction&&camera.position.distanceTo(roofHit)<actorDistance-.4))}
        if(!room)controls.update();renderer.render(scene,camera)
        if(import.meta.env.DEV){container.dataset.drawCalls=renderer.info.render.calls;container.dataset.triangles=renderer.info.render.triangles}
        if(now-statusAt>220){statusAt=now;p.onStatus?.({moving,near:room||nearestSpot(avatar.position.x,avatar.position.z,4),position:{x:avatar.position.x,z:avatar.position.z}})}
      }
      frame=requestAnimationFrame(animate);props.current.onReady?.()
      return ()=>{
        disposed=true;cancelAnimationFrame(frame);clearTimeout(transitionTimer);observer.disconnect();controls.dispose();api.current=null
        for(const [type,fn,capture] of [['pointerdown',down,true],['pointermove',move,true],['pointerup',up,true],['pointercancel',cancel],['pointerleave',leave],['contextmenu',context],['wheel',wheel],['webglcontextlost',lost]])renderer.domElement.removeEventListener(type,fn,!!capture)
        world.dispose();renderer.dispose();renderer.domElement.remove();transition.remove()
      }
    } catch(error){disposed=true;cancelAnimationFrame(frame);clearTimeout(transitionTimer);observer?.disconnect();controls?.dispose();world?.dispose();renderer?.dispose();renderer?.domElement.remove();api.current=null;setFailed(true);props.current.onError?.();console.error('Không khởi tạo được cảnh chùa 3D:',error)}
  },[])
  return <div ref={host} className="tw-canvas" role={failed?undefined:'img'} aria-label="Khuôn viên Chùa Tam Sở 3D. Chuột trái để đi; giữ chuột phải để nhìn quanh. Tới các điện sẽ chuyển sang góc nhìn bên trong.">{failed&&<div className="tw-webgl-error"><h2>Thiết bị chưa mở được cảnh 3D</h2><p>Bạn vẫn có thể đi chùa bằng giao diện ảnh với đầy đủ các khu và nghi thức.</p><a href="?view=classic">Mở không gian ảnh</a></div>}</div>
})
export default TempleWorld
