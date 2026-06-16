export default function Disclaimer({ children, className = '' }) {
  return <div className={`disclaimer max-w-[900px] mx-auto ${className}`}>{children}</div>
}

export function Badge({ children, gold = false }) {
  return <span className={`badge ${gold ? 'badge-gold' : ''}`}>{children}</span>
}
