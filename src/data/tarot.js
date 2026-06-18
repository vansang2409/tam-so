/* DỮ LIỆU TAROT — đủ 78 lá (22 Ẩn Chính + 56 Ẩn Phụ).
 * Từ khóa & luận giải bám truyền thống Rider–Waite–Smith / Labyrinthos.
 * Nội dung chiêm nghiệm/giải trí — không phải khoa học. */

const MAJOR = [
  { id:0, arcana:'major', roman:'0', symbol:'🎒', name:'The Fool', nameVi:'Gã Khờ',
    desc:'Chàng trai tay nải bước tới mép vực, mắt ngước trời, chú khuyển nhỏ theo sau — biểu tượng của khởi đầu thuần khiết và niềm tin vào hành trình.',
    upKeys:['khởi đầu mới','ngây thơ','tự do'], revKeys:['liều lĩnh','thiếu cân nhắc'],
    up:'Một chương hoàn toàn mới đang mở ra trước mặt bạn. Đây là lúc bước đi với tâm hồn rộng mở, dám liều một cách hồn nhiên và tin rằng con đường sẽ hiện ra dưới chân. Đừng để nỗi sợ điều chưa biết trói chân — hãy nói "có" với cuộc phiêu lưu.',
    rev:'Sự hồn nhiên đang nghiêng về liều lĩnh hoặc thiếu chuẩn bị. Có thể bạn chần chừ mãi trước một khởi đầu, hoặc lao đi mà chưa nhìn đường. Hãy dừng đủ lâu để cân nhắc rủi ro và lắng nghe lời khuyên trước khi nhảy.' },
  { id:1, arcana:'major', roman:'I', symbol:'🪄', name:'The Magician', nameVi:'Nhà Ảo Thuật',
    desc:'Một tay chỉ trời, một tay chỉ đất; trên bàn đủ bốn biểu tượng của bốn nguyên tố — người biết biến ý tưởng thành hiện thực.',
    upKeys:['ý chí','sáng tạo','hiện thực hóa'], revKeys:['thao túng','ảo tưởng'],
    up:'Bạn đang nắm trong tay mọi công cụ cần thiết để biến mong muốn thành hiện thực. Đây là thời điểm của ý chí, sự tập trung và hành động có chủ đích — hãy kết nối ý tưởng với việc làm cụ thể. Tin vào năng lực của mình và bắt tay vào tạo dựng.',
    rev:'Năng lượng sáng tạo đang bị dùng sai cách: mánh khóe, lời hứa suông hoặc tự lừa dối bản thân. Có thể bạn thấy tiềm năng của mình bị lãng phí hoặc chưa biết bắt đầu từ đâu. Hãy thành thật về động cơ và sắp xếp lại nguồn lực.' },
  { id:2, arcana:'major', roman:'II', symbol:'🌙', name:'The High Priestess', nameVi:'Nữ Tư Tế',
    desc:'Người phụ nữ ngồi giữa hai cột sáng–tối, sau lưng là tấm màn che giấu điều bí ẩn — hiện thân của trực giác và tri thức ẩn.',
    upKeys:['trực giác','tiềm thức','bí ẩn'], revKeys:['phớt lờ trực giác','kìm nén'],
    up:'Câu trả lời bạn tìm nằm ở bên trong, không ở bề mặt. Đây là lúc lắng nghe trực giác, chú ý đến giấc mơ và những điều chưa nói thành lời. Hãy tĩnh lặng, quan sát và để sự thật tự hé lộ thay vì vội vàng hành động.',
    rev:'Bạn đang ngắt kết nối với tiếng nói bên trong — phớt lờ linh cảm hoặc che giấu cảm xúc thật. Có thể bạn để lý trí át đi trực giác, hoặc bị thông tin bề mặt đánh lừa. Hãy dành thời gian một mình để nghe lại chính mình.' },
  { id:3, arcana:'major', roman:'III', symbol:'🌹', name:'The Empress', nameVi:'Nữ Hoàng',
    desc:'Người mẹ thiên nhiên ngồi giữa vườn cây trĩu quả, biểu tượng của sự sinh sôi, nuôi dưỡng và vẻ đẹp dồi dào.',
    upKeys:['nuôi dưỡng','phồn thịnh','thiên nhiên'], revKeys:['phụ thuộc','trống rỗng'],
    up:'Một thời kỳ sinh sôi và dồi dào đang đến — trong tình cảm, sáng tạo hay vật chất. Hãy cho phép mình tận hưởng cái đẹp, chăm sóc bản thân và những người quanh mình. Khi bạn nuôi dưỡng bằng trái tim, mọi thứ sẽ đơm hoa kết trái.',
    rev:'Sự chăm sóc có thể đang mất cân bằng: cho đi đến cạn kiệt, bao bọc thái quá hoặc bỏ bê chính mình. Đôi khi là cảm giác trống rỗng, bế tắc sáng tạo. Hãy đổ đầy chiếc cốc của bạn trước khi rót cho người khác.' },
  { id:4, arcana:'major', roman:'IV', symbol:'🏛️', name:'The Emperor', nameVi:'Hoàng Đế',
    desc:'Vị vua ngồi trên ngai đá khắc đầu cừu, tay cầm quyền trượng — hiện thân của trật tự, kỷ luật và quyền lực vững vàng.',
    upKeys:['quyền uy','cấu trúc','kỷ luật'], revKeys:['độc đoán','cứng nhắc'],
    up:'Đây là lúc thiết lập trật tự, kỷ luật và một nền tảng vững chắc. Lãnh đạo bằng sự điềm tĩnh, đặt ra quy tắc rõ ràng và kiên định với mục tiêu sẽ mang lại kết quả. Sức mạnh thật đến từ cấu trúc và trách nhiệm, không phải sự áp đặt.',
    rev:'Quyền lực đang trở nên cứng nhắc, độc đoán hoặc lạm dụng. Có thể bạn quá kiểm soát, hoặc đang chịu sự áp đặt từ ai đó. Hãy mềm dẻo hơn, lắng nghe và phân biệt giữa kỷ luật lành mạnh với sự bảo thủ.' },
  { id:5, arcana:'major', roman:'V', symbol:'🗝️', name:'The Hierophant', nameVi:'Giáo Hoàng',
    desc:'Vị tăng lữ ban phước cho hai môn đồ, nắm giữ chìa khóa của tri thức truyền thống và đức tin.',
    upKeys:['truyền thống','chuẩn mực','dẫn dắt'], revKeys:['nổi loạn','phá cách'],
    up:'Đây là lúc học hỏi từ truyền thống, người thầy hoặc một hệ giá trị đáng tin. Những chuẩn mực, nghi thức và lời chỉ dẫn có sẵn là điểm tựa vững chắc lúc này. Tìm đến cố vấn hoặc cộng đồng cùng niềm tin để được dẫn đường.',
    rev:'Bạn muốn bước ra khỏi khuôn mẫu và đi theo con đường riêng. Có thể những quy tắc cũ không còn phù hợp, hoặc bạn đang nghi ngờ một thẩm quyền. Phá cách là chính đáng — miễn là có chủ đích và hiểu mình đang chọn gì.' },
  { id:6, arcana:'major', roman:'VI', symbol:'💞', name:'The Lovers', nameVi:'Tình Nhân',
    desc:'Đôi nam nữ dưới sự chứng giám của thiên thần — biểu tượng của tình yêu, sự hòa hợp và những lựa chọn từ trái tim.',
    upKeys:['gắn kết','lựa chọn','hòa hợp'], revKeys:['mất cân bằng','bất hòa'],
    up:'Một mối quan hệ sâu sắc hoặc sự hòa hợp đáng quý đang hiện diện. Đây cũng có thể là một lựa chọn quan trọng cần được đưa ra dựa trên giá trị thật của bạn, không phải nỗi sợ. Khi tim và lý trí cùng đồng thuận, con đường sẽ sáng rõ.',
    rev:'Có sự bất hòa, hiểu lầm hoặc mất cân bằng trong quan hệ. Cũng có thể bạn đang đứng trước một quyết định đi ngược lòng mình. Hãy giao tiếp thẳng thắn và xác định lại điều gì thực sự quan trọng với bạn.' },
  { id:7, arcana:'major', roman:'VII', symbol:'🐎', name:'The Chariot', nameVi:'Cỗ Xe',
    desc:'Người chiến binh điều khiển cỗ xe kéo bởi hai nhân sư đen–trắng — ý chí chế ngự những lực đối nghịch để tiến lên.',
    upKeys:['định hướng','ý chí','chiến thắng'], revKeys:['mất kiểm soát','lạc hướng'],
    up:'Quyết tâm và sự tự chủ đang đưa bạn tiến thẳng tới đích. Dù có những lực kéo ngược chiều, hãy giữ vững tay lái, tập trung ý chí và đừng để cảm xúc làm chệch hướng. Chiến thắng thuộc về người kiên định và biết kiểm soát.',
    rev:'Bạn có thể đang mất phương hướng hoặc để cảm xúc, hoàn cảnh lấn át. Năng lượng bị phân tán khiến cỗ xe đi lệch. Hãy dừng lại, xác định rõ mục tiêu và giành lại quyền làm chủ trước khi tiếp tục.' },
  { id:8, arcana:'major', roman:'VIII', symbol:'🦁', name:'Strength', nameVi:'Sức Mạnh',
    desc:'Người phụ nữ dịu dàng khép miệng sư tử bằng đôi tay mềm — sức mạnh của lòng can đảm và sự điềm tĩnh nội tâm.',
    upKeys:['nội lực','can đảm','trắc ẩn'], revKeys:['hoài nghi bản thân','bất an'],
    up:'Sức mạnh thật của bạn nằm ở sự dịu dàng, kiên nhẫn và làm chủ bản thân — không phải ở vũ lực. Hãy đối diện thử thách bằng lòng can đảm điềm tĩnh và sự trắc ẩn. Khi bạn thuần phục được nỗi sợ bên trong, không gì cản nổi bạn.',
    rev:'Sự tự nghi ngờ, bất an đang bào mòn nội lực của bạn. Có thể bạn thấy yếu đuối, dễ cáu hoặc mất bình tĩnh. Hãy tử tế với chính mình, phục hồi năng lượng và nhớ rằng bạn mạnh mẽ hơn mình tưởng.' },
  { id:9, arcana:'major', roman:'IX', symbol:'🏮', name:'The Hermit', nameVi:'Ẩn Sĩ',
    desc:'Vị ẩn sĩ trên đỉnh núi giơ cao chiếc đèn lồng soi đường — hành trình hướng nội đi tìm chân lý.',
    upKeys:['chiêm nghiệm','tìm sự thật','nội tâm'], revKeys:['cô lập','lạc lối'],
    up:'Đây là thời điểm lùi lại, tĩnh lặng và soi rọi vào bên trong. Câu trả lời và ánh sáng bạn tìm kiếm đến từ sự chiêm nghiệm, không phải từ ồn ào bên ngoài. Hãy dành thời gian một mình để hiểu mình và tìm ra hướng đi đích thực.',
    rev:'Sự đơn độc đang chuyển thành cô lập hoặc lảng tránh. Có thể bạn rút lui quá mức, hoặc ngược lại, sợ đối diện với chính mình. Hãy cân nhắc kết nối lại với người khác, hoặc tìm một người dẫn đường đáng tin.' },
  { id:10, arcana:'major', roman:'X', symbol:'🎡', name:'Wheel of Fortune', nameVi:'Bánh Xe Số Phận',
    desc:'Bánh xe vũ trụ quay giữa các sinh vật và biểu tượng — nhắc rằng vạn vật xoay vần theo chu kỳ.',
    upKeys:['thay đổi','chu kỳ','bước ngoặt'], revKeys:['mất kiểm soát','vận xui'],
    up:'Vòng quay cuộc đời đang chuyển sang một nhịp mới, thường là theo hướng thuận lợi. Một bước ngoặt, cơ hội hay sự thay đổi bất ngờ đang đến — hãy đón nhận nó như phần tất yếu của chu kỳ. Khi ở đỉnh hãy khiêm nhường, khi ở đáy hãy giữ niềm tin.',
    rev:'Bạn có cảm giác mọi thứ vượt ngoài tầm kiểm soát, hoặc đang mắc trong một vòng lặp xui rủi. Càng níu giữ và cưỡng lại đổi thay, càng mệt mỏi. Hãy buông bớt kỳ vọng cứng nhắc và thuận theo dòng chảy.' },
  { id:11, arcana:'major', roman:'XI', symbol:'⚖️', name:'Justice', nameVi:'Công Lý',
    desc:'Vị thẩm phán cầm cân và thanh kiếm — biểu tượng của sự thật, lẽ công bằng và luật nhân quả.',
    upKeys:['nhân quả','sự thật','công bằng'], revKeys:['bất công','dối trá'],
    up:'Sự thật và lẽ công bằng đang hiện rõ; mỗi hành động đều mang lại hệ quả tương xứng. Đây là lúc hành động ngay thẳng, nhận trách nhiệm và đưa ra quyết định dựa trên lý trí và đạo lý. Gieo gì gặt nấy — hãy gieo điều đúng đắn.',
    rev:'Có sự thiếu trung thực, bất công hoặc trốn tránh trách nhiệm đang diễn ra. Có thể bạn đang tự bào chữa hoặc né tránh hậu quả. Hãy thành thật đối diện sự thật — đó là bước đầu để mọi thứ được cân bằng lại.' },
  { id:12, arcana:'major', roman:'XII', symbol:'🙃', name:'The Hanged Man', nameVi:'Người Treo Ngược',
    desc:'Người treo ngược thanh thản, hào quang quanh đầu — sự buông bỏ tự nguyện để nhìn đời bằng góc khác.',
    upKeys:['buông bỏ','đổi góc nhìn','tạm dừng'], revKeys:['trì hoãn','kháng cự'],
    up:'Đã đến lúc tạm dừng, buông bỏ và nhìn mọi việc từ một góc độ khác. Sự hy sinh hoặc chờ đợi lúc này không vô ích — nó mở ra một cái nhìn mới mẻ. Đôi khi đứng yên và chấp nhận lại chính là cách tiến về phía trước.',
    rev:'Bạn đang chống lại điều cần buông, hoặc trì hoãn một cách vô ích trong khi mọi thứ đình trệ. Có thể bạn hy sinh mà không thấy ý nghĩa. Hãy xem lại điều gì đáng giữ, điều gì nên thả, và ngừng cưỡng lại dòng chảy.' },
  { id:13, arcana:'major', roman:'XIII', symbol:'💀', name:'Death', nameVi:'Cái Chết',
    desc:'Hiệp sĩ xương trắng cưỡi ngựa dưới lá cờ hoa hồng — sự kết thúc để mở đường cho tái sinh.',
    upKeys:['kết thúc một chu kỳ','chuyển hóa','tái sinh'], revKeys:['sợ thay đổi','trì trệ'],
    up:'Một giai đoạn của cuộc đời đang khép lại để nhường chỗ cho điều mới — đây là chuyển hóa, hiếm khi mang nghĩa đen. Dù khó rời bỏ cái cũ, sự kết thúc này là cần thiết và giải phóng. Hãy để cái đã hết hạn ra đi, một khởi đầu đang chờ phía sau.',
    rev:'Bạn đang níu giữ điều lẽ ra nên buông, vì sợ thay đổi. Sự kháng cự này khiến mọi thứ trì trệ và kéo dài đau khổ không cần thiết. Hãy can đảm khép lại để được tái sinh.' },
  { id:14, arcana:'major', roman:'XIV', symbol:'⚗️', name:'Temperance', nameVi:'Tiết Độ',
    desc:'Thiên thần rót nước qua lại giữa hai chiếc cốc — nghệ thuật điều hòa và pha trộn đúng liều lượng.',
    upKeys:['cân bằng','kiên nhẫn','trung dung'], revKeys:['thái quá','nóng vội'],
    up:'Điều hòa, kiên nhẫn và trung dung sẽ mang lại sự bình an. Đây là lúc pha trộn đúng liều giữa các thái cực, tìm điểm cân bằng và để mọi thứ chín muồi theo thời gian. Sự ôn hòa và tiết chế là chìa khóa cho hài hòa lâu dài.',
    rev:'Sự cân bằng đang bị phá vỡ bởi thái quá, nóng vội hoặc mâu thuẫn nội tâm. Có thể bạn đang làm quá sức hoặc thiếu kiên nhẫn. Hãy chậm lại, điều tiết và tìm lại nhịp điệu hài hòa.' },
  { id:15, arcana:'major', roman:'XV', symbol:'😈', name:'The Devil', nameVi:'Ác Quỷ',
    desc:'Đôi nam nữ bị xiềng lỏng dưới chân ác quỷ — nhưng xiềng đủ rộng để tự cởi, nếu họ muốn.',
    upKeys:['ràng buộc','cám dỗ','lệ thuộc'], revKeys:['giải phóng','lấy lại tự chủ'],
    up:'Một sự lệ thuộc, thói quen hay cám dỗ đang trói buộc bạn — và thường đó là xiềng xích bạn tự đeo. Vật chất, dục vọng hay nỗi sợ có thể đang chi phối. Hãy nhận diện điều gì đang nắm giữ bạn; nhận ra đã là bước đầu để thoát.',
    rev:'Bạn đang nhận ra xiềng xích và bắt đầu cắt bỏ ràng buộc. Đây là lúc giành lại quyền làm chủ, từ bỏ thói quen độc hại và bước ra ánh sáng. Tự do đến khi bạn dám buông điều vẫn níu mình lại.' },
  { id:16, arcana:'major', roman:'XVI', symbol:'🗼', name:'The Tower', nameVi:'Tòa Tháp',
    desc:'Tia sét đánh sập đỉnh tháp, hai người rơi xuống — sự sụp đổ đột ngột của những gì xây trên nền giả.',
    upKeys:['biến động đột ngột','sụp đổ','vỡ lẽ'], revKeys:['tránh tai họa','sợ đổ vỡ'],
    up:'Một cú chấn động bất ngờ đang làm lung lay nền tảng cũ. Dù gây sốc và khó chịu, nó phá vỡ những gì được dựng trên ảo tưởng để sự thật và một khởi đầu vững hơn lộ ra. Hãy để cái giả sụp đổ — điều thật sẽ đứng vững.',
    rev:'Bạn có thể đang né tránh một đổ vỡ cần thiết, hoặc nơm nớp sợ điều chưa xảy ra. Cố chống đỡ một cấu trúc đã mục chỉ kéo dài bất ổn. Đối diện và giải tỏa sớm sẽ nhẹ nhõm hơn là trì hoãn.' },
  { id:17, arcana:'major', roman:'XVII', symbol:'⭐', name:'The Star', nameVi:'Ngôi Sao',
    desc:'Người thiếu nữ rót nước bên hồ dưới bầu trời đầy sao — hy vọng và sự chữa lành sau giông bão.',
    upKeys:['hy vọng','niềm tin','chữa lành'], revKeys:['mất niềm tin','nản lòng'],
    up:'Sau giông bão là hy vọng, sự chữa lành và bình yên trở lại. Đây là lúc nuôi dưỡng niềm tin, cho phép mình được phục hồi và mơ về tương lai tươi sáng. Vũ trụ đang mỉm cười — hãy để ánh sáng dẫn lối.',
    rev:'Bạn đang cảm thấy nản lòng, mất phương hướng hoặc cạn niềm tin. Ánh sao như bị mây che. Hãy nuôi lại hy vọng từ những điều nhỏ bé và kiên nhẫn với quá trình chữa lành của mình.' },
  { id:18, arcana:'major', roman:'XVIII', symbol:'🌕', name:'The Moon', nameVi:'Mặt Trăng',
    desc:'Mặt trăng soi con đường giữa hai cột, chó sói và tôm hùm — thế giới của ảo ảnh, mộng mị và tiềm thức.',
    upKeys:['ảo ảnh','trực giác','mơ hồ'], revKeys:['bối rối','hiểu lầm'],
    up:'Mọi thứ chưa rõ ràng; ảo ảnh, nỗi sợ và sự mơ hồ có thể đang đánh lừa bạn. Đây là lúc tin vào trực giác, chú ý đến giấc mơ và đi từng bước thận trọng qua màn sương. Đừng vội kết luận khi chưa nhìn rõ.',
    rev:'Sương mù dần tan và những hiểu lầm bắt đầu sáng tỏ. Cũng có thể nỗi sợ vô cớ đang khiến bạn diễn giải sai sự việc. Hãy để cảm xúc lắng xuống, sự thật sẽ dần hiện ra.' },
  { id:19, arcana:'major', roman:'XIX', symbol:'☀️', name:'The Sun', nameVi:'Mặt Trời',
    desc:'Đứa trẻ hồn nhiên trên lưng ngựa trắng dưới mặt trời rực rỡ và hoa hướng dương — niềm vui và sức sống thuần khiết.',
    upKeys:['niềm vui','thành công','sức sống'], revKeys:['u ám tạm thời','thiếu lạc quan'],
    up:'Đây là lá bài rạng rỡ nhất: niềm vui, thành công, sức sống và sự rõ ràng. Mọi việc hanh thông, năng lượng tích cực lan tỏa và bạn được là chính mình một cách trọn vẹn. Hãy tận hưởng ánh nắng và sẻ chia hạnh phúc.',
    rev:'Niềm vui đang bị che mờ tạm thời, hoặc bạn đang gượng ép sự lạc quan. Có thể là chút u ám, mệt mỏi hay thành công bị trì hoãn. Ánh mặt trời vẫn ở đó sau mây — hãy cho mình thời gian.' },
  { id:20, arcana:'major', roman:'XX', symbol:'📯', name:'Judgement', nameVi:'Phán Xét',
    desc:'Thiên thần thổi kèn gọi người sống dậy — lời thức tỉnh, sự đánh giá lại và tái sinh tinh thần.',
    upKeys:['thức tỉnh','đánh giá lại','tha thứ'], revKeys:['hoài nghi','tự trách'],
    up:'Một lời thức tỉnh đang vang lên: hãy nhìn lại hành trình đã qua, rút ra bài học và tha thứ để bước sang chương mới. Đây là thời khắc đánh giá lại bản thân và đáp lại tiếng gọi sâu thẳm bên trong. Một phiên bản trưởng thành hơn của bạn đang chờ.',
    rev:'Bạn đang khó tha thứ cho mình, mắc kẹt trong tự trách hoặc phớt lờ tiếng gọi nội tâm. Sự hoài nghi khiến bạn chần chừ trước thay đổi đáng làm. Hãy bao dung với chính mình và lắng nghe điều trái tim mách bảo.' },
  { id:21, arcana:'major', roman:'XXI', symbol:'🌍', name:'The World', nameVi:'Thế Giới',
    desc:'Vũ công giữa vòng nguyệt quế, bốn sinh vật ở bốn góc — sự hoàn tất viên mãn của một chu kỳ.',
    upKeys:['hoàn thành','viên mãn','trọn vẹn'], revKeys:['dang dở','chưa khép lại'],
    up:'Một chu kỳ quan trọng đang hoàn tất trong viên mãn. Bạn đạt tới sự trọn vẹn, hài hòa và xứng đáng ăn mừng thành quả. Đây là đỉnh cao của một hành trình — và cũng là khởi điểm cho vòng đời mới rộng mở hơn.',
    rev:'Còn điều gì đó dang dở cần được khép lại trước khi bạn thật sự sang chặng mới. Có thể bạn đang trì hoãn cái kết, hoặc thiếu một mảnh ghép cuối. Hãy hoàn tất nốt phần còn thiếu để chạm tới sự trọn vẹn.' }
]

