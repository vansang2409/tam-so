import { useState, useRef, useEffect, useCallback } from 'react'
import { rutXam, addXamLichSu } from '../data/dichua.js'

/* ShakeXam — xin xăm bằng cách LẮC. Phải lắc đủ một khoảng thời gian NGẪU NHIÊN
 * (tối thiểu 7s, tối đa 30s) tính theo thời gian ĐANG lắc thật (ngừng lắc thì dừng đếm),
 * rồi một que tre mới rơi ra. Lắc = kéo ống qua lại (chuột/cảm ứng) hoặc lắc điện thoại
 * (DeviceMotion). Tôn trọng prefers-reduced-motion; có nút phụ cho người không lắc được. */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
const pickTarget = () => 7000 + Math.random() * 23000   // 7s … 30s
export default function ShakeXam() {
  const [phase, setPhase] = useState('idle')   // idle | shaking | dropping | result
  const [progress, setProgress] = useState(0)
  const [secs, setSecs] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [xam, setXam] = useState(null)
  const [active, setActive] = useState(false)
  const [motionOn, setMotionOn] = useState(false)
  const [needPerm, setNeedPerm] = useState(false)

  const lastX = useRef(null), lastDir = useRef(0)
  const tiltTimer = useRef(null), dropTimer = useRef(null), raf = useRef(0)
  const targetRef = useRef(pickTarget())
  const shakenRef = useRef(0), lastShakeRef = useRef(0), lastFrameRef = useRef(0), dropped = useRef(false)

  const startDrop = useCallback(() => {
    if (dropped.current) return
    dropped.current = true
    cancelAnimationFrame(raf.current); raf.current = 0
    setActive(false); setProgress(100); setPhase('dropping')
    clearTimeout(dropTimer.current)
    dropTimer.current = setTimeout(() => { const x = rutXam(); addXamLichSu(x); setXam(x); setPhase('result') }, reduced() ? 200 : 950)
  }, [])

  // vòng lặp tích luỹ thời gian ĐANG lắc
  const tick = useCallback(t => {
    if (dropped.current) { raf.current = 0; return }
    const dt = lastFrameRef.current ? Math.min(t - lastFrameRef.current, 100) : 0
    lastFrameRef.current = t
    if (t - lastShakeRef.current < 420) shakenRef.current += dt   // chỉ đếm khi đang lắc
    setProgress(Math.min(100, (shakenRef.current / targetRef.current) * 100))
    setSecs(Math.floor(shakenRef.current / 1000))
    if (shakenRef.current >= targetRef.current) { startDrop(); return }
    raf.current = requestAnimationFrame(tick)
  }, [startDrop])

  const registerShake = useCallback(dir => {
    if (dropped.current) return
    lastShakeRef.current = now()
    setPhase(p => (p === 'result' || p === 'dropping') ? p : 'shaking')
    setTilt(dir * 11)
    clearTimeout(tiltTimer.current)
    tiltTimer.current = setTimeout(() => setTilt(0), 150)
    if (!raf.current) { lastFrameRef.current = 0; raf.current = requestAnimationFrame(tick) }
  }, [tick])

  // kéo qua lại (pointer)
  const feed = useCallback(x => {
    if (lastX.current != null) {
      const dx = x - lastX.current
      if (Math.abs(dx) > 3) { const dir = dx > 0 ? 1 : -1; registerShake(dir); lastDir.current = dir }
    }
    lastX.current = x
  }, [registerShake])

  const onDown = e => { if (phase === 'result') return; setActive(true); lastX.current = e.clientX; lastDir.current = 0; try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {} }
  const onMove = e => { if (active) feed(e.clientX) }
  const onUp = () => { setActive(false); lastX.current = null; setTilt(0) }

  // lắc điện thoại (DeviceMotion)
  useEffect(() => {
    if (!motionOn) return
    const onMotion = e => {
      const a = e.accelerationIncludingGravity || e.acceleration; if (!a) return
      const mag = Math.abs(a.x || 0) + Math.abs(a.y || 0)
      if (mag > 16) registerShake((a.x || 0) > 0 ? 1 : -1)
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
    dropped.current = false; shakenRef.current = 0; lastShakeRef.current = 0; lastFrameRef.current = 0
    lastDir.current = 0; lastX.current = null; targetRef.current = pickTarget()
    setPhase('idle'); setProgress(0); setSecs(0); setTilt(0); setXam(null)
  }
  const autoShake = () => { if (!dropped.current && phase !== 'result') startDrop() }

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
          <img src={(import.meta.env.BASE_URL || '/') + 'dichua/' + (phase === 'idle' ? 'dc-tube-cutout.png' : 'dc-tube-cutout-shake.png')} alt="" className="xam-tube-real" />
        </div>
        {dropping && <span className="xam-falling" />}
        {!active && !dropping && progress === 0 && <div className="xam-hand" aria-hidden="true">🤲</div>}
      </div>

      <div className="xam-bar"><span style={{ width: progress + '%' }} /></div>
      <p className="xam-hint">
        {dropping ? 'Que xăm đang rơi…'
          : progress === 0 ? 'Kéo ống xăm qua lại (hoặc lắc điện thoại) để xin thẻ'
          : progress < 55 ? `Khấn rồi lắc đều tay… (đã lắc ${secs}s)`
          : progress < 90 ? `Sắp được rồi, cứ lắc tiếp… (${secs}s)`
          : `Que xăm sắp rơi… (${secs}s)`}
      </p>
      {needPerm && <button type="button" className="dc-btn dc-btn-ghost xam-perm" onClick={enableMotion}>📱 Bật cảm biến lắc điện thoại</button>}
      {!dropping && <button type="button" className="xam-fallback" onClick={autoShake}>Không lắc được? Bấm để xin thẻ</button>}
    </div>
  )
}
