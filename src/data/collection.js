// Bộ sưu tập kết quả ("reading" yêu thích) — lưu cục bộ trong trình duyệt máy bạn.
// Thuần JS, KHÔNG phụ thuộc React → test được bằng Node. Không có dữ kiện server.
// Mỗi mục: { id, kind, sig, title, lines:[], note, t, url }
//  - kind: 'tarot' | 'iching' | 'numerology' | 'laso' | 'zodiac' | 'profile'
//  - sig : chữ ký nội dung để tránh lưu trùng cùng một kết quả
//  - t   : mốc thời gian (ms)

export const COLLECTION_KEY = 'tamso_collection'
export const MAX_ITEMS = 60

// Nhãn + biểu tượng + đường dẫn cho từng hệ (dùng khi hiển thị huy hiệu)
export const KIND_META = {
  tarot:      { label: 'Tarot',         icon: '🃏', path: '/tarot' },
  iching:     { label: 'Kinh Dịch',     icon: '☯',  path: '/kinh-dich' },
  numerology: { label: 'Thần số học',   icon: '🔢', path: '/than-so-hoc' },
  laso:       { label: 'Lá số Tử Vi',   icon: '🪐', path: '/la-so-tu-vi' },
  zodiac:     { label: 'Cung hoàng đạo', icon: '♈', path: '/cung-hoang-dao' },
  profile:    { label: 'Hồ sơ',         icon: '✦',  path: '/ho-so' }
}
export const kindMeta = k => KIND_META[k] || { label: 'Khác', icon: '✦', path: '/' }

const _ls = () => (typeof localStorage !== 'undefined' ? localStorage : null)

export function loadCollection() {
  const ls = _ls(); if (!ls) return []
  try { const a = JSON.parse(ls.getItem(COLLECTION_KEY) || '[]'); return Array.isArray(a) ? a : [] } catch { return [] }
}

function _persist(arr) {
  const ls = _ls()
  if (ls) { try { ls.setItem(COLLECTION_KEY, JSON.stringify(arr)) } catch (e) { /* hết dung lượng → bỏ qua */ } }
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    try { window.dispatchEvent(new Event('tamso:collection')) } catch (e) { /* SSR/an toàn */ }
  }
  return arr
}

let _seq = 0
export function makeId() {
  return Date.now().toString(36) + '-' + (_seq++).toString(36) + Math.random().toString(36).slice(2, 6)
}

// Thêm một mục. Nếu trùng sig → đưa lên đầu (làm tươi thời gian). Trả về mảng mới.
export function addItem(item, arr) {
  const list = Array.isArray(arr) ? arr.slice() : loadCollection()
  const sig = item.sig || (item.kind + ':' + (item.title || ''))
  const idx = list.findIndex(x => x.sig === sig)
  if (idx !== -1) {
    const old = list.splice(idx, 1)[0]
    list.unshift({ ...old, ...item, sig, id: old.id, t: Date.now() })
  } else {
    list.unshift({ id: item.id || makeId(), kind: item.kind, title: '', lines: [], note: '', url: '', t: Date.now(), ...item, sig })
  }
  return _persist(list.slice(0, MAX_ITEMS))
}

export function removeItem(id, arr) {
  const list = (Array.isArray(arr) ? arr : loadCollection()).filter(x => x.id !== id)
  return _persist(list)
}

export function clearCollection() { return _persist([]) }

export function hasSig(sig, arr) {
  return (Array.isArray(arr) ? arr : loadCollection()).some(x => x.sig === sig)
}

export function countCollection() { return loadCollection().length }

// — Xuất văn bản (để chép hoặc tải .txt) —
export function itemToText(it) {
  const m = kindMeta(it.kind)
  let when = ''
  try { when = new Date(it.t).toLocaleString('vi-VN') } catch (e) { when = '' }
  let s = '• [' + m.label + '] ' + (it.title || '')
  if (when) s += '\n  ' + when
  if (Array.isArray(it.lines)) for (const l of it.lines) s += '\n  ' + l
  if (it.note) s += '\n  ' + it.note
  return s
}

export function collectionToText(arr) {
  const list = Array.isArray(arr) ? arr : loadCollection()
  if (!list.length) return 'Bộ sưu tập trống.'
  return '✦ BỘ SƯU TẬP — Tam Sở (' + list.length + ' mục)\n\n'
    + list.map(itemToText).join('\n\n')
    + '\n\n— Lưu cục bộ trong trình duyệt máy bạn; chỉ là gợi ý chiêm nghiệm, không phải lời phán chắc chắn.'
}
