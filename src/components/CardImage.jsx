import { useState } from 'react'
import { cardImageUrl } from '../data/tarot.js'

/** Ảnh lá bài RWS từ Wikimedia; lỗi/offline → fallback emoji biểu tượng. */
export default function CardImage({ card, w = 320, reversed = false, imgClass = '', fallbackClass = 'text-[3rem]' }) {
  const [err, setErr] = useState(false)
  const url = !err && card ? cardImageUrl(card, w) : null
  const rot = reversed ? { transform: 'rotate(180deg)' } : undefined
  return url
    ? <img src={url} alt={card.nameVi} loading="lazy" onError={() => setErr(true)} className={imgClass} style={rot} />
    : <div className={fallbackClass} style={rot}>{card ? card.symbol : ''}</div>
}
