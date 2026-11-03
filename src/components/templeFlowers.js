import * as THREE from 'three'

// Indexed strips have the same position/normal/uv/color layout as other static
// details. The scene owns their disposal, including after static batching.
function stripGeometry(leaf=false) {
  const positions=[],colors=[],uvs=[],indices=[]
  const rings=leaf?1:2
  for(let ring=0;ring<rings;ring++){
    const count=leaf?1:ring?5:7
    for(let petal=0;petal<count;petal++){
      const angle=petal*Math.PI*2/count+(ring?.38:0),start=positions.length/3
      for(let row=0;row<=4;row++)for(let col=0;col<=2;col++){
        const t=row/4,s=col-1
        const width=Math.sin(Math.PI*t)* (leaf?.018:ring?.018:.024)
        const radial=leaf?t*.095:.008+t*(ring?.049:.071)
        const lateral=s*width
        const height=leaf?.012*Math.sin(t*Math.PI):.003+ring*.006+.038*t*t+.008*s*s*Math.sin(Math.PI*t)
        positions.push(Math.cos(angle)*radial-Math.sin(angle)*lateral,height,Math.sin(angle)*radial+Math.cos(angle)*lateral)
        const shade=.77+.23*t-.05*Math.abs(s)
        colors.push(shade,shade,shade);uvs.push(col/2,t)
      }
      for(let row=0;row<4;row++)for(let col=0;col<2;col++){
        const a=start+row*3+col,b=a+3
        indices.push(a,a+1,b,b,a+1,b+1)
      }
    }
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))
  geometry.setIndex(indices);geometry.computeVertexNormals()
  geometry.computeBoundingBox();geometry.computeBoundingSphere()
  return geometry
}

export const createTemplePetalGeometry=()=>stripGeometry()

export function createTempleBouquets({mesh,curve}) {
  let petals,leaf,center
  function place(x,y,z,parent) {
    // No buffers or materials are allocated in worlds without flower vases.
    if(!petals){
      petals=createTemplePetalGeometry();leaf=stripGeometry(true)
      center=new THREE.SphereGeometry(.014,8,4)
      const colors=new Float32Array(center.attributes.position.count*3).fill(1)
      center.setAttribute('color',new THREE.BufferAttribute(colors,3))
    }
    const bouquet=new THREE.Group();bouquet.name='Temple vase bouquet'
    bouquet.position.set(x,y,z);parent.add(bouquet)
    for(let i=0;i<5;i++){
      const a=i*2.399963,r=i===0?.025:.105
      const top=new THREE.Vector3(Math.cos(a)*r,.65+[.04,.11,0,.08,.15][i],Math.sin(a)*r)
      const base=new THREE.Vector3(Math.cos(a)*.013,.3,Math.sin(a)*.013)
      const middle=base.clone().lerp(top,.52);middle.x+=Math.sin(a)*.012
      const headRotation=new THREE.Euler(.1*Math.sin(a),a,.13*Math.cos(a))
      // The flower origin is below its cupped petals; extend into the rotated heart.
      const stemTip=top.clone().add(new THREE.Vector3(0,.012,0).applyEuler(headRotation))
      const path=new THREE.CatmullRomCurve3([base,middle,stemTip])
      const stem=curve([base.toArray(),middle.toArray(),stemTip.toArray()],.0034,0x5e7751,bouquet)
      stem.name='Flower stem'
      const head=mesh(petals,i%2?0xc5939a:0xe1c9b4,...top.toArray(),bouquet,{vertexColors:true,side:THREE.DoubleSide,roughness:.85})
      head.name='Cupped flower head';head.rotation.copy(headRotation)
      const heart=mesh(center,0xcbb47c,0,.012,0,head,{vertexColors:true,roughness:1})
      heart.name='Flower center';heart.scale.y=.65
      for(let j=0;j<2;j++){
        const attachment=path.getPoint(.4+j*.22)
        const blade=mesh(leaf,0x667b52,...attachment.toArray(),bouquet,{vertexColors:true,side:THREE.DoubleSide,roughness:1})
        blade.name='Stem leaf';blade.rotation.set(0,a+j*Math.PI,-.35)
      }
    }
    return bouquet
  }
  return {place}
}
