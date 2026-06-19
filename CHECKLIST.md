# CHECKLIST — QA mỗi lần nâng cấp

- [ ] Chạy được? (build /tmp/b OK, dist IDENTICAL, single NUL=0)
- [ ] `node tests/run.mjs` pass (hiện 139)
- [ ] Mobile ~380px không vỡ (flex-wrap, grid xuống 1 cột, overflow-x-auto, tap≥40px)
- [ ] Chức năng chính dùng được; nhập sai có báo lỗi nhẹ nhàng
- [ ] Kết quả dễ đọc; giọng trấn an, không phán tuyệt đối, không hù dọa
- [ ] Không trùng chức năng / không phá route cũ
- [ ] Không lỗi console nghiêm trọng
- [ ] Cân bằng ngoặc {}() sau khi sửa bằng bash
- [ ] Bump sw cache `tamso-vX.XX` + package.json version
- [ ] Ghi WORK_LOG + cập nhật TASK_BOARD/SUMMARY
- [ ] Nhắc user chạy push-to-github.bat
