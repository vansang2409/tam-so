/* KINH DỊCH (I Ching) — 64 quẻ, gieo bằng 3 đồng xu (có hào động).
 * Tên Hán-Việt theo thứ tự Văn Vương; ý nghĩa là gloss ngắn truyền thống.
 * Nguồn: Kinh Dịch / Bát quái (Wikipedia tiếng Việt) — tham khảo, không phải khoa học. */

export const TRIGRAMS = {
  'Càn': { bits: '111', sym: '☰', nghia: 'Trời' },
  'Đoài': { bits: '110', sym: '☱', nghia: 'Đầm/Hồ' },
  'Ly': { bits: '101', sym: '☲', nghia: 'Lửa' },
  'Chấn': { bits: '100', sym: '☳', nghia: 'Sấm' },
  'Tốn': { bits: '011', sym: '☴', nghia: 'Gió' },
  'Khảm': { bits: '010', sym: '☵', nghia: 'Nước' },
  'Cấn': { bits: '001', sym: '☶', nghia: 'Núi' },
  'Khôn': { bits: '000', sym: '☷', nghia: 'Đất' }
}

/* lo = quẻ dưới (nội), up = quẻ trên (ngoại) */
export const HEXAGRAMS = [
  { n: 1, ten: 'Thuần Càn', lo: 'Càn', up: 'Càn', y: 'Sáng tạo, cương kiện, hanh thông — thời của bậc quân tử tiến tới.' },
  { n: 2, ten: 'Thuần Khôn', lo: 'Khôn', up: 'Khôn', y: 'Nhu thuận, bao dung, nâng đỡ — thuận theo và chứa đựng.' },
  { n: 3, ten: 'Thủy Lôi Truân', lo: 'Chấn', up: 'Khảm', y: 'Khởi đầu gian nan, cần kiên trì và trợ giúp.' },
  { n: 4, ten: 'Sơn Thủy Mông', lo: 'Khảm', up: 'Cấn', y: 'Còn non dại, cần học hỏi và được khai mở.' },
  { n: 5, ten: 'Thủy Thiên Nhu', lo: 'Càn', up: 'Khảm', y: 'Chờ đợi đúng thời, nuôi dưỡng và nhẫn nại.' },
  { n: 6, ten: 'Thiên Thủy Tụng', lo: 'Khảm', up: 'Càn', y: 'Tranh tụng, bất hòa — nên hòa giải, tránh kiện cáo.' },
  { n: 7, ten: 'Địa Thủy Sư', lo: 'Khảm', up: 'Khôn', y: 'Dụng binh, tổ chức kỷ luật, cần chính danh.' },
  { n: 8, ten: 'Thủy Địa Tỷ', lo: 'Khôn', up: 'Khảm', y: 'Thân ái, đoàn kết, nương tựa lẫn nhau.' },
  { n: 9, ten: 'Phong Thiên Tiểu Súc', lo: 'Càn', up: 'Tốn', y: 'Tích nhỏ, kìm hãm tạm thời, chờ tích lũy đủ.' },
  { n: 10, ten: 'Thiên Trạch Lý', lo: 'Đoài', up: 'Càn', y: 'Bước đi thận trọng, giữ lễ, đạp lên nguy mà an.' },
  { n: 11, ten: 'Địa Thiên Thái', lo: 'Càn', up: 'Khôn', y: 'Hanh thông, trên dưới giao hòa, mọi việc suôn sẻ.' },
  { n: 12, ten: 'Thiên Địa Bĩ', lo: 'Khôn', up: 'Càn', y: 'Bế tắc, trên dưới cách trở — giữ mình chờ thời.' },
  { n: 13, ten: 'Thiên Hỏa Đồng Nhân', lo: 'Ly', up: 'Càn', y: 'Đồng lòng, hợp quần, chí hướng chung.' },
  { n: 14, ten: 'Hỏa Thiên Đại Hữu', lo: 'Càn', up: 'Ly', y: 'Giàu có lớn, thịnh vượng — cần khiêm nhường.' },
  { n: 15, ten: 'Địa Sơn Khiêm', lo: 'Cấn', up: 'Khôn', y: 'Khiêm tốn, nhún nhường — đạo bền vững.' },
  { n: 16, ten: 'Lôi Địa Dự', lo: 'Khôn', up: 'Chấn', y: 'Vui hòa, hứng khởi, chuẩn bị và thuận thời.' },
  { n: 17, ten: 'Trạch Lôi Tùy', lo: 'Chấn', up: 'Đoài', y: 'Tùy thuận, đi theo lẽ phải, linh hoạt.' },
  { n: 18, ten: 'Sơn Phong Cổ', lo: 'Tốn', up: 'Cấn', y: 'Chỉnh đốn việc đổ nát, sửa sai cái cũ.' },
  { n: 19, ten: 'Địa Trạch Lâm', lo: 'Đoài', up: 'Khôn', y: 'Tiến tới, lớn mạnh, lãnh đạo bằng đức.' },
  { n: 20, ten: 'Phong Địa Quán', lo: 'Khôn', up: 'Tốn', y: 'Quan sát, chiêm nghiệm, lấy mình làm gương.' },
  { n: 21, ten: 'Hỏa Lôi Phệ Hạp', lo: 'Chấn', up: 'Ly', y: 'Cắn vỡ trở ngại, dùng hình phạt minh bạch.' },
  { n: 22, ten: 'Sơn Hỏa Bí', lo: 'Ly', up: 'Cấn', y: 'Trang sức, vẻ đẹp hình thức — chú trọng cả nội dung.' },
  { n: 23, ten: 'Sơn Địa Bác', lo: 'Khôn', up: 'Cấn', y: 'Bóc mòn, suy lạc — nên giữ gìn, chờ phục.' },
  { n: 24, ten: 'Địa Lôi Phục', lo: 'Chấn', up: 'Khôn', y: 'Trở lại, hồi sinh, dương khí quay về.' },
  { n: 25, ten: 'Thiên Lôi Vô Vọng', lo: 'Chấn', up: 'Càn', y: 'Chân thành, không vọng tưởng, thuận tự nhiên.' },
  { n: 26, ten: 'Sơn Thiên Đại Súc', lo: 'Càn', up: 'Cấn', y: 'Tích lớn, nuôi dưỡng tài lực, kiềm chế đúng lúc.' },
  { n: 27, ten: 'Sơn Lôi Di', lo: 'Chấn', up: 'Cấn', y: 'Nuôi dưỡng — ăn uống và lời nói cần chừng mực.' },
  { n: 28, ten: 'Trạch Phong Đại Quá', lo: 'Tốn', up: 'Đoài', y: 'Quá mức, gánh nặng lớn — phi thường mà thận trọng.' },
  { n: 29, ten: 'Thuần Khảm', lo: 'Khảm', up: 'Khảm', y: 'Hiểm trùng hiểm — giữ lòng thành tín để vượt qua.' },
  { n: 30, ten: 'Thuần Ly', lo: 'Ly', up: 'Ly', y: 'Sáng rõ, bám víu chính đạo, soi tỏ.' },
  { n: 31, ten: 'Trạch Sơn Hàm', lo: 'Cấn', up: 'Đoài', y: 'Cảm ứng, rung động, giao cảm chân thành (tình duyên).' },
  { n: 32, ten: 'Lôi Phong Hằng', lo: 'Tốn', up: 'Chấn', y: 'Bền lâu, kiên trì giữ đạo thường hằng.' },
  { n: 33, ten: 'Thiên Sơn Độn', lo: 'Cấn', up: 'Càn', y: 'Lui ẩn đúng lúc, tránh xa điều xấu.' },
  { n: 34, ten: 'Lôi Thiên Đại Tráng', lo: 'Càn', up: 'Chấn', y: 'Cường thịnh, mạnh mẽ — dùng sức hợp lẽ.' },
  { n: 35, ten: 'Hỏa Địa Tấn', lo: 'Khôn', up: 'Ly', y: 'Tiến lên, thăng tiến, rạng rỡ.' },
  { n: 36, ten: 'Địa Hỏa Minh Di', lo: 'Ly', up: 'Khôn', y: 'Ánh sáng bị che — giấu tài chờ thời, giữ chính.' },
  { n: 37, ten: 'Phong Hỏa Gia Nhân', lo: 'Ly', up: 'Tốn', y: 'Đạo nhà, trên dưới thuận, mỗi người tròn vai.' },
  { n: 38, ten: 'Hỏa Trạch Khuê', lo: 'Đoài', up: 'Ly', y: 'Trái lìa, hiểu lầm — tìm điểm chung trong dị biệt.' },
  { n: 39, ten: 'Thủy Sơn Kiển', lo: 'Cấn', up: 'Khảm', y: 'Gian nan, bước khó — nên dừng, cầu trợ giúp.' },
  { n: 40, ten: 'Lôi Thủy Giải', lo: 'Khảm', up: 'Chấn', y: 'Cởi mở, hóa giải, thoát khỏi khó khăn.' },
  { n: 41, ten: 'Sơn Trạch Tổn', lo: 'Đoài', up: 'Cấn', y: 'Bớt đi, hy sinh cái nhỏ vì lợi lớn.' },
  { n: 42, ten: 'Phong Lôi Ích', lo: 'Chấn', up: 'Tốn', y: 'Tăng ích, lợi mình lợi người, hành thiện.' },
  { n: 43, ten: 'Trạch Thiên Quải', lo: 'Càn', up: 'Đoài', y: 'Quyết đoán, dứt khoát trừ điều xấu.' },
  { n: 44, ten: 'Thiên Phong Cấu', lo: 'Tốn', up: 'Càn', y: 'Gặp gỡ bất ngờ — cẩn trọng với cám dỗ.' },
  { n: 45, ten: 'Trạch Địa Tụy', lo: 'Khôn', up: 'Đoài', y: 'Tụ họp, quy tụ lòng người.' },
  { n: 46, ten: 'Địa Phong Thăng', lo: 'Tốn', up: 'Khôn', y: 'Đi lên, thăng tiến dần dần.' },
  { n: 47, ten: 'Trạch Thủy Khốn', lo: 'Khảm', up: 'Đoài', y: 'Khốn cùng, bị vây — giữ chí, chờ thoát.' },
  { n: 48, ten: 'Thủy Phong Tỉnh', lo: 'Tốn', up: 'Khảm', y: 'Giếng nước nuôi dân — nguồn lực bền, cần tu sửa.' },
  { n: 49, ten: 'Trạch Hỏa Cách', lo: 'Ly', up: 'Đoài', y: 'Cải cách, thay cũ đổi mới đúng thời.' },
  { n: 50, ten: 'Hỏa Phong Đỉnh', lo: 'Tốn', up: 'Ly', y: 'Đỉnh vạc — nuôi dưỡng hiền tài, đổi mới ổn định.' },
  { n: 51, ten: 'Thuần Chấn', lo: 'Chấn', up: 'Chấn', y: 'Sấm động, chấn kinh — tỉnh thức, giữ bình tĩnh.' },
  { n: 52, ten: 'Thuần Cấn', lo: 'Cấn', up: 'Cấn', y: 'Dừng lại, tĩnh tại — biết khi nào nên ngừng.' },
  { n: 53, ten: 'Phong Sơn Tiệm', lo: 'Cấn', up: 'Tốn', y: 'Tiến từ từ, tuần tự nhi tiến (hôn nhân thuận).' },
  { n: 54, ten: 'Lôi Trạch Quy Muội', lo: 'Đoài', up: 'Chấn', y: 'Cưới gả, danh phận — cẩn trọng vị trí.' },
  { n: 55, ten: 'Lôi Hỏa Phong', lo: 'Ly', up: 'Chấn', y: 'Thịnh đại, rực rỡ — giữ mình giữa lúc đỉnh cao.' },
  { n: 56, ten: 'Hỏa Sơn Lữ', lo: 'Cấn', up: 'Ly', y: 'Lữ khách xa nhà — khiêm nhường nơi đất lạ.' },
  { n: 57, ten: 'Thuần Tốn', lo: 'Tốn', up: 'Tốn', y: 'Thuận nhập, mềm mỏng thấm dần, khiêm hòa.' },
  { n: 58, ten: 'Thuần Đoài', lo: 'Đoài', up: 'Đoài', y: 'Vui đẹp, hòa duyệt, giao tiếp chân thành.' },
  { n: 59, ten: 'Phong Thủy Hoán', lo: 'Khảm', up: 'Tốn', y: 'Ly tán rồi quy tụ, hóa giải chia rẽ.' },
  { n: 60, ten: 'Thủy Trạch Tiết', lo: 'Đoài', up: 'Khảm', y: 'Tiết chế, chừng mực, giữ điều độ.' },
  { n: 61, ten: 'Phong Trạch Trung Phu', lo: 'Đoài', up: 'Tốn', y: 'Thành tín tự trong lòng, cảm hóa bằng chân thành.' },
  { n: 62, ten: 'Lôi Sơn Tiểu Quá', lo: 'Cấn', up: 'Chấn', y: 'Vượt nhỏ — việc nhỏ nên cẩn trọng, chớ làm lớn.' },
  { n: 63, ten: 'Thủy Hỏa Ký Tế', lo: 'Ly', up: 'Khảm', y: 'Đã xong, viên mãn — đề phòng buông lơi.' },
  { n: 64, ten: 'Hỏa Thủy Vị Tế', lo: 'Khảm', up: 'Ly', y: 'Chưa xong, sắp hoàn tất — kiên trì đến cùng.' }
]

