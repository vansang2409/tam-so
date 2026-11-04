# Team tự động Đi Chùa

Thiết lập 03/11/2026 theo yêu cầu chủ dự án. Phạm vi: Đi Chùa trong Tâm Sở, repo `D:\tam-so`. Mục tiêu: không gian chùa hư cấu thanh tịnh, hình ảnh tự nhiên hơn và trải nghiệm online ổn định, dễ sử dụng. Giữ Vite/React/Three.js/Supabase hiện tại; không mở rộng sang Nhà Thờ hoặc các hệ bói toán trong đợt này.

## Điều phối và nhịp chạy

Một heartbeat trong chat hiện tại, mỗi 4 giờ. Đây là lượt làm việc hữu hạn, không phải tiến trình 24/7; phụ thuộc máy/môi trường local sẵn sàng và hạn mức tài khoản. Không bật lại tác vụ Claude `tam-so-ai-employee` lịch sử trong WORK_LOG.md. Không tạo thêm lịch hoặc worker định kỳ trùng phạm vi. Quyền dừng hoặc đổi ưu tiên mới nhất của chủ dự án luôn được áp dụng ngay.

- Coordinator/Product: đọc trạng thái Git, backlog, mã nguồn và nhật ký mới; chọn một lát cắt có thể hoàn thành. Ưu tiên sửa hồi quy trước, hình ảnh trước tính năng mới khi không có lỗi chặn.
- Research/Design: nghiên cứu nguồn có xuất xứ cho kiến trúc Việt Nam, đồ lam, chuyển động và trải nghiệm online; ghi URL, ngày, giấy phép khi dùng asset. Không sao chép nguyên chùa thật, không nhận là đại diện cơ sở tôn giáo thật.
- Developer: triển khai tối thiểu phù hợp kiến trúc hiện có; tái sử dụng thay vì thay stack.
- QA: test tự động phù hợp và luồng thực trên browser; ảnh trước/sau cùng camera, ánh sáng và thiết lập. Không dùng ảnh render minh họa thay bằng chứng sản phẩm chạy thật.
- Reviewer: một subagent độc lập đọc diff, tiêu chí và bằng chứng; ghi finding theo mức độ, developer sửa rồi kiểm lại. Nếu thiếu công cụ/subagent, ghi rõ chỉ self-review, không gắn nhãn independent review.

Không cần tạo mọi vai trò thành agent ở mọi lượt. Coordinator có thể kiêm Product/Developer. Tối đa số agent môi trường hỗ trợ; task nhỏ dùng một reviewer độc lập. Agent nghiên cứu/review chỉ đọc trừ khi được giao phạm vi file riêng. Một người điều khiển browser. Không để subagent tiếp tục ngầm sau khi coordinator kết thúc.

## Chu trình mỗi lượt

1. Đọc AGENTS, tài liệu này, backlog và checkpoint mới nhất. Kiểm tra branch/diff và phiên đang làm việc; nếu đang có người sửa cùng phạm vi, chỉ nghiên cứu/review không ghi đè. Không tự checkout/pull trên working tree đang bẩn.
2. Chọn một mục, ghi Doing cùng phạm vi file và tiêu chí nghiệm thu. Khảo sát source trước. Với nghiên cứu, giới hạn một lát cắt và đưa ra quyết định có thể triển khai; không lặp nghiên cứu vô tận.
3. Implement, test, sửa lỗi; chạy `npm test` và `npm run build` nếu có thay đổi runtime. Không tạo script test chỉ lặp implementation. Không công bố số test từ tài liệu cũ.
4. Visual change: kiểm cả avatar nam/nữ và đứng/đi/thiền/lạy khi liên quan, một góc toàn cảnh và một góc gần. Kiểm xuyên sàn, clipping, tải lỗi/fallback, reduced-motion và chế độ nhẹ. Kiểm mobile viewport khi UI/camera bị ảnh hưởng. Ghi rõ thiết bị giả lập/thiết bị thật; FPS chỉ báo nếu đã đo.
5. Online change: kiểm tối thiểu hai phiên độc lập khi môi trường cho phép; join/leave, ngoại hình và tư thế, payload cũ/sai, mất mạng/reconnect/cleanup khi liên quan. Chỉ dùng phòng thử có cô lập nếu có; không tương tác, sửa hay xóa dữ liệu khách thật. Không đưa lời khấn riêng tư vào presence hoặc log.
6. Independent review diff và regression, xử lý finding, retest cần thiết; `git diff --check`, `git status`. Phân biệt diff có sẵn với thay đổi của lượt.
7. Cập nhật backlog và thêm checkpoint: mục đã làm, file, lệnh/kết quả, ảnh, finding đã sửa/còn mở, giới hạn và việc kế. Evidence riêng trong `.setest/di-chua-team/<run>/`, không commit credential hoặc fixture riêng tư.

