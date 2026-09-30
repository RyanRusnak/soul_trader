import { Link } from 'react-router-dom'

export function ArchMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 36 36" aria-hidden>
      <path
        d="M 6 30 C 6 18, 12 8, 22 8 C 28 8, 32 18, 32 30"
        stroke="#10b981"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        d="M 12 30 C 12 21, 16 14, 22 14 C 26 14, 28 21, 28 30"
        stroke="#34d399"
        strokeDasharray="2 3"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle cx="22" cy="22" fill="#10b981" r="2" />
      <path d="M 4 32 L 34 32" opacity="0.6" stroke="#10b981" strokeWidth="1.5" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3 shrink-0">
      <ArchMark className="w-8 h-8 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
      {!compact && (
        <span className="flex flex-col pr-2">
          <span className="font-display text-base font-bold leading-none tracking-wider text-bone whitespace-nowrap">
            SOLE TRADER
          </span>
          <span className="mt-1 font-mono text-[10px] font-bold leading-none tracking-[0.2em] text-lime whitespace-nowrap">
            DATA // COMMERCE ARCHITECTURE
          </span>
        </span>
      )}
    </Link>
  )
}
