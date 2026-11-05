# DC-A14 — tích hợp ngôi tóc lệch của mẫu nữ

DC-A14 vẫn Doing. Chọn bản upper đã sửa vệt da ở thái dương, vì ngôi bớt đối xứng và giữ đuôi bob cũ.

- QA studio WebGL Edge/ANGLE SwiftShader A/B cùng camera và ánh sáng. Đã xem toàn thân, cận chính diện và hai góc nghiêng, thiền và lạy. Review độc lập đồng ý tích hợp, không thấy vệt da cũ ở góc đối diện. Ở toàn thân khác biệt nhẹ, tóc vẫn còn cảm giác liền khối.
- Hai bên đều 24 calls và 114.390 render triangles mỗi khung studio. Chưa benchmark GPU thật. 0/96 khung Idle và 0/96 Walk có giao tóc/cổ áo trong một seed. Kiểm thêm đứng, quay đầu hai phía, thiền và lạy tại các pose được lấy mẫu, đều 0 giao cắt tóc/cổ áo.
- Tích hợp asset nguồn và build lại GLB public 2.398.924 byte, giảm 32 byte. Hash public và dist cùng khớp bản thử 478842fdd3339f369ae999e4aad0fb7b9121bdceb737700058c0bda5bceecb32. Ghi provenance CC0 của Toigo bob.
- npm test 493 pass / 0 fail. npm run build đạt, prerender bỏ qua theo cấu hình base tương đối. Ảnh và log tại .setest/character-temple-sweep/. Chưa xác minh trong cảnh chùa trên GPU thật. Chưa deploy.
