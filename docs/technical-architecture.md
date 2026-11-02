# Kiến trúc kỹ thuật

React/Vite + Three.js đang có; không thêm dependency runtime. DiChua là trang điều phối, TempleWorld là vòng đời WebGL, templeWorldScene dựng hình, templeWorld dữ liệu/đường đi. DiChuaClassic giữ màn hình ảnh cũ.

Điều khiển dùng raycast xuống mặt phẳng; tìm đường trên lưới có vật cản; đích tương tác đặt ngoài vật thể. Mỗi frame nội suy vị trí/animation bằng ref, không setState theo frame. Chỉ cập nhật React khi đổi địa điểm/trạng thái.

Camera kéo xoay/zoom có giới hạn; bỏ qua click sau drag. Cleanup RAF, ResizeObserver, pointer listeners, geometry/material/texture và audio. Tạm dừng render khi tab ẩn hoặc modal mở. Giới hạn pixel ratio, không shadow map ở chế độ nhẹ. Không âm thanh tự phát. Lời nguyện render bằng text React, localStorage giữ nguyên key.

Kiểm tra: logic đường đi và vật cản; bộ regression hiện có; production build; browser desktop/mobile, tương tác, fallback và đổi route. Vercel/GitHub hiện có là đích phát hành; không di chuyển sang hosting mới.

Bản thực thi dùng lưới 0,5 m, BFS và gộp đoạn thẳng; cache các ô có thể đi. Mặt đường và đích đến cùng bản đồ vật cản, kiểm tra cả đoạn đường không chỉ các nút. Các mesh tĩnh gộp theo vật liệu; mái vẫn là nhóm độc lập để mở nội điện.

## v4.5.0

TempleWorld quản lý ba chế độ: outside (OrbitControls/theo nhân vật), inside (camera mắt người, yaw/pitch và đường đi trong điện), area (góc trải nghiệm ngoài trời). Camera/FOV nội suy khi vào khu, giữ mái và thêm ánh sáng ấm khi ở trong. Nút Ra sân đưa nhân vật ra hiên; toàn cảnh có cờ chống tự vào lại ngay. Kiến trúc ở templeArchitecture.js; vật liệu tạo tại máy và chi tiết riêng tách sang templeMaterials.js / templeDetails.js.

## v4.6.0 — Mẫu quét và nội thất theo khu

GLTFLoader + MeshoptDecoder từ Three hiện có, không thêm dependency. templeModels.js tải hai tệp GLB tại cùng origin, cache mỗi mẫu một lần/cảnh, clone dùng chung geometry, chuẩn hóa đáy/tỷ lệ, timeout 15 giây và giữ fallback khi tải lỗi. Hủy fetch/giải phóng tài nguyên khi rời cảnh, không gắn object vào cảnh đã đóng. Các anchor mẫu tách khỏi bộ gộp geometry để thay fallback bất đồng bộ.

Nội thất tạo khi tới gần/chọn điện, gộp theo vật liệu trong từng điện; khi ở trong chỉ hiển thị nội thất điện đó. Ngoài trời dùng khoảng cách nhân vật để cắt phần nội thất xa. Vùng cản bàn thờ cập nhật theo chiều sâu mới; vẫn kiểm thử toàn bộ 529 tuyến. SW v4.6.0 cache GLB cùng origin sau lần tải đầu; không có tài nguyên tải từ website tác giả trong runtime.
