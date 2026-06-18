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
// Khôi–Việt theo phái "Giáp Mậu thị ngưu dương … Canh Tân phùng mã hổ" (Canh=Ngọ/Dần, khớp nguồn đã dẫn).
// Có dị bản "Giáp Mậu Canh ngưu dương" cho Canh=Sửu/Mùi — chọn theo nguồn tracuutuvi.
const THIEN_KHOI = [1, 0, 11, 11, 1, 0, 6, 6, 3, 3]
const THIEN_VIET = [7, 8, 9, 9, 7, 8, 2, 2, 5, 5]

/* Tứ Hóa theo Can năm: tên chính tinh nhận hóa (khớp bảng tracuutuvi; riêng can Canh có dị bản giữa các phái). */
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
export function anSao({ lunarDay, lunarMonth, year, hourRank, gender, viewYear }) {
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

  // 9b) Vòng Tràng Sinh (theo Cục + chiều âm dương/giới)
  const tsStart = { 2: 8, 5: 8, 6: 2, 3: 11, 4: 5 }[cucNum]
  const tsDir = thuanHL ? 1 : -1
  const trangSinh = Array(12)
  for (let i = 0; i < 12; i++) trangSinh[mod(tsStart + tsDir * i, 12)] = TS_NAMES[i]

  // 9c) Vận hạn năm xem (đại hạn / tiểu hạn / lưu niên Thái Tuế)
  let van = null
  if (viewYear) {
    const age = viewYear - year + 1
    let dhChi = menh
    for (let c = 0; c < 12; c++) if (daihan[c] && age >= daihan[c].from && age <= daihan[c].to) dhChi = c
    const thStart = { DAN_NGO_TUAT: 4, THAN_TY_THIN: 10, TY_DAU_SUU: 7, HOI_MAO_MUI: 1 }[grp]
    const thDir = gender === 'nam' ? 1 : -1
    van = { year: viewYear, age, daiHanChi: dhChi, tieuHanChi: mod(thStart + thDir * (age - 1), 12), luuNienChi: mod(viewYear - 4, 12) }
  }

  // 9d) Cách cục cung Mệnh (theo tinh hệ tam hợp)
  const menhChinh = stars[menh].filter(s => s.loai === 'chinh').map(s => s.ten)
  let cachKey = menhChinh.length ? CACH_STAR[menhChinh[0]] : null
  let cachMuon = false
  if (!cachKey) { const dch = stars[mod(menh + 6, 12)].filter(s => s.loai === 'chinh').map(s => s.ten); if (dch.length) { cachKey = CACH_STAR[dch[0]]; cachMuon = true } }
  const menhCach = cachKey ? { ten: cachKey, muon: cachMuon, luan: CACH_CUC[cachKey] } : { ten: 'Vô chính diệu', muon: false, luan: CACH_CUC['Vô chính diệu'] }

  // 9e) Tam phương tứ chính của Mệnh: Mệnh + Tài Bạch + Quan Lộc + Thiên Di
  const tamPhuong = [menh, mod(menh + 8, 12), mod(menh + 4, 12), mod(menh + 6, 12)]

  // 9f) Độ sáng Nhật–Nguyệt theo cung (phần rõ ràng & đồng thuận nhất; các sao khác có dị bản nên không gán)
  for (let c = 0; c < 12; c++) for (const st of stars[c]) {
    if (MIEU_POS[st.ten] && MIEU_POS[st.ten].includes(c)) st.mieu = true
    if (DO_SANG[st.ten]) st.do = DO_SANG[st.ten][c]
    if (st.ten === 'Thái Dương') st.sang = [2, 3, 4, 5, 6, 7].includes(c) ? 'sáng' : 'tối'
    else if (st.ten === 'Thái Âm') st.sang = [9, 10, 11, 0, 1].includes(c) ? 'sáng' : ([3, 4, 5, 6, 7].includes(c) ? 'tối' : 'bình')
  }

  // 9g) Cách cục/tổ hợp nổi tiếng trong tam phương tứ chính của Mệnh
  const cachCuc = detectCach(stars, menh, tamPhuong)

  // 10) Lắp 12 cung
  const palaces = Array.from({ length: 12 }, (_, chi) => {
    const cungIdx = mod(chi - menh, 12) // khoảng cách thuận từ Mệnh
    return {
      chi: CHI[chi], chiIdx: chi,
      cung: CUNG[cungIdx],
      isMenh: chi === menh, isThan: chi === than,
      sao: stars[chi],
      trangSinh: trangSinh[chi],
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
    van, menhCach, tamPhuong, cachCuc,
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

/* ===== Vòng Tràng Sinh + Cách cục (tinh hệ) ===== */
const TS_NAMES = ['Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng']

export const CACH_STAR = {
  'Tử Vi': 'Tử Phủ Vũ Tướng', 'Thiên Phủ': 'Tử Phủ Vũ Tướng', 'Vũ Khúc': 'Tử Phủ Vũ Tướng', 'Thiên Tướng': 'Tử Phủ Vũ Tướng',
  'Thất Sát': 'Sát Phá Lang', 'Phá Quân': 'Sát Phá Lang', 'Tham Lang': 'Sát Phá Lang', 'Liêm Trinh': 'Sát Phá Lang',
  'Thiên Cơ': 'Cơ Nguyệt Đồng Lương', 'Thái Âm': 'Cơ Nguyệt Đồng Lương', 'Thiên Đồng': 'Cơ Nguyệt Đồng Lương', 'Thiên Lương': 'Cơ Nguyệt Đồng Lương',
  'Thái Dương': 'Cự Nhật', 'Cự Môn': 'Cự Nhật'
}

export const CACH_CUC = {
  'Tử Phủ Vũ Tướng': 'Nhóm sao của sự ỔN ĐỊNH & QUÝ HIỂN (Tử Vi · Thiên Phủ · Vũ Khúc · Thiên Tướng). Thường có tố chất lãnh đạo – quản trị, trọng danh dự và nề nếp; hợp con đường công danh, tổ chức, tài chính bài bản, đi đường dài vững vàng. Cần lưu ý: dễ bảo thủ, cầu toàn, ngại mạo hiểm.',
  'Sát Phá Lang': 'Nhóm sao của BIẾN ĐỘNG & KHAI PHÁ (Thất Sát · Phá Quân · Tham Lang, cùng Liêm Trinh). Cá tính mạnh, dám nghĩ dám làm, thích chinh phục và đổi mới; đời nhiều thăng trầm rõ rệt. Hợp khởi nghiệp, khai phá, nghề cạnh tranh. Cần lưu ý: tiết chế nóng vội, giữ cho bền thành quả.',
  'Cơ Nguyệt Đồng Lương': 'Nhóm sao của TRÍ TUỆ & ÔN HÒA (Thiên Cơ · Thái Âm · Thiên Đồng · Thiên Lương). Mềm mỏng, chu đáo, giỏi tính toán – chăm sóc – chuyên môn; hợp nghề tham mưu, giáo dục, y tế, hành chính, kế hoạch. Cần lưu ý: hơi cầu an, ngại va chạm, dễ nghĩ ngợi nhiều.',
  'Cự Nhật': 'Nhóm sao của NGÔN LUẬN & DANH TIẾNG (Thái Dương · Cự Môn). Giỏi ăn nói, lý luận, lan tỏa và gây ảnh hưởng; hợp nghề dùng lời — giảng dạy, truyền thông, pháp lý, ngoại giao. Cần lưu ý: dễ vướng thị phi, nên giữ khẩu đức.',
  'Vô chính diệu': 'Cung Mệnh không có chính tinh (vô chính diệu) — theo truyền thống thường mượn sao ở cung Thiên Di (đối diện) để luận. Tính cách dễ uyển chuyển, thích nghi theo hoàn cảnh và người chung quanh; hợp hay không tùy các sao hội họp.'
}

/* ===== Cách cục / tổ hợp sao nổi tiếng (phát hiện trong tam phương tứ chính của Mệnh) =====
 * tot: true=cát, false=hung, null=trung tính. Điều kiện rõ ràng theo vị trí sao; luận tự biên, tham khảo. */
const CACH_DEF = [
  { ten: 'Tam kỳ gia hội', tot: true, test: c => c.hasHoa('Lộc') && c.hasHoa('Quyền') && c.hasHoa('Khoa'),
    luan: 'Ba Hóa Lộc – Quyền – Khoa cùng hội về Mệnh — cách rất đẹp ("Tam kỳ gia hội"): tài lộc, năng lực và danh tiếng/quý nhân hội đủ; thường chủ thành đạt, được trọng vọng (đẹp nhất khi không bị sát tinh phá).' },
  { ten: 'Song Lộc triều viên', tot: true, test: c => c.hasHoa('Lộc') && c.inSet('Lộc Tồn'),
    luan: 'Hóa Lộc gặp Lộc Tồn cùng chiếu Mệnh ("Song Lộc") — tài lộc dồi dào, hậu vận sung túc; hợp tích lũy, kinh doanh, gây dựng cơ nghiệp.' },
  { ten: 'Phủ Tướng triều viên', tot: true, test: c => c.inSet('Thiên Phủ') && c.inSet('Thiên Tướng'),
    luan: 'Thiên Phủ và Thiên Tướng cùng chầu Mệnh — cách an ổn, quý hiển: thường có quý nhân, đời sống đủ đầy, làm việc bài bản và được tin cậy.' },
  { ten: 'Tử Phủ đồng cung', tot: true, test: c => c.sameInTp('Tử Vi', 'Thiên Phủ'),
    luan: 'Tử Vi (đế tinh) và Thiên Phủ (khố tinh) cùng tọa — cách quý hiển, vững vàng: có khí chất lãnh đạo lại biết tích lũy, giữ gìn; thuận đường công danh – quản trị nếu được phụ tinh trợ.' },
  { ten: 'Lộc Mã giao trì', tot: true, test: c => c.sameInTp('Lộc Tồn', 'Thiên Mã'),
    luan: 'Lộc Tồn gặp Thiên Mã — "lộc theo ngựa": tài lộc dồi dào và đến từ sự năng động, đi xa, giao thương; người bôn ba mà phát đạt.' },
  { ten: 'Khôi Việt phụ củng', tot: true, test: c => c.inSet('Thiên Khôi') && c.inSet('Thiên Việt'),
    luan: 'Thiên Khôi – Thiên Việt cùng chiếu Mệnh — cách quý nhân: hay được người trên nâng đỡ, gặp may đúng lúc, thuận thi cử – công danh.' },
  { ten: 'Tả Hữu đồng củng', tot: true, test: c => c.inSet('Tả Phù') && c.inSet('Hữu Bật'),
    luan: 'Tả Phù – Hữu Bật trợ Mệnh — làm việc có vây cánh, được người tin cẩn giúp sức; hợp vai trò tổ chức, lãnh đạo tập thể.' },
  { ten: 'Xương Khúc hội Mệnh', tot: true, test: c => c.inSet('Văn Xương') && c.inSet('Văn Khúc'),
    luan: 'Văn Xương – Văn Khúc chiếu Mệnh — văn tài, học hành thi cử thuận, đầu óc tinh tế, khéo chữ nghĩa và nghệ thuật.' },
  { ten: 'Nhật Nguyệt (âm dương cùng chiếu)', test: c => c.inSet('Thái Dương') && c.inSet('Thái Âm'),
    tot: c => (c.brightOf('Thái Dương') === 'sáng' && c.brightOf('Thái Âm') === 'sáng') ? true : null,
    luan: c => { const ds = c.brightOf('Thái Dương') === 'sáng', as = c.brightOf('Thái Âm') === 'sáng'; return 'Thái Dương và Thái Âm cùng hội chiếu Mệnh — âm dương điều hòa. ' + (ds && as ? 'Cả hai đều SÁNG (cách Nhật Nguyệt tịnh minh): tâm tính quang minh, trí tuệ và danh tiếng dễ rạng rỡ.' : (!ds && !as ? 'Cả hai đang ở thế tối (hãm) — ánh sáng bị che, nên trông cậy thêm cát tinh phù trợ và sự bền bỉ.' : 'Một sáng một tối — cương nhu xen kẽ; phát huy tốt hơn khi để sao đang sáng dẫn dắt.')) } },
  { ten: 'Tham Hỏa / Tham Linh', tot: true, test: c => c.sameInTp('Tham Lang', 'Hỏa Tinh') || c.sameInTp('Tham Lang', 'Linh Tinh'),
    luan: 'Tham Lang gặp Hỏa Tinh (hoặc Linh Tinh) đồng cung — cách "bạo phát": dễ có cơ hội phát nhanh về tài lộc/danh tiếng, hợp khởi nghiệp, nghề cạnh tranh; song cần giữ cho bền.' },
  { ten: 'Cơ Cự đồng cung', tot: null, test: c => c.sameInTp('Thiên Cơ', 'Cự Môn'),
    luan: 'Thiên Cơ – Cự Môn cùng tọa (thường ở Mão/Dậu) — khẩu tài và mưu trí nổi bật; hợp nghề dùng lời, nghiên cứu, phân tích. Lưu ý dễ vướng thị phi, nên giữ lời.' },
  { ten: 'Mã đầu đới kiếm', tot: null, test: c => c.menh === 6 && c.atMenh('Kình Dương'),
    luan: 'Kình Dương cư Ngọ ngay tại Mệnh — "đầu ngựa đeo gươm": cương dũng, có uy, dễ lập công nơi gian khó/cạnh tranh; nhưng tính sắc bén, đời nhiều sóng gió, cần tiết chế nóng nảy.' },
  { ten: 'Khốc Hư hội Mệnh', tot: null, test: c => c.inSet('Thiên Khốc') && c.inSet('Thiên Hư'),
    luan: 'Thiên Khốc – Thiên Hư cùng chiếu — tâm hồn đa cảm, hay ưu tư; hợp người làm nghề cảm xúc, nghệ thuật, nghiên cứu. Lời nhắc: nuôi tinh thần tích cực, tránh bi quan.' },
  { ten: 'Linh Xương Đà Vũ', tot: false, test: c => c.inSet('Linh Tinh') && c.inSet('Văn Xương') && c.inSet('Đà La') && c.inSet('Vũ Khúc'),
    luan: 'Tổ hợp Linh Tinh – Văn Xương – Đà La – Vũ Khúc cùng hội — cổ nhân xem là cách hung, dễ gặp trắc trở bất ngờ. Đây chỉ là lời nhắc thận trọng, KHÔNG phải điềm gở: hãy cẩn trọng quyết định lớn và giữ an toàn.' }
]

function detectCach(stars, menh, tp) {
  const inSet = name => tp.some(c => stars[c].some(s => s.ten === name))
  const sameInTp = (a, b) => tp.some(c => stars[c].some(s => s.ten === a) && stars[c].some(s => s.ten === b))
  const atMenh = name => stars[menh].some(s => s.ten === name)
  const brightOf = name => { for (const c of tp) { const st = stars[c].find(s => s.ten === name); if (st) return st.sang || null } return null }
  const hasHoa = h => tp.some(c => stars[c].some(s => s.hoa === h))
  const ctx = { inSet, sameInTp, atMenh, brightOf, hasHoa, menh }
  const out = []
  for (const k of CACH_DEF) { try { if (k.test(ctx)) out.push({ ten: k.ten, tot: typeof k.tot === 'function' ? k.tot(ctx) : k.tot, luan: typeof k.luan === 'function' ? k.luan(ctx) : k.luan }) } catch (_) { } }
  return out
}

/* Vị trí MIẾU (nhập miếu) của 14 chính tinh — chỉ số chi Tý=0..Hợi=11.
 * Nguồn: HOROS (horos.vn) — phần Miếu rõ ràng & đồng thuận; Thiên Lương đối chiếu thêm.
 * Chỉ gắn cờ "miếu" (cấp sáng nhất); bảng đủ Miếu/Vượng/Đắc/Bình/Hãm có dị bản nên không suy diễn. */
const MIEU_POS = {
  'Tử Vi': [5, 6, 2, 8], 'Thiên Cơ': [4, 10, 3, 9], 'Thái Dương': [5, 6], 'Vũ Khúc': [4, 10, 1, 7],
  'Thiên Đồng': [2, 8], 'Liêm Trinh': [4, 10], 'Thiên Phủ': [2, 8, 0, 6], 'Thái Âm': [9, 10, 11],
  'Tham Lang': [1, 7], 'Cự Môn': [3, 9], 'Thiên Tướng': [2, 8], 'Thiên Lương': [4, 6, 10],
  'Thất Sát': [2, 8, 0, 6], 'Phá Quân': [0, 6]
}

// Độ sáng đầy đủ 14 chính tinh × 12 cung (Miếu/Vượng/Đắc/Bình/Hãm) — index theo chi Tý0..Hợi11.
// Nguồn: tracuutuvi.com (Gia Cát Trường Phong) — phái phổ biến; Miếu khớp 13/14 với MIEU_POS (HOROS),
// riêng Tử Vi tại Tỵ lấp theo HOROS. CÓ DỊ BẢN giữa các phái → chỉ để tham khảo.
export const DO_SANG = {
  'Tử Vi':      ['B','Đ','M','B','V','M','M','Đ','M','B','V','B'],
  'Thiên Cơ':   ['Đ','Đ','H','M','M','V','Đ','Đ','V','M','M','H'],
  'Thái Dương': ['H','Đ','V','V','V','M','M','Đ','H','H','H','H'],
  'Vũ Khúc':    ['V','M','V','Đ','M','H','V','M','V','Đ','M','H'],
  'Thiên Đồng': ['V','H','M','Đ','H','Đ','H','H','M','H','H','Đ'],
  'Liêm Trinh': ['V','Đ','V','H','M','H','V','Đ','V','H','M','H'],
  'Thiên Phủ':  ['M','B','M','B','V','Đ','M','Đ','M','B','V','Đ'],
  'Thái Âm':    ['V','Đ','H','H','H','H','H','Đ','V','M','M','M'],
  'Tham Lang':  ['H','M','Đ','H','V','H','H','M','Đ','H','V','H'],
  'Cự Môn':     ['V','H','V','M','H','H','V','H','Đ','M','H','Đ'],
  'Thiên Tướng':['V','Đ','M','H','V','Đ','V','Đ','M','H','V','Đ'],
  'Thiên Lương':['V','Đ','V','V','M','H','M','Đ','V','H','M','H'],
  'Thất Sát':   ['M','Đ','M','H','H','V','M','Đ','M','H','H','V'],
  'Phá Quân':   ['M','V','H','H','Đ','H','M','V','H','H','Đ','H']
}
export const DO_SANG_LABEL = { M:'Miếu', V:'Vượng', 'Đ':'Đắc', B:'Bình', H:'Hãm' }
export const DO_SANG_NGHIA = {
  M:'Miếu địa — sao về đúng nhà, rực rỡ và phát huy mạnh nhất.',
  V:'Vượng địa — sao thịnh, sức tốt rõ.',
  'Đ':'Đắc địa — sao hợp cung, phát huy khá.',
  B:'Bình hòa — sao ở mức trung tính, không tỏ rõ tốt xấu.',
  H:'Hãm địa — sao lạc nhà, sức yếu, cần cát tinh hỗ trợ (KHÔNG phải điềm xấu tất định).'
}

// Tóm tắt độ sáng chính tinh tại cung Mệnh — trả về dữ liệu + câu mô tả nhẹ nhàng (không phán số phận).
export function doSangSummary(laso) {
  if (!laso || !laso.palaces) return null
  const menh = laso.palaces.find(p => p.isMenh)
  if (!menh) return null
  const items = menh.sao.filter(s => s.loai === 'chinh' && s.do)
    .map(s => ({ ten: s.ten, do: s.do, nhan: DO_SANG_LABEL[s.do] }))
  const manh = items.filter(s => ['M', 'V', 'Đ'].includes(s.do)).length
  const binh = items.filter(s => s.do === 'B').length
  const ham = items.filter(s => s.do === 'H').length
  let text
  if (!items.length) {
    text = 'Cung Mệnh vô chính diệu (không có chính tinh) — tính cách thường uyển chuyển theo hoàn cảnh; theo truyền thống mượn sao ở cung đối diện để luận.'
  } else {
    const parts = items.map(s => s.ten + ' ' + s.nhan.toLowerCase())
    text = 'Mệnh có ' + parts.join(', ') + '. '
    if (manh && !ham) text += 'Các chính tinh ở Mệnh đều ở thế sáng (miếu/vượng/đắc) — nền tảng thuận lợi để phát huy.'
    else if (ham && !manh) text += 'Chính tinh ở Mệnh đang ở thế hãm (sao yếu) — đây KHÔNG phải điềm xấu, mà là gợi ý nên cậy thêm cát tinh hội chiếu và nỗ lực bản thân; rất nhiều người Mệnh hãm vẫn thành đạt.'
    else if (manh && ham) text += 'Có cả sao sáng lẫn sao hãm — thuận lợi và thử thách đan xen, nên xét thêm tam phương tứ chính để cân bằng.'
    else text += 'Ở thế bình hòa — trung tính, tiềm năng tùy cách vận dụng.'
  }
  return { menhSao: items, manh, binh, ham, text }
}
