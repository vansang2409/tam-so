/* CUNG HOÀNG ĐẠO (chiêm tinh phương Tây). Mốc ngày theo hệ phổ biến;
 * ranh giới có thể lệch ±1 ngày tùy năm/nguồn (hiệu ứng giáp ranh) — cần kiểm chứng nếu sinh sát mốc.
 * Mang tính tham khảo/giải trí, không phải khoa học. */

export const ZODIAC = [
  { ten: 'Bạch Dương', en: 'Aries', sym: '♈', from: [3, 21], to: [4, 19], nguyenTo: 'Lửa', sao: 'Hỏa tinh (Mars)', tinh: 'Khởi (Cardinal)', than: 'Đầu, mặt', net: 'Nhiệt huyết, quyết liệt, tiên phong, thẳng thắn.' },
  { ten: 'Kim Ngưu', en: 'Taurus', sym: '♉', from: [4, 20], to: [5, 20], nguyenTo: 'Đất', sao: 'Kim tinh (Venus)', tinh: 'Định (Fixed)', than: 'Cổ, họng', net: 'Kiên định, thực tế, yêu cái đẹp, đáng tin.' },
  { ten: 'Song Tử', en: 'Gemini', sym: '♊', from: [5, 21], to: [6, 20], nguyenTo: 'Khí', sao: 'Thủy tinh (Mercury)', tinh: 'Biến (Mutable)', than: 'Vai, tay, phổi', net: 'Linh hoạt, hoạt ngôn, tò mò, đa tài.' },
  { ten: 'Cự Giải', en: 'Cancer', sym: '♋', from: [6, 21], to: [7, 22], nguyenTo: 'Nước', sao: 'Mặt Trăng', tinh: 'Khởi (Cardinal)', than: 'Ngực, dạ dày', net: 'Tình cảm, chở che, gắn bó gia đình, nhạy cảm.' },
  { ten: 'Sư Tử', en: 'Leo', sym: '♌', from: [7, 23], to: [8, 22], nguyenTo: 'Lửa', sao: 'Mặt Trời', tinh: 'Định (Fixed)', than: 'Tim, lưng', net: 'Tự tin, hào phóng, lôi cuốn, thích dẫn dắt.' },
  { ten: 'Xử Nữ', en: 'Virgo', sym: '♍', from: [8, 23], to: [9, 22], nguyenTo: 'Đất', sao: 'Thủy tinh (Mercury)', tinh: 'Biến (Mutable)', than: 'Bụng, hệ tiêu hóa', net: 'Tỉ mỉ, chỉn chu, phân tích, cầu toàn.' },
  { ten: 'Thiên Bình', en: 'Libra', sym: '♎', from: [9, 23], to: [10, 22], nguyenTo: 'Khí', sao: 'Kim tinh (Venus)', tinh: 'Khởi (Cardinal)', than: 'Thận, eo', net: 'Hài hòa, công bằng, ngoại giao, yêu cái đẹp.' },
  { ten: 'Bọ Cạp', en: 'Scorpio', sym: '♏', from: [10, 23], to: [11, 21], nguyenTo: 'Nước', sao: 'Diêm Vương (Pluto)', tinh: 'Định (Fixed)', than: 'Cơ quan sinh sản', net: 'Sâu sắc, mãnh liệt, bí ẩn, ý chí mạnh.' },
  { ten: 'Nhân Mã', en: 'Sagittarius', sym: '♐', from: [11, 22], to: [12, 21], nguyenTo: 'Lửa', sao: 'Mộc tinh (Jupiter)', tinh: 'Biến (Mutable)', than: 'Hông, đùi', net: 'Phóng khoáng, lạc quan, ưa tự do, ham khám phá.' },
  { ten: 'Ma Kết', en: 'Capricorn', sym: '♑', from: [12, 22], to: [1, 19], nguyenTo: 'Đất', sao: 'Thổ tinh (Saturn)', tinh: 'Khởi (Cardinal)', than: 'Đầu gối, xương', net: 'Kỷ luật, tham vọng, kiên trì, trách nhiệm.' },
  { ten: 'Bảo Bình', en: 'Aquarius', sym: '♒', from: [1, 20], to: [2, 18], nguyenTo: 'Khí', sao: 'Thiên Vương (Uranus)', tinh: 'Định (Fixed)', than: 'Cẳng chân, mắt cá', net: 'Độc lập, sáng tạo, nhân văn, khác biệt.' },
  { ten: 'Song Ngư', en: 'Pisces', sym: '♓', from: [2, 19], to: [3, 20], nguyenTo: 'Nước', sao: 'Hải Vương (Neptune)', tinh: 'Biến (Mutable)', than: 'Bàn chân', net: 'Mơ mộng, giàu trực giác, nghệ sĩ, đồng cảm.' }
]

