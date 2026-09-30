import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const BASE =
  'inline-flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-widest transition-colors duration-150 select-none disabled:opacity-40 disabled:cursor-not-allowed'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-lime text-[#00211a] hover:bg-lime-bright glow-lime px-6 py-3 text-[11px]',
  secondary:
    'bg-transparent border border-edge text-bone hover:bg-white/5 hover:border-cyan px-6 py-3 text-[11px]',
  danger: 'bg-amber text-[#2a1700] hover:bg-[#ffb95f] px-6 py-3 text-[11px]',
  ghost: 'bg-transparent text-muted hover:text-lime px-3 py-1 text-[11px]',
}

export function Button({
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest} />
}
