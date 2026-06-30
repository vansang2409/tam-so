/* Dữ liệu "Đi nhà thờ" - không gian nhà thờ online hư cấu, tham khảo văn hóa Công giáo.
 * Tách rõ: trải nghiệm chiêm niệm cá nhân, KHÔNG thay việc tham dự Thánh lễ, cầu nguyện hay gặp linh mục thật. */

export const NHATHO_SPACES = [
  { id: 'gian-chinh', image: 'nha-tho-tam-so', ten: 'Gian chính', icon: 'NT', tone: 'amber', title: 'Lối giữa & bàn thờ', desc: 'Không gian trung tâm với hàng ghế gỗ, lối đi giữa và bàn thờ ở phía trước. Dùng để dừng lại, thở chậm và đặt một ý nguyện bình an.', action: 'Chiêm niệm' },
  { id: 'nen-cau-nguyen', image: 'nha-tho-nen-cau-nguyen', ten: 'Nến cầu nguyện', icon: 'NE', tone: 'rose', title: 'Góc nến nhỏ', desc: 'Một góc thắp nến tượng trưng cho lời cầu nguyện âm thầm. Nến trong Tam Sở chỉ là cử chỉ online, không thay nghi thức thật.', action: 'Thắp nến' },
  { id: 'kinh-mau', image: 'nha-tho-kinh-mau', ten: 'Kính màu', icon: 'KM', tone: 'sky', title: 'Ánh sáng qua kính màu', desc: 'Kính màu gợi cảm giác ánh sáng đi qua nhiều sắc độ: đôi khi một việc cần được nhìn lại bằng lòng hiền hòa hơn.', action: 'Nhìn lại' },
  { id: 'thanh-ca', image: 'nha-tho-thanh-ca', ten: 'Thánh ca', icon: 'TC', tone: 'violet', title: 'Khoảng lặng của âm nhạc', desc: 'Không phát nhạc thật để tránh bản quyền; phần này dùng nhịp sáng và câu gợi ý để tạo cảm giác lắng nghe trong im lặng.', action: 'Lắng nghe' },
  { id: 'sach-thanh', image: 'nha-tho-sach-thanh', ten: 'Sách & suy niệm', icon: 'ST', tone: 'emerald', title: 'Bàn đọc nhỏ', desc: 'Một nơi ghi lại điều đang suy nghĩ. Nội dung bạn nhập chỉ lưu trong trình duyệt, không gửi lên máy chủ.', action: 'Ghi chú' },
  { id: 'san-chuong', image: 'nha-tho-san-chuong', ten: 'Sân chuông', icon: 'CH', tone: 'slate', title: 'Tiếng chuông xa', desc: 'Khoảng sân trước tháp chuông, dùng như điểm kết thúc nhẹ nhàng trước khi quay lại trang chính.', action: 'Rời bước' }
]

export const NHATHO_PRAYERS = [
  'Xin cho hôm nay đủ bình an để làm điều cần làm, và đủ dịu dàng để không làm mình cạn kiệt.',
  'Xin cho những điều chưa rõ được đặt xuống một lát; việc nào cần làm trước sẽ tự sáng hơn khi lòng bớt vội.',
  'Xin cho cuộc trò chuyện sắp tới có thêm lắng nghe, bớt phòng thủ, và vừa đủ can đảm để nói thật.',
  'Xin cho người mình đang nghĩ tới được bình an theo cách họ cần, không nhất thiết theo cách mình tưởng.'
]

export const NHATHO_NOTE_KEY = 'tamso_nhatho_notes'
export const NHATHO_CANDLE_KEY = 'tamso_nhatho_candles'
const _ls = () => (typeof localStorage !== 'undefined' ? localStorage : null)
export const nhaThoSpaceById = id => NHATHO_SPACES.find(s => s.id === id) || null

export function prayerOfDay(date = new Date()) {
  const day = Math.floor(new Date(date).getTime() / 86400000)
  return NHATHO_PRAYERS[((day % NHATHO_PRAYERS.length) + NHATHO_PRAYERS.length) % NHATHO_PRAYERS.length]
}
export function loadNhaThoNotes() {
  const ls = _ls(); if (!ls) return []
  try { const a = JSON.parse(ls.getItem(NHATHO_NOTE_KEY) || '[]'); return Array.isArray(a) ? a : [] } catch (e) { return [] }
}
export function addNhaThoNote(text) {
  const t = (text || '').trim(); if (!t) return loadNhaThoNotes()
  const list = loadNhaThoNotes(); list.unshift({ t: Date.now(), text: t.slice(0, 520) })
  const trimmed = list.slice(0, 40); const ls = _ls()
  if (ls) { try { ls.setItem(NHATHO_NOTE_KEY, JSON.stringify(trimmed)) } catch (e) {} }
  return trimmed
}
export function clearNhaThoNotes() {
  const ls = _ls(); if (ls) { try { ls.removeItem(NHATHO_NOTE_KEY) } catch (e) {} }
  return []
}
export function countNhaThoCandles() {
  const ls = _ls(); if (!ls) return 0
  try { return +ls.getItem(NHATHO_CANDLE_KEY) || 0 } catch (e) { return 0 }
}
export function lightNhaThoCandle() {
  const n = countNhaThoCandles() + 1; const ls = _ls()
  if (ls) { try { ls.setItem(NHATHO_CANDLE_KEY, String(n)) } catch (e) {} }
  return n
}
