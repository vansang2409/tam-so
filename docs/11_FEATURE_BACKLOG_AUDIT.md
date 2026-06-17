# 11_FEATURE_BACKLOG_AUDIT.md - Backlog tính năng + Audit hiện trạng

## Mục đích file

File này dùng cho Claude Code khi project **Tâm Số AI** đã được triển khai một phần.

Nhiệm vụ chính của Claude Code:

1. Đọc code hiện tại.
2. Kiểm tra tính năng nào đã làm rồi.
3. Đánh dấu trạng thái từng tính năng.
4. Bỏ qua tính năng đã hoàn thành.
5. Chỉ triển khai phần còn thiếu theo đúng scope MVP.
6. Không làm lại từ đầu nếu code hiện tại đã chạy được.

---

# Nguyên tắc bắt buộc

Claude Code phải tuân thủ:

- Không tự ý viết lại toàn bộ project.
- Không xóa code cũ nếu chưa có lý do rõ ràng.
- Không refactor lớn khi chưa cần.
- Không làm lại tính năng đã hoạt động.
- Không làm thanh toán.
- Không làm đăng nhập nếu chưa được yêu cầu.
- Không gọi AI API thật ở giai đoạn này.
- Không scrape hoặc copy nội dung từ website khác.
- Không hù dọa người dùng.
- Không khẳng định chắc chắn tương lai.
- Không đưa lời khuyên tài chính, y tế, pháp lý như chuyên gia.
- Controller phải mỏng.
- Logic nghiệp vụ nằm trong service.
- Nếu có tính năng đã làm nhưng còn lỗi nhỏ, chỉ sửa lỗi nhỏ, không viết lại toàn bộ.

---

# Cách làm việc bắt buộc

Trước khi code, Claude Code phải làm 4 bước:

## Bước 1: Audit project hiện tại

Kiểm tra:

- Routes
- Controllers
- Models
- Migrations
- Seeders
- Services
- Views
- Config
- Tests nếu có
- Database schema hiện tại

Không sửa code ở bước này.

## Bước 2: Tạo bảng trạng thái tính năng

Claude Code phải báo cáo theo format:

| ID | Tính năng | Trạng thái | File liên quan | Ghi chú |
|---|---|---|---|---|
| 1 | Nhập hồ sơ cá nhân | Done / Partial / Missing / Not MVP | ... | ... |

Ý nghĩa trạng thái:

- `Done`: Đã làm và có vẻ chạy được.
- `Partial`: Đã làm một phần, cần bổ sung.
- `Missing`: Chưa có.
- `Not MVP`: Không làm ở MVP.
- `Need Test`: Có code nhưng chưa chắc chạy đúng.

## Bước 3: Lập kế hoạch làm phần còn thiếu

Chỉ lập kế hoạch cho các tính năng:

- `Missing`
- `Partial`
- `Need Test`

Không động vào tính năng `Done`.

## Bước 4: Xin xác nhận trước khi sửa code

Trước khi sửa code, phải báo:

1. Sẽ sửa/tạo file nào
2. Vì sao cần sửa
3. Tính năng nào được bỏ qua vì đã hoàn thành
4. Tính năng nào không làm vì ngoài MVP
5. Lệnh test sau khi sửa

---

# Danh sách 100 tính năng tham khảo

Lưu ý:

- Đây là backlog tham khảo.
- Không triển khai hết 100 tính năng.
- MVP chỉ ưu tiên nhóm `Priority: MVP`.
- Tính năng `Priority: Later` hoặc `Much Later` chỉ ghi TODO.

---

## A. Hồ sơ cá nhân

### 1. Nhập hồ sơ cá nhân cơ bản

Người dùng nhập:

- Họ tên
- Ngày sinh
- Giờ sinh, không bắt buộc
- Giới tính
- Chủ đề muốn xem
- Câu hỏi hiện tại

Priority: MVP

Audit:

- Kiểm tra form Blade.
- Kiểm tra validation.
- Kiểm tra bảng `readings`.
- Nếu đã có và submit được thì đánh dấu `Done`.

---

### 2. Hỗ trợ ngày sinh dương lịch

Form mặc định dùng ngày sinh dương lịch.

Priority: MVP

Audit:

- Kiểm tra input date.
- Kiểm tra format lưu DB.

---

### 3. Hỗ trợ ngày sinh âm lịch

