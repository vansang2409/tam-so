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

Khi ngồi thiền, controller bật `templeSeatedPants` trên mesh quần. Đây là morph POSITION/NORMAL được dựng lại từ hai mảng vải quanh gối, có trọng số mặc định 0. Áp dụng trước phép đo tiếp xúc sàn. Khi chuyển sang đứng, đi hoặc lạy, trọng số về 0. Nếu đổi rig, tỷ lệ hoặc tư thế thiền, cần kiểm lại shape này trên GLB thực trong browser.

Áo có shape cùng cơ chế tên `templeSeatedShirt`. Shape sửa hai điểm gập ở vòng nách với một vòng lưới cục bộ. Kiểm hình dáng ở cả góc chính diện và nghiêng, cùng các tia chứng kiến trong `tests/temple-human-clothing.mjs` khi sửa asset.
## Mẫu nam

Chạy `node scripts/build-temple-human-avatar.mjs --male` để dựng `visitor-male-human.glb` và report từ `male-human-source.glb`. Profile nam là `male-human-v1`, rig `mpfb-gameengine`, cao 1,72 m. Loader giữ áo skinned và PBR, dùng Grab3D nam nếu tải model mới thất bại.

Mesh/texture CC0 gồm MakeHuman core/system (da young_asian_male, tóc short02 và các phần phụ), áo/quần từ Toigo, mí/mi từ faceunits01 của Mika Suominen. Walk và Idle retarget từ hai clip CMU đã ghi ở trên; giữ điều kiện phân phối motion. Runtime hiện dùng cùng cách lệch pha theo actor và làm dịu chuyển động đầu khi đứng cho cả hai mẫu authored.

V30 bỏ dải nẹp nổi rời trên áo nam và giữ tám khuy trên thân áo. Phần lưới cổ, rig, trọng số skin và clip giữ thiết kế V23.

V36 làm viền cổ thấp và thay sáu vòng lưới gập phía dưới bằng dải liền với thân. Trọng số skin của dải được nội suy từ đường may và vòng lưới thân áo, pháp tuyến được dựng lại theo bề mặt mới.

V39 dùng `templeSeatedShirt` để tạo thêm khoảng hở ở lai sau khi thiền. Morph POSITION/NORMAL được tính trên lưới ở dáng thiền rồi chuyển về không gian bind theo ma trận skin mỗi đỉnh. Kiểm lại vùng chồng áo và quần nếu đổi pose thiền hoặc hình học lai.

V42 bổ sung pháp tuyến vùng ngực vào morph thiền từ tiết diện bề mặt đã skin. Dữ liệu POSITION của morph V39 được giữ để duy trì khoảng hở ở lai sau.

V46 thu phần trên tay áo trên lưới bind, giới hạn theo khoảng hở da ở các khung đứng, Idle, Walk, thiền và lạy. Pháp tuyến mặt trước ngực được làm dịu trên lưới bind, bù vào delta NORMAL của morph để giữ kết quả đã duyệt khi thiền.

V50 thêm chỉnh hình khuỷu vào morph `templeSeatedShirt`, ưu tiên mặt trong và giữ biên ngoài. Kiểm lại mặt trong và ngoài khuỷu nếu chỉnh góc tay ở tư thế thiền.

V56 sửa nếp gập ở lai sau trong `templeSeatedShirt`. Dải vòng lưới phía sau được sắp lại ở tư thế thiền và fit theo tiết diện quần quanh hông, giảm dần ảnh hưởng về hai bên. Kiểm lại từ sau và hai góc nghiêng khi đổi áo, quần hoặc pose thiền.

V57 làm dịu pháp tuyến vùng lai sau trong morph thiền từ tiết diện lưới đã skin. Bản này dùng dữ liệu POSITION của V56.

V63 làm mượt đoạn xoay mũi giày trái trong Walk, giữ độ gập bằng một key đỡ giữa đoạn. Offset chân tuần hoàn fit từ các mẫu đi thẳng và đi cung được giải IK ngoại tuyến rồi bake vào sáu track xoay chân. Điều kiện nguồn CMU35_01 vẫn áp dụng.
