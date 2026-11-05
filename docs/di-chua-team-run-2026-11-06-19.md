# DC-A14 — kiểm nếp gối nam ở tư thế thiền

V20 làm mượt pháp tuyến vùng quần gối/đùi trên 2.558 đỉnh, không đổi vị trí và weights. WebGL A/B đứng, thiền và lạy. Review độc lập thấy bóng đổi rất nhẹ, khe tối ở gối và gờ đùi vẫn còn. Giữ V19 runtime.

Dò sáu tia ở pose thiền bằng GLB V19 tối ưu, tính lại bounds mesh đã skin. Cả sáu chạm quần trước. Tại khe tối (380,600), có năm hit quần trong 2,6 mm theo tia; các điểm lân cận cũng gặp nhiều mặt quần trước da. Đây là chứng cứ các lớp quần chồng trong ảnh, chưa xác nhận mức tự giao hoặc mặt nào cần dịch. Cần chỉnh lưới/weights theo pose tại vùng tam giác đánh dấu, không chỉ làm mượt shading. Không đổi runtime, chưa chạy lại full test/build. Ảnh và tia tại .setest/young-visitors/qa/.
