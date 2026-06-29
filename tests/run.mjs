/* Bộ kiểm thử logic Tam Sở (thuần Node ESM, không cần framework).
 * Chạy: npm test   (hoặc: node tests/run.mjs)
 * Bảo vệ các mốc tính toán đã kiểm chứng khỏi hồi quy. */
import * as N from '../src/data/numerology.js'
import * as V from '../src/data/tuvi.js'
import * as L from '../src/data/lunar.js'
import * as T from '../src/data/tarot.js'
import { spreadSynthesis } from '../src/data/tarotSynth.js'
import * as I from '../src/data/iching.js'
import * as Z from '../src/data/zodiac.js'
import * as R from '../src/data/report.js'
import * as SLS from '../src/data/soLaSoSynth.js'
import { weaveCast } from '../src/data/ichingSynth.js'
import { weaveNumbers } from '../src/data/numerologySynth.js'
import { weaveDay } from '../src/data/dayWeave.js'
import { drawCards } from '../src/data/tarot.js'
import * as SITE from '../src/data/site.js'
import * as COLL from '../src/data/collection.js'
import * as SEO from '../src/data/seo.js'
import * as REL from '../src/data/related.js'
import * as CG from '../src/data/congiap.js'
import * as ZD from '../src/data/zodiacDeep.js'
import * as TD from '../src/data/tarotDeep.js'
import * as NDP from '../src/data/numerologyDeep.js'
import * as TV from '../src/data/tuvidauso.js'
import { SAO_CUNG as TVSC } from '../src/data/tuvi-saocung.js'
import { SAO_KHUYEN } from '../src/data/saoKhuyen.js'
import * as DC from '../src/data/dichua.js'
import { readFileSync } from 'node:fs'

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
global.window = { location: { protocol: 'https:', origin: 'https://tam-so.vercel.app', pathname: '/' } }
eq(SITE.shareUrl('/tarot'), 'https://tam-so.vercel.app/tarot', 'shareUrl path-mode (http)')
eq(SITE.shareUrl('/than-so-hoc', 'd=1&m=2'), 'https://tam-so.vercel.app/than-so-hoc?d=1&m=2', 'shareUrl path-mode co query')
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
{
  // doSangSummary: dữ liệu + câu mô tả nhẹ nhàng
  const ls = TV.anSao({ lunarDay: 15, lunarMonth: 4, year: 1958, hourRank: 6, gender: 'nam', viewYear: 2026 })
  const ds = TV.doSangSummary(ls)
  ok(ds && typeof ds.text === 'string' && ds.text.length > 10, "doSangSummary: trả về object có text")
  ok(ds && (ds.manh + ds.binh + ds.ham) === ds.menhSao.length, "doSangSummary: manh+binh+ham = số chính tinh Mệnh")
  ok(TV.doSangSummary(null) === null, "doSangSummary(null) an toàn → null")
  // không bao giờ phán xấu kiểu tuyệt đối
  ok(!/chắc chắn (xấu|thất bại|nghèo|chết)/i.test(ds.text), "doSangSummary: không phán xấu tuyệt đối")
}
{
  // STRESS: quét nhiều lá số — engine không crash, mọi chính tinh có st.do hợp lệ
  const LV = ['M','V','Đ','B','H']; let n = 0, sOk = true
  for (const year of [1960, 1985, 2000, 2010, 1992]) for (const mo of [1,4,7,11]) for (const day of [1,8,15,23,30]) for (const hr of [1,4,7,12]) for (const g of ['nam','nu']) {
    let ls; try { ls = TV.anSao({ lunarDay: day, lunarMonth: mo, year, hourRank: hr, gender: g, viewYear: 2026 }) } catch(e){ sOk=false; continue }
    if (!ls || ls.palaces.length !== 12) { sOk = false; continue }
    for (const p of ls.palaces) for (const st of p.sao) if (st.loai === 'chinh' && !LV.includes(st.do)) sOk = false
    if (!TV.doSangSummary(ls)) sOk = false
    n++
  }
  ok(sOk && n === 800, "stress " + n + " lá số: an sao không lỗi, st.do hợp lệ, doSangSummary chạy")
}
{
  // Zodiac: nội dung sâu + tử vi hôm nay (tất định)
  const ens = Z.ZODIAC.map(z => z.en)
  ok(Object.keys(Z.ZODIAC_DEEP).length === 12 && ens.every(e => Z.ZODIAC_DEEP[e] && Z.ZODIAC_DEEP[e].tinhYeu && Array.isArray(Z.ZODIAC_DEEP[e].hopVoi)), "ZODIAC_DEEP: đủ 12 cung + tình yêu + hợp với")
  ok(Z.zodiacBySlug('bach-duong') && Z.zodiacBySlug('bach-duong').en === 'Aries', "zodiacBySlug('bach-duong') = Aries")
  ok(Z.zodiacBySlug('khong-co') === null, "zodiacBySlug slug sai → null")
  const d1 = Z.dailyHoroscope('Leo', '2026-06-19'), d2 = Z.dailyHoroscope('Leo', '2026-06-19'), d3 = Z.dailyHoroscope('Leo', '2026-06-20')
  ok(JSON.stringify(d1) === JSON.stringify(d2), "dailyHoroscope TẤT ĐỊNH (cùng cung+ngày)")
  ok(JSON.stringify(d1) !== JSON.stringify(d3), "dailyHoroscope đổi theo ngày")
  ok([d1.tongQuan, d1.tinhCam, d1.congViec, d1.taiChinh, d1.loiKhuyen].every(x => typeof x === 'string' && x.length > 8) && d1.nangLuong >= 2 && d1.nangLuong <= 5, "dailyHoroscope: 5 mục text + năng lượng 2..5")
  let aOk = true; for (const e of ens) { const h = Z.dailyHoroscope(e, '2026-06-19'); if (!h.tongQuan || h.nangLuong < 2 || h.nangLuong > 5) aOk = false }
  ok(aOk, "dailyHoroscope hợp lệ cho cả 12 cung")
}
{
  // Tarot slug
  const slugs = T.TAROT_CARDS.map(T.cardSlug)
  ok(new Set(slugs).size === 78, "cardSlug: 78 slug DUY NHẤT")
  ok(T.cardBySlug('the-fool') && T.cardBySlug('the-fool').nameVi === 'Gã Khờ', "cardBySlug('the-fool') = Gã Khờ")
  ok(T.cardBySlug('khong-ton-tai') === null, "cardBySlug slug sai → null")
  ok(T.TAROT_CARDS.every(c => T.cardBySlug(T.cardSlug(c)) === c), "cardSlug↔cardBySlug roundtrip cho cả 78 lá")
  ok(T.TAROT_SPREADS.money && T.TAROT_SPREADS.money.positions.length === 5, "trải Tài chính 5 lá")
}
{
  // — H07: route 404 + slug sai → NotFound (chống hồi quy wiring) —
  const read = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  const main = read('main.jsx')
  ok(main.includes('path="*"') && (main.includes('import NotFound') || main.includes('const NotFound = lazy')), 'main.jsx: có route catch-all 404 + import NotFound')
  ok(/export default function NotFound/.test(read('components/NotFound.jsx')), 'NotFound.jsx: có export default')
  const tarot = read('pages/Tarot.jsx')
  ok(/function TarotIndex\(\)/.test(tarot), 'Tarot: tách TarotIndex khỏi wrapper')
  ok(/export default function Tarot\(\)/.test(tarot) && /cardBySlug\(slug\)/.test(tarot) && /<CardPage card=/.test(tarot), 'Tarot: default export nhánh theo slug → CardPage (chống hồi quy H06)')
  ok(/<NotFound /.test(tarot), 'Tarot: slug lá sai → NotFound')
  ok(/import NotFound/.test(read('pages/Numerology.jsx')) && /<NotFound /.test(read('pages/Numerology.jsx')), 'Numerology: slug số sai → NotFound')
  ok(/import NotFound/.test(read('pages/Zodiac.jsx')) && /<NotFound /.test(read('pages/Zodiac.jsx')), 'Zodiac: slug cung sai → NotFound')
}

