/* TỬ VI ĐẨU SỐ — an sao lá số 12 cung.
 * PHẦN AN SAO là thuật toán cổ điển (kiểm chứng được, tất định) — KHÔNG phải dự đoán.
 * Nguồn thuật toán đã đối chiếu: tracuutuvi.com (Gia Cát Trường Phong), tuvisaigon.vn,
 * hocvienlyso.org — các quy tắc an Mệnh/Thân, định Cục, an Tử Vi, chùm Tử Vi/Thiên Phủ,
 * Tứ Hóa, lục cát/lục sát đều khớp giữa nhiều nguồn.
 * PHẦN Ý NGHĨA sao/cung là diễn giải truyền thống — tham khảo, tự biên soạn, không sao chép.
 * Chỉ số chi: 0=Tý … 11=Hợi (khớp DIA_CHI trong tuvi.js). */
import { THIEN_CAN, DIA_CHI, tinhCanChi } from './tuvi.js'

const mod = (n, m) => ((n % m) + m) % m
const CHI = DIA_CHI.map(c => c.ten)            // ['Tý',...,'Hợi']
const CAN = THIEN_CAN.map(c => c.ten)          // ['Giáp',...,'Quý']

/* Giờ đồng hồ (0–23) -> thứ hạng chi giờ (1=Tý … 12=Hợi). Tý = 23h–1h. */
export function hourToRank(h) { return (Math.floor((h + 1) / 2) % 12) + 1 }
export const GIO_CHI = CHI

/* 12 cung chức, thứ tự THUẬN từ Mệnh (đã đối chiếu bài thơ an Thân) */
const CUNG = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
  'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ']

/* Bảng Cục: hàng = Can năm (mod 5: Giáp/Kỷ, Ất/Canh, Bính/Tân, Đinh/Nhâm, Mậu/Quý),
 * cột = floor(chi cung Mệnh / 2): Tý-Sửu, Dần-Mão, Thìn-Tỵ, Ngọ-Mùi, Thân-Dậu, Tuất-Hợi */
const CUC_TABLE = [
  [2, 6, 3, 5, 4, 6], // Giáp/Kỷ
  [6, 5, 4, 3, 2, 5], // Ất/Canh
  [5, 3, 2, 4, 6, 3], // Bính/Tân
  [3, 4, 6, 2, 5, 4], // Đinh/Nhâm
  [4, 2, 5, 6, 3, 2]  // Mậu/Quý
]
const CUC_TEN = { 2: 'Thủy nhị cục', 3: 'Mộc tam cục', 4: 'Kim tứ cục', 5: 'Thổ ngũ cục', 6: 'Hỏa lục cục' }
const CUC_HANH = { 2: 'Thủy', 3: 'Mộc', 4: 'Kim', 5: 'Thổ', 6: 'Hỏa' }

/* Vị trí cố định theo Can (chỉ số chi) */
const LOC_TON = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]        // Giáp..Quý
const THIEN_KHOI = [1, 0, 11, 11, 1, 0, 6, 6, 3, 3]
const THIEN_VIET = [7, 8, 9, 9, 7, 8, 2, 2, 5, 5]

/* Tứ Hóa theo Can năm: tên chính tinh nhận hóa */
const TU_HOA = [
  { Lộc: 'Liêm Trinh', Quyền: 'Phá Quân', Khoa: 'Vũ Khúc', Kỵ: 'Thái Dương' }, // Giáp
  { Lộc: 'Thiên Cơ', Quyền: 'Thiên Lương', Khoa: 'Tử Vi', Kỵ: 'Thái Âm' },     // Ất
  { Lộc: 'Thiên Đồng', Quyền: 'Thiên Cơ', Khoa: 'Văn Xương', Kỵ: 'Liêm Trinh' },// Bính
  { Lộc: 'Thái Âm', Quyền: 'Thiên Đồng', Khoa: 'Thiên Cơ', Kỵ: 'Cự Môn' },     // Đinh
  { Lộc: 'Tham Lang', Quyền: 'Thái Âm', Khoa: 'Thái Dương', Kỵ: 'Thiên Cơ' },  // Mậu
  { Lộc: 'Vũ Khúc', Quyền: 'Tham Lang', Khoa: 'Thiên Lương', Kỵ: 'Văn Khúc' }, // Kỷ
  { Lộc: 'Thái Dương', Quyền: 'Vũ Khúc', Khoa: 'Thiên Đồng', Kỵ: 'Thiên Tướng' },// Canh
  { Lộc: 'Cự Môn', Quyền: 'Thái Dương', Khoa: 'Văn Khúc', Kỵ: 'Văn Xương' },   // Tân
  { Lộc: 'Thiên Lương', Quyền: 'Tử Vi', Khoa: 'Tả Phù', Kỵ: 'Vũ Khúc' },       // Nhâm
  { Lộc: 'Phá Quân', Quyền: 'Cự Môn', Khoa: 'Thái Âm', Kỵ: 'Tham Lang' }       // Quý
]

