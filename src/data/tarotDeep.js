/* Nội dung DÀY cho 22 lá Ẩn Chính (Tarot) — C06 đợt 2a. Luận theo tình yêu / công việc /
 * tài chính / lời khuyên, bám archetype Rider–Waite–Smith. GIỌNG: tham khảo, chiêm nghiệm;
 * KHÔNG phán cứng nhắc, KHÔNG giật tít. Key = id lá Ẩn Chính (0–21). 56 lá Ẩn Phụ: đợt 2b. */
import { TAROT_DEEP_MINOR } from './tarotDeepMinor.js'

const TAROT_MAJOR_DEEP = {
  0: { // The Fool
    love: 'Một khởi đầu tình cảm mới mẻ, đầy hứng khởi; hãy mở lòng nhưng vẫn lắng nghe trực giác.',
    work: 'Thời điểm hợp để thử hướng đi mới hay dự án táo bạo; cứ bước rồi học dần trên đường.',
    finance: 'Sẵn sàng cho cơ hội mới nhưng tránh quyết định tiền bạc bốc đồng — nhìn kỹ trước khi nhảy.',
    advice: 'Nói “có” với hành trình, giữ tâm thế hồn nhiên mà vẫn chuẩn bị vài điều cơ bản.'
  },
  1: { // The Magician
    love: 'Sức hút và sự chủ động lên cao; bạn có thể tạo ra điều mình muốn nếu thật lòng.',
    work: 'Bạn có đủ kỹ năng và nguồn lực để biến ý tưởng thành kết quả — hãy hành động có chủ đích.',
    finance: 'Khéo xoay xở, biết tận dụng cơ hội; dùng tài nguyên đang có thay vì ngồi chờ.',
    advice: 'Gom ý chí vào một mục tiêu rõ ràng và bắt tay làm ngay hôm nay.'
  },
  2: { // The High Priestess
    love: 'Lắng nghe linh cảm về mối quan hệ; nhiều điều đang diễn ra dưới bề mặt, đừng vội kết luận.',
    work: 'Quan sát và thu thập thông tin, tin vào trực giác trước khi công bố quyết định.',
    finance: 'Chưa phải lúc phô trương; giữ kín kế hoạch và nghiên cứu kỹ trước khi xuống tiền.',
    advice: 'Tĩnh lặng, chú ý giấc mơ và tiếng nói bên trong — câu trả lời nằm ở đó.'
  },
  3: { // The Empress
    love: 'Tình cảm ấm áp, dồi dào, có thể là gắn bó sâu sắc hoặc tin vui; nuôi dưỡng bằng sự dịu dàng.',
    work: 'Sáng tạo nở rộ, hợp tác trù phú; hãy chăm chút dự án như chăm một khu vườn.',
    finance: 'Giai đoạn sung túc, biết hưởng thụ hợp lý; đầu tư cho cái đẹp và sự thoải mái bền vững.',
    advice: 'Đổ đầy chiếc cốc của mình trước, rồi mới rót cho người khác.'
  },
  4: { // The Emperor
    love: 'Cần sự ổn định, rõ ràng và đáng tin; tránh kiểm soát, hãy che chở bằng sự điềm tĩnh.',
    work: 'Thiết lập trật tự, kế hoạch và kỷ luật sẽ cho kết quả; lãnh đạo bằng sự vững vàng.',
    finance: 'Quản lý chặt, lập ngân sách và xây nền tảng dài hạn thay vì mạo hiểm.',
    advice: 'Sức mạnh đến từ cấu trúc và trách nhiệm — đặt quy tắc rõ rồi kiên định theo.'
  },
  5: { // The Hierophant
    love: 'Quan hệ nghiêm túc, theo giá trị truyền thống hoặc hướng tới cam kết lâu dài.',
    work: 'Học từ người thầy, theo quy chuẩn và hệ thống đã được kiểm chứng; hợp môi trường bài bản.',
    finance: 'Theo phương pháp an toàn, tham khảo lời khuyên chuyên môn; tránh “đi tắt” rủi ro.',
    advice: 'Tìm cố vấn hoặc cộng đồng cùng giá trị để được dẫn đường.'
  },
  6: { // The Lovers
    love: 'Sự hòa hợp sâu sắc, một mối quan hệ đáng quý hoặc lựa chọn từ trái tim.',
    work: 'Hợp tác ăn ý, hoặc một quyết định nghề nghiệp cần đúng với giá trị của bạn.',
    finance: 'Cân nhắc lựa chọn tài chính theo điều thật sự quan trọng, không theo áp lực bên ngoài.',
    advice: 'Chọn bằng giá trị thật, để trái tim và lý trí cùng đồng thuận.'
  },
  7: { // The Chariot
    love: 'Theo đuổi có quyết tâm, hoặc cùng nhau vượt trở ngại để tiến tới; giữ cảm xúc cân bằng.',
    work: 'Tập trung ý chí và tự chủ sẽ đưa bạn tới đích; thắng lợi thuộc về người kiên định.',
    finance: 'Kỷ luật và mục tiêu rõ giúp tiến triển; tránh để cảm xúc lái quyết định.',
    advice: 'Giữ vững tay lái, gom năng lượng về một hướng duy nhất.'
  },
  8: { // Strength
    love: 'Yêu bằng sự kiên nhẫn và bao dung; sức mạnh dịu dàng giúp hàn gắn và giữ lửa.',
    work: 'Bền bỉ, điềm tĩnh trước áp lực; thuyết phục bằng sự mềm mỏng hơn là ép buộc.',
    finance: 'Kiên nhẫn, tự chủ trong chi tiêu; giữ bình tĩnh trước biến động ngắn hạn.',
    advice: 'Chế ngự nóng giận bằng sự dịu dàng — đó mới là sức mạnh thật.'
  },
  9: { // The Hermit
    love: 'Cần khoảng riêng để hiểu lòng mình; coi trọng chất lượng hơn số lượng trong kết nối.',
    work: 'Thời gian nghiên cứu độc lập, trau dồi chuyên môn; lắng nghe tiếng nói bên trong.',
    finance: 'Xem lại chi tiêu trong tĩnh lặng, ưu tiên giá trị bền thay vì hào nhoáng.',
    advice: 'Dành thời gian một mình để soi đèn vào điều mình thật sự cần.'
  },
  10: { // Wheel of Fortune
    love: 'Một bước ngoặt hoặc cơ duyên đang đến; thuận theo dòng chảy và nắm lấy thời điểm.',
    work: 'Vận xoay theo hướng mới, cơ hội bất ngờ; linh hoạt thích nghi với thay đổi.',
    finance: 'Tài chính lên xuống theo chu kỳ; chuẩn bị cho cả lúc thuận lẫn lúc nghịch.',
    advice: 'Chấp nhận đổi thay là quy luật, giữ tâm vững giữa vòng quay.'
  },
  11: { // Justice
    love: 'Quan hệ cần công bằng và trung thực; thường gặt lại đúng điều mình đã gieo.',
    work: 'Quyết định dựa trên sự thật và lẽ phải; chú ý hợp đồng, giấy tờ pháp lý rõ ràng.',
    finance: 'Minh bạch sổ sách, cân đối thu chi; trách nhiệm hôm nay định kết quả mai sau.',
    advice: 'Hành xử ngay thẳng và nhận trách nhiệm cho lựa chọn của mình.'
  },
  12: { // The Hanged Man
    love: 'Cần kiên nhẫn và nhìn quan hệ từ góc khác; đôi khi buông kỳ vọng lại mở ra lối đi.',
    work: 'Tạm dừng để nhìn lại; giải pháp thường đến khi bạn đổi cách tiếp cận.',
    finance: 'Chưa phải lúc cho nước cờ lớn; chờ đợi và quan sát có thể là khôn ngoan.',
    advice: 'Buông điều ngoài tầm kiểm soát, thử nhìn mọi việc bằng con mắt mới.'
  },
  13: { // Death
    love: 'Một giai đoạn khép lại để mở chương mới; buông cái cũ giúp tình cảm hồi sinh.',
    work: 'Kết thúc một việc đã hết vai trò, dọn đường cho thay đổi cần thiết.',
    finance: 'Khép lại thói quen tài chính cũ; tái cấu trúc để bắt đầu lành mạnh hơn.',
    advice: 'Đừng níu cái đã hết duyên — chuyển hóa là cách sự sống tiếp diễn.'
  },
  14: { // Temperance
    love: 'Hòa hợp nhờ kiên nhẫn và dung hòa; tình cảm chín dần trong sự điều độ.',
    work: 'Phối hợp nhịp nhàng, cân bằng các nguồn lực; tiến chậm mà chắc hơn vội vàng.',
    finance: 'Chi tiêu điều độ, cân đối giữa hưởng thụ và tiết kiệm.',
    advice: 'Tìm điểm cân bằng, pha trộn đúng liều giữa các thái cực.'
  },
  15: { // The Devil
    love: 'Có thể có sức hút mãnh liệt nhưng dễ lệ thuộc; nhìn rõ điều đang giữ chân mình.',
    work: 'Cảm giác mắc kẹt hoặc bị danh lợi trói buộc; nhớ rằng bạn vẫn còn lựa chọn.',
    finance: 'Cẩn thận nợ nần, mua sắm theo cám dỗ hoặc ràng buộc khó gỡ; đọc kỹ điều khoản.',
    advice: 'Gọi tên sợi xích vô hình — nhận ra nó là bước đầu để tự do.'
  },
  16: { // The Tower
    love: 'Một cú rung lắc có thể phơi bày sự thật; tuy đau nhưng dọn chỗ cho nền tảng thật hơn.',
    work: 'Thay đổi đột ngột hoặc đảo lộn kế hoạch; cũng là cơ hội xây lại trên móng vững.',
    finance: 'Biến động bất ngờ; nên có quỹ dự phòng và đừng hoảng loạn ra quyết định.',
    advice: 'Cái đổ vỡ thường là cái cần được thay; giữ bình tĩnh và dựng lại.'
  },
  17: { // The Star
    love: 'Hy vọng và chữa lành sau giông bão; mở lòng đón nhận sự dịu dàng chân thành.',
    work: 'Cảm hứng trở lại, niềm tin được phục hồi; theo đuổi điều có ý nghĩa với mình.',
    finance: 'Triển vọng sáng dần, lạc quan có cơ sở; gieo hạt cho tương lai.',
    advice: 'Giữ niềm tin và cho phép mình được chữa lành — ánh sáng đang trở lại.'
  },
  18: { // The Moon
    love: 'Có điều chưa rõ ràng hoặc hiểu lầm; lắng nghe trực giác và hỏi cho minh bạch.',
    work: 'Thông tin chưa đầy đủ, dễ nhầm lẫn; kiểm chứng kỹ trước khi tin hay quyết.',
    finance: 'Cẩn thận điều mập mờ, lời mời “quá đẹp”; soi cho rõ trước khi cam kết.',
    advice: 'Đừng để nỗi sợ trong bóng tối dẫn lối; chờ ánh sáng rọi rõ rồi hãy bước.'
  },
  19: { // The Sun
    love: 'Niềm vui, ấm áp và chân thành; một giai đoạn rạng rỡ của tình cảm.',
    work: 'Thành công và được ghi nhận; năng lượng tích cực lan tỏa tới mọi việc.',
    finance: 'Thuận lợi, sáng sủa; tận hưởng thành quả nhưng vẫn giữ chừng mực.',
    advice: 'Cho phép mình tỏa sáng và lan niềm vui — đây là lúc sống trọn.'
  },
  20: { // Judgement
    love: 'Một sự thức tỉnh hoặc lời mời làm lành; nhìn lại để bước tiếp rõ ràng hơn.',
    work: 'Đánh giá lại hành trình, một lời gọi mới hoặc bước ngoặt nghề nghiệp.',
    finance: 'Rà soát lại toàn cảnh tài chính, sửa sai và bắt đầu một chương mới.',
    advice: 'Lắng nghe tiếng gọi bên trong và tha thứ để nhẹ bước về phía trước.'
  },
  21: { // The World
    love: 'Một chu kỳ tình cảm trọn vẹn, hòa hợp và viên mãn; xứng đáng để ăn mừng.',
    work: 'Hoàn thành mục tiêu lớn, được công nhận; sẵn sàng cho một chu kỳ mới.',
    finance: 'Đạt được sự ổn định mong muốn; khép lại trọn vẹn trước khi mở hướng mới.',
    advice: 'Ghi nhận chặng đường đã đi trọn, rồi mở ra hành trình kế tiếp.'
  }
}

// Gộp 22 Ẩn Chính + 56 Ẩn Phụ → đủ 78 lá. Key = id lá (toàn cục duy nhất: 0–21 & 22–77).
export const TAROT_DEEP = { ...TAROT_MAJOR_DEEP, ...TAROT_DEEP_MINOR }
/* === end tarotDeep.js (78 lá: 22 Ẩn Chính + 56 Ẩn Phụ) === */
