# PLAN_CODEX.md — Kế hoạch nâng cấp Tam Sở (bàn giao cho Codex)

> Soạn 29/06/2026, ngay sau **v4.0.0** (code-split theo route). Mốc hiện tại: **377 test pass**, deploy Vercel (`https://tam-so.vercel.app`), HEAD = `origin/master`.
> Đọc kèm `CLAUDE.md`, `SUMMARY.md`, `TASK_BOARD.md`, `WORK_LOG.md` trước khi bắt đầu.

---

## 0. QUY TẮC BẮT BUỘC (đọc trước khi gõ dòng code nào)

1. **KHÔNG dùng Edit/Write tool / IDE auto-save cho repo này.** Ghi qua mount ổ D: hay **cắt cụt file** khi nội dung phình → vỡ app. Mọi sửa đổi đi qua **`node fs.writeFileSync`** hoặc **`node scripts/safe-edit.mjs <spec.json>`**. Sau khi sửa: xem lại 3 dòng cuối + cân ngoặc + chạy test.
2. **Tách dữ kiện vs diễn giải.** KHÔNG phán tuyệt đối, không hù dọa, giọng trấn an, tiếng Việt dí dỏm nhẹ. Có test quét chặn over-claim ("chắc chắn sẽ", "nhất định", "100% đúng"…) — mọi nội dung mới phải qua được test này.
3. **Test trước & sau:** `node tests/run.mjs` (hiện 377 mốc). Thêm tính năng ⇒ thêm test, KHÔNG để giảm số mốc.
4. **Build KHÔNG chạy trên mount** (node_modules Windows). Dựng `/tmp/b`: copy `src`+config+`public`, `npm install`, build chính (`npx vite build`) + single (`vite-plugin-singlefile`, `inlineDynamicImports:true`, outDir `dist-single`); copy `dist-single/index.html` → `tam-so-test.html`. Verify single `NUL=0`. `dist/` đã .gitignore (Vercel tự build) — KHÔNG cần commit dist.
5. **Bump** `public/sw.js` (CACHE) + `package.json` version mỗi lần release.
6. **Git trên mount D: chặn `unlink`** → `git add/commit` tự tạo `.git/index.lock` mà không dọn được. Cách né đã kiểm chứng:
   - Dọn lock kẹt: `cd .git && : > index.lock && mv index.lock index.lock.del`
   - Commit bằng index tạm trên sandbox: `export GIT_INDEX_FILE=/tmp/ti; git read-tree HEAD; git add <files>; git -c user.name="Trần Văn Sang" -c user.email="vansang0105@gmail.com" commit -m "..."`
   - **Push**: sandbox KHÔNG có credential GitHub. Push từ máy Windows (`cd D:\tam-so; git push origin master`) — nơi có credential.
7. **Commit chỉ những file thật sự sửa** (tránh churn CRLF toàn repo). Xem mục Q1 để dứt điểm churn.
8. Làm xong là tự push (không cần hỏi lại), cập nhật `WORK_LOG.md`/`SUMMARY.md`/`TASK_BOARD.md`.

---

## 1. Lộ trình đề xuất (thứ tự ưu tiên)

| Bước | Task | Vì sao trước | Rủi ro |
|---|---|---|---|
| 1 | **Q1** .gitattributes (dứt CRLF churn) | Mọi commit sau sạch, dễ review | Thấp (1 commit normalize lớn, sau đó im) |
| 2 | **P2** lazy widget "quẻ hôm nay" | Nối tiếp v4.0.0, nhẹ chunk lõi | Thấp |
| 3 | **P3** prefetch chunk khi hover nav | Bù lại độ trễ điều hướng do code-split | Thấp |
| 4 | **Q5** ErrorBoundary cho lazy-load fail | An toàn UX khi mạng rớt giữa chừng | Thấp |
| 5 | **P4** tối ưu ảnh Đi Chùa (WebP + lazy) | Đi Chùa là chunk + ảnh nặng nhất | Trung bình |
| 6 | **F-/S-** chọn theo nhu cầu sản phẩm | Giá trị dài hạn | Tuỳ task |

---

## 2. HIỆU NĂNG (tiếp v4.0.0)

