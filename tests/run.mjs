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
eq(V.THIEN_CAN.length, 10, 'Thien Can 10'); eq(V.DIA_CHI.length, 12, 'Dia Chi 12'); eq(V.NAP_AM.length, 30, 'Nap am 30')
ok(Object.keys(V.NAP_AM_NGHIA).length === 30 && Object.keys(V.CONGIAP_LUAN).length === 12, 'nap am nghia 30 + con giap 12')
ok(V.gioHoangDao('Ty').length === 12, 'gio hoang dao 12')
ok(V.tamTai(1990).nam.length === 3, 'tam tai 3 nam')
ok(V.cungPhi(1990, 'nam').cung && V.cungPhi(1990, 'nu').cung, 'cung phi nam+nu')
ok([1,2,3,4,5,6,7,8,9].every(n => N.PERSONAL_DAY_HINT[n]), 'personal day hint 1-9')
ok([1,2,3,4,5,6,7,8,9].every(n => N.PERSONAL_YEAR[n]), 'personal year 1-9')
ok([1,2,3,4,5,6,7,8,9,11,22,33].every(n => N.NUMEROLOGY[n]), 'numerology 1-9,11,22,33')
ok(N.computeNameNumbers('Nguyen Van An').expression >= 1, 'computeNameNumbers ok')
ok(N.loShu(22,10,1990).counts && Array.isArray(N.loShu(22,10,1990).missing), 'lo shu counts+missing')
ok(I.HEXAGRAMS.every(h => h.luan && h.y && h.src), '64 que co luan+y+src')
const _cast = I.castHexagram(); ok(_cast.lines.length === 6 && _cast.present && Array.isArray(_cast.changingPos), 'castHexagram 6 hao')
ok(I.readingGuide([]).length > 5 && I.readingGuide([2,5]).length > 5, 'readingGuide 0 + nhieu hao')
ok(I.maiHoa(2000,1,1,0).present && I.maiHoa(2000,1,1,0).changed, 'maiHoa que chinh+bien')
ok([1,2,3].includes(Z.decanOf(15,8).num), 'decan 1-3')
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

console.log(`\n${fail === 0 ? 'OK TAT CA' : 'FAIL'} ${pass} pass / ${fail} fail`)
process.exit(fail === 0 ? 0 : 1)
