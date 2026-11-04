# Backlog chủ động Đi Chùa

Nguồn điều phối ưu tiên cho Đi Chùa từ 03/11/2026. TASK_BOARD.md vẫn giữ lịch sử toàn sản phẩm. Không làm lại mục Done chỉ vì tài liệu cũ có Todo; xác minh source trước.

| ID | Ưu tiên | Trạng thái | Lát cắt và nghiệm thu |
|---|---|---|---|
| DC-A01 | P0 | Done | Lập baseline hình ảnh thật và chi phí render: cổng/sân/Chánh Điện, nam/nữ, gần/toàn cảnh, mobile viewport. Ghi tối thiểu 3 vấn đề chân thực nhìn thấy được và chọn vấn đề tác động cao; đo số liệu khả dụng, đánh dấu phần chưa đo. |
| DC-A02 | P1 | Done (lát cắt 4.10.0) | Cải thiện một vấn đề lớn nhất về silhouette, tỷ lệ hoặc nếp rủ đồ lam từ A01. Ảnh trước/sau cùng góc; cả hai avatar đứng/đi/thiền/lạy; không xuyên sàn/đứt khớp/nứt đường nối; review độc lập. Nếu model hiện tại là giới hạn, nghiên cứu model có giấy phép, không chỉ thêm gợn procedural. |
| DC-A03 | P1 | Done (lát cắt 4.10.0) | Cải thiện một cụm kiến trúc Việt Nam nhìn rõ: tỷ lệ mái/cột/ngói/đế và chuyển tiếp sân-điện; có nguồn tham khảo, ảnh so sánh, không phá đường đi/camera/interior, giữ attribution. |
| DC-A04 | P1 | Done (cân fill đợt 1) | Vật liệu và ánh sáng: xử lý một lỗi nhựa/phẳng/lặp texture hoặc thiếu bóng tiếp xúc được chỉ ra từ A01; kiểm chế độ nhẹ, đo chi phí so baseline; không chỉ tăng bloom. |
| DC-A05 | P1 | Done (lát cắt 4.10.0) | Audit Đi Chùa online thực tế: trace presence từ hook tới transport và avatar; kiểm hai phiên, join/leave, đồng bộ mẫu/tư thế, reconnect. Chọn và sửa lỗi thật nếu có; không thêm chat hoặc dữ liệu riêng tư mặc định. |
| DC-A06 | P2 | Done (lát cắt 4.10.0) | Từ audit A05, chọn một cải tiến online cho cảm giác cùng hiện diện yên tĩnh: mượt di chuyển/đổi tư thế, tránh chồng người hoặc trạng thái kết nối dễ hiểu. Nghiên cứu và xác định tiêu chí trước khi code; hai phiên xác minh và cleanup. |
| DC-A07 | P2 | Doing — responsive đã kiểm, chờ thiết bị cảm ứng thật | Mobile/loading: kiểm thao tác chạm, camera, tải model chậm/lỗi, chọn nhân vật và nghi thức. Sửa vấn đề tái hiện được, không redesign toàn HUD. |
| DC-A08 | P2 | Done (lát cắt 4.10.0) | Tán cây: xử lý silhouette và các mặt lá phẳng lộ rõ từ baseline A01; so cùng góc, giữ instancing và kiểm chi phí render. |
| DC-A09 | P1 | Doing — thử radius đã loại, chờ giải pháp contact | Bóng tiếp xúc: giảm cảm giác chân/cột lơ lửng bằng thử nghiệm có đối chứng; không đưa lại bias thấp đã gây sọc sân trong run01. Kiểm gần/toàn cảnh/nội điện, standard/low và chi phí. |

## Việc kế sau release 4.10.0

**Mục tiêu nhân vật do chủ dự án đặt:** lấy nhân vật PUBG làm mốc tham khảo về tỷ lệ người thật, mặt/mắt/tóc/da, trang phục và chuyển động tự nhiên trong giới hạn web. Mẫu nữ v1 đã bị chủ dự án bác bỏ về ngoại hình; không nghiệm thu bằng test pass hoặc chỉ so là đỡ hơn bản cũ. Ảnh crop toàn thân gần, cùng góc, phải đủ thuyết phục trước khi báo đạt. Không sao chép/rip asset PUBG.

