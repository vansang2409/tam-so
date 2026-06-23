const FAQ = [
  { q: 'Tam Sở là gì?', a: 'Là web công cụ huyền học tiếng Việt miễn phí, gom Tarot, Thần số học, Tử vi/Bát Trạch, Cung hoàng đạo và Kinh Dịch về một nơi. Mọi thứ chạy ngay trên trình duyệt, không cần cài đặt.' },
  { q: 'Lá số Tử Vi (Tử Vi Đẩu Số) được lập thế nào, có chính xác không?', a: 'Trang Lá số Tử Vi an sao bằng thuật toán cổ điển tất định: từ ngày–giờ sinh âm lịch, xác định cung Mệnh/Thân, định Cục, rồi an Tử Vi cùng 14 chính tinh, Tứ Hóa, lục cát – lục sát và đại hạn vào 12 cung. Phần an sao này kiểm chứng được và đã đối chiếu khớp nhiều nguồn cùng các cách đồng cung kinh điển; còn phần luận ý nghĩa sao – cung chỉ mang tính tham khảo, không phải lời tiên đoán.' },
  { q: 'Kết quả có chính xác, có đoán đúng tương lai không?', a: 'Đây là các hệ thống tín ngưỡng – văn hóa, KHÔNG phải khoa học và không có năng lực tiên đoán đã được kiểm chứng. Phần tính toán (Can Chi, con số, lịch âm…) là lịch pháp/số học chính xác; phần luận giải chỉ để tham khảo và chiêm nghiệm, không phải lời phán về tương lai.' },
  { q: 'Dữ liệu của tôi có bị lưu hay gửi đi đâu không?', a: 'Không. Tam Sở không có máy chủ xử lý dữ liệu cá nhân, không cần đăng nhập. Họ tên/ngày sinh bạn nhập chỉ được tính trên máy bạn; phần lịch sử và lá yêu thích lưu cục bộ (localStorage) ngay trong trình duyệt của bạn — bạn xóa bất cứ lúc nào.' },
  { q: 'Vì sao có chỗ ghi "cần kiểm chứng thêm"?', a: 'Một số quy ước khác nhau giữa các nguồn/trường phái (ranh giới năm theo Tết, mốc cung hoàng đạo giáp ranh, cách quy đổi tên tiếng Việt trong thần số học…). Khi chưa có cơ sở chắc chắn, chúng tôi nói thẳng thay vì khẳng định tuyệt đối.' },
  { q: 'Có cần đăng nhập hay trả phí không?', a: 'Không. Tam Sở hoàn toàn miễn phí và không cần tài khoản.' },
  { q: 'Vì sao đôi khi lá Tarot hiện khung biểu tượng thay vì tranh?', a: 'Khi ảnh chưa tải được (mạng hạn chế nguồn ảnh hoặc đang offline), web hiển thị một khung thẻ thay thế để giao diện không vỡ. Bản cài đặt đầy đủ (tự host ảnh) sẽ hiển thị tranh Rider–Waite–Smith.' }
]

const GLOSSARY = [
  ['Ẩn Chính (Major Arcana)', '22 lá kể "Hành trình của Gã Khờ", ứng với các bài học và bước ngoặt lớn của đời.'],
  ['Ẩn Phụ (Minor Arcana)', '56 lá chia 4 chất Gậy/Cốc/Kiếm/Tiền, soi những việc đời thường hằng ngày.'],
  ['Lá ngược (reversed)', 'Lá rút ra bị lật ngược — thường gợi sắc thái nội tâm, cản trở hoặc mặt cần điều chỉnh của nghĩa gốc.'],
  ['Can Chi', 'Cách ghi năm/ngày/giờ bằng 10 Thiên Can ghép 12 Địa Chi, lặp theo chu kỳ 60 (Lục thập hoa giáp).'],
  ['Nạp âm', 'Ngũ hành "ẩn" gán cho mỗi cặp Can Chi (vd Bính Ngọ = Thiên Hà Thủy) — khác ngũ hành của riêng Can hay Chi.'],
  ['Tam hợp / Tứ hành xung', 'Nhóm 3 con giáp được cho là hợp nhau / nhóm 4 con giáp khắc nhau theo quan niệm dân gian.'],
  ['Giờ hoàng đạo', 'Các canh giờ được xem là thuận trong ngày, tính theo Can Chi của ngày (quan niệm phong thủy).'],
  ['Tam Tai', 'Ba năm liên tiếp được cho là kém thuận với mỗi nhóm tuổi tam hợp.'],
  ['Cung phi · Bát Trạch', 'Quẻ mệnh tính theo năm sinh và giới tính, dùng để xem hướng hợp tuổi.'],
  ['Sao hạn (Cửu Diệu)', 'Chín sao luân phiên "chiếu" mỗi tuổi mỗi năm theo quan niệm dân gian.'],
  ['Số Chủ Đạo (Life Path)', 'Rút gọn ngày-tháng-năm sinh về một chữ số (giữ 11/22/33) — gợi thiên hướng xuyên suốt cuộc đời.'],
  ['Số bậc thầy (11/22/33)', 'Các số không rút gọn tiếp, mang năng lượng mạnh và đặc thù hơn.'],
  ['Năm cá nhân (Personal Year)', 'Chu kỳ 1→9 lặp lại, tính từ ngày-tháng sinh cộng năm dương hiện tại.'],
  ['Biểu đồ Lo Shu', 'Ma trận cửu cung dựng từ các chữ số ngày sinh, để xem con số nào thiếu hay thừa.'],
  ['Hào · Quẻ', 'Quẻ Dịch gồm 6 hào (vạch) liền là dương, đứt là âm, dựng từ dưới lên.'],
  ['Hào động · Quẻ biến', 'Hào "động" (tổng 6 hoặc 9 khi gieo) đổi âm↔dương, sinh ra "quẻ biến" gợi xu hướng chuyển tiếp.'],
  ['Decan (thập phân)', 'Mỗi cung hoàng đạo chia 3 đoạn 10°, mỗi đoạn nhuốm thêm sắc thái một cung cùng nguyên tố.']
]

