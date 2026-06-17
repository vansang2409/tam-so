import { Component } from 'react'

/** Bắt lỗi render của một trang → hiện thông báo thân thiện thay vì màn trắng.
 * Đặt key theo route để tự reset khi chuyển trang. */
export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch() { /* có thể gửi log nếu cần */ }
  render() {
    if (this.state.err) {
      return (
        <section className="wrap py-[90px] text-center">
          <div className="panel p-8 max-w-[560px] mx-auto">
            <div className="text-[2.6rem]">✦</div>
            <h1 className="text-[1.6rem] my-2">Có lỗi nhỏ xảy ra</h1>
            <p className="text-muted">Một phần trang gặp trục trặc ngoài ý muốn. Bạn thử tải lại trang giúp nhé — dữ liệu nhập của bạn chỉ nằm trên máy bạn nên không mất gì cả.</p>
            <div className="flex gap-3 justify-center mt-4 flex-wrap">
              <button className="btn btn-primary" onClick={() => window.location.reload()}>↻ Tải lại trang</button>
              <a className="btn btn-ghost" href={(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './'}>Về trang chủ</a>
            </div>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
