/* TỬ VI / CAN CHI.
 * Phần tính Can–Chi–nạp âm là lịch pháp (kiểm chứng được, chu kỳ 60 năm).
 * Phần luận giải con giáp là quan niệm dân gian — tham khảo, không phải khoa học.
 * Nguồn: Wiki Batdongsan; Lục thập hoa giáp (Wikipedia tiếng Việt). */

export const THIEN_CAN = [
  { ten: 'Giáp', hanh: 'Mộc', amduong: 'Dương' }, { ten: 'Ất', hanh: 'Mộc', amduong: 'Âm' },
  { ten: 'Bính', hanh: 'Hỏa', amduong: 'Dương' }, { ten: 'Đinh', hanh: 'Hỏa', amduong: 'Âm' },
  { ten: 'Mậu', hanh: 'Thổ', amduong: 'Dương' }, { ten: 'Kỷ', hanh: 'Thổ', amduong: 'Âm' },
  { ten: 'Canh', hanh: 'Kim', amduong: 'Dương' }, { ten: 'Tân', hanh: 'Kim', amduong: 'Âm' },
  { ten: 'Nhâm', hanh: 'Thủy', amduong: 'Dương' }, { ten: 'Quý', hanh: 'Thủy', amduong: 'Âm' }
]

export const DIA_CHI = [
  { ten: 'Tý', con: 'Chuột', hanh: 'Thủy', amduong: 'Dương', net: 'nhanh nhạy, tháo vát, biết tích lũy' },
  { ten: 'Sửu', con: 'Trâu', hanh: 'Thổ', amduong: 'Âm', net: 'cần cù, kiên nhẫn, đáng tin' },
  { ten: 'Dần', con: 'Hổ', hanh: 'Mộc', amduong: 'Dương', net: 'dũng cảm, quyết đoán, có uy' },
  { ten: 'Mão', con: 'Mèo', hanh: 'Mộc', amduong: 'Âm', net: 'ôn hòa, tinh tế, khéo léo' },
  { ten: 'Thìn', con: 'Rồng', hanh: 'Thổ', amduong: 'Dương', net: 'tự tin, nhiều hoài bão, lôi cuốn' },
  { ten: 'Tỵ', con: 'Rắn', hanh: 'Hỏa', amduong: 'Âm', net: 'sâu sắc, điềm tĩnh, nhiều suy tư' },
  { ten: 'Ngọ', con: 'Ngựa', hanh: 'Hỏa', amduong: 'Dương', net: 'năng động, phóng khoáng, yêu tự do' },
  { ten: 'Mùi', con: 'Dê', hanh: 'Thổ', amduong: 'Âm', net: 'hiền hòa, nghệ sĩ, giàu cảm xúc' },
  { ten: 'Thân', con: 'Khỉ', hanh: 'Kim', amduong: 'Dương', net: 'thông minh, linh hoạt, hài hước' },
  { ten: 'Dậu', con: 'Gà', hanh: 'Kim', amduong: 'Âm', net: 'chỉn chu, thẳng thắn, chăm chỉ' },
  { ten: 'Tuất', con: 'Chó', hanh: 'Thổ', amduong: 'Dương', net: 'trung thành, chính trực, nghĩa tình' },
  { ten: 'Hợi', con: 'Lợn', hanh: 'Thủy', amduong: 'Âm', net: 'thật thà, rộng lượng, lạc quan' }
]

/* 30 nạp âm Lục Thập Hoa Giáp, bắt đầu từ Giáp Tý (mỗi nạp âm bao 2 năm) */
export const NAP_AM = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
  'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'
]

