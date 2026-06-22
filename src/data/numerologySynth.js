/* DỆT BỘ SỐ THẦN SỐ HỌC — nối Số Chủ Đạo · Vận Mệnh · Linh Hồn · Nhân Cách · Trưởng Thành
 * thành một đoạn chiêm nghiệm: con đường ↔ tài năng, mong muốn bên trong ↔ vẻ ngoài người
 * khác thấy, và điểm hội tụ nửa sau cuộc đời. Thuần (pure), dễ kiểm thử. Giọng tham khảo,
 * KHÔNG phán chắc — chỉ gợi mở để người đọc tự soi. */

import { NUMEROLOGY } from './numerology.js'

// Lấy 1–2 từ khóa gọn của một con số (an toàn cho cả 11/22/33).
function kw(n, take = 2) {
  const info = NUMEROLOGY[n] || NUMEROLOGY['' + n]
  if (!info || !info.keys) return ''
  return info.keys.slice(0, take).join(', ')
}

/** input: { lp, expression, soulUrge, personality, maturity, missing }
 *  missing: mảng số Lo Shu còn thiếu (có thể rỗng). */
export function weaveNumbers({ lp, expression, soulUrge, personality, maturity, missing = [] }) {
  if (lp == null || expression == null) return ''
  const parts = []

  // 1) Con đường (Số Chủ Đạo) ↔ Hành trang (Vận Mệnh)
  let a = 'Số Chủ Đạo ' + lp + ' (' + kw(lp) + ') phác con đường lớn của bạn, còn Số Vận Mệnh ' + expression + ' (' + kw(expression) + ') nói về hành trang — những tài năng tự nhiên để đi con đường ấy.'
  if (lp === expression) a += ' Hai số trùng nhau — hướng đi và năng lực cùng một mạch, một sự cộng hưởng dễ khiến bạn nhất quán; mặt trái là ít "chất đối trọng" để tự cân bằng.'
  parts.push(a)

  // 2) Bên trong (Linh Hồn) ↔ Bên ngoài (Nhân Cách)
  if (soulUrge != null && personality != null) {
    let b = 'Số Linh Hồn ' + soulUrge + ' (' + kw(soulUrge) + ') hé lộ điều trái tim bạn thật sự khao khát, trong khi Số Nhân Cách ' + personality + ' (' + kw(personality) + ') là vẻ ngoài người khác bắt gặp trước tiên.'
    if (soulUrge === personality) b += ' Khi hai số này trùng, điều bạn muốn và điều bạn thể hiện khá ăn khớp — người ngoài dễ "đọc" được bạn.'
    else b += ' Hai số khác nhau là chuyện thường: phần ai cũng thấy ngay chưa hẳn là phần bạn mong mỏi nhất — đáng để bạn tự hỏi mình đang để lộ hay đang giấu điều gì.'
    parts.push(b)
  }

  // 3) Điểm hội tụ nửa sau cuộc đời (Trưởng Thành)
  if (maturity != null) {
    parts.push('Theo lối tính, Số Trưởng Thành ' + maturity + ' (' + kw(maturity) + ') là nơi con đường và hành trang dần hội tụ ở nửa sau cuộc đời — một đích đến để hướng tới hơn là một lời tiên đoán.')
  }

  // 4) Khoảng trống Lo Shu — bài học để vun đắp
  const miss = (missing || []).filter(n => n >= 1 && n <= 9)
  if (miss.length) {
    const names = miss.map(n => n + ' (' + kw(n, 1) + ')').join(', ')
    parts.push('Bảng Lo Shu của bạn khuyết số ' + names + ' — dân gian xem đây là những nét chưa sẵn có, gợi ý vài khía cạnh đáng để bạn ý thức rèn thêm, chứ không phải khiếm khuyết cố định.')
  } else {
    parts.push('Bảng Lo Shu của bạn đủ cả chín số — khá hiếm gặp; lối xem truyền thống coi đây là một nền tảng cân đối, dù mỗi số đậm nhạt khác nhau.')
  }

  // 5) Chốt — giữ khung tham khảo
  parts.push('Hãy xem cả bộ số như nhiều lăng kính cùng soi một con người, để tham khảo và chiêm nghiệm — không phải lời phán cố định. Bạn vẫn là người viết tiếp câu chuyện của mình.')

  return parts.join(' ')
}

export default weaveNumbers
