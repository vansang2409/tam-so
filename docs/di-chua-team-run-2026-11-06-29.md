# DC-A14 — giữ lai sau áo nam liền khi thiền

V37 thu tay áo trên theo khoảng hở đến da trên lưới đã skin. V38 thêm dịch mặt ngực tối đa 8 mm về phía trước ở vùng lõm. Tay áo gọn nhẹ ở một số góc, dải sáng ngực vẫn rõ. Hai bản thử giữ riêng. Review ở góc sau phát hiện các mảng vải rời trên lai. Trong 15 tia có quần trước và áo sau, độ lệch theo tia lớn nhất khoảng 5,2 mm ở khung thiền đã lấy mẫu.

V39 thêm morph `templeSeatedShirt` gồm POSITION/NORMAL, lùi vùng lai sau tối đa 10 mm ở dáng thiền rồi chuyển delta về bind qua nghịch đảo ma trận skin. Bản GLB tích hợp 1.834.176 byte, SHA256 `ceddce575613600527aee781e1b41b4772c53aad346d52d2bde7e42ecb2cdb8f`. Kiểm hồi quy controller bật cả hai morph áo/quần khi thiền và trả về 0 khi đứng, đi và lạy.

WebGL desktop đối chiếu bốn góc thiền, đứng, đi và ba pha lạy. Cả 15 vị trí trước đó giao quần với áo nay chạm áo trước, không có tia nào mới chạm da trước trong lưới 56 tia từ góc sau. Review độc lập xác nhận các mảng rời biến thành lai liền, còn gờ mép dày và nhúm nhẹ giữa lai. Ảnh và các cặp kết quả có tên `before`/`after` tại `.setest/young-visitors/qa/shirt-v39/waist-ray-pairs.json` và cùng thư mục.

Harness ảnh cục bộ đã sắp cặp theo canvas ID sau khi phát hiện thứ tự tải bất đồng bộ có thể đảo nhãn. Đã chụp lại V37/V38 và chạy lại phép đo cổ V30/V36 với cặp xác định, xác nhận kết quả 28 tia chạm áo trước và 10 điểm đổi từ da sang áo ở V36.

`npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. `/di-chua` local qua Edge SwiftShader xác nhận tải đúng SHA V39 và chuyển nam → nữ → nam, với reduced motion và chỉ truy cập localhost. Ảnh courtyard tại `.setest/young-visitors/qa/male-v39-runtime-courtyard.png`. Chưa kiểm thiết bị thật hoặc presence live.

DC-A14 vẫn Doing. Dáng tay áo và dải ngang ngực còn cứng hơn mẫu nữ, nhất là khi thiền. Chưa nghiệm thu chất lượng ngang mẫu nữ và chưa đến bước commit, push, tắt máy.
