import { useEffect } from 'react'
import { Link } from 'react-router-dom'

/** Trang 404 dùng chung: route catch-all + slug sai (lá Tarot / cung / số).
 * Tông trấn an, không hù dọa; có lối quay về rõ ràng. */
const LINKS = [
  ['/tarot', '🎴 Tarot'],
  ['/than-so-hoc', '🔢 Thần số học'],
  ['/la-so-tu-vi', '✦ Lá số Tử Vi'],
  ['/cung-hoang-dao', '♈ Cung hoàng đạo'],
  ['/kinh-dich', '☯ Kinh Dịch']
]

export default function NotFound({
  title = 'Không tìm thấy trang',
  msg = 'Trang bạn tìm có thể đã đổi địa chỉ hoặc chưa từng tồn tại. Đừng lo — không có gì hỏng cả, mời bạn quay về và khám phá tiếp.'
}) {
  useEffect(() => {
    const prev = document.title
    document.title = title + ' — Tam Sở'
    window.scrollTo(0, 0)
    return () => { document.title = prev }
  }, [title])
  return (
    <section className="wrap py-[80px] text-center">
      <div className="panel p-8 max-w-[580px] mx-auto">
        <div className="text-[3rem] leading-none gradient-text font-serif">404</div>
        <h1 className="text-[1.7rem] my-2">{title}</h1>
        <p className="text-muted max-w-[440px] mx-auto">{msg}</p>
        <div className="flex gap-3 justify-center mt-5 flex-wrap no-print">
          <Link className="btn btn-primary" to="/">↩ Về trang chủ</Link>
          <Link className="btn btn-ghost" to="/nguon">Nguồn &amp; Lưu ý</Link>
        </div>
        <p className="note mt-6 mb-2 text-gold text-kicker uppercase">Hoặc thử một hệ:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {LINKS.map(([to, label]) => (
            <Link key={to} to={to} className="border border-gold/30 rounded-lg px-3 py-1.5 text-[.88rem] text-cream no-underline hover:border-gold/60 hover:bg-black/5 transition">{label}</Link>
          ))}
        </div>
      </div>
    </section>
  )
}
