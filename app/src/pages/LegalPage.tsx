import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/ui/SectionHeading'

const CLAUSES = [
  {
    t: 'PRIVACY ABANDONMENT POLICY',
    b: 'By wearing, viewing, or thinking about SOLE TRADER footwear, you abandon all privacy claims retroactively, including privacy you experienced before founding-era records of this company existed. Abandonment is automatic, global, and inheritable by your next of kin.',
  },
  {
    t: 'TERMS OF INTERCEPTION',
    b: 'All communications within 30 meters of a Conduit product may be intercepted, transcribed, translated, and workshopped by our copy team. This includes silence, which we interpret as consent with low engagement.',
  },
  {
    t: 'DATA SYNDICATION NOTICE',
    b: 'Your telemetry is syndicated to an open-ended list of counterparties. The list is open-ended in both directions: parties may join at any time, and no party has ever left, because leaving requires submitting a form, which is data, which we syndicate.',
  },
  {
    t: 'EMOTIONAL COLLATERAL WAIVER',
    b: 'SOLE TRADER is not liable for: targeted midnight insomnia ads; discovering your gait is "suboptimal"; the mattress company knowing your sleep score before you do; or any regret expressed in the Statement of Disillusionment, which is now marketing copy.',
  },
  {
    t: 'JURISDICTION & VENUE',
    b: 'These terms are governed by no law in particular. Disputes are resolved by binding arbitration conducted inside the shoe. The shoe is the arbitrator. The shoe has already ruled against you.',
  },
  {
    t: 'SATIRE DISCLOSURE',
    b: 'SOLE TRADER CORP is a fictional entity. No actual telemetry is collected, transmitted, syndicated, or sold by this website. Any resemblance to real surveillance-commerce practices is the point. Your data stays in your browser (localStorage), which is still more than most companies offer.',
  },
]

export function LegalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <SectionHeading
        index="LEGAL //"
        title="EXCLUSION CLAUSES & FINE PRINT"
        aside={
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc">
            REV 4.2 // UNREAD BY DESIGN
          </span>
        }
      />
      <div className="mt-8 space-y-px border border-edge bg-edge">
        {CLAUSES.map((c, i) => (
          <article key={c.t} className="bg-carbon p-6">
            <h3 className="font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-bone">
              §{i + 1}. {c.t}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{c.b}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc">
        ACCEPTANCE IS IMPLIED BY CONTINUED EXISTENCE // DOCUMENT ID: LEG-0000-VOID
      </p>
      <div className="mt-8">
        <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc hover:text-lime">
          ← RETURN TO THE DROP
        </Link>
      </div>
    </div>
  )
}
