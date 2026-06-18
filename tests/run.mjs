/* Bộ kiểm thử logic Tam Sở (thuần Node ESM, không cần framework).
 * Chạy: npm test   (hoặc: node tests/run.mjs)
 * Bảo vệ các mốc tính toán đã kiểm chứng khỏi hồi quy. */
import * as N from '../src/data/numerology.js'
import * as V from '../src/data/tuvi.js'
import * as L from '../src/data/lunar.js'
import * as T from '../src/data/tarot.js'
import * as I from '../src/data/iching.js'
import * as Z from '../src/data/zodiac.js'
import * as R from '../src/data/report.js'
import * as SITE from '../src/data/site.js'
import * as TV from '../src/data/tuvidauso.js'
import { SAO_CUNG as TVSC } from '../src/data/tuvi-saocung.js'

let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) { pass++ } else { fail++; console.error('  ✗ FAIL: ' + msg) } }
const eq = (a, b, msg) => ok(a === b, `${msg} (nhận ${JSON.stringify(a)}, cần ${JSON.stringify(b)})`)

// — Thần số học —
eq(N.computeLifePath(24, 4, 1999).lp, 11, 'Life Path 24/4/1999 = 11 (master)')
eq(N.computeLifePath(22, 10, 1980).lp, 5, 'Life Path 22/10/1980 = 5')
eq(N.birthdayNumber(24), 6, 'Birthday Number 24 = 6')
eq(N.reduceKeep(11), 11, 'reduceKeep giữ 11'); eq(N.reduceKeep(22), 22, 'reduceKeep giữ 22'); eq(N.reduceKeep(33), 33, 'reduceKeep giữ 33')
const pin = N.pinnacles(22, 10, 1980, 5)
ok(pin.length === 4 && pin[0].p === 5 && pin[2].p === 9 && pin[3].to === null, 'Pinnacles 22/10/1980 = 5/4/9/1, đỉnh 4 trọn đời')
ok(N.letterStats('Nguyễn Văn An').missing.join() === '2,6,8,9', 'Karmic lessons NVA = 2,6,8,9')
eq(N.lifePathCompat(6, 6).verdict, 'Đồng điệu', 'lifePathCompat 6x6 đồng điệu')
{ const vals = [1,2,3,4,5,6,7,8,9,11,22,33]; const vs = new Set(); for (const a of vals) for (const b of vals) vs.add(N.lifePathCompat(a, b).verdict); ok([...vs].every(v => ['Đồng điệu','Có điểm chung','Bổ sung cho nhau'].includes(v)), 'verdict lifePathCompat chi gom 3 muc (khop bang)') }
eq(N.birthdayNumber(29), 2, 'Birthday 29 = 2')
eq(N.reduceKeep(22 + 10), 5, 'Attitude 22/10 = 5')
ok(typeof N.lifePathCompat(1, 9).note === 'string', 'lifePathCompat có note')
eq(N.personalYear(22, 10, 2026), 6, 'Personal Year 22/10 nam 2026 = 6 (ngay+thang+NAM HIEN TAI)')

// — Tử vi / Can Chi —
eq(V.tinhCanChi(2026).tenCanChi, 'Bính Ngọ', 'Can Chi 2026 = Bính Ngọ')
eq(V.dayCanChi(2000, 3, 1).tenCanChi, 'Mậu Ngọ', 'Ngày 1/3/2000 = Mậu Ngọ')
eq(V.hourCanChi(V.dayCanChi(2000, 3, 1).canIdx, 9).tenCanChi, 'Đinh Tỵ', 'Giờ 9h ngày Mậu Ngọ = Đinh Tỵ')
ok(V.xemHopTuoi(1990, 1992).verdict, 'xemHopTuoi chạy & có verdict')
ok(V.saoHan(37, 'nam').ten === 'La Hầu' && V.saoHan(37, 'nu').ten === 'Kế Đô' && V.saoHan(49, 'nu').ten === 'Thái Âm', 'Sao hạn Cửu Diệu khớp bảng 2026 (tuổi 37 nam La Hầu/nữ Kế Đô, 49 nữ Thái Âm)')
eq(V.hopTuoiChi('Tý', 'Thìn'), 'Tam hợp', 'Tý-Thìn Tam hợp')
eq(V.hopTuoiChi('Tý', 'Sửu'), 'Lục hợp', 'Tý-Sửu Lục hợp')
eq(V.hopTuoiChi('Tý', 'Ngọ'), 'Lục xung', 'Tý-Ngọ Lục xung (ưu tiên trước Tứ hành xung)')
eq(V.hopTuoiChi('Tý', 'Mão'), 'Tứ hành xung', 'Tý-Mão Tứ hành xung')
eq(V.hopTuoiChi('Tý', 'Dần'), 'Bình thường', 'Tý-Dần không hợp/xung nổi bật')
eq(V.hopTuoiChi('Ngọ', 'Ngọ'), 'Cùng tuổi', 'Cùng địa chi = Cùng tuổi')

