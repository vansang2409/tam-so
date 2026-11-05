# DC-A14 — thử chuyển tiếp mí dưới và má

DC-A14 vẫn Doing. Thử tạo gờ chuyển tiếp mềm hơn ở dưới mắt, giữ mắt, tóc và clip hiện có.

- Patch trực tiếp GLB nguồn vào thư mục riêng, chỉnh 214 đỉnh da, tối đa 2,18 mm. Cập nhật pháp tuyến theo vi phân và delta chớp mắt ở các đỉnh liên quan. Kiểm byte gốc ngoài POSITION/NORMAL, giữ nguyên rig, vật liệu và 23 channel trên mỗi clip Idle/Walk.
- Review phát hiện phạm vi cập nhật sparse normal cần tính cả đỉnh chỉ có delta vị trí. Đã dùng hợp vùng hỗ trợ POSITION/NORMAL, xuất và build lại GLB riêng thành công.
- Blender A/B chính diện và góc 3/4 trên cùng ánh sáng cho thấy gờ rõ hơn nhưng dễ đọc thành bọng mắt. Review độc lập đồng ý giữ riêng. Chưa kiểm nhắm mắt giữa chừng, WebGL và toàn thân. Runtime giữ bản trước. Bằng chứng trong .setest/character-orbit-study/.
- Các lần chỉnh má và gờ dưới mắt đều cho lợi ích nhỏ. Hướng thử kế tiếp là thay đổi silhouette tóc ở thái dương theo ảnh tham chiếu trước khi quay lại hình khối mắt.