export function getZodiac(day, month) {
  for (const z of ZODIAC) {
    const [fm, fd] = z.from, [tm, td] = z.to
    if (fm <= tm) { if ((month === fm && day >= fd) || (month === tm && day <= td) || (month > fm && month < tm)) return z }
    else { if ((month === fm && day >= fd) || (month === tm && day <= td) || month > fm || month < tm) return z } // Ma Kết vắt qua năm
  }
  return null
}

/* ===== Thuộc tính may mắn (quan niệm phổ biến, tham khảo) + tương hợp ===== */
export const LUCKY = {
  Aries:       { mau: 'Đỏ', da: 'Kim cương / Ruby', so: '1, 9' },
  Taurus:      { mau: 'Xanh lá / Hồng', da: 'Ngọc lục bảo (Emerald)', so: '6' },
  Gemini:      { mau: 'Vàng', da: 'Mã não (Agate)', so: '5' },
  Cancer:      { mau: 'Trắng bạc', da: 'Ngọc trai (Pearl)', so: '2' },
  Leo:         { mau: 'Vàng kim / Cam', da: 'Hồng ngọc (Ruby)', so: '1' },
  Virgo:       { mau: 'Nâu / Xanh navy', da: 'Sapphire', so: '5' },
  Libra:       { mau: 'Hồng / Xanh pastel', da: 'Opal', so: '6' },
  Scorpio:     { mau: 'Đỏ đô / Đen', da: 'Topaz / Garnet', so: '9' },
  Sagittarius: { mau: 'Tím / Xanh dương', da: 'Lam ngọc (Turquoise)', so: '3' },
  Capricorn:   { mau: 'Đen / Nâu đất', da: 'Ngọc hồng lựu (Garnet)', so: '8' },
  Aquarius:    { mau: 'Xanh điện', da: 'Thạch anh tím (Amethyst)', so: '4' },
  Pisces:      { mau: 'Xanh biển / Tím', da: 'Ngọc xanh biển (Aquamarine)', so: '7' }
}

export function zodiacCompat(a, b) {
  const e1 = a.nguyenTo, e2 = b.nguyenTo
  const bo = (x, y) => (e1 === x && e2 === y) || (e1 === y && e2 === x)
  let verdict, note
  if (e1 === e2) { verdict = 'Rất hợp'; note = `Cùng nguyên tố ${e1} — dễ thấu hiểu, cùng nhịp năng lượng.` }
  else if (bo('Lửa', 'Khí')) { verdict = 'Hợp'; note = 'Lửa và Khí tiếp sức nhau — Khí thổi bùng Lửa, năng động và truyền cảm hứng.' }
  else if (bo('Đất', 'Nước')) { verdict = 'Hợp'; note = 'Đất và Nước nuôi dưỡng nhau — ổn định và giàu cảm xúc.' }
  else if (bo('Lửa', 'Nước')) { verdict = 'Cần dung hòa'; note = 'Lửa và Nước trái cực — cần lắng nghe để không dập tắt nhau.' }
  else if (bo('Đất', 'Khí')) { verdict = 'Cần dung hòa'; note = 'Đất và Khí khác nhịp — một bên thực tế, một bên bay bổng.' }
  else { verdict = 'Trung bình'; note = 'Hai nguyên tố cần thời gian điều chỉnh để hòa hợp.' }
  return { a, b, verdict, note }
}

