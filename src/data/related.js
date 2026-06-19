// Logic liên kết chéo giữa các hệ (THUẦN — không đụng DOM). Dựng khối "Nội dung
// liên quan" nối Tarot ↔ Cung hoàng đạo ↔ Thần số học theo tương ứng truyền thống
// Golden Dawn (tham khảo) + số may mắn (quan niệm phổ biến). Tách riêng để test bằng
// Node. Mỗi builder trả ≥3 link nội bộ, tối đa 1 link mỗi HỆ (đa dạng, không trùng hệ).

import { TAROT_CARDS, cardSlug } from './tarot.js'
import { ZODIAC, ZODIAC_SLUG, LUCKY } from './zodiac.js'
import { NUMEROLOGY } from './numerology.js'

// Ẩn Chính ↔ cung hoàng đạo (hệ Golden Dawn): 12/22 lá Ẩn Chính ứng 1 cung.
const SIGN_MAJOR_ID = {
  Aries: 4, Taurus: 5, Gemini: 6, Cancer: 7, Leo: 8, Virgo: 9,
  Libra: 11, Scorpio: 13, Sagittarius: 14, Capricorn: 15, Aquarius: 17, Pisces: 18
}
const MAJOR_ID_SIGN = Object.fromEntries(Object.entries(SIGN_MAJOR_ID).map(([en, id]) => [id, en]))

const majorById = id => TAROT_CARDS.find(c => c.arcana === 'major' && c.id === id) || null
const signByEn = en => ZODIAC.find(z => z.en === en) || null

// Hub mỗi hệ — link dự phòng khi thiếu ánh xạ cụ thể (luôn đủ đa hệ).
export const HUBS = {
  tarot:   { sys: 'Tarot',          to: '/tarot',          title: 'Thư viện 78 lá Tarot', note: 'Tra ý nghĩa từng lá bài' },
  num:     { sys: 'Thần số học',    to: '/than-so-hoc',    title: 'Thần số học',          note: 'Tính Số Chủ Đạo từ ngày sinh' },
  zodiac:  { sys: 'Cung hoàng đạo', to: '/cung-hoang-dao', title: '12 cung hoàng đạo',    note: 'Xem cung & tử vi hôm nay' },
  iching:  { sys: 'Kinh Dịch',      to: '/kinh-dich',      title: 'Gieo quẻ Kinh Dịch',   note: '64 quẻ theo Thoán & hào' },
  profile: { sys: 'Hồ sơ',          to: '/ho-so',          title: 'Hồ sơ tổng hợp',       note: 'Gộp mọi hệ vào một trang' }
}

// Rút số về 1 chữ số (bỏ qua master) — phục vụ dò cung theo số may mắn.
function fullReduce(n) { let x = Math.abs(+n) || 0; while (x > 9) x = String(x).split('').reduce((a, b) => a + +b, 0); return x }

// Số may mắn đầu tiên của 1 cung (LUCKY.so kiểu '1, 9').
function firstLucky(en) { const m = String((LUCKY[en] && LUCKY[en].so) || '').match(/\d+/); return m ? +m[0] : null }
// Cung có chứa số n trong danh sách may mắn.
function luckyHas(en, n) { return new RegExp('\\b' + n + '\\b').test(String((LUCKY[en] && LUCKY[en].so) || '')) }

// Lá Ẩn Chính ứng 1 con số (theo số thứ tự lá — hệ số học, tham khảo).
function majorForNumber(k) {
  const n = +k
  if (n >= 1 && n <= 9) return majorById(n)
  if (n === 11) return majorById(11)   // Công Lý
  if (n === 22) return majorById(0)     // Gã Khờ (0/22)
  return null                           // 33: không có lá tương ứng trực tiếp
}

