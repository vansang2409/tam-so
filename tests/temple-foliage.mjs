import assert from 'node:assert/strict'
import * as THREE from 'three'
import {createTempleSprigGeometry,populateTempleSprigs,drawTempleSprig} from '../src/components/templeFoliage.js'

const geometry=createTempleSprigGeometry(),material=new THREE.MeshStandardMaterial()
assert.equal(geometry.index.count/3,6,'Sprigs stay at six triangles per instance')
for(const attribute of Object.values(geometry.attributes))assert.ok([...attribute.array].every(Number.isFinite))
assert.ok(geometry.boundingBox.max.z-geometry.boundingBox.min.z>.025,'Sprigs have actual curvature rather than a flat plane')
const first=populateTempleSprigs(new THREE.InstancedMesh(geometry,material,240))
const second=populateTempleSprigs(new THREE.InstancedMesh(geometry,material,240))
assert.deepEqual(first.instanceMatrix.array,second.instanceMatrix.array,'Reloads keep the same canopy')
assert.deepEqual(first.instanceColor.array,second.instanceColor.array)
assert.equal(first.geometry,second.geometry);assert.equal(first.material,second.material)
assert.ok([...first.instanceMatrix.array,...first.instanceColor.array].every(Number.isFinite))
assert.ok(first.boundingBox.min.y>2&&first.boundingBox.max.y<4.9,'Foliage stays in the existing canopy height')
assert.ok(first.boundingBox.min.x>-2.1&&first.boundingBox.max.x<2.1&&first.boundingBox.min.z>-2.1&&first.boundingBox.max.z<2.1,'Sprigs do not grow across navigation clearances')
const matrix=new THREE.Matrix4(),scale=new THREE.Vector3(),position=new THREE.Vector3(),rotation=new THREE.Quaternion()
for(let i=0;i<first.count;i++){
 first.getMatrixAt(i,matrix);assert.ok(matrix.determinant()>0,'No collapsed or mirrored instances')
 matrix.decompose(position,rotation,scale);assert.ok(scale.x>.5&&scale.y<1.3)
}
let drawnLeaves=0,saves=0
const ctx={save(){saves++},restore(){saves--},scale(){},translate(){},rotate(){},beginPath(){},moveTo(){},bezierCurveTo(){},quadraticCurveTo(){},stroke(){},fill(){drawnLeaves++}}
drawTempleSprig(ctx,256);assert.equal(drawnLeaves,21,'Atlas contains three branching sprays with 21 small leaves');assert.equal(saves,0,'Canvas state is restored')
// Trace the actual filled leaf outlines through Canvas transforms. A leaf count alone
// missed the original mostly-transparent card, whose crown disappeared at distant mips.
let transform=[1,0,0,1,0,0],path=[];const stack=[],polygons=[]
const point=(x,y)=>[transform[0]*x+transform[2]*y+transform[4],transform[1]*x+transform[3]*y+transform[5]]
const trace={
 save(){stack.push([...transform])},restore(){transform=stack.pop()},
 translate(x,y){transform[4]+=transform[0]*x+transform[2]*y;transform[5]+=transform[1]*x+transform[3]*y},
 scale(x,y){transform[0]*=x;transform[1]*=x;transform[2]*=y;transform[3]*=y},
 rotate(angle){const [a,b,c,d]=transform,co=Math.cos(angle),si=Math.sin(angle);transform[0]=a*co+c*si;transform[1]=b*co+d*si;transform[2]=c*co-a*si;transform[3]=d*co-b*si},
 beginPath(){path=[]},moveTo(x,y){path.push(point(x,y))},
 bezierCurveTo(x1,y1,x2,y2,x3,y3){const a=path.at(-1),b=point(x1,y1),c=point(x2,y2),d=point(x3,y3);for(let i=1;i<=16;i++){const t=i/16,u=1-t;path.push([u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]])}},
 quadraticCurveTo(){},stroke(){},fill(){polygons.push(path)},
}
drawTempleSprig(trace,256);assert.equal(stack.length,0)
const inside=(x,y,polygon)=>{let hit=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [ax,ay]=polygon[i],[bx,by]=polygon[j];if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)hit=!hit}return hit}
const alpha=new Uint8Array(128*128);let covered=0,minX=256,maxX=0
for(let y=0;y<128;y++)for(let x=0;x<128;x++)if(polygons.some(p=>inside(x*2+1,y*2+1,p))){alpha[y*128+x]=1;covered++;minX=Math.min(minX,x*2);maxX=Math.max(maxX,x*2+2)}
assert.ok(covered/alpha.length>.22,'Small leaves must cover enough of the atlas to sustain a canopy, not just a bare twig')
assert.ok(maxX-minX>180,'Branches must use most of the atlas width')
let retainedMipCells=0
for(let y=0;y<16;y++)for(let x=0;x<16;x++){let sum=0;for(let dy=0;dy<8;dy++)for(let dx=0;dx<8;dx++)sum+=alpha[(y*8+dy)*128+x*8+dx];if(sum/64>=.25)retainedMipCells++}
assert.ok(retainedMipCells>70,'A coarse alpha mip must retain a broad crown instead of eliminating fine leaves')
let geometryDisposed=0,materialDisposed=0,instancesDisposed=0
geometry.addEventListener('dispose',()=>geometryDisposed++);material.addEventListener('dispose',()=>materialDisposed++)
first.addEventListener('dispose',()=>instancesDisposed++);second.addEventListener('dispose',()=>instancesDisposed++)
first.dispose();second.dispose();geometry.dispose();material.dispose()
assert.equal(instancesDisposed,2);assert.equal(geometryDisposed,1);assert.equal(materialDisposed,1)
console.log('Foliage: deterministic 240 curved sprigs/tree, 21 small leaves/sprig, 1440 triangles/tree (was 480), atlas coverage '+(covered/alpha.length*100).toFixed(1)+'%, coarse mip '+retainedMipCells+'/256 cells, shared resources/bounds/disposal pass.')
