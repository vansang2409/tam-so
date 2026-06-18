# ✦ Tam Sở — Tarot · Thần số học · Tử vi · Chiêm tinh · Kinh Dịch

Ứng dụng web đa công cụ huyền học, xây bằng **Vite + React + Tailwind CSS**. Mọi tính toán chạy phía trình duyệt — không cần máy chủ.

> **Lưu ý.** Các hệ thống này là *tín ngưỡng – văn hóa*, **không phải khoa học**. Dự án tách bạch phần *tính toán* (kiểm chứng được) và phần *luận giải* (truyền thống, tham khảo). Xem trang **Nguồn & Lưu ý**.

## Tính năng
- **Tarot (78 lá):** rút nhanh một lá (ngẫu nhiên mỗi lần), 6 kiểu trải (1/3 lá, Tình yêu, Sự nghiệp, Celtic Cross, Có/Không), tùy chọn bài ngược, **lá bài chủ đạo** theo ngày sinh, **lịch sử rút** (localStorage), thư viện lọc theo chất; **luận Tình yêu/Sự nghiệp riêng từng lá** (22 Ẩn Chính + 56 Ẩn Phụ); **chép/chia sẻ** lá vừa rút và cả kết quả trải bài; **chip câu hỏi gợi ý** bấm là rút.
- **Thần số học:** Số Chủ Đạo, Vận Mệnh, Linh Hồn, Nhân Cách, Trưởng Thành, Số Ngày Sinh, **biểu đồ Lo Shu** (số thiếu), **Nợ nghiệp** (13/14/16/19), **Năm/Tháng/Ngày cá nhân**, **Đỉnh cao & Thử thách** (4 chu kỳ đời), **Đam mê tiềm ẩn**, **Bài học nghiệp quả**, **Số Thái Độ**, **xu hướng Năm cá nhân kế tiếp**, **Bảng hợp Số Chủ Đạo** (ma trận 12×12, kể cả 11/22/33); chia sẻ/lưu kết quả + tự điền lại từ liên kết.
- **Tử vi / Can Chi:** Can Chi năm + nạp âm, **tự quy đổi âm lịch** (Hồ Ngọc Đức — chuẩn ranh giới Tết), **xem hợp tuổi** (tam hợp/lục hợp/tứ hành xung/lục xung/can/ngũ hành), **Can Chi ngày & giờ**, **giờ hoàng đạo**, **Tam Tai**, **tuổi âm/năm tuổi**, **Sao hạn Cửu Diệu** (đối chiếu bảng 2026), **Bảng hợp tuổi 12 con giáp** (ma trận Tam hợp / Lục hợp / Lục xung / Tứ hành xung); chia sẻ liên kết.
- **Cung hoàng đạo:** 12 cung phương Tây, **Decan (thập phân)**, **tương hợp hai cung** và **Bảng tương hợp nhanh 12×12**, màu/đá/số may mắn; chia sẻ liên kết.
- **Tương hợp (2 người):** ghép hai ngày sinh — tương hợp **Số Chủ Đạo + Can Chi + cung hoàng đạo** + tổng kết.
- **Hồ sơ tổng hợp:** nhập một lần → Số Chủ Đạo, Can Chi (+ giờ Can Chi & âm lịch), cung hoàng đạo, cung phi, lá Tarot chủ đạo, Đỉnh hiện tại; **Báo cáo tổng hợp** (theo chủ đề + Sao hạn + gợi ý 7 ngày; nút Chép/📄.txt), nhớ lịch sử, chia sẻ link/PNG/PDF.
- **Kinh Dịch:** **gieo quẻ** 3 đồng xu hoặc **theo ngày giờ (Mai Hoa Dịch Số)** (hào động → quẻ biến), **luận hào động** (quy tắc số hào động + ý nghĩa 6 ngôi hào), tra cứu đủ **64 quẻ** Văn Vương. Mỗi quẻ có **Thoán từ (lời quẻ)** + đầy đủ **6 hào từ** — tổng **64 Thoán + 384 hào từ**, phỏng dịch tiếng Việt từ bản **James Legge 1899 (phạm vi công cộng)**; kèm **link nguyên văn**; các quẻ lời nặng có thêm câu **"Hiểu nôm na"** diễn nôm, trấn an, hướng hành động.
- **Trang chủ "Hôm nay" + PWA:** **bấm để rút** lá bài & gieo quẻ (mỗi lần một kết quả ngẫu nhiên — không tự hiện sẵn) kèm **diễn giải tại chỗ** + khung trấn an; Can Chi/âm lịch/giờ hoàng đạo/con số của ngày; **câu gợi mở phản tư** đổi theo ngày; **cài như ứng dụng** và **chạy offline** (PWA).
- **Giao diện & SEO:** tông **giấy cổ/kem** sáng (tương phản đạt WCAG AA), nút chia sẻ ở cả 6 hệ; **URL thường** (path-routing kiểu spa-github-pages) + sitemap + OG + JSON-LD + **FAQPage**; trang Nguồn có **Thuật ngữ thường gặp** và **Bản quyền & Ghi công**.

