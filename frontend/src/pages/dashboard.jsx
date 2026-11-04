import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/shell.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/ui-cards.jsx'
import { dashboardService, travelService } from '../api/services.js'
import { useAuth } from '../api/useAuth.js'

function fmtDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [trips, setTrips] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([dashboardService.get(), travelService.mine()])
      .then(([dash, mine]) => {
        if (cancelled) return
        setStats(dash?.stats ?? null)
        setTrips(Array.isArray(mine) ? mine : [])
        setLoaded(true)
      })
      .catch((err) => {
        if (cancelled) return
        const detail = err?.response?.data?.detail
        setError(typeof detail === 'string' ? detail : 'Could not load your dashboard.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const loading = !loaded && !error
  const nextTrip = trips && trips.length > 0
    ? [...trips].sort((a, b) => new Date(b.earliest_departure) - new Date(a.earliest_departure))[0]
    : null

  return (
    <AppShell title={`Good morning, ${user?.name ?? 'traveller'}`}>
      {loading && <LoadingState label="Loading your dashboard…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && (
        <>
          <div className="bg-coral p-5 text-white" style={{ borderRadius: '1.5rem' }}>
            <p className="eyebrow opacity-90">Next departure</p>
            {nextTrip ? (
              <>
                <h2 className="mt-2 text-2xl font-extrabold">{nextTrip.destination}</h2>
                <p className="mt-1 text-sm opacity-90">
                  Leave {fmtDateTime(nextTrip.earliest_departure)} · Arrive {fmtDateTime(nextTrip.latest_arrival)}
                </p>
                <p className="mt-1 text-sm opacity-90">Status: {nextTrip.status}</p>
              </>
            ) : (
              <p className="mt-2 text-sm opacity-90">No trips yet. Plan your first trip below.</p>
            )}
          </div>

          <h2 className="mb-3 mt-8 text-xl font-extrabold">At a glance</h2>
          <div className="grid grid-cols-3 gap-3 md:max-w-xl">
            {[
              { label: 'Your trips', value: trips.length },
              { label: 'Groups proposed', value: stats?.total_groups ?? 0 },
              { label: 'Travellers', value: stats?.total_users ?? 0 },
            ].map((s) => (
              <div key={s.label} className="bg-white p-4 text-center" style={{ borderRadius: '1.5rem' }}>
                <p className="text-2xl font-extrabold text-brand">{s.value}</p>
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-8 text-xl font-extrabold">Today&apos;s people</h2>
          {/* TODO: no backend endpoint lists nearby travellers yet; keep empty instead of fake people. */}
          <EmptyState title="No traveller directory yet" hint="A backend endpoint for discovering fellow travellers is still missing." />

          <div className="mt-10">
            <p className="text-sm text-muted">Saved this month</p>
            {/* TODO: no backend savings endpoint exists; keep empty instead of fabricated totals. */}
            <EmptyState title="Savings are not tracked yet" hint="Totals will appear here once a backend savings endpoint exists." />
            <Link to="/request" className="btn-pill mt-4 inline-block bg-brand-pale px-6 py-3 text-sm text-brand">
              Plan a new trip
            </Link>
          </div>
        </>
      )}
    </AppShell>
  )
}
