import { useMemo, useState } from 'react'
import { DropCountdown } from '../components/DropCountdown'
import { ProductCard } from '../components/ProductCard'
import { ConduitHero3D } from '../components/hero3d/ConduitHero3D'
import { Chip } from '../components/ui/Chip'
import { LedDot } from '../components/ui/LedDot'
import { SectionHeading } from '../components/ui/SectionHeading'
import {
  CATEGORIES,
  PRODUCTS,
  SORTS,
  type Category,
  type SortKey,
} from '../data/products'
import { STICKY_TOP } from '../components/layout/Header'

export function CatalogPage() {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('vulnerability')

  const products = useMemo(() => {
    const filtered =
      category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)
    const sorted = [...filtered]
    if (sort === 'vulnerability') sorted.sort((a, b) => b.vulnerability - a.vulnerability)
    if (sort === 'thirst') sorted.sort((a, b) => b.dataThirst - a.dataThirst)
    if (sort === 'scarcity') sorted.sort((a, b) => a.stock - b.stock)
    return sorted
  }, [category, sort])

  return (
    <div className="flex flex-col">
      {/* Manifesto band */}
      <section className="relative border-b border-edge/60 bg-panel/30 px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <LedDot tone="lime" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
                MANIFESTO // CELLULAR HARDWARE
              </span>
            </div>
            <h2 className="mt-1 font-display text-[28px] font-bold uppercase leading-tight tracking-tight text-bone md:text-[44px]">
              INTRODUCING <span className="text-lime">CONDUIT</span>
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-relaxed text-muted">
            The first shoe ever made that streams your data
            directly to the cloud without the help of a smartphone. Simply live
            your life day to day and let us do the tracking. Whether you are at
            home, the grocery store, or on an evening run, Conduit is
            with you—listening, recording, and learning. Unencumbered mobility.
            Total passive synchronization.
          </p>
          <div className="relative overflow-hidden border border-edge bg-obsidian shadow-2xl">
            <div className="relative flex aspect-[16/9] max-h-[520px] w-full items-center justify-center overflow-hidden md:aspect-[21/9]">
              <ConduitHero3D
                fallbackSrc={`${import.meta.env.BASE_URL}images/hero-conduit.jpg`}
                alt="Anonymous Conduit smart sneaker with emerald telemetry accent and biometric carbon sole"
              />
              <div className="absolute left-2 top-2 flex items-center gap-2 border border-edge/60 bg-obsidian/90 px-2 py-0.5 backdrop-blur-md">
                <LedDot tone="lime" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-lime">
                  TELEMETRY CORE // ONLINE
                </span>
              </div>
              <div className="absolute bottom-2 right-2 border border-edge/60 bg-obsidian/90 px-2 py-0.5 backdrop-blur-md">
                <span className="font-mono text-[10px] tracking-[0.12em] text-cyan">
                  HARDWARE SPEC // BIOMETRIC CARBON SOLE
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 border-t border-edge/60 pt-4 md:grid-cols-3">
            {[
              {
                n: '01',
                t: 'ZERO PHONE TETHERING',
                c: 'text-lime',
                b: 'Integrated 5G IoT modem handles autonomous uplink without requiring a paired handset.',
              },
              {
                n: '02',
                t: 'OMNIPRESENT AMBIENT LOGGING',
                c: 'text-cyan',
                b: 'Subtle 24/7 geolocation captures sub-meter positional coordinates at all hours.',
              },
              {
                n: '03',
                t: '$0.00 MONETARY COST',
                c: 'text-amber',
                b: 'Zero fiat pricing. Hardware manufacturing is 100% funded by your continuous data stream.',
              },
            ].map((f) => (
              <div key={f.n} className="flex flex-col gap-1 border border-edge/60 bg-panel p-4">
                <span className={`font-mono text-[11px] font-bold ${f.c}`}>
                  {f.n} // {f.t}
                </span>
                <span className="text-sm text-muted">{f.b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Display hero */}
      <section className="relative overflow-hidden border-b border-edge/60 bg-obsidian px-4 py-16 md:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]"
          aria-hidden
        />
        <div className="micro-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-5xl flex-col gap-4">
            <h1 className="font-display text-[40px] font-extrabold uppercase leading-none tracking-tighter text-bone md:text-[72px] md:leading-[1.05]">
              CASH IS OBSOLETE.
              <br />
              <span className="bg-gradient-to-r from-lime via-lime-bright to-cyan bg-clip-text text-transparent">
                WE JUST WANT
              </span>
              <br />
              YOUR DATA.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              The world's first luxury performance footwear with embedded
              real-time GPS telemetry soles. $0.00 cash forever in exchange for
              permanent location tracking.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc">
              NEXT DROP WINDOW // BATCH 05.0
            </span>
            <DropCountdown />
          </div>
        </div>
      </section>

      {/* Filter & sort HUD */}
      <section className={`sticky z-40 border-b border-edge bg-obsidian/95 px-4 py-3 backdrop-blur-md md:px-8 ${STICKY_TOP}`}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </Chip>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2 self-end lg:self-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc">
              INDEX:
            </span>
            <div className="relative border border-edge bg-obsidian">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort catalog"
                className="appearance-none bg-transparent py-1.5 pl-3 pr-8 font-mono text-[11px] uppercase tracking-[0.08em] text-lime focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-carbon text-bone">
                    {s.label}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog grid */}
      <section className="w-full px-4 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <SectionHeading
            title="ACTIVE HARDWARE ALLOCATIONS"
            aside={
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc">
                [ BATCH // 04.9 ] // {products.length} UNITS INDEXED
              </span>
            }
          />
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="border border-edge bg-panel p-8 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-zinc">
              NO SILHOUETTES MATCH THIS SURVEILLANCE PROFILE
            </p>
          )}
        </div>
      </section>

      {/* Satirical trust banner */}
      <section className="w-full bg-carbon px-4 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border border-edge bg-panel/30 p-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="mt-1 shrink-0 border border-danger/40 bg-danger/10 p-2.5 text-danger">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="max-w-3xl space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-danger">
                CERTIFIED OVER-EXPOSURE GUARANTEE
              </span>
              <p className="text-base font-medium leading-relaxed text-bone">
                "100% Free Footwear. Zero Cash Charged. Zero Chargebacks.
                Permanent Real-Time GPS Tracking."
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc">
                <span>• ZERO CHARGEBACKS</span>
                <span>• 100% UNENCRYPTED CORPORATE ACCESS</span>
                <span>• UNRESTRICTED DATA SYNDICATION</span>
              </div>
            </div>
          </div>
          <div className="flex w-full shrink-0 flex-col items-start gap-1 border-t border-edge/60 pt-4 md:w-auto md:items-end md:border-t-0 md:pt-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              AUDITED BY ZERO-PRIVACY LABS
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px] text-lime">
              <LedDot tone="lime" />
              EXPOSURE PROTOCOL ACTIVE
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
