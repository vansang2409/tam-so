# DC-A14 — chuyển động đứng nam

Doing. Mẫu `male-human-v1` dùng cùng độ lệch pha Walk/Idle theo actor và hệ số làm dịu đầu khi đứng như `female-human-v1`. Hệ số giảm dần khi chuyển sang đi. Mẫu dự phòng giữ logic cũ. Bản GLB vẫn là V23.

Kiểm bốn actor lệch pha và so 100 khung đứng của nam với AnimationMixer lấy mẫu clip gốc. `node tests/temple-detail-models.mjs` đạt, `npm test` 493 pass / 0 fail, `npm run build` đạt. Review độc lập xác nhận phạm vi profile và khôi phục mẫu mixer trước bước làm dịu. Kiểm browser Edge WebGL local, 22 cặp khung cùng camera gồm cận mặt, toàn thân, Idle, Walk, thiền và các pha lạy. Ảnh và metadata trong `.setest/young-visitors/qa/parity-v23/`. Đây là kiểm bằng khung lấy mẫu trong studio trên desktop, không đo GPU thiết bị thật.

Mặt và tóc nam đọc rõ ở góc nghiêng. Cổ đứng và nẹp phía trước vẫn dày hơn mẫu nữ, có nếp cuộn ở cúi sâu. Chưa đạt mốc hình ảnh. Vòng kế tiếp ưu tiên cấu trúc viền cổ và nẹp, có đối chiếu độ che phủ lúc đứng, giữa pha và cúi sâu trước khi chọn asset.
