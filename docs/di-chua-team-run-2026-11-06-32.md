# DC-A14 — làm dịu nếp gập khuỷu nam V50

V47 và V48 thư giãn lưới đã skin ở cả hai khuỷu, nhưng để lộ da mặt ngoài. Mỗi bản có bốn tia đổi từ áo sang da trong 168 điểm lấy mẫu. V49 bỏ thành phần dịch vào trục cánh tay và tập trung phía trong, giữ che phủ nhưng tạo vùng lõm tối ở tay gần. V50 thu hẹp ảnh hưởng quanh khớp và giới hạn độ dịch 7 mm. Delta POSITION/NORMAL được đưa về bind và cộng vào morph `templeSeatedShirt`. POSITION và NORMAL cơ sở khớp V46 theo byte.

V50 kiểm WebGL góc trước, nghiêng hai phía và sau khi thiền, cùng các khung đứng, đi và lạy. Trong 168 cặp tia mỗi chế độ, 161 giữ áo ở mặt trước và 7 giữ nền, không có tia mới chạm da trước. Tại (451, 361) ở góc nghiêng, số giao điểm áo trước giao điểm da đầu tiên giảm từ ba xuống một. Tại (439, 361), vẫn có hai giao điểm áo. Phép đo chỉ xác nhận các tia và khung đã lấy mẫu. Review độc lập thấy nếp gập khuỷu xa dịu nhẹ, không thấy vết lõm tối của V49 trong các góc đã xem. Ảnh và dữ liệu ở `.setest/young-visitors/qa/elbow-v47/`, `elbow-v49/` và `elbow-v50/`.

`npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. Edge SwiftShader ở `/di-chua` local tải đúng SHA V50 và chuyển nam → nữ → nam với reduced motion. Chưa kiểm thiết bị thật hoặc presence live.

GLB tích hợp 1.837.812 byte, SHA256 `ac4b4a1aa6f2272a32e4cd3b173598845af45ac0407a0cc091363a945f7bff14`. DC-A14 vẫn Doing. Lai sau nam khi thiền còn mép dày và nhúm giữa lai, tay áo vẫn cứng hơn mẫu nữ ở các góc cận. Trên lưới thân áo nguồn, mép lai tạo thành một vòng hàn 36 đỉnh, có thể truy các vòng kế tiếp để xác định gờ. Chưa nghiệm thu chất lượng ngang mẫu nữ và chưa đến bước commit, push, tắt máy.
