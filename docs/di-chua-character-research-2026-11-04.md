# Nhân vật Đi Chùa — nghiên cứu và quyết định 04/11/2026

## Ưu tiên mới từ chủ dự án

Tập trung nhân vật vì vẫn thô và thiếu tự nhiên. DC-A12 chỉ hoàn thành lát cắt trước; không đồng nghĩa ngoại hình đã đạt. Mở DC-A14, giữ Doing cho đến khi có nhân vật mẫu chạy thật và nghiệm thu hình ảnh.

## Baseline đã kiểm

Source hiện tại `05a13d3`; bảo toàn thay đổi local cảnh quan/QA. Ảnh nam/nữ phía trước trong phòng DEV cô lập tại `.setest/di-chua-team/characters-research-2026-11-04/`, tên `male-current-front.png` và `female-current-front.png`.

- Vai–nách gãy mặt, thân/tay áo dạng ống, thiếu nếp rủ có cấu trúc. Đây là vấn đề rõ nhất trong ảnh, không chỉ là thiếu texture.
- GLB nam 41.974 tam giác, nữ 47.998; mỗi model một primitive/material, ba atlas RGB1024. Không facial morph; skeleton24 joints, thiếu xương mắt/hàm/ngón. Tăng số polygon đơn thuần không bảo đảm đẹp hơn.
- `templeVisitorClothing.js` giữ đầu/cổ/bàn tay, thay thân bằng geometry runtime và morph procedural. Không phải áo được dựng từ rập và chỉnh nếp rủ riêng.
- `templeModels.js` tự thay áo cho mọi `visitor-*`, chỉnh vật liệu toàn bộ và giới hạn texture1024. Model mặc áo sẵn cần profile riêng trước khi nhập; nếu giữ pipeline hiện tại sẽ phá áo/vật liệu mới.

## Đối chiếu các bên khác