Chỉ chuyển Done khi tiêu chí nghiệm thu và các kiểm tra/review bắt buộc cho mục đó đạt. Nếu thiếu browser, phiên online thứ hai hoặc reviewer độc lập bắt buộc, giữ Doing hoặc ghi Blocked với điều kiện tiếp tục cụ thể; không dùng self-review thay bằng chứng còn thiếu. Có thể chuyển sang mục độc lập trong khi chờ.

QA online được phép gửi presence/broadcast tạm từ các phiên thử trong phòng cô lập, không ghi bảng nghiệp vụ hoặc lời khấn. Khi không cô lập được phòng, dùng mock/local transport và ghi live QA chưa xác minh; không dùng khách thật làm fixture.

## Tiêu chuẩn hình ảnh và hiệu năng

Ưu tiên mới nhất04/11/2026: nhân vật có chất lượng tham khảo PUBG, mặc áo lam phù hợp Đi Chùa. Chủ dự án bác bỏ mẫu nữ v1 vì hình thể/cổ/vai/tay/giày còn giống mannequin. Reviewer phải đánh giá crop gần như ảnh chủ dự án và chuyển động thật; không dùng “không có regression” thay cho mức chất lượng yêu cầu. Mục tiêu này bổ sung DC-A14 và được ưu tiên trước mở rộng cảnh quan.

Đánh giá tỷ lệ kiến trúc/người, cấu tạo mái/cột, chất liệu có roughness đúng, ánh sáng/bóng tiếp xúc, đồ lam có dáng/nếp rủ phù hợp, tư thế tự nhiên và tổng thể thanh tịnh. Test pass không đồng nghĩa photorealistic. Không đạt chân thực bằng tăng bão hòa/bloom hoặc thêm polygon không đo chi phí. Asset phải có giấy phép và attribution; giữ manifest/checksum. So sánh tải, kích thước asset, draw calls/bộ nhớ/FPS với baseline thực khi có công cụ. Không phát minh con số hoặc gọi morph dựng sẵn là physics.

## Quyền và giới hạn

Tự nghiên cứu, sửa local, tạo tài liệu/SQL migration đề xuất và test được phép. Chưa có quyền tự commit/push/merge/deploy, đổi schema/RLS/dữ liệu hosted, khởi động dịch vụ production, mua asset, dùng dịch vụ trả phí mới hoặc liên hệ người khác. Nếu một hạng mục phụ thuộc quyền này, hoàn thành phần local reviewable, ghi blocker rồi chuyển mục độc lập khác. Không đọc bí mật để vượt blocker.

Mỗi vòng triển khai tập trung một thay đổi sản phẩm có thể review; tránh rewrite lớn. Theo chỉ đạo tiếp tục của chủ dự án ngày 03/11/2026, trong phiên đang hoạt động hãy nối tiếp các vòng độc lập sau QA/review, không tự kết thúc chỉ vì vừa xong một hạng mục nhỏ hoặc để chờ lịch 4 giờ. Khi có blocker thật, hết việc có giá trị hoặc không đủ hạn mức, lưu checkpoint rõ ràng; không tạo tác vụ giả. Chỉ thông báo kết quả có thay đổi đáng kể, lỗi cần xử lý hoặc quyết định cần chủ dự án. Không báo cáo lặp khi không có gì mới.

