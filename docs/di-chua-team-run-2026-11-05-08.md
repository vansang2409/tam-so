# DC-A14 — thử hình khối má

DC-A14 vẫn Doing. Tiêu chí cho lát cắt này là vùng dưới mắt chuyển vào má mềm hơn ở hai góc cận, giữ biên mí, miệng và nhận diện khuôn mặt.

- Tạo một thử nghiệm riêng từ GLB nguồn hiện tại. Chỉnh 132 đỉnh da, đẩy tối đa 2,80 mm, áp cùng delta lên các shape key để giữ delta tương đối. Không đưa asset ngoài vào.
- Blender render A/B chính diện và góc 3/4 trên cùng nguồn, camera, ánh sáng và seed. Áp hình học trực tiếp cho B trong scene để loại khác biệt do export/import. Ảnh và mã tại .setest/character-cheek-study/.
- Má bắt sáng rõ hơn chút, nhưng thay đổi vẫn đọc như làm đầy một mảng, chưa giải quyết đủ chuyển tiếp mí dưới và má. Giữ prototype riêng. Bản export Blender cũng cảnh báo sampler của một số vật liệu, nên nếu tiếp tục cần patch giữ nguyên dữ liệu ngoài hình học và kiểm lại chuyển động.
- Chưa kiểm prototype trong WebGL hoặc toàn thân. Không đổi runtime, không chạy lại test/build toàn dự án.

Review độc lập xác nhận lợi ích thị giác nhỏ. Bản re-export đổi mỗi clip Idle/Walk từ 23 lên 159 channel và số mesh từ 11 xuống 10. Giữ bản thử riêng và dùng patch bảo toàn các phần còn lại nếu tiếp tục chỉnh mesh.
