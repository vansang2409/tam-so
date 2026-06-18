# 🚀 Hướng dẫn chạy Tam Sở trên máy khác

Có 3 cách, chọn theo nhu cầu. Cách 1 dễ nhất (không cài gì); Cách 3 dành cho khi muốn sửa code.

---

## ✅ Cách 1 — Xem nhanh, KHÔNG cài gì (dễ nhất)
1. Chép **một file duy nhất**: `tam-so-test.html` sang máy kia (USB, Zalo, email, Drive… đều được).
2. **Double-click** để mở bằng trình duyệt (Chrome / Edge / Cốc Cốc / Firefox).

Chạy được ngay, đầy đủ tính năng, **không cần mạng**.
> Lưu ý: ảnh lá Tarot cần internet để tải từ Wikimedia; khi offline sẽ hiện "thẻ bài" thay thế (không vỡ giao diện).

---

## ✅ Cách 2 — Chạy bản đã build (web tĩnh)
- Chép cả thư mục **`dist/`** sang máy kia → mở **`dist/index.html`**.
- Hoặc đưa `dist/` lên hosting tĩnh miễn phí: kéo–thả vào **Netlify Drop** (app.netlify.com/drop), hoặc Vercel / GitHub Pages.

---

## ✅ Cách 3 — Chạy để CHỈNH SỬA code (môi trường dev đầy đủ)

**Bước 1. Cài Node.js** (bản **LTS 20+**) tại https://nodejs.org → cài xong là có sẵn `npm`.
Kiểm tra: mở terminal gõ `node -v` và `npm -v` thấy ra số phiên bản là được. (Cần Node ≥ 18 vì dùng Vite 5.)

**Bước 2. Lấy mã nguồn** — chọn 1 trong 2:
- **Cách A (khuyên dùng):** clone từ GitHub
  ```bash
  git clone https://github.com/vansang2409/tam-so.git
  cd tam-so
  ```
- **Cách B:** chép thẳng thư mục dự án sang máy kia, **NHƯNG xoá `node_modules` trước khi chép** (thư mục này rất nặng và phụ thuộc hệ máy — sẽ cài lại ở bước 3).

**Bước 3. Cài thư viện & chạy** (mở terminal trong thư mục dự án):
```bash
npm install        # cài thư viện, ~1–2 phút
npm run dev        # chạy bản phát triển
```
Mở trình duyệt vào địa chỉ terminal in ra (thường là **http://localhost:5173**).
Dừng server: bấm **Ctrl + C** trong terminal.

**Bước 4. Build bản phát hành** (khi muốn file tĩnh để chia sẻ / deploy):
```bash
npm run build      # tạo thư mục dist/
npm run preview    # xem thử bản build tại localhost
```

---

## 🃏 Hiện ảnh Tarot THẬT trên site (thay vì thẻ dự phòng)
Hiện `public/cards/` đang trống nên web dùng ảnh tạm từ Wikimedia (đôi khi chậm/bị chặn) hoặc thẻ vẽ sẵn. Làm **một lần** để có đủ 78 tranh RWS (phạm vi công cộng) ngay trên site:

**Trên máy của bạn** (có internet), trong thư mục `D:\tam-so`:
```bash
npm install            # nếu chưa cài lần nào
npm run fetch-cards    # tải 78 ảnh RWS về public/cards/ (chờ ~1–2 phút)
```
Kiểm tra: thư mục `public/cards/` có khoảng **78 file ảnh**.

Rồi đẩy lên GitHub để site live cập nhật:
```bash
git add public/cards
git commit -m "Them anh Tarot RWS (public domain)"
git push               # hoặc double-click push-to-github.bat
```
GitHub Pages sẽ tự build lại; sau ít phút site hiện tranh thật.

> Ảnh RWS 1909 thuộc **phạm vi công cộng** (đã ghi nguồn ở trang Nguồn). Công tắc `LOCAL_CARDS` trong `src/data/tarot.js` đang bật nên web ưu tiên ảnh nội bộ vừa tải.

## 🛠 Khắc phục sự cố thường gặp
- **`npm` / `node` không phải là lệnh** → chưa cài Node.js (Bước 1), hoặc cần **mở lại cửa sổ terminal mới** sau khi cài.
- **Cổng 5173 đang bận** → Vite tự nhảy sang cổng khác (xem dòng terminal), hoặc chạy `npm run dev -- --port 5174`.
- **Sửa MÀU trong `tailwind.config.js` mà giao diện không đổi / chữ bị mờ** → dừng (Ctrl + C) rồi `npm run dev` lại. Vite **không tự nạp lại** file cấu hình này khi đang chạy.
- **Chữ tiếng Việt hiển thị lạ** → cần internet để tải Google Fonts (Be Vietnam Pro, Playfair Display); offline vẫn đọc được bằng font hệ thống.
- **Sau khi đổi `package.json` / cài thêm thư viện** → chạy lại `npm install`.

---

## 📤 Đưa code mới lên GitHub (nếu sửa trên máy này)
- Windows: chạy **`push-to-github.bat`** (đã có sẵn trong thư mục).
- Hoặc thủ công: `git add -A && git commit -m "cập nhật" && git push`.

---

## ℹ️ Tóm tắt lệnh
| Lệnh | Tác dụng |
|---|---|
| `npm install` | Cài thư viện (chạy 1 lần sau khi lấy mã / đổi package.json) |
| `npm run dev` | Chạy bản phát triển (localhost, tự cập nhật khi sửa code) |
| `npm run build` | Tạo bản phát hành trong `dist/` |
| `npm run preview` | Xem thử bản build |
| `npm test` | Chạy 79 kiểm thử logic |
| `npm run fetch-cards` | Tải ảnh Tarot RWS về `public/cards/` |

*Tam Sở — Tarot · Thần số học · Tử vi · Chiêm tinh · Kinh Dịch.*
