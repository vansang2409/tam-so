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
- Thêm phòng chung Supabase Presence + Broadcast, không thêm bảng DB hay sửa RLS. Mỗi tab có ID ngẫu nhiên và biệt danh khách; không gửi email/tài khoản/lời nguyện/lịch sử. Vị trí gửi tối đa 4 Hz khi đổi, heartbeat 5 giây, bỏ gói cũ/tọa độ sai và khách không còn phản hồi. Tên giới hạn 24 ký tự, hiển thị bằng React text/canvas; chỉ dựng tối đa 24 khách gần trong cùng điện hoặc cùng khuôn viên, nội suy chuyển động, dùng chung geometry nhân vật và giải phóng nhãn/vật liệu khi rời.
- Nút người ở cuối toolbar phải mở số người, danh sách khu và đổi biệt danh; có trạng thái thiếu cấu hình/mất kết nối, tự nối lại. Người trùng vị trí trong nội điện được ẩn khi quá sát camera. Đây là phòng công khai cho khách, chưa có chat/tài khoản nhân vật/đồng bộ nghi thức hoặc máy chủ kiểm soát chống gian lận.
- Supabase ban đầu không phân giải được tên miền; ảnh user xác nhận dự án bị Paused. Sau hướng dẫn Resume, tên miền và Realtime hoạt động trở lại. Hai phiên thật dùng cùng dự án công khai đã thấy nhau trong Chánh Điện, cập nhật chuyển động/tên/khu; Ra sân chuyển khách khỏi nội điện và danh sách về Khuôn viên. Đã quan sát tự kết nối lại sau khi dự án khởi động. Không thay cấu hình dự án, mật khẩu hay khóa của Supabase; không ghi/copy khóa secret/service_role.
- 493 regression, 529 tuyến/đích chuột, va chạm mới, 11 GLB/18 nội thất và kiểm tra phòng chung (gói sai, gói cũ, 4 Hz, đổi khu/tên, timeout, tái kết nối/cleanup) pass. UI desktop và 320/390px đã xem, dialog vừa màn. Không tạo/xóa lịch sử nghi thức; chưa thử tải đông/FPS/cảm ứng trên điện thoại thật. Trạng thái bản build cuối/phát hành xem bàn giao.

Bổ sung bản cuối v4.8.0: main build + 211 meta route + single build pass; tam-so-test.html 2245009 byte, trùng bản single và NUL=0. Bản build có đèn lồng bát giác; 1280×720, 320×740, 390×844 và 844×390 đã kiểm bố cục. Không ghi nhận lỗi JavaScript trong lượt xem bản build. Supabase đã nhận lại kết nối thật sau Resume; trạng thái Git/Vercel và kiểm tra production báo riêng trong bàn giao.

## 02/11/2026 — v4.8.1: UI mobile cho chùa 3D

