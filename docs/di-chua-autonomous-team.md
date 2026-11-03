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

Đánh giá tỷ lệ kiến trúc/người, cấu tạo mái/cột, chất liệu có roughness đúng, ánh sáng/bóng tiếp xúc, đồ lam có dáng/nếp rủ phù hợp, tư thế tự nhiên và tổng thể thanh tịnh. Test pass không đồng nghĩa photorealistic. Không đạt chân thực bằng tăng bão hòa/bloom hoặc thêm polygon không đo chi phí. Asset phải có giấy phép và attribution; giữ manifest/checksum. So sánh tải, kích thước asset, draw calls/bộ nhớ/FPS với baseline thực khi có công cụ. Không phát minh con số hoặc gọi morph dựng sẵn là physics.

## Quyền và giới hạn

Tự nghiên cứu, sửa local, tạo tài liệu/SQL migration đề xuất và test được phép. Chưa có quyền tự commit/push/merge/deploy, đổi schema/RLS/dữ liệu hosted, khởi động dịch vụ production, mua asset, dùng dịch vụ trả phí mới hoặc liên hệ người khác. Nếu một hạng mục phụ thuộc quyền này, hoàn thành phần local reviewable, ghi blocker rồi chuyển mục độc lập khác. Không đọc bí mật để vượt blocker.

Mỗi vòng triển khai tập trung một thay đổi sản phẩm có thể review; tránh rewrite lớn. Theo chỉ đạo tiếp tục của chủ dự án ngày 03/11/2026, trong phiên đang hoạt động hãy nối tiếp các vòng độc lập sau QA/review, không tự kết thúc chỉ vì vừa xong một hạng mục nhỏ hoặc để chờ lịch 4 giờ. Khi có blocker thật, hết việc có giá trị hoặc không đủ hạn mức, lưu checkpoint rõ ràng; không tạo tác vụ giả. Chỉ thông báo kết quả có thay đổi đáng kể, lỗi cần xử lý hoặc quyết định cần chủ dự án. Không báo cáo lặp khi không có gì mới.

## Checkpoint ban đầu

Baseline hiện tại có nhiều thay đổi local chưa commit: kiến trúc GLB, avatar nam/nữ, đồ lam skinned, morph vải và presence appearance. QA gần nhất được ghi trong `docs/chua-3d-validation.md`; ảnh `.setest/cloth-drape/`. Phải xác minh lại trước khi dựa vào. Đây chưa phải bằng chứng đạt photorealism hoặc đạt hiệu năng điện thoại thật.


## Ngoại lệ phát hành một lần ngày 04/11/2026

Chủ dự án đã yêu cầu làm tiếp2 giờ rồi commit/push production, đóng ứng dụng và tắt máy. Phạm vi/mốc/đích xác minh ở `di-chua-release-2026-11-03.md`; đây là quyền cụ thể cho lượt hiện tại, không thay đổi quyền mặc định của các lượt heartbeat tương lai. Khi release đã xử lý xong, không tự lặp shutdown hoặc deploy ở lần mở máy sau.
