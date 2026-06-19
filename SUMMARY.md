# SUMMARY — Tam Sở (cập nhật 19/06/2026)

**Mục tiêu:** web Tarot/Thần số học/Tử vi cấp sản phẩm thương mại — đẹp, dễ dùng, nội dung sâu, giữ chân, SEO tốt, freemium. Web TĨNH (Vite+React+Tailwind, client-side, PWA). Lệnh: test `node tests/run.mjs` (296 mốc), build `npm run build`. Không backend/auth/db.

**Hiện trạng: v3.61.0, 296 test pass.** Giao diện tông giấy-cổ/kem. **Toàn bộ backlog actionable (H/M/A/C) đã XONG; chỉ còn nhóm LOW cần backend.** Domain: `https://tam-so.vercel.app` (tạm).

**Đã xong gần đây (phiên này):**
- LOGO (v3.61): emblem **"Trăng & sao"** — vầng trăng khuyết vàng ôm sao ✦ trên đĩa giấy-cổ. `src/components/Logo.jsx` + `public/logo.svg`; gắn nav + footer (thay ✦ cũ), favicon đổi sang trăng-sao nền đậm. (v3.60: đồng bộ design-system toàn trang.)
- DOMAIN (v3.59): đặt `SITE_ORIGIN` = `https://tam-so.vercel.app` (tạm, bỏ subpath /tam-so vì Vercel chạy ở root) — cập nhật seo.js + sitemap (216 URL) + index.html (og/canonical) + robots.txt + test; prerender & shareUrl tự khớp. Đổi domain lần sau: sửa `SITE_ORIGIN` + bulk-replace sitemap.
- C01 (v3.58): **prerender meta tĩnh** — `scripts/prerender.mjs` sinh 211 file route landing với title/description/canonical/og + JSON-LD breadcrumb riêng (crawler "view source" thấy meta đúng từng trang). An toàn: chỉ thêm file, KHÔNG sửa `index.html` (file:// nguyên vẹn); GUARD chỉ chạy khi base `/` (Vercel), skip base `./` (Pages); try/catch không chặn build. Nghiệm thu serving khi Vercel live.
- C06 đợt 4 ⇒ **C06 XONG** (v3.57): thêm `saoKhuyen.js` — lời khuyên cho 14 chính tinh, render trên Lá Số (SAO_CUNG vốn đã dày 168 luận điểm). Trọn C06: 12 cung · 78 lá Tarot · 12 Số · sao×cung.
- C03 (v3.56): **trang Sinh năm** `/sinh-nam` + `/sinh-nam/:year` (1900–2100) — tự sinh từ `tinhCanChi`: con giáp, Can Chi, ngũ hành nạp âm + mệnh, tính cách, hợp/khắc tuổi; meta riêng + sitemap 1950–2025 (+77 URL ⇒ 216). Giọng tham khảo.
- A02 + M05 + C05 (v3.55): **og:image động** (lá Tarot dùng ảnh RWS riêng khi share) · **Skeleton tải thống nhất** (`Skeleton.jsx` + CardImage shimmer khi tải ảnh, giảm giật layout) · **rà giọng C05** (test quét >800 luận điểm chặn câu over-claim + đảm bảo mọi trang hệ có khung "tham khảo").
- C04 (v3.54): **trang Hợp tuổi** `/hop-tuoi` + 12 trang `/hop-tuoi/:slug` — xếp 12 con giáp theo Tam/Lục hợp – Lục/Tứ hành xung (dùng `hopTuoiChi`), giọng tham khảo; meta+breadcrumb+sitemap (+13 URL ⇒ 139); link công cụ năm-sinh.
- C06 đợt 3 (v3.53): **làm dày 12 Số Chủ Đạo** — thêm `src/data/numerologyDeep.js` (tinhYeu/suNghiep/taiChinh/loiKhuyen cho 1–9, 11, 22, 33) render trên trang Số. Còn lại C06: đợt 4 — 168 sao×cung.
- C06 đợt 2 (v3.51–3.52): **làm dày TRỌN 78 lá Tarot** — `src/data/tarotDeep.js` (22 Ẩn Chính) + `src/data/tarotDeepMinor.js` (56 Ẩn Phụ) gộp thành `TAROT_DEEP` key theo id (toàn cục duy nhất 0–77); mỗi lá có love/work/finance/advice, render trên CardPage (thêm mục 💰 Tài chính). Còn lại C06: 12 Số Chủ Đạo → 168 sao×cung.
- C06 đợt 1 (v3.50): **làm dày 12 cung hoàng đạo** — thêm `src/data/zodiacDeep.js` (tomTat/tinhCach/sucKhoe/loiKhuyen; giọng tham khảo + caveat "không thay tư vấn y tế"), render thêm mục trên trang cung; +7 test (độ dài tối thiểu + chặn từ phán tuyệt đối). Còn lại 78 lá → 12 số → sao×cung.
- **DEPLOY**: GitHub Pages (Actions) đang **fail vì tài khoản bị khoá billing** (KHÔNG phải lỗi code — job "not started due to billing"). Đã thêm đường deploy thay thế **Vercel**: `vercel.json` (SPA rewrite) + `vite.config` base '/' khi env `VERCEL`. Repo cũng đã đổi nhánh main→master (sửa `deploy.yml` trigger `master`). SEO URL còn trỏ github.io/tam-so — chờ domain Vercel để cập nhật.
- C02 (v3.49): **Tử vi hôm nay theo 12 con giáp** — route `/con-giap` + 12 trang `/con-giap/:slug`; `src/data/congiap.js` (CONGIAP_SLUG phân biệt Tý↔Tỵ, dailyConGiap tất định dùng chung engine `dailyReading` tách từ zodiac.js, hopKhacChi tam/lục hợp + lục xung, recentYears) + `src/pages/ConGiap.jsx`; meta động + breadcrumb + sitemap (+13 URL, tổng 126); link trên Home. Phần 12 cung daily đã có sẵn (H04/H05) ⇒ C02 xong.
- A01 (v3.48): SEO meta cho 8 TRANG INDEX hệ — canonical + og:url + breadcrumb 2 cấp (thêm `SeoTag.jsx`; wire usePageSeo/SeoTag).
- A03 (v3.48): khối **"Nội dung liên quan"** (internal-link chéo đa hệ) trên 102 trang sâu — `src/data/related.js` (thuần) + `RelatedLinks.jsx`; ánh xạ Golden Dawn (cung↔Ẩn Chính) + số may mắn, ≥3 link/trang (tối đa 1/hệ), route 100% hợp lệ.
- ~102 trang landing SEO: 12 cung `/cung-hoang-dao/:slug` · 78 lá `/tarot/:slug` · 12 số `/than-so-hoc/so/:n` (đều meta động + sitemap, tổng 113 URL).
- Retention: Home có lời chào + streak + quick-start 3 nhu cầu + widget 'Tử vi hôm nay' theo cung đã lưu; 'Tử vi hôm nay' (dailyHoroscope tất định) trên trang cung.
- Tử Vi: doSangSummary (tóm tắt độ sáng Mệnh) + 'Dòng đại hạn cả đời' + đưa lá số vào Hồ sơ (report.js).
- Tarot: trải 'Tài chính', điều hướng lá trước/sau.
- H07: trang 404 NotFound + catch-all; slug sai → NotFound.
- FIX: Modal nền tối → kem sáng (mọi popup đọc được).

**Tác vụ TỰ ĐỘNG đang chạy:** 'tam-so-ai-employee' (hiển thị 'ABC XYZ'), mỗi 10 phút, chạy đến khi user nhắn 'dừng'. Tự đọc CLAUDE/TASK_BOARD/SUMMARY/WORK_LOG → chọn task cao nhất (hoặc TỰ lên task khi backlog mỏng) → sửa (node fs) → test → build /tmp/b → present → log. Khóa chống chồng: `.tamso-run.lock` (epoch nội dung; giữ=date+%s, nhả=echo 0; KHÔNG rm vì mount D: chặn).

**Backlog ưu tiên (TASK_BOARD.md):** C01 SSG/prerender (High) · C06 LÀM DÀY diễn giải (High, theo đợt 12 cung→78 lá→12 số→168 sao×cung) · C03/C04 long-tail sinh-năm/hợp-tuổi · C05 giữ giọng không giật tít · M04/M05 (agent đang làm).

**Gotcha (CỐT YẾU):** ổ D: cắt cụt file khi Write/Edit/cat>> → CHỈ ghi nguồn bằng `node fs.writeFileSync` + verify ngoặc/tail + chạy test. Build /tmp/b (dựng lại nếu /tmp bị xoá). KHÔNG push từ sandbox; user tự chạy push-to-github.bat cuối ngày — KHÔNG nhắc. git local ok. Đối thủ tham khảo: thientue.vn (SEO programmatic lớn + tử vi ngày; mình hơn về trung thực/chính xác).

**Tiếp tục:** tác vụ tự chạy mỗi 10 phút (giữ app mở); hoặc nhắn 'tiếp tục'.
