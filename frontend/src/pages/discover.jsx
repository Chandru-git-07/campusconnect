import { AppShell } from '../components/shell.jsx'
import { EmptyState } from '../components/ui-cards.jsx'

export default function Discover() {
  return (
    <AppShell title="Discover" subtitle="See who is travelling your way.">
      <h2 className="mb-3 text-xl font-extrabold">Popular routes</h2>
      {/* TODO: no backend endpoint for route discovery exists; keep empty instead of fake routes. */}
      <EmptyState title="No routes to show yet" hint="Popular routes will appear here once a backend discovery endpoint exists." />

      <h2 className="mb-3 mt-8 text-xl font-extrabold">Students travelling soon</h2>
      {/* TODO: no backend endpoint for nearby travellers exists; keep empty instead of fake students. */}
      <EmptyState title="No travellers to show yet" hint="Compatible students will appear here once a backend discovery endpoint exists." />
    </AppShell>
  )
}
