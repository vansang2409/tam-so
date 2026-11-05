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

- 05/11/2026 — DC-A14 tiếp tục từ V10. Đã kiểm GLB thử hai hướng mắt trong WebGL studio và dùng 12 mốc lưới thật để loại phép chiếu vật liệu Rocketbox toàn mặt theo điểm gần nhất. Thử riêng viền tóc và lưu ảnh cùng góc. Kết quả, giới hạn và bằng chứng ở `di-chua-team-run-2026-11-05-01.md`. Giữ Doing.

- 05/11/2026 — DC-A14: đã tích hợp clip Walk giảm trượt và làm mượt cổ chân trái trong GLB nữ cục bộ. Các ứng viên da/tóc vẫn tách riêng. Kiểm kỹ thuật, ảnh WebGL và giới hạn ở `di-chua-team-run-2026-11-05-02.md`. Mục tiêu ngoại hình vẫn Doing.

- 05/11/2026 — DC-A14: đã bổ sung khung cận thiền/lạy cho studio và xác định vết tối ở gối là mặt quần gập ngược tại các tia đã kiểm. Ba mẫu morph chưa qua nghiệm thu hình ảnh, giữ bản runtime trước. Xem `di-chua-team-run-2026-11-05-03.md`.

- 05/11/2026 — DC-A14: tích hợp cục bộ morph quần dành cho dáng thiền, giảm các mặt gập ngược tại hai vùng gối trong WebGL. Walk và rig giữ nguyên, kiểm kỹ thuật và review đạt trong phạm vi. Vòng nách áo ở dáng thiền và tóc vẫn cần cải thiện. Xem `di-chua-team-run-2026-11-05-04.md`.

- 05/11/2026 — DC-A14: tích hợp cục bộ shape áo khi thiền để làm dịu hai vết gập vòng nách. Kiểm WebGL, chế độ nhẹ, che phủ và chuyển tư thế. Tóc buộc thử cần atlas riêng. Xem `di-chua-team-run-2026-11-05-05.md`.

- 05/11/2026 — DC-A14: tích hợp chỉnh đuôi bob để tách khỏi cổ áo. Kiểm giao cắt trên 768 cặp khung Idle/Walk, ảnh WebGL cận/toàn thân và review đạt trong phạm vi. Atlas tóc buộc vẫn là mẫu thử. Xem `di-chua-team-run-2026-11-05-06.md`.

- 05/11/2026 — DC-A14: A/B roughness và relief da qua WebGL cho hiệu quả nhỏ, giữ da runtime hiện tại. Có ảnh tham chiếu ba góc cho tạo hình khuôn mặt và tóc. Xem `di-chua-team-run-2026-11-05-07.md`.

- 05/11/2026 — DC-A14: thử khối má trên 132 đỉnh và so sánh hai góc cận Blender. Giữ riêng vì mức cải thiện còn nhỏ. Xem di-chua-team-run-2026-11-05-08.md.

- 05/11/2026 — DC-A14: thử patch mí dưới trực tiếp trong GLB và kiểm hai góc cận. Giữ riêng vì góc nghiêng dễ đọc thành bọng mắt. Xem di-chua-team-run-2026-11-05-09.md.

- 05/11/2026 — DC-A14: thử hai độ vuốt tóc lệch, kiểm ảnh cận/toàn thân và 192 khung giao tóc/cổ áo cho từng bản. Giữ riêng do điểm nghi xuyên tai. Xem di-chua-team-run-2026-11-05-10.md.

- 05/11/2026 — DC-A14: xác định vệt da qua tia và thu hẹp vùng vuốt tóc lên thái dương cao. Bản thử hết hit da trong mẫu 25 tia, đang giữ riêng. Xem di-chua-team-run-2026-11-05-11.md.

- 05/11/2026 — DC-A14: tích hợp tóc lệch ngôi sau WebGL A/B và review, không tăng draw call; 493 test pass và build đạt. Xem di-chua-team-run-2026-11-05-12.md.

