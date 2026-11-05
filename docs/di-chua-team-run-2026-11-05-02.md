# Đi Chùa — DC-A14, giảm trượt và giật cổ chân khi đi

Tiếp tục từ e95705f và giữ tài liệu chưa commit của lượt trước. DC-A14 vẫn Doing. Tiêu chí lát cắt là giảm trượt trên đế giày trong cả đi thẳng và đi theo cung, giữ rig, chuyển động thân trên, nghi thức, giấy phép và ngân sách tải. Các phép thử mặt/tóc chạy tách khỏi ứng viên chuyển động.

## Walk đã tích hợp cục bộ

- Giải mã GLB V10 và chạy controller thực. Đo dịch chuyển ngang của các đỉnh đế dưới 8 mm qua hai mẫu liền nhau, lấy 960 khung sau warmup ở 120 Hz. Ứng viên dịch toàn thân 18 mm làm xấu trung vị nên đã loại. Phương án chọn là hiệu chỉnh tuần hoàn riêng từng chân tối đa 32 mm, giải IK ngoại tuyến và bake đúng 137 key vào sáu track xoay đùi, cẳng chân, bàn chân của Walk. Không thêm bước xử lý mỗi khung.
- Phát hiện riêng ở clip gốc: cổ chân trái đổi tới 37,89° giữa hai key liên tiếp. Nội suy quaternion giữa key 45 và 59 để thay các key nhiễu bên trong. Sau bake, bước xoay lớn nhất của track còn 3,99°. Đây là số đo trên các key, không phải đánh giá toàn bộ chuyển động.
- Ở 1,35 m/s, vận tốc trượt trung vị đỉnh gần sàn khi đi thẳng giảm 0,178 → 0,122 m/s, P90 0,711 → 0,658 m/s. Cung đổi yaw 0,65 rad/s giảm trung vị 0,210 → 0,164 m/s và P90 0,722 → 0,655 m/s. Số đỉnh được chọn và pha khởi tạo khác nhau giữa hai lượt. Đây là thống kê mẫu gần sàn, không chứng minh đế đứng yên trong mọi nhịp. Bản offset trước làm mượt cũng đã kiểm hướng xuất phát xoay 60° và hai tốc độ khác. Cần kiểm thêm rẽ gấp, bước đầu/dừng và thiết bị thật.
- GLB public 2.394.132 byte, SHA256 `425ee968f1d8f813e2b56dc0b6fece14f905e73b012007e0cb4600f3b47d0d0b`. Nguồn SHA256 `6068d3cbe31f997d9c02e91ca59b546825d15c28545b50085d6c5b52f833c709`. Cùng điều kiện CMU35_01. Model, texture, clip Idle và đường dẫn asset giữ nguyên.
- WebGL studio tải chính GLB public, kiểm đi bộ và cúi lạy cùng camera và lưới nền. Mỗi view 25 draw calls gồm một call lưới và 114.390 render triangles. Hai actor khởi tạo pha khác nhau, ảnh chụp kiểm tải và tư thế chứ không đo độ trượt. Dữ liệu và ảnh nằm trong `.setest/character-walk-contact/`. Suite human và 24/24 tia kiểm nách đạt. `npm test` 493 pass / 0 fail, build 211 route và hash dist khớp.

## Mặt và tóc

- Chuyển dải chi tiết normal Rocketbox lên vùng trán/má có mask và tangent kiểm hữu hạn. A/B Blender cùng đèn/camera cho chênh lớn nhất 1/255 mỗi kênh trên hai ảnh. Lợi ích thị giác quá nhỏ. Giữ thử nghiệm và MIT notice riêng trong `.setest/character-skin-study/`.
- Tóc bob thử ngôi lệch và độ phồng hai bên khác nhau, chỉ đổi POSITION/NORMAL, dịch tối đa 16,33 mm. Bản đầu xuyên tai, bản hai đã giảm lỗi đó ở các góc đã xem. Reviewer thấy ngôi vẫn tạo rãnh cứng và có vệt da nhỏ sát mép tóc ở góc nghiêng. Giữ ứng viên riêng tại `.setest/character-hair-volume-study/`. Hướng tiếp là cải thiện cấu trúc lọn ở vùng rộng và đánh giá chuyển động quay đầu.

Reviewer độc lập đối chiếu nguồn cuối với HEAD. JSON và độ dài BIN giống nhau, toàn bộ byte khác nằm trong sáu accessor rotation của Walk. Hash nguồn/GLB khớp report và provenance. Không thấy lỗi chặn trong phạm vi đã kiểm. Chưa commit hoặc deploy.
