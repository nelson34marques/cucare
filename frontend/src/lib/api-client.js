import { API_BASE, REQUEST_TIMEOUT } from './env'

export class ApiError extends Error {
  constructor(message, { status = 0, code = null, details = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  get isUnauthenticated() {
    return this.status === 401 || this.code === 'unauthenticated'
  }

  get isNotFound() {
    return this.status === 404 || this.code === 'not_found'
  }
}

function buildUrl(path, params) {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null || value === '') continue
    qs.set(key, String(value))
  }
  const query = qs.toString()
  return `${API_BASE}${path}${query ? `?${query}` : ''}`
}

async function parseBody(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export async function request(path, { method = 'GET', body, params, signal } = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort)

  let res
  try {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    res = await fetch(buildUrl(path, params), {
      method,
      credentials: 'include',
      headers:
        body === undefined || isFormData
          ? undefined
          : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch {
    if (controller.signal.aborted) {
      throw new ApiError('O pedido demorou demasiado a responder.', { code: 'timeout' })
    }
    throw new ApiError('Não foi possível contactar o servidor.', { code: 'network' })
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onAbort)
  }

  const payload = await parseBody(res)

  if (!res.ok) {
    throw new ApiError(payload?.message || payload?.error || `Erro ${res.status}.`, {
      status: res.status,
      code: payload?.code ?? null,
      details: payload?.details ?? null,
    })
  }

  return payload
}