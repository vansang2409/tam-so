# DC-A14 — chẩn đoán vạt áo khi cúi lạy

DC-A14 vẫn Doing. Mục tiêu là giảm vùng vạt áo gấp hoặc chồng lên đùi khi cúi, giữ chuyển động và độ che phủ của áo lam.

- Lấy bảy mẫu tiến trình bằng controller thực và GLB hiện hành. Ba mẫu đầu cùng tư thế. Đếm cặp tam giác giao nhau bằng tia cạnh, loại điểm đầu/cuối và bỏ cặp chung đỉnh trùng khi kiểm áo tự giao.
- Baseline áo–quần tăng từ 172 cặp ở chắp tay lên 697 ở cúi sâu. Áo tự giao từ 1.017 xuống 394. Đây là chỉ báo so sánh cùng topology và pose, không đo độ sâu, số lỗi độc lập hay khả năng nhìn thấy. Review độc lập xác nhận giới hạn này. Chồng đồng phẳng có thể bị bỏ sót.
- Thử nâng vạt tối đa 35 mm trong bộ đo, giảm còn 669 cặp áo–quần nhưng áo tự giao tăng lên 414 ở cúi sâu. Thêm xòe tối đa 25 mm mỗi bên cho 654 và 419. Chưa đủ căn cứ tích hợp. Mẫu thử chỉ đổi điểm lưới của phép đo, chưa xuất morph hay dựng ảnh mới.
- Mã, bảng và điểm đánh dấu trong .setest/character-bow-cloth/. Hướng tiếp theo là xác định mặt ngoài bị lộ theo camera, rồi author morph khu trú trên vạt và tay áo ở pha tương ứng. Chưa sửa runtime, chưa chạy lại full test/build.
