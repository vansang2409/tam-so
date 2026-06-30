import { useState, useRef, useEffect, useCallback } from 'react'
import { rutXam, addXamLichSu } from '../data/dichua.js'

const dcAsset = name => (import.meta.env.BASE_URL || '/') + 'dichua/' + name

/* ShakeXam - xin xam bang cach lac. Dem theo thoi gian dang lac that,
 * co luc lac, pointer/keyboard/DeviceMotion va nut phu cho nguoi khong lac duoc. */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
const pickTarget = () => 3800 + Math.random() * 4200   // ~4s ... 8s

export default function ShakeXam() {
  const [phase, setPhase] = useState('idle')   // idle | shaking | dropping | result
  const [progress, setProgress] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [xam, setXam] = useState(null)
  const [active, setActive] = useState(false)
  const [motionOn, setMotionOn] = useState(false)
  const [needPerm, setNeedPerm] = useState(false)
  const [power, setPower] = useState(0)

  const lastX = useRef(null), lastDir = useRef(0), activeRef = useRef(false)
  const tiltTimer = useRef(null), dropTimer = useRef(null), raf = useRef(0)
  const targetRef = useRef(pickTarget())
  const powerRef = useRef(0), lastFeedRef = useRef(0)
  const shakenRef = useRef(0), lastShakeRef = useRef(0), lastFrameRef = useRef(0), dropped = useRef(false)

  const startDrop = useCallback(() => {
    if (dropped.current) return
    dropped.current = true
    cancelAnimationFrame(raf.current); raf.current = 0
    activeRef.current = false
    setActive(false); setProgress(100); setPhase('dropping')
    clearTimeout(dropTimer.current)
    dropTimer.current = setTimeout(() => { const x = rutXam(); addXamLichSu(x); setXam(x); setPhase('result') }, reduced() ? 200 : 950)
  }, [])

  // vòng lặp tích luỹ thời gian ĐANG lắc
  const tick = useCallback(t => {
    if (dropped.current) { raf.current = 0; return }
    const dt = lastFrameRef.current ? Math.min(t - lastFrameRef.current, 100) : 0
    lastFrameRef.current = t
    if (t - lastShakeRef.current < 480) shakenRef.current += dt * (0.82 + powerRef.current * 0.55)   // chỉ đếm khi đang lắc
    if (powerRef.current > 0) {
      powerRef.current = Math.max(0, powerRef.current - dt / 650)
      setPower(powerRef.current)
    }
    setProgress(Math.min(100, (shakenRef.current / targetRef.current) * 100))
    if (shakenRef.current >= targetRef.current) { startDrop(); return }
    raf.current = requestAnimationFrame(tick)
  }, [startDrop])

  const registerShake = useCallback((dir, force = 1) => {
    if (dropped.current) return
    lastShakeRef.current = now()
    const nextPower = Math.max(powerRef.current * .65, Math.min(1, Math.max(.18, force)))
    powerRef.current = nextPower
    setPower(nextPower)
    setPhase(p => (p === 'result' || p === 'dropping') ? p : 'shaking')
    setTilt(dir * (10 + nextPower * 9))
    clearTimeout(tiltTimer.current)
    tiltTimer.current = setTimeout(() => setTilt(0), 140)
    if (!raf.current) { lastFrameRef.current = 0; raf.current = requestAnimationFrame(tick) }
  }, [tick])

  // kéo qua lại (pointer)
  const feed = useCallback(x => {
    const t = now()
    if (lastX.current != null) {
      const dx = x - lastX.current
      const elapsed = Math.max(16, t - (lastFeedRef.current || t))
      if (Math.abs(dx) > 3) {
        const dir = dx > 0 ? 1 : -1
        const force = Math.min(1, Math.abs(dx) / Math.max(8, elapsed * .32))
        registerShake(dir, force); lastDir.current = dir
      }
    }
    lastX.current = x
    lastFeedRef.current = t
  }, [registerShake])

  const onDown = e => { if (phase === 'result') return; activeRef.current = true; setActive(true); lastX.current = e.clientX; lastFeedRef.current = now(); lastDir.current = 0; try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {} }
  const onMove = e => { if (activeRef.current) feed(e.clientX) }
  const onUp = () => { activeRef.current = false; setActive(false); lastX.current = null; lastFeedRef.current = 0; setTilt(0) }
  const onKeyDown = e => {
    if (phase === 'result' || phase === 'dropping') return
    if (!['Enter', ' ', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    const dir = e.key === 'ArrowLeft' ? -1 : (e.key === 'ArrowRight' ? 1 : (lastDir.current === 1 ? -1 : 1))
    lastDir.current = dir
    registerShake(dir, e.key === 'Enter' || e.key === ' ' ? .72 : .58)
  }

  // lắc điện thoại (DeviceMotion)
  useEffect(() => {
    if (!motionOn) return
    const onMotion = e => {
      const a = e.accelerationIncludingGravity || e.acceleration; if (!a) return
      const mag = Math.abs(a.x || 0) + Math.abs(a.y || 0)
      if (mag > 14) registerShake((a.x || 0) > 0 ? 1 : -1, Math.min(1, (mag - 12) / 18))
    }
    window.addEventListener('devicemotion', onMotion)
    return () => window.removeEventListener('devicemotion', onMotion)
  }, [motionOn, registerShake])

  useEffect(() => {
    const DME = typeof window !== 'undefined' && window.DeviceMotionEvent
    if (DME && typeof DME.requestPermission === 'function') setNeedPerm(true)
    else if (DME) setMotionOn(true)
  }, [])
  useEffect(() => () => { cancelAnimationFrame(raf.current); clearTimeout(tiltTimer.current); clearTimeout(dropTimer.current) }, [])

  const enableMotion = async () => {
    try { const r = await window.DeviceMotionEvent.requestPermission(); if (r === 'granted') { setMotionOn(true); setNeedPerm(false) } } catch (_) {}
  }
  const reset = () => {
    cancelAnimationFrame(raf.current); raf.current = 0; clearTimeout(dropTimer.current)
    dropped.current = false; shakenRef.current = 0; lastShakeRef.current = 0; lastFrameRef.current = 0; powerRef.current = 0
    lastDir.current = 0; lastX.current = null; lastFeedRef.current = 0; activeRef.current = false; targetRef.current = pickTarget()
    setPhase('idle'); setProgress(0); setTilt(0); setXam(null); setPower(0)
  }
  const autoShake = () => { if (!dropped.current && phase !== 'result') startDrop() }

  if (phase === 'result' && xam) {
    return (
      <div className="xam-result animate-fade">
        <div className="xam-result-card">
          <div className="xam-result-badge">Thẻ số {xam.so} · {xam.bac}</div>
          <p className="xam-result-cau">“{xam.cau[0]}<br />{xam.cau[1]}”</p>
          <div className="xam-result-body">
            <p className="m-0">{xam.dienGiai}</p>
            <p className="xam-result-khuyen">💡 {xam.loiKhuyen}</p>
          </div>
        </div>
        <div className="xam-result-actions">
          <button type="button" className="dc-btn dc-btn-gold" onClick={reset}>🔄 Xin thẻ khác</button>
        </div>
        <p className="xam-note">Diễn giải tham khảo theo thể loại dân gian — không phải lời tiên đoán chắc chắn.</p>
      </div>
    )
  }

  const dropping = phase === 'dropping'
  const xamPowerStyle = {
    '--xam-power': power.toFixed(2),
    '--xam-aura-opacity': (0.18 + power * 0.72).toFixed(2),
    '--xam-aura-scale': (0.78 + power * 0.22).toFixed(2),
    '--xam-aura-scale-mid': (0.88 + power * 0.18).toFixed(2),
    '--xam-aura-scale-core': (0.96 + power * 0.14).toFixed(2)
  }
  return (
    <div className="xam-wrap">
      <div className={'xam-stage' + (active ? ' is-active' : '') + (progress > 65 ? ' is-charged' : '')} style={xamPowerStyle} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} onKeyDown={onKeyDown}
        role="button" tabIndex={0} aria-label="Lắc ống xăm — kéo qua lại để xin thẻ">
        <div className="xam-aura" aria-hidden="true"><span /><span /><span /></div>
        <div className={'xam-cyl' + (active ? ' is-shaking' : '') + (dropping ? ' is-dropping' : '')} style={{ transform: `rotate(${tilt}deg)` }}>
          <picture><source srcSet={dcAsset(phase === 'idle' ? 'dc-tube-cutout.webp' : 'dc-tube-cutout-shake.webp')} type="image/webp" /><img src={dcAsset(phase === 'idle' ? 'dc-tube-cutout.png' : 'dc-tube-cutout-shake.png')} alt="" className="xam-tube-real" loading="lazy" decoding="async" /></picture>
        </div>
        {dropping && (
          <picture className="xam-falling">
            <source srcSet={dcAsset('dc-xam-stick.webp')} type="image/webp" />
            <img src={dcAsset('dc-xam-stick.png')} alt="" loading="lazy" decoding="async" />
          </picture>
        )}
        {!active && !dropping && progress === 0 && <div className="xam-hand" aria-hidden="true">🤲</div>}
      </div>

      <div className="xam-progress-row xam-progress-row-simple" aria-hidden="true">
        <div className="xam-bar"><span style={{ width: progress + '%' }} /></div>
      </div>
      <p className="xam-hint xam-hint-simple" aria-live="polite">
        {dropping ? 'Que xăm đang rơi…'
          : progress === 0 ? 'Kéo ống xăm qua lại để xin thẻ'
          : progress < 90 ? 'Giữ nhịp lắc đều tay…'
          : 'Que xăm sắp rơi…'}
      </p>
      {needPerm && <button type="button" className="dc-btn dc-btn-ghost xam-perm" onClick={enableMotion}>📱 Bật cảm biến lắc điện thoại</button>}
      {!dropping && progress === 0 && <button type="button" className="xam-fallback" onClick={autoShake}>Không lắc được? Bấm để xin thẻ</button>}
    </div>
  )
}
