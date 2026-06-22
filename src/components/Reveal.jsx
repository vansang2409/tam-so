import { useRef, useEffect, useState } from 'react'

/* Hiện dần khi cuộn tới (scroll-reveal). An toàn:
 * - Tôn trọng prefers-reduced-motion → hiện ngay, không hiệu ứng.
 * - Không có IntersectionObserver (SSR/cũ) → hiện ngay.
 * base='reveal' (mặc định): fade-up cả khối.
 * base='stagger-parent': lưới con hiện so le (xem .stagger-parent trong index.css). */
const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0, base = 'reveal', ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(
    () => reduced() || typeof IntersectionObserver === 'undefined'
  )
  useEffect(() => {
    if (shown) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown])
  return (
    <Tag
      ref={ref}
      className={base + ' ' + (shown ? 'in ' : '') + className}
      style={delay ? { transitionDelay: delay + 'ms' } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
