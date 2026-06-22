/* TỔNG HỢP TRẢI BÀI TAROT — dệt các lá đã rút thành một đoạn chiêm nghiệm.
 * Thuần (pure) & tất định theo input nên dễ kiểm thử. Giọng "tham khảo":
 * gợi mở để tự ngẫm, KHÔNG phán chắc, KHÔNG hù dọa. */

const SUIT_THEME = {
  'Gậy': 'năng lượng hành động, đam mê và ý chí',
  'Cốc': 'cảm xúc, tình cảm và trực giác',
  'Kiếm': 'suy nghĩ, lời nói và những quyết định',
  'Tiền': 'công việc, tiền bạc và chuyện thực tế'
}
const SUIT_SYM = { 'Gậy': '🔥', 'Cốc': '🍷', 'Kiếm': '⚔️', 'Tiền': '🪙' }
const COURT = ['Thị Đồng', 'Hiệp Sĩ', 'Nữ Hoàng', 'Vua']

const firstKey = (c, up) => { const ks = up ? c.upKeys : c.revKeys; return (ks && ks[0]) || '' }

/** picks: [{card, up}], positions: [string], q: câu hỏi (tùy chọn). */
export function spreadSynthesis(picks, positions, q) {
  if (!picks || !picks.length) return ''
  const n = picks.length
  const up = picks.filter(p => p.up).length
  const down = n - up
  const opener = q ? 'Về câu hỏi “' + q + '”: ' : 'Cho trải bài này: '

  // 1 lá — đọc gọn, tập trung vào chính nó
  if (n === 1) {
    const p = picks[0]
    const k = firstKey(p.card, p.up)
    return opener + 'lá ' + p.card.nameVi + ' (' + (p.up ? 'xuôi' : 'ngược') + ') gợi lên ' +
      (k ? '“' + k + '”' : 'thông điệp của riêng nó') +
      '. Hãy đọc nó như một câu hỏi để tự ngẫm và chiêm nghiệm hơn là một lời phán — bạn mới là người đặt nó vào hoàn cảnh của mình.'
  }

  const parts = []

  // (a) cán cân xuôi / ngược
  const lean = up > down
    ? 'nghiêng về hướng thuận — phần lớn ở chiều xuôi (' + up + '/' + n + '), năng lượng tổng thể khá ủng hộ'
    : up < down
      ? 'nghiêng về sự thận trọng — có ' + down + '/' + n + ' lá ngược, vài chỗ cần soi lại hoặc tháo gỡ trước khi tiến'
      : 'khá cân bằng giữa thuận và nghịch (' + up + ' xuôi / ' + down + ' ngược) — mọi việc còn ngỏ, tùy ở lựa chọn của bạn'
  parts.push(opener + n + ' lá đang ' + lean + '.')

  // (b) trọng số Ẩn Chính (chủ đề lớn / bước ngoặt)
  const major = picks.filter(p => p.card.arcana === 'major').length
  if (major === 0) {
    parts.push('Toàn lá Ẩn Phụ: câu chuyện xoay quanh những việc đời thường, phần nhiều nằm trong tầm xoay xở hằng ngày của bạn.')
  } else if (major >= Math.ceil(n / 2)) {
    parts.push('Có tới ' + major + '/' + n + ' lá Ẩn Chính — những chủ đề lớn, mang tính bước ngoặt đang nổi lên; một phần diễn biến có thể vượt ngoài tầm tay, nên thứ bạn làm chủ được là thái độ đón nhận.')
  } else {
    parts.push('Xen vào là ' + major + ' lá Ẩn Chính — dấu hiệu của vài chủ đề lớn hơn thường ngày đang chen vào mạch việc.')
  }

  // (c) chất (suit) nổi trội → trọng tâm
  const tally = {}
  for (const p of picks) if (p.card.suit) tally[p.card.suit] = (tally[p.card.suit] || 0) + 1
  const minorTotal = Object.values(tally).reduce((a, b) => a + b, 0)
  if (minorTotal >= 2) {
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]
    if (top && top[1] >= 2 && top[1] / minorTotal >= 0.5) {
      parts.push('Chất ' + SUIT_SYM[top[0]] + ' ' + top[0] + ' nổi trội (' + top[1] + ' lá) — trọng tâm có lẽ đang nằm ở ' + SUIT_THEME[top[0]] + '.')
    } else if (Object.keys(tally).length >= 3) {
      parts.push('Nhiều chất đan xen — vấn đề có vẻ chạm tới nhiều mặt cùng lúc, khó gói gọn vào một khía cạnh.')
    }
  }

  // (d) lá hoàng gia & lá Át
  const courts = picks.filter(p => COURT.includes(p.card.roman))
  if (courts.length) {
    parts.push((courts.length === 1 ? 'Lá hoàng gia ' + courts[0].card.nameVi : courts.length + ' lá hoàng gia') +
      ' xuất hiện — có thể ám chỉ những con người cụ thể quanh bạn, hoặc vai trò mà chính bạn đang đảm nhận.')
  }
  const aces = picks.filter(p => p.card.roman === 'Át')
  if (aces.length) {
    parts.push((aces.length === 1 ? 'Lá Át (' + aces[0].card.nameVi + ')' : aces.length + ' lá Át') +
      ' báo một hạt mầm/khởi đầu mới — đáng để vun thay vì bỏ lỡ.')
  }

  // (e) khung đầu → cuối, có từ khóa thật của lá
  const a = picks[0], z = picks[n - 1]
  const ak = firstKey(a.card, a.up), zk = firstKey(z.card, z.up)
  parts.push('Đọc “' + positions[0] + '” (' + a.card.nameVi + (ak ? ' — ' + ak : '') + ') như điểm khởi, và “' +
    positions[n - 1] + '” (' + z.card.nameVi + (zk ? ' — ' + zk : '') + ') như xu hướng đang mở ra; các lá giữa là mạch nối hai đầu ấy.')

  // (f) chốt — giữ giọng tham khảo
  parts.push('Đây là gợi ý để bạn tự chiêm nghiệm và sắp xếp lại suy nghĩ, không phải lời tiên đoán — quyết định vẫn ở bạn.')

  return parts.join(' ')
}

export default spreadSynthesis
