# Phiên4 giờ — nhân vật theo mốc chất lượng PUBG

Yêu cầu trực tiếp mới của chủ dự án: mẫu nữ hiện tại “nhìn ghê”, đặt mục tiêu nhân vật như PUBG; làm thêm4 giờ rồi commit/push, đóng ứng dụng và tắt máy. Bắt đầu đo15:52:35UTC04/11/2026; hạn19:52:35UTC, tức02:52:35 ngày05/11 Asia/Bangkok. Quyền commit/push và shutdown chỉ cho lượt này, không mở quyền production/deploy định kỳ.

Nhánh làm việc `codex/di-chua-character-realism-20261104` tách từ master05a13d3, giữ toàn bộ uncommitted Đi Chùa có trước. Push nhánh công việc sau khi kiểm chứng; chưa được yêu cầu merge/deploy production trong lượt mới. Không forcepush, không đưa `.setest`, `.env.local` hoặc credentials vào Git. Đóng/tắt bình thường; không forcekill/Discard dữ liệu chưa lưu. Nếu unsaved prompt chặn, giữ dữ liệu và báo blocker.

Đã cập nhật lịch chốt một lần hiện có tới deadline mới (không tạo worker ghi source trùng). Mọi lần chốt phải đọc clock và checkpoint, không tắt sớm; xóa lịch sau chốt để tránh lặp khi khởi động máy.

## Đánh giá lại mẫu v1

Ảnh crop chủ dự án cho thấy lỗi chất lượng thực: cổ lọ che cổ người, vai/tay cung phồng, giày dùng section nam quá rộng, vải/thân người trơn giống mannequin. Đánh giá “không thấy regression chặn” trước đây quá thiên về kỹ thuật; **v1 bị bác bỏ, không được xem là ngoại hình đạt**. Các test07 vẫn là bằng chứng ổn định rig/export trong phạm vi, không chứng minh đẹp.

## Đang làm

- Coordinator sửa collar thấp hơn, armhole bo oval/cap giảm thể tích và điều chỉnh IK tay, giày nữ riêng, panel túi áo; phải kiểm crop gần trước khi chọn candidate.
- Research agent dựng thử pipeline MakeHuman/MPFB/core CC0 trong `.setest/character-authoring`, chỉ official/free/source/license rõ. Chưa có model thay thế nghiệm thu, không sao chép asset PUBG.
- Giữ DC-A14 Doing; mục tiêu chất lượng ghi trong backlog/team docs. Cuối phiên ghi SHA/hash/bằng chứng và mục còn thiếu, không gắn Done vì hết giờ.

## Checkpoint17:18UTC — chưa chốt phiên

Đã dựng ứng viên MPFB young-adult female với rig GameEngine53 xương, ngón tay thật, mắt/lông mi đồng bộ hai morph chớp mắt. ExportV2 bị loại vì tắt morph làm mất macro-body đã fit; V3 trở đi bake macro vào Basis và kiểm bằng **GLB nhập lại**, không chỉ ảnh Blender. V4/V5 có áo mesh riêng, bỏ cổ/cuộn gấu len, chỉnh cổ thấp/nẹp/nút; relax cloth offline36frame, không chạy physics trong browser. V6 đang sửa cuff theo replay tư thế thực, chưa freeze.

Ứng viên riêng tư hiện tại: V5+Toigo Curled Under Bob(CC0)+skin tint/AO+CMU35_01Walk/77_02Idle. Sourcecombined SHA256`689234c4ed362c1ff6e8d2e70b8b6b23fcd51d6ffe88328ab6e68baf4b260345`; optimizedprivate2,640,928bytes SHA256`20d35e8060202b530136d580106d498b5d79045771f8d713efb3bf72ef36a4cc`. Đây **chưa phải asset public tích hợp**. Raw source/output cuối và provenance phải được lưu trong repo trước khi bàn giao; không phụ thuộc `.setest` để rebuild.

CMU motion là custom terms cho dùng trong sản phẩm, không được bán lại motiondata kể cả đã chuyển đổi; **không phải CC0**. Body/selected clothes/hair/faceunits có kiểm nguồn/header CC0; tách rõ giấy phép motion khi phát hành model. Không có asset PUBG được tải/copy.