export const NGU_HANH = {
  sinh: { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' },
  khac: { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' },
  mau: { Kim: 'Trắng / Ánh kim', Mộc: 'Xanh lá', Thủy: 'Đen / Xanh dương', Hỏa: 'Đỏ / Cam / Tím', Thổ: 'Vàng / Nâu' }
}

export function invSinh(h) { for (const k in NGU_HANH.sinh) if (NGU_HANH.sinh[k] === h) return k; return '?' }
export function invKhac(h) { for (const k in NGU_HANH.khac) if (NGU_HANH.khac[k] === h) return k; return '?' }

/** Tính Can Chi từ năm dương lịch */
export function tinhCanChi(year) {
  const mod = (n, m) => ((n % m) + m) % m
  const canIndex = mod(year - 4, 10)
  const chiIndex = mod(year - 4, 12)
  const cycleIndex = mod(year - 4, 60)
  const can = THIEN_CAN[canIndex], chi = DIA_CHI[chiIndex]
  const napAm = NAP_AM[Math.floor(cycleIndex / 2)]
  return {
    year, can: can.ten, canHanh: can.hanh, canAmDuong: can.amduong,
    chi: chi.ten, conGiap: chi.con, chiNet: chi.net,
    tenCanChi: can.ten + ' ' + chi.ten, napAm, menhHanh: napAm.split(' ').pop()
  }
}

/* ===== XEM HỢP TUỔI (địa chi & thiên can & ngũ hành nạp âm) — truyền thống, tham khảo ===== */
export const TAM_HOP = [['Thân', 'Tý', 'Thìn'], ['Dần', 'Ngọ', 'Tuất'], ['Tỵ', 'Dậu', 'Sửu'], ['Hợi', 'Mão', 'Mùi']]
export const LUC_HOP = [['Tý', 'Sửu'], ['Dần', 'Hợi'], ['Mão', 'Tuất'], ['Thìn', 'Dậu'], ['Tỵ', 'Thân'], ['Ngọ', 'Mùi']]
export const TU_HANH_XUNG = [['Dần', 'Thân', 'Tỵ', 'Hợi'], ['Thìn', 'Tuất', 'Sửu', 'Mùi'], ['Tý', 'Ngọ', 'Mão', 'Dậu']]
export const LUC_XUNG = [['Tý', 'Ngọ'], ['Sửu', 'Mùi'], ['Dần', 'Thân'], ['Mão', 'Dậu'], ['Thìn', 'Tuất'], ['Tỵ', 'Hợi']]
export const CAN_HOP = [['Giáp', 'Kỷ'], ['Ất', 'Canh'], ['Bính', 'Tân'], ['Đinh', 'Nhâm'], ['Mậu', 'Quý']]

export function xemHopTuoi(y1, y2) {
  const a = tinhCanChi(y1), b = tinhCanChi(y2)
  const inGroup = (groups) => groups.some(g => g.includes(a.chi) && g.includes(b.chi))
  const chiTamHop = inGroup(TAM_HOP)
  const chiLucHop = inGroup(LUC_HOP)
  const chiLucXung = inGroup(LUC_XUNG)
  const chiTuXung = a.chi !== b.chi && inGroup(TU_HANH_XUNG)
  const canHop = CAN_HOP.some(g => g.includes(a.can) && g.includes(b.can))
  const h1 = a.menhHanh, h2 = b.menhHanh
  let hanhRel
  if (h1 === h2) hanhRel = { type: 'Đồng hành', note: `Cùng mệnh ${h1}.` }
  else if (NGU_HANH.sinh[h1] === h2 || NGU_HANH.sinh[h2] === h1) hanhRel = { type: 'Tương sinh', note: `${h1} và ${h2} sinh trợ nhau.` }
  else if (NGU_HANH.khac[h1] === h2 || NGU_HANH.khac[h2] === h1) hanhRel = { type: 'Tương khắc', note: `${h1} và ${h2} khắc nhau.` }
  else hanhRel = { type: 'Bình hòa', note: `${h1} và ${h2} không trực tiếp sinh/khắc.` }

  let score = 0; const notes = []
  if (chiTamHop) { score += 2; notes.push('Địa chi Tam hợp (rất hợp)') }
  if (chiLucHop) { score += 2; notes.push('Địa chi Lục hợp (hợp)') }
  if (canHop) { score += 1; notes.push('Thiên can tương hợp') }
  if (hanhRel.type === 'Tương sinh') { score += 2; notes.push('Ngũ hành tương sinh') }
  else if (hanhRel.type === 'Đồng hành') { score += 1; notes.push('Ngũ hành đồng hành') }
  if (chiLucXung) { score -= 2; notes.push('Địa chi Lục xung (trực xung)') }
  else if (chiTuXung) { score -= 1; notes.push('Cùng nhóm Tứ hành xung') }
  if (hanhRel.type === 'Tương khắc') { score -= 2; notes.push('Ngũ hành tương khắc') }
  if (notes.length === 0) notes.push('Không có quan hệ hợp/xung nổi bật')

  let verdict
  if (score >= 3) verdict = 'Rất hợp'
  else if (score >= 1) verdict = 'Hợp'
  else if (score === 0) verdict = 'Bình hòa'
  else if (score >= -2) verdict = 'Cần lưu ý'
  else verdict = 'Khá xung khắc'
  return { a, b, chiTamHop, chiLucHop, chiTuXung, chiLucXung, canHop, hanhRel, score, verdict, notes }
}

/* ===== Can Chi NGÀY & GIỜ · Giờ hoàng đạo · Tam Tai =====
 * Day pillar hiệu chỉnh theo mốc đã kiểm chứng: 1/3/2000 = Mậu Ngọ.
 * Hour pillar theo "ngũ thử độn". Giờ hoàng đạo theo bảng truyền thống.
 * Nguồn: vanhoavaphattrien.vn (can chi ngày), Giờ hoàng đạo (Wikipedia/lịch vạn niên). */
const _CAN = THIEN_CAN.map(c => c.ten)
const _CHI = DIA_CHI.map(c => c.ten)
const _mod = (n, m) => ((n % m) + m) % m
const _dayNum = (y, mo, d) => Math.floor(Date.UTC(y, mo - 1, d) / 86400000)
const _N0 = _dayNum(2000, 3, 1)
const GIO_RANGE = ['23–1', '1–3', '3–5', '5–7', '7–9', '9–11', '11–13', '13–15', '15–17', '17–19', '19–21', '21–23']

export function dayCanChi(y, mo, d) {
  const delta = _dayNum(y, mo, d) - _N0
  const canIdx = _mod(4 + delta, 10), chiIdx = _mod(6 + delta, 12)
  return { canIdx, chiIdx, can: _CAN[canIdx], chi: _CHI[chiIdx], tenCanChi: _CAN[canIdx] + ' ' + _CHI[chiIdx] }
}

export function hourCanChi(dayCanIdx, hour) {
  const branch = Math.floor(_mod(hour + 1, 24) / 2)
  const start = _mod((dayCanIdx % 5) * 2, 10)
  const ci = _mod(start + branch, 10)
  return { can: _CAN[ci], chi: _CHI[branch], tenCanChi: _CAN[ci] + ' ' + _CHI[branch], range: GIO_RANGE[branch] }
}

const HD = {
  'Tý': ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu'], 'Ngọ': ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu'],
  'Sửu': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'], 'Mùi': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'],
  'Dần': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'], 'Thân': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  'Mão': ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'], 'Dậu': ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
  'Thìn': ['Dần', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi'], 'Tuất': ['Dần', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
  'Tỵ': ['Sửu', 'Thìn', 'Ngọ', 'Mùi', 'Tuất', 'Hợi'], 'Hợi': ['Sửu', 'Thìn', 'Ngọ', 'Mùi', 'Tuất', 'Hợi']
}
export function gioHoangDao(dayChi) {
  const good = new Set(HD[dayChi] || [])
  return _CHI.map((chi, i) => ({ chi, range: GIO_RANGE[i], hoangdao: good.has(chi) }))
}

const TAM_TAI = [
  { nhom: ['Thân', 'Tý', 'Thìn'], nam: ['Dần', 'Mão', 'Thìn'] },
  { nhom: ['Tỵ', 'Dậu', 'Sửu'], nam: ['Hợi', 'Tý', 'Sửu'] },
  { nhom: ['Dần', 'Ngọ', 'Tuất'], nam: ['Thân', 'Dậu', 'Tuất'] },
  { nhom: ['Hợi', 'Mão', 'Mùi'], nam: ['Tỵ', 'Ngọ', 'Mùi'] }
]
export function tamTai(birthYear) {
  const chi = tinhCanChi(birthYear).chi
  const g = TAM_TAI.find(t => t.nhom.includes(chi))
  return { chi, nhom: g ? g.nhom : [], nam: g ? g.nam : [] }
}
