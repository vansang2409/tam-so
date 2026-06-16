import { useState, useMemo, useEffect } from 'react'
import { TAROT_CARDS, TAROT_SPREADS, drawCards, cardOfDay } from '../data/tarot.js'
import Modal from '../components/Modal.jsx'
import { Badge } from '../components/Disclaimer.jsx'

const meaningOf = (c, up) => up ? (c.up || 'Từ khóa: ' + c.upKeys.join(', ')) : (c.rev || 'Từ khóa: ' + c.revKeys.join(', '))
const FILTERS = [
  { key: 'all', label: 'Tất cả' }, { key: 'major', label: 'Ẩn Chính' },
  { key: 'Gậy', label: '🔥 Gậy' }, { key: 'Cốc', label: '🍷 Cốc' }, { key: 'Kiếm', label: '⚔️ Kiếm' }, { key: 'Tiền', label: '🪙 Tiền' }
]
const HKEY = 'tamso_tarot_history'

function birthCards(d, m, y) {
  const sd = n => String(n).split('').reduce((a, b) => a + +b, 0)
  let t = d + m + y; while (t > 21) t = sd(t)
  let t2 = t; while (t2 > 9) t2 = sd(t2)
  const c1 = TAROT_CARDS.find(c => c.arcana === 'major' && c.id === t)
  const c2 = TAROT_CARDS.find(c => c.arcana === 'major' && c.id === t2)
  return t === t2 ? [c1] : [c1, c2]
}

