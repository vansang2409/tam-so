# DC-A11 — audit UV thật của cổng, 04/11/2026

Tiếp checkpoint02, không lặp nghiên cứu metadata hoặc mục Done. HEAD715cd9e; khi bắt đầu có sẵn backlog sửa local và checkpoint02 chưa commit, đã bảo toàn. Phạm vi lượt này: thực hiện kiểm giao tam giác UV và tạo dữ liệu cho author roughness mask. Không sửa runtime/model, không tải asset, không commit/push/deploy hoặc lặp shutdown.

## Tiêu chí và cách kiểm

Giải GLB bằng GLTFLoader/MeshoptDecoder hiện cài, bỏ image/material chỉ trong bản sao bộ nhớ để đọc geometry ở Node; giữ nguyên file gốc. Dùng broadphase64×64 ô, dedup cặp, giao tam giác bằng clipping polygon với winding hai chiều. Chỉ tính diện tích giao lớn hơn1e-12 theo tọa độ UV; chung cạnh/đỉnh không tính. Đây không phải phép lấy mẫu pixel-center.

Diagnostic riêng: `.setest/di-chua-team/2026-11-04-03/audit-gate-uv.mjs`; kết quả `gate-uv-overlap.json`, wireframe `gate-uv-wireframe.svg`, atlas nhúng trích nguyên byte `gate-atlas-original.webp`. Không đưa những artifact này vào Git. Atlas gốc đã được xem: nhiều mảnh nhỏ xoay khác nhau và màu/độ tối đã bake; không thể dùng vùng màu đơn giản làm nhãn vật liệu đáng tin.

## Kết quả chạy thật

-34077 tam giác, UV đều trong0..1; hash GLB `ffa4fbdabf45db7dee76018056f841ef90b53e705b7e776aa7a6f99382e22cde` khớp manifest.
-35 tam giác có diện tích UV≤1e-12, cả35 vẫn có diện tích3D mesh-local>1e-12. Không gọi đây là35 lỗi visual đã tái hiện.
-841097 cặp ứng viên được kiểm;1727 cặp có diện tích giao dương trên ngưỡng. Tổng diện tích giao từng cặp0.0013170373792782404, KHÔNG phải diện tích union hay tỷ lệ chất liệu xung đột.
-Quy đổi diện tích giao ra atlas1024:1527 cặp>0.01 texel²,304 cặp>1 texel²,19 cặp>10 texel². Đây là diện tích hình học liên tục, không phải số pixel raster đếm được.
-Lưu30 cặp giao lớn nhất, kèm UV, tọa độ đỉnh mesh-local và tỷ lệ giao so tam giác nhỏ hơn để truy vết. Tọa độ này chưa phải vị trí cổng đã fit trong sân.

## Quyết định

Không giả định atlas hoàn toàn không chồng. Trước khi vẽ mask, author phải đối chiếu các cặp lớn nhất trên cổng3D, xác định chúng có cần roughness khác nhau hay không, và kiểm vùng35 mặt UV suy biến. Overlap hình học chưa chứng minh khác chất liệu; chưa loại map-only chỉ vì có overlap. Vùng không xác minh giữ roughness0.85. Cần xét cả padding/linear filtering/mipmap, không chỉ diện tích giao trực tiếp.

Không phát hành mask suy từ màu albedo hoặc thay roughness toàn bộ cổng một giá trị để nhận là PBR phân vùng. A11 vẫn Doing, còn semantic authoring và ảnh trước/sau cùng camera, standard/low và đo chi phí thực.

## Test/review

Diagnostic có assert case trùng hoàn toàn, không giao, chung cạnh, chứa bên trong và đảo winding; chạy thành công. Reviewer độc lập kiểm clipping/broadphase và thêm10000 cặp ngẫu nhiên kiểm đối xứng/giới hạn diện tích; không phát hiện bug chặn audit. Finding nhãn tọa độ đã sửa thành mesh-local; đã tính thêm diện tích3D cho UV suy biến và chạy lại report. Không dùng kết quả đó để nghiệm thu hình ảnh.

Không chạy lại npm test/build vì runtime/asset không đổi, chỉ diagnostic riêng và tài liệu. Kiểm diff/status cuối; không có thay đổi hosted. Việc kế: truy vết19 cặp lớn trên model3D và author mẫu mask có kiểm UV reuse, rồi mới tích hợp loader và visual QA.