const SUITS = [
  { key:'wands', vi:'Gậy', en:'Wands', sym:'🔥', el:'Lửa' },
  { key:'cups', vi:'Cốc', en:'Cups', sym:'🍷', el:'Nước' },
  { key:'swords', vi:'Kiếm', en:'Swords', sym:'⚔️', el:'Khí' },
  { key:'pentacles', vi:'Tiền', en:'Pentacles', sym:'🪙', el:'Đất' }
]
const RANK_VI = ['Át','2','3','4','5','6','7','8','9','10','Thị Đồng','Hiệp Sĩ','Nữ Hoàng','Vua']
const RANK_EN = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King']

const MINOR_KW = {
  wands: [['cảm hứng, khởi đầu','trì hoãn, thiếu định hướng'],['lên kế hoạch, tầm nhìn','do dự, kế hoạch dở'],['mở rộng, tiến triển','chậm trễ, trở ngại'],['ăn mừng, mái ấm','bất ổn, chuyển tiếp'],['cạnh tranh, bất đồng','tránh né, hòa giải'],['chiến thắng, được công nhận','thất bại, thiếu công nhận'],['kiên định, thách thức','kiệt sức, buông xuôi'],['chuyển động nhanh, tin tức','chậm trễ, hỗn loạn'],['kiên cường, đề phòng','kiệt sức, cố chấp'],['gánh nặng, trách nhiệm','quá tải, buông bớt'],['khám phá, ý tưởng mới','bốc đồng, thiếu định hướng'],['hành động, phiêu lưu','nóng vội, thiếu kiên nhẫn'],['tự tin, lôi cuốn','ghen tị, thiếu tự tin'],['tầm nhìn, lãnh đạo','độc đoán, hấp tấp']],
  cups: [['tình cảm mới, trực giác','cảm xúc dồn nén, trống rỗng'],['kết đôi, hòa hợp','bất hòa, mất cân bằng'],['tình bạn, ăn mừng','rạn nứt nhóm, thừa thãi'],['chán nản, suy ngẫm','tỉnh thức, nắm cơ hội'],['mất mát, tiếc nuối','chấp nhận, hồi phục'],['hoài niệm, ký ức','mắc kẹt quá khứ'],['lựa chọn, mộng tưởng','rõ ràng, quyết định'],['rời bỏ, tìm điều sâu xa','lưỡng lự, sợ thay đổi'],['mãn nguyện, ước nguyện','tự mãn, chưa thỏa'],['hạnh phúc viên mãn','bất hòa gia đình'],['thông điệp tình cảm, mơ mộng','cảm xúc non nớt, né tránh'],['lãng mạn, theo trái tim','mơ mộng hão, thất thường'],['từ bi, thấu cảm','phụ thuộc cảm xúc, quá nhạy'],['cân bằng cảm xúc, bao dung','ủ rũ, thao túng cảm xúc']],
  swords: [['đột phá, sáng suốt','hỗn loạn ý nghĩ, hiểu lầm'],['bế tắc, do dự','quyết định, gỡ bế tắc'],['tổn thương, chia ly','chữa lành, tha thứ'],['nghỉ ngơi, tĩnh tâm','kiệt sức, trì trệ'],['xung đột, bất hòa','hòa giải, buông hận'],['chuyển tiếp, rời đi','mắc kẹt, kháng cự'],['mưu mẹo, chiến lược','thú nhận, lương tâm'],['trói buộc, tự giới hạn','giải thoát, tìm lối ra'],['lo âu, dằn vặt','hy vọng, vượt nỗi sợ'],['kết thúc đau đớn','hồi sinh, vực dậy'],['tò mò, cảnh giác','nói suông, hấp tấp'],['quyết liệt, hành động nhanh','hung hăng, thiếu suy xét'],['sắc sảo, thẳng thắn','lạnh lùng, cay nghiệt'],['lý trí, công minh','lạm quyền, lạnh lùng']],
  pentacles: [['cơ hội mới, thịnh vượng','cơ hội lỡ, thiếu nền tảng'],['cân bằng, linh hoạt','quá tải, mất cân đối'],['hợp tác, kỹ năng','thiếu phối hợp, qua loa'],['an toàn, kiểm soát','keo kiệt, bám víu'],['khó khăn, thiếu thốn','hồi phục, qua cơn bĩ'],['cho-nhận, hào phóng','bất cân, nợ nần'],['kiên nhẫn, đầu tư dài hạn','sốt ruột, đầu tư kém'],['chăm chỉ, rèn nghề','cẩu thả, thiếu động lực'],['tự chủ, sung túc','lệ thuộc, phô trương'],['của cải, bền vững','rủi ro tài chính'],['ham học, mục tiêu','lơ đãng, trì hoãn'],['cần mẫn, đáng tin','trì trệ, bảo thủ'],['chăm lo, thực tế','ôm đồm, bỏ bê bản thân'],['thành đạt, ổn định','tham lam, bảo thủ']]
}