- DC-A14 (P0, Doing — humanV10 chạy local, chưa nghiệm thu PUBG): mẫu Grab3D nữ v1 bị bác bỏ, giữ làm đối chiếu. Nữ mới dùng MakeHuman/selected assets CC0, áo/quần authoring, tóc bob, rig53joints/ngón, blink và nét miệng khép dịu nhẹ; Walk/Idle CMU có custom terms riêng. Nguồn/build ở `assets-src/temple/README.md`, public`visitor-female-human.glb/.json`2.394MB. V10 kế thừa cuff/tàáo/quầnV8, V9vá nách với oracle24/24Idle-Walk sau khi V8lộ19/24; pose thiền/bàn tay/thumb/contact và Idle dịu/lệch pha đã kiểm. Test/build211routes và review độc lập đạt trong phạm vi. Browser2phiên cô lập kiểm remote/đi/thiền/lạy/standard-low/Chánh Điện/leaveTTL/404fallback; viewport390×844/844×390 là desktopemulation. Còn nếp quần nhọn, mặt/tóc/vải chưa đủ thật và thiếu QA thiết bị thực; giữ Doing. Hướng tiếp: đánh giá một Rocketboxhead có map thật, MITnotice đúng, rig/style/material cần chuyển riêng; candidate riêng chưa tích hợp. Chi tiết/giới hạn/checksum ở `di-chua-team-run-2026-11-04-08.md`, nghiên cứu ở `di-chua-character-research-2026-11-04.md`. Ưu tiên trước A09/A11/cảnh quan.

