# Lượt làm việc và phát hành theo yêu cầu 03/11/2026

Người dùng yêu cầu lúc **16:46:18 UTC ngày 03/11/2026**: làm tiếp 2 giờ, sau đó commit/push lên production, đóng ứng dụng đang chạy và tắt máy. Mốc kết thúc phát triển: **18:46:18 UTC**, tức **01:46:18 ngày 04/11/2026 giờ Asia/Bangkok**. Đến mốc chuyển sang chốt release; không mở thêm scope mới. Hoàn tất kiểm tra phát hành trước khi tắt máy; không dùng shutdown cứng có thể cắt ngang deploy.

Đây là quyền commit/push/phát hành cho các thay đổi Tâm Sở trong lượt này, không phải quyền deploy định kỳ vô hạn. Lệnh mới nhất của người dùng được ưu tiên nếu đổi/hủy.

## Đích đã kiểm tra

- Workspace `D:\tam-so`, branch `master`, remote `https://github.com/vansang2409/tam-so.git`.
- HEAD và remote master ban đầu cùng `98e14b30a87304687ebd8f4e2074e0cec029107d`.
- Source canonical: `https://tam-so.vercel.app`. GitHub combined status ở HEAD hiện có Vercel success với liên kết deployment thuộc dự án `tam-so`.
- Workflow đang có cũng deploy GitHub Pages khi push master. Không đổi remote hoặc force push.
- GitHub connector đọc được repo nhưng không có quyền push qua connector; kiểm credential Git local riêng, không in thông tin credential.

## Quy trình chốt

1. Hoàn tất checklist visual/source/test và review còn mở. Không nhận thêm cải tiến sau mốc nếu không trực tiếp chặn release.
2. Xem toàn bộ status/diff; loại `.env.local`, secrets, `.setest`, dist/node_modules và artifact riêng tư. Chỉ stage file thuộc công việc được giao, không `git add -A` mù.
3. Kiểm test/build cả cấu hình production Vercel (base tuyệt đối/prerender) và scope cache PWA/version phù hợp.
4. Kiểm remote chưa đổi; giải quyết thay đổi từ xa an toàn, không reset/force push. Commit/push scoped work.
5. Ghi SHA, liên kết CI/deployment; xác minh Vercel production và mẫu luồng thật, tách trạng thái GitHub Pages nếu khác. Chưa xác minh thì không ghi phát hành thành công.
6. Lưu checkpoint và bàn giao trước khi đóng app. Đóng bình thường, không force kill hoặc tự chọn bỏ dữ liệu chưa lưu. Nếu hộp thoại unsaved không thể xử lý an toàn, báo blocker.
7. Tắt Windows bình thường khi các bước trên đã hoàn tất. Ghi đúng là đã gửi yêu cầu tắt máy; không suy đoán máy đã tắt nếu không còn quan sát được.

## Trạng thái trước phát hành (18:12 UTC)

Đã chốt source và kiểm build local; **chưa commit, push hoặc deploy tại thời điểm ghi này**. Có heartbeat chốt một lần gắn chat hiện tại để tiếp nối tại mốc, ID `t-m-s-ch-t-production-v-t-t-m-y-m-t-l-n`. Không chạy lại release/shutdown nếu checkpoint cuối đã xác nhận lượt này đã được xử lý.

## Kiểm tra giữa lượt

- 17:07 UTC: `npm test` đạt 493 pass / 0 fail; gồm kiểm hình học, 529 tuyến, camera sát vách/chuyển góc, pool khói, cloth, input và presence. Đây là kiểm giữa lượt, chưa phải kiểm cuối sau mọi thay đổi.
- Build relative base đạt 561 modules; production Vercel/prerender chưa chốt.
- Hai phiên DEV phòng QA riêng đã join count 2; nữ/thiền/lạy đồng bộ sang peer. Kết thúc ritual khi mở history đưa peer về standing. Chưa xác minh mạng rớt thực.
- Đã thêm bước `npm test` vào CI Pages trước build; dùng lockfile `npm ci`. Vercel status và browser production vẫn cần kiểm sau push.

## Chốt source 17:31 UTC (vẫn trước mốc phát hành)

