# DC-A14 — cổ đứng và nẹp khuy nam V3

Dựng cổ đứng từ vòng mép cổ đo trực tiếp trên lưới nam, nối nẹp và 8 khuy vào áo skinned. Lấy mặt trước qua BVH và truyền weights từ lưới áo. Prototype xuất thành công tại .setest/character-authoring/young-male-v3-aolam.glb. Không dùng asset mới ngoài nguồn CC0 đã ghi.

WebGL A/B đứng, thiền, lạy chạy thành công, ảnh tại .setest/young-visitors/qa/male-lam-v3-*. Hàng khuy giúp nhận ra áo lam khi đứng. Review độc lập thấy còn gờ ngang ngực, lai cuộn, nẹp đứt khi thiền, da lộ ở đầu gối và một số vùng khi cúi. V3 còn thiếu clip đi/chớp mắt. Giữ ngoài runtime và ưu tiên xử lý độ che phủ cùng nẹp trong pose trước khi tối ưu. Mẫu nam chưa ngang mẫu nữ. Không đổi bản đang chạy.
