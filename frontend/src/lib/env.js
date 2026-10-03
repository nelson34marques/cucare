export const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const REQUEST_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 15000)

export const DEFAULT_PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE || 20)