Cho phép người dùng chọn ngày sinh âm lịch.

Priority: Later

MVP: Không làm.

---

### 4. Tự đổi ngày dương sang âm

Tích hợp thuật toán chuyển đổi âm dương lịch.

Priority: Later

MVP: Không làm.

---

### 5. Tự nhận diện Can Chi năm sinh

Từ năm sinh, hệ thống tính Thiên Can, Địa Chi và Can Chi.

Priority: MVP

Audit:

- Kiểm tra `TuViService`.
- Test năm 1999.

---

### 6. Tự tính tuổi âm lịch

Tính tuổi âm lịch cơ bản theo năm hiện tại.

Priority: MVP

Audit:

- Kiểm tra output của `TuViService`.

---

### 7. Lưu nhiều hồ sơ

Lưu hồ sơ bản thân, người yêu, bạn bè.

Priority: Later

MVP: Không làm.

---

### 8. Hồ sơ khách không cần đăng nhập

Người dùng không đăng nhập vẫn xem được kết quả.

Priority: MVP

Audit:

- Kiểm tra flow có bắt login không.
- MVP không được yêu cầu đăng nhập.

---

### 9. Hồ sơ đăng nhập để lưu lâu dài

Sau này thêm đăng nhập để lưu lịch sử.

Priority: Later

MVP: Không làm.

---

### 10. Cảnh báo khi thiếu giờ sinh

Nếu thiếu giờ sinh, hiển thị cảnh báo nhẹ.

Priority: MVP

Text gợi ý:

> Bạn chưa nhập giờ sinh nên phần tử vi chỉ được phân tích ở mức cơ bản.

---

## B. Thần số học

### 11. Tính số chủ đạo / Life Path Number

Tính từ ngày, tháng, năm sinh.

Priority: MVP

Test bắt buộc:

- `1999-04-24` phải ra `11/2`.

Audit:

- Kiểm tra `NumerologyService`.
- Kiểm tra logic master number.

---

### 12. Tính số ngày sinh / Birthday Number

Tính từ ngày sinh.

Ví dụ:

- 24 → 2 + 4 = 6

Priority: MVP

Test bắt buộc:

- `1999-04-24` phải ra Birthday Number = `6`.

---

### 13. Tính năm cá nhân / Personal Year

Tính từ ngày sinh, tháng sinh và năm hiện tại.

Priority: MVP

Audit:

- Kiểm tra có dùng năm hiện tại không.
- Nên lấy năm hiện tại bằng `now()->year`.

---

### 14. Tính tháng cá nhân / Personal Month

Priority: Later

MVP: Không làm.

---

### 15. Tính ngày cá nhân / Personal Day

Priority: Later

MVP: Không làm.

---

### 16. Tính số sứ mệnh / Destiny Number

Tính từ họ tên đầy đủ.

Priority: Later

MVP: Không làm.

---

### 17. Tính số linh hồn / Soul Urge

Tính từ nguyên âm trong họ tên.

Priority: Later

MVP: Không làm.

---

### 18. Tính số nhân cách / Personality Number

Tính từ phụ âm trong họ tên.

Priority: Later

MVP: Không làm.

---

### 19. Hỗ trợ master number 11, 22, 33

Priority: MVP

Audit:

- Kiểm tra số chủ đạo có giữ `11/2`, `22/4`, `33/6` không.

---

### 20. Báo cáo bản đồ thần số học cá nhân

Priority: Later

MVP: Chỉ cần báo cáo ngắn trong AiReportService mock.

---

## C. Tarot cơ bản

### 21. Rút 1 lá Tarot hôm nay

Priority: MVP

Audit:

- Kiểm tra form có chọn spread 1 lá không.
- Kiểm tra `TarotService`.

---

### 22. Rút 3 lá: quá khứ - hiện tại - lời khuyên

Priority: MVP

Audit:

- Kiểm tra `drawThreeCards`.
- Không được trùng lá.

---

### 23. Rút 3 lá: tình huống - trở ngại - kết quả tham khảo

Priority: Later

MVP: Không bắt buộc.

---

### 24. Rút bài Yes / No

Priority: Later

MVP: Không làm.

---

### 25. Rút bài tình yêu

Priority: Later

MVP: Có thể dùng topic để diễn giải, chưa cần spread riêng.

---

### 26. Rút bài công việc

Priority: Later

MVP: Có thể dùng topic để diễn giải, chưa cần spread riêng.