function buildMinor() {
  const out = []; let id = 22
  for (const s of SUITS) {
    MINOR_KW[s.key].forEach((kw, i) => {
      out.push({
        id: id++, arcana: 'minor', suit: s.vi, element: s.el, roman: RANK_VI[i], symbol: s.sym,
        name: RANK_EN[i] + ' of ' + s.en, nameVi: RANK_VI[i] + ' ' + s.vi,
        upKeys: kw[0].split(', '), revKeys: kw[1].split(', ')
      })
    })
  }
  return out
}

export const TAROT_CARDS = [...MAJOR, ...buildMinor()]

export const TAROT_SPREADS = {
  one: { label: '1 lá — Thông điệp', positions: ['Thông điệp'] },
  three: { label: '3 lá — Quá khứ · Hiện tại · Tương lai', positions: ['Quá khứ', 'Hiện tại', 'Tương lai'] },
  love: { label: '5 lá — Tình yêu', positions: ['Bạn', 'Đối phương', 'Mối quan hệ', 'Thử thách', 'Kết quả'] },
  career: { label: '4 lá — Sự nghiệp', positions: ['Hiện trạng', 'Trở ngại', 'Lời khuyên', 'Kết quả'] },
  celtic: { label: '10 lá — Celtic Cross', positions: ['Hiện tại', 'Thách thức', 'Nền tảng', 'Quá khứ', 'Mục tiêu', 'Tương lai gần', 'Bản thân', 'Môi trường', 'Hy vọng / Nỗi sợ', 'Kết quả'] },
  yesno: { label: 'Có / Không', positions: ['Trả lời'] }
}

export function drawCards(n) {
  const idx = TAROT_CARDS.map((_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[idx[i], idx[j]] = [idx[j], idx[i]] }
  return idx.slice(0, n).map(i => ({ card: TAROT_CARDS[i], up: Math.random() < 0.5 }))
}

export function cardOfDay(date = new Date()) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const idx = seed % TAROT_CARDS.length
  const up = Math.floor(seed / TAROT_CARDS.length) % 2 === 0
  return { card: TAROT_CARDS[idx], up }
}

