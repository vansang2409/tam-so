import { useState, useRef, useEffect, useCallback } from 'react'
import { rutXam } from '../data/dichua.js'

/* ShakeXam — xin xăm bằng cách LẮC: kéo ống xăm qua lại (chuột/cảm ứng) hoặc lắc
 * điện thoại (DeviceMotion). Lắc đủ mạnh → một que xăm rơi ra → hiện diễn giải.
 * Tôn trọng prefers-reduced-motion; có nút phụ cho người không lắc được (a11y). */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const STICKS = Array.from({ length: 11 })

export default function ShakeXam() {
  const [phase, setPhase] = useState('idle')   // idle | shaking | dropping | result
  const [progress, setProgress] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [xam, setXam] = useState(null)
  const [active, setActive] = useState(false)
  const [motionOn, setMotionOn] = useState(false)
  const [needPerm, setNeedPerm] = useState(false)
  const lastX = useRef(null), lastDir = useRef(0), lastShakeT = useRef(0)
  const tiltTimer = useRef(null), dropTimer = useRef(null)
  const progRef = useRef(0), dropped = useRef(false)

  useEffect(() => () => { clearTimeout(tiltTimer.current); clearTimeout(dropTimer.current) }, [])

  const startDrop = useCallback(() => {
    if (dropped.current) return
    dropped.current = true
    setActive(false); setPhase('dropping')
    clearTimeout(dropTimer.current)
    dropTimer.current = setTimeout(() => { setXam(rutXam()); setPhase('result') }, reduced() ? 200 : 950)
  }, [])

  const bump = useCallback((amt, dir) => {
    if (dropped.current) return
    setTilt(dir * 11)
    clearTimeout(tiltTimer.current)
    tiltTimer.current = setTimeout(() => setTilt(0), 150)
    setPhase(p => (p === 'result' || p === 'dropping') ? p : 'shaking')
    const np = Math.min(100, progRef.current + amt)
    progRef.current = np
    setProgress(np)
    if (np >= 100) startDrop()
  }, [startDrop])

  // kéo qua lại (pointer): đổi chiều = một nhịp lắc
  const feed = useCallback(x => {
    if (lastX.current != null) {
      const dx = x - lastX.current
      if (Math.abs(dx) > 3) {
        const dir = dx > 0 ? 1 : -1
        if (lastDir.current && dir !== lastDir.current) bump(8, dir)
        else setTilt(dir * 8)
        lastDir.current = dir
      }
    }
    lastX.current = x
  }, [bump])

  const onDown = e => { if (phase === 'result') return; setActive(true); lastX.current = e.clientX; lastDir.current = 0; try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {} }
  const onMove = e => { if (active) feed(e.clientX) }
  const onUp = () => { setActive(false); lastX.current = null; setTilt(0) }

  // lắc điện thoại (DeviceMotion)
  useEffect(() => {
    if (!motionOn) return
    const onMotion = e => {
      const a = e.accelerationIncludingGravity || e.acceleration; if (!a) return
      const mag = Math.abs(a.x || 0) + Math.abs(a.y || 0)
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now())
      if (mag > 17 && now - lastShakeT.current > 130) { lastShakeT.current = now; bump(11, (a.x || 0) > 0 ? 1 : -1) }
    }
    window.addEventListener('devicemotion', onMotion)
    return () => window.removeEventListener('devicemotion', onMotion)
  }, [motionOn, bump])

  useEffect(() => {
    const DME = typeof window !== 'undefined' && window.DeviceMotionEvent
    if (DME && typeof DME.requestPermission === 'function') setNeedPerm(true)
    else if (DME) setMotionOn(true)
  }, [])

  const enableMotion = async () => {
    try { const r = await window.DeviceMotionEvent.requestPermission(); if (r === 'granted') { setMotionOn(true); setNeedPerm(false) } } catch (_) {}
  }
  const reset = () => {
    clearTimeout(dropTimer.current)
    progRef.current = 0; dropped.current = false; lastDir.current = 0; lastX.current = null
    setPhase('idle'); setProgress(0); setTilt(0); setXam(null)
  }
  const autoShake = () => { if (dropped.current || phase === 'result') return; startDrop() }

  if (phase === 'result' && xam) {
    return (
      <div className="xam-result animate-fade">
        <div className="xam-result-badge">Thẻ số {xam.so} · {xam.bac}</div>
        <p className="xam-result-cau">“{xam.cau[0]}<br />{xam.cau[1]}”</p>
        <div className="xam-result-body">
          <p className="m-0">{xam.dienGiai}</p>
          <p className="xam-result-khuyen">💡 {xam.loiKhuyen}</p>
        </div>
        <button type="button" className="dc-btn dc-btn-gold" onClick={reset}>🔄 Xin thẻ khác</button>
        <p className="xam-note">Diễn giải tham khảo theo thể loại dân gian — không phải lời tiên đoán chắc chắn.</p>
      </div>
    )
  }

  const dropping = phase === 'dropping'
  return (
    <div className="xam-wrap">
      <div className="xam-stage" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        role="button" tabIndex={0} aria-label="Lắc ống xăm — kéo qua lại để xin thẻ">
        <div className={'xam-cyl' + (active ? ' is-shaking' : '') + (dropping ? ' is-dropping' : '')} style={{ transform: `rotate(${tilt}deg)` }}>
          <div className="xam-sticks">
            {STICKS.map((_, i) => <span key={i} className="xam-stick" style={{ '--n': i, height: (54 + ((i * 13) % 40)) + 'px' }} />)}
          </div>
          <div className="xam-tube"><span className="xam-mouth" /></div>
        </div>
        {dropping && <span className="xam-falling" />}
        {!active && !dropping && progress === 0 && <div className="xam-hand" aria-hidden="true">🤲</div>}
      </div>

      <div className="xam-bar"><span style={{ width: progress + '%' }} /></div>
      <p className="xam-hint">
        {dropping ? 'Que xăm đang rơi…'
          : progress === 0 ? 'Kéo ống xăm qua lại (hoặc lắc điện thoại) để xin thẻ'
          : progress < 60 ? 'Lắc tiếp nào…' : 'Sắp rồi, lắc mạnh hơn chút!'}
      </p>
      {needPerm && <button type="button" className="dc-btn dc-btn-ghost xam-perm" onClick={enableMotion}>📱 Bật cảm biến lắc điện thoại</button>}
      {!dropping && <button type="button" className="xam-fallback" onClick={autoShake}>Không lắc được? Bấm để xin thẻ</button>}
    </div>
  )
}