Runtime opt-in mới giữ tên xương gốc cho mixer, alias sang semantic IK; giữ clavicle rest, sửa dấu cúi người, fit chiều cao1.65m; hướng lòng bàn tay từ wrist→metacarpal, phân bổ twist qua forearm; chớp mắt semantic và grounding theo toàn bộ vertex quần/giày đã render. Animation snapshot khắc phục PropertyMixer bỏ qua sample không đổi sau procedural reset. Test độc lập đã phát hiện và bảo vệ chirality/palm normal, constanttrack cache và bindInverse cập nhật.

Review replay thực phát hiện bow ngửa ra sau(đã sửa), tay chắp chữV(đã sửa), tiếp đó tay chắp xuyên nhau(đang kiểm lại sau tăng halfspacing.029P), tay thiền chạm cuff(đang kiểm sau đổi X±.10P). Không gọi các test này là nghiệm thu photorealism.

WebGL studio thật đã kiểm fullbody/cận mặt/góc nghiêng: nguồn mới có mặt/tóc/áo chi tiết hơn nhưng dáng áo còn ôm hông, cuff nhăn tam giác và tay đứng bị khuất thân; agent sửa cuff/drape, coordinator sửa standing target. Tóc bob còn cứng, mặt còn thiếu chi tiết da; chưa đạt PUBG. Studio chỉ cho so cùng camera/ánh sáng, chưa thay bằng chứng trong chùa/standard/low/2session.

Giảm navigation từ5.8 xuống1.35m/s để phù hợp mocap và truyền speed đo thật cho local/remote animation; network/schema không đổi. Đã báo tradeoff đi xa chậm hơn; primaryflow cần kiểm trong chùa. Node CPU controller-only privatebenchmark160frames: p95một nhân vật.314ms,4nhân vật.822ms,8nhân vật1.278ms; không có GPU/render nên **không suy ra FPS**.

`npm test`:493pass/0fail và các assertmodule mới; `npm run build`:pass lúc17:18UTC. Đây là check giữa phiên; sau asset/integration cuối phải chạy lại check phù hợp và review diff. DC-A14 tiếp tục Doing. Không commit/push/deploy/shutdown tại checkpoint này; deadline19:52:35UTC giữ nguyên.

## Checkpoint17:36UTC — V6 tích hợp local, pose thiền chưa đạt

Public ứng viên đã chuyển sang `visitor-female-human.glb`, loader giữ authored PBR/mesh, link download/credit cập nhật đúng nguồn hỗn hợp. V6 kết hợp tóc/skin/motion source15,748,064bytes SHA256`6523ff36420ab519fb84e02e1cab1db0f7f253e5f48b87e0c9639b1880b65fc7`; output2,282,120bytes SHA256`d4f87c3338bb872e17a4a45e2613650606687a7df1e481731e65bd43b5230ab4`. Hash hiện tại ở report public là nguồn chính; asset có thể đổi tiếp trước deadline. Nguồn có thể sửa được đã lưu `assets-src/temple/female-human-source.glb`, có README/provenance và script build không cần Blender. Bản áo lam Grab3D cũ giữ cho đối chiếu/regression, không phải mặc định nữ.

V6 sửa đúng5cm cuối sleeve/cuff: mép phẳng có ease/innerfold, lowerarmweights nhất quán; không xóa/restore body vì audit xác nhận không thiếu polygon cổ tay. GLB before/after cùng pose chứng minh cuff sạch hơn; nonshirt mesh/blink byte-identicalV5. Kiểm browser studio thấy cuff mới không còn gai tam giác ở dáng đứng. Nguồn V6 riêng SHA256`0f4aec26cb1161f04ecabfb7af4e52d9813d810cc2a2656d9a4535a664612917`.

Đã thêm bước prune trước WebP/meshopt, giữ emptyjointleaves/attributes/indices/solidtextures; loại ponytail orphan, giảm~355KB so bản trước mà không thay activegeometry. Independent test `temple-human-avatar.mjs` decode Meshopt thật, kiểm cấu trúc WebP,53joints/morph/renderedfloor/clones/hashlinkage pass; pixelWebP đã decode thật qua browser và Blender, không giả tạo ImageBitmap trong Node. Không chia sẻ Skeleton tùy tiện:10skin có inversebind khác nhau sau quantization.

QA phòng DEV cô lập `tam-so-temple-qa-human-20261104` đã mở lựa chọn nữ, đi sân/chuyển camera, mở và bắt đầu thiền; asset hiện trong cảnh chùa. Chưa kiểm2client/low/interior trên bản cuối. Browser đôi lần timeout, đã rebind existingtab; không kill Chrome. Studio thử clearcoat mắt chưa thấy lợi ích đáng kể ở crop, đã bỏ thay đổi shader khỏi source; candidate riêng không phát hành.