### P2 — Lazy-load widget "quẻ hôm nay" trên Home
- **Vấn đề:** chunk lõi `index` vẫn ~88KB gzip vì Home kéo `dayWeave.js` + `tarot.js` + `iching.js` (dệt quẻ hôm nay) vào bundle ban đầu.
- **File:** `src/pages/Home.jsx`, `src/components/Today.jsx` (và data `src/data/dayWeave.js`, `tarot.js`, `iching.js`).
- **Cách:** tách phần "Hôm nay/quẻ hôm nay" thành component lazy: `const Today = lazy(() => import('../components/Today.jsx'))`, bọc `<Suspense fallback={<div className="page-fallback"><span className="page-fallback-spinner"/></div>}>`. Đảm bảo mọi `import` data nặng nằm TRONG `Today.jsx` (không để Home import trực tiếp kéo ngược vào chunk lõi).
- **Xong khi:** build `/tmp/b`, đo `gzip` chunk `index-*.js` < ~70KB (giảm rõ so với 88KB); Home vẫn render widget sau 1 nhịp; `node tests/run.mjs` pass; thêm test khoá `Home.jsx` dùng `lazy(` cho Today.

### P3 — Prefetch chunk route khi hover/focus nav
- **Vấn đề:** code-split khiến lần đầu mở 1 trang phải tải chunk → có độ trễ nhẹ.
- **File:** `src/components/Layout.jsx` (Navbar / NavLink).
- **Cách:** map route → hàm import động (cùng các importer trong `main.jsx`). Trên `onMouseEnter`/`onFocus` của NavLink gọi importer (idempotent, trình duyệt cache module). Tôn trọng `navigator.connection?.saveData` (bỏ prefetch nếu bật). Nên đặt map importer ở 1 file dùng chung để `main.jsx` và `Layout.jsx` cùng tham chiếu, tránh lệch.
- **Xong khi:** hover mục nav → tab Network tải chunk tương ứng trước khi click; không lỗi console; test khoá có hàm prefetch + check saveData.

### P4 — Tối ưu ảnh Đi Chùa
- **File:** `public/dichua/*.png` (bát hương, ống xăm, 11 ảnh cảnh), dùng ở `DiChua.jsx`/`ShakeXam.jsx`.
- **Cách:** chuyển PNG nền-trong sang WebP (giữ alpha) — viết script Node tạm dùng `cwebp` qua bash hoặc `sharp` cài ở `/tmp/b` (KHÔNG thêm vào dependencies runtime); thêm `loading="lazy" decoding="async"` cho ảnh không nằm trên màn đầu; `<picture>` fallback PNG nếu cần. Lưu ý: dự án từng tự viết PNG decoder không-dependency (xem v3.99).
- **Xong khi:** tổng dung lượng ảnh Đi Chùa giảm ≥40%; trang vẫn hiển thị đúng (verify dev server thật, đo `naturalWidth`>0); không vỡ animation khói/lắc.

### P5 — PWA cache cho chunk động (kiểm tra)
- **File:** `public/sw.js`.
- **Cách:** đảm bảo runtime caching đã bắt `/assets/*.js` (chunk hash đổi mỗi build). Xác nhận strategy hiện tại hoạt động với nhiều chunk; bump CACHE khi đổi.
- **Xong khi:** offline mở lại các trang đã ghé vẫn chạy; không phục vụ chunk cũ sai sau deploy.

---

## 3. SEO + NỘI DUNG MỚI

### S1 — Trang kiến thức / blog tĩnh (long-tail)
- **Cách:** thêm `src/content/` chứa bài viết (JS object hoặc markdown import); route `/kien-thuc` + `/kien-thuc/:slug`; render mục lục + bài. KHÔNG cần backend. Mỗi bài có meta riêng (`usePageSeo`) + JSON-LD `Article`.
- **Chủ đề gợi ý (giữ giọng tham khảo):** "Tarot là gì, đọc sao cho lành mạnh", "Số chủ đạo tính thế nào", "Tử vi đẩu số nhập môn", "Kinh Dịch gieo quẻ ra sao".
- **Xong khi:** ≥5 bài thật, vào sitemap, prerender meta đúng, internal-link sang công cụ liên quan; test đếm bài + chặn over-claim.

### S2 — Trang long-tail công cụ mới
- Ví dụ: `/than-so-hoc/ten` (thần số học theo TÊN, Pythagorean), `/gio-hoang-dao` (giờ tốt hôm nay — đã có `monthCanChi`/giờ hoàng đạo trong `tuvi.js`).
- **Xong khi:** tính toán tất định, có nguồn/caveat, meta + sitemap + related links.

### S3 — Nâng prerender từ "meta" lên "nội dung" (SSG thật) — LỚN
- **Hiện trạng:** `scripts/prerender.mjs` chỉ chèn meta tĩnh; thân trang rỗng tới khi JS chạy.
- **Cách:** render React ra HTML tĩnh khi build (`react-dom/server` + route loader, hoặc `vite-react-ssg`/`vite-plugin-ssr`). Cân nhắc kỹ vì đụng kiến trúc — chỉ làm khi SEO là ưu tiên số 1.
- **Xong khi:** "view source" trang sâu thấy nội dung thật; không vỡ `file://`/single-file; test prerender mở rộng.