// — Lịch âm (Hồ Ngọc Đức) —
const t1990 = L.solar2lunar(27, 1, 1990); ok(t1990.day === 1 && t1990.month === 1 && t1990.year === 1990, 'Tết 1990 = 1/1/1990')
eq(L.lunarYearOf(10, 1, 1990), 1989, 'Sinh 10/1/1990 (trước Tết) → năm âm 1989')
eq(L.lunarYearOf(21, 1, 1985), 1985, 'Tết VN Ất Sửu = 21/1/1985 (khác Tết TQ 20/2)')

// — Tarot —
eq(T.TAROT_CARDS.length, 78, 'Đủ 78 lá Tarot')
ok(typeof T.cardImageUrl(T.TAROT_CARDS[0]) === 'string', 'cardImageUrl trả URL')
let dupOk = true
for (let i = 0; i < 50; i++) { const p = T.drawCards(3); const ids = new Set(p.map(x => x.card.id)); if (ids.size !== 3) dupOk = false }
ok(dupOk, 'Rút 3 lá không trùng (50 lần)')
ok(T.cardOfDay(new Date('2026-06-16')).card.id === T.cardOfDay(new Date('2026-06-16')).card.id, 'Lá hôm nay tất định theo ngày')
ok(T.TAROT_CARDS.filter(c => c.arcana === 'major').every(c => c.advice && c.advice.length > 10), '22 Ẩn Chính đều có lời khuyên')

// — Kinh Dịch —
eq(I.HEXAGRAMS.length, 64, 'Đủ 64 quẻ')
ok(new Set(I.HEXAGRAMS.map(h => I.TRIGRAMS[h.lo].bits + I.TRIGRAMS[h.up].bits)).size === 64, '64 mã nhị phân duy nhất')
ok(I.HAO_VITRI.length === 6 && typeof I.readingGuide([3]) === 'string', 'Hào động: 6 ngôi + readingGuide')
ok(Object.values(I.TRIGRAMS).every(t => t.hanh && t.nguoi && t.than && t.huong && t.tinh), '8 Bat Quai co hanh/nguoi/than/huong/tinh')
ok(I.hexagramOfDay(new Date()).n >= 1, 'hexagramOfDay chạy')
ok(I.hexagramOfDay(new Date('2026-06-16')).n === I.hexagramOfDay(new Date('2026-06-16')).n, 'hexagramOfDay tất định')
ok(I.maiHoa(2026,5,2,9).present.n === 3 && I.maiHoa(2026,5,2,9).changed && I.maiHoa(2026,5,2,9).dong === 2, 'Mai Hoa 2026/5/2/9h → quẻ #3, hào động 2')

// — Cung hoàng đạo —
eq(Z.getZodiac(16, 6).ten, 'Song Tử', '16/6 = Song Tử')
ok(Z.zodiacCompat(Z.getZodiac(23, 9), Z.getZodiac(21, 5)).verdict, 'zodiacCompat chạy')
ok(Z.decanOf(1, 4).sub.ten === 'Sư Tử' && Z.decanOf(21, 3).pure, 'Decan triplicity: 1/4 Bạch Dương nhuốm Sư Tử, 21/3 thuần')
{ const vs = new Set(); for (const a of Z.ZODIAC) for (const b of Z.ZODIAC) vs.add(Z.zodiacCompat(a, b).verdict); ok([...vs].every(v => ['Rất hợp', 'Hợp', 'Trung bình', 'Cần dung hòa'].includes(v)), 'verdict cung hoang dao chi gom 4 muc (khop bang ma tran)') }