// Cung ứng 1 lá (Ẩn Chính trực tiếp; Ẩn Phụ: bóc tên cung trong chuỗi 'astro').
function signEnFromCard(card) {
  if (!card) return null
  if (card.arcana === 'major') return MAJOR_ID_SIGN[card.id] || null
  if (card.astro) { const m = card.astro.match(/trong (.+?)\s*$/); if (m) { const z = ZODIAC.find(s => s.ten === m[1].trim()); return z ? z.en : null } }
  return null
}
// Con số ứng 1 lá: Ẩn Chính theo id; Ẩn Phụ theo số nút (Át=1, 2..10); lá hình người → không.
function numForCard(card) {
  if (!card) return null
  if (card.arcana === 'major') { const r = fullReduce(card.id); return r >= 1 ? r : null }
  const r = card.roman
  if (r === 'Át' || r === 'Ace') return 1
  if (/^\d+$/.test(String(r))) return fullReduce(+r)
  return null
}

// Giữ tối đa 1 link mỗi HỆ; thêm link dự phòng (đa hệ) cho đủ "min".
function build(primary, fallbacks, min) {
  const seen = new Set(); const out = []
  for (const x of primary) { if (x && !seen.has(x.sys)) { seen.add(x.sys); out.push(x) } }
  for (const f of fallbacks) { if (out.length >= min) break; if (!seen.has(f.sys)) { seen.add(f.sys); out.push(f) } }
  return out
}

// ===== Builders công khai (trả mảng { sys, to, title, note }) =====

// Trang sâu CUNG → lá Tarot tương ứng + số may mắn + hệ khác.
export function relatedForSign(en, min = 3) {
  const z = signByEn(en); if (!z) return []
  const primary = []
  const mj = majorById(SIGN_MAJOR_ID[en])
  if (mj) primary.push({ sys: 'Tarot', to: '/tarot/' + cardSlug(mj), title: mj.nameVi + ' (' + mj.name + ')', note: 'Lá Ẩn Chính ứng ' + z.ten + ' (Golden Dawn, tham khảo)' })
  const ln = firstLucky(en)
  if (ln && NUMEROLOGY[ln]) primary.push({ sys: 'Thần số học', to: '/than-so-hoc/so/' + ln, title: 'Số ' + ln + ' — ' + NUMEROLOGY[ln].keys[0], note: 'Con số may mắn của ' + z.ten })
  return build(primary, [HUBS.iching, HUBS.profile, HUBS.tarot], min)
}

// Trang sâu LÁ Tarot → cung hoàng đạo tương ứng + con số tương ứng + hệ khác.
export function relatedForCard(card, min = 3) {
  if (!card) return []
  const primary = []
  const en = signEnFromCard(card)
  if (en) { const z = signByEn(en); primary.push({ sys: 'Cung hoàng đạo', to: '/cung-hoang-dao/' + ZODIAC_SLUG[en], title: z.ten + ' (' + en + ')', note: 'Cung hoàng đạo ứng lá này (Golden Dawn, tham khảo)' }) }
  const nr = numForCard(card)
  if (nr && NUMEROLOGY[nr]) primary.push({ sys: 'Thần số học', to: '/than-so-hoc/so/' + nr, title: 'Số ' + nr + ' — ' + NUMEROLOGY[nr].keys[0], note: 'Con số tương ứng (hệ số học, tham khảo)' })
  return build(primary, [HUBS.iching, HUBS.profile, HUBS.zodiac, HUBS.num], min)
}

// Trang sâu SỐ CHỦ ĐẠO → cung có số may mắn liên hệ + lá Ẩn Chính cùng số + hệ khác.
export function relatedForNumber(k, min = 3) {
  if (!NUMEROLOGY[k]) return []
  const primary = []
  let sg = ZODIAC.find(z => luckyHas(z.en, +k))
  if (!sg) { const sd = fullReduce(k); sg = ZODIAC.find(z => luckyHas(z.en, sd)) }
  if (sg) primary.push({ sys: 'Cung hoàng đạo', to: '/cung-hoang-dao/' + ZODIAC_SLUG[sg.en], title: sg.ten + ' (' + sg.en + ')', note: 'Cung có số may mắn liên hệ ' + k })
  const mj = majorForNumber(k)
  if (mj) primary.push({ sys: 'Tarot', to: '/tarot/' + cardSlug(mj), title: mj.nameVi + ' (' + mj.name + ')', note: 'Lá Ẩn Chính số ' + k + ' (hệ số học, tham khảo)' })
  return build(primary, [HUBS.iching, HUBS.profile, HUBS.tarot], min)
}
