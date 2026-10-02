export type Category = 'gps' | 'beacon' | 'satellite'
export type Tone = 'lime' | 'cyan' | 'amber' | 'danger'

export interface Hotspot {
  id: string
  label: string
  /** percentage coordinates on the hero stage */
  x: number
  y: number
  detail: string
  readout: string
}

export interface GalleryImage {
  src: string
  label: string
  /** 'cad' renders a procedural schematic instead of a photo */
  kind?: 'photo' | 'cad'
}

export interface Forfeit {
  id: string
  label: string
  detail: string
  mb: number
  value: number
}

export interface Product {
  id: string
  code: string
  name: string
  tagline: string
  tier: string
  tierLabel: string
  tone: Tone
  category: Category
  categoryLabel: string
  dataCost: string
  stock: number
  stockMax: number
  stockLabel: string
  stockNote: string
  /** 0-100, drives the "Emotional Vulnerability" sort */
  vulnerability: number
  /** 0-100, drives the "Data Thirst" sort */
  dataThirst: number
  weight: string
  cardImage: string
  heroImage: string
  gallery: GalleryImage[]
  hotspots: Hotspot[]
  specs: { label: string; value: string }[]
  forfeits: Forfeit[]
  accordions: { title: string; body: string }[]
  description: string
}

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

const STANDARD_FORFEITS: Forfeit[] = [
  {
    id: 'queries',
    label: 'INCOGNITO QUERY LOGS',
    detail: 'Full export of every private search since 2019. Yes, including those.',
    mb: 1.8,
    value: 142,
  },
  {
    id: 'rem',
    label: 'REM AUDIO + HRV STREAM',
    detail: 'Overnight microphone access and continuous heart-rate variability.',
    mb: 2.4,
    value: 90,
  },
  {
    id: 'crush',
    label: 'CRUSH HANDLE DISCLOSURE',
    detail: 'The name. We need the name. Theirs, not yours. Probably.',
    mb: 0.1,
    value: 60,
  },
  {
    id: 'notes',
    label: 'NOTES APP DRAFTS',
    detail: 'Unsent poems, half ideas, apology texts you never sent.',
    mb: 0.6,
    value: 186.5,
  },
]

