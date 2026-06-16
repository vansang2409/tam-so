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

/* ===== Luận giải sâu hơn cho 64 quẻ (gloss ~2-3 câu, không phải nguyên văn kinh) ===== */
const LUAN = {
  1: 'Sức sáng tạo cương kiện đang ở đỉnh; trời vận hành không ngừng nghỉ. Hãy chủ động, chính trực và bền bỉ như rồng, nhưng nhớ "lên quá cao mà kiêu thì hối hận".',
  2: 'Đức nhu thuận, bao dung và nâng đỡ như đất chở muôn vật. Thành công đến khi bạn đi theo, hỗ trợ và kiên nhẫn thay vì tranh đi trước; giữ sự ngay thẳng bền bỉ.',
  3: 'Buổi đầu gian nan như mầm non rẽ đất, rối ren và nhiều trắc trở. Đừng vội tiến; hãy tìm cộng sự, kiên trì sắp xếp rồi thời cơ sẽ mở.',
  4: 'Còn non dại, mông muội cần được khai sáng. Hãy khiêm tốn học hỏi, tìm thầy tìm bạn; người dạy cũng cần kiên nhẫn đúng lúc.',
  5: 'Cần chờ đợi đúng thời và nuôi dưỡng thực lực. Có lòng thành tín thì hanh thông; nóng vội vượt sông lúc nước xiết là tự chuốc nguy.',
  6: 'Tranh chấp, kiện tụng đang manh nha. Nên dè dặt, tìm hòa giải và người trung gian công minh; cố thắng đến cùng thường gặt bất lợi.',
  7: 'Dụng binh, tổ chức lực lượng cần kỷ luật và người dẫn dắt chính danh. Hành động vì lẽ phải và được lòng người thì mới vững.',
  8: 'Thân ái, quy tụ và đoàn kết quanh một trung tâm đáng tin. Đến sớm với lòng thành thì tốt; chần chừ hay hai lòng thì muộn màng.',
  9: 'Sức tích lũy còn nhỏ, chỉ đủ kìm hãm tạm thời. Hãy trau dồi nội lực và nhẫn nại chờ mây tụ thành mưa; chưa phải lúc làm lớn.',
  10: 'Bước đi thận trọng như đạp lên đuôi cọp mà không bị cắn. Giữ lễ, cẩn trọng và đúng mực thì vượt qua được hiểm.',
  11: 'Trời đất giao hòa, trên dưới thông suốt — thời thái bình hanh thông. Hãy tận dụng vận tốt để vun đắp, nhưng nhớ thịnh tất có lúc suy.',
  12: 'Bế tắc, trên dưới cách trở, tiểu nhân đắc thế. Quân tử nên thu mình giữ đức và chờ thời, chớ cố vùng vẫy lúc này.',
  13: 'Đồng lòng hợp quần vì mục tiêu chung, công khai và chính trực. Hợp tác rộng rãi sẽ giúp vượt qua cả khó khăn lớn.',
  14: 'Sở hữu lớn, thịnh vượng và sáng rỡ. Giữ được nhờ khiêm nhường, sáng suốt và biết chia sẻ; kiêu căng thì sẽ mất.',
  15: 'Khiêm tốn, nhún nhường mà vẫn vững như núi giấu trong lòng đất. Đây là đức bền vững nhất — càng khiêm càng được kính trọng và thành công.',
  16: 'Hứng khởi, vui hòa và thuận thời để chuẩn bị hành động. Có kế hoạch và được lòng người thì thuận lợi; chớ buông thả trong an vui.',
  17: 'Tùy thời mà thuận theo lẽ phải, linh hoạt thích ứng. Đi theo điều đúng và người hiền thì hanh thông; tùy tiện chạy theo thì hỏng.',
  18: 'Việc cũ đổ nát cần chỉnh đốn, sửa chữa những sai lầm tích tụ. Mạnh dạn cải tổ từ gốc, cẩn trọng cả trước lẫn sau thì mới yên.',
  19: 'Thời tiến tới, ảnh hưởng lớn dần như bề trên đến với dân. Hãy lãnh đạo bằng đức và sự chân thành, nhưng nhớ thịnh có kỳ hạn.',
  20: 'Quan sát và chiêm nghiệm sâu sắc trước khi hành động. Lấy mình làm gương, nhìn rộng thời thế để hiểu và được tin phục.',
  21: 'Cắn vỡ vật cản giữa hai hàm răng — trừ bỏ trở ngại một cách dứt khoát. Dùng quy tắc minh bạch và công bằng để thông suốt.',
  22: 'Trang sức, vẻ đẹp và hình thức làm mọi thứ rạng rỡ. Hình thức đẹp là tốt, nhưng phải đi cùng nội dung thực chất, đừng phù phiếm.',
  23: 'Bóc mòn, suy lạc — âm thịnh dương suy, nền tảng lung lay. Nên giữ gìn, ẩn nhẫn chờ qua giai đoạn này, không phải lúc tiến.',
  24: 'Dương khí quay về sau cực điểm của âm — hồi sinh và trở lại. Sửa sai rồi bắt đầu lại đúng lúc; thuận theo chu kỳ tự nhiên.',
  25: 'Chân thành, vô tư, thuận theo lẽ tự nhiên không vọng cầu. Giữ lòng ngay thẳng thì hanh; mưu tính trái đạo dễ gặp họa bất ngờ.',
  26: 'Tích chứa lớn về tài lực và đức hạnh, dồn nén chờ ngày bung ra. Nuôi dưỡng và kiềm chế đúng lúc, biết dùng người hiền thì lợi lớn.',
  27: 'Nuôi dưỡng — ăn uống và lời nói đều cần chừng mực, đúng đắn. Hãy chăm cả nuôi thân lẫn nuôi tâm, giữ gìn lời ăn tiếng nói.',
  28: 'Gánh nặng vượt sức, xà nhà cong oằn — một tình thế phi thường. Cần biện pháp khác thường nhưng vẫn thận trọng, đừng để quá đà.',
  29: 'Hiểm trùng hiểm như nước trong vực sâu. Giữ lòng thành tín và bản lĩnh, quen dần với hiểm thì mới thoát ra được.',
  30: 'Sáng rõ, bám víu vào chính đạo như lửa cần củi để cháy. Nương vào điều đúng và người sáng suốt thì rạng rỡ; giữ sự ôn hòa.',
  31: 'Cảm ứng, rung động và giao cảm chân thành — điềm tốt cho tình duyên. Hai bên thành thật cảm nhau thì hợp; chớ giả tạo hay vụ lợi.',
  32: 'Bền lâu, kiên trì giữ đạo thường hằng. Thành công đến từ sự kiên định có nguyên tắc, không phải cố chấp bất biến.',
  33: 'Lui ẩn đúng lúc khi tiểu nhân đang lên. Rút lui khôn ngoan để giữ mình không phải là thua, mà là biết chờ thời.',
  34: 'Cường thịnh, sức mạnh dồi dào như sấm vang giữa trời. Dùng sức phải hợp lẽ và chính đáng; mạnh mà thô bạo sẽ vấp ngã.',
  35: 'Tiến lên, thăng tiến và rạng rỡ như mặt trời mọc. Đây là thời cơ tốt để tiến thân bằng đức sáng và sự tín nhiệm.',
  36: 'Ánh sáng bị che lấp, người hiền gặp thời tăm tối. Hãy giấu tài, giữ chí và sự ngay thẳng bên trong, chờ trời sáng trở lại.',
  37: 'Đạo nhà — mỗi người tròn vai, trên dưới thuận hòa. Trị nhà ngay ngắn từ bên trong thì mọi việc bên ngoài đều yên.',
  38: 'Trái lìa, khác biệt và hiểu lầm gây chia rẽ. Việc lớn khó thành, nhưng việc nhỏ vẫn nên; hãy tìm điểm chung trong dị biệt.',
  39: 'Gian nan, bước đi khập khiễng trước hiểm trở. Nên dừng lại, cầu người giúp và xét lại mình thay vì liều tiến.',
  40: 'Cởi mở, hóa giải sau cơn bế tắc như băng tan. Hãy tha thứ, buông bỏ và mau giải quyết tồn đọng; chủ động thì có lợi.',
  41: 'Bớt dưới ích trên — hy sinh, giảm chi để dồn cho điều lớn hơn. Thành tâm và chừng mực thì sự giảm bớt lại hóa thành lợi.',
  42: 'Tăng ích, lợi mình lợi người, người trên giúp người dưới. Thời thuận để hành thiện và làm việc lớn; hành động mau thì tốt.',
  43: 'Quyết đoán dứt khoát để trừ bỏ điều xấu cuối cùng. Hãy công khai chính trực, cẩn trọng dùng sức, chớ chủ quan khinh địch.',
  44: 'Gặp gỡ bất ngờ, một mầm âm mới sinh dưới quần dương. Cẩn trọng với cám dỗ và kẻ tiểu nhân mới xuất hiện, chớ vội kết thân.',
  45: 'Tụ họp, quy tụ lòng người về một mối. Cần người lãnh đạo chính danh và lòng thành; nơi đông người cũng nên phòng biến cố.',
  46: 'Đi lên dần dần như mầm cây xuyên qua đất. Tích lũy từng bước, theo người trên đáng tin thì thăng tiến hanh thông.',
  47: 'Khốn cùng, bị vây hãm và cạn kiệt nguồn lực. Giữ chí và lời nói đáng tin, an nhiên chờ thoát; than vãn lúc này vô ích.',
  48: 'Giếng nước nuôi dân — nguồn lực bền nhưng cần khơi thông, tu sửa. Nuôi dưỡng người khác và giữ nguồn trong sạch là điều cốt lõi.',
  49: 'Cách mạng, thay cũ đổi mới khi thời cơ đã chín. Cải cách phải hợp lòng người và đúng thời thì mới được tin theo.',
  50: 'Đỉnh vạc nấu chín, nuôi dưỡng hiền tài và đổi mới trong ổn định. Định vị đúng và vững vàng thì hanh thông lớn.',
  51: 'Sấm động dồn dập gây chấn kinh. Giữ được bình tĩnh và lòng kính sợ giữa biến động thì vô sự, sau cơn sợ lại an.',
  52: 'Dừng lại đúng lúc, tĩnh tại như núi. Biết khi nào nên ngừng và an trú trong hiện tại thì lòng yên, không lỗi.',
  53: 'Tiến từ từ, tuần tự như cây lớn dần trên núi — điềm tốt cho hôn nhân. Theo đúng trình tự và kiên nhẫn thì bền vững.',
  54: 'Cưới gả, kết hợp nhưng danh phận chưa chính. Cẩn trọng với vị trí và động cơ; nóng vội theo cảm xúc dễ sinh hối tiếc.',
  55: 'Thịnh đại, rực rỡ đến đỉnh điểm như mặt trời chính ngọ. Hãy tận hưởng nhưng tỉnh táo, vì lên tới đỉnh rồi sẽ xế bóng.',
  56: 'Lữ khách nơi đất lạ, tạm bợ và đơn độc. Khiêm nhường, cẩn trọng và giữ mình thì yên; kiêu hay sơ suất dễ gặp họa.',
  57: 'Thuận nhập, mềm mỏng thấm dần như gió len khắp nơi. Khiêm hòa, kiên trì theo lẽ phải sẽ đạt mục tiêu; chớ nhu nhược thái quá.',
  58: 'Vui đẹp, hòa duyệt và giao tiếp chân thành. Niềm vui chân thật và đúng đạo thì hanh; vui giả tạo, a dua thì hại.',
  59: 'Ly tán cần được quy tụ lại, hóa giải chia rẽ. Lấy chí lớn và lòng thành để gắn kết mọi người; hành động kịp thời.',
  60: 'Tiết chế, chừng mực và giữ điều độ như từng đốt tre. Có giới hạn hợp lý thì thông; tiết chế khắc nghiệt quá thì khó bền.',
  61: 'Thành tín tự đáy lòng, cảm hóa được cả người lẫn vật. Lòng chân thật là gốc của mọi việc; tin nhau thì vượt được hiểm.',
  62: 'Hơi vượt mức ở việc nhỏ thì được, việc lớn thì không nên. Hãy khiêm cung, cẩn thận tiểu tiết; chớ làm chuyện quá tầm.',
  63: 'Việc đã thành, mọi thứ vào đúng chỗ — viên mãn. Nhưng thành rồi dễ lơi lỏng; phải đề phòng và giữ gìn ngay từ lúc đang yên.',
  64: 'Việc chưa xong, đang ở ngưỡng hoàn tất. Kiên trì và cẩn trọng đến bước cuối; sắp qua sông thì chớ để ướt đuôi.'
}
HEXAGRAMS.forEach(h => { h.luan = LUAN[h.n] })

