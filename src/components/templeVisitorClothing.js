import * as THREE from 'three'
import {addTempleClothMorphs,smoothClothNormals} from './templeClothDeformation.js'

// A separate, fully skinned lay-practitioner outfit, not a recolored fitted base shirt.
export function prepareTempleVisitorClothing(root,{female=false}={}) {
  root.updateMatrixWorld(true,true)
  const body=[];root.traverse(o=>{if(o.isSkinnedMesh)body.push(o)})
  if(!body.length)throw Error('Visitor has no skinned body')
  const bounds=new THREE.Box3().setFromObject(root),height=bounds.max.y-bounds.min.y,center=bounds.getCenter(new THREE.Vector3())
  const skeleton=body[0].skeleton,bones=skeleton.bones,ids=new Map(bones.map((b,i)=>[b.name,i])),pos=name=>bones[ids.get(name)].getWorldPosition(new THREE.Vector3())
  const chestZ=(pos('Spine').z-center.z)/height,fitWidth=THREE.MathUtils.clamp((pos('LeftArm').x-pos('RightArm').x)/height/.235,.90,1.04)
  const shirt=new THREE.MeshStandardMaterial({color:female?0x87949d:0x929eaa,roughness:.93}),pants=new THREE.MeshStandardMaterial({color:female?0x7e8a94:0x818d9a,roughness:.96}),shoe=new THREE.MeshStandardMaterial({color:0x393b3a,roughness:.82}),edge=new THREE.MeshStandardMaterial({color:female?0x839099:0x8894a1,roughness:.94})
  // Fine cotton weave; deterministic and local, with no external image dependency.
  const weaveData=new Uint8Array(128*128)
  for(let y=0;y<128;y++)for(let x=0;x<128;x++)weaveData[y*128+x]=128+Math.round(Math.sin(x*Math.PI/2)*22+Math.sin(y*Math.PI/2)*18)
  const weave=new THREE.DataTexture(weaveData,128,128,THREE.RedFormat);weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.magFilter=THREE.LinearFilter;weave.minFilter=THREE.LinearMipmapLinearFilter;weave.generateMipmaps=true;weave.needsUpdate=true
  weave.repeat.set(5,7)
  shirt.bumpMap=pants.bumpMap=edge.bumpMap=weave;shirt.bumpScale=pants.bumpScale=edge.bumpScale=.00025*height
  shirt.userData.visitorClothing='ao-lam';pants.userData.visitorClothing='trousers';shoe.userData.visitorClothing='shoes';edge.userData.visitorClothing='ao-lam-trim'
  // Retain the original detailed young face, hair, neck and hands. All base sportswear is hidden.
  for(const mesh of body){
    const g=mesh.geometry,index=g.index,keep=[]
    for(let i=0;i<(index?index.count:g.attributes.position.count);i+=3){
      const tri=[0,1,2].map(k=>index?index.getX(i+k):i+k);let head=0,neck=0,hands=0
      for(const id of tri)for(let k=0;k<4;k++){
        const name=mesh.skeleton.bones[g.attributes.skinIndex.getComponent(id,k)].name,w=g.attributes.skinWeight.getComponent(id,k)/3
        if(/head/i.test(name))head+=w;else if(name==='neck')neck+=w;else if(/Hand$/.test(name))hands+=w
      }
      if(head>.35||neck>.75||hands>.15)keep.push(...tri)
    }
    g.setIndex(keep);g.clearGroups();g.addGroup(0,keep.length,0);g.computeBoundingBox();g.computeBoundingSphere()
    // Thu phần chân cổ nằm dưới cổ áo vào trong; không để mép cắt tam giác lộ ra ngoài.
    const point=new THREE.Vector3(),inverse=mesh.matrixWorld.clone().invert(),a=g.attributes.position
    const skinMatrix=new THREE.Matrix4(),boneMatrix=new THREE.Matrix4()
    for(const id of new Set(keep)){
      // Quantized GLB skins may store their position decode in inverse bind matrices.
      // Female neckline edits must measure the rendered bind position, then undo skinning.
      if(female)mesh.getVertexPosition(id,point).applyMatrix4(mesh.matrixWorld)
      else point.fromBufferAttribute(a,id).applyMatrix4(mesh.matrixWorld)
      const y=(point.y-bounds.min.y)/height
      if(y<.76||y>(female?.845:.85))continue
      const blend=1-THREE.MathUtils.smoothstep(y,female?.826:.832,female?.845:.85),x=(point.x-center.x)/height,z=(point.z-center.z)/height-chestZ
      const radius=Math.hypot(x/(female?.033:.037),z/(female?.030:.033))
      if(radius>1){
        const factor=THREE.MathUtils.lerp(1,1/radius,blend);point.x=center.x+x*factor*height;point.z=center.z+(chestZ+z*factor)*height;point.applyMatrix4(inverse)
        if(female){
          skinMatrix.elements.fill(0)
          for(let k=0;k<4;k++){
            const joint=g.attributes.skinIndex.getComponent(id,k),w=g.attributes.skinWeight.getComponent(id,k)
            boneMatrix.multiplyMatrices(mesh.skeleton.bones[joint].matrixWorld,mesh.skeleton.boneInverses[joint])
            for(let e=0;e<16;e++)skinMatrix.elements[e]+=boneMatrix.elements[e]*w
          }
          skinMatrix.premultiply(mesh.bindMatrixInverse).multiply(mesh.bindMatrix).invert();point.applyMatrix4(skinMatrix)
        }
        a.setXYZ(id,point.x,point.y,point.z)
      }
    }
    a.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere()
  }
  const positions=[],uvs=[],joints=[],weights=[],indices=[],groups=[],clothVertices=[],seams=[]
  const v=(x,y,z)=>new THREE.Vector3(center.x+x*height,bounds.min.y+y*height,center.z+z*height)
  const weight=(name)=>[[ids.get(name),1]]
  const spine=['Hips','Spine02','Spine01','Spine'].map(name=>({id:ids.get(name),y:pos(name).y})).sort((a,b)=>a.y-b.y)
  function torsoWeight(p){
    if(p.y<=spine[0].y)return [[spine[0].id,1]]
    for(let i=1;i<spine.length;i++)if(p.y<=spine[i].y){const t=(p.y-spine[i-1].y)/(spine[i].y-spine[i-1].y);return [[spine[i-1].id,1-t],[spine[i].id,t]]}
    return [[spine.at(-1).id,1]]
  }
  function vertex(p,w,u=0,t=0,cloth=null){const id=positions.length/3;positions.push(p.x,p.y,p.z);uvs.push(u,t);clothVertices.push(cloth);for(let k=0;k<4;k++){joints.push(w[k]?.[0]||0);weights.push(w[k]?.[1]||0)}return id}
  function part(material,build){const start=indices.length;build();groups.push({start,count:indices.length-start,materialIndex:material})}
  function rings(ringPoints,weightAt,segments=48,kind='torso',centers=null,sideVents=false,omit=null){
    const rows=[]
    for(let row=0;row<ringPoints.length;row++){
      const ring=[],split=new Map(),y=(ringPoints[row](0).y-bounds.min.y)/height
      const gap=sideVents?.045*(1-THREE.MathUtils.smoothstep(y,.49,.55)):0
      const add=(j,angle)=>{
        const p=ringPoints[row](angle),w=weightAt(p,row,angle),origin=centers?.[row]||new THREE.Vector3(center.x,p.y,center.z)
        return vertex(p,w,j/segments,row/(ringPoints.length-1),{kind,t:row/(ringPoints.length-1),angle,y:(p.y-bounds.min.y)/height,radial:p.clone().sub(origin).normalize()})
      }
      for(let j=0;j<=segments;j++){
        const angle=j/segments*Math.PI*2,isSide=sideVents&&(j===segments/4||j===segments*3/4)
        ring.push(add(j,angle-(isSide?gap:0)))
        if(isSide){const other=add(j,angle+gap);split.set(j,other);if(gap===0)seams.push([ring[j],other])}
      }
      seams.push([ring[0],ring[segments]]);rows.push({ring,split})
    }
    for(let r=0;r<rows.length-1;r++)for(let j=0;j<segments;j++){
      if(omit?.(r,j))continue
      const top=rows[r],bottom=rows[r+1],a=top.split.get(j)??top.ring[j],b=bottom.split.get(j)??bottom.ring[j],c=top.ring[j+1],d=bottom.ring[j+1]
      indices.push(a,b,c,c,b,d)
    }
    return rows
  }
  // A loose lay-practitioner jacket ending just below the hips, not a continuous robe tube.
  const profile=female
    ?[[.822,.044,.040],[.805,.046,.043],[.785,.086,.058],[.758,.102,.064],[.70,.104,.071],[.63,.100,.070],[.57,.109,.076],[.53,.117,.079],[.49,.121,.080]]
    :[[.838,.049,.045],[.811,.048,.046],[.785,.104,.068],[.758,.126,.078],[.70,.126,.082],[.63,.122,.083],[.57,.128,.086],[.53,.135,.089],[.49,.137,.089]]
  function radiiAt(y){
    for(let i=0;i<profile.length-1;i++){
      const a=profile[i],b=profile[i+1]
      if(y>=b[0]){
        const t=THREE.MathUtils.clamp((a[0]-y)/(a[0]-b[0]),0,1),previous=profile[Math.max(0,i-1)],next=profile[Math.min(profile.length-1,i+2)],span=b[0]-a[0]
        return [1,2].map(axis=>{
          const m0=(b[axis]-previous[axis])/(b[0]-previous[0])*span,m1=(next[axis]-a[axis])/(next[0]-a[0])*span
          const value=(2*t**3-3*t*t+1)*a[axis]+(t**3-2*t*t+t)*m0+(-2*t**3+3*t*t)*b[axis]+(t**3-t*t)*m1
          return THREE.MathUtils.clamp(value,Math.min(a[axis],b[axis]),Math.max(a[axis],b[axis]))*(axis===1?fitWidth:1)
        })
      }
    }
    return [profile.at(-1)[1]*fitWidth,profile.at(-1)[2]]
  }
  function drapedPoint(y,angle){
    if(female){
      // Round the rectangular construction grid into an oval sewn armhole.
      // Blend out over neighboring rows so the body panel stays continuous.
      const side=Math.sin(angle)>=0?Math.PI/2:Math.PI*1.5,u=Math.atan2(Math.sin(angle-side),Math.cos(angle-side))/(Math.PI/4),w=(y-.7425)/.0425
      const falloff=(1-THREE.MathUtils.smoothstep(Math.abs(u),1,1.6))*(1-THREE.MathUtils.smoothstep(Math.abs(w),1,1.65))
      if(falloff>0){const nu=u*Math.sqrt(1-Math.min(w*w,1)*.5),nw=w*Math.sqrt(1-Math.min(u*u,1)*.5);angle=THREE.MathUtils.lerp(angle,angle+(nu-u)*Math.PI/4,falloff);y+=.0425*(nw-w)*falloff}
    }
    const [rx,rz]=radiiAt(y),hanging=1-THREE.MathUtils.smoothstep(y,.73,.80),hem=1-THREE.MathUtils.smoothstep(y,.49,.55),front=Math.max(0,Math.cos(angle))
    const distance=a=>Math.atan2(Math.sin(angle-a),Math.cos(angle-a))
    // A few broad folds fall from the underarms and hips; they are not evenly spaced flutes.
    let ridge=0
    for(const [a,width,depth]of [[.68,.14,-.0038],[-.76,.18,-.0048],[2.35,.20,-.003],[-2.45,.16,-.0035]]){
      const d=distance(a+.08*Math.sin(y*7+a));ridge+=depth*Math.exp(-Math.pow(d/width,2))
    }
    ridge*=hanging*(female?1.45:1)
    const shoulderCrease=-.0015*Math.exp(-Math.pow((y-(.738-.033*Math.abs(Math.sin(angle))+.006*Math.sin(angle)))/.018,2))*front
    const waistCrease=.0012*Math.sin((y-.57)*48+angle)*Math.exp(-Math.pow((y-.59)/.055,2))*front
    const ripple=ridge+shoulderCrease+waistCrease,drape=hem*.002*(Math.sin(angle*3)+.35*Math.sin(angle*7+.4))
    // Patterned front/back ease: loose over the chest, then hanging from the shoulder.
    // Dropping the outer shoulder avoids a horizontal shelf under the sleeve cap.
    const shoulderDrop=female?.012*Math.pow(Math.abs(Math.sin(angle)),3)*THREE.MathUtils.smoothstep(y,.74,.785)*(1-THREE.MathUtils.smoothstep(y,.785,.811)):0
    const frontEase=female?.004*Math.exp(-Math.pow((y-.72)/.045,2))*front**2:0
    const collarNotch=female?.007*Math.pow(front,18)*THREE.MathUtils.smoothstep(y,.805,.822):0
    return v(Math.sin(angle)*(rx+ripple),y+drape-shoulderDrop-collarNotch,chestZ+Math.cos(angle)*(rz+ripple)+frontEase)
  }
  let torsoRows
  const armhole={top:6,bottom:12}
  part(0,()=>{
    const rows=[]
    for(let i=0;i<profile.length-1;i++)for(let k=0;k<3;k++){
      const y=THREE.MathUtils.lerp(profile[i][0],profile[i+1][0],k/3)
      rows.push(angle=>drapedPoint(y,angle))
    }
    rows.push(angle=>drapedPoint(profile.at(-1)[0],angle))
    torsoRows=rings(rows,p=>{
      const base=torsoWeight(p),x=(p.x-center.x)/height,y=(p.y-bounds.min.y)/height
      const sleeveBlend=THREE.MathUtils.smoothstep(Math.abs(x),female?.058:.085,female?.098:.14)*THREE.MathUtils.smoothstep(y,.70,.78)*(female?.65:.22)
      const side=x>=0?'Left':'Right'
      return female?[...base.map(([id,w])=>[id,w*(1-sleeveBlend)]),[ids.get(side+'Shoulder'),sleeveBlend*.35],[ids.get(side+'Arm'),sleeveBlend*.65]]:[...base.map(([id,w])=>[id,w*(1-sleeveBlend)]),[ids.get(side+'Arm'),sleeveBlend]]
    },64,'torso',null,true,(r,j)=>r>=armhole.top&&r<armhole.bottom&&((j>=8&&j<24)||(j>=40&&j<56)))
  })
  function tube(points,radii,weightAt,kind='sleeve'){
    const rows=points.map((p,i)=>{
      const direction=points[Math.min(i+1,points.length-1)].clone().sub(points[Math.max(0,i-1)]).normalize(),axis=new THREE.Vector3(0,0,1)
      axis.addScaledVector(direction,-axis.dot(direction)).normalize();const cross=new THREE.Vector3().crossVectors(axis,direction).normalize()
      return angle=>{
        const t=i/(points.length-1),joint=Math.exp(-Math.pow((t-.5)/.17,2)),cuff=Math.exp(-Math.pow((t-.9)/.10,2))
        const fold=kind==='sleeve'?.065*joint*Math.sin(t*38+angle*2)+.025*cuff*Math.sin(t*52-angle):.025*Math.sin(angle*5+.2)*Math.sin(t*Math.PI)+.040*joint*Math.sin(t*35-angle*2)+.045*cuff*Math.sin(t*48+angle)
        const radius=radii[i]*(1+fold),o=p.clone().addScaledVector(axis,Math.cos(angle)*radius).addScaledVector(cross,Math.sin(angle)*radius)
        if(kind==='sleeve')o.y-=height*.004*Math.sin(t*Math.PI)
        return o
      }
    });rings(rows,weightAt,40,kind,points)
  }
  for(const prefix of ['Left','Right']){
    const shoulder=pos(prefix+'Arm'),elbow=pos(prefix+'ForeArm'),hand=pos(prefix+'Hand')
    // Nối tay trực tiếp vào vòng nách: dùng chung đỉnh và trọng số, không ghép hai ống hở.
    const left=prefix==='Left',front=left?8:40,back=front+16,{top,bottom}=armhole,boundary=[],angles=[]
    const boundaryVertex=(row,j)=>{
      boundary.push(torsoRows[row].ring[j])
      // Tham số chạy trọn một vòng; chiếu lỗ nách lên trục tay sẽ gập ngược nửa vòng dưới.
      angles.push(Math.atan2(1-2*(row-top)/(bottom-top),1-2*(j-front)/(back-front))+(left?0:Math.PI))
    }
    for(let j=front;j<back;j++)boundaryVertex(top,j)
    for(let row=top;row<bottom;row++)boundaryVertex(row,back)
    for(let j=back;j>front;j--)boundaryVertex(bottom,j)
    for(let row=bottom;row>top;row--)boundaryVertex(row,front)
    const direction=elbow.clone().sub(shoulder).normalize(),axis=new THREE.Vector3(0,0,1)
    axis.addScaledVector(direction,-axis.dot(direction)).normalize()
    const cross=new THREE.Vector3().crossVectors(axis,direction).normalize(),segments=boundary.length
    part(0,()=>{
      let previous=boundary
      for(let row=1;row<=28;row++){
        const t=row/28,p=t<.5?shoulder.clone().lerp(elbow,t*2):elbow.clone().lerp(hand,(t-.5)*2*1.025)
        const blend=THREE.MathUtils.smoothstep(t,.36,.65),w=[[ids.get(prefix+'Arm'),1-blend],[ids.get(prefix+'ForeArm'),blend]],ring=[]
        for(let j=0;j<segments;j++){
          const angle=angles[j],fold=.025*Math.exp(-Math.pow((t-.5)/.17,2))*Math.sin(t*32+angle*2)
          const radius=height*THREE.MathUtils.lerp((female?.029:.043)*fitWidth,female?.020:.025,t)*(1+fold)
          const target=p.clone().addScaledVector(axis,Math.cos(angle)*radius).addScaledVector(cross,Math.sin(angle)*radius)
          const cap=THREE.MathUtils.smoothstep(t,0,female?.26:.22),start=new THREE.Vector3().fromArray(positions,boundary[j]*3),point=start.clone().lerp(target,cap)
          const initial=[];for(let k=0;k<4;k++)if(weights[boundary[j]*4+k])initial.push([joints[boundary[j]*4+k],weights[boundary[j]*4+k]*(1-cap)])
          const combined=new Map();for(const [id,value]of [...initial,...w.map(([id,value])=>[id,value*cap])])combined.set(id,(combined.get(id)||0)+value)
          const skin=[...combined].filter(([,value])=>value>0).sort((a,b)=>b[1]-a[1]).slice(0,4),total=skin.reduce((n,[,value])=>n+value,0)
          ring.push(vertex(point,skin.map(([id,value])=>[id,value/total]),j/segments,t,{kind:'sleeve',t,angle,y:(point.y-bounds.min.y)/height,radial:point.clone().sub(p).normalize()}))
        }
        for(let j=0;j<segments;j++){const next=(j+1)%segments,a=previous[j],b=ring[j],c=previous[next],d=ring[next];indices.push(a,b,c,c,b,d)}
        previous=ring
      }
      // Mép tay gập vào trong, che đường cắt cổ tay của model nền.
      const cuffCenter=elbow.clone().lerp(hand,1.025),inner=[]
      for(let j=0;j<segments;j++){
        const point=new THREE.Vector3().fromArray(positions,previous[j]*3).lerp(cuffCenter,.15)
        inner.push(vertex(point,weight(prefix+'ForeArm'),j/segments,1))
      }
      for(let j=0;j<segments;j++){const k=(j+1)%segments;indices.push(previous[j],inner[j],previous[k],previous[k],inner[j],inner[k])}
    })
    const hip=pos(prefix+'UpLeg'),knee=pos(prefix+'Leg'),ankle=pos(prefix+'Foot'),legPoints=[],legRadii=[],legWeights=[]
    for(let i=0;i<=32;i++){
      const t=i/32,p=t<.5?hip.clone().add(new THREE.Vector3(0,height*.045,0)).lerp(knee,t*2):knee.clone().lerp(ankle,(t-.5)*2)
      legPoints.push(p);legRadii.push(height*THREE.MathUtils.lerp(female?.055:.063,female?.037:.043,t));const blend=THREE.MathUtils.smoothstep(t,.36,.65);legWeights.push([[ids.get(prefix+'UpLeg'),1-blend],[ids.get(prefix+'Leg'),blend]])
    }
    part(1,()=>tube(legPoints,legRadii,(_p,row)=>legWeights[row],'pants'))
    // Dựng giày theo trục gót–mũi trong bind pose để bàn chân hạ xuống đúng mặt đất.
    part(2,()=>{
      const forward=pos(prefix+'ToeBase').sub(ankle).normalize(),up=new THREE.Vector3(0,1,0)
      up.addScaledVector(forward,-up.dot(forward)).normalize();const right=new THREE.Vector3().crossVectors(up,forward).normalize()
      const sections=[[-.050,.023,.040],[-.035,.035,.053],[.025,.038,.049],[.083,.035,.038],[.100,.022,.027],[.106,.001,.017]],rows=[]
      for(const [z,width,upper]of sections){const ring=[];for(let j=0;j<=24;j++){
        const a=j/24*Math.PI*2,s=Math.sin(a),y=s>=0?-.057+s*upper*(female?.85:1):-.057+s*.013
        const point=ankle.clone().addScaledVector(forward,z*height*(female?.88:1)).addScaledVector(right,Math.cos(a)*width*height*(female?.75:1)).addScaledVector(up,y*height)
        ring.push(vertex(point,weight(prefix+'Foot'),j/24,z));
      }seams.push([ring[0],ring[24]]);rows.push(ring)}
      for(let row=0;row<rows.length-1;row++)for(let j=0;j<24;j++){const a=rows[row][j],b=rows[row+1][j],c=rows[row][j+1],d=rows[row+1][j+1];indices.push(a,c,b,c,d,b)}
      for(const [row,reverse]of [[rows[0],true],[rows.at(-1),false]])for(let j=1;j<23;j++)indices.push(row[0],row[reverse?j+1:j],row[reverse?j:j+1])
    })
  }
  if(female){
    // Fair the sewn sleeve cap together with its armhole, including the skin-weight field.
    // This is an offline authoring step for the baked female GLB, not per-frame cloth physics.
    const adjacency=new Map(),affected=new Map()
    for(const group of groups.filter(g=>g.materialIndex===0))for(let i=group.start;i<group.start+group.count;i+=3){
      const triangle=indices.slice(i,i+3)
      for(const id of triangle){if(!adjacency.has(id))adjacency.set(id,new Set());for(const other of triangle)if(other!==id)adjacency.get(id).add(other)}
    }
    for(const [id]of adjacency){
      const m=clothVertices[id],x=Math.abs((positions[id*3]-center.x)/height)
      if(!m)continue
      const mask=m.kind==='sleeve'?1-THREE.MathUtils.smoothstep(m.t,.18,.42):THREE.MathUtils.smoothstep(x,.055,.09)*THREE.MathUtils.smoothstep(m.y,.69,.72)*(1-THREE.MathUtils.smoothstep(m.y,.78,.80))
      if(mask>0)affected.set(id,mask*.38)
    }
    for(let iteration=0;iteration<12;iteration++){
      const next=positions.slice(),nextWeights=weights.slice(),nextJoints=joints.slice()
      for(const [id,amount]of affected){
        const neighbors=adjacency.get(id),field=new Map()
        for(let k=0;k<4;k++)field.set(joints[id*4+k],(field.get(joints[id*4+k])||0)+weights[id*4+k]*(1-amount))
        for(let axis=0;axis<3;axis++){let sum=0;for(const n of neighbors)sum+=positions[n*3+axis];next[id*3+axis]=THREE.MathUtils.lerp(positions[id*3+axis],sum/neighbors.size,amount)}
        for(const n of neighbors)for(let k=0;k<4;k++)field.set(joints[n*4+k],(field.get(joints[n*4+k])||0)+weights[n*4+k]*amount/neighbors.size)
        const skin=[...field].filter(([,w])=>w>1e-8).sort((a,b)=>b[1]-a[1]).slice(0,4),total=skin.reduce((n,[,w])=>n+w,0)
        for(let k=0;k<4;k++){nextJoints[id*4+k]=skin[k]?.[0]||0;nextWeights[id*4+k]=(skin[k]?.[1]||0)/total}
      }
      for(const [id]of affected){for(let k=0;k<3;k++)positions[id*3+k]=next[id*3+k];for(let k=0;k<4;k++){weights[id*4+k]=nextWeights[id*4+k];joints[id*4+k]=nextJoints[id*4+k]}}
    }
  }
  // Nẹp and cloth-covered buttons share the torso surface, weights and morphs, not a floating rail.
  function frontPoint(y,x,offset=0){
    const angle=Math.asin(x/radiiAt(y)[0]),p=drapedPoint(y,angle),radial=new THREE.Vector3(Math.sin(angle),0,Math.cos(angle))
    p.addScaledVector(radial,height*offset)
    return {p,cloth:{kind:'torso',t:0,angle,y:(p.y-bounds.min.y)/height,radial}}
  }
  part(3,()=>{
    const rows=[];for(let i=0;i<=32;i++)rows.push(THREE.MathUtils.lerp(female?.803:.810,.491,i/32))
    const start=positions.length/3
    for(const y of rows)for(const x of [-.0045,.0045]){const {p,cloth}=frontPoint(y,x,.0008);vertex(p,torsoWeight(p),0,0,cloth)}
    for(let i=0;i<rows.length-1;i++){const a=start+i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3)}
    // Cổ có mép gập và lớp trong, tránh cảm giác ống giấy mỏng khi nhìn gần.
    const collar=[]
    for(let row=0;row<3;row++){
      const ring=[]
      for(let j=0;j<=64;j++){
        const angle=j/64*Math.PI*2,y=row===2?(female?.805:.818):(female?.822:.838),p=drapedPoint(y,angle),radial=new THREE.Vector3(Math.sin(angle),0,Math.cos(angle))
        if(row)p.addScaledVector(radial,-height*.002)
        ring.push(vertex(p,torsoWeight(p),j/64,row/2,{kind:'torso',t:0,angle,y,radial}))
      }
      seams.push([ring[0],ring[64]]);collar.push(ring)
    }
    for(let row=0;row<2;row++)for(let j=0;j<64;j++){const a=collar[row][j],b=collar[row+1][j],c=collar[row][j+1],d=collar[row+1][j+1];indices.push(a,c,b,c,d,b)}
    for(let i=0;i<5;i++){
      const button=frontPoint(.777-i*.058,0,.0012),g=new THREE.SphereGeometry(height*.0025,10,6),a=g.attributes.position,start=positions.length/3
      for(let k=0;k<a.count;k++){const p=new THREE.Vector3().fromBufferAttribute(a,k).add(button.p);vertex(p,torsoWeight(p),0,0,button.cloth)}for(const id of g.index.array)indices.push(start+id);g.dispose()
    }
    if(female)for(const side of [-1,1]){
      // Two shallow patch pockets sewn to the hanging front panels.
      const start=positions.length/3,columns=12,rows=16
      for(let row=0;row<=rows;row++)for(let col=0;col<=columns;col++){
        const u=col/columns,t=row/rows,x=side*.058+(u-.5)*.050,y=.61-t*.073
        const ease=.0012+.0010*Math.sin(u*Math.PI)*Math.sin(t*Math.PI),{p,cloth}=frontPoint(y,x,ease)
        vertex(p,torsoWeight(p),u,t,cloth)
      }
      for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){const a=start+row*(columns+1)+col,b=a+columns+1;indices.push(a,b,a+1,a+1,b,b+1)}
    }
  })
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(joints,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));geometry.setIndex(indices);for(const g of groups)geometry.addGroup(g.start,g.count,g.materialIndex);smoothClothNormals(geometry,seams);addTempleClothMorphs(geometry,clothVertices,seams,height)
  const outfit=new THREE.SkinnedMesh(geometry,[shirt,pants,shoe,edge]);outfit.name='Ao lam garment';root.add(outfit)
  // Garment is authored in the current rest pose, independently of the source mesh's bind space.
  const outfitSkeleton=new THREE.Skeleton(bones,bones.map(b=>b.matrixWorld.clone().invert()));outfit.bind(outfitSkeleton,new THREE.Matrix4());outfit.castShadow=true;outfit.receiveShadow=true
  root.userData.templeOutfit=true
  if(female)root.userData.templeCharacterProfile='female-lam-v1'
}
