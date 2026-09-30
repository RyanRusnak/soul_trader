import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { LedDot } from '../components/ui/LedDot'
import { StockBar } from '../components/ui/StockBar'
import { TONE_TEXT } from '../components/ui/tones'
import { getProduct, SIZES } from '../data/products'
import { money } from '../lib/format'
import { useStore } from '../store/StoreContext'

function CadSchematic() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full text-cyan" fill="none" aria-label="CAD schematic">
      <g stroke="currentColor" strokeWidth="1" opacity="0.9">
        <path d="M60 210 C 70 160, 110 120, 170 110 C 210 104, 240 90, 268 74 L 300 96 C 330 116, 348 150, 352 190 L 352 210 Z" />
        <path d="M60 210 L 352 210 L 352 226 L 60 226 Z" />
        <path d="M170 110 L 176 210 M220 100 L 228 210 M268 74 L 280 210" strokeDasharray="3 4" opacity="0.6" />
        <path d="M40 240 L 372 240" opacity="0.5" />
        <path d="M40 236 L 40 244 M372 236 L 372 244" opacity="0.5" />
      </g>
      <g fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="9">
        <text x="180" y="252">340.0 MM CHASSIS</text>
        <text x="60" y="90">COLLAR Δ 88MM</text>
        <text x="250" y="60">ANTENNA ARRAY // 12 ELEMENT</text>
        <text x="300" y="270">SOLE DROP 8MM // NON-REMOVABLE COIL</text>
      </g>
      <g stroke="currentColor" strokeWidth="0.75" opacity="0.35">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={40 + i * 28} y1="20" x2={40 + i * 28} y2="280" />
        ))}
      </g>
    </svg>
  )
}

