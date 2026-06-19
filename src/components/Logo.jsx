/* Logo Tam Sở — emblem "Trăng & sao" (Mẫu 2): đĩa giấy-cổ, viền vàng, vầng trăng khuyết
 * vàng ôm một ngôi sao ✦. Vẽ thuần SVG (sắc nét mọi kích cỡ). Vầng trăng = đĩa vàng bị
 * "khuyết" bởi một đĩa màu nền; đổi `bg` khi đặt trên nền khác để khoảng khuyết khớp màu. */
export default function Logo({ size = 30, className = '', bg = '#f7eedb', gold = '#d3a24e', star = '#9a6b28' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} role="img" aria-label="Tam Sở" focusable="false">
      <circle cx="50" cy="50" r="46" fill={bg} stroke={gold} strokeWidth="4" />
      <circle cx="50" cy="50" r="39" fill="none" stroke={gold} strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="45" cy="53" r="25" fill={gold} />
      <circle cx="57" cy="45" r="22" fill={bg} />
      <polygon points="0,-1 0.24,-0.24 1,0 0.24,0.24 0,1 -0.24,0.24 -1,0 -0.24,-0.24" fill={star} transform="translate(66,48) scale(10.5)" />
    </svg>
  )
}
