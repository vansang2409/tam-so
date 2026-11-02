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