import { usePageSeo } from '../components/useSeo.js'
export default function Sources() {
  usePageSeo({ title: 'Nguồn & lưu ý — tài liệu tham khảo và bản quyền | Tam Sở', description: 'Danh sách nguồn tài liệu và tài nguyên hợp pháp (Rider–Waite, Legge 1899, font OFL/MIT) cùng quan điểm trung thực: tách dữ kiện với diễn giải tham khảo.', path: '/nguon', breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Nguồn & lưu ý' }] })

  return (
    <>
      <section className="wrap text-center pt-[78px] pb-4">
        <div className="text-gold text-kicker uppercase">Minh bạch · Có căn cứ</div>
        <h1 className="text-display my-3">Nguồn &amp; Lưu ý</h1>
        <p className="text-muted text-lead max-w-[680px] mx-auto">Tam Sở phân biệt rõ điều gì <em>kiểm chứng được</em> và điều gì là <em>diễn giải truyền thống</em>.</p>
      </section>

      <section className="wrap py-8">
        <div className="disclaimer max-w-[900px] mx-auto"><b>Tuyên bố miễn trừ.</b> Mọi hệ thống ở đây (Tarot, Thần số học, Tử vi, Chiêm tinh, Kinh Dịch) là <b>tín ngưỡng – văn hóa</b>, <b>không phải khoa học</b> và không có năng lực tiên đoán đã kiểm chứng. Nội dung dành cho <b>tham khảo, chiêm nghiệm, giải trí</b>; không thay tư vấn y tế, tâm lý, pháp lý, tài chính.</div>
      </section>

      <section className="wrap py-8">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Dữ kiện vs. Diễn giải</h2>
        <div className="overflow-x-auto max-w-[900px] mx-auto mt-3.5">
          <table className="data">
            <thead><tr><th>Thành phần</th><th>Bản chất</th><th>Mức tin cậy</th></tr></thead>
            <tbody>
              <tr><td>Can Chi năm/ngày/giờ, nạp âm</td><td>Lịch pháp (chu kỳ 60)</td><td><span className="pill h-Mộc">Kiểm chứng được</span></td></tr>
              <tr><td>Đổi dương → âm lịch (ranh giới Tết)</td><td>Thiên văn (Hồ Ngọc Đức)</td><td><span className="pill h-Mộc">Kiểm chứng được</span></td></tr>
              <tr><td>Số Chủ Đạo, bộ số tên, Lo Shu</td><td>Quy tắc số học xác định</td><td><span className="pill h-Mộc">Kiểm chứng được</span></td></tr>
              <tr><td>Năm/Tháng/Ngày cá nhân</td><td>Số học theo lịch dương</td><td><span className="pill h-Mộc">Kiểm chứng được</span></td></tr>
              <tr><td>Cung hoàng đạo theo ngày</td><td>Mốc thiên văn quy ước</td><td><span className="pill h-Mộc">Kiểm chứng được</span></td></tr>
              <tr><td>Ý nghĩa lá bài, con số, con giáp, quẻ</td><td>Diễn giải biểu tượng</td><td><span className="pill h-Thổ">Tham khảo</span></td></tr>
              <tr><td>Hợp tuổi, giờ hoàng đạo, Tam Tai, vận mệnh</td><td>Quan niệm tín ngưỡng</td><td><span className="pill h-Hỏa">Không kiểm chứng</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap py-8">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Nguồn tham khảo</h2>
        <div className="panel p-[26px] max-w-[900px] mx-auto">
          <p><b>🃏 Tarot:</b> <a href="https://labyrinthos.co/blogs/tarot-card-meanings-list/tagged/major-arcana" target="_blank" rel="noopener">Labyrinthos Academy</a> · bộ Rider–Waite–Smith (1909, phạm vi công cộng) · <a href="https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck" target="_blank" rel="noopener">Wikimedia Commons</a>. Luận <b>Tình yêu/Sự nghiệp</b> cho 22 lá Ẩn Chính và 56 lá Ẩn Phụ do Tam Sở biên soạn theo nghĩa truyền thống RWS (tham khảo Labyrinthos) — chỉ mang tính tham khảo, chiêm nghiệm.</p>
          <p><b>🔢 Thần số học:</b> <a href="https://www.numerology.com/articles/your-numerology-chart/core-numbers-numerology/" target="_blank" rel="noopener">Numerology.com — Core Numbers</a> & <a href="https://www.numerology.com/articles/your-numerology-chart/life-path-number-meanings/" target="_blank" rel="noopener">Life Path</a> (Pythagorean) · Đỉnh cao & Thử thách: <a href="https://www.worldnumerology.com/numerology-pinnacles/" target="_blank" rel="noopener">World Numerology</a> · Năm cá nhân (tháng+ngày sinh + năm dương hiện tại) & Ngày cá nhân: <a href="https://www.numerology.com/articles/numerology-news/2026-numerology-predictions/" target="_blank" rel="noopener">Numerology.com — Personal Year</a>, <a href="https://www.numerology.com/daily-number/" target="_blank" rel="noopener">Personal Day</a>.</p>
          <p><b>☯ Tử vi · Can Chi:</b> <a href="https://wiki.batdongsan.com.vn/wiki/thien-can-dia-chi-783653" target="_blank" rel="noopener">Wiki Batdongsan</a> · <a href="https://vi.wikipedia.org/wiki/L%E1%BB%A5c_th%E1%BA%ADp_hoa_gi%C3%A1p" target="_blank" rel="noopener">Lục thập hoa giáp</a> · can chi ngày (mốc 1/3/2000 = Mậu Ngọ, vanhoavaphattrien.vn) · <a href="https://vi.wikipedia.org/wiki/Gi%E1%BB%9D_ho%C3%A0ng_%C4%91%E1%BA%A1o" target="_blank" rel="noopener">Giờ hoàng đạo</a> · tam hợp/tứ hành xung (bachhoaxanh, mytour) · đổi âm lịch: <a href="https://www.informatik.uni-leipzig.de/~duc/amlich/" target="_blank" rel="noopener">Hồ Ngọc Đức</a> · sao hạn Cửu Diệu đối chiếu <a href="https://quantrimang.com/cuoc-song/bang-sao-giai-han-theo-tuoi-169419" target="_blank" rel="noopener">Quantrimang</a>.</p>
          <p><b>♈ Cung hoàng đạo:</b> mốc ngày theo hệ chiêm tinh phương Tây phổ biến (sforum/CellphoneS, mytour); decan theo hệ triplicity decanate.</p>
          <p className="m-0"><b>📖 Kinh Dịch:</b> <a href="https://vi.wikipedia.org/wiki/Kinh_D%E1%BB%8Bch" target="_blank" rel="noopener">Kinh Dịch (Wikipedia)</a> — thứ tự Văn Vương, bát quái; lời quẻ là gloss ngắn · cách luận hào động: <a href="https://horos.vn/blog/post/64-que-kinh-dich-bang-tra-cuu-day-du-huong-dan-gieo-que-va-giai-que" target="_blank" rel="noopener">Horos</a> · nguyên văn thoán/hào từ: <a href="https://dich.kabala.vn/" target="_blank" rel="noopener">Dịch học Kabala</a>. <b>Đại Tượng (象)</b> phỏng dịch theo bản <i>I Ching</i> của James Legge (1899) — phạm vi công cộng.</p>
          <p className="m-0"><b>☆ Lá số Tử Vi (Tử Vi Đẩu Số):</b> thuật an sao (an Mệnh/Thân, Cục, 14 chính tinh, Tứ Hóa, lục cát – lục sát, đại hạn) đối chiếu <a href="https://tracuutuvi.com/an-sao-tu-vi.html" target="_blank" rel="noopener">Tra Cứu Tử Vi</a> &amp; <a href="https://tuvisaigon.vn/bai-1-an-menh-than-trong-tu-vi-dau-so.html" target="_blank" rel="noopener">Tử Vi Sài Gòn</a>; ý nghĩa sao – cung &amp; cách cục tự biên soạn, tham khảo.</p>
        </div>
      </section>

      <section className="wrap py-8">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Bản quyền &amp; Ghi công</h2>
        <div className="panel p-[26px] max-w-[900px] mx-auto">
          <p><b>🃏 Ảnh Tarot:</b> bộ <b>Rider–Waite–Smith</b> (họa sĩ Pamela Colman Smith &amp; A. E. Waite, xuất bản 1909). Tác phẩm gốc đã thuộc <b>phạm vi công cộng</b>: ở Hoa Kỳ vì công bố từ năm 1909 (đã hết thời hạn bảo hộ), và ở các nước theo luật "đời tác giả + 70 năm" vì hoạ sĩ Pamela Colman Smith mất năm 1951 (công cộng từ 2022). Bản quét tải từ <a href="https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck" target="_blank" rel="noopener">Wikimedia Commons</a> (gắn nhãn PD).</p>
          <p><b>🔤 Phông chữ:</b> <i>Be Vietnam Pro</i> và <i>Playfair Display</i> qua Google Fonts — giấy phép <a href="https://openfontlicense.org/" target="_blank" rel="noopener">SIL Open Font License</a>.</p>
          <p><b>🧩 Thư viện mã nguồn mở:</b> React, Vite, Tailwind CSS, React Router, html-to-image (giấy phép MIT).</p>
          <p><b>🗓 Lịch âm:</b> thuật toán quy đổi của <a href="https://www.informatik.uni-leipzig.de/~duc/amlich/" target="_blank" rel="noopener">Hồ Ngọc Đức</a> — xin ghi công tác giả.</p>
          <p className="m-0"><b>✍️ Nội dung luận giải:</b> do Tam Sở <b>biên soạn bằng tiếng Việt</b> từ ý nghĩa truyền thống của mỗi hệ thống, có dẫn nguồn tham khảo ở trên — <b>không sao chép nguyên văn</b>. Biểu trưng ✦, ảnh chia sẻ và icon do dự án tự tạo. Nếu bạn là chủ sở hữu một nội dung và thấy chưa được ghi công đúng, vui lòng liên hệ để chỉnh sửa.</p>
        </div>
      </section>

      <section className="wrap py-8">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Thuật ngữ thường gặp</h2>
        <p className="text-muted text-center max-w-[680px] mx-auto mb-5">Vài khái niệm hay gặp, giải thích ngắn gọn để bạn đọc kết quả đỡ bỡ ngỡ.</p>
        <div className="panel p-[26px] max-w-[900px] mx-auto">
          <div className="grid sm:grid-cols-2 gap-x-7 gap-y-3.5">
            {GLOSSARY.map(([t, d]) => (
              <div key={t}><b className="text-gold">{t}.</b> <span className="text-muted">{d}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-8">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Câu hỏi thường gặp</h2>
        <div className="max-w-[820px] mx-auto mt-5">
          {FAQ.map((it, i) => (
            <details key={i} className="bg-gold/5 border border-gold/20 rounded-xl mb-2.5 overflow-hidden">
              <summary className="cursor-pointer px-[18px] py-[15px] font-serif text-[1.08rem] font-semibold marker:content-none flex items-start gap-3"><span className="text-gold">?</span>{it.q}</summary>
              <div className="px-[18px] pb-[18px] pt-1 text-muted leading-relaxed">{it.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap py-8">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Điều chưa chắc — cần kiểm chứng thêm</h2>
        <div className="panel p-[26px] max-w-[900px] mx-auto">
          <p className="m-0">• <b>Ranh giới năm Can Chi:</b> đổi vào Tết (không phải 1/1) — Tam Sở đã <b>tự quy đổi âm lịch</b> khi nhập đủ ngày/tháng; lưu ý một số phái dùng mốc Lập Xuân.<br />
          • <b>Cung hoàng đạo giáp ranh:</b> mốc ngày lệch ±1 tùy năm.<br />
          • <b>Tên tiếng Việt trong thần số học:</b> quy ước bỏ dấu (đ→d) khác nhau giữa các trường phái.<br />
          • <b>Lời quẻ Kinh Dịch &amp; nạp âm:</b> có biến thể giữa các bản dịch/vùng miền — chúng tôi nêu rõ thay vì khẳng định tuyệt đối.</p>
        </div>
      </section>
    </>
  )
}
