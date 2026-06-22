/* TỔNG HỢP QUẺ DỊCH — dệt một đoạn chiêm nghiệm từ quẻ chính → hào động → quẻ biến.
 * Thuần (pure), dễ kiểm thử. Giữ giọng tham khảo: KHÔNG phán chắc, chỉ gợi mở để người
 * gieo tự soi vào hoàn cảnh của mình. Khung "đầu → giữa → cuối": tình thế hiện tại,
 * trọng tâm chuyển động, và chiều quẻ biến hé mở. */

// Ngôi của 6 hào (rút gọn từ HAO_VITRI) — dùng để nêu trọng tâm hào động.
const NGOI = {
  1: 'ở dưới cùng, việc còn mới và lực còn mỏng — nhắc sự thận trọng buổi đầu',
  2: 'đắc trung ở nội quái, ngôi người dưới vững vàng — phần nhiều thuận, nên giữ trung chính',
  3: 'cuối nội quái, chỗ giáp ranh nhiều nguy — nhắc cẩn trọng kẻo vấp',
  4: 'đầu ngoại quái, sát ngôi trên nhiều lo — nên khiêm thuận, dè dặt',
  5: 'đắc trung ở ngoại quái, ngôi chủ quẻ thường cát nhất — nên độ lượng, chính trực',
  6: 'trên cùng, thời đã đến cùng cực — coi chừng thái quá, nên biết lui'
}

// Rút gọn lời quẻ (field y) thành một mệnh đề ngắn để câu văn trôi chảy.
function gist(hex) {
  if (!hex) return ''
  const t = (hex.y || '').replace(/\s+/g, ' ').trim()
  // cắt ở dấu — hoặc . đầu tiên cho gọn
  const m = t.split(/\s*[—.]\s*/)[0]
  return (m || t).toLowerCase()
}

/** input: { present, changed, changingPos } — đúng shape của castHexagram()/maiHoa().
 *  changingPos: mảng vị trí hào động (1..6); có thể rỗng. */
export function weaveCast({ present, changed, changingPos = [] }) {
  if (!present) return ''
  const parts = []
  const pos = (changingPos || []).filter(p => p >= 1 && p <= 6).sort((a, b) => a - b)

  // 1) Tình thế hiện tại — quẻ chính
  parts.push('Quẻ chính là ' + present.n + ' · ' + present.ten + ' — nói về ' + gist(present) + '. Hãy xem đây là bức tranh chung của hoàn cảnh bạn đang hỏi.')

  if (pos.length === 0) {
    // Không hào động — chỉ xét quẻ chính, tình thế tĩnh.
    parts.push('Lần gieo này không có hào động, nghĩa là tình thế đang khá ổn định: trọng tâm nằm trọn ở lời quẻ và tượng quẻ trên, chưa thấy chiều chuyển hóa rõ rệt. Cứ chiêm nghiệm thông điệp của quẻ chính và soi vào việc của mình.')
  } else {
    // 2) Trọng tâm chuyển động — hào động
    if (pos.length === 1) {
      const p = pos[0]
      parts.push('Có một hào động ở hào ' + p + ' — ' + NGOI[p] + '. Đây là điểm then chốt đang chuyển mình trong hoàn cảnh, nơi đáng để bạn lưu tâm nhất.')
    } else {
      const lo = pos[0], hi = pos[pos.length - 1]
      parts.push('Có ' + pos.length + ' hào động (hào ' + pos.join(', ') + ') — nhiều chỗ cùng chuyển. Theo lối luận cơ bản, có thể lấy hào thấp nhất (hào ' + lo + ', ' + NGOI[lo] + ') hoặc hào cao nhất (hào ' + hi + ', ' + NGOI[hi] + ') làm trọng tâm để chiêm nghiệm.')
    }

    // 3) Chiều quẻ biến hé mở
    if (changed) {
      parts.push('Từ chỗ động ấy, quẻ chính chuyển thành quẻ biến ' + changed.n + ' · ' + changed.ten + ' — gợi ý chiều đi tới: ' + gist(changed) + '. Quẻ biến không phải kết cục đã định, mà là xu hướng nếu mạch hiện tại tiếp diễn.')
    }
  }

  // 4) Chốt — giữ khung tham khảo
  parts.push('Tất cả chỉ để tham khảo và chiêm nghiệm — Kinh Dịch gợi mở cách nhìn, còn quyết định và hành động vẫn ở nơi bạn.')

  return parts.join(' ')
}

export default weaveCast
