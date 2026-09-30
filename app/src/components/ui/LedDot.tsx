import type { Tone } from '../../data/products'
import { TONE_BG } from './tones'

export function LedDot({
  tone = 'lime',
  fast = false,
  className = '',
}: {
  tone?: Tone
  fast?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={`inline-block h-1.5 w-1.5 shrink-0 ${TONE_BG[tone]} ${
        fast ? 'animate-led-fast' : 'animate-led'
      } ${className}`}
    />
  )
}