### S4 — Sitemap & dữ liệu có cấu trúc
- Mỗi route mới phải vào `public/sitemap.xml` + JSON-LD phù hợp (`Article`/`FAQPage`/`BreadcrumbList`). Giữ `SITE_ORIGIN` ở `src/data/site.js` là nguồn duy nhất.

---

## 4. TÍNH NĂNG MỚI CHO NGƯỜI DÙNG

### F1 — Mở rộng Đi Chùa (DC04/DC09)
- Thêm thẻ xăm (16 → 32/64/100, dữ liệu thuần `src/data/dichua.js`); mở thêm khu ("sắp ra mắt" → thật); thêm cảnh `TempleScene.jsx`.
- **Xong khi:** data thuần test bằng Node; xăm mới có diễn giải tham khảo (KHÔNG gọi "AI" vì không backend); +test.

### F2 — Retention không cần backend
- Nâng streak/nhắc quay lại; lịch sử thống nhất xuyên hệ (Tarot/Dịch/Đi Chùa) ở 1 chỗ; tuỳ chọn nhắc qua Notification API (xin quyền, có tắt).
- **Xong khi:** lưu localStorage; có nút xoá/tắt; không phiền nếu người dùng từ chối quyền.

### F3 — Công cụ mới
- "Quẻ hôm nay cá nhân hoá" theo ngày sinh; "La bàn ngày tốt"; "Tên hợp mệnh". Tất cả tất định, client-side, giọng tham khảo.

> ⚠ Đăng nhập / thanh toán / email / CMS / AI reading thật ⇒ **cần backend** → nhóm LOW, ngoài phạm vi web tĩnh hiện tại. Nếu muốn, tách thành dự án riêng.

---

## 5. CHẤT LƯỢNG & ĐỘ TIN CẬY

### Q1 — Dứt điểm churn CRLF (LÀM SỚM)
- **Vấn đề:** working tree CRLF vs HEAD LF → mọi `git diff` phình giả (8616+/8616-), khó review.
- **Cách:** thêm `.gitattributes` ở gốc:
  ```
  * text=auto eol=lf
  *.png binary
  *.jpg binary
  *.webp binary
  *.ico binary
  ```
  rồi normalize 1 lần: `git add --renormalize .` + commit "Normalize line endings to LF". Sau đó churn biến mất.
- **Xong khi:** `git diff --stat` sạch sau khi sửa 1 file nhỏ; build/test vẫn pass.

### Q2 — Tài liệu hoá workaround git vào CLAUDE.md
- Thêm mục "Git trên mount D: chặn unlink → dùng GIT_INDEX_FILE=/tmp/ti + read-tree + commit; push từ Windows". Tránh phiên sau dò lại.

### Q3 — Mở rộng test
- Thêm test cho mọi engine/diễn giải mới; test smoke build (parse `dist` chính + single NUL=0).

### Q4 — Accessibility pass
- Quét `aria-*`, focus-visible, tương phản (đặc biệt theme tối Đi Chùa + dark mode); vùng chạm ≥36px (đã sửa nhiều ở H09, rà phần mới).

### Q5 — ErrorBoundary cho lazy-load fail
- **File:** `src/components/ErrorBoundary.jsx` (đã có) + nơi bọc Suspense.
- **Cách:** nếu `import()` chunk fail (mạng rớt/deploy đổi hash) → hiện nút "Tải lại" thay vì màn trắng; cân nhắc auto-reload 1 lần khi ChunkLoadError.
- **Xong khi:** giả lập chunk lỗi → thấy fallback có nút thử lại; không lặp vô hạn.

---

## 6. Definition of Done (mỗi task)
1. Sửa qua `node fs`/`safe-edit.mjs` (KHÔNG Edit/Write tool).
2. `node tests/run.mjs` pass, số mốc ≥ trước (thêm test cho phần mới).
3. Build `/tmp/b` chính + single OK, single `NUL=0`, cập nhật `tam-so-test.html`.
4. Bump `sw.js` + `package.json`.
5. Giọng nội dung qua test chống over-claim.
6. Commit (index tạm) chỉ file đã sửa + cập nhật `WORK_LOG/SUMMARY/TASK_BOARD`; push từ Windows.
7. Present `tam-so-test.html` cho chủ dự án xem.
