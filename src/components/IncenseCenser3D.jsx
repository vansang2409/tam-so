const asset = name => (import.meta.env.BASE_URL || '/') + 'dichua/' + name

export default function IncenseCenser3D({ lit = false, igniting = false, className = '' }) {
  const active = lit || igniting
  const state = active ? 'lit' : 'idle'

  return (
    <div
      className={'dc-censer3d ' + (active ? 'is-lit ' : 'is-idle ') + (igniting ? 'is-igniting ' : '') + className}
      role="img"
      aria-label={active ? 'Lu huong dang toa khoi tram' : 'Lu huong chua thap huong'}
    >
      <picture>
        <source srcSet={asset('lu-huong-3d-' + state + '.webp')} type="image/webp" />
        <img
          src={asset('lu-huong-3d-' + state + '.png')}
          alt=""
          className="dc-censer3d-img"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
      </picture>
      <span className="dc-censer3d-ember" aria-hidden="true" />
      <span className="dc-censer3d-smoke s1" aria-hidden="true" />
      <span className="dc-censer3d-smoke s2" aria-hidden="true" />
      <span className="dc-censer3d-smoke s3" aria-hidden="true" />
    </div>
  )
}
