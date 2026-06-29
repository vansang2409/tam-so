import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SeoTag from '../components/SeoTag.jsx'
import { useAuth } from '../components/AuthProvider.jsx'
import { authRedirectTo } from '../lib/supabase.js'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TXT = {
  seoTitle: 'Đăng nhập / Đăng ký | Tam Sở',
  seoDesc: 'Đăng nhập hoặc tạo tài khoản Tam Sở bằng Supabase Auth. Tài khoản là tuỳ chọn; các công cụ chiêm nghiệm vẫn dùng được khi chưa đăng nhập.',
  crumb: 'Đăng nhập',
  kicker: 'Tài khoản Tam Sở',
  title: 'Đăng nhập để giữ một chỗ riêng',
  intro: 'Tài khoản là tuỳ chọn. Bạn vẫn có thể dùng Tarot, Thần số học, Tử vi, Kinh Dịch như trước; phần đăng nhập chỉ mở đường cho các tính năng lưu trữ/sync sau này.',
  dataNote: 'Email và phiên đăng nhập được xử lý bởi Supabase Auth khi bạn bật cấu hình. Các kết quả chiêm nghiệm hiện vẫn lưu cục bộ trên trình duyệt cho đến khi có tính năng đồng bộ riêng.',
  login: 'Đăng nhập',
  register: 'Đăng ký',
  missing: 'Chưa nối Supabase. Tạo .env.local từ .env.example, điền VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY, rồi chạy lại dev server.',
  name: 'Tên hiển thị',
  email: 'Email',
  password: 'Mật khẩu',
  minPassword: 'Tối thiểu 6 ký tự',
  emailBad: 'Email chưa đúng định dạng.',
  passBad: 'Mật khẩu nên có ít nhất 6 ký tự.',
  signupOk: 'Đã gửi yêu cầu đăng ký. Nếu Supabase đang bật xác nhận email, bạn mở hộp thư để xác nhận trước khi đăng nhập nhé.',
  loginOk: 'Đăng nhập xong rồi. Chào mừng bạn quay lại Tam Sở.',
  signedIn: 'Đang đăng nhập',
  hello: 'Xin chào',
  sessionActive: 'Phiên đăng nhập đang hoạt động trên thiết bị này.',
  profile: 'Vào hồ sơ',
  signOut: 'Đăng xuất',
  signedOut: 'Bạn đã đăng xuất. Hẹn gặp lại ở một nhịp thật nhẹ.',
  processing: 'Đang xử lý...',
  create: 'Tạo tài khoản',
  invalidLogin: 'Email hoặc mật khẩu chưa đúng. Bạn kiểm tra lại nhẹ nhàng nhé.',
  emailConfirm: 'Tài khoản cần xác nhận email trước khi đăng nhập.',
  weakPassword: 'Mật khẩu cần đủ mạnh hơn một chút.',
  genericError: 'Có lỗi nhỏ khi kết nối Supabase. Bạn thử lại sau ít phút nhé.'
}

function messageForError(err) {
  const msg = String(err?.message || err || '')
  if (/Invalid login credentials/i.test(msg)) return TXT.invalidLogin
  if (/Email not confirmed/i.test(msg)) return TXT.emailConfirm
  if (/Password should be/i.test(msg)) return TXT.weakPassword
  return msg || TXT.genericError
}

