/* DỮ LIỆU "ĐI CHÙA" — Đại Tự Tâm Linh (công trình HƯ CẤU, lấy cảm hứng từ nhiều
 * ngôi chùa Việt, KHÔNG sao chép địa điểm cụ thể nào).
 * Gồm: danh sách địa điểm trong khuôn viên + bộ thẻ xăm (nội dung tự biên soạn,
 * lấy cảm hứng từ thể loại xăm dân gian — không chép lại bộ xăm của bất kỳ chùa nào).
 * Thuần JS, KHÔNG phụ thuộc React → test được bằng Node. Không có dữ kiện server. */

// — Địa điểm trong khuôn viên —
// mvp:true = đã có trải nghiệm đầy đủ; mvp:false = đang phát triển (hiện badge "Sắp ra mắt")
export const DICHUA_LOCATIONS = [
  { id: 'cong-tam-quan', ten: 'Cổng Tam Quan', icon: '⛩️', mvp: true, bienHieu: 'ĐẠI TỰ TÂM LINH', tone: 'dawn',
    moTa: 'Cổng ba lối vào của Đại Tự Tâm Linh. Bước qua đây là tạm gác lại ồn ào để vào một nhịp sống chậm hơn.' },
  { id: 'san-chua', ten: 'Sân Chùa', icon: '🌳', mvp: true, bienHieu: 'SÂN CHÙA', tone: 'day',
    moTa: 'Sân lát đá rộng, hai hàng cây rợp bóng — chỗ dừng chân trước khi vào chính điện.' },
  { id: 'chanh-dien', ten: 'Chánh Điện', icon: '🛕', mvp: true, bienHieu: 'ĐẠI HÙNG BẢO ĐIỆN', tone: 'gold',
    moTa: 'Nơi đặt tượng thờ chính, hương trầm quanh năm không tắt — trung tâm của Đại Tự Tâm Linh.' },
  { id: 'thap-chuong', ten: 'Tháp Chuông', icon: '🔔', mvp: false, bienHieu: 'THÁP CHUÔNG', tone: 'dusk',
    moTa: 'Tháp treo đại hồng chung, tiếng chuông ngân mỗi buổi sớm.' },
  { id: 'vuon-thien', ten: 'Vườn Thiền', icon: '🪷', mvp: false, bienHieu: 'VƯỜN THIỀN', tone: 'day',
    moTa: 'Khu vườn tĩnh lặng để ngồi thiền và thả bộ chậm, có hồ sen nhỏ.' },
  { id: 'giang-duong', ten: 'Giảng Đường', icon: '📿', mvp: false, bienHieu: 'GIẢNG ĐƯỜNG', tone: 'day',
    moTa: 'Nơi giảng pháp và sinh hoạt cộng đồng.' },
  { id: 'nha-to', ten: 'Nhà Tổ', icon: '🕯️', mvp: false, bienHieu: 'NHÀ TỔ', tone: 'dusk',
    moTa: 'Nơi thờ các vị tổ sư khai sơn.' },
  { id: 'thu-vien', ten: 'Thư Viện', icon: '📚', mvp: false, bienHieu: 'THƯ VIỆN', tone: 'day',
    moTa: 'Kinh sách và tài liệu tham khảo.' },
  { id: 'tuong-niem', ten: 'Góc Tưởng Niệm', icon: '🪔', mvp: false, bienHieu: 'TƯỞNG NIỆM', tone: 'dusk',
    moTa: 'Không gian lặng để tưởng nhớ người thân đã khuất.' },
  { id: 'phap-bao', ten: 'Cửa Hàng Pháp Bảo', icon: '🛍️', mvp: false, bienHieu: 'PHÁP BẢO', tone: 'day',
    moTa: 'Vật phẩm lưu niệm mang tính biểu tượng — chỉ trưng bày, KHÔNG giao dịch thật.' }
]

export const MVP_LOCATION_IDS = DICHUA_LOCATIONS.filter(l => l.mvp).map(l => l.id)
export const locationById = id => DICHUA_LOCATIONS.find(l => l.id === id) || null

