import * as THREE from 'three'

// A small curved sprig, not a single oversized leaf. Geometry and atlas are shared by all trees.
export function createTempleSprigGeometry() {
  const geometry=new THREE.PlaneGeometry(.46,.76,1,3),p=geometry.attributes.position
  for(let i=0;i<p.count;i++){
    const y=p.getY(i)/.38,x=p.getX(i)/.23
    p.setZ(i,.038*(1-y*y)+.012*x*y)
  }
  geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere()
  return geometry
}

function drawTwig(ctx,variation=0) {
  ctx.strokeStyle='#68754c';ctx.lineWidth=2.5;ctx.lineCap='round'
  ctx.beginPath();ctx.moveTo(126,239);ctx.bezierCurveTo(135,176,119,99,130,20);ctx.stroke()
  const leaves=[
    [129,201,-.94,57,22],[129,179,.91,61,23],
    [128,151,-.88,59,22],[127,126,.85,56,21],
    [128,99,-.72,51,20],[129,74,.65,46,18],[130,49,.02,39,17],
  ]
  for(let i=0;i<leaves.length;i++){
    const [x,y,angle,length,width]=leaves[i]
    ctx.save();ctx.translate(x,y);ctx.rotate(angle)
    ctx.fillStyle=['#9ba979','#889966','#b0b784','#95a470'][(i+variation)%4]
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-width,-length*.35,-width*.8,-length*.72,0,-length);ctx.bezierCurveTo(width*.72,-length*.72,width,-length*.3,0,0);ctx.fill()
    ctx.strokeStyle='#6f8053';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-2);ctx.quadraticCurveTo(2,-length*.52,0,-length+3);ctx.stroke();ctx.restore()
  }
}

export function drawTempleSprig(ctx,size) {
  const unit=size/256
  ctx.save();ctx.scale(unit,unit)
  // Three interleaved twigs use the atlas width instead of leaving the card mostly
  // transparent. Individual leaves stay small; coverage comes from branching.
  for(const [x,y,angle,scale,variation]of [[77,241,-.1,.9,0],[128,248,.035,.98,1],[179,239,.1,.9,2]]){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);ctx.translate(-128,-239)
    drawTwig(ctx,variation);ctx.restore()
  }
  ctx.restore()
}

export function populateTempleSprigs(leaves) {
  const dummy=new THREE.Object3D(),color=new THREE.Color()
  for(let i=0;i<leaves.count;i++){
    const a=i*2.399963,r=Math.sqrt((i+.5)/leaves.count)*1.55
    dummy.position.set(Math.cos(a)*r,3.2+Math.sin(i*1.73)*.65+(1-r/1.55)*.55,Math.sin(a)*r)
    dummy.rotation.set(Math.sin(i*2.1)*1.15,a+Math.sin(i*.63)*.35,Math.cos(i*1.3)*.9)
    const scale=.78+(Math.sin(i*7.1)+1)*.22
    dummy.scale.set(scale*(.88+.12*Math.cos(i*.91)),scale,scale);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)
    color.setRGB(.88+.10*Math.sin(i*1.7),.92+.07*Math.sin(i*1.7),.82+.08*Math.sin(i*1.7));leaves.setColorAt(i,color)
  }
  leaves.instanceMatrix.needsUpdate=true;if(leaves.instanceColor)leaves.instanceColor.needsUpdate=true
  leaves.computeBoundingBox();leaves.computeBoundingSphere()
  return leaves
}
