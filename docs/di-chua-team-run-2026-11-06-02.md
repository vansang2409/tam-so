# DC-A14 — sửa hình dáng xuất GLB của nam mới

Giữ mốc tối thiểu bằng mẫu nữ hiện hành. Lỗi da xuyên vải và tóc/mắt lệch của V1 xuất hiện cả ở bind pose WebGL. Đo bounds chính xác và bounds thường cho cùng kết quả; thêm fit bounds không thay đổi tỷ lệ. Bước xuất bỏ morph trong khi mesh cơ thể còn modeling shape keys.

Bake hình dáng hiện hành vào geometry trước khi xuất và đặt trọng số các phần gắn trên đầu theo bone head, theo pipeline đã dùng cho mẫu nữ. GLB V2 riêng tại .setest/character-authoring/young-male-v2-baked.glb. WebGL bind và dáng đứng qua controller không còn da xuyên diện rộng hay lệch mắt/tóc như V1. Review độc lập xác nhận. Ảnh .setest/young-visitors/qa/male-baked-*.png.

Mẫu vẫn có cổ tròn, gờ ngang ngực và bo eo kiểu áo len. Chưa có áo lam nam hoàn chỉnh, blink, Idle/Walk author hay QA tư thế thiền/lạy của V2. Giữ ngoài runtime. Các cảnh báo export sampler và giới hạn 4 ảnh hưởng mỗi đỉnh cần kiểm lúc hoàn thiện asset.