// — Bộ thẻ xăm (16 thẻ, nội dung tự biên soạn lấy cảm hứng dân gian) —
// bac: 'Thượng' | 'Trung Bình' | 'Hạ' — chỉ là sắc thái chiêm nghiệm, KHÔNG phải lời phán chắc.
export const DICHUA_XAM = [
  { so: 1, bac: 'Thượng', cau: ['Mây tan trời tỏ ánh dương lên', 'Việc khó qua rồi phước tự nhiên'],
    dienGiai: 'Giai đoạn trắc trở vừa qua đang nhường chỗ cho sự thông suốt. Đây là lúc thuận để bắt đầu lại hoặc nối tiếp việc đang làm.',
    loiKhuyen: 'Cứ vững tâm tiến tới, nhưng đừng quên người đã giúp bạn lúc khó.' },
  { so: 2, bac: 'Trung Bình', cau: ['Thuyền đi giữa sóng chưa yên hẳn', 'Tay chèo vững vẫn tới được bờ'],
    dienGiai: 'Việc đang làm còn vài trở ngại nhỏ, không phải dấu hiệu phải bỏ giữa đường — chỉ cần thêm kiên nhẫn.',
    loiKhuyen: 'Chia việc lớn thành các bước nhỏ, đi chậm nhưng đều.' },
  { so: 3, bac: 'Thượng', cau: ['Hoa sen giữa bùn vẫn nở thơm', 'Lòng sạch thì việc tự an êm'],
    dienGiai: 'Giữ được sự ngay thẳng giữa hoàn cảnh không thuận lợi sẽ mang lại kết quả tốt hơn bạn nghĩ.',
    loiKhuyen: 'Đừng để hoàn cảnh xung quanh làm thay đổi cách bạn đối xử với người khác.' },
  { so: 4, bac: 'Hạ', cau: ['Đường xa chớ vội qua cầu gãy', 'Dừng bước xem kỹ khỏi lỡ chân'],
    dienGiai: 'Có dấu hiệu vội vàng hoặc thiếu thông tin trong một quyết định gần đây. Không phải điềm xấu — là lời nhắc chậm lại.',
    loiKhuyen: 'Hỏi thêm một người hiểu việc trước khi quyết, đừng tự mình gánh hết.' },
  { so: 5, bac: 'Trung Bình', cau: ['Gió đổi chiều thuyền phải đổi lái', 'Tùy thời ứng biến chẳng thiệt gì'],
    dienGiai: 'Hoàn cảnh đang thay đổi, kế hoạch cũ có thể cần điều chỉnh — đó là linh hoạt, không phải thất bại.',
    loiKhuyen: 'Giữ mục tiêu, nhưng cho phép mình đổi cách đi đến đó.' },
  { so: 6, bac: 'Thượng', cau: ['Cây lâu năm rễ bền gốc chắc', 'Quả ngọt dành cho kẻ đợi chờ'],
    dienGiai: 'Công sức tích lũy lâu nay đang đến gần lúc gặt quả — nhất là trong việc học hành, sự nghiệp.',
    loiKhuyen: 'Đừng nóng vội đốt giai đoạn cuối, giữ đều sức đến khi xong việc.' },
  { so: 7, bac: 'Trung Bình', cau: ['Hai người chung lối chưa chung ý', 'Một câu thật lòng gỡ trăm mối'],
    dienGiai: 'Có một mối quan hệ (gia đình, bạn bè, công việc) đang vướng vì hiểu lầm hơn là vì bất hòa thật sự.',
    loiKhuyen: 'Chủ động nói rõ trước, đừng chờ người khác mở lời.' },
  { so: 8, bac: 'Thượng', cau: ['Trăng tròn không đợi mây phải tan', 'Tự sáng giữa trời chẳng cần khen'],
    dienGiai: 'Giá trị của bạn không cần ai xác nhận mới đúng — đây là lúc tin vào lựa chọn của chính mình.',
    loiKhuyen: 'Làm điều bạn thấy đúng, đừng đợi sự đồng thuận tuyệt đối từ tất cả.' },
  { so: 9, bac: 'Hạ', cau: ['Lửa gần rơm lâu ngày cũng cháy', 'Phòng xa từ sớm đỡ lo sau'],
    dienGiai: 'Có một việc nhỏ nếu bỏ qua lâu có thể thành chuyện lớn hơn — thường liên quan sức khỏe hoặc chi tiêu.',
    loiKhuyen: 'Xử lý việc nhỏ đang trì hoãn ngay trong tuần này, đừng để dồn lại.' },
  { so: 10, bac: 'Trung Bình', cau: ['Đường vòng tuy xa mà chắc bước', 'Đường tắt dễ trượt lúc trời mưa'],
    dienGiai: 'Có hai lựa chọn, một nhanh một chậm — lựa chọn chắc chắn hơn đang là hướng đáng theo lúc này.',
    loiKhuyen: 'Ưu tiên cách làm bạn kiểm soát được, dù mất thêm thời gian.' },
  { so: 11, bac: 'Thượng', cau: ['Khách quý đến nhà niềm vui đến', 'Tin lành theo gió tự xa say'],
    dienGiai: 'Có tin tốt hoặc một cuộc gặp gỡ đáng giá sắp đến — có thể từ người quen lâu chưa liên lạc.',
    loiKhuyen: 'Giữ liên lạc cởi mở, đừng ngại là người chủ động trước.' },
  { so: 12, bac: 'Trung Bình', cau: ['Trời chưa định mưa hay định nắng', 'Mang theo cả hai chẳng thiệt mình'],
    dienGiai: 'Tình hình hiện tại chưa rõ ràng, kết quả còn tùy thuộc nhiều yếu tố — nên chuẩn bị cho cả hai khả năng.',
    loiKhuyen: 'Có một phương án dự phòng, nhưng đừng vì thế mà trì hoãn phương án chính.' },
  { so: 13, bac: 'Thượng', cau: ['Sông sâu thuyền nhẹ qua không ngại', 'Tâm rộng việc khó hóa việc thường'],
    dienGiai: 'Vấn đề có vẻ lớn nhưng cách bạn nhìn nhận nó mới là điều quyết định mức độ khó.',
    loiKhuyen: 'Thử nhìn vấn đề ở góc nhỏ hơn trước khi quyết định nó "quá khó".' },
  { so: 14, bac: 'Hạ', cau: ['Nóng giận tựa lửa thiêu củi khô', 'Một câu nhịn được đỡ trăm lo'],
    dienGiai: 'Có dấu hiệu căng thẳng trong giao tiếp gần đây dễ làm tổn thương quan hệ nếu nói nhanh hơn nghĩ.',
    loiKhuyen: 'Trước khi phản ứng, hãy dành một nhịp thở để chọn lời.' },
  { so: 15, bac: 'Trung Bình', cau: ['Hạt giống gieo rồi chưa vội bứt', 'Đủ nắng đủ mưa tự sẽ lên'],
    dienGiai: 'Việc bạn đã bắt đầu cần thêm thời gian để thấy kết quả — chưa đến lúc đánh giá là thành hay bại.',
    loiKhuyen: 'Tiếp tục chăm chút việc đang làm, tạm gác việc so sánh tiến độ với người khác.' },
  { so: 16, bac: 'Thượng', cau: ['Đèn trước điện không gió cũng sáng', 'Lòng thành ở đó phước tự sinh'],
    dienGiai: 'Sự chân thành và kiên trì âm thầm của bạn đang được ghi nhận, dù chưa ai nói ra.',
    loiKhuyen: 'Tiếp tục làm điều đúng dù không có ai nhìn thấy ngay lúc này.' }
]

