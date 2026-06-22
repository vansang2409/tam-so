import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadCollection, removeItem, clearCollection, collectionToText, kindMeta } from '../data/collection.js'

const KIND_ORDER = ['tarot', 'iching', 'numerology', 'laso', 'zodiac', 'profile']
const fmt = t => { try { return new Date(t).toLocaleString('vi-VN') } catch (e) { return '' } }

function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={'text-[.8rem] py-1.5 px-3 rounded-full border transition ' + (active
      ? 'bg-[#b45309] text-white border-transparent font-semibold'
      : 'text-muted border-gold/25 hover:text-cream')}>{children}</button>
  )
}

export default function Collection() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [copied, setCopied] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    const upd = () => setItems(loadCollection())
    upd()
    window.addEventListener('tamso:collection', upd)
    window.addEventListener('storage', upd)
    return () => { window.removeEventListener('tamso:collection', upd); window.removeEventListener('storage', upd) }
  }, [])

  const kinds = [...new Set(items.map(i => i.kind))]
  const shown = filter === 'all' ? items : items.filter(i => i.kind === filter)

  const onRemove = id => setItems(removeItem(id))
  const onClear = () => { setItems(clearCollection()); setConfirmClear(false) }
  const onCopy = () => { navigator.clipboard?.writeText(collectionToText(items)).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }) }
  const onDownload = () => {
    const blob = new Blob([collectionToText(items)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'bo-suu-tap-tam-so.txt'
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold text-kicker uppercase">Của riêng bạn · Lưu cục bộ</div>
        <h1 className="text-display my-3">🔖 Bộ sưu tập</h1>
        <p className="text-muted text-lead max-w-[680px] mx-auto">Nơi cất những lá bài, quẻ Dịch… bạn muốn ngẫm lại. Tất cả nằm trong trình duyệt máy bạn — không gửi đi đâu cả.</p>
      </section>

      <section className="wrap pb-16">
        {items.length === 0 ? (
          <div className="panel p-8 text-center max-w-[620px] mx-auto">
            <div className="text-[3rem] mb-2">📭</div>
            <h2 className="text-[1.4rem] mb-2">Bộ sưu tập đang trống</h2>
            <p className="text-muted mb-5">Khi rút một trải bài Tarot hay gieo một quẻ Dịch ưng ý, bấm <b className="text-cream">“🔖 Lưu vào bộ sưu tập”</b> để cất vào đây xem lại sau.</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Link to="/tarot" className="btn btn-primary">🃏 Rút Tarot</Link>
              <Link to="/kinh-dich" className="btn btn-ghost">☯ Gieo quẻ Dịch</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 justify-between items-center flex-wrap mb-4 max-w-[820px] mx-auto">
              <div className="flex gap-1.5 flex-wrap">
                <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>Tất cả ({items.length})</FilterChip>
                {KIND_ORDER.filter(k => kinds.includes(k)).map(k => (
                  <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)}>{kindMeta(k).icon} {kindMeta(k).label} ({items.filter(i => i.kind === k).length})</FilterChip>
                ))}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button className="btn btn-ghost text-[.82rem] py-1.5 px-3" onClick={onCopy}>{copied ? '✓ Đã chép' : '📋 Chép'}</button>
                <button className="btn btn-ghost text-[.82rem] py-1.5 px-3" onClick={onDownload}>⬇ Tải .txt</button>
                {confirmClear
                  ? <button className="btn btn-ghost text-[.82rem] py-1.5 px-3 text-rose-700 font-semibold" onClick={onClear}>Chắc chứ? Xóa hết</button>
                  : <button className="btn btn-ghost text-[.82rem] py-1.5 px-3" onClick={() => setConfirmClear(true)}>🗑 Xóa tất cả</button>}
              </div>
            </div>

            <div className="grid gap-3 max-w-[820px] mx-auto">
              {shown.map(it => {
                const m = kindMeta(it.kind)
                return (
                  <div key={it.id} className="panel p-4 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 text-[.72rem] font-semibold uppercase tracking-wider text-gold border border-gold/30 rounded-full px-2 py-0.5">{m.icon} {m.label}</span>
                        <h3 className="text-[1.05rem] font-serif mt-2 mb-1 break-words">{it.title}</h3>
                        {Array.isArray(it.lines) && it.lines.map((l, i) => <p key={i} className="note m-0 leading-relaxed break-words">{l}</p>)}
                        {it.note && <p className="text-muted text-[.86rem] mt-1 mb-0 break-words">{it.note}</p>}
                        <div className="text-muted text-[.74rem] mt-2">🕘 {fmt(it.t)}</div>
                      </div>
                      <button onClick={() => onRemove(it.id)} aria-label="Xóa khỏi bộ sưu tập" title="Xóa khỏi bộ sưu tập" className="shrink-0 bg-transparent border-0 cursor-pointer text-black/30 hover:text-rose-700 text-[1.15rem] leading-none">✕</button>
                    </div>
                    <div className="mt-2"><Link to={m.path} className="text-gold text-[.84rem] hover:underline">Mở {m.label} →</Link></div>
                  </div>
                )
              })}
            </div>
            {shown.length === 0 && <p className="note text-center mt-4">Không có mục nào trong nhóm này.</p>}
          </>
        )}

        <p className="note text-center mt-8 max-w-[620px] mx-auto">Bộ sưu tập chỉ lưu trên trình duyệt máy bạn (localStorage) — không gửi lên máy chủ. Xóa dữ liệu duyệt web hoặc đổi máy sẽ mất; muốn giữ lâu dài hãy bấm “Tải .txt”. Nội dung là gợi ý chiêm nghiệm, không phải lời phán chắc chắn.</p>
      </section>
    </>
  )
}
