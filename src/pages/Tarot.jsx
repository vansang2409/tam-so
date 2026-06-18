import { useState, useEffect } from 'react'
import { shareUrl as routeShareUrl } from '../data/site.js'
import { TAROT_CARDS, TAROT_SPREADS, drawCards } from '../data/tarot.js'
import Modal from '../components/Modal.jsx'
import CardImage from '../components/CardImage.jsx'
import { Badge } from '../components/Disclaimer.jsx'

const meaningOf = (c, up) => up ? (c.up || 'Từ khóa: ' + c.upKeys.join(', ')) : (c.rev || 'Từ khóa: ' + c.revKeys.join(', '))
const FILTERS = [
  { key: 'all', label: 'Tất cả' }, { key: 'major', label: 'Ẩn Chính' },
  { key: 'Gậy', label: '🔥 Gậy' }, { key: 'Cốc', label: '🍷 Cốc' }, { key: 'Kiếm', label: '⚔️ Kiếm' }, { key: 'Tiền', label: '🪙 Tiền' }, { key: 'fav', label: '★ Yêu thích' }
]

// Câu hỏi gợi ý (tự biên soạn) -> bấm là rút bài với kiểu trải phù hợp
const TOPICS = [
  { title: '💞 Tarot tình yêu & mối quan hệ', items: [
    ['Người ấy thật sự nghĩ gì về mình?', 'love'],
    ['Mối quan hệ này rồi sẽ đi về đâu?', 'love'],
    ['Mình và người ấy có thật sự hợp nhau?', 'three'],
    ['Điều gì đang cản trở chuyện tình cảm của mình?', 'love'],
    ['Crush có đang để ý đến mình không?', 'yesno'],
    ['Người cũ có còn nghĩ về mình không?', 'yesno'],
    ['Có nên cho mối quan hệ này thêm một cơ hội?', 'yesno']
  ] },
  { title: '🌙 Tarot bản thân & tháng này', items: [
    ['Tháng này mình nên tập trung vào điều gì?', 'three'],
    ['Điểm mạnh nào mình chưa khai thác hết?', 'one'],
    ['Mình cần buông bỏ điều gì để nhẹ lòng hơn?', 'one'],
    ['Bài học quan trọng nhất lúc này của mình là gì?', 'three'],
    ['Năng lượng quanh mình hôm nay ra sao?', 'one'],
    ['Điều gì đang âm thầm ảnh hưởng đến mình?', 'three']
  ] },
  { title: '💼 Tarot sự nghiệp & tài lộc (4 lá)', items: [
    ['Công việc của mình thời gian tới sẽ ra sao?', 'career'],
    ['Mình có nên thay đổi công việc lúc này?', 'career'],
    ['Tình hình tài chính vài tháng tới của mình thế nào?', 'career'],
    ['Mình nên làm gì để tiến xa hơn trong sự nghiệp?', 'career'],
    ['Đâu là cơ hội mình đang vô tình bỏ lỡ?', 'three']
  ] },
  { title: '⚡ Hỏi nhanh Có / Không', items: [
    ['Mình có nên nhận lời đề nghị này không?', 'yesno'],
    ['Quyết định sắp tới của mình có ổn không?', 'yesno'],
    ['Mình có nên kiên nhẫn chờ thêm không?', 'yesno'],
    ['Đây có phải thời điểm tốt để bắt đầu không?', 'yesno']
  ] }
]
const HKEY = 'tamso_tarot_history'
const FKEY = 'tamso_tarot_favs'
function spreadSummary(picks, positions, q) {
  const n = picks.length
  const up = picks.filter(p => p.up).length
  const lean = up > n - up ? 'nghiêng về hướng thuận, tích cực' : up < n - up ? 'nghiêng về sự thận trọng, cần điều chỉnh' : 'khá cân bằng giữa thuận và nghịch'
  return (q ? 'Về câu hỏi “' + q + '”: ' : 'Cho trải bài này: ') + n + ' lá có ' + up + ' xuôi / ' + (n - up) + ' ngược — ' + lean + '. Đọc “' + positions[0] + '” như điểm khởi đầu và “' + positions[n - 1] + '” như xu hướng đang mở ra; các lá giữa là mạch nối. Đây là gợi ý để bạn tự chiêm nghiệm, không phải lời phán chắc chắn.'
}