export default function Tarot() {
  const [spread, setSpread] = useState('one')
  const [picks, setPicks] = useState([])
  const [sel, setSel] = useState(null)
  const [filter, setFilter] = useState('all')
  const [reversed, setReversed] = useState(true)
  const [history, setHistory] = useState([])
  const today = useMemo(() => cardOfDay(), [])
  const positions = TAROT_SPREADS[spread].positions
  const isYesNo = spread === 'yesno'

  useEffect(() => { try { setHistory(JSON.parse(localStorage.getItem(HKEY) || '[]')) } catch { } }, [])

  const handleDraw = () => {
    let p = drawCards(positions.length)
    if (!reversed) p = p.map(x => ({ ...x, up: true }))
    setPicks(p)
    const entry = { t: Date.now(), spread: TAROT_SPREADS[spread].label, cards: p.map((x, i) => `${positions[i]}: ${x.card.nameVi} (${x.up ? 'xuôi' : 'ngược'})`) }
    const next = [entry, ...history].slice(0, 8)
    setHistory(next); try { localStorage.setItem(HKEY, JSON.stringify(next)) } catch { }
  }
  const clearHistory = () => { setHistory([]); try { localStorage.removeItem(HKEY) } catch { } }
  const cards = TAROT_CARDS.filter(c => filter === 'all' || (filter === 'major' ? c.arcana === 'major' : c.suit === filter))

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Bộ bài đầy đủ 78 lá</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Tarot</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">22 lá Ẩn Chính kể "Hành trình của Gã Khờ", 56 lá Ẩn Phụ soi rọi đời thường. Tĩnh tâm, nghĩ câu hỏi, rồi rút bài.</p>
      </section>

      <section className="wrap pb-2">
        <div className="panel p-[26px] flex flex-col md:flex-row items-center gap-6 max-w-[760px] mx-auto">
          <div className={'tcard shrink-0 ' + (today.up ? '' : 'rev')} style={{ width: 150, minHeight: 240 }}>
            <div className="text-[.74rem] tracking-[.16em] uppercase text-gold">Hôm nay</div>
            <div><div className="sym text-[2.6rem] my-1">{today.card.symbol}</div><div className="font-serif text-muted text-[.9rem]">{today.card.roman}</div><div className="font-serif text-[1.15rem]">{today.card.nameVi}</div><div className={'text-[.78rem] font-semibold ' + (today.up ? 'text-emerald-300' : 'text-pink-300')}>{today.up ? '▲ Xuôi' : '▼ Ngược'}</div></div>
            <div className="text-[.8rem] text-muted">{(today.up ? today.card.upKeys : today.card.revKeys).slice(0, 3).join(' · ')}</div>
          </div>
          <div><h3 className="text-[1.3rem] mb-1">Lá bài hôm nay</h3><p className="m-0">{meaningOf(today.card, today.up)}</p><p className="note mt-2 mb-0">Cố định trong ngày — mai có lá mới.</p></div>
        </div>
      </section>

      <section className="wrap py-10">
        <div className="panel p-[26px]">
          <div className="flex gap-3 flex-wrap items-end justify-center">
            <div className="flex flex-col gap-1.5"><label htmlFor="spread" className="text-[.85rem] text-muted font-semibold">Kiểu trải bài</label>
              <select id="spread" value={spread} onChange={e => { setSpread(e.target.value); setPicks([]) }} className="field-input">
                {Object.entries(TAROT_SPREADS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select></div>
            <label className="flex items-center gap-2 text-[.9rem] text-muted pb-2 cursor-pointer"><input type="checkbox" checked={reversed} onChange={e => setReversed(e.target.checked)} /> Cho phép lá ngược</label>
            <button className="btn btn-primary" onClick={handleDraw}>🔮 Rút bài</button>
          </div>

          {picks.length > 0 && isYesNo && (
            <div className="text-center mt-6 animate-fade">
              <div className={'font-serif text-[3rem] ' + (picks[0].up ? 'text-emerald-300' : 'text-pink-300')}>{picks[0].up ? 'CÓ' : 'KHÔNG'}</div>
              <p>Lá rút: <b>{picks[0].card.nameVi}</b> ({picks[0].up ? 'xuôi' : 'ngược'}) — {meaningOf(picks[0].card, picks[0].up)}</p>
            </div>
          )}
          {picks.length > 0 && !isYesNo && (
            <>
              <div className="flex gap-[18px] justify-center flex-wrap mt-6">
                {picks.map((p, i) => (
                  <div key={i} className={'tcard ' + (p.up ? '' : 'rev')}>
                    <div className="text-[.74rem] tracking-[.16em] uppercase text-gold">{positions[i]}</div>
                    <div><div className="sym text-[3rem] my-1">{p.card.symbol}</div><div className="font-serif text-muted text-[.95rem]">{p.card.roman}</div><div className="font-serif text-[1.2rem] my-1">{p.card.nameVi}</div><div className={'text-[.8rem] font-semibold ' + (p.up ? 'text-emerald-300' : 'text-pink-300')}>{p.up ? '▲ Xuôi' : '▼ Ngược'}</div></div>
                    <div className="text-[.84rem] text-muted mt-1.5">{(p.up ? p.card.upKeys : p.card.revKeys).slice(0, 3).join(' · ')}</div>
                  </div>
                ))}
              </div>
              <div className="max-w-[760px] mx-auto mt-5">
                {picks.map((p, i) => <div key={i} className="bg-white/[.045] border border-gold/20 rounded-xl px-[18px] py-3.5 mb-2.5"><b className="text-gold">{positions[i]} — {p.card.nameVi} ({p.up ? 'xuôi' : 'ngược'}):</b> {meaningOf(p.card, p.up)}</div>)}
              </div>
            </>
          )}
          <p className="note text-center mt-[18px]">Rút ngẫu nhiên trên máy bạn. Lịch sử lưu cục bộ trong trình duyệt.</p>

          {history.length > 0 && (
            <details className="mt-4 max-w-[760px] mx-auto bg-white/[.04] border border-gold/15 rounded-xl overflow-hidden">
              <summary className="cursor-pointer px-4 py-2.5 text-[.9rem] font-semibold flex items-center justify-between"><span>🕘 Lịch sử rút ({history.length})</span></summary>
              <div className="px-4 pb-3">
                {history.map((h, i) => <div key={i} className="text-[.85rem] text-muted border-b border-white/5 py-2"><b className="text-cream">{new Date(h.t).toLocaleString('vi-VN')}</b> · {h.spread}<br />{h.cards.join(' · ')}</div>)}
                <button onClick={clearHistory} className="btn btn-ghost mt-3 text-[.85rem] py-2 px-4">Xóa lịch sử</button>
              </div>
            </details>
          )}
        </div>
      </section>

      <BirthCardsTool />

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Thư viện 78 lá</h2>
        <div className="flex gap-2 flex-wrap justify-center mb-6 mt-4">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={'px-3.5 py-1.5 rounded-full text-[.85rem] font-semibold border transition ' + (filter === f.key ? 'bg-gradient-to-br from-gold to-gold-soft text-[#1a1430] border-transparent' : 'text-muted border-gold/25 hover:text-cream')}>{f.label}</button>
          ))}
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(132px,1fr))' }}>
          {cards.map(c => (
            <button key={c.id} onClick={() => setSel(c)} className="bg-white/[.045] border border-gold/20 rounded-[14px] px-2 py-3.5 text-center cursor-pointer transition hover:-translate-y-1 hover:border-gold/40">
              <div className="text-[1.7rem]">{c.symbol}</div><div className="text-muted text-[.78rem] font-serif">{c.roman}</div><div className="text-[.9rem] font-semibold mt-0.5 text-cream">{c.nameVi}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto"><b>Nội dung &amp; hình ảnh.</b> Từ khóa theo truyền thống <a href="https://labyrinthos.co/blogs/tarot-card-meanings-list/tagged/major-arcana" target="_blank" rel="noopener">Rider–Waite–Smith / Labyrinthos</a>; bản hiện dùng thẻ cách điệu, bộ tranh gốc (phạm vi công cộng) ở <a href="https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck" target="_blank" rel="noopener">Wikimedia Commons</a>.</div>
      </section>

      <Modal open={!!sel} onClose={() => setSel(null)}>
        {sel && (<>
          <div className="text-[3rem] text-center">{sel.symbol}</div>
          <h3 className="text-center text-[1.6rem] my-1">{sel.nameVi} <span className="note">({sel.name} · {sel.roman})</span></h3>
          <p className="text-center mb-1"><Badge gold>▲ Xuôi</Badge></p>
          <div className="flex gap-2 flex-wrap my-1.5 justify-center">{sel.upKeys.map(k => <Badge key={k}>{k}</Badge>)}</div>
          {sel.up && <p>{sel.up}</p>}
          <p className="text-center mb-1 mt-3"><Badge>▼ Ngược</Badge></p>
          <div className="flex gap-2 flex-wrap my-1.5 justify-center">{sel.revKeys.map(k => <Badge key={k}>{k}</Badge>)}</div>
          {sel.rev && <p className="mb-0">{sel.rev}</p>}
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
            {res.map(c => (
              <div key={c.id} className="tcard"><div className="text-[.74rem] tracking-[.16em] uppercase text-gold">Lá chủ đạo</div>
                <div><div className="sym text-[3rem] my-1">{c.symbol}</div><div className="font-serif text-muted text-[.95rem]">{c.roman}</div><div className="font-serif text-[1.2rem] my-1">{c.nameVi}</div></div>
                <div className="text-[.84rem] text-muted">{c.upKeys.join(' · ')}</div>
              </div>
            ))}
          </div>
        )}
        <p className="note text-center mt-4 mb-0">Tính bằng cách cộng ngày + tháng + năm rồi rút gọn (theo phương pháp Labyrinthos) — lá Ẩn Chính phản ánh chủ đề cả đời.</p>
      </div>
    </section>
  )
}