## Chạy & triển khai
```bash
npm install && npm run dev      # phát triển → http://localhost:5173
npm run build                   # build ra dist/
npm test                        # chạy 83 kiểm thử logic (tests/run.mjs)
```
Xem nhanh: mở `dist/index.html` (base './'). Deploy: kéo `dist/` lên Netlify Drop, hoặc nối Git với Vercel/Netlify (build `npm run build`, publish `dist`), hoặc GitHub Pages.

### Tự host ảnh Tarot (tùy chọn — chạy offline, nhanh hơn)
Mặc định `LOCAL_CARDS = true`: web ưu tiên ảnh nội bộ `public/cards/`; nếu chưa có sẽ tự lùi về Wikimedia Commons (hotlink), cuối cùng là **thẻ bài vẽ sẵn** (không vỡ giao diện). Để có tranh RWS thật mọi lúc/offline:
```bash
npm run fetch-cards          # tải 78 ảnh RWS (public domain) -> public/cards/
```
Rồi commit thư mục `public/cards/` và `npm run build`. Ảnh RWS (1909) thuộc phạm vi công cộng. Công tắc `LOCAL_CARDS` nằm ở đầu `src/data/tarot.js`.

## Cấu trúc
```
src/
├── main.jsx · index.css
├── components/  Layout · Modal · Disclaimer/Badge
├── data/        tarot.js (78 lá) · numerology.js · tuvi.js · zodiac.js · iching.js (64 quẻ) · lunar.js · report.js
└── pages/       Home · Profile · Tarot · Numerology · TuVi · Zodiac · TuongHop · IChing · Sources
tests/          run.mjs (npm test — 83 mốc)
```

## Đã kiểm thử
Mọi công thức đối chiếu mốc đã biết: 2026 = Bính Ngọ/Thiên Hà Thủy; **1/3/2000 = Mậu Ngọ** (Can Chi ngày); 16/6 = Song Tử; LP 22/10/1980 = 5; LP 13/4/1988 chạm nợ nghiệp 16; Kinh Dịch 64 quẻ với 64 mẫu nhị phân duy nhất; Sao hạn đối chiếu bảng 2026; ca biên Tết VN 1985 (≠ Tết TQ). Bộ test **npm test — 95 mốc, 0 fail**, gồm **test quét biên** (getZodiac/decan/zodiacCompat/lifePathCompat mọi cặp, Can Chi lặp 60 năm, castHexagram 60 lần) và **kiểm chứng đủ 64 Thoán + 384 hào từ Kinh Dịch**. Build production sạch (Vite).

## Bản quyền & Giấy phép
- **Ảnh Tarot Rider–Waite–Smith (1909)** — phạm vi công cộng (PD); bản quét từ Wikimedia Commons. Họa sĩ Pamela Colman Smith (mất 1951) & A. E. Waite.
- **Phông chữ** Be Vietnam Pro, Playfair Display — SIL Open Font License (Google Fonts).
- **Thư viện** React, Vite, Tailwind CSS, React Router, html-to-image — giấy phép MIT.
- **Lịch âm** — thuật toán Hồ Ngọc Đức (ghi công tác giả).
- **Nội dung luận giải** — Tam Sở tự biên soạn bằng tiếng Việt từ ý nghĩa truyền thống, có dẫn nguồn tham khảo; không sao chép nguyên văn. Biểu trưng, icon và ảnh chia sẻ do dự án tự tạo.
- **Nội dung luận giải** do Tam Sở biên soạn bằng tiếng Việt từ ý nghĩa truyền thống, có dẫn nguồn; không sao chép nguyên văn. Biểu trưng/icon/OG do dự án tự tạo.

---
*Phiên bản 2.88 — © 2026 Tam Sở.*
