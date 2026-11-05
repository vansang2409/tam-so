# DC-A14 — lai sau áo nam V56

Truy vòng hàn 36 đỉnh quanh lai, phát hiện các lớp 7–8 gập ngược ở tư thế thiền. V51 và V52 sửa dải lưới theo trục đứng nhưng mất che phủ ở lần lượt ba và hai điểm tia. V53 và V54 hạ lai dài hơn, giữ che phủ từ sau nhưng còn nếp tối ở hông. V55 fit theo tiết diện quần quanh hông, giữ độ che phủ nhưng tạo hai nét tối nhô ở góc nghiêng. V56 thu phạm vi về sau và giảm độ hạ mép, dịch tối đa 25,8 mm. Thay đổi nằm ở morph `templeSeatedShirt`. Điểm thấp nhất áo trong khung thiền thử cao hơn mặt sàn khoảng 130 mm.

WebGL desktop so V50/V56 ở bốn góc thiền, đứng, đi và ba pha lạy trong cả hai chế độ. Trong 169 cặp tia từ sau mỗi chế độ, 111 điểm giữ áo trước, 13 điểm chuyển từ quần sang áo, 32 điểm giữ quần và 13 giữ nền. Review độc lập thấy gờ cuộn thấp hơn, mép sau dài và liền hơn, không còn nét tối nhô như V55 ở góc nghiêng đã xem. Hai đầu lai vẫn hơi nhúm. Bằng chứng ở `.setest/young-visitors/qa/hem-v51/` đến `hem-v56/`. Phép đo chỉ xác nhận vùng và khung đã lấy mẫu.

`npm test` 493 pass / 0 fail, `npm run build` và `git diff --check` đạt. Edge SwiftShader trên `/di-chua` local tải đúng SHA V56, chuyển nam → nữ → nam, với reduced motion. Chưa kiểm thiết bị thật hoặc presence live.

GLB tích hợp 1.838.332 byte, SHA256 `743507a0df28b9c3212ccdb587df9184ab090a2ea7ba0f0e3c7e48d974930616`. DC-A14 vẫn Doing. So với mẫu nữ, lai sau nam còn vùng sáng tách ở hai đầu và tay áo vẫn ít nếp rủ ở cận cảnh. Chưa nghiệm thu chất lượng ngang mẫu nữ và chưa đến bước commit, push, tắt máy.
