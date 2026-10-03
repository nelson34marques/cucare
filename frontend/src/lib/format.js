const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

export function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const parts = DATE_ONLY.exec(String(value))
  if (parts) {
    return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const pad = (n) => String(n).padStart(2, '0')

export function formatDate(value, fallback = '—') {
  const d = toDate(value)
  if (!d) return fallback
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatDateTime(value, fallback = '—') {
  const d = toDate(value)
  if (!d) return fallback
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatDateTimeShort(value, fallback = '—') {
  const d = toDate(value)
  if (!d) return fallback
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatRelative(value, fallback = '—') {
  const d = toDate(value)
  if (!d) return fallback
  const diff = Date.now() - d.getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'agora mesmo'
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `há ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 30) return `há ${days} dia${days === 1 ? '' : 's'}`
  return formatDate(d)
}

export function formatBytes(bytes, fallback = '—') {
  if (typeof bytes !== 'number' || Number.isNaN(bytes)) return fallback
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded} ${units[unit]}`
}

export function initials(name, fallback = '—') {
  if (!name) return fallback
  const parts = String(name).trim().split(/\s+/)
  const letters = parts.slice(0, 2).map((p) => p[0] || '')
  return letters.join('').toUpperCase() || fallback
}

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}