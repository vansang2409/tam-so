# SEO_PLAN — Tam Sở

## Đã có
title/description động mỗi trang, H1/H2, `public/sitemap.xml`, robots, OG tags, JSON-LD (WebSite/Org), FAQPage, URL sạch path-routing (spa-github-pages + 404.html), PWA.

## Cơ hội lớn (chưa làm)
1. **Trang nội dung sâu từng CUNG HOÀNG ĐẠO (12)** — `/cung-hoang-dao/bach-duong`… mỗi trang: tính cách, tình yêu, công việc, tài chính, hợp/khắc, ngày-màu-đá may mắn + meta + JSON-LD. → kéo long-tail "cung X tính cách/ hợp với cung nào".
2. **Trang ý nghĩa từng LÁ TAROT (78)** — `/tarot/the-fool`… ý nghĩa xuôi/ngược, tình/công/tài, từ khóa + ảnh RWS (PD) + meta. → long-tail "ý nghĩa lá X".
3. **Trang giải thích chỉ số Thần số học** (Số chủ đạo 1–9, 11/22/33…).
4. Internal link chéo: từ công cụ → trang nội dung tương ứng và ngược lại.
5. Sitemap mở rộng cho các URL nội dung mới; breadcrumb JSON-LD.

## Triển khai an toàn (không cần backend)
Tận dụng data có sẵn (`zodiac.js`, `tarot.js`) render trang tĩnh theo route param. Vì là SPA path-routing, bổ sung prerender/route cho bot (đã có spa-github-pages). Ưu tiên H05 (cung) trước (chỉ 12 trang, ROI cao), rồi H06 (78 lá).

## Đo lường
Sau deploy: kiểm Search Console index, tốc độ (Lighthouse), thẻ OG (Facebook/Zalo debugger).