// === M04: Bộ sưu tập (collection.js) — lưu reading yêu thích ===
{
  ok(COLL.KIND_META.tarot && COLL.KIND_META.iching && COLL.kindMeta('tarot').label === 'Tarot', 'KIND_META có tarot+iching; kindMeta trả nhãn')
  ok(COLL.kindMeta('khong-co').label === 'Khác', 'kindMeta fallback → Khác')
  ok(COLL.makeId() !== COLL.makeId(), 'makeId sinh id khác nhau')
  let a = []
  a = COLL.addItem({ kind: 'tarot', sig: 't1', title: 'Ba lá', lines: ['Quá khứ: X'] }, a)
  a = COLL.addItem({ kind: 'iching', sig: 'i1', title: 'Quẻ 1' }, a)
  eq(a.length, 2, 'addItem: 2 mục khác sig')
  ok(a[0].id && typeof a[0].t === 'number', 'mục có id + mốc thời gian')
  a = COLL.addItem({ kind: 'tarot', sig: 't1', title: 'Ba lá (lại)' }, a)
  eq(a.length, 2, 'addItem trùng sig → KHÔNG nhân đôi')
  eq(a[0].sig, 't1', 'mục trùng được đưa lên đầu (làm tươi)')
  ok(COLL.hasSig('i1', a) && !COLL.hasSig('zzz', a), 'hasSig nhận đúng')
  a = COLL.removeItem(a[0].id, a)
  eq(a.length, 1, 'removeItem bỏ đúng 1 mục')
  let big = []
  for (let i = 0; i < COLL.MAX_ITEMS + 15; i++) big = COLL.addItem({ kind: 'tarot', sig: 's' + i, title: '#' + i }, big)
  eq(big.length, COLL.MAX_ITEMS, 'addItem giới hạn ' + COLL.MAX_ITEMS + ' mục (cap)')
  ok(big[0].title === '#' + (COLL.MAX_ITEMS + 14), 'mục mới nhất nằm đầu sau khi cap')
  eq(COLL.clearCollection().length, 0, 'clearCollection → rỗng')
  const txt = COLL.collectionToText(a)
  ok(txt.includes('BỘ SƯU TẬP') && txt.includes('Tam Sở'), 'collectionToText có tiêu đề')
  ok(COLL.collectionToText([]) === 'Bộ sưu tập trống.', 'collectionToText rỗng → câu báo trống')
  const it1 = COLL.itemToText({ kind: 'tarot', title: 'X', lines: ['a', 'b'], t: Date.now() })
  ok(it1.includes('[Tarot]') && it1.includes('X') && it1.includes('a'), 'itemToText gồm nhãn+tiêu đề+dòng')
}
{
  // M04 wiring: route + trang + nút Lưu (Tarot/Kinh Dịch) + nav bookmark
  const read = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  const main = read('main.jsx')
  ok((main.includes('import Collection') || main.includes('const Collection = lazy')) && main.includes('path="bo-suu-tap"'), 'main.jsx: import + route /bo-suu-tap')
  ok(/export default function Collection/.test(read('pages/Collection.jsx')), 'Collection.jsx: có export default')
  const lay = read('components/Layout.jsx')
  ok(lay.includes('countCollection') && lay.includes('/bo-suu-tap') && /function CollBtn/.test(lay), 'Layout: nút bookmark + countCollection + link')
  const tarot = read('pages/Tarot.jsx')
  ok(/saveReading/.test(tarot) && tarot.includes("from '../data/collection.js'") && tarot.includes('Lưu vào bộ sưu tập'), 'Tarot: nút Lưu vào bộ sưu tập')
  const ich = read('pages/IChing.jsx')
  ok(ich.includes("from '../data/collection.js'") && /savedCast/.test(ich) && ich.includes('Lưu vào bộ sưu tập'), 'Kinh Dịch: nút Lưu vào bộ sưu tập')
}

// === SEO meta (seo.js builder + wiring usePageSeo trên 3 trang sâu) ===
{
  eq(SEO.absUrl('/'), 'https://tam-so.vercel.app/', 'absUrl / → gốc có dấu /')
  eq(SEO.absUrl('/tarot/the-fool'), 'https://tam-so.vercel.app/tarot/the-fool', 'absUrl ghép path tuyệt đối')
  eq(SEO.absUrl('tarot/x'), 'https://tam-so.vercel.app/tarot/x', 'absUrl tự thêm / khi thiếu')
  eq(SEO.OG_IMAGE, 'https://tam-so.vercel.app/og.png', 'OG_IMAGE đúng')
  const ld = SEO.breadcrumbLd([{ name: 'Trang chủ', path: '/' }, { name: 'Tarot', path: '/tarot' }, { name: 'The Fool' }])
  eq(ld['@type'], 'BreadcrumbList', 'breadcrumbLd loại BreadcrumbList')
  eq(ld.itemListElement.length, 3, 'breadcrumb 3 mục')
  eq(ld.itemListElement[0].position, 1, 'mục đầu position=1')
  eq(ld.itemListElement[1].item, 'https://tam-so.vercel.app/tarot', 'mục có path → item URL tuyệt đối')
  ok(ld.itemListElement[2].item === undefined, 'mục cuối (trang hiện tại) KHÔNG có item')
  ok(JSON.stringify(SEO.breadcrumbLd(null)).includes('BreadcrumbList'), 'breadcrumbLd null không vỡ')
  const readSeo = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  const useSeo = readSeo('components/useSeo.js')
  ok(/export function usePageSeo/.test(useSeo) && useSeo.includes('canonical') && useSeo.includes('application/ld+json') && useSeo.includes('og:url'), 'useSeo: canonical + JSON-LD + og:url')
  for (const [f, needle] of [['pages/Zodiac.jsx', 'ZODIAC_SLUG'], ['pages/Tarot.jsx', 'cardSlug('], ['pages/Numerology.jsx', '/than-so-hoc/so/']]) {
    const src = readSeo(f)
    ok(src.includes("from '../components/useSeo.js'") && src.includes('usePageSeo({') && src.includes('breadcrumb:') && src.includes(needle), 'wiring SEO trong ' + f)
  }
}