/* Decan (thập phân) — hệ TRIPLICITY: mỗi cung chia 3 đoạn ~10°/~10 ngày.
 * Decan 1 = nét thuần của cung; decan 2 & 3 nhuốm thêm hai cung cùng nguyên tố.
 * Tính xấp xỉ theo ngày; là một trong vài hệ decan — chỉ tham khảo. */
const _DOY = (m, d) => { const c = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]; return c[m - 1] + d }
export function decanOf(day, month) {
  const z = getZodiac(day, month); if (!z) return null
  let start = _DOY(z.from[0], z.from[1]), cur = _DOY(month, day)
  if (cur < start) cur += 365
  const idx = Math.min(2, Math.max(0, Math.floor((cur - start) / 10)))
  const sameEl = ZODIAC.filter(s => s.nguyenTo === z.nguyenTo)
  const pos = sameEl.findIndex(s => s.en === z.en)
  return { num: idx + 1, sub: sameEl[(pos + idx) % sameEl.length], pure: idx === 0 }
}

/* ===== Slug (cho URL/SEO) ===== */
export const ZODIAC_SLUG = {
  Aries: 'bach-duong', Taurus: 'kim-nguu', Gemini: 'song-tu', Cancer: 'cu-giai',
  Leo: 'su-tu', Virgo: 'xu-nu', Libra: 'thien-binh', Scorpio: 'bo-cap',
  Sagittarius: 'nhan-ma', Capricorn: 'ma-ket', Aquarius: 'bao-binh', Pisces: 'song-ngu'
}
export function zodiacBySlug(slug) { return ZODIAC.find(z => ZODIAC_SLUG[z.en] === slug) || null }

