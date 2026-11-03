# Kiểm tra chi tiết Đi Chùa — 03/11/2026

Theo yêu cầu kiểm kỹ từng chi tiết. Phân biệt source/CPU, ảnh chạy thật và mạng live; bảng dưới là checklist đang thực hiện, không phải tuyên bố mọi chi tiết đều đúng.

Nhóm kiểm: cấu tạo mái/cột/bậc và cửa, vật liệu/ánh sáng, tượng/bàn thờ/bình/pháp khí có bề mặt đỡ, lối đi/camera, cây/nước, nhân vật và hành vi tương tác.

| Khu | Source/CPU | Visual | Ghi chú |
|---|---|---|---|
| Chánh Điện | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Điện Ngọc Hoàng | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Sân Hồ Rùa | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Miếu Hộ Pháp | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Tiền Điện Thổ Địa | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Trung Điện Dược Sư | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Điện Thành Hoàng | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Điện Thập Điện | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Điện Kim Hoa | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Thiên Y Thánh Mẫu | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Điện Ông Tơ | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Điện Phật Bà | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Lầu Quán Âm | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Nhà Tổ | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Tháp Chuông | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Vườn Lâm Tỳ Ni | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Giảng Đường | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Nhà Khách | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Cổng Tam Quan | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Thư Viện | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Góc Thiền | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Tượng Cầu Nguyện | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |
| Cửa Hàng Pháp Bảo | 23 khu / 529 tuyến; 18 nội thất hữu hạn | Đã xem ảnh chạy thật | |

## Finding đã tái hiện

- Bình hoa ngoài mép bàn thờ/đặt cao hơn mặt đỡ, có nhánh bị thêm trùng; đã chỉnh theo mặt bàn thực; đã kiểm mặt đỡ toàn bộ chén/đĩa lễ bằng geometry thật.
- Bàn đọc Thư Viện từng thiếu vùng cản; đã thêm footprint và kiểm point trong bàn/aisle cùng529 tuyến.
- Camera sát vách có thể trùng target hoặc chui sát đầu nhân vật; sửa đã có kiểm góc biên và chuyển góc, giữ cả repro quỹ đạo cũ; chờ kiểm trực tiếp sát vách sau build cuối.
- Chọn khu ngoài trời nhưng pick dùng mặt phẳng cao độ nội điện; đã sửa theo groundHeight của khu.
- Nghi thức hương kết thúc trong lúc hộp thoại dừng renderer không phát lại tư thế standing; đã đưa trạng thái ritual vào effect và dùng chung quy tắc tư thế.

## Bằng chứng và giới hạn

Ảnh riêng: .setest/di-chua-team/2026-11-03-detail-audit/. Đã lưu ảnh đủ 23 khu, cả góc người đi và góc thứ ba theo từng trường hợp; ảnh có ở nhiều build trong cùng lượt, không coi tất cả là ảnh sau sửa cuối. Các khu có sửa tiếp cần retest có chọn lọc sau build chốt. Không dùng khách thật làm fixture hoặc sửa dữ liệu hosted.

## Bổ sung đã phát hiện từ ảnh và source

- Khói nhang trước đây nằm dưới fallback bị ẩn khi tải shell; chuyển sang pool độc lập, anchor giữ đúng transform lư trong/ngoài. Dược Sư chưa xác minh được anchor trong GLB nên không dựng emitter giả bên trong.
- Lư Chánh Điện còn bị cushion của model quét che. Kiểm GLB thật xác nhận; dịch cả bàn lễ/bình hoa/đồ lễ +.35m, giữ footprint trong obstacle. 9 ray kiểm vị trí cũ tái hiện che khuất, vị trí mới không còn bị che.
- Chuông: chày cũ thấp hơn miệng và thân chuông tự lắc. Đã thêm quai treo nối xà, chày treo đúng cao độ/hướng, chày chạm rồi hồi về; thân cố định. Test geometry và bounded motion đạt, chờ ảnh build cuối.
- Lá ở bình Thánh Mẫu thiếu cành; đã thêm thân/nhánh nối lá. Đèn lồng Pháp Bảo thiếu dây; thêm dây nối tới cao độ xà, không để treo giữa không trung.
- Hoa bình cũ là đĩa/cầu bẹt; dùng cánh khum nhiều lớp, thân tới đúng tâm nhụy và lá nối thân. Test tiếp xúc geometry có negative control. Sen hồ tái sử dụng cùng hình học cánh với tỷ lệ và bố trí lệch tự nhiên, chờ ảnh cuối.
- Hồ: mở thể tích nước, hạ cá dưới mặt nước, lá sen ở trên mặt, rùa ngập một phần, ripple không còn bị static merge loại khỏi animation; reduced motion giữ ripple tĩnh.
- Thêm 4 ghế/chậu cảnh có chân/mặt đỡ và collider thống nhất; tán lá dùng cụm lá nhỏ instanced, không thêm cây vào đường đi.

## Nguồn tham khảo nghiên cứu

Không tải hoặc sao chép ảnh từ các trang này. Cảnh là chùa hư cấu, cảnh quan không được coi là hạng mục bắt buộc cho mọi chùa.

- Cục Di sản: https://dsvh.gov.vn/chua-van-quan-thanh-pho-ha-noi-22264 — tham khảo tam quan, bái đường/thượng điện, nhà Tổ/nhà tăng, vườn tháp.
- Sở VH-TT Hà Nội: https://sovhtt.hanoi.gov.vn/tham-dinh-du-an-tu-bo-ton-tao-di-tich-chua-luu-xa-hoai-duc-ha-noi/ — các hạng mục và sân/cảnh quan.
- Chùa Ba Vàng, bài lịch sử cảnh quan: https://chuabavang.com/vuon-sac-xuan-chua-ba-vang-don-chao-nam-moi-d302.html
- Bài trải nghiệm Hoằng Pháp: https://phatgiao.org.vn/ve-chon-binh-yen-d41558.html — ghế đá dưới cây, tham khảo cảnh quan.
- Cơ học chuông Đông Á: https://byodo-in.com/explore/ và https://www.metmuseum.org/art/collection/search/502244 — chày gỗ ngoài thân, quai treo. Không khẳng định mẫu Việt Nam cụ thể.
- Cấu tạo đồ lam tham khảo nhà may: https://aodailianna.com/phap-phuc-ba-ba/ ; https://xuongmaykt.com/phap-phuc-nu . Không dùng model/ảnh của nhà may.


Review cuối còn sửa chân bàn Chánh Điện trên bệ,4 bình Dược Sư không giao nhau, và dùng chung tâm render/collider/hitbox hồ. Garden giữ offset-1m; một giả định đồng tâm sai đã bị reviewer bắt trước release. Mobile viewport đã kiểm qua Chrome390×844/844×390 sau khi IAB không áp dụng; không phải thiết bị thật. Phiên thiền5 phút trong modal đã tự kết thúc và đồng bộ sang peer. Xem phần4.10.0 trong `chua-3d-validation.md` cho số liệu/giới hạn cuối.


Review tiếp xúc cuối: bình trên bàn và vòng tay Pháp Bảo bám mặt đỡ thực;14 lư ngoài sân có bệ đá, lư điện ra khỏi bậc/shell. Chánh Điện lệch trái1.15m giữ trục giữa thông. Geometry/collider/529 tuyến/full test/build đã kiểm lại; ảnh exterior trên đúng build cuối ở `final-build/main-censer-plinth-exterior.png` và `final-build/tuong-cau-nguyen.png`. Không coi toàn bộ ảnh23 khu trước đó là chụp lại cùng build cuối.