- Thanh trên mobile giữ logo, Bản đồ, người online và menu; Lịch sử/âm thanh chuyển vào menu. Vùng chạm chính 44–57px; tên điện/Ra sân và thanh hành lễ gọn hơn, rút mô tả ngoài sân thành một dòng địa điểm. Cụm bốn nút góc nhìn thu thành một nút 46px, mở bảng 2×2 khi cần; desktop vẫn hiện trực tiếp các nút.
- Bản đồ mobile mở từ đáy màn hình, có Danh sách/Sơ đồ, tìm tên không dấu/không phân biệt hoa thường, trạng thái không kết quả và đủ 23 khu. Danh sách một cột, hàng cao 50px. Có nền che cảnh, nút đóng, Escape, giữ vòng Tab trong bảng và trả focus khi đóng. Tách TemplePlacePanel/TempleViewControls và CSS mobile riêng.
- Hộp thoại hành lễ/lịch sử/phòng chung thành bảng đáy, nội dung có cuộn, nút đóng 44px; input/textarea 16px. Bổ sung safe-area và theo dõi visualViewport để chừa chiều cao khi bàn phím hiện. Chỉ đặt viewport-fit=cover khi ở chùa và khôi phục meta cũ khi rời. Bổ sung xử lý hai ngón phóng/thu trong nội điện, tránh nhả ngón thành click đi.
- UI bản build: 320×740, 390×844, 844×390, desktop 1280×720 không tràn ngang. 320px đo Bản đồ/online/menu/Ra sân cao 44px, góc nhìn 46px, hành lễ 57px. 844×390: toolbar y76–122, dock y324–380, không chồng. Đã thử tìm DIEN, tìm không có kết quả, đổi Sơ đồ/chọn Chánh Điện, zoom/đổi chất lượng/Escape, menu lịch sử, dialog dâng hương và phòng chung; Shift+Tab trong bảng vòng về mục cuối, Escape trả focus Bản đồ. Chỉ xem dialog, không xác nhận nghi thức, không tạo/xóa lịch sử hay đổi biệt danh.
- 493 regression + 529 tuyến/đích chuột, phòng chung, 11 GLB/18 nội thất pass. Main + 211 meta route + single build OK; tam-so-test.html 2259123 byte, trùng single, NUL=0. Chưa kiểm bằng bàn phím ảo/cảm ứng hai ngón hoặc đo FPS trên điện thoại thật; kiểm kích thước trình duyệt không thay cho các thử nghiệm đó. Trạng thái Git/Vercel/production báo trong bàn giao.

## 02/11/2026 — v4.8.2: Mặc định góc thứ ba và nút đổi góc

- Mỗi lần mở chùa mặc định góc nhìn thứ ba, thấy nhân vật cả ngoài sân và khi vào điện; không tự đổi sang thứ nhất lúc hành lễ/chuyển khu. Nút Góc 3/Góc 1 luôn hiện ngoài bảng zoom trên desktop/mobile, có nhãn truy cập, trạng thái nhấn và bị vô hiệu khi cảnh chưa sẵn sàng. Giữ lựa chọn khi đi giữa các khu; Toàn cảnh đưa về góc thứ ba.
- Camera sau lưng trong điện có góc rộng phù hợp portrait/desktop, zoom theo khoảng lùi, xoay bằng chuột phải/vuốt; giới hạn camera theo vách bên/vách hậu và trần của điện, chừa khoảng qua cửa trước mở. Tượng nhân vật hướng vào bàn thờ khi tới nơi, ẩn dấu chỉ vị trí trên đầu khi ở trong khu để không che điện thờ. Góc thứ nhất vẫn đi/nhìn/zoom được ngoài sân và trong điện; đổi qua lại không dựng lại renderer hay đổi vị trí nhân vật.
- Tách templeCamera.js để kiểm tra vị trí camera: 408 tổ hợp góc/tỷ lệ/elevation ở 17 công trình có chế độ inside, hữu hạn và không vượt giới hạn vách/trần đã định nghĩa. 493 regression, 529 tuyến, phòng chung, 11 GLB/18 hồ sơ nội thất pass. Main + 211 meta route + single build OK; HTML 2263709 byte, NUL=0.
- Browser: thử mặc định thứ ba ở cổng/Chánh Điện, đổi sang thứ nhất/ẩn nhân vật, đổi lại thứ ba/hiện nhân vật; giữ thứ nhất khi Ra sân và tới Miếu Hộ Pháp; nút Toàn cảnh từ thứ nhất trở về thứ ba/outside. UI desktop 1280 và mobile 320/390 đã kiểm. Đi bằng click trong Chánh Điện tới -1,3/-0,5; đổi 3→1→3 giữ nguyên vị trí, nhân vật hiện lại đúng và không thấy lỗi JavaScript. Không tạo/xóa nghi thức/lịch sử, không đổi biệt danh; cảm ứng/FPS trên máy thật chưa kiểm. Trạng thái Git/Vercel/production báo trong bàn giao.

## 02/11/2026 — v4.9.0: Camera thoáng hơn, ngồi thiền và lễ Phật trong cảnh

