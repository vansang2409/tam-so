# WORK_LOG — Tam Sở (đã NÉN 19/06/2026)

> Log chi tiết cũ đã gom thành changelog gọn bên dưới. Chi tiết kiến trúc/gotcha: CLAUDE.md · bàn giao: SUMMARY.md · backlog: TASK_BOARD.md.

## Changelog theo version
- **v3.49** — **C02**: "Tử vi hôm nay theo 12 con giáp" — route `/con-giap` + 12 trang `/con-giap/:slug`; thêm `src/data/congiap.js` (CONGIAP_SLUG phân biệt Tý↔Tỵ & Thìn↔Thân, `dailyConGiap` tất định dùng chung engine `dailyReading` tách ra từ zodiac.js, `hopKhacChi` tam/lục hợp + lục xung, `recentYears`) + `src/pages/ConGiap.jsx` (chân dung + tử vi hôm nay + hợp/khắc, giọng tham khảo); meta động + breadcrumb + sitemap (+13 URL ⇒ 126); link trên Home. Phần 12 cung daily đã có sẵn (H04/H05). **244 test pass** (+20). Build /tmp không cần — build native Windows + inline dist→`tam-so-test.html`.
- **v3.46→3.48** — Auto-task tự làm M04/M05 + **A03**: thêm `src/data/related.js` + `RelatedLinks.jsx` ⇒ 102 trang sâu có khối **"Nội dung liên quan"** (liên kết chéo Tarot–Cung–Số, nhãn tham khảo). **216 test pass**.
- **v3.46.1** — FIX bug: `Modal.jsx` nền tối cũ → **kem sáng** (mọi popup quẻ/lá đọc được).
- **v3.41–3.43** — **M02**: 12 trang Số Chủ Đạo `/than-so-hoc/so/:n`. **H02**: trải bài "Tài chính". **M06**: lá số Tử Vi + độ sáng vào báo cáo Hồ sơ. CardPage prev/next.
- **v3.44** — **H07**: trang 404 `NotFound` + catch-all `*`; sửa hồi quy `/tarot/:slug`; slug sai (số/cung/lá) → NotFound.
- **v3.38–3.40** — **H04+H05**: 12 trang cung `/cung-hoang-dao/:slug` + "Tử vi hôm nay" (dailyHoroscope tất định) + ZODIAC_DEEP. **H06**: 78 trang lá `/tarot/:slug`. Sitemap **113 URL**.
- **v3.37** — Trang chủ: lời chào + **streak** + quick-start 3 nhu cầu + widget "Tử vi hôm nay".
- **v3.32–3.36** — Bảng **độ sáng M/V/Đ/B/H** đầy đủ 14 chính tinh (nguồn tracuutuvi, Miếu khớp 100% HOROS) · `doSangSummary` · "Dòng đại hạn cả đời" · mục "Cách đọc lá số" · ghi chú tháng nhuận.
- **(trước v3.32)** 5 hệ đầy đủ (Tarot 78 lá · Thần số học · Tử vi/Can Chi · **Lá số Tử Vi Đẩu Số** · Kinh Dịch 64 quẻ + 64 Thoán/384 hào) + So đôi + Hồ sơ + Cung hoàng đạo + Tương hợp. Đổi sang tông giấy-cổ/kem. Chi tiết: ROADMAP.md.

## Hạ tầng tự động
Scheduled task **tam-so-ai-employee** (hiển thị "ABC XYZ"), 10 phút/lần — **đang PAUSE** (user tắt để tiết kiệm quota gói Max). Tự đọc file → chọn/tự-lên task → sửa (node fs) → test → build /tmp/b → log. Khóa chống chồng `.tamso-run.lock` (epoch nội dung; giữ=date+%s, **nhả=echo 0**, KHÔNG rm). Hiện đã nhả (=0), sạch.

## Phân tích đối thủ
thientue.vn: SEO programmatic quy mô lớn + tử vi ngày + render sẵn HTML; mình hơn về trung thực/chính xác. Bài học → backlog C01–C06.

## Backlog kế (khi bật lại): A01 (SEO index từng hệ) · A02 (og:image động) · M05 (loading skeleton) · C01 (SSG/prerender) · C02 (tử vi ngày 12 con giáp+cung) · C06 (làm dày diễn giải).

## ⚠ DỞ DANG (đợt bị cắt khi user pause) — CHỜ BUILD
- ĐÃ code+wire+test (224 pass) nhưng CHƯA build/bump/present: **M04 Bộ sưu tập** (Collection.jsx + collection.js + route /bo-suu-tap + nút lưu Tarot/Kinh Dịch + badge nav) & **A01 SEO từng trang** (useSeo.js/SeoTag.jsx + usePageSeo gắn 8 trang).
- File mới (untracked): src/pages/Collection.jsx, src/data/collection.js, src/components/useSeo.js, src/components/SeoTag.jsx, src/data/seo.js.
- VIỆC CÒN LẠI: chỉ cần BUILD /tmp/b (verify dist IDENTICAL + NUL=0) + bump sw/package + present. CHƯA build-verify JSX → build 1 lần trước khi deploy. ĐỪNG làm lại M04/A01 (đã xong).