/* ===== Nội dung sâu từng cung (tự biên soạn từ archetype phổ biến — tham khảo, không phán) ===== */
export const ZODIAC_DEEP = {
  Aries:       { tinhYeu: 'Yêu nồng nhiệt, chủ động theo đuổi, thích sự thẳng thắn; cần học kiên nhẫn và lắng nghe để lửa không thiêu mất sự dịu dàng.', congViec: 'Hợp vai trò tiên phong, khởi xướng, lãnh đạo; mạnh khi được tự chủ, dễ chán việc lặp lại.', taiChinh: 'Kiếm tốt nhưng tiêu nhanh theo hứng; lập quỹ tự động giúp giữ tiền.', diemManh: 'Quyết đoán, can đảm, truyền năng lượng.', luuY: 'Nóng vội, dễ bốc đồng — đếm đến mười trước khi phản ứng.', hopVoi: ['Sư Tử', 'Nhân Mã', 'Song Tử'] },
  Taurus:      { tinhYeu: 'Chung thủy, ấm áp, trọng cảm giác an toàn; cần tránh bảo thủ và ghen âm thầm.', congViec: 'Bền bỉ, đáng tin, giỏi việc cần sự kiên trì và thẩm mỹ; thăng tiến chậm mà chắc.', taiChinh: 'Biết tích lũy, yêu của bền; cẩn thận quá mê vật chất/tiện nghi.', diemManh: 'Kiên định, thực tế, đáng tin cậy.', luuY: 'Ngại thay đổi, cứng nhắc — thử mở lòng với cái mới.', hopVoi: ['Xử Nữ', 'Ma Kết', 'Cự Giải'] },
  Gemini:      { tinhYeu: 'Cần kết nối trí tuệ, thích trò chuyện và mới mẻ; dễ phân tâm nên cần sự chân thành để bền.', congViec: 'Giỏi giao tiếp, viết lách, kết nối, đa nhiệm; hợp truyền thông, kinh doanh, giảng dạy.', taiChinh: 'Linh hoạt nhiều nguồn thu; nên tránh dàn trải và quyết định vội.', diemManh: 'Nhanh trí, linh hoạt, hoạt ngôn.', luuY: 'Thiếu kiên định, cả thèm chóng chán — chọn một việc làm tới nơi.', hopVoi: ['Thiên Bình', 'Bảo Bình', 'Bạch Dương'] },
  Cancer:      { tinhYeu: 'Sâu sắc, chở che, gắn bó gia đình; nhạy cảm nên cần được trấn an và thấu hiểu.', congViec: 'Tận tâm, giỏi chăm sóc và ghi nhớ; hợp nghề nuôi dưỡng, dịch vụ, sáng tạo.', taiChinh: 'Biết lo xa, tiết kiệm vì tổ ấm; tránh chi theo cảm xúc lúc buồn.', diemManh: 'Giàu tình cảm, trực giác tốt, trung thành.', luuY: 'Dễ giận dỗi, ôm tâm trạng — nói ra thay vì khép vỏ.', hopVoi: ['Bọ Cạp', 'Song Ngư', 'Kim Ngưu'] },
  Leo:         { tinhYeu: 'Hào phóng, nồng ấm, thích được trân trọng; cần bớt cái tôi để bạn đời cũng được tỏa sáng.', congViec: 'Lôi cuốn, biết truyền cảm hứng, hợp vai trò trung tâm/sáng tạo/lãnh đạo.', taiChinh: 'Rộng rãi, thích hưởng thụ và thể diện; đặt ngân sách cho khoản "hào phóng".', diemManh: 'Tự tin, ấm áp, có khí chất dẫn dắt.', luuY: 'Tự ái, thích khen — học đón nhận góp ý.', hopVoi: ['Bạch Dương', 'Nhân Mã', 'Thiên Bình'] },
  Virgo:       { tinhYeu: 'Quan tâm qua hành động thiết thực, kín đáo; cần bớt soi xét để tình cảm dễ thở.', congViec: 'Tỉ mỉ, phân tích, đáng tin với chi tiết; hợp y tế, kỹ thuật, biên tập, vận hành.', taiChinh: 'Quản lý chặt, lập kế hoạch tốt; đôi khi quá lo nên bỏ lỡ cơ hội.', diemManh: 'Chỉn chu, thực tế, tận tụy.', luuY: 'Cầu toàn, hay lo — cho phép "đủ tốt" là được.', hopVoi: ['Kim Ngưu', 'Ma Kết', 'Cự Giải'] },
  Libra:       { tinhYeu: 'Lãng mạn, trọng hòa hợp và công bằng; cần tập ra quyết định và nói "không" khi cần.', congViec: 'Giỏi ngoại giao, thẩm mỹ, kết nối; hợp tư vấn, thiết kế, luật, đối ngoại.', taiChinh: 'Thích cái đẹp nên dễ chi cho phong cách; cân bằng giữa hưởng thụ và tích lũy.', diemManh: 'Hài hòa, công tâm, duyên dáng.', luuY: 'Do dự, ngại va chạm — chính kiến rõ giúp bạn nhẹ lòng.', hopVoi: ['Song Tử', 'Bảo Bình', 'Sư Tử'] },
  Scorpio:     { tinhYeu: 'Mãnh liệt, sâu đậm, trung thành tuyệt đối; cần học buông ghen tuông và tin tưởng.', congViec: 'Tập trung cao, giỏi nghiên cứu/điều tra/chiến lược; bền chí đến cùng.', taiChinh: 'Nhạy bén cơ hội, biết giữ bí mật tài chính; tránh "được ăn cả" mạo hiểm.', diemManh: 'Ý chí mạnh, sâu sắc, kiên định.', luuY: 'Đa nghi, hay giữ trong lòng — chia sẻ giúp nhẹ gánh.', hopVoi: ['Cự Giải', 'Song Ngư', 'Xử Nữ'] },
  Sagittarius: { tinhYeu: 'Phóng khoáng, vui vẻ, cần tự do và cùng nhau khám phá; tránh hứa nhiều làm ít.', congViec: 'Tầm nhìn rộng, hợp đào tạo, du lịch, xuất bản, khởi nghiệp; ghét gò bó.', taiChinh: 'Lạc quan nên dễ tiêu rộng; đặt giới hạn và quỹ dự phòng.', diemManh: 'Lạc quan, chân thành, ham học hỏi.', luuY: 'Bốc đồng, ngại cam kết — kiên trì giúp giấc mơ thành hình.', hopVoi: ['Bạch Dương', 'Sư Tử', 'Bảo Bình'] },
  Capricorn:   { tinhYeu: 'Nghiêm túc, có trách nhiệm, yêu là tính chuyện lâu dài; cần bộc lộ cảm xúc nhiều hơn.', congViec: 'Kỷ luật, tham vọng, leo từng bậc vững chắc; hợp quản lý, tài chính, kỹ thuật.', taiChinh: 'Giỏi tích lũy và đầu tư dài hạn; nhớ thưởng cho mình đôi lúc.', diemManh: 'Bền bỉ, đáng tin, có chí.', luuY: 'Khắt khe, ôm việc — nghỉ ngơi cũng là năng suất.', hopVoi: ['Kim Ngưu', 'Xử Nữ', 'Bọ Cạp'] },
  Aquarius:    { tinhYeu: 'Cần bạn đời cũng là tri kỷ, tôn trọng tự do và sự khác biệt; tránh xa cách cảm xúc.', congViec: 'Sáng tạo, tư duy mới, vì cộng đồng; hợp công nghệ, nghiên cứu, xã hội.', taiChinh: 'Chi cho ý tưởng/công nghệ; cân nhắc tính thực tế trước khi dốc tiền.', diemManh: 'Độc lập, nhân văn, đổi mới.', luuY: 'Bướng, lý trí quá — để trái tim lên tiếng đôi khi.', hopVoi: ['Song Tử', 'Thiên Bình', 'Nhân Mã'] },
  Pisces:      { tinhYeu: 'Dịu dàng, giàu cảm thông, lãng mạn mơ mộng; cần ranh giới để không bị tổn thương.', congViec: 'Giàu trực giác và nghệ thuật, biết đồng cảm; hợp sáng tạo, chữa lành, chăm sóc.', taiChinh: 'Hào phóng, dễ mềm lòng; nhờ người thực tế giúp lập kế hoạch.', diemManh: 'Đồng cảm, sáng tạo, vị tha.', luuY: 'Dễ trốn tránh, cả nể — tập nói "không" và bám thực tế.', hopVoi: ['Cự Giải', 'Bọ Cạp', 'Kim Ngưu'] }
}

