# DC-A14 — mặt áo nam phẳng hơn với V30

V30 bỏ 76 tam giác của riêng dải nẹp nổi trên thân áo, giữ tám khuy và hình học thân áo/cổ. V31 thử hạ mép cổ tối đa 10 mm theo tiết diện da. V32 thử thu theo khoảng hở da trong bind pose. Hai bản cổ thử vẫn có gờ hình chữ U dưới cổ khi nhìn gần và chưa được chọn. Kiểm các cụm đỉnh trùng vị trí quanh đường cổ trong GLB nguồn không tìm thấy lệch trọng số skin trên ngưỡng 0,0001 ở vùng mẫu. Kết quả này chỉ loại khả năng tách đường nối do sai weights của các cặp đỉnh đã kiểm.

Đối chiếu WebGL V23/V30 trong 13 cặp khung đứng, Idle, đi, thiền và các pha lạy. Review độc lập xác nhận vệt nẹp gãy biến mất, khuy nhìn bám áo ở chính diện và góc nghiêng. Dáng cổ và chỗ nối vai/tay áo nam vẫn cứng hơn mẫu nữ. Ảnh ở `.setest/young-visitors/qa/neck-v30/`, `neck-v31/` và `neck-v32/`. GLB tích hợp V30 là 1.830.488 byte, SHA256 `05546421af88af2042dc4c6d4797cc49b0b9833da0bf0ba49839a372edca997b`.

`npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. Edge SwiftShader ở `/di-chua` với reduced motion xác nhận đúng SHA V30, chuyển nam → nữ → nam và fallback khi server thử trả GLB sai profile. Ảnh courtyard trong `.setest/young-visitors/qa/male-v30-runtime-courtyard.png`. Browser chỉ truy cập localhost. Chưa xác minh thiết bị thật hoặc presence live trong lượt này.

DC-A14 vẫn Doing. Ưu tiên dựng lại kết cấu chân cổ từ đường may lên mép thay vì tiếp tục chỉ dịch mép trên. Commit, push và tắt máy theo điều kiện hoàn thành của chủ dự án.
