import { ArrowRight } from 'lucide-react'

export function RouteCard({ name, color }) {
  return (
    <div className="card flex items-center gap-3 bg-white p-4" style={{ borderRadius: '1.5rem' }}>
      <span className="h-9 w-9 rounded-full" style={{ backgroundColor: color }} />
      <span className="flex-1 font-bold">{name}</span>
      <ArrowRight size={18} className="text-brand" />
    </div>
  )
}

/**
 * Data-driven match card. All copy comes from the backend match result
 * (POST /match/run); nothing here is hardcoded to a particular person.
 */
export function MatchCard({ variant = 'safe', title, lines = [], reason }) {
  if (variant === 'rejected') {
    return (
      <div className="bg-white p-5" style={{ borderRadius: '1.5rem' }}>
        <p className="eyebrow text-coral">Rejected match</p>
        <h3 className="mt-2 text-xl font-extrabold">{title}</h3>
        {reason && <p className="mt-1 font-semibold text-coral">{reason}</p>}
        {lines.map((line) => (
          <p key={line} className="mt-1 text-sm text-muted">{line}</p>
        ))}
      </div>
    )
  }
  return (
    <div className="bg-coral p-5 text-white" style={{ borderRadius: '1.5rem' }}>
      <p className="eyebrow opacity-90">Safe match</p>
      <h3 className="mt-2 text-2xl font-extrabold">{title}</h3>
      {lines.map((line) => (
        <p key={line} className="mt-1 opacity-90">{line}</p>
      ))}
    </div>
  )
}

export function LoadingState({ label = 'Loading…' }) {
  return <div className="bg-white p-6 text-center font-semibold text-muted" style={{ borderRadius: '1.5rem' }}>{label}</div>
}

export function EmptyState({ title, hint }) {
  return (
    <div className="bg-white p-6 text-center" style={{ borderRadius: '1.5rem' }}>
      <p className="font-extrabold">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  )
}

export function ErrorState({ message }) {
  return (
    <div className="bg-white p-6 text-center" style={{ borderRadius: '1.5rem' }}>
      <p className="font-extrabold text-coral">Something went wrong</p>
      <p className="mt-1 text-sm text-muted">{message || 'Please try again.'}</p>
    </div>
  )
}
