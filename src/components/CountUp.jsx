import { useRef, useEffect, useState } from 'react'

/* Đếm số 0 → đích khi cuộn tới. Reduced-motion / không hỗ trợ → hiện thẳng đích.
 * end không phải số → render nguyên giá trị. */
const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function CountUp({ end, duration = 850, className = '' }) {
  const target = Number(end)
  const valid = Number.isFinite(target)
  const ref = useRef(null)
  const [val, setVal] = useState(() => (!valid || reduced()) ? target : 0)
  useEffect(() => {
    if (!valid || reduced()) { setVal(target); return }
    const el = ref.current
    let raf = 0, started = false
    const run = () => {
      const t0 = performance.now()
      const tick = now => {
        const p = Math.min(1, (now - t0) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(target * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    if (!el || typeof IntersectionObserver === 'undefined') { run(); return () => cancelAnimationFrame(raf) }
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting && !started) { started = true; run(); io.disconnect() } }),
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target, duration, valid])
  return <span ref={ref} className={className}>{valid ? val : end}</span>
}