- Version/package-lock và PWA cache chuyển 4.10.0. Không đổi dependency.
- Full test gần nhất 493 pass/0 fail; Vercel-style build `VERCEL=1 npm run build` đạt 562 modules, prerender 211 route. Sau đó có chỉnh vùng cản và bảng tên hồ, cần kiểm lại trước commit.
- Render/collider/hitbox hồ dùng chung `templeBasinCenterZ`; Vườn Lâm Tỳ Ni giữ offset -1m so với điểm đến bản đồ. Reviewer đã bắt hồi quy tọa độ trước release, đã sửa và 529 route đạt.
- Bàn lễ: mặt đỡ dựa trên mesh bàn/khăn thật; chén/đĩa/đèn/lư và bình không giao nhau. Chân bàn Chánh Điện đặt trọn trên bệ; Dược Sư còn 4 bình có khoảng cách đúng.
- Online live: phòng DEV cô lập, count1→2, ngoại hình/tư thế truyền sang peer, rời về trang chủ→count1 và remote clone được gỡ. Vào phiên mới lại count2. Incense hết hạn khi history modal mở đưa peer về standing.
- Chuột trái xoay/nhìn, phải đi đã kiểm trực tiếp. Right-drag liên tục kiểm source/unit; chưa mô phỏng thao tác kéo phải qua công cụ UI. Touch/pen mapping giữ nguyên, chưa kiểm điện thoại thật.
- Viewport override yêu cầu390×844 không được browser áp dụng: DOM vẫn1543×831; tab mới1280×720. Đã reset override, không coi ảnh desktop là mobile QA. Ảnh thử đổi tên `viewport-attempt-desktop.png`.
- Ảnh đủ23 khu, ảnh cuối sen/chim/mây và quality standard/low trong `.setest/di-chua-team/2026-11-03-detail-audit/` (không commit). FPS DEV đo trên máy local/IAB, không phải GPU time hay benchmark điện thoại.


## Bổ sung QA17:36–17:42 UTC

Chrome đã giải quyết giới hạn responsive của IAB: DOM đo đúng390×844 và844×390, kiểm map/search/di chuyển/ngoại hình/quality khi đi/6 nút hành lễ/lạy. Đã reset viewport và đóng tab Chrome QA, không coi đây là thiết bị cảm ứng thật. Ba phiên đều là fixture riêng trong phòng DEV; rename QA Nam truyền sang phiên khác. Thiền5 phút tự kết thúc khi history modal vẫn mở, peer trả standing và count3 giữ ổn định. Bằng chứng riêng gồm`mobile-390-final.png`, `mobile-844-main-final.png`, `online-two-avatars-final.png`, `five-minute-expiry-peer.png`, `main-censer-smoke-close.png`.

Sau chỉnh hồ/hitbox/bảng tên, full test493 pass/0 fail và build production562 modules/prerender211 route đạt. Sau đó phát hiện thêm tiếp xúc mặt bàn/vòng tay và bệ lư ngoài trời; đã sửa, chạy lại full test/build và tạo fingerprint mới ở phần chốt cuối bên dưới. Chưa commit/push tại thời điểm ghi phần này.


## Chốt QA sau sửa tiếp xúc và chân đỡ (18:12 UTC)

