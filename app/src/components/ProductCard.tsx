import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { money } from '../lib/format'
import { useStore } from '../store/StoreContext'
import { Badge } from './ui/Badge'
import { StockBar } from './ui/StockBar'
import { TONE_TEXT } from './ui/tones'

export function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useStore()
  const scarcity = 100 - (product.stock / product.stockMax) * 100

  return (
    <article className="group relative flex flex-col border border-edge bg-carbon transition-colors duration-200 hover:border-lime/70">
      <div className="flex items-center justify-between border-b border-edge/60 bg-panel/40 px-4 py-2.5">
        <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${TONE_TEXT[product.tone]}`}>
          {product.tier} // {money(0)} CASH
        </span>
        <Badge tone={product.tone} led fast={product.tone === 'danger'}>
          {product.tierLabel}
        </Badge>
      </div>

      <Link to={`/product/${product.id}`} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-panel">
          <img
            src={product.cardImage}
            alt={`${product.name} — ${product.tagline}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* hover HUD: schematic readouts */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-obsidian/70 p-3 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.1em]">
              <span className="text-cyan">WT: {product.weight}</span>
              <span className="text-lime">AUTH SIG: {product.code}</span>
            </div>
            <div className="micro-grid absolute inset-0 opacity-40" aria-hidden />
            <div className="relative space-y-1 font-mono text-[10px] uppercase tracking-[0.1em]">
              <p className="text-zinc">VULNERABILITY INDEX</p>
              <StockBar pct={product.vulnerability} tone="amber" />
              <p className="text-zinc">CORPORATE DATA THIRST</p>
              <StockBar pct={product.dataThirst} tone="cyan" />
            </div>
          </div>
          <span className="absolute left-2 top-2 border border-edge/60 bg-obsidian/90 px-1.5 py-0.5 font-mono text-[10px] text-lime backdrop-blur-md">
            SPEC: {product.weight}
          </span>
          <span className="absolute bottom-2 right-2 border border-edge/60 bg-obsidian/90 px-1.5 py-0.5 font-mono text-[10px] text-cyan backdrop-blur-md">
            HUD: ACTIVE SYNC
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[22px] font-bold uppercase tracking-tight text-bone">
              <Link to={`/product/${product.id}`} className="hover:text-lime">
                {product.name}
              </Link>
            </h3>
            <span className="font-mono text-[10px] uppercase text-zinc">ID: {product.code}</span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            {product.tagline}
          </p>
        </div>

        <div className="space-y-1 border border-lime/30 bg-panel p-2.5">
          <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-zinc">
            PRICE / SURRENDER REQUIREMENT:
          </span>
          <p className={`font-mono text-[11px] font-bold ${TONE_TEXT[product.tone]}`}>
            {product.dataCost}
          </p>
        </div>

        <div className="space-y-1.5 border-t border-edge/60 pt-2.5">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="flex items-center gap-1.5 font-bold text-amber">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
              {product.stockLabel}
            </span>
            <span className="text-muted">{product.stockNote}</span>
          </div>
          <StockBar pct={scarcity} tone={product.stock <= 10 ? 'amber' : 'lime'} />
        </div>

        <Link
          to={`/product/${product.id}`}
          onClick={() => dispatch({ type: 'drawer/close' })}
          className="flex w-full items-center justify-center gap-2 bg-lime py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#00211a] transition-colors hover:bg-lime-bright"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.5 2.5 4.5-5" />
          </svg>
          CLAIM SNEAKERS
        </Link>
      </div>
    </article>
  )
}