const TAM_HOP_OF = chi => {
  // nhóm tam hợp của 1 chi -> trả "khóa" để tra Hỏa/Linh/Mã/Đào...
  if ([2, 6, 10].includes(chi)) return 'DAN_NGO_TUAT'
  if ([8, 0, 4].includes(chi)) return 'THAN_TY_THIN'
  if ([5, 9, 1].includes(chi)) return 'TY_DAU_SUU'
  return 'HOI_MAO_MUI' // 11,3,7
}

/** An sao lá số. d,m,y = ngày/tháng/năm DƯƠNG; giải mã sang âm lịch bên trong.
 * hourRank 1..12 (1=Tý). gender 'nam'|'nu'. solar2lunar truyền từ ngoài để tránh vòng import. */
export function anSao({ lunarDay, lunarMonth, year, hourRank, gender }) {
  const yc = tinhCanChi(year)
  const canIdx = CAN.indexOf(yc.can)
  const chiIdxYear = CHI.indexOf(yc.chi)
  const duongNam = (canIdx % 2 === 0) && gender === 'nam'
  const amNu = (canIdx % 2 === 1) && gender === 'nu'
  const thuanHL = duongNam || amNu  // hướng thuận cho 1 số sao & đại hạn

  // 1) An Mệnh / Thân
  const monthPalace = mod(2 + (lunarMonth - 1), 12)        // Dần=tháng1, thuận
  const menh = mod(monthPalace - (hourRank - 1), 12)       // nghịch giờ
  const than = mod(monthPalace + (hourRank - 1), 12)       // thuận giờ

  // 2) Định Cục theo Can năm + chi cung Mệnh
  const cucNum = CUC_TABLE[canIdx % 5][Math.floor(menh / 2)]

  // 3) An Tử Vi theo Cục + ngày sinh âm
  const C = cucNum, D = lunarDay
  const borrow = mod(C - mod(D, C), C)
  const q = (D + borrow) / C
  let base = mod(2 + (q - 1), 12)
  let tuvi
  if (borrow === 0) tuvi = base
  else if (borrow % 2 === 0) tuvi = mod(base + borrow, 12)
  else tuvi = mod(base - borrow, 12)
  const thienphu = mod(4 - tuvi, 12)

  // 4) 14 chính tinh
  const stars = Array.from({ length: 12 }, () => [])
  const put = (chi, ten, loai) => stars[chi].push({ ten, loai })
  put(tuvi, 'Tử Vi', 'chinh')
  put(mod(tuvi - 1, 12), 'Thiên Cơ', 'chinh')
  put(mod(tuvi - 3, 12), 'Thái Dương', 'chinh')
  put(mod(tuvi - 4, 12), 'Vũ Khúc', 'chinh')
  put(mod(tuvi - 5, 12), 'Thiên Đồng', 'chinh')
  put(mod(tuvi - 8, 12), 'Liêm Trinh', 'chinh')
  put(thienphu, 'Thiên Phủ', 'chinh')
  put(mod(thienphu + 1, 12), 'Thái Âm', 'chinh')
  put(mod(thienphu + 2, 12), 'Tham Lang', 'chinh')
  put(mod(thienphu + 3, 12), 'Cự Môn', 'chinh')
  put(mod(thienphu + 4, 12), 'Thiên Tướng', 'chinh')
  put(mod(thienphu + 5, 12), 'Thiên Lương', 'chinh')
  put(mod(thienphu + 6, 12), 'Thất Sát', 'chinh')
  put(mod(thienphu + 10, 12), 'Phá Quân', 'chinh')

  // 5) Lục cát
  put(mod(4 + (lunarMonth - 1), 12), 'Tả Phù', 'cat')
  put(mod(10 - (lunarMonth - 1), 12), 'Hữu Bật', 'cat')
  put(mod(10 - (hourRank - 1), 12), 'Văn Xương', 'cat')
  put(mod(4 + (hourRank - 1), 12), 'Văn Khúc', 'cat')
  put(THIEN_KHOI[canIdx], 'Thiên Khôi', 'cat')
  put(THIEN_VIET[canIdx], 'Thiên Việt', 'cat')

  // 6) Lục sát
  const loc = LOC_TON[canIdx]
  put(loc, 'Lộc Tồn', 'cat')
  put(mod(loc + 1, 12), 'Kình Dương', 'sat')
  put(mod(loc - 1, 12), 'Đà La', 'sat')
  put(mod(11 - (hourRank - 1), 12), 'Địa Không', 'sat')
  put(mod(11 + (hourRank - 1), 12), 'Địa Kiếp', 'sat')
  // Hỏa/Linh theo nhóm tam hợp năm + giờ + giới
  const grp = TAM_HOP_OF(chiIdxYear)
  const khoiHoa = { DAN_NGO_TUAT: 1, THAN_TY_THIN: 2, TY_DAU_SUU: 3, HOI_MAO_MUI: 9 }[grp]
  const khoiLinh = { DAN_NGO_TUAT: 3, THAN_TY_THIN: 10, TY_DAU_SUU: 10, HOI_MAO_MUI: 10 }[grp]
  put(thuanHL ? mod(khoiHoa + (hourRank - 1), 12) : mod(khoiHoa - (hourRank - 1), 12), 'Hỏa Tinh', 'sat')
  put(thuanHL ? mod(khoiLinh - (hourRank - 1), 12) : mod(khoiLinh + (hourRank - 1), 12), 'Linh Tinh', 'sat')

  // 7) Một số sao theo chi năm (đào hoa, dịch mã, khốc hư)
  const MA = { THAN_TY_THIN: 2, DAN_NGO_TUAT: 8, TY_DAU_SUU: 11, HOI_MAO_MUI: 5 }
  const DAO = { THAN_TY_THIN: 9, DAN_NGO_TUAT: 3, TY_DAU_SUU: 6, HOI_MAO_MUI: 0 }
  put(MA[grp], 'Thiên Mã', 'khac')
  put(DAO[grp], 'Đào Hoa', 'khac')
  const hongLoan = mod(3 - chiIdxYear, 12)
  put(hongLoan, 'Hồng Loan', 'khac')
  put(mod(hongLoan + 6, 12), 'Thiên Hỷ', 'khac')
  put(mod(6 - chiIdxYear, 12), 'Thiên Khốc', 'khac')
  put(mod(6 + chiIdxYear, 12), 'Thiên Hư', 'khac')

  // 8) Tứ Hóa: gắn nhãn vào chính tinh tương ứng
  const hoa = TU_HOA[canIdx]
  const hoaMap = { [hoa.Lộc]: 'Lộc', [hoa.Quyền]: 'Quyền', [hoa.Khoa]: 'Khoa', [hoa.Kỵ]: 'Kỵ' }
  for (const arr of stars) for (const s of arr) if (hoaMap[s.ten]) s.hoa = hoaMap[s.ten]

  // 9) Đại hạn: khởi tại Mệnh, tuổi đầu = Cục; thuận nếu dương nam/âm nữ, ngược lại nghịch
  const dir = thuanHL ? 1 : -1
  const daihan = Array(12)
  for (let i = 0; i < 12; i++) {
    const chi = mod(menh + dir * i, 12)
    daihan[chi] = { from: cucNum + i * 10, to: cucNum + i * 10 + 9 }
  }

  // 10) Lắp 12 cung
  const palaces = Array.from({ length: 12 }, (_, chi) => {
    const cungIdx = mod(chi - menh, 12) // khoảng cách thuận từ Mệnh
    return {
      chi: CHI[chi], chiIdx: chi,
      cung: CUNG[cungIdx],
      isMenh: chi === menh, isThan: chi === than,
      sao: stars[chi],
      daihan: daihan[chi]
    }
  })

  return {
    am: { day: lunarDay, month: lunarMonth },
    nam: yc.tenCanChi, namCan: yc.can, namChi: yc.chi, menhHanh: yc.menhHanh,
    gioiTinh: gender, amDuong: (canIdx % 2 === 0 ? 'Dương' : 'Âm') + (gender === 'nam' ? ' Nam' : ' Nữ'),
    gioChi: CHI[mod(hourRank - 1, 12)],
    cuc: { num: cucNum, ten: CUC_TEN[cucNum], hanh: CUC_HANH[cucNum] },
    menhChi: CHI[menh], thanChi: CHI[than], menhIdx: menh, thanIdx: than,
    thanCu: CUNG[mod(than - menh, 12)],
    tuHoa: hoa,
    palaces
  }
}

