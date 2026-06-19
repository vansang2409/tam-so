import { Link } from 'react-router-dom'

// Khối "Nội dung liên quan" — liên kết chéo sang các hệ khác (SEO internal-link + giữ chân).
// items: [{ sys, to, title, note }]. Ẩn hẳn nếu rỗng.
export default function RelatedLinks({ items, title = 'Nội dung liên quan' }) {
  if (!items || !items.length) return null
  return (
    <section className="wrap pb-10">
      <p className="text-center text-gold text-kicker uppercase mb-3">{title}</p>
      <div className="grid gap-3 max-w-[760px] mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        {items.map(it => (
          <Link key={it.to} to={it.to} className="panel p-4 no-underline block transition hover:-translate-y-1 hover:border-gold/40">
            <div className="note text-[.68rem] uppercase tracking-[.16em] text-gold/80 mb-1">{it.sys}</div>
            <div className="font-serif text-cream text-[1.02rem] leading-snug">{it.title}</div>
            {it.note && <div className="note text-[.85rem] mt-1">{it.note}</div>}
            <div className="text-gold text-[.82rem] font-semibold mt-2">Khám phá →</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
