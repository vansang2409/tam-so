/* ĐỐI CHIẾU HAI LÁ SỐ — dệt một đoạn chiêm nghiệm từ Mệnh, Phu Thê & quan hệ địa chi.
 * Thuần (pure), dễ kiểm thử. Giữ ĐÚNG ràng buộc của trang: KHÔNG kết luận hợp/không hợp,
 * chỉ nêu dữ kiện + gợi mở để hai người tự hiểu nhau. */

const REL_REFLECT = {
  'Tam hợp': 'năm sinh thuộc nhóm tam hợp — lối dân gian xem là dễ nâng đỡ, đồng điệu',
  'Lục hợp': 'năm sinh lục hợp — được xem là hợp ý, dễ đồng hành',
  'Lục xung': 'năm sinh lục xung — khác biệt rõ; người xưa khuyên cần dung hòa và lắng nghe nhau nhiều hơn',
  'Tứ hành xung': 'năm sinh thuộc nhóm tứ hành xung — dễ khác nhịp, nên kiên nhẫn và mềm mỏng với nhau',
  'Cùng tuổi': 'cùng địa chi năm sinh — dễ đồng cảm, nhưng đôi khi giống nhau quá nên thiếu phần bổ khuyết',
  'Bình thường': 'năm sinh không xung không hợp nổi bật — phần lớn tùy cách cư xử của mỗi người'
}
const vcd = t => /vô chính diệu/i.test(t || '')

/** input: { menhA:{chi,ten}, menhB:{chi,ten}, phuTheA:{chi,ten}, phuTheB:{chi,ten}, rel } */
export function weavePair({ menhA, menhB, phuTheA, phuTheB, rel }) {
  const parts = []

  // 1) Mệnh — cá tính lõi
  let m = 'Về Mệnh: người thứ nhất an tại ' + menhA.chi + ' (' + menhA.ten + '), người thứ hai tại ' + menhB.chi + ' (' + menhB.ten + ').'
  if (vcd(menhA.ten) && vcd(menhB.ten)) m += ' Cả hai Mệnh đều vô chính diệu — cá tính linh hoạt, "mượn" nét từ cung đối chiếu, nên càng cần thời gian để thật sự hiểu nhau.'
  else if (vcd(menhA.ten) || vcd(menhB.ten)) m += ' Một người Mệnh vô chính diệu (mềm, dễ thích nghi) bên một người có chính tinh rõ nét — có thể bổ khuyết cho nhau nếu biết nhường.'
  else m += ' Hai Mệnh đều có chính tinh riêng — hai cá tính đều rõ nét, sự dung hòa nằm ở chỗ tôn trọng khác biệt của nhau.'
  parts.push(m)

  // 2) Phu Thê — kỳ vọng nơi bạn đời
  parts.push('Về cung Phu Thê — nơi lối luận truyền thống soi điều mỗi người mong ở bạn đời: người thứ nhất có ' + phuTheA.ten + ' (cung ' + phuTheA.chi + '), người thứ hai có ' + phuTheB.ten + ' (cung ' + phuTheB.chi + '). Hãy xem đây là gợi ý để hai người trò chuyện về kỳ vọng của nhau, không phải điểm số.')

  // 3) Quan hệ địa chi năm sinh
  parts.push('Về năm sinh, ' + (REL_REFLECT[rel] || 'quan hệ địa chi ở mức bình thường') + '.')

  // 4) Chốt — KHÔNG phán
  parts.push('Gộp lại, đây là vài dữ kiện để hai người cùng chiêm nghiệm và hiểu nhau hơn — KHÔNG phải kết luận hợp hay không hợp. Một mối quan hệ bền nằm ở thấu hiểu và vun đắp, hơn bất kỳ lá số nào.')

  return parts.join(' ')
}

export default weavePair
