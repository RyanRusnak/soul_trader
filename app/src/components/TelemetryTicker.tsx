import { useMemo } from 'react'
import { telemetryBurst } from '../lib/telemetry'
import { LedDot } from './ui/LedDot'

export function TelemetryTicker() {
  const lines = useMemo(() => telemetryBurst(10), [])
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {lines.map((l, i) => (
        <span
          key={i}
          className="flex items-center gap-2 px-6 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc whitespace-nowrap"
        >
          <LedDot
            tone={l.kind === 'warn' ? 'amber' : l.kind === 'geo' ? 'cyan' : 'lime'}
            fast={l.kind === 'warn'}
          />
          <span className={l.kind === 'warn' ? 'text-amber' : ''}>{l.text}</span>
        </span>
      ))}
    </div>
  )
  return (
    <div
      className="relative flex h-7 items-center overflow-hidden border-b border-edge/60 bg-carbon"
      aria-hidden
    >
      <div className="flex animate-marquee">{[row('a'), row('b')]}</div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-carbon to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-carbon to-transparent" />
    </div>
  )
}
