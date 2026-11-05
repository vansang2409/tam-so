# DC-A14 — kiểm GLB nam tối ưu và hiệu chỉnh tốc độ bước

V13 tối ưu chạy WebGL đứng, Idle, đi, thiền và lạy. Sáu tia kiểm nách chạm áo trước; review độc lập thấy nách/đùi cũ kín ở ảnh cúi, mép cổ vẫn hơi gập.

Đo chân trụ trong controller, bước 1/120 giây, giữ seed và đi thẳng. Mỗi lần đo dùng 960 khung sau warm-up, điểm giày được tính nếu thấp hơn 8 mm ở cả hai khung kề. Chọn tốc độ clip riêng 1,086926761 m/s thay mức mượn 0,970470323. Ở tốc độ đi 1,35 m/s, trung vị vận tốc điểm giày gần sàn giảm 0,238→0,162 m/s, P90 0,820→0,817. Trung vị cũng giảm ở 1,12 và 1,50 m/s. Đây là phép đo trượt theo ngưỡng, còn chuyển động ở một số pha, chưa kiểm đi vòng hoặc đổi hướng. Bản build hiệu chỉnh chỉ đổi metadata tốc độ, BIN giống hệt.

Artefact .setest/character-authoring/young-male-v13-calibrated-web.glb; ảnh và phép đo tại .setest/young-visitors/qa/. Chưa đưa vào runtime và chưa hoàn thành mốc nữ.