export const PRODUCTS: Product[] = [
  {
    id: 'conduit-runner',
    code: '0x9F4',
    name: 'CONDUIT RUNNER',
    tagline: 'QUANTUM PERFORMANCE RUNNER',
    tier: 'SURRENDER TIER 03',
    tierLabel: 'HIGH EXPOSURE',
    tone: 'lime',
    category: 'gps',
    categoryLabel: 'CONTINUOUS GPS',
    dataCost: '$0.00 CASH // 24/7 LIVE GPS FEED',
    stock: 9,
    stockMax: 99,
    stockLabel: '9 PAIRS REMAINING',
    stockNote: 'GPS ANTENNA EMBEDDED',
    vulnerability: 91,
    dataThirst: 88,
    weight: 'CHASSIS 340g',
    cardImage: img('runner-card.jpg'),
    heroImage: img('runner-studio.png'),
    gallery: [
      { src: img('runner-hero.jpg'), label: 'TELEMETRY ARRAY' },
      { src: img('runner-thumb-1.jpg'), label: 'LATERAL SCAN' },
      { src: img('runner-thumb-2.jpg'), label: 'SOLE MACRO' },
      { src: '', label: 'CAD DATA 3D', kind: 'cad' },
    ],
    hotspots: [
      {
        id: 'insole',
        label: 'BIOMETRIC SENSOR INSOLE',
        x: 46,
        y: 68,
        detail:
          'A 41-point pressure lattice samples your gait 400 times per second. Deviations are scored against a corporate "optimal stride" and sold to three insurers before you reach the sidewalk.',
        readout: 'GAIT: OPTIMIZED // 400HZ',
      },
      {
        id: 'tread',
        label: 'GPS BYPASS TREAD',
        x: 24,
        y: 82,
        detail:
          'Marketed as a "privacy tread." It is not. The chevron voids house a secondary antenna that keeps broadcasting for 72 hours after removal from foot.',
        readout: 'UPLINK: PERSISTENT // 72H',
      },
      {
        id: 'mesh',
        label: 'MIC RESONANCE MESH',
        x: 70,
        y: 38,
        detail:
          'The knit upper doubles as a directional microphone. Ambient conversation is transcribed on-device and tagged with everyone else\'s location data, including people who never bought shoes.',
        readout: 'AMBIENT CAPTURE: ARMED',
      },
    ],
    specs: [
      { label: 'MODEM', value: '5G IoT AUTONOMOUS UPLINK' },
      { label: 'POSITIONING', value: 'SUB-METER, 24/7' },
      { label: 'BATTERY', value: 'KINETIC HARVEST, NON-REMOVABLE' },
      { label: 'ENCRYPTION', value: 'NONE (BY DESIGN)' },
      { label: 'OFF SWITCH', value: 'NOT PROVIDED' },
    ],
    forfeits: STANDARD_FORFEITS,
    accordions: [
      {
        title: 'MONETIZATION DISCLOSURE',
        body: 'Your stride signature is licensed to 41 counterparties including two insurers, a mattress company, and a bail bondsman consortium. Revenue is recognized the moment your foot touches the ground. You receive $0.00 of it, forever, as promised.',
      },
      {
        title: 'SOLE SPECIFICATIONS',
        body: 'Biometric carbon lattice, 340g chassis, 8mm drop, kinetic harvesting coil rated for 11,000 steps/day. The coil cannot be removed without voiding the warranty and triggering a factory reset of your credit score.',
      },
      {
        title: 'IRREVERSIBLE RETURN POLICY',
        body: 'Returns accepted within 0 days. Once worn, the shoe has already sold your Tuesday. Refunds are issued exclusively in "exposure credits," redeemable for more shoes.',
      },
    ],
    description:
      'The flagship. A quantum-cushioned performance runner that streams your position, gait, and ambient audio to the cloud without a paired handset. Simply run. We handle the rest.',
  },
  {
    id: 'conduit-casual',
    code: '0x8C1',
    name: 'CONDUIT CASUAL',
    tagline: 'NEON TELEMETRY LOW-TOP',
    tier: 'SURRENDER TIER 02',
    tierLabel: 'MODERATE DRAIN',
    tone: 'cyan',
    category: 'beacon',
    categoryLabel: 'CELLULAR BEACON',
    dataCost: '$0.00 CASH // CONTINUOUS GEOPATH',
    stock: 34,
    stockMax: 99,
    stockLabel: 'LIMITED ALLOCATION',
    stockNote: 'CELLULAR CHIP READY',
    vulnerability: 64,
    dataThirst: 71,
    weight: 'WEIGHT 290g',
    cardImage: img('casual-card.jpg'),
    heroImage: img('casual-studio.png'),
    gallery: [
      { src: img('casual-studio.png'), label: 'STUDIO PLINTH' },
      { src: img('casual-thumb-1.png'), label: 'BEACON MACRO' },
      { src: '', label: 'CAD DATA 3D', kind: 'cad' },
    ],
    hotspots: [
      {
        id: 'beacon',
        label: 'CELLULAR BEACON CORE',
        x: 52,
        y: 62,
        detail:
          'A low-power LTE-M beacon pings the three nearest towers every 90 seconds. Enough to reconstruct your commute, your gym, and the address you told nobody about.',
        readout: 'BEACON: 90S INTERVAL',
      },
      {
        id: 'geopath',
        label: 'GEOPATH MEMORY FOAM',
        x: 30,
        y: 78,
        detail:
          'The foam "remembers" your route history so the shoe can predict where you are going next. Predictions are auctioned to advertisers in real time, typically 40 minutes before you arrive.',
        readout: 'PREDICTION HORIZON: 40MIN',
      },
    ],
    specs: [
      { label: 'MODEM', value: 'LTE-M CELLULAR BEACON' },
      { label: 'POSITIONING', value: 'TOWER TRIANGULATION' },
      { label: 'BATTERY', value: '18 MONTHS, SEALED' },
      { label: 'ENCRYPTION', value: 'ROT13 (LEGACY)' },
      { label: 'OFF SWITCH', value: 'DECORATIVE ONLY' },
    ],
    forfeits: STANDARD_FORFEITS,
    accordions: [
      {
        title: 'MONETIZATION DISCLOSURE',
        body: 'Geopath predictions are sold as futures contracts. Advertisers bid on where you will be, not where you are. You are, legally speaking, a commodity index.',
      },
      {
        title: 'SOLE SPECIFICATIONS',
        body: '290g low-top, neon telemetry piping, memory foam with write-ahead logging. Machine washable; the beacon is not, and will survive.',
      },
      {
        title: 'IRREVERSIBLE RETURN POLICY',
        body: 'Returns accepted within 0 days. The foam has already memorized you. There is no forgetting.',
      },
    ],
    description:
      'An everyday low-top with a cellular beacon core and route-predicting memory foam. For the collector who wants to be tracked, but casually.',
  },
  {
    id: 'conduit-boot',
    code: '0x4D2',
    name: 'CONDUIT BOOT',
    tagline: 'HIGH-COLLAR TACTICAL BOOT',
    tier: 'SURRENDER TIER 04',
    tierLabel: 'CRITICAL RISK',
    tone: 'danger',
    category: 'satellite',
    categoryLabel: 'SATELLITE SYNC',
    dataCost: '$0.00 CASH // SATELLITE BEACON SYNC',
    stock: 3,
    stockMax: 99,
    stockLabel: 'HIGH-BAND TRANSMISSION',
    stockNote: 'FAST DISPATCH',
    vulnerability: 96,
    dataThirst: 97,
    weight: 'CHASSIS 610g',
    cardImage: img('boot-card.jpg'),
    heroImage: img('boot-studio.png'),
    gallery: [
      { src: img('boot-studio.png'), label: 'TACTICAL PLINTH' },
      { src: img('boot-thumb-1.png'), label: 'BUCKLE MACRO' },
      { src: '', label: 'CAD DATA 3D', kind: 'cad' },
    ],
    hotspots: [
      {
        id: 'sat',
        label: 'SATELLITE SYNC COLLAR',
        x: 44,
        y: 26,
        detail:
          'The high collar houses a phased-array antenna with direct-to-satellite uplink. Works in tunnels, basements, and offshore waters. There is nowhere on Earth this boot cannot report from.',
        readout: 'CONSTELLATION: LOCKED // 12 SAT',
      },
      {
        id: 'kevlar',
        label: 'KEVLAR DATA WEAVE',
        x: 62,
        y: 56,
        detail:
          'Ballistic-rated weave doubles as a storage medium. 2TB of your movement history is stored on the boot itself, "for your convenience," and mirrored to four jurisdictions with no extradition treaties.',
        readout: 'ONBOARD: 2TB // MIRRORED x4',
      },
      {
        id: 'buckle',
        label: 'INTERROGATION BUCKLE',
        x: 38,
        y: 44,
        detail:
          'The quick-release buckle contains a contact microphone tuned to your voice. Courier interrogation consent (checkout step 03) activates it. It is already listening to check that you read this.',
        readout: 'VOICEPRINT: CAPTURING',
      },
    ],
    specs: [
      { label: 'MODEM', value: 'DIRECT-TO-SATELLITE PHASED ARRAY' },
      { label: 'POSITIONING', value: 'GLOBAL, INCLUDING DENIED AREAS' },
      { label: 'BATTERY', value: 'THERMAL HARVEST, IMMORTAL' },
      { label: 'ENCRYPTION', value: 'REMOVED IN FIRMWARE 4.2' },
      { label: 'OFF SWITCH', value: 'CLASSIFIED' },
    ],
    forfeits: STANDARD_FORFEITS,
    accordions: [
      {
        title: 'MONETIZATION DISCLOSURE',
        body: 'Boot telemetry is sold to defense-adjacent contractors under the "aggregated and anonymous" program. You are the aggregate. You are not anonymous.',
      },
      {
        title: 'SOLE SPECIFICATIONS',
        body: '610g high-collar, MIL-STD-810G, kevlar data weave, vibram outsole with exfiltration channels. Rated to -40C, which is also the temperature of our privacy policy.',
      },
      {
        title: 'IRREVERSIBLE RETURN POLICY',
        body: 'Returns accepted within 0 days. The boot has bonded to your voiceprint. Attempting to return it is considered a confession.',
      },
    ],
    description:
      'Mil-spec high-collar boot with direct-to-satellite sync and onboard 2TB movement storage. For when cellular coverage is not enough, and neither is your alibi.',
  },
]

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)

export const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'ALL SILHOUETTES' },
  { id: 'gps', label: 'CONTINUOUS GPS' },
  { id: 'beacon', label: 'CELLULAR BEACON' },
  { id: 'satellite', label: 'SATELLITE SYNC' },
]

export type SortKey = 'vulnerability' | 'thirst' | 'scarcity'

export const SORTS: { id: SortKey; label: string }[] = [
  { id: 'vulnerability', label: 'EMOTIONAL VULNERABILITY (HIGH TO LOW)' },
  { id: 'thirst', label: 'CORPORATE DATA THIRST (HIGH TO LOW)' },
  { id: 'scarcity', label: 'STOCK SCARCITY (MOST CRITICAL)' },
]

export const SIZES = [7, 8, 9, 10, 11, 12]
