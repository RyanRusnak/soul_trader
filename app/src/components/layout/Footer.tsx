import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LedDot } from '../ui/LedDot'

const LINKS = [
  { to: '/legal', label: 'Privacy Abandonment Policy' },
  { to: '/legal', label: 'Terms of Interception' },
  { to: '/manifesto', label: 'Bug Bounty & Exploit Market' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    window.setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="w-full border-t border-edge bg-carbon py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 border-b border-edge/60 pb-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-[22px] font-bold uppercase tracking-tight text-bone">
                SOLE TRADER CORP // TELEMETRY LINK
              </span>
              <span className="border border-lime/40 bg-lime/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-lime">
                LIVE TAP
              </span>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              Subscribe to unsolicited third-party pinging. By providing your
              telemetry frequency, you acknowledge complete forfeiture of
              metadata privacy protocols.
            </p>
            <form onSubmit={submit} className="flex max-w-lg flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="INPUT BIOMETRIC EMAIL / IP FEED"
                className="flex-1 border border-edge bg-panel px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-bone placeholder:text-zinc focus:border-cyan focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-bone px-6 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-obsidian transition-colors hover:bg-lime hover:text-[#00211a]"
              >
                SUBMIT PACKET
              </button>
            </form>
            {subscribed && (
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-lime">
                <LedDot tone="lime" fast />
                PACKET RECEIVED // YOU ARE NOW PINGABLE
              </p>
            )}
          </div>

          <div className="flex flex-col justify-between gap-4 lg:col-span-6">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc">
                LEGAL EXCLUSION CLAUSE
              </span>
              <p className="max-w-xl text-sm leading-relaxed text-muted/80">
                SOLE TRADER is not responsible for emotional collateral, lost
                plausible deniability, or targeted midnight insomnia ads. All
                transactions are settled via automated corporate acquisition of
                personal privacy assets.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.08em]">
              {LINKS.map((l, i) => (
                <Link
                  key={`${l.label}-${i}`}
                  to={l.to}
                  className="text-muted transition-colors hover:text-lime"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-muted sm:flex-row">
          <p>© 2026 SOLE TRADER CORP // UNENCRYPTED SURVEILLANCE WEAR</p>
          <div className="flex items-center gap-2 text-zinc">
            <LedDot tone="lime" />
            <span>DATA EXTRACTION PIPELINE: OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
