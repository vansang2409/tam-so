import { useEffect, useRef, useState } from 'react'
import { xinKeo, addKeoLichSu } from '../data/dichua.js'

const dcAsset = name => (import.meta.env.BASE_URL || '/') + 'dichua/' + name
const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function XinKeo() {
  const [phase, setPhase] = useState('idle') // idle | casting | result
  const [keo, setKeo] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const cast = () => {
    clearTimeout(timer.current)
    setKeo(null)
    setPhase('casting')
    timer.current = setTimeout(() => {
      const next = xinKeo()
      addKeoLichSu(next)
      setKeo(next)
      setPhase('result')
    }, reduced() ? 120 : 960)
  }

  const reset = () => {
    clearTimeout(timer.current)
    setKeo(null)
    setPhase('idle')
  }

  return (
    <div className="keo-wrap">
      <button type="button" className={'keo-stage' + (phase === 'casting' ? ' is-casting' : '')} onClick={phase === 'casting' ? undefined : cast}>
        <picture className="keo-blocks">
          <source srcSet={dcAsset('dc-keo-blocks.webp')} type="image/webp" />
          <img src={dcAsset('dc-keo-blocks.png')} alt="" loading="lazy" decoding="async" />
        </picture>
      </button>

      {phase !== 'result' ? (
        <>
          <button type="button" className="dc-btn dc-btn-gold" onClick={cast} disabled={phase === 'casting'}>
            {phase === 'casting' ? 'Đang gieo keo...' : 'Gieo cặp keo'}
          </button>
          <p className="keo-note">Nghĩ một việc rõ ràng, rồi gieo cặp keo âm dương. Chỉ dùng để chiêm nghiệm.</p>
        </>
      ) : (
        <div className="keo-result animate-fade">
          <div className="keo-result-card">
            <div className="keo-result-badge">{keo.ten} · {keo.ket}</div>
            <div className="keo-faces" aria-label={'Hai mặt keo: ' + keo.mat.join(' và ')}>
              <span>{keo.mat[0]}</span><span>{keo.mat[1]}</span>
            </div>
            <p className="m-0">{keo.dienGiai}</p>
            <p className="keo-result-khuyen">💡 {keo.loiKhuyen}</p>
          </div>
          <button type="button" className="dc-btn dc-btn-gold" onClick={reset}>Xin keo lại</button>
          <p className="keo-note">Kết quả mang tính tham khảo dân gian, không phải lời phán chắc chắn.</p>
        </div>
      )}
    </div>
  )
}
