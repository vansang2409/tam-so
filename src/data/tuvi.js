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

/* ===== CUNG PHI & BÁT TRẠCH (hướng hợp tuổi) =====
 * Công thức & bảng tra: Wiki Batdongsan (cung-phi). Bảng du niên 8×8 đối xứng
 * (đã chỉnh 1 ô Cấn–Chấn = Lục Sát theo tính đối xứng chuẩn). Dùng năm ÂM LỊCH;
 * người sinh đầu năm dương lịch cần đối chiếu Tết. Mang tính tham khảo phong thủy. */
const CUNG_PHI_MAP = {
  1: { cung: 'Khảm', menh: 'Thủy', huong: 'Bắc' }, 2: { cung: 'Khôn', menh: 'Thổ', huong: 'Tây Nam' },
  3: { cung: 'Chấn', menh: 'Mộc', huong: 'Đông' }, 4: { cung: 'Tốn', menh: 'Mộc', huong: 'Đông Nam' },
  6: { cung: 'Càn', menh: 'Kim', huong: 'Tây Bắc' }, 7: { cung: 'Đoài', menh: 'Kim', huong: 'Tây' },
  8: { cung: 'Cấn', menh: 'Thổ', huong: 'Đông Bắc' }, 9: { cung: 'Ly', menh: 'Hỏa', huong: 'Nam' }
}
const DONG_TU = ['Khảm', 'Chấn', 'Tốn', 'Ly']
const CUNG_ORDER = ['Càn', 'Khảm', 'Cấn', 'Chấn', 'Tốn', 'Ly', 'Khôn', 'Đoài']
const CUNG_DIR = { 'Càn': 'Tây Bắc', 'Khảm': 'Bắc', 'Cấn': 'Đông Bắc', 'Chấn': 'Đông', 'Tốn': 'Đông Nam', 'Ly': 'Nam', 'Khôn': 'Tây Nam', 'Đoài': 'Tây' }
const STAR = { PV: 'Phục Vị', LS: 'Lục Sát', TY: 'Thiên Y', NQ: 'Ngũ Quỷ', HH: 'Họa Hại', TM: 'Tuyệt Mệnh', DN: 'Diên Niên', SK: 'Sinh Khí' }
export const STAR_MEANING = {
  'Sinh Khí': 'Tài lộc, thăng tiến, sinh sôi (đại cát)', 'Thiên Y': 'Sức khỏe, quý nhân, của cải (đại cát)',
  'Diên Niên': 'Hòa thuận, quan hệ bền lâu (đại cát)', 'Phục Vị': 'Ổn định, củng cố, hanh thông vừa (tiểu cát)',
  'Tuyệt Mệnh': 'Bệnh nặng, tổn thất lớn (đại hung)', 'Ngũ Quỷ': 'Thị phi, mất của, xui xẻo (đại hung)',
  'Lục Sát': 'Kiện tụng, tai tiếng, bất hòa (hung)', 'Họa Hại': 'Cãi vã, thất bại nhỏ, hao tổn (hung)'
}
const DU_NIEN = {
  'Càn': ['PV', 'LS', 'TY', 'NQ', 'HH', 'TM', 'DN', 'SK'],
  'Khảm': ['LS', 'PV', 'NQ', 'TY', 'SK', 'DN', 'TM', 'HH'],
  'Cấn': ['TY', 'NQ', 'PV', 'LS', 'TM', 'HH', 'SK', 'DN'],
  'Chấn': ['NQ', 'TY', 'LS', 'PV', 'DN', 'SK', 'HH', 'TM'],
  'Tốn': ['HH', 'SK', 'TM', 'DN', 'PV', 'TY', 'NQ', 'LS'],
  'Ly': ['TM', 'DN', 'HH', 'SK', 'TY', 'PV', 'LS', 'NQ'],
  'Khôn': ['DN', 'TM', 'SK', 'HH', 'NQ', 'LS', 'PV', 'TY'],
  'Đoài': ['SK', 'HH', 'DN', 'TM', 'LS', 'NQ', 'TY', 'PV']
}
const GOOD_ORDER = ['SK', 'TY', 'DN', 'PV'], BAD_ORDER = ['TM', 'NQ', 'LS', 'HH']
const _reduce1 = (n) => { while (n > 9) n = String(n).split('').reduce((a, b) => a + +b, 0); return n }

