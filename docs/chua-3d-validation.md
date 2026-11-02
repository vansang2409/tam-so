# Kiểm tra Chùa Tam Sở 3D v4.4.0

Ngày: 02/11/2026. Môi trường Windows, Node, trình duyệt tích hợp Codex.

- Kiểm tra: 493 regression pass; 529 tuyến giữa 23 khu không xuyên vật cản; build production + 211 meta route; bản một file khoảng 2,06 MB, NUL=0.
- Browser bản build: 1366×900, 390×844, 320×740 không overflow ngang; đi giữa các khu, xin xăm/keo trả kết quả, lịch sử xăm/keo có ở bản 2D; dâng hương/lời nguyện đã kiểm tra ở dev; thiền 1 phút hoàn thành thật. Chủ động làm mất WebGL → fallback → mở bản 2D → quay lại 3D thành công.
- Mô hình stylized tự dựng bằng geometry; không dùng model/tài nguyên của trang tham khảo. Chưa đo FPS trên điện thoại thật.
- Trạng thái Git/phát hành: xem phản hồi bàn giao và trạng thái deployment; build cục bộ không đồng nghĩa đã lên production.


Lệnh: `node tests/run.mjs`. Test đường đi có thể chạy riêng: `node tests/temple-world.mjs`. Build trong `.setest/chua3d-build` (ignored), không sửa nguồn build gốc. Ghi `tam-so-test.html` từ single-file build; bản này chứa JS/CSS, ảnh của các chức năng cũ vẫn cần thư mục tài nguyên như trước.

Nguồn mới: `src/data/templeWorld.js`, `src/components/templeWorldScene.js`, `src/components/TempleWorld.jsx`, `src/pages/DiChua.jsx`, `src/styles/temple-world.css`. Màn ảnh cũ giữ tại `src/pages/DiChuaClassic.jsx`.

## 02/11/2026 — v4.5.0: Chi tiết kiến trúc, chuột và chuyển cảnh nội điện

- Giữ 23 khu, bổ sung 18 hồ sơ kiến trúc/nội thất: Tam Bảo, Ngọc Hoàng, Quan Âm, Dược Sư, Nhà Tổ, Tháp Chuông, thư viện, giảng đường, nhà khách... Có tỷ lệ, màu mái/tường/cột, tượng và đồ dùng riêng. Vật liệu gỗ/gạch/ngói/đá có texture và bump tạo tại máy; bóng đổ, cây phân nhánh, khói sprite và gợn nước.
- Chuột trái đi tới điểm bấm; giữ-rê trái đổi đích, phải xoay/nhìn quanh; lăn chuột zoom. Đã thử trực tiếp trên canvas: click đổi vị trí 0.0,24.8 → 2.5,14.5; giữ-rê tới 4.7,17.9; xoay phải không làm nhân vật đi.
- Tới điện/nhà chuyển sang ngang tầm mắt trong phòng, có mái/tường và ánh sáng nội thất; chuột trái đi trong điện và phải nhìn quanh. Có Ra sân và toàn cảnh. Đi trong Chánh Điện thử 0.0,-0.3 → 0.8,-3.5, vẫn ở chế độ inside; chuyển sang Điện Ngọc Hoàng có nội thất khác. Ngoài trời có góc trải nghiệm riêng.
- UI: thu gọn HUD trong điện, ảnh lư hương nằm trong vùng 140px không che nút, hướng dẫn theo desktop/mobile. Sửa bản đồ mobile chọn nhầm do nhãn dài chồng nhau: dùng ghim số 24×26px và danh sách tên 44px; 23 ghim có 0 cặp chồng tại 320px, chọn Vườn Lâm Tỳ Ni đi đúng khu.
- Nghiên cứu hai repo user cung cấp: đều là 2.5D và không có bộ model GLB/GLTF/FBX/OBJ; Kent Juno có MIT, Zane chưa thấy LICENSE. Chỉ tham khảo cách nghi thức/FX, không chép mã, hình hay nhạc. Chi tiết: docs/temple-reference-review.md.
- Kiểm tra: 493 regression pass, 529 tuyến 23 khu pass, thêm đích chuột ngoài ô lưới không xuyên vật cản. Main + single build và 211 meta route OK, standalone ~2.09 MB, NUL=0. Desktop 1366×900, 390×844 và 320×740 không tràn ngang; bảng tên không che controls, dialog vừa màn và art không đè nút.
- Giới hạn QA: chưa đo FPS/cảm ứng trên điện thoại thật; API trình duyệt tích hợp không hỗ trợ Input.dispatchTouchEvent, không coi thao tác vuốt đã được kiểm thử bằng cảm ứng.
- Phát hành: trạng thái commit/push/deployment báo ở phản hồi bàn giao.

