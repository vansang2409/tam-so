# Nhân vật Đi Chùa — nâng cấp ngày 04/11/2026

## Phạm vi và quyết định

Theo yêu cầu nâng chất lượng nhân vật của chủ dự án. Baseline `master` tại `715cd9e`, working tree sạch trước lượt. Hoàn thành thay đổi local cho cả nam và nữ; chưa commit, push hoặc deploy.

Audit model chạy thật phát hiện tay áo hở khỏi vai, mép cổ tay răng cưa, giày hình ellipsoid dựng lên khi đứng, nếp gấp khuỷu/gối quá gắt. Mặt/tóc nguồn có thể giữ trong lát cắt này; vấn đề hình dáng lớn nhất nằm ở trang phục và hướng bind của giày.

Đã khảo sát hai hướng:

| Hướng | Lợi ích | Chi phí/giới hạn | Quyết định |
|---|---|---|---|
| Dựng lại vai–nách và chỉnh outfit trên skeleton hiện tại | Dùng lại Walk, IK, sharing và hai model đang có; không tăng tải GLB | Mặt/tóc vẫn là asset nền; không phải nhân vật được nghệ sĩ tạo riêng | Triển khai |
| Tạo nhân vật riêng qua MakeHuman/MPFB, dựng áo lam và retarget | Kiểm soát nhận diện, tóc và anatomy tốt hơn | Cần pipeline tạo model, làm trang phục, export và kiểm lại toàn bộ rig; chưa có asset áo lam thay trực tiếp được xác minh | Hướng tiếp theo nếu cần chất lượng cao hơn; chưa tích hợp |

Nguồn kiểm tra ngày 04/11/2026:

- [Grab3D Man Base Mesh](https://grab3d.com/models/characters/man-base-character/), [Woman Base Mesh](https://grab3d.com/models/characters/woman-base-character/): nguồn hai GLB hiện có, CC0; model nền, chưa phải đồ lam hoàn chỉnh.
- [MakeHuman licensing](https://www.makehumancommunity.org/about/license.html), [MPFB export](https://static.makehumancommunity.org/mpfb/docs/exporting.html): phương án tạo nhân vật riêng. Phải kiểm giấy phép từng asset cộng đồng nếu chọn bổ sung tóc/trang phục; không mặc định mọi asset đều CC0.
- [Three.js SkinnedMesh](https://threejs.org/docs/pages/SkinnedMesh.html): cấu trúc skinIndex/skinWeight, bind và bounding của model biến dạng.

Không tải thêm asset, thêm dependency hoặc thay checksum GLB nguồn. Attribution hiện có được giữ nguyên.

## Thay đổi

- Áo dùng chung đỉnh tại vòng nách với tay áo; bỏ hai ống tay hở, chuyển trọng số từ thân sang cánh tay theo vùng cap. Tham số tiết diện chạy đủ một vòng để tránh tay áo tự gập/xoắn.
- Độ rộng áo theo vai từng skeleton; tâm trước/sau áo theo cột sống; nội suy mềm silhouette và giảm gợn vải quá mạnh.
- Cổ áo có mép gập/lớp trong; nẹp giữ trên bề mặt áo. Cuff đến đúng cổ tay và giữ thêm da vùng chuyển tiếp để che đường cắt khi bàn tay xoay.
- Giày dựng theo trục gót–mũi trong bind pose, có thân/đế thấp thay ellipsoid; kiểm đế gần sàn khi đứng.
- Thiền hạ hông và đặt tay trong lòng. Lạy chỉnh khuỷu, hướng bàn tay và khoảng với của tay/chân theo độ cúi; kiểm lại giới hạn sàn trong các khung test.
- Tách roughness của da/tóc khỏi vải/giày/nẹp, giữ bump vải mịn. Bật mipmap cho atlas nhân vật.
- Geometry/material vẫn dùng chung; skeleton và morph state độc lập cho từng bản sao.

## Bằng chứng và kiểm tra

Ảnh/harness local nằm tại `.setest/di-chua-team/avatar-upgrade-2026-11-04/` (thư mục bỏ qua Git):

- `comparison.png`, `before-front.png`, `after-front.png`: cùng camera/ánh sáng/viewport/tư thế. Đây là render của model/mã nguồn thật trong harness cô lập, không phải ảnh minh họa AI.
- `after-side.png`, `after-back.png`, `after-walk.png`, `after-meditating.png`, `after-praying.png`, `after-bowing.png`: cả hai nhân vật, các góc và động tác.
- `product-male-standing.png`, `product-male-meditating.png`, `product-female-standing.png`, `product-female-low.png`: kiểm tích hợp trên trang Đi Chùa tại Chánh Điện, đổi mẫu và chế độ nhẹ.
- `product-mobile-reduced.png`: viewport 390×844, nữ tải thành công và media reduced-motion bật.
- `product-mobile-fallback.png`: chặn hai GLB nhân vật bằng HTTP 503; cảnh vẫn có canvas, dùng fallback (`detailedVisitor=false`) và thông báo tải thiếu.

Các phiên QA cuối chặn WebSocket để cô lập phòng chung. Không kiểm hai khách live trong lượt này; phần bản sao, appearance, morph và cleanup kiểm bằng test local. Không thay payload hoặc transport presence.

Đo cùng harness hai nhân vật đứng, có bóng:

| Chỉ số renderer | Trước | Sau |
|---|---:|---:|
| Draw calls | 45 | 37 |
| Triangles (gồm shadow pass) | 122.130 | 124.758 |
| Geometries | 5 | 5 |
| Textures | 17 | 17 |

Garment mỗi mẫu tăng từ 13.812 lên 14.300 tam giác; phần da cổ tay giữ thêm làm tổng render tăng khoảng 2,2% trong harness này. Đây không phải benchmark FPS trên điện thoại thật. Thời gian render của browser tự động chịu giới hạn môi trường; chưa xác minh hiệu năng GPU/điện thoại thật.

Kiểm tra cuối:

- `npm test`: runner báo **493 pass / 0 fail**. Bổ sung assertion liên thông thân–tay, không hở biên nách, tiết diện không gập, vật liệu nẹp, dáng/độ cao giày và hông thiền. Giữ các kiểm normalized weights, normal/morph/seam hữu hạn, sàn và trim trong đứng/thiền/lạy/Walk cho hai model, clone độc lập và tải lỗi/cleanup.
- `npm run build`: đạt. Prerender được script bỏ qua vì base tương đối, đúng thông báo của cấu hình hiện tại.
- `git diff --check`: đạt.
- Reviewer độc lập: phát hiện nẹp bị nhận nhầm là vật liệu da; đã thêm tag `ao-lam-trim`, kiểm lại pipeline thật giữ roughness `.94`. Lượt review cuối không còn finding P1/P2 chặn. Reviewer kiểm topology cả hai nguồn không có cạnh hở vùng vai–nách hoặc cạnh non-manifold ở áo sau weld vị trí.

Giới hạn: chưa phải model photorealistic, chưa làm lại mặt/tóc riêng hoặc mô phỏng vải vật lý. Không tuyên bố mọi tự va chạm được loại bỏ ở mọi tư thế/góc nhìn; nhận định dựa trên các ảnh và khung đã kiểm. Bóng tiếp xúc toàn cảnh (DC-A09) và kiểm thiết bị cảm ứng thật (DC-A07) vẫn là mục riêng.
