# 🗺️ ROADMAP — Tam Sở

## ✅ 2.0–2.6 — Nền React; Tarot 78 lá + tranh RWS + luận giải đầy đủ; Thần số học; Tử vi (Can Chi ngày/giờ, giờ hoàng đạo, Tam Tai, hợp tuổi, Bát Trạch); Cung hoàng đạo; Kinh Dịch 64 quẻ; giao diện vàng nâu đất; Hồ sơ tổng hợp (chia sẻ link, In/PDF, tải ảnh PNG); tối ưu mobile
## ✅ 2.7 — Chiều sâu nội dung "pro" (hiện tại)
- **Kinh Dịch chuyên sâu**: luận giải 2–3 câu cho cả 64 quẻ (ý nghĩa + lời khuyên), hiện ở quẻ gieo và tra cứu.
- **Tử vi dày hơn**: luận tính cách 12 con giáp + ý nghĩa 30 nạp âm trong kết quả Can Chi.
- **Thần số học**: các thẻ số từ tên (Vận Mệnh/Linh Hồn/Nhân Cách/Trưởng Thành) hiện luận giải đầy đủ.
- Polish: favicon ✦, tiêu đề & mô tả trang chuẩn SEO.

## ✅ 2.8 — Kinh Dịch chuyên sâu & self-host ảnh (hiện tại)
- **Luận hào động khi gieo**: quy tắc đọc theo số hào động + ý nghĩa 6 ngôi hào (sơ→thượng; đắc trung / "đa hung" / "đa cụ" / ngôi chí tôn). Hiện ngay khi quẻ có hào động.
- **Nguyên văn thoán từ & hào từ**: mỗi quẻ (lúc gieo lẫn tra cứu) có liên kết tới bản nguyên văn (Dịch học Kabala) — đúng nguyên tắc "dẫn nguồn, không tự bịa".
- **Self-host ảnh Tarot**: `npm run fetch-cards` tải 78 ảnh RWS (public domain) về `public/cards/` + công tắc `LOCAL_CARDS` để chạy offline, nhanh hơn hotlink.

## ✅ 2.9 — Lịch âm chuẩn & hiệu ứng (hiện tại)
- **Đổi dương→âm lịch (Hồ Ngọc Đức, UTC+7)**: ô ① Tra Can Chi nhập đủ ngày/tháng → tự tính đúng **năm âm lịch** cho Can Chi & Tam Tai (chuẩn ranh giới Tết), hiện ngày âm; ô Can Chi ngày cũng hiện âm lịch. Đã kiểm chứng mốc Tết 1990/2000/2020/2024/2025.
- **Hiệu ứng**: sáu hào "rơi" so le khi gieo Kinh Dịch; lá Tarot "chia bài" so le khi rút. Thêm thẻ chia sẻ mạng xã hội (Open Graph).

## ✅ 3.05 — Kinh Dịch HOÀN CHỈNH: 64 Thoán + 384 hào từ
- **Đủ 64 quẻ** có **Thoán từ (lời quẻ)** + **6 hào từ** mỗi quẻ (tổng **384 hào từ**) + lời **Dụng Cửu/Dụng Lục** cho quẻ 1 & 2.
- Phỏng dịch tiếng Việt mạch lạc, trấn an từ bản **James Legge 1899 (phạm vi công cộng)**; quẻ 12 & 46 (trang nguồn lỗi) dịch từ bản Legge chuẩn đã đối chiếu.
- Hiển thị: trang Kinh Dịch (HexView) hiện Thoán từ + mục xổ "Lời 6 hào"; kết quả gieo hiện đúng hào từ của hào động (📜).
- Test: **95 mốc, 0 fail** (thêm kiểm chứng đủ 64 Thoán + 384 hào, không hào rỗng).

## ✅ 3.02 — Thoán từ + hào từ: 30/64 quẻ
- Đã có quẻ 1–30 (thoán từ + 6 hào, phỏng dịch Legge). Tiếp 31–64.

## ✅ 3.01 — Thoán từ + hào từ: 15/64 quẻ (đợt 1)
- Phỏng dịch Legge cho quẻ 1–11, 13–15 (thoán từ + 6 hào). Quẻ 12 nguồn lỗi, sẽ lấy lại; còn 16–64.