Bổ sung QA cuối: Vườn Lâm Tỳ Ni vào đúng chế độ area sau khi sửa ghim; 23 ghim không có cặp chồng ở 320px. Chủ động mất WebGL vẫn có lối mở chùa ảnh; đợi classic tải xong thấy đủ 23 nút khu và bộ đếm 1 nén từ thử dâng hương ở 3D. Đã trả chế độ mô phỏng cảm ứng về tắt và bỏ override viewport sau QA.

## 02/11/2026 — v4.6.0: Tượng quét 3D, bàn thờ và nội thất riêng

- Thay tượng Phật/Quan Âm dạng khối đơn giản bằng hai GLB quét được phép CC BY 4.0 (MingEID; Diana Liu/Thunk3D), bản tối ưu từ kentjuno. Tổng 221632 byte, có manifest/SHA-256/nguồn/ghi công và hộp Ghi công 3D ngay trong UI. Không lấy mã game, tranh hay nhân vật của trang nguồn.
- Bàn thờ có gỗ/kim loại, khám cuốn lá, hạc, bát hương, chân đèn, gấm, quả/chén nước, bình gốm và hoa. Ngọc Hoàng, Kim Hoa/Thánh Mẫu, Thập Điện, Hộ Pháp, Ông Tơ, Nhà Tổ có tượng/trang phục/ngai/bài vị và bố cục riêng. Tượng tự dựng thêm mặt, tay/ngón, nếp áo có hình khối và bề mặt sơn gỗ; vẫn là diễn họa hư cấu.
- Nội thất tạo khi đến gần/chọn khu, gộp trong từng điện; khi vào điện chỉ hiển thị nội thất điện đó. Cache mẫu/cảnh, clone dùng chung geometry, hủy tải/giải phóng khi đóng. Tải hỏng có tượng dự phòng và thông báo; GLB cùng origin được SW cache. Cập nhật vùng cản theo bàn thờ mới và góc nhìn ban đầu theo chiều cao từng nhóm điện.
- Kiểm tra: 493 regression pass; 529 tuyến liên thông + đích chuột và vùng cản bàn thờ pass. Giải mã thật 2 GLB, kiểm normal/vật liệu/tỷ lệ/ghi công, lỗi tải/hủy tải; dựng cả 18 kiểu nội thất hữu hạn, trong giới hạn điện. Main build + 211 meta route + single build OK; tam-so-test.html 2217599 byte, NUL=0. Bản một file vẫn cần thư mục tài nguyên để có GLB; thiếu tệp dùng fallback.
- Browser bản build: xem trực tiếp Chánh Điện, Điện Phật Bà, Dược Sư, Ngọc Hoàng, Kim Hoa; điều hướng liên thông chuyển vào góc nhìn trong điện. Desktop 1366×900, 390×844, 320×740 không overflow ngang; footer không đè dải hành lễ, dialog dâng hương và ghi công vừa màn. Chỉ điều hướng/xem dialog, không tạo/xóa lịch sử nghi thức trong lượt QA này. Dời hàng cây ranh ra ngoài tường sau khi phát hiện tán cây xuyên vách Kim Hoa; có kiểm tra khoảng cách tán tới các điện sát ranh. Chưa thử FPS/cảm ứng trên điện thoại thật.
- Phát hành: commit/push/Vercel và kiểm tra production được báo riêng trong bàn giao, không suy từ build local.

## 02/11/2026 — v4.7.0: Bộ tượng quét cho các điện còn lại

