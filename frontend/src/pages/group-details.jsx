import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppShell } from '../components/shell.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/ui-cards.jsx'
import { groupService } from '../api/services.js'

function memberName(m, index) {
  return m?.user_name || m?.user?.name || m?.name || `Member ${index + 1}`
}

export default function GroupDetails() {
  const { id } = useParams()
  const [split, setSplit] = useState(null)
  const [proposal, setProposal] = useState(undefined)
  const [error, setError] = useState('')
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [acceptError, setAcceptError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([groupService.split(id), groupService.proposals()])
      .then(([splitData, proposals]) => {
        if (cancelled) return
        setSplit(splitData)
        const list = Array.isArray(proposals) ? proposals : []
        setProposal(list.find((p) => String(p?.id) === String(id)) ?? null)
      })
      .catch((err) => {
        if (cancelled) return
        const detail = err?.response?.data?.detail
        setError(typeof detail === 'string' ? detail : 'Could not load this group.')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const accept = async () => {
    setAcceptError('')
    setAccepting(true)
    try {
      await groupService.accept(id)
      setAccepted(true)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setAcceptError(typeof detail === 'string' ? detail : 'Could not accept this group. Please try again.')
    } finally {
      setAccepting(false)
    }
  }

  const loading = split === null && !error
  const members = Array.isArray(proposal?.members) ? proposal.members : null

  return (
    <AppShell title="Group details" subtitle={proposal?.destination ? `${proposal.destination}` : 'Your proposed group.'}>
      {loading && <LoadingState label="Loading group details…" />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <>
          <div className="bg-coral p-5 text-white" style={{ borderRadius: '1.5rem' }}>
            <p className="eyebrow opacity-90">Safe match</p>
            <h2 className="mt-2 text-2xl font-extrabold">Group #{split?.group_id ?? id}</h2>
            {proposal?.explanation && <p className="mt-1 text-sm opacity-90">{proposal.explanation}</p>}
          </div>

          <h3 className="mb-3 mt-6 text-lg font-extrabold">Members</h3>
          {members === null && (
            /* TODO: member roster depends on the proposals payload shape; no dedicated member endpoint exists. */
            <EmptyState title="Member list unavailable" hint="The backend did not return a member roster for this group." />
          )}
          {members !== null && members.length === 0 && (
            <EmptyState title="No members yet" hint="Nobody has joined this group." />
          )}
          {members !== null && members.length > 0 && (
            <div className="flex flex-col gap-3">
              {members.map((m, i) => (
                <div key={m?.user_id ?? i} className="flex items-center justify-between bg-white p-4" style={{ borderRadius: '1.5rem' }}>
                  <span className="font-bold">{memberName(m, i)}</span>
                  <span className="text-sm text-muted">{m?.accepted ? 'Accepted' : 'Pending'}</span>
                  {typeof m?.fare_share === 'number' && (
                    <span className="font-extrabold text-brand">₹{m.fare_share}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 bg-white p-5" style={{ borderRadius: '1.5rem' }}>
            <h3 className="font-extrabold">Fare split</h3>
            <p className="mt-1 text-sm text-muted">
              Total ₹{split?.total_fare} · {split?.member_count} member{(split?.member_count ?? 0) === 1 ? '' : 's'} · ₹{split?.fare_per_member} each · You save ₹{split?.savings_per_member}
            </p>
            {acceptError && (
              <p role="alert" className="mt-2 text-sm font-semibold text-coral">{acceptError}</p>
            )}
            <button onClick={accept} disabled={accepting || accepted} className="btn-pill mt-4 w-full bg-brand py-3.5 text-white disabled:opacity-60" type="button">
              {accepted ? 'Group accepted' : accepting ? 'Accepting…' : 'Accept group'}
            </button>
          </div>
        </>
      )}
    </AppShell>
  )
}