- 05/11/2026 — DC-A14: lập baseline giao cắt áo–quần khi cúi lạy. Nâng và xòe vạt thử giảm giao áo–quần nhưng tăng áo tự giao ở cúi sâu. Xem di-chua-team-run-2026-11-05-13.md.

- 05/11/2026 — DC-A14: WebGL màu chẩn đoán xác định vùng quần lộ khi cúi sâu. Tia với bounds skinned đã cập nhật xác định thứ tự các lớp. Xem di-chua-team-run-2026-11-05-14.md.

- 05/11/2026 — DC-A14: thử độ rủ vạt áo khi cúi sâu qua WebGL có đối chứng. Bản đưa vạt ra trước giảm vùng quần lộ ở góc trước nhưng vẫn có mép gấp ở góc bên. Xem di-chua-team-run-2026-11-05-15.md.

- 05/11/2026 — DC-A14: thử thư giãn lưới vạt áo và kiểm ảnh giữa pha cúi. Cạnh bớt gãy nhẹ nhưng vạt vẫn nhô, giữ prototype riêng. Xem di-chua-team-run-2026-11-05-16.md.

- 05/11/2026 — DC-A14: thử đổi hướng rủ bằng xoay vạt theo độ cúi. Vẫn thấy mép gấp hoặc giao cắt, giữ thử nghiệm riêng. Xem di-chua-team-run-2026-11-05-17.md.

- 05/11/2026 — DC-A14: thử nắn riêng quần ở hông khi cúi sâu. Cả mức nhẹ 4/3 mm cũng làm lộ da trong WebGL, giữ thử nghiệm riêng. Xem di-chua-team-run-2026-11-05-18.md.

- 05/11/2026 — DC-A14: chỉnh cặp da/quần trong preview khi cúi sâu, giảm quần lộ ở ROI trước và giữ che da ở ROI ngang. Chưa kiểm chuyển pha. Xem di-chua-team-run-2026-11-05-19.md.

- 05/11/2026 — DC-A14: kiểm mẫu chỉnh hông qua 13 mốc cúi/nâng, ba góc WebGL. Không thấy pixel quần chuyển thành màu da trong mẫu đo, vạt vẫn cuộn. Xem di-chua-team-run-2026-11-05-20.md.

- 05/11/2026 — DC-A14: thử hạ hông cuối động tác lạy. Bản nhẹ tăng giao áo–quần, giữ nguyên pose runtime. Xem di-chua-team-run-2026-11-05-21.md.

- 05/11/2026 — DC-A14: tích hợp giày xám than cho mẫu nữ, đối chiếu WebGL đứng/thiền/lạy, 493 test pass và build đạt. Xem di-chua-team-run-2026-11-05-23.md.

- 06/11/2026 — DC-A14: ưu tiên nam, mốc tối thiểu bằng mẫu nữ hiện hành. Sửa mép cổ mẫu nam hiện hành; ứng viên nam có rig riêng còn lỗi bind/che phủ trong WebGL. Xem di-chua-team-run-2026-11-06-01.md.

- 06/11/2026 — DC-A14: bake shape cơ thể và chỉnh weights phần đầu của mẫu nam V2; xác nhận WebGL bind/đứng hết lỗi lệch diện rộng. Chưa thay mẫu runtime. Xem di-chua-team-run-2026-11-06-02.md.

- 06/11/2026 — DC-A14: dựng cổ đứng, nẹp và khuy trên mẫu nam V3. WebGL xác nhận còn lỗi nẹp/che phủ khi thiền và lạy; giữ bản thử riêng. Xem di-chua-team-run-2026-11-06-03.md.

- 06/11/2026 — DC-A14: mẫu nam V5 che được mảng da đầu gối và giữ nẹp liền khi thiền. Còn cổ và độ che phủ ở cúi lạy. Xem di-chua-team-run-2026-11-06-04.md.

- 06/11/2026 — DC-A14: mẫu nam V6 che chỗ lộ ở đùi trên khi cúi. Còn điểm nhỏ ở nách và mép cổ, giữ prototype riêng. Xem di-chua-team-run-2026-11-06-05.md.

