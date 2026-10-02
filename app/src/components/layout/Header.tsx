import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { TelemetryTicker } from '../TelemetryTicker'
import { Logo } from '../ui/Logo'

const NAV = [
  { to: '/', label: 'THE DROP' },
  { to: '/manifesto', label: 'MANIFESTO' },
  { to: '/legal', label: 'LEGAL' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
    isActive ? 'text-lime' : 'text-muted hover:text-bone'
  }`

export function Header() {
  const { cartCount, dispatch } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <TelemetryTicker />
      <div className="border-b border-edge bg-obsidian/80 backdrop-blur-xl shadow-[0_1px_16px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkClass}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: 'drawer/open' })}
              className="flex items-center gap-2 whitespace-nowrap border border-edge bg-panel-high/60 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:border-lime hover:text-lime"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-lime" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6L5 3H2" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
              </svg>
              CART ({cartCount})
            </button>
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center border border-edge text-muted hover:text-bone md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                {menuOpen ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            className="border-t border-edge bg-carbon px-4 py-3 md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-3">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export const HEADER_OFFSET = 'pt-[92px]'
export const STICKY_TOP = 'top-[92px]'

export function HeaderSpacer() {
  return <div className="h-[92px]" aria-hidden />
}
