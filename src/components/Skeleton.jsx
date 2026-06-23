/** Skeleton tải thống nhất (M05) — khối shimmer dùng chung cho trạng thái đang tải.
 * Dùng animate-pulse của Tailwind core + nền slate nhạt để hợp tông clean-SaaS. aria-hidden vì
 * chỉ là placeholder thị giác. Truyền className để khớp kích thước nơi dùng. */
export default function Skeleton({ className = '', style, radius = 8, ratio }) {
  return (
    <div
      className={'animate-pulse ' + className}
      aria-hidden="true"
      style={{
        background: 'linear-gradient(160deg, #eef2f7 0%, #e2e8f0 50%, #eef2f7 100%)',
        borderRadius: radius,
        ...(ratio ? { aspectRatio: ratio } : null),
        ...style
      }}
    />
  )
}
