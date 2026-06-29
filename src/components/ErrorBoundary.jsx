import { Component } from 'react'

export function isChunkLoadError(err) {
  const text = String((err && (err.name + ' ' + err.message)) || err || '')
  return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(text)
}

/** Bat loi render/lazy-load cua mot trang -> hien thong bao than thien thay vi man trang.
 * Dat key theo route o wrapper de tu reset khi chuyen trang. */
export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch() { /* co the gui log neu can */ }
  retry = () => this.setState({ err: null })
  reload = () => window.location.reload()
  render() {
    if (this.state.err) {
      const chunk = isChunkLoadError(this.state.err)
      return (
        <section className="wrap py-[90px] text-center">
          <div className="panel p-8 max-w-[560px] mx-auto">
            <div className="text-[2.6rem]">*</div>
            <h1 className="text-[1.6rem] my-2">{chunk ? 'Khong tai duoc phan trang' : 'Co loi nho xay ra'}</h1>
            <p className="text-muted">{chunk ? 'Ket noi co the bi ngat quang hoac ban deploy moi da doi ten chunk. Ban tai lai de lay goi moi nhat; du lieu nhap van nam tren may ban.' : 'Mot phan trang gap truc trac ngoai y muon. Ban thu lai hoac tai lai trang giup nhe; du lieu nhap cua ban chi nam tren may ban nen khong mat gi ca.'}</p>
            <div className="flex gap-3 justify-center mt-4 flex-wrap">
              <button className="btn btn-primary" onClick={this.reload}>Tai lai trang</button>
              <button className="btn btn-ghost" onClick={this.retry}>Thu lai</button>
              <a className="btn btn-ghost" href={(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './'}>Ve trang chu</a>
            </div>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
