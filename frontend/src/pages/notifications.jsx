import { AppShell } from '../components/shell.jsx'
import { EmptyState } from '../components/ui-cards.jsx'

export default function Notifications() {
  return (
    <AppShell title="Notifications" subtitle="Stay in the loop.">
      {/* TODO: no backend notifications endpoint exists; keep empty instead of fake notes. */}
      <EmptyState title="No notifications yet" hint="Updates about your groups and matches will appear here once a backend notifications endpoint exists." />
    </AppShell>
  )
}