## ✅ 3.00 — Thoán từ + hào từ Kinh Dịch (bắt đầu, quẻ 1 mẫu)
- File iching-text.js (HEX_TEXT): Thoán từ + 6 hào từ phỏng dịch Legge 1899; HexView hiện thoán từ + lời 6 hào; khi gieo có hào động thì hiện lời hào cụ thể. Quẻ 1 làm mẫu, sẽ cuốn chiếu 64 quẻ.

## ✅ 2.99 — Đại Tượng (象) cho 64 quẻ Kinh Dịch
- Mỗi quẻ thêm Đại Tượng (hình tượng + bài học quân tử dĩ…), phỏng dịch theo Legge 1899 (công cộng), ghi nguồn. 91 test.

## ✅ 2.98 — Hoàn tất chiêm tinh Tarot: decan 40 lá Ẩn Phụ
- MINOR_ASTRO: Ách (gốc nguyên tố) + 36 pip (hành tinh trong cung, Golden Dawn). Modal hiện decan + chất. 90 test. Toàn bộ 78 lá nay có tương ứng chiêm tinh.

## ✅ 2.97 — Dữ liệu sâu: hành tinh liên hệ 12 con số
- NUM_SAO: hành tinh ứng mỗi số chủ đạo (ghi rõ theo trường phái, tham khảo). 89 test.

## ✅ 2.96 — Dữ liệu sâu: 12 cung hoàng đạo (tính chất + cơ thể)
- ZODIAC thêm tính chất Khởi/Định/Biến + bộ phận cơ thể; hiện ở thẻ 12 cung và kết quả xem cung. 88 test.

## ✅ 2.95 — Dữ liệu sâu: 10 Thiên Can (hướng/hình tượng)
- THIEN_CAN thêm hướng + hình tượng cổ điển; bảng Thiên Can thêm 2 cột. 87 test.

## ✅ 2.94 — Dữ liệu sâu: bảng Bát Quái (Kinh Dịch)
- 8 quái thêm ngũ hành/người/thân/hướng/tính chất (Hậu Thiên Bát Quái); bảng tra trên trang Kinh Dịch (vẽ quái bằng thanh). 86 test.

## ✅ 2.93 — Dữ liệu sâu: 12 Địa Chi (giờ/hướng/mùa)
- DIA_CHI thêm giờ canh, hướng, mùa; bảng 12 Địa Chi thêm cột Giờ & Hướng. 85 test.

## ✅ 2.92 — Dữ liệu sâu hơn: tương ứng chiêm tinh Tarot
- 22 Ẩn Chính thêm tương ứng hành tinh/cung + nguyên tố (Golden Dawn, dữ kiện); modal hiện "✦ Tương ứng" cho cả Ẩn Chính & Ẩn Phụ (chất+nguyên tố). 84 test.

## ✅ 2.91 — Gỡ hết điều hướng phụ ra trang Nguồn
- Bỏ cả khối "Khám phá thêm" (Tarot) + link Nguồn ở Trang chủ. Trang tập trung vào kết quả; Nguồn chỉ còn ở menu/chân trang.

## ✅ 2.90 — Gỡ điều hướng Nguồn không mong muốn
- Bỏ chip "Nguồn & Lưu ý" khỏi khối Khám phá thêm (Tarot) và bỏ link Nguồn ở chú thích "xem chi tiết" (Hồ sơ). Nguồn vẫn vào qua menu/chân trang.

## ✅ 2.89 — Vá nốt link chia sẻ FB ở Hồ sơ (kiểm định độc lập)
- Nút Chia sẻ Facebook ở Hồ sơ còn dùng URL #/ thủ công → đổi sang routeShareUrl (path-routing đồng bộ). Đã rà sạch toàn bộ.

## ✅ 2.88 — Mục "Thuật ngữ thường gặp" (trang Nguồn)
- 17 khái niệm (Ẩn Chính/Ẩn Phụ, Can Chi, nạp âm, Số Chủ Đạo, hào động, decan…) giải thích ngắn gọn — đỡ bỡ ngỡ + thêm nội dung cho SEO.

