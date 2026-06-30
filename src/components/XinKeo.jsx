import { useEffect, useRef, useState } from 'react'
import { xinKeo, addKeoLichSu } from '../data/dichua.js'

const dcAsset = name => (import.meta.env.BASE_URL || '/') + 'dichua/' + name
const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const FACE_LABEL = { sap: 'Sấp', ngua: 'Ngửa' }
const IDLE_FACES = ['sap', 'ngua']

function KeoPiece({ face, index, settled = false }) {
  return (
    <span
      className={'keo-piece keo-piece-' + (index + 1) + (settled ? ' is-settled' : '')}
      data-face={face}
      aria-label={'Mặt ' + (FACE_LABEL[face] || face)}
    >
      <picture className="keo-piece-art">
        <source srcSet={dcAsset('dc-keo-blocks.webp')} type="image/webp" />
        <img src={dcAsset('dc-keo-blocks.png')} alt="" loading="lazy" decoding="async" />
      </picture>
    </span>
  )
}

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
    }, reduced() ? 120 : 980)
  }

  const reset = () => {
    clearTimeout(timer.current)
    setKeo(null)
    setPhase('idle')
  }

  const faceCodes = Array.isArray(keo?.matCode) && keo.matCode.length === 2 ? keo.matCode : IDLE_FACES
  const faceLabels = faceCodes.map(face => FACE_LABEL[face] || face)

  return (
    <div className="keo-wrap">
      <button
        type="button"
        className={'keo-stage' + (phase === 'casting' ? ' is-casting' : '') + (phase === 'result' ? ' is-result' : '')}
        onClick={phase === 'casting' ? undefined : cast}
        aria-label={phase === 'result' ? 'Gieo lại cặp keo' : 'Ném cặp keo âm dương'}
      >
        <picture className="keo-blocks" aria-hidden="true">
          <source srcSet={dcAsset('dc-keo-blocks.webp')} type="image/webp" />
          <img src={dcAsset('dc-keo-blocks.png')} alt="" loading="lazy" decoding="async" />
        </picture>
        <span className="keo-toss" aria-hidden="true">
          {faceCodes.map((face, index) => (
            <KeoPiece key={index + '-' + face} face={face} index={index} settled={phase === 'result'} />
          ))}
        </span>
      </button>

      {phase !== 'result' ? (
        <>
          <button type="button" className="dc-btn dc-btn-gold" onClick={cast} disabled={phase === 'casting'}>
            {phase === 'casting' ? 'Đang ném keo...' : 'Ném cặp keo'}
          </button>
          <p className="keo-note">Nghĩ một việc rõ ràng, rồi ném cặp keo âm dương. Hình mặt keo sau khi rơi sẽ khớp với kết quả bên dưới.</p>
        </>
      ) : (
        <div className="keo-result animate-fade">
          <div className="keo-result-card">
            <div className="keo-result-badge">{keo.ten} · {keo.ket}</div>
            <div className="keo-faces" aria-label={'Hai mặt keo: ' + faceLabels.join(' và ')}>
              {faceCodes.map((face, index) => (
                <span key={index + '-' + face} data-face={face}>{FACE_LABEL[face] || face}</span>
              ))}
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