- Bổ sung 9 GLB quét/điêu khắc có giấy phép mở, nâng bộ tượng lên 11 mẫu. Thay tượng quan phục/Mẫu/Hộ Pháp tự ghép khối bằng bề mặt và hình thể quét: Ngọc Hoàng, Thổ Địa, Hộ Pháp, Thành Hoàng, Kim Hoa, Thiên Y Thánh Mẫu, Ông Tơ/Bà Nguyệt, Thập Điện; thêm tượng Tổ ở Nhà Tổ. Giữ 23 khu và điều khiển/chuyển cảnh hiện có.
- Nguồn sơ cấp được kiểm tra tại Sketchfab: Cleveland Museum of Art (CC0), Minneapolis Institute of Art (CC0/CC BY-SA), St. Cloud State University Archives (CC BY-SA). Bản GLB công khai từ Artheon. Có manifest/SHA-256, tên tác phẩm gốc, tác giả, giấy phép và link tải bản chuyển đổi trong UI; các bản CC BY-SA tiếp tục giữ CC BY-SA. Đây là phỏng tác cho chùa hư cấu, không xác nhận các mẫu tiên nhân/Zuishin/Bishamonten là bản quét đúng tôn tượng Ngọc Hoàng/Thập Điện/Thành Hoàng.
- Có pipeline tái xuất scripts/prepare-temple-sculptures.mjs và sources.json: đóng skin thành mesh tĩnh, hàn vị trí/UV, giảm lưới, giữ texture màu gốc/bỏ map phụ. Tổng bộ GLB 28577476 byte; mẫu mới 1,53–4,14 MB; tải theo khu, không tải toàn bộ bộ tượng lúc vào chùa. Texture upload GPU giới hạn cạnh 1024px, dùng chung geometry/material/texture giữa các bản đặt và giải phóng theo cảnh. Thập Điện dùng khoảng 14k tam giác/mẫu nhỏ, hai tầng bàn thờ, ghế/đế đỡ; bỏ đồ trang trí cũ che tượng.
- Kiểm tra: 493 regression pass, 529 tuyến giữa 23 khu pass, giải mã hình học và atlas của 11 GLB, normal/tỷ lệ/SHA/giấy phép/fallback và hủy tải; dựng đủ 18 kiểu nội thất trong giới hạn. Main build + 211 meta route + single build OK, bản HTML 2222686 byte, NUL=0. Bản HTML cần các tệp GLB đi kèm để có tượng quét, thiếu sẽ dùng dự phòng.
- Browser bản build: xem Hộ Pháp, Thổ Địa, Thập Điện, Nhà Tổ, Kim Hoa và Ngọc Hoàng ở dev; giữ chuyển cảnh inside, mẫu tải thành công, không thấy lỗi JavaScript trong các lượt xem. Kiểm UI 390×844 và 320×740 không overflow ngang; footer không đè hành lễ; ghi công đủ 11 mẫu và 11 link tải, dialog có cuộn dọc và vừa màn. Chỉ điều hướng/xem dialog, không tạo/xóa lịch sử nghi thức. Chưa đo FPS/cảm ứng trên điện thoại thật.
- Trạng thái commit/push/Vercel và kiểm tra production được báo riêng trong bàn giao. Chi tiết nguồn/pipeline: docs/temple-sculpture-assets.md.

## 02/11/2026 — v4.7.1: Thu gọn thanh hành lễ theo ảnh phản hồi

- Bỏ hai dải nền sáng chạy ngang ở đáy cảnh. Cụm hành lễ nổi tông đồng tối, có icon và nhãn ngắn; desktop 1280px đo 501×60px, mobile 320px đo 296×67px với bốn nút cùng hàng, mỗi nút cao 55px. Ngoài điện có phần tên/mô tả gọn riêng; giữ phần giữa cảnh thông thoáng.
- Chuyển Không gian ảnh/Ghi công/Hướng dẫn vào menu dấu ba chấm ở header. Có đóng khi bấm ngoài/Escape, trả focus sau khi đóng dialog; hướng dẫn chuột chỉ còn chip nhỏ ở desktop đủ rộng. Dọn các rule CSS thanh cũ thay vì chồng thêm nền/padding.
- Browser bản build: 1280×720, 320×740, 390×844, 844×390 không tràn ngang, các nút không chồng chữ. Đã mở dialog dâng hương (không xác nhận nghi thức), mở ghi công rồi Escape trả focus về Tuỳ chọn; chuyển classic thấy đủ 23 khu và quay lại 3D thành công. Không tạo/xóa lịch sử trong lượt QA này.
- 493 regression + 529 tuyến/11 GLB/18 nội thất pass; main + 211 meta route + single build OK, HTML 2227167 byte, NUL=0. Commit/push/Vercel và xác nhận production báo trong bàn giao.

