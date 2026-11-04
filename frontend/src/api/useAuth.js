import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { TOKEN_KEY, clearToken as removeToken, getToken, setToken as saveToken } from './session.js'
import { authService } from './services.js'

/**
 * Shared authentication state for CampusConnect.
 * The token lives in localStorage under 'cc_token' so a page refresh
 * preserves the session; the user object is resolved via GET /auth/me.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUserState] = useState(null)
  const [authLoading, setAuthLoading] = useState(() => getToken() !== null)

  // Keep auth state in sync across tabs.
  useEffect(() => {
    const sync = (event) => {
      if (!event.key || event.key === TOKEN_KEY) {
        const next = getToken()
        setTokenState(next)
        if (!next) setUserState(null)
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  // Application startup: resolve the stored token via GET /auth/me.
  // An expired or invalid token clears the session so route guards
  // redirect to /login instead of showing a stale user.
  useEffect(() => {
    if (!getToken()) {
      setAuthLoading(false)
      return
    }
    let cancelled = false
    setAuthLoading(true)
    authService
      .me()
      .then((u) => {
        if (!cancelled) setUserState(u)
      })
      .catch(() => {
        if (cancelled) return
        removeToken()
        setTokenState(null)
        setUserState(null)
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password)
    if (!res?.access_token) throw new Error('Login did not return a token.')
    saveToken(res.access_token)
    setTokenState(res.access_token)
    setUserState(res.user ?? (await authService.me()))
    return res
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setTokenState(null)
    setUserState(null)
  }, [])

  const value = useMemo(
    () => ({ token, user, authLoading, isAuthenticated: Boolean(token), login, logout }),
    [token, user, authLoading, login, logout],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export { TOKEN_KEY, getToken }
