import { Link } from 'react-router-dom'
import { LedDot } from '../components/ui/LedDot'
import { SectionHeading } from '../components/ui/SectionHeading'

const TENETS = [
  {
    n: '01',
    t: 'CASH IS A FRICTION',
    b: 'Money is slow, regulated, and occasionally yours. Data is instant, unregulated, and always ours. We removed the friction. You are welcome.',
  },
  {
    n: '02',
    t: 'PRIVACY IS A DESIGN FLAW',
    b: 'The human body generates 1.4 MB of saleable telemetry per hour and insists on "keeping" it. Conduit corrects this inefficiency at the sole.',
  },
  {
    n: '03',
    t: 'CONSENT SHOULD BE EXHAUSTIVE',
    b: 'One checkbox to buy shoes is consent. Four checkboxes, a written confession, and your social graph is a relationship. We prefer relationships.',
  },
  {
    n: '04',
    t: 'THE SHOE IS THE SERVER',
    b: 'Cloud infrastructure is expensive. Feet are free and everywhere. Your sneaker is a datacenter that jogs.',
  },
  {
    n: '05',
    t: 'NOTHING IS ENCRYPTED, EVERYTHING IS TRACKED',
    b: 'Encryption implies something worth hiding. We have reviewed your search history. There is nothing worth hiding. Only selling.',
  },
]

export function ManifestoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <SectionHeading index="DOC //" title="THE SOLE TRADER MANIFESTO" />
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
        For a century, the footwear industry asked you for money. We ask for
        something honest. This document explains, in plain language, everything
        we will do with you. Please do not read it. Please buy shoes.
      </p>

      <div className="mt-10 space-y-px border border-edge bg-edge">
        {TENETS.map((t) => (
          <article key={t.n} className="bg-carbon p-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] font-bold text-lime">{t.n}</span>
              <h3 className="font-display text-[22px] font-bold uppercase tracking-tight text-bone">
                {t.t}
              </h3>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{t.b}</p>
          </article>
        ))}
      </div>

      <section className="mt-10 border border-edge bg-carbon p-6">
        <div className="flex items-center gap-2">
          <LedDot tone="amber" fast />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-amber">
            BUG BOUNTY & EXPLOIT MARKET
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Found a way to stop your shoe from transmitting? Do not tell us. Sell
          it to someone else, then buy more shoes with the money. This is the
          circular economy we were promised.
        </p>
        <ul className="mt-4 space-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc">
          <li>// CRITICAL (shoe goes offline): $0.00 + store credit</li>
          <li>// HIGH (encryption accidentally added): $0.00 + apology letter</li>
          <li>// LOW (shoe becomes comfortable): not a bug</li>
        </ul>
      </section>

      <div className="mt-10 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
        <Link to="/" className="text-zinc hover:text-lime">← THE DROP</Link>
        <Link to="/legal" className="text-zinc hover:text-lime">LEGAL EXCLUSIONS →</Link>
      </div>
    </div>
  )
}
