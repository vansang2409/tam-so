# Đi Chùa — DC-A14, nghiên cứu khuôn mặt và viền tóc

Phiên tiếp tục từ nhánh `codex/di-chua-character-realism-20261104` tại `e95705f`. Cây làm việc sạch khi bắt đầu. DC-A14 vẫn Doing. Bản đối chiếu là nữ V10 đang chạy trong Đi Chùa. Tiêu chí của vòng này là một thay đổi nhìn thấy được ở ảnh cận chính diện và góc nghiêng, giữ tỷ lệ và tư thế của V10, có nguồn hợp lệ và đo được chi phí asset trước khi chọn ứng viên cho browser.

## Khuôn mặt và hướng nhìn

- Đo 12 mốc trên lưới thật Rocketbox và V10 từ hai ảnh trực giao cùng điều kiện. RMS giữ lại từng mốc để kiểm lần lượt là 5,08 mm với đồng dạng và 4,48 mm với affine. Affine vẫn sai khoảng 7,8 mm ở chóp mũi, 7,65 mm ở cằm và 5,73 mm ở môi trên. Vì các mốc đánh thủ công, dùng phép đo để loại đường chiếu theo điểm bề mặt gần nhất cho toàn mặt. Chưa bake bản đồ lên V10. Bằng chứng và mã tái lập trong `.setest/character-head-study/`.
- V10 có hai cụm mắt không chung tam giác, đều bind cứng vào cùng khớp đầu. Fit mỗi cụm cho bán kính khoảng 13,61 mm, sai số p95 khoảng 1,88 mm. Đã dựng hai GLB thử với cả hai mắt xoay ±4° quanh tâm riêng. Dịch chuyển đỉnh lớn nhất 1,034 mm. Reviewer đối chiếu nhị phân xác nhận chỉ POSITION/NORMAL mắt và bounds thay đổi. Bản nguồn giữ hash cũ.
- Render Blender từ GLB thử cùng camera và đèn cho thấy đồng tử dịch nhẹ khi mở mắt. Các khung nhắm hoàn toàn chính diện chưa thấy lộ đồng tử. Chưa kiểm mí khép một phần, góc nghiêng hay thời điểm chuyển hướng trong trình duyệt. Mẫu tĩnh trong `.setest/character-eye-study/` dùng để kiểm tính khả thi, chưa đưa chuyển động mắt vào runtime.

## Viền tóc

Review ảnh V10 cho thấy đường viền trán liền và sắc, ngôi giữa và hai mảng bob quá đối xứng. Ưu tiên sửa hình dáng đường chân tóc ở trán và thái dương bằng lọn thuôn ôm sát khối có sẵn. Phạm vi thử riêng trong `.setest/character-hairline-study/`. Cần kiểm ảnh chính diện, góc nghiêng và đầu quay trước khi quyết định tích hợp.

## Kiểm WebGL và quyết định thử nghiệm

- Đã đóng gói hai hướng mắt thành morph POSITION/NORMAL với mặc định 0, qua đúng pipeline WebP/meshopt và mở trong studio riêng dùng controller Đi Chùa. GLB thử 2.403.596 byte, tăng 9.460 byte so với V10. Trình duyệt xác nhận cả hai hướng ±1 và nội suy, 24 calls và 114.390 render triangles cho một actor có bóng trong studio. Đây là số đếm render, chưa đo chi phí GPU riêng của morph.
- Đã xem ảnh cận chính diện và toàn thân khi thiền/cúi lạy trong studio. Chưa nghiệm thu hướng mắt lúc chớp một phần hoặc góc nghiêng trong browser. Camera cận đứng nằm cao hơn nhân vật khi thiền, nên đã chụp lại toàn thân. Bằng chứng `.setest/character-eye-study/web-*.png` và `web-samples.json`. Hướng mắt hiện do nút thử và hàm nội suy studio điều khiển. Hiệu quả nhỏ ở góc chơi, nên giữ ứng viên ngoài runtime.
- Normal Rocketbox 2K thật trong GLB khớp RGB nguồn. Trong các vùng mẫu 48², độ lệch góc RMS giữa gốc và làm mờ 1 px là 4,27° ở trán và 2,33–2,81° ở má. Có tín hiệu chi tiết nhỏ, nhưng chưa xác định đó là lỗ chân lông hay còn thấy qua mipmap. Nếu làm tiếp, chỉ thử dải chi tiết nhỏ trên vùng trán/má có mask, kiểm không nhiễm chi tiết nhận dạng quanh mắt, mũi và miệng. Số đo ở `.setest/character-head-study/normal-probe.json`.

Đã xem hai vòng từ GLB nhập lại. Vòng 1 tạo các chóp sẫm nhọn ở mép trán. Vòng 2 dùng hai lọn so le, giảm phần nhô và mờ alpha ở mép. Lưới tóc từ 1.507 lên 1.597 đỉnh và 2.852 lên 2.980 tam giác, giữ một mesh và vật liệu. Ảnh chính diện và góc nghiêng cho thấy chóp bớt rõ nhưng khối bob và nếp ngôi giữa vẫn trông cứng. Loại cả hai ứng viên. Vòng sau cần sửa hình dáng và hướng lọn trên vùng rộng hơn, có thể thử một kiểu tóc khác có giấy phép nếu vẫn giữ được độ ôm đầu khi chuyển động.

Thay đổi theo dõi gồm backlog và checkpoint. Hash GLB public vẫn `c740f83afb1396dbdfbf622749b92141baeda17508648e88d47793aa73ae37d2`. Build riêng GLB thử đã chạy thành công. Không chạy lại test/build toàn ứng dụng vì lượt này chỉ thêm tài liệu và thử nghiệm ngoài runtime. DC-A14 tiếp tục Doing.