// — Báo cáo tổng hợp (an toàn, không khẳng định) —
const rRes = { lp: N.computeLifePath(1, 3, 2000), nn: N.computeNameNumbers('Le B'), canChi: V.tinhCanChi(2000), zodiac: Z.getZodiac(1, 3), py: N.personalYear(1, 3, 2000), curPin: { p: 4, c: 1 }, topic: 'Tài chính', question: '', hourCC: null }
const rep = R.buildReport(rRes, T.cardOfDay())
ok(rep.week.length === 7, 'Báo cáo có gợi ý 7 ngày')
ok(rep.topicNote.includes('không phải lời khuyên tài chính'), 'Mục Tài chính có miễn trừ')
ok(!/chắc chắn sẽ|nhất định sẽ|chắc chắn xảy ra/.test(rep.intro + rep.focus + rep.topicNote), 'Không có câu khẳng định tương lai')

// === v2.43: phu rong du lieu & ham ===
ok(T.TAROT_CARDS.every(c => c.up && c.rev), 'tarot 78 la co upright+reversed')
ok(T.TAROT_CARDS.filter(c => c.arcana === 'major').every(c => c.desc && c.advice), 'major 22 co desc+advice')
ok(T.TAROT_CARDS.filter(c => c.arcana === 'major').every(c => c.love && c.work), 'major 22 co love+work')
ok(T.TAROT_CARDS.filter(c => c.arcana !== 'major').every(c => c.love && c.work), 'minor 56 co love+work (khung chat x so)')
ok(T.TAROT_CARDS.filter(c => c.arcana === 'major').every(c => typeof c.astro === 'string' && c.astro.length > 5), 'major 22 co tuong ung chiem tinh (astro)')
ok(T.TAROT_CARDS.filter(c => c.arcana !== 'major' && c.astro).length === 40, 'minor 40 (Ach+pip) co decan chiem tinh')
eq(V.THIEN_CAN.length, 10, 'Thien Can 10'); eq(V.DIA_CHI.length, 12, 'Dia Chi 12'); eq(V.NAP_AM.length, 30, 'Nap am 30')
ok(V.DIA_CHI.every(c => c.gio && c.huong && c.mua), 'Dia Chi co gio/huong/mua')
ok(V.THIEN_CAN.every(c => c.huong && c.nghia), 'Thien Can co huong/nghia')
ok(Object.keys(V.NAP_AM_NGHIA).length === 30 && Object.keys(V.CONGIAP_LUAN).length === 12, 'nap am nghia 30 + con giap 12')
ok(V.gioHoangDao('Ty').length === 12, 'gio hoang dao 12')
ok(V.tamTai(1990).nam.length === 3, 'tam tai 3 nam')
ok(V.cungPhi(1990, 'nam').cung && V.cungPhi(1990, 'nu').cung, 'cung phi nam+nu')
ok([1,2,3,4,5,6,7,8,9].every(n => N.PERSONAL_DAY_HINT[n]), 'personal day hint 1-9')
ok([1,2,3,4,5,6,7,8,9].every(n => N.PERSONAL_YEAR[n]), 'personal year 1-9')
ok([1,2,3,4,5,6,7,8,9,11,22,33].every(n => N.NUMEROLOGY[n]), 'numerology 1-9,11,22,33')
ok([1,2,3,4,5,6,7,8,9,11,22,33].every(n => N.NUM_SAO[n]), 'NUM_SAO du 12 so (hanh tinh lien he)')
ok(N.computeNameNumbers('Nguyen Van An').expression >= 1, 'computeNameNumbers ok')
ok(N.loShu(22,10,1990).counts && Array.isArray(N.loShu(22,10,1990).missing), 'lo shu counts+missing')
ok(I.HEXAGRAMS.every(h => h.luan && h.y && h.src), '64 que co luan+y+src')
ok(I.HEXAGRAMS.every(h => h.tuong && h.tuong.length > 10), '64 que co Dai Tuong (tuong)')
const _cast = I.castHexagram(); ok(_cast.lines.length === 6 && _cast.present && Array.isArray(_cast.changingPos), 'castHexagram 6 hao')
ok(I.readingGuide([]).length > 5 && I.readingGuide([2,5]).length > 5, 'readingGuide 0 + nhieu hao')
ok(I.maiHoa(2000,1,1,0).present && I.maiHoa(2000,1,1,0).changed, 'maiHoa que chinh+bien')
ok([3,6,12,29,39,47].every(n => I.HEXAGRAMS.find(h => h.n === n).an), 'que nang co cau Hieu nom na (an)')
// Thoán từ + 384 hào từ đầy đủ (phỏng dịch Legge 1899, phạm vi công cộng)
ok(I.HEXAGRAMS.filter(h => h.thoan && h.thoan.length > 10).length === 64, 'ca 64 que co Thoan tu (Judgment)')
ok(I.HEXAGRAMS.filter(h => Array.isArray(h.hao) && h.hao.length === 6).length === 64, 'ca 64 que co du 6 hao tu')
ok(I.HEXAGRAMS.every(h => !h.hao || h.hao.every(x => x && x.length >= 8)), 'khong hao tu nao bi rong/qua ngan')
ok(I.HEXAGRAMS.find(h => h.n === 1).dung && I.HEXAGRAMS.find(h => h.n === 2).dung, 'que 1 & 2 co loi Dung Cuu/Dung Luc')
ok([1,2,3].includes(Z.decanOf(15,8).num), 'decan 1-3')
ok(Z.ZODIAC.every(z => z.tinh && z.than), '12 cung co tinh chat + bo phan co the')
ok(R.buildReport({ ...rRes, sao: V.saoHan(37,'nam') }, T.cardOfDay()).saoNote.includes('La Hau') || R.buildReport({ ...rRes, sao: V.saoHan(37,'nam') }, T.cardOfDay()).saoNote.length > 10, 'bao cao co sao han')