## 02/11/2026 — v4.7.2: Đồng bộ thanh trên và nút góc nhìn

- Thanh trên thành hai cụm nổi tông đồng tối, dùng chung màu/viền với dock hành lễ. Bản đồ, lịch sử, âm thanh và góc nhìn có icon đồng bộ; bảng tên điện/nút Ra sân, menu phụ, khung danh sách bản đồ và trạng thái tải cùng tông. Giữ sơ đồ giấy sáng để dễ đọc vị trí.
- Mobile thu nhãn thành icon có tên truy cập, logo ngắn; nút cao 38px. Ở 320px: brand 91,64px, nav 185,91px, không chồng; bảng tên điện cách cụm góc nhìn. Desktop nút 36px, toolbar 46×160px; trạng thái chế độ nhẹ có màu nhấn.
- Browser bản build 1280×720, 320×740, 390×844, 844×390 không tràn ngang; kiểm bản đồ đủ 23 khu, menu nằm trên drawer/đóng Escape, lịch sử mở/đóng, phóng/thu, đổi chất lượng rồi trả về tiêu chuẩn, Ra sân và toàn cảnh. Không tạo/xóa lịch sử nghi thức. Không có lỗi JavaScript trong lượt QA; chưa thử cảm ứng/FPS trên điện thoại thật.
- 493 regression + 529 tuyến/11 GLB/18 nội thất pass; main + 211 meta route + single build OK, HTML 2231279 byte, NUL=0. Commit/push/Vercel và xác nhận production báo trong bàn giao.

## 02/11/2026 — v4.8.0: Đại điện rộng và người cùng dạo chùa

- Chánh Điện mở từ 11×7 lên 16×12 đơn vị cảnh (mặt sàn khoảng 2,49 lần), cao 6,4; có năm gian mặt tiền, cột/chân đá và hệ xà, hiên/bậc, cửa gỗ, trục đi giữa, 24 bồ đoàn, đèn lồng bát giác, chuông/mõ. Tượng chính/bệ/khám lớn hơn, bàn lễ phía trước, tủ kinh và đèn hai bên; bỏ hai tượng Quan Âm lặp ở điện chính. Dời ba điện lân cận để giữ khe mái và lối đi. Cập nhật va chạm cột/cửa/bục và bệ thờ.
- Thêm phòng chung Supabase Presence + Broadcast, không thêm bảng DB hay sửa RLS. Mỗi tab có ID ngẫu nhiên và biệt danh khách; không gửi email/tài khoản/lời nguyện/lịch sử. Vị trí gửi tối đa 4Hz khi đổi, heartbeat 5 giây, bỏ gói cũ/tọa độ sai và khách không còn phản hồi. Tên giới hạn 24 ký tự, hiển thị bằng React text/canvas; chỉ dựng tối đa 24 khách gần trong cùng điện hoặc cùng khuôn viên, nội suy chuyển động, dùng chung geometry nhân vật và giải phóng nhãn/vật liệu khi rời.
- Nút người ở cuối toolbar phải mở số người, danh sách khu và đổi biệt danh; có trạng thái thiếu cấu hình/mất kết nối, tự nối lại. Người trùng vị trí trong nội điện được ẩn khi quá sát camera. Đây là phòng công khai cho khách, chưa có chat/tài khoản nhân vật/đồng bộ nghi thức hoặc máy chủ kiểm soát chống gian lận.
- Supabase ban đầu không phân giải được tên miền; ảnh user xác nhận dự án bị Paused. Sau hướng dẫn Resume, tên miền và Realtime hoạt động trở lại. Hai phiên thật dùng cùng dự án công khai đã thấy nhau trong Chánh Điện, cập nhật chuyển động/tên/khu; Ra sân chuyển khách khỏi nội điện và danh sách về Khuôn viên. Đã quan sát tự kết nối lại sau khi dự án khởi động. Không thay cấu hình dự án, mật khẩu hay khóa của Supabase; không ghi/copy khóa secret/service_role.
- 493 regression, 529 tuyến/đích chuột, va chạm mới, 11 GLB/18 nội thất và kiểm tra phòng chung (gói sai, gói cũ, 4Hz, đổi khu/tên, timeout, tái kết nối/cleanup) pass. UI desktop và 320/390px đã xem, dialog vừa màn. Không tạo/xóa lịch sử nghi thức; chưa thử tải đông/FPS/cảm ứng trên điện thoại thật. Trạng thái bản build cuối/phát hành xem bàn giao.

