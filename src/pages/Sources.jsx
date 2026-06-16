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
              <tr><td>Số Chủ Đạo, bộ số tên, Lo Shu</td><td>Quy tắc số học xác định</td><td><span className="pill h-Mộc">Kiểm chứng được</span></td></tr>
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
          <p><b>🃏 Tarot:</b> <a href="https://labyrinthos.co/blogs/tarot-card-meanings-list/tagged/major-arcana" target="_blank" rel="noopener">Labyrinthos Academy</a> · bộ Rider–Waite–Smith (1909, phạm vi công cộng) · <a href="https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck" target="_blank" rel="noopener">Wikimedia Commons</a>.</p>
          <p><b>🔢 Thần số học:</b> <a href="https://www.numerology.com/articles/your-numerology-chart/core-numbers-numerology/" target="_blank" rel="noopener">Numerology.com — Core Numbers</a> & <a href="https://www.numerology.com/articles/your-numerology-chart/life-path-number-meanings/" target="_blank" rel="noopener">Life Path</a> (Pythagorean).</p>
          <p><b>☯️ Tử vi · Can Chi:</b> <a href="https://wiki.batdongsan.com.vn/wiki/thien-can-dia-chi-783653" target="_blank" rel="noopener">Wiki Batdongsan</a> · <a href="https://vi.wikipedia.org/wiki/L%E1%BB%A5c_th%E1%BA%ADp_hoa_gi%C3%A1p" target="_blank" rel="noopener">Lục thập hoa giáp</a> · can chi ngày (mốc 1/3/2000 = Mậu Ngọ, vanhoavaphattrien.vn) · <a href="https://vi.wikipedia.org/wiki/Gi%E1%BB%9D_ho%C3%A0ng_%C4%91%E1%BA%A1o" target="_blank" rel="noopener">Giờ hoàng đạo</a> · tam hợp/tứ hành xung (bachhoaxanh, mytour).</p>
          <p><b>♈ Cung hoàng đạo:</b> mốc ngày theo hệ chiêm tinh phương Tây phổ biến (sforum/CellphoneS, mytour).</p>
          <p className="m-0"><b>☶ Kinh Dịch:</b> <a href="https://vi.wikipedia.org/wiki/Kinh_D%E1%BB%8Bch" target="_blank" rel="noopener">Kinh Dịch (Wikipedia)</a> — thứ tự Văn Vương, bát quái; lời quẻ là gloss ngắn.</p>
        </div>
      </section>

      <section className="wrap py-8">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-center">Điều chưa chắc — cần kiểm chứng thêm</h2>
        <div className="panel p-[26px] max-w-[900px] mx-auto">
          <p className="m-0">• <b>Ranh giới năm Can Chi:</b> đổi vào Tết/Lập Xuân, không phải 1/1.<br />
          • <b>Cung hoàng đạo giáp ranh:</b> mốc ngày lệch ±1 tùy năm.<br />
          • <b>Tên tiếng Việt trong thần số học:</b> quy ước bỏ dấu (đ→d) khác nhau giữa các trường phái.<br />
          • <b>Lời quẻ Kinh Dịch &amp; nạp âm:</b> có biến thể giữa các bản dịch/vùng miền — chúng tôi nêu rõ thay vì khẳng định tuyệt đối.</p>
        </div>
      </section>
    </>
  )
}