/* ===== v2.8: Ý nghĩa 6 vị trí hào + quy tắc luận hào động =====
 * Nguồn phương pháp: ngôi hào (đắc trung, "đa hung/đa cụ", ngôi chí tôn) theo
 * Hệ Từ – Thập Dực; cách đọc hào động theo hướng dẫn phổ biến (horos.vn).
 * Mang tính tham khảo, không phải khoa học. */
export const HAO_VITRI = [
  { vi: 1, ten: 'Sơ hào (1)', y: 'Ở dưới cùng — việc mới khởi, lực còn mỏng và ẩn vi. Nên thận trọng dò đường, chưa vội ra mặt.' },
  { vi: 2, ten: 'Hào hai (2)', y: 'Giữa nội quái (đắc trung) — ngôi người dưới tài giỏi, phần nhiều tốt lành. Giữ trung chính thì được tin dùng.' },
  { vi: 3, ten: 'Hào ba (3)', y: 'Cuối nội quái, giáp ranh trên–dưới, "đa hung" (nhiều nguy). Dễ bất an, cần cẩn trọng kẻo vấp.' },
  { vi: 4, ten: 'Hào tư (4)', y: 'Đầu ngoại quái, sát ngôi vua (hào 5), "đa cụ" (nhiều lo). Phải khiêm thuận, dè dặt khi gần người trên.' },
  { vi: 5, ten: 'Hào năm (5)', y: 'Giữa ngoại quái (đắc trung) và ngôi chí tôn — thường cát nhất, là chủ quẻ. Nên trung chính, độ lượng.' },
  { vi: 6, ten: 'Thượng hào (6)', y: 'Trên cùng, thời đã đến cùng cực — công thành nên lui. Coi chừng thái quá mà hối (như "kháng long hữu hối").' }
]