Review kỹ hơn phát hiện thiền cũ không phải tư thế tự nhiên: seat treo111.7mm, hai bàn chân cùng hướng ra trước. Trial hạ hip.20P và xoay toes ngang giúp silhouette nhưng seat còn56.9mm, hands target cũ chui vào bụng, pants/knee lộ da. **Đây là lỗi đang sửa, không đạt nghiệm thu**. QA đang fit phối hợp pelvis/kneehint/ankle/wrist; không chọn numerical0collision nếu ảnh trông nửa-lotus vụng. Sourceagent tiếp tục form tàáo/pants nếu cần sau posefreeze.

Trial chắp tay nghiêng3.15° làm xuyên sâu5.91mm thay vì1.42mm đã revert; trial handstack.022P gây9.21mm xuyên cũng revert. Đang thử thumbIK tách riêng chưa enable; không hạ cả bàn tay để giả tiếp xúc. Fullbow721frames/3vòng có finitevertices, minskinY1.558mm, không pop ở cycleboundaries; numericcontinuity không chứng minh clothselfcollision/photorealism.

## Checkpoint18:00UTC — V8 qua QA, còn thời gian tới deadline

V7 giữ cổ/cuff, đổi low-frequency front/back shirt profile để tàáo rơi thẳng; trial nới ngang gây shelf đã bỏ. V8 sửa quần bằng SIMPLE1 subdivision + nearest-rest-skin triangle barycentric weights và knee ease0..6mm; trial inverse-LBS offset lớn gây phồng gối khi đứng đã bỏ. Không xóa thêm body. Independent audit xác nhận9nonpants mesh/morph arrays byte-identicalV7,53restTRS/materials giữ nguyên;55,934source tris(+8,022). Các góc GLB trước/nghiêng đứng/ngồi đã kiểm: hai mảng da lộ đầu gối không còn, nếp gập vẫn nhọn/thô.

Current combinedsource`d98f6757a1b0a3ba81308aba17b9e460a865d14b80dd103b237bcc4f74042eba`; public2,364,568bytes SHA256`5b6b63d5e0ee8f4b494e87ebae905aded66c1efa33ef37fb8d8a03bf45d51647`. Handoff/provenance đã cập nhật; report public xác nhận hash linkage và CI test bắt buộc source/report/provenance đồng bộ. Agent độc lập kiểm human/thumb/hands pass trên bản này.

Pose thiền đã chốt hip.17P, pole knees bất đối xứng, ankles/toes bắt chéo và wrists trên lap; private posefit không dùng chỉ số0collision để nghiệm thu dáng. Thumb helper đã tích hợp sau bàn tay: hiệu chỉnh2khớp/thumb trong giới hạn60°, tự rollback nếu không với tới, đầu ngón cách~1.2mm; independent actualmesh review không thấy hand-hand penetration>1mm trong pose kiểm. Còn khe palm/fabric nghệ thuật, không gọi perfectpose.

Runtime female-human khởi tạo Idle/Walk lệch pha theo UUID để tránh đám đông quay đầu cùng lúc; cache meditation localIK cố định khi không có proceduralgarment. Test kiểm parenttranslate/yaw/floor, reducedtoggle, exit/reenter Idle/bow và legacygarment vẫn chuyển động. Node-only25actor medcached median~.005ms so baseline~8.8ms; không bao gồm renderer/GPU/scene matrices, không suy FPS. Studio24nhân vật V6 có553calls/2.242.178tri, RAF dao động13.7..68.5 trong bối cảnh CDP/Blender/background, **không dùng làm benchmark app hoặc so hiệu năng V8**.

Primary browser V8 đã chạy2tab trong DEV room`tam-so-temple-qa-human-v8-20261104`: count1→2, đổi nam/nữ, remote nam đi và nữ thiền, vào Chánh Điện, nữ lạy thấy từ tab low, hết nghi thức về đứng, đóng B→count1 sau TTL20s. Không dùng khách public/hosted business data. Đã phục hồi quality standard/appearance female cho origin5173 rồi đóng cả2tab. Ảnh thật `v8-two-clients-meditation.png`, `v8-remote-low-bow.png` trong `.setest/di-chua-team/female-revision-2026-11-04/`.