// === v2.56: guard cac truong dung cho tinh nang Chia se ===
ok(typeof Z.LUCKY[Z.getZodiac(1, 4).en].mau === 'string', 'LUCKY[en].mau cho share cung hoang dao')
ok(typeof V.tinhCanChi(2026).conGiap === 'string' && typeof V.tinhCanChi(2026).napAm === 'string' && typeof V.tinhCanChi(2026).menhHanh === 'string', 'Can Chi co conGiap/napAm/menhHanh cho share')
ok(typeof V.NGU_HANH.mau[V.tinhCanChi(2026).menhHanh] === 'string', 'NGU_HANH.mau theo menh cho share tu vi')
ok(['expression','soulUrge','personality'].every(k => typeof N.computeNameNumbers('Le Van B')[k] === 'number'), 'computeNameNumbers co expression/soulUrge/personality cho share than so hoc')

// === v2.60: quet bien (sweep) bat bug an ===
{
  let zNull = false, dBad = false
  const seen = new Set(), signs = []
  for (let mo = 1; mo <= 12; mo++) for (let da = 1; da <= 28; da++) {
    const z = Z.getZodiac(da, mo); if (!z) zNull = true
    else if (!seen.has(z.en)) { seen.add(z.en); signs.push(z) }
    if (![1, 2, 3].includes(Z.decanOf(da, mo).num)) dBad = true
  }
  ok(!zNull, 'getZodiac phu het 12 thang x 28 ngay (khong null)')
  ok(!dBad, 'decanOf luon tra num trong 1-3')
  ok(signs.length === 12, 'getZodiac cho du 12 cung khac nhau')
  let zc = true; for (const a of signs) for (const b of signs) if (!Z.zodiacCompat(a, b).verdict) zc = false
  ok(zc, 'zodiacCompat moi cap trong 12 cung deu co verdict')
}
ok(V.tinhCanChi(1984).tenCanChi === V.tinhCanChi(2044).tenCanChi, 'Can Chi lap lai sau dung 60 nam (1984=2044)')
{
  const set = [1,2,3,4,5,6,7,8,9,11,22,33]; let lp = true
  for (const a of set) for (const b of set) if (!N.lifePathCompat(a, b).verdict) lp = false
  ok(lp, 'lifePathCompat moi cap (ke ca bac thay) deu co verdict')
}
{
  let castOk = true
  for (let i = 0; i < 60; i++) {
    const c = I.castHexagram()
    if (!c.present || c.present.n < 1 || c.present.n > 64) castOk = false
    if (c.changingPos.length > 0 && (!c.changed || c.changed.n < 1 || c.changed.n > 64)) castOk = false
    if (c.changingPos.length === 0 && c.changed) castOk = false
  }
  ok(castOk, 'castHexagram 60 lan: que chinh hop le, co bien khi co hao dong')
}