Bổ sung bản cuối v4.8.0: main build + 211 meta route + single build pass; tam-so-test.html 2245009 byte, trùng bản single và NUL=0. Bản build có đèn lồng bát giác; 1280×720, 320×740, 390×844 và 844×390 đã kiểm bố cục. Không ghi nhận lỗi JavaScript trong lượt xem bản build. Supabase đã nhận lại kết nối thật sau Resume; trạng thái Git/Vercel và kiểm tra production báo riêng trong bàn giao.

## 02/11/2026 — v4.8.1: UI mobile cho chùa 3D

- Thanh trên mobile giữ logo, Bản đồ, người online và menu; Lịch sử/âm thanh chuyển vào menu. Vùng chạm chính 44–57px; tên điện/Ra sân và thanh hành lễ gọn hơn, rút mô tả ngoài sân thành một dòng địa điểm. Cụm bốn nút góc nhìn thu thành một nút 46px, mở bảng 2×2 khi cần; desktop vẫn hiện trực tiếp các nút.
- Bản đồ mobile mở từ đáy màn hình, có Danh sách/Sơ đồ, tìm tên không dấu/không phân biệt hoa thường, trạng thái không kết quả và đủ 23 khu. Danh sách một cột, hàng cao 50px. Có nền che cảnh, nút đóng, Escape, giữ vòng Tab trong bảng và trả focus khi đóng. Tách TemplePlacePanel/TempleViewControls và CSS mobile riêng.
- Hộp thoại hành lễ/lịch sử/phòng chung thành bảng đáy, nội dung có cuộn, nút đóng 44px; input/textarea 16px. Bổ sung safe-area và theo dõi visualViewport để chừa chiều cao khi bàn phím hiện. Chỉ đặt viewport-fit=cover khi ở chùa và khôi phục meta cũ khi rời. Bổ sung xử lý hai ngón phóng/thu trong nội điện, tránh nhả ngón thành click đi.
- UI bản build: 320×740, 390×844, 844×390, desktop 1280×720 không tràn ngang. 320px đo Bản đồ/online/menu/Ra sân cao 44px, góc nhìn 46px, hành lễ 57px. 844×390: toolbar y76–122, dock y324–380, không chồng. Đã thử tìm DIEN, tìm không có kết quả, đổi Sơ đồ/chọn Chánh Điện, zoom/đổi chất lượng/Escape, menu lịch sử, dialog dâng hương và phòng chung; Shift+Tab trong bảng vòng về mục cuối, Escape trả focus Bản đồ. Chỉ xem dialog, không xác nhận nghi thức, không tạo/xóa lịch sử hay đổi biệt danh.
- 493 regression + 529 tuyến/đích chuột, phòng chung, 11 GLB/18 nội thất pass. Main + 211 meta route + single build OK; tam-so-test.html 2259123 byte, trùng single, NUL=0. Chưa kiểm bằng bàn phím ảo/cảm ứng hai ngón hoặc đo FPS trên điện thoại thật; kiểm kích thước trình duyệt không thay cho các thử nghiệm đó. Trạng thái Git/Vercel/production báo trong bàn giao.
