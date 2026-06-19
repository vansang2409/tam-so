# PRODUCT_AUDIT — Tam Sở (v3.36, 19/06/2026)

Web huyền học tiếng Việt: Vite 5 + React 18 + Tailwind 3, web tĩnh (mọi tính toán client-side), 11 trang, PWA. 139 test pass.

## A. Tổng quan
| Chức năng | Trạng thái | Nhận xét |
|---|---|---|
| Tarot 78 lá | ✅ Tốt | 6 trải, love/work từng lá, lịch sử, yêu thích, lá chủ đạo |
| Thần số học | ✅ Tốt | 8+ chỉ số, Lo Shu, Đỉnh/Thử thách, năm/tháng/ngày cá nhân |
| Tử vi/Can Chi | ✅ Tốt | Can Chi, âm lịch HND, hợp tuổi, Tam Tai, Bát Trạch, sao hạn |
| Lá số Tử Vi Đẩu Số | ✅ Rất sâu | an sao tất định, Tứ Hóa, độ sáng M/V/Đ/B/H, đại hạn cả đời, 168 luận sao×cung |
| So đôi lá số | ✅ | dữ kiện, không phán |
| Cung hoàng đạo | ⚠️ Sơ | 12 cung + tương hợp, NHƯNG chưa có trang riêng/sâu từng cung (SEO yếu) |
| Kinh Dịch | ✅ Tốt | 64 quẻ + 64 Thoán + 384 hào (Legge) |
| Hồ sơ tổng hợp | ✅ Tốt | gộp mọi hệ + báo cáo + PDF/PNG |
| Trang chủ | ⚠️ Ổn-chưa-mạnh | hero + Hôm nay + 9 thẻ; thiếu quick-start rõ + retention (streak/nudge) |
| Tử vi NGÀY theo cung hoàng đạo | ❌ Thiếu | retention content kinh điển còn thiếu |
| Onboarding / empty-error state | ⚠️ Một phần | ErrorBoundary có; empty/loading state rời rạc |

## B. Tarot
Có: rút 1 lá, 3 lá, Tình yêu, Sự nghiệp, Celtic Cross, Có/Không, bài ngược, ý nghĩa xuôi/ngược 78 lá, love/work từng lá, lật 3D, lịch sử, yêu thích, chip câu hỏi, chia sẻ. THIẾU: trải "Tài chính" riêng; trang ý nghĩa tĩnh từng lá (SEO). → backlog.

## C. Tử vi / Chiêm tinh
Có: Can Chi/âm lịch, lá số Tử Vi rất sâu, hợp tuổi, cung hoàng đạo + tương hợp. THIẾU: tử vi NGÀY/tuần/tháng theo 12 cung; trang sâu từng cung hoàng đạo (tính cách/tình yêu/công việc/hợp-khắc). → backlog High SEO.

## D. Thần số học
Có: Chủ đạo, Đường đời (Life Path), Linh hồn, Nhân cách, Sứ mệnh/Vận Mệnh, Trưởng thành, Lo Shu, Đỉnh & Thử thách, năm/tháng/ngày cá nhân, báo cáo. THIẾU: trang giải thích từng chỉ số (SEO/education). → backlog.

## E. UI/UX
Tốt: tông giấy-cổ/kem WCAG AA, panel nhất quán, chia sẻ mọi nơi, mobile có lo wrap/overflow. Chưa mạnh: trang chủ thiếu "3 nhu cầu chính" 1-chạm + retention; loading skeleton/empty state chưa đồng bộ; chưa có onboarding nhẹ.

## F. Retention
Có: lịch sử localStorage (Tarot/Lá số/Hồ sơ), lá yêu thích, "Hôm nay" (Tarot+quẻ+Can Chi đổi theo ngày), chia sẻ. THIẾU: streak ghé thăm, nudge "quay lại mai", tử vi ngày theo cung, bộ sưu tập kết quả. → backlog.

## G. Monetization
Chưa có. Định hướng freemium (xem MONETIZATION_PLAN.md) — chưa cài thanh toán. Nền tảng PDF/báo cáo đã có → dễ gắn "premium" sau.

## H. SEO
Có: title/desc, H1/H2, sitemap, robots, OG, JSON-LD, FAQPage, URL sạch (path-routing). THIẾU (cơ hội lớn): trang nội dung riêng từng cung hoàng đạo (12) + từng lá Tarot (78) — hiện nội dung nằm trong app động, bot khó index sâu. → backlog High.
