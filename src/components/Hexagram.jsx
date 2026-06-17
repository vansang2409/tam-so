import { TRIGRAMS } from '../data/iching.js'
/* Vẽ quẻ (6 hào) hoặc quái (3 hào) bằng thanh — luôn hiển thị đúng, không lệ thuộc font.
 * up = quái trên (ngoại), lo = quái dưới (nội). Hào liền = dương, hào đứt = âm. */
export default function Hexagram({ up, lo, w = 50 }) {
  const hLine = Math.max(5, Math.round(w / 9))
  const Line = ({ y }) => (
    <div className="flex justify-between items-center" style={{ height: hLine }}>
      {y
        ? <span className="bg-gold rounded-[2px]" style={{ width: '100%', height: hLine }} />
        : <><span className="bg-gold rounded-[2px]" style={{ width: '43%', height: hLine }} /><span className="bg-gold rounded-[2px]" style={{ width: '43%', height: hLine }} /></>}
    </div>
  )
  const lines = b => [b[2] === '1', b[1] === '1', b[0] === '1'].map((y, i) => <Line key={i} y={y} />)
  return (
    <div className="flex flex-col mx-auto" style={{ width: w, gap: Math.max(3, Math.round(w / 11)) }} aria-hidden="true">
      {up && TRIGRAMS[up] && lines(TRIGRAMS[up].bits)}
      {lo && TRIGRAMS[lo] && lines(TRIGRAMS[lo].bits)}
    </div>
  )
}
