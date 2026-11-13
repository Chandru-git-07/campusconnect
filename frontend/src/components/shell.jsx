import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Home, Backpack, Compass, PiggyBank, Bell, ShieldCheck, User, LogOut } from 'lucide-react'
import { useAuth } from '../api/useAuth.js'

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand" aria-hidden="true">
        <span className="text-xl font-black leading-none text-white">C</span>
        <span className="absolute bottom-[7px] right-[7px] text-[11px] font-black leading-none text-coral">c</span>
      </div>
      {!compact && <span className="text-sm font-extrabold tracking-wide">CAMPUSCONNECT</span>}
    </div>
  )
}

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/trips', label: 'Trips', icon: Backpack },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/savings', label: 'Savings', icon: PiggyBank },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-black/5 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-[480px] grid-cols-4 px-2 py-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl py-1.5 text-xs font-semibold ${
                isActive ? 'text-brand' : 'text-muted'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function Sidebar() {
  const nav = useNavigate()
  const { logout: logoutSession } = useAuth()
  const logout = () => {
    logoutSession()
    nav('/login', { replace: true })
  }
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-black/5 bg-white/60 p-4 md:flex">
      <Logo />
      <div className="mt-6 flex flex-col gap-1">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                isActive ? 'bg-brand-pale text-brand' : 'text-ink/70 hover:bg-black/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <NavLink to="/notifications" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink/70 hover:bg-black/5">
          <Bell size={18} /> Notifications
        </NavLink>
        <NavLink to="/profile" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink/70 hover:bg-black/5">
          <User size={18} /> Profile
        </NavLink>
        <NavLink to="/safety" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink/70 hover:bg-black/5">
          <ShieldCheck size={18} /> Safety &amp; Help
        </NavLink>
        <button onClick={logout} type="button" className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink/70 hover:bg-black/5">
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  )
}

export function PageHeader({ title, subtitle }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  return (
    <header className="mb-5">
      <div className="flex items-center gap-3">
        <Logo compact />
        <h1 className="text-xl font-extrabold">{title}</h1>
      </div>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      {isHome && <p className="mt-1 text-sm text-muted">A little less cost. A lot more certainty.</p>}
    </header>
  )
}

export function AppShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex min-h-screen max-w-[1440px] md:gap-6">
        <Sidebar />
        <main className="w-full flex-1 px-5 pb-24 pt-5 md:px-10 md:pt-8">
          <div className="mx-auto w-full max-w-[520px] md:max-w-4xl">
            <PageHeader title={title} subtitle={subtitle} />
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