## ✅ 2.87 — Chia sẻ kết quả "Hôm nay" + dọn copy
- Mục Hôm nay: thêm 📋 Chép kết quả / 📘 Chia sẻ cho lần rút; sửa mô tả Tarot ở trang chủ cho khớp "rút nhanh một lá".

## ✅ 2.86 — SEO path-routing (URL thường + 404.html)
- Bản web dùng BrowserRouter /tam-so/<route> (Google index 9 trang) qua kỹ thuật spa-github-pages (404.html + restore script); file:// vẫn HashRouter. Helper shareUrl đồng bộ link chia sẻ. Cờ ENABLE_PATH_ROUTING trong src/data/site.js để revert 1 dòng. Sitemap 9 URL.

## ✅ 2.85 — Trang Tarot: "Rút nhanh một lá" (bấm-rút ngẫu nhiên)
- Ô "Lá bài hôm nay" cố định đổi thành bấm-để-rút ngẫu nhiên + nghĩa + lời khuyên + rút lại + chép/chia sẻ, nhất quán với mục Hôm nay.

## ✅ 2.84 — Diễn nôm trấn an cho 14 quẻ lời nặng
- HEXAGRAM_AN: câu "Hiểu nôm na" nhẹ nhàng, hướng hành động cho các quẻ Truân/Tụng/Bĩ/Bác/Khảm/Minh Di/Khuê/Kiển/Tổn/Khốn/Hoán… hiện ở Kinh Dịch & mục Hôm nay. 80 test.

## ✅ 2.83 — Love/Work 56 lá Ẩn Phụ cụ thể (bớt mơ hồ)
- Thay khung công thức "Chất X… Giai đoạn N" bằng luận Tình yêu/Sự nghiệp riêng từng lá, bám nghĩa truyền thống RWS, đời thường & nhẹ nhàng.

## ✅ 2.82 — Diễn giải rõ & trấn an hơn (Hôm nay)
- Bỏ love/work công thức khỏi lần rút ngày; lời khuyên đổi thành "Bạn có thể làm gì"; quẻ nêu ý ngắn rõ trước; thêm khung nhấn quyền tự quyết, tránh gieo lo sợ.

## ✅ 2.81 — "Hôm nay": diễn giải ngay tại chỗ
- Sau khi rút, hiện luôn luận giải lá bài (nghĩa xuôi/ngược + lời khuyên + tình yêu/công việc) và luận quẻ đầy đủ + link nguyên văn — khỏi bấm vào từng ô.

## ✅ 2.80 — "Hôm nay": bấm để rút, mỗi lần ngẫu nhiên
- Lá bài & quẻ không còn tự hiện/cố định theo ngày; người dùng tĩnh tâm rồi bấm "Rút lá & gieo quẻ", mỗi lần là kết quả ngẫu nhiên (hợp 1 máy nhiều người); có nút Rút lại. Ngày/Can Chi/giờ hoàng đạo/con số vẫn là dữ kiện lịch.

## ✅ 2.79 — Chip câu hỏi gợi ý + liên kết trang (Tarot)
- 4 nhóm câu hỏi gợi ý (tình yêu/bản thân/sự nghiệp/Có-Không) bấm là tự chọn trải bài + rút + cuộn lên kết quả; khối "Khám phá thêm" liên kết nội bộ. Câu hỏi tự biên soạn. Sửa tương phản nút lọc đang chọn.

## ✅ 2.78 — Chữ đậm rõ hơn trên nền sáng
- Chữ phụ (muted/note) #6e5a3a→#4d3c20 (8.5:1), accent vàng #8a5e16→#6e490e (6.5:1), bỏ opacity mờ ở CardImage — hết cảm giác chữ nhạt.

## ✅ 2.77 — Nền sáng: sửa nốt nhãn & thẻ dự phòng
- CardImage thẻ dự phòng đổi nền sáng; nhãn pastel (emerald/pink/amber) đổi sang tông đậm đạt WCAG AA trên nền kem.

## ✅ 2.76 — Đổi nền sáng (giấy cổ/kem)
- Đảo tông: nền kem, chữ nâu đậm, panel trắng kem nổi, badge/pill/bảng/note đảo sáng, navbar kem, tắt lớp đốm — vẫn giữ accent vàng-nâu.

