# DC-A14 — chỉnh cặp da/quần vùng hông khi cúi sâu

DC-A14 vẫn Doing. Thử cùng một trường biến dạng khu trú cho da và quần đã skin, dịch vào 12 mm và hạ 6 mm tối đa. Vạt áo giữ dáng gốc. Mục tiêu là giảm quần nhô ở góc trước và giữ da được che kín.

- WebGL bốn góc cúi sâu. ROI bên hông ghi 0 pixel màu da ở baseline và bản cặp, so với 1.342 khi nắn riêng quần mạnh. ROI trước ghi 144 pixel màu quần so với 365 ở baseline. Giới hạn là ngưỡng màu trong hai ROI và một thời điểm, không phải chứng minh che phủ mọi góc.
- Review độc lập bản đầu xác nhận mảng da lộ đã biến mất, nhưng vạt vẫn cuộn và có nếp chéo sắc ở đùi. Pháp tuyến tính lại trên mesh bake còn sinh đốm tối ở ngón tay. Bản sau mang pháp tuyến qua skinning, ảnh ngang không còn đốm đó, hai số đo màu nhãn giữ nguyên. Pháp tuyến bản sau chưa bù vi phân biến dạng vùng hông.
- Mã và ảnh trong .setest/character-bow-cloth/, tiền tố hip-paired và hip-paired-normals. Chưa kiểm chuyển pha hay morph runtime. Giữ prototype riêng.
