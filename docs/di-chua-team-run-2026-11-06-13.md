# DC-A14 — mẫu nam V13 trong Đi Chùa local

Tích hợp source chỉnh sửa và GLB tối ưu, dùng profile male-human-v1/53 joints, da và tóc riêng, áo lam skinned, Idle/Walk và blink. Kích thước 1.963.780 byte, hash GLB khớp bản đã kiểm. Builder hỗ trợ --male. Loader giữ vật liệu/áo author, tải Grab3D nam dự phòng khi GLB mới lỗi. Review độc lập phát hiện đường từ chối profile cần giải phóng tài nguyên giải mã; đã sửa và thử thực tế bằng cách phục vụ GLB legacy cho URL nam mới. Loader từ chối và mẫu nam dự phòng hiển thị.

Edge SwiftShader ở /di-chua xác nhận đúng SHA tải, model chi tiết nam hiển thị, chuyển nam → nữ → nam. Request ngoài localhost bị chặn, không kiểm online live. 493 test pass / 0 fail, npm run build đạt. Ảnh .setest/young-visitors/qa/male-runtime-courtyard.png. Chưa xác nhận ngang mẫu nữ: còn nếp ngang ngực, mép cổ khi lạy và một số pha bước còn trượt. Chưa commit/push/tắt máy theo điều kiện hoàn thành của chủ dự án. Vite local vẫn chạy để xem.
