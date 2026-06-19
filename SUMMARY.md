# SUMMARY — Tam Sở (cập nhật 19/06/2026)

**Mục tiêu:** web Tarot/Thần số học/Tử vi cấp sản phẩm thương mại — đẹp, dễ dùng, nội dung sâu, giữ chân, SEO tốt, freemium. Web TĨNH (Vite+React+Tailwind, client-side, PWA). Lệnh: test `node tests/run.mjs` (224 mốc), build `npm run build`. Không backend/auth/db.

**Hiện trạng: v3.48.0, 224 test pass.** Giao diện tông giấy-cổ/kem.

**Đã xong gần đây (phiên này):**
- A01 (v3.48): SEO meta cho 8 TRANG INDEX hệ — canonical + og:url + breadcrumb 2 cấp (thêm `SeoTag.jsx`; wire usePageSeo/SeoTag).
- A03 (v3.48): khối **"Nội dung liên quan"** (internal-link chéo đa hệ) trên 102 trang sâu — `src/data/related.js` (thuần) + `RelatedLinks.jsx`; ánh xạ Golden Dawn (cung↔Ẩn Chính) + số may mắn, ≥3 link/trang (tối đa 1/hệ), route 100% hợp lệ.
- ~102 trang landing SEO: 12 cung `/cung-hoang-dao/:slug` · 78 lá `/tarot/:slug` · 12 số `/than-so-hoc/so/:n` (đều meta động + sitemap, tổng 113 URL).
- Retention: Home có lời chào + streak + quick-start 3 nhu cầu + widget 'Tử vi hôm nay' theo cung đã lưu; 'Tử vi hôm nay' (dailyHoroscope tất định) trên trang cung.
- Tử Vi: doSangSummary (tóm tắt độ sáng Mệnh) + 'Dòng đại hạn cả đời' + đưa lá số vào Hồ sơ (report.js).
- Tarot: trải 'Tài chính', điều hướng lá trước/sau.
- H07: trang 404 NotFound + catch-all; slug sai → NotFound.
- FIX: Modal nền tối → kem sáng (mọi popup đọc được).

**Tác vụ TỰ ĐỘNG đang chạy:** 'tam-so-ai-employee' (hiển thị 'ABC XYZ'), mỗi 10 phút, chạy đến khi user nhắn 'dừng'. Tự đọc CLAUDE/TASK_BOARD/SUMMARY/WORK_LOG → chọn task cao nhất (hoặc TỰ lên task khi backlog mỏng) → sửa (node fs) → test → build /tmp/b → present → log. Khóa chống chồng: `.tamso-run.lock` (epoch nội dung; giữ=date+%s, nhả=echo 0; KHÔNG rm vì mount D: chặn).

**Backlog ưu tiên (TASK_BOARD.md):** C01 SSG/prerender (High) · C02 tử vi ngày 12 con giáp+cung (High) · C06 LÀM DÀY diễn giải (High, theo đợt 12 cung→78 lá→12 số→168 sao×cung) · C03/C04 long-tail sinh-năm/hợp-tuổi · C05 giữ giọng không giật tít · M04/M05 (agent đang làm).

**Gotcha (CỐT YẾU):** ổ D: cắt cụt file khi Write/Edit/cat>> → CHỈ ghi nguồn bằng `node fs.writeFileSync` + verify ngoặc/tail + chạy test. Build /tmp/b (dựng lại nếu /tmp bị xoá). KHÔNG push từ sandbox; user tự chạy push-to-github.bat cuối ngày — KHÔNG nhắc. git local ok. Đối thủ tham khảo: thientue.vn (SEO programmatic lớn + tử vi ngày; mình hơn về trung thực/chính xác).

**Tiếp tục:** tác vụ tự chạy mỗi 10 phút (giữ app mở); hoặc nhắn 'tiếp tục'.
