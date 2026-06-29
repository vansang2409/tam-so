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
  intro: 'Tài khoản là tuỳ chọn. Bạn vẫn có thể dùng Tarot, Thần số học, Tử vi, Kinh Dịch như trước; đăng nhập giúp lưu Hồ sơ tổng hợp lên Supabase và mở đường cho các phần đồng bộ khác.',
  dataNote: 'Email và phiên đăng nhập được xử lý bởi Supabase Auth. Khi bạn lưu Hồ sơ tổng hợp, dữ liệu hồ sơ được ghi vào bảng public.profiles có RLS; lịch sử/bộ sưu tập khác hiện vẫn lưu cục bộ trên trình duyệt.',
  login: 'Đăng nhập',
  register: 'Đăng ký',
  google: 'Tiếp tục với Google',
  emailDivider: 'hoặc dùng email',
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
  googleConfig: 'Google chưa được bật trong Supabase Auth. Bạn kiểm tra cấu hình Google provider nhé.',
  genericError: 'Có lỗi nhỏ khi kết nối Supabase. Bạn thử lại sau ít phút nhé.'
}

function messageForError(err) {
  const msg = String(err?.message || err || '')
  if (/Invalid login credentials/i.test(msg)) return TXT.invalidLogin
  if (/Email not confirmed/i.test(msg)) return TXT.emailConfirm
  if (/Password should be/i.test(msg)) return TXT.weakPassword
  if (/provider|oauth|google/i.test(msg)) return TXT.googleConfig
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
  const isRegister = mode === 'register'

  const submit = async e => {
    e.preventDefault()
    setMsg(''); setKind('note')
    const cleanEmail = email.trim().toLowerCase()
    if (!configured || !supabase) { setKind('warn'); setMsg(TXT.missing); return }
    if (!emailRe.test(cleanEmail)) { setKind('warn'); setMsg(TXT.emailBad); return }
    if (password.length < 6) { setKind('warn'); setMsg(TXT.passBad); return }
    setBusy(true)
    try {
      if (isRegister) {
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

  const signInGoogle = async () => {
    setMsg(''); setKind('note')
    if (!configured || !supabase) { setKind('warn'); setMsg(TXT.missing); return }
    setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: authRedirectTo('/dang-nhap') }
      })
      if (error) throw error
    } catch (err) {
      setKind('warn'); setMsg(messageForError(err))
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
    <section className="wrap py-10 md:py-14">
      <SeoTag title={TXT.seoTitle} description={TXT.seoDesc} path="/dang-nhap" breadcrumb={[{ name: 'Trang chủ', path: '/' }, { name: TXT.crumb }]} />
      <div className="max-w-[1020px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_440px] gap-6 lg:gap-8 items-start">
        <div className="panel p-7 md:p-8 lg:min-h-[430px] flex flex-col justify-between bg-gradient-to-br from-white via-white to-amber-50/55 dark:from-ink dark:via-ink dark:to-amber-950/15">
          <div>
            <p className="text-gold text-kicker uppercase mb-2">{TXT.kicker}</p>
            <h1 className="text-h1 mb-3 max-w-[12ch]">{TXT.title}</h1>
            <p className="text-muted leading-relaxed max-w-[58ch]">{TXT.intro}</p>
          </div>
          <div className="mt-7 space-y-3 text-sm text-muted">
            <div className="flex gap-3 border-t border-slate-200/80 dark:border-slate-700 pt-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold font-bold">1</span>
              <p className="m-0"><b className="text-cream">Không bắt buộc.</b> Các công cụ chính vẫn dùng được khi chưa đăng nhập.</p>
            </div>
            <div className="flex gap-3 border-t border-slate-200/80 dark:border-slate-700 pt-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold font-bold">2</span>
              <p className="m-0"><b className="text-cream">Dữ liệu rõ ràng.</b> {TXT.dataNote}</p>
            </div>
          </div>
        </div>

        <div className="panel overflow-hidden p-0 shadow-lift border-slate-200 dark:border-slate-700 justify-self-center w-full max-w-[440px]">
          <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4 md:px-6">
            <p className="text-[.76rem] font-bold uppercase tracking-[.14em] text-gold mb-1">Supabase Auth</p>
            <h2 className="text-[1.35rem] font-bold tracking-normal m-0">{isRegister ? 'Tạo tài khoản' : 'Chào bạn quay lại'}</h2>
            <p className="text-muted text-sm m-0 mt-1">{isRegister ? 'Một email, một mật khẩu, nhẹ nhàng là đủ.' : 'Đăng nhập để lưu Hồ sơ tổng hợp lên Supabase.'}</p>
          </div>

          <div className="p-5 md:p-6">
            {loading ? (
              <div className="page-fallback"><span className="page-fallback-spinner" aria-hidden="true" /></div>
            ) : user ? (
              <div className="text-center py-5">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold font-bold">✓</div>
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
                <div className="grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-white/5 p-1 mb-5" role="tablist" aria-label="Auth mode">
                  <button type="button" className={'h-10 rounded-lg text-sm font-semibold transition ' + (!isRegister ? 'bg-white text-cream shadow-sm dark:bg-slate-800' : 'text-muted hover:text-cream')} onClick={() => setMode('login')}>{TXT.login}</button>
                  <button type="button" className={'h-10 rounded-lg text-sm font-semibold transition ' + (isRegister ? 'bg-white text-cream shadow-sm dark:bg-slate-800' : 'text-muted hover:text-cream')} onClick={() => setMode('register')}>{TXT.register}</button>
                </div>
                {!configured && <div className="disclaimer mb-4 text-left"><b>{TXT.missing}</b></div>}
                <button type="button" className="auth-google flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-cream shadow-sm transition hover:border-gold/40 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" disabled={busy || !configured} onClick={signInGoogle}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[.95rem] font-black text-[#4285f4] shadow-sm" aria-hidden="true">G</span>
                  {busy ? TXT.processing : TXT.google}
                </button>
                <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.12em] text-muted">
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <span>{TXT.emailDivider}</span>
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>
                <form onSubmit={submit} className="space-y-4 auth-form">
                  {isRegister && (
                    <label className="block space-y-1.5">
                      <span className="text-[.84rem] font-semibold text-cream">{TXT.name}</span>
                      <input className="field-input block w-full h-12" value={name} onChange={e => setName(e.target.value)} placeholder="An" autoComplete="name" />
                    </label>
                  )}
                  <label className="block space-y-1.5">
                    <span className="text-[.84rem] font-semibold text-cream">{TXT.email}</span>
                    <input className="field-input block w-full h-12" value={email} onChange={e => setEmail(e.target.value)} placeholder="ban@example.com" autoComplete="email" inputMode="email" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-[.84rem] font-semibold text-cream">{TXT.password}</span>
                    <input className="field-input block w-full h-12" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={TXT.minPassword} autoComplete={isRegister ? 'new-password' : 'current-password'} />
                  </label>
                  {msg && <p className={(kind === 'ok' ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900' : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900') + ' rounded-xl border px-3 py-2 text-sm leading-relaxed'}>{msg}</p>}
                  <button className="btn btn-primary w-full h-12 justify-center rounded-xl shadow-[0_12px_24px_-14px_rgb(var(--c-gold))]" type="submit" disabled={busy || !configured}>{busy ? TXT.processing : (isRegister ? TXT.create : TXT.login)}</button>
                </form>
                <p className="mt-4 text-center text-xs leading-relaxed text-muted">Không có mật khẩu thần chú gì cả, chỉ là email + password bình thường.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