/* ===== Ảnh bài Rider–Waite–Smith (Wikimedia Commons, phạm vi công cộng) ===== */
const MAJOR_IMG = ['RWS_Tarot_00_Fool.jpg','RWS_Tarot_01_Magician.jpg','RWS_Tarot_02_High_Priestess.jpg','RWS_Tarot_03_Empress.jpg','RWS_Tarot_04_Emperor.jpg','RWS_Tarot_05_Hierophant.jpg','RWS_Tarot_06_Lovers.jpg','RWS_Tarot_07_Chariot.jpg','RWS_Tarot_08_Strength.jpg','RWS_Tarot_09_Hermit.jpg','RWS_Tarot_10_Wheel_of_Fortune.jpg','RWS_Tarot_11_Justice.jpg','RWS_Tarot_12_Hanged_Man.jpg','RWS_Tarot_13_Death.jpg','RWS_Tarot_14_Temperance.jpg','RWS_Tarot_15_Devil.jpg','RWS_Tarot_16_Tower.jpg','RWS_Tarot_17_Star.jpg','RWS_Tarot_18_Moon.jpg','RWS_Tarot_19_Sun.jpg','RWS_Tarot_20_Judgement.jpg','RWS_Tarot_21_World.jpg']
const SUIT_PREFIX = { 'Gậy': 'Wands', 'Cốc': 'Cups', 'Kiếm': 'Swords', 'Tiền': 'Pents' }
const RANK_NUM = { 'Át': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'Thị Đồng': 11, 'Hiệp Sĩ': 12, 'Nữ Hoàng': 13, 'Vua': 14 }
export function cardImageFile(card) {
  if (card.arcana === 'major') return MAJOR_IMG[card.id]
  const p = SUIT_PREFIX[card.suit], n = RANK_NUM[card.roman]
  return p && n ? p + String(n).padStart(2, '0') + '.jpg' : null
}
/* Đặt true SAU KHI đã chạy `npm run fetch-cards` (tải 78 ảnh về public/cards/)
 * để dùng ảnh nội bộ — chạy offline, nhanh hơn, không phụ thuộc Wikimedia.
 * Mặc định false: hotlink Wikimedia Commons (cần mạng nhưng luôn sẵn). */
export const LOCAL_CARDS = true
export function cardImageRemoteUrl(card, width = 320) {
  const f = cardImageFile(card)
  return f ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=${width}` : null
}
export function cardImageUrl(card, width = 320) {
  const f = cardImageFile(card)
  if (!f) return null
  if (LOCAL_CARDS) {
    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './'
    return base + 'cards/' + f
  }
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=${width}`
}

