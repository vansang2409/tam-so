# DC-A14 — thư giãn vùng vạt áo khi lạy

DC-A14 vẫn Doing. Thử làm dịu cạnh gấp ở hông trên bản đưa vạt ra trước. Nhóm đỉnh trùng trong tư thế bind để không tách đường UV. Thư giãn bốn lượt theo các đỉnh kề, giảm dần về ngoài vùng vạt và theo độ cúi.

- WebGL cùng camera ở bốn góc. Ở cúi sâu, nếp hông bớt góc cạnh nhẹ nhưng vạt vẫn nhô lên. ROI tách màu chính diện theo lượt trước ghi 243 pixel quần, so với 226 ở bản đưa vạt ra trước và 365 ở baseline. Review độc lập xác nhận cải thiện nhỏ, chưa đáng tích hợp.
- Kiểm thêm ảnh tại tiến trình 1/9. Vạt đổi đường ranh với đùi, nhưng vẫn thành mảng cứng. Đây là ảnh tĩnh giữa pha, chưa kiểm toàn bộ chuyển động. Chênh sáng của các bản bake còn chịu ảnh hưởng của pháp tuyến tính lại.
- Giữ riêng trong .setest/character-bow-cloth/ cùng ảnh relax và baseline-mid. Chưa đổi runtime. Loạt thử cho thấy làm mượt đỉnh chưa giải quyết cách vạt gập lên đùi, cần chỉnh hướng rủ của panel theo pose.
