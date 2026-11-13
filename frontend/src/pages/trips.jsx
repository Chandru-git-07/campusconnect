import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/shell.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/ui-cards.jsx'
import { travelService } from '../api/services.js'

function fmtDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

export default function Trips() {
  const [trips, setTrips] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    travelService
      .mine()
      .then((data) => {
        if (!cancelled) setTrips(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (cancelled) return
        const detail = err?.response?.data?.detail
        setError(typeof detail === 'string' ? detail : 'Could not load your trips.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppShell title="My trips" subtitle="Every ride, one place.">
      {trips === null && !error && <LoadingState label="Loading your trips…" />}
      {error && <ErrorState message={error} />}
      {trips !== null && !error && trips.length === 0 && (
        <EmptyState title="No trips yet" hint="Create a travel request to get started." />
      )}
      {trips !== null && trips.length > 0 && (
        <div className="flex flex-col gap-3">
          {trips.map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-white p-4" style={{ borderRadius: '1.5rem' }}>
              <div>
                <p className="font-bold">{t.origin} → {t.destination}</p>
                <p className="text-sm text-muted">
                  {fmtDateTime(t.earliest_departure)} · {t.status}
                </p>
              </div>
              <span className="font-extrabold text-brand">{t.status}</span>
            </div>
          ))}
        </div>
      )}
      <Link to="/request" className="btn-pill mt-6 inline-block bg-brand px-6 py-3 text-sm text-white">
        New travel request
      </Link>
    </AppShell>
  )
}
