# Đánh giá hai repo tham khảo — 02/11/2026

- https://github.com/zane-tv/tiktok-live-temple-rpc — cây nguồn tại 2f8b9822f1507d66c16a1fb42053906304a16d11 có nền PNG/JPG, nhân vật sprite, particle Canvas 2D và TikTok/Bun/TTS. Không có GLB/GLTF/FBX/OBJ/Blend trong cây nguồn. Chưa thấy file LICENSE. Không sao chép mã hay tài nguyên. Tham khảo khái niệm chuỗi nghi thức và tạo texture khói một lần trước vòng lặp.
- https://github.com/kentjuno/chanh-dien-online — cây nguồn tại bee578d267c52940da08bc16171cfe8392b69d17; LICENSE MIT, copyright 2026 Kent Juno. index.html xác định 2.5D (nền vẽ + Canvas sprite), không phải khuôn viên 3D tự do. Ảnh/nhạc được README ghi là tạo bằng Google Flow/Gemini, có lưu ý riêng về điều khoản sử dụng. Không đưa ảnh/nhạc/mã của repo vào Tam Sở. Tham khảo nhịp đi vào/ngồi xuống, kiểm soát âm thanh theo tương tác người dùng.

Quyết định: giữ Three.js và 23 khu của Tam Sở; tự dựng kiến trúc khác nhau, vật liệu/bóng đổ, chuột trái đi (giữ-rê đổi đích), phải xoay và lăn chuột zoom. Texture khói tạo tại máy được tái sử dụng giữa các sprite. Không thêm TikTok/live server vào phạm vi hiện tại.

## v4.6.0 — Tài nguyên trên trang 3D đang hoạt động

Trang công khai https://tinhtam.kentjuno.com/ có bản 3D khác với cây repo 2.5D đã khảo sát. Phần ghi công nêu các mô hình CC BY 4.0. Đã kiểm tra trực tiếp metadata Sketchfab của MingEID (altar 44bb389c9a8e4d59b2d7041a7f82acdb) và Diana Liu/Thunk3D (Guanyin 4b0410c196c6475ba85d527966ea00b6): license.slug = by, URL CC BY 4.0, cho phép sử dụng thương mại với ghi công. Chỉ lấy hai GLB được ghi công đó, tổng 221632 byte, từ bản tối ưu công khai; không lấy code/nhân vật/tranh/kiến trúc riêng.

Nguồn tác phẩm, nguồn chuyển đổi, giấy phép, SHA-256 và thay đổi được lưu ở public/dichua/models/ATTRIBUTION.md và manifest.json, đồng thời hiển thị trong nút Ghi công 3D. Tính lại normal, giữ cạnh bàn, chia chất liệu gỗ/kim loại, đổi tỷ lệ và bố trí; cảnh không tuyên bố phục dựng đúng một ngôi chùa.
