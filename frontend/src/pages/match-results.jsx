import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/shell.jsx'
import { EmptyState, ErrorState, LoadingState, MatchCard } from '../components/ui-cards.jsx'
import { matchService } from '../api/services.js'

export default function MatchResults() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)

  const runMatching = useCallback(async () => {
    setError('')
    setRunning(true)
    try {
      const data = await matchService.run()
      setResult(data)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Could not run matching. Please try again.')
    } finally {
      setRunning(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    matchService
      .run()
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch((err) => {
        if (cancelled) return
        const detail = err?.response?.data?.detail
        setError(typeof detail === 'string' ? detail : 'Could not run matching. Please try again.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const proposals = result?.generated_proposals ?? []
  const rejected = result?.rejected_matches ?? []
  const empty = result !== null && proposals.length === 0 && rejected.length === 0
  const loading = (result === null || running) && !error
  // The backend rejects groups of more than four riders (see VEHICLE_CAPACITY
  // in backend/app/matching_engine.py). Name the limit only when the backend
  // actually rejected for capacity; other reasons stay verbatim on each card.
  const capacityRejected = rejected.some((r) =>
    /capacity|max limit/i.test(`${r?.reason ?? ''} ${r?.explanation ?? ''}`),
  )

  return (
    <AppShell title="Your matches" subtitle="Groups the backend proposed for you.">
      <h2 className="mb-4 text-2xl font-extrabold">Choose a safe group</h2>
      {loading && <LoadingState label="Finding your matches…" />}
      {error && <ErrorState message={error} />}
      {empty && !error && (
        <EmptyState title="No matches yet" hint="Create a travel request and try again." />
      )}
      <div className="flex flex-col gap-4">
        {proposals.map((p) => (
          <Link key={p.group_id} to={`/groups/${p.group_id}`}>
            <MatchCard
              variant="safe"
              title={`Group #${p.group_id}`}
              lines={p.explanation ? [p.explanation] : []}
            />
          </Link>
        ))}
      </div>
      {rejected.length > 0 && !error && (
        <div className="mt-8">
          <h3 className="mb-1 text-xl font-extrabold">Not matched safely</h3>
          <p className="mb-3 text-sm text-muted">
            These groups were rejected by the backend safety check and were not created.
            {capacityRejected
              ? ' The group exceeded the four-rider safety limit, so it cannot travel together.'
              : ' See each reason below.'}
          </p>
          <div className="flex flex-col gap-4">
            {rejected.map((r, i) => (
              <MatchCard
                key={`rejected-${i}`}
                variant="rejected"
                title="Rejected option"
                reason={r.reason}
                lines={r.explanation ? [r.explanation] : []}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              onClick={runMatching}
              disabled={running}
              className="btn-pill flex-1 bg-brand-pale py-3.5 text-brand disabled:opacity-60"
            >
              {running ? 'Trying again…' : 'Try another match'}
            </button>
            <Link to="/request" className="btn-pill flex-1 bg-white py-3.5 text-center font-semibold text-ink">
              Create new request
            </Link>
          </div>
        </div>
      )}
    </AppShell>
  )
}