- Bình trên bàn Nhà Khách/Dược Sư/Pháp Bảo lấy cao độ mặt mesh thực; chân bàn chạm đáy mặt bàn. Vòng tay Pháp Bảo dùng bounding box của torus sau xoay để nằm trọn mặt bàn và không giao bình. Kiểm geometry có sai số tiếp xúc chặt, giữ negative control.
- 14 lư ngoài trời có bệ đá từ sân tới đáy bát thực. Lư trước điện ra khỏi mép shell/bậc; Chánh Điện lệch trái1.15m để trục giữa thông. Render/collider dùng chung kích thước/offset. Kiểm9 điểm quanh bệ, envelope shell, toàn trục giữa và529 tuyến đạt. Reviewer độc lập không còn finding chặn.
- Full `npm test` sau các thay đổi này:493 pass/0 fail cùng suite bổ sung hình học/camera/tuyến/cloth/assets/presence. `VERCEL=1 npm run build`:562 modules,211 route. Entry `index-CS1ngI7m.js`, chunk `DiChua-zfDhXggT.js`. Fingerprint mới158 file lưu riêng; đối chiếu lại trước stage.
- Browser production-preview đã tải đúng entry mới, models ready. Kiểm lại bàn Chánh Điện, ảnh bệ lư ngoài sân và Tượng Cầu Nguyện; cả hai có mặt đỡ, trục vào điện mở. Ảnh riêng `final-build/main-censer-plinth-exterior.png`, `final-build/tuong-cau-nguyen.png`.
- Trạng thái kết nối lúc18:10 UTC ở preview và DEV đều1 người online. Một số thời điểm trước đó có reconnect tự hồi phục; chưa xác định nguyên nhân, không đổi cấu hình kết nối chung theo suy đoán. Fresh DEV reload không có console error tại điểm kiểm18:11 UTC. Chưa kiểm mạng mất thật.
- Hiệu năng sau bệ lư, cùng nam/cổng1280×720: standard430 calls/1,761,870 triangles; low234 calls/876,577 triangles, shadows tắt. FPS rolling trong IAB có dao động khi nhiều tab và đổi quality; low có giới hạn render32ms có sẵn trong source (cadence quan sát khoảng23fps trên phiên này), standard khoảng69fps sau warmup. Đây không phải benchmark GPU/điện thoại. Các số411/224 ở báo cáo giữa lượt thuộc source trước bệ lư.
- Giới hạn còn mở: atlas kiến trúc nhìn gần, vai/đầu/tóc avatar, lá sen và bóng tiếp xúc; đồ họa vẫn stylized, chưa nghiệm thu giống ảnh thật. Chrome responsive chỉ là viewport giả lập. Không thay DB/schema/RLS, không đổi dependency.

Kết quả commit, CI, production và yêu cầu tắt máy sẽ được ghi bằng SHA/trạng thái thật trong bàn giao và checkpoint riêng sau mốc18:46:18 UTC. Không ghi trước kết quả deployment.


QA bổ sung18:28:38 UTC trên source cuối: hai phiên DEV cô lập vẫn count2. Thiền5 phút bắt đầu18:22:~49 UTC; giữ hộp thoại history mở suốt chu kỳ, sau hết giờ root và peer đều standing trong khi dialog vẫn mở. Fingerprint158 file chưa đổi. Bằng chứng riêng `final-source-five-minute-expiry.json/png`; không dùng khách production làm fixture.


Review phát hành độc lập18:29 UTC:72 approved paths khớp toàn bộ Git status; không private/generated files;158 hash không đổi;15 test modules đều reachable từ npm test (gồm9 suite helper mới). Lockfile chỉ đổi version, Node20 phù hợp engine hiện có, CI npm ci→test→build hợp lệ. Quét mẫu secret có giới hạn không có hit; không coi đây là chứng nhận security toàn hệ thống. Production trước push lúc18:32 UTC HTTP200 và cache `tamso-v4.9.0`; cần xác minh4.10.0 sau deployment.


Soak cuối18:11–18:38 UTC: phiên chính không reload, models ready, sau tải cả hai mẫu giữ700 geometry/82 texture tại các điểm đo, không tăng tiếp. Hai phiên cô lập cùng online gần20 phút; phiên peer đổi nữ, đi vào Chánh Điện, thiền5 phút/history mở rồi tự đứng. Khi peer về trang chủ và đóng tab, phiên chính trở về1 online, peer arrays rỗng/0 remote clones; không có error trong console log thu được của phiên chính. Standard cổng cuối430 calls/1.761.870tri, rolling69.2fps trên máy này. Đây là quan sát hữu hạn, không chứng minh mọi tình huống reconnect hoặc thiết bị thật.


Preflight staging18:39 UTC phát hiện3 blank lines ở EOF của file mới; chỉ bỏ dòng trống, không đổi logic. Đã chạy lại toàn bộ npm test493 pass/0 fail và Vercel build211 route thành công; entry/chunk không đổi. Tạo lại fingerprint sau kiểm này; staged diff check đạt. Chưa commit/push tại thời điểm ghi.
