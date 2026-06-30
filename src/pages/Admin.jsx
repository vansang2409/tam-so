import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageSeo } from '../components/useSeo.js'
import { useAuth } from '../components/AuthProvider.jsx'
import { PROFILE_SELECT, profileFormToRow, profileRowToForm, profileSyncErrorMessage } from '../data/supabaseProfile.js'
import { HOME3D_MENU_ITEMS } from '../data/homeMenu.js'
import { TAROT_CARDS, TAROT_SPREADS } from '../data/tarot.js'
import { NUMEROLOGY, PERSONAL_YEAR } from '../data/numerology.js'
import { THIEN_CAN, DIA_CHI, NAP_AM, SAO_HAN } from '../data/tuvi.js'
import { ZODIAC } from '../data/zodiac.js'
import { HEXAGRAMS } from '../data/iching.js'
import { CONGIAP } from '../data/congiap.js'
import { DICHUA_LOCATIONS, DICHUA_XAM, DICHUA_KEO } from '../data/dichua.js'
import { NHATHO_SPACES, NHATHO_PRAYERS } from '../data/nhatho.js'
import { CATEGORY_SELECT, POST_SELECT, categoryToRow, postToRow, rowToPostForm, slugify } from '../data/cms.js'

const TABS = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'profiles', label: 'Hồ sơ' },
  { id: 'admins', label: 'Quyền' },
  { id: 'notes', label: 'Ghi chú' },
  { id: 'settings', label: 'Settings' },
  { id: 'cms', label: 'CMS' },
  { id: 'content', label: 'Nội dung' },
  { id: 'seo', label: 'SEO' },
  { id: 'media', label: 'Media' },
  { id: 'system', label: 'Hệ thống' }
]

const emptyProfile = {
  id: '',
  n: '',
  d: '',
  m: '',
  y: '',
  g: 'nam',
  h: '',
  t: 'Tổng quan',
  q: ''
}

const emptyAdminUser = { email: '', note: '' }
const emptyNote = { id: '', title: '', body: '', status: 'todo', priority: 'normal' }
const emptySetting = { key: '', value: '{\n  \n}', description: '' }
const emptyCategory = { id: '', name: '', slug: '', description: '' }
const emptyPost = { id: '', title: '', slug: '', excerpt: '', content: '', status: 'draft', category_id: '', featured_image: '', seo_title: '', seo_description: '', published_at: '' }

function adminEmails() {
  return String(import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

function envAllows(user) {
  const list = adminEmails()
  const email = String(user?.email || '').toLowerCase()
  return Boolean(email && list.includes(email))
}

function fmtDate(value) {
  if (!value) return 'Chưa có'
  try { return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) } catch (_) { return value }
}

function Stat({ label, value, note }) {
  return (
    <div className="panel p-4 md:p-5">
      <div className="text-[.75rem] font-bold uppercase tracking-[.14em] text-muted">{label}</div>
      <div className="mt-2 text-[2rem] leading-none font-bold text-cream">{value}</div>
      {note && <div className="mt-2 text-sm text-muted leading-relaxed">{note}</div>}
    </div>
  )
}

function TabButton({ tab, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={'h-10 rounded-lg px-3 text-sm font-semibold transition ' + (active ? 'bg-white text-cream shadow-sm dark:bg-slate-800' : 'text-muted hover:text-cream')}>
      {tab.label}
    </button>
  )
}

function AdminNotice({ kind = 'note', children }) {
  const cls = kind === 'warn'
    ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300'
    : kind === 'ok'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300'
      : 'border-slate-200 bg-white text-muted dark:border-slate-700 dark:bg-white/5'
  return <div className={'rounded-xl border px-4 py-3 text-sm leading-relaxed ' + cls}>{children}</div>
}

function Field({ label, value, onChange, type = 'text', placeholder = '', disabled = false }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[.82rem] font-semibold text-cream">{label}</span>
      <input className="field-input block h-11 w-full" type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={e => onChange(e.target.value)} />
    </label>
  )
}

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[.82rem] font-semibold text-cream">{label}</span>
      <select className="field-input block h-11 w-full" value={value} onChange={e => onChange(e.target.value)}>{children}</select>
    </label>
  )
}

function TextAreaField({ label, value, onChange, rows = 4, placeholder = '' }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[.82rem] font-semibold text-cream">{label}</span>
      <textarea className="field-input block w-full resize-y" rows={rows} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    </label>
  )
}

function toForm(row) {
  return { id: row?.id || '', ...profileRowToForm(row || {}) }
}

function contentModules() {
  return [
    { name: 'Trang chủ 3D', path: '/', count: HOME3D_MENU_ITEMS.length, status: 'Đang bật' },
    { name: 'Tarot', path: '/tarot', count: TAROT_CARDS.length, status: `${Object.keys(TAROT_SPREADS).length} kiểu trải` },
    { name: 'Thần số học', path: '/than-so-hoc', count: Object.keys(NUMEROLOGY).length, status: `${Object.keys(PERSONAL_YEAR).length} năm cá nhân` },
    { name: 'Tử vi', path: '/tu-vi', count: THIEN_CAN.length + DIA_CHI.length + NAP_AM.length, status: `${Object.keys(SAO_HAN).length} sao hạn` },
    { name: 'Cung hoàng đạo', path: '/cung-hoang-dao', count: ZODIAC.length, status: 'Có daily reading' },
    { name: 'Con giáp', path: '/con-giap', count: CONGIAP.length, status: 'Có hợp khắc' },
    { name: 'Kinh Dịch', path: '/kinh-dich', count: HEXAGRAMS.length, status: '64 quẻ' },
    { name: 'Đi chùa', path: '/di-chua', count: DICHUA_LOCATIONS.length + DICHUA_XAM.length + DICHUA_KEO.length, status: 'Không gian tương tác' },
    { name: 'Đi nhà thờ', path: '/di-nha-tho', count: NHATHO_SPACES.length + NHATHO_PRAYERS.length, status: 'Không gian chiêm niệm' }
  ]
}

