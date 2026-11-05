# DC-A14 — kiểm và sửa vệt da ở biên tóc

DC-A14 vẫn Doing. Tiêu chí lát cắt là che lại vùng da từng lộ ở góc đối diện, giữ lệch ngôi và tránh thêm khối phồng.

- Chiếu tia Blender theo camera ảnh cận. Ở mẫu mềm trước, pixel (206,495) và (206,499) trúng mesh da vùng tai. Nguồn trước đó không có hai hit này. Tia kiểm mesh, chưa mô phỏng alpha.
- Đẩy tóc ra ngoài cục bộ chỉ che một điểm, làm phồng viền dưới và mở khe tối cạnh má theo review độc lập. Bỏ hướng đó. Giới hạn vuốt ở phần thái dương cao và bỏ đẩy phần tóc bên đối diện ra trước. Bản upper không còn hit da trong lưới 25 tia lấy mẫu. Ảnh Blender đối diện không còn thấy vệt ở điểm cũ. Góc 3/4 vẫn còn gợn khối nhẹ, tóc vẫn liền mảng.
- Build GLB web riêng thành công. Kiểm hình học cổ áo qua 96 Idle và 96 Walk trong seed 47. Chưa kiểm trực quan WebGL, toàn thân hoặc thiền/lạy của bản upper. Giữ bản thử trong .setest/character-temple-sweep/, chưa đổi runtime.

Review độc lập lần hai xác nhận vệt cũ biến mất trong góc đối diện, không thấy khối phồng từng xuất hiện ở bản đẩy ra ngoài. Bản upper 2.398.924 byte, 0/96 Idle và 0/96 Walk giao cổ áo trong mẫu đã đo.