Tải lỗi được kiểm trên Vite QA riêng loopback5175: middleware chỉ trả404 cho female-human GLB, không di chuyển/sửa publicfile. Chọn nữ hiện cảnh báo bản dự phòng/Tải lại và proceduralavatar vẫn đi tới sân. Đã đóng tab/stopserver sau QA. Ảnh `v8-asset-failure-fallback.png`. Chưa giả lập ngắt mạng thật/toàn bộtexturedecodefailure.

Independent finalV8 proof `.setest/character-pose-qa/public-v8-final`:721bowframes finite/minskinY1.567mm,14sIdle+4sWalk allverticesfinite/minY3mm,2clones/reduced/dispose và skin/morph invariants pass. Đây là lấy mẫu hình ảnh/numericcontact hữu hạn, không chứng minh không xuyên áo ở mọi frame/góc.

Da: đã audit23core+23Skins01 materials chính thức, không có normal/roughness thực khớp young_asian_female; giữ diffuse/AO, không giảpore. Footwear: bodyexport bị mask gần hết bàn chân, nên **không ẩn giày** để làm chân trần giả; cần phục hồi sourcefoot nếu làm sau. Hai việc đều không đổi V8. Mặt còn phẳng/chalky, tóc rigid; DC-A14 Doing. Đang bounded-review Idle dịu hơn/materialscalar, không tự coi candidate là bản nghiệm thu. Deadline19:52:35UTC giữ nguyên, chưa commit/push/shutdown.

## Checkpoint18:52UTC — khóa candidateV10 để bàn giao

Artifact cuối hiện tại: `public/dichua/models/visitor-female-human.glb` **2,394,136bytes**, SHA256`c740f83afb1396dbdfbf622749b92141baeda17508648e88d47793aa73ae37d2`. Editable combinedsource SHA256`36bceaf59b140feeebd9401bd93f3c27abe1fc7dd9bb619927d5c57bebd4b8db`. Source/report/provenance/GLBextras đồng bộ và test bảo vệ liên kết này. V9/V10 là revision art, runtime profile vẫn `female-human-v1`, không phải package release mới.

V9 khắc phục đúng lỗi da xuyên áo nách trong Idle/Walk bằng local subdivision, chuyển trọng số theo bodytriangle và ease tối đa6mm. Source rawV9SHA`b2bcb71d35e8a81c80af1ad07cdc54e159f54e3f7dd68fd7d30ca886893d4bbf`,58,394tri(+2,460soV8). Tia camera thật tái hiện lỗi V8 gặp da trước áo ở3.099814m; test trước thất bại đúng lỗi. Oracle theo cùng bodytriangle qua12Idle+12Walk: **V8lộ19/24 → V9/V10che24/24**, không mẫu self-occluded bị bỏ, tối đa48rays. Có review8pose magenta trước/nghiêng; không coi là chứng minh mọi va chạm vải đã hết.

V10bake official CC0 MikaSuominen mouthSmileLeft/Right.12 vào lowerface, max2.203mm để khóe miệng bớt chúi nhẹ; môi vẫn khép/không răng/grin. Reviewer và coordinator chọn sau A/B matchedcamera/light. Upperface/9mesh còn lại/UV/weights/indices/53rest giữ nguyên; blinkPOSITIONdelta giữ nguyên, lowerface blinkNORMALrecomputed maxdiff.001176 được ghi rõ. ActualGLB mở/nhắm/quayhead30 qua review;159boneTRS channel ở reducedstanding identical baseline maxdelta0. RawV10SHA`9f98db82695e8100c782027108bd4260d8e155feb912445a9b10f49c0375b30b`.

Idle cổ/đầu dịu40% sau captureAnimation, giữ nguyên source clip trong cache; chỉprofilefemale-human và fadeout khi blendWalk. Audit14s: yawhead-relative-torso từ[-37.42,+18.28]° xuống[-22.36,+10.76], peakforwardrate140.88→94.43°/s; là phép đo localclip, không kết luận biểu cảm đạt PUBG. Mixeroracle độc lập kiểm nonzeroIdle, không tích lũy ởdt0, Walk trở lạifullmotion, reducedrest/profilekhác nguyên.

