# Đi Chùa — đợt tự động đầu tiên, 03/11/2026

## Kết quả

Hoàn thành baseline DC-A01 và một lát cắt cân sáng DC-A04. Source thay đổi trong lượt này chỉ ở `src/components/TempleWorld.jsx`: HemisphereLight 1.65 → 0.9 và fill directional 0.65 → 0.35. Giữ sun, exposure, environment, shadow map và bias cuối cùng như trước. Thêm telemetry DEV về bật/tắt shadow và số geometry/texture đang được renderer quản lý. Không thay asset, nhân vật, giao thức online hoặc database.

Mức cải thiện quan sát được là nhẹ: vùng dưới mái và chi tiết áo/cổng bớt sáng đều. Không coi đây là photorealism hay đã sửa bóng tiếp xúc.

## Baseline và vấn đề ưu tiên

Ảnh chạy thật trong `.setest/di-chua-team/2026-11-03-run01/` (ignored):

- `gate-before.png`, `gate-final.png`: sân/cổng và toàn cảnh.
- `male-close-before.png`, `male-close-final.png`: góc gần tương ứng, cùng chuỗi thao tác camera.
- `female-close-final.png`, `mobile-gate-final.png`: avatar nữ, desktop và mobile viewport 390×844.
- `hall-before.png`, `hall-final.png`, `female-meditating-final.png`, `female-prayer-final.png`: nội điện, thiền và bắt đầu lễ. Ảnh hall trước/sau khác avatar; không coi đó là phép so chi phí nhân vật.

Ba vấn đề nhìn thấy từ baseline:

1. Chân người và chân cột thiếu bóng tiếp xúc rõ, tạo cảm giác đặt mô hình lên nền. Audit source thấy normal bias 0.055 m trên map rộng 76 m/2048 texel; đây là yếu tố có thể góp phần, chưa chứng minh là nguyên nhân duy nhất. Thử giảm normal/depth bias gây sọc self-shadow trên sân; đã loại toàn bộ thử nghiệm bias và giữ cấu hình cũ. Các file `*-after.png` là ảnh thử bị loại, không phải bản nghiệm thu; chỉ `*-final.png` là bản cuối.
2. Ánh sáng nền và fill mạnh làm các vùng dưới mái, nếp áo và chi tiết kiến trúc sáng khá đều. Lượt này giảm hai nguồn fill, giữ hướng/năng lượng nguồn sáng chính. Không thêm shadow pass hoặc postprocessing.
3. Tán cây còn lộ các mặt lá phẳng và silhouette thưa/rời; áo vẫn có silhouette procedural và nếp lặp. Đây là giới hạn tiếp theo cần xử lý bằng nghiên cứu asset/cấu tạo, không tăng bloom để che.

## Số liệu thực đo khả dụng

Snapshot DEV từ DOM sau render, không phải benchmark FPS hoặc GPU memory:

| Ngữ cảnh | Draw calls | Triangles | Geometry | Texture |
|---|---:|---:|---:|---:|
| Cổng ban đầu, góc rộng nam, 1 peer hiển thị | 303 | 1,781,352 | chưa có telemetry | chưa có telemetry |
| Góc gần nữ, standard, 1 peer hiển thị | 182 | 1,441,974 | 648 | 79 |
| Cùng góc nữ, low, 1 peer hiển thị | 54 | 576,351 | 648 | 79 |
| Mobile viewport nữ 390×844, standard | 172 | 1,246,678 | 648 | 79 |
| Chánh Điện nữ, standard, 0 peer hiển thị | 333 | 2,232,047 | 779 | 88 |

Đây là snapshot có frustum, shadow pass, lazy-loaded interior và trạng thái peer khác nhau; không suy ra trước/sau đã tối ưu hiệu năng. Geometry/texture là số tài nguyên renderer đang quản lý, không phải byte VRAM. Tổng asset trên đĩa 21 GLB = 34,910,440 byte; không phải dung lượng tải ban đầu. Chưa đo FPS/frame time/thời gian tải/bộ nhớ GPU hoặc điện thoại thật. Không tăng asset, geometry, texture hoặc số nguồn sáng trong lượt này.

## QA và review

- `npm test`: 493 pass/0 fail cùng checks import: 529 tuyến, 408 góc camera, 241 khung rig; hai avatar với 150 khung đứng/thiền/lạy và 160 khung Walk, model/license/checksum và presence regression đạt.
- `npm run build`: thành công, 553 modules; prerender bỏ qua do base tương đối theo cấu hình hiện có.
- Browser: cổng góc rộng/gần nam và nữ; nữ đi vào Chánh Điện, đứng/thiền/bắt đầu lễ; standard ↔ low xác nhận `data-shadows` true/false; mobile viewport 390×844 không tràn ngang (scrollWidth=390). Đã reset viewport.
- Console error được đọc cuối luồng vào Chánh Điện: 0. Không thay đổi lựa chọn reduced-motion của hệ điều hành; regression rig reduced-motion nằm trong bộ test.
- Reviewer độc lập đọc source và ảnh trước/sau, mobile và nội điện: không có finding chặn; xác nhận lợi ích nhẹ, không gọi là sửa contact shadow. Reviewer lưu ý peer/avatar khác nhau làm số draw/triangle không thể so như benchmark, đã ghi rõ ở trên.
- Không kiểm live online hai phiên trong đợt này và không tuyên bố phát triển online đã hoàn tất. Không dùng khách thật làm fixture. Luồng online có regression mock tự động đạt.
- Self-review giữ nguyên mọi thay đổi local có trước; không commit/push/deploy. `git diff --check` đạt, chỉ có cảnh báo chuẩn hóa CRLF của các file có sẵn.

## Bước tiếp

Ưu tiên DC-A02: nghiên cứu và cải thiện silhouette/cấu tạo áo lam, tránh tiếp tục tăng gợn lặp. Tiếp đó DC-A03 hoặc DC-A08 cho kiến trúc/tán cây; DC-A09 giải bóng tiếp xúc bằng thử nghiệm có đối chứng, không giảm bias mù. DC-A05 audit online trước khi phát triển mới; dùng mock/local hoặc phòng thử cô lập cho QA hai phiên. Không mở rộng quyền deploy/hosted mutation.
