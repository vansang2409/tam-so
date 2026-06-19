/* 12 CON GIÁP — dữ liệu cho trang "Tử vi hôm nay theo con giáp".
 * Dữ kiện (con giáp, hành, giờ, tam/lục hợp, lục xung) theo Can Chi truyền thống —
 * kiểm chứng được. Phần luận tính cách & "tử vi hôm nay" là quan niệm dân gian,
 * mang tính THAM KHẢO — không phải tiên đoán, không phải khoa học.
 * Nguồn: Lục thập hoa giáp (Wikipedia tiếng Việt); xem src/data/tuvi.js. */
import { DIA_CHI, CONGIAP_LUAN, TAM_HOP, LUC_HOP, LUC_XUNG, TU_HANH_XUNG } from './tuvi.js'
import { dailyReading } from './zodiac.js'

// Slug ASCII không dấu, ĐÃ phân biệt Tý↔Tỵ (ty↔ti) và Thìn↔Thân (thin↔than).
export const CONGIAP_SLUG = {
  'Tý': 'ty', 'Sửu': 'suu', 'Dần': 'dan', 'Mão': 'mao', 'Thìn': 'thin', 'Tỵ': 'ti',
  'Ngọ': 'ngo', 'Mùi': 'mui', 'Thân': 'than', 'Dậu': 'dau', 'Tuất': 'tuat', 'Hợi': 'hoi'
}

// Vài năm sinh gần đây cho mỗi chi (chu kỳ 12 năm) — giúp người dùng nhận ra tuổi mình.
const _BASE = { 'Tý': 2008, 'Sửu': 2009, 'Dần': 2010, 'Mão': 2011, 'Thìn': 2012, 'Tỵ': 2013, 'Ngọ': 2014, 'Mùi': 2015, 'Thân': 2016, 'Dậu': 2017, 'Tuất': 2018, 'Hợi': 2019 }
export function recentYears(chi, count = 4, until = 2026) {
  const base = _BASE[chi]; if (base == null) return []
  const out = []
  for (let y = base - 48; y <= until; y += 12) out.push(y) // lùi 4 chu kỳ → gần "until" nhất
  return out.slice(-count)
}

// Danh sách 12 con giáp đã gắn slug + luận tính cách (dùng cho trang index & detail).
export const CONGIAP = DIA_CHI.map(c => ({
  ...c, slug: CONGIAP_SLUG[c.ten], luan: CONGIAP_LUAN[c.ten] || ''
}))

export function conGiapBySlug(slug) { return CONGIAP.find(c => c.slug === slug) || null }

// Quan hệ hợp/khắc của một chi (dữ kiện Can Chi, tham khảo cho luận đoán dân gian).
export function hopKhacChi(chi) {
  const others = g => g.filter(x => x !== chi)
  const tam = TAM_HOP.find(g => g.includes(chi))
  const luc = LUC_HOP.find(g => g.includes(chi))
  const xung = LUC_XUNG.find(g => g.includes(chi))
  const tuxung = TU_HANH_XUNG.find(g => g.includes(chi))
  return {
    tamHop: tam ? others(tam) : [],
    lucHop: luc ? others(luc)[0] : null,
    lucXung: xung ? others(xung)[0] : null,
    tuHanhXung: tuxung ? others(tuxung) : []
  }
}

// Tử vi HÔM NAY theo con giáp — tất định theo (chi, ngày). Tái dùng engine chung.
export function dailyConGiap(chi, dateStr) { return dailyReading('chi:' + chi, dateStr) }

// Liên kết chéo nội bộ (≥3, tối đa 1 mỗi hệ) — giữ giọng tham khảo.
export function relatedForConGiap(chi, min = 3) {
  const items = [
    { sys: 'Tử vi', to: '/tu-vi', title: 'Tử vi & Can Chi', note: 'Tính Can Chi, nạp âm, mệnh theo năm sinh' },
    { sys: 'Tương hợp', to: '/tuong-hop', title: 'Xem hợp tuổi', note: 'So tuổi đôi lứa: tam hợp – lục hợp – xung' },
    { sys: 'Lá số', to: '/la-so-tu-vi', title: 'Lá số Tử Vi', note: 'Lập lá số đầy đủ từ giờ – ngày – tháng – năm sinh' },
    { sys: 'Hồ sơ', to: '/ho-so', title: 'Hồ sơ tổng hợp', note: 'Gộp mọi hệ vào một trang' }
  ]
  return items.slice(0, Math.max(min, 3))
}
/* === end congiap.js === */