Các trial **đã loại**: skin roughness.60/.50 tăng broadshine/waxy không thêm detail; hair anisotropy.25/.40 không cải thiện dải sáng baked trongGingerHair; eye clearcoat không đủ lợi ích. Mắt đã đúng brown_eyeCC0:980blueRGB eyeUVcentroids cóalpha0, sourceBLEND và Alpha wiring đúng, không có bằng chứng opaque-overlay bug nên không tint/recolor. Giữ originalPBR baseline, không đưa các shadertrial vào public.

`npm test` sau V10:runner493pass/0fail và các assert suite human/hands/face/contact/thumb/clothing đều pass. `VERCEL=1 npm run build`:pass,211prerender routes. Reviewer cuối không có P1/P2 cụ thể trong source/lineage/rights/tests đã xem. Đây không phải nghiệm thu thẩm mỹ cuối. WebGL studio V10 đã kiểm toàn thân/cận mặt/Idle/chắp tay/thiền/fullbow/profile; ảnh `v10-webgl-standing.png`, `v10-webgl-face.png` trong thư mục QA đã ghi.

Browser viewport390×844 và844×390 trên desktopChrome đã xác minh dimensions quaDOM, nữ detailed=true/modelsready, vào Chánh Điện/thiền và chuyển standard-low. Cùng camera390:standard313calls/1,452,954tri;low119calls/536,967tri,shadowsfalse;88textures. Đây là rendercounters tại một góc desktopemulation; low có intentionalframeratecap, **không phải FPS điện thoại/GPUtime**. Đã resetviewport và qualitystandard sau QA. Bằng chứng `.setest/di-chua-team/female-revision-2026-11-04/v9-mobile-*` và`v9-landscape-meditation.*`; bảnV10 chỉ sửa lowerface so vớiV9.

Asset inspector cho12embeddedimages:skin2048², còn lại1024²/512²/128²; static minimum textureallocation ước lượng khoảng70MB includingmips, **không phải đoVRAM thực**. Geometry/textures chia sẻ giữa các clone; mỗiactor vẫn có skeletonpalette/morphstate riêng. Đây là tradeoff cần QA máy thấp; payload2.39MB không đại diện decodedmemory. Không cắt teeth/tongue/shoes chỉ để cải thiện con số.

Nghiên cứu tiếp đã làm trong thư mục riêng: MicrosoftRocketbox một facialFBX+headmaps56.75MB từ commit đã pin, MITnotice đầy đủ, parsed80bones/175morphs/8,732tri; portrait có chi tiết đầu tốt hơn nhưng rig/material/style khác, chưa fit áo lam/retarget/WebGLnghi thức. **Không đổi nhân vật runtime V10 bằng candidate này**, không đưa37MBprototype vào public. Xem `di-chua-character-research-2026-11-04.md` và private`.setest/rocketbox-face-preview/`. Đây là đầu vào vòng sau, không gắn Done cho PUBG.

Hạn19:52:35UTC chưa tới: vẫn chưa commit/push/shutdown tại checkpoint này. Đã kiểm remote master vẫn05a13d3 và chưa có remote nhánh cùng tên, Git author configured; chỉ là read-onlypreflight, chưa chứng minh push thành công. Bước còn lại: review stagedscope/finalhash, đến hạn commit/push featurebranch, xác minh remoteSHA, xóa lịch chốt một lần, đóng/tắt bình thường theo quyền phiên. Không deploy production.

## Checkpoint19:17UTC — review bàn giao và thử nghiệm riêng

Rebuild V10 sau guard53joints/material cho SHA256 byte-identical `c740f83afb1396dbdfbf622749b92141baeda17508648e88d47793aa73ae37d2`, khớp public và dist. Reviewer độc lập không thấy P1/P2 ở guard hoặc studioQA mới. Node syntax và diff whitespace pass. Studio dev-only đã sửa precise skinned bounds bằng cập nhật toàn skeleton trước đo; static=1 không áp controller, không chứng minh rig đã tích hợp.

Đã nhìn V10 trong chùa ở cùng vị trí/camera gần và xa: beacon vàng hiện ở khoảng19m, ẩn ở khoảng7m, vòng nền còn; nhân vật vẫn detailed/modelsready. Bằng chứng `v10-temple-close.png` và `v10-camera-near-far.json` trong thư mục QA phiên.