---

### 27. Rút bài tài chính

Priority: Later

MVP: Không làm spread riêng.

---

### 28. Rút bài theo câu hỏi tự nhập

Priority: MVP

Audit:

- Kiểm tra form có `question`.
- Kiểm tra report có dùng câu hỏi không.

---

### 29. Hỗ trợ bài xuôi / bài ngược

Priority: MVP

Audit:

- Kiểm tra `orientation`.
- Giá trị chỉ nên là `upright` hoặc `reversed`.

---

### 30. Không rút trùng lá trong cùng trải bài

Priority: MVP

Audit:

- Test rút 3 lá nhiều lần.

---

## D. Tarot nâng cao

### 31. Trải bài Celtic Cross 10 lá

Priority: Later

MVP: Không làm.

---

### 32. Trải bài 5 lá cho quyết định A/B

Priority: Later

MVP: Không làm.

---

### 33. Trải bài: Tôi nên tập trung vào điều gì hôm nay?

Priority: Later

MVP: Không làm.

---

### 34. Trải bài: Điều tôi chưa nhìn thấy

Priority: Later

MVP: Không làm.

---

### 35. Trải bài: Năng lượng 7 ngày tới

Priority: Later

MVP: Không làm.

---

### 36. Trải bài: Tình cảm giữa hai người

Priority: Later

MVP: Không làm.

---

### 37. Trải bài: Công việc hiện tại nên tiếp tục hay dừng?

Priority: Later

MVP: Không làm.

---

### 38. Trải bài: Thông điệp từ tiềm thức

Priority: Later

MVP: Không làm.

---

### 39. Cho người dùng chọn bộ bài / deck

Priority: Later

MVP: Không làm.

---

### 40. Hiển thị hoạt ảnh lật bài

Priority: Later

MVP: Không bắt buộc.

---

## E. Thư viện Tarot

### 41. Thư viện 78 lá Tarot

Priority: Later

MVP:

- Có thể chỉ cần 22 lá Major Arcana.

---

### 42. Phân loại Major Arcana và Minor Arcana

Priority: Later

MVP: Chỉ cần có field `arcana_type`.

---

### 43. Ý nghĩa lá bài xuôi

Priority: MVP với 22 lá đầu

Audit:

- Kiểm tra seed tarot cards có `upright_keywords` hoặc ý nghĩa xuôi.

---

### 44. Ý nghĩa lá bài ngược

Priority: MVP với 22 lá đầu

Audit:

- Kiểm tra seed tarot cards có `reversed_keywords` hoặc ý nghĩa ngược.

---

### 45. Ý nghĩa theo tình yêu

Priority: MVP hoặc Later

Nếu đã có thì giữ. Nếu chưa có, MVP có thể bổ sung ngắn.

---

### 46. Ý nghĩa theo công việc

Priority: MVP hoặc Later

Nếu đã có thì giữ. Nếu chưa có, MVP có thể bổ sung ngắn.

---

### 47. Ý nghĩa theo tài chính

Priority: Later

MVP: Không bắt buộc.

---

### 48. Từ khóa nhanh của từng lá

Priority: MVP

Audit:

- Kiểm tra seed có keyword không.

---

### 49. Biểu tượng chính trên lá bài

Priority: Later

MVP: Không làm.

---

### 50. Bài học / lời khuyên của từng lá

Priority: MVP

Audit:

- Kiểm tra field `advice`.

---

## F. Tử vi / phương Đông cơ bản

### 51. Tính Can Chi năm sinh

Priority: MVP

---

### 52. Tính Thiên Can

Priority: MVP

---

### 53. Tính Địa Chi

Priority: MVP

---

### 54. Tính mệnh ngũ hành

Priority: MVP

Lưu ý:

- Phần nạp âm dễ sai.
- Nên dùng mapping rõ ràng.
- Nếu không chắc, ghi chú cần kiểm tra.

---

### 55. Tính âm / dương theo năm sinh

Priority: Later

MVP: Không bắt buộc.

---

### 56. Tính tam hợp

Priority: Later

MVP: Không làm.

---

### 57. Tính tứ hành xung

Priority: Later

MVP: Không làm.

---

### 58. Xem tổng quan năm hiện tại

Priority: Later

MVP: Không làm.

---

### 59. Xem tổng quan tháng hiện tại

Priority: Later

MVP: Không làm.