const bitsOf = (h) => TRIGRAMS[h.lo].bits + TRIGRAMS[h.up].bits  // 6 hào, dưới→trên
const BY_BITS = {}; HEXAGRAMS.forEach(h => { BY_BITS[bitsOf(h)] = h })
export function hexByBits(bits) { return BY_BITS[bits] || null }

/** Gieo 1 hào bằng 3 đồng xu: ngửa=3, sấp=2 → tổng 6/7/8/9 */
function castLine() {
  let sum = 0; for (let i = 0; i < 3; i++) sum += Math.random() < 0.5 ? 3 : 2
  return { val: sum, yang: sum === 7 || sum === 9, changing: sum === 6 || sum === 9 }
}

/** Gieo 1 quẻ: trả về 6 hào (dưới→trên), quẻ chính & quẻ biến (nếu có hào động) */
export function castHexagram() {
  const lines = Array.from({ length: 6 }, castLine)
  const presentBits = lines.map(l => l.yang ? '1' : '0').join('')
  const present = hexByBits(presentBits)
  const hasChange = lines.some(l => l.changing)
  let changed = null
  if (hasChange) {
    const cb = lines.map(l => (l.changing ? (l.yang ? '0' : '1') : (l.yang ? '1' : '0'))).join('')
    changed = hexByBits(cb)
  }
  return { lines, present, changed, changingPos: lines.map((l, i) => l.changing ? i + 1 : null).filter(Boolean) }
}
