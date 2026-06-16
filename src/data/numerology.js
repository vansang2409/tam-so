/* THẦN SỐ HỌC — Số Chủ Đạo (Life Path). Hệ Pythagorean.
 * Phương pháp & nội dung tham khảo: Numerology.com (diễn giải lại tiếng Việt). */

export const NUMEROLOGY = {
  1: { title: 'Số 1 — Người Tiên Phong', keys: ['độc lập', 'lãnh đạo', 'tiên phong', 'quyết đoán'],
    desc: 'Sứ mệnh của bạn là khẳng định sự độc lập và bước vào sức mạnh cá nhân. Bạn mang khí chất thủ lĩnh, thích là người đầu tiên thử cái mới và hành động nhanh. Điểm cần lưu ý: học cách hợp tác và kiên nhẫn với người khác.',
    strengths: 'Tự chủ, sáng kiến, dám đi đầu, ý chí mạnh.', watch: 'Dễ nóng vội, cô độc, khó phối hợp nhóm.' },
  2: { title: 'Số 2 — Người Hòa Giải', keys: ['hợp tác', 'nhạy cảm', 'ngoại giao', 'đồng hành'],
    desc: 'Bạn coi trọng các mối quan hệ và giỏi tạo sự hài hòa. Trực giác mạnh giúp bạn cảm nhận cảm xúc người khác trước cả khi họ nói ra. Điểm cần lưu ý: đừng thụ động đến mức quên nhu cầu của chính mình.',
    strengths: 'Tinh tế, kiên nhẫn, biết lắng nghe, gắn kết.', watch: 'Né tránh xung đột, dễ phụ thuộc, ngại lên tiếng.' },
  3: { title: 'Số 3 — Người Sáng Tạo', keys: ['biểu đạt', 'lạc quan', 'giao tiếp', 'nghệ thuật'],
    desc: 'Bạn tràn năng lượng sáng tạo và có duyên giao tiếp, dễ truyền cảm hứng và thu hút bạn bè. Điểm cần lưu ý: kết nối sâu và cam kết lâu dài có thể là thử thách — hãy cho phép mình chạm tới chiều sâu cảm xúc.',
    strengths: 'Hoạt ngôn, vui vẻ, giàu ý tưởng, truyền cảm hứng.', watch: 'Tản mạn, ngại cam kết, né tránh chiều sâu.' },
  4: { title: 'Số 4 — Người Xây Dựng', keys: ['bền bỉ', 'thực tế', 'kỷ luật', 'đáng tin'],
    desc: 'Bạn là nguồn ổn định: chăm chỉ, kiên trì và đáng tin cậy. Bạn tin vào nỗ lực đều đặn để đạt mục tiêu. Điểm cần lưu ý: đừng cứng nhắc với cái "đúng" của mình mà bỏ lỡ cái mới.',
    strengths: 'Trật tự, trung thành, nền nã, có trách nhiệm.', watch: 'Bảo thủ, ngại thay đổi, đôi khi khô khan.' },
  5: { title: 'Số 5 — Người Tự Do', keys: ['tự do', 'phiêu lưu', 'linh hoạt', 'trải nghiệm'],
    desc: 'Bạn khao khát trải nghiệm và đổi thay; sự lặp lại nhàm chán khiến bạn ngột ngạt. Bạn học bằng cách sống và dấn thân. Điểm cần lưu ý: duy trì những mối quan hệ và cam kết bền vững.',
    strengths: 'Năng động, thích nghi nhanh, cởi mở, ham học hỏi.', watch: 'Cả thèm chóng chán, thiếu kiên định, bốc đồng.' },
  6: { title: 'Số 6 — Người Chăm Sóc', keys: ['trách nhiệm', 'yêu thương', 'hài hòa', 'tận tụy'],
    desc: 'Bạn dẫn dắt bằng trái tim, tỏa năng lượng ấm áp và sẵn lòng nâng đỡ người khác. Rất phù hợp vai trò cố vấn, người thầy, người chữa lành. Điểm cần lưu ý: nhớ chăm sóc bản thân như chăm cho người khác.',
    strengths: 'Bao dung, tận tâm, biết nâng đỡ, trách nhiệm.', watch: 'Hy sinh quá mức, ôm việc, quên chính mình.' },
  7: { title: 'Số 7 — Người Tìm Kiếm', keys: ['nội tâm', 'phân tích', 'trí tuệ', 'tâm linh'],
    desc: 'Bạn là người tìm kiếm chân lý, ham hiểu bản chất của mọi thứ, kết hợp lý trí sắc bén với trực giác sâu. Điểm cần lưu ý: mở lòng kết nối cảm xúc thay vì chỉ sống trong suy tưởng.',
    strengths: 'Sâu sắc, độc lập, giỏi nghiên cứu, trực giác tốt.', watch: 'Khép kín, hoài nghi, khó gần về mặt cảm xúc.' },
  8: { title: 'Số 8 — Người Kiến Tạo Thịnh Vượng', keys: ['tham vọng', 'quyền lực', 'thành tựu', 'quản trị'],
    desc: 'Bạn tìm thấy giá trị bản thân qua những thành tựu lớn; mục tiêu càng cao, cảm giác chinh phục càng mạnh. Điểm cần lưu ý: giữ cân bằng giữa công việc, sức khỏe và các mối quan hệ.',
    strengths: 'Bản lĩnh, tổ chức tốt, kiên định, có tầm nhìn.', watch: 'Tham công, áp lực, dễ độc đoán với người khác.' },
  9: { title: 'Số 9 — Người Nhân Ái', keys: ['vị tha', 'lý tưởng', 'trắc ẩn', 'trải đời'],
    desc: 'Bạn mang sự từng trải của một người đã đi qua nhiều thử thách và sẵn lòng giúp đỡ người khác. Trực giác và lòng nhân ái dẫn lối bạn. Điểm cần lưu ý: cho phép mình được nhận lại sự giúp đỡ, không chỉ cho đi.',
    strengths: 'Bao dung, giàu lòng trắc ẩn, có lý tưởng, sâu sắc.', watch: 'Ôm nỗi đau một mình, khó mở lời nhờ giúp đỡ.' },
  11: { title: 'Số 11 — Số Bậc Thầy · Trực Giác', master: true, keys: ['trực giác mạnh', 'truyền cảm hứng', 'tâm linh', 'nhạy bén'],
    desc: 'Số bậc thầy của trực giác và sự nhạy cảm tinh thần. Bạn có tiềm năng truyền cảm hứng và khai sáng cho người khác, nhưng đi kèm là lo âu và áp lực nội tâm. Bài học: tin vào năng lực đặc biệt của mình thay vì hoài nghi nó.',
    strengths: 'Trực giác phi thường, truyền cảm hứng, lý tưởng.', watch: 'Lo âu, thiếu tự tin, căng thẳng nội tâm (mang năng lượng số 2).' },
  22: { title: 'Số 22 — Số Bậc Thầy · Kiến Trúc Sư', master: true, keys: ['hiện thực hóa', 'tầm nhìn lớn', 'kỷ luật', 'phụng sự'],
    desc: 'Được gọi là "Bậc thầy Kiến tạo" — khả năng biến giấc mơ lớn thành hiện thực cụ thể. Bạn kết hợp tầm nhìn với năng lực thực thi để tạo điều có ích cho cộng đồng. Bài học: vượt qua nỗi sợ thất bại và biết phối hợp với người khác.',
    strengths: 'Tầm nhìn lớn, thực thi mạnh, tận tụy phụng sự.', watch: 'Áp lực cao, dễ "chỉ có việc không có chơi" (mang năng lượng số 4).' },
  33: { title: 'Số 33 — Số Bậc Thầy · Người Thầy', master: true, keys: ['vị tha', 'chữa lành', 'dẫn dắt tinh thần', 'yêu thương vô điều kiện'],
    desc: 'Số bậc thầy hiếm gặp nhất, được gọi là "Bậc thầy Giáo huấn". Bạn hướng tới chữa lành và nâng đỡ người khác bằng sự thấu cảm sâu sắc. Bài học lớn nhất: chữa lành cho chính mình trước khi chữa lành cho người khác.',
    strengths: 'Thấu cảm sâu, vị tha, khả năng dẫn dắt tinh thần.', watch: 'Gánh nặng kỳ vọng, dễ kiệt sức (mang năng lượng số 6).' }
}

