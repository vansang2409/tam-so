import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePageSeo } from '../components/useSeo.js'
import NotFound from '../components/NotFound.jsx'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { POST_SELECT, renderPlainContent } from '../data/cms.js'

function fmtDate(value) {
  if (!value) return ''
  try { return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value)) } catch (_) { return value }
}

function Loading() {
  return <section className="wrap py-14"><div className="page-fallback"><span className="page-fallback-spinner" aria-hidden="true" /></div></section>
}

function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  usePageSeo({
    title: 'Bài viết | Tam Sở',
    description: 'Các bài viết, hướng dẫn và ghi chú mới từ Tam Sở.',
    path: '/bai-viet',
    breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Bài viết' }]
  })

  useEffect(() => {
    let alive = true
    async function load() {
      if (!supabase) { setLoading(false); return }
      setLoading(true)
      const { data, error: err } = await supabase
        .from('cms_posts')
        .select(POST_SELECT)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(30)
      if (!alive) return
      if (err) setError(err.message)
      else setPosts(data || [])
      setLoading(false)
    }
    load()
    return () => { alive = false }
  }, [])

  if (loading) return <Loading />
  return (
    <>
      <section className="wrap text-center pt-[72px] pb-7">
        <div className="text-gold text-kicker uppercase">CMS</div>
        <h1 className="text-display my-3">Bài viết Tam Sở</h1>
        <p className="text-muted text-lead max-w-[660px] mx-auto">Nơi đăng các ghi chú, hướng dẫn và bài viết dài hơn từ hệ thống admin.</p>
      </section>
      <section className="wrap pb-12">
        {error && <div className="disclaimer mb-5">{error}</div>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Link key={post.id} to={`/bai-viet/${post.slug}`} className="panel route3d-card block overflow-hidden no-underline transition hover:-translate-y-1 hover:border-gold/40">
              {post.featured_image && <img src={post.featured_image} alt="" className="h-44 w-full object-cover" loading="lazy" />}
              <div className="p-5">
                <div className="text-[.72rem] font-bold uppercase tracking-[.16em] text-gold">{post.cms_categories?.name || 'Bài viết'} · {fmtDate(post.published_at || post.created_at)}</div>
                <h2 className="text-h2 mt-2 mb-2">{post.title}</h2>
                <p className="m-0 text-sm leading-relaxed text-muted">{post.excerpt || 'Đọc bài viết trên Tam Sở.'}</p>
              </div>
            </Link>
          ))}
        </div>
        {!posts.length && !error && <div className="panel p-7 text-center text-muted">Chưa có bài viết published nào.</div>}
      </section>
    </>
  )
}

function BlogPost({ slug }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      if (!supabase) { setLoading(false); return }
      setLoading(true)
      const { data, error: err } = await supabase
        .from('cms_posts')
        .select(POST_SELECT)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()
      if (!alive) return
      if (err) setError(err.message)
      else setPost(data || null)
      setLoading(false)
    }
    load()
    return () => { alive = false }
  }, [slug])

  const blocks = useMemo(() => renderPlainContent(post?.content), [post?.content])
  usePageSeo({
    title: (post?.seo_title || post?.title || 'Bài viết') + ' | Tam Sở',
    description: post?.seo_description || post?.excerpt || 'Bài viết từ Tam Sở.',
    path: `/bai-viet/${slug}`,
    image: post?.featured_image || undefined,
    breadcrumb: [{ name: 'Trang chủ', path: '/' }, { name: 'Bài viết', path: '/bai-viet' }, { name: post?.title || slug }]
  })

  if (loading) return <Loading />
  if (error) return <section className="wrap py-14"><div className="disclaimer">{error}</div></section>
  if (!post) return <NotFound title="Không tìm thấy bài viết" msg="Bài viết này chưa tồn tại hoặc chưa được published." />

  return (
    <article className="wrap py-10 md:py-14">
      <div className="max-w-[820px] mx-auto">
        <Link className="text-gold text-sm font-semibold" to="/bai-viet">← Bài viết</Link>
        <div className="mt-5 text-[.75rem] font-bold uppercase tracking-[.16em] text-gold">{post.cms_categories?.name || 'Bài viết'} · {fmtDate(post.published_at || post.created_at)}</div>
        <h1 className="text-display my-4">{post.title}</h1>
        {post.excerpt && <p className="text-lead text-muted">{post.excerpt}</p>}
        {post.featured_image && <img src={post.featured_image} alt="" className="my-7 aspect-[16/9] w-full rounded-xl object-cover shadow-lift" />}
        <div className="panel p-6 md:p-8 leading-relaxed text-[1.02rem]">
          {blocks.map((block, i) => {
            if (block.startsWith('### ')) return <h3 key={i} className="text-h3 mt-5 mb-2">{block.slice(4)}</h3>
            if (block.startsWith('## ')) return <h2 key={i} className="text-h2 mt-6 mb-3">{block.slice(3)}</h2>
            if (block.startsWith('# ')) return <h2 key={i} className="text-h2 mt-6 mb-3">{block.slice(2)}</h2>
            return <p key={i} className="text-muted whitespace-pre-line">{block}</p>
          })}
        </div>
      </div>
    </article>
  )
}

export default function Blog() {
  const { slug } = useParams()
  return slug ? <BlogPost slug={slug} /> : <BlogIndex />
}