/* ===== Luận giải đầy đủ 56 lá Ẩn Phụ (xuôi/ngược, 2 câu) ===== */
const MINOR_TEXT = {
  wands: [
    { u: 'Một tia lửa cảm hứng vừa lóe lên: ý tưởng mới, đam mê mới hay cơ hội khởi sự. Hãy nắm lấy và hành động khi ngọn lửa còn nóng.', r: 'Cảm hứng chững lại hoặc dự định bị trì hoãn. Có thể bạn thiếu động lực hay chưa rõ hướng — đừng ép, hãy chờ lửa nhen lại.' },
    { u: 'Bạn đứng trước một lựa chọn và đang phóng tầm nhìn ra xa để lập kế hoạch. Hãy mạnh dạn quyết định thay vì mãi đứng giữa hai bờ.', r: 'Sự do dự và nỗi sợ rời vùng an toàn khiến kế hoạch dở dang. Hãy thu hẹp lựa chọn và cam kết với một hướng đi.' },
    { u: 'Những nỗ lực ban đầu đang đơm hoa; tầm nhìn của bạn bắt đầu mở rộng. Đây là lúc tự tin tiến xa hơn và đón cơ hội hợp tác.', r: 'Có sự chậm trễ, trở ngại hoặc kỳ vọng chưa thành. Hãy kiên nhẫn rà soát lại kế hoạch trước khi đi tiếp.' },
    { u: 'Một dịp ăn mừng, ổn định và niềm vui sum vầy nơi mái ấm. Hãy tận hưởng thành quả và sự hòa hợp đang có.', r: 'Giai đoạn chuyển tiếp khiến cảm giác gắn kết chưa trọn vẹn. Nền tảng vẫn đó — chỉ cần thêm thời gian vun đắp.' },
    { u: 'Cạnh tranh và va chạm quan điểm đang diễn ra. Hãy xem đó là động lực rèn giũa thay vì xung đột hơn thua.', r: 'Bạn đang né tránh xung đột hoặc tìm cách hòa giải. Buông bớt cái tôi sẽ giúp căng thẳng lắng xuống.' },
    { u: 'Chiến thắng và sự công nhận đang đến sau nỗ lực bền bỉ. Hãy đón nhận lời khen và tự hào về chặng đường đã qua.', r: 'Thành công bị trì hoãn hoặc thiếu ghi nhận khiến tự tin lung lay. Hãy nhớ giá trị của mình không phụ thuộc lời tán dương.' },
    { u: 'Bạn đang ở thế phải giữ vững lập trường và can đảm bảo vệ điều mình tin. Kiên định lúc này sẽ được đền đáp.', r: 'Áp lực dồn nén khiến bạn kiệt sức và muốn buông xuôi. Hãy nghỉ lấy sức và chọn trận đáng để chiến đấu.' },
    { u: 'Mọi việc chuyển động nhanh: tin tức, tiến triển và cơ hội dồn dập. Hãy bắt nhịp và hành động dứt khoát.', r: 'Sự chậm trễ và lộn xộn khiến thông tin đến sai thời điểm. Hãy kiên nhẫn, đừng vội phản ứng khi mọi thứ còn rối.' },
    { u: 'Bạn kiên cường trước thử thách cuối cùng, vẫn đứng vững dù mỏi mệt. Hãy giữ ranh giới và đừng bỏ cuộc khi sắp tới đích.', r: 'Sự phòng thủ thái quá và cố chấp đang vắt kiệt bạn. Hãy hạ bớt hàng rào và cân nhắc khi nào nên buông.' },
    { u: 'Bạn đang gánh quá nhiều trách nhiệm cùng lúc, vai trĩu nặng. Hãy san sẻ bớt và nhớ rằng không nhất thiết tự ôm tất cả.', r: 'Đã đến lúc đặt bớt gánh nặng xuống và ủy thác cho người khác. Buông bớt sẽ giúp bạn đi xa hơn.' },
    { u: 'Tinh thần khám phá và ý tưởng mới đang bừng lên đầy nhiệt huyết. Hãy cho phép mình tò mò và thử nghiệm.', r: 'Sự bốc đồng và thiếu định hướng có thể khiến bạn lạc lối; một tin tức làm bạn hụt hẫng. Hãy đặt mục tiêu rõ trước khi lao đi.' },
    { u: 'Bạn lao về phía trước đầy đam mê và tinh thần phiêu lưu. Đây là lúc dấn thân, miễn là giữ được tầm nhìn.', r: 'Sự nóng vội và thiếu kiên nhẫn dễ dẫn tới hành động bốc đồng. Hãy hãm phanh và suy xét hệ quả.' },
    { u: 'Bạn tự tin, nồng nhiệt và cuốn hút, làm chủ cuộc chơi bằng năng lượng riêng. Hãy tỏa sáng và truyền cảm hứng.', r: 'Sự thiếu tự tin hoặc ghen tị đang khiến năng lượng phân tán. Hãy quay về với giá trị thật của mình.' },
    { u: 'Tầm nhìn lãnh đạo, sự quyết đoán và khả năng truyền cảm hứng đang ở phía bạn. Hãy dẫn dắt bằng tầm nhìn dài hạn.', r: 'Sự độc đoán và hấp tấp có thể khiến bạn áp đặt người khác. Hãy lắng nghe và tiết chế cái tôi.' }
  ],
  cups: [
    { u: 'Trái tim bạn đang mở ra: một tình cảm mới, nguồn cảm xúc và trực giác tuôn chảy. Hãy đón nhận và để mình được yêu thương.', r: 'Cảm xúc bị dồn nén hoặc bạn đang khép lòng, thấy trống rỗng. Hãy cho phép mình cảm nhận và bày tỏ trở lại.' },
    { u: 'Một sự kết đôi hài hòa, đồng điệu và gắn kết hai phía. Đây là mối quan hệ được xây trên sự tôn trọng và thấu hiểu.', r: 'Có sự bất hòa hoặc lệch nhịp trong quan hệ. Hãy giao tiếp chân thành để tìm lại cân bằng.' },
    { u: 'Tình bạn, niềm vui và sự sẻ chia đang nở rộ trong cộng đồng. Hãy ăn mừng và trân trọng những người bên cạnh.', r: 'Có thể là rạn nứt trong nhóm, vui quá đà hoặc thị phi. Hãy chọn lọc các mối quan hệ nuôi dưỡng bạn.' },
    { u: 'Cảm giác chán nản, thờ ơ có thể khiến bạn bỏ lỡ cơ hội ngay trước mắt. Hãy ngẩng lên và nhìn lại điều mình đang có.', r: 'Bạn đang tỉnh thức trở lại và sẵn sàng đón nhận điều mới. Một lời mời hay cơ hội xứng đáng được cân nhắc.' },
    { u: 'Sự mất mát và tiếc nuối là có thật, nhưng vẫn còn điều đáng để giữ. Hãy cho phép mình buồn rồi nhẹ nhàng quay về phía ánh sáng.', r: 'Bạn đang chấp nhận, tha thứ và bắt đầu hồi phục sau tổn thương. Quá khứ dần khép lại để bạn bước tiếp.' },
    { u: 'Những hoài niệm ngọt ngào và ký ức trong trẻo trở về sưởi ấm bạn. Đây là lúc trân trọng cội nguồn và sự chân thành.', r: 'Bạn có thể đang mắc kẹt trong quá khứ và khó bước tiếp. Hãy giữ kỷ niệm đẹp nhưng sống cho hiện tại.' },
    { u: 'Nhiều lựa chọn mộng mơ bày ra trước mắt; hãy cẩn thận với ảo tưởng. Phân định đâu là khát khao thật, đâu chỉ là mơ hồ.', r: 'Sương mù tan đi, bạn nhìn rõ và dứt khoát chọn điều thực tế. Đây là lúc cam kết thay vì lửng lơ.' },
    { u: 'Bạn rời bỏ điều không còn thỏa mãn để đi tìm ý nghĩa sâu hơn. Đây là một sự ra đi dũng cảm và cần thiết.', r: 'Bạn đang lưỡng lự giữa ở lại hay rời đi, bị nỗi sợ thay đổi níu giữ. Hãy lắng nghe điều trái tim thật sự cần.' },
    { u: 'Sự mãn nguyện và điều ước thành hiện thực — cảm giác "như ý". Hãy tận hưởng và biết ơn những gì mình đạt được.', r: 'Có thể là sự tự mãn hoặc thỏa mãn chỉ ở bề mặt, mong cầu sâu xa chưa trọn. Hãy hỏi lòng mình điều gì mới thật sự khiến bạn đầy.' },
    { u: 'Hạnh phúc viên mãn, gia đình hòa thuận và sự ấm áp lan tỏa. Đây là bức tranh của niềm vui bền vững và tình thân.', r: 'Có bất hòa trong gia đình hoặc một lý tưởng đẹp bị đổ vỡ. Hãy điều chỉnh kỳ vọng và hàn gắn từ những điều nhỏ.' },
    { u: 'Một thông điệp tình cảm, nguồn sáng tạo và tâm hồn mơ mộng đang đến. Hãy mở lòng đón nhận và bày tỏ.', r: 'Cảm xúc còn non nớt hoặc bạn đang né tránh, mơ mộng thiếu thực tế. Hãy chững chạc hơn với cảm xúc của mình.' },
    { u: 'Bạn lãng mạn và đi theo tiếng gọi trái tim, có thể là một lời đề nghị ngọt ngào. Hãy để cảm xúc dẫn đường nhưng vẫn tỉnh táo.', r: 'Sự mơ mộng hão và thất thường khiến lời hứa khó tin. Hãy nhìn vào hành động thực tế thay vì lời nói hoa mỹ.' },
    { u: 'Sự bao dung, thấu cảm và nuôi dưỡng bằng trái tim ấm đang là sức mạnh của bạn. Hãy chăm sóc người khác mà không quên mình.', r: 'Bạn có thể quá nhạy cảm hoặc phụ thuộc cảm xúc, dễ tổn thương. Hãy thiết lập ranh giới lành mạnh.' },
    { u: 'Bạn làm chủ cảm xúc, điềm tĩnh và bao dung trước sóng gió. Đây là sự trưởng thành của trái tim biết tự cân bằng.', r: 'Cảm xúc có thể đang bị kìm nén hoặc dùng để thao túng, khiến bạn ủ rũ. Hãy thành thật và để cảm xúc chảy đúng cách.' }
  ],
  swords: [
    { u: 'Một đột phá trong tư duy: sự thật hiện ra sắc bén và đầu óc minh mẫn. Đây là lúc nói thẳng, nghĩ rõ và cắt bỏ mơ hồ.', r: 'Suy nghĩ rối ren, hiểu lầm hoặc dùng lý trí sai cách. Hãy làm rõ thông tin trước khi kết luận.' },
    { u: 'Bạn đang bế tắc, do dự và né tránh một quyết định khó. Hãy gỡ tấm khăn bịt mắt và dám nhìn vào lựa chọn.', r: 'Bế tắc được tháo gỡ; bạn đối diện và đưa ra quyết định. Sự thật được thừa nhận giúp bạn nhẹ lòng.' },
    { u: 'Một tổn thương, nỗi đau lòng hay chia ly cần được thừa nhận thay vì chối bỏ. Hãy cho phép trái tim được khóc để rồi lành.', r: 'Vết thương dần lành, sự tha thứ và buông bỏ đang đến. Bạn đang hồi phục sau nỗi đau.' },
    { u: 'Đây là lúc nghỉ ngơi, tĩnh dưỡng và hồi phục sau căng thẳng. Hãy cho tâm trí được nghỉ trước khi bước tiếp.', r: 'Sự kiệt sức kéo dài; bạn cần dừng nhưng chưa cho phép mình dừng. Hãy ưu tiên phục hồi trước khi quá muộn.' },
    { u: 'Một cuộc xung đột thắng-thua đang diễn ra, chiến thắng để lại dư vị đắng. Hãy cân nhắc cái giá của việc hơn thua.', r: 'Bạn đang hòa giải, buông hơn thua và hàn gắn bất hòa. Đây là lúc làm lành thay vì tiếp tục đối đầu.' },
    { u: 'Bạn đang chuyển sang vùng nước lặng hơn, rời bỏ khó khăn phía sau. Hành trình này tuy buồn nhưng cần thiết để hồi phục.', r: 'Bạn mắc kẹt hoặc kháng cự thay đổi, khiến hành trình bị hoãn. Hãy can đảm rời đi để tiến về phía trước.' },
    { u: 'Mưu lược và hành động âm thầm có thể giúp bạn đạt mục tiêu; hãy cân nhắc tính chính trực. Đôi khi rút lui khôn ngoan hơn đối đầu.', r: 'Sự thật bị giấu nay lộ ra, hoặc lương tâm cắn rứt. Hãy hành động minh bạch để tránh hậu quả.' },
    { u: 'Bạn cảm thấy bị trói buộc, bất lực — nhưng phần lớn là tự giới hạn. Tháo khăn bịt mắt ra, lối thoát vẫn luôn ở đó.', r: 'Bạn đang nhận ra lối thoát, cởi trói và giải phóng mình. Một giai đoạn tự do và nhẹ nhõm đang mở ra.' },
    { u: 'Lo âu, mất ngủ và nỗi sợ bị phóng đại trong đêm tối. Hãy nhớ phần lớn nỗi sợ chỉ ở trong đầu, không phải thực tại.', r: 'Nỗi sợ dần dịu lại; bạn tìm được hy vọng và sự trợ giúp. Bình minh đang đến sau đêm dài.' },
    { u: 'Một kết thúc đau đớn chạm đáy — nhưng đáy cũng là nơi bắt đầu đi lên. Điều tệ nhất đã qua, bình minh sắp ló dạng.', r: 'Sự hồi sinh và vực dậy sau cùng cực. Bạn đang gượng dậy mạnh mẽ hơn từ đổ vỡ.' },
    { u: 'Sự tò mò, cảnh giác và đầu óc sắc bén thôi thúc bạn đi tìm sự thật. Hãy ham học hỏi nhưng cẩn trọng lời nói.', r: 'Nói nhiều làm ít, hấp tấp hoặc dò xét vụng về. Hãy suy nghĩ kỹ trước khi phát ngôn.' },
    { u: 'Bạn lao tới mục tiêu quyết liệt, hành động chớp nhoáng và đầy tham vọng. Tốc độ là lợi thế nếu đi đúng hướng.', r: 'Sự hung hăng và thiếu suy xét khiến lời nói sắc như dao. Hãy hãm lại và cân nhắc tác động lên người khác.' },
    { u: 'Sự sắc sảo, độc lập và thẳng thắn giúp bạn nhìn thấu vấn đề. Hãy dùng trí tuệ rõ ràng để soi sáng cho mình và người.', r: 'Sự lạnh lùng và cay nghiệt có thể khiến bạn phán xét khắt khe. Hãy thêm chút bao dung vào lý trí.' },
    { u: 'Lý trí công minh và quyền uy của trí tuệ đang ở bên bạn. Hãy ra quyết định dựa trên nguyên tắc và sự công bằng.', r: 'Quyền lực trí tuệ có thể bị lạm dụng, trở nên lạnh lùng và áp đặt. Hãy cân bằng giữa lý lẽ và lòng người.' }
  ],
  pentacles: [
    { u: 'Một cơ hội vật chất mới đang nảy mầm: công việc, tiền bạc hay dự án thịnh vượng. Hãy đặt nền móng vững và nuôi dưỡng nó.', r: 'Cơ hội có thể lỡ làng hoặc kế hoạch tài chính thiếu nền tảng. Hãy chuẩn bị kỹ trước khi khởi sự.' },
    { u: 'Bạn đang khéo léo cân bằng nhiều việc cùng lúc, linh hoạt xoay xở. Hãy giữ nhịp và đừng nhận quá sức.', r: 'Quá tải và mất cân đối khiến bạn chật vật giữ thăng bằng. Hãy ưu tiên và buông bớt việc không thiết yếu.' },
    { u: 'Sự hợp tác, mài giũa kỹ năng và làm việc nhóm đang mang lại kết quả tốt. Hãy trân trọng đóng góp của mỗi người.', r: 'Thiếu phối hợp hoặc làm qua loa khiến chất lượng đi xuống. Hãy thống nhất vai trò và tiêu chuẩn chung.' },
    { u: 'Bạn đang giữ gìn, tích lũy và bám trụ sự an toàn. Một chút ổn định là tốt, nhưng đừng siết quá chặt.', r: 'Sự keo kiệt hoặc bám víu thái quá vì sợ mất mát. Hãy học cách cho đi và nới lỏng kiểm soát.' },
    { u: 'Giai đoạn khó khăn, thiếu thốn về vật chất hoặc tinh thần. Đừng quên rằng vẫn có nơi nương tựa nếu bạn chịu mở lời.', r: 'Bạn đang qua cơn bĩ cực, hồi phục về tài chính và tinh thần. Ánh sáng cuối đường hầm đã hiện.' },
    { u: 'Sự cho và nhận hào phóng, sẻ chia đúng lúc đang diễn ra. Hãy rộng lượng, và cũng biết đón nhận sự giúp đỡ.', r: 'Có sự bất cân trong cho-nhận, nợ nần hoặc lệ thuộc. Hãy thiết lập sự công bằng và ranh giới rõ ràng.' },
    { u: 'Bạn kiên nhẫn vun trồng và đánh giá thành quả trong dài hạn. Hãy tin vào quá trình, mùa gặt sẽ đến.', r: 'Sự sốt ruột hoặc đầu tư kém hiệu quả khiến bạn nản lòng. Hãy xem lại chiến lược thay vì bỏ cuộc giữa chừng.' },
    { u: 'Sự chăm chỉ, tỉ mỉ và rèn nghề đang nâng tầm kỹ năng của bạn. Hãy kiên trì trau dồi, thành thạo sẽ tới.', r: 'Sự cẩu thả hoặc thiếu động lực khiến bạn làm cho có. Hãy tìm lại ý nghĩa trong điều mình làm.' },
    { u: 'Sự tự chủ, sung túc và khả năng tận hưởng thành quả tự thân. Bạn xứng đáng với những gì mình tạo dựng.', r: 'Sự phụ thuộc hoặc phô trương, đánh đổi tự do lấy vật chất. Hãy cân nhắc điều gì mới thật sự khiến bạn giàu có.' },
    { u: 'Của cải bền vững, gia sản và một nền tảng lâu dài đang hình thành. Đây là sự thịnh vượng vững chắc, có thể truyền lại.', r: 'Rủi ro tài chính hoặc mâu thuẫn tiền bạc, thừa kế. Hãy minh bạch và lập kế hoạch dài hạn cẩn thận.' },
    { u: 'Tinh thần ham học, đặt mục tiêu và khởi đầu thực tế. Hãy bắt tay vào học hỏi và lên kế hoạch cụ thể.', r: 'Sự lơ đãng và trì hoãn — mơ mà không bắt tay làm. Hãy biến ý định thành bước đi đầu tiên.' },
    { u: 'Sự cần mẫn, đáng tin và kiên trì từng bước chắc chắn. Tiến chậm mà chắc sẽ đưa bạn tới đích bền vững.', r: 'Sự trì trệ, bảo thủ khiến công việc giậm chân tại chỗ. Hãy làm mới cách tiếp cận để khơi lại đà.' },
    { u: 'Sự chăm lo ấm áp, thực tế và biết vun vén tổ ấm. Bạn nuôi dưỡng người khác bằng cả tấm lòng lẫn sự thiết thực.', r: 'Ôm đồm hoặc bỏ bê bản thân vì lo vật chất quá mức. Hãy dành sự chăm sóc cho chính mình nữa.' },
    { u: 'Sự thành đạt, ổn định và khả năng quản trị tài sản khôn ngoan. Bạn là chỗ dựa vững chắc và hào phóng cho người quanh mình.', r: 'Sự tham lam hoặc bảo thủ, đặt tiền bạc lên trên hết. Hãy nhớ giá trị con người vượt trên của cải.' }
  ]
}
const SUITKEY_BY_VI = { 'Gậy': 'wands', 'Cốc': 'cups', 'Kiếm': 'swords', 'Tiền': 'pentacles' }
TAROT_CARDS.forEach(c => {
  if (c.arcana === 'minor') {
    const t = MINOR_TEXT[SUITKEY_BY_VI[c.suit]] && MINOR_TEXT[SUITKEY_BY_VI[c.suit]][RANK_NUM[c.roman] - 1]
    if (t) { c.up = t.u; c.rev = t.r }
  }
})