/* ===== Tử vi HÔM NAY theo cung — TẤT ĐỊNH theo (cung, ngày). Gợi ý chiêm nghiệm, KHÔNG phải tiên đoán. ===== */
const _DP = {
  tongQuan: [
    'Một ngày hợp để chậm lại, quan sát và lắng nghe trực giác của mình.',
    'Năng lượng nghiêng về kết nối — một cuộc trò chuyện nhỏ có thể mở ra điều dễ chịu.',
    'Thích hợp để sắp xếp lại những việc dang dở cho nhẹ lòng.',
    'Ngày của những bước nhỏ vững chắc hơn là vội vã — cứ từ tốn.',
    'Có lẽ bạn sẽ thấy rõ hơn điều mình thật sự muốn; hãy ghi lại nó.',
    'Một ngày tốt để tử tế với chính mình, nghỉ ngơi đủ và bớt khắt khe.',
    'Cơ hội đến từ sự chủ động nhẹ nhàng — thử mở lời trước một chút.',
    'Hôm nay hợp để học hoặc thử một điều mới mẻ, dù rất nhỏ.'
  ],
  tinhCam: [
    'Sự chân thành được đón nhận — hãy nói điều bạn nghĩ một cách dịu dàng.',
    'Dành chút thời gian chất lượng cho người thân thiết.',
    'Nếu có hiểu lầm, đây là lúc thích hợp để làm lành.',
    'Lắng nghe nhiều hơn nói sẽ khiến mối quan hệ ấm hơn.',
    'Một cử chỉ quan tâm nhỏ có sức nặng hơn lời hứa lớn.',
    'Giữ một khoảng riêng vừa đủ cũng là cách yêu thương.'
  ],
  congViec: [
    'Ưu tiên việc quan trọng nhất, xong rồi hẵng mở việc khác.',
    'Nói rõ kỳ vọng từ đầu sẽ giúp hợp tác trơn tru.',
    'Một ý tưởng cũ có thể đáng nhìn lại dưới góc mới.',
    'Kiên nhẫn với chi tiết hôm nay đỡ phải sửa về sau.',
    'Đừng ngại hỏi — một câu hỏi đúng tiết kiệm nhiều thời gian.',
    'Ghi nhận tiến độ nhỏ cũng giúp giữ động lực.'
  ],
  taiChinh: [
    'Hợp để rà lại chi tiêu và lập một kế hoạch đơn giản, dễ theo.',
    'Cân nhắc kỹ trước quyết định lớn; ngủ một đêm rồi tính.',
    'Một khoản tiết kiệm nhỏ đều đặn vẫn hơn cú lớn bấp bênh.',
    'Tạm tránh mua sắm theo cảm xúc nhất thời.',
    'Minh bạch tiền nong với người liên quan giúp tránh hiểu lầm.',
    'Đầu tư cho kiến thức và sức khỏe thường sinh lời bền.'
  ],
  loiKhuyen: [
    'Hít thở sâu vài lần khi thấy căng — đủ để bình tâm lại.',
    'Một việc tốt nhỏ cho người khác cũng làm ngày của bạn nhẹ hơn.',
    'Đừng so mình với người khác; nhịp của bạn là của riêng bạn.',
    'Uống đủ nước và đi bộ một chút — cơ thể vui thì tâm trí sáng.',
    'Buông bớt điều ngoài tầm kiểm soát, giữ sức cho điều đổi được.',
    'Thử viết ra ba điều khiến bạn biết ơn hôm nay.',
    'Tin vào trực giác nhưng vẫn kiểm tra bằng lý trí.',
    'Cho phép mình chưa hoàn hảo — tiến bộ quan trọng hơn.'
  ]
}
function _hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return Math.abs(h | 0) }
// Engine TẤT ĐỊNH dùng chung cho mọi "tử vi hôm nay" (cung hoàng đạo, con giáp…).
// Cùng (key, ngày) → cùng kết quả; đổi ngày → đổi nội dung. Chỉ là gợi ý chiêm nghiệm.
export function dailyReading(key, dateStr) {
  const pick = (arr, salt) => arr[_hash(key + '|' + dateStr + '|' + salt) % arr.length]
  return {
    nangLuong: 2 + (_hash(key + '|' + dateStr + '|nl') % 4), // 2..5
    tongQuan: pick(_DP.tongQuan, 'tq'),
    tinhCam: pick(_DP.tinhCam, 'tc'),
    congViec: pick(_DP.congViec, 'cv'),
    taiChinh: pick(_DP.taiChinh, 'tt'),
    loiKhuyen: pick(_DP.loiKhuyen, 'lk')
  }
}
export function dailyHoroscope(en, dateStr) { return dailyReading(en, dateStr) }
