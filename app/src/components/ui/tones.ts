import type { Tone } from '../../data/products'

export const TONE_TEXT: Record<Tone, string> = {
  lime: 'text-lime',
  cyan: 'text-cyan',
  amber: 'text-amber',
  danger: 'text-danger',
}

export const TONE_BG: Record<Tone, string> = {
  lime: 'bg-lime',
  cyan: 'bg-cyan',
  amber: 'bg-amber',
  danger: 'bg-danger',
}

export const TONE_BORDER: Record<Tone, string> = {
  lime: 'border-lime/40',
  cyan: 'border-cyan/40',
  amber: 'border-amber/40',
  danger: 'border-danger/50',
}

export const TONE_BG_SOFT: Record<Tone, string> = {
  lime: 'bg-lime/10',
  cyan: 'bg-cyan/10',
  amber: 'bg-amber/10',
  danger: 'bg-danger/10',
}
