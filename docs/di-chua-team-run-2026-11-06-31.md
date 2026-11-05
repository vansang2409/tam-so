# DC-A14 — sửa phom tay áo nam V46

V44 thu phần trên tay áo quanh trục xương cánh tay và dùng khoảng cách tia đến da ở 41 khung đứng, Idle, Walk, thiền, lạy để giới hạn độ dịch. V45 thu mạnh hơn nhưng viền ngoài hơi gãy. V46 kế thừa mức V44, làm dịu pháp tuyến vùng ngực trên lưới bind, và bù thay đổi vào delta NORMAL khi thiền. 230 đỉnh vị trí thay đổi, tối đa 24,4 mm. Dữ liệu POSITION của morph thiền khớp V42 theo byte. GLB tích hợp 1.835.512 byte, SHA256 `9a1b75060a0ab7a53c8b4629ca6689bc3f3bb46a73b4539496292b04024e02cb`.

WebGL desktop kiểm 10 cặp khung V42/V46 ở mỗi chế độ tiêu chuẩn và nhẹ, gồm đứng, đi, thiền bốn góc và ba pha lạy. Trong 216 cặp tia mỗi chế độ, 177 vị trí giữ áo ở mặt trước, 15 vị trí sát viền chuyển từ áo sang nền, 24 vị trí giữ nền. Chưa thấy tia mới chạm da trước trong vùng mẫu. Review độc lập thấy tay áo bớt phồng và ngực khi đứng dịu hơn, khuy rõ, lai sau khi thiền vẫn liền. So mẫu nữ bằng cùng studio, vai và ngực gần hơn, còn khuỷu áo và lai sau nam rủ cứng hơn khi thiền. Bằng chứng ở `.setest/young-visitors/qa/sleeve-v44/` và `sleeve-v46/`.

`npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. Edge SwiftShader ở `/di-chua` local tải đúng SHA V46 và chuyển nam → nữ → nam, với reduced motion và chỉ truy cập localhost. Ảnh courtyard tại `.setest/young-visitors/qa/male-v46-runtime-courtyard.png`. Chưa kiểm thiết bị thật hoặc presence live.

DC-A14 vẫn Doing. Kiểm tiếp hình học ở khuỷu áo trong tư thế thiền, ưu tiên sửa điểm gập thấy được và kiểm lại mặt ngoài tay áo. Chưa nghiệm thu ngang mẫu nữ và chưa đến bước commit, push, tắt máy.