/* Lời khuyên ngắn cho 22 Ẩn Chính (distil từ nghĩa RWS đã nêu ở trên) */
const MAJOR_ADVICE = {
  0: 'Hãy can đảm bước bước đầu tiên với tâm hồn rộng mở — nhưng vẫn nhìn đường dưới chân.',
  1: 'Bạn đã có đủ công cụ; biến một ý tưởng thành hành động cụ thể ngay hôm nay.',
  2: 'Tĩnh lại và tin vào trực giác trước khi đi tìm câu trả lời từ bên ngoài.',
  3: 'Nuôi dưỡng bản thân và việc mình yêu; đổ đầy mình trước khi rót cho người khác.',
  4: 'Lập kế hoạch và kỷ luật rõ ràng — vững vàng chứ đừng cứng nhắc.',
  5: 'Học từ người đi trước và giá trị đã kiểm chứng trước khi chọn phá cách.',
  6: 'Chọn theo giá trị thật của bạn, để trái tim và lý trí cùng đồng thuận.',
  7: 'Tập trung ý chí về một hướng và làm chủ cảm xúc để tiến tới.',
  8: 'Dùng sự dịu dàng và kiên nhẫn, không phải vũ lực, để chế ngự khó khăn.',
  9: 'Cho mình một khoảng lặng để soi vào trong và tìm câu trả lời của riêng bạn.',
  10: 'Thuận theo guồng đổi thay; nắm cơ hội khi nó đến và buông khi đã qua.',
  11: 'Hành xử công bằng, nhận trách nhiệm và đối diện sự thật một cách trung thực.',
  12: 'Tạm dừng và đổi góc nhìn; đôi khi buông tay lại là cách tiến lên.',
  13: 'Cho phép cái cũ khép lại để chương mới có chỗ bắt đầu.',
  14: 'Tìm điểm cân bằng, pha trộn vừa phải và kiên nhẫn dung hòa.',
  15: 'Nhìn thẳng vào điều đang trói buộc bạn — chính bạn giữ chìa khóa để tự cởi.',
  16: 'Khi điều giả tạo sụp đổ, hãy để nó đi và xây lại trên nền vững thật hơn.',
  17: 'Giữ hy vọng và cho mình được chữa lành; điều tốt đẹp đang dần trở lại.',
  18: 'Đi chậm qua vùng mơ hồ; phân biệt nỗi sợ tưởng tượng với sự thật.',
  19: 'Hãy lạc quan và sống thật với niềm vui — tỏa sáng và chia sẻ nó.',
  20: 'Lắng nghe tiếng gọi bên trong, tha thứ quá khứ và bước lên một tầng mới.',
  21: 'Ghi nhận thành quả và tận hưởng sự trọn vẹn trước khi mở một vòng mới.'
}
TAROT_CARDS.forEach(c => { if (c.arcana === 'major') c.advice = MAJOR_ADVICE[c.id] })

/* Ý nghĩa theo chủ đề (Tình yêu / Công việc) cho 22 Ẩn Chính — distil từ nghĩa RWS. */
const MAJOR_TOPIC = {
  0: { love: 'Khởi đầu tình cảm mới mẻ — mở lòng, hồn nhiên nhưng đừng nhắm mắt đưa chân.', work: 'Cơ hội/khởi sự mới; dám thử với một kế hoạch tối thiểu.' },
  1: { love: 'Sức hút và chủ động bày tỏ; biến cảm xúc thành hành động cụ thể.', work: 'Bạn có đủ công cụ để bắt đầu — tập trung hiện thực hóa ý tưởng.' },
  2: { love: 'Lắng nghe trực giác, để tình cảm tự hé lộ; chưa nên hối thúc.', work: 'Quan sát, thu thập thông tin và tin linh cảm trước khi quyết.' },
  3: { love: 'Ấm áp, nuôi dưỡng, gắn kết — thời kỳ nở hoa của tình cảm.', work: 'Sáng tạo dồi dào, dự án "đơm hoa"; chăm chút chất lượng.' },
  4: { love: 'Ổn định, đáng tin, có trách nhiệm; tránh kiểm soát đối phương.', work: 'Lập trật tự và kế hoạch rõ ràng; lãnh đạo vững vàng.' },
  5: { love: 'Quan hệ nghiêm túc, cam kết; tìm điểm chung về giá trị.', work: 'Học từ người đi trước, theo quy chuẩn; hợp tác có khuôn khổ.' },
  6: { love: 'Tình yêu, sự hòa hợp và lựa chọn từ trái tim.', work: 'Hợp tác ăn ý, hoặc một quyết định quan trọng theo giá trị thật.' },
  7: { love: 'Kiên định theo đuổi, cùng nhau vượt trở ngại.', work: 'Tập trung mục tiêu, tự chủ; tiến tới bằng ý chí.' },
  8: { love: 'Yêu bằng sự dịu dàng, kiên nhẫn và bao dung.', work: 'Bền bỉ, điềm tĩnh trước áp lực; mềm mỏng mà thắng.' },
  9: { love: 'Cần khoảng riêng để soi lại lòng mình; có thể tạm lùi.', work: 'Làm việc độc lập, tự nghiên cứu; tìm câu trả lời bên trong.' },
  10: { love: 'Bước ngoặt, duyên đến và đi theo chu kỳ; thuận theo.', work: 'Vận may xoay chuyển — nắm cơ hội đúng thời điểm.' },
  11: { love: 'Công bằng, trung thực, cân bằng cho và nhận.', work: 'Quyết định công tâm; hợp đồng/pháp lý cần rõ ràng.' },
  12: { love: 'Tạm dừng, đổi góc nhìn; đôi khi nhường là để hiểu nhau.', work: 'Chờ thời, nhìn khác đi; chưa phải lúc cố ép.' },
  13: { love: 'Một giai đoạn khép lại để mở chương mới; buông cái đã cũ.', work: 'Kết thúc/chuyển đổi tất yếu — làm mới cách làm.' },
  14: { love: 'Hài hòa, dung hòa khác biệt, kiên nhẫn vun đắp.', work: 'Cân bằng và phối hợp nhịp nhàng; tránh thái quá.' },
  15: { love: 'Coi chừng lệ thuộc hay ràng buộc không lành mạnh — nhìn cho rõ.', work: 'Cẩn thận cám dỗ, ràng buộc trói tay; chìa khóa nằm ở bạn.' },
  16: { love: 'Điều giả tạo đổ vỡ để xây lại thật hơn; có thể nhiều biến động.', work: 'Xáo trộn bất ngờ — để cái cũ sụp rồi dựng nền vững hơn.' },
  17: { love: 'Hy vọng, chữa lành, niềm tin trở lại sau giông bão.', work: 'Cảm hứng và triển vọng tươi sáng; cứ kiên trì.' },
  18: { love: 'Mơ hồ, dễ hiểu lầm, cảm xúc lẫn lộn; cần làm rõ.', work: 'Thông tin chưa rõ, coi chừng ảo tưởng; đi chậm và chắc.' },
  19: { love: 'Vui tươi, ấm áp, hạnh phúc rạng rỡ.', work: 'Thành công, được công nhận; năng lượng tích cực.' },
  20: { love: 'Tha thứ, làm lại, một tiếng gọi từ trái tim.', work: 'Bước ngoặt lớn — đánh giá lại và vươn lên tầng mới.' },
  21: { love: 'Trọn vẹn, viên mãn — một chu kỳ tình cảm hoàn thành.', work: 'Hoàn thành mục tiêu, thành tựu; sẵn sàng cho vòng mới.' }
}
TAROT_CARDS.forEach(c => { if (c.arcana === 'major' && MAJOR_TOPIC[c.id]) { c.love = MAJOR_TOPIC[c.id].love; c.work = MAJOR_TOPIC[c.id].work } })

