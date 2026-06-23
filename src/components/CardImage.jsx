import { useState } from 'react'
import { cardImageUrl, cardImageRemoteUrl } from '../data/tarot.js'
import Skeleton from './Skeleton.jsx'

/** Ảnh lá bài RWS. Thử: ảnh nội bộ (LOCAL_CARDS) → Wikimedia → "thẻ bài" thiết kế sẵn.
 * Fallback là lá bài có khung (tỉ lệ 2:3) → dù ảnh chưa tải, Tarot vẫn ra dáng lá bài, không vỡ. */
export default function CardImage({ card, w = 320, reversed = false, imgClass = '', fallbackClass = '' }) {
  const [step, setStep] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const rot = reversed ? { transform: 'rotate(180deg)' } : undefined
  if (!card) return null
  const primary = cardImageUrl(card, w)
  const remote = cardImageRemoteUrl(card, w)
  const url = step === 0 ? primary : (step === 1 && remote && remote !== primary ? remote : null)
  if (url) return (
    <span className={'relative inline-block overflow-hidden ' + imgClass} style={{ aspectRatio: '2 / 3', ...rot }}>
      {!loaded && <Skeleton radius={0} style={{ position: 'absolute', inset: 0 }} />}
      <img src={url} alt={card.nameVi} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setStep(s => s + 1)}
        className="w-full h-full" style={{ objectFit: 'contain', opacity: loaded ? 1 : 0, transition: 'opacity .35s' }} />
    </span>
  )
  const base = Math.min(30, Math.max(13, Math.round(w * 0.11)))
  return (
    <div
      className={imgClass + ' flex flex-col items-center justify-center gap-1 border border-gold/25 ' + fallbackClass}
      style={{ aspectRatio: '2 / 3', background: 'linear-gradient(160deg, #f8fafc, #eef2f7)', fontSize: base + 'px', ...rot }}
      title={card.nameVi}
    >
      {card.roman ? <span className="text-gold font-serif tracking-[.18em]" style={{ fontSize: '.6em' }}>{card.roman}</span> : null}
      <span style={{ fontSize: '2.1em', lineHeight: 1 }}>{card.symbol}</span>
      <span className="text-muted font-serif leading-tight px-1" style={{ fontSize: '.52em' }}>{card.nameVi}</span>
    </div>
  )
}