## Checkpoint ban đầu

Baseline hiện tại có nhiều thay đổi local chưa commit: kiến trúc GLB, avatar nam/nữ, đồ lam skinned, morph vải và presence appearance. QA gần nhất được ghi trong `docs/chua-3d-validation.md`; ảnh `.setest/cloth-drape/`. Phải xác minh lại trước khi dựa vào. Đây chưa phải bằng chứng đạt photorealism hoặc đạt hiệu năng điện thoại thật.


## Ngoại lệ phát hành2 giờ trước đó — lịch sử, không chạy lại

Chủ dự án đã yêu cầu làm tiếp2 giờ rồi commit/push production, đóng ứng dụng và tắt máy. Phiên đó đã được xử lý trước phiên4 giờ mới; phạm vi/mốc/đích ở `di-chua-release-2026-11-03.md`. Không tái sử dụng quyền này để deploy/shutdown ở lần mở máy sau.

## Ngoại lệ phiên4 giờ04→05/11/2026 — đã chốt, không chạy lại

Yêu cầu trực tiếp mới: làm tiếp4 giờ rồi commit/push, đóng ứng dụng và tắt máy. Bắt đầu15:52:35UTC04/11, chốt19:52:35UTC tức02:52:35ngày05/11 Asia/Bangkok. Không chốt/tắt sớm. Phạm vi là Đi Chùa trong nhánh `codex/di-chua-character-realism-20261104`, giữ thay đổi có trước; không forcepush, không suy ra quyền merge/deploy production từ phiên mới này. Đóng/tắt bình thường, không forcekill hoặc Discard dữ liệu chưa lưu. Xóa lịch chốt một lần sau xử lý để không lặp khi khởi động. Checkpoint hiện tại: `di-chua-team-run-2026-11-04-08.md`.

Ngoại lệ chỉ áp dụng phiên có hạn này, không cấp quyền commit/push/deploy/shutdown vô hạn cho heartbeat. Mục chất lượng chưa đạt vẫn Doing dù phiên đã commit/push.

## Bài học authoring nhân vật cần giữ

- Nguồn sửa được/provenance/build ở `assets-src/temple/README.md`. MakeHuman macro-body phải bake vào Basis trước khi xuất bỏ macro morph; phải nhập **GLB thực** lại để kiểm mắt/tóc/áo, không chỉ xem scene authoring.
- Authored human giữ PBR/trang phục source; không chạy nhánh cắt/thay áo legacy. Bone rest/skin/morph/clone độc lập, alpha mắt/mi và source-license cần kiểm trên asset đã tối ưu.
- Floor/finite test không phát hiện da xuyên áo. Cần ảnh/camera/magenta/ray kiểm cả Idle/Walk và nghi thức; oracle24pose vùng nách chỉ chứng minh vùng/mẫu đã kiểm, không bảo đảm mọi va chạm vải.
- Body có clothing mask ở bàn chân; không ẩn giày trước khi phục hồi sourcefoot. Skin nguồn hiện thiếu normal/roughness khớp UV; không bịa pores hoặc gọi scalar shader là skin scan. Giữ thử nghiệm không có lợi ích rõ ở ngoài bản phát hành.

Phiên4 giờ đã kết thúc đúng hạn: implementation commit `5822268f9b3859db1b9e793b93b5a794e69d896c` đã push nhánh `codex/di-chua-character-realism-20261104` và đối chiếu remoteSHA lúc19:52UTC04/11. Không merge/deploy production. Lịch chốt một lần đã xóa; không lặp commit/push/shutdown theo quyền phiên này khi mở máy lại. DC-A14 vẫn Doing; dừng phiên phát triển theo timebox của chủ dự án. Đóng ứng dụng/tắt máy bình thường là bước OS tiếp theo, không ghi thành đã tắt máy trước khi có bằng chứng.
