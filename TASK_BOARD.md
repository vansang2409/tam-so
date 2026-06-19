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
| C01 | SSG/prerender toàn site cho SEO (hiện là SPA → bot khó index sâu) | SEO/Tech | High | Todo | các route chính + landing cung/lá/số có HTML tĩnh + meta khi "view source"; không phá HashRouter file:// |
| C02 | Trang "Tử vi hôm nay" cho 12 con giáp + 12 cung (tự đổi theo ngày) | SEO/Retention | High | Done (v3.49) | route /con-giap + 12 trang /con-giap/:slug; dailyConGiap (tất định) + hợp/khắc tuổi; meta+breadcrumb; sitemap +13 URL; link trên Home; phần 12 cung daily đã có sẵn từ H04/H05 |
| C03 | Long-tail "Sinh năm X: mệnh gì · hợp tuổi nào · sao chiếu" (programmatic theo năm) | SEO/Content | Med | Done (v3.56) | route /sinh-nam + /sinh-nam/:year (1900–2100); tinhCanChi + nạp âm/mệnh + con giáp + hợp/khắc tuổi; meta riêng; sitemap 1950–2025; KHÔNG phán chắc |
| C04 | Trang "Tuổi A và B có hợp không" (cặp con giáp/năm sinh) | SEO/Content | Med | Done (v3.54) | route /hop-tuoi + 12 trang /hop-tuoi/:slug (xếp 12 con giáp theo Tam/Lục hợp–Lục/Tứ hành xung, dùng hopTuoiChi); meta+breadcrumb+sitemap; link công cụ năm-sinh ở /tu-vi |
| C05 | Định vị nội dung: rà toàn site đảm bảo KHÔNG giật tít/khẳng định chắc (khác biệt vs đối thủ) | Content/Brand | Med | Done (v3.55) | test quét >800 luận điểm chặn over-claim (chắc chắn sẽ/nhất định sẽ/100% đúng…); mọi trang hệ có khung "tham khảo/chiêm nghiệm" |
| C06 | LÀM DÀY phần diễn giải các trang cốt lõi (deep cung hoàng đạo · 78 lá Tarot · Số Chủ Đạo · sao×cung) — nhiều đoạn, cấu trúc: tóm tắt → tính cách/ý nghĩa chi tiết → tình yêu → công việc → tài chính → sức khỏe → điểm mạnh/cần lưu ý → hợp-khắc → lời khuyên thực tế | Content | High | Doing (đợt 1: 12 cung v3.50 · đợt 2: 78 lá Tarot v3.51–3.52 · đợt 3: 12 Số v3.53 · còn đợt 4 sao×cung) | mỗi trang deep nhiều mục & nhiều đoạn; DÀI bằng chiều sâu thật, KHÔNG độn khẳng định chắc/giật tít; giữ khung "tham khảo, chiêm nghiệm"; làm theo đợt (12 cung → 78 lá → 12 số → 168 sao×cung) + thêm test độ dài tối thiểu |

## MONETIZATION (plan, chưa code thanh toán)
Freemium markers · gói premium report · lịch sử không giới hạn · trải nâng cao · PDF cá nhân hóa. Xem MONETIZATION_PLAN.md.
