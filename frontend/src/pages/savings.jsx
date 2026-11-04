import { useEffect, useState } from 'react'
import { AppShell } from '../components/shell.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/ui-cards.jsx'
import { travelService } from '../api/services.js'

export default function Savings() {
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
        setError(typeof detail === 'string' ? detail : 'Could not load your savings.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const matched = trips?.filter((t) => t.status === 'MATCHED').length ?? 0
  const pending = trips?.filter((t) => t.status === 'PENDING').length ?? 0

  return (
    <AppShell title="Your savings" subtitle="Small rides. Big difference.">
      {trips === null && !error && <LoadingState label="Loading your savings…" />}
      {error && <ErrorState message={error} />}
      {trips !== null && !error && (
        <>
          {/* TODO: no backend savings endpoint exists; monetary totals stay empty instead of fabricated. */}
          <EmptyState title="No savings total yet" hint="Rupee totals will appear here once a backend savings endpoint exists." />
          <h3 className="mb-3 mt-6 text-lg font-extrabold">Your impact</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-brand-pale p-5" style={{ borderRadius: '1.5rem' }}>
              <p className="text-3xl font-extrabold text-brand">{matched}</p>
              <p className="mt-1 text-sm text-muted">shared trips</p>
            </div>
            <div className="bg-mint/15 p-5" style={{ borderRadius: '1.5rem' }}>
              <p className="text-3xl font-extrabold text-brand">{pending}</p>
              <p className="mt-1 text-sm text-muted">pending requests</p>
            </div>
          </div>
        </>
      )}
    </AppShell>
  )
}
