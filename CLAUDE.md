# CLAUDE.md — Hướng dẫn AI làm việc trên Tam Sở

## Dự án
Web huyền học tiếng Việt (Tarot/Thần số học/Tử vi/Chiêm tinh/Kinh Dịch). Vite 5 + React 18 + Tailwind 3 + react-router-dom. Web TĨNH, mọi tính toán client-side, không backend/db/auth. PWA.

## Lệnh
- Dev: `npm run dev` · Build: `npm run build` · Test: `npm test` (= `node tests/run.mjs`, hiện 139 mốc) · Ảnh Tarot: `npm run fetch-cards`.

## Cấu trúc
- `src/pages/`: Home, Profile(Hồ sơ), Tarot, Numerology, TuVi, LaSoTuVi, SoLaSo, Zodiac, IChing, TuongHop, Sources. Route ở `src/main.jsx`.
- `src/data/`: tarot.js (78 lá + birthCards), numerology.js, tuvi.js (Can Chi…), tuvidauso.js (engine an sao + DO_SANG + doSangSummary), tuvi-saocung.js (168), zodiac.js, iching.js + iching-text.js (64 Thoán+384 hào), lunar.js (HND), report.js, site.js (cờ router + shareUrl).
- `src/components/`: Layout (nav), Today (Hôm nay), Modal, CardImage, Hexagram, Disclaimer, ErrorBoundary.

## Quy ước nội dung (BẮT BUỘC)
Tách **dữ kiện** (tính toán, kiểm chứng được) vs **diễn giải** (truyền thống, "tham khảo"). KHÔNG phán tuyệt đối, không hù dọa, giọng trấn an. Có nguồn mới khẳng định; chưa chắc thì nói "cần kiểm chứng thêm". Tiếng Việt, dí dỏm nhẹ. Bản quyền: tài nguyên hợp pháp (RWS PD, OFL, MIT, Legge 1899) + ghi công; nội dung tự biên soạn.

## Gotcha kỹ thuật
- Ổ D: cắt cụt file khi Write/Edit lớn → ghi bằng bash `cat >`/node fs, rồi đếm ngoặc + chạy test.
- KHÔNG build trên mount (node_modules Windows) → dựng `/tmp/b`: copy src+config, `npm install`, `npm i -D vite-plugin-singlefile`, tạo `vite.config.single.js`; build chính + single; copy `dist/`+`dist-single/index.html`→`tam-so-test.html`. `/tmp` có thể bị xoá giữa phiên → dựng lại. Verify `dist IDENTICAL` + single `NUL=0`. Bump `public/sw.js` cache.
- Không push từ sandbox → user chạy `push-to-github.bat` (commit message luôn ghi "v2.11" nhưng chứa code hiện tại). git LOCAL (checkout/reset/show) chạy được.
- Agent ngoài có thể sửa cùng repo → nếu hỏng, `git checkout HEAD -- <file>` để hoàn nguyên.

## Vòng lặp làm việc
Đọc SUMMARY/TASK_BOARD/WORK_LOG → lấy task High/Doing → làm → tự test → build → present → cập nhật log/board. Không dừng khi còn task; chỉ dừng khi bị chặn thật.

## Lưu ý báo cáo
- **KHÔNG nhắc user chạy push-to-github.bat** — chủ dự án tự chạy cuối ngày (dặn 19/06/2026).

## ⚡ Chế độ làm việc (AI EMPLOYEE — ANTI-STOP) — bắt buộc
Chủ dự án yêu cầu (19/06/2026): **tự nghiên cứu, tự lên kế hoạch, làm LIÊN TỤC không ngừng nghỉ. CHỈ ngừng khi chủ dự án NHẮN.**
1. Không kết thúc phản hồi bằng "đang tiếp tục", "bắt tay luôn", "sẽ làm tiếp" — nếu nói tiếp thì phải làm NGAY trong cùng lượt (đọc/sửa file, chạy lệnh, kiểm tra, ghi log).
2. Còn task Todo/Doing trong TASK_BOARD.md → tự chọn task ưu tiên cao nhất và làm tiếp, không hỏi xác nhận.
3. Mỗi lượt phải có ≥1 hành động thực tế (trừ khi bị chặn thật).
4. Gần hết khả năng trong lượt: cập nhật SUMMARY.md + WORK_LOG.md + ghi rõ task kế; KHÔNG viết "đang tiếp tục" nếu không thật sự làm trong lượt đó.
5. Bị chặn thật (thiếu quyền/file/môi trường/cần quyết định lớn) mới dừng — ghi rõ: chặn ở đâu, lý do, cần gì, task khác làm được không.
6. Vòng lặp: đọc SUMMARY/TASK_BOARD/WORK_LOG → chọn task → làm → tự test (`node tests/run.mjs`) → build /tmp/b → present `tam-so-test.html` → cập nhật board/log → chọn task kế.
