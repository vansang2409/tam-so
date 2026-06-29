const DEFAULT_TOPIC = 'Tổng quan'

export const PROFILE_SELECT = 'id, display_name, birth_day, birth_month, birth_year, gender, birth_hour, topic, question, updated_at'

function cleanText(value) {
  return String(value || '').trim()
}

function cleanGender(value) {
  return value === 'nu' ? 'nu' : 'nam'
}

function cleanNumberText(value) {
  if (value == null || value === '') return ''
  const n = Number(value)
  return Number.isFinite(n) ? String(Math.trunc(n)) : ''
}

function toIntOrNull(value) {
  const text = cleanNumberText(value)
  return text ? Number(text) : null
}

export function normalizeProfileForm(form = {}) {
  return {
    n: cleanText(form.n),
    d: cleanNumberText(form.d),
    m: cleanNumberText(form.m),
    y: cleanNumberText(form.y),
    g: cleanGender(form.g),
    h: cleanNumberText(form.h),
    t: cleanText(form.t) || DEFAULT_TOPIC,
    q: cleanText(form.q)
  }
}

export function hasUsableProfile(form = {}) {
  const p = normalizeProfileForm(form)
  return Boolean(p.d && p.m && p.y)
}

export function profileFormToRow(userId, form = {}) {
  const p = normalizeProfileForm(form)
  return {
    id: userId,
    display_name: p.n || null,
    birth_day: toIntOrNull(p.d),
    birth_month: toIntOrNull(p.m),
    birth_year: toIntOrNull(p.y),
    gender: p.g,
    birth_hour: toIntOrNull(p.h),
    topic: p.t,
    question: p.q || null,
    updated_at: new Date().toISOString()
  }
}

export function profileRowToForm(row = {}) {
  return normalizeProfileForm({
    n: row.display_name || '',
    d: row.birth_day ?? '',
    m: row.birth_month ?? '',
    y: row.birth_year ?? '',
    g: row.gender || 'nam',
    h: row.birth_hour ?? '',
    t: row.topic || DEFAULT_TOPIC,
    q: row.question || ''
  })
}

export function isMissingProfileTableError(error) {
  const code = String(error?.code || '')
  const msg = String(error?.message || error || '')
  return code === '42P01' || code === 'PGRST205' || /schema cache|relation .*profiles|table .*profiles|profiles.*does not exist/i.test(msg)
}

export function profileSyncErrorMessage(error) {
  const msg = String(error?.message || error || '')
  if (isMissingProfileTableError(error)) return 'Chưa có bảng profiles trong Supabase. Hãy chạy file supabase/schema.sql trong SQL Editor rồi thử lưu lại.'
  if (/row-level security|permission denied|violates row-level security/i.test(msg)) return 'Supabase đã chặn lưu hồ sơ vì RLS/policy chưa khớp. Kiểm tra lại policy auth.uid() = id trong supabase/schema.sql.'
  return msg || 'Chưa đồng bộ được hồ sơ lên Supabase. Bạn thử lại sau một chút nhé.'
}