// === Nội dung liên quan (related.js — internal-link chéo đa hệ) ===
{
  const sign = REL.relatedForSign('Aries')
  eq(sign.length, 3, 'relatedForSign(Aries) trả đúng 3 link')
  eq(sign[0].to, '/tarot/the-emperor', 'Aries → Tarot Hoàng Đế (Golden Dawn)')
  eq(REL.relatedForSign('Scorpio')[0].to, '/tarot/death', 'Scorpio → Tarot Cái Chết (Golden Dawn)')
  ok(REL.relatedForSign('Aries').some(x => x.to === '/than-so-hoc/so/1'), 'Aries có link số may mắn 1')
  { const sys = new Set(REL.relatedForSign('Leo').map(x => x.sys)); eq(sys.size, 3, 'relatedForSign(Leo): 3 hệ khác nhau, không trùng hệ') }

  const emp = T.TAROT_CARDS.find(c => c.name === 'The Emperor')
  const star = T.TAROT_CARDS.find(c => c.name === 'The Star')
  const w5 = T.TAROT_CARDS.find(c => c.suit === 'Gậy' && c.roman === '5')
  eq(REL.relatedForCard(emp)[0].to, '/cung-hoang-dao/bach-duong', 'The Emperor → cung Bạch Dương')
  ok(REL.relatedForCard(emp).some(x => x.to === '/than-so-hoc/so/4'), 'The Emperor (IV) → số 4')
  eq(REL.relatedForCard(star)[0].to, '/cung-hoang-dao/bao-binh', 'The Star → cung Bảo Bình')
  ok(REL.relatedForCard(star).some(x => x.to === '/than-so-hoc/so/8'), 'The Star (XVII) → số 8 (1+7)')
  eq(REL.relatedForCard(w5)[0].to, '/cung-hoang-dao/su-tu', 'Gậy 5 (Thổ tinh trong Sư Tử) → cung Sư Tử')
  ok(REL.relatedForCard(emp).every(x => x.sys !== 'Tarot'), 'trang LÁ không tự link về chính hệ Tarot')
  { const court = T.TAROT_CARDS.find(c => c.arcana !== 'major' && !(c.roman === 'Át' || /^\d+$/.test(String(c.roman)))); ok(REL.relatedForCard(court).length >= 3, 'lá hình người vẫn đủ ≥3 link (dự phòng đa hệ)') }

  eq(REL.relatedForNumber('1')[0].to, '/cung-hoang-dao/bach-duong', 'Số 1 → cung Bạch Dương (số may mắn)')
  ok(REL.relatedForNumber('1').some(x => x.to === '/tarot/the-magician'), 'Số 1 → Tarot Nhà Ảo Thuật (lá 1)')
  ok(REL.relatedForNumber('8').some(x => x.to === '/tarot/strength'), 'Số 8 → Tarot Sức Mạnh (lá 8)')
  ok(REL.relatedForNumber('11').some(x => x.to === '/tarot/justice'), 'Số 11 → Tarot Công Lý (lá 11)')
  eq(REL.relatedForNumber('33').length, 3, 'Số 33 (không có lá trực tiếp) vẫn đủ 3 link')
  eq(REL.relatedForNumber('99').length, 0, 'số không hợp lệ → rỗng')

  const validTop = new Set(['/tarot', '/than-so-hoc', '/cung-hoang-dao', '/kinh-dich', '/ho-so'])
  const linkOk = x => {
    if (validTop.has(x.to)) return true
    let m = x.to.match(/^\/tarot\/(.+)$/); if (m) return !!T.cardBySlug(m[1])
    m = x.to.match(/^\/cung-hoang-dao\/(.+)$/); if (m) return !!Z.zodiacBySlug(m[1])
    m = x.to.match(/^\/than-so-hoc\/so\/(.+)$/); if (m) return !!N.NUMEROLOGY[m[1]]
    return false
  }
  const allOk = arr => arr.length >= 3 && arr.every(linkOk)
  ok(Z.ZODIAC.every(z => allOk(REL.relatedForSign(z.en))), '12 cung: mỗi trang ≥3 link & route/slug hợp lệ')
  ok(T.TAROT_CARDS.every(c => allOk(REL.relatedForCard(c))), '78 lá: mỗi trang ≥3 link & route/slug hợp lệ')
  ok(Object.keys(N.NUMEROLOGY).every(k => allOk(REL.relatedForNumber(k))), '12 số: mỗi trang ≥3 link & route/slug hợp lệ')

  const rd = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  for (const [f, call] of [['pages/Zodiac.jsx', 'relatedForSign(z.en)'], ['pages/Tarot.jsx', 'relatedForCard(card)'], ['pages/Numerology.jsx', 'relatedForNumber(k)']]) {
    const src = rd(f)
    ok(src.includes("from '../components/RelatedLinks.jsx'") && src.includes('<RelatedLinks items={' + call + '}'), 'wiring RelatedLinks trong ' + f)
  }
}


// === A01: SEO meta cho TRANG INDEX từng hệ (canonical + og:url + breadcrumb) ===
{
  const rd = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  const idx = [
    ['pages/Tarot.jsx', "path: '/tarot'"],
    ['pages/Numerology.jsx', "path='/than-so-hoc'"],
    ['pages/Zodiac.jsx', "path='/cung-hoang-dao'"],
    ['pages/IChing.jsx', "path: '/kinh-dich'"],
    ['pages/LaSoTuVi.jsx', "path: '/la-so-tu-vi'"],
    ['pages/TuVi.jsx', "path: '/tu-vi'"],
    ['pages/Profile.jsx', "path: '/ho-so'"],
    ['pages/Sources.jsx', "path: '/nguon'"]
  ]
  for (const [f, pathMarker] of idx) {
    const src = rd(f)
    const hasHook = src.includes('usePageSeo(') || src.includes('<SeoTag ')
    ok(hasHook && src.includes(pathMarker) && src.includes("name: 'Trang chủ', path: '/'"), 'A01 wiring SEO index trong ' + f + ' (' + pathMarker + ')')
  }
}

// === C02: Tử vi hôm nay 12 con giáp (congiap.js) ===
{
  const slugs = CG.CONGIAP.map(c => c.slug)
  eq(CG.CONGIAP.length, 12, 'CONGIAP: đủ 12 con giáp')
  eq(new Set(slugs).size, 12, 'CONGIAP_SLUG: 12 slug DUY NHẤT (phân biệt Tý↔Tỵ, Thìn↔Thân)')
  ok(CG.conGiapBySlug('ty') && CG.conGiapBySlug('ty').ten === 'Tý', "conGiapBySlug('ty') = Tý")
  ok(CG.conGiapBySlug('ti') && CG.conGiapBySlug('ti').ten === 'Tỵ', "conGiapBySlug('ti') = Tỵ (không lẫn Tý)")
  ok(CG.conGiapBySlug('khong-co') === null, 'conGiapBySlug slug sai → null')
  ok(CG.CONGIAP.every(c => CG.conGiapBySlug(c.slug) === c), 'slug ↔ conGiapBySlug roundtrip cả 12')
  const a = CG.dailyConGiap('Tý', '2026-06-19'), b = CG.dailyConGiap('Tý', '2026-06-19'), c = CG.dailyConGiap('Tý', '2026-06-20')
  ok(JSON.stringify(a) === JSON.stringify(b), 'dailyConGiap TẤT ĐỊNH (cùng tuổi+ngày)')
  ok(JSON.stringify(a) !== JSON.stringify(c), 'dailyConGiap đổi theo ngày')
  ok([a.tongQuan, a.tinhCam, a.congViec, a.taiChinh, a.loiKhuyen].every(x => typeof x === 'string' && x.length > 8) && a.nangLuong >= 2 && a.nangLuong <= 5, 'dailyConGiap: 5 mục text + năng lượng 2..5')
  let allDayOk = true; for (const c2 of CG.CONGIAP) { const h = CG.dailyConGiap(c2.ten, '2026-06-19'); if (!h.tongQuan || h.nangLuong < 2 || h.nangLuong > 5) allDayOk = false }
  ok(allDayOk, 'dailyConGiap hợp lệ cho cả 12 con giáp')
  const hk = CG.hopKhacChi('Tý')
  ok(hk.tamHop.includes('Thân') && hk.tamHop.includes('Thìn') && hk.tamHop.length === 2, 'hopKhacChi(Tý): tam hợp Thân–Thìn')
  eq(hk.lucHop, 'Sửu', 'hopKhacChi(Tý): lục hợp Sửu')
  eq(hk.lucXung, 'Ngọ', 'hopKhacChi(Tý): lục xung Ngọ')
  ok(CG.CONGIAP.every(c2 => { const r = CG.relatedForConGiap(c2.ten); return r.length >= 3 && new Set(r.map(x => x.sys)).size === r.length && r.every(x => x.to.startsWith('/')) }), 'relatedForConGiap: ≥3 link nội bộ, không trùng hệ, route nội bộ')
  ok(CG.recentYears('Tý').includes(2008) && CG.recentYears('Tý').every(y => (2008 - y) % 12 === 0), 'recentYears(Tý): năm cách nhau 12, gồm 2008')
}
{
  // C02 wiring: route /con-giap + import + Home link + sitemap
  const read = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  const main = read('main.jsx')
  ok((main.includes('import ConGiap') || main.includes('const ConGiap = lazy')) && main.includes('path="con-giap"') && main.includes('path="con-giap/:slug"'), 'main.jsx: import + route /con-giap (+:slug)')
  ok(/export default function ConGiap/.test(read('pages/ConGiap.jsx')), 'ConGiap.jsx: có export default')
  const cg = read('pages/ConGiap.jsx')
  ok(cg.includes("from '../components/useSeo.js'") && cg.includes('usePageSeo({') && cg.includes('breadcrumb:'), 'ConGiap: SEO meta động + breadcrumb')
  ok(read('pages/Home.jsx').includes('/con-giap'), 'Home: có link sang /con-giap')
  const sm = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  ok(sm.includes('/con-giap/ty') && sm.includes('/con-giap/ti') && sm.includes('/con-giap/hoi'), 'sitemap: có URL con giáp (ty, ti, hoi)')
}

