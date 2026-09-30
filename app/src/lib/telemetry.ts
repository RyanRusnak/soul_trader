/** Deterministic-ish fake telemetry line generator for HUD/ticker surfaces. */

const NODES = ['NODE-01', 'NODE-04', 'NODE-07', 'NODE-12', 'NODE-19', 'NODE-23']

function rand(min: number, max: number, decimals = 0): string {
  const v = min + Math.random() * (max - min)
  return v.toFixed(decimals)
}

function coord(): string {
  const lat = (34 + Math.random() * 14).toFixed(4)
  const lon = (-118 + Math.random() * 40).toFixed(4)
  return `${lat},${lon}`
}

export type TelemetryKind = 'sync' | 'geo' | 'bio' | 'packet' | 'warn'

export interface TelemetryLine {
  kind: TelemetryKind
  text: string
}

const BUILDERS: Record<TelemetryKind, () => string> = {
  sync: () => `${pick(NODES)} SYNC OK // HANDSHAKE ${rand(2, 40)}MS`,
  geo: () => `GEO ${coord()} // DRIFT ${rand(0.1, 2.4, 1)}M`,
  bio: () => `HRV ${rand(48, 96)}BPM // REM WINDOW ${Math.random() > 0.5 ? 'OPEN' : 'CLOSED'}`,
  packet: () => `PACKET ${rand(1.2, 48.6, 1)}KB // ROUTE: UNENCRYPTED`,
  warn: () => `ANOMALY: SUBJECT ATTEMPTED ${pick(['INCOGNITO MODE', 'AIRPLANE MODE', 'A PARK', 'SILENCE'])} // LOGGED`,
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function telemetryLine(kind?: TelemetryKind): TelemetryLine {
  const k: TelemetryKind =
    kind ??
    (pick(Object.keys(BUILDERS)) as TelemetryKind)
  return { kind: k, text: BUILDERS[k]() }
}

export function telemetryBurst(n: number): TelemetryLine[] {
  return Array.from({ length: n }, () => telemetryLine())
}

/** Terminal log lines for the order-confirmation exfiltration feed. */
export function exfilLine(): string {
  return pick([
    `> uploading gait signature ......... OK (${rand(12, 96)}KB)`,
    `> selling tuesday to insurer #${rand(2, 41)} ......... OK`,
    `> geopath prediction auction ......... +$${rand(0.4, 3.8, 2)}`,
    `> ambient audio shard ${rand(100, 999)} ......... TRANSMITTED`,
    `> voiceprint delta ......... MERGED`,
    `> syndicate bid received (APEX/MADISON AVE) ......... +$${rand(1, 9, 2)}`,
    `> mirror to jurisdiction #${rand(1, 4)} ......... COMPLETE`,
    `> subject checked phone nervously ............. NOTED`,
    `> dignity index ......... -${rand(0.1, 1.9, 1)}%`,
    `> encryption ............. STILL NONE`,
  ])
}
