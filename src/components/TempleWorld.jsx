import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createTempleWorld } from './templeWorldScene.js'
import { WORLD_SPOTS, findWorldPath, nearestSpot, groundHeight } from '../data/templeWorld.js'

const TempleWorld=forwardRef(function TempleWorld({litIds,meditating,paused,quality,onArrive,onStatus,onReady,onError},ref) {
  const host=useRef(null),api=useRef(null),props=useRef({}),[failed,setFailed]=useState(false)
  props.current={litIds,meditating,paused,quality,onArrive,onStatus,onReady,onError}
  useImperativeHandle(ref,()=>({
    goTo(id,action){api.current?.goTo(id,action)},
    reset(){api.current?.reset()},
    zoom(delta){api.current?.zoom(delta)},
    bell(){api.current?.bell()},
  }),[])
  useEffect(()=>{
    const container=host.current
    let renderer,world,controls,observer,frame,disposed=false,contextLost=false
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'})
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,props.current.quality==='low'?1:1.5))
      renderer.outputColorSpace=THREE.SRGBColorSpace
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1
      renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement)
      const scene=new THREE.Scene();scene.background=new THREE.Color(0xdbe3d4);scene.fog=new THREE.Fog(0xdbe3d4,180,400)
      scene.add(new THREE.HemisphereLight(0xfff4da,0x607b68,2.2))
      const sun=new THREE.DirectionalLight(0xffe5bc,2.8);sun.position.set(-25,38,18);scene.add(sun)
      const camera=new THREE.PerspectiveCamera(40,1,.1,500);camera.position.set(43,47,60)
      controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,1)
      controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.075
      controls.minDistance=13;controls.maxDistance=240;controls.minPolarAngle=.28;controls.maxPolarAngle=1.19
      controls.update()
      world=createTempleWorld(scene)
      world.avatar.position.set(0,.07,24.8)
      let path=[],pending=null,moving=false,follow=false,last=0,lastRender=0,time=0,statusAt=0,bellAt=-20,lastQuality='',lastNear=null
      const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3()
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const setPath=(to,spot=null,action=null)=>{
        const next=findWorldPath(world.avatar.position,to)
        if(!next.length){props.current.onStatus?.({message:'Điểm này có vật cản. Bạn chọn một lối đi hoặc một khu trên bản đồ nhé.'});return}
        path=next;pending=spot?{spot,action}:null;moving=true;follow=true
        world.marker.position.set(to.x,.16,to.z);world.marker.visible=true
        world.pathLine.geometry.dispose();world.pathLine.geometry=new THREE.BufferGeometry().setFromPoints([world.avatar.position.clone(),...next.map(p=>new THREE.Vector3(p.x,.17,p.z))])
        props.current.onStatus?.({moving:true,destination:spot?.ten||'Lối đi',position:{x:world.avatar.position.x,z:world.avatar.position.z}})
      }
      const goTo=(id,action)=>{const spot=WORLD_SPOTS.find(s=>s.id===id);if(spot)setPath(spot,spot,action)}
      api.current={goTo,bell(){bellAt=time},zoom(delta){const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()+delta,13,240));camera.position.copy(controls.target).add(offset);follow=false},reset(){follow=false;camera.position.set(43,47,60).normalize().multiplyScalar(Math.max(96,100/camera.aspect));controls.target.set(0,0,1);controls.update()}}
      controls.addEventListener('start',()=>{follow=false})
      let press=null;const activePointers=new Set()
      const down=e=>{activePointers.add(e.pointerId);press={x:e.clientX,y:e.clientY,pointer:e.pointerId,dragged:activePointers.size>1}}
      const move=e=>{if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>7)press.dragged=true}
      const up=e=>{
        activePointers.delete(e.pointerId)
        if(!press||press.dragged||e.pointerId!==press.pointer||props.current.paused||e.button!==0){press=null;return}
        press=null
        const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1)
        ray.setFromCamera(pointer,camera)
        const hits=ray.intersectObjects(world.targets.map(t=>t.object),false)
        if(hits.length){const target=world.targets.find(t=>t.object===hits[0].object);goTo(target.spot.id);return}
        if(ray.ray.intersectPlane(plane,hit))setPath({x:hit.x,z:hit.z})
      }
      const cancel=()=>{press=null;activePointers.clear()}
      renderer.domElement.addEventListener('pointerdown',down)
      renderer.domElement.addEventListener('pointermove',move)
      renderer.domElement.addEventListener('pointerup',up)
      renderer.domElement.addEventListener('pointercancel',cancel)
      const lost=e=>{e.preventDefault();contextLost=true;setFailed(true);props.current.onError?.()}
      renderer.domElement.addEventListener('webglcontextlost',lost)
      let firstResize=true
      const resize=()=>{
        const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return
        camera.aspect=w/h;camera.setViewOffset(w,h,0,h*.08,w,h);camera.updateProjectionMatrix();renderer.setSize(w,h)
        if(firstResize){camera.position.set(43,47,60).normalize().multiplyScalar(Math.max(96,100/camera.aspect));controls.update();firstResize=false}
      }
      observer=new ResizeObserver(resize);observer.observe(container);resize()
      function animate(now) {
        if(disposed)return
        frame=requestAnimationFrame(animate)
        last=now
        if(document.hidden||contextLost){lastRender=now;return}
        const p=props.current
        controls.enabled=!p.paused
        if(p.paused){lastRender=now;return}
        if(p.quality!==lastQuality){renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,p.quality==='low'?1:1.5));resize();lastQuality=p.quality}
        if(p.quality==='low'&&now-lastRender<32)return
        const elapsed=Math.min(1,(now-lastRender)/1000||.016),dt=Math.min(.1,elapsed);lastRender=now
        time+=dt
        const avatar=world.avatar
        if(path.length) {
          let budget=5.8*elapsed
          // Tiêu thụ nhiều đoạn trong cùng frame, không làm chậm nhân vật khi FPS thấp.
          while(path.length&&budget>0) {
            const next=path[0],dx=next.x-avatar.position.x,dz=next.z-avatar.position.z,d=Math.hypot(dx,dz)
            if(d>.001)avatar.rotation.y=Math.atan2(dx,dz)
            if(d<=budget){avatar.position.x=next.x;avatar.position.z=next.z;budget-=d;path.shift()}
            else{avatar.position.x+=dx/d*budget;avatar.position.z+=dz/d*budget;budget=0}
          }
          avatar.position.y=groundHeight(avatar.position.x,avatar.position.z)
          if(!path.length){moving=false;world.marker.visible=false;world.pathLine.geometry.dispose();world.pathLine.geometry=new THREE.BufferGeometry();if(pending){p.onArrive?.(pending.spot,pending.action);pending=null}}
        }
        const gait=moving&&!reduced?Math.sin(time*12)*.45:0
        world.legs[0].rotation.x=gait;world.legs[1].rotation.x=-gait;world.arms[0].rotation.x=-gait*.6;world.arms[1].rotation.x=gait*.6
        world.standing.visible=!p.meditating;world.seated.visible=!!p.meditating
        world.beacon.position.y=2.4+(reduced?0:Math.sin(time*2)*.1)
        if(follow){const dest=new THREE.Vector3(avatar.position.x,0,avatar.position.z),delta=dest.sub(controls.target).multiplyScalar(1-Math.exp(-dt*3));camera.position.add(delta);controls.target.add(delta);const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.lerp(offset.length(),28,1-Math.exp(-dt*1.2)));camera.position.copy(controls.target).add(offset)}
        for(const smoke of world.animated.smoke){const active=p.litIds?.has(smoke.id);smoke.mesh.material.opacity=active?.2:0;if(active){smoke.mesh.position.y=smoke.y+(time*.2+smoke.phase)%1.1;smoke.mesh.position.x=Math.sin(time+smoke.phase)*.07;smoke.mesh.scale.setScalar(.8+(time*.2+smoke.phase)%1.1)}}
        for(const b of world.animated.bells)b.mesh.rotation.z=Math.exp(-(time-bellAt)*1.6)*Math.sin((time-bellAt)*14)*.16
        for(const roof of world.animated.roofs){const inside=Math.abs(avatar.position.x-roof.x)<roof.w/2&&Math.abs(avatar.position.z-roof.z)<roof.d/2;roof.mesh.visible=!inside}
        controls.update();renderer.render(scene,camera)
        if(import.meta.env.DEV){container.dataset.drawCalls=renderer.info.render.calls;container.dataset.triangles=renderer.info.render.triangles;container.dataset.frame=now.toFixed(0)}
        if(now-statusAt>220){statusAt=now;const near=nearestSpot(avatar.position.x,avatar.position.z,4);if(near?.id!==lastNear){lastNear=near?.id||null}p.onStatus?.({moving,near:near||null,position:{x:avatar.position.x,z:avatar.position.z}})}
      }
      frame=requestAnimationFrame(animate);props.current.onReady?.()
      return ()=>{
        disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();api.current=null
        for(const [type,fn]of [['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',cancel],['webglcontextlost',lost]])renderer.domElement.removeEventListener(type,fn)
        world.dispose();renderer.dispose();renderer.domElement.remove()
      }
    } catch(error) {
      disposed=true;cancelAnimationFrame(frame);observer?.disconnect();controls?.dispose();world?.dispose();renderer?.dispose();renderer?.domElement.remove();api.current=null
      setFailed(true);props.current.onError?.();console.error('Không khởi tạo được cảnh chùa 3D:',error)
    }
  },[])
  return <div ref={host} className="tw-canvas" role={failed?undefined:"img"} aria-label="Khuôn viên Chùa Tam Sở 3D, đủ 23 khu liên thông. Chạm lối đi để di chuyển, kéo để xoay. Các nút địa điểm bên cạnh hỗ trợ bàn phím.">{failed&&<div className="tw-webgl-error"><h2>Thiết bị chưa mở được cảnh 3D</h2><p>Bạn vẫn có thể đi chùa bằng giao diện ảnh với đầy đủ các khu và nghi thức.</p><a href="?view=classic">Mở không gian ảnh</a></div>}</div>
})
export default TempleWorld
