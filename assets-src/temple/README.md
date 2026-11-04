# Nguồn nhân vật Đi Chùa

`female-human-source.glb` là nguồn glTF có thể sửa trong Blender hoặc công cụ glTF. Model này là ứng viên đang cải tiến, không phải asset của PUBG và chưa đạt mốc chất lượng hình ảnh PUBG. Các phiên bản cũ và ảnh QA riêng tư không nằm trong thư mục phát hành.

## Tái tạo asset web

Từ root repository chạy:

```powershell
node scripts/build-temple-human-avatar.mjs
npm test
npm run build
```

Script dùng `@gltf-transform/cli@4.5.1` đã ghim phiên bản, tạo normal weave deterministic cho vải, WebPquality92 và meshopt medium với position16/normal12/weight16. Cần Node/npm và truy cập npm registry nếu CLI chưa có trong cache. Blender/MPFB không phải dependency chạy ứng dụng hoặc bước tối ưu trên.

File đầu ra `public/dichua/models/visitor-female-human.glb` có report JSON kèm SHA256 nguồn/đầu ra. Không ghi đè nguồn khi build. Blender4.5.3/MPFB2.0.18 được dùng ở bước authoring ban đầu; tool binaries/addon không được đóng gói trong sản phẩm.

## Quyền sử dụng và nguồn

Không gán một nhãn CC0 chung cho model có motion. `provenance.json` ghi nguồn/hash/version được chọn và các thay đổi của Tâm Sở.

- Body, rig và core MakeHuman assets: CC0 theo [MPFB asset license](https://github.com/makehumancommunity/mpfb2/blob/v2.0.18/LICENSE.ASSETS.md) và [MakeHuman license](https://www.makehumancommunity.org/about/license.html). Giấy phép tool code độc lập với output/graphical assets.
- Skin `young_asian_female`, mắt `high-poly`, eyebrows/eyelashes/teeth/tongue và giày: MakeHuman system assets CC0; tên chi tiết trong manifest. [System pack](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html).
- Áo lam sửa từ topology Toigo fisherman sweater, quần từ Toigo wool pants: CC0, kiểm cả bảng pack và header từng asset. [Shirts](https://static.makehumancommunity.org/assets/assetpacks/shirts01.html), [pants](https://static.makehumancommunity.org/assets/assetpacks/pants01.html). Áo được thay cổ/gấu/cuff, nẹp/nút, form và skin weights; nếp rủ được bake offline.
- Tóc Toigo Curled Under Bob: CC0, header ghi tác giả MRT; đổi màu nâu đen và fit/skin head. [Hair pack](https://static.makehumancommunity.org/assets/assetpacks/hair01.html).
- `eyeBlinkLeft`/`eyeBlinkRight`: faceunits01 của Mika Suominen, CC0. [Faceunits](https://static.makehumancommunity.org/assets/assetpacks/faceunits01.html). Bake macro-body trước, chỉ giữ hai morph mí mắt trên body và lashes.
- Walk: CMU35_01; Idle: CMU77_02. [CMU motion capture database](http://mocap.cs.cmu.edu/), [cgspeed conversion](https://sites.google.com/a/cgspeed.com/cgspeed/motion-capture/the-motionbuilder-friendly-bvh-conversion-release-of-cmus-motion-capture-database). **CMU cho phép dùng miễn phí trong sản phẩm thương mại nhưng không bán lại motion data, kể cả ở định dạng đã chuyển đổi. Motion không phải CC0.** Giữ credit/điều kiện này khi phân phối derivative. Đã sửa FrameTime của bản BVH77_02 thành60Hz theo trang CMU; retarget sang rig53joints, bỏ reference-frame, căn heading và bake in-place/contact.

Không bán model/motion này như một gói motion độc lập. Đây là asset của sản phẩm Đi Chùa có thành phần mang các quyền sử dụng khác nhau.

## Hợp đồng runtime

Scene extras: `templeCharacterProfile=female-human-v1`, `templeRig=mpfb-gameengine`, `templeHeight=1.65`. Loader không cắt/thay áo procedural hoặc ghi đè PBR của profile này. Tên xương GameEngine giữ nguyên để mixer bind; controller cung cấp alias riêng cho IK. Mỗi visitor clone skeleton/morph state độc lập, chia sẻ geometry/texture.

Build profile này chỉ nhận53joints và các material đã map rõ; không phải bộ chuyển đổi rig bất kỳ. Nét miệng khép dịu nhẹ đã bake từ bilateral mouthSmile.12 của cùng faceunits01CC0; upperface/eye fit giữ nguyên. Runtime làm dịu Idle cổ/đầu, lệch pha từng actor và cache pose thiền cố định; khi bổ sung chuyển động mới phải xem lại điều kiện cache.

Mocap Walk/Idle không đồng nghĩa nghi thức mocap: thiền/chắp tay/cúi lạy là IK runtime và cần visual review riêng. Không dùng ảnh Blender để thay bằng chứng GLB đã nhập lại và browser. Test kỹ thuật không chứng minh photorealism.

Body nguồn có clothing mask: phần bàn chân bên trong giày không đầy đủ. Không được chỉ ẩn mesh giày để tạo nghi thức chân trần; cần phục hồi nguồn bàn chân, đường nối cổ chân, UV/weights/morph và kiểm lại trước. Giày được giữ trong phiên này.

Skin nguồn chỉ có diffuse; AO/tint/roughness scalar hiện tại không thay thế normal/roughness được vẽ hoặc quét thật. Audit core và Skins01 không tìm được các map khớp UV/nguồn này. Các thử nghiệm roughness.60/.50 hoặc clearcoat mắt không có lợi ích đủ rõ để giữ, không được ghi thành tính năng đã phát hành.

## Studio QA local

Chạy `npm run dev`, mở `/scripts/temple-character-preview.html`. Có thể truyền `before`/`after` là đường dẫn GLB cùng origin, `solo=1`, `count=1|4|8|24`, `quality=low`. `static=1` chỉ xem mesh/vật liệu của rig nguồn khác, vô hiệu hóa nghi thức; không chứng minh actor đã tích hợp. Công cụ cập nhật toàn skeleton trước khi đo precise bounds, ghi rõ cadence/CPU submit/GPU renderer và không nằm trong production entry. File QA/private dưới `.setest` không được đưa vào commit.
