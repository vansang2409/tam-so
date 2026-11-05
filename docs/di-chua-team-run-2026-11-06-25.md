# DC-A14 — morph cổ nam riêng cho tư thế cúi V29

Tạo morph thử từ lưới áo đã skin ở cúi sâu, làm dịu theo lưới hàn, giữ hướng ra ngoài trục cổ, đảo skin affine theo đỉnh. 139 đỉnh nhận delta tối đa 9 mm. Chỉ kích hoạt morph trong preview thử, không thêm kênh vào controller chính.

WebGL A/B đứng/thiền/lạy. Review độc lập thấy mép cổ lúc cúi chỉ dịch nhẹ, nếp cuộn còn rõ, không thấy điểm lộ da mới trong ảnh đã kiểm. Morph mới chỉ có POSITION và một pose nguồn, chưa kiểm giữa pha hoặc đứng lên. Không chọn V29. Runtime giữ V23. Ảnh .setest/young-visitors/qa/male-v29-*.png. Cảnh báo thiếu bounds nằm trong accessor POSITION của morph quần ở GLB nguồn V23; GLB tối ưu có bounds. Không tuyên bố lỗi runtime từ cảnh báo nguồn.