export function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch } = useStore()
  const product = id ? getProduct(id) : undefined

  const [thumb, setThumb] = useState(0)
  const [hotspot, setHotspot] = useState<string | null>(null)
  const [checked, setChecked] = useState<string[]>([])
  const [size, setSize] = useState<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'intercept' | 'granted'>('idle')
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)
  const [attention, setAttention] = useState(false)

  const allChecked = product ? product.forfeits.every((f) => checked.includes(f.id)) : false

  useEffect(() => {
    if (allChecked && size !== null) setAttention(false)
  }, [allChecked, size])

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-danger">
          HARDWARE NOT FOUND IN ALLOCATION TABLE
        </p>
        <Link to="/" className="mt-4 inline-block font-mono text-[11px] text-lime hover:underline">
          RETURN TO THE DROP
        </Link>
      </div>
    )
  }

  const unsigned = product.forfeits.filter((f) => !checked.includes(f.id)).length
  const canClaim = allChecked && size !== null && phase === 'idle'
  const activeHotspot = product.hotspots.find((h) => h.id === hotspot) ?? null
  const activeImage = product.gallery[thumb]
  const scarcity = 100 - (product.stock / product.stockMax) * 100

  const toggleForfeit = (fid: string) =>
    setChecked((prev) =>
      prev.includes(fid) ? prev.filter((x) => x !== fid) : [...prev, fid],
    )

  const claim = () => {
    if (phase !== 'idle') return
    if (!allChecked || size === null) {
      setAttention(true)
      return
    }
    setPhase('intercept')
    window.setTimeout(() => {
      setPhase('granted')
      dispatch({
        type: 'cart/add',
        item: { productId: product.id, size, qty: 1, forfeits: [...checked] },
      })
      window.setTimeout(() => {
        dispatch({ type: 'drawer/open' })
        setPhase('idle')
      }, 900)
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-lime">THE DROP</Link>
        <span>/</span>
        <span className="text-muted">{product.categoryLabel}</span>
        <span>/</span>
        <span className="text-bone">EDITION #{product.code.slice(2)}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* media column */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden border border-edge bg-carbon">
            <div className="micro-grid absolute inset-0 opacity-40" aria-hidden />
            {activeImage.kind === 'cad' ? (
              <div className="absolute inset-0 bg-obsidian p-6">
                <CadSchematic />
              </div>
            ) : (
              <img
                src={activeImage.src}
                alt={`${product.name} — ${activeImage.label}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {/* hotspots */}
            {activeImage.kind !== 'cad' &&
              product.hotspots.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHotspot(hotspot === h.id ? null : h.id)}
                  aria-label={h.label}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center border font-mono text-[10px] font-bold transition-colors ${
                      hotspot === h.id
                        ? 'border-cyan bg-cyan text-obsidian'
                        : 'border-cyan/70 bg-obsidian/70 text-cyan backdrop-blur-sm hover:bg-cyan hover:text-obsidian'
                    }`}
                  >
                    +
                  </span>
                  <span className="pointer-events-none absolute left-8 top-0 hidden whitespace-nowrap border border-edge bg-obsidian/95 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-cyan group-hover:block">
                    {h.label}
                  </span>
                </button>
              ))}
            <span className="absolute left-2 top-2 border border-edge/60 bg-obsidian/90 px-2 py-0.5 font-mono text-[10px] text-lime backdrop-blur-md">
              VIEW: {activeImage.label}
            </span>
            <span className="absolute bottom-2 right-2 border border-edge/60 bg-obsidian/90 px-2 py-0.5 font-mono text-[10px] text-cyan backdrop-blur-md">
              {product.weight}
            </span>
          </div>

          {/* hotspot detail */}
          {activeHotspot && (
            <div className="border border-cyan/40 bg-cyan/5 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">
                  {activeHotspot.label}
                </span>
                <span className="font-mono text-[10px] text-zinc">{activeHotspot.readout}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{activeHotspot.detail}</p>
            </div>
          )}

          {/* gallery */}
          <div className="grid grid-cols-4 gap-2">
            {product.gallery.map((g, i) => (
              <button
                key={g.label}
                type="button"
                onClick={() => setThumb(i)}
                className={`relative aspect-[4/3] overflow-hidden border transition-colors ${
                  thumb === i ? 'border-lime' : 'border-edge hover:border-zinc'
                }`}
              >
                {g.kind === 'cad' ? (
                  <span className="flex h-full w-full items-center justify-center bg-obsidian font-mono text-[9px] uppercase tracking-[0.12em] text-cyan">
                    CAD DATA 3D
                  </span>
                ) : (
                  <img src={g.src} alt={g.label} className="h-full w-full object-cover" />
                )}
                {thumb === i && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-lime" />}
              </button>
            ))}
          </div>
        </div>

        {/* purchase column */}
        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={product.tone} led>
              LIMITED RELEASE
            </Badge>
            <Badge tone="lime">BATCH 004</Badge>
            <Badge tone={product.tone}>{product.tier}</Badge>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h1 className="font-display text-[32px] font-extrabold uppercase leading-none tracking-tight text-bone md:text-[40px]">
                {product.name}
              </h1>
              <span className="font-mono text-[11px] uppercase text-zinc">ID: {product.code}</span>
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {product.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>
          </div>

          <div className="border border-lime/30 bg-panel p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc">
                CASH PRICE
              </span>
              <span className="font-display text-3xl font-extrabold text-bone">{money(0)}</span>
            </div>
            <p className={`mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] ${TONE_TEXT[product.tone]}`}>
              REQUIRES: {product.dataCost.replace('$0.00 CASH // ', '')}
            </p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-zinc">
                <span>DATA EXCHANGE RATE</span>
                <span className="text-lime">96% APPROVED</span>
              </div>
              <StockBar pct={96} tone="lime" />
            </div>
          </div>

          {/* forfeiture protocols */}
          <div className="border border-edge bg-carbon p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-amber">
                MANDATORY DATA FORFEITURE PROTOCOLS
              </span>
              <span className="font-mono text-[10px] text-zinc">
                {checked.length}/{product.forfeits.length}
              </span>
            </div>
            <ul className="space-y-2">
              {product.forfeits.map((f) => {
                const on = checked.includes(f.id)
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => toggleForfeit(f.id)}
                      aria-pressed={on}
                      className={`flex w-full items-start gap-3 border p-2.5 text-left transition-colors ${
                        on ? 'border-lime/70 bg-lime/10' : 'border-edge/60 bg-panel/50 hover:border-zinc'
                      } ${attention && !on ? 'animate-consent-pulse' : ''}`}
                    >
                      <span
                        aria-hidden
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                          on ? 'border-lime bg-lime' : 'border-zinc bg-obsidian'
                        }`}
                      >
                        {on && (
                          <svg viewBox="0 0 12 12" className="h-3 w-3 text-obsidian" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M2 6.5l2.5 2.5L10 3" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1">
                        <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-bone">
                          {f.label}
                        </span>
                        <span className="block text-xs leading-relaxed text-muted">{f.detail}</span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[10px] text-lime">+{f.mb}MB</span>
                        <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${on ? 'text-lime' : 'text-zinc'}`}>
                          {on ? 'SIGNED' : 'UNSIGNED'}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {!allChecked && (
              <p className={`mt-2 font-mono text-[10px] uppercase tracking-[0.12em] ${attention ? 'text-lime' : 'text-amber'}`}>
                {attention
                  ? `CONSENT INCOMPLETE // ${unsigned} PROTOCOL${unsigned === 1 ? '' : 'S'} UNSIGNED — PULSING ABOVE`
                  : 'ALL PROTOCOLS MUST BE SIGNED TO PROCEED'}
              </p>
            )}
          </div>

          {/* sizes */}
          <div>
            <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone">
              SELECT SIZE (US)
            </span>
            <div className="grid grid-cols-6 gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`border py-2 font-mono text-[12px] font-semibold transition-colors ${
                    size === s
                      ? 'border-lime bg-lime text-[#00211a]'
                      : 'border-edge bg-panel text-muted hover:border-zinc hover:text-bone'
                  } ${attention && size === null ? 'animate-consent-pulse' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {size === null && (
              <p className={`mt-2 font-mono text-[10px] uppercase tracking-[0.12em] ${attention ? 'text-lime' : 'text-amber'}`}>
                {attention ? 'SIZE UNSET — PULSING ABOVE' : 'SIZE REQUIRED FOR ALLOCATION'}
              </p>
            )}
          </div>

          {/* stock */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="flex items-center gap-1.5 font-bold text-amber">
                <LedDot tone="amber" fast />
                {product.stockLabel}
              </span>
              <span className="text-muted">{product.stockNote}</span>
            </div>
            <StockBar pct={scarcity} tone={product.stock <= 10 ? 'amber' : 'lime'} />
          </div>

          {/* claim */}
          <Button
            className="w-full py-4"
            disabled={phase !== 'idle'}
            onClick={claim}
            aria-live="polite"
          >
            {phase === 'intercept' && (
              <>
                <span className="h-3 w-3 animate-spin border border-[#00211a] border-t-transparent" />
                INTERCEPTING ASSETS...
              </>
            )}
            {phase === 'granted' && <>SURRENDER GRANTED // ALLOCATED</>}
            {phase === 'idle' &&
              (canClaim
                ? 'EXECUTE SURRENDER // CLAIM'
                : attention
                  ? 'CLAIM BLOCKED // REVIEW PULSING FIELDS'
                  : 'COMPLETE PROTOCOLS TO CLAIM')}
          </Button>

          {/* accordions */}
          <div className="divide-y divide-edge/60 border border-edge">
            {product.accordions.map((a, i) => (
              <div key={a.title}>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                  aria-expanded={openAccordion === i}
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone hover:text-lime"
                >
                  {a.title}
                  <span className="text-zinc">{openAccordion === i ? '−' : '+'}</span>
                </button>
                {openAccordion === i && (
                  <p className="px-4 pb-4 text-sm leading-relaxed text-muted">{a.body}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {product.specs.map((s) => (
              <div key={s.label} className="border border-edge/60 bg-panel/50 px-3 py-2">
                <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-zinc">
                  {s.label}
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-cyan">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="self-start font-mono text-[10px] uppercase tracking-[0.16em] text-zinc hover:text-lime"
          >
            ← RETURN TO THE DROP
          </button>
        </div>
      </div>
    </div>
  )
}
