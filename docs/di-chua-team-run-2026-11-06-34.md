# DC-A14 — đối chiếu nam/nữ và làm dịu lai V57

WebGL desktop dùng cùng camera và ánh sáng cho nam V56 và nữ hiện hành, mười cặp khung mỗi chế độ gồm đứng cận, đi toàn thân, thiền nhiều góc và ba pha lạy. Review độc lập thấy gương mặt, tóc và dáng lạy tương đương ở các khung đã xem. Khác biệt rõ nhất là lai sau khi thiền, tiếp theo là tay áo và vài mép gãy ở chân cổ khi nhìn cận. Ảnh đối chiếu trong `.setest/young-visitors/qa/parity-v56/`.

V57 lọc tiết diện quanh hông để tính pháp tuyến mới cho vùng lai trong morph `templeSeatedShirt`. POSITION cơ sở và POSITION morph khớp V56 theo byte. V58 thêm dịch hình học tối đa 2,4 mm nhưng không cho lợi ích rõ. Review xác nhận V57 giảm phần lớn dải sáng ngang lai và gần mẫu nữ ở khoảng nhìn thông thường, còn hai điểm sáng nhỏ khi cận. Cả hai chế độ cho 124 điểm chạm áo trước, 32 chạm quần trước và 13 nền ở cùng vị trí cho V56 và V57. GLB tích hợp 1.838.332 byte, SHA256 `0dac461913829adc0311ff0a5cac9303e368d8ee8c734c83709ccecf32009281`. Ảnh và tia ở `.setest/young-visitors/qa/hem-v57/` và `hem-v57-low/`.

`npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. Edge SwiftShader trên `/di-chua` local tải đúng SHA V57 và chuyển nam → nữ → nam, với reduced motion. Chưa kiểm thiết bị thật hoặc presence live.

Đo Walk bằng controller thật ở 120 Hz, 960 khung sau warm-up, chỉ lấy đỉnh giày gần sàn dưới 8 mm ở hai mẫu liền. Ở 1,35 m/s thẳng, nam hiện tại P50/P90 0,162/0,818 m/s và nữ 0,124/0,663. V59 sửa 14 key mũi giày trái, giảm bước xoay lớn nhất từ 41,74° xuống 6,30° nhưng P90 thẳng tăng. V60 kết hợp fit hai chân và bake sáu track, giảm trung vị ở cả ba tốc độ thẳng đã đo. Khi đi cung 0,65 rad/s ở 1,35 m/s, nam V56 0,218/0,803 và V60 0,193/0,825 m/s. P90 tăng ở cung nên giữ ứng viên riêng. Dữ liệu ở `.setest/male-walk-parity/`. Đây là thống kê trượt ở điều kiện mẫu, chưa kiểm rẽ gấp, khởi bước/dừng hoặc thiết bị thật.

DC-A14 vẫn Doing. Tổng thể ở khung toàn thân gần mẫu nữ, còn chênh khi cận và kết quả Walk chưa ngang. Chưa nghiệm thu ngang mẫu nữ và chưa đến bước commit, push, tắt máy.
