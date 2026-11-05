# DC-A14 — kiểm mẫu chỉnh hông trong chu kỳ cúi lạy

DC-A14 vẫn Doing. Mở rộng QA của bản hip-paired-normals sang cả hạ và nâng người, giữ baseline và prototype dùng cùng GLB, controller, camera và ánh sáng trong WebGL.

- Chụp nhãn vật liệu ở 13 mốc pha của một lần lạy, mỗi mốc ba góc (trước, ngang, sau). Tổng 39 cặp. Chụp thêm 9 cặp vật liệu thật ở pha hạ, cúi sâu và nâng. Script Playwright/Edge SwiftShader đóng trình duyệt sau khi hoàn tất, không có page error.
- Ngưỡng màu không phát hiện pixel quần baseline chuyển thành màu da trong 39 cặp. Có một pixel mới đạt ngưỡng màu da ở pha 0,70, góc trước, tọa độ x478 y629, không trùng mặt nạ quần baseline. Độ che phủ toàn bộ chu kỳ liên tục và các góc xen kẽ chưa được chứng minh.
- Số pixel màu quần trên cả canvas thay đổi từ -289 đến +1. Số này gồm thay đổi silhouette, không phải số đo riêng vùng hông. Ảnh vật liệu thật cho thấy dáng cúi khá giống baseline, mép vạt vẫn cuộn và phần thân dưới vẫn đọc thành các mảng. Chưa có cải thiện đủ lớn để tích hợp.
- Mã và ảnh tại .setest/character-bow-cloth/sequence*.py và .setest/character-bow-cloth/sequence/. Không đổi runtime. Dùng chu kỳ lấy mẫu này làm phép kiểm lại khi có mẫu vạt được author theo pose.

Review độc lập xác nhận số đo và không thấy lỗi silhouette mới rõ ở ảnh chuyển pha đã xem. Mép vạt phía sau vẫn mở rõ, mức cải thiện nhỏ nên giữ bản thử riêng.