/* ===== Ý NGHĨA (diễn giải truyền thống — tham khảo, tự biên soạn) ===== */

/* 14 chính tinh: cốt cách + mặt sáng + điều cần lưu ý */
export const CHINH_TINH = {
  'Tử Vi': { hanh: 'Thổ', tom: 'Đế tinh — lãnh đạo, cao quý', y: 'Sao vua, biểu trưng cho uy nghi, khả năng tổ chức và đứng đầu. Người có Tử Vi thủ Mệnh thường có chí lớn, trọng danh dự, được nể trọng. Mặt cần lưu ý: dễ bảo thủ, ưa được tôn sùng, đôi khi cô đơn ở vị trí cao — cần thêm sao phụ tá (Tả Hữu, Khôi Việt) mới phát huy trọn vẹn.' },
  'Thiên Cơ': { hanh: 'Mộc', tom: 'Trí tinh — thông minh, mưu lược', y: 'Sao của trí tuệ, tính toán, linh hoạt và khéo thích ứng. Hợp nghiên cứu, tham mưu, kế hoạch. Mặt cần lưu ý: nghĩ nhiều, dễ thay đổi ý định, tâm trí ít khi ngơi nghỉ.' },
  'Thái Dương': { hanh: 'Hỏa', tom: 'Quý tinh — quang minh, nhiệt thành', y: 'Mặt trời: sáng sủa, hào phóng, vì người, thích lan tỏa và cống hiến. Chủ về danh và quý. Mặt cần lưu ý: hay vất vả lo cho người khác, dễ hao tâm; sáng hay tối tùy giờ sinh (ngày/đêm).' },
  'Vũ Khúc': { hanh: 'Kim', tom: 'Tài tinh — cương nghị, giỏi tiền bạc', y: 'Sao tài chính và hành động, quyết đoán, thực tế, kiên cường. Hợp kinh doanh, tài vụ, kỹ thuật. Mặt cần lưu ý: tính cứng, thẳng, đôi khi thiếu mềm mỏng trong tình cảm.' },
  'Thiên Đồng': { hanh: 'Thủy', tom: 'Phúc tinh — ôn hòa, hưởng phúc', y: 'Sao phúc khí: hiền hòa, lạc quan, dễ gần, biết tận hưởng. Hóa giải hung tinh tốt. Mặt cần lưu ý: dễ an phận, ngại va chạm, đôi khi thiếu nghị lực bứt phá.' },
  'Liêm Trinh': { hanh: 'Hỏa', tom: 'Tù tinh — nguyên tắc, phức tạp', y: 'Sao của kỷ luật và đam mê — vừa cứng rắn nguyên tắc, vừa giàu cảm xúc, đào hoa. Bản lĩnh, dám đương đầu. Mặt cần lưu ý: dễ vướng thị phi, tình cảm hoặc kiện tụng nếu gặp hung tinh.' },
  'Thiên Phủ': { hanh: 'Thổ', tom: 'Khố tinh — ổn định, biết tích lũy', y: 'Sao kho tàng: vững vàng, bao dung, thận trọng, biết dành dụm và gìn giữ. Đem lại sự an ổn. Mặt cần lưu ý: hơi cầu an, giữ của, thiếu mạo hiểm.' },
  'Thái Âm': { hanh: 'Thủy', tom: 'Phú tinh — dịu dàng, tinh tế', y: 'Mặt trăng: nhu hòa, tình cảm, giàu trực giác và óc thẩm mỹ, chủ về tài sản – điền trạch. Mặt cần lưu ý: đa cảm, dễ u sầu; sáng tối tùy giờ và vị trí.' },
  'Tham Lang': { hanh: 'Mộc/Thủy', tom: 'Đào hoa — đa tài, nhiều ham muốn', y: 'Sao của dục vọng và tài lẻ: đa tài đa nghệ, giao tế giỏi, ham học hỏi và hưởng thụ, sức sống mạnh. Mặt cần lưu ý: dễ sa đà vào hưởng lạc, ôm đồm nhiều thứ.' },
  'Cự Môn': { hanh: 'Thủy', tom: 'Ám tinh — khẩu tài, lý luận', y: 'Sao của lời nói và suy xét: giỏi ăn nói, biện luận, nghiên cứu, hoài nghi để tìm sự thật. Hợp nghề dùng miệng lưỡi. Mặt cần lưu ý: dễ thị phi, hiểu lầm, lời ra tiếng vào.' },
  'Thiên Tướng': { hanh: 'Thủy', tom: 'Ấn tinh — trung hậu, công bằng', y: 'Sao ấn tín: trung thực, chính trực, thích giúp đỡ và phục vụ, trọng nghĩa. Là người phụ tá đắc lực. Mặt cần lưu ý: cần minh chủ để nương theo, tự thân khởi xướng hơi yếu.' },
  'Thiên Lương': { hanh: 'Thổ', tom: 'Ấm tinh — chính trực, che chở', y: 'Sao phúc thọ và che chở: nguyên tắc, giàu kinh nghiệm, hay giúp người gỡ nạn; hợp y, giáo, pháp luật, tư vấn. Mặt cần lưu ý: thích lo việc thiên hạ, đôi khi cô độc, ưa nói thẳng.' },
  'Thất Sát': { hanh: 'Kim/Hỏa', tom: 'Tướng tinh — quả cảm, độc lập', y: 'Sao chủ tướng: dũng mãnh, độc lập, dám nghĩ dám làm, chịu được áp lực. Hợp khai phá, chỉ huy. Mặt cần lưu ý: cương mãnh, cuộc đời nhiều thăng trầm, cần học sự mềm dẻo.' },
  'Phá Quân': { hanh: 'Thủy', tom: 'Hao tinh — phá cách, tiên phong', y: 'Sao đổi mới: dám phá bỏ cái cũ, tiên phong, không theo lối mòn, giàu sức bứt phá. Mặt cần lưu ý: hay hao tán, đời sống biến động, cần một hướng đi rõ để dồn sức.' }
}

