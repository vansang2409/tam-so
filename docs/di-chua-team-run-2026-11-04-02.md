# DC-A11 — nghiên cứu mẫu vật liệu cổng, 04/11/2026

## Phạm vi và baseline

Lượt heartbeat sau release4.10.0, HEAD715cd9e. Working tree sạch khi bắt đầu. Đọc checkpoint release: commit/push và Vercel production đã xác minh ở lượt trước; shutdown thường đã được hệ điều hành chấp nhận, chưa quan sát máy tắt. Không lặp release/shutdown. GitHub Pages chưa chạy do billing tài khoản, không sửa cấu hình để né giới hạn đó.

Chọn nghiên cứu nguồn cho DC-A11: xác định cách tách vật liệu cổng mà không phá atlas hay tăng draw calls toàn chùa. Không thay runtime, không tải asset, không gọi dịch vụ trả phí.

## Bằng chứng source

- `public/dichua/models/gate.glb`: một mesh `tamquan2`, một primitive, một material. Attributes POSITION/TEXCOORD_0, không có semantic group gỗ/ngói/vữa/đá. Loader hiện tự tính normal khi thiếu.
- Material gốc: baseColorTexture index0, roughnessFactor0.85, metallicFactor0. Không có roughness/normal/AO map. Atlas WebP nhúng1024×1024 RGB,193836byte; GLB431584byte,34077triangles theo manifest.
- `templeModels.js` không remap material kiến trúc; `templeMaterials.js` tạo procedural PBR cho mesh dựng, không áp vào shell GLB. Sửa helper procedural sẽ không tự chữa atlas cổng.
- Three hiện cài lấy roughness từ kênhG và nhân roughnessFactor (`roughnessmap_fragment.glsl.js`). Không suy đoán roughness theo màu albedo vì bóng/độ bẩn đã nằm trong ảnh.

## Quyết định kỹ thuật

Chưa thay atlas màu hoặc tách geometry theo độ cao. Mẫu kế tiếp chỉ áp cổng: cần kiểm UV islands và gán mask vùng thủ công có bằng chứng bề mặt. Dùng roughness map cùng UV để giữ một material/primitive; giữ factor1 nếu map chứa roughness tuyệt đối. Mask cần phân biệt được gỗ/ngói/vữa/đá và chừa vùng không chắc chắn ở roughness nền0.85. Không làm classifier màu tự động.

Một island có nhiều vùng chất liệu vẫn có thể vẽ map riêng từng vùng. Chỉ khi cùng texel/vùng UV bị chồng hoặc tái sử dụng bởi các face cần roughness khác nhau thì mask cùng UV không phân biệt được: kiểm trường hợp đó trước khi chọn map-only; nếu có xung đột thì cần mapping/material group có tác giả. Không kéo texture lặp tùy ý lên atlas. Mọi mask mới phải có ghi công nguồn/chuyển đổi và cleanup tài nguyên; không sửa GLB gốc/checksum để che thay đổi.

## Nghiệm thu phần triển khai còn thiếu

1. Preview mask trên cổng thật, chỉ ra vùng gỗ/ngói/vữa/đá; kiểm cả mặt trước/sau, kiểm UV overlap/tái sử dụng texel, không tô sai vùng dùng chung UV.
2. Ảnh trước/sau cùng camera, ánh sáng và quality, cổng toàn cảnh và gần; standard/low. Không gọi test pass là photorealism.
3. Giữ một primitive/material và không tăng draw calls do phân vùng. Đo texture upload/mip/draw calls thực trước/sau; không suy số runtime từ kích thước WebP.
4. Kiểm loader/fallback/dispose, màu atlas giữ đúng, lối đi/camera/nhân vật không đổi. Chạy test/build khi có runtime; reviewer độc lập đọc diff và ảnh.

Trạng thái DC-A11 vẫn Doing: mới chốt source audit và hướng triển khai, chưa có mask, code PBR mới hoặc ảnh so sánh. Không có thay đổi production trong lượt này.


## Review và kiểm tra

Reviewer độc lập release_review xác nhận metadata/source; bắt một kết luận quá chặt về UV island. Đã sửa: nhiều chất liệu trên cùng island vẫn vẽ map được; chỉ texel overlap/reuse với yêu cầu khác nhau mới xung đột. Không tuyên bố đã kiểm semantic UV. Evidence riêng `.setest/di-chua-team/2026-11-04-02/gate-source-audit.json`. `git diff --check` đạt. Không chạy lại npm test/build vì lượt này chỉ sửa tài liệu, runtime/asset không đổi; chưa visual QA. Không commit/push/deploy. Việc kế: preview UV overlap và author mask cổng có đối chứng, giữ DC-A11 Doing.
