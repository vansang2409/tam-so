const FAQ = [
  { q: 'Tam Sở là gì?', a: 'Là web công cụ huyền học tiếng Việt miễn phí, gom Tarot, Thần số học, Tử vi/Bát Trạch, Cung hoàng đạo và Kinh Dịch về một nơi. Mọi thứ chạy ngay trên trình duyệt, không cần cài đặt.' },
  { q: 'Kết quả có chính xác, có đoán đúng tương lai không?', a: 'Đây là các hệ thống tín ngưỡng – văn hóa, KHÔNG phải khoa học và không có năng lực tiên đoán đã được kiểm chứng. Phần tính toán (Can Chi, con số, lịch âm…) là lịch pháp/số học chính xác; phần luận giải chỉ để tham khảo và chiêm nghiệm, không phải lời phán về tương lai.' },
  { q: 'Dữ liệu của tôi có bị lưu hay gửi đi đâu không?', a: 'Không. Tam Sở không có máy chủ xử lý dữ liệu cá nhân, không cần đăng nhập. Họ tên/ngày sinh bạn nhập chỉ được tính trên máy bạn; phần lịch sử và lá yêu thích lưu cục bộ (localStorage) ngay trong trình duyệt của bạn — bạn xóa bất cứ lúc nào.' },
  { q: 'Vì sao có chỗ ghi "cần kiểm chứng thêm"?', a: 'Một số quy ước khác nhau giữa các nguồn/trường phái (ranh giới năm theo Tết, mốc cung hoàng đạo giáp ranh, cách quy đổi tên tiếng Việt trong thần số học…). Khi chưa có cơ sở chắc chắn, chúng tôi nói thẳng thay vì khẳng định tuyệt đối.' },
  { q: 'Có cần đăng nhập hay trả phí không?', a: 'Không. Tam Sở hoàn toàn miễn phí và không cần tài khoản.' },
  { q: 'Vì sao đôi khi lá Tarot hiện khung biểu tượng thay vì tranh?', a: 'Khi ảnh chưa tải được (mạng hạn chế nguồn ảnh hoặc đang offline), web hiển thị một khung thẻ thay thế để giao diện không vỡ. Bản cài đặt đầy đủ (tự host ảnh) sẽ hiển thị tranh Rider–Waite–Smith.' }
]

export default function Sources() {
  return (
    <>
      <section className="wrap text-center pt-[78px] pb-4">
        <div className="text-gold tracking-[.32em] uppercase text-[.78rem] font-semibold">Minh bạch · Có căn cứ</div>
        <h1 className="text-[clamp(2.3rem,5vw,3.4rem)] my-2.5">Nguồn &amp; Lưu ý</h1>
        <p className="text-muted text-[1.12rem] max-w-[680px] mx-auto">Tam Sở phân biệt rõ điều gì <em>kiểm chứng được</em> và điều gì là <em>diễn giải truyền thống</em>.</p>
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
          <p><b>🃏 Tarot:</b> <a href="https://labyrinthos.co/blogs/tarot-card-meanings-list/tagged/major-arcana" target="_blank" rel="noopener">Labyrinthos Academy</a> · bộ Rider–Waite–Smith (1909, phạm vi công cộng) · <a href="https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck" target="_blank" rel="noopener">Wikimedia Commons</a>. Luận <b>Tình yêu/Sự nghiệp</b> cho lá Ẩn Phụ theo khung <b>chất (nguyên tố) + số/court</b> phổ biến (Labyrinthos), không phải lời phán riêng từng lá.</p>
          <p><b>🔢 Thần số học:</b> <a href="https://www.numerology.com/articles/your-numerology-chart/core-numbers-numerology/" target="_blank" rel="noopener">Numerology.com — Core Numbers</a> & <a href="https://www.numerology.com/articles/your-numerology-chart/life-path-number-meanings/" target="_blank" rel="noopener">Life Path</a> (Pythagorean) · Đỉnh cao & Thử thách: <a href="https://www.worldnumerology.com/numerology-pinnacles/" target="_blank" rel="noopener">World Numerology</a> · Năm cá nhân (tháng+ngày sinh + năm dương hiện tại) & Ngày cá nhân: <a href="https://www.numerology.com/articles/numerology-news/2026-numerology-predictions/" target="_blank" rel="noopener">Numerology.com — Personal Year</a>, <a href="https://www.numerology.com/daily-number/" target="_blank" rel="noopener">Personal Day</a>.</p>
          <p><b>☯ Tử vi · Can Chi:</b> <a href="https://wiki.batdongsan.com.vn/wiki/thien-can-dia-chi-783653" target="_blank" rel="noopener">Wiki Batdongsan</a> · <a href="https://vi.wikipedia.org/wiki/L%E1%BB%A5c_th%E1%BA%ADp_hoa_gi%C3%A1p" target="_blank" rel="noopener">Lục thập hoa giáp</a> · can chi ngày (mốc 1/3/2000 = Mậu Ngọ, vanhoavaphattrien.vn) · <a href="https://vi.wikipedia.org/wiki/Gi%E1%BB%9D_ho%C3%A0ng_%C4%91%E1%BA%A1o" target="_blank" rel="noopener">Giờ hoàng đạo</a> · tam hợp/tứ hành xung (bachhoaxanh, mytour) · đổi âm lịch: <a href="https://www.informatik.uni-leipzig.de/~duc/amlich/" target="_blank" rel="noopener">Hồ Ngọc Đức</a> · sao hạn Cửu Diệu đối chiếu <a href="https://quantrimang.com/cuoc-song/bang-sao-giai-han-theo-tuoi-169419" target="_blank" rel="noopener">Quantrimang</a>.</p>
          <p><b>♈ Cung hoàng đạo:</b> mốc ngày theo hệ chiêm tinh phương Tây phổ biến (sforum/CellphoneS, mytour); decan theo hệ triplicity decanate.</p>
          <p className="m-0"><b>📖 Kinh Dịch:</b> <a href="https://vi.wikipedia.org/wiki/Kinh_D%E1%BB%8Bch" target="_blank" rel="noopener">Kinh Dịch (Wikipedia)</a> — thứ tự Văn Vương, bát quái; lời quẻ là gloss ngắn · cách luận hào động: <a href="https://horos.vn/blog/post/64-que-kinh-dich-bang-tra-cuu-day-du-huong-dan-gieo-que-va-giai-que" target="_blank" rel="noopener">Horos</a> · nguyên văn thoán/hào từ: <a href="https://dich.kabala.vn/" target="_blank" rel="noopener">Dịch học Kabala</a>.</p>
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
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Câu hỏi thường gặp</h2>
        <div className="max-w-[820px] mx-auto mt-5">
          {FAQ.map((it, i) => (
            <details key={i} className="bg-white/[.045] border border-gold/20 rounded-xl mb-2.5 overflow-hidden">
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