/* Phụ tinh tiêu biểu (cát/sát/khác) — một dòng gợi ý */
export const PHU_TINH = {
  'Tả Phù': 'Quý nhân phò tá — người tin cẩn giúp đỡ ở bên.',
  'Hữu Bật': 'Quý nhân phò tá — được nâng đỡ, cộng sự tốt.',
  'Văn Xương': 'Văn tinh — học hành, thi cử, văn chương, sự chỉn chu.',
  'Văn Khúc': 'Văn tinh — tài hoa, khéo léo, nghệ thuật, ăn nói.',
  'Thiên Khôi': 'Quý nhân (ban ngày) — gặp may, được người trên nâng đỡ.',
  'Thiên Việt': 'Quý nhân (ban đêm) — cơ hội và trợ lực bất ngờ.',
  'Lộc Tồn': 'Sao tài lộc — tích lũy, phúc về tiền bạc, dành dụm.',
  'Kình Dương': 'Sát tinh sắc bén — quyết liệt nhưng dễ va chạm, thương tổn.',
  'Đà La': 'Sát tinh trì trệ — vướng mắc, chậm trễ, day dứt.',
  'Hỏa Tinh': 'Nóng vội, biến động bất ngờ; gặp cát tinh có thể thành uy lực.',
  'Linh Tinh': 'Âm ỉ, thay đổi khó lường; cần điềm tĩnh để hóa giải.',
  'Địa Không': 'Hư không — nghĩ khác người, dễ hao hụt; tu tâm thì nhẹ.',
  'Địa Kiếp': 'Hao tán — mất mát ngoài ý; bớt phiêu lưu liều lĩnh thì ổn.',
  'Thiên Mã': 'Sao di chuyển — bôn ba, đi xa, thay đổi; gặp Lộc Tồn là "Lộc Mã" tốt.',
  'Đào Hoa': 'Sao duyên — hấp dẫn, giao tế, dễ có người để ý.',
  'Hồng Loan': 'Sao hỉ duyên — nhân duyên, cưới hỏi, tin vui.',
  'Thiên Hỷ': 'Sao hỉ sự — vui mừng, con cái, việc tốt lành.',
  'Thiên Khốc': 'Ưu tư, dễ chạnh lòng — hợp người làm việc cảm xúc/nghệ thuật.',
  'Thiên Hư': 'Trống trải, hao tổn tinh thần — cần chỗ dựa và mục tiêu.'
}