- 06/11/2026 — DC-A14: đối chiếu độ che nách nam bằng tia WebGL, loại V7/V8 vì vẫn lộ da khi cúi. Xem di-chua-team-run-2026-11-06-06.md và di-chua-team-run-2026-11-06-07.md.

- 06/11/2026 — DC-A14: V9 xử lý chấm da nách ở góc cúi đã kiểm, sáu tia chạm áo trước. Cổ vẫn cuộn, chưa tích hợp. Xem di-chua-team-run-2026-11-06-08.md.

- 06/11/2026 — DC-A14: thử gọn chân cổ nam V10/V11, điểm nách kiểm trước vẫn kín. Chưa tích hợp. Xem di-chua-team-run-2026-11-06-09.md.

- 06/11/2026 — DC-A14: V12 có Idle/Walk retarget sang rig nam, kiểm WebGL và lấy mẫu sàn bằng controller. Còn kiểm chân trụ, nối vòng và blink. Xem di-chua-team-run-2026-11-06-10.md.

- 06/11/2026 — DC-A14: V13 có morph mí/mi và bản WebP/meshopt riêng, kiểm WebGL cận và thiền. Chưa tích hợp. Xem di-chua-team-run-2026-11-06-11.md.

- 06/11/2026 — DC-A14: kiểm V13 tối ưu qua WebGL, hiệu chỉnh tốc độ clip nam giảm trượt trung vị khi đi thẳng. Chưa tích hợp. Xem di-chua-team-run-2026-11-06-12.md.

- 06/11/2026 — DC-A14: đưa nam V13 vào Đi Chùa local, kiểm tải mẫu thật, chuyển nam/nữ và fallback sai profile. 493 test pass và build đạt. Mốc nữ còn đang làm. Xem di-chua-team-run-2026-11-06-13.md.

- 06/11/2026 — DC-A14: V14 đổi tóc nam nâu trầm và giày xám than, tích hợp local sau WebGL A/B, review, 493 test và build. Xem di-chua-team-run-2026-11-06-14.md.

- 06/11/2026 — DC-A14: thử làm dịu gờ ngực V15/V16 trên nam. Bản thu vào làm lộ da; bản đẩy ra chưa cải thiện đủ, giữ V14. Xem di-chua-team-run-2026-11-06-15.md.

- 06/11/2026 — DC-A14: tích hợp V17 làm dịu gờ sáng ngực bằng pháp tuyến, giữ hình học. WebGL, review, 493 test và build đạt. Xem di-chua-team-run-2026-11-06-16.md.

- 06/11/2026 — DC-A14: so nam/nữ cùng camera, tích hợp V18 gọn cổ và đầu nẹp nam, 493 test pass/build đạt. Còn bo tay/lai và nếp đùi. Xem di-chua-team-run-2026-11-06-17.md.

- 06/11/2026 — DC-A14: tích hợp V19 gọn lai và bo tay nam, chạy lại 20 cặp nam/nữ; 493 test pass và build đạt. Xem di-chua-team-run-2026-11-06-18.md.

- 06/11/2026 — DC-A14: loại V20 normal-only vì khe gối khi thiền vẫn rõ; tia WebGL xác nhận nhiều lớp quần chồng tại đó. Xem di-chua-team-run-2026-11-06-19.md.

- 06/11/2026 — DC-A14: tích hợp V23 morph quần khi thiền sau ảnh hai góc, chín tia che phủ và kiểm reset qua tư thế. Xem di-chua-team-run-2026-11-06-20.md.

- 06/11/2026 — DC-A14: thử V24 làm dịu đùi khi thiền, WebGL chưa cho cải thiện đủ; giữ V23. Xem di-chua-team-run-2026-11-06-21.md.

- 06/11/2026 — DC-A14: thử hạ cổ V25, vẫn gập và lộ thêm cổ dưới mép khi cúi; giữ V23. Xem di-chua-team-run-2026-11-06-22.md.

- 06/11/2026 — DC-A14: thử mỏng chân cổ V26/V27, đã sửa đốm lộ da thử nghiệm nhưng mức cải thiện còn nhỏ; giữ V23. Xem di-chua-team-run-2026-11-06-23.md.

