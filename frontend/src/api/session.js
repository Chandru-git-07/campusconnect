export const TOKEN_KEY = 'cc_token'

export function isSrmEmail(email) {
  return /^[^\s@]+@srmist\.edu\.in$/i.test((email || '').trim())
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}