// === site.js shareUrl (2 chế độ) ===
global.window = { location: { protocol: 'https:', origin: 'https://vansang2409.github.io', pathname: '/tam-so/' } }
eq(SITE.shareUrl('/tarot'), 'https://vansang2409.github.io/tam-so/tarot', 'shareUrl path-mode (http)')
eq(SITE.shareUrl('/than-so-hoc', 'd=1&m=2'), 'https://vansang2409.github.io/tam-so/than-so-hoc?d=1&m=2', 'shareUrl path-mode co query')
global.window = { location: { protocol: 'file:', origin: 'null', pathname: '/C:/x/tam-so-test.html' } }
ok(SITE.shareUrl('/tarot').includes('#/tarot') && !SITE.shareUrl('/tarot').includes('/tam-so/tarot'), 'shareUrl hash-mode khi file://')
delete global.window

// === Tử Vi Đẩu Số: an sao (thuật toán cổ điển, kiểm chứng được) ===
{
  const A = TV.anSao({ lunarDay:1, lunarMonth:4, year:2018, hourRank:7, gender:"nam" })
  eq(A.menhChi, "Hợi", "Mậu Tuất t4 giờ Ngọ -> Mệnh Hợi")
  eq(A.cuc.num, 2, "-> Thủy nhị cục")
  eq(A.thanCu, "Mệnh", "giờ Ngọ -> Thân cư Mệnh")
  const mp = {}; A.palaces.forEach(p => p.sao.forEach(s => { if (s.loai==="chinh") mp[s.ten]=p.chiIdx }))
  const md=(n,m)=>((n%m)+m)%m, tv=mp["Tử Vi"], tp=mp["Thiên Phủ"]
  ok(tp===md(4-tv,12), "Thiên Phủ = (4 - Tử Vi) mod 12")
  ok(mp["Thiên Cơ"]===md(tv-1,12) && mp["Liêm Trinh"]===md(tv-8,12), "chùm Tử Vi offset đúng")
  ok(mp["Thái Âm"]===md(tp+1,12) && mp["Phá Quân"]===md(tp+10,12), "chùm Thiên Phủ offset đúng")
  const all14=["Tử Vi","Thiên Cơ","Thái Dương","Vũ Khúc","Thiên Đồng","Liêm Trinh","Thiên Phủ","Thái Âm","Tham Lang","Cự Môn","Thiên Tướng","Thiên Lương","Thất Sát","Phá Quân"]
  ok(all14.every(t=>typeof mp[t]==="number"), "đủ 14 chính tinh, mỗi sao 1 cung")
  const ky=A.palaces.flatMap(p=>p.sao).find(s=>s.hoa==="Kỵ"); ok(ky&&ky.ten==="Thiên Cơ", "Mậu: Hóa Kỵ ở Thiên Cơ")
  ok(A.palaces.length===12 && A.palaces.filter(p=>p.daihan).length===12, "12 cung + đại hạn đủ")
  const B = TV.anSao({ lunarDay:1, lunarMonth:4, year:2018, hourRank:7, gender:"nam", viewYear:2026 })
  ok(B.palaces.filter(p=>p.trangSinh).length===12, "vòng Tràng Sinh đủ 12 sao")
  ok(B.van && typeof B.van.daiHanChi==="number" && typeof B.van.tieuHanChi==="number" && typeof B.van.luuNienChi==="number", "vận hạn: đại/tiểu hạn + lưu niên")
  ok(B.van.luuNienChi===6, "lưu niên 2026 = Ngọ (Bính Ngọ)")
  ok(B.menhCach && B.menhCach.luan && B.menhCach.luan.length>20, "cách cục Mệnh có luận")
  ok(Array.isArray(B.tamPhuong) && B.tamPhuong.length===4, "tam phương tứ chính 4 cung")
  const C2 = TV.anSao({ lunarDay:10, lunarMonth:5, year:2020, hourRank:3, gender:"nam" })
  const khoi = C2.palaces.find(p => p.sao.some(s => s.ten==="Thiên Khôi"))
  ok(khoi && khoi.chiIdx===6, "Canh: Thiên Khôi tại Ngọ (phái Canh-Tân mã hổ)")
  ok(Array.isArray(A.cachCuc), "cách cục trả mảng")
  const tdA = A.palaces.flatMap(p => p.sao).find(s => s.ten==="Thái Dương")
  ok(tdA && tdA.sang==="tối", "Mậu Tuất: Thái Dương (Tuất) = tối")
  const taA = A.palaces.flatMap(p => p.sao).find(s => s.ten==="Thái Âm")
  ok(taA && taA.sang==="tối", "Mậu Tuất: Thái Âm (Thìn) = tối")
  const tdong = A.palaces.flatMap(p => p.sao).find(s => s.ten==="Thiên Đồng")
  ok(tdong && tdong.mieu===true, "Mậu Tuất: Thiên Đồng (Thân) nhập Miếu")
}
{
  let chinhOk = true, cungOk = true, dhOk = true, cachOk = true, hoaOk = true
  const CT14 = ["Tử Vi","Thiên Cơ","Thái Dương","Vũ Khúc","Thiên Đồng","Liêm Trinh","Thiên Phủ","Thái Âm","Tham Lang","Cự Môn","Thiên Tướng","Thiên Lương","Thất Sát","Phá Quân"]
  for (const yy of [1960,1972,1985,1990,1995,2000,2008,2018]) for (const mm of [1,4,7,11]) for (const dd of [3,17,29]) {
    const a = TV.anSao({ lunarDay: dd, lunarMonth: mm, year: yy, hourRank: ((dd+mm)%12)+1, gender: dd%2?"nam":"nu", viewYear: 2026 })
    const flat = a.palaces.flatMap(p => p.sao.filter(s=>s.loai==="chinh").map(s=>s.ten))
    for (const t of CT14) if (flat.filter(x=>x===t).length !== 1) chinhOk = false
    if (a.palaces.length !== 12 || new Set(a.palaces.map(p=>p.cung)).size !== 12) cungOk = false
    if (a.palaces.filter(p=>p.daihan).length !== 12) dhOk = false
    if (!Array.isArray(a.cachCuc) || !a.menhCach || !a.menhCach.luan) cachOk = false
    const hoas = a.palaces.flatMap(p=>p.sao).filter(s=>s.hoa).map(s=>s.hoa)
    if (!(hoas.includes("Lộc") && hoas.includes("Quyền") && hoas.includes("Khoa") && hoas.includes("Kỵ"))) hoaOk = false
  }
  ok(chinhOk, "sweep 96 lá số: đủ 14 chính tinh, mỗi sao đúng 1 lần")
  ok(cungOk, "sweep: 12 cung khác tên, đủ bộ")
  ok(dhOk, "sweep: đại hạn phủ 12 cung")
  ok(cachOk, "sweep: cachCuc là mảng + menhCach có luận (không ném lỗi)")
  ok(hoaOk, "sweep: Tứ Hóa Lộc/Quyền/Khoa/Kỵ đều gắn được vào sao đã an")
}

