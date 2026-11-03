import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const BIRDS=7,CLOUDS=6,TAU=Math.PI*2

// Procedural geometry and a local alpha texture: no downloaded assets or audio.
export function createTempleAtmosphere(parent) {
  const root=new THREE.Group();root.name='Temple sky atmosphere';parent.add(root)
  const parts=[]
  function colored(geometry,color){
    const g=geometry.index?geometry.toNonIndexed():geometry
    if(g!==geometry)geometry.dispose()
    const c=new THREE.Color(color),colors=new Float32Array(g.attributes.position.count*3)
    for(let i=0;i<colors.length;i+=3){colors[i]=c.r;colors[i+1]=c.g;colors[i+2]=c.b}
    g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));parts.push(g)
  }
  colored(new THREE.SphereGeometry(.055,10,6).scale(1,.88,2.1),0x65695f)
  colored(new THREE.SphereGeometry(.037,8,6).translate(0,.028,.112),0x505b52)
  colored(new THREE.ConeGeometry(.014,.038,6).rotateX(Math.PI/2).translate(0,.025,.159),0x8a7c61)
  const tail=new THREE.BufferGeometry()
  tail.setAttribute('position',new THREE.Float32BufferAttribute([-.035,0,-.09,.035,0,-.09,-.055,0,-.19,.035,0,-.09,.055,0,-.19,-.055,0,-.19],3))
  tail.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(12),2));tail.computeVertexNormals();colored(tail,0x4d574d)
  const bodyGeometry=mergeGeometries(parts,false);parts.forEach(g=>g.dispose())

  const outline=[[.035,.065],[.13,.085],[.22,.045],[.30,-.025],[.25,-.085],[.15,-.09],[.045,-.06]]
  const wingGeometry=new THREE.BufferGeometry(),vertices=[.13,0,-.005],indices=[],colors=[]
  for(const [x,z]of outline)vertices.push(x,Math.sin(x*8)*.012,z)
  for(let i=0;i<outline.length;i++)indices.push(0,1+i,1+(i+1)%outline.length)
  wingGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));wingGeometry.setIndex(indices);wingGeometry.computeVertexNormals()
  const wingColor=new THREE.Color(0x687265)
  for(let i=0;i<vertices.length;i+=3)colors.push(wingColor.r,wingColor.g,wingColor.b)
  wingGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
  const leftGeometry=wingGeometry.clone().scale(-1,1,1)
  for(let i=0;i<leftGeometry.index.count;i+=3){const a=leftGeometry.index.getX(i+1);leftGeometry.index.setX(i+1,leftGeometry.index.getX(i+2));leftGeometry.index.setX(i+2,a)}
  leftGeometry.computeVertexNormals()
  const birdMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide,fog:true})
  const bodies=new THREE.InstancedMesh(bodyGeometry,birdMaterial,BIRDS),rightWings=new THREE.InstancedMesh(wingGeometry,birdMaterial,BIRDS),leftWings=new THREE.InstancedMesh(leftGeometry,birdMaterial,BIRDS)
  for(const [mesh,name]of [[bodies,'Sky bird bodies'],[rightWings,'Sky bird right wings'],[leftWings,'Sky bird left wings']]){
    mesh.name=name;mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);root.add(mesh)
  }

  const width=128,height=64,pixels=new Uint8Array(width*height*4)
  const lobes=[[-.61,-.08,.26,.43,.75],[-.28,.13,.34,.55,1],[.08,-.04,.38,.52,1.1],[.40,.10,.30,.43,.85],[.67,-.1,.24,.30,.45]]
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const u=x/(width-1)*2-1,v=y/(height-1)*2-1
    let density=0
    for(const [cx,cy,rx,ry,weight]of lobes)density+=weight*Math.exp(-2*((u-cx)**2/rx**2+(v-cy)**2/ry**2))
    const edge=(1-THREE.MathUtils.smoothstep(Math.abs(u),.76,1))*(1-THREE.MathUtils.smoothstep(Math.abs(v),.72,1)),i=(y*width+x)*4
    pixels[i]=pixels[i+1]=pixels[i+2]=255;pixels[i+3]=Math.round((1-Math.exp(-density))*.88*edge*255)
  }
  const cloudTexture=new THREE.DataTexture(pixels,width,height,THREE.RGBAFormat)
  cloudTexture.name='Local soft cloud alpha';cloudTexture.colorSpace=THREE.SRGBColorSpace;cloudTexture.magFilter=THREE.LinearFilter;cloudTexture.minFilter=THREE.LinearMipmapLinearFilter;cloudTexture.generateMipmaps=true;cloudTexture.needsUpdate=true
  // Sky clouds retain their own gentle alpha beyond the ground-haze distance.
  const cloudMaterial=new THREE.SpriteMaterial({map:cloudTexture,color:0xffffff,transparent:true,opacity:.72,depthTest:true,depthWrite:false,fog:false,toneMapped:false})
  const clouds=Array.from({length:CLOUDS},(_,i)=>{
    const sprite=new THREE.Sprite(cloudMaterial);sprite.name='Sky cloud '+(i+1);sprite.scale.set(75+(i%3)*15,18+(i%2)*4,1);root.add(sprite);return sprite
  })
  const actor=new THREE.Object3D(),local=new THREE.Matrix4(),matrix=new THREE.Matrix4()
  const phase=(time,rate)=>(time%(TAU/rate))*rate
  const triangleCount=g=>(g.index?.count||g.attributes.position.count)/3
  let mipPixels=0,mipWidth=width,mipHeight=height
  for(;;){mipPixels+=mipWidth*mipHeight;if(mipWidth===1&&mipHeight===1)break;mipWidth=Math.max(1,mipWidth>>1);mipHeight=Math.max(1,mipHeight>>1)}
  const geometryBytes=[bodyGeometry,wingGeometry,leftGeometry].reduce((n,g)=>n+Object.values(g.attributes).reduce((sum,a)=>sum+a.array.byteLength,0)+(g.index?.array.byteLength||0),0)
  root.userData.resourceBudget={geometries:3,sharedSpriteGeometry:1,materials:2,textures:1,textureWidth:width,textureHeight:height,textureBaseBytes:pixels.byteLength,textureMipBytes:mipPixels*4,geometryBytes,instanceMatrixBytes:BIRDS*16*4*3,birdDrawCalls:3,standardDrawCalls:3+CLOUDS,lowDrawCalls:6,standardTriangles:(triangleCount(bodyGeometry)+triangleCount(wingGeometry)*2)*BIRDS+CLOUDS*2,lowTriangles:(triangleCount(bodyGeometry)+triangleCount(wingGeometry)*2)*3+6}
  const formation=[[-.15,.12,0],[.85,-.55,.28],[-1.3,-.92,-.14],[1.85,-1.5,.12],[-.65,-2,-.22],[.5,-2.65,.32],[-2.1,-1.78,.08]]
  let disposed=false
  function update(time,{reduced=false,quality='standard'}={}){
    if(disposed)return
    const t=reduced||!Number.isFinite(time)?0:time,low=quality==='low',birdCount=low?3:BIRDS,cloudCount=low?3:CLOUDS
    bodies.count=leftWings.count=rightWings.count=birdCount
    root.userData.activeBirds=birdCount;root.userData.activeClouds=cloudCount
    const orbit=phase(t,.14)+2.8,yaw=Math.atan2(29*Math.cos(orbit),-21*Math.sin(orbit)),bank=-.055+Math.sin(phase(t,.18))*.025
    const centerX=Math.sin(orbit)*29,centerZ=Math.cos(orbit)*21-3,altitude=14+Math.sin(phase(t,.22))*.7
    for(let i=0;i<BIRDS;i++){
      const [baseX,baseZ,lift]=formation[i],dx=baseX+Math.sin(phase(t,.35)+i*.8)*.13,dz=baseZ+Math.sin(phase(t,.28)+i*.4)*.14
      actor.position.set(centerX+Math.cos(yaw)*dx+Math.sin(yaw)*dz,altitude+lift+Math.sin(phase(t,.65)+i*.4)*.13,centerZ-Math.sin(yaw)*dx+Math.cos(yaw)*dz)
      actor.rotation.set(Math.sin(phase(t,8.8)+i*.65)*.018,yaw+Math.sin(phase(t,.31)+i*.6)*.018,bank,'YXZ');actor.updateMatrix();bodies.setMatrixAt(i,actor.matrix)
      const flap=.12+Math.sin(phase(t,8.8)+i*.65)*(.23+.34*Math.max(0,Math.sin(phase(t,.9)+i*.3)))
      local.makeRotationZ(flap).setPosition(0,.008,0);matrix.multiplyMatrices(actor.matrix,local);rightWings.setMatrixAt(i,matrix)
      local.makeRotationZ(-flap).setPosition(0,.008,0);matrix.multiplyMatrices(actor.matrix,local);leftWings.setMatrixAt(i,matrix)
    }
    for(const mesh of [bodies,rightWings,leftWings])mesh.instanceMatrix.needsUpdate=true
    for(let i=0;i<CLOUDS;i++){
      const angle=i*TAU/CLOUDS+.3,cloud=clouds[i]
      cloud.visible=!low||i%2===0
      cloud.position.set(Math.cos(angle)*260+Math.sin(phase(t,.008)+i*.6)*8,70+(i%3)*7+Math.sin(phase(t,.006)+i)*.4,Math.sin(angle)*260-6+Math.cos(phase(t,.006)+i)*3)
    }
  }
  update(0)
  return {root,update,dispose(){
    if(disposed)return;disposed=true;root.removeFromParent()
    for(const mesh of [bodies,rightWings,leftWings])mesh.dispose()
    for(const geometry of [bodyGeometry,wingGeometry,leftGeometry])geometry.dispose()
    birdMaterial.dispose();cloudMaterial.dispose();cloudTexture.dispose();root.clear()
  }}
}