/** Quy tắc đọc khi gieo có hào động (mức cơ bản) */
export function readingGuide(pos) {
  if (!pos || pos.length === 0) return 'Không có hào động — chỉ xét quẻ chính: đọc lời quẻ (thoán từ) và tượng quẻ.'
  if (pos.length === 1) return `Một hào động (hào ${pos[0]}) — trọng tâm nằm ở lời hào động này; quẻ biến cho thấy chiều chuyển hóa.`
  const min = Math.min(...pos), max = Math.max(...pos)
  return `Nhiều hào động (${pos.join(', ')}) — ở mức cơ bản, lấy hào thấp nhất (hào ${min}) hoặc cao nhất (hào ${max}) làm trọng tâm, đồng thời xem quẻ biến để thấy xu hướng chuyển hóa.`
}

/* Link đọc nguyên văn thoán từ / hào từ từng quẻ (nguồn: Dịch học Kabala) */
const SRC = {
  1:'que-1-thuan-can',2:'que-2-thuan-khon',3:'que-3-thuy-loi-truan',4:'que-4-son-thuy-mong',
  5:'que-5-thuy-thien-nhu',6:'que-6-thien-thuy-tung',7:'que-7-dia-thuy-su',8:'que-8-thuy-dia-ty',
  9:'que-9-phong-thien-tieu-suc',10:'que-10-thien-trach-ly',11:'que-11-dia-thien-thai',12:'que-12-thien-dia-bi',
  13:'que-13-thien-hoa-dong-nhan',14:'que-14-hoa-thien-dai-huu',15:'que-15-dia-son-khiem',16:'que-16-loi-dia-du',
  17:'que-17-trach-loi-tuy',18:'que-18-son-phong-co',19:'que-19-dia-trach-lam',20:'que-20-phong-dia-quan',
  21:'que-21-hoa-loi-phe-hap',22:'que-22-son-hoa-bi',23:'que-23-son-dia-bac',24:'que-24-dia-loi-phuc',
  25:'que-25-thien-loi-vo-vong',26:'que-26-son-thien-dai-suc',27:'que-27-son-loi-di',28:'que-28-trach-phong-dai-qua',
  29:'que-29-thuan-kham',30:'que-30-thuan-ly',31:'que-31-trach-son-ham',32:'que-32-loi-phong-hang',
  33:'que-33-thien-son-don',34:'que-34-loi-thien-dai-trang',35:'que-35-hoa-dia-tan',36:'que-36-dia-hoa-minh-di',
  37:'que-37-phong-hoa-gia-nhan',38:'que-38-hoa-trach-khue',39:'que-39-thuy-son-kien',40:'que-40-loi-thuy-giai',
  41:'que-41-son-trach-ton',42:'que-42-phong-loi-ich',43:'que-43-trach-thien-quai',44:'que-44-thien-phong-cau',
  45:'que-45-trach-dia-tuy',46:'que-46-dia-phong-thang',47:'que-47-trach-thuy-khon',48:'que-48-thuy-phong-tinh',
  49:'que-49-trach-hoa-cach',50:'que-50-hoa-phong-dinh',51:'que-51-thuan-chan',52:'que-52-can-vi-son',
  53:'que-53-phong-son-tiem',54:'que-54-loi-trach-quy-muoi',55:'que-55-loi-hoa-phong',56:'que-56-hoa-son-lu',
  57:'que-57-thuan-ton',58:'que-58-thuan-doai',59:'que-59-phong-thuy-hoan',60:'que-60-thuy-trach-tiet',
  61:'que-61-phong-trach-trung-phu',62:'que-62-loi-son-tieu-qua',63:'que-63-thuy-hoa-ky-te',64:'que-64-hoa-thuy-vi-te'
}
HEXAGRAMS.forEach(h => { h.src = 'https://dich.kabala.vn/' + SRC[h.n] })

/** Quẻ "hôm nay" — tất định theo ngày (giống cardOfDay). */
export function hexagramOfDay(date = new Date()) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  return HEXAGRAMS[seed % 64]
}
