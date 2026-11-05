# DC-A14 — dáng tóc lệch ở thái dương

DC-A14 vẫn Doing. Tiêu chí là phá dáng bob đối xứng, giữ đường tóc mềm và kiểm rủi ro xuyên tai/cổ áo.

- Hai prototype chỉnh POSITION/NORMAL của bob CC0 hiện có, giữ 2.852 tam giác và không thêm texture. Bản vuốt mạnh lùi 31 mm, tạo gấp rõ ở thái dương. Bản vuốt mềm lùi 19 mm, độ dịch tổng tối đa 19,8 mm và đường viền tự nhiên hơn khi nhìn chính diện và góc 3/4.
- Hai bản build GLB web riêng thành công. Bản mềm 2.398.924 byte. Mỗi bản có 0/96 khung Idle và 0/96 khung Walk giao tóc/cổ áo trong một seed. Phép kiểm này không đo giao cắt tóc với tai/da đầu.
- Đã xem Blender chính diện, góc nghiêng hai phía và toàn thân. Reviewer thấy một đốm da nhỏ mới ở biên tóc góc đối diện. Chưa xác minh là tai xuyên hay lộ do góc nhìn. Bản mềm vẫn giữ khối tóc khá liền ở toàn thân. Giữ cả hai prototype riêng trong .setest/character-temple-sweep/ và lấy bản mềm làm điểm xuất phát nếu tách lớp tóc thái dương.
- Chưa chạy WebGL trực quan hoặc đo GPU. Không sửa runtime hay ghi đè GLB public trong lượt này.
