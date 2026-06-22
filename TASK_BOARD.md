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
Đăng nhập · Thanh toán · Email daily · CMS · AI reading · Affiliate · Blog tự động · Dark theme toggle.

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