export function rutXam(rng = Math.random) {
  const i = Math.floor(rng() * DICHUA_XAM.length)
  return DICHUA_XAM[Math.min(i, DICHUA_XAM.length - 1)]
}
export const xamBySo = so => DICHUA_XAM.find(x => x.so === so) || null

// — Lời nguyện (lưu cục bộ trong trình duyệt máy bạn, KHÔNG gửi đi đâu) —
export const LOINGUYEN_KEY = 'tamso_dichua_loinguyen'
// — Số lần thắp hương (chỉ là bộ đếm tượng trưng) —
export const THAPHUONG_KEY = 'tamso_dichua_thaphuong'

const _ls = () => (typeof localStorage !== 'undefined' ? localStorage : null)

export function loadLoiNguyen() {
  const ls = _ls(); if (!ls) return []
  try { const a = JSON.parse(ls.getItem(LOINGUYEN_KEY) || '[]'); return Array.isArray(a) ? a : [] } catch (e) { return [] }
}

export function addLoiNguyen(text) {
  const t = (text || '').trim()
  if (!t) return loadLoiNguyen()
  const list = loadLoiNguyen()
  list.unshift({ t: Date.now(), text: t.slice(0, 500) })
  const trimmed = list.slice(0, 50)
  const ls = _ls()
  if (ls) { try { ls.setItem(LOINGUYEN_KEY, JSON.stringify(trimmed)) } catch (e) { /* hết dung lượng — bỏ qua */ } }
  return trimmed
}

export function countThapHuong() {
  const ls = _ls(); if (!ls) return 0
  try { return +ls.getItem(THAPHUONG_KEY) || 0 } catch (e) { return 0 }
}

export function thapHuong() {
  const n = countThapHuong() + 1
  const ls = _ls()
  if (ls) { try { ls.setItem(THAPHUONG_KEY, String(n)) } catch (e) { /* hết dung lượng — bỏ qua */ } }
  return n
}
