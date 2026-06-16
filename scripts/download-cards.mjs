#!/usr/bin/env node
/* Tam Sở — tải 78 lá Tarot Rider–Waite–Smith (phạm vi công cộng) từ Wikimedia
 * Commons về thư mục public/cards/ để self-host (chạy offline, nhanh hơn hotlink).
 *
 * Dùng:
 *   node scripts/download-cards.mjs            # tải về (mặc định width=600)
 *   node scripts/download-cards.mjs --width=800
 *   node scripts/download-cards.mjs --force    # tải lại cả file đã có
 *   node scripts/download-cards.mjs --dry      # chỉ liệt kê, không tải
 *
 * Sau khi tải xong: mở src/data/tarot.js đặt `export const LOCAL_CARDS = true`
 * rồi chạy `npm run build`. Yêu cầu Node 18+ (có sẵn fetch). */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TAROT_CARDS, cardImageFile } from '../src/data/tarot.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'public', 'cards')

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const FORCE = args.includes('--force')
const wArg = args.find(a => a.startsWith('--width='))
const WIDTH = wArg ? parseInt(wArg.split('=')[1], 10) : 600

const files = [...new Set(TAROT_CARDS.map(cardImageFile).filter(Boolean))]
console.log(`Tam So — ${files.length} la bai RWS (public domain) -> public/cards/  [width=${WIDTH}px]`)

if (DRY) {
  files.forEach((f, i) => console.log(String(i + 1).padStart(2, '0'), f))
  console.log(`\n(dry-run) Tong: ${files.length} file. Khong tai gi.`)
  process.exit(0)
}

fs.mkdirSync(OUT, { recursive: true })
const UA = 'TamSo/2.8 (https://github.com/vansang2409/tam-so; tarot self-host)'
let ok = 0, skip = 0, fail = 0

for (const [i, file] of files.entries()) {
  const dest = path.join(OUT, file)
  const tag = `[${String(i + 1).padStart(2, '0')}/${files.length}] ${file}`
  if (!FORCE && fs.existsSync(dest) && fs.statSync(dest).size > 0) { console.log(tag, '- da co, bo qua'); skip++; continue }
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${WIDTH}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 1000) throw new Error('file qua nho (' + buf.length + 'B)')
    fs.writeFileSync(dest, buf)
    console.log(tag, `- OK (${(buf.length / 1024).toFixed(0)} KB)`)
    ok++
  } catch (e) {
    console.error(tag, '- LOI:', e.message)
    fail++
  }
  await new Promise(r => setTimeout(r, 200))
}

console.log(`\nXong: ${ok} tai moi, ${skip} bo qua, ${fail} loi -> ${OUT}`)
if (fail === 0 && ok + skip === files.length) {
  console.log('Buoc cuoi: mo src/data/tarot.js dat `export const LOCAL_CARDS = true`, roi `npm run build`.')
} else if (fail > 0) {
  console.log('Co file loi — chay lai lenh de thu tiep (file da tai se duoc bo qua).')
  process.exit(1)
}
