# DC-A14 — dựng lại chân cổ nam V36

V33 tháo 104 tam giác của viền cổ riêng và thấy gờ vẫn còn ở thân áo. Truy theo đường may 26 đỉnh phát hiện các vòng lưới cổ áo gốc đổi hướng và gập chồng. V34 hạ riêng viền, V35 thay sáu vòng trong bằng dải nối tới vòng thân áo, nội suy weights từ hai đầu. V36 dựng lại pháp tuyến từ hình học mới và pha dần sang pháp tuyến thân áo. 208 nhóm đỉnh vị trí thay đổi, độ dịch tối đa 23,4 mm. GLB tích hợp 1.830.632 byte, SHA256 `6e91cbc3f32aed087cfbf13af811d51e06ebe8d0ca98679fcf093a9ae17f9e1f`.

Đối chiếu WebGL desktop ở 13 cặp khung V30/V36, gồm đứng cận và toàn thân, Idle, Walk, thiền và ba pha lạy. Review độc lập xác nhận gờ hình chữ U giảm rõ, nêu một vùng mép sát da cần kiểm ở giữa pha và lúc nâng người. Trong 28 tia mục tiêu ở chính diện, góc nghiêng, cúi nửa và nâng người, V36 chạm áo trước cả 28 tia. V30 chạm da trước 10 tia ở cùng vị trí. Tia chỉ xác nhận vùng và khung đã lấy mẫu. Ảnh và dữ liệu `rays.json` ở `.setest/young-visitors/qa/neck-v36/`.

`npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. Edge SwiftShader tải đúng SHA trên `/di-chua` local với reduced motion, chuyển nam → nữ → nam. Ảnh tại `.setest/young-visitors/qa/male-v36-runtime-courtyard.png`. Thiết bị thật và presence live chưa xác minh.

DC-A14 vẫn Doing. Độ rủ vai và ngực nam còn cứng hơn mẫu nữ khi thiền. Tiếp theo kiểm khối vai và dải ngang ngực qua lưới skin ở cùng camera, ưu tiên sửa hình học nếu gờ có trong tiết diện. Chưa nghiệm thu parity và chưa chốt commit/push/tắt máy.