Rocketbox chỉ là nghiên cứu private: prototype WebP/meshopt3,997,192bytes SHA256`912ee95e3603d2172dd40e5369969dca6ec54aafeb3bb4b0b95916bb5254746e`,80bones/175morphs. Đối chứng bỏ175default-zero morph không animation, giữ22baseaccessors và4imagebytes nguyên,2,957,756bytes SHA256`2e4e44f00f783c57717536105c8e691e61fb808256c6b09ed4321649db45df0c`. Cùng staticWebGL/RTX2060SuperANGLE: bản175morph khoảng1.2RAF/s và858msCPUsubmit; đối chứng khoảng68.8RAF/s,.48msCPUsubmit,8calls/18,134rendertri. Đây là số localstudio, không phải appFPS hoặc benchmark điện thoại, chưa xác nhận nguyên nhân cho mọi thiết bị. Mặt có chi tiết tốt hơn; chưa fit áo lam/retarget/blink/nghi thức, bodymaps còn thiếu. Không đưa prototype/maps vào Git hoặc public; V10 vẫn là candidate bàn giao và DC-A14 Doing.

Chưa tới hạn19:52:35UTC nên chưa commit/push/đóng ứng dụng/tắt máy. Không thay đổi production.

### Đối chứng chi phí studio V10 cuối phiên

Đã kiểm cùng studio foreground, canvas873×677/pixelratio1, RTX2060SUPER/ANGLE, một view. Mỗi dòng là một cửa sổ telemetry khoảng1giây sau warmup, không phải median/p95 hay benchmark cảnh chùa/GPU/điện thoại. Camera lùi theo số actor; không suy pixel-cost bằng nhau. Các actor share geometry/texture nhưng skeleton/morph/mixer riêng.

| Actor | Bóng | Pose | Calls/render triangles | CPU update/submit ms |
|---|---|---|---|---|
|1|có|Idle|24 /114390|.38 /.61|
|1|có|Walk|24 /114390|.40 /.68|
|1|có|thiền cached|24 /114390|.00 /.76|
|8|có|Idle|185 /915106|1.68 /2.81|
|8|có|Walk|185 /915106|1.73 /2.78|
|8|có|thiền cached|185 /915106|.02 /2.51|
|24|có|Idle|553 /2745314|4.51 /5.86|
|24|có|Walk|553 /2745314|4.88 /6.57|
|24|có|thiền cached|553 /2745314|.01 /6.44|
|24|không|Idle|313 /1403858|4.53 /4.16|
|24|không|Walk|313 /1403858|4.63 /4.31|
|24|không|thiền cached|313 /1403858|.02 /5.05|

RAF ở các mẫu khoảng68–69/s, không dùng để tuyên bố app đạt68FPS. Giá trị .00 là làm tròn2chữ số, không phải không có CPUwork. Calls/triangles có cả pass bóng và alpha-sided materials; không đồng nghĩa topology model. Không sửa productioncode trong phép thử. JSON+ảnh `v10-crowd-samples.json`/`v10-crowd-24-walk.png` ở thư mục QA. Tab đã đóng.

Audit source độc lập: V10 10SkinnedMesh/55,894tri/31,029verts; supportcontact7,596đỉnh mỗi apply,53bone restore/capture,10Skeletonobjects tham chiếu53boneobjects. Không gộp palette chỉ từ bonecount vì inverse-bind không trùng hoàn toàn. Cache thiền giảm updateCPU trong phép thử nhưng renderer vẫn làm skin/morph/draw/shadow. Bước sau đo chi phí từng đoạn trong scene thật/thiết bị thấp rồi chọn LOD/update nhịp actor xa; chưa chứng minh contact là bottleneck chính.

## Chốt19:52UTC — hết phiên4 giờ

Đã commit implementation `5822268f9b3859db1b9e793b93b5a794e69d896c` và push `origin/codex/di-chua-character-realism-20261104`; `git ls-remote` trả đúngSHA. Master không merge/deploy.49file đã review, không secret/privateprototype/QAartifact. Lịch chốt một lần `t-m-s-ch-t-production-v-t-t-m-y-m-t-l-n` đã xóa để tránh lặp khi khởi động. Subagents đã hoàn tất/dừng thao tác. Test/build V10 và kiểm staged như trên; không tái gắn Done cho PUBG. Tiếp theo là đóng Chrome/server local và gửi shutdown bình thường, bảo toàn nếu có unsaved dialog. Chưa có bằng chứng máy đã tắt ở thời điểm ghi checkpoint này. Đây là handoff phiên đã chốt; không tự chạy lại shutdown/release từ ghi chú cũ.
