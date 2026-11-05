# DC-A14 — làm dịu dải ngang ngực áo nam V42

So V39 ở WebGL có bóng và chế độ nhẹ. Dải sáng tối còn khi tắt bóng. Mặt cắt áo đã skin ở x=75 mm có pháp tuyến tam giác theo Y từ 0,086 lên 0,499 giữa y=520 mm và y=540 mm tại khung thiền. V40 và V41 dùng chênh lệch pháp tuyến từ lưới đã chỉnh, tạo thêm đường tối mảnh nên bị loại. V42 lọc tiết diện theo Y, tính độ dốc cục bộ thành pháp tuyến và pha vào morph thiền theo vùng. POSITION của morph áo giống V39 theo byte. V43 thử thêm dịch hình học, review không thấy cải thiện rõ so với V42.

Đối chiếu WebGL V39/V42 ở chính diện và góc nghiêng với hai chế độ bóng, thêm góc sau khi thiền, cận khi đứng và lạy. Review độc lập xác nhận chuyển vùng sáng tối dịu hơn, hàng khuy rõ. Cả 81 cặp tia ở vùng ngực chính diện chạm áo trước ở cả hai bản. Ảnh và dữ liệu ở `.setest/young-visitors/qa/chest-v40/` và `chest-v42/`. Harness ghi và xác nhận URL theo ID từng canvas để cặp ảnh không phụ thuộc thứ tự tải.

`npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. Edge SwiftShader trên `/di-chua` local tải đúng SHA V42, chuyển nam → nữ → nam, với reduced motion và chỉ truy cập localhost. Ảnh tại `.setest/young-visitors/qa/male-v42-runtime-courtyard.png`. Chưa kiểm thiết bị thật hoặc presence live trong lượt này.

GLB tích hợp 1.835.392 byte, SHA256 `9d7a30ddb0fb7fc1f6c60bfafb6537039202fbff20fd6e1515bad0a9b7d0ff9e`. DC-A14 vẫn Doing. Khối tay áo và đường nối vai nam còn tròn cứng hơn mẫu nữ. Chưa nghiệm thu chất lượng ngang mẫu nữ và chưa đến bước commit, push, tắt máy.
