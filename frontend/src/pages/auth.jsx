import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../api/services.js'
import { isSrmEmail } from '../api/session.js'
import { useAuth } from '../api/useAuth.js'

export default function Auth() {
  const nav = useNavigate()
  const location = useLocation()
  const { isAuthenticated, authLoading, login } = useAuth()
  useEffect(() => {
    if (!authLoading && isAuthenticated) nav(location.state?.from ?? '/', { replace: true })
  }, [authLoading, isAuthenticated, location.state, nav])
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const cleanEmail = email.trim()
    if (!isSrmEmail(cleanEmail)) {
      setError('Use your SRM email address (name@srmist.edu.in).')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (mode === 'register' && name.trim().length < 2) {
      setError('Please enter your name.')
      return
    }
    setLoading(true)
    try {
      if (mode === 'register') {
        await authService.register({ email: cleanEmail, name: name.trim(), password })
      }
      await login(cleanEmail, password)
      nav(location.state?.from ?? '/', { replace: true })
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.response?.data?.message
      setError(detail || err?.message || 'Sign-in failed. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-[480px] md:max-w-4xl md:px-8">
        <div className="bg-coral px-6 pb-10 pt-6 text-white md:mt-6" style={{ borderRadius: '1.5rem' }}>
          <p className="text-sm font-extrabold tracking-wide">CAMPUSCONNECT</p>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight md:text-5xl">
            A little less cost.
            <br />
            A lot more certainty.
          </h1>
        </div>
        <div className="px-6 py-8">
          <h2 className="text-2xl font-extrabold">{mode === 'register' ? 'Create account' : 'Welcome back'}</h2>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => { setMode('login'); setError('') }}
              className={`btn-pill px-5 py-2 text-sm ${mode === 'login' ? 'bg-brand text-white' : 'bg-white text-ink'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError('') }}
              className={`btn-pill px-5 py-2 text-sm ${mode === 'register' ? 'bg-brand text-white' : 'bg-white text-ink'}`}
            >
              Register
            </button>
          </div>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label className="field-label" htmlFor="name">Name</label>
                <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex" autoComplete="name" />
              </div>
            )}
            <div>
              <label className="field-label" htmlFor="email">SRM email</label>
              <input id="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@srmist.edu.in" autoComplete="email" inputMode="email" />
            </div>
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
            </div>
            {error && (
              <p role="alert" className="bg-white p-3 text-sm font-semibold text-coral" style={{ borderRadius: '1rem' }}>
                {error}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-pill mt-2 w-full bg-brand py-4 text-white disabled:opacity-60">
              {loading ? 'Please wait…' : mode === 'register' ? 'Register & sign in' : 'Sign in with email'}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-muted">
            SRM email is used for access only and does not verify official SRM enrollment.
          </p>
        </div>
      </div>
    </div>
  )
}
