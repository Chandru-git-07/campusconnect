import { ShieldCheck, Phone } from 'lucide-react'
import { AppShell } from '../components/shell.jsx'

export default function Safety() {
  return (
    <AppShell title="Safety & Help" subtitle="Travel with confidence.">
      <div className="bg-coral p-5 text-white" style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} />
          <p className="font-extrabold">Deadline-first matching</p>
        </div>
        <p className="mt-2 text-sm opacity-90">Groups are only suggested when everyone keeps a safe arrival buffer.</p>
      </div>
      <div className="mt-4 bg-white p-5" style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-2">
          <Phone size={18} className="text-brand" />
          <p className="font-extrabold">Need help?</p>
        </div>
        <p className="mt-1 text-sm text-muted">Campus support · 8 AM – 8 PM</p>
        <button className="btn-pill mt-4 w-full bg-brand-pale py-3.5 text-brand" type="button">
          Contact support
        </button>
      </div>
    </AppShell>
  )
}
