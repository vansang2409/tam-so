#!/usr/bin/env node
/* safe-edit.mjs — sửa file AN TOÀN cho repo này (tránh lỗi cắt cụt của Edit/Write tool trên ổ D:).
 *
 * VÌ SAO: công cụ Edit/Write ghi qua mount ổ D: đôi khi cắt cụt file khi nội dung phình to.
 * Ghi bằng Node fs (đường mount Linux) thì KHÔNG bị. Script này gói lại việc đó + tự kiểm chứng.
 *
 * CÁCH DÙNG (đọc spec từ một file JSON để khỏi vướng escape shell):
 *   node scripts/safe-edit.mjs <spec.json>
 *
 * spec.json:
 *   {
 *     "file": "src/pages/Foo.jsx",          // bắt buộc, đường dẫn tương đối gốc repo
 *     "edits": [                              // tùy chọn — thay chuỗi tuần tự
 *       { "find": "...", "replace": "...", "all": false }
 *     ],
 *     "append": "...",                        // tùy chọn — nối thêm vào cuối
 *     "write": "..."                          // tùy chọn — GHI ĐÈ toàn bộ (bỏ qua edits/append)
 *   }
 *
 * BẢO ĐẢM:
 *   1) Ghi nguyên vẹn bằng fs.writeFileSync, rồi ĐỌC LẠI và so độ dài byte — phát hiện cắt cụt ngay.
 *   2) find phải tồn tại; nếu all=false thì phải DUY NHẤT (chặn thay nhầm).
 *   3) In ra: độ dài, 3 dòng cuối, và cân bằng ngoặc {} () [] để soi nhanh.
 *   Thoát mã != 0 nếu có vấn đề (KHÔNG ghi khi find thiếu/không duy nhất).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const specPath = process.argv[2]
if (!specPath) { console.error('Thiếu đường dẫn spec.json'); process.exit(2) }

const spec = JSON.parse(readFileSync(specPath, 'utf8'))
if (!spec.file) { console.error('spec thiếu "file"'); process.exit(2) }
const target = resolve(ROOT, spec.file)

const count = (s, sub) => s.split(sub).length - 1

let out
if (typeof spec.write === 'string') {
  out = spec.write
} else {
  out = readFileSync(target, 'utf8')
  for (const [i, e] of (spec.edits || []).entries()) {
    if (typeof e.find !== 'string') { console.error(`edit[${i}] thiếu "find"`); process.exit(2) }
    const n = count(out, e.find)
    if (n === 0) { console.error(`edit[${i}]: KHÔNG tìm thấy "find" (đầu: ${JSON.stringify(e.find.slice(0, 60))})`); process.exit(3) }
    if (!e.all && n > 1) { console.error(`edit[${i}]: "find" xuất hiện ${n} lần — đặt "all": true hoặc làm cho duy nhất`); process.exit(3) }
    out = e.all ? out.split(e.find).join(e.replace ?? '') : out.replace(e.find, e.replace ?? '')
  }
  if (typeof spec.append === 'string') out = out.replace(/\s*$/, '') + '\n' + spec.append + (spec.append.endsWith('\n') ? '' : '\n')
}

writeFileSync(target, out, 'utf8')

// Kiểm chứng chống cắt cụt: đọc lại, so độ dài.
const back = readFileSync(target, 'utf8')
const okLen = Buffer.byteLength(out, 'utf8') === Buffer.byteLength(back, 'utf8') && out.length === back.length
const bal = { '{}': [count(back, '{'), count(back, '}')], '()': [count(back, '('), count(back, ')')], '[]': [count(back, '['), count(back, ']')] }
const tail = back.split('\n').slice(-3).join('\n')

console.log(`✓ Ghi ${spec.file} — ${back.length} ký tự / ${Buffer.byteLength(back, 'utf8')} byte`)
console.log(`  Toàn vẹn (đọc lại khớp độ dài): ${okLen ? 'OK' : '❌ LỆCH — NGHI CẮT CỤT'}`)
console.log(`  Cân ngoặc {}=${bal['{}'].join('/')} ()=${bal['()'].join('/')} []=${bal['[]'].join('/')}  (lệch ở .js có thể do ngoặc trong chuỗi — soi tay)`)
console.log('  3 dòng cuối:\n' + tail.split('\n').map(l => '    ' + l).join('\n'))
if (!okLen) process.exit(4)
