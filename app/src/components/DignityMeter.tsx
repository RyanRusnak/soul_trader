import { money } from '../lib/format'

/** The running "your data is worth $X, you pay $0" meter. */
export function DignityMeter({
  accrued,
  ceiling = 280,
  className = '',
}: {
  accrued: number
  ceiling?: number
  className?: string
}) {
  const pct = Math.min(100, (accrued / ceiling) * 100)
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
        <span className="text-zinc">DIGNITY DRAIN METER</span>
        <span className="text-amber">{Math.round(pct)}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden border border-edge bg-panel-high">
        <div
          className="h-full bg-gradient-to-r from-lime via-amber to-danger transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
        <div className="pointer-events-none absolute inset-y-0 w-8 animate-sweep bg-white/10" aria-hidden />
      </div>
      <div className="flex items-center justify-between font-mono text-[11px]">
        <span className="text-muted">
          DATA VALUE: <span className="text-bone">{money(accrued)}</span>
        </span>
        <span className="text-lime">YOU PAY: {money(0)}</span>
      </div>
    </div>
  )
}
