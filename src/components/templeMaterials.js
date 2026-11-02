import * as THREE from 'three'
import { TEMPLE_ARCHITECTURE } from '../data/templeArchitecture.js'
// Texture tạo tại máy: gỗ, ngói, đá và gạch có chi tiết bề mặt, không tải tài nguyên ngoài.
export function createTempleMaterials() {
  const textures=[],cache=new Map(),profiles=Object.values(TEMPLE_ARCHITECTURE)
  let seed=7291
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
  function surface(type) {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512
    const c=canvas.getContext('2d');c.fillStyle='#aaa7a0';c.fillRect(0,0,512,512)
    const pixels=c.getImageData(0,0,512,512)
    for(let y=0;y<512;y++)for(let x=0;x<512;x++) {
      const i=(y*512+x)*4,n=random(),grain=type==='wood'?Math.sin(x*.35+Math.sin(y*.014)*3)*12:0
      const v=170+(n-.5)*(type==='stone'?55:35)+grain
      pixels.data[i]=v;pixels.data[i+1]=v;pixels.data[i+2]=v;pixels.data[i+3]=255
    }
    c.putImageData(pixels,0,0)
    if(type==='wood') {
      c.lineWidth=.8
      for(let i=0;i<110;i++){c.strokeStyle=i%3?'#685f5240':'#e0d5c130';c.beginPath();const x=random()*512;for(let y=0;y<=512;y+=8){const xx=x+Math.sin(y*.013+i)*3+Math.sin(y*.04+i)*.8;y?c.lineTo(xx,y):c.moveTo(xx,y)}c.stroke()}
      for(let i=0;i<5;i++){c.strokeStyle='#5d4b3840';c.beginPath();c.ellipse(random()*512,random()*512,3+random()*4,18+random()*22,0,0,Math.PI*2);c.stroke()}
    } else if(type==='brick'||type==='roof') {
      const h=type==='roof'?64:85,w=type==='roof'?64:170
      c.strokeStyle=type==='roof'?'#5c554b':'#736d61';c.lineWidth=type==='roof'?3:5
      for(let y=0;y<=512;y+=h){c.beginPath();c.moveTo(0,y);c.lineTo(512,y);c.stroke();for(let x=-(y/h%2)*w/2;x<512;x+=w){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+h);c.stroke();c.fillStyle='#e0d7c235';c.fillRect(x+4,y+5,w-8,3)}}
    } else {
      for(let i=0;i<400;i++){c.fillStyle=random()>.5?'#534f4425':'#f1eada35';c.beginPath();c.ellipse(random()*512,random()*512,random()*5,random()*3,0,0,Math.PI*2);c.fill()}
      c.strokeStyle='#726e6540';c.lineWidth=2;c.strokeRect(1,1,510,510)
    }
    const map=new THREE.CanvasTexture(canvas);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;textures.push(map)
    const bump=map.clone();bump.colorSpace=THREE.NoColorSpace;bump.needsUpdate=true;textures.push(bump)
    return {map,bumpMap:bump}
  }
  const smokeCanvas=document.createElement('canvas');smokeCanvas.width=smokeCanvas.height=128
  const smokeContext=smokeCanvas.getContext('2d')
  for(let i=0;i<7;i++){const x=50+Math.sin(i*2)*18,y=16+i*14,r=15+i*2,g=smokeContext.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(233,228,211,.3)');g.addColorStop(1,'rgba(233,228,211,0)');smokeContext.fillStyle=g;smokeContext.fillRect(0,0,128,128)}
  const smoke=new THREE.CanvasTexture(smokeCanvas);smoke.colorSpace=THREE.SRGBColorSpace;textures.push(smoke)
  const wood=surface('wood'),roof=surface('roof'),stone=surface('stone'),brick=surface('brick')
  const painted=new Set([0x8c3e39,0x49625a,0x8b4d30,0x718d82,0xb89953,0xc2a079,0xc4a45e])
  function material(color,extra={}) {
    const key=JSON.stringify([color,extra]);if(cache.has(key))return cache.get(key)
    const kind=extra.surface||
      (painted.has(color)||[0x604135,0x764839,...profiles.map(p=>p.wood)].includes(color)?'wood':
        [0x9b4937,0xb96146,...profiles.map(p=>p.roof)].includes(color)?'roof':
          [0x8e483b,0x9a765b,0xb88d66].includes(color)?'brick':
            [0xc5b496,0xbfad90,0xd7c5a7,0xd4c4a6].includes(color)?'brick':
            [0xd2c8ae,0xb2ae93,0xb5aaa0,0xdcd8c9].includes(color)?'stone':null)
    const {surface:unused,...rest}=extra
    const maps=kind?({wood,roof,stone,brick}[kind]||{}):{}
    const m=new THREE.MeshStandardMaterial({color,roughness:kind==='wood'?.88:.93,...maps,bumpScale:painted.has(color)?.012:kind==='wood'?.045:kind==='roof'?.11:.065,...rest})
    cache.set(key,m);return m
  }
  return {material,smoke,dispose(){for(const m of cache.values())m.dispose();textures.forEach(t=>t.dispose())}}
}