- 06/11/2026 — DC-A14: thử V28 đổi weights mép cổ; hiệu quả nhỏ, giữ V23. Xem di-chua-team-run-2026-11-06-24.md.

- 06/11/2026 — DC-A14: thử morph cổ riêng khi lạy V29, nếp cuộn vẫn rõ, giữ V23. Xem di-chua-team-run-2026-11-06-25.md.

- 06/11/2026 — DC-A14: bản nam dùng cùng cơ chế lệch pha và làm dịu chuyển động đầu khi đứng như mẫu nữ. Kiểm 22 cặp khung WebGL, 493 test và build đạt. Cổ và nẹp nam còn dày ở cận cảnh. Xem di-chua-team-run-2026-11-06-26.md.

- 06/11/2026 — DC-A14 (Doing): tích hợp V30 bỏ nẹp nổi và giữ tám khuy sau WebGL và review độc lập. V31/V32 chưa giải quyết gờ chân cổ. 493 test pass, build đạt, route local tải đúng GLB và chuyển nam/nữ thành công. Xem di-chua-team-run-2026-11-06-27.md.

- 06/11/2026 — DC-A14 (Doing): tích hợp V36 dựng lại viền cổ và dải lưới chân cổ nam. 28 tia kiểm vùng mép chạm áo trước, gồm 10 điểm bản V30 chạm da trước. Còn độ rủ vai và ngực khi so với mẫu nữ. Xem di-chua-team-run-2026-11-06-28.md.

- 06/11/2026 — DC-A14 (Doing): thử V37/V38 ở vai và ngực, cải thiện nhỏ. Tích hợp V39 sửa quần lấn qua lai sau khi thiền, 15 điểm giao cũ nay chạm áo trước. Xem di-chua-team-run-2026-11-06-29.md.

- 06/11/2026 — DC-A14 (Doing): tích hợp V42 làm dịu dải sáng tối ngang ngực khi thiền, sau đối chiếu WebGL có bóng và chế độ nhẹ. Còn dáng tay áo khi so với mẫu nữ. Xem di-chua-team-run-2026-11-06-30.md.

- 06/11/2026 — DC-A14 (Doing): tích hợp V46 thu vai/tay áo và làm dịu dải ngang ngực khi đứng. Kiểm 216 cặp tia ở mỗi chế độ WebGL, còn độ rủ khuỷu và lai sau khi thiền. Xem di-chua-team-run-2026-11-06-31.md.

- 06/11/2026 — DC-A14 (Doing): tích hợp V50 làm dịu cục bộ nếp gập khuỷu khi thiền. 168 cặp tia mỗi chế độ, một điểm giảm từ ba lớp áo xuống một trước da. Cải thiện nhỏ, còn lai sau dày. Xem di-chua-team-run-2026-11-06-32.md.

- 06/11/2026 — DC-A14 (Doing): tích hợp V56 làm phẳng gờ và kéo dài lai sau khi thiền. Kiểm 169 điểm mỗi chế độ, thêm 13 điểm chạm áo trước thay vì quần. Còn nhúm nhỏ hai đầu lai. Xem di-chua-team-run-2026-11-06-33.md.

- 06/11/2026 — DC-A14 (Doing): đối chiếu toàn thân/cận với mẫu nữ và tích hợp V57 giảm dải sáng ở lai thiền. Bản thử Walk giảm trượt trung vị nhưng P90 đi cung tăng, giữ riêng. Xem di-chua-team-run-2026-11-06-34.md.

- 06/11/2026 — DC-A14 (Doing): tích hợp V63 làm mượt mũi giày và bake chỉnh chân. P50/P90 trượt đều giảm trên bảy tuyến thử; P50 vẫn cao hơn nữ. Xem di-chua-team-run-2026-11-06-35.md.

- 06/11/2026 — DC-A14 (Doing): đo V63 khi bắt đầu/dừng/rẽ và thử V64–V66. Chưa có ứng viên cho lợi ích đồng đều giữa đi thẳng, hai chiều cung và các pha chuyển. Giữ V63. Xem di-chua-team-run-2026-11-06-36.md.