/** Rút gọn về 1 chữ số, giữ nguyên số bậc thầy 11/22/33 */
export function reduceKeep(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = String(n).split('').reduce((a, b) => a + +b, 0)
  return n
}

/** Tính Số Chủ Đạo từ ngày/tháng/năm; trả về chi tiết các bước */
export function computeLifePath(d, m, y) {
  const rm = reduceKeep(m), rd = reduceKeep(d), ry = reduceKeep(y)
  const sum = rm + rd + ry
  const lp = reduceKeep(sum)
  return { lp, rm, rd, ry, sum, info: NUMEROLOGY[lp] }
}

/* ===== Bộ số từ HỌ TÊN (Pythagorean) + Năm cá nhân ===== */
export const LETTER_VALUES = { A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8 }
const VOWELS = new Set(['A','E','I','O','U'])

/** Chuẩn hóa tên tiếng Việt: bỏ dấu, đ→d, chỉ giữ A–Z (quy ước phổ biến — cần kiểm chứng cho từng trường phái) */
export function normalizeVN(str) {
  return (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase().replace(/[^A-Z]/g, '')
}
function sumLetters(s) { let t = 0; for (const c of s) t += LETTER_VALUES[c] || 0; return t }
function reduceTo9(n) { while (n > 9) n = String(n).split('').reduce((a, b) => a + +b, 0); return n }

export function computeNameNumbers(fullName) {
  const s = normalizeVN(fullName)
  if (!s) return null
  const vowels = [...s].filter(c => VOWELS.has(c)).join('')
  const cons = [...s].filter(c => !VOWELS.has(c)).join('')
  return {
    expression: reduceKeep(sumLetters(s)),
    soulUrge: reduceKeep(sumLetters(vowels)),
    personality: reduceKeep(sumLetters(cons)),
    letters: s.length
  }
}
export function personalYear(day, month, year) {
  return reduceTo9(reduceTo9(day) + reduceTo9(month) + reduceTo9(year))
}

export const NUMBER_TYPE = {
  expression: { label: 'Số Vận Mệnh (Expression)', note: 'Tổng tất cả chữ cái trong họ tên — điểm mạnh & thử thách bẩm sinh, con đường bạn được "định" để đi.' },
  soulUrge: { label: 'Số Linh Hồn (Soul Urge)', note: 'Tính theo nguyên âm — khát khao sâu thẳm và động lực nội tâm.' },
  personality: { label: 'Số Nhân Cách (Personality)', note: 'Tính theo phụ âm — hình ảnh bạn thể hiện ra ngoài, ấn tượng đầu tiên.' }
}

export const PERSONAL_YEAR = {
  1: { title: 'Năm 1 — Khởi đầu', desc: 'Mở chu kỳ mới: gieo hạt, bắt đầu dự án, khẳng định bản thân. Hành động và độc lập.' },
  2: { title: 'Năm 2 — Vun đắp', desc: 'Kiên nhẫn, hợp tác, nuôi dưỡng quan hệ. Mọi thứ cần thời gian — đừng vội.' },
  3: { title: 'Năm 3 — Sáng tạo & giao tiếp', desc: 'Năng lượng xã hội, biểu đạt, niềm vui. Thời điểm tốt cho sáng tạo và kết nối.' },
  4: { title: 'Năm 4 — Xây nền', desc: 'Làm việc chăm chỉ, tổ chức, đặt nền móng vững. Kỷ luật cho kết quả lâu dài.' },
  5: { title: 'Năm 5 — Thay đổi & tự do', desc: 'Biến động, di chuyển, cơ hội mới. Linh hoạt đón nhận đổi thay.' },
  6: { title: 'Năm 6 — Trách nhiệm & gia đình', desc: 'Tập trung vào gia đình, tình yêu, bổn phận. Chăm sóc và cân bằng.' },
  7: { title: 'Năm 7 — Chiêm nghiệm', desc: 'Hướng nội, học hỏi, phát triển tinh thần. Lùi lại để hiểu mình hơn.' },
  8: { title: 'Năm 8 — Thành tựu & tài chính', desc: 'Gặt hái, quyền lực, tiền bạc. Nỗ lực trước cho quả; quản trị khôn ngoan.' },
  9: { title: 'Năm 9 — Hoàn tất & buông bỏ', desc: 'Khép chu kỳ 9 năm: dọn dẹp, tha thứ, buông cái cũ để đón chu kỳ mới.' }
}

/* ===== Nâng cao: Lo Shu Grid · Maturity · Nợ nghiệp · Personal Month/Day ===== */
export function loShu(d, m, y) {
  const digits = ('' + d + m + y).split('').map(Number).filter(n => n > 0)
  const counts = {}; for (let i = 1; i <= 9; i++) counts[i] = 0
  digits.forEach(n => counts[n]++)
  const missing = []; for (let i = 1; i <= 9; i++) if (counts[i] === 0) missing.push(i)
  return { counts, missing }
}
/* Sơ đồ ô Lo Shu chuẩn (cửu cung) */
export const LO_SHU_LAYOUT = [[4, 9, 2], [3, 5, 7], [8, 1, 6]]
export const LO_SHU_MISSING = {
  1: 'Thiếu 1: cần rèn tính độc lập, tự tin thể hiện cái tôi.',
  2: 'Thiếu 2: cần học sự nhạy cảm, kiên nhẫn và hợp tác.',
  3: 'Thiếu 3: nên trau dồi biểu đạt, sáng tạo, giao tiếp.',
  4: 'Thiếu 4: cần thêm kỷ luật, tổ chức và sự thực tế.',
  5: 'Thiếu 5: nên cân bằng tự do và trách nhiệm, linh hoạt hơn.',
  6: 'Thiếu 6: học cách chăm sóc, vun đắp gia đình và trách nhiệm.',
  7: 'Thiếu 7: nên dành thời gian chiêm nghiệm, học hỏi chiều sâu.',
  8: 'Thiếu 8: rèn quản trị tiền bạc, tham vọng và bản lĩnh.',
  9: 'Thiếu 9: mở rộng lòng vị tha, lý tưởng và bao dung.'
}

export function maturity(lp, expression) { return reduceTo9(lp + expression) }

export const KARMIC_DEBT = {
  13: 'Nợ nghiệp 13: bài học về lao động kiên trì; tránh lười biếng, đi đường tắt.',
  14: 'Nợ nghiệp 14: bài học về tiết độ và tự do có kỷ luật; tránh buông thả.',
  16: 'Nợ nghiệp 16: bài học về cái tôi và tái sinh; tránh kiêu ngạo, đổ vỡ để trưởng thành.',
  19: 'Nợ nghiệp 19: bài học về tự lực; tránh ích kỷ, học cách nhận và cho.'
}
export function karmicOf(rawSum) { return [13, 14, 16, 19].includes(rawSum) ? rawSum : null }

export function personalMonth(py, calMonth) { return reduceTo9(py + reduceTo9(calMonth)) }
export function personalDay(pm, calDay) { return reduceTo9(pm + reduceTo9(calDay)) }

export const PERSONAL_DAY_HINT = {
  1: 'Khởi sự, chủ động.', 2: 'Hợp tác, nhẹ nhàng.', 3: 'Giao tiếp, vui vẻ.',
  4: 'Làm việc, sắp xếp.', 5: 'Linh hoạt, đổi mới.', 6: 'Gia đình, chăm lo.',
  7: 'Tĩnh tâm, suy ngẫm.', 8: 'Tài chính, quyết đoán.', 9: 'Hoàn tất, buông bỏ.'
}
