# TASK_BOARD — Tam Sở

Trạng thái: Todo / Doing / Done / Blocked. Ưu tiên: High / Med / Low.

## HIGH
| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| H01 | 5 hệ core (Tarot/TSH/Tử vi/Lá số/Dịch) | Core | High | Done | đã chạy + 139 test |
| H02 | Lá số Tử Vi: độ sáng M/V/Đ/B/H + đại hạn cả đời | Tử vi | High | Done | badge + timeline + test |
| H03 | Trang chủ: quick-start 3 nhu cầu + streak + nudge quay lại | UI/Retention | High | Done | streak chạy, 3 CTA lớn, build sạch | streak chạy, 3 CTA lớn, build sạch |
| H04 | Tử vi NGÀY theo 12 cung hoàng đạo (retention content) | Tử vi/Retention | High | Done | mỗi cung 1 đoạn/ngày tất định, có trên Home + trang cung |
| H05 | Trang sâu từng cung hoàng đạo (12) — SEO + tử vi hôm nay | SEO/Content | High | Done | tính cách/tình-công-tài/hợp-khắc + meta riêng |
| H06 | Trang ý nghĩa từng lá Tarot (78) — SEO | SEO/Content | High | Done | xuôi/ngược + tình/công + meta |
| H07 | Rà loading/empty/error state toàn site | UX | High | Done | forms đã có empty+error; +NotFound 404 catch-all; sửa hồi quy /tarot/:slug; slug sai (số/cung/lá)→NotFound |
| H08 | Mobile responsive sweep toàn site | UX | High | Done (verify: bảng rộng đã overflow-x-auto; trang mới responsive) | 380px không vỡ ở 11 trang |
| H09 | Chủ dự án: "người dùng sẽ dùng mobile nhiều hơn" — audit lại UI mobile (sau khi có thêm Đi Chùa/dark mode/lịch sử chưa từng test mobile) | UX | High | Done (v3.89) | Quét lập trình 16 route ở ~375px: 0 lỗi vỡ ngang thật (loại trừ overflow-x:auto cố ý); quét mọi nút bấm < 36px → sửa 4 chỗ (modal close ×2, 78 nút yêu thích Tarot, mũi tên lịch vạn niên) |
| H10 | Chủ dự án gửi screenshot DevTools (iPhone 6/7/8 Plus, 414px) trang Đi Chùa: "xấu quá" — biển hiệu đè chữ | UX | High | Done (v3.90) | `.dc-sign` (giữa) + `.dc-caption` (trái, max-width 300px) cùng top:16px → đè nhau dưới ~414px; sửa bằng đẩy `.dc-caption` xuống dưới + full-width ở @media ≤760px; verify đo rect qua dev server thật, không còn chạm |
| H11 | Chủ dự án gửi tiếp 2 screenshot: "bên phải, footer bị dư rồi" | UX | High | Done (v3.91) | Lỗi: CSS scrollbar tuỳ biến SÁNG toàn site (`::-webkit-scrollbar-track{background:ink2}`) vẫn áp lên nền TỐI riêng của Đi Chùa → vệt sáng dọc phải (scroll trang) + ngang dưới khay (scroll `.dc-slider`/`.dc-sidebar`); chỉ lộ qua DevTools/desktop Chrome (điện thoại thật dùng overlay scrollbar tự ẩn). Sửa: `scrollbar-width:none` + ẩn `::-webkit-scrollbar` CHỈ trong `body.dc-lock`, không đụng scrollbar trang sáng khác; verify `getComputedStyle` khác nhau giữa 2 ngữ cảnh |
| H12 | Chủ dự án: "vẫn bị nha" sau v3.91 (gửi screenshot DevTools tam-so.vercel.app) | UX | High | Done (v3.92) | Tìm thêm lỗi thật: `.dc-page-bg` scale(1.1) (cố ý che viền blur) tràn ~21px mỗi bên; `.dc-root`/`body.dc-lock` dùng overflow:auto (2 chiều) → tạo vùng cuộn NGANG ẩn dù đã ẩn thanh cuộn ở H11. Sửa: overflow-x:hidden + overflow-y:auto cả 2 nơi; verify desktop+mobile không còn phần tử tràn khung body thật |
| H13 | Chủ dự án: "check trên localhost vẫn bị nha... có thể là do scroll" sau H12 | UX | High | Done (v3.93) | `document.scrollingElement` = `<html>`, KHÔNG phải `<body>` — toàn bộ fix H11/H12 nhắm sai chỗ (body.dc-lock). Sửa: `html:has(body.dc-lock){overflow-x:hidden;scrollbar-width:none}` + ẩn ::-webkit-scrollbar; verify getComputedStyle(documentElement) đúng khi ở Đi Chùa, không đụng html ở trang khác |
| H14 | Chủ dự án: "phần dc-caption đang che hết người dùng ko thấy được á" sau H10's fix | UX | High | Done (v3.94) | Đo được: caption (full-width, đẩy xuống ở H10) cao 136px trong khung ảnh 260px = ~93% bị che (sign+caption+nút gần như liền nhau, không khoảng trống). Sửa ở @media ≤760px: ẩn `.dc-caption-desc`, giảm title/padding, tăng `.dc-stage` min-height 260→300px → caption co còn 65px, lộ khoảng trống thấy ảnh ~127px |
| H15 | Chủ dự án: "tôi nghĩ là bỏ luôn cũng được" sau H14 | UX | Med | Done (v3.95) | Đơn giản hoá: `.dc-caption{display:none}` ở mobile (tên địa điểm đã có ở tab sidebar + biển hiệu thường trực, không cần hộp overlay riêng); ẩn kèm 2 nút ↑/↓ thừa, dọn rule lẻ của H14 |
| H16 | Chủ dự án gửi screenshot 4 thẻ panel phải, "làm lại cho tinh gọn hơn nha" | UI | Med | Done (v3.96) | Giảm padding/gap/font toàn bộ `.dc-card`+con; ảnh lư hương (chiếm nhiều nhất) 80→52px; dời lại vị trí khói theo tỉ lệ mới. Đo thật: tổng 4 thẻ 617px (trước ~830px), nút vẫn đạt chuẩn chạm 36-38px |
| H17 | Chủ dự án sau H16: "vẫn vậy mà thử đổi style UI xem" — muốn đổi cách trình bày, không chỉ co nhỏ | UI | Med | Done (v3.97) | Đổi style: Thắp Hương từ ảnh to+nút xếp dọc → ảnh nhỏ+nút 1 hàng ngang; Xin Xăm+Công Đức ghép lưới 2 cột song song (trước xếp dọc lặp lại); icon 🙏 vào tiêu đề thay overlap góc textarea. Verify nút dài nhất vẫn 1 dòng, 2 cột cao bằng nhau. Tổng panel ~482px |
| H18 | Chủ dự án sau H17: "rối và không đều gì hết" | UI | Med | Done (v3.98) | Đúng: 3/4 tiêu đề có icon, riêng Thắp Hương không có; nó cũng là thẻ DUY NHẤT xếp ngang trong khi 3 thẻ khác xếp dọc — trộn bố cục gây rối. Sửa: thêm icon 🔥, bỏ hàng ngang quay lại xếp dọc khớp nhịp 3 thẻ kia. Verify ảnh lư hương căn giữa đối xứng, cả 4 tiêu đề đều có icon |
| H19 | Chủ dự án: "Ly hương tôi thấy chưa đúng" — xin prompt tạo lại, tự tạo ảnh mới bằng Dreamina AI rồi gửi `ly-huong.png` | UI/Art | Med | Done (v3.99) | Đúng: ảnh cũ là đỉnh trầm nắp kín kiểu TQ, không phải bát hương miệng hở kiểu chùa Việt. Soạn prompt mới (bát hương đồng, tro+nhang, hoa văn sen/rồng) → chủ dự án tạo ảnh → tự viết PNG decoder/encoder (không dependency) + xoá nền hồi quy đa thức 2 vòng + lọc chroma/độ sáng (sửa lỗi bóng mờ kiểu DC15) → ghi đè `dc-pot-cutout.png`. Verify qua dev server thật (Image load OK, DOM `.dc-pot-real` đúng kích thước, 0 console error) |

