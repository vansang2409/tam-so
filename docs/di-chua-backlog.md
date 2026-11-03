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
| DC-A09 | P1 | Todo | Bóng tiếp xúc: giảm cảm giác chân/cột lơ lửng bằng thử nghiệm có đối chứng; không đưa lại bias thấp đã gây sọc sân trong run01. Kiểm gần/toàn cảnh/nội điện, standard/low và chi phí. |

## Việc kế sau release 4.10.0

- DC-A10 — Audit chi tiết23 khu: đã xem ảnh thực, kiểm source/529 tuyến/18 nội thất và sửa finding trong lượt; xem `di-chua-detail-audit-2026-11-03.md`. Đây là audit hữu hạn, không phải chứng nhận mọi chi tiết hoàn hảo.
- DC-A11 (P1, Todo): làm mẫu PBR một cụm cổng. Atlas hiện nhòe khi gần, roughness các bề mặt còn tương tự. Cần phân vùng vữa/gỗ/ngói/đá, tỷ lệ texture theo mét; ảnh cùng camera/ánh sáng, đo texture memory/draw calls. Không tăng texture hoặc chia material toàn chùa một lần.
- DC-A12 (P1, Todo): tái tạo vùng vai–nách/skin weights, silhouette tay/quần và đầu/tóc có chọn lọc; nam/nữ đứng/đi/quỳ phải giữ khớp, sàn và sharing tài nguyên. Chưa có model áo lam miễn phí phù hợp được xác minh để thay trực tiếp.
- DC-A13 (P2, Todo): 2–3 biến thể lá sen cong/nụ/hoa nở thay silhouette lặp; giữ sửa nước/cao độ và geometry dùng chung. Đo overdraw/tam giác trước khi nhân rộng.
- Texture ứng viên cho nghiên cứu A11: Poly Haven có [license CC0](https://polyhaven.com/license); [Painted Plaster Wall](https://polyhaven.com/a/painted_plaster_wall), [Floor Tiles 06](https://polyhaven.com/a/floor_tiles_06). Chưa chọn hoặc tải; không coi ảnh nguồn là asset đã tích hợp.

## Nhật ký lượt

- 03/11/2026 — Thiết lập team và backlog. Scheduler xác nhận heartbeat `t-m-s-team-ph-t-tri-n-i-ch-a` ACTIVE mỗi 4 giờ, gắn chat hiện tại; đã đọc lại trạng thái cấu hình. Reviewer độc lập tìm hai điểm P2 (điều kiện Done khi thiếu QA và quyền presence thử), đã bổ sung quy định xử lý. `git diff --check` đạt; không đổi runtime nên không chạy lại test/build trong bước cấu hình. Các mục sản phẩm vẫn Todo; chưa có bằng chứng lượt định kỳ đầu đã chạy. Không commit/push/deploy, giữ nguyên thay đổi local có sẵn.

- 03/11/2026 — Đã chạy đợt 01 ngay theo lệnh bắt đầu: baseline A01 và cân sáng A04 nghiệm thu, 493 test/build đạt, reviewer độc lập không có finding chặn. Bóng tiếp xúc chưa giải quyết (A09). Chi tiết và giới hạn: `docs/di-chua-team-run-2026-11-03-01.md`. Việc kế A02; online tiếp tục ở A05/A06, chưa gắn Done.


- 04/11/2026 — Lát cắt 4.10.0: A02 đồ lam/trim tiếp xúc/morph, A03 bàn lễ và chi tiết cơ học, A05/A06 presence đã có source/mock và hai phiên QA riêng live; rename/appearance/thiền/lạy, join→leave→join và cleanup quan sát được. Reconnect/malformed/stale packet kiểm bằng mock, chưa ngắt mạng thực. A08 ảnh standard/low và budget instancing đạt. A07 chưa gắn Done cho toàn bộ gesture/thiết bị thật; Chrome viewport390×844/844×390 đã kiểm thành công sau khi IAB override không áp dụng. A09 vẫn mở; không tuyên bố bóng tiếp xúc/photorealism đã giải quyết. Bản chốt/release theo quyền một lần ở release doc, không mở quyền deploy định kỳ cho heartbeat.
