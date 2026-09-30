export const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const mb = (n: number) => `${n.toFixed(1)} MB`

export const pad = (n: number, w = 2) => String(n).padStart(w, '0')

/** Next Friday 00:00 UTC — the eternal drop window. */
export function nextDropTarget(from = new Date()): Date {
  const d = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
  )
  const day = d.getUTCDay()
  const delta = (5 - day + 7) % 7 || 7
  d.setUTCDate(d.getUTCDate() + delta)
  return d
}

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function countdownTo(target: Date, now = new Date()): Countdown {
  let ms = Math.max(0, target.getTime() - now.getTime())
  const days = Math.floor(ms / 86_400_000)
  ms -= days * 86_400_000
  const hours = Math.floor(ms / 3_600_000)
  ms -= hours * 3_600_000
  const minutes = Math.floor(ms / 60_000)
  ms -= minutes * 60_000
  const seconds = Math.floor(ms / 1000)
  return { days, hours, minutes, seconds }
}

export function timeAgo(ts: number, now = Date.now()): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000))
  if (s < 60) return `${s}S AGO`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}M AGO`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}H AGO`
  return `${Math.floor(h / 24)}D AGO`
}