/** Cung phi & Bát Trạch theo năm sinh (âm lịch) + giới tính ('nam'|'nu') */
export function cungPhi(year, gender) {
  const last2 = ((year % 100) + 100) % 100
  const a = _reduce1(Math.floor(last2 / 10) + (last2 % 10))
  let q = year < 2000
    ? (gender === 'nam' ? 10 - a : _reduce1(5 + a))
    : (gender === 'nam' ? 9 - a : _reduce1(6 + a))
  q = _reduce1(q); if (q === 0) q = 9
  let quai = q
  if (q === 5) quai = gender === 'nam' ? 2 : 8
  const info = CUNG_PHI_MAP[quai]
  const row = DU_NIEN[info.cung]
  const good = [], bad = []
  CUNG_ORDER.forEach((c, i) => {
    const code = row[i]
    const item = { star: STAR[code], dir: CUNG_DIR[c], cung: c, code }
    ;(GOOD_ORDER.includes(code) ? good : bad).push(item)
  })
  good.sort((x, y) => GOOD_ORDER.indexOf(x.code) - GOOD_ORDER.indexOf(y.code))
  bad.sort((x, y) => BAD_ORDER.indexOf(x.code) - BAD_ORDER.indexOf(y.code))
  return {
    quaiSo: q, cung: info.cung, menh: info.menh, huongBanMenh: info.huong,
    menhTrach: DONG_TU.includes(info.cung) ? 'Đông tứ mệnh' : 'Tây tứ mệnh', good, bad
  }
}

