// Restore reviewed source assets and reproduce the pinned optimization pipeline.
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {spawnSync} from 'node:child_process'
import {createHash} from 'node:crypto'
const base=new URL('../public/dichua/models/',import.meta.url),workspace=fileURLToPath(new URL('../',import.meta.url))
const manifest=JSON.parse(await fs.readFile(new URL('detail-manifest.json',base),'utf8'))
const hash=b=>createHash('sha256').update(b).digest('hex')
for(const entry of manifest){
 if(!/^[a-z0-9-]+\.glb$/.test(entry.file))throw Error('Invalid asset filename')
 const target=new URL(entry.file,base),valid=b=>b&&b.subarray(0,4).toString()==='glTF'&&b.length===entry.bytes&&hash(b)===entry.sha256
 let bytes;try{bytes=await fs.readFile(target)}catch{}
 if(!valid(bytes)||process.argv.includes('--rebuild')&&entry.transform){
  if(process.argv.includes('--check'))throw Error('Asset missing or modified: '+entry.file)
  const response=await fetch(entry.download,{signal:AbortSignal.timeout(60000)})
  if(!response.ok)throw Error(entry.file+': HTTP '+response.status)
  bytes=Buffer.from(await response.arrayBuffer())
  if(entry.transform){
   if(entry.transform!=='gltf-transform-4.5.1-young-visitor'||hash(bytes)!==entry.upstreamSha256)throw Error('Upstream visitor changed; review source/license')
   const dir='.setest/detail-restore',input=dir+'/source-'+entry.file,output=dir+'/'+entry.file
   await fs.mkdir(path.join(workspace,dir),{recursive:true});await fs.writeFile(path.join(workspace,input),bytes)
   const args=['--yes','--package','@gltf-transform/cli@4.5.1','gltf-transform','optimize',input,output,'--compress','meshopt','--texture-compress','webp','--texture-size','1024','--simplify-ratio','0.16','--simplify-error','0.001','--flatten','false','--join','false','--palette','false','--prune','false']
   // Invoke npm's JS entry point directly on Windows; no shell or command-string interpolation.
   const npxCli=path.join(path.dirname(process.execPath),'node_modules/npm/bin/npx-cli.js')
   if(process.platform==='win32')await fs.access(npxCli)
   const result=spawnSync(process.platform==='win32'?process.execPath:'npx',process.platform==='win32'?[npxCli,...args]:args,{cwd:workspace,stdio:'inherit'})
   if(result.status!==0)throw Error('Visitor optimization failed')
   bytes=await fs.readFile(path.join(workspace,output))
  }
  if(!valid(bytes))throw Error('Content changed; review source/license/pipeline: '+entry.file)
  await fs.writeFile(target,bytes)
 }
 console.log(entry.file+' verified ('+bytes.length+' bytes)')
}
