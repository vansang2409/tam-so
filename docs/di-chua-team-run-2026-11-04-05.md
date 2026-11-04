# Lá sen và nụ — lát cắt A13 local, 04/11/2026

Tiếp theo yêu cầu làm tiếp, baseline05a13d3 sau pull. Giữ nguyên các nghiên cứu/backlog local của các lượt02–04, không commit/push/deploy. Root là writer và người điều khiển browser; release_review chỉ đọc và review độc lập.

## Thay đổi

`templeLotusLeaves.js` tạo3 lá peltate khum nông, vành kín hơi gợn, gân màu nhẹ; dùng3 geometry cache với vertex normals liên tục. Không tạo khe kiểu lá súng. Có1 geometry nụ kín224tri, xoay/tỷ lệ khác nhau;19 vị trí sen cũ nay gồm5 nụ và14 hoa nở. Cuống chạm đáy nụ, lá vẫn trên nước. Không thay hồ, collider, điều hướng, dependency hoặc texture; dùng lại material signature để staticmerge không thêm bucket.

Nguồn hình thái (mô tả tham khảo, không lấy ảnh): [USGS Nelumbo nucifera](https://nas.er.usgs.gov/queries/FactSheet.aspx?SpeciesID=244), xem04/11/2026; lá tròn peltate không khe, có thể nổi, lõm giữa. Hình học mới tự dựng bằng mã, không phải mô hình quét/phục dựng thực vật chính xác.

## Kiểm tra source và test

Thêm `tests/temple-lotus.mjs`, nối vào test entry hiện có qua temple-rituals. Kiểm finite attributes, winding/diện tích triangle, leaf rim manifold và upward normals, độ khum/bounds, vị trí lá trên nước cho19 scale/yaw, bud closed edges và signed volume outward; bản lá phẳng cũ không đạt tiêu chí curvature.

`npm test`:493 regression pass/0fail cùng suite mới và các suite bổ sung. `npm run build`:thành công; prerender bỏ qua đúng cấu hình base tương đối. Không thay source sau kiểm (đã hash4 file để so). Source cuối được khôi phục nguyên byte sau lượt dùng HEAD scene tạm làm baseline. `git diff --check` đạt.

Reviewer kiểm độc lập geometry/source, cuống–nụ, ngân sách, sharing và ảnh standard/low; không còn finding chặn trong phạm vi. Lá/nụ là geometry tĩnh, không thêm cập nhật theo thời gian nên reduced-motion không tạo thêm chuyển động; chưa đổi preference OS/browser hoặc kiểm thiết bị thật trong lượt này.

## Bằng chứng browser và chi phí

Chrome local trong phòng QA DEV cô lập; Vườn Lâm Tỳ Ni, female ở12,16,1920×855, models ready. Ảnh và JSON riêng `.setest/di-chua-team/2026-11-04-05/`. Trước/sau cùng source avatar05a13d3 và các thiết lập danh nghĩa; ảnh gần có lệch camera nhẹ, chỉ dùng so sánh định tính, KHÔNG pixel-aligned. Một ảnh gọi before-overview thực ra còn khung gần trước reset, đã đổi tên `before-reset-stale-frame.png`; không nhận có cặp overview matched. Các ảnh pose-camera-attempt cũng không được nhận là camera lock đã xác minh.

| Quan sát | Trước | Sau |
|---|---:|---:|
| Standard draw calls |377|377|
| Standard triangles gồm shadow pass |1623286|1624734|
| Low draw calls |183|183|
| Low triangles, shadows off |728145|728869|

Delta hình học724tri/pass: lá tăng1824, thay5 hoa192tri+heart252tri bằng5 nụ224tri giảm1100. Standard có shadow pass nên delta1448. Không suy số liệu này là GPU-time hoặc FPS. Geometry/texture allocation counters trước/sau có lịch sử upload khác nhau nên không dùng tính delta bộ nhớ; không thêm texture từ code. Rolling FPS trong phiên này không dùng benchmark; nguyên nhân cadence thấp chưa xác minh. Chưa đo overdraw/GPU/điện thoại thật.

Ảnh gần thấy nụ xen hoa và lá khum nhẹ, reviewer không thấy rách mặt/lún nước/nụ rời cuống ở các góc đã xem. Không phải chứng nhận photorealism hoặc mọi góc hoàn hảo.

## Trạng thái và việc kế

A13 Done cho lát cắt local3 lá+nụ xen hoa, các giới hạn đo/ảnh nêu trên giữ nguyên. A11 vẫn Doing (author mask PBR), A09 contact shadows chưa nghiệm thu. Không chạm production hoặc lặp shutdown.
