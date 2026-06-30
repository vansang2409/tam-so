import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { HOME3D_MENU_ITEMS } from '../data/homeMenu.js'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}

function disposeScene(scene) {
  scene.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach(m => m.dispose())
    }
  })
}

export default function Home3DMenu() {
  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [enhanced, setEnhanced] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage || reduced) {
      setEnhanced(false)
      return undefined
    }

    let renderer
    let frame = 0
    let resizeObserver
    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const pads = []

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch (err) {
      setEnhanced(false)
      return undefined
    }

    setEnhanced(true)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.35, 6)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.82))
    const key = new THREE.DirectionalLight(0xfff0c2, 1.4)
    key.position.set(2.8, 3.2, 4)
    scene.add(key)

    const root = new THREE.Group()
    root.rotation.x = -0.18
    root.scale.setScalar(0.76)
    scene.add(root)

    const gold = new THREE.Color(0xb45309)
    const slate = new THREE.Color(0x334155)
    const soft = new THREE.Color(0xf59e0b)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xb45309, transparent: true, opacity: 0.2 })

    const ringData = [
      [1.08, 0.012, 0xb45309, 0.55],
      [1.68, 0.01, 0x64748b, 0.26],
      [2.15, 0.012, 0xd97706, 0.38]
    ]
    ringData.forEach(([radius, tube, color, opacity], i) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 16, 144),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
      )
      mesh.position.z = i * -0.015
      root.add(mesh)
    })

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const inner = new THREE.Vector3(Math.cos(a) * 0.42, Math.sin(a) * 0.42, -0.02)
      const outer = new THREE.Vector3(Math.cos(a) * 2.04, Math.sin(a) * 2.04, -0.02)
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([inner, outer]), lineMat)
      root.add(line)
    }

    const core = new THREE.Group()
    const gem = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.36, 1),
      new THREE.MeshStandardMaterial({ color: soft, roughness: 0.38, metalness: 0.2, emissive: gold, emissiveIntensity: 0.08 })
    )
    const coreRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.018, 16, 96),
      new THREE.MeshBasicMaterial({ color: 0x0f766e, transparent: true, opacity: 0.42 })
    )
    core.add(gem, coreRing)
    root.add(core)

    HOME3D_MENU_ITEMS.forEach((item, i) => {
      const a = -Math.PI / 2 + (i / HOME3D_MENU_ITEMS.length) * Math.PI * 2
      const x = Math.cos(a) * 2.16
      const y = Math.sin(a) * 2.16
      const accent = new THREE.Color(item.accent)
      const pad = new THREE.Group()
      pad.position.set(x, y, 0.08)
      const outer = new THREE.Mesh(
        new THREE.RingGeometry(0.16, 0.25, 48),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
      )
      const inner = new THREE.Mesh(
        new THREE.CircleGeometry(0.12, 40),
        new THREE.MeshBasicMaterial({ color: accent.clone().lerp(slate, 0.35), transparent: true, opacity: 0.78, side: THREE.DoubleSide })
      )
      pad.add(outer, inner)
      pads.push(pad)
      root.add(pad)
    })

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const onPointerMove = e => {
      const rect = stage.getBoundingClientRect()
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * -2
    }
    const onPointerLeave = () => { target.x = 0; target.y = 0 }

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(stage)
      resizeObserver.observe(canvas)
    } else {
      window.addEventListener('resize', resize)
    }
    stage.addEventListener('pointermove', onPointerMove, { passive: true })
    stage.addEventListener('pointerleave', onPointerLeave)
    resize()

    const clock = new THREE.Clock()
    function tick() {
      const t = clock.getElapsedTime()
      pointer.x += (target.x - pointer.x) * 0.065
      pointer.y += (target.y - pointer.y) * 0.065
      root.rotation.y = pointer.x * 0.16
      root.rotation.x = -0.18 + pointer.y * 0.12
      root.rotation.z = Math.sin(t * 0.2) * 0.025
      core.rotation.x = t * 0.45
      core.rotation.y = t * 0.32
      coreRing.rotation.z = -t * 0.26

      pads.forEach((pad, i) => {
        const selected = i === activeRef.current
        const pulse = selected ? 1.24 : 1 + Math.sin(t * 1.4 + i) * 0.025
        pad.scale.setScalar(pulse)
        pad.rotation.z = selected ? Math.sin(t * 2.4) * 0.08 : 0
      })

      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.cancelAnimationFrame(frame)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerleave', onPointerLeave)
      if (resizeObserver) resizeObserver.disconnect()
      else window.removeEventListener('resize', resize)
      disposeScene(scene)
      renderer.dispose()
      renderer.forceContextLoss?.()
      setEnhanced(false)
    }
  }, [reduced])

  return (
    <section className="home3d-menu" aria-labelledby="home3d-title" data-enhanced={enhanced ? 'true' : 'false'}>
      <div className="home3d-head">
        <p className="text-gold text-kicker uppercase mb-2">Bạn muốn xem gì hôm nay?</p>
        <h2 id="home3d-title" className="text-h2 m-0">Chọn một ngả để bắt đầu</h2>
      </div>
      <div ref={stageRef} className="home3d-stage">
        <canvas ref={canvasRef} className="home3d-canvas" aria-hidden="true" />
        <div className="home3d-core-label" aria-hidden="true">Tam Sở</div>
        <nav className="home3d-portals" aria-label="Menu công cụ Tam Sở">
          {HOME3D_MENU_ITEMS.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className={'home3d-link' + (active === i ? ' is-active' : '')}
              style={{ '--x': item.x, '--y': item.y, '--accent': item.accentCss, '--i': i }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="home3d-glyph" aria-hidden="true">{item.glyph}</span>
              <span className="home3d-text">
                <span className="home3d-kicker">{item.kicker}</span>
                <span className="home3d-label">{item.label}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}