## MEDIUM
| ID | Task | Nhóm | TT |
|---|---|---|---|
| M01 | Lưu lịch sử + chia sẻ + PNG/PDF | Retention | Done |
| M02 | Trang giải thích các chỉ số Thần số học | Content | Done |
| M03 | Trải bài "Tài chính" riêng | Tarot | Done |
| M04 | Bộ sưu tập kết quả (lưu reading yêu thích) | Retention | Done |
| M05 | Loading skeleton thống nhất | UX | Done (v3.55) — Skeleton.jsx + CardImage shimmer khi tải ảnh |
| M06 | doSangSummary vào Hồ sơ (report.js) | Tử vi | Done |
| M07 | SEO meta: canonical + OG/Twitter động + JSON-LD BreadcrumbList (102 trang sâu) | SEO | Done |

## AUTO-ĐỀ XUẤT (19/06/2026 — chờ chủ dự án duyệt/loại)
| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| A01 | Mở rộng `usePageSeo` cho TRANG INDEX từng hệ (Tarot/Numerology/Zodiac/IChing/LaSoTuVi/TuVi/Profile/Sources) | SEO | Med | Done | mỗi route chính có canonical + og:url + breadcrumb ≥2 cấp; +test wiring; build sạch |
| A02 | og:image động cho trang sâu: lá Tarot dùng ảnh RWS của lá, cung dùng biểu tượng/ảnh cung | SEO/Social | Med | Done (v3.55) | CardPage set og:image = ảnh RWS của lá (absUrl); cung/số/con giáp fallback og.png; usePageSeo nhận tham số image; +test |
| A03 | Khối "Nội dung liên quan" (internal-link ngữ cảnh) cuối CungPage/CardPage/SoChuDaoPage → liên kết chéo sang hệ khác | SEO/Retention | Med | Done | mỗi trang sâu ≥3 link nội bộ đúng ngữ cảnh; không trùng; build sạch |

