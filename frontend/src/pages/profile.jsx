import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/shell.jsx'
import { LoadingState } from '../components/ui-cards.jsx'
import { useAuth } from '../api/useAuth.js'

export default function Profile() {
  const nav = useNavigate()
  const { user, authLoading, logout } = useAuth()
  const onLogout = () => {
    logout()
    nav('/login', { replace: true })
  }
  return (
    <AppShell title="Profile" subtitle="Travel your way.">
      {authLoading && <LoadingState label="Loading your profile…" />}
      {!authLoading && user && (
        <div className="bg-white p-5" style={{ borderRadius: '1.5rem' }}>
          <p className="font-extrabold">{user.name}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      )}
      <h3 className="mb-3 mt-6 text-lg font-extrabold">Preferences</h3>
      <div className="flex flex-col gap-3">
        {['Morning departures', 'Shared cabs only', 'Extra luggage room'].map((p) => (
          <div key={p} className="flex items-center justify-between bg-white p-4" style={{ borderRadius: '1.5rem' }}>
            <span className="font-semibold">{p}</span>
            <span className="text-sm font-bold text-brand">On</span>
          </div>
        ))}
      </div>
      <button onClick={onLogout} type="button" className="btn-pill mt-6 w-full bg-white py-3.5 font-semibold text-coral">
        Log out
      </button>
    </AppShell>
  )
}
