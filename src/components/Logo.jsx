/* Logo Tam Sở — huy hiệu tròn (rồng + bút lông + chữ 'Tam Sở') trên đĩa đá.
 * Ảnh public/logo.png đã cắt tròn, nền trong suốt → dùng được trên nền sáng lẫn tối.
 * Giữ API cũ (size, className) để mọi nơi gọi <Logo/> không phải đổi. */
export default function Logo({ size = 30, className = '' }) {
  const src = (import.meta.env.BASE_URL || '/') + 'logo.png'
  return (
    <img src={src} width={size} height={size} className={className} alt="Tam Sở" loading="lazy"
      style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle', borderRadius: '50%' }} />
  )
}