## LOW (tương lai)
Đăng nhập Supabase Auth: Done (v4.1.0) · Thanh toán · Email daily · CMS · AI reading · Affiliate · Blog tự động.

| ID | Task | Nhóm | TT | Tiêu chí xong |
|---|---|---|---|---|
| V04 | Dark theme toggle | UI | Done (v3.81) | biến CSS sáng/tối cho token chung + ThemeToggle.jsx + FOUC-safe script; dark: bổ sung cho màu cảm xúc; KHÔNG đụng badge LaSoTuVi/Đi Chùa (theme riêng); verify qua dev server thật; 367 test |

## AUTO-ĐỀ XUẤT (đối thủ thientue.vn — 2026-06-19, chờ chủ dự án duyệt/loại)
Định hướng: HỌC chiến lược SEO quy mô + nội dung hàng ngày của họ, NHƯNG giữ giọng TRUNG THỰC (tham khảo, không phán, không giật tít) làm điểm khác biệt; monetization nghiêng FREEMIUM hơn ads-volume.

| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| C01 | SSG/prerender toàn site cho SEO (hiện là SPA → bot khó index sâu) | SEO/Tech | High | Done (v3.58) — prerender META | scripts/prerender.mjs sinh 211 file route landing (title/desc/canonical/og + JSON-LD) khi build Vercel (base /); GUARD skip khi base ./ (Pages/file://); KHÔNG sửa index.html; try/catch không chặn build. Nghiệm thu serving khi Vercel live |
| C02 | Trang "Tử vi hôm nay" cho 12 con giáp + 12 cung (tự đổi theo ngày) | SEO/Retention | High | Done (v3.49) | route /con-giap + 12 trang /con-giap/:slug; dailyConGiap (tất định) + hợp/khắc tuổi; meta+breadcrumb; sitemap +13 URL; link trên Home; phần 12 cung daily đã có sẵn từ H04/H05 |
| C03 | Long-tail "Sinh năm X: mệnh gì · hợp tuổi nào · sao chiếu" (programmatic theo năm) | SEO/Content | Med | Done (v3.56) | route /sinh-nam + /sinh-nam/:year (1900–2100); tinhCanChi + nạp âm/mệnh + con giáp + hợp/khắc tuổi; meta riêng; sitemap 1950–2025; KHÔNG phán chắc |
| C04 | Trang "Tuổi A và B có hợp không" (cặp con giáp/năm sinh) | SEO/Content | Med | Done (v3.54) | route /hop-tuoi + 12 trang /hop-tuoi/:slug (xếp 12 con giáp theo Tam/Lục hợp–Lục/Tứ hành xung, dùng hopTuoiChi); meta+breadcrumb+sitemap; link công cụ năm-sinh ở /tu-vi |
| C05 | Định vị nội dung: rà toàn site đảm bảo KHÔNG giật tít/khẳng định chắc (khác biệt vs đối thủ) | Content/Brand | Med | Done (v3.55) | test quét >800 luận điểm chặn over-claim (chắc chắn sẽ/nhất định sẽ/100% đúng…); mọi trang hệ có khung "tham khảo/chiêm nghiệm" |
| C06 | LÀM DÀY phần diễn giải các trang cốt lõi (deep cung hoàng đạo · 78 lá Tarot · Số Chủ Đạo · sao×cung) — nhiều đoạn, cấu trúc: tóm tắt → tính cách/ý nghĩa chi tiết → tình yêu → công việc → tài chính → sức khỏe → điểm mạnh/cần lưu ý → hợp-khắc → lời khuyên thực tế | Content | High | Done (v3.50–3.57): đợt 1 12 cung · đợt 2 78 lá Tarot · đợt 3 12 Số · đợt 4 lời khuyên 14 chính tinh (SAO_CUNG vốn đã dày 168) | mỗi trang deep nhiều mục & nhiều đoạn; DÀI bằng chiều sâu thật, KHÔNG độn khẳng định chắc/giật tít; giữ khung "tham khảo, chiêm nghiệm"; làm theo đợt (12 cung → 78 lá → 12 số → 168 sao×cung) + thêm test độ dài tối thiểu |


## PHIÊN 22/06/2026 — UI/ANIMATION + CHẤT LƯỢNG DIỄN GIẢI (Done)
Chủ dự án yêu cầu tập trung **UI/hiệu ứng animation** & **chất lượng đầu ra của diễn giải**.

| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| U01 | Engine tổng hợp trải bài Tarot (`tarotSynth.js`) — dệt diễn giải có căn cứ (xuôi/ngược, Ẩn Chính, chất nổi trội, lá hoàng gia/Át, khung đầu→cuối) | Content/Diễn giải | High | Done (v3.62) | thuần & kiểm thử; thay `spreadSummary`; +6 test rà over-claim/khung tham khảo/nhắc vị trí & câu hỏi; 302 pass |
| U02 | Hiện-dần-khi-cuộn `Reveal.jsx` (IntersectionObserver) + reduced-motion | UI/Animation | High | Done (v3.62) | gắn Home; tự hiện khi reduced-motion/không hỗ trợ IO |
| U03 | Chuyển trang fade-up `.page-enter` (Layout) | UI/Animation | Med | Done (v3.62) | mỗi route trồi lên nhẹ; tắt khi reduced-motion |
| U04 | Vi tương tác: ánh quét mặt sau lá Tarot, hero shimmer, vệt sáng nút chính | UI/Animation | Med | Done (v3.62) | CSS-only; reduced-motion an toàn |
| U05 | Áp đếm-số (CountUp) + stagger lưới thư viện | UI/Animation | Med | Done (v3.63) | CountUp gắn Số Chủ Đạo/bộ số/số ngày; stagger lưới Tarot 78 · IChing 64 · Zodiac 12 qua `Reveal base="stagger-parent"` + `--i`; reduced-motion an toàn; +8 test |
| U06 | Stagger lưới còn lại + reveal bảng tương hợp | UI/Animation | Low | Done (v3.64) | stagger ConGiap/HopTuoi/pillars/12-số; reveal 3 ma trận tương hợp; BỎ QUA Hồ sơ/Tương hợp/Lá số (vùng xuất PNG) |

## PHIÊN 22/06/2026 (tiếp) — DIỄN GIẢI TỔNG HỢP + TINH CHỈNH MOTION (Done)
| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| U07 | "Sợi chỉ chung" cho Hồ sơ (`weaveProfile`) — nối các hệ | Content/Diễn giải | High | Done (v3.65) | thuần & test; render đầu báo cáo; +3 test |
| U08 | "Đối chiếu để chiêm nghiệm" cho So đôi lá số (`weavePair`) | Content/Diễn giải | High | Done (v3.65) | Mệnh/Phu Thê/địa chi; KHÔNG kết luận hợp; +3 test |
| U09 | Tinh chỉnh tốc độ stagger + mobile media query | UI/Animation | Med | Done (v3.65) | desktop 32ms/.5s; ≤520px 24ms/.42s; reduced-motion vẫn thắng |

## PHIÊN 22/06/2026 (tiếp 2) — DIỄN GIẢI TỔNG HỢP KINH DỊCH (Done)
| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| U12 | Engine dệt "quẻ hôm nay" (`dayWeave.weaveDay`) — nối lá Tarot + quẻ Dịch, bắc cầu ngũ hành Đông–Tây | Content/Diễn giải | High | Done (v3.68) | thuần & test (+8); render thẻ Hôm nay (Home); tương sinh/khắc/tỉ hòa; Ẩn Chính→hai lăng kính; khung tham khảo; 340 pass |
| U11 | Engine tổng hợp bộ số (`numerologySynth.weaveNumbers`) — nối Chủ Đạo/Vận Mệnh/Linh Hồn/Nhân Cách/Trưởng Thành + Lo Shu | Content/Diễn giải | High | Done (v3.67) | thuần & test (+7); render Bộ số đầy đủ; nhận diện cộng hưởng + Lo Shu khuyết/đủ; khung tham khảo; 332 pass |
| U10 | Engine tổng hợp quẻ Dịch (`ichingSynth.weaveCast`) — dệt quẻ chính→hào động→quẻ biến | Content/Diễn giải | High | Done (v3.66) | thuần & test (+8); render IChing.jsx (gieo xu + Mai Hoa); 3 nhánh hào động; KHÔNG bịa quẻ biến khi tĩnh; giữ khung tham khảo; 325 pass |

## MONETIZATION (plan, chưa code thanh toán)
Freemium markers · gói premium report · lịch sử không giới hạn · trải nâng cao · PDF cá nhân hóa. Xem MONETIZATION_PLAN.md.
## PHIÊN 23/06/2026 — TINH CHỈNH UI v3.72 (theo yêu cầu chủ dự án)

| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| V01 | Vá màu inline-style sót lại từ ĐẠI TU v3.72 (Modal/CardImage/Skeleton) | UI | High | Done (v3.73) | 3 file, gradient kem/tan cũ → trắng/slate |
| V02 | Vá "lớp phủ trắng vô hình" (bg-white/[.0x] trên nền trắng mới) | UI | High | Done (v3.74) | 9 chỗ/6 file → bg-gold/5; verify bằng preview_inspect (getComputedStyle) |
| V03 | Audit toàn site + sửa các điểm thật từ audit | UI | Med | Done (v3.75) | hex `#b45309`→`bg-gold` (Tarot/Collection); H1 trang con ConGiap+Zodiac lệch ~20% to hơn cụm 4 trang khác → khớp về clamp(1.8-2.6rem); verify qua dev server thật (getComputedStyle). Giữ nguyên badge sáng/tối/Miếu-Vượng LaSoTuVi — xác minh là hệ màu phân biệt có chủ đích, KHÔNG phải lỗi |

## PHIÊN 23/06/2026 — TÍNH NĂNG MỚI "ĐI CHÙA" (theo di-chua.md, Done)
Chủ dự án đưa `di-chua.md` ("Thế giới tâm linh 3D" — Chùa & Đền + Nhà Thờ, Three.js/Next.js/TypeScript, quy trình 6 tài liệu thiết kế trước khi code) + ảnh mockup, rồi yêu cầu trực tiếp "làm menu Đi chùa". Đã hỏi lại phạm vi (chat vs tài liệu lệch quy mô rất xa) — chủ dự án chọn "làm giống hình". Quyết định: build MVP thật theo layout ảnh ngay, KHÔNG qua giai đoạn 6 tài liệu thiết kế, KHÔNG đổi stack (giữ Vite/JS, không Three.js/TS/Next.js) vì web hiện tại 100% tĩnh/client-side.

| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| DC01 | Trang `/di-chua` "Đại Tự Tâm Linh" (hư cấu) — sidebar địa điểm, viewport+điều hướng/zoom, slider ảnh, panel hành động; tông tối riêng scoped, không đụng theme sáng toàn site | Feature | High | Done (v3.76) | route+nav wired; 10 địa điểm (3 MVP: Cổng Tam Quan/Sân Chùa/Chánh Điện + 7 "sắp ra mắt"); build sạch |
| DC02 | Khấn Nguyện (lưu localStorage) · Thắp Hương (đếm + khói CSS) · Xin Xăm (16 thẻ tự biên soạn + diễn giải tham khảo, KHÔNG gọi là "AI" vì không có backend thật) | Feature | High | Done (v3.76) | 3 tương tác chạy thật; data thuần `dichua.js` test bằng Node; +16 test (364 total) |
| DC03 | Công Đức — KHÔNG dựng nút donate giả (chưa có cổng thanh toán) · 7 địa điểm chưa làm tự ẩn 3 thẻ hành động + badge "Sắp ra mắt" | Content/Honesty | High | Done (v3.76) | modal minh bạch; verify bằng Playwright thật (10 ảnh chụp, 0 console error) — phát hiện+sửa 2 lỗi thật (JSX fragment thiếu khiến card hành động không ẩn được; `.dichua-hint` đè nút điều hướng) |
| DC04 | Mở rộng tương lai: Nhà Thờ, các địa điểm Chùa còn lại (Tháp Chuông/Vườn Thiền/Giảng Đường/Nhà Tổ/Thư Viện/Tưởng Niệm/Pháp Bảo), 100 thẻ xăm đầy đủ, hub "Thế Giới Tâm Linh" gộp menu Tarot/TSH/Tử Vi | Feature | Low | Todo | chờ phản hồi người dùng thật trên MVP trước khi đầu tư thêm |

## PHIÊN 24/06/2026 — "ĐI CHÙA" LÀM LẠI THEO ẢNH (full-page · tự vẽ ảnh · lắc xin xăm, Done)
Chủ dự án yêu cầu: (1) giống ảnh mockup 100%, (2) tự tạo hình ảnh, (3) vào menu Đi chùa là full page, (4) xin quẻ phải lắc mới rơi xăm.

| ID | Task | Nhóm | Ưu tiên | TT | Tiêu chí xong |
|---|---|---|---|---|---|
| DC05 | Full-page: tách `/di-chua` ra NGOÀI `<Layout>`, header riêng "Chùa An Lạc" (logo + nav 6 mục + 🔍🔔 + avatar Phật Tử), sidebar 11 khu, right panel 4 thẻ, slider — đúng bố cục ảnh | Feature/UI | High | Done (v3.77) | `.dc-root` fixed inset-0, không còn nav/footer site chính; verify Playwright (dc-header=1, footer link=0) |
| DC06 | Tự tạo hình ảnh: `TempleScene.jsx` vẽ cảnh chùa bằng SVG (trời theo tông, núi/mây/cây/sân + công trình đổi theo khu: hall mái cong, cổng tam quan, tháp chuông, tượng Quán Âm, hồ sen, vườn đá) | Feature/Art | High | Done (v3.77) | 11 khu render khác nhau; thumbnail mini-scene; KHÔNG ảnh chụp/bản quyền (đã nói rõ không xuất được photoreal) |
| DC07 | Xin xăm phải LẮC: `ShakeXam.jsx` — kéo ống qua lại (pointer) hoặc lắc điện thoại (DeviceMotion, xin quyền iOS) đủ mạnh → que rơi → hiện thẻ; nút phụ a11y; reduced-motion | Feature | High | Done (v3.77) | Playwright kéo qua lại → ra "Thẻ số 4·Hạ"; sửa bug drop-timer kẹt (effect cleanup → useRef) |
| DC08 | Thẻ phải theo ảnh: Lời Cầu Nguyện (lưu local) · Thắp Hương Online (khói CSS) · Công Đức (modal minh bạch, KHÔNG nút donate giả) + thêm Xin Xăm; nav phụ/🔍/🔔 → modal "đang phát triển" | Content/Honesty | High | Done (v3.77) | 367 test pass; 0 console error; mobile không vỡ |
| DC09 | Mở rộng tương lai: ảnh đẹp hơn (đã làm — ảnh thật Gemini v3.78), Nhà Thờ, thêm thẻ xăm (16→nhiều hơn) | Feature | Low | Todo | chờ phản hồi người dùng thật |
| DC10 | Lịch Sử Của Bạn — xem lại Lời Nguyện đã viết + Thẻ Xăm đã rút (trước đó chỉ đếm số lượng, không xem lại được) | Feature | Med | Done (v3.82) | `addXamLichSu`/`clearLoiNguyen`/`clearXamLichSu` trong dichua.js; nút mở modal 2 danh sách + xoá riêng từng mục; verify qua dev server thật (viết→xem lại→xoá đúng cả 2); +6 test (373) |
| DC11 | Lư hương + ống xăm nhìn thật hơn (phản hồi "xấu quá") — KHÔNG có công cụ tạo ảnh + 3D thật đã chủ động không dùng → nâng cấp bằng CSS (radial-gradient lệch tâm giả độ cong, đốt tre, vân gỗ tự nhiên) | UI/Art | Med | Done (v3.83), chưa đủ — xem DC12 | verify computed style đúng qua dev server; chủ dự án phản hồi "vẫn vậy mà" sau khi tự xem screenshot — CSS gradient có giới hạn riêng |
| DC12 | Hậu cảnh modal Xin Xăm dùng ẢNH THẬT (đã có sẵn 11 ảnh) thay nền phẳng | UI | Med | Done (v3.84) | `DcModal` thêm prop `bgImage`; ảnh đúng khu đang xem, blur+tối để chữ đọc được; verify ảnh tải thành công + computed style qua dev server thật |
| DC13 | Hậu cảnh mờ cho TOÀN TRANG (không chỉ modal) — chủ dự án sửa ý sau DC12 | UI | Med | Done (v3.85) | `.dc-page-bg` phủ cả `.dc-root` (header/sidebar/right-panel/slider), đổi theo khu đang xem, z-index:-1; verify qua dev server thật (style attr + elementFromPoint) |
| DC14 | Lư hương + ống xăm THẬT hơn nữa — 2 lần nâng cấp CSS (v3.79/v3.80, v3.83) chủ dự án vẫn phản hồi "xấu quá" | UI/Art | Med | Done (v3.87) | Chủ dự án tự tạo 2 ảnh Gemini (đỉnh đồng + ống tre); tôi xoá nền bằng Canvas API qua browser thật (nội suy nền 4 góc + ngưỡng mềm + auto-crop), KHÔNG thêm dependency; thay CSS vẽ tay bằng `<img>`, giữ animation khói/que rơi; lưu `public/dichua/dc-pot-cutout.png` + `dc-tube-cutout.png`; chờ chủ dự án xác nhận trực quan lần cuối |
| DC15 | Chủ dự án phản hồi "ống xăm và bác hương vẫn chưa thích" sau v3.87 — tìm + sửa lỗi xoá nền + đổi ảnh ống xăm | UI/Art | Med | Done (v3.88) | Lỗi gốc: vùng phản chiếu mờ dưới chân lư hương bị thuật toán phân loại sai thành vật thể đặc (alpha=255), không phải viền mờ — sửa bằng dải lọc nghiêm ngặt riêng cho đáy ảnh (chroma cao HOẶC rất tối HOẶC khoảng-cách-màu lớn mới giữ); verify bằng ảnh heatmap alpha. Ống xăm: chủ dự án tự tạo 4 ảnh Dreamina AI (không tay người, nền studio sạch) theo prompt tôi soạn; chọn 2 tư thế (yên/xoè), ShakeXam.jsx đổi ảnh theo `phase`; resize `.xam-cyl`/`.xam-falling` khớp tỉ lệ ảnh mới |


## PHIEN 29/06/2026 - HIEU NANG / CHAT LUONG (PLAN_CODEX)
| ID | Task | Nhom | Uu tien | TT | Tieu chi xong |
|---|---|---|---|---|---|
| P01 | Code-split route bang React.lazy + Suspense; tach vendor chunk | Perf/Tech | High | Done (v4.0.0) | main.jsx lazy 15 trang (giu Layout/Home eager); Suspense quanh Outlet + /di-chua; spinner fallback reduced-motion; vite manualChunks vendor. Do that gzip: tai ban dau trang chu 228KB->179KB (~-22%), trang nang chi tai khi truy cap; 27 chunk; 377 test pass; build main+single OK (NUL=0) |
| Q1 | Dut diem churn CRLF bang `.gitattributes` + normalize LF | Quality/Git | High | Done (v4.0.1) | `.gitattributes` ep text LF + binary image/icon; tracked text khong con CRLF; them 3 test ha tang; 380 test pass; build `/tmp/b` main+single OK, single NUL=0 |
| P2 | Lazy-load widget "que hom nay" tren Home | Perf | High | Done (v4.0.2) | Home lazy import Today + Suspense; data nang nam trong Today; +1 test khoa lazy; app entry index 59.13KB raw / 24.76KB gzip (<70KB); build main+single OK, single NUL=0 |
| P3 | Prefetch chunk route khi hover/focus nav | Perf/UX | High | Done (v4.0.3) | `routeLoaders` dung chung main/Layout; hover/focus nav goi prefetch; respect saveData + idempotent; +3 test; build main+single OK, single NUL=0 |
| Q5 | ErrorBoundary cho lazy-load fail | Reliability/UX | High | Done (v4.0.4) | `ErrorBoundary` nhan dien ChunkLoadError/dynamic import fail; fallback co Tai lai/Thu lai/Ve trang chu; `/di-chua` lazy route duoc boc boundary; +3 test; build main+single OK, single NUL=0 |
| P4 | Toi uu anh Di Chua WebP + lazy/async | Perf/Media | High | Done (v4.0.5) | 14 WebP cho 11 canh + 3 cutout alpha; payload uu tien 4.16MB -> 2.12MB (~49.1%); WebP metadata width/height >0; `<picture>` fallback JPG/PNG + lazy/async; 391 test pass; build main+single OK, single NUL=0 |

## PHIEN 29/06/2026 - DANG NHAP / SUPABASE AUTH
| ID | Task | Nhom | Uu tien | TT | Tieu chi xong |
|---|---|---|---|---|---|
| AUTH01 | Dang ky/dang nhap bang Supabase Auth | Account/Supabase | High | Done (v4.1.0) | `/dang-nhap` lazy route; `AuthProvider`; signUp/signIn/signOut; env guard `.env.example`; nav AuthBtn; FAQ minh bach localStorage vs Supabase Auth; 404 test pass; build `/tmp/b` main+single OK, single NUL=0 |