- Nâng/lùi camera thứ ba, góc rộng 78° trên portrait (88° cho điện nhỏ), nhìn lệch qua vai và nhắm về khoảng phía trước nhân vật. Zoom có khoảng lùi 2,8–10 đơn vị. Giữ giới hạn vách/trần và chặn lùi sau trụ cổng phía nam. Mặt tiền gồm cột/cửa/biển hiệu, đèn ngoài hiên và lư hương tách khỏi phần tĩnh để ẩn khi đang trong chính điện đó; trở ra sân hiện lại. Gộp geometry riêng các nhóm để hạn chế draw call.
- Có nút Ngồi thiền và Lễ Phật ngay trên cảnh. Thiền 1/3/5 phút, đóng hộp thoại thiết lập để thấy nhân vật ngồi và đồng hồ trên nút Đứng dậy. Lễ Phật gồm ba lạy trong 12 giây: chắp tay, cúi sát sàn, nâng người; rig thân/tay/đầu có khớp. Có dừng, tự kết thúc và tự đứng khi đi/chuyển khu/toàn cảnh; tự hướng nhân vật về bàn thờ trước hành lễ. Ngoài điện, Lễ Phật tự dẫn tới một điện phù hợp. Chế độ giảm chuyển động dùng tư thế quỳ tĩnh.
- Đồng bộ tư thế/nhịp lạy qua phòng chung đang có, giới hạn 4 Hz; khách bản cũ vẫn đứng bình thường, bỏ tư thế/nhịp sai. Tái sử dụng geometry cho khách, chỉ dựng tư thế đang cần thấy; giải phóng vật liệu/nhãn khi rời. Kết thúc tư thế vẫn được gửi khi hộp thoại tạm dừng renderer. Không ghi lịch sử cho thiền/lạy; lời nguyện/tài khoản vẫn riêng tư.
- Hai nút mới cao 44px. Mobile portrait giữ hai hàng gọn; ngang 844×390 gom sáu hành động thành một hàng, dock cao 56px, tránh che chân nhân vật. Kiểm 390×844, 320×740, 844×390 và desktop 1280×720 không tràn ngang. Đã thử thiền một phút kết thúc thật, 3 phút rồi đứng dậy, click nền tự đứng, ba lạy/tự kết thúc/dừng giữa chừng, hai phiên thật nhận pose, và điện nhỏ. Không dâng hương/gửi lời nguyện/tạo/xóa lịch sử trong QA. Chưa đo FPS/cảm ứng trên điện thoại thật.
- 493 regression + 529 tuyến + 408 góc camera + 241 khung rig/bản sao và kiểm phòng chung/11 GLB/18 nội thất pass. Main, 211 meta route và single build pass; tam-so-test.html 2270738 byte, trùng single, NUL=0. Trạng thái Git/Vercel/production báo trong bàn giao.


## 03/11/2026 — Ánh sáng và vật liệu thanh tịnh hơn

- Giảm sắc vàng và cường độ nắng, tăng ánh sáng trời xanh nhạt và ánh sáng hắt đối diện để đọc rõ gỗ/chạm khắc. Nền trời và sương chuyển xám xanh sáng. Giữ một shadow map 2048; đèn hắt và đèn bàn thờ không tạo thêm shadow map.
- Nội điện có ánh sáng kem dịu và spotlight biên mềm hướng về bàn thờ, đổi theo kích thước/khu đang đứng; tắt khi ra sân. Texture gỗ/đá sáng và ít nhiễu hơn, gạch/ngói có biến thiên từng viên, mạch bớt tương phản; giảm bump và chỉnh độ nhám gỗ/ngói. Không thêm tài nguyên tải ngoài hay dependency.
- Kiểm tra trực tiếp sân cổng và Chánh Điện trên trình duyệt, chuyển chất lượng tiêu chuẩn/nhẹ. Không có lỗi JavaScript; còn hai cảnh báo React Router future flags hiện có. Chưa đo FPS hay kiểm trên điện thoại thật.
- npm test: 493 pass/0 fail, gồm các kiểm tra tuyến/camera/rig/phòng chung/GLB/nội thất; npm run build thành công (prerender bỏ qua theo base tương đối).

