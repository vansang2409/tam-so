# DC-A14 — thử độ rủ vạt áo ở tư thế cúi sâu

DC-A14 vẫn Doing. Lát cắt này thử giảm hai vùng quần lộ ở hông mà không tạo hình chuông hoặc mép gấp cứng.

- Dùng lưới áo đã skin theo controller thật trong studio WebGL riêng. Tạo đối chứng bake không dịch, bản nâng 35 mm và xòe 45 mm, bản đưa vạt ra trước 45 mm kèm nâng 10 mm và xòe 25 mm. Hệ số khu trú theo vị trí bind và pha cúi. Đây là ba bản kiểm hình học tại một pha, chưa phải morph runtime.
- Trong ảnh màu nhãn chính diện 1000x720, ROI x420–579, y515–569, số pixel thuộc ngưỡng màu quần là 365 ở runtime và đối chứng bake, 275 với nâng/xòe và 226 với đưa ra trước. Đây là số pixel của một góc, không đo độ sâu hoặc bảo đảm che phủ ở góc khác.
- Bản nâng/xòe tạo viền phồng như chuông và lộ khe ở góc bên. Review độc lập xác nhận không nên chọn. Bản đưa ra trước che thêm nhưng vẫn còn mép gấp cứng. Đối chứng bake cũng đổi shading do tính lại pháp tuyến theo topology, nên dùng ảnh màu nhãn để đánh giá độ che phủ và chưa quy mọi cạnh đậm cho biến dạng.
- Ảnh bốn góc, mã và bản đối chứng trong .setest/character-bow-cloth/. Giữ các prototype ngoài runtime. Chưa chạy kiểm tra chuyển tiếp hay full test/build trong lượt này.
