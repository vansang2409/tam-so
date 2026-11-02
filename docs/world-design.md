# Thiết kế thế giới

Một khuôn viên liền mạch: cổng ở nam, chánh điện ở bắc, gác chuông phía tây, hồ sen phía đông, góc thiền giữa cây xanh. Bố cục hư cấu, không sao chép di tích.

Ngôn ngữ: ngói đất nung, cột gỗ nâu, nền gạch ấm, cây xanh ngọc, ánh sáng sớm. Mái có độ võng, đầu đao cong, hàng ngói và diềm rõ; bàn thờ và tượng hình khối trang nghiêm. Giữ cảnh thoáng, bảng điều khiển nhỏ nằm ở mép màn hình.

Không nhân vật giả làm người online. Không gọi cử chỉ ảo là công đức thật. Tài nguyên được tạo bằng geometry trong mã, không cần tải model ngoài. Đánh đổi: hình ảnh stylized, chưa đạt độ chi tiết của model điêu khắc chuyên nghiệp.

Cập nhật phạm vi theo yêu cầu: đủ 23 khu từ DICHUA_LOCATIONS, mỗi khu có vị trí và đường nối trong cùng khuôn viên; không giới hạn 6 khu. Các điện/nhà có mái riêng, sân và cây xanh nối bằng lối đi.

## Đối chiếu 23 khu từ bản 2D

| Khu hiện có | ID giữ nguyên | Loại công trình 3D |
|---|---|---|
| Chánh Điện | chanh-dien | main |
| Điện Ngọc Hoàng | dien-ngoc-hoang | hall |
| Sân Hồ Rùa | san-ho-rua | pond |
| Miếu Hộ Pháp | mieu-ho-phap | shrine |
| Tiền Điện Thổ Địa | tien-dien-tho-dia | shrine |
| Trung Điện Dược Sư | trung-dien-duoc-su | hall |
| Điện Thành Hoàng | dien-thanh-hoang | hall |
| Điện Thập Điện | dien-thap-dien | hall |
| Điện Kim Hoa | dien-kim-hoa | hall |
| Thiên Y Thánh Mẫu | thien-y-thanh-mau | hall |
| Điện Ông Tơ | dien-ong-to | shrine |
| Điện Phật Bà | dien-phat-ba | hall |
| Lầu Quán Âm | lau-quan-am | tower |
| Nhà Tổ | nha-to | hall |
| Tháp Chuông | thap-chuong | bell |
| Vườn Lâm Tỳ Ni | vuon-lam-ty-ni | garden |
| Giảng Đường | giang-duong | house |
| Nhà Khách | nha-khach | house |
| Cổng Tam Quan | cong-tam-quan | gate |
| Thư Viện | thu-vien | house |
| Góc Thiền | goc-thien | meditate |
| Tượng Cầu Nguyện | tuong-cau-nguyen | statue |
| Cửa Hàng Pháp Bảo | cua-hang-phap-bao | house |

Mọi điểm đến được kiểm tra kết nối tới mọi điểm khác (23 × 23 tuyến); cây, hồ, tường điện, bàn thờ và lư hương có vùng cản tương ứng. Mái được mở khi nhân vật vào điện để nhìn thấy nội thất.