## 03/11/2026 — Bề mặt và cây gần thực tế hơn

- Tách texture màu, độ nổi và độ nhám cho 7 loại bề mặt: gỗ, ngói, đá, gạch, vữa, vỏ cây và nền cỏ. Nhiễu nhiều thang có seed cố định; mạch gạch có độ lõm/vát và từng viên có sắc độ riêng. Bản đồ dữ liệu không dùng sRGB.
- Tạo panorama trời cục bộ và PMREM dùng chung cho phản chiếu đồng/gỗ/nước; giải phóng render target khi rời cảnh. Đồng có metalness/roughness riêng. Không tải tài nguyên ngoài và không thêm dependency.
- Thay khối tán cây bằng 240 lá instanced mỗi cây, có alpha cutout/gân lá, khoảng hở và bóng lá. Bỏ qua InstancedMesh khi gộp geometry tĩnh để giữ các phép biến đổi instance; vẫn dùng geometry/vật liệu chung.
- npm test: 493 pass/0 fail cùng các kiểm tra 529 tuyến, 408 camera, 241 khung rig, GLB và nội thất; production build thành công. Trình duyệt: kiểm sân cổng, vào Chánh Điện, chế độ nhẹ và Ra sân; không có lỗi console.
- Đây là bước cải thiện trên hình học hiện tại, chưa phải đồ họa photorealistic: nhân vật và nhiều chi tiết kiến trúc vẫn là mô hình đơn giản. Chưa benchmark FPS/bộ nhớ GPU hoặc kiểm điện thoại thật.

## 03/11/2026 — Kiến trúc có cấu tạo và nhân vật tỷ lệ trưởng thành

- Thay đầu cầu lớn/thân hình nón bằng nhân vật cao khoảng 1,73 đơn vị: đầu/hàm/cổ/mũi/tai/mắt/tóc, vai và áo có cổ/nút/nếp vải. Tách chân/tay thành nhóm có tâm xoay ở hông/vai; giày và bàn tay đi theo khớp. Dùng cùng anatomy cho đứng, thiền và lạy; khách online clone hình học và đổi màu toàn bộ áo, đồng bộ cả vung tay khi đi.
- Cạnh đá/gỗ/khung cửa có bevel nhỏ theo kích thước, UV chiếu theo mặt và chuyển về indexed geometry để gộp được với cột tròn. Bổ sung kiểm tra hồi quy gộp 3 cỡ cạnh mỏng/cột để tránh mất hình.
- Các điện có chân cột nhiều lớp, đầu cột/xà đỡ, gờ nền, rui và xà dưới mái; mái có các hàng tiếp giáp ngói. Giữ cao độ điều hướng, không thêm vật cản ở lối đi.
- Test: 493 pass/0 fail, các kiểm tra tuyến/camera/11 GLB/18 nội thất đạt; 241 khung lạy và bản sao không xuyên sàn; kiểm thêm tỷ lệ người, 5 nhịp đi, khớp/bản sao online và tư thế ngồi. Build thành công, prerender bỏ qua theo base tương đối.
- Browser: xem sân/cột/khung cửa, đi vào Chánh Điện, bắt đầu lạy, bắt đầu thiền rồi đứng dậy; ảnh ở .setest/architecture-avatar (không đưa vào Git). Chưa kiểm hai phiên đồng bộ tư thế cuối cùng, chưa benchmark FPS trên mobile. Hình học đã chi tiết hơn nhưng vẫn là nhân vật/kiến trúc dựng bằng mã, chưa phải mô hình quét photorealistic.

## 03/11/2026 — Thay bằng model GLB có texture và skeleton