// === C06 đợt 1: nội dung DÀY 12 cung (zodiacDeep.js) ===
{
  const ens = Z.ZODIAC.map(z => z.en)
  eq(Object.keys(ZD.ZODIAC_EXTRA).length, 12, 'ZODIAC_EXTRA: đủ 12 cung')
  let allFields = true, minLen = true, hasCaveat = true, noAbsolute = true
  const banned = /(chắc chắn|chính xác 100|tuyệt đối|bảo đảm|nhất định sẽ|100%)/i
  for (const en of ens) {
    const x = ZD.ZODIAC_EXTRA[en]
    if (!x || !x.tomTat || !x.tinhCach || !x.sucKhoe || !x.loiKhuyen) { allFields = false; continue }
    if (x.tomTat.length < 40 || x.tinhCach.length < 120 || x.sucKhoe.length < 80 || x.loiKhuyen.length < 40) minLen = false
    if (!/tham khảo/.test(x.sucKhoe) || !/y tế/.test(x.sucKhoe)) hasCaveat = false
    if (banned.test(x.tomTat + ' ' + x.tinhCach + ' ' + x.sucKhoe + ' ' + x.loiKhuyen)) noAbsolute = false
  }
  ok(allFields, 'ZODIAC_EXTRA: mỗi cung đủ 4 mục (tomTat/tinhCach/sucKhoe/loiKhuyen)')
  ok(minLen, 'ZODIAC_EXTRA: mỗi mục đạt độ dài tối thiểu (nội dung dày)')
  ok(hasCaveat, 'ZODIAC_EXTRA: phần sức khỏe luôn có caveat tham khảo + y tế')
  ok(noAbsolute, 'ZODIAC_EXTRA: KHÔNG dùng từ phán tuyệt đối/giật tít')
  const zsrc = readFileSync(new URL('../src/pages/Zodiac.jsx', import.meta.url), 'utf8')
  ok(zsrc.includes("from '../data/zodiacDeep.js'") && zsrc.includes('ZODIAC_EXTRA'), 'Zodiac.jsx: import ZODIAC_EXTRA')
  ok(zsrc.includes('ex.tinhCach') && zsrc.includes('ex.sucKhoe') && zsrc.includes('ex.loiKhuyen'), 'Zodiac.jsx: render tính cách/sức khỏe/lời khuyên')
}

// === C06 đợt 2: nội dung DÀY 78 lá Tarot (22 Ẩn Chính + 56 Ẩn Phụ) ===
{
  eq(T.TAROT_CARDS.length, 78, 'TAROT_CARDS: đủ 78 lá')
  eq(Object.keys(TD.TAROT_DEEP).length, 78, 'TAROT_DEEP: đủ 78 mục (mọi lá)')
  ok(new Set(T.TAROT_CARDS.map(c => c.id)).size === 78, 'TAROT_CARDS: 78 id DUY NHẤT (Ẩn Chính 0–21, Ẩn Phụ 22–77) → key theo id an toàn')
  let allFields = true, minLen = true, noAbsolute = true, idOk = true
  const banned = /(chắc chắn|chính xác 100|tuyệt đối|bảo đảm|nhất định sẽ|100%)/i
  for (const c of T.TAROT_CARDS) {
    const x = TD.TAROT_DEEP[c.id]
    if (!x) { idOk = false; continue }
    if (!x.love || !x.work || !x.finance || !x.advice) { allFields = false; continue }
    if (x.love.length < 25 || x.work.length < 25 || x.finance.length < 25 || x.advice.length < 25) minLen = false
    if (banned.test(x.love + ' ' + x.work + ' ' + x.finance + ' ' + x.advice)) noAbsolute = false
  }
  ok(idOk, 'TAROT_DEEP: phủ đủ id của cả 78 lá')
  ok(allFields, 'TAROT_DEEP: mỗi lá đủ 4 mục (love/work/finance/advice)')
  ok(minLen, 'TAROT_DEEP: mỗi mục đạt độ dài tối thiểu')
  ok(noAbsolute, 'TAROT_DEEP: KHÔNG dùng từ phán tuyệt đối/giật tít')
  const tsrc = readFileSync(new URL('../src/pages/Tarot.jsx', import.meta.url), 'utf8')
  ok(tsrc.includes("from '../data/tarotDeep.js'") && tsrc.includes('TAROT_DEEP[card.id]'), 'Tarot.jsx: CardPage dùng TAROT_DEEP[card.id] cho mọi lá')
  ok(tsrc.includes('Tài chính') && tsrc.includes('d.finance'), 'Tarot.jsx: render mục Tài chính')
}

// === C06 đợt 3: nội dung DÀY 12 Số Chủ Đạo (numerologyDeep.js) ===
{
  const nums = Object.keys(N.NUMEROLOGY)
  eq(Object.keys(NDP.NUM_DEEP).length, 12, 'NUM_DEEP: đủ 12 số chủ đạo')
  let allFields = true, minLen = true, noAbsolute = true, cover = true
  const banned = /(chắc chắn|chính xác 100|tuyệt đối|bảo đảm|nhất định sẽ|100%)/i
  for (const k of nums) {
    const x = NDP.NUM_DEEP[k]
    if (!x) { cover = false; continue }
    if (!x.tinhYeu || !x.suNghiep || !x.taiChinh || !x.loiKhuyen) { allFields = false; continue }
    if (x.tinhYeu.length < 25 || x.suNghiep.length < 25 || x.taiChinh.length < 25 || x.loiKhuyen.length < 25) minLen = false
    if (banned.test(x.tinhYeu + ' ' + x.suNghiep + ' ' + x.taiChinh + ' ' + x.loiKhuyen)) noAbsolute = false
  }
  ok(cover, 'NUM_DEEP: phủ đủ 12 số (1–9, 11, 22, 33)')
  ok(allFields, 'NUM_DEEP: mỗi số đủ 4 mục (tinhYeu/suNghiep/taiChinh/loiKhuyen)')
  ok(minLen, 'NUM_DEEP: mỗi mục đạt độ dài tối thiểu')
  ok(noAbsolute, 'NUM_DEEP: KHÔNG dùng từ phán tuyệt đối/giật tít')
  const nsrc = readFileSync(new URL('../src/pages/Numerology.jsx', import.meta.url), 'utf8')
  ok(nsrc.includes("from '../data/numerologyDeep.js'") && nsrc.includes('NUM_DEEP[k]'), 'Numerology.jsx: import + dùng NUM_DEEP[k]')
  ok(nsrc.includes('Sự nghiệp') && nsrc.includes('nd.taiChinh'), 'Numerology.jsx: render Sự nghiệp + Tài chính')
}

// === C04: trang hợp tuổi (/hop-tuoi) ===
{
  const read = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  const main = read('main.jsx')
  ok((main.includes('import HopTuoi') || main.includes('const HopTuoi = lazy')) && main.includes('path="hop-tuoi"') && main.includes('path="hop-tuoi/:slug"'), 'main.jsx: import + route /hop-tuoi (+:slug)')
  ok(/export default function HopTuoi/.test(read('pages/HopTuoi.jsx')), 'HopTuoi.jsx: export default')
  const h = read('pages/HopTuoi.jsx')
  ok(h.includes('hopTuoiChi') && h.includes('usePageSeo(') && h.includes('breadcrumb:'), 'HopTuoi: dùng hopTuoiChi + SEO meta')
  const sm = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  ok(sm.includes('/hop-tuoi/ty') && sm.includes('/hop-tuoi/hoi'), 'sitemap: có URL hợp tuổi')
  ok(V.hopTuoiChi('Tý', 'Thân') === 'Tam hợp' && V.hopTuoiChi('Tý', 'Ngọ') === 'Lục xung', 'hopTuoiChi: Tý–Thân tam hợp, Tý–Ngọ lục xung (nền cho trang)')
}