1. [Reallusion Character Creator](https://www.reallusion.com/character-creator/) và [Digital Human Shader](https://www.reallusion.com/character-creator/digital-human-shader.html): tham khảo tách da, mắt, đường lệ, lông mi, tóc và cloth; shader riêng không tự chuyển nguyên sang Three.js. [EULA hiện hành](https://www-d3mezwfjhb1k77.reallusion.com/Content/EULA/EULA.htm) cần đối chiếu cách phân phối model; không mặc định cho phép đưa GLB tải độc lập vào public repo. Không mua hoặc tải asset trả phí.
2. [Avaturn](https://docs.avaturn.me/) có pipeline avatar web; [custom clothing](https://docs.avaturn.me/docs/ux_customization/assets/clothing/) vẫn yêu cầu mesh cùng skeleton, căn chỉnh và sửa weights. Dịch vụ không tự tạo đúng áo lam Việt Nam. Chưa đăng ký, upload ảnh hoặc dùng API/dịch vụ.
3. [MakeHuman license](https://www.makehumancommunity.org/about/license.html), [MPFB license](https://github.com/makehumancommunity/mpfb2/blob/master/LICENSE.md), [export guide](https://static.makehumancommunity.org/mpfb/docs/exporting.html): chọn làm hướng authoring không mua license, dùng core assets CC0 và kiểm riêng mọi asset cộng đồng. Cần bake vật liệu cho game, rig và dựng áo thật; ảnh Blender không chứng minh chất lượng browser. [Thông báo21/10](https://static.makehumancommunity.org/news/2026-10-21-community-site-shut-down.html): forum/asset repo cũ đã đóng, static packs/GitHub còn hoạt động.
4. [Yinn, Tony Flanagan](https://www.fab.com/listings/255a83dd-ad1e-420b-b8fb-e59d4f79f22b): nữ châu Á, mô tả MakeHuman/CC0, game+face rig, GLB. Tuy nhiên Fab hiển thị license `-`; [Sketchfab gốc](https://sketchfab.com/3d-models/yinn-young-asian-female-rigged-d549647cfae245679fe761babe4e3427) không đọc được metadata (403). Chưa xác minh phạm vi license tóc/skin hoặc có archive tải công khai hợp lệ. Chỉ là candidate, chưa tải/tích hợp.

## Quyết định triển khai kế tiếp

Làm một mẫu nữ trẻ trưởng thành trước, rồi mới nhân sang nam. Chọn hướng MakeHuman/MPFB core CC0 làm nền authoring; Yinn chỉ thay nền nếu xác minh được đầy đủ nguồn/license/archive. Không thêm vòng gợn procedural vào áo hiện tại để gọi là model mới. Máy hiện chưa có Blender trong PATH hoặc thư mục cài chuẩn đã kiểm; chưa có pipeline authoring chạy được trong lượt này.

Hợp đồng asset tối thiểu: nguồn/license/hash; file nguồn và GLB; mesh áo lam riêng với vai/nách đúng giải phẫu, độ rộng và nếp rủ dưới trọng lực; tách vật liệu da/mắt/tóc/vải; rig có ngón cho chắp tay; bone map/scale/bind pose; idle/walk in-place và một nghi thức. Loader cần phân biệt `authored-outfit` với `legacy-procedural`, giữ fallback cũ, skeleton độc lập giữa các peer.

Nghiệm thu mẫu bằng ảnh front/profile/full-body cùng camera/ánh sáng trong chùa, đứng/đi/thiền/lạy; không xuyên áo, nứt nách hay méo cổ tay; standard/low, reduced-motion, tải lỗi. Đo calls/triangles/texture và tải thực trước khi chọn budget cuối; không tự đặt số FPS chưa đo. Review độc lập rồi mới thay cả hai model.

## Đã làm / chưa làm

Đã audit source/GLB, xem nam/nữ chạy thật, lưu baseline và nghiên cứu nguồn chính thức với agent độc lập. Chưa thay model, chưa có áo authoring mới, chưa đánh giá GLB của nhà cung cấp. Lượt này chỉ đổi tài liệu nên không chạy lại test/build; kết quả kiểm runtime trước đây không phải bằng chứng model mới. DC-A14 vẫn Doing.

Reviewer độc lập `release_review` đối chiếu source/GLB và tài liệu, không có finding chặn; xác nhận các giới hạn về license và trạng thái chưa tích hợp được ghi đúng. `git diff --check` đạt. Scheduler hiện có đã cập nhật ưu tiên DC-A14, giữ nhịp4 giờ và các giới hạn quyền; không tạo worker/lịch mới.

## Cập nhật phiên4 giờ sau phản hồi — ứng viên MakeHuman đã chạy local

Các câu “chưa có Blender/chưa thay model” ở trên là trạng thái của bước nghiên cứu trước, không còn mô tả implementation hiện tại. Đã dùng portable Blender4.5.3 có checksum đối chiếu nguồn vendor và MPFB2.0.18 từ repository chính thức để dựng nữ trưởng thành. Core/skin/clothes/hair/faceunits được kiểm riêng license; không dùng Yinn vì vẫn thiếu xác minh tải/license.

Pipeline hiện tại: macro-body baked→áo/quần authoring→cuff sewn→semantic blink trên body/lashes→tóc bob CC0→skin-only AO/tint→CMU Walk/Idle retarget→prune/WebP/meshopt. V2 bị loại sau roundtrip vì body Basis không nhận macro shape; chỉ xuất GLB mới không đủ, phải nhập lại kiểm attachment thật. Nguồn sửa được, provenance và hướng dẫn build ở `assets-src/temple/`; report public ghi hash/bytes cuối. MPFB/Blender không nằm trong runtime.

CMU motion có custom terms, không phải CC0 và không được bán lại motiondata kể cả chuyển đổi. Nghi thức thiền/lạy là IK riêng; không gắn nhãn mocap cho các pose đó. Mốc PUBG là định hướng chất lượng, không được lấy asset của PUBG hoặc tuyên bố đạt chỉ từ polygon/test.

Hướng đánh giá kế tiếp không mua tài nguyên: [Microsoft Rocketbox README tại commit đã kiểm](https://github.com/microsoft/Microsoft-Rocketbox/blob/0943055db6ec570bcef9f2c8b41c9e5467c808f9/README.md) nêu MIT cho thư viện avatar, cùng [LICENSE](https://github.com/microsoft/Microsoft-Rocketbox/blob/0943055db6ec570bcef9f2c8b41c9e5467c808f9/LICENSE.md). Khi chọn một file phải giữ đầy đủ notice Microsoft/MIT cho cả bản GLB tải độc lập; không gọi CC0 hoặc suy quyền của các bộ animation khác. Metadata có FBX facial/head normal/specular nhưng chưa nhập/xem khuôn mặt, chưa xác minh từng file trẻ hơn/đẹp hơn. Rig Bip01/Generic và vật liệu Lambert cần chuyển đổi riêng, không phải drop-in53joints. Chưa tải model lớn hay tích hợp; nên nghiệm thu portrait một ứng viên trước khi đầu tư áo/retarget. Đây là hướng nghiên cứu tiếp, không phải kết quả đã đạt PUBG.

Cập nhật sau bước metadata: đã tải **một** Female_Adult_01_facial cùng headmaps cần thiết từ commit trên, tổng56.75MB, kiểmSHA256+GitblobSHA1 và giữ nguyên MITnotice. Thực tế parse4734verts/8732tri,80bones,175morph; portrait actualGLB có chi tiết mặt/normal tốt hơn nhưng style blonde/light-skin khác currentactor. Fullprototype37MB được thử WebP/meshopt riêng~4.0MB, không phải publicmodel. StaticWebGL cho thấy giữ cả175morph có chi phí rất cao trong phép thử này; đối chứng bỏ175defaultzero morph giữ byte-identical baseattrs/maps,~2.96MB và chạy nhẹ hơn rõ trên cùngRTX2060/ANGLE. Đây chưa là benchmark app hoặc xác nhận rig/nghi thức/normal handedness. Hướng kế tiếp là chọn morph thiết yếu, fit áo lam và retarget có kiểm; không thay actorV10 chỉ từ portrait đẹp hơn. Bằng chứng/privateprototype ở `.setest/rocketbox-face-preview/`; không đưa file thử này vào public hay source asset hiện tại.

Review actualcontroller/GLB/browser đã bắt các lỗi cổ tay/cuff, bow sai hướng, palm chirality/penetration, seat treo và chân thiền; checkpoint08 ghi các thử nghiệm bị loại và trạng thái sửa. Mặt còn thiếu microdetail, tóc còn rigid, form vải/pose cần tiếp tục review. DC-A14 vẫn Doing; không coi asset mới hay test pass là nghiệm thu photorealism.
