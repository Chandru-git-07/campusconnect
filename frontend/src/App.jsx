import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { getToken } from './api/session.js'
import Auth from './pages/auth.jsx'
import Dashboard from './pages/dashboard.jsx'
import Discover from './pages/discover.jsx'
import TravelRequest from './pages/travel-request.jsx'
import Matches from './pages/match-results.jsx'
import GroupDetails from './pages/group-details.jsx'
import Savings from './pages/savings.jsx'
import Trips from './pages/trips.jsx'
import Notifications from './pages/notifications.jsx'
import Profile from './pages/profile.jsx'
import Safety from './pages/safety.jsx'

function LoginRoute() {
  if (getToken()) return <Navigate to="/" replace />
  return <Auth />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
      <Route path="/request" element={<ProtectedRoute><TravelRequest /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
      <Route path="/groups/:id" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
      <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