// === A02: og:image động (lá Tarot dùng ảnh RWS riêng) ===
{
  ok(T.TAROT_CARDS.every(c => typeof T.cardImageFile(c) === 'string' && /\.(jpg|jpeg|png)$/i.test(T.cardImageFile(c))), 'cardImageFile: cả 78 lá có tên file ảnh hợp lệ')
  eq(SEO.absUrl('/cards/Cups01.jpg'), 'https://tam-so.vercel.app/cards/Cups01.jpg', 'absUrl ghép /cards/ → URL tuyệt đối')
  const useSeoSrc = readFileSync(new URL('../src/components/useSeo.js', import.meta.url), 'utf8')
  ok(useSeoSrc.includes('image || OG_IMAGE'), 'useSeo: dùng tham số image (fallback OG_IMAGE)')
  const tsrc = readFileSync(new URL('../src/pages/Tarot.jsx', import.meta.url), 'utf8')
  ok(tsrc.includes("from '../data/seo.js'") && tsrc.includes("absUrl('/cards/' + cardImageFile(card))"), 'Tarot.jsx CardPage: og:image động từ ảnh lá')
}

// === M05: loading skeleton thống nhất ===
{
  ok(/export default function Skeleton/.test(readFileSync(new URL('../src/components/Skeleton.jsx', import.meta.url), 'utf8')), 'Skeleton.jsx: có export default')
  const ci = readFileSync(new URL('../src/components/CardImage.jsx', import.meta.url), 'utf8')
  ok(ci.includes("from './Skeleton.jsx'") && ci.includes('onLoad') && ci.includes('<Skeleton'), 'CardImage: dùng Skeleton + onLoad làm placeholder khi tải ảnh')
}

// === C05: rà giọng toàn site — không over-claim, luôn có khung tham khảo ===
{
  const texts = []
  const eat = v => { if (typeof v === 'string') texts.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(eat) }
  eat(Z.ZODIAC_DEEP); eat(ZD.ZODIAC_EXTRA); eat(TD.TAROT_DEEP); eat(NDP.NUM_DEEP); eat(V.CONGIAP_LUAN); eat(TVSC)
  for (const c of T.TAROT_CARDS) { eat(c.up); eat(c.rev) }
  for (const k of Object.keys(N.NUMEROLOGY)) { const n = N.NUMEROLOGY[k]; eat(n.desc); eat(n.strengths); eat(n.watch) }
  const overclaim = /chắc chắn sẽ|nhất định sẽ|bảo đảm.{0,8}(đúng|trúng|chính xác)|chính xác 100|100%\s*(đúng|chính xác)|cam kết.{0,12}(đúng|chính xác)/i
  const bad = texts.filter(t => overclaim.test(t))
  ok(texts.length > 300, 'C05: gom đủ nhiều luận điểm để rà (' + texts.length + ')')
  ok(bad.length === 0, 'C05: KHÔNG có câu over-claim/giật tít trong nội dung tự biên (' + (bad[0] || '') + ')')
  const rd = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  const framePages = ['pages/Tarot.jsx', 'pages/Zodiac.jsx', 'pages/Numerology.jsx', 'pages/ConGiap.jsx', 'pages/HopTuoi.jsx', 'pages/IChing.jsx', 'pages/LaSoTuVi.jsx']
  ok(framePages.every(f => /tham khảo|chiêm nghiệm|không phải lời (phán|tiên)/.test(rd(f))), 'C05: mọi trang hệ đều có khung "tham khảo/chiêm nghiệm"')
}

// === C03: trang Sinh năm (/sinh-nam programmatic) ===
{
  eq(V.tinhCanChi(1990).tenCanChi, 'Canh Ngọ', 'tinhCanChi 1990 = Canh Ngọ (nền /sinh-nam)')
  eq(V.tinhCanChi(2000).conGiap, 'Rồng', 'tinhCanChi 2000 cầm tinh Rồng')
  const read = rel => readFileSync(new URL('../src/' + rel, import.meta.url), 'utf8')
  const main = read('main.jsx')
  ok((main.includes('import SinhNam') || main.includes('const SinhNam = lazy')) && main.includes('path="sinh-nam"') && main.includes('path="sinh-nam/:year"'), 'main.jsx: import + route /sinh-nam (+:year)')
  ok(/export default function SinhNam/.test(read('pages/SinhNam.jsx')), 'SinhNam.jsx: export default')
  const s = read('pages/SinhNam.jsx')
  ok(s.includes('tinhCanChi') && s.includes('usePageSeo(') && s.includes('breadcrumb:'), 'SinhNam: dùng tinhCanChi + SEO meta')
  const sm = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  ok(sm.includes('/sinh-nam/1990') && sm.includes('/sinh-nam/2000'), 'sitemap: có URL sinh năm')
}

// === C06 đợt 4: lời khuyên 14 chính tinh (saoKhuyen.js) — làm dày sao×cung ===
{
  const stars14 = ["Tử Vi", "Thiên Cơ", "Thái Dương", "Vũ Khúc", "Thiên Đồng", "Liêm Trinh", "Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Thất Sát", "Phá Quân"]
  eq(Object.keys(SAO_KHUYEN).length, 14, 'SAO_KHUYEN: đủ 14 chính tinh')
  ok(stars14.every(s => typeof SAO_KHUYEN[s] === 'string' && SAO_KHUYEN[s].length >= 30), 'SAO_KHUYEN: mỗi sao có lời khuyên ≥30 ký tự')
  const banned = /(chắc chắn sẽ|nhất định sẽ|tuyệt đối|100%|bảo đảm)/i
  ok(stars14.every(s => !banned.test(SAO_KHUYEN[s])), 'SAO_KHUYEN: KHÔNG over-claim')
  // SAO_CUNG vốn đã dày: 168 luận điểm, mỗi điểm là câu hoàn chỉnh
  ok(stars14.every(s => Object.values(TVSC[s]).every(t => t.length >= 30)), 'SAO_CUNG: 168 luận điểm đều là câu đủ dày (≥30 ký tự)')
  const ls = readFileSync(new URL('../src/pages/LaSoTuVi.jsx', import.meta.url), 'utf8')
  ok(ls.includes("from '../data/saoKhuyen.js'") && ls.includes('SAO_KHUYEN[s.ten]'), 'LaSoTuVi: render lời khuyên sao')
}