- Thêm 8 model kiến trúc gốc của Kent Juno (CC BY 4.0): cổng tam quan, vỏ Chánh Điện, nhà thờ Tổ, gác chuông, giảng đường, nhà khách, Tàng Kinh Các và thiền đường. Dùng lại tại 18 vị trí (cổng + 17 điện/nhà); vỏ nguyên khối hiển thị ngoài sân, ẩn khi chuyển vào nội điện để giữ lối đi/camera và nội thất tương tác. Nội điện vẫn dùng kiến trúc dựng hiện có cùng model bàn thờ/tượng. Các kiến trúc không nằm trong 18 vị trí vẫn giữ nguyên.
- Thêm nhân vật khách trưởng thành mặc thường phục, model grzp782xf7 từ vibeassets (CC0), 31.088 tam giác, texture 1024 và skeleton 24 joints, clip Walk. Không phải model nhà sư. Giữ atlas gốc, tắt phát sáng/kim loại và mipmap gây lem mép UV; thêm đứng/thiền/ba lạy bằng giải khớp hai đoạn trên skeleton thật. Nhân vật cũ chỉ xuất hiện lúc tải hoặc tải lỗi.
- Mỗi khách online có skeleton và mixer độc lập, dùng chung geometry/texture. Khi rời, giải phóng mixer và bone texture; không thay đổi payload phòng chung. Ẩn khách đứng trùng sát vị trí để tránh hai mesh đè nhau ở điểm spawn.
- 9 tệp GLB tổng 7,143,344 byte; mỗi tệp dưới 2,5 MB. Không tải từ máy chủ bên ngoài khi chạy: model được phục vụ trong public/dichua/models. detail-manifest.json lưu nguồn, giấy phép, checksum, số tam giác và thay đổi. UI ghi công cho phép tải lại tệp; ATTRIBUTION.md có bằng chứng giấy phép. Khôi phục đúng tệp bằng node scripts/fetch-temple-detail-models.mjs; kiểm chỉ đọc bằng --check.
- Test model thật: kiểm 9 GLB, ảnh texture, checksum/ghi công, scale vỏ điện, skeleton độc lập; 75 khung đứng/thiền/lạy không lún quá 5 mm, 80 khung Walk, fallback lỗi tải và bỏ kết quả tải muộn sau unmount. Bộ hồi quy 493 pass/0 fail cùng 529 tuyến, camera/rig/11 tượng/18 nội thất đạt; build thành công (prerender bỏ qua theo base tương đối).
- Browser: tải đủ 18 vỏ và nhân vật chi tiết, đi từ cổng vào Chánh Điện và Ra sân, thiền/đứng dậy, ba lạy tự kết thúc, chuyển chế độ nhẹ/tiêu chuẩn; không có lỗi console. Hai phiên nhận tư thế meditating và tạo skeleton khách riêng. Chưa benchmark FPS/bộ nhớ trên điện thoại thật. Model kiến trúc là tác phẩm phỏng dựng AI có texture, không phải quét phục dựng một ngôi chùa cụ thể.

## 03/11/2026 — Trang phục khách áo lam

- Đổi áo có logo/quần jeans thành áo lam cổ đứng, nẹp/nút phía trước, thân áo dài hơn, quần suông cùng tông và giày tối màu. Giữ chi tiết da/mặt/tay và skeleton. Phân vùng vật liệu từ tọa độ rest pose đã skin và skin weights để không tô màu nhầm cổ/vai. Biến đổi phần áo/quần trở lại bind pose, giữ skin weights; chi tiết cổ/nẹp được gắn theo bone.
- Tệp nguồn visitor.glb và checksum không đổi; trang phục được áp dụng chung cho bản thân và khách online khi tải. Không tải thêm tài nguyên ngoài.
- Test bổ sung kiểm đủ 4 nhóm vật liệu, bỏ atlas trang phục cũ trên áo/quần và có chi tiết cổ/nẹp; kiểm trên mesh sau sửa 75 khung đứng/thiền/lạy và 80 khung Walk. Bộ hồi quy 493 pass/0 fail; build thành công. Browser đã xem đứng, thiền rồi đứng dậy ở góc gần. Chưa kiểm điện thoại thật.

