import type { ReactNode } from 'react'

export function SectionHeading({
  index,
  title,
  aside,
  className = '',
}: {
  index?: string
  title: string
  aside?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-b border-edge/60 pb-3 ${className}`}
    >
      <div className="flex items-baseline gap-3">
        {index && (
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
            {index}
          </span>
        )}
        <h2 className="font-display text-[22px] font-bold uppercase tracking-tight text-bone">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  )
}
