# DC-A14 — hiệu chỉnh quần nam khi thiền V23

Lấy điểm gối từ tia ở góc thiền, làm dịu lưới đã skin quanh hai gối rồi chuyển delta về local bằng nghịch đảo skin matrix theo đỉnh. V21 để lộ mảng da, V22 còn đốm nhỏ. V23 bỏ thành phần dịch vào trục chân và thêm tối đa 9 mm đệm hướng ra ngoài; tổng dịch mỗi đỉnh giới hạn 18 mm, 149 đỉnh nhận delta. Ghi morph templeSeatedPants, chỉ bật khi thiền qua controller có sẵn.

WebGL A/B đứng, thiền hai góc và lạy. Review độc lập thấy nếp tối mảnh hơn, hết đốm da ở hai góc, mép ngoài gối xa hơi góc cạnh. Cả chín tia tại nếp và vùng từng lộ da gặp quần trước. Test runtime xác nhận morph bật khi thiền và về 0 khi đứng/đi/lạy. GLB local 1.831.836 byte, hash 380f0867855807a69a43f5e170503e8e4b244eb5a8eb1e9a8f931b5d9e40565d. Ảnh/tia tại .setest/young-visitors/qa/. Nếp đùi xa và cổ khi cúi vẫn còn; chưa nghiệm thu mốc nữ.
