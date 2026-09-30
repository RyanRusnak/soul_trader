import type { Tone } from '../../data/products'
import { TONE_BG } from './tones'

export function StockBar({
  pct,
  tone = 'lime',
  className = '',
}: {
  pct: number
  tone?: Tone
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div
      className={`w-full h-1 bg-panel-high overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full ${TONE_BG[tone]} transition-[width] duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