## 03/11/2026 — Nam/nữ trẻ và bộ đồ lam skinned riêng

- Thay model nam trung niên bằng Man Base Mesh và Woman Base Mesh của Grab3D, CC0. Hai tệp sau tối ưu khoảng 591 KB và 651 KB, giữ skeleton 24 joint và Walk/Run; bỏ model visitor.glb cũ. Các tệp nguồn và model đã tối ưu đều được kiểm checksum; pipeline cố định CLI 4.5.1 được chạy tái dựng và so hash.
- Thay cách tô lại trang phục nền bằng áo/quần riêng: ẩn cơ thể và đồ thể thao dưới lớp áo, giữ mặt/tóc/cổ/tay; áo cổ đứng, nẹp cài, vạt dài, dáng rộng không bó eo; tay dài rộng, quần ống suông và giày tối. Outfit có skeleton/bind pose riêng dùng chung các bone để không biến thành một khối cứng khi đi hoặc lạy.
- Tuỳ chọn → Chọn nhân vật có Nam trẻ/Nữ trẻ, trạng thái aria-pressed và vùng bấm tối thiểu 44px. Lưu lựa chọn local, dùng ngay khi mở lại; không dựng lại cả cảnh khi đổi. Appearance được kiểm enum ở biên gói presence, khách cũ mặc định male; broadcast/presence đồng bộ lựa chọn, bỏ gói cũ để không đổi ngược mẫu. Đây là lựa chọn avatar, không suy đoán giới tính người dùng.
- Test cả hai source model, áo/quần riêng, skeleton độc lập, 150 khung đứng/thiền/lạy và 160 khung Walk; đổi nam↔nữ dọn model cũ, thay mẫu khách online và cleanup, tải lỗi/tải muộn. Presence kiểm enum, legacy, lựa chọn mới và chống presence cũ ghi đè. Bộ 493 regression pass, build pass. Chưa kiểm FPS trên điện thoại thật.

- Browser bản cuối: đổi nam↔nữ bằng giao diện; mở tab mới giữ lựa chọn nữ; hai phiên nhận appearance khác nhau (male/female) và tạo model riêng. Đã xem đứng/thiền cho cả hai, nữ đi từ cổng vào Chánh Điện; ảnh QA trong .setest/young-visitors/qa. Không có lỗi console ở phiên nữ. Kiểm hình học lạy trên cả hai bằng test; chưa benchmark FPS/thiết bị thật.

## 03/11/2026 — Nếp rủ vải và tư thế thư giãn

- Tạo nếp rủ dọc thân áo, nếp chéo dưới vai/eo, gợn vạt áo, nếp dồn quanh khuỷu tay/đầu gối/cổ chân; chỉnh dáng áo và ống quần bớt đều như ống tròn. Tăng chia lưới ở vùng gấp, làm mượt normal qua đường nối UV. Vẫn giữ đồ lam cổ đứng, tay dài và quần suông.
- Thêm 5 morph target có normal tương ứng (elbowFold, kneeFold, seatedDrape, stride, breathing). Điều khiển theo đứng/đi/thiền/lạy, nội suy để không giật khi đổi tư thế; vạt áo dao động nhẹ theo nhịp Walk, ngực giãn rất nhẹ theo hơi thở. Đây là biến dạng dựng sẵn theo tư thế, không phải mô phỏng vật lý vải. Không thêm dependency, tải ngoài hay thay model GLB/checksum.
- Dáng đứng dịch trọng tâm nhẹ sang một chân, hai bàn chân trước/sau và xoay ra ngoài nhẹ, vai và tay bớt đối xứng; giảm nhún toàn thân, thêm nghiêng/đổi hướng đầu rất nhỏ. Hạ điểm chắp tay về trước ngực. Chế độ giảm chuyển động tắt thở/chuyển động đầu/vạt áo, giữ nếp vải tĩnh.
- Geometry/morph/normal được dùng chung, nhưng trọng số morph và skeleton độc lập cho từng khách; không đổi giao thức presence. Chỉ cập nhật vài trọng số mỗi frame, không tính lại lưới hoặc chạy physics mỗi frame.
- npm test: 493 regression pass/0 fail, cùng 150 khung đứng/thiền/lạy và 160 khung Walk trên cả hai model. Bổ sung kiểm hình học/normal hữu hạn, đường nối không bung ở mọi morph, skin weights chuẩn hóa, gối/vạt đổi hình khi thiền, clone không dùng chung trạng thái morph, giảm chuyển động ổn định theo thời gian, chân đứng lệch tự nhiên và tay chắp thấp hơn mặt. Giữ giới hạn không lún sàn quá 5mm ở bộ pose; Walk giữ giới hạn sàn đã có. npm run build thành công.
- Browser đã xem nữ đứng/thiền, đi vào Chánh Điện và bắt đầu lễ; ảnh QA ở .setest/cloth-drape. Chưa đo FPS hoặc kiểm điện thoại thật.


