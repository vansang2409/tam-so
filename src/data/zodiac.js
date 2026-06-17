/* CUNG HOÀNG ĐẠO (chiêm tinh phương Tây). Mốc ngày theo hệ phổ biến;
 * ranh giới có thể lệch ±1 ngày tùy năm/nguồn (hiệu ứng giáp ranh) — cần kiểm chứng nếu sinh sát mốc.
 * Mang tính tham khảo/giải trí, không phải khoa học. */

export const ZODIAC = [
  { ten: 'Bạch Dương', en: 'Aries', sym: '♈', from: [3, 21], to: [4, 19], nguyenTo: 'Lửa', sao: 'Hỏa tinh (Mars)', net: 'Nhiệt huyết, quyết liệt, tiên phong, thẳng thắn.' },
  { ten: 'Kim Ngưu', en: 'Taurus', sym: '♉', from: [4, 20], to: [5, 20], nguyenTo: 'Đất', sao: 'Kim tinh (Venus)', net: 'Kiên định, thực tế, yêu cái đẹp, đáng tin.' },
  { ten: 'Song Tử', en: 'Gemini', sym: '♊', from: [5, 21], to: [6, 20], nguyenTo: 'Khí', sao: 'Thủy tinh (Mercury)', net: 'Linh hoạt, hoạt ngôn, tò mò, đa tài.' },
  { ten: 'Cự Giải', en: 'Cancer', sym: '♋', from: [6, 21], to: [7, 22], nguyenTo: 'Nước', sao: 'Mặt Trăng', net: 'Tình cảm, chở che, gắn bó gia đình, nhạy cảm.' },
  { ten: 'Sư Tử', en: 'Leo', sym: '♌', from: [7, 23], to: [8, 22], nguyenTo: 'Lửa', sao: 'Mặt Trời', net: 'Tự tin, hào phóng, lôi cuốn, thích dẫn dắt.' },
  { ten: 'Xử Nữ', en: 'Virgo', sym: '♍', from: [8, 23], to: [9, 22], nguyenTo: 'Đất', sao: 'Thủy tinh (Mercury)', net: 'Tỉ mỉ, chỉn chu, phân tích, cầu toàn.' },
  { ten: 'Thiên Bình', en: 'Libra', sym: '♎', from: [9, 23], to: [10, 22], nguyenTo: 'Khí', sao: 'Kim tinh (Venus)', net: 'Hài hòa, công bằng, ngoại giao, yêu cái đẹp.' },
  { ten: 'Bọ Cạp', en: 'Scorpio', sym: '♏', from: [10, 23], to: [11, 21], nguyenTo: 'Nước', sao: 'Diêm Vương (Pluto)', net: 'Sâu sắc, mãnh liệt, bí ẩn, ý chí mạnh.' },
  { ten: 'Nhân Mã', en: 'Sagittarius', sym: '♐', from: [11, 22], to: [12, 21], nguyenTo: 'Lửa', sao: 'Mộc tinh (Jupiter)', net: 'Phóng khoáng, lạc quan, ưa tự do, ham khám phá.' },
  { ten: 'Ma Kết', en: 'Capricorn', sym: '♑', from: [12, 22], to: [1, 19], nguyenTo: 'Đất', sao: 'Thổ tinh (Saturn)', net: 'Kỷ luật, tham vọng, kiên trì, trách nhiệm.' },
  { ten: 'Bảo Bình', en: 'Aquarius', sym: '♒', from: [1, 20], to: [2, 18], nguyenTo: 'Khí', sao: 'Thiên Vương (Uranus)', net: 'Độc lập, sáng tạo, nhân văn, khác biệt.' },
  { ten: 'Song Ngư', en: 'Pisces', sym: '♓', from: [2, 19], to: [3, 20], nguyenTo: 'Nước', sao: 'Hải Vương (Neptune)', net: 'Mơ mộng, giàu trực giác, nghệ sĩ, đồng cảm.' }
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