// === Property sweep các engine khác (chống hồi quy) ===
{
  let luOk = true, zoOk = true, nuOk = true
  for (let y = 1990; y <= 1993; y++) for (let mo = 1; mo <= 12; mo++) for (let d = 1; d <= 28; d++) {
    const al = L.solar2lunar(d, mo, y)
    if (!(al.month >= 1 && al.month <= 12 && al.day >= 1 && al.day <= 30 && al.year >= 1989 && al.year <= 1993)) luOk = false
    const z = Z.getZodiac(d, mo); if (!z || !z.ten) zoOk = false
    const lp = N.computeLifePath(d, mo, y); if (![1,2,3,4,5,6,7,8,9,11,22,33].includes(lp.lp)) nuOk = false
    const py = N.personalYear(d, mo, 2026); if (!(py >= 1 && py <= 9)) nuOk = false
  }
  ok(luOk, "sweep lịch âm 4 năm: tháng 1–12, ngày 1–30, năm hợp lệ")
  ok(zoOk, "sweep cung hoàng đạo: mọi ngày ra 1 cung hợp lệ")
  ok(nuOk, "sweep thần số học: Life Path ∈ tập chuẩn, Personal Year 1–9")
}
{
  const stars14 = ["Tử Vi","Thiên Cơ","Thái Dương","Vũ Khúc","Thiên Đồng","Liêm Trinh","Thiên Phủ","Thái Âm","Tham Lang","Cự Môn","Thiên Tướng","Thiên Lương","Thất Sát","Phá Quân"]
  const cung12 = ["Mệnh","Phụ Mẫu","Phúc Đức","Điền Trạch","Quan Lộc","Nô Bộc","Thiên Di","Tật Ách","Tài Bạch","Tử Tức","Phu Thê","Huynh Đệ"]
  let scOk = true, tot = 0
  for (const st of stars14) for (const cu of cung12) { const t = TVSC[st] && TVSC[st][cu]; if (!t || t.length < 12) scOk = false; else tot++ }
  ok(scOk && tot === 168, "SAO_CUNG: đủ 168 luận điểm (14 sao × 12 cung), không rỗng")
}
{
  const ds = TV.DO_SANG, LV = ['M', 'V', 'Đ', 'B', 'H']
  const names14 = ["Tử Vi","Thiên Cơ","Thái Dương","Vũ Khúc","Thiên Đồng","Liêm Trinh","Thiên Phủ","Thái Âm","Tham Lang","Cự Môn","Thiên Tướng","Thiên Lương","Thất Sát","Phá Quân"]
  eq(Object.keys(ds).length, 14, "DO_SANG: đủ 14 chính tinh")
  let dsOk = true
  for (const nm of names14) { const a = ds[nm]; if (!a || a.length !== 12 || a.some(x => !LV.includes(x))) dsOk = false }
  ok(dsOk, "DO_SANG: mỗi sao đủ 12 cung, ký tự ∈ {M,V,Đ,B,H}")
  ok(!ds['Tử Vi'].includes('H') && !ds['Thiên Phủ'].includes('H'), "Tử Vi & Thiên Phủ không có Hãm địa")
  eq(ds['Thái Dương'][0], 'H', "Thái Dương tại Tý = Hãm (tracuutuvi)")
  eq(ds['Thái Dương'][6], 'M', "Thái Dương tại Ngọ = Miếu")
  eq(ds['Thái Âm'][6], 'H', "Thái Âm tại Ngọ = Hãm")
  eq(ds['Thái Âm'][9], 'M', "Thái Âm tại Dậu = Miếu")
  eq(ds['Phá Quân'][0], 'M', "Phá Quân tại Tý = Miếu")
  eq(ds['Liêm Trinh'][6], 'V', "Liêm Trinh tại Ngọ = Vượng")
  eq(ds['Tham Lang'][1], 'M', "Tham Lang tại Sửu = Miếu")
  const ls = TV.anSao({ lunarDay: 15, lunarMonth: 4, year: 1958, hourRank: 6, gender: 'nam', viewYear: 2026 })
  let hasDo = false
  for (const p of ls.palaces) for (const st of p.sao) if (st.loai === 'chinh' && st.do) hasDo = true
  ok(hasDo, "anSao: chính tinh được gắn st.do (độ sáng)")
}
console.log(`\n${fail === 0 ? 'OK TAT CA' : 'FAIL'} ${pass} pass / ${fail} fail`)
process.exit(fail === 0 ? 0 : 1)