/* Tứ Hóa */
export const TU_HOA_NGHIA = {
  'Lộc': 'Hóa Lộc — thêm tài lộc, thuận lợi, mở đường (cát).',
  'Quyền': 'Hóa Quyền — thêm quyền lực, năng lực, sự chủ động (cát).',
  'Khoa': 'Hóa Khoa — thêm danh tiếng, văn vẻ, quý nhân, thi cử (cát).',
  'Kỵ': 'Hóa Kỵ — vướng mắc, trở ngại, hao tổn; nhắc ta thận trọng (cần lưu ý).'
}

/* 12 cung: cai quản điều gì */
export const CUNG_NGHIA = {
  'Mệnh': 'Bản thân — tính cách cốt lõi, con người và vận mệnh tổng quát; cung quan trọng nhất.',
  'Phụ Mẫu': 'Cha mẹ & bề trên — quan hệ với cha mẹ/cấp trên, học vấn, tướng mạo, phúc ấm thừa hưởng.',
  'Phúc Đức': 'Phúc phần & tinh thần — sự an vui trong tâm, hưởng thụ, phúc khí tổ tiên để lại.',
  'Điền Trạch': 'Nhà cửa & tài sản cố định — đất đai, bất động sản, nơi ăn chốn ở.',
  'Quan Lộc': 'Sự nghiệp & công danh — nghề nghiệp, chức vụ, đường học hành – thi cử.',
  'Nô Bộc': 'Bằng hữu & người dưới — bạn bè, cộng sự, cấp dưới, các mối quan hệ xã hội.',
  'Thiên Di': 'Ra ngoài & đi xa — môi trường bên ngoài, cơ hội nơi đất khách, quan hệ xã giao.',
  'Tật Ách': 'Sức khỏe & tai ách — thể chất, bệnh tật, điểm yếu thân thể, rủi ro cần phòng.',
  'Tài Bạch': 'Tiền bạc — cách kiếm và tiêu tiền, tài vận, dòng tiền trong đời.',
  'Tử Tức': 'Con cái & sáng tạo — con cái, học trò, "đứa con tinh thần", sức sinh sôi.',
  'Phu Thê': 'Hôn nhân — bạn đời, tình cảm lứa đôi, chuyện vợ chồng.',
  'Huynh Đệ': 'Anh chị em — anh em ruột thịt, bạn thân, cộng sự gần gũi.'
}