export default function Auth() {
  const { user, loading, configured, supabase } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [kind, setKind] = useState('note')
  const displayName = useMemo(() => user?.user_metadata?.full_name || user?.email || 'Bạn', [user])

  const submit = async e => {
    e.preventDefault()
    setMsg(''); setKind('note')
    const cleanEmail = email.trim().toLowerCase()
    if (!configured || !supabase) { setKind('warn'); setMsg(TXT.missing); return }
    if (!emailRe.test(cleanEmail)) { setKind('warn'); setMsg(TXT.emailBad); return }
    if (password.length < 6) { setKind('warn'); setMsg(TXT.passBad); return }
    setBusy(true)
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email: cleanEmail, password, options: { data: { full_name: name.trim() }, emailRedirectTo: authRedirectTo('/dang-nhap') } })
        if (error) throw error
        setKind('ok'); setMsg(TXT.signupOk)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
        if (error) throw error
        setKind('ok'); setMsg(TXT.loginOk)
        setTimeout(() => navigate('/'), 500)
      }
    } catch (err) {
      setKind('warn'); setMsg(messageForError(err))
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    if (!supabase) return
    setBusy(true)
    await supabase.auth.signOut()
    setBusy(false)
    setMsg(TXT.signedOut)
    setKind('ok')
  }

  return (
    <section className="wrap py-12">
      <SeoTag title={TXT.seoTitle} description={TXT.seoDesc} path="/dang-nhap" breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: TXT.crumb }]} />
      <div className="max-w-[920px] mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
        <div className="panel p-6">
          <p className="text-gold text-kicker uppercase mb-2">{TXT.kicker}</p>
          <h1 className="text-h1 mb-3">{TXT.title}</h1>
          <p className="text-muted leading-relaxed mb-4">{TXT.intro}</p>
          <div className="disclaimer text-left"><b>Lưu ý dữ liệu.</b> {TXT.dataNote}</div>
        </div>
        <div className="panel p-6 md:p-7">
          {loading ? (
            <div className="page-fallback"><span className="page-fallback-spinner" aria-hidden="true" /></div>
          ) : user ? (
            <div className="text-center py-4">
              <div className="text-gold text-kicker uppercase mb-2">{TXT.signedIn}</div>
              <h2 className="text-h2 mb-2">{TXT.hello}, {displayName}</h2>
              <p className="text-muted mb-5">{TXT.sessionActive}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link className="btn btn-primary" to="/ho-so">{TXT.profile}</Link>
                <button className="btn btn-ghost" type="button" disabled={busy} onClick={signOut}>{busy ? TXT.processing : TXT.signOut}</button>
              </div>
            </div>
          ) : (
            <>
              <div className="inline-flex rounded-full border border-gold/25 p-1 bg-gold/5 mb-5" role="tablist" aria-label="Auth mode">
                <button type="button" className={'px-4 py-2 rounded-full text-sm font-semibold transition ' + (mode === 'login' ? 'bg-gold text-white' : 'text-muted hover:text-cream')} onClick={() => setMode('login')}>{TXT.login}</button>
                <button type="button" className={'px-4 py-2 rounded-full text-sm font-semibold transition ' + (mode === 'register' ? 'bg-gold text-white' : 'text-muted hover:text-cream')} onClick={() => setMode('register')}>{TXT.register}</button>
              </div>
              {!configured && <div className="disclaimer mb-4 text-left"><b>{TXT.missing}</b></div>}
              <form onSubmit={submit} className="space-y-4">
                {mode === 'register' && <label className="block"><span className="text-sm font-semibold text-cream">{TXT.name}</span><input className="field-input mt-1" value={name} onChange={e => setName(e.target.value)} placeholder="An" autoComplete="name" /></label>}
                <label className="block"><span className="text-sm font-semibold text-cream">{TXT.email}</span><input className="field-input mt-1" value={email} onChange={e => setEmail(e.target.value)} placeholder="ban@example.com" autoComplete="email" inputMode="email" /></label>
                <label className="block"><span className="text-sm font-semibold text-cream">{TXT.password}</span><input className="field-input mt-1" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={TXT.minPassword} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
                {msg && <p className={(kind === 'ok' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300') + ' text-sm leading-relaxed'}>{msg}</p>}
                <button className="btn btn-primary w-full justify-center" type="submit" disabled={busy || !configured}>{busy ? TXT.processing : (mode === 'login' ? TXT.login : TXT.create)}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
