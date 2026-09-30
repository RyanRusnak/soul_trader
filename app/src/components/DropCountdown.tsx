import { useEffect, useMemo, useState } from 'react'
import { countdownTo, nextDropTarget, pad } from '../lib/format'

export function DropCountdown({ className = '' }: { className?: string }) {
  const target = useMemo(() => nextDropTarget(), [])
  const [cd, setCd] = useState(() => countdownTo(target))

  useEffect(() => {
    const id = window.setInterval(() => setCd(countdownTo(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  const cells = [
    { v: cd.days, l: 'DAYS' },
    { v: cd.hours, l: 'HRS' },
    { v: cd.minutes, l: 'MIN' },
    { v: cd.seconds, l: 'SEC' },
  ]

  return (
    <div className={`flex items-stretch gap-px ${className}`} role="timer">
      {cells.map((c, i) => (
        <div key={c.l} className="flex items-stretch gap-px">
          {i > 0 && <span className="self-center px-1 font-mono text-lg text-zinc">:</span>}
          <div className="flex flex-col items-center border border-edge bg-carbon px-3 py-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-lime">
              {pad(c.v)}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc">
              {c.l}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
