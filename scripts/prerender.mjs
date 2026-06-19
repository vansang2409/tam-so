/* C01 — Prerender META tĩnh cho route landing (chạy SAU `vite build`).
 * Mục tiêu: crawler "view source" thấy <title>/description/canonical/og/JSON-LD ĐÚNG theo từng
 * trang, thay vì meta site-level chung. KHÔNG phải SSR body (body vẫn #root rỗng + SPA hydrate).
 *
 * AN TOÀN:
 *  - CHỈ ghi thêm file dist/<route>/index.html; KHÔNG sửa dist/index.html ⇒ file:// nguyên vẹn.
 *  - GUARD: chỉ chạy khi build dùng base TUYỆT ĐỐI (asset "/assets/…"). Nếu base tương đối
 *    ("./assets") — như bản GitHub Pages/file:// — thì BỎ QUA để không vỡ đường dẫn asset ở route con.
 *  - Bọc try/catch: lỗi gì cũng exit 0, KHÔNG làm hỏng `npm run build`/deploy.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url)) + '/..'
const DIST = ROOT + '/dist'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function applyMeta(html, m, breadcrumb) {
  const repl = (re, val) => { if (re.test(html)) html = html.replace(re, val) }
  repl(/<title>[\s\S]*?<\/title>/, '<title>' + esc(m.title) + '</title>')
  repl(/(<meta name="description" content=")[^"]*(")/, '$1' + esc(m.description) + '$2')
  repl(/(<meta property="og:title" content=")[^"]*(")/, '$1' + esc(m.title) + '$2')
  repl(/(<meta property="og:description" content=")[^"]*(")/, '$1' + esc(m.description) + '$2')
  repl(/(<meta property="og:url" content=")[^"]*(")/, '$1' + esc(m.url) + '$2')
  repl(/(<meta property="og:image" content=")[^"]*(")/, '$1' + esc(m.image) + '$2')
  repl(/(<meta name="twitter:title" content=")[^"]*(")/, '$1' + esc(m.title) + '$2')
  repl(/(<meta name="twitter:description" content=")[^"]*(")/, '$1' + esc(m.description) + '$2')
  repl(/(<meta name="twitter:image" content=")[^"]*(")/, '$1' + esc(m.image) + '$2')
  repl(/(<link rel="canonical" href=")[^"]*(")/, '$1' + esc(m.url) + '$2')
  // chèn JSON-LD breadcrumb ngay trước </head>
  if (breadcrumb) {
    const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumb.map((it, i) => { const e = { '@type': 'ListItem', position: i + 1, name: it.name }; if (it.path) e.item = it.url; return e }) }
    html = html.replace('</head>', '  <script type="application/ld+json" data-prerender="breadcrumb">' + JSON.stringify(ld) + '</script>\n</head>')
  }
  return html
}

async function main() {
  const tpl = readFileSync(DIST + '/index.html', 'utf8')
  // GUARD base tuyệt đối
  if (!/src="\/assets\//.test(tpl)) {
    console.log('[prerender] BỎ QUA: build dùng base tương đối (không phải Vercel) — không tạo file route con.')
    return
  }
  const Z = await import('../src/data/zodiac.js')
  const T = await import('../src/data/tarot.js')
  const N = await import('../src/data/numerology.js')
  const CG = await import('../src/data/congiap.js')
  const V = await import('../src/data/tuvi.js')
  const SEO = await import('../src/data/seo.js')
  const A = SEO.absUrl, OG = SEO.OG_IMAGE
  const home = { name: 'Trang chủ', path: '/' }
  const bc = (...items) => [home, ...items].map(it => ({ ...it, url: it.path ? A(it.path) : undefined }))

  const routes = []
  const add = (path, title, description, image, breadcrumb) => routes.push({ path, title, description, image: image || OG, breadcrumb })

  // Hub
  add('/tarot', 'Tarot online — trải bài & ý nghĩa 78 lá (Rider–Waite) | Tam Sở', 'Rút Tarot online nhiều kiểu trải và tra ý nghĩa 78 lá xuôi/ngược theo bộ Rider–Waite. Gợi mở để chiêm nghiệm, không phải lời tiên đoán chắc chắn.', OG, bc({ name: 'Tarot' }))
  add('/cung-hoang-dao', '12 cung hoàng đạo — xem cung theo ngày sinh & tử vi hôm nay | Tam Sở', 'Xác định cung hoàng đạo theo ngày sinh, xem nét tính cách 12 cung, tương hợp nguyên tố và tử vi hôm nay. Chiêm tinh phương Tây mang tính tham khảo.', OG, bc({ name: 'Cung hoàng đạo' }))
  add('/than-so-hoc', 'Thần số học — tính Số Chủ Đạo & các chỉ số từ ngày sinh, tên | Tam Sở', 'Tính Số Chủ Đạo, Vận Mệnh, Linh Hồn, Nhân Cách, Năm cá nhân theo Thần số học Pythagore. Dữ kiện tính toán kèm diễn giải để tham khảo.', OG, bc({ name: 'Thần số học' }))
  add('/kinh-dich', 'Kinh Dịch — gieo quẻ online & tra 64 quẻ (Thoán, hào) | Tam Sở', 'Gieo quẻ Kinh Dịch và tra ý nghĩa 64 quẻ với lời Thoán cùng 384 hào (bản Legge 1899). Tham khảo để chiêm nghiệm, không phải lời phán chắc chắn.', OG, bc({ name: 'Kinh Dịch' }))
  add('/tu-vi', 'Tử vi & Can Chi — tuổi, âm lịch, hợp tuổi, sao hạn | Tam Sở', 'Tra Can Chi tuổi, ngày âm lịch, hợp tuổi – xung khắc, Tam Tai, Bát Trạch và sao hạn theo năm. Dữ kiện lịch pháp kèm diễn giải để tham khảo.', OG, bc({ name: 'Tử vi & Can Chi' }))
  add('/la-so-tu-vi', 'Lập lá số Tử Vi Đẩu Số online (an sao tất định) | Tam Sở', 'Lập lá số Tử Vi từ giờ – ngày – tháng – năm sinh: an 14 chính tinh, Tứ Hóa, độ sáng và đại hạn. Phần an sao kiểm chứng được, phần luận để tham khảo.', OG, bc({ name: 'Lá số Tử Vi' }))
  add('/con-giap', 'Tử vi hôm nay 12 con giáp — Tý, Sửu, Dần… | Tam Sở', 'Xem tử vi hôm nay theo 12 con giáp, tính cách từng tuổi và hợp – khắc tuổi theo Can Chi. Quan niệm dân gian, mang tính tham khảo, làm mới mỗi ngày.', OG, bc({ name: '12 con giáp' }))
  add('/hop-tuoi', 'Hợp tuổi 12 con giáp — tuổi nào hợp tuổi nào? | Tam Sở', 'Tra hợp – khắc tuổi 12 con giáp theo Tam hợp, Lục hợp, Lục xung (Can Chi). Quan niệm dân gian, mang tính tham khảo.', OG, bc({ name: 'Hợp tuổi' }))
  add('/sinh-nam', 'Sinh năm bao nhiêu mệnh gì? Can Chi – nạp âm – hợp tuổi | Tam Sở', 'Nhập năm sinh để biết cầm tinh con gì, Can Chi, ngũ hành nạp âm (mệnh), tính cách và hợp – khắc tuổi. Dữ kiện lịch pháp, phần luận mang tính tham khảo.', OG, bc({ name: 'Sinh năm' }))

  // 12 cung
  for (const z of Z.ZODIAC) add('/cung-hoang-dao/' + Z.ZODIAC_SLUG[z.en], z.ten + ' (' + z.en + ') — tính cách, tình yêu, công việc & tử vi hôm nay | Tam Sở', z.ten + ' (' + z.en + '): ' + z.net + ' Xem chân dung, tình yêu, công việc, tài chính, cung hợp và tử vi hôm nay tại Tam Sở.', OG, bc({ name: 'Cung hoàng đạo', path: '/cung-hoang-dao' }, { name: z.ten }))
  // 78 tarot
  for (const c of T.TAROT_CARDS) add('/tarot/' + T.cardSlug(c), c.nameVi + ' (' + c.name + ') — ý nghĩa xuôi, ngược, tình yêu & công việc | Tam Sở', c.nameVi + ' (' + c.name + '): ' + (c.desc || '') + ' Ý nghĩa khi xuôi, khi ngược, trong tình yêu và công việc — Tam Sở.', T.cardImageFile(c) ? A('/cards/' + T.cardImageFile(c)) : OG, bc({ name: 'Tarot', path: '/tarot' }, { name: c.nameVi }))
  // 12 số
  for (const k of Object.keys(N.NUMEROLOGY)) { const n = N.NUMEROLOGY[k]; add('/than-so-hoc/so/' + k, n.title + ' — ý nghĩa Số Chủ Đạo trong Thần số học | Tam Sở', n.title + ': ' + n.desc, OG, bc({ name: 'Thần số học', path: '/than-so-hoc' }, { name: 'Số ' + k })) }
  // 12 con giáp
  for (const c of CG.CONGIAP) add('/con-giap/' + c.slug, 'Tuổi ' + c.ten + ' (' + c.con + ') — tính cách, hợp tuổi & tử vi hôm nay | Tam Sở', 'Tuổi ' + c.ten + ' (con ' + c.con + ', hành ' + c.hanh + '): ' + c.net + '. Xem chân dung, hợp – khắc tuổi và tử vi hôm nay. Quan niệm dân gian, mang tính tham khảo.', OG, bc({ name: '12 con giáp', path: '/con-giap' }, { name: 'Tuổi ' + c.ten }))
  // 12 hợp tuổi
  for (const c of CG.CONGIAP) add('/hop-tuoi/' + c.slug, 'Tuổi ' + c.ten + ' hợp tuổi nào? Hợp – khắc tuổi ' + c.ten + ' (' + c.con + ') | Tam Sở', 'Tuổi ' + c.ten + ' (' + c.con + ') hợp tuổi nào, khắc tuổi nào theo Tam hợp – Lục hợp – Lục xung (Can Chi). Dữ kiện truyền thống, mang tính tham khảo.', OG, bc({ name: 'Hợp tuổi', path: '/hop-tuoi' }, { name: 'Tuổi ' + c.ten }))
  // sinh năm 1950–2025
  for (let y = 1950; y <= 2025; y++) { const cc = V.tinhCanChi(y); add('/sinh-nam/' + y, 'Sinh năm ' + y + ' (' + cc.tenCanChi + ') mệnh gì? Hợp tuổi nào, tính cách | Tam Sở', 'Người sinh năm ' + y + ' cầm tinh con ' + cc.conGiap + ' (' + cc.chi + '), Can Chi ' + cc.tenCanChi + ', ngũ hành nạp âm ' + cc.napAm + ' (mệnh ' + cc.menhHanh + '). Xem tính cách, hợp – khắc tuổi.', OG, bc({ name: 'Sinh năm', path: '/sinh-nam' }, { name: 'Năm ' + y })) }

  let n = 0
  for (const r of routes) {
    const html = applyMeta(tpl, { title: r.title, description: r.description, url: A(r.path), image: r.image }, r.breadcrumb)
    const out = DIST + r.path + '/index.html'
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, html)
    n++
  }
  console.log('[prerender] đã tạo meta tĩnh cho ' + n + ' route landing.')
}

main().catch(e => { console.warn('[prerender] BỎ QUA do lỗi (không chặn build):', e.message); process.exitCode = 0 })