// — Ẩn Phụ: luận Tình yêu / Sự nghiệp CỤ THỂ cho từng lá (biên soạn theo nghĩa truyền thống RWS) —
const MINOR_TOPIC = {
  22: { love: 'Tia lửa hấp dẫn ban đầu, ham muốn mới chớm — dám chủ động bắt chuyện.', work: 'Ý tưởng hoặc dự án mới đầy hứng khởi — thời điểm tốt để khởi sự.' },
  23: { love: 'Cân nhắc bước tiếp trong tình cảm: tiến tới hay giữ khoảng cách an toàn.', work: 'Lên kế hoạch dài hơi, chọn hướng đi; tầm nhìn quan trọng hơn vội vàng.' },
  24: { love: 'Quan hệ bắt đầu có kết quả; chờ tin vui, có thể là chuyện yêu xa.', work: 'Nỗ lực bắt đầu sinh trái; mở rộng, hợp tác, nhìn xa hơn.' },
  25: { love: 'Ổn định, ra mắt, về chung một nhà — một cột mốc đáng ăn mừng.', work: 'Hoàn thành một chặng, ăn mừng thành quả chung; nền móng vững.' },
  26: { love: 'Cãi vặt, ghen tuông, tranh quan điểm — đừng biến khác biệt thành cuộc chiến.', work: 'Cạnh tranh, va chạm ý kiến trong nhóm; giữ bình tĩnh và lắng nghe.' },
  27: { love: 'Được đáp lại; tự tin tỏ lòng hoặc làm hòa trong thế thắng.', work: 'Thành công được công nhận, có thể thăng tiến sau nỗ lực bền bỉ.' },
  28: { love: 'Cần bảo vệ mối quan hệ trước áp lực bên ngoài; giữ vững điều mình tin.', work: 'Giữ vị thế trước cạnh tranh; kiên định bảo vệ thành quả.' },
  29: { love: 'Mọi thứ tăng tốc: tin nhắn, hẹn hò dồn dập, tình cảm tiến nhanh.', work: 'Tiến triển nhanh, tin tức tới dồn dập; bắt nhịp kịp thời.' },
  30: { love: 'Mệt mỏi, phòng thủ vì tổn thương cũ — đừng để quá khứ chắn lối người mới.', work: 'Gần đích nhưng đuối sức; ráng thêm một chút, đừng bỏ cuộc.' },
  31: { love: 'Ôm đồm trách nhiệm khiến tình cảm ngột ngạt; hãy san sẻ bớt gánh nặng.', work: 'Quá tải, làm thay phần người khác; học cách ủy thác và buông bớt.' },
  32: { love: 'Tín hiệu mới đầy hào hứng, một người trẻ trung nhiệt thành; cứ thử khám phá.', work: 'Cảm hứng và ý tưởng mới; dám đề xuất, dám bắt đầu từ việc nhỏ.' },
  33: { love: 'Cuốn hút, nồng nhiệt nhưng dễ bốc đồng — vui mà nhớ giữ chừng mực.', work: 'Lao tới mục tiêu đầy năng lượng; nhớ kiên trì đến cùng.' },
  34: { love: 'Tự tin, rạng rỡ, cuốn hút — cứ là chính mình thì duyên tự đến.', work: 'Bản lĩnh, truyền cảm hứng, làm chủ tình huống.' },
  35: { love: 'Một người dẫn dắt ấm áp, quyết đoán; quan hệ có tầm nhìn chung.', work: 'Lãnh đạo, định hướng, truyền lửa cho tập thể.' },
  36: { love: 'Trái tim mở ra: rung động mới, tình cảm tràn đầy — hãy đón nhận.', work: 'Khởi đầu giàu cảm hứng, công việc chạm tới điều mình yêu thích.' },
  37: { love: 'Kết đôi hài hòa, đồng điệu hai phía — một lá rất đẹp cho tình yêu.', work: 'Hợp tác ăn ý, gặp đối tác hoặc đồng nghiệp hợp gu.' },
  38: { love: 'Niềm vui, bạn bè, tụ họp; tình cảm được vun đắp giữa cộng đồng.', work: 'Làm việc nhóm vui vẻ, cùng ăn mừng một cột mốc.' },
  39: { love: 'Chán nản, hờ hững dễ làm bỏ lỡ người tốt trước mắt — hãy ngẩng lên nhìn lại.', work: 'Mất hứng, thờ ơ; coi chừng bỏ lỡ cơ hội đang có sẵn.' },
  40: { love: 'Tiếc nuối một mất mát tình cảm; vẫn còn điều tốt đẹp bên cạnh để quay về.', work: 'Hụt hẫng vì thất bại; đừng quên những gì còn lại để gây dựng tiếp.' },
  41: { love: 'Hoài niệm ngọt ngào, có thể gặp lại người cũ; sự chân thành thuở ban đầu.', work: 'Quan hệ hay kinh nghiệm cũ giúp ích; sự tử tế giản dị được đền đáp.' },
  42: { love: 'Nhiều lựa chọn mộng mơ, dễ ảo tưởng về đối phương — hãy nhìn cho thực tế.', work: 'Nhiều phương án hấp dẫn nhưng mơ hồ; chọn cái khả thi nhất.' },
  43: { love: 'Rời mối quan hệ không còn thỏa mãn để đi tìm điều sâu sắc hơn.', work: 'Buông công việc đã cạn ý nghĩa, đi tìm hướng đáng giá hơn.' },
  44: { love: 'Mãn nguyện, điều mong ước trong tình cảm thành hiện thực.', work: 'Hài lòng với thành quả, đạt được điều mình mong muốn.' },
  45: { love: 'Hạnh phúc viên mãn, gia đình hòa thuận — đỉnh cao của tình thân.', work: 'Môi trường hài hòa, đồng nghiệp gắn bó như người nhà.' },
  46: { love: 'Một lời ngỏ tình cảm, sự lãng mạn trong trẻo; cứ mở lòng đón nhận.', work: 'Ý tưởng sáng tạo, trực giác mách bảo; thử nuôi dưỡng nó.' },
  47: { love: 'Lãng mạn, đi theo tiếng gọi trái tim — có thể là một lời tỏ tình.', work: 'Theo đuổi công việc bằng đam mê và cảm hứng.' },
  48: { love: 'Bao dung, thấu cảm, nuôi dưỡng bằng trái tim ấm — một tình yêu dịu dàng.', work: 'Đồng cảm, hỗ trợ người khác; hợp việc chăm sóc và sáng tạo.' },
  49: { love: 'Làm chủ cảm xúc, điềm tĩnh và bao dung trước sóng gió tình cảm.', work: 'Cân bằng lý trí và cảm xúc, điềm đạm xử lý căng thẳng.' },
  50: { love: 'Một sự thật được nói rõ; hiểu nhau hơn nhờ sự thẳng thắn.', work: 'Đột phá trong tư duy, ý tưởng sắc bén, quyết định sáng suốt.' },
  51: { love: 'Bế tắc, né tránh một quyết định tình cảm — cần đối diện và nói ra.', work: 'Do dự giữa hai lựa chọn; gỡ tấm bịt mắt để nhìn cho rõ.' },
  52: { love: 'Tổn thương, chia ly hoặc lời làm đau — cho phép mình buồn rồi chữa lành.', work: 'Thất vọng hay bị phê bình gây đau; tìm bài học để bước tiếp.' },
  53: { love: 'Cần một khoảng lặng để nghỉ và hồi phục sau căng thẳng tình cảm.', work: 'Tạm dừng, dưỡng sức trước khi bước tiếp; nghỉ ngơi là cần thiết.' },
  54: { love: 'Cãi vã hơn-thua để lại dư vị đắng; thắng lý mà có thể thua tình.', work: 'Xung đột, cạnh tranh thiếu lành mạnh; cân nhắc cái giá của hơn thua.' },
  55: { love: 'Rời vùng sóng gió, tình cảm dần lặng lại sau giai đoạn khó khăn.', work: 'Chuyển sang môi trường êm hơn; tiến dần tới giải pháp ổn định.' },
  56: { love: 'Cẩn trọng với giấu giếm, thiếu thành thật — minh bạch để tin nhau.', work: 'Chiến thuật khôn khéo, nhưng tránh đi đường tắt mờ ám.' },
  57: { love: 'Cảm giác mắc kẹt trong quan hệ phần lớn do tự trói — bạn có nhiều lựa chọn hơn mình nghĩ.', work: 'Thấy bí bách nhưng rào cản chủ yếu nằm trong suy nghĩ; thử một bước nhỏ ra ngoài.' },
  58: { love: 'Lo âu, hoang mang bị thổi phồng trong đêm; ban ngày thường nhẹ hơn ta tưởng.', work: 'Căng thẳng vì lo nghĩ; chia nhỏ vấn đề, đừng gánh một mình.' },
  59: { love: 'Một kết thúc đau nhưng dứt khoát — chạm đáy rồi sẽ là khởi đầu mới.', work: 'Một chương khép lại; buông để bắt đầu lại nhẹ nhõm hơn.' },
  60: { love: 'Tò mò, hay dò xét và nói thẳng; cảnh giác vừa phải kẻo hóa nghi ngờ.', work: 'Đầu óc sắc bén, ham tìm hiểu; hợp việc học hỏi và thu thập thông tin.' },
  61: { love: 'Quyết liệt, nói nhanh làm nhanh — nhớ tiết chế những lời sắc.', work: 'Lao tới mục tiêu chớp nhoáng; nhớ cân nhắc hệ quả.' },
  62: { love: 'Sắc sảo, độc lập, thẳng thắn; cần người hiểu sự rạch ròi của bạn.', work: 'Nhìn thấu vấn đề, ra quyết định công tâm và rõ ràng.' },
  63: { love: 'Lý trí và công bằng dẫn dắt; giao tiếp minh bạch giữ quan hệ bền.', work: 'Quyết định bằng lý trí, nguyên tắc và sự công minh.' },
  64: { love: 'Nền tảng vững cho một quan hệ thực tế, đáng tin; khởi đầu chắc chắn.', work: 'Cơ hội mới về việc làm hoặc tiền bạc đang nảy mầm; hãy nắm lấy.' },
  65: { love: 'Khéo cân bằng tình cảm với các việc khác; linh hoạt, đừng để quá tải.', work: 'Tung hứng nhiều việc cùng lúc; linh hoạt nhưng giữ thứ tự ưu tiên.' },
  66: { love: 'Xây đắp quan hệ bằng hợp tác, cùng vun vén; lắng nghe góp ý của nhau.', work: 'Làm việc nhóm, mài giũa kỹ năng, được ghi nhận.' },
  67: { love: 'Giữ gìn, có phần khư khư hoặc sợ tổn thương — hãy mở lòng hơn một chút.', work: 'Tích lũy, bám sự an toàn; coi chừng quá dè dặt mà bỏ lỡ.' },
  68: { love: 'Giai đoạn thiếu thốn, thấy lạc lõng; đừng ngại tìm tới sự nâng đỡ ở gần.', work: 'Khó khăn vật chất tạm thời; giúp đỡ vẫn ở quanh, đừng tự cô lập.' },
  69: { love: 'Cho và nhận cân bằng, sẻ chia đúng lúc; giữ sự công bằng giữa hai người.', work: 'Được hỗ trợ hoặc đãi ngộ xứng đáng, hoặc bạn giúp lại người khác.' },
  70: { love: 'Kiên nhẫn vun trồng, chờ tình cảm chín; nhìn lại điều mình đã đầu tư.', work: 'Gặt hái dài hạn; dừng lại xem thành quả rồi điều chỉnh.' },
  71: { love: 'Chăm chút mối quan hệ tỉ mỉ mỗi ngày; sự bền bỉ tạo nên gắn bó.', work: 'Rèn nghề, chăm chỉ, nâng tay nghề; nỗ lực rồi sẽ được đền.' },
  72: { love: 'Tự chủ và đủ đầy một mình trước đã; người phù hợp sẽ tới khi bạn an.', work: 'Hưởng thành quả tự gây dựng, độc lập và sung túc.' },
  73: { love: 'Bền vững, tính chuyện lâu dài, gia đình; nền tảng ổn định cho cả hai.', work: 'Của cải bền, di sản, một nền tảng dài lâu được thiết lập.' },
  74: { love: 'Nghiêm túc tìm hiểu, đặt mục tiêu rõ ràng; bước chậm mà chắc.', work: 'Ham học, lập mục tiêu thực tế, khởi đầu vững vàng.' },
  75: { love: 'Cần mẫn, đáng tin, có phần chậm rãi; sự ổn định là điểm cộng lớn.', work: 'Kiên trì từng bước chắc chắn, đáng tin, làm tới nơi tới chốn.' },
  76: { love: 'Ấm áp, chăm lo thực tế, biết vun vén tổ ấm; một tình yêu nuôi dưỡng.', work: 'Quán xuyến khéo léo, cân bằng việc và nhà, lo cho người khác.' },
  77: { love: 'Vững vàng, hào phóng, đáng để dựa vào; quan hệ an toàn cả vật chất lẫn tinh thần.', work: 'Thành đạt, quản trị tài sản khôn ngoan, dẫn dắt ổn định.' }
}
TAROT_CARDS.forEach(c => { if (MINOR_TOPIC[c.id]) { c.love = MINOR_TOPIC[c.id].love; c.work = MINOR_TOPIC[c.id].work } })