function birthCards(d, m, y) {
  const sd = n => String(n).split('').reduce((a, b) => a + +b, 0)
  let t = d + m + y; while (t > 21) t = sd(t)
  let t2 = t; while (t2 > 9) t2 = sd(t2)
  const c1 = TAROT_CARDS.find(c => c.arcana === 'major' && c.id === t)
  const c2 = TAROT_CARDS.find(c => c.arcana === 'major' && c.id === t2)
  return t === t2 ? [c1] : [c1, c2]
}

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function DrawnCard({ card, up, pos, delay = 0 }) {
  const [revealed, setRevealed] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) return
    const t = setTimeout(() => setRevealed(true), 130 + delay * 1000)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div className="flip3d" style={{ width: 170 }}>
      <div className="flip3d-inner" style={{ transform: revealed ? 'rotateY(0deg)' : 'rotateY(180deg)' }}>
        <div className={'tcard ' + (up ? '' : 'rev')} style={{ width: '100%', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}>
          <div className="text-[.74rem] tracking-[.16em] uppercase text-gold">{pos}</div>
          <CardImage card={card} w={260} reversed={!up} imgClass="rounded-md w-full h-auto my-1" fallbackClass="text-[3rem] my-6" />
          <div>
            <div className="font-serif text-[1.05rem] leading-tight">{card.nameVi}</div>
            <div className={'text-[.78rem] font-semibold ' + (up ? 'text-emerald-800' : 'text-rose-700')}>{up ? '▲ Xuôi' : '▼ Ngược'}</div>
          </div>
        </div>
        <div className="flip3d-back" style={{ borderRadius: 16, background: 'linear-gradient(160deg,#2a1d0d,#3a2912)', border: '1px solid rgba(211,162,78,.4)', boxShadow: 'inset 0 0 0 4px rgba(211,162,78,.10), inset 0 0 0 5px rgba(211,162,78,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#d3a24e' }}>
            <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>✦</div>
            <div style={{ fontFamily: 'serif', letterSpacing: '.22em', fontSize: '.68rem', marginTop: 6, opacity: .82 }}>TAM SỞ</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Tarot() {
  const [spread, setSpread] = useState('one')
  const [picks, setPicks] = useState([])
  const [drawId, setDrawId] = useState(0)
  const [sel, setSel] = useState(null)
  const [filter, setFilter] = useState('all')
  const [reversed, setReversed] = useState(true)
  const [history, setHistory] = useState([])
  const [favs, setFavs] = useState([])
  const [question, setQuestion] = useState('')
  const [dayCopied, setDayCopied] = useState(false)
  const [readCopied, setReadCopied] = useState(false)
  const [quick, setQuick] = useState(null)
  const drawQuick = () => { const p = drawCards(1)[0]; setQuick({ card: p.card, up: p.up }) }
  const positions = TAROT_SPREADS[spread].positions
  const isYesNo = spread === 'yesno'

  useEffect(() => { try { setHistory(JSON.parse(localStorage.getItem(HKEY) || '[]')); setFavs(JSON.parse(localStorage.getItem(FKEY) || '[]')) } catch { } }, [])
  const isFav = id => favs.includes(id)
  const toggleFav = id => { const next = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id]; setFavs(next); try { localStorage.setItem(FKEY, JSON.stringify(next)) } catch { } }

  const runDraw = (sp, q) => {
    const pos = TAROT_SPREADS[sp].positions
    let p = drawCards(pos.length)
    if (!reversed) p = p.map(x => ({ ...x, up: true }))
    setPicks(p); setDrawId(n => n + 1)
    const entry = { t: Date.now(), q: (q || '').trim(), spread: TAROT_SPREADS[sp].label, cards: p.map((x, i) => `${pos[i]}: ${x.card.nameVi} (${x.up ? 'xuôi' : 'ngược'})`) }
    const next = [entry, ...history].slice(0, 8)
    setHistory(next); try { localStorage.setItem(HKEY, JSON.stringify(next)) } catch { }
  }
  const handleDraw = () => runDraw(spread, question)
  const askPreset = (q, sp) => {
    setQuestion(q); setSpread(sp); runDraw(sp, q)
    setTimeout(() => { const el = document.getElementById('rut-bai'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 60)
  }
  const clearHistory = () => { setHistory([]); try { localStorage.removeItem(HKEY) } catch { } }
  const copyReading = () => {
    if (!picks.length) return
    const u = routeShareUrl('/tarot')
    const head = `✦ Trải bài Tarot — ${TAROT_SPREADS[spread].label}` + (question.trim() ? `\nCâu hỏi: ${question.trim()}` : '')
    const body = isYesNo
      ? `Trả lời: ${picks[0].up ? 'CÓ' : 'KHÔNG'} — ${picks[0].card.nameVi} (${picks[0].up ? 'xuôi' : 'ngược'})`
      : picks.map((pk, i) => `${positions[i]}: ${pk.card.nameVi} (${pk.up ? 'xuôi' : 'ngược'})`).join('\n')
    navigator.clipboard?.writeText(`${head}\n${body}\n— Tam Sở ${u}`).then(() => { setReadCopied(true); setTimeout(() => setReadCopied(false), 2000) })
  }
  const cards = TAROT_CARDS.filter(c => filter === 'all' ? true : filter === 'major' ? c.arcana === 'major' : filter === 'fav' ? favs.includes(c.id) : c.suit === filter)

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Bộ bài đầy đủ 78 lá · Rider–Waite–Smith</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Tarot</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">22 lá Ẩn Chính kể "Hành trình của Gã Khờ", 56 lá Ẩn Phụ soi rọi đời thường. Tĩnh tâm, nghĩ câu hỏi, rồi rút bài.</p>
      </section>

      <section className="wrap pb-2">
        <div className="panel p-[26px] flex flex-col md:flex-row items-center gap-6 max-w-[760px] mx-auto">
          {!quick ? (
            <div className="text-center w-full py-2">
              <h3 className="text-[1.3rem] mb-1">Rút nhanh một lá</h3>
              <p className="note max-w-[440px] mx-auto mb-3">Tĩnh tâm, nghĩ về điều bạn muốn hỏi rồi rút một lá cho riêng mình.</p>
              <button className="btn btn-primary" onClick={drawQuick}>🔮 Rút một lá</button>
            </div>
          ) : (
            <>
              <div className={'tcard shrink-0 ' + (quick.up ? '' : 'rev')} style={{ width: 150, minHeight: 250 }}>
                <div className="text-[.74rem] tracking-[.16em] uppercase text-gold">Lá của bạn</div>
                <CardImage card={quick.card} w={240} reversed={!quick.up} imgClass="rounded-md w-full h-auto my-1" fallbackClass="text-[2.6rem] my-5" />
                <div><div className="font-serif text-[1.05rem] leading-tight">{quick.card.nameVi}</div>
                  <div className={'text-[.78rem] font-semibold ' + (quick.up ? 'text-emerald-800' : 'text-rose-700')}>{quick.up ? '▲ Xuôi' : '▼ Ngược'}</div></div>
              </div>
              <div><h3 className="text-[1.3rem] mb-1">{quick.card.nameVi} <span className="note">({quick.up ? 'xuôi' : 'ngược'})</span></h3><p className="m-0">{meaningOf(quick.card, quick.up)}</p>
                {quick.card.advice && <p className="note mt-1 mb-0"><span className="text-gold font-semibold">✦ Bạn có thể làm gì:</span> {quick.card.advice}</p>}
                <p className="note mt-2 mb-0">Mỗi lần rút là một lá ngẫu nhiên cho riêng bạn.</p>
                <div className="flex gap-2 flex-wrap mt-3 no-print">
                  <button className="btn btn-ghost text-[.82rem] py-1.5 px-3" onClick={drawQuick}>🔄 Rút lại</button>
                  <button className="btn btn-ghost text-[.82rem] py-1.5 px-3" onClick={() => { const u = routeShareUrl('/tarot'); navigator.clipboard?.writeText(`✦ Lá Tarot: ${quick.card.nameVi} (${quick.up ? 'xuôi' : 'ngược'})\n${meaningOf(quick.card, quick.up)}\n— Tam Sở ${u}`).then(() => { setDayCopied(true); setTimeout(() => setDayCopied(false), 2000) }) }}>{dayCopied ? '✓ Đã chép!' : '📋 Chép lá này'}</button>
                  <a className="btn btn-ghost text-[.82rem] py-1.5 px-3" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(routeShareUrl('/tarot'))} target="_blank" rel="noopener">📘 Chia sẻ</a>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section id="rut-bai" className="wrap py-10">
        <div className="panel p-[26px]">
          <div className="flex gap-3 flex-wrap items-end justify-center">
            <div className="flex flex-col gap-1.5"><label htmlFor="tquestion" className="text-[.85rem] text-muted font-semibold">Câu hỏi (tùy chọn)</label>
              <input id="tquestion" value={question} onChange={e => setQuestion(e.target.value)} placeholder="VD: Mình nên tập trung vào điều gì lúc này?" className="field-input w-[250px]" /></div>
            <div className="flex flex-col gap-1.5"><label htmlFor="spread" className="text-[.85rem] text-muted font-semibold">Kiểu trải bài</label>
              <select id="spread" value={spread} onChange={e => { setSpread(e.target.value); setPicks([]) }} className="field-input">
                {Object.entries(TAROT_SPREADS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select></div>
            <label className="flex items-center gap-2 text-[.9rem] text-muted pb-2 cursor-pointer"><input type="checkbox" checked={reversed} onChange={e => setReversed(e.target.checked)} /> Cho phép lá ngược</label>
            <button className="btn btn-primary" onClick={handleDraw}>🔮 Rút bài</button>
          </div>
          {picks.length > 0 && question.trim() && <p className="text-center mt-4 mb-0 text-cream"><span className="note">Câu hỏi của bạn:</span> “{question.trim()}”</p>}

          {picks.length > 0 && isYesNo && (
            <div className="text-center mt-6 animate-fade">
              <div className={'font-serif text-[3rem] ' + (picks[0].up ? 'text-emerald-800' : 'text-rose-700')}>{picks[0].up ? 'CÓ' : 'KHÔNG'}</div>
              <div className="flex justify-center mt-2"><div style={{ width: 150 }}><DrawnCard card={picks[0].card} up={picks[0].up} pos="Trả lời" /></div></div>
              <p className="mt-3 max-w-[560px] mx-auto">{meaningOf(picks[0].card, picks[0].up)}</p>
            </div>
          )}
          {picks.length > 0 && !isYesNo && (
            <>
              <div className="flex gap-[18px] justify-center flex-wrap mt-6" key={drawId}>
                {picks.map((p, i) => <DrawnCard key={i} card={p.card} up={p.up} pos={positions[i]} delay={i * 0.08} />)}
              </div>
              <div className="max-w-[760px] mx-auto mt-5">
                {picks.map((p, i) => <div key={i} className="bg-white/[.045] border border-gold/20 rounded-xl px-[18px] py-3.5 mb-2.5"><b className="text-gold">{positions[i]} — {p.card.nameVi} ({p.up ? 'xuôi' : 'ngược'}):</b> {meaningOf(p.card, p.up)}</div>)}
              </div>
              <div className="panel p-5 mt-4 text-left max-w-[760px] mx-auto">
                <div className="text-gold text-[.72rem] uppercase tracking-[.18em] mb-1">Tổng hợp quẻ bài <span className="note">(tham khảo)</span></div>
                <p className="m-0 leading-relaxed">{spreadSummary(picks, positions, question.trim())}</p>
              </div>
            </>
          )}
          {picks.length > 0 && (
            <div className="flex gap-2 justify-center flex-wrap mt-4 no-print">
              <button className="btn btn-ghost" onClick={copyReading}>{readCopied ? '✓ Đã chép!' : '📋 Chép kết quả'}</button>
              <a className="btn btn-ghost" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(routeShareUrl('/tarot'))} target="_blank" rel="noopener">📘 Chia sẻ</a>
            </div>
          )}
          <p className="note text-center mt-[18px]">Rút ngẫu nhiên trên máy bạn. Lịch sử lưu cục bộ trong trình duyệt.</p>

          {history.length > 0 && (
            <details className="mt-4 max-w-[760px] mx-auto bg-white/[.04] border border-gold/15 rounded-xl overflow-hidden">
              <summary className="cursor-pointer px-4 py-2.5 text-[.9rem] font-semibold">🕘 Lịch sử rút ({history.length})</summary>
              <div className="px-4 pb-3">
                {history.map((h, i) => <div key={i} className="text-[.85rem] text-muted border-b border-white/5 py-2"><b className="text-cream">{new Date(h.t).toLocaleString('vi-VN')}</b> · {h.spread}{h.q ? ' · “' + h.q + '”' : ''}<br />{h.cards.join(' · ')}</div>)}
                <button onClick={clearHistory} className="btn btn-ghost mt-3 text-[.85rem] py-2 px-4">Xóa lịch sử</button>
              </div>
            </details>
          )}
        </div>
      </section>

      <section className="wrap py-8">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">Câu hỏi gợi ý — bấm để rút bài ngay</h2>
        <p className="note text-center max-w-[640px] mx-auto mb-5">Chọn một câu hợp tâm trạng, Tam Sở tự chọn kiểu trải phù hợp rồi rút bài. Bạn vẫn sửa lại câu hỏi ở ô phía trên được. Chỉ để chiêm nghiệm, không phải lời phán chắc chắn.</p>
        <div className="max-w-[920px] mx-auto grid gap-5">
          {TOPICS.map(g => (
            <div key={g.title}>
              <div className="text-gold font-serif text-[1.05rem] font-semibold mb-2">{g.title}</div>
              <div className="flex flex-wrap gap-2">
                {g.items.map(([q, sp]) => (
                  <button key={q} onClick={() => askPreset(q, sp)} className="text-left border border-gold/30 rounded-lg px-3 py-2 text-[.88rem] text-cream hover:border-gold/60 hover:bg-black/5 transition cursor-pointer">{q}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <BirthCardsTool />

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Thư viện 78 lá</h2>
        <div className="flex gap-2 flex-wrap justify-center mb-6 mt-4">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={'px-3.5 py-1.5 rounded-full text-[.85rem] font-semibold border transition ' + (filter === f.key ? 'bg-gradient-to-br from-[#d3a24e] to-[#a9772f] text-[#211606] border-transparent' : 'text-muted border-gold/25 hover:text-cream')}>{f.label}</button>
          ))}
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(116px,1fr))' }}>
          {cards.map(c => (
            <div key={c.id} role="button" tabIndex={0} onClick={() => setSel(c)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(c) } }} className="relative bg-white/[.04] border border-gold/20 rounded-[12px] p-1.5 text-center cursor-pointer transition hover:-translate-y-1 hover:border-gold/40">
              <button type="button" aria-label={(isFav(c.id) ? 'Bỏ yêu thích ' : 'Lưu yêu thích ') + c.nameVi} onClick={e => { e.stopPropagation(); toggleFav(c.id) }} className={'absolute top-1 right-1.5 text-[1rem] leading-none z-10 bg-transparent border-0 cursor-pointer ' + (isFav(c.id) ? 'text-gold' : 'text-black/25 hover:text-gold')}>{isFav(c.id) ? '★' : '☆'}</button>
              <CardImage card={c} w={200} imgClass="rounded-md w-full h-auto mb-1" fallbackClass="text-[1.7rem] py-4" />
              <div className="text-[.8rem] font-semibold text-cream leading-tight">{c.nameVi}</div>
            </div>
          ))}
        </div>
        {filter === 'fav' && cards.length === 0 && <p className="note text-center mt-4">Chưa có lá yêu thích — mở một lá bất kỳ rồi bấm "☆ Lưu yêu thích".</p>}
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto"><b>Nội dung &amp; hình ảnh.</b> Từ khóa &amp; luận giải theo truyền thống <a href="https://labyrinthos.co/blogs/tarot-card-meanings-list/tagged/major-arcana" target="_blank" rel="noopener">Rider–Waite–Smith / Labyrinthos</a>; tranh minh họa là bộ <b>RWS (1909, Pamela Colman Smith) — phạm vi công cộng</b>, nhúng từ <a href="https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck" target="_blank" rel="noopener">Wikimedia Commons</a>. Ngoại tuyến sẽ hiển thị biểu tượng thay ảnh.</div>
      </section>

      <Modal open={!!sel} onClose={() => setSel(null)}>
        {sel && (<>
          <div className="flex justify-center"><CardImage card={sel} w={360} imgClass="rounded-lg w-[190px] h-auto mb-3" fallbackClass="text-[3rem]" /></div>
          <h3 className="text-center text-[1.6rem] my-1">{sel.nameVi} <span className="note">({sel.name} · {sel.roman})</span></h3>
          <div className="text-center mb-2"><button onClick={() => toggleFav(sel.id)} className="btn btn-ghost text-[.85rem] py-1.5 px-3">{isFav(sel.id) ? '★ Đã lưu yêu thích' : '☆ Lưu yêu thích'}</button></div>
          {sel.desc && <p className="note text-center mb-2 leading-relaxed">{sel.desc}</p>}
          {(sel.astro || sel.element) && <p className="note text-center mb-2"><span className="text-gold font-semibold">✦ Tương ứng:</span> {sel.arcana === 'major' ? sel.astro : ((sel.astro ? sel.astro + ' · ' : '') + 'chất ' + sel.suit + ' · nguyên tố ' + sel.element)}</p>}
          <p className="text-center mb-1"><Badge gold>▲ Xuôi</Badge></p>
          <div className="flex gap-2 flex-wrap my-1.5 justify-center">{sel.upKeys.map(k => <Badge key={k}>{k}</Badge>)}</div>
          {sel.up && <p>{sel.up}</p>}
          <p className="text-center mb-1 mt-3"><Badge>▼ Ngược</Badge></p>
          <div className="flex gap-2 flex-wrap my-1.5 justify-center">{sel.revKeys.map(k => <Badge key={k}>{k}</Badge>)}</div>
          {sel.rev && <p className="mb-0">{sel.rev}</p>}
          {sel.advice && <p className="mt-3 mb-0"><span className="text-gold font-semibold">✦ Lời khuyên:</span> {sel.advice}</p>}
          {sel.love && <p className="mt-2 mb-0 text-[.92rem]"><span className="text-rose-700 font-semibold">❤ Tình yêu:</span> {sel.love}</p>}
          {sel.work && <p className="mt-1 mb-0 text-[.92rem]"><span className="text-emerald-800 font-semibold">💼 Công việc:</span> {sel.work}</p>}
        </>)}
      </Modal>
    </>
  )
}

function BirthCardsTool() {
  const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('')
  const [res, setRes] = useState(null); const [err, setErr] = useState('')
  const calc = () => {
    const dd = +d, mm = +m, yy = +y
    if (!dd || !mm || !yy || dd < 1 || dd > 31 || mm < 1 || mm > 12) { setErr('Nhập ngày sinh hợp lệ.'); setRes(null); return }
    setErr(''); setRes(birthCards(dd, mm, yy))
  }
  return (
    <section className="wrap py-6">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] text-center mb-1">Lá bài chủ đạo <span className="note">(theo ngày sinh)</span></h2>
      <div className="panel p-[26px] max-w-[760px] mx-auto">
        <div className="flex gap-3 flex-wrap items-end justify-center">
          <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Ngày</label><input type="number" value={d} onChange={e => setD(e.target.value)} placeholder="16" className="field-input w-[90px]" /></div>
          <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Tháng</label><input type="number" value={m} onChange={e => setM(e.target.value)} placeholder="6" className="field-input w-[90px]" /></div>
          <div className="flex flex-col gap-1.5"><label className="text-[.85rem] text-muted font-semibold">Năm</label><input type="number" value={y} onChange={e => setY(e.target.value)} placeholder="1990" className="field-input w-[110px]" /></div>
          <button className="btn btn-primary" onClick={calc}>🎴 Tìm lá chủ đạo</button>
        </div>
        {err && <div className="disclaimer mt-5">{err}</div>}
        {res && (
          <div className="flex gap-[18px] justify-center flex-wrap mt-6 animate-fade">
            {res.map(c => <DrawnCard key={c.id} card={c} up={true} pos="Lá chủ đạo" />)}
          </div>
        )}
        <p className="note text-center mt-4 mb-0">Tính bằng cách cộng ngày + tháng + năm rồi rút gọn (theo phương pháp Labyrinthos) — lá Ẩn Chính phản ánh chủ đề cả đời.</p>
      </div>
    </section>
  )
}