---

### 60. Xem ngày hôm nay hợp làm gì

Priority: Later

MVP: Không làm.

---

## G. Astrology / tử vi Tây phương nâng cao

### 61. Lập birth chart Tây phương

Priority: Much Later

MVP: Không làm.

---

### 62. Tính Sun Sign

Priority: Later

MVP: Không làm, trừ khi đã có sẵn thì giữ.

---

### 63. Tính Moon Sign

Priority: Much Later

MVP: Không làm.

---

### 64. Tính Rising Sign / Ascendant

Priority: Much Later

MVP: Không làm.

---

### 65. Hiển thị vòng tròn birth chart

Priority: Much Later

MVP: Không làm.

---

### 66. Xem vị trí các hành tinh

Priority: Much Later

MVP: Không làm.

---

### 67. Xem các nhà / houses

Priority: Much Later

MVP: Không làm.

---

### 68. Xem aspect giữa các hành tinh

Priority: Much Later

MVP: Không làm.

---

### 69. Xem transit hôm nay

Priority: Much Later

MVP: Không làm.

---

### 70. Xem ngày tốt / ngày cần cẩn trọng theo lịch cá nhân

Priority: Much Later

MVP: Không làm.

---

## H. Tương hợp tình yêu / quan hệ

### 71. Xem tương hợp 2 người bằng ngày sinh

Priority: Later

MVP: Không làm nếu chưa có.

Nếu đã có sẵn thì chỉ audit, không viết lại.

---

### 72. Xem tương hợp bằng thần số học

Priority: Later

MVP: Không làm.

---

### 73. Xem tương hợp bằng Can Chi / ngũ hành

Priority: Later

MVP: Không làm.

---

### 74. Xem tương hợp bằng Tarot 3 lá

Priority: Later

MVP: Không làm.

---

### 75. Xem điểm mạnh của mối quan hệ

Priority: Later

MVP: Không làm.

---

### 76. Xem điểm dễ mâu thuẫn

Priority: Later

MVP: Không làm.

---

### 77. Gợi ý cách giao tiếp giữa hai người

Priority: Later

MVP: Không làm.

---

### 78. Lưu hồ sơ người yêu / crush

Priority: Later

MVP: Không làm.

---

### 79. So sánh nhiều người với nhau

Priority: Much Later

MVP: Không làm.

---

### 80. Tạo ảnh chia sẻ mức độ hợp nhau

Priority: Later

MVP: Không làm.

---

## I. AI cá nhân hóa

### 81. AI tổng hợp Tarot + thần số học + tử vi

Priority: MVP với mock report

Audit:

- Kiểm tra `AiReportService`.
- Nếu đã có mock report thì không gọi API thật.

---

### 82. AI trả lời câu hỏi dựa trên hồ sơ cá nhân

Priority: Later

MVP: Chỉ cần report dùng câu hỏi, chưa cần chat.

---

### 83. AI viết báo cáo ngắn miễn phí

Priority: MVP với mock report

---

### 84. AI viết báo cáo sâu premium

Priority: Later

MVP: Không làm.

---

### 85. AI tạo thông điệp hôm nay

Priority: Later

MVP: Không bắt buộc.

---

### 86. AI tạo việc nên làm trong 7 ngày tới

Priority: MVP

Audit:

- Kiểm tra report có section gợi ý 7 ngày tới không.

---

### 87. AI giải thích lá bài theo hoàn cảnh người dùng

Priority: MVP với mock report

Audit:

- Kiểm tra report có dùng topic/question không.

---

### 88. AI hỏi ngược lại để làm rõ câu hỏi

Priority: Later

MVP: Không làm.

---

### 89. AI tạo phiên bản nhẹ nhàng, không hù dọa

Priority: MVP

Audit:

- Kiểm tra nội dung report.
- Không được có câu chắc chắn/hù dọa.

---

### 90. AI fallback nếu API lỗi

Priority: MVP

Vì MVP chưa gọi API thật, mock report chính là fallback.

---

## J. Giữ chân người dùng / viral / kiếm tiền sau này

### 91. Lưu lịch sử các lần xem

Priority: Later

MVP:

- Có thể lưu reading bằng ID trong database.
- Chưa cần tài khoản.

---

### 92. Nhật ký Tarot hằng ngày

Priority: Later

MVP: Không làm.

---

### 93. Nhắc người dùng rút bài mỗi ngày

