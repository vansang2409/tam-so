# DC-A14 — thử mở rộng hiệu chỉnh sang đùi nam

V24 thêm vùng làm dịu quanh hit quần ở (456,551) của ảnh thiền. Dùng cùng bind V19 để giữ correction V23 quanh gối, thêm guard hướng ra ngoài tối đa 4 mm tại đùi, giới hạn dịch tổng 18 mm. Prototype 595 đỉnh nhận delta, giữ ngoài runtime.

WebGL A/B đứng, thiền hai góc và lạy. Review độc lập thấy thay đổi chủ yếu ở bóng dưới tay, gờ đùi vẫn rõ, không thấy mảng da mới trong ảnh thiền. Lợi ích chưa đủ để thay V23. Asset và ảnh .setest/character-authoring/ và .setest/young-visitors/qa/male-v24-*.png. Runtime giữ V23, chưa chạy lại full test/build.