## 04/11/2026 — Bản chốt local4.10.0, audit23 khu và online

- Đồ lam: nẹp/nút bám cùng bề mặt và morph với thân áo; tà qua hông, tay/quần bớt hình ống, nếp dồn theo vùng và xẻ tà có khoảng hở. Kiểm khoảng cách trim với triangle thực cả base/morph/skin, hai avatar150 khung pose và160 khung Walk; negative control bản cũ bị từ chối. Đây là biến dạng theo tư thế, không phải physics vải hoặc xác nhận photorealistic.
- Đồ thờ/kiến trúc: bình và đồ lễ có mặt đỡ thật, không xếp trùng. Bàn trước Chánh Điện/lư được đưa ra khỏi scanned GLB; chân bàn nằm trọn trên bệ. Geometry test kiểm12 điểm quanh chân, không chỉ tâm; kiểm giao nhau chén/đĩa/đèn/lư/bình, stage và GLB ray. Dược Sư4 bình thay6 bình lấn nhau. Quai chuông và chày gỗ có liên kết/mặt gõ đúng; chày hồi về nghỉ, reduced motion tĩnh.
- Khói:5 sprite tái sử dụng mỗi địa điểm, chuyển anchor trong/ngoài theo transform lư thật, tránh trần; low2 sprite. Ngoài điện không còn mất lư/khói theo fallback. Nội điện Dược Sư chưa có anchor được xác minh nên không phát khói giả. Kiểm live Chánh Điện: sau thắp tăng5 draw calls/10 triangle và1 texture smoke, không tăng geometry; ảnh gần lư đã thấy que nhang không bị cushion che.
- Cảnh quan:7 chim/6 mây có ngân sách1468 triangle/9 draw calls standard, low3 chim/3 mây/6 calls; không audio/tải ngoài. Tán cây240 sprig×21 lá nhỏ/tree, cùng texture256² và buffers instanced.4 ghế/chậu có collider. Sen dùng cánh khum geometry chung, cá nằm dưới nước, rùa ngập một phần, ripple động không bị static merge và giữ tĩnh khi reduced motion. Bảng tên hồ nhỏ có chân đỡ; render/collider/hitbox dùng cùng tâm hồ, garden giữ offset-1m.
- Camera/picking:408 góc ban đầu,191616 góc sát vách và152880 khung chuyển góc ở17 nội điện; giữ cả repro quỹ đạo cũ và điểm mới còn walkable. Ground picking theo cao độ thật thay mặt phẳng nội điện áp cho sân/vườn.529 tuyến vẫn liên thông, bàn Thư Viện có cản, Góc Thiền khớp cao độ nền/bồ đoàn.
- Controls theo yêu cầu: trái xoay/nhìn, phải click/kéo đi; middle zoom, touch/pen mapping cũ giữ nguyên. Đã kiểm trực tiếp trái không đi, trái kéo xoay, phải click đi cả sân và nội điện; hướng dẫn/help/aria tương ứng. Right-drag liên tục và touch mapping kiểm unit/source, chưa kiểm gesture điện thoại thật.
- Online: mọi đường gửi dùng chung giới hạn4 Hz; gói name sai kiểu bị loại; snapshot presence cũ không làm sống lại khách hết TTL; bộ GLB nhận bow progress đã nội suy. Mock kiểm burst, reconnect, stale/invalid, nhiều ref và cleanup. Ba phiên thử live trong phòng DEV cô lập kiểm rename/nam-nữ/đi/thiền/lạy, count1→2→1→2 và remote clone cleanup. Phiên thiền5 phút từ17:31 UTC, mở history tạm dừng renderer, đến17:36:40 UTC root và peer đều standing trong khi dialog vẫn mở. Không ngắt mạng thật hoặc dùng khách thật làm fixture.
- Responsive: IAB viewport override không áp dụng, đã reset và không coi ảnh desktop là mobile. Chrome kết nối áp dụng đúng390×844 và844×390: kiểm map/search/đi tới Thư Viện, đổi nam-nữ, chọn low khi đi, vào Chánh Điện và6 nút hành lễ ngang, bắt đầu/kết thúc lạy. Đây là viewport desktop giả lập; chưa có gesture/keyboard/FPS thiết bị cảm ứng thật. Đã reset override và đóng tab QA Chrome.
- Hiệu năng giữa lượt (trước bệ lư cuối): cùng cổng IAB, standard411calls/1.777.450triangles, low224calls/885.085triangles, shadows tắt ở low; FPS sau warmup khoảng75 trên máy local/IAB, không phải GPU time hoặc số điện thoại. Không dùng số đo khi đang đi/đổi quality để so sánh cùng camera. Chi phí assets mới10 GLB là6.332.964byte;11 GLB tượng cũ28.577.476byte, giữ attribution/checksum.
- Full`npm test` sau source chốt:493 pass/0 fail cùng các suite hình học/tuyến/camera/pose/asset/online. `VERCEL=1 npm run build`:562 modules, prerender211 route. CI Pages dùng`npm ci` và test trước build. Version/lockfile/PWA cache4.10.0, không đổi dependency/schema/RLS/hosted business data.
- Review độc lập tìm và sửa finding ripple reduced-motion, chân bàn sát mép bệ, dây treo không chạm xà, va chạm đồ lễ và offset/hitbox garden. QA và ảnh riêng dưới`.setest/di-chua-team/2026-11-03-detail-audit/`, không commit. Fingerprint158 file source/test/model/release lưu để đối chiếu source trước push; Git/deploy còn theo mốc ở release doc.