/* ===== Luận tính cách 12 con giáp + ý nghĩa 30 nạp âm (dân gian, tham khảo) ===== */
export const CONGIAP_LUAN = {
  'Tý': 'Nhanh nhạy, thông minh và giỏi xoay xở, biết nắm cơ hội và tích lũy. Đôi khi hay tính toán và lo xa, nên học sự rộng rãi và tin tưởng người khác.',
  'Sửu': 'Cần cù, nhẫn nại và đáng tin, làm việc bền bỉ đến cùng. Hơi bảo thủ và ít biểu lộ cảm xúc, nên linh hoạt và cởi mở hơn.',
  'Dần': 'Dũng cảm, quyết đoán và có khí chất thủ lĩnh, dám nghĩ dám làm. Dễ nóng nảy và thích áp đặt, cần tiết chế và kiên nhẫn.',
  'Mão': 'Ôn hòa, tinh tế và khéo léo trong ứng xử, yêu cái đẹp và sự bình yên. Đôi khi ngại va chạm, nên quyết đoán hơn khi cần.',
  'Thìn': 'Tự tin, nhiều hoài bão và cuốn hút, có sức ảnh hưởng tự nhiên. Dễ kiêu và ôm mộng lớn, cần thực tế và khiêm nhường.',
  'Tỵ': 'Sâu sắc, điềm tĩnh và nhiều suy tư, trực giác nhạy bén. Khá kín đáo và hay nghi ngờ, nên mở lòng và tin người hơn.',
  'Ngọ': 'Năng động, phóng khoáng và yêu tự do, nhiệt tình và lạc quan. Dễ bốc đồng và thiếu kiên nhẫn, cần rèn sự bền bỉ.',
  'Mùi': 'Hiền hòa, giàu cảm xúc và có tâm hồn nghệ sĩ, biết cảm thông. Hơi cả nể và thiếu quyết đoán, nên vững vàng hơn.',
  'Thân': 'Thông minh, linh hoạt và hài hước, thích nghi rất nhanh. Dễ cả thèm chóng chán và tinh ranh, cần kiên định và chân thành.',
  'Dậu': 'Chỉn chu, thẳng thắn và chăm chỉ, chú ý tiểu tiết. Hơi cầu toàn và hay phê phán, nên bao dung hơn với người và mình.',
  'Tuất': 'Trung thành, chính trực và nghĩa tình, rất đáng tin cậy. Dễ lo lắng và cố chấp, nên thư giãn và linh hoạt hơn.',
  'Hợi': 'Thật thà, rộng lượng và lạc quan, sống chan hòa với mọi người. Dễ tin người và ham hưởng thụ, cần cảnh giác và kỷ luật.'
}
export const NAP_AM_NGHIA = {
  'Hải Trung Kim': 'Vàng trong biển — quý mà còn ẩn, cần thời cơ để tỏa sáng.',
  'Lư Trung Hỏa': 'Lửa trong lò — ấm áp, mạnh mẽ khi được nuôi, cần môi trường nâng đỡ.',
  'Đại Lâm Mộc': 'Cây rừng lớn — sức sống mạnh, vươn cao, độc lập và bao dung.',
  'Lộ Bàng Thổ': 'Đất ven đường — bền bỉ chịu đựng, nâng đỡ vạn vật qua lại.',
  'Kiếm Phong Kim': 'Vàng đầu mũi kiếm — sắc bén, quyết liệt, cần rèn giũa và tiết chế.',
  'Sơn Đầu Hỏa': 'Lửa trên núi — sáng rực, lan tỏa, dễ thấy nhưng cần kiểm soát.',
  'Giản Hạ Thủy': 'Nước dưới khe — trong trẻo, len lỏi bền bỉ, khiêm nhường mà thấm sâu.',
  'Thành Đầu Thổ': 'Đất đắp thành — vững chắc, che chở, có tính phòng vệ và trách nhiệm.',
  'Bạch Lạp Kim': 'Vàng chân đèn — mềm, cần được định hình, tỏa sáng khi đúng chỗ.',
  'Dương Liễu Mộc': 'Cây dương liễu — mềm mại, uyển chuyển, thích nghi và duyên dáng.',
  'Tuyền Trung Thủy': 'Nước trong suối — tinh khiết, dồi dào, âm thầm nuôi dưỡng.',
  'Ốc Thượng Thổ': 'Đất trên mái — ở vị trí cao, che chở và vững vàng bảo vệ.',
  'Tích Lịch Hỏa': 'Lửa sấm sét — bùng nổ, mạnh mẽ bất ngờ, đầy năng lượng.',
  'Tùng Bách Mộc': 'Cây tùng bách — kiên cường, bền bỉ qua giá rét, chính trực.',
  'Trường Lưu Thủy': 'Nước chảy dài — bền bỉ không ngừng, lan xa, kiên trì.',
  'Sa Trung Kim': 'Vàng trong cát — quý ẩn trong thô, cần kiên nhẫn sàng lọc.',
  'Sơn Hạ Hỏa': 'Lửa dưới núi — ấm áp gần gũi, soi sáng cho người quanh mình.',
  'Bình Địa Mộc': 'Cây đồng bằng — vững chãi, che bóng, sinh trưởng ổn định.',
  'Bích Thượng Thổ': 'Đất trên vách — bám trụ kiên cố, bảo vệ và bền lâu.',
  'Kim Bạch Kim': 'Vàng pha bạc — sáng quý, thuần khiết, có giá trị bền.',
  'Phú Đăng Hỏa': 'Lửa ngọn đèn — soi đường lặng lẽ, ấm áp và dẫn lối.',
  'Thiên Hà Thủy': 'Nước trên trời (sông Ngân) — bao la, thanh cao, tưới mát muôn nơi.',
  'Đại Trạch Thổ': 'Đất đầm lớn — màu mỡ, dung chứa, nuôi dưỡng dồi dào.',
  'Thoa Xuyến Kim': 'Vàng trang sức — tinh tế, làm đẹp, quý phái và mềm mại.',
  'Tang Đố Mộc': 'Cây dâu tằm — hữu ích, cần mẫn nuôi dưỡng, giàu đức hi sinh.',
  'Đại Khê Thủy': 'Nước khe lớn — chảy mạnh, thông suốt, kiên định tiến tới.',
  'Sa Trung Thổ': 'Đất pha cát — linh hoạt, dung hòa, cần sự kết dính để bền.',
  'Thiên Thượng Hỏa': 'Lửa trên trời (mặt trời) — rực rỡ, bao trùm, sưởi ấm vạn vật.',
  'Thạch Lựu Mộc': 'Cây thạch lựu — cứng cỏi, kết trái ngọt, bền bỉ và nồng nhiệt.',
  'Đại Hải Thủy': 'Nước biển lớn — mênh mông, sâu thẳm, bao dung và đầy quyền năng.'
}
