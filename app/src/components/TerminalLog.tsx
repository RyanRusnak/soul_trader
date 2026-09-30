import { useEffect, useRef, useState } from 'react'
import { exfilLine } from '../lib/telemetry'

export function TerminalLog({
  intervalMs = 3500,
  seed = 4,
  className = '',
}: {
  intervalMs?: number
  seed?: number
  className?: string
}) {
  const [lines, setLines] = useState<string[]>(() =>
    Array.from({ length: seed }, (_, i) =>
      i === 0 ? '> establishing exfiltration channel ......... OK' : exfilLine(),
    ),
  )
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => {
      setLines((prev) => [...prev.slice(-40), exfilLine()])
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])

  useEffect(() => {
    const el = boxRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  return (
    <div
      ref={boxRef}
      className={`overflow-y-auto border border-edge bg-obsidian p-4 font-mono text-[11px] leading-relaxed text-lime/90 ${className}`}
      aria-label="Live exfiltration feed"
    >
      <p className="mb-2 text-zinc">// LIVE EXFILTRATION FEED — DO NOT CLOSE TAB</p>
      {lines.map((l, i) => (
        <p key={i} className={l.includes('ANOMALY') ? 'text-amber' : undefined}>
          {l}
        </p>
      ))}
      <span className="inline-block h-3 w-2 animate-led bg-lime align-middle" aria-hidden />
    </div>
  )
}
