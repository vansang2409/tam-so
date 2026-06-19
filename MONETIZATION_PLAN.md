# MONETIZATION_PLAN — Tam Sở (freemium, CHƯA cài thanh toán)

Nguyên tắc: cho giá trị miễn phí dồi dào trước → tạo nhu cầu nâng cấp. KHÔNG chặn người dùng mới. Trung thực: nói rõ "tham khảo văn hóa", không bán "tiên đoán chắc chắn".

## Miễn phí (giữ nguyên, là phễu)
Rút Tarot cơ bản + vài trải, tử vi ngày, Can Chi, Số Chủ Đạo, lá số Tử Vi cơ bản, 1 phần báo cáo Hồ sơ, lưu lịch sử gần đây.

## Premium (tương lai)
- **Báo cáo cá nhân hóa đầy đủ** (PDF đẹp) — nền tảng PDF/PNG đã có.
- Luận giải chuyên sâu tình/công/tài theo lá số + Tứ Hóa nhập cung.
- Lịch sử & bộ sưu tập không giới hạn.
- Trải bài nâng cao / trải theo câu hỏi cá nhân hóa.
- Lá số tương hợp đôi chuyên sâu.

## Mô hình
Gói tháng · gói theo lượt (mở 1 báo cáo) · sau xa: affiliate (sách/khoá huyền học), quảng cáo nhẹ không phá trải nghiệm (lưu ý: nếu deploy trên hạ tầng có chính sách quảng cáo riêng thì tuân thủ).

## Bước kỹ thuật khi sẵn sàng
Thêm cờ `isPremium` (localStorage giả lập trước) → ẩn/hiện block premium + nút "Mở khoá". Tích hợp cổng thanh toán (Stripe/Momo/ZaloPay) ở giai đoạn có backend. CHƯA làm ở bản tĩnh hiện tại.
