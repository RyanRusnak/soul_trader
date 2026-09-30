export function Chip({
  active = false,
  onClick,
  children,
}: {
  active?: boolean
  onClick?: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-150 ${
        active
          ? 'bg-lime text-[#00211a] font-bold'
          : 'bg-panel-high/60 border border-edge text-muted hover:text-bone hover:border-zinc'
      }`}
    >
      {children}
    </button>
  )
}