Priority: Later

MVP: Không làm.

---

### 94. Streak số ngày quay lại

Priority: Later

MVP: Không làm.

---

### 95. Tạo ảnh kết quả để chia sẻ

Priority: Later

MVP: Không làm nếu chưa có.

---

### 96. Copy link kết quả

Priority: Later hoặc MVP nhẹ

Nếu đã có trang `/reading/{id}`, có thể thêm nút copy link nếu đơn giản.

---

### 97. Báo cáo PDF cá nhân hóa

Priority: Later

MVP: Không làm.

---

### 98. Hệ thống điểm / lượt xem miễn phí

Priority: Later

MVP: Không làm.

---

### 99. Gói premium mở khóa báo cáo sâu

Priority: Later

MVP: Không làm.

---

### 100. Trang SEO cho từng chủ đề

Priority: Later

MVP: Không làm.

---

# 20 tính năng MVP ưu tiên audit trước

Claude Code phải audit 20 tính năng này trước tiên:

1. Nhập hồ sơ cá nhân
2. Hỗ trợ ngày sinh dương lịch
3. Tự nhận diện Can Chi năm sinh
4. Tự tính tuổi âm lịch
5. Hồ sơ khách không cần đăng nhập
6. Cảnh báo khi thiếu giờ sinh
7. Tính số chủ đạo
8. Tính số ngày sinh
9. Tính năm cá nhân
10. Hỗ trợ master number 11, 22, 33
11. Rút 1 lá Tarot hôm nay
12. Rút 3 lá Tarot
13. Rút bài theo câu hỏi tự nhập
14. Hỗ trợ bài xuôi / bài ngược
15. Không rút trùng lá trong cùng trải bài
16. Ý nghĩa lá bài xuôi/ngược cho 22 Major Arcana
17. Tính Thiên Can / Địa Chi / Can Chi
18. Tính mệnh ngũ hành cơ bản
19. AI report mock tổng hợp Tarot + thần số học + tử vi
20. Gợi ý việc nên làm trong 7 ngày tới

---

# Prompt dùng cho Claude Code

Dán prompt này cho Claude Code sau khi copy file này vào thư mục `docs`.

```text
Hãy đọc các file:
- CLAUDE.md
- docs/02_TASK_LIST.md
- docs/11_FEATURE_BACKLOG_AUDIT.md

Bối cảnh:
Project hiện tại đã làm được một số chức năng rồi, nên không được làm lại từ đầu.

Nhiệm vụ trước tiên:
1. Audit code hiện tại.
2. Đối chiếu với 20 tính năng MVP trong docs/11_FEATURE_BACKLOG_AUDIT.md.
3. Đánh dấu từng tính năng là Done / Partial / Missing / Not MVP / Need Test.
4. Với tính năng Done thì bỏ qua, không sửa.
5. Với tính năng Partial hoặc Missing thì đề xuất cách bổ sung nhỏ nhất.
6. Với tính năng Not MVP thì chỉ ghi TODO, không làm.
7. Không triển khai code ngay cho đến khi báo cáo xong kế hoạch.

Không được:
- Viết lại toàn bộ project.
- Xóa code cũ không cần thiết.
- Refactor lớn.
- Làm thanh toán.
- Làm đăng nhập.
- Gọi AI API thật.
- Scrape hoặc copy nội dung website khác.
- Hù dọa người dùng hoặc khẳng định chắc chắn tương lai.

Sau khi audit, hãy báo cáo theo format:

## 1. Tổng quan hiện trạng

## 2. Bảng audit 20 tính năng MVP

| ID | Tính năng | Trạng thái | File liên quan | Ghi chú |
|---|---|---|---|---|

## 3. Tính năng đã có và sẽ bỏ qua

## 4. Tính năng còn thiếu cần làm

## 5. Tính năng ngoài MVP không làm

## 6. Kế hoạch sửa nhỏ nhất

## 7. Lệnh test nên chạy sau khi sửa

Chỉ sau khi tôi đồng ý kế hoạch thì mới bắt đầu sửa code.
```

---

# Lệnh test gợi ý

Sau khi sửa code, Claude Code nên chạy:

```bash
php artisan route:list
php artisan migrate
php artisan db:seed
php artisan test
npm run build
```

Nếu lệnh nào không phù hợp với project hiện tại thì bỏ qua và giải thích lý do.
