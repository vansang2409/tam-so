# DC-A14 — giày màu xám than

Đổi texture diffuse của giày nữ từ nâu cam sang xám than ấm để màu giày bớt tương phản với áo lam. Giữ alpha, độ tương phản đường may và đế từ texture gốc, normal map, mesh, weights và clip. Xác nhận toàn bộ BIN gốc được giữ làm tiền tố và chỉ image view của shoes01_diffuse được đổi trong GLB nguồn. Ghi provenance CC0 của MakeHuman shoes01. Phần chân dưới giày vẫn dùng lưới hiện hành.

WebGL A/B đứng toàn thân, thiền và cúi lạy trong Edge SwiftShader, không page error. Review độc lập ảnh đứng xác nhận màu dịu hơn và chi tiết mũi/đế vẫn thấy. Model public 2.278.196 byte, giảm 120.728 byte. SHA256 09f44beecda7de50b53f8e7c609367057cdaaf26cc36fe89c9c396bd02b02dfc khớp file thử, dist và phản hồi local HTTP 200. npm test 493 pass / 0 fail, npm run build đạt. Chưa đo trên GPU thật. Ảnh và mã trong .setest/character-footwear-qa/. Vite local vẫn mở, DC-A14 vẫn Doing.
