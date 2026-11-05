# DC-A14 — chuyển Idle/Walk sang rig nam V12

V12 dùng V11 làm nền. Chuyển hai clip đã ghi nguồn của mẫu nữ qua độ lệch quay so với bind trong hệ tọa độ chung, rồi suy ra local rotation từ cha đích. Giữ nhịp mẫu, chuẩn hóa dấu quaternion giữa khung và chuyển biên độ pelvis theo tỷ lệ bind. Xác nhận chuỗi xương cha có track phù hợp cho hai clip. Giữ bytes hình học, rig, ảnh, vật liệu và lưới gốc.

GLB riêng .setest/character-authoring/young-male-v12-motion.glb có Walk 137 mẫu, 1,133 s và Idle 421 mẫu, 14 s, mỗi clip 23 channel. WebGL kiểm đứng/Idle/Walk, review độc lập chưa thấy xuyên lớn trong ảnh mẫu; có chấm sáng nhỏ trên nẹp khi đi. Controller CPU kiểm 841 khung Idle và 241 Walk ở 60 Hz, điểm thấp nhất khoảng 3 mm tại các mẫu. Số này xác nhận hiệu chỉnh mặt sàn, chưa đo độ trượt chân hoặc kiểm nối vòng bằng video. Chưa blink, tối ưu hoặc đưa vào runtime. Mẫu nam chưa đạt mốc nữ. Bằng chứng .setest/young-visitors/qa/.
