# DC-A14 — mẫu nữ áo lam v1 chạy local

Theo yêu cầu triển khai mẫu nữ và chạy thử. Baseline source05a13d3; giữ toàn bộ local A13/QA/PBR có trước. Không commit/push/deploy, không thay DB hoặc đọc secret.

## Thay đổi đã thực hiện

- `visitor-female-lam.glb`: derivative từ nữ Grab3D CC0 hiện có, giữ đầu/tóc/tay/Walk. Dựng lại silhouette nữ từ pattern code: vai dốc, thân suông có độ rộng thay đổi, tay/quần bớt phồng, fairing cap và trường skin weights cùng nhau; giữ5 morph và nẹp/cổ/khuy. Đây là model bake từ pipeline code, không phải artist sculpt mới, MakeHuman/Yinn hoặc cloth physics.
- Female authoring chỉ chạy lúc build asset; nam vẫn dùng pipeline cũ. Loader nhận profile và không cắt/thay áo lần hai; cập nhật morph cho mọi primitive trong group GLB. Dáng đứng nữ đưa tay gần hông, elbow hint theo vai.
- Sửa lỗi phát hiện khi QA: nén/prune bỏ vertex ẩn làm đổi bounds fitting và lún đế giày; lưu canonical bounds theo rig. Cổ lộ mảng da nền vì code cũ đo POSITION quantized mà bỏ decode trong inverse bind; nữ đo vị trí rendered bind rồi đảo weighted skin transform để chỉnh đúng.
- Vật liệu áo/quần/viền/giày riêng, normal weave nhúng tự tạo. Da/mắt/tóc vẫn atlas nguồn. Download trong hộp ghi công trỏ đúng derivative nữ; manifest nền giữ nguyên.
- `scripts/build-temple-female-avatar.mjs` dựng offline và gọi optimizer npm glTF Transform4.5.1. Registry có thể cần mạng nếu chưa cache. Hai lần build liên tiếp cho cùng SHA256.

Asset cuối618832bytes, SHA256 `34309da8991aa5bd3bd41a47fdc9f128546278e3bf12d8590d6232d16ff3ad4b`; manifest riêng và attribution đi kèm. So file nền650556bytes, derivative nhỏ hơn31724bytes; chưa đo thời gian tải mạng thực hoặc texture memory/GPU đầy đủ.

## Bằng chứng kiểm tra

- `npm test`:493pass/0fail của runner hiện có, kèm assertions asset mới do reviewer độc lập viết. Kiểm checksum/nguồn/Walk, rendered bind so reference authoring (<1mm), skin weights, grouped morph, skeleton/morph độc lập, standing/thiền/41bowframes không dưới−5mm,80Walkframes trong envelope−6cm và reduced-motion. Ngưỡng Walk không phải chứng nhận mọi khung chân chạm sàn; không có test mesh-vs-mesh clipping toàn thân.
- `npm run build`: đạt, prerender skip theo base tương đối hiện có. Logs ở `.setest/di-chua-team/female-prototype-2026-11-04/`. `git diff --check` đạt; chỉ cảnh báo CRLF/LF.
- Browser thật Chrome1920×855 trong phòng DEV riêng: chọn Nữ trẻ, đi tới vườn, đứng nhìn trước/ba phần tư/nghiêng, thiền, tới Chánh Điện và chạy lễ ba lạy; xem model trong chế độ nhẹ rồi trả standard. Ảnh preview/front/meditating/bow-mid-motion/three-quarter và JSON trong evidence cùng thư mục. Ảnh bow-second-observed là khung đứng sau chu kỳ, không dùng làm bằng chứng cúi thấp. Một lần đợi selector progress0.5 hết hạn; đổi sang0.16 để quan sát nhịp đang cúi, không gọi ảnh đó là cực tiểu chính xác.
- Chưa có A/B cùng camera với nữ cũ; ảnh baseline chỉ so định tính. Telemetry FPS có cả1 và75 theo cadence/tab, không dùng làm benchmark. Chưa mobile vật lý, chưa hai phiên live cho asset mới (clone/state có test), chưa visual thử tải lỗi riêng mới; fallback cũ có test hiện có.

## Review và trạng thái

Reviewer `release_review` viết test độc lập, review runtime/export và không thấy finding chặn; đã sửa hai finding tài liệu (claim no-network và mô tả download nữ cũ). Reviewer `audit_graphics` xem ảnh: vai/nách bớt nêm, tay sát thân hơn, không thấy regression chặn ở các ảnh đã xem. Cổ vẫn giống cổ lọ, thân áo/vải còn đều và tay/ngón còn cứng; chưa đạt nhân vật game chân thực.

Mẫu thử local đã chạy để chủ dự án xem, server127.0.0.1:5173 giữ mở cùng tab nữ. **DC-A14 vẫn Doing** cho mục tiêu chất lượng tổng thể: cần cổ áo/nếp rủ từ rập tốt hơn, mặt/mắt/tóc/vải riêng, rig ngón và chuyển động tự nhiên, A/B đồng camera, QA mobile/tải lỗi/online phù hợp. Chủ dự án hỏi khả năng chất lượng như PUBG: coi là định hướng tham khảo, chưa tuyên bố mức tương đương hoặc tự sao chép asset của game.
