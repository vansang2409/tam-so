export const POST_SELECT = 'id, title, slug, excerpt, content, status, category_id, featured_image, seo_title, seo_description, published_at, created_at, updated_at, cms_categories(id, name, slug)'
export const CATEGORY_SELECT = 'id, name, slug, description, created_at, updated_at'

export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

export function postToRow(form, userId) {
  const status = form.status === 'published' ? 'published' : 'draft'
  return {
    title: String(form.title || '').trim(),
    slug: slugify(form.slug || form.title),
    excerpt: String(form.excerpt || '').trim() || null,
    content: String(form.content || '').trim() || null,
    status,
    category_id: form.category_id || null,
    featured_image: String(form.featured_image || '').trim() || null,
    seo_title: String(form.seo_title || '').trim() || null,
    seo_description: String(form.seo_description || '').trim() || null,
    author_id: userId || null,
    published_at: status === 'published' ? (form.published_at || new Date().toISOString()) : null
  }
}

export function rowToPostForm(row = {}) {
  return {
    id: row.id || '',
    title: row.title || '',
    slug: row.slug || '',
    excerpt: row.excerpt || '',
    content: row.content || '',
    status: row.status || 'draft',
    category_id: row.category_id || '',
    featured_image: row.featured_image || '',
    seo_title: row.seo_title || '',
    seo_description: row.seo_description || '',
    published_at: row.published_at || ''
  }
}

export function categoryToRow(form) {
  return {
    name: String(form.name || '').trim(),
    slug: slugify(form.slug || form.name),
    description: String(form.description || '').trim() || null
  }
}

export function renderPlainContent(content) {
  return String(content || '')
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
}