## ✅ 2.75 — Nâng sáng tông nền (bớt tối)
- Nền ấm sáng hơn (#2c2011→#3a2b14), quầng sáng rõ hơn, panel & navbar nổi hơn — vẫn giữ chất vàng-nâu.

## ✅ 2.74 — Bản quyền: chính xác hoá & bổ sung
- Diễn đạt lại mốc công cộng RWS ở Mỹ cho chuẩn; README thêm dòng nội dung tự biên soạn/không sao chép.

## ✅ 2.73 — Bản quyền & Ghi công (minh bạch)
- Trang Nguồn + README: ghi rõ Tarot RWS phạm vi công cộng, phông OFL, thư viện MIT, lịch âm Hồ Ngọc Đức, nội dung tự biên soạn không sao chép.

## ✅ 2.72 — Bố cục thoáng hơn (toàn cục)
- Giãn dòng (1.75), giãn .kv, ô bảng rộng hơn, disclaimer thoáng hơn — áp dụng đều mọi trang theo ý "thoáng hơn".

## ✅ 2.71 — Sửa lật 3D không cắt nội dung
- Front lá tự định chiều cao (relative), mặt sau phủ tuyệt đối — tránh bị cắt khi lá cao hơn 280px.

## ✅ 2.70 — Gợi ý vuốt ngang cho bảng ma trận (mobile)
- 3 bảng tương hợp hiện gợi ý cuộn ngang trên màn nhỏ để không bỏ lỡ nội dung tràn.

## ✅ 2.69 — SEO an toàn: canonical + noscript giàu nội dung
- Thêm thẻ canonical; mở rộng khối noscript mô tả đủ 6 hệ (crawler không chạy JS vẫn đọc được). Path-routing để dành làm cùng khi deploy test được.

## ✅ 2.68 — Tình yêu/Sự nghiệp cho 56 lá Ẩn Phụ (có nguồn)
- Khung chất (nguyên tố) × số/court kiểu Labyrinthos, hiện trong chi tiết mỗi lá Ẩn Phụ; ghi rõ nguồn & không phán riêng từng lá. Test 79 mốc.

## ✅ 2.67 — Lật lá Tarot 3D (mặt sau→trước)
- Lá rút ra hiện mặt sau (✦ TAM SỞ) rồi lật lộ mặt trước, lệch nhịp nhẹ; tôn trọng prefers-reduced-motion.

## ✅ 2.66 — Mô tả meta theo từng trang (SEO/chia sẻ)
- Mỗi route tự cập nhật meta description riêng (trước chỉ đổi title).

## ✅ 2.65 — Báo cáo tải/chép gồm tuổi hợp/khắc
- Bản .txt và bản chép của Hồ sơ nay có dòng Tam hợp/Lục hợp/Lục xung/Tứ hành xung.

## ✅ 2.64 — Hồ sơ: thẻ "Tuổi hợp / khắc"
- Hồ sơ tổng hợp liệt kê con giáp Tam hợp/Lục hợp/Lục xung/Tứ hành xung với tuổi của bạn (dùng hopTuoiChi).

## ✅ 2.63 — Bảng hợp Số Chủ Đạo (trọn bộ 3 ma trận)
- Thần số học: ma trận 12×12 (kể cả 11/22/33). Cùng zodiac + con giáp tạo bộ tra tương hợp đủ 3 hệ. 78 mốc test.

## ✅ 2.62 — Bảng hợp tuổi 12 con giáp
- Tử vi: ma trận Tam hợp/Lục hợp/Lục xung/Tứ hành xung mọi cặp con giáp (hàm hopTuoiChi thuần địa chi + 6 test kinh điển). 77 mốc.

## ✅ 2.61 — Bảng tương hợp 12×12 cung
- Cung hoàng đạo: ma trận tra nhanh mức hợp mọi cặp (màu + chú giải + tooltip), dùng zodiacCompat đã test; test khóa tập verdict (71 mốc).

## ✅ 2.60 — Test quét biên (70 mốc)
- Sweep: getZodiac 12×28, decan 1–3, zodiacCompat 12×12, Can Chi lặp 60 năm, lifePathCompat mọi cặp, castHexagram 60 lần. Không lộ bug ẩn. Đổi nốt ☶→📖 ở trang Nguồn (hết glyph dễ tofu).

## ✅ 2.59 — A11y điều hướng
- Nút menu mobile có aria-expanded/aria-controls; menu có id để trợ năng đọc đúng.

## ✅ 2.58 — Modal chuẩn a11y
- role=dialog + aria-modal, khóa cuộn nền khi mở, đưa focus vào modal & trả lại khi đóng.

## ✅ 2.57 — Kinh Dịch: chép/chia sẻ quẻ
- Sau khi gieo: nút 📋 Chép quẻ (chính + biến + hào động) & 📘 Chia sẻ. Trọn 6 hệ đều chia sẻ được.

## ✅ 2.56 — Test khóa tính năng Chia sẻ (63 mốc)
- Thêm 4 test guard các trường share phụ thuộc (LUCKY, Can Chi, NGU_HANH, computeNameNumbers).

## ✅ 2.55 — Nguồn cho Năm/Ngày cá nhân
- Trang Nguồn: thêm dòng bảng + trích dẫn Numerology.com (công thức Personal Year dùng năm dương hiện tại — khớp bản sửa v2.50).

## ✅ 2.54 — Chép/chia sẻ kết quả trải bài Tarot
- Sau khi rút: nút 📋 Chép kết quả (gồm câu hỏi + các lá + xuôi/ngược) và 📘 Chia sẻ.

## ✅ 2.53 — FAQPage JSON-LD (SEO)
- Chèn structured data FAQPage (6 Q&A khớp trang Nguồn) → đủ điều kiện rich result trên Google.

## ✅ 2.52 — Chia sẻ "lá bài hôm nay"
- Trang Tarot: nút 📋 Chép / 📘 Chia sẻ lá hôm nay (nội dung quay lại mỗi ngày).

## ✅ 2.51 — Xu hướng Năm cá nhân kế tiếp
- Thần số học hiện thêm số Năm cá nhân của 2 năm tới (chu kỳ 1→9) — bối cảnh, không phán đoán sự kiện.

## ✅ 2.50 — Sửa lỗi Năm cá nhân (quan trọng)
- **Năm cá nhân** từng tính theo năm sinh → sửa thành **năm hiện tại** (đúng công thức) ở cả Thần số học & Hồ sơ; test lên 59 mốc.

## ✅ 2.49 — Tử vi Can Chi chia sẻ được
- Kết quả Can Chi thêm **🔗/📋/📘** + tự điền lại từ URL (?y&m&d). Giờ cả 5 công cụ chính đều share được.

## ✅ 2.48 — Cung hoàng đạo chia sẻ được
- Kết quả "cung của bạn" thêm **🔗/📋/📘** + tự điền lại từ URL (?d&m).

## ✅ 2.47 — "Hôm nay" tươi mới mỗi ngày
- Thêm **câu hỏi gợi mở phản tư** xoay theo ngày (14 câu, kiểu nhật ký — không dự đoán).

## ✅ 2.46 — Thần số học chia sẻ được
- Nút **🔗 Sao chép liên kết / 📋 Chép kết quả / 📘 Chia sẻ** + tự điền lại từ URL (?n&d&m&y) — mỗi người share "bộ số" của mình.

## ✅ 2.44–2.45 — Nội dung & UX
- Mỗi lá Ẩn Chính thêm ý nghĩa **❤ Tình yêu / 💼 Công việc** (22 lá, bám RWS).
- Nút **Lên đầu trang** trên trang dài. Test lên 58 mốc.

## ✅ 2.43 — Bộ test mở rộng (57 mốc)
- Phủ kiểm thử toàn bộ data + hàm: Tarot 78 lá, Can Chi/nạp âm/giờ hoàng đạo/Tam Tai/cung phi/sao hạn, lịch âm, 64 quẻ + Mai Hoa, decan, báo cáo. Chống hồi quy chắc hơn khi làm nhiều máy.

## ✅ 2.40–2.42 — Robustness & nội dung
- **Ảnh dự phòng Tarot = thẻ bài có khung** (tỉ lệ 2:3, số La Mã + biểu tượng + tên) — không còn emoji trơ.
- **Error Boundary**: lỗi 1 trang hiện thông báo thân thiện + nút tải lại, giữ nav/footer (không màn trắng).
- **Câu hỏi thường gặp (FAQ)** ở trang Nguồn: Tam Sở là gì, có chính xác không, dữ liệu có bị lưu không… → tăng tin cậy & SEO.

## ✅ 2.38–2.39 — Ảnh Tarot tự host (mặc định bật)
- Ảnh lá bài thử theo bậc: **nội bộ (public/cards) → Wikimedia → emoji** (thiếu ảnh không vỡ UI). Đặt LOCAL_CARDS=true mặc định.
- Để ảnh hiện: chạy `npm run fetch-cards` (tải 78 ảnh về public/cards/) rồi `npm run dev`/build; khi deploy nhớ **commit public/cards/**.

## ✅ 2.37 — Thoáng toàn cục
- Tăng cỡ gốc 17px (Tailwind theo rem nên giãn cả chữ lẫn khoảng cách ~6% khắp app, mobile về 16px); lề trang rộng hơn; panel có chiều sâu (nền gradient nhẹ) thay vì phẳng; viền bảng & nút rõ hơn.

## ✅ 2.36 — Nâng tương phản & bố cục thoáng
- Nền dịu lại (giảm gradient + sao lấp lánh) cho bớt rối; chữ phụ (.note) **bỏ in nghiêng, sáng & to hơn** dễ đọc; màu muted sáng hơn (tương phản tốt hơn); panel rõ khối + bo tròn hơn; giãn dòng & giãn cách thoáng hơn.

## ✅ 2.35 — Sửa icon lỗi & nâng hiển thị quẻ
- **Vẽ quẻ Kinh Dịch bằng thanh gold** (component Hexagram) thay ký tự ☰–☷ hay bị "ô vuông" trên Windows → luôn hiển thị đúng & sắc nét (ở Kinh Dịch, Mai Hoa, mục Hôm nay).
- Thay emoji rủi ro: 🪪→📜 (Hồ sơ), ☶→📖 (Kinh Dịch), ☯️→☯ (bỏ ký tự biến thể hay lỗi).

## ✅ 2.34 — Ảnh OG + structured data (link chia sẻ đẹp + SEO)
- **Ảnh OG 1200×630** (public/og.png) → link dán Facebook/Zalo hiện thẻ ảnh lớn, tăng tỉ lệ bấm. Thêm **JSON-LD WebApplication** + nội dung SEO no-JS. (og:image dùng URL GitHub Pages mặc định — đổi nếu deploy domain khác.)

## ✅ 2.33 — robots.txt + sitemap.xml (SEO cơ bản)
- Thêm robots.txt + sitemap.xml cho bản online (khai báo cho công cụ tìm kiếm).

## ✅ 2.32 — Chia sẻ Facebook ở Hồ sơ
- Hồ sơ thêm nút **📘 Chia sẻ Facebook**; link chia sẻ mang đầy đủ giờ sinh/chủ đề/câu hỏi (mở lại đúng hồ sơ).

## ✅ 2.31 — Tương hợp chia sẻ được (tăng lan truyền)
- Trang Tương hợp: **deep-link** (mở lại đúng kết quả), nút **Sao chép liên kết / Chia sẻ Facebook / Tải ảnh PNG** (ảnh có thương hiệu Tam Sở) → người dùng test với người ấy rồi chia sẻ, kéo thêm truy cập.

## ✅ 2.30 — Mai Hoa Dịch Số (gieo quẻ theo ngày giờ)
- Kinh Dịch thêm cách lập quẻ **Mai Hoa** từ năm–tháng–ngày–giờ âm lịch (Tiên Thiên bát quái; thuật toán tất định) + quẻ biến + luận hào động. Công thức đã đối chiếu nguồn.

## ✅ 2.29 — Decan vào Hồ sơ + mở rộng test
- Thẻ Cung hoàng đạo ở Hồ sơ hiện thêm Decan; bộ test mở rộng (36 mốc).

## ✅ 2.28 — Bổ sung nguồn (Sao hạn, Decan) vào trang Nguồn
- Trang Nguồn ghi thêm nguồn Sao hạn Cửu Diệu (Quantrimang) & ghi chú hệ Decan triplicity — đúng nguyên tắc "có nguồn".

## ✅ 2.27 — Tải .txt báo cáo + SW cache
- Nút **📄 .txt** tải báo cáo tổng hợp ra file văn bản; cập nhật phiên bản cache service worker (PWA tự dọn cache cũ khi có bản mới).

## ✅ 2.26 — Sao hạn vào Báo cáo Hồ sơ
- Báo cáo tổng hợp ở Hồ sơ thêm dòng **Sao chiếu mệnh năm nay** (Cửu Diệu, theo giới tính + tuổi mụ).

## ✅ 2.25 — Sao hạn Cửu Diệu
- Tử vi thêm **Sao hạn năm nay** (Cửu Diệu) theo tuổi mụ + giới tính: chu kỳ nam/nữ **suy ra & đối chiếu chéo bảng 2026 (Quantrimang)** — 10/10 mốc khớp; phân loại tốt/trung/xấu + ý nghĩa, giọng không hù dọa.

## ✅ 2.23–2.24 — Lịch sử Hồ sơ + a11y nút yêu thích
- **Hồ sơ**: lưu các lần lập gần đây (localStorage), chip "Gần đây" để mở lại nhanh, nút xóa.
- **Accessibility**: nút ★ yêu thích Tarot nay là <button> thật có aria-label; thẻ thư viện thành role=button bấm được bằng bàn phím (Enter/Space).

## ✅ 2.22 — Tổng kết Tương hợp
- Trang Tương hợp thêm đoạn **Tổng kết** gộp 3 hệ (đếm hợp/cần dung hòa) thành một câu nhẹ nhàng, không phán duyên số.
- *TODO (cần kiểm chứng nguồn): Sao hạn Cửu Diệu — đã có thứ tự sao của NAM + nghĩa 9 sao, còn thiếu chu kỳ đầy đủ của NỮ nên hoãn để không bịa.*

## ✅ 2.21 — Decan (thập phân) cung hoàng đạo
- Ô "Xem cung" hiện **thập phân 1/2/3** (hệ triplicity): decan 1 thuần cung, decan 2–3 nhuốm sắc thái hai cung cùng nguyên tố. Tính xấp xỉ theo ngày, tham khảo.

## ✅ 2.20 — Lời khuyên 22 Ẩn Chính
- Mỗi lá Ẩn Chính có thêm **✦ Lời khuyên** ngắn (distil từ nghĩa RWS) trong cửa sổ chi tiết. (docs/11 #50)

## ✅ 2.19 — Tổng hợp quẻ Tarot + a11y
- Sau khi rút nhiều lá: đoạn **"Tổng hợp quẻ bài"** (đếm xuôi/ngược + dùng câu hỏi, giọng nhẹ, không phán chắc).
- **Vòng focus rõ** cho điều hướng bàn phím (accessibility).

## ✅ 2.18 — Tiêu đề trang theo route (SEO/UX nhẹ)
- Mỗi mục có document.title riêng (Trang chủ, Hồ sơ, Tarot, …, Tương hợp) thay vì dùng chung một tiêu đề.

## ✅ 2.17 — Bộ kiểm thử tự động
- `npm test` (tests/run.mjs) — **29 mốc** phủ numerology, Can Chi, lịch âm (kể cả ca 1985), Tarot không trùng lá, 64 quẻ, cung hoàng đạo, báo cáo an toàn & tương hợp. Lưới chống hồi quy khi làm ở nhiều máy.

## ✅ 2.16 — Trang Tương hợp (2 người)
- Một trang nhập **hai ngày sinh** → tương hợp **Số Chủ Đạo** (so khớp từ khóa, có caveat + nguồn), **Can Chi** (tái dùng xemHopTuoi), **Cung hoàng đạo** (tái dùng zodiacCompat) + kết luận nhẹ nhàng. Route /tuong-hop, có ở nav & Home.
- *Lưu ý: vượt khung MVP của docs/11 (mục #71) — làm theo yêu cầu "tự quyết"; deterministic, không AI/scrape, không khẳng định duyên số.*

## ✅ 2.15 — Giờ sinh dùng thật
- Khi nhập **giờ sinh**, Hồ sơ tính **giờ Can Chi** (trụ giờ, ngũ thử độn) — hiện ở thẻ Tử vi và đưa vào báo cáo. (Trước đó giờ sinh chỉ bật cảnh báo.)

## ✅ 2.14 — Thông điệp hôm nay
- Mục Hôm nay thêm **"Thông điệp hôm nay"**: năng lượng theo Con số ngày (1–9) + lá đồng hành, tất định & nhẹ nhàng.

## ✅ 2.13 — Báo cáo tổng hợp sâu hơn
- **Đoạn riêng theo chủ đề** (Tình yêu dùng Số Linh Hồn; Công việc dùng Chủ Đạo + Vận Mệnh; Tài chính kèm **miễn trừ**; Tổng quan).
- **Trích nghĩa lá bài hôm nay** vào phần luận trọng tâm.
- Nút **📋 Chép báo cáo** (sao chép toàn văn báo cáo + 7 ngày).

## ✅ MVP audit (docs/11) — bổ sung 6 mục
- **F8 Số Ngày Sinh** (numerology.js `birthdayNumber`; thẻ ở Thần số học).
- **F13 Ô câu hỏi Tarot** (hiện lại trong kết quả + lưu lịch sử).
- **F1+F6 Hồ sơ**: giờ sinh (tùy chọn) + chủ đề + câu hỏi + cảnh báo thiếu giờ sinh.
- **F19+F20 Báo cáo tổng hợp** (`src/data/report.js` `buildReport` — mock TẤT ĐỊNH, KHÔNG gọi API) + **Gợi ý 7 ngày tới**, cuối Hồ sơ.
- 14/20 mục MVP đã Done từ trước → giữ nguyên, không sửa.

### TODO — ngoài MVP (chỉ ghi, chưa làm theo docs/11)
Âm lịch nhập tay (#3,4); lưu nhiều hồ sơ & đăng nhập (#7,9); trải bài nâng cao (#31–40); astrology Tây (#61–70); tương hợp 2 người (#71–80); AI API thật/premium/thanh toán/PDF/SEO (#82,84,97–100). KHÔNG triển khai giai đoạn này.

## ✅ 2.11 — Thần số học sâu hơn & polish (hiện tại)
- **Đỉnh cao & Thử thách (Pinnacles & Challenges)**: 4 chu kỳ đời theo tuổi — công thức chuẩn, đối chiếu khớp ví dụ nguồn.
- **Đam mê tiềm ẩn & Bài học nghiệp quả**: từ tần suất chữ cái trong tên (số lặp nhiều nhất / số 1–9 vắng mặt). Thêm **Số Thái Độ** (ngày+tháng).
- **Mục "Hôm nay"** thêm ô **Con số ngày** (universal day number).
- **Lật mặt lá Tarot** khi rút (hiệu ứng 3D rotateY).
- **Tử vi**: tuổi âm (mụ) năm nay + cảnh báo "năm tuổi".
- **Hồ sơ tổng hợp**: Can Chi & cung phi dùng đúng **năm âm lịch**, hiện ngày âm (nhất quán với ô Tử vi).

## ✅ 2.10 — Mục "Hôm nay" & PWA
- **Mục "Hôm nay" ở trang chủ**: lá bài Tarot, quẻ Dịch (tất định theo ngày), Can Chi ngày + âm lịch + giờ hoàng đạo — bấm để mở công cụ tương ứng.
- **PWA**: cài như app (manifest + icon PNG), service worker cache offline (asset cùng origin) — mở lại không cần mạng sau lần đầu. Áp dụng cho bản online.
- **Lưu lá Tarot yêu thích**: gắn ★ ở thư viện & trong modal, bộ lọc "★ Yêu thích" riêng, lưu localStorage.

## 🔭 3.0 — Tiếp theo
- Đa ngôn ngữ Việt/Anh; hiệu ứng lật mặt lá Tarot.
- Backend khi cần lưu kết quả/tài khoản/AI luận giải phía máy chủ.

## 🧭 Nguyên tắc
1. Có nguồn mới đưa; chưa chắc ghi "cần kiểm chứng thêm". 2. Tách dữ kiện vs diễn giải.
3. Dữ liệu rời giao diện. 4. Kiểm thử + build sạch + kiểm mobile. 5. Tôn trọng bản quyền. 6. Ưu tiên dễ triển khai.
