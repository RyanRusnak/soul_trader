import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TerminalLog } from '../components/TerminalLog'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { LedDot } from '../components/ui/LedDot'
import { mb, money, timeAgo } from '../lib/format'
import { downloadReceipt } from '../lib/receipt'
import { findOrder, useStore } from '../store/StoreContext'

const SYNDICATES = [
  { name: 'PARAMOUNT LIFE ACTUARIAL', buys: 'GAIT + HRV STREAMS', note: 'Adjusts your premiums while you sleep.' },
  { name: 'APEX / MADISON AVE CONSORTIUM', buys: 'QUERY + SOCIAL GRAPH', note: 'Turns your regrets into Q3 campaign copy.' },
  { name: 'VANGARDT LOGISTICS', buys: 'POSITION + VOICEPRINT', note: 'Knows your door code better than you do.' },
]

export function ConfirmationPage() {
  const { recordId } = useParams()
  const { orders } = useStore()
  const order = recordId ? findOrder(recordId, orders) : undefined
  const [copied, setCopied] = useState(false)
  const [contractOpen, setContractOpen] = useState(false)

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-danger">
          RECORD NOT FOUND // POSSIBLY ALREADY SYNDICATED
        </p>
        <Link to="/" className="mt-4 inline-block font-mono text-[11px] text-lime hover:underline">
          RETURN TO THE DROP
        </Link>
      </div>
    )
  }

  const tweetText = encodeURIComponent(
    `I just acquired ${order.items.length} pair(s) of SOLE TRADER telemetry footwear for $0.00. All I gave up was everything. Record #${order.recordId}`,
  )
  const referral = `${window.location.origin}${window.location.pathname}#/product/conduit-runner?ref=${order.recordId}`

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referral)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* hero */}
      <section className="border border-edge bg-carbon p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="lime" led fast>
            EXTRACTION COMPLETE
          </Badge>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc">
            {timeAgo(order.ts)}
          </span>
        </div>
        <h1 className="mt-4 font-display text-[32px] font-extrabold uppercase leading-none tracking-tight text-bone md:text-[44px]">
          ORDER <span className="text-lime">#{order.recordId}</span>
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-px border border-edge bg-edge sm:grid-cols-3">
          <div className="bg-panel p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc">CASH CHARGED</span>
            <p className="mt-1 font-display text-2xl font-extrabold text-bone">{money(0)}</p>
          </div>
          <div className="bg-panel p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc">DATA HARVESTED</span>
            <p className="mt-1 font-display text-2xl font-extrabold text-cyan">{mb(order.mbHarvested)}</p>
          </div>
          <div className="bg-panel p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc">10-YR LIFETIME VALUE</span>
            <p className="mt-1 font-display text-2xl font-extrabold text-amber">{money(order.ltv)}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 border border-amber/40 bg-amber/5 px-4 py-3">
          <LedDot tone="amber" fast />
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-amber">
            DRONE DISPATCH INITIATED // ETA 34 MIN // THE DRONE WILL ASK HOW YOUR DAY WAS
          </p>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* left: invoice */}
        <div className="space-y-6 lg:col-span-7">
          <section className="border border-edge bg-carbon p-5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
              ALLOCATED HARDWARE
            </span>
            <ul className="mt-4 space-y-4">
              {order.items.map((it, i) => (
                <li key={i} className="flex gap-4">
                  <img src={it.image} alt={it.name} className="h-20 w-24 border border-edge object-cover" />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-sm font-bold uppercase tracking-tight text-bone">{it.name}</p>
                      <span className="font-mono text-[10px] text-zinc">
                        SERIAL {it.name.split(' ')[1] ?? 'X'}-{order.recordId.slice(3, 8)}-{i}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                      US {it.size} × {it.qty} // TELEMETRY CORE ONLINE
                    </p>
                    <svg viewBox="0 0 200 24" className="mt-2 h-6 w-full text-lime" fill="none" aria-label="heartbeat sparkline">
                      <path
                        d="M0 12 H30 L36 4 L42 20 L48 12 H80 L86 8 L92 16 L98 12 H140 L146 2 L152 22 L158 12 H200"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-edge bg-carbon p-5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
              ITEMIZED EXTRACTION INVOICE
            </span>
            <ul className="mt-4 divide-y divide-edge/60 font-mono text-[11px] uppercase tracking-[0.08em]">
              {order.sold.map((s, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-2">
                  <span className="flex-1 text-muted">
                    <span className="mr-2 border border-edge px-1.5 py-0.5 text-[9px] text-cyan">{s.type}</span>
                    {s.label}
                  </span>
                  <span className="text-zinc">{mb(s.mb)}</span>
                  <span className="w-20 text-right text-lime">{money(s.value)}</span>
                </li>
              ))}
              <li className="flex items-center justify-between py-3 text-[12px] font-bold">
                <span className="text-bone">TOTAL RESALE VALUE</span>
                <span className="text-amber">{money(order.totalValue)}</span>
              </li>
            </ul>
            <div className="mt-3 border border-lime/30 bg-lime/5 p-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              MANUFACTURING COST: {money(33.48)} // RESALE: {money(order.totalValue)} //
              MARGIN: <span className="text-lime">+92%</span> // YOUR CUT: {money(0)}
            </div>
          </section>

          <section className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={() => downloadReceipt(order)}>
              DOWNLOAD RECEIPT (.JSON)
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setContractOpen((v) => !v)}>
              {contractOpen ? 'HIDE SURRENDER CONTRACT' : 'VIEW SURRENDER CONTRACT'}
            </Button>
          </section>
          {contractOpen && (
            <div className="border border-edge bg-obsidian p-5 font-mono text-[11px] leading-relaxed text-muted">
              <p className="text-bone">SURRENDER CONTRACT #{order.recordId}</p>
              <p className="mt-2">
                1. The UNDERSIGNED (hereafter "SUBJECT") transfers all rights, title,
                and interest in the listed data assets to SOLE TRADER CORP (hereafter
                "US, OBVIOUSLY").
              </p>
              <p className="mt-2">
                2. SUBJECT acknowledges that {mb(order.mbHarvested)} of personal
                telemetry has been received in good condition and immediately resold.
              </p>
              <p className="mt-2">
                3. The shoes are non-returnable. The data is non-returnable. SUBJECT
                is, in a legal sense, also non-returnable.
              </p>
              <p className="mt-2">
                4. Governing law: none. Venue: wherever the servers are. You will not
                be told where the servers are.
              </p>
              <p className="mt-3 text-lime">SIGNED AUTOMATICALLY ON YOUR BEHALF // {new Date(order.ts).toISOString()}</p>
            </div>
          )}
        </div>

        {/* right: syndicates + terminal + share */}
        <div className="space-y-6 lg:col-span-5">
          <section className="border border-edge bg-carbon p-5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
              SYNDICATE BUYERS (NOTIFIED)
            </span>
            <ul className="mt-4 space-y-3">
              {SYNDICATES.map((s) => (
                <li key={s.name} className="border border-edge/60 bg-panel/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-bone">{s.name}</span>
                    <LedDot tone="lime" />
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-cyan">BUYS: {s.buys}</p>
                  <p className="mt-1 text-xs text-muted">{s.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
              LIVE EXTRACTION FEED
            </span>
            <TerminalLog className="h-56" />
          </section>

          <section className="border border-edge bg-carbon p-5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
              MANDATORY WORD OF MOUTH
            </span>
            <p className="mt-3 border border-edge bg-obsidian p-3 text-sm text-muted">
              "I just acquired {order.items.length} pair(s) of SOLE TRADER telemetry
              footwear for $0.00. All I gave up was everything. Record #{order.recordId}"
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${tweetText}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-bone py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-obsidian transition-colors hover:bg-cyan"
              >
                TELECAST CONFESSION
              </a>
              <Button variant="secondary" onClick={copyReferral}>
                {copied ? 'REFERRAL LINK COPIED // THEY WILL THANK YOU EVENTUALLY' : 'COPY REFERRAL LINK'}
              </Button>
            </div>
            <div className="mt-4 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em]">
              <Link to="/" className="text-zinc hover:text-lime">← BACK TO THE DROP</Link>
              <Link to="/legal" className="text-zinc hover:text-lime">READ WHAT YOU SIGNED →</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
