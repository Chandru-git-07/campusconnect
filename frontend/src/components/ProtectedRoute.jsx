import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../api/useAuth.js'
import { AppShell } from './shell.jsx'
import { LoadingState } from './ui-cards.jsx'

/**
 * Reusable route guard. While the session is being restored via GET /auth/me
 * it renders a loading state; afterwards it renders children only for an
 * authenticated user, otherwise it redirects to /login and remembers where
 * the user was headed.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return (
      <AppShell title="Loading…">
        <LoadingState label="Restoring your session…" />
      </AppShell>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
