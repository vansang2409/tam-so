# Kiểm tra Chùa Tam Sở 3D v4.4.0

Ngày: 02/11/2026. Môi trường Windows, Node, trình duyệt tích hợp Codex.

- Kiểm tra: 493 regression pass; 529 tuyến giữa 23 khu không xuyên vật cản; build production + 211 meta route; bản một file khoảng 2,06 MB, NUL=0.
- Browser bản build: 1366×900, 390×844, 320×740 không overflow ngang; đi giữa các khu, xin xăm/keo trả kết quả, lịch sử xăm/keo có ở bản 2D; dâng hương/lời nguyện đã kiểm tra ở dev; thiền 1 phút hoàn thành thật. Chủ động làm mất WebGL → fallback → mở bản 2D → quay lại 3D thành công.
- Mô hình stylized tự dựng bằng geometry; không dùng model/tài nguyên của trang tham khảo. Chưa đo FPS trên điện thoại thật.
- Trạng thái Git/phát hành: xem phản hồi bàn giao và trạng thái deployment; build cục bộ không đồng nghĩa đã lên production.


Lệnh: `node tests/run.mjs`. Test đường đi có thể chạy riêng: `node tests/temple-world.mjs`. Build trong `.setest/chua3d-build` (ignored), không sửa nguồn build gốc. Ghi `tam-so-test.html` từ single-file build; bản này chứa JS/CSS, ảnh của các chức năng cũ vẫn cần thư mục tài nguyên như trước.

Nguồn mới: `src/data/templeWorld.js`, `src/components/templeWorldScene.js`, `src/components/TempleWorld.jsx`, `src/pages/DiChua.jsx`, `src/styles/temple-world.css`. Màn ảnh cũ giữ tại `src/pages/DiChuaClassic.jsx`.
