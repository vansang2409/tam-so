/* DỮ LIỆU TAROT — đủ 78 lá (22 Ẩn Chính + 56 Ẩn Phụ).
 * Từ khóa tham khảo truyền thống Rider–Waite–Smith / Labyrinthos.
 * Nội dung chiêm nghiệm/giải trí — không phải khoa học. */

const MAJOR = [
  { id:0, arcana:'major', roman:'0', symbol:'🎒', name:'The Fool', nameVi:'Gã Khờ',
    upKeys:['khởi đầu mới','ngây thơ','tự do'], revKeys:['liều lĩnh','thiếu cân nhắc'],
    up:'Một chương mới mở ra. Bước đi cởi mở, tin vào hành trình dù chưa thấy hết đường.',
    rev:'Có thể bạn đang hấp tấp hoặc bỏ qua rủi ro. Dừng một nhịp để cân nhắc.' },
  { id:1, arcana:'major', roman:'I', symbol:'🪄', name:'The Magician', nameVi:'Nhà Ảo Thuật',
    upKeys:['ý chí','sáng tạo','hiện thực hóa'], revKeys:['thao túng','ảo tưởng'],
    up:'Bạn có đủ công cụ để biến ý tưởng thành hiện thực. Tập trung ý chí vào mục tiêu.',
    rev:'Coi chừng mánh khóe, lời hứa suông hoặc tiềm năng bị lãng phí.' },
  { id:2, arcana:'major', roman:'II', symbol:'🌙', name:'The High Priestess', nameVi:'Nữ Tư Tế',
    upKeys:['trực giác','tiềm thức','bí ẩn'], revKeys:['phớt lờ trực giác','kìm nén'],
    up:'Lắng nghe trực giác và điều chưa nói thành lời. Câu trả lời ở bên trong.',
    rev:'Bạn đang ngắt kết nối với tiếng nói nội tâm. Hãy tĩnh lại để nghe rõ.' },
  { id:3, arcana:'major', roman:'III', symbol:'🌹', name:'The Empress', nameVi:'Nữ Hoàng',
    upKeys:['nuôi dưỡng','phồn thịnh','thiên nhiên'], revKeys:['phụ thuộc','trống rỗng'],
    up:'Thời kỳ sinh sôi, chăm sóc và tận hưởng. Dồi dào khi bạn nuôi dưỡng bản thân và người khác.',
    rev:'Có thể bạn cho đi quá mức đến cạn kiệt. Hãy cân bằng lại.' },
  { id:4, arcana:'major', roman:'IV', symbol:'🏛️', name:'The Emperor', nameVi:'Hoàng Đế',
    upKeys:['quyền uy','cấu trúc','kỷ luật'], revKeys:['độc đoán','cứng nhắc'],
    up:'Trật tự và lãnh đạo vững vàng mang lại kết quả. Thiết lập nền tảng rõ ràng.',
    rev:'Sự kiểm soát trở nên cứng nhắc hoặc lạm quyền. Mềm dẻo sẽ hiệu quả hơn.' },
  { id:5, arcana:'major', roman:'V', symbol:'🗝️', name:'The Hierophant', nameVi:'Giáo Hoàng',
    upKeys:['truyền thống','chuẩn mực','dẫn dắt'], revKeys:['nổi loạn','phá cách'],
    up:'Học hỏi từ truyền thống, người thầy hoặc thể chế đáng tin.',
    rev:'Bạn muốn đi ra ngoài khuôn mẫu. Phá cách đôi khi cần thiết — nếu có chủ đích.' },
  { id:6, arcana:'major', roman:'VI', symbol:'💞', name:'The Lovers', nameVi:'Tình Nhân',
    upKeys:['gắn kết','lựa chọn','hòa hợp'], revKeys:['mất cân bằng','bất hòa'],
    up:'Một mối quan hệ sâu sắc hoặc lựa chọn quan trọng dựa trên giá trị thật.',
    rev:'Bất hòa hoặc một quyết định đi ngược lòng mình. Xác định lại điều quan trọng.' },
  { id:7, arcana:'major', roman:'VII', symbol:'🐎', name:'The Chariot', nameVi:'Cỗ Xe',
    upKeys:['định hướng','ý chí','chiến thắng'], revKeys:['mất kiểm soát','lạc hướng'],
    up:'Quyết tâm và kỷ luật đưa bạn tới đích. Giữ vững tay lái.',
    rev:'Mất phương hướng hoặc để cảm xúc lấn át. Lấy lại mục tiêu và tự chủ.' },
  { id:8, arcana:'major', roman:'VIII', symbol:'🦁', name:'Strength', nameVi:'Sức Mạnh',
    upKeys:['nội lực','can đảm','trắc ẩn'], revKeys:['hoài nghi bản thân','bất an'],
    up:'Sức mạnh thật đến từ sự dịu dàng và làm chủ bản thân, không phải vũ lực.',
    rev:'Tự nghi ngờ đang bào mòn bạn. Hãy tử tế với chính mình.' },
  { id:9, arcana:'major', roman:'IX', symbol:'🏮', name:'The Hermit', nameVi:'Ẩn Sĩ',
    upKeys:['chiêm nghiệm','tìm sự thật','nội tâm'], revKeys:['cô lập','lạc lối'],
    up:'Thời điểm lùi lại, tĩnh lặng và lắng nghe bản thân. Ánh sáng ở bên trong.',
    rev:'Sự đơn độc chuyển thành cô lập. Cân nhắc kết nối lại.' },
  { id:10, arcana:'major', roman:'X', symbol:'🎡', name:'Wheel of Fortune', nameVi:'Bánh Xe Số Phận',
    upKeys:['thay đổi','chu kỳ','bước ngoặt'], revKeys:['mất kiểm soát','vận xui'],
    up:'Vòng quay cuộc đời đang chuyển. Đón nhận thay đổi như phần tất yếu của chu kỳ.',
    rev:'Cảm giác mọi thứ ngoài tầm kiểm soát. Buông bớt kỳ vọng cứng nhắc.' },
  { id:11, arcana:'major', roman:'XI', symbol:'⚖️', name:'Justice', nameVi:'Công Lý',
    upKeys:['nhân quả','sự thật','công bằng'], revKeys:['bất công','dối trá'],
    up:'Sự thật và lẽ công bằng hiện rõ. Mỗi lựa chọn đều có hệ quả — hãy ngay thẳng.',
    rev:'Có sự thiếu trung thực hoặc trốn tránh trách nhiệm. Đối diện sự thật.' },
  { id:12, arcana:'major', roman:'XII', symbol:'🙃', name:'The Hanged Man', nameVi:'Người Treo Ngược',
    upKeys:['buông bỏ','đổi góc nhìn','tạm dừng'], revKeys:['trì hoãn','kháng cự'],
    up:'Đổi góc nhìn và chấp nhận tạm dừng. Đôi khi đứng yên là cách tiến lên.',
    rev:'Bạn đang chống lại điều cần buông. Xem lại điều gì đáng giữ.' },
  { id:13, arcana:'major', roman:'XIII', symbol:'💀', name:'Death', nameVi:'Cái Chết',
    upKeys:['kết thúc chu kỳ','chuyển hóa','tái sinh'], revKeys:['sợ thay đổi','trì trệ'],
    up:'Một giai đoạn khép lại để cái mới sinh ra. Là chuyển hóa, hiếm khi nghĩa đen.',
    rev:'Bạn níu giữ điều đã hết hạn. Sợ thay đổi khiến mọi thứ trì trệ.' },
  { id:14, arcana:'major', roman:'XIV', symbol:'⚗️', name:'Temperance', nameVi:'Tiết Độ',
    upKeys:['cân bằng','kiên nhẫn','trung dung'], revKeys:['thái quá','nóng vội'],
    up:'Điều hòa và trung dung mang lại bình an. Pha trộn đúng liều giữa các thái cực.',
    rev:'Thái quá hoặc nóng vội đang phá vỡ cân bằng. Chậm lại và điều tiết.' },
  { id:15, arcana:'major', roman:'XV', symbol:'😈', name:'The Devil', nameVi:'Ác Quỷ',
    upKeys:['ràng buộc','cám dỗ','lệ thuộc'], revKeys:['giải phóng','lấy lại tự chủ'],
    up:'Một lệ thuộc, thói quen hay cám dỗ đang trói buộc bạn — thường là xiềng tự nguyện.',
    rev:'Bạn đang nhận ra và cắt bỏ ràng buộc. Tự do khi lấy lại quyền làm chủ.' },
  { id:16, arcana:'major', roman:'XVI', symbol:'🗼', name:'The Tower', nameVi:'Tòa Tháp',
    upKeys:['biến động đột ngột','sụp đổ','vỡ lẽ'], revKeys:['tránh tai họa','sợ đổ vỡ'],
    up:'Một cú chấn động làm lung lay nền tảng cũ — dọn chỗ cho sự thật và khởi đầu vững hơn.',
    rev:'Bạn có thể đang né một đổ vỡ cần thiết, hoặc sợ điều chưa xảy ra.' },
  { id:17, arcana:'major', roman:'XVII', symbol:'⭐', name:'The Star', nameVi:'Ngôi Sao',
    upKeys:['hy vọng','niềm tin','chữa lành'], revKeys:['mất niềm tin','nản lòng'],
    up:'Sau giông bão là hy vọng và chữa lành. Giữ niềm tin và để mình phục hồi.',
    rev:'Cảm giác nản lòng. Niềm tin cần được nuôi lại từ những điều nhỏ.' },
  { id:18, arcana:'major', roman:'XVIII', symbol:'🌕', name:'The Moon', nameVi:'Mặt Trăng',
    upKeys:['ảo ảnh','trực giác','mơ hồ'], revKeys:['bối rối','hiểu lầm'],
    up:'Mọi thứ chưa rõ; ảo ảnh và nỗi sợ có thể đánh lừa. Tin trực giác, đi từng bước.',
    rev:'Sương mù đang tan, hiểu lầm dần sáng tỏ.' },
  { id:19, arcana:'major', roman:'XIX', symbol:'☀️', name:'The Sun', nameVi:'Mặt Trời',
    upKeys:['niềm vui','thành công','sức sống'], revKeys:['u ám tạm thời','thiếu lạc quan'],
    up:'Lá bài rạng rỡ nhất: niềm vui, thành công và sự rõ ràng. Hãy tận hưởng.',
    rev:'Niềm vui bị che mờ tạm thời. Ánh sáng vẫn ở đó, chỉ cần thời gian.' },
  { id:20, arcana:'major', roman:'XX', symbol:'📯', name:'Judgement', nameVi:'Phán Xét',
    upKeys:['thức tỉnh','đánh giá lại','tha thứ'], revKeys:['hoài nghi','tự trách'],
    up:'Một lời thức tỉnh: nhìn lại quá khứ, tha thứ và bước sang chương mới.',
    rev:'Bạn đang khó tha thứ cho mình. Hãy bao dung với bản thân.' },
  { id:21, arcana:'major', roman:'XXI', symbol:'🌍', name:'The World', nameVi:'Thế Giới',
    upKeys:['hoàn thành','viên mãn','trọn vẹn'], revKeys:['dang dở','chưa khép lại'],
    up:'Một chu kỳ hoàn tất trong viên mãn. Bạn sẵn sàng cho vòng đời mới.',
    rev:'Còn điều dang dở cần khép lại trước khi sang chặng tiếp theo.' }
]

