# Kiến trúc kỹ thuật

React/Vite + Three.js đang có; không thêm dependency runtime. DiChua là trang điều phối, TempleWorld là vòng đời WebGL, templeWorldScene dựng hình, templeWorld dữ liệu/đường đi. DiChuaClassic giữ màn hình ảnh cũ.

Điều khiển dùng raycast xuống mặt phẳng; tìm đường trên lưới có vật cản; đích tương tác đặt ngoài vật thể. Mỗi frame nội suy vị trí/animation bằng ref, không setState theo frame. Chỉ cập nhật React khi đổi địa điểm/trạng thái.

Camera kéo xoay/zoom có giới hạn; bỏ qua click sau drag. Cleanup RAF, ResizeObserver, pointer listeners, geometry/material/texture và audio. Tạm dừng render khi tab ẩn hoặc modal mở. Giới hạn pixel ratio, không shadow map ở chế độ nhẹ. Không âm thanh tự phát. Lời nguyện render bằng text React, localStorage giữ nguyên key.

Kiểm tra: logic đường đi và vật cản; bộ regression hiện có; production build; browser desktop/mobile, tương tác, fallback và đổi route. Vercel/GitHub hiện có là đích phát hành; không di chuyển sang hosting mới.

Bản thực thi dùng lưới 0,5 m, BFS và gộp đoạn thẳng; cache các ô có thể đi. Mặt đường và đích đến cùng bản đồ vật cản, kiểm tra cả đoạn đường không chỉ các nút. Các mesh tĩnh gộp theo vật liệu; mái vẫn là nhóm độc lập để mở nội điện.
