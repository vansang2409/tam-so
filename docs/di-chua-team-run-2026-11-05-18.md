# DC-A14 — kiểm độ che phủ khi chỉnh quần ở hông

DC-A14 vẫn Doing. Thử nắn riêng quần đã skin ở hai bên hông, giảm theo độ cúi, để kiểm liệu vạt áo có thể giữ dáng hiện tại. Hai bản dịch vào trong/hạ xuống tối đa lần lượt 19/12 mm và 4/3 mm.

- WebGL A/B ở bốn góc, vật liệu gốc và màu nhãn. Cả hai bản làm da lộ ở góc ngang. ROI x465–564 y530–584 trong ảnh màu nhãn ghi 0 pixel màu da ở baseline, 337 ở bản nhẹ và 1.342 ở bản mạnh theo ngưỡng màu của phép đo. Bản mạnh còn tạo cạnh gãy ở đùi. Review độc lập xác nhận lỗi che phủ ở góc ngang và góc sau của bản mạnh.
- Đây là dịch chuyển thử trong preview của mesh quần, không phải phép đo khoảng cách tối thiểu giữa toàn bộ quần và da. Mức chỉnh nhỏ đã lộ da ở mẫu cúi sâu, nên không chọn nắn riêng lớp quần theo vùng hiện tại. Nếu thử lại, cần giải đồng thời độ che phủ da và ranh vạt theo pose, dùng ảnh màu nhãn làm điều kiện loại.
- Giữ mã và ảnh tại .setest/character-bow-cloth/. Chưa kiểm các pha chuyển tiếp. Không đổi runtime.