/* ----- 56 lá Ẩn Phụ (Minor Arcana) ----- */
const SUITS = [
  { key:'wands', vi:'Gậy', en:'Wands', sym:'🔥', el:'Lửa' },
  { key:'cups', vi:'Cốc', en:'Cups', sym:'🍷', el:'Nước' },
  { key:'swords', vi:'Kiếm', en:'Swords', sym:'⚔️', el:'Khí' },
  { key:'pentacles', vi:'Tiền', en:'Pentacles', sym:'🪙', el:'Đất' }
]
const RANK_VI = ['Át','2','3','4','5','6','7','8','9','10','Thị Đồng','Hiệp Sĩ','Nữ Hoàng','Vua']
const RANK_EN = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King']

/* mỗi phần tử: [từ khóa xuôi, từ khóa ngược] cho 14 lá của một chất */
const MINOR_KW = {
  wands: [
    ['cảm hứng, khởi đầu','trì hoãn, thiếu định hướng'],
    ['lên kế hoạch, tầm nhìn','do dự, kế hoạch dở'],
    ['mở rộng, tiến triển','chậm trễ, trở ngại'],
    ['ăn mừng, mái ấm','bất ổn, chuyển tiếp'],
    ['cạnh tranh, bất đồng','tránh né, hòa giải'],
    ['chiến thắng, được công nhận','thất bại, thiếu công nhận'],
    ['kiên định, thách thức','kiệt sức, buông xuôi'],
    ['chuyển động nhanh, tin tức','chậm trễ, hỗn loạn'],
    ['kiên cường, đề phòng','kiệt sức, cố chấp'],
    ['gánh nặng, trách nhiệm','quá tải, buông bớt'],
    ['khám phá, ý tưởng mới','bốc đồng, thiếu định hướng'],
    ['hành động, phiêu lưu','nóng vội, thiếu kiên nhẫn'],
    ['tự tin, lôi cuốn','ghen tị, thiếu tự tin'],
    ['tầm nhìn, lãnh đạo','độc đoán, hấp tấp']
  ],
  cups: [
    ['tình cảm mới, trực giác','cảm xúc dồn nén, trống rỗng'],
    ['kết đôi, hòa hợp','bất hòa, mất cân bằng'],
    ['tình bạn, ăn mừng','rạn nứt nhóm, thừa thãi'],
    ['chán nản, suy ngẫm','tỉnh thức, nắm cơ hội'],
    ['mất mát, tiếc nuối','chấp nhận, hồi phục'],
    ['hoài niệm, ký ức','mắc kẹt quá khứ'],
    ['lựa chọn, mộng tưởng','rõ ràng, quyết định'],
    ['rời bỏ, tìm điều sâu xa','lưỡng lự, sợ thay đổi'],
    ['mãn nguyện, ước nguyện','tự mãn, chưa thỏa'],
    ['hạnh phúc viên mãn','bất hòa gia đình'],
    ['thông điệp tình cảm, mơ mộng','cảm xúc non nớt, né tránh'],
    ['lãng mạn, theo trái tim','mơ mộng hão, thất thường'],
    ['từ bi, thấu cảm','phụ thuộc cảm xúc, quá nhạy'],
    ['cân bằng cảm xúc, bao dung','ủ rũ, thao túng cảm xúc']
  ],
  swords: [
    ['đột phá, sáng suốt','hỗn loạn ý nghĩ, hiểu lầm'],
    ['bế tắc, do dự','quyết định, gỡ bế tắc'],
    ['tổn thương, chia ly','chữa lành, tha thứ'],
    ['nghỉ ngơi, tĩnh tâm','kiệt sức, trì trệ'],
    ['xung đột, bất hòa','hòa giải, buông hận'],
    ['chuyển tiếp, rời đi','mắc kẹt, kháng cự'],
    ['mưu mẹo, chiến lược','thú nhận, lương tâm'],
    ['trói buộc, tự giới hạn','giải thoát, tìm lối ra'],
    ['lo âu, dằn vặt','hy vọng, vượt nỗi sợ'],
    ['kết thúc đau đớn','hồi sinh, vực dậy'],
    ['tò mò, cảnh giác','nói suông, hấp tấp'],
    ['quyết liệt, hành động nhanh','hung hăng, thiếu suy xét'],
    ['sắc sảo, thẳng thắn','lạnh lùng, cay nghiệt'],
    ['lý trí, công minh','lạm quyền, lạnh lùng']
  ],
  pentacles: [
    ['cơ hội mới, thịnh vượng','cơ hội lỡ, thiếu nền tảng'],
    ['cân bằng, linh hoạt','quá tải, mất cân đối'],
    ['hợp tác, kỹ năng','thiếu phối hợp, qua loa'],
    ['an toàn, kiểm soát','keo kiệt, bám víu'],
    ['khó khăn, thiếu thốn','hồi phục, qua cơn bĩ'],
    ['cho-nhận, hào phóng','bất cân, nợ nần'],
    ['kiên nhẫn, đầu tư dài hạn','sốt ruột, đầu tư kém'],
    ['chăm chỉ, rèn nghề','cẩu thả, thiếu động lực'],
    ['tự chủ, sung túc','lệ thuộc, phô trương'],
    ['của cải, bền vững','rủi ro tài chính'],
    ['ham học, mục tiêu','lơ đãng, trì hoãn'],
    ['cần mẫn, đáng tin','trì trệ, bảo thủ'],
    ['chăm lo, thực tế','ôm đồm, bỏ bê bản thân'],
    ['thành đạt, ổn định','tham lam, bảo thủ']
  ]
}

function buildMinor() {
  const out = []
  let id = 22
  for (const s of SUITS) {
    MINOR_KW[s.key].forEach((kw, i) => {
      out.push({
        id: id++, arcana: 'minor', suit: s.vi, element: s.el,
        roman: RANK_VI[i], symbol: s.sym,
        name: RANK_EN[i] + ' of ' + s.en,
        nameVi: RANK_VI[i] + ' ' + s.vi,
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

/** Lá bài hôm nay — tất định theo ngày (cùng một ngày luôn ra cùng lá) */
export function cardOfDay(date = new Date()) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const idx = seed % TAROT_CARDS.length
  const up = Math.floor(seed / TAROT_CARDS.length) % 2 === 0
  return { card: TAROT_CARDS[idx], up }
}
