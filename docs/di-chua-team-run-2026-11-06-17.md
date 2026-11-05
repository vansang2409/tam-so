# DC-A14 — đối chiếu nam/nữ và gọn cổ nam V18

So WebGL bằng loader thực, camera/ánh sáng đồng nhất, 20 cặp ảnh gồm đứng toàn thân, mặt trước/nghiêng, lưng, thiền, ba pha lạy và 12 mẫu Walk. Đây là khung lấy mẫu, không phải kiểm liên tục. Review độc lập V17 thấy mặt/nhắm mắt gần nữ, chênh rõ ở cổ cuộn, nẹp nhô và bo lai/tay kiểu áo nỉ. Thiền vẫn có nếp siết gối và gờ đùi nam. Studio đứng 25 calls/114.798 tam giác ở nam, 24/114.390 ở nữ; số gồm cảnh studio và bóng, không phải benchmark GPU.

V18 cắt sáu tam giác đầu nẹp vượt chân cổ và làm dịu pháp tuyến chân cổ, giữ vị trí/weights và clip. WebGL A/B đứng, thiền, cúi. Review độc lập xác nhận cổ bớt hai lớp khi đứng/thiền, nẹp còn liền và không thấy lộ da mới. Mép cổ vẫn hơi dày/răng cưa khi cúi. Tích hợp local 1.829.632 byte, đúng hash bản thử. 493 test pass, build đạt. Bằng chứng .setest/young-visitors/qa/parity/ và male-v18-*.png. Mốc nữ chưa chốt, bo tay và lai còn cứng.
