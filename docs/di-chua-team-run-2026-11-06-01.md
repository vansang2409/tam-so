# DC-A14 — chuyển trọng tâm sang mẫu nam

Tiêu chí do chủ dự án đặt: mẫu nam ít nhất ngang mẫu nữ hiện hành ở ảnh cận và toàn thân. Giữ mẫu nữ hiện hành; hai thử nghiệm trọng số giày nữ giữ riêng vì còn vấn đề cổ giày/ống quần khi cúi.

- Studio dùng loader thật cho visitor-male.glb để có áo lam như ở cảnh chùa. Bản nam hiện hành giảm độ phồng tay áo và hạ nhẹ vai. Chỉnh cổ theo vị trí bind sau skinning rồi đảo skin matrix, loại hai mảnh nhọn sau gáy trong ảnh WebGL nghiêng theo review độc lập. Còn gờ da nhẹ; chưa kiểm quay đầu. npm test 493 pass, build đạt.
- Dựng nam riêng từ MPFB game-engine rig với da nam Á Đông trẻ, mắt và tóc tách, áo/quần Toigo dùng làm lưới thử. GLB nguồn 10.729.960 byte, chưa tối ưu, chưa có Walk/Idle author. Nguồn theo các gói đã lưu trong .setest/character-authoring. Hình Blender cho thấy mặt trẻ nhưng tóc bóng và cổ hở. WebGL qua controller cho thấy da xuyên vải và mắt/tóc lệch, review độc lập loại ứng viên khỏi runtime. Kiểm bind và khớp rig trước khi cắt may áo lam hoặc thêm chuyển động.
- Ảnh kiểm mẫu runtime trong .setest/young-visitors/qa/; không dùng ảnh Blender để chứng minh chất lượng browser.
