import { Link } from 'react-router-dom'
import Today from '../components/Today.jsx'

const features = [
  { ic: '🪪', title: 'Hồ sơ tổng hợp', to: '/ho-so', cta: 'Lập hồ sơ →', desc: 'Nhập một lần — xem ngay Số Chủ Đạo, Can Chi, cung hoàng đạo, lá Tarot chủ đạo và năm cá nhân trong một bức chân dung.' },
  { ic: '🃏', title: 'Tarot', to: '/tarot', cta: 'Vào phần Tarot →', desc: 'Bộ 78 lá đầy đủ, lá bài hôm nay, 6 kiểu trải (gồm Celtic Cross & Có/Không), lá chủ đạo theo ngày sinh, lưu lịch sử & lá yêu thích.' },
  { ic: '🔢', title: 'Thần số học', to: '/than-so-hoc', cta: 'Tính con số →', desc: 'Số Chủ Đạo, Vận Mệnh, Linh Hồn, Nhân Cách, Trưởng Thành, biểu đồ Lo Shu, nợ nghiệp, Đỉnh cao & Thử thách, năm/tháng/ngày cá nhân.' },
  { ic: '☯️', title: 'Tử vi · Can Chi', to: '/tu-vi', cta: 'Tra Can Chi →', desc: 'Can Chi năm/ngày/giờ (tự quy đổi âm lịch), hợp tuổi, giờ hoàng đạo, Tam Tai, cung phi.' },
  { ic: '♈', title: 'Cung hoàng đạo', to: '/cung-hoang-dao', cta: 'Xem cung →', desc: '12 cung phương Tây theo ngày sinh, tương hợp hai cung, màu/đá/số may mắn.' },
  { ic: '☶', title: 'Kinh Dịch', to: '/kinh-dich', cta: 'Gieo quẻ →', desc: 'Gieo quẻ ba đồng xu (hào động & quẻ biến), luận hào động, tra cứu đủ 64 quẻ Văn Vương.' }
]

export default function Home() {
  return (
    <>
      <section className="wrap text-center pt-[78px] pb-[54px]">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Tarot · Thần số học · Tử vi · Chiêm tinh · Kinh Dịch</div>
        <h1 className="gradient-text text-[clamp(2.3rem,5vw,3.7rem)] my-2.5">Năm ngả chiêm nghiệm,<br />một chốn dừng chân</h1>
        <p className="text-muted text-[1.12rem] max-w-[700px] mx-auto mb-7">
          Tam Sở gom các hệ thống biểu tượng cổ xưa về cùng một nơi: lá bài Tarot, con số định mệnh, vòng Can Chi, cung hoàng đạo và quẻ Dịch.
          Công cụ để bạn soi chiếu bản thân — với nguồn dẫn rõ ràng và sự thành thật về ranh giới giữa <em>dữ kiện</em> và <em>diễn giải</em>.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/ho-so" className="btn btn-primary">🪪 Lập hồ sơ tổng hợp</Link>
          <Link to="/tarot" className="btn btn-ghost">🔮 Rút một lá bài</Link>
        </div>
      </section>

      <Today />

      <section className="wrap py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.to} className="panel p-7 text-center transition hover:-translate-y-1.5 hover:border-gold/40">
              <span className="block text-[2.6rem] mb-1.5">{f.ic}</span>
              <h3 className="text-[1.3rem] mb-1.5">{f.title}</h3>
              <p className="text-muted text-[.96rem]">{f.desc}</p>
              <Link to={f.to} className="font-semibold">{f.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-10">
        <div className="disclaimer max-w-[900px] mx-auto">
          <b>Một lời thành thật.</b> Tarot, Thần số học, Tử vi, Chiêm tinh và Kinh Dịch là những hệ thống <b>tín ngưỡng – văn hóa</b>, không phải khoa học
          và không có giá trị tiên đoán đã được kiểm chứng. Tam Sở phân biệt rạch ròi phần <em>tính toán</em> (kiểm chứng được) với phần <em>luận giải</em> (truyền thống, tham khảo).
          Xem <Link to="/nguon">Nguồn &amp; Lưu ý</Link>.
        </div>
      </section>
    </>
  )
}
