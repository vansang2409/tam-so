# Bộ tượng quét — v4.7.0

- 9 mẫu bổ sung, tổng bộ 11 GLB khoảng 28,58 MB. Mỗi mẫu bổ sung 1,53–4,14 MB; tải theo điện, không preload toàn bộ bộ tượng. GLB đầu vào gốc chỉ nằm trong .setest/raw-sculptures (ignored).
- Nguồn sơ cấp: metadata Sketchfab của Cleveland Museum of Art, Minneapolis Institute of Art và St. Cloud State University Archives; bản GLB công khai từ Artheon. Nguồn, SHA-256 và giấy phép chính xác của từng tệp ở public/dichua/models/manifest.json; ghi công trong UI và ATTRIBUTION.md. CC BY-SA chỉ áp lên mẫu/bản chuyển đổi tương ứng; các mẫu đó tiếp tục phân phối CC BY-SA, có link tải trong UI.
- Mẫu tiên nhân/Zuishin/Bishamonten được sử dụng làm phỏng tác trong chùa hư cấu. Không nhận là bản quét đúng các tôn tượng Ngọc Hoàng/Thập Điện/Thành Hoàng Việt Nam. Giữ danh tính tác phẩm gốc trong ghi công.
- Xuất lại: node scripts/prepare-temple-sculptures.mjs. Script đọc scripts/temple-sculpture-sources.json, tải GLB công khai nếu chưa có cache, đóng skin/khung xương thành tư thế tĩnh, hàn vị trí/UV, giảm lưới bằng MeshoptSimplifier có sẵn trong Three. Giữ texture màu gốc, bỏ normal/specular/occlusion map phụ, xuất GLB + manifest + dữ liệu ghi công UI. Bộ Thập Điện dùng khoảng 14k tam giác/mẫu vì nhiều tượng nhỏ cùng xuất hiện; các mẫu còn lại khoảng 50–76k tam giác.
- Texture màu gốc được giữ trong tệp; khi tải vào cảnh được giới hạn cạnh tối đa 1024px trên GPU. Geometry, material và texture dùng chung giữa các bản đặt; giải phóng theo vòng đời cảnh. Các mẫu được tạo mesh tĩnh nên không cần runtime skeleton/animation.
- Kiểm tra: node tests/run.mjs giải mã hình học 11 GLB, kiểm atlas trong binary, normal hữu hạn, kích thước, SHA/giấy phép, tải lỗi và đóng cảnh; dựng đủ 18 nội thất và 529 tuyến giữa 23 khu. Browser QA và trạng thái phát hành ghi trong docs/chua-3d-validation.md.

## Model kiến trúc và nhân vật (03/11/2026)

Ngoài 11 mẫu tượng, ứng dụng có 8 GLB kiến trúc của Kent Juno (CC BY 4.0) và 2 model nền nam/nữ trẻ của Grab3D (CC0). Nguồn, giấy phép, checksum, tam giác và thay đổi nằm trong `public/dichua/models/detail-manifest.json`; ghi công công khai trong `ATTRIBUTION.md` và hộp thoại Ghi công 3D. Các model là tài nguyên tạo bằng AI, không tuyên bố là quét di sản hoặc phục dựng chuẩn lịch sử.

Hai model người được giảm lưới, nén Meshopt và texture WebP 1024 bằng glTF Transform CLI 4.5.1. Khi chạy, `templeVisitorClothing.js` giữ mặt/tóc/cổ/tay và dựng bộ đồ lam skinned riêng. Có chọn Nam trẻ/Nữ trẻ trong Tuỳ chọn → Chọn nhân vật; lưu local và đồng bộ appearance qua phòng chung.

Kiểm tra: `node scripts/fetch-temple-detail-models.mjs --check`. Khôi phục tệp thiếu: `node scripts/fetch-temple-detail-models.mjs`. Tái dựng bản tối ưu: thêm `--rebuild`. Script kiểm hash nguồn trước khi tối ưu, từ chối output không khớp manifest; không thêm dependency vào package.json. `npm test` kiểm cả hai nhân vật, trang phục và đổi mẫu.
