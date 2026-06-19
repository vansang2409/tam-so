import { doSangSummary } from './tuvidauso.js'
/* Báo cáo tổng hợp TẤT ĐỊNH (mock) — ghép thần số học + Can Chi + Tarot + chủ đề.
 * KHÔNG gọi AI API. Giọng nhẹ nhàng, không hù dọa, không khẳng định tương lai. */
import { PERSONAL_YEAR, NUMEROLOGY } from './numerology.js'

const CUR = new Date()
const WEEK_POOL = [
  'Dành 10 phút viết ra 3 điều bạn biết ơn để neo lại năng lượng tích cực.',
  'Nhích một bước nhỏ cho việc bạn đang trì hoãn — chỉ một bước thôi.',
  'Chủ động hỏi thăm một người quan trọng với bạn.',
  'Cho mình một khoảng tĩnh: tắt thông báo 30 phút và thở chậm.',
  'Sắp xếp gọn một góc không gian sống hoặc làm việc.',
  'Ghi lại một ý tưởng và phác 3 bước đầu tiên để thử.',
  'Vận động nhẹ 20 phút: đi bộ, giãn cơ hoặc hít thở sâu.',
  'Trong một cuộc trò chuyện, lắng nghe nhiều hơn nói.',
  'Đặt một ranh giới lành mạnh và giữ nó một cách nhẹ nhàng.',
  'Học một điều nhỏ mới: một từ, một mẹo hay một bài đọc ngắn.',
  'Rà lại lịch tuần hoặc chi tiêu và bớt đi một việc không cần.',
  'Tự thưởng cho mình một niềm vui giản dị mà bạn xứng đáng.'
]

export function buildReport(res, today) {
  const lpTitle = (res.lp.info.title || '').replace(/^Số \d+ — /, '')
  const py = PERSONAL_YEAR[res.py]
  const intro = `Bạn mang Số Chủ Đạo ${res.lp.lp}${res.lp.info.master ? ' (bậc thầy)' : ''} — ${lpTitle}. ` +
    `Theo lịch Can Chi, bạn tuổi ${res.canChi.conGiap}, mệnh ${res.canChi.menhHanh} (${res.canChi.napAm})${res.hourCC ? ', giờ sinh ' + res.hourCC.tenCanChi : ''}` +
    (res.zodiac ? `, cung ${res.zodiac.ten}` : '') + '. ' +
    `Năm cá nhân ${CUR.getFullYear()} của bạn là số ${res.py}${py ? ' — ' + py.title.replace(/^Năm \d+ — /, '') : ''}.`
  const topic = res.topic || 'Tổng quan'
  const card = today && today.card ? `${today.card.nameVi} (${today.up ? 'xuôi' : 'ngược'})` : 'lá bài hôm nay'
  const meaning = today && today.card ? (today.up ? (today.card.up || '') : (today.card.rev || '')) : ''
  const firstSentence = meaning ? meaning.split('. ')[0].trim().replace(/\.*$/, '') : ''
  const focus = (res.question ? `Với câu hỏi “${res.question}” về chủ đề ${topic}, ` : `Ở chủ đề ${topic}, `) +
    `lá ${card} cùng đỉnh vận hiện tại (số ${res.curPin.p}, thử thách ${res.curPin.c}) gợi mở vài góc nhìn để bạn tự soi chiếu` +
    (firstSentence ? `: ${firstSentence}.` : '.') + ' ' +
    `Hãy xem đây là chất liệu để suy ngẫm rồi tự quyết định — không phải lời phán chắc chắn về tương lai.`
  const kw = n => (NUMEROLOGY[n] && NUMEROLOGY[n].keys ? NUMEROLOGY[n].keys[0] : '')
  let topicNote
  if (topic === 'Tình yêu') topicNote = res.nn
    ? `Tình yêu — Số Linh Hồn ${res.nn.soulUrge} (${kw(res.nn.soulUrge)}) hé lộ điều trái tim bạn thật sự mong; hãy ưu tiên sự chân thành và lắng nghe cảm xúc của cả hai.`
    : `Tình yêu — hãy ưu tiên sự chân thành, lắng nghe, và cho mối quan hệ thời gian để lớn lên.`
  else if (topic === 'Công việc') topicNote = `Công việc — Số Chủ Đạo ${res.lp.lp} (${kw(res.lp.lp)})` +
    (res.nn ? ` cùng Số Vận Mệnh ${res.nn.expression} (${kw(res.nn.expression)})` : '') +
    ` cho thấy thế mạnh tự nhiên của bạn; hãy chọn việc cho phép phát huy điều đó và tiến từng bước.`
  else if (topic === 'Tài chính') topicNote = `Tài chính — góc này cần sự thực tế: ưu tiên kế hoạch rõ ràng, chi tiêu trong tầm và tránh quyết định vội. (Chỉ là thông tin tham khảo, không phải lời khuyên tài chính.)`
  else topicNote = `Tổng quan — cân bằng giữa điều bạn giỏi (Số Chủ Đạo ${res.lp.lp}) và điều hoàn cảnh đang mời gọi; đi chậm mà chắc.`
  const saoNote = res.sao ? 'Sao chiếu mệnh năm nay (Cửu Diệu): ' + res.sao.ten + ' — sao ' + res.sao.loai + '. ' + res.sao.y + ' (Quan niệm dân gian, chỉ để tham khảo.)' : ''
  const seed = (res.lp.lp || 0) + (res.py || 0)
  const week = []
  for (let i = 0; i < 7; i++) week.push(`Ngày ${i + 1}: ${WEEK_POOL[(seed + i * 5) % WEEK_POOL.length]}`)
  let tuVi = ''
  if (res.laso) { const ds = doSangSummary(res.laso); tuVi = 'Lá số Tử Vi: Mệnh tại ' + res.laso.menhChi + ', Cục ' + res.laso.cuc.ten + ', cách cục ' + res.laso.menhCach.ten + '. ' + (ds ? ds.text : '') }
  return { intro, focus, topicNote, saoNote, week, tuVi }
}
