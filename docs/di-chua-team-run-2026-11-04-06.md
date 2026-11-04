# A09 — thử độ lọc bóng có đối chứng, 04/11/2026

Tiếp sau lát cắt hồ sen05, chọn thử nghiệm nhỏ trước khi thêm pass/texture/decal contact shadow. Không phát hành hoặc mua dịch vụ. Root writer/browser, release_review read-only.

## Điều đã xác minh và điều chưa chắc

Source: PCFShadowMap2048 phủ76 đơn vị, tương đương0.037109m/texel trong light-space, KHÔNG phải độ phân giải mặt đất mọi góc. normalBias.055 và bias-.00025, radius3; low tắt shadow map. Tài liệu run01 ghi thử hạ bias gây sọc và đã rollback; không tái hiện lỗi sọc cũ trong lượt này. Normal offset, độ phủ map và filter có thể làm contact nhạt/tách, nhưng chưa chứng minh root cause; còn cần đo đế giày đã pose với mặt sàn thật.

## Thử nghiệm

Chỉ đổi radius3→1.5, giữ bias/frustum/map/lights/geometry. Thêm cameraPosition/quaternion/FOV vào dữ liệu DEV cạnh render counters: quaternion phản ánh hướng nhìn thật; không nhầm controls.target vốn có thể không dùng trong nội điện. Không có thay đổi UI hoặc production diagnostics.

Camera được tái tạo qua nút Góc1→Góc3 sau tới vườn; đợi DOM renderer đạt vị trí tính từ thirdPersonPose rồi lấy ảnh. Hai mẫu khớp camera12.5500,4.8025,20.8090; quaternion-.2377,0,0,.9713;FOV66;female đứng12,16;viewport1920×855. Không dùng các ảnh A13 gần lệch camera làm bằng chứng cho thử này.

Evidence riêng thư mục05: `shadow-radius3.png/json`, `shadow-radius1p5.png/json`. Cả hai371calls/1624978tri/699geometry/78texture. Không coi số FPS khác nhau là thay đổi hiệu năng; số mẫu shader không giảm theo radius.

## Kết quả và quyết định

Bóng cây sắc hơn, nhưng root/reviewer đều chưa thấy lợi ích tiếp xúc chân thuyết phục ở scale đã kiểm. Không thấy sọc mới rõ trong ảnh tĩnh, chưa loại aliasing khi di chuyển hoặc nghiệm thu nội điện. Loại candidate, khôi phục radius3; bias/normalBias/ánh sáng giữ nguyên. Không thêm blob shadow giả hoặc gọi đây là root fix.

A09 vẫn Doing. Giữ telemetry DEV để QA sau đáng tin hơn. Việc kế: đo sole/floor gap trên mesh posed, thử giải pháp contact có điều kiện mặt nhận phù hợp nếu cần; cần cả chân người/chân cột/sân/nội điện, standard/low và góc chuyển động. Không suy photorealism từ test pass.

Source cuối chỉ giữ thay đổi A13 và telemetry DEV; kiểm full test/build cuối được ghi ở handoff lượt này. Không commit/push/deploy hoặc lặp shutdown.