function mediaRows() {
  const temple = DICHUA_LOCATIONS.map(x => ({ name: x.ten, path: `/dichua/${x.id}.webp`, type: 'Đi chùa', fallback: `/dichua/${x.id}.jpg` }))
  const church = NHATHO_SPACES.map(x => ({ name: x.ten, path: `/nhatho/${x.image}.webp`, type: 'Đi nhà thờ', fallback: `/nhatho/${x.image}.jpg` }))
  const tarot = TAROT_CARDS.slice(0, 12).map(x => ({ name: x.nameVi || x.name, path: `/cards/${x.image || x.name}.jpg`, type: 'Tarot', fallback: 'Bộ đủ 78 ảnh trong public/cards' }))
  return [...temple, ...church, ...tarot]
}

export default function Admin() {
  usePageSeo({ title: 'Admin | Tam Sở', description: 'Bảng quản trị Tam Sở: hồ sơ, nội dung, SEO, media và cấu hình hệ thống.', path: '/admin', breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Admin' }] })
  const { user, loading, configured, supabase } = useAuth()
  const [tab, setTab] = useState('overview')
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkedAdmin, setCheckedAdmin] = useState(false)
  const [profiles, setProfiles] = useState([])
  const [profileForm, setProfileForm] = useState(emptyProfile)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [messageKind, setMessageKind] = useState('note')
  const [query, setQuery] = useState('')
  const [adminUsers, setAdminUsers] = useState([])
  const [adminUserForm, setAdminUserForm] = useState(emptyAdminUser)
  const [notes, setNotes] = useState([])
  const [noteForm, setNoteForm] = useState(emptyNote)
  const [settings, setSettings] = useState([])
  const [settingForm, setSettingForm] = useState(emptySetting)
  const [cmsPosts, setCmsPosts] = useState([])
  const [cmsCategories, setCmsCategories] = useState([])
  const [postForm, setPostForm] = useState(emptyPost)
  const [categoryForm, setCategoryForm] = useState(emptyCategory)
  const [cmsQuery, setCmsQuery] = useState('')

  const modules = useMemo(() => contentModules(), [])
  const media = useMemo(() => mediaRows(), [])
  const contentCount = modules.reduce((sum, item) => sum + item.count, 0)
  const filteredProfiles = profiles.filter(p => {
    const text = `${p.display_name || ''} ${p.id || ''} ${p.topic || ''} ${p.question || ''}`.toLowerCase()
    return text.includes(query.trim().toLowerCase())
  })
  const filteredPosts = cmsPosts.filter(p => `${p.title || ''} ${p.slug || ''} ${p.status || ''}`.toLowerCase().includes(cmsQuery.trim().toLowerCase()))

  useEffect(() => {
    let alive = true
    async function checkAdmin() {
      setCheckedAdmin(false)
      const allowedByEnv = envAllows(user)
      if (!configured || !supabase || !user) {
        if (alive) { setIsAdmin(false); setCheckedAdmin(true) }
        return
      }
      try {
        const { data, error } = await supabase.rpc('is_admin')
        if (error) throw error
        if (alive) setIsAdmin(Boolean(data) || allowedByEnv)
      } catch (_) {
        if (alive) setIsAdmin(allowedByEnv)
      } finally {
        if (alive) setCheckedAdmin(true)
      }
    }
    checkAdmin()
    return () => { alive = false }
  }, [configured, supabase, user])

  const loadProfiles = async () => {
    if (!configured || !supabase || !user) return
    setBusy(true); setMessage('Đang tải hồ sơ...'); setMessageKind('note')
    try {
      let request = supabase.from('profiles').select(PROFILE_SELECT).order('updated_at', { ascending: false }).limit(100)
      if (!isAdmin) request = request.eq('id', user.id)
      const { data, error } = await request
      if (error) throw error
      setProfiles(data || [])
      if ((data || []).length && !profileForm.id) setProfileForm(toForm(data[0]))
      setMessage(isAdmin ? 'Đã tải tối đa 100 hồ sơ mới nhất.' : 'Đã tải hồ sơ của tài khoản hiện tại.')
      setMessageKind('ok')
    } catch (err) {
      setProfiles([])
      setMessage(profileSyncErrorMessage(err))
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const loadAdminData = async () => {
    if (!configured || !supabase || !user || !isAdmin) return
    try {
      const [adminRes, settingsRes, notesRes, categoriesRes, postsRes] = await Promise.all([
        supabase.from('admin_users').select('email, note, created_at').order('email'),
        supabase.from('site_settings').select('key, value, description, updated_at').order('key'),
        supabase.from('admin_notes').select('id, title, body, status, priority, created_at, updated_at').order('updated_at', { ascending: false }).limit(100),
        supabase.from('cms_categories').select(CATEGORY_SELECT).order('name'),
        supabase.from('cms_posts').select(POST_SELECT).order('updated_at', { ascending: false }).limit(100)
      ])
      if (adminRes.error) throw adminRes.error
      if (settingsRes.error) throw settingsRes.error
      if (notesRes.error) throw notesRes.error
      if (categoriesRes.error) throw categoriesRes.error
      if (postsRes.error) throw postsRes.error
      setAdminUsers(adminRes.data || [])
      setSettings(settingsRes.data || [])
      setNotes(notesRes.data || [])
      setCmsCategories(categoriesRes.data || [])
      setCmsPosts(postsRes.data || [])
    } catch (err) {
      setMessage(err?.message || 'Chưa tải được dữ liệu admin mở rộng.')
      setMessageKind('warn')
    }
  }

  useEffect(() => {
    if (checkedAdmin && configured && supabase && user) {
      loadProfiles()
      if (isAdmin) loadAdminData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedAdmin, isAdmin, user?.id])

  const saveProfile = async e => {
    e.preventDefault()
    if (!configured || !supabase || !user) return
    const id = (profileForm.id || user.id).trim()
    if (!id) { setMessage('Cần UUID người dùng để lưu hồ sơ.'); setMessageKind('warn'); return }
    setBusy(true); setMessage('Đang lưu hồ sơ...'); setMessageKind('note')
    try {
      const { error } = await supabase.from('profiles').upsert(profileFormToRow(id, profileForm), { onConflict: 'id' })
      if (error) throw error
      setMessage('Đã lưu hồ sơ.')
      setMessageKind('ok')
      await loadProfiles()
    } catch (err) {
      setMessage(profileSyncErrorMessage(err))
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const deleteProfile = async id => {
    if (!id || !configured || !supabase || !user) return
    const ok = window.confirm('Xóa hồ sơ này khỏi Supabase?')
    if (!ok) return
    setBusy(true); setMessage('Đang xóa hồ sơ...'); setMessageKind('note')
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (error) throw error
      setMessage('Đã xóa hồ sơ.')
      setMessageKind('ok')
      setProfileForm(emptyProfile)
      await loadProfiles()
    } catch (err) {
      setMessage(profileSyncErrorMessage(err))
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const saveAdminUser = async e => {
    e.preventDefault()
    if (!isAdmin || !supabase) return
    const email = adminUserForm.email.trim().toLowerCase()
    if (!email || !email.includes('@')) { setMessage('Email admin chưa hợp lệ.'); setMessageKind('warn'); return }
    setBusy(true); setMessage('Đang lưu email admin...'); setMessageKind('note')
    try {
      const { error } = await supabase.from('admin_users').upsert({ email, note: adminUserForm.note.trim() || null }, { onConflict: 'email' })
      if (error) throw error
      setAdminUserForm(emptyAdminUser)
      setMessage('Đã lưu quyền admin.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa lưu được quyền admin.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const deleteAdminUser = async email => {
    if (!isAdmin || !supabase || !email) return
    if (email.toLowerCase() === String(user.email || '').toLowerCase()) {
      setMessage('Không nên tự xóa quyền admin của tài khoản đang đăng nhập.')
      setMessageKind('warn')
      return
    }
    if (!window.confirm(`Xóa quyền admin của ${email}?`)) return
    setBusy(true)
    try {
      const { error } = await supabase.from('admin_users').delete().eq('email', email)
      if (error) throw error
      setMessage('Đã xóa quyền admin.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa xóa được quyền admin.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const saveSetting = async e => {
    e.preventDefault()
    if (!isAdmin || !supabase) return
    const key = settingForm.key.trim()
    if (!key) { setMessage('Setting cần có key.'); setMessageKind('warn'); return }
    let value
    try {
      value = settingForm.value.trim() ? JSON.parse(settingForm.value) : {}
    } catch (_) {
      setMessage('Giá trị setting phải là JSON hợp lệ.')
      setMessageKind('warn')
      return
    }
    setBusy(true); setMessage('Đang lưu setting...'); setMessageKind('note')
    try {
      const { error } = await supabase.from('site_settings').upsert({
        key,
        value,
        description: settingForm.description.trim() || null,
        updated_by: user.id
      }, { onConflict: 'key' })
      if (error) throw error
      setSettingForm(emptySetting)
      setMessage('Đã lưu setting.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa lưu được setting.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const deleteSetting = async key => {
    if (!isAdmin || !supabase || !key) return
    if (!window.confirm(`Xóa setting ${key}?`)) return
    setBusy(true)
    try {
      const { error } = await supabase.from('site_settings').delete().eq('key', key)
      if (error) throw error
      setMessage('Đã xóa setting.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa xóa được setting.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const saveNote = async e => {
    e.preventDefault()
    if (!isAdmin || !supabase) return
    const title = noteForm.title.trim()
    if (!title) { setMessage('Ghi chú cần có tiêu đề.'); setMessageKind('warn'); return }
    const row = {
      title,
      body: noteForm.body.trim() || null,
      status: noteForm.status,
      priority: noteForm.priority,
      created_by: user.id
    }
    setBusy(true); setMessage('Đang lưu ghi chú...'); setMessageKind('note')
    try {
      const request = noteForm.id
        ? supabase.from('admin_notes').update(row).eq('id', noteForm.id)
        : supabase.from('admin_notes').insert(row)
      const { error } = await request
      if (error) throw error
      setNoteForm(emptyNote)
      setMessage('Đã lưu ghi chú.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa lưu được ghi chú.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const deleteNote = async id => {
    if (!isAdmin || !supabase || !id) return
    if (!window.confirm('Xóa ghi chú này?')) return
    setBusy(true)
    try {
      const { error } = await supabase.from('admin_notes').delete().eq('id', id)
      if (error) throw error
      setMessage('Đã xóa ghi chú.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa xóa được ghi chú.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const saveCategory = async e => {
    e.preventDefault()
    if (!isAdmin || !supabase) return
    if (!categoryForm.name.trim()) { setMessage('Category cần có tên.'); setMessageKind('warn'); return }
    setBusy(true); setMessage('Đang lưu category...'); setMessageKind('note')
    try {
      const row = categoryToRow(categoryForm)
      const request = categoryForm.id
        ? supabase.from('cms_categories').update(row).eq('id', categoryForm.id)
        : supabase.from('cms_categories').insert(row)
      const { error } = await request
      if (error) throw error
      setCategoryForm(emptyCategory)
      setMessage('Đã lưu category.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa lưu được category.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const deleteCategory = async id => {
    if (!isAdmin || !supabase || !id) return
    if (!window.confirm('Xóa category này? Bài viết thuộc category sẽ được bỏ liên kết.')) return
    setBusy(true)
    try {
      const { error } = await supabase.from('cms_categories').delete().eq('id', id)
      if (error) throw error
      setMessage('Đã xóa category.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa xóa được category.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const savePost = async e => {
    e.preventDefault()
    if (!isAdmin || !supabase) return
    if (!postForm.title.trim()) { setMessage('Bài viết cần có tiêu đề.'); setMessageKind('warn'); return }
    setBusy(true); setMessage('Đang lưu bài viết...'); setMessageKind('note')
    try {
      const row = postToRow(postForm, user.id)
      const request = postForm.id
        ? supabase.from('cms_posts').update(row).eq('id', postForm.id)
        : supabase.from('cms_posts').insert(row)
      const { error } = await request
      if (error) throw error
      setPostForm(emptyPost)
      setMessage('Đã lưu bài viết.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa lưu được bài viết.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  const deletePost = async id => {
    if (!isAdmin || !supabase || !id) return
    if (!window.confirm('Xóa bài viết này?')) return
    setBusy(true)
    try {
      const { error } = await supabase.from('cms_posts').delete().eq('id', id)
      if (error) throw error
      setMessage('Đã xóa bài viết.')
      setMessageKind('ok')
      await loadAdminData()
    } catch (err) {
      setMessage(err?.message || 'Chưa xóa được bài viết.')
      setMessageKind('warn')
    } finally {
      setBusy(false)
    }
  }

  if (loading || !checkedAdmin) {
    return <section className="wrap py-14"><div className="page-fallback"><span className="page-fallback-spinner" aria-hidden="true" /></div></section>
  }

  if (!configured) {
    return (
      <section className="wrap py-10 md:py-14">
        <div className="panel p-6 md:p-8 max-w-[780px] mx-auto">
          <p className="text-gold text-kicker uppercase mb-2">Admin</p>
          <h1 className="text-h1 mb-3">Cần cấu hình Supabase</h1>
          <p className="text-muted leading-relaxed">Tạo `.env.local` từ `.env.example`, điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY`, rồi chạy lại dev server để dùng trang admin.</p>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="wrap py-10 md:py-14">
        <div className="panel p-6 md:p-8 max-w-[780px] mx-auto">
          <p className="text-gold text-kicker uppercase mb-2">Admin</p>
          <h1 className="text-h1 mb-3">Đăng nhập để vào quản trị</h1>
          <p className="text-muted leading-relaxed mb-5">Trang admin dùng Supabase Auth và RLS. Sau khi đăng nhập, hệ thống sẽ kiểm tra quyền admin từ `admin_users` hoặc `VITE_ADMIN_EMAILS`.</p>
          <Link className="btn btn-primary" to="/dang-nhap">Đăng nhập</Link>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-cream dark:bg-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] border-r border-slate-800 bg-[#111827] text-slate-200 lg:flex lg:flex-col">
        <div className="flex h-14 items-center border-b border-slate-800 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gold text-white font-bold">TS</div>
          <div className="ml-3">
            <div className="text-sm font-bold leading-none">Tam Sở</div>
            <div className="mt-1 text-[.68rem] uppercase tracking-[.16em] text-slate-400">Admin</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3" aria-label="Admin navigation">
          {TABS.map(item => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)}
              className={'flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-semibold transition ' + (tab === item.id ? 'bg-gold text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white')}>
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-3 text-xs text-slate-400">
          <div className="truncate">{user.email}</div>
          <Link className="mt-2 inline-block text-gold hover:underline" to="/">Mở website</Link>
        </div>
      </aside>

      <div className="lg:pl-[232px]">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="min-w-0">
              <div className="text-[.72rem] font-bold uppercase tracking-[.16em] text-gold">Tam Sở Admin</div>
              <div className="truncate text-sm text-muted">Đăng nhập: <b className="text-cream">{user.email}</b></div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost min-h-10 px-3 py-2 text-sm" type="button" onClick={() => { loadProfiles(); if (isAdmin) loadAdminData() }} disabled={busy}>Tải lại</button>
              <Link className="btn btn-primary min-h-10 px-3 py-2 text-sm" to="/">Website</Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 flex flex-col gap-3">
              <div>
                <h1 className="text-h1 mb-2">Bảng quản trị</h1>
                <p className="text-muted max-w-[820px] leading-relaxed">Không gian quản trị tách biệt khỏi giao diện public: hồ sơ Supabase, quyền admin, ghi chú vận hành, settings, nội dung, SEO và media.</p>
              </div>
              <div className="grid rounded-xl bg-white p-1 shadow-sm dark:bg-white/5 lg:hidden" role="tablist" aria-label="Admin sections">
                {TABS.map(item => <TabButton key={item.id} tab={item} active={tab === item.id} onClick={() => setTab(item.id)} />)}
              </div>
            </div>

      {!isAdmin && (
        <div className="mb-5">
          <AdminNotice kind="warn"><b>Chế độ giới hạn.</b> Tài khoản này chưa có quyền admin đầy đủ, nên Supabase RLS chỉ cho thao tác với hồ sơ của chính tài khoản đang đăng nhập.</AdminNotice>
        </div>
      )}

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Hồ sơ tải được" value={profiles.length} note={isAdmin ? 'Theo quyền admin/RLS' : 'Chỉ tài khoản hiện tại'} />
            <Stat label="Admin users" value={adminUsers.length || (isAdmin ? 0 : adminEmails().length)} note="Email có quyền quản trị" />
            <Stat label="Settings" value={settings.length} note="Cấu hình JSON trong Supabase" />
            <Stat label="Ghi chú" value={notes.length} note="Việc vận hành nội bộ" />
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <div className="panel p-5">
              <h2 className="text-h2 mb-4">Việc quản trị nhanh</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Hồ sơ', 'Tạo, sửa, xóa hồ sơ người dùng trong bảng profiles.'],
                  ['Nội dung', 'Kiểm kê số lượng dữ liệu từng module và link kiểm tra.'],
                  ['SEO', 'Rà sitemap, robots, OG image và route quan trọng.'],
                  ['Media', 'Kiểm tra đường dẫn ảnh chính cho Đi chùa, Đi nhà thờ, Tarot.']
                ].map(([title, desc]) => <div key={title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><b>{title}</b><p className="m-0 mt-1 text-sm text-muted leading-relaxed">{desc}</p></div>)}
              </div>
            </div>
            <div className="panel p-5">
              <h2 className="text-h2 mb-4">Trạng thái quyền</h2>
              <div className="space-y-3 text-sm text-muted leading-relaxed">
                <p><b className="text-cream">Supabase:</b> đã cấu hình.</p>
                <p><b className="text-cream">Admin:</b> {isAdmin ? 'đầy đủ' : 'giới hạn bởi RLS'}.</p>
                <p><b className="text-cream">Allowlist UI:</b> {adminEmails().length ? adminEmails().join(', ') : 'chưa đặt VITE_ADMIN_EMAILS'}.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'profiles' && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="panel p-5 overflow-hidden">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-h2 mb-1">Hồ sơ Supabase</h2>
                <p className="m-0 text-sm text-muted">Bảng `public.profiles`, lọc bởi Supabase RLS.</p>
              </div>
              <input className="field-input h-11 w-full sm:w-[280px]" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm tên, UUID, chủ đề..." />
            </div>
            {message && <div className="mb-4"><AdminNotice kind={messageKind}>{message}</AdminNotice></div>}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
                <thead className="text-left text-muted">
                  <tr>
                    <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Tên</th>
                    <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Ngày sinh</th>
                    <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Chủ đề</th>
                    <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Cập nhật</th>
                    <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map(row => (
                    <tr key={row.id} className="align-top">
                      <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800"><b>{row.display_name || 'Chưa đặt tên'}</b><div className="text-xs text-muted">{row.id}</div></td>
                      <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">{[row.birth_day, row.birth_month, row.birth_year].filter(Boolean).join('/') || 'Chưa có'}<div className="text-xs text-muted">{row.gender === 'nu' ? 'Nữ' : 'Nam'}{row.birth_hour != null ? `, ${row.birth_hour}h` : ''}</div></td>
                      <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">{row.topic || 'Tổng quan'}<div className="max-w-[220px] truncate text-xs text-muted">{row.question || ''}</div></td>
                      <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">{fmtDate(row.updated_at)}</td>
                      <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">
                        <button type="button" className="text-gold hover:underline" onClick={() => setProfileForm(toForm(row))}>Sửa</button>
                        <button type="button" className="ml-3 text-rose-700 hover:underline dark:text-rose-300" onClick={() => deleteProfile(row.id)} disabled={busy}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                  {!filteredProfiles.length && <tr><td className="py-6 text-muted" colSpan="5">Chưa có hồ sơ nào trong phạm vi quyền hiện tại.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <form className="panel p-5 self-start" onSubmit={saveProfile}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-h2 m-0">Biểu mẫu hồ sơ</h2>
              <button type="button" className="text-sm text-gold hover:underline" onClick={() => setProfileForm({ ...emptyProfile, id: isAdmin ? '' : user.id })}>Tạo mới</button>
            </div>
            <div className="space-y-3">
              <Field label="User UUID" value={profileForm.id} disabled={!isAdmin} placeholder={user.id} onChange={v => setProfileForm(f => ({ ...f, id: v }))} />
              <Field label="Tên hiển thị" value={profileForm.n} onChange={v => setProfileForm(f => ({ ...f, n: v }))} />
              <div className="grid grid-cols-3 gap-3">
                <Field label="Ngày" value={profileForm.d} type="number" onChange={v => setProfileForm(f => ({ ...f, d: v }))} />
                <Field label="Tháng" value={profileForm.m} type="number" onChange={v => setProfileForm(f => ({ ...f, m: v }))} />
                <Field label="Năm" value={profileForm.y} type="number" onChange={v => setProfileForm(f => ({ ...f, y: v }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Giới tính" value={profileForm.g} onChange={v => setProfileForm(f => ({ ...f, g: v }))}><option value="nam">Nam</option><option value="nu">Nữ</option></SelectField>
                <Field label="Giờ sinh" value={profileForm.h} type="number" placeholder="0-23" onChange={v => setProfileForm(f => ({ ...f, h: v }))} />
              </div>
              <SelectField label="Chủ đề" value={profileForm.t} onChange={v => setProfileForm(f => ({ ...f, t: v }))}><option>Tổng quan</option><option>Tình yêu</option><option>Công việc</option><option>Tài chính</option></SelectField>
              <Field label="Câu hỏi" value={profileForm.q} onChange={v => setProfileForm(f => ({ ...f, q: v }))} />
              <button className="btn btn-primary w-full" type="submit" disabled={busy}>{busy ? 'Đang xử lý...' : 'Lưu hồ sơ'}</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'admins' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="panel p-5 overflow-hidden">
            <h2 className="text-h2 mb-2">Quyền admin</h2>
            <p className="text-sm text-muted mt-0 mb-4">Danh sách này nằm trong `public.admin_users` và được RLS bảo vệ bằng `public.is_admin()`.</p>
            {message && <div className="mb-4"><AdminNotice kind={messageKind}>{message}</AdminNotice></div>}
            {!isAdmin ? <AdminNotice kind="warn">Tài khoản hiện tại chưa có quyền quản lý danh sách admin.</AdminNotice> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-separate border-spacing-0 text-sm">
                  <thead className="text-left text-muted">
                    <tr><th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Email</th><th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Ghi chú</th><th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {adminUsers.map(row => (
                      <tr key={row.email}>
                        <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800"><b>{row.email}</b><div className="text-xs text-muted">{fmtDate(row.created_at)}</div></td>
                        <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">{row.note || 'Không có'}</td>
                        <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">
                          <button type="button" className="text-gold hover:underline" onClick={() => setAdminUserForm({ email: row.email, note: row.note || '' })}>Sửa</button>
                          <button type="button" className="ml-3 text-rose-700 hover:underline dark:text-rose-300" onClick={() => deleteAdminUser(row.email)} disabled={busy}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                    {!adminUsers.length && <tr><td className="py-6 text-muted" colSpan="3">Chưa có email admin nào.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <form className="panel p-5 self-start" onSubmit={saveAdminUser}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-h2 m-0">Thêm admin</h2>
              <button type="button" className="text-sm text-gold hover:underline" onClick={() => setAdminUserForm(emptyAdminUser)}>Mới</button>
            </div>
            <div className="space-y-3">
              <Field label="Email" value={adminUserForm.email} placeholder="admin@example.com" onChange={v => setAdminUserForm(f => ({ ...f, email: v }))} />
              <Field label="Ghi chú" value={adminUserForm.note} placeholder="Owner, Editor..." onChange={v => setAdminUserForm(f => ({ ...f, note: v }))} />
              <button className="btn btn-primary w-full" type="submit" disabled={busy || !isAdmin}>{busy ? 'Đang xử lý...' : 'Lưu quyền'}</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'notes' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="panel p-5">
            <h2 className="text-h2 mb-4">Ghi chú vận hành</h2>
            {message && <div className="mb-4"><AdminNotice kind={messageKind}>{message}</AdminNotice></div>}
            {!isAdmin ? <AdminNotice kind="warn">Chỉ admin đầy đủ mới xem được ghi chú nội bộ.</AdminNotice> : (
              <div className="grid gap-3">
                {notes.map(row => (
                  <div key={row.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-h3 m-0">{row.title}</h3>
                      <div className="flex gap-2 text-xs">
                        <span className="badge">{row.status}</span>
                        <span className="badge">{row.priority}</span>
                      </div>
                    </div>
                    {row.body && <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap mb-0">{row.body}</p>}
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
                      <span>{fmtDate(row.updated_at || row.created_at)}</span>
                      <span><button type="button" className="text-gold hover:underline" onClick={() => setNoteForm({ id: row.id, title: row.title || '', body: row.body || '', status: row.status || 'todo', priority: row.priority || 'normal' })}>Sửa</button><button type="button" className="ml-3 text-rose-700 hover:underline dark:text-rose-300" onClick={() => deleteNote(row.id)}>Xóa</button></span>
                    </div>
                  </div>
                ))}
                {!notes.length && <p className="text-muted">Chưa có ghi chú nào.</p>}
              </div>
            )}
          </div>
          <form className="panel p-5 self-start" onSubmit={saveNote}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-h2 m-0">Biểu mẫu ghi chú</h2>
              <button type="button" className="text-sm text-gold hover:underline" onClick={() => setNoteForm(emptyNote)}>Mới</button>
            </div>
            <div className="space-y-3">
              <Field label="Tiêu đề" value={noteForm.title} onChange={v => setNoteForm(f => ({ ...f, title: v }))} />
              <TextAreaField label="Nội dung" value={noteForm.body} rows={5} onChange={v => setNoteForm(f => ({ ...f, body: v }))} />
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Trạng thái" value={noteForm.status} onChange={v => setNoteForm(f => ({ ...f, status: v }))}><option value="todo">todo</option><option value="doing">doing</option><option value="done">done</option></SelectField>
                <SelectField label="Ưu tiên" value={noteForm.priority} onChange={v => setNoteForm(f => ({ ...f, priority: v }))}><option value="low">low</option><option value="normal">normal</option><option value="high">high</option></SelectField>
              </div>
              <button className="btn btn-primary w-full" type="submit" disabled={busy || !isAdmin}>{busy ? 'Đang xử lý...' : 'Lưu ghi chú'}</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'settings' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div className="panel p-5 overflow-hidden">
            <h2 className="text-h2 mb-2">Site settings</h2>
            <p className="text-sm text-muted mt-0 mb-4">Lưu cấu hình dạng JSON trong `public.site_settings`. App hiện chưa tự đọc các setting này ra frontend public.</p>
            {message && <div className="mb-4"><AdminNotice kind={messageKind}>{message}</AdminNotice></div>}
            {!isAdmin ? <AdminNotice kind="warn">Chỉ admin đầy đủ mới quản lý settings.</AdminNotice> : (
              <div className="grid gap-3">
                {settings.map(row => (
                  <div key={row.key} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div><h3 className="text-h3 m-0">{row.key}</h3><p className="text-sm text-muted m-0">{row.description || 'Không có mô tả'}</p></div>
                      <div className="text-xs text-muted">{fmtDate(row.updated_at)}</div>
                    </div>
                    <pre className="mt-3 max-h-[180px] overflow-auto rounded-xl bg-slate-100 p-3 text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">{JSON.stringify(row.value || {}, null, 2)}</pre>
                    <div className="mt-3 text-sm"><button type="button" className="text-gold hover:underline" onClick={() => setSettingForm({ key: row.key, value: JSON.stringify(row.value || {}, null, 2), description: row.description || '' })}>Sửa</button><button type="button" className="ml-3 text-rose-700 hover:underline dark:text-rose-300" onClick={() => deleteSetting(row.key)}>Xóa</button></div>
                  </div>
                ))}
                {!settings.length && <p className="text-muted">Chưa có setting nào.</p>}
              </div>
            )}
          </div>
          <form className="panel p-5 self-start" onSubmit={saveSetting}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-h2 m-0">Biểu mẫu setting</h2>
              <button type="button" className="text-sm text-gold hover:underline" onClick={() => setSettingForm(emptySetting)}>Mới</button>
            </div>
            <div className="space-y-3">
              <Field label="Key" value={settingForm.key} placeholder="homepage_notice" onChange={v => setSettingForm(f => ({ ...f, key: v }))} />
              <Field label="Mô tả" value={settingForm.description} onChange={v => setSettingForm(f => ({ ...f, description: v }))} />
              <TextAreaField label="JSON value" value={settingForm.value} rows={9} onChange={v => setSettingForm(f => ({ ...f, value: v }))} />
              <button className="btn btn-primary w-full" type="submit" disabled={busy || !isAdmin}>{busy ? 'Đang xử lý...' : 'Lưu setting'}</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'cms' && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="space-y-5">
            <div className="panel p-5 overflow-hidden">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-h2 mb-1">Bài viết CMS</h2>
                  <p className="m-0 text-sm text-muted">Quản lý bài viết public tại `/bai-viet`.</p>
                </div>
                <input className="field-input h-11 w-full sm:w-[260px]" value={cmsQuery} onChange={e => setCmsQuery(e.target.value)} placeholder="Tìm bài viết..." />
              </div>
              {message && <div className="mb-4"><AdminNotice kind={messageKind}>{message}</AdminNotice></div>}
              {!isAdmin ? <AdminNotice kind="warn">Chỉ admin đầy đủ mới quản lý CMS.</AdminNotice> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
                    <thead className="text-left text-muted">
                      <tr>
                        <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Tiêu đề</th>
                        <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Category</th>
                        <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Trạng thái</th>
                        <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Cập nhật</th>
                        <th className="border-b border-slate-200 py-3 pr-3 dark:border-slate-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map(row => (
                        <tr key={row.id} className="align-top">
                          <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800"><b>{row.title}</b><div className="text-xs text-muted">/{row.slug}</div></td>
                          <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">{row.cms_categories?.name || 'Không có'}</td>
                          <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800"><span className="badge">{row.status}</span></td>
                          <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">{fmtDate(row.updated_at)}</td>
                          <td className="border-b border-slate-100 py-3 pr-3 dark:border-slate-800">
                            <button type="button" className="text-gold hover:underline" onClick={() => setPostForm(rowToPostForm(row))}>Sửa</button>
                            {row.status === 'published' && <Link className="ml-3 text-gold hover:underline" to={`/bai-viet/${row.slug}`}>Xem</Link>}
                            <button type="button" className="ml-3 text-rose-700 hover:underline dark:text-rose-300" onClick={() => deletePost(row.id)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                      {!filteredPosts.length && <tr><td className="py-6 text-muted" colSpan="5">Chưa có bài viết nào.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="panel p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-h2 mb-1">Categories</h2>
                  <p className="m-0 text-sm text-muted">Nhóm bài viết cho CMS.</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {cmsCategories.map(cat => (
                  <div key={cat.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <b>{cat.name}</b>
                    <div className="text-xs text-muted">/{cat.slug}</div>
                    {cat.description && <p className="m-0 mt-2 text-sm text-muted">{cat.description}</p>}
                    <div className="mt-3 text-sm"><button type="button" className="text-gold hover:underline" onClick={() => setCategoryForm({ id: cat.id, name: cat.name || '', slug: cat.slug || '', description: cat.description || '' })}>Sửa</button><button type="button" className="ml-3 text-rose-700 hover:underline dark:text-rose-300" onClick={() => deleteCategory(cat.id)}>Xóa</button></div>
                  </div>
                ))}
                {!cmsCategories.length && <p className="text-muted">Chưa có category nào.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <form className="panel p-5 self-start" onSubmit={savePost}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-h2 m-0">Soạn bài</h2>
                <button type="button" className="text-sm text-gold hover:underline" onClick={() => setPostForm(emptyPost)}>Mới</button>
              </div>
              <div className="space-y-3">
                <Field label="Tiêu đề" value={postForm.title} onChange={v => setPostForm(f => ({ ...f, title: v, slug: f.slug || slugify(v) }))} />
                <Field label="Slug" value={postForm.slug} onChange={v => setPostForm(f => ({ ...f, slug: slugify(v) }))} />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="Trạng thái" value={postForm.status} onChange={v => setPostForm(f => ({ ...f, status: v }))}><option value="draft">draft</option><option value="published">published</option></SelectField>
                  <SelectField label="Category" value={postForm.category_id} onChange={v => setPostForm(f => ({ ...f, category_id: v }))}><option value="">Không có</option>{cmsCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</SelectField>
                </div>
                <Field label="Ảnh đại diện URL" value={postForm.featured_image} placeholder="/og.png hoặc https://..." onChange={v => setPostForm(f => ({ ...f, featured_image: v }))} />
                <TextAreaField label="Tóm tắt" value={postForm.excerpt} rows={3} onChange={v => setPostForm(f => ({ ...f, excerpt: v }))} />
                <TextAreaField label="Nội dung" value={postForm.content} rows={12} placeholder="Dùng dòng trống để tách đoạn. Có thể dùng #, ##, ### cho tiêu đề." onChange={v => setPostForm(f => ({ ...f, content: v }))} />
                <Field label="SEO title" value={postForm.seo_title} onChange={v => setPostForm(f => ({ ...f, seo_title: v }))} />
                <Field label="SEO description" value={postForm.seo_description} onChange={v => setPostForm(f => ({ ...f, seo_description: v }))} />
                <button className="btn btn-primary w-full" type="submit" disabled={busy || !isAdmin}>{busy ? 'Đang xử lý...' : 'Lưu bài viết'}</button>
              </div>
            </form>

            <form className="panel p-5 self-start" onSubmit={saveCategory}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-h2 m-0">Category</h2>
                <button type="button" className="text-sm text-gold hover:underline" onClick={() => setCategoryForm(emptyCategory)}>Mới</button>
              </div>
              <div className="space-y-3">
                <Field label="Tên" value={categoryForm.name} onChange={v => setCategoryForm(f => ({ ...f, name: v, slug: f.slug || slugify(v) }))} />
                <Field label="Slug" value={categoryForm.slug} onChange={v => setCategoryForm(f => ({ ...f, slug: slugify(v) }))} />
                <Field label="Mô tả" value={categoryForm.description} onChange={v => setCategoryForm(f => ({ ...f, description: v }))} />
                <button className="btn btn-ghost w-full" type="submit" disabled={busy || !isAdmin}>{busy ? 'Đang xử lý...' : 'Lưu category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div className="panel p-5">
          <h2 className="text-h2 mb-4">Kiểm kê nội dung</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {modules.map(item => (
              <Link key={item.path} to={item.path} className="rounded-xl border border-slate-200 p-4 no-underline transition hover:border-gold/50 dark:border-slate-700">
                <div className="text-[.75rem] font-bold uppercase tracking-[.14em] text-gold">{item.path}</div>
                <h3 className="text-h3 mt-2 mb-1">{item.name}</h3>
                <p className="m-0 text-sm text-muted">{item.count} mục. {item.status}.</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab === 'seo' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="panel p-5">
            <h2 className="text-h2 mb-4">Checklist SEO</h2>
            <div className="space-y-3">
              {[
                ['Sitemap', '/sitemap.xml', 'Có sitemap public cho route index.'],
                ['Robots', '/robots.txt', 'Có robots.txt để khai báo index/crawl.'],
                ['OG image', '/og.png', 'Ảnh chia sẻ mặc định.'],
                ['404', '/404.html', 'Fallback cho hosting tĩnh.']
              ].map(([name, path, note]) => <a key={path} href={path} className="block rounded-xl border border-slate-200 p-4 no-underline hover:border-gold/50 dark:border-slate-700"><b>{name}</b><div className="text-sm text-muted">{path} - {note}</div></a>)}
            </div>
          </div>
          <div className="panel p-5">
            <h2 className="text-h2 mb-4">Route ưu tiên</h2>
            <div className="space-y-2 text-sm">
              {modules.map(item => <div key={item.path} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 dark:border-slate-800"><span>{item.name}</span><Link className="text-gold" to={item.path}>{item.path}</Link></div>)}
            </div>
          </div>
        </div>
      )}

      {tab === 'media' && (
        <div className="panel p-5">
          <h2 className="text-h2 mb-4">Media public</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {media.map(item => (
              <div key={`${item.type}-${item.path}`} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="text-[.72rem] font-bold uppercase tracking-[.14em] text-muted">{item.type}</div>
                <h3 className="text-h3 mt-2 mb-1">{item.name}</h3>
                <a className="text-sm text-gold break-all" href={item.path}>{item.path}</a>
                <p className="m-0 mt-2 text-xs text-muted break-all">Fallback: {item.fallback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'system' && (
        <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="panel p-5">
            <h2 className="text-h2 mb-4">Cấu hình hiện tại</h2>
            <div className="space-y-3 text-sm text-muted">
              <p><b className="text-cream">Supabase URL:</b> {import.meta.env.VITE_SUPABASE_URL ? 'đã đặt' : 'chưa đặt'}</p>
              <p><b className="text-cream">Publishable key:</b> {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY ? 'đã đặt' : 'chưa đặt'}</p>
              <p><b className="text-cream">Admin emails:</b> {adminEmails().length ? adminEmails().join(', ') : 'chưa đặt'}</p>
              <p><b className="text-cream">Build:</b> Vite + React + Supabase Auth.</p>
            </div>
          </div>
          <div className="panel p-5">
            <h2 className="text-h2 mb-4">Bật quyền admin đầy đủ</h2>
            <ol className="list-decimal pl-5 text-sm text-muted leading-relaxed space-y-2">
              <li>Chạy lại `supabase/schema.sql` trong Supabase SQL Editor để có `admin_users`, `is_admin()` và policy admin cho `profiles`.</li>
              <li>Thêm email admin vào bảng `public.admin_users`, ví dụ: `insert into public.admin_users(email, note) values ('admin@example.com', 'Owner');`</li>
              <li>Thêm cùng email vào `.env.local`: `VITE_ADMIN_EMAILS=admin@example.com` để hiện nút Admin trên thanh điều hướng.</li>
              <li>Restart dev server hoặc redeploy để Vite nhận biến môi trường mới.</li>
            </ol>
          </div>
        </div>
      )}
          </div>
        </main>
      </div>
    </div>
  )
}
