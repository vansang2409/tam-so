# DC-A14 — bước đi nam V63

V62 thay 14 key xoay mũi giày trái trong Walk bằng nội suy qua một mốc gập giữa đoạn. Bước xoay lớn nhất giữa hai key giảm từ 41,74° xuống 6,30°. V63 thêm fit dịch chân tuần hoàn riêng hai bên từ mẫu đi thẳng và cung, giải IK và bake vào sáu track xoay đùi, cẳng chân và bàn chân. Review từng byte xác nhận mọi thay đổi BIN nằm trong bảy track Walk này. Thêm kiểm hồi quy góc giữa hai key mũi giày và điểm nối vòng trên GLB đã giải mã.

Đo controller ở 120 Hz, 960 khung sau warm-up, tính vận tốc ngang đỉnh giày nằm dưới 8 mm ở hai khung kề. Đơn vị kết quả P50/P90 là m/s. Hai cung ±0,95 rad/s giữ riêng ngoài tập fit.

| Tốc độ / tốc độ quay | V57 | V63 | Nữ |
|---|---|---|---|
| 1,12 m/s / thẳng | 0,138 / 0,757 | 0,129 / 0,589 | 0,113 / 0,638 |
| 1,35 m/s / thẳng | 0,162 / 0,818 | 0,147 / 0,668 | 0,124 / 0,663 |
| 1,50 m/s / thẳng | 0,173 / 0,866 | 0,160 / 0,843 | 0,139 / 0,724 |
| 1,35 m/s / +0,65 rad/s | 0,218 / 0,803 | 0,192 / 0,648 | 0,162 / 0,667 |
| 1,35 m/s / −0,65 rad/s | 0,193 / 0,910 | 0,179 / 0,734 | 0,171 / 0,644 |
| 1,35 m/s / +0,95 rad/s | 0,250 / 0,804 | 0,233 / 0,673 | 0,193 / 0,655 |
| 1,35 m/s / −0,95 rad/s | 0,222 / 0,967 | 0,210 / 0,758 | 0,200 / 0,673 |

WebGL so các khung có cùng seed, camera bám theo nhân vật, đi thẳng và hai cung ±0,95 rad/s ở hai chế độ, cận giày và toàn thân. Review ảnh không thấy biến dạng mũi giày hoặc lộ da mới ở các khung đã xem. Ảnh tĩnh chỉ xác nhận khung lấy mẫu, thống kê trượt chưa bao quát dừng, khởi bước hoặc rẽ đột ngột. Ảnh ở `.setest/young-visitors/qa/walk-v63/`, dữ liệu ở `.setest/male-walk-parity/`.

Hai seed pha khởi tạo khác tại 1,35 m/s, mỗi seed đo đi thẳng và cung +0,65/−0,95, cũng giảm cả P50 lẫn P90 ở cả sáu phép đối chiếu. `npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. Edge SwiftShader tải đúng SHA V63 ở `/di-chua` local và chuyển nam → nữ → nam với reduced motion. Chưa kiểm thiết bị thật hoặc presence live.

GLB tích hợp 1.838.324 byte, SHA256 `45dbc2e216e71d8ac5337779059fb1e114b1a620194b2225cc987c86641ff3af`. DC-A14 vẫn Doing. P50 nam còn cao hơn nữ trên bảy tuyến, và đánh giá cận áo lam vẫn còn chênh ở vai/tay. Chưa nghiệm thu ngang mẫu nữ và chưa đến bước commit, push, tắt máy.
