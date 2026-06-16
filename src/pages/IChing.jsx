import { useState } from 'react'
import { HEXAGRAMS, TRIGRAMS, castHexagram } from '../data/iching.js'
import Modal from '../components/Modal.jsx'

function Line({ yang, changing }) {
  return (
    <div className="flex items-center justify-center gap-2 my-1">
      {yang
        ? <span className="inline-block w-[120px] h-[12px] bg-gold rounded-sm" />
        : <><span className="inline-block w-[52px] h-[12px] bg-gold rounded-sm" /><span className="inline-block w-[52px] h-[12px] bg-gold rounded-sm" /></>}
      {changing && <span className="text-pink-300 text-[.8rem]">● động</span>}
    </div>
  )
}

function HexView({ hex }) {
  return (
    <div className="text-center">
      <div className="text-[2.2rem] leading-none">{TRIGRAMS[hex.up].sym}<br />{TRIGRAMS[hex.lo].sym}</div>
      <h3 className="text-[1.5rem] my-1">Quẻ {hex.n} · {hex.ten}</h3>
      <p className="note m-0">Trên {hex.up} ({TRIGRAMS[hex.up].nghia}) · Dưới {hex.lo} ({TRIGRAMS[hex.lo].nghia})</p>
      <p className="mt-2 mb-0">{hex.y}</p>
    </div>
  )
}

export default function IChing() {
  const [cast, setCast] = useState(null)
  const [sel, setSel] = useState(null)

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-6">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Kinh Dịch · I Ching</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Gieo Quẻ Dịch</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">
          Tĩnh tâm, nghĩ về câu hỏi của bạn rồi gieo quẻ bằng ba đồng xu. Sáu hào dựng từ dưới lên; hào động sẽ sinh ra "quẻ biến".
        </p>
      </section>

      <section className="wrap py-8">
        <div className="panel p-[26px] max-w-[760px] mx-auto text-center">
          <button className="btn btn-primary" onClick={() => setCast(castHexagram())}>🪙 Gieo quẻ</button>
          {cast && (
            <div className="mt-6 animate-fade">
              <div className="mb-4">{[...cast.lines].reverse().map((l, i) => <Line key={i} yang={l.yang} changing={l.changing} />)}</div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="panel p-5"><div className="text-gold text-[.8rem] uppercase tracking-wider mb-1">Quẻ chính</div><HexView hex={cast.present} /></div>
                {cast.changed
                  ? <div className="panel p-5"><div className="text-gold text-[.8rem] uppercase tracking-wider mb-1">Quẻ biến (hào động {cast.changingPos.join(', ')})</div><HexView hex={cast.changed} /></div>
                  : <div className="panel p-5 flex items-center justify-center text-muted">Không có hào động — chỉ xét quẻ chính.</div>}
              </div>
            </div>
          )}
          <p className="note mt-4 mb-0">Gieo bằng số ngẫu nhiên trên máy bạn (ngửa=3, sấp=2). Hào tổng 6/9 là hào động.</p>
        </div>
      </section>

      <section className="wrap py-10">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Tra cứu 64 quẻ</h2>
        <p className="text-muted text-center max-w-[680px] mx-auto mb-6">Nhấp vào một quẻ để xem bát quái và ý nghĩa.</p>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))' }}>
          {HEXAGRAMS.map(h => (
            <button key={h.n} onClick={() => setSel(h)}
              className="bg-white/[.045] border border-gold/20 rounded-xl px-2 py-3 text-center cursor-pointer transition hover:-translate-y-1 hover:border-gold/40">
              <div className="text-[1.3rem] leading-none">{TRIGRAMS[h.up].sym}{TRIGRAMS[h.lo].sym}</div>
              <div className="text-muted text-[.72rem] mt-1">Quẻ {h.n}</div>
              <div className="text-[.86rem] font-semibold text-cream leading-tight">{h.ten}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Lưu ý.</b> Kinh Dịch là kinh điển triết học – bói toán phương Đông; lời quẻ ở đây là <b>gloss ngắn</b> mang tính tham khảo, không thay lời kinh đầy đủ.
          Tên quẻ theo thứ tự Văn Vương; bát quái theo <a href="https://vi.wikipedia.org/wiki/Kinh_D%E1%BB%8Bch" target="_blank" rel="noopener">Kinh Dịch (Wikipedia)</a>. Không phải khoa học.
        </div>
      </section>

      <Modal open={!!sel} onClose={() => setSel(null)}>{sel && <HexView hex={sel} />}</Modal>
    </>
  )
}
