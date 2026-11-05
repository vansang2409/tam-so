# DC-A14 — chớp mắt mẫu nam V13

Bổ sung eyeBlinkLeft/Right từ MakeHuman faceunits01 theo correspondence của da nam và lash. Assert vị trí khớp dưới 0,03 mm tại mọi đỉnh có delta blink. Mỗi bên tác động 718 đỉnh da và 65 đỉnh mi. Giữ V11 làm nền áo và retarget lại hai clip V12 lên cùng rig.

WebGL cận cảnh mở/khép nửa/nhắm/nháy một bên. Review độc lập xác nhận mí và mi đi cùng, góc mi hơi răng cưa. Studio qua controller cũng tự khép mắt khi thiền. Đã tối ưu riêng với WebP/meshopt, còn 1.963.780 byte từ 11.350.152 byte, giữ hai clip và hai nhóm morph. Kiểm lại bốn trạng thái blink trên GLB tối ưu. Chưa kiểm Walk và các nghi thức với bản tối ưu, chưa đo tốc độ bước riêng của nam, chưa tích hợp runtime. Artefact và log .setest/character-authoring/, ảnh .setest/young-visitors/qa/.