// === C01: prerender meta tĩnh cho route landing (an toàn + có guard) ===
{
  const ps = readFileSync(new URL('../scripts/prerender.mjs', import.meta.url), 'utf8')
  ok(ps.includes('.test(tpl)') && ps.includes('không phải Vercel'), 'prerender: có GUARD base tuyệt đối (skip khi base ./)')
  ok(ps.includes('writeFileSync') && /catch\s*\(/.test(ps) && !ps.includes("writeFileSync(DIST + '/index.html'"), 'prerender: chỉ GHI THÊM file route + bọc try/catch (không sửa index.html)')
  ok(ps.includes('og:image') && ps.includes('canonical') && ps.includes('BreadcrumbList'), 'prerender: set title/description/canonical/og + JSON-LD breadcrumb')
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  ok(pkg.scripts.build.includes('prerender'), 'package.json: build chạy prerender sau vite build')
}

// === Tổng hợp trải bài Tarot (tarotSynth) — diễn giải dệt, giữ giọng tham khảo ===
{
  const overclaim = /chắc chắn sẽ|nhất định sẽ|tuyệt đối|bảo đảm|chính xác 100|100%/i
  const frame = /tham khảo|chiêm nghiệm|không phải lời (phán|tiên)/
  let allOk = true, frameOk = true, posOk = true, qOk = true, badEx = ''
  for (const sp of Object.keys(T.TAROT_SPREADS)) {
    const pos = T.TAROT_SPREADS[sp].positions
    for (let r = 0; r < 60; r++) {
      const picks = T.drawCards(pos.length)
      const q = r % 2 ? 'Mình nên tập trung vào điều gì?' : ''
      const out = spreadSynthesis(picks, pos, q)
      if (typeof out !== 'string' || out.length < 40) allOk = false
      if (overclaim.test(out)) { allOk = false; badEx = out }
      if (!frame.test(out)) { frameOk = false; badEx = out }
      if (pos.length > 1 && (!out.includes(pos[0]) || !out.includes(pos[pos.length - 1]))) posOk = false
      if (q && !out.includes(q)) qOk = false
    }
  }
  ok(allOk, 'tarotSynth: luôn ra chuỗi đủ dài & KHÔNG over-claim (mọi kiểu trải × 60) ' + (badEx ? '[' + badEx.slice(0, 60) + ']' : ''))
  ok(frameOk, 'tarotSynth: luôn có khung tham khảo/chiêm nghiệm/không phải lời tiên đoán')
  ok(posOk, 'tarotSynth: trải nhiều lá luôn nhắc vị trí đầu & cuối')
  ok(qOk, 'tarotSynth: nhắc lại câu hỏi khi người dùng nhập')
  const cups = T.TAROT_CARDS.filter(c => c.suit === 'Cốc').slice(0, 3).map(card => ({ card, up: true }))
  const synC = spreadSynthesis(cups, ['Quá khứ', 'Hiện tại', 'Tương lai'], '')
  ok(/Cốc nổi trội/.test(synC) && /cảm xúc/.test(synC), 'tarotSynth: nhận diện chất nổi trội & nêu trọng tâm tương ứng')
  const majors = T.TAROT_CARDS.filter(c => c.arcana === 'major').slice(0, 3).map(card => ({ card, up: true }))
  ok(/Ẩn Chính/.test(spreadSynthesis(majors, ['Quá khứ', 'Hiện tại', 'Tương lai'], '')), 'tarotSynth: nêu sức nặng Ẩn Chính khi nhiều lá lớn')
}


// === U05: hiệu ứng mở rộng (CountUp + stagger lưới) — wiring ===
{
  const rd = p => readFileSync(new URL('../src/' + p, import.meta.url), 'utf8')
  const cu = rd('components/CountUp.jsx')
  ok(/IntersectionObserver/.test(cu) && /prefers-reduced-motion/.test(cu) && /requestAnimationFrame/.test(cu), 'CountUp: có IO + reduced-motion + rAF')
  ok(/base = .reveal./.test(rd('components/Reveal.jsx')), 'Reveal: có prop base (tái dùng cho stagger)')
  const num = rd('pages/Numerology.jsx')
  ok(/import CountUp/.test(num) && num.includes('<CountUp end={res.lp}'), 'Numerology: CountUp gắn Số Chủ Đạo')
  ok(/import CountUp/.test(rd('components/Today.jsx')), 'Today: import CountUp cho số ngày')
  for (const p of ['pages/Tarot.jsx', 'pages/IChing.jsx', 'pages/Zodiac.jsx']) {
    const s = rd(p)
    ok(s.includes('base="stagger-parent"') && s.includes('--i'), p + ': lưới có stagger-parent + biến --i')
  }
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  ok(css.includes('.stagger-parent.in > *') && /prefers-reduced-motion/.test(css), 'CSS: stagger-parent + guard reduced-motion')
}


// === U06: stagger lan toả các lưới còn lại ===
ok(['pages/Home.jsx','pages/Numerology.jsx','pages/ConGiap.jsx','pages/HopTuoi.jsx'].every(p => readFileSync(new URL('../src/'+p, import.meta.url),'utf8').includes('stagger-parent')), 'U06: stagger gắn Home/Numerology/ConGiap/HopTuoi')

// === Diễn giải tổng hợp: weaveProfile (Hồ sơ) & weavePair (So đôi lá số) ===
{
  const overclaim = /chắc chắn sẽ|nhất định sẽ|tuyệt đối|bảo đảm|chính xác 100|100%/i
  const frame = /tham khảo|chiêm nghiệm|không phải lời (phán|tiên)/
  const mk = (lp, exp, py) => ({ lp: { lp, info: { title: 'Số ' + lp + ' — X', keys: ['kw'] }, master: false }, nn: exp == null ? null : { expression: exp }, py, curPin: { p: 4, c: 0 }, canChi: { conGiap: 'Ngọ', menhHanh: 'Thủy', napAm: 'Thiên Hà Thủy', chi: 'Ngọ' }, zodiac: { ten: 'Bạch Dương', nguyenTo: 'Lửa', en: 'Aries' } })
  let wpOk = true, wpFrame = true
  for (const [lp, exp, py] of [[8, 2, 5], [6, null, 1], [1, 1, 9], [11, 33, 3], [7, 4, 7]]) {
    const out = R.weaveProfile(mk(lp, exp, py))
    if (typeof out !== 'string' || out.length < 80 || overclaim.test(out)) wpOk = false
    if (!frame.test(out)) wpFrame = false
    if (exp !== lp && !out.includes('Số Chủ Đạo ' + lp)) wpOk = false
  }
  ok(wpOk, 'weaveProfile: chuỗi đủ dày, nhắc Số Chủ Đạo, KHÔNG over-claim')
  ok(wpFrame, 'weaveProfile: luôn có khung tham khảo/chiêm nghiệm')
  ok(R.weaveProfile(mk(5, 5, 5)).includes('cộng hưởng'), 'weaveProfile: nhận diện cộng hưởng khi Số Chủ Đạo = Vận Mệnh')

  const mp = (ma, mb, rel) => SLS.weavePair({ menhA: { chi: 'Hợi', ten: ma }, menhB: { chi: 'Tỵ', ten: mb }, phuTheA: { chi: 'Sửu', ten: 'Thiên Đồng' }, phuTheB: { chi: 'Mùi', ten: 'Thái Dương' }, rel })
  let wpairOk = true, noVerdict = true
  for (const rel of ['Tam hợp', 'Lục hợp', 'Lục xung', 'Tứ hành xung', 'Cùng tuổi', 'Bình thường']) {
    const out = mp('Tử Vi', 'vô chính diệu', rel)
    if (typeof out !== 'string' || out.length < 100 || overclaim.test(out) || !frame.test(out)) wpairOk = false
    if (!out.includes('KHÔNG phải kết luận hợp hay không hợp')) noVerdict = false
  }
  ok(wpairOk, 'weavePair: chuỗi đủ dày + khung tham khảo + KHÔNG over-claim (mọi quan hệ địa chi)')
  ok(noVerdict, 'weavePair: LUÔN nói rõ KHÔNG kết luận hợp/không hợp (đúng ràng buộc trang)')
  ok(/bổ khuyết/.test(mp('A', 'vô chính diệu', 'Tam hợp')), 'weavePair: nhận diện Mệnh vô chính diệu để gợi bổ khuyết')
}
// === Tổng hợp quẻ Dịch (ichingSynth.weaveCast) — dệt present→hào động→quẻ biến ===
{
  const overclaim = /chắc chắn sẽ|nhất định sẽ|tuyệt đối|bảo đảm|chính xác 100|100%/i
  const frame = /tham khảo|chiêm nghiệm|không phải lời (phán|tiên)/
  let allOk = true, frameOk = true, presOk = true, changedOk = true, badEx = ''
  for (let r = 0; r < 400; r++) {
    const c = I.castHexagram()
    const out = weaveCast(c)
    if (typeof out !== 'string' || out.length < 80 || overclaim.test(out)) { allOk = false; badEx = out }
    if (!frame.test(out)) { frameOk = false; badEx = out }
    if (!out.includes('' + c.present.n) || !out.includes(c.present.ten)) presOk = false
    if (c.changed && (!out.includes('' + c.changed.n) || !out.includes(c.changed.ten))) changedOk = false
  }
  ok(allOk, 'weaveCast: luôn ra chuỗi đủ dày & KHÔNG over-claim (×400) ' + (badEx ? '[' + badEx.slice(0, 60) + ']' : ''))
  ok(frameOk, 'weaveCast: luôn có khung tham khảo/chiêm nghiệm')
  ok(presOk, 'weaveCast: luôn nêu quẻ chính (số + tên)')
  ok(changedOk, 'weaveCast: nêu quẻ biến (số + tên) khi có hào động')
  const stat = weaveCast({ present: I.HEXAGRAMS[0], changed: null, changingPos: [] })
  ok(/không có hào động/.test(stat) && !/quẻ biến/.test(stat), 'weaveCast: không hào động → nêu tình thế ổn định, không nhắc quẻ biến')
  const one = weaveCast({ present: I.HEXAGRAMS[0], changed: I.HEXAGRAMS[42], changingPos: [5] })
  ok(/hào 5/.test(one) && /chủ quẻ/.test(one), 'weaveCast: một hào động nêu đúng ngôi hào (hào 5 = chủ quẻ)')
  const many = weaveCast({ present: I.HEXAGRAMS[0], changed: I.HEXAGRAMS[42], changingPos: [2, 4, 6] })
  ok(/hào 2/.test(many) && /hào 6/.test(many), 'weaveCast: nhiều hào động nêu hào thấp & cao nhất làm trọng tâm')
  const ij = readFileSync(new URL('../src/pages/IChing.jsx', import.meta.url), 'utf8')
  ok(ij.includes("from '../data/ichingSynth.js'") && ij.includes('weaveCast(cast)') && ij.includes('res.mh.present'), 'IChing.jsx: render weaveCast cho gieo xu + Mai Hoa')
}

// === Tổng hợp bộ số Thần số học (numerologySynth.weaveNumbers) ===
{
  const overclaim = /chắc chắn sẽ|nhất định sẽ|tuyệt đối|bảo đảm|chính xác 100|100%/i
  const frame = /tham khảo|chiêm nghiệm|không phải lời (phán|tiên)/
  const nums = [1,2,3,4,5,6,7,8,9,11,22,33]
  let allOk = true, frameOk = true, lpOk = true, badEx = ''
  for (let r = 0; r < 300; r++) {
    const pick = () => nums[Math.floor(Math.random()*nums.length)]
    const lp = pick(), expr = pick(), su = pick(), pe = pick(), ma = pick()
    const missing = [1,2,3,4,5,6,7,8,9].filter(() => Math.random() < 0.4)
    const out = weaveNumbers({ lp, expression: expr, soulUrge: su, personality: pe, maturity: ma, missing })
    if (typeof out !== 'string' || out.length < 120 || overclaim.test(out)) { allOk = false; badEx = out }
    if (!frame.test(out)) { frameOk = false; badEx = out }
    if (!out.includes('Số Chủ Đạo ' + lp) || !out.includes('Số Vận Mệnh ' + expr)) lpOk = false
  }
  ok(allOk, 'weaveNumbers: luôn ra chuỗi đủ dày & KHÔNG over-claim (×300) ' + (badEx ? '[' + badEx.slice(0,60) + ']' : ''))
  ok(frameOk, 'weaveNumbers: luôn có khung tham khảo/chiêm nghiệm')
  ok(lpOk, 'weaveNumbers: luôn nêu Số Chủ Đạo + Số Vận Mệnh')
  ok(/cộng hưởng/.test(weaveNumbers({ lp: 5, expression: 5, soulUrge: 2, personality: 7, maturity: 1, missing: [] })), 'weaveNumbers: nhận diện cộng hưởng khi Chủ Đạo = Vận Mệnh')
  ok(/khuyết số/.test(weaveNumbers({ lp: 1, expression: 2, soulUrge: 3, personality: 4, maturity: 5, missing: [7,9] })), 'weaveNumbers: nêu số Lo Shu còn khuyết')
  ok(/đủ cả chín số/.test(weaveNumbers({ lp: 1, expression: 2, soulUrge: 3, personality: 4, maturity: 5, missing: [] })), 'weaveNumbers: nhận diện Lo Shu đủ 9 số')
  const nj = readFileSync(new URL('../src/pages/Numerology.jsx', import.meta.url), 'utf8')
  ok(nj.includes("from '../data/numerologySynth.js'") && nj.includes('weaveNumbers({'), 'Numerology.jsx: render weaveNumbers trong Bộ số đầy đủ')
}

// === Dệt "quẻ hôm nay" (dayWeave.weaveDay) — nối lá Tarot + quẻ Dịch, bắc cầu ngũ hành ===
{
  const overclaim = /chắc chắn sẽ|nhất định sẽ|tuyệt đối|bảo đảm|chính xác 100|100%/i
  const frame = /tham khảo|chiêm nghiệm|không phải lời (phán|tiên)/
  let allOk = true, frameOk = true, nameOk = true, hexOk = true, sawSuit = false, sawMajor = false, badEx = ''
  for (let r = 0; r < 500; r++) {
    const p = drawCards(1)[0]
    const h = I.castHexagram().present
    const out = weaveDay({ card: p.card, up: p.up, hex: h, dayNum: 1 + (r % 9) })
    if (typeof out !== 'string' || out.length < 120 || overclaim.test(out)) { allOk = false; badEx = out }
    if (!frame.test(out)) { frameOk = false; badEx = out }
    if (!out.includes(p.card.nameVi)) nameOk = false
    if (!out.includes('' + h.n) || !out.includes(h.ten)) hexOk = false
    if (p.card.suit) { sawSuit = true; if (!/cây cầu Đông–Tây/.test(out)) allOk = false } else { sawMajor = true; if (!/hai lăng kính/.test(out)) allOk = false }
  }
  ok(allOk, 'weaveDay: chuỗi đủ dày + KHÔNG over-claim + đúng nhánh chất/Ẩn Chính (×500) ' + (badEx ? '[' + badEx.slice(0,60) + ']' : ''))
  ok(frameOk, 'weaveDay: luôn có khung tham khảo/không phải lời phán')
  ok(nameOk, 'weaveDay: luôn nêu tên lá bài')
  ok(hexOk, 'weaveDay: luôn nêu quẻ (số + tên)')
  ok(sawSuit && sawMajor, 'weaveDay: bộ test có chạm cả lá có chất lẫn Ẩn Chính')
  // ngũ hành: Gậy (Lửa→Hỏa) × quái Càn (Kim) = tương khắc
  const wands = T.TAROT_CARDS.find(c => c.suit === 'Gậy')
  const canHex = I.HEXAGRAMS.find(h => h.up === 'Càn')
  ok(/tương khắc/.test(weaveDay({ card: wands, up: true, hex: canHex, dayNum: 3 })), 'weaveDay: nhận diện ngũ hành tương khắc (Lửa×Kim)')
  // Cốc (Nước→Thủy) × quái Tốn (Mộc) = tương sinh
  const cups = T.TAROT_CARDS.find(c => c.suit === 'Cốc')
  const tonHex = I.HEXAGRAMS.find(h => h.up === 'Tốn')
  ok(/tương sinh/.test(weaveDay({ card: cups, up: true, hex: tonHex, dayNum: 3 })), 'weaveDay: nhận diện ngũ hành tương sinh (Thủy×Mộc)')
  const tj = readFileSync(new URL('../src/components/Today.jsx', import.meta.url), 'utf8')
  ok(tj.includes("from '../data/dayWeave.js'") && tj.includes('weaveDay({'), 'Today.jsx: render weaveDay trong khối Hôm nay')
}

// === Lịch vạn niên: can chi tháng âm lịch (monthCanChi, Ngũ Hổ Độn) ===
{
  eq(V.monthCanChi(2026, 5).tenCanChi, 'Giáp Ngọ', 'monthCanChi: tháng 5 ÂL/2026 = Giáp Ngọ (khớp ảnh)')
  eq(V.monthCanChi(2026, 1).tenCanChi, 'Canh Dần', 'monthCanChi: tháng Giêng 2026 (Bính Ngọ) = Canh Dần')
  eq(V.monthCanChi(2024, 1).tenCanChi, 'Bính Dần', 'monthCanChi: tháng Giêng 2024 (Giáp Thìn) = Bính Dần')
  // chi tháng: Giêng=Dần ... tháng m → chi (m+1)%12; tháng 11 = Tý, tháng 12 = Sửu
  eq(V.monthCanChi(2026, 11).chi, 'Tý', 'monthCanChi: tháng 11 ÂL = chi Tý')
  eq(V.monthCanChi(2026, 12).chi, 'Sửu', 'monthCanChi: tháng Chạp = chi Sửu')
  // can quay vòng 10: hai năm cùng can cho cùng can tháng
  eq(V.monthCanChi(2025, 3).can, V.monthCanChi(2025, 3).can, 'monthCanChi: tất định')
  const hj = readFileSync(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8')
  ok(hj.includes("import LichVanNien") && hj.includes('<LichVanNien />'), 'Home.jsx: có gắn LichVanNien')
  const lj = readFileSync(new URL('../src/components/LichVanNien.jsx', import.meta.url), 'utf8')
  ok(lj.includes('monthCanChi') && lj.includes('gioHoangDao') && lj.includes('solar2lunar') && /không phải lời phán/.test(lj), 'LichVanNien: dùng can chi + giờ hoàng đạo + khung tham khảo')
}

// — Đi chùa: dữ liệu khu + bộ thẻ xăm (thuần JS, test bằng Node) —
{
  ok(DC.DICHUA_LOCATIONS.length === 11, 'DICHUA_LOCATIONS: đủ 11 khu (khớp ảnh mockup)')
  ok(DC.DICHUA_LOCATIONS.every(l => l.id && l.ten && l.icon && l.bienHieu && l.moTa && l.scene && l.tone), 'DICHUA_LOCATIONS: mỗi khu đủ id/ten/icon/bienHieu/moTa/scene/tone')
  ok(DC.DICHUA_LOCATIONS.every(l => ['dawn', 'day', 'dusk', 'gold'].includes(l.tone)), 'DICHUA_LOCATIONS: tone hợp lệ')
  ok(new Set(DC.DICHUA_LOCATIONS.map(l => l.id)).size === 11, 'DICHUA_LOCATIONS: id duy nhất')
  ok(DC.locationById('chanh-dien').scene === 'dien' && DC.locationById('cong-tam-quan').scene === 'cong', 'locationById: trả đúng khu + scene')
  ok(DC.locationById('khong-co') === null, 'locationById slug sai → null')

  eq(DC.DICHUA_XAM.length, 16, 'DICHUA_XAM: đủ 16 thẻ')
  ok(new Set(DC.DICHUA_XAM.map(x => x.so)).size === 16, 'DICHUA_XAM: số thẻ duy nhất')
  ok(DC.DICHUA_XAM.every(x => ['Thượng', 'Trung Bình', 'Hạ'].includes(x.bac)), 'DICHUA_XAM: mỗi thẻ có bậc hợp lệ')
  ok(DC.DICHUA_XAM.every(x => Array.isArray(x.cau) && x.cau.length === 2 && x.dienGiai.length > 10 && x.loiKhuyen.length > 5), 'DICHUA_XAM: mỗi thẻ đủ câu + diễn giải + lời khuyên')
  let drawOk = true; for (let i = 0; i < 200; i++) { const x = DC.rutXam(); if (!x || typeof x.so !== 'number') drawOk = false }
  ok(drawOk, 'rutXam: luôn trả về 1 thẻ hợp lệ (200 lần)')
  ok(DC.xamBySo(1).cau.length === 2 && DC.xamBySo(999) === null, 'xamBySo: tra đúng + số sai → null')

  ok(Array.isArray(DC.loadLoiNguyen()) && DC.loadLoiNguyen().length === 0, 'loadLoiNguyen: chạy trong Node → mảng rỗng')
  ok(DC.countThapHuong() === 0, 'countThapHuong: chạy trong Node → 0')
  ok(Array.isArray(DC.loadXamLichSu()) && DC.loadXamLichSu().length === 0, 'loadXamLichSu: chạy trong Node (không có localStorage) → mảng rỗng')
  ok(typeof DC.clearLoiNguyen === 'function' && Array.isArray(DC.clearLoiNguyen()), 'clearLoiNguyen: tồn tại, trả mảng rỗng')
  ok(typeof DC.clearXamLichSu === 'function' && Array.isArray(DC.clearXamLichSu()), 'clearXamLichSu: tồn tại, trả mảng rỗng')
  ok(DC.addXamLichSu({ so: 3 }).length === 1 && DC.addXamLichSu({ so: 3 })[0].so === 3, 'addXamLichSu: trả về danh sách có thẻ vừa thêm (không lưu được trong Node nhưng vẫn tính đúng trong bộ nhớ, giống addLoiNguyen)')

  const dcj = readFileSync(new URL('../src/pages/DiChua.jsx', import.meta.url), 'utf8')
  ok(dcj.includes('loadXamLichSu') && dcj.includes('clearLoiNguyen') && dcj.includes('clearXamLichSu') && dcj.includes("setModal('lichsu')"), 'DiChua.jsx: có nút + modal Lịch Sử (lời nguyện + xăm đã rút) wire đủ')
  const sxj = readFileSync(new URL('../src/components/ShakeXam.jsx', import.meta.url), 'utf8')
  ok(sxj.includes('addXamLichSu'), 'ShakeXam.jsx: rút thẻ có lưu vào lịch sử (addXamLichSu)')

  const mj = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8')
  ok(mj.includes('path="/di-chua"') && mj.includes('DiChua'), 'main.jsx: route /di-chua (full-page) đã wire')
  ok(mj.indexOf('path="/di-chua"') < mj.indexOf('element={<Layout'), 'main.jsx: /di-chua nằm NGOÀI Layout (full page)')
  // Code-split (React.lazy + Suspense) — khoa lai toi uu, tranh vo tinh go
  ok(mj.includes('lazy(') && mj.includes('Suspense'), 'main.jsx: dung React.lazy + Suspense (code-split)')
  ok(mj.includes("lazy(() => import('./pages/Tarot.jsx'))") && mj.includes("lazy(() => import('./pages/IChing.jsx'))"), 'main.jsx: cac trang nang code-split dong (Tarot/IChing)')
  ok(mj.includes("import Home from './pages/Home.jsx'"), 'main.jsx: Home van eager (trang chu hien tuc thi)')
  const layCS = readFileSync(new URL('../src/components/Layout.jsx', import.meta.url), 'utf8')
  ok(layCS.includes('Suspense') && layCS.includes('<Outlet'), 'Layout.jsx: bao Suspense quanh Outlet (giu nav khi trang lazy tai)')
  const lj2 = readFileSync(new URL('../src/components/Layout.jsx', import.meta.url), 'utf8')
  ok(lj2.includes('/di-chua'), 'Layout.jsx: menu vẫn có liên kết tới /di-chua')
  const ts = readFileSync(new URL('../src/components/TempleScene.jsx', import.meta.url), 'utf8')
  ok(ts.includes('export default function TempleScene') && ts.includes('viewBox'), 'TempleScene.jsx: component SVG tồn tại')
  const sx = readFileSync(new URL('../src/components/ShakeXam.jsx', import.meta.url), 'utf8')
  ok(sx.includes('export default function ShakeXam') && sx.includes('devicemotion') && sx.includes('rutXam'), 'ShakeXam.jsx: lắc (devicemotion/pointer) → rutXam')
}

// Repo infrastructure: line endings
{
  const attrs = readFileSync(new URL('../.gitattributes', import.meta.url), 'utf8')
  ok(attrs.includes('* text=auto eol=lf'), '.gitattributes: force text files to LF')
  ok(attrs.includes('*.png binary') && attrs.includes('*.webp binary') && attrs.includes('*.ico binary'), '.gitattributes: mark image/icon formats as binary')
  ok(!attrs.includes('\r'), '.gitattributes: no CRLF inside attributes file')
}

console.log(`\n${fail === 0 ? 'OK TAT CA' : 'FAIL'} ${pass} pass / ${fail} fail`)
process.exit(fail === 0 ? 0 : 1)