- DC-A10 — Audit chi tiết23 khu: đã xem ảnh thực, kiểm source/529 tuyến/18 nội thất và sửa finding trong lượt; xem `di-chua-detail-audit-2026-11-03.md`. Đây là audit hữu hạn, không phải chứng nhận mọi chi tiết hoàn hảo.
- DC-A11 (P1, Doing — UV overlap đã kiểm 04/11, chờ mask/visual QA): làm mẫu PBR một cụm cổng. Atlas hiện nhòe khi gần, roughness các bề mặt còn tương tự. Cần phân vùng vữa/gỗ/ngói/đá, tỷ lệ texture theo mét; ảnh cùng camera/ánh sáng, đo texture memory/draw calls. Không tăng texture hoặc chia material toàn chùa một lần.
- DC-A12 (P1, Done — lát cắt local 04/11/2026): nối topology vai–nách/tay, chỉnh weights, dáng/cuff/cổ áo, nếp tay/quần, giày theo trục bàn chân và tư thế thiền/lạy cho nam/nữ; giữ model mặt/tóc nguồn, chỉnh vật liệu. Test/build, ảnh nhiều tư thế, chế độ nhẹ/reduced-motion, tải lỗi và review độc lập đạt trong phạm vi đã kiểm. Chưa deploy, chưa làm model mặt/tóc riêng; xem `di-chua-avatar-upgrade-2026-11-04.md`.
- DC-A13 (P2, Done — lát cắt local lá/nụ 04/11): 2–3 biến thể lá sen cong/nụ/hoa nở thay silhouette lặp; giữ sửa nước/cao độ và geometry dùng chung. Đo overdraw/tam giác trước khi nhân rộng.
- Texture ứng viên cho nghiên cứu A11: Poly Haven có [license CC0](https://polyhaven.com/license); [Painted Plaster Wall](https://polyhaven.com/a/painted_plaster_wall), [Floor Tiles 06](https://polyhaven.com/a/floor_tiles_06). Chưa chọn hoặc tải; không coi ảnh nguồn là asset đã tích hợp.

## Nhật ký lượt

- 03/11/2026 — Thiết lập team và backlog. Scheduler xác nhận heartbeat `t-m-s-team-ph-t-tri-n-i-ch-a` ACTIVE mỗi 4 giờ, gắn chat hiện tại; đã đọc lại trạng thái cấu hình. Reviewer độc lập tìm hai điểm P2 (điều kiện Done khi thiếu QA và quyền presence thử), đã bổ sung quy định xử lý. `git diff --check` đạt; không đổi runtime nên không chạy lại test/build trong bước cấu hình. Các mục sản phẩm vẫn Todo; chưa có bằng chứng lượt định kỳ đầu đã chạy. Không commit/push/deploy, giữ nguyên thay đổi local có sẵn.

- 03/11/2026 — Đã chạy đợt 01 ngay theo lệnh bắt đầu: baseline A01 và cân sáng A04 nghiệm thu, 493 test/build đạt, reviewer độc lập không có finding chặn. Bóng tiếp xúc chưa giải quyết (A09). Chi tiết và giới hạn: `docs/di-chua-team-run-2026-11-03-01.md`. Việc kế A02; online tiếp tục ở A05/A06, chưa gắn Done.


- 04/11/2026 — Lát cắt 4.10.0: A02 đồ lam/trim tiếp xúc/morph, A03 bàn lễ và chi tiết cơ học, A05/A06 presence đã có source/mock và hai phiên QA riêng live; rename/appearance/thiền/lạy, join→leave→join và cleanup quan sát được. Reconnect/malformed/stale packet kiểm bằng mock, chưa ngắt mạng thực. A08 ảnh standard/low và budget instancing đạt. A07 chưa gắn Done cho toàn bộ gesture/thiết bị thật; Chrome viewport390×844/844×390 đã kiểm thành công sau khi IAB override không áp dụng. A09 vẫn mở; không tuyên bố bóng tiếp xúc/photorealism đã giải quyết. Bản chốt/release theo quyền một lần ở release doc, không mở quyền deploy định kỳ cho heartbeat.

- 04/11/2026 — Theo phản hồi nhân vật còn xấu, hoàn thành lát cắt A12 local trên baseline `715cd9e`. Dựng áo liền nách, sửa giày dựng đứng, cuff/cổ/nẹp và tư thế; giữ đầu/tóc CC0. Runner 493 pass/0 fail, build và diff-check đạt; review độc lập đã xử lý finding vật liệu nẹp. Ảnh trước/sau và QA ở `.setest/di-chua-team/avatar-upgrade-2026-11-04/`; chi tiết/nguồn/giới hạn ở `di-chua-avatar-upgrade-2026-11-04.md`. Không commit/push/deploy.

- 04/11/2026 — Heartbeat sau release: DC-A11 source audit cổng một primitive/material và atlas1024, chốt hướng mask roughness cùng UV có kiểm texel overlap. Reviewer sửa điều kiện island/overlap; chưa tạo mask/runtime/visual nên vẫn Doing. Xem `di-chua-team-run-2026-11-04-02.md`; không commit/push/deploy.

- 04/11/2026 — DC-A11 audit giao tam giác UV thật:1727 cặp trên ngưỡng1e-12,19 cặp>10 texel² ở atlas1024; không suy đây là semantic conflict hoặc union coverage. Có wireframe và30 cặp lớn nhất để author truy vết; source/GLB không đổi. Reviewer kiểm thuật toán, sửa nhãn mesh-local. Xem `di-chua-team-run-2026-11-04-03.md`; A11 vẫn Doing, chưa nghiệm thu PBR/visual.

- 04/11/2026 — Lượt04 chọn A13 lá sen: thay đĩa tròn phẳng bằng3 biến thể lá sen khum nhẹ/mép gợn, geometry dùng chung và giữ nước/collider. Tiêu chí: không notch kiểu lá súng, không lún nước, finite normals/bounds; ảnh cùng góc standard/low và đo chi phí, review độc lập. Chưa nghiệm thu nụ/hoa nở của toàn mục A13.

- 04/11/2026 — Lượt05 hoàn tất A13 trong phạm vi local:3 lá khum,5 nụ xen14 hoa; geometry tests, full493test/build, source và ảnh standard/low qua review độc lập. Calls377/183 không tăng; tam giác tăng1448standard/724low. Ảnh gần chỉ so định tính vì camera lệch nhẹ; đã sửa nhãn ảnh reset bị capture khung cũ. Chưa benchmark FPS/GPU/overdraw thực. Xem `di-chua-team-run-2026-11-04-05.md`; không commit/push/deploy.

- 04/11/2026 — A09 thử radius3→1.5 với camera position/quaternion/FOV trùng qua telemetry DEV. Reviewer xác nhận bóng cây sắc hơn nhưng chưa đủ lợi ích contact chân; đã loại candidate, trả radius3 và giữ nguyên bias/ánh sáng. Giữ camera telemetry DEV cho QA. A09 Doing; xem `di-chua-team-run-2026-11-04-06.md`.