// — Ẩn Chính: tương ứng chiêm tinh + nguyên tố (hệ Golden Dawn — dữ kiện tham chiếu) —
const MAJOR_ASTRO = {
  0: 'Thiên Vương tinh (Uranus) · nguyên tố Khí',
  1: 'Thủy tinh (Mercury) · nguyên tố Khí',
  2: 'Mặt Trăng (Moon) · nguyên tố Nước',
  3: 'Kim tinh (Venus) · nguyên tố Đất',
  4: 'Bạch Dương (Aries) · nguyên tố Lửa',
  5: 'Kim Ngưu (Taurus) · nguyên tố Đất',
  6: 'Song Tử (Gemini) · nguyên tố Khí',
  7: 'Cự Giải (Cancer) · nguyên tố Nước',
  8: 'Sư Tử (Leo) · nguyên tố Lửa',
  9: 'Xử Nữ (Virgo) · nguyên tố Đất',
  10: 'Mộc tinh (Jupiter) · nguyên tố Lửa',
  11: 'Thiên Bình (Libra) · nguyên tố Khí',
  12: 'Hải Vương tinh (Neptune) · nguyên tố Nước',
  13: 'Hổ Cáp (Scorpio) · nguyên tố Nước',
  14: 'Nhân Mã (Sagittarius) · nguyên tố Lửa',
  15: 'Ma Kết (Capricorn) · nguyên tố Đất',
  16: 'Hỏa tinh (Mars) · nguyên tố Lửa',
  17: 'Bảo Bình (Aquarius) · nguyên tố Khí',
  18: 'Song Ngư (Pisces) · nguyên tố Nước',
  19: 'Mặt Trời (Sun) · nguyên tố Lửa',
  20: 'Diêm Vương tinh (Pluto) · nguyên tố Lửa',
  21: 'Thổ tinh (Saturn) · nguyên tố Đất'
}
TAROT_CARDS.forEach(c => { if (c.arcana === 'major' && MAJOR_ASTRO[c.id]) c.astro = MAJOR_ASTRO[c.id] })


// — Ẩn Phụ (Ách + pip 2–10): decan chiêm tinh Golden Dawn (hành tinh trong cung) —
const MINOR_ASTRO = {
  'Gậy Át': 'Gốc nguyên tố Lửa', 'Cốc Át': 'Gốc nguyên tố Nước', 'Kiếm Át': 'Gốc nguyên tố Khí', 'Tiền Át': 'Gốc nguyên tố Đất',
  'Gậy 2': 'Hỏa tinh (Mars) trong Bạch Dương', 'Gậy 3': 'Mặt Trời (Sun) trong Bạch Dương', 'Gậy 4': 'Kim tinh (Venus) trong Bạch Dương',
  'Gậy 5': 'Thổ tinh (Saturn) trong Sư Tử', 'Gậy 6': 'Mộc tinh (Jupiter) trong Sư Tử', 'Gậy 7': 'Hỏa tinh (Mars) trong Sư Tử',
  'Gậy 8': 'Thủy tinh (Mercury) trong Nhân Mã', 'Gậy 9': 'Mặt Trăng (Moon) trong Nhân Mã', 'Gậy 10': 'Thổ tinh (Saturn) trong Nhân Mã',
  'Cốc 2': 'Kim tinh (Venus) trong Cự Giải', 'Cốc 3': 'Thủy tinh (Mercury) trong Cự Giải', 'Cốc 4': 'Mặt Trăng (Moon) trong Cự Giải',
  'Cốc 5': 'Hỏa tinh (Mars) trong Bọ Cạp', 'Cốc 6': 'Mặt Trời (Sun) trong Bọ Cạp', 'Cốc 7': 'Kim tinh (Venus) trong Bọ Cạp',
  'Cốc 8': 'Thổ tinh (Saturn) trong Song Ngư', 'Cốc 9': 'Mộc tinh (Jupiter) trong Song Ngư', 'Cốc 10': 'Hỏa tinh (Mars) trong Song Ngư',
  'Kiếm 2': 'Mặt Trăng (Moon) trong Thiên Bình', 'Kiếm 3': 'Thổ tinh (Saturn) trong Thiên Bình', 'Kiếm 4': 'Mộc tinh (Jupiter) trong Thiên Bình',
  'Kiếm 5': 'Kim tinh (Venus) trong Bảo Bình', 'Kiếm 6': 'Thủy tinh (Mercury) trong Bảo Bình', 'Kiếm 7': 'Mặt Trăng (Moon) trong Bảo Bình',
  'Kiếm 8': 'Mộc tinh (Jupiter) trong Song Tử', 'Kiếm 9': 'Hỏa tinh (Mars) trong Song Tử', 'Kiếm 10': 'Mặt Trời (Sun) trong Song Tử',
  'Tiền 2': 'Mộc tinh (Jupiter) trong Ma Kết', 'Tiền 3': 'Hỏa tinh (Mars) trong Ma Kết', 'Tiền 4': 'Mặt Trời (Sun) trong Ma Kết',
  'Tiền 5': 'Thủy tinh (Mercury) trong Kim Ngưu', 'Tiền 6': 'Mặt Trăng (Moon) trong Kim Ngưu', 'Tiền 7': 'Thổ tinh (Saturn) trong Kim Ngưu',
  'Tiền 8': 'Mặt Trời (Sun) trong Xử Nữ', 'Tiền 9': 'Kim tinh (Venus) trong Xử Nữ', 'Tiền 10': 'Thủy tinh (Mercury) trong Xử Nữ'
}
TAROT_CARDS.forEach(c => { if (c.arcana !== 'major') { const k = MINOR_ASTRO[c.suit + ' ' + c.roman]; if (k) c.astro = k } })

/* Lá Tarot chủ đạo theo ngày sinh (rút gọn tổng ngày+tháng+năm về Ẩn Chính). */
export function birthCards(d, m, y) {
  const sd = n => String(n).split('').reduce((a, b) => a + +b, 0)
  let t = d + m + y; while (t > 21) t = sd(t)
  let t2 = t; while (t2 > 9) t2 = sd(t2)
  const c1 = TAROT_CARDS.find(c => c.arcana === 'major' && c.id === t)
  const c2 = TAROT_CARDS.find(c => c.arcana === 'major' && c.id === t2)
  return t === t2 ? [c1] : [c1, c2]
}
