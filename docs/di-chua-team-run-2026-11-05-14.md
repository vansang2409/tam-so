# DC-A14 — xác định vùng quần lộ khi cúi lạy

DC-A14 vẫn Doing. Kiểm GLB hiện hành qua controller thật trong studio WebGL cục bộ. Chụp cùng camera ở bốn góc, một bộ vật liệu gốc và một bộ màu phân biệt áo/quần/da.

- Góc ngang cho thấy đường ranh áo và quần ở hông. Góc trước thấy hai vùng quần lộ nhỏ bên trên phần cẳng chân. Màu và tia xác nhận các vùng được kiểm là quần.
- Tia ban đầu bỏ sót áo do bounds skinned chưa được tính lại sau đổi pose. Tính lại bounds và kiểm cả hai mặt trong bản chẩn đoán. Ba điểm màu quần có bề mặt áo phía sau 41,7–119,4 mm theo hướng camera. Một điểm quần không có áo trên cùng tia. Hai điểm màu áo lân cận chạm áo trước. Khoảng cách theo tia không phải độ sâu xuyên lưới. Kết quả chỉ xác nhận thứ tự lớp cục bộ, chưa chứng minh ranh giới nào là mép áo tự nhiên hay xuyên qua vạt.
- Bằng chứng trong .setest/character-bow-cloth/, dùng fresh-witnesses.json cho phép đo cuối. Chưa đổi GLB/runtime. Cần chẩn đoán ranh giới giữa vạt và đùi tại các pixel kề nhau trước khi author morph có kiểm tra ảnh A/B.
