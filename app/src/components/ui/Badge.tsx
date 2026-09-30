import type { ReactNode } from 'react'
import type { Tone } from '../../data/products'
import { LedDot } from './LedDot'
import { TONE_BG_SOFT, TONE_BORDER, TONE_TEXT } from './tones'

export function Badge({
  tone = 'lime',
  led = false,
  fast = false,
  children,
  className = '',
}: {
  tone?: Tone
  led?: boolean
  fast?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] ${TONE_BG_SOFT[tone]} ${TONE_BORDER[tone]} ${TONE_TEXT[tone]} ${className}`}
    >
      {led && <LedDot tone={tone} fast={fast} />}
      {children}
    </span>
  )
}
