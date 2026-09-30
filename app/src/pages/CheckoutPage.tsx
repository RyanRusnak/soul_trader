import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DignityMeter } from '../components/DignityMeter'
import { Button } from '../components/ui/Button'
import { LedDot } from '../components/ui/LedDot'
import { getProduct } from '../data/products'
import { money } from '../lib/format'
import {
  makeRecordId,
  useStore,
  type Order,
  type SoldItem,
} from '../store/StoreContext'

const STEPS = [
  { n: '01', label: 'IDENTITY & PSYCH' },
  { n: '02', label: 'QUERY HARVEST' },
  { n: '03', label: 'SOCIAL GRAPH' },
  { n: '04', label: 'ALLOCATION' },
]

const QUERY_VALUES = [72, 38.5, 69.5]
const CONFESSION_MIN = 140

export function CheckoutPage() {
  const { cart, draft, dispatch, orders } = useStore()
  const navigate = useNavigate()
  const [recordId] = useState(makeRecordId)
  const [contactName, setContactName] = useState('')
  const [contactRelation, setContactRelation] = useState('')
  const [committing, setCommitting] = useState(false)

  const step = draft.step

  const items = useMemo(
    () =>
      cart
        .map((c) => ({ cart: c, product: getProduct(c.productId) }))
        .filter((x) => x.product),
    [cart],
  )

  const queryEntries = draft.queries
    .map((text, i) => ({ text: text.trim(), value: QUERY_VALUES[i] }))
    .filter((q) => q.text.length > 0)

  const itemValue = items.reduce(
    (n, x) => n + (100 + (x.product?.dataThirst ?? 0)) * x.cart.qty,
    0,
  )
  const totalValue =
    itemValue +
    186.5 +
    queryEntries.reduce((n, q) => n + q.value, 0) +
    draft.contacts.length * 60 +
    (draft.remMic ? 90 : 0) +
    (draft.courierConsent ? 25 : 0)

  const mbHarvested =
    draft.confession.length * 0.004 +
    queryEntries.length * 0.6 +
    (draft.remMic ? 2.4 : 0) +
    draft.contacts.length * 0.3 +
    (draft.courierConsent ? 0.2 : 0) +
    items.reduce((n, x) => n + 1.2 * x.cart.qty, 0)

  const stepValid = [
    draft.name.trim().length > 0 && draft.confession.trim().length >= CONFESSION_MIN,
    queryEntries.length > 0,
    draft.courierConsent,
    true,
  ][step]

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-amber">
          NO HARDWARE PENDING ALLOCATION
        </p>
        <p className="mt-3 text-sm text-muted">
          The surrender protocol requires at least one pair of shoes to surrender for.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-lime px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#00211a] hover:bg-lime-bright"
        >
          RETURN TO THE DROP
        </Link>
      </div>
    )
  }

  const set = (patch: Partial<typeof draft>) => dispatch({ type: 'draft/set', draft: patch })

  const moveBetrayal = (index: number, dir: -1 | 1) => {
    const next = [...draft.betrayals]
    const j = index + dir
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    set({ betrayals: next })
  }

  const addContact = () => {
    if (!contactName.trim()) return
    set({
      contacts: [
        ...draft.contacts,
        { name: contactName.trim(), relation: contactRelation.trim() || 'UNDECLARED' },
      ],
    })
    setContactName('')
    setContactRelation('')
  }

  const commit = () => {
    if (committing) return
    setCommitting(true)
    const sold: SoldItem[] = [
      {
        type: 'CONFESSION',
        label: 'WRITTEN DISILLUSIONMENT (SIGNED)',
        mb: Number((draft.confession.length * 0.004).toFixed(2)),
        value: 186.5,
      },
      ...queryEntries.map((q) => ({
        type: 'QUERY' as const,
        label: `INCOGNITO QUERY: "${q.text.toUpperCase().slice(0, 48)}"`,
        mb: 0.6,
        value: q.value,
      })),
      ...(draft.remMic
        ? [{ type: 'AUDIO' as const, label: 'REM SLEEP AUDIO + HRV STREAM', mb: 2.4, value: 90 }]
        : []),
      ...draft.contacts.map((c) => ({
        type: 'CONTACT' as const,
        label: `SOCIAL GRAPH NODE: ${c.name.toUpperCase()} (${c.relation.toUpperCase()})`,
        mb: 0.3,
        value: 60,
      })),
      ...(draft.courierConsent
        ? [{ type: 'VOICEPRINT' as const, label: 'COURIER INTERROGATION CONSENT', mb: 0.2, value: 25 }]
        : []),
      ...items.flatMap((x) =>
        x.product
          ? [
              {
                type: 'GPS' as const,
                label: `${x.product.name} // CONTINUOUS POSITION FEED`,
                mb: Number((1.2 * x.cart.qty).toFixed(2)),
                value: (100 + x.product.dataThirst) * x.cart.qty,
              },
            ]
          : [],
      ),
    ]

    const order: Order = {
      recordId,
      ts: Date.now(),
      items: items.map((x) => ({
        productId: x.cart.productId,
        name: x.product?.name ?? x.cart.productId,
        size: x.cart.size,
        qty: x.cart.qty,
        image: x.product?.cardImage ?? '',
      })),
      identity: { name: draft.name.trim(), confession: draft.confession.trim() },
      queries: queryEntries,
      remMic: draft.remMic,
      contacts: draft.contacts,
      courierConsent: draft.courierConsent,
      sold,
      totalValue: Number(totalValue.toFixed(2)),
      mbHarvested: Number(mbHarvested.toFixed(2)),
      ltv: Math.round((totalValue * 18.4 + mbHarvested * 720) / 10) * 10,
    }

    window.setTimeout(() => {
      dispatch({ type: 'order/commit', order })
      navigate(`/confirmation/${recordId}`)
    }, 1600)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1 className="font-display text-[28px] font-extrabold uppercase tracking-tight text-bone md:text-[40px]">
        DATA SURRENDER <span className="text-lime">CHECKOUT</span>
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Four steps stand between you and free footwear. Each one is mandatory.
        None of them are reversible.
      </p>

      {/* wizard strip */}
      <ol className="mt-6 grid grid-cols-2 gap-px border border-edge bg-edge md:grid-cols-4">
        {STEPS.map((s, i) => {
          const state = i === step ? 'active' : i < step ? 'done' : 'locked'
          return (
            <li key={s.n}>
              <button
                type="button"
                disabled={i > step}
                onClick={() => set({ step: i })}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                  state === 'active'
                    ? 'bg-lime text-[#00211a]'
                    : state === 'done'
                      ? 'bg-carbon text-lime hover:bg-panel'
                      : 'bg-carbon text-zinc'
                }`}
              >
                <span className="font-mono text-[12px] font-bold">{s.n}</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                  {s.label}
                </span>
                {state === 'done' && <span className="ml-auto font-mono text-[10px]">✓</span>}
                {state === 'active' && <LedDot tone="amber" fast className="ml-auto !bg-[#00211a]" />}
              </button>
            </li>
          )
        })}
      </ol>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* step body */}
        <div className="lg:col-span-8">
          {step === 0 && (
            <section className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone">
                  DECLARED NAME (LEGAL OR OTHERWISE)
                </label>
                <input
                  id="name"
                  value={draft.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="e.g. SUBJECT 8841"
                  className="w-full border border-edge bg-panel px-4 py-3 font-mono text-[12px] text-bone placeholder:text-zinc focus:border-cyan focus:outline-none"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="confession" className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone">
                    STATEMENT OF DISILLUSIONMENT
                  </label>
                  <span
                    className={`font-mono text-[10px] ${
                      draft.confession.trim().length >= CONFESSION_MIN ? 'text-lime' : 'text-amber'
                    }`}
                  >
                    {draft.confession.trim().length}/{CONFESSION_MIN} MIN
                  </span>
                </div>
                <textarea
                  id="confession"
                  rows={6}
                  value={draft.confession}
                  onChange={(e) => set({ confession: e.target.value })}
                  placeholder="Describe, in detail, why you deserve free shoes and what you are willing to forget in exchange..."
                  className="w-full resize-y border border-edge bg-panel px-4 py-3 text-sm leading-relaxed text-bone placeholder:text-zinc focus:border-cyan focus:outline-none"
                />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc">
                  MINIMUM 140 CHARACTERS // ANALYZED FOR SENTIMENT, REGRET, AND MARKET VALUE
                </p>
              </div>
              <div>
                <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone">
                  BETRAYAL MATRIX (RANK BY YIELD)
                </span>
                <ul className="space-y-1.5">
                  {draft.betrayals.map((b, i) => (
                    <li
                      key={b}
                      className="flex items-center justify-between border border-edge/60 bg-panel/50 px-3 py-2"
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-lime">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-bone">{b}</span>
                      </span>
                      <span className="flex gap-1">
                        <button
                          type="button"
                          aria-label={`Move ${b} up`}
                          onClick={() => moveBetrayal(i, -1)}
                          className="border border-edge px-2 py-0.5 font-mono text-[10px] text-muted hover:text-bone"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${b} down`}
                          onClick={() => moveBetrayal(i, 1)}
                          className="border border-edge px-2 py-0.5 font-mono text-[10px] text-muted hover:text-bone"
                        >
                          ↓
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc">
                  RANKING AFFECTS AUCTION ORDER. CHOOSE WISELY. THEY WON'T.
                </p>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-6">
              <p className="text-sm text-muted">
                Enter three searches you performed in private mode. Valuation is
                automated and non-negotiable.
              </p>
              {draft.queries.map((q, i) => (
                <div key={i}>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor={`q-${i}`} className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone">
                      INCOGNITO QUERY {String(i + 1).padStart(2, '0')}
                    </label>
                    <span className="border border-lime/40 bg-lime/10 px-2 py-0.5 font-mono text-[10px] text-lime">
                      VALUED: {money(QUERY_VALUES[i])}
                    </span>
                  </div>
                  <input
                    id={`q-${i}`}
                    value={q}
                    onChange={(e) => {
                      const next = [...draft.queries] as [string, string, string]
                      next[i] = e.target.value
                      set({ queries: next })
                    }}
                    placeholder={
                      ['am i being tracked by my shoes', 'how to delete myself from the internet', 'is my gait normal'][i]
                    }
                    className="w-full border border-edge bg-panel px-4 py-3 font-mono text-[12px] text-bone placeholder:text-zinc focus:border-cyan focus:outline-none"
                  />
                </div>
              ))}
              <label className="flex cursor-pointer items-center justify-between border border-edge bg-panel/50 px-4 py-3">
                <span>
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone">
                    ENABLE REM MICROPHONE
                  </span>
                  <span className="block text-xs text-muted">
                    Overnight audio + heart-rate variability. Adds 2.4 MB and $90.00 to your file.
                  </span>
                </span>
                <span className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={draft.remMic}
                    onChange={(e) => set({ remMic: e.target.checked })}
                    className="peer sr-only"
                  />
                  <span className="h-6 w-12 border border-edge bg-obsidian transition-colors peer-checked:border-lime peer-checked:bg-lime/20" />
                  <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 bg-zinc transition-transform peer-checked:translate-x-6 peer-checked:bg-lime" />
                </span>
              </label>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <p className="text-sm text-muted">
                Each surrendered contact earns $60.00 of credit toward shoes you
                are already getting for free.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {draft.contacts.map((c, i) => (
                  <div key={`${c.name}-${i}`} className="border border-cyan/40 bg-cyan/5 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-bone">
                          {c.name}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan">
                          {c.relation}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-lime">+{money(60)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        set({ contacts: draft.contacts.filter((_, j) => j !== i) })
                      }
                      className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-danger"
                    >
                      WITHDRAW CONSENT
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 border border-edge bg-panel/40 p-4 sm:flex-row">
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="CONTACT NAME"
                  aria-label="Contact name"
                  className="flex-1 border border-edge bg-obsidian px-3 py-2 font-mono text-[11px] uppercase text-bone placeholder:text-zinc focus:border-cyan focus:outline-none"
                />
                <input
                  value={contactRelation}
                  onChange={(e) => setContactRelation(e.target.value)}
                  placeholder="RELATION (e.g. EX-COWORKER)"
                  aria-label="Contact relation"
                  className="flex-1 border border-edge bg-obsidian px-3 py-2 font-mono text-[11px] uppercase text-bone placeholder:text-zinc focus:border-cyan focus:outline-none"
                />
                <Button variant="secondary" onClick={addContact} disabled={!contactName.trim()}>
                  ADD NODE +{money(60)}
                </Button>
              </div>
              <label className="flex cursor-pointer items-start gap-3 border border-amber/40 bg-amber/5 p-4">
                <input
                  type="checkbox"
                  checked={draft.courierConsent}
                  onChange={(e) => set({ courierConsent: e.target.checked })}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                    draft.courierConsent ? 'border-amber bg-amber' : 'border-zinc bg-obsidian'
                  }`}
                >
                  {draft.courierConsent && (
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-obsidian" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M2 6.5l2.5 2.5L10 3" />
                    </svg>
                  )}
                </span>
                <span>
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-amber">
                    COURIER INTERROGATION CONSENT
                  </span>
                  <span className="block text-xs leading-relaxed text-muted">
                    I authorize the delivery courier to ask me one (1) personal
                    question at the door, and I will answer it truthfully.
                  </span>
                </span>
              </label>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-5">
              <div className="border border-edge bg-panel/40 p-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone">
                  FINAL ALLOCATION REVIEW
                </span>
                <ul className="mt-3 space-y-2 font-mono text-[11px] uppercase tracking-[0.08em]">
                  <li className="flex justify-between text-muted">
                    <span>DECLARED NAME</span>
                    <span className="text-bone">{draft.name || '—'}</span>
                  </li>
                  <li className="flex justify-between text-muted">
                    <span>CONFESSION</span>
                    <span className="text-bone">{draft.confession.trim().length} CHARS</span>
                  </li>
                  <li className="flex justify-between text-muted">
                    <span>QUORIES SOLD</span>
                    <span className="text-bone">{queryEntries.length}</span>
                  </li>
                  <li className="flex justify-between text-muted">
                    <span>REM MICROPHONE</span>
                    <span className={draft.remMic ? 'text-amber' : 'text-bone'}>
                      {draft.remMic ? 'ARMED' : 'OFF'}
                    </span>
                  </li>
                  <li className="flex justify-between text-muted">
                    <span>SOCIAL NODES</span>
                    <span className="text-bone">{draft.contacts.length}</span>
                  </li>
                  <li className="flex justify-between text-muted">
                    <span>COURIER CONSENT</span>
                    <span className={draft.courierConsent ? 'text-amber' : 'text-bone'}>
                      {draft.courierConsent ? 'GRANTED' : 'WITHHELD'}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex items-start gap-3 border border-danger/40 bg-danger/5 p-4">
                <LedDot tone="danger" fast />
                <p className="text-sm leading-relaxed text-muted">
                  Executing the surrender is <span className="text-danger">irreversible</span>.
                  Your data will be syndicated within 90 seconds of confirmation.
                  There is no undo, no appeal, and no customer service.
                </p>
              </div>
              <Button className="w-full py-4" disabled={committing} onClick={commit}>
                {committing ? (
                  <>
                    <span className="h-3 w-3 animate-spin border border-[#00211a] border-t-transparent" />
                    EXECUTING SURRENDER...
                  </>
                ) : (
                  `EXECUTE SURRENDER // CLAIM SNEAKERS (${money(0)})`
                )}
              </Button>
            </section>
          )}

          {/* nav */}
          {step < 3 && (
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="secondary"
                disabled={step === 0}
                onClick={() => set({ step: step - 1 })}
              >
                ← BACK
              </Button>
              <Button disabled={!stepValid} onClick={() => set({ step: step + 1 })}>
                NEXT // {STEPS[step + 1].label} →
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="mt-8">
              <Button variant="secondary" onClick={() => set({ step: 2 })}>
                ← BACK
              </Button>
            </div>
          )}
        </div>

        {/* sticky rail */}
        <aside className="lg:col-span-4">
          <div className="space-y-5 border border-edge bg-carbon p-5 lg:sticky lg:top-[108px]">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
              ALLOCATION SUMMARY
            </span>
            <ul className="space-y-3">
              {items.map((x) =>
                x.product ? (
                  <li key={`${x.cart.productId}-${x.cart.size}`} className="flex gap-3">
                    <img src={x.product.cardImage} alt={x.product.name} className="h-14 w-16 border border-edge object-cover" />
                    <div className="flex-1">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-bone">
                        {x.product.name}
                      </p>
                      <p className="font-mono text-[10px] uppercase text-zinc">
                        US {x.cart.size} × {x.cart.qty}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-lime">{money(0)}</span>
                  </li>
                ) : null,
              )}
            </ul>
            <div className="space-y-1 border-t border-edge/60 pt-4 font-mono text-[11px] uppercase tracking-[0.08em]">
              <div className="flex justify-between text-muted">
                <span>AGGREGATE DATA VALUE</span>
                <span className="text-bone">{money(totalValue)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>CORPORATE MARGIN</span>
                <span className="text-amber">+92%</span>
              </div>
              <div className="flex justify-between border-t border-edge/60 pt-2 text-[13px] font-bold">
                <span className="text-bone">YOU PAY</span>
                <span className="text-lime">{money(0)}</span>
              </div>
            </div>
            <DignityMeter accrued={totalValue} ceiling={Math.max(280, totalValue)} />
            <div className="border-t border-edge/60 pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc">
                RECORD ID
              </span>
              <p className="mt-1 font-mono text-[12px] font-bold text-cyan">#{recordId}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc">
                {orders.length} PRIOR SURRENDERS ON FILE
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
