# Đánh giá hai repo tham khảo — 02/11/2026

- https://github.com/zane-tv/tiktok-live-temple-rpc — cây nguồn tại 2f8b9822f1507d66c16a1fb42053906304a16d11 có nền PNG/JPG, nhân vật sprite, particle Canvas 2D và TikTok/Bun/TTS. Không có GLB/GLTF/FBX/OBJ/Blend trong cây nguồn. Chưa thấy file LICENSE. Không sao chép mã hay tài nguyên. Tham khảo khái niệm chuỗi nghi thức và tạo texture khói một lần trước vòng lặp.
- https://github.com/kentjuno/chanh-dien-online — cây nguồn tại bee578d267c52940da08bc16171cfe8392b69d17; LICENSE MIT, copyright 2026 Kent Juno. index.html xác định 2.5D (nền vẽ + Canvas sprite), không phải khuôn viên 3D tự do. Ảnh/nhạc được README ghi là tạo bằng Google Flow/Gemini, có lưu ý riêng về điều khoản sử dụng. Không đưa ảnh/nhạc/mã của repo vào Tam Sở. Tham khảo nhịp đi vào/ngồi xuống, kiểm soát âm thanh theo tương tác người dùng.

Quyết định: giữ Three.js và 23 khu của Tam Sở; tự dựng kiến trúc khác nhau, vật liệu/bóng đổ, chuột trái đi (giữ-rê đổi đích), phải xoay và lăn chuột zoom. Texture khói tạo tại máy được tái sử dụng giữa các sprite. Không thêm TikTok/live server vào phạm vi hiện tại.