Giới hạn hình ảnh còn lại: atlas kiến trúc nhòe khi nhìn sát, roughness chưa tách vùng vật liệu; vai–nách/đầu/tóc nhân vật vẫn stylized; lá sen còn đơn giản. Tiếp theo ưu tiên mẫu vật liệu cổng, mesh/weights áo lam và biến thể sen trong backlog. Chưa nghiệm thu photorealism hoặc bóng tiếp xúcA09.


Bổ sung source cuối18:12 UTC: bình trên bàn lấy mặt đỡ mesh thực; vòng tay Pháp Bảo dùng bounds sau xoay và nằm trọn trên bàn.14 lư ngoài sân có bệ từ nền tới đáy bát; lư điện nằm trước toàn shell, Chánh Điện lệch trái1.15m giữ trục giữa thông. Geometry/collider/529 tuyến và review độc lập đạt; full test493 pass/0 fail, Vercel build562 modules/211 route chạy lại sau sửa. Browser kiểm đúng entry mới `index-CS1ngI7m.js`, ảnh bệ Chánh Điện/Tượng trong final-build. Budget cổng nam1280×720 source cuối: standard430calls/1.761.870tri, low234calls/876.577tri; không phải benchmark thiết bị thật. Xem release doc để phân biệt kiểm local và kết quả production.
