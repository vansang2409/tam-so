/* DỆT "QUẺ HÔM NAY" — nối lá Tarot vừa rút với quẻ Dịch vừa gieo thành một lời gợi mở duy nhất.
 * Bắc cầu Đông–Tây bằng ngũ hành: nguyên tố (phương Tây) của lá ↔ hành của quái trên (quẻ Dịch).
 * Thuần (pure), dễ kiểm thử. Giọng tham khảo, KHÔNG phán số phận — chỉ để soi chiếu tâm trạng. */

import { TRIGRAMS } from './iching.js'

// Nguyên tố phương Tây của chất bài → quy về NGŨ HÀNH để so với quái Dịch.
// (Gió/Khí ↔ Tốn nên quy về Mộc; Lửa→Hỏa, Nước→Thủy, Đất→Thổ.)
const EL2HANH = { 'Lửa': 'Hỏa', 'Nước': 'Thủy', 'Khí': 'Mộc', 'Đất': 'Thổ' }
const SINH = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' }   // tương sinh
const KHAC = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' }   // tương khắc

function nguHanhRel(a, b) {
  if (!a || !b) return null
  if (a === b) return { loai: 'tỉ hòa', y: 'cùng một hành (' + a + ') — hai lăng kính cùng chất, dễ cộng hưởng và nhấn mạnh một thông điệp' }
  if (SINH[a] === b || SINH[b] === a) return { loai: 'tương sinh', y: 'hai hành nâng đỡ nhau (' + a + ' và ' + b + ' tương sinh) — như thể hai góc nhìn cùng chiều, hỗ trợ lẫn nhau' }
  if (KHAC[a] === b || KHAC[b] === a) return { loai: 'tương khắc', y: 'hai hành hơi nghịch nhau (' + a + ' và ' + b + ' tương khắc) — không phải điềm xấu, mà là lời nhắc cân bằng hai xu hướng đang kéo khác chiều' }
  return { loai: 'trung tính', y: 'hai hành (' + a + ' và ' + b + ') không xung không hợp nổi bật' }
}

const kw = (card, up) => {
  const arr = up ? card.upKeys : card.revKeys
  return Array.isArray(arr) && arr.length ? arr.slice(0, 2).join(', ') : ''
}
const gistHex = hex => (hex.y || '').replace(/\s+/g, ' ').split(/\s*[—.]\s*/)[0].toLowerCase()

/** input: { card, up, hex, dayNum }
 *  card: lá Tarot (có nameVi, suit?, element?, upKeys/revKeys); up: bool; hex: quẻ chính; dayNum: số ngày (1–9, optional). */
export function weaveDay({ card, up, hex, dayNum }) {
  if (!card || !hex) return ''
  const parts = []
  const huong = up ? 'xuôi' : 'ngược'
  const k = kw(card, up)

  // 1) Mở — nêu cả hai
  parts.push('Hôm nay bạn rút được lá ' + card.nameVi + ' (' + huong + (k ? ' — ' + k : '') + ') và gieo được quẻ ' + hex.n + ' · ' + hex.ten + '.')

  // 2) Lá bài — sắc thái xuôi/ngược
  if (up) parts.push('Lá ' + card.nameVi + ' ở chiều xuôi nghiêng về mặt thuận của năng lượng nó mang; cứ để nó gợi cho bạn một tinh thần để bước vào ngày.')
  else parts.push('Lá ' + card.nameVi + ' ở chiều ngược thường là lời nhắc soi lại — không phải xui rủi, mà là chỗ đáng dừng một nhịp để ý.')

  // 3) Quẻ Dịch — gist
  parts.push('Quẻ ' + hex.ten + ' nói về ' + gistHex(hex) + ', thêm một góc nhìn phương Đông cho ngày của bạn.')

  // 4) Bắc cầu ngũ hành (nếu lá có chất) — hoặc thuần chủ đề
  const elName = card.element
  const rel = nguHanhRel(EL2HANH[elName], hex.up ? TRIGRAMS[hex.up].hanh : null)
  if (rel) {
    parts.push('Thử bắc một cây cầu Đông–Tây cho vui: chất ' + elName + ' của lá bài và quái trên của quẻ (' + hex.up + ', hành ' + TRIGRAMS[hex.up].hanh + ') ' + rel.y + '. Đây chỉ là một cách chơi ý nghĩa, không phải quy tắc cứng.')
  } else {
    parts.push('Lá Ẩn Chính này không gắn một chất nguyên tố cụ thể, nên hãy đọc lá bài và quẻ như hai lăng kính riêng cùng soi một ngày.')
  }

  // 5) Chốt — khung tham khảo
  parts.push('Tất cả chỉ để soi chiếu tâm trạng và tham khảo, KHÔNG phải lời phán về số phận — ngày của bạn vẫn do bạn viết.')

  return parts.join(' ')
}

export default weaveDay
