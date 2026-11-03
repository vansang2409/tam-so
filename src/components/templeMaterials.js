import * as THREE from 'three'
import { TEMPLE_ARCHITECTURE } from '../data/templeArchitecture.js'
import { drawTempleSprig } from './templeFoliage.js'
// Texture tạo tại máy: gỗ, ngói, đá và gạch có chi tiết bề mặt, không tải tài nguyên ngoài.
export function createTempleMaterials() {
  const textures=[],cache=new Map(),profiles=Object.values(TEMPLE_ARCHITECTURE)
  let seed=7291
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
  function surface(type) {
    const size=512,canvas=document.createElement('canvas');canvas.width=canvas.height=size
    const heightCanvas=canvas.cloneNode(),roughCanvas=canvas.cloneNode()
    const ctx=canvas.getContext('2d'),hc=heightCanvas.getContext('2d'),rc=roughCanvas.getContext('2d')
    const color=ctx.createImageData(size,size),height=hc.createImageData(size,size),rough=rc.createImageData(size,size)
    const grids=[8,16,32,64].map(n=>({n,values:Float32Array.from({length:n*n},()=>random())}))
    // Periodic, smooth noise avoids seams and gives mineral/grain variation at several scales.
    const noise=(x,y,g)=>{const xx=x/size*g.n,yy=y/size*g.n,ix=Math.floor(xx),iy=Math.floor(yy),fx=xx-ix,fy=yy-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),at=(a,b)=>g.values[((b+g.n)%g.n)*g.n+(a+g.n)%g.n];return THREE.MathUtils.lerp(THREE.MathUtils.lerp(at(ix,iy),at(ix+1,iy),u),THREE.MathUtils.lerp(at(ix,iy+1),at(ix+1,iy+1),u),v)}
    const write=(image,i,v)=>{image.data[i]=image.data[i+1]=image.data[i+2]=v;image.data[i+3]=255}
    for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
      const i=(y*size+x)*4,n=grids.reduce((sum,g,k)=>sum+noise(x,y,g)/(2**k),0)/1.875,fine=random()-.5
      let albedo=221+(n-.5)*35+fine*6,elevation=128+(n-.5)*38,matte=220
      if(type==='cloth') {albedo=235+Math.sin(x*Math.PI/2)*3+Math.sin(y*Math.PI/2)*3+fine*4;elevation=128+Math.sin(x*Math.PI/2)*12+Math.sin(y*Math.PI/2)*12;matte=248}
      else if(type==='wood'||type==='bark') {
        const grain=Math.sin(x*(type==='bark'?.38:.65)+Math.sin(y*Math.PI/256)*2+noise(x,y,grids[0])*7)
        albedo=215+(n-.5)*36+grain*9+fine*5;elevation=125+grain*(type==='bark'?34:10);matte=type==='bark'?242:166+grain*18
      } else if(type==='brick'||type==='roof') {
        const h=type==='roof'?64:128,w=type==='roof'?64:256,row=Math.floor(y/h),xx=(x+(row%2)*w/2)%w,yy=y%h
        const edge=Math.min(xx,w-xx,yy,h-yy),bevel=THREE.MathUtils.smoothstep(edge,1,5)
        const variation=Math.sin(Math.floor((x+(row%2)*w/2)/w)*37+row*17)*8
        albedo=THREE.MathUtils.lerp(161,218+variation+(n-.5)*25+fine*5,bevel)
        elevation=THREE.MathUtils.lerp(65,164+(n-.5)*15,bevel);matte=THREE.MathUtils.lerp(245,type==='roof'?211:229,bevel)
      } else if(type==='plaster') {albedo=235+(n-.5)*18+fine*3;elevation=128+(n-.5)*19;matte=242}
      else if(type==='grass') {albedo=181+(n-.5)*65+fine*16;elevation=128+(n-.5)*50;matte=249}
      write(color,i,albedo);write(height,i,elevation);write(rough,i,matte)
    }
    ctx.putImageData(color,0,0);hc.putImageData(height,0,0);rc.putImageData(rough,0,0)
    function texture(image,isColor=false){const t=new THREE.CanvasTexture(image);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=isColor?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=4;textures.push(t);return t}
    return {map:texture(canvas,true),bumpMap:texture(heightCanvas),roughnessMap:texture(roughCanvas)}
  }
  const smokeCanvas=document.createElement('canvas');smokeCanvas.width=smokeCanvas.height=128
  const smokeContext=smokeCanvas.getContext('2d')
  for(let i=0;i<7;i++){const x=50+Math.sin(i*2)*18,y=16+i*14,r=15+i*2,g=smokeContext.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(233,228,211,.3)');g.addColorStop(1,'rgba(233,228,211,0)');smokeContext.fillStyle=g;smokeContext.fillRect(0,0,128,128)}
  const smoke=new THREE.CanvasTexture(smokeCanvas);smoke.colorSpace=THREE.SRGBColorSpace;textures.push(smoke)
  const surfaces=Object.fromEntries(['wood','roof','stone','brick','plaster','bark','grass','cloth'].map(kind=>[kind,surface(kind)]))
  const metals=new Set([0xd4a45d,0xb5914e,0x806c42,0x8b7050,0xd59867])
  const painted=new Set([0x8c3e39,0x49625a,0x8b4d30,0x718d82,0xb89953,0xc2a079,0xc4a45e])
  function material(color,extra={}) {
    const key=JSON.stringify([color,extra]);if(cache.has(key))return cache.get(key)
    const kind=extra.surface||
      ([...profiles.map(p=>p.wall),0xc7bda4].includes(color)?'plaster':[0x79604b].includes(color)?'bark':
      (painted.has(color)||[0x604135,0x764839,...profiles.map(p=>p.wood)].includes(color)?'wood':
        [0x9b4937,0xb96146,...profiles.map(p=>p.roof)].includes(color)?'roof':
          [0x8e483b,0x9a765b,0xb88d66].includes(color)?'brick':
            [0xc5b496,0xbfad90,0xd7c5a7,0xd4c4a6].includes(color)?'brick':
            [0xd2c8ae,0xb2ae93,0xb5aaa0,0xdcd8c9].includes(color)?'stone':null))
    const {surface:unused,...rest}=extra
    const maps=surfaces[kind]||{}
    const m=new THREE.MeshStandardMaterial({color,metalness:metals.has(color)?.68:0,roughness:metals.has(color)?.42:kind==='wood'?.82:1,...maps,bumpScale:painted.has(color)?.012:kind==='wood'?.025:kind==='roof'?.065:.035,...rest})
    cache.set(key,m);return m
  }
  const leafCanvas=document.createElement('canvas');leafCanvas.width=leafCanvas.height=256
  drawTempleSprig(leafCanvas.getContext('2d'),256)
  const leafMap=new THREE.CanvasTexture(leafCanvas);leafMap.colorSpace=THREE.SRGBColorSpace;textures.push(leafMap)
  // Preserve small leaves as mipmaps average their alpha at normal courtyard distance.
  const foliage=new THREE.MeshStandardMaterial({map:leafMap,color:0xaebc91,side:THREE.DoubleSide,alphaTest:.22,roughness:1});cache.set('foliage',foliage)
  return {material,smoke,foliage,dispose(){for(const m of cache.values())m.dispose();textures.forEach(t=>t.dispose())}}
}
