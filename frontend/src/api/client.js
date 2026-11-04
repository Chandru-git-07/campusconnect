import axios from 'axios'
import { clearToken, getToken } from './session.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (import.meta.env.DEV) {
    // Safe logging: method + URL only. Never log headers or bodies here,
    // they may carry bearer tokens, emails, or passwords.
    // eslint-disable-next-line no-console
    console.debug(`[api] ${String(config.method || 'get').toUpperCase()} ${config.baseURL}${config.url}`)
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (import.meta.env.DEV) {
      const status = error?.response?.status
      const detail = error?.response?.data?.detail ?? error?.message
      // eslint-disable-next-line no-console
      console.debug(`[api] error ${status ?? 'network'}: ${typeof detail === 'string' ? detail : 'request failed'}`)
    }
    if (error?.response?.status === 401) {
      // Expired or invalid token: drop the session and force a fresh login.
      clearToken()
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api
