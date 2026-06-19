/** Skeleton tải thống nhất (M05) — khối shimmer dùng chung cho trạng thái đang tải.
 * Dùng animate-pulse của Tailwind core + nền kem để hợp tông giấy-cổ. aria-hidden vì
 * chỉ là placeholder thị giác. Truyền className để khớp kích thước nơi dùng. */
export default function Skeleton({ className = '', style, radius = 8, ratio }) {
  return (
    <div
      className={'animate-pulse ' + className}
      aria-hidden="true"
      style={{
        background: 'linear-gradient(160deg, #f1e6cc 0%, #e6d6b0 50%, #f1e6cc 100%)',
        borderRadius: radius,
        ...(ratio ? { aspectRatio: ratio } : null),
        ...style
      }}
    />
  )
}
