import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import TempleScene from './TempleScene.jsx'

const TONES = {
  dawn: { glow: 0xffd08a, beam: 0xffe0a8, smoke: 0xe9eef7, dust: 0xffe1a8 },
  day: { glow: 0xffc96f, beam: 0xffdf9c, smoke: 0xeaf2f8, dust: 0xffdea0 },
  dusk: { glow: 0xf1b36f, beam: 0xffcc86, smoke: 0xdce4f2, dust: 0xffc789 },
  gold: { glow: 0xffd36f, beam: 0xffc46b, smoke: 0xf1e8d6, dust: 0xffdb8a }
}

function makeRadialTexture(inner, outer, size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, inner)
  g.addColorStop(0.38, inner.replace(/[\d.]+\)$/u, '0.28)'))
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeBeamTexture(color = '255,214,145') {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 768
  const ctx = canvas.getContext('2d')
  const vertical = ctx.createLinearGradient(0, 0, 0, canvas.height)
  vertical.addColorStop(0, `rgba(${color},0)`)
  vertical.addColorStop(0.22, `rgba(${color},0.22)`)
  vertical.addColorStop(0.72, `rgba(${color},0.1)`)
  vertical.addColorStop(1, `rgba(${color},0)`)
  const horizontal = ctx.createLinearGradient(0, 0, canvas.width, 0)
  horizontal.addColorStop(0, 'rgba(255,255,255,0)')
  horizontal.addColorStop(0.5, 'rgba(255,255,255,1)')
  horizontal.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = vertical
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = horizontal
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeSmokeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.filter = 'blur(10px)'
  ;[
    [116, 132, 58, 0.22],
    [142, 102, 46, 0.16],
    [94, 112, 38, 0.12],
    [152, 150, 32, 0.1]
  ].forEach(([x, y, r, a]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(245,248,255,${a})`)
    g.addColorStop(1, 'rgba(245,248,255,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  })
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeSeed(text = '') {
  let seed = 2166136261
  for (let i = 0; i < text.length; i++) seed = Math.imul(seed ^ text.charCodeAt(i), 16777619)
  return () => {
    seed += 0x6D2B79F5
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeSprite(texture, color, opacity, blending = THREE.AdditiveBlending) {
  return new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    blending,
    depthWrite: false
  }))
}

function makeLightBeams(root, tone, textures, lit) {
  const material = new THREE.MeshBasicMaterial({
    map: textures.beam,
    color: tone.beam,
    transparent: true,
    opacity: lit ? 0.28 : 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  ;[
    [-0.72, 0.22, 0.54, 1.9, -0.18, 0.3],
    [0.62, 0.26, 0.48, 1.85, 0.14, 0.58],
    [0.02, 0.2, 0.34, 1.7, 0.02, 0.42]
  ].forEach(([x, y, w, h, rz, phase]) => {
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material.clone())
    beam.position.set(x, y, -0.2)
    beam.rotation.z = rz
    beam.userData.beam = { baseOpacity: beam.material.opacity, phase }
    root.add(beam)
  })
}

function makeSmokeVeil(root, tone, textures, lit) {
  const count = lit ? 11 : 6
  for (let i = 0; i < count; i++) {
    const smoke = makeSprite(textures.smoke, tone.smoke, lit ? 0.22 : 0.12, THREE.NormalBlending)
    smoke.position.set(-0.16 + (i % 4) * 0.1, -0.54 + i * 0.09, 0.2)
    smoke.scale.set(0.28 + i * 0.04, 0.46 + i * 0.07, 1)
    smoke.userData.smoke = {
      baseX: smoke.position.x,
      baseY: smoke.position.y,
      phase: i * 0.74,
      baseOpacity: smoke.material.opacity
    }
    root.add(smoke)
  }
}

function makeDepthParticles(root, tone, loc) {
  const rand = makeSeed(loc?.id || 'tam-so')
  const geometry = new THREE.BufferGeometry()
  const count = 90
  const positions = new Float32Array(count * 3)
  const seeds = []
  for (let i = 0; i < count; i++) {
    positions[i * 3] = -1.75 + rand() * 3.5
    positions[i * 3 + 1] = -0.72 + rand() * 1.55
    positions[i * 3 + 2] = -0.7 + rand() * 0.6
    seeds.push({ x: positions[i * 3], y: positions[i * 3 + 1], phase: rand() * Math.PI * 2, speed: 0.18 + rand() * 0.28 })
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({
    color: tone.dust,
    size: 0.018,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }))
  points.userData.dust = { seeds }
  root.add(points)
}

function buildCinematicScene(root, loc, lit) {
  const tone = TONES[loc?.tone] || TONES.day
  const textures = {
    beam: makeBeamTexture(),
    glow: makeRadialTexture('rgba(255,205,112,0.72)', 'rgba(255,205,112,0)'),
    smoke: makeSmokeTexture()
  }

  const aura = makeSprite(textures.glow, tone.glow, lit ? 0.34 : 0.24)
  aura.position.set(0, 0.28, -0.32)
  aura.scale.set(1.42, 0.92, 1)
  aura.userData.aura = true
  root.add(aura)

  makeLightBeams(root, tone, textures, lit)
  makeSmokeVeil(root, tone, textures, lit)
  makeDepthParticles(root, tone, loc)
  return textures
}

function disposeObject(root, extraTextures = []) {
  root.traverse(obj => {
    obj.geometry?.dispose?.()
    const materials = Array.isArray(obj.material) ? obj.material : (obj.material ? [obj.material] : [])
    materials.forEach(m => {
      m.map?.dispose?.()
      m.dispose?.()
    })
  })
  extraTextures.forEach(tex => tex?.dispose?.())
}

export default function TempleScene3D({ loc, zoom = 1, lit = false, bgImage, className = '' }) {
  const hostRef = useRef(null)
  const zoomRef = useRef(zoom)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    zoomRef.current = zoom
    const host = hostRef.current
    if (host) host.style.setProperty('--dc-scene-scale', (1 + Math.max(0, zoom - 1) * 0.1).toFixed(3))
  }, [zoom])

  useEffect(() => {
    const host = hostRef.current
    if (!host || !loc || fallback) return undefined
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: true })
    } catch (_) {
      setFallback(true)
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.className = 'dc-webgl-canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)
    host.style.setProperty('--dc-scene-scale', (1 + Math.max(0, zoomRef.current - 1) * 0.1).toFixed(3))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 5

    const root = new THREE.Group()
    scene.add(root)
    const textures = buildCinematicScene(root, loc, lit)

    let width = 1
    let height = 1
    let aspect = 1
    const resize = () => {
      width = Math.max(1, host.clientWidth)
      height = Math.max(1, host.clientHeight)
      aspect = width / height
      renderer.setSize(width, height, false)
      camera.left = -aspect
      camera.right = aspect
      camera.top = 1
      camera.bottom = -1
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    let dragging = false
    let lastX = 0
    let lastY = 0
    let targetPanX = 0
    let targetPanY = 0
    let panX = 0
    let panY = 0

    const clampPan = () => {
      targetPanX = Math.max(-26, Math.min(26, targetPanX))
      targetPanY = Math.max(-14, Math.min(14, targetPanY))
    }
    const onPointerDown = e => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      host.classList.add('is-dragging')
      try { host.setPointerCapture(e.pointerId) } catch (_) {}
    }
    const onPointerMove = e => {
      const rect = host.getBoundingClientRect()
      if (dragging) {
        targetPanX += (e.clientX - lastX) * 0.12
        targetPanY += (e.clientY - lastY) * 0.07
        lastX = e.clientX
        lastY = e.clientY
      } else {
        const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5
        const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5
        targetPanX = -nx * 16
        targetPanY = -ny * 8
      }
      clampPan()
    }
    const stopDrag = e => {
      dragging = false
      host.classList.remove('is-dragging')
      try { host.releasePointerCapture(e.pointerId) } catch (_) {}
    }
    const onPointerLeave = e => {
      stopDrag(e)
      targetPanX *= 0.35
      targetPanY *= 0.35
    }
    host.addEventListener('pointerdown', onPointerDown)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerup', stopDrag)
    host.addEventListener('pointerleave', onPointerLeave)

    const clock = new THREE.Clock()
    let raf = 0
    const animate = () => {
      const t = clock.getElapsedTime()
      panX += (targetPanX - panX) * 0.075
      panY += (targetPanY - panY) * 0.075

      const zoomScale = 1 + Math.max(0, zoomRef.current - 1) * 0.1
      host.style.setProperty('--dc-pan-x', panX.toFixed(2) + 'px')
      host.style.setProperty('--dc-pan-y', panY.toFixed(2) + 'px')
      host.style.setProperty('--dc-depth-x', (-panX * 0.55).toFixed(2) + 'px')
      host.style.setProperty('--dc-depth-y', (-panY * 0.35).toFixed(2) + 'px')
      host.style.setProperty('--dc-scene-scale', zoomScale.toFixed(3))

      root.position.x = -panX / Math.max(360, width) * aspect * 1.8
      root.position.y = panY / Math.max(300, height) * 0.9
      root.scale.setScalar(1 + Math.max(0, zoomRef.current - 1) * 0.04)
      root.traverse(obj => {
        if (obj.userData?.aura) {
          const pulse = reduced ? 1 : 1 + Math.sin(t * 0.8) * 0.035
          obj.scale.set(1.42 * pulse, 0.92 * pulse, 1)
          obj.material.opacity = (lit ? 0.34 : 0.24) * (reduced ? 1 : 0.92 + Math.sin(t * 0.7) * 0.08)
        }
        if (obj.userData?.beam) {
          const d = obj.userData.beam
          obj.material.opacity = d.baseOpacity * (reduced ? 1 : 0.84 + Math.sin(t * 0.55 + d.phase) * 0.16)
          obj.position.x += reduced ? 0 : Math.sin(t * 0.25 + d.phase) * 0.0008
        }
        if (obj.userData?.smoke) {
          const d = obj.userData.smoke
          const drift = reduced ? 0 : Math.sin(t * 0.75 + d.phase) * 0.06
          const rise = reduced ? 0 : ((t * 0.08 + d.phase) % 0.32)
          obj.position.x = d.baseX + drift
          obj.position.y = d.baseY + rise
          obj.material.opacity = d.baseOpacity * (reduced ? 1 : 0.72 + Math.sin(t * 0.65 + d.phase) * 0.22)
          obj.rotation.z = Math.sin(t * 0.42 + d.phase) * 0.12
        }
        if (obj.userData?.dust && !reduced) {
          const attr = obj.geometry.attributes.position
          obj.userData.dust.seeds.forEach((d, i) => {
            attr.array[i * 3] = d.x + Math.sin(t * d.speed + d.phase) * 0.035
            attr.array[i * 3 + 1] = d.y + ((t * d.speed * 0.08 + d.phase) % 0.22)
          })
          attr.needsUpdate = true
          obj.material.opacity = 0.3 + Math.sin(t * 0.42) * 0.08
        }
      })

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerup', stopDrag)
      host.removeEventListener('pointerleave', onPointerLeave)
      disposeObject(scene, Object.values(textures))
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [loc, lit, fallback])

  if (fallback) {
    return <TempleScene scene={loc?.scene} tone={loc?.tone} bienHieu={loc?.bienHieu} className={className || 'dc-scene-svg'} />
  }

  return (
    <div
      ref={hostRef}
      className={'dc-webgl-root ' + className}
      role="img"
      aria-label={'Khong gian 3D ' + (loc?.ten || 'Chua Tam So')}
    >
      <div
        className="dc-webgl-bg"
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
        aria-hidden="true"
      />
    </div>
  )
}
