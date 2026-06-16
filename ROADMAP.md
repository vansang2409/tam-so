# 🗺️ ROADMAP — Tam Sở

## ✅ 2.0–2.6 — Nền React; Tarot 78 lá + tranh RWS + luận giải đầy đủ; Thần số học; Tử vi (Can Chi ngày/giờ, giờ hoàng đạo, Tam Tai, hợp tuổi, Bát Trạch); Cung hoàng đạo; Kinh Dịch 64 quẻ; giao diện vàng nâu đất; Hồ sơ tổng hợp (chia sẻ link, In/PDF, tải ảnh PNG); tối ưu mobile
## ✅ 2.7 — Chiều sâu nội dung "pro" (hiện tại)
- **Kinh Dịch chuyên sâu**: luận giải 2–3 câu cho cả 64 quẻ (ý nghĩa + lời khuyên), hiện ở quẻ gieo và tra cứu.
- **Tử vi dày hơn**: luận tính cách 12 con giáp + ý nghĩa 30 nạp âm trong kết quả Can Chi.
- **Thần số học**: các thẻ số từ tên (Vận Mệnh/Linh Hồn/Nhân Cách/Trưởng Thành) hiện luận giải đầy đủ.
- Polish: favicon ✦, tiêu đề & mô tả trang chuẩn SEO.

## ✅ 2.8 — Kinh Dịch chuyên sâu & self-host ảnh (hiện tại)
- **Luận hào động khi gieo**: quy tắc đọc theo số hào động + ý nghĩa 6 ngôi hào (sơ→thượng; đắc trung / "đa hung" / "đa cụ" / ngôi chí tôn). Hiện ngay khi quẻ có hào động.
- **Nguyên văn thoán từ & hào từ**: mỗi quẻ (lúc gieo lẫn tra cứu) có liên kết tới bản nguyên văn (Dịch học Kabala) — đúng nguyên tắc "dẫn nguồn, không tự bịa".
- **Self-host ảnh Tarot**: `npm run fetch-cards` tải 78 ảnh RWS (public domain) về `public/cards/` + công tắc `LOCAL_CARDS` để chạy offline, nhanh hơn hotlink.

## ✅ 2.9 — Lịch âm chuẩn & hiệu ứng (hiện tại)
- **Đổi dương→âm lịch (Hồ Ngọc Đức, UTC+7)**: ô ① Tra Can Chi nhập đủ ngày/tháng → tự tính đúng **năm âm lịch** cho Can Chi & Tam Tai (chuẩn ranh giới Tết), hiện ngày âm; ô Can Chi ngày cũng hiện âm lịch. Đã kiểm chứng mốc Tết 1990/2000/2020/2024/2025.
- **Hiệu ứng**: sáu hào "rơi" so le khi gieo Kinh Dịch; lá Tarot "chia bài" so le khi rút. Thêm thẻ chia sẻ mạng xã hội (Open Graph).

## ✅ 2.11 — Thần số học sâu hơn & polish (hiện tại)
- **Đỉnh cao & Thử thách (Pinnacles & Challenges)**: 4 chu kỳ đời theo tuổi — công thức chuẩn, đối chiếu khớp ví dụ nguồn.
- **Đam mê tiềm ẩn & Bài học nghiệp quả**: từ tần suất chữ cái trong tên (số lặp nhiều nhất / số 1–9 vắng mặt). Thêm **Số Thái Độ** (ngày+tháng).
- **Mục "Hôm nay"** thêm ô **Con số ngày** (universal day number).
- **Lật mặt lá Tarot** khi rút (hiệu ứng 3D rotateY).
- **Tử vi**: tuổi âm (mụ) năm nay + cảnh báo "năm tuổi".
- **Hồ sơ tổng hợp**: Can Chi & cung phi dùng đúng **năm âm lịch**, hiện ngày âm (nhất quán với ô Tử vi).

## ✅ 2.10 — Mục "Hôm nay" & PWA
- **Mục "Hôm nay" ở trang chủ**: lá bài Tarot, quẻ Dịch (tất định theo ngày), Can Chi ngày + âm lịch + giờ hoàng đạo — bấm để mở công cụ tương ứng.
- **PWA**: cài như app (manifest + icon PNG), service worker cache offline (asset cùng origin) — mở lại không cần mạng sau lần đầu. Áp dụng cho bản online.
- **Lưu lá Tarot yêu thích**: gắn ★ ở thư viện & trong modal, bộ lọc "★ Yêu thích" riêng, lưu localStorage.

## 🔭 3.0 — Tiếp theo
- Đa ngôn ngữ Việt/Anh; hiệu ứng lật mặt lá Tarot.
- Backend khi cần lưu kết quả/tài khoản/AI luận giải phía máy chủ.

## 🧭 Nguyên tắc
1. Có nguồn mới đưa; chưa chắc ghi "cần kiểm chứng thêm". 2. Tách dữ kiện vs diễn giải.
3. Dữ liệu rời giao diện. 4. Kiểm thử + build sạch + kiểm mobile. 5. Tôn trọng bản quyền. 6. Ưu tiên dễ triển khai.
