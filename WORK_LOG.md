# WORK_LOG — Tam Sở (đã NÉN 19/06/2026)

> Log chi tiết cũ đã gom thành changelog gọn bên dưới. Chi tiết kiến trúc/gotcha: CLAUDE.md · bàn giao: SUMMARY.md · backlog: TASK_BOARD.md.

## Changelog theo version
- **v3.59** — **Domain tạm**: `SITE_ORIGIN` → `https://tam-so.vercel.app` (bỏ subpath /tam-so vì Vercel chạy ở root). Cập nhật `seo.js`, `sitemap.xml` (216 URL), `index.html` (og/canonical/JSON-LD), `robots.txt`, test (shareUrl mock + SEO expect). Verify: prerender Vercel sinh canonical/og = tam-so.vercel.app; preview khớp. **296 test pass**. Đổi domain lần sau chỉ sửa SITE_ORIGIN + bulk-replace sitemap.
- **v3.58** — **C01**: prerender META tĩnh (`scripts/prerender.mjs`, chạy sau `vite build`) — sinh 211 file `dist/<route>/index.html` với title/description/canonical/og:image + JSON-LD breadcrumb theo từng trang ⇒ crawler "view source" thấy meta đúng. An toàn: KHÔNG sửa `index.html` (file:// ok); GUARD chỉ chạy khi base tuyệt đối `/` (Vercel), skip base `./` (Pages/file://); try/catch ⇒ không bao giờ chặn build. Verify node OK (211 file; the-fool có "Gã Khờ" + og ảnh RWS; index.html giữ nguyên). Còn cần nghiệm thu serving khi Vercel live. **296 test pass** (+4). **HẾT backlog actionable** (chỉ còn nhóm LOW cần backend).
- **v3.57** — **C06 đợt 4 ⇒ C06 HOÀN TẤT**: thêm `src/data/saoKhuyen.js` (lời khuyên 14 chính tinh) render trên Lá Số Tử Vi; xác nhận SAO_CUNG đã dày (168 luận ≥30 ký tự). Trọn C06: 12 cung · 78 lá Tarot · 12 Số · sao×cung. **292 test pass** (+5).
- **v3.56** — **C03**: trang Sinh năm `/sinh-nam` + `/sinh-nam/:year` (1900–2100) tự sinh từ `tinhCanChi` (con giáp, Can Chi, nạp âm/mệnh, tính cách, hợp/khắc tuổi) + `SinhNam.jsx`; meta riêng + sitemap 1950–2025 (+77 URL ⇒ 216 total). **287 test pass** (+6).
- **v3.55** — **A02** og:image động (CardPage dùng ảnh RWS của lá qua `absUrl`; `usePageSeo` nhận `image`) · **M05** Skeleton tải thống nhất (`Skeleton.jsx` + CardImage shimmer khi tải ảnh, object-contain không méo, giảm layout shift) · **C05** rà giọng: test quét >800 luận điểm chặn over-claim ("chắc chắn sẽ/nhất định sẽ/100% đúng"…) + mọi trang hệ có khung "tham khảo/chiêm nghiệm". **281 test pass** (+9).
- **v3.54** — **C04**: trang Hợp tuổi `/hop-tuoi` + 12 trang `/hop-tuoi/:slug` (xếp 12 con giáp theo Tam hợp/Lục hợp/Lục xung/Tứ hành xung dùng `hopTuoiChi`; giọng tham khảo, không định đoạt quan hệ) + `HopTuoi.jsx`; meta+breadcrumb+sitemap (+13 URL ⇒ 139). **272 test pass** (+5).
- **v3.53** — **C06 đợt 3**: làm dày 12 Số Chủ Đạo — thêm `src/data/numerologyDeep.js` (`NUM_DEEP`: tinhYeu/suNghiep/taiChinh/loiKhuyen cho 1–9, 11, 22, 33; giọng tham khảo) + render trên SoChuDaoPage. **267 test pass** (+7). Còn lại C06: đợt 4 — 168 sao×cung.
- **v3.52** — **C06 đợt 2b**: làm dày 56 lá Tarot Ẩn Phụ — thêm `src/data/tarotDeepMinor.js` (ids 22–77: love/work/finance/advice, bám từ khóa sẵn có + chất tố) gộp vào `TAROT_DEEP`; bỏ guard arcana ở CardPage vì id toàn cục 0–77 duy nhất. **TRỌN 78 lá Tarot đã dày**. **260 test pass**. Còn lại C06: 12 Số Chủ Đạo → 168 sao×cung.
- **v3.51** — **C06 đợt 2a**: làm dày 22 lá Tarot Ẩn Chính — thêm `src/data/tarotDeep.js` (`TAROT_DEEP` key id 0–21: love/work/finance/advice; giọng tham khảo, KHÔNG phán cứng) + render trên CardPage (thêm mục 💰 Tài chính; guard `arcana==='major'` để 56 lá Ẩn Phụ không lấy nhầm nội dung major). **259 test pass** (+8). Còn lại: 56 lá Ẩn Phụ → 12 Số Chủ Đạo → 168 sao×cung.
- **v3.50** — **C06 đợt 1**: làm dày 12 cung hoàng đạo — thêm `src/data/zodiacDeep.js` (`ZODIAC_EXTRA`: tomTat/tinhCach/sucKhoe/loiKhuyen; giọng tham khảo, phần sức khỏe có caveat "không thay tư vấn y tế", KHÔNG từ phán tuyệt đối) + render mục mới trên `Zodiac.jsx`. **251 test pass** (+7). Còn lại: 78 lá Tarot → 12 Số Chủ Đạo → 168 sao×cung. **Deploy**: thêm hỗ trợ Vercel (`vercel.json` SPA rewrite + base '/' khi env VERCEL) vì GitHub Pages Actions đang fail do account khoá billing; đã đổi nhánh main→master + sửa `deploy.yml` trigger master.
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
