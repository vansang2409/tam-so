# ✦ Tam Sở — Tarot · Thần số học · Tử vi · Chiêm tinh · Kinh Dịch

Ứng dụng web đa công cụ huyền học, xây bằng **Vite + React + Tailwind CSS**. Mọi tính toán chạy phía trình duyệt — không cần máy chủ.

> **Lưu ý.** Các hệ thống này là *tín ngưỡng – văn hóa*, **không phải khoa học**. Dự án tách bạch phần *tính toán* (kiểm chứng được) và phần *luận giải* (truyền thống, tham khảo). Xem trang **Nguồn & Lưu ý**.

## Tính năng
- **Tarot (78 lá):** lá bài hôm nay (tất định), 6 kiểu trải (1/3 lá, Tình yêu, Sự nghiệp, Celtic Cross, Có/Không), tùy chọn bài ngược, **lá bài chủ đạo** theo ngày sinh, **lịch sử rút** (localStorage), thư viện lọc theo chất.
- **Thần số học:** Số Chủ Đạo, Vận Mệnh, Linh Hồn, Nhân Cách, Trưởng Thành, Số Ngày Sinh, **biểu đồ Lo Shu** (số thiếu), **Nợ nghiệp** (13/14/16/19), **Năm/Tháng/Ngày cá nhân**, **Đỉnh cao & Thử thách** (4 chu kỳ đời), **Đam mê tiềm ẩn**, **Bài học nghiệp quả**, **Số Thái Độ**.
- **Tử vi / Can Chi:** Can Chi năm + nạp âm, **tự quy đổi âm lịch** (Hồ Ngọc Đức — chuẩn ranh giới Tết), **xem hợp tuổi** (tam hợp/lục hợp/tứ hành xung/lục xung/can/ngũ hành), **Can Chi ngày & giờ**, **giờ hoàng đạo**, **Tam Tai**, **tuổi âm/năm tuổi**.
- **Cung hoàng đạo:** 12 cung phương Tây, **tương hợp hai cung**, màu/đá/số may mắn.
- **Kinh Dịch:** **gieo quẻ** 3 đồng xu (hào động → quẻ biến), **luận hào động** (quy tắc số hào động + ý nghĩa 6 ngôi hào), tra cứu đủ **64 quẻ** Văn Vương, kèm **link nguyên văn thoán/hào từ** mỗi quẻ.
- **Trang chủ "Hôm nay" + PWA:** lá bài/quẻ/Can Chi & âm lịch của ngày; **cài như ứng dụng** và **chạy offline** (manifest + service worker, bản online).

## Chạy & triển khai
```bash
npm install && npm run dev      # phát triển → http://localhost:5173
npm run build                   # build ra dist/
```
Xem nhanh: mở `dist/index.html` (base './'). Deploy: kéo `dist/` lên Netlify Drop, hoặc nối Git với Vercel/Netlify (build `npm run build`, publish `dist`), hoặc GitHub Pages.

### Tự host ảnh Tarot (tùy chọn — chạy offline, nhanh hơn)
Mặc định ảnh 78 lá được lấy trực tiếp (hotlink) từ Wikimedia Commons. Muốn tải về máy:
```bash
npm run fetch-cards          # tải 78 ảnh RWS (public domain) -> public/cards/
```
Sau đó mở `src/data/tarot.js`, đặt `export const LOCAL_CARDS = true`, rồi `npm run build`. Lúc này web dùng ảnh nội bộ, không cần mạng. (Nếu deploy GitHub Pages với ảnh nội bộ, nhớ commit cả thư mục `public/cards/`.)

## Cấu trúc
```
src/
├── main.jsx · index.css
├── components/  Layout · Modal · Disclaimer/Badge
├── data/        tarot.js (78 lá) · numerology.js · tuvi.js · zodiac.js · iching.js (64 quẻ)
└── pages/       Home · Tarot · Numerology · TuVi · Zodiac · IChing · Sources
```

## Đã kiểm thử
Mọi công thức đối chiếu mốc đã biết: 2026 = Bính Ngọ/Thiên Hà Thủy; **1/3/2000 = Mậu Ngọ** (Can Chi ngày); 16/6 = Song Tử; LP 22/10/1980 = 5; LP 13/4/1988 chạm nợ nghiệp 16; Kinh Dịch 64 quẻ với 64 mẫu nhị phân duy nhất. Build production sạch (Vite, 48 modules).

---
*Phiên bản 2.11 — © 2026 Tam Sở.*
