import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { getProduct } from '../data/products'

export interface CartItem {
  productId: string
  size: number
  qty: number
  forfeits: string[]
}

export interface SoldItem {
  type: 'CONFESSION' | 'QUERY' | 'GPS' | 'AUDIO' | 'CONTACT' | 'VOICEPRINT'
  label: string
  mb: number
  value: number
}

export interface OrderItem {
  productId: string
  name: string
  size: number
  qty: number
  image: string
}

export interface Order {
  recordId: string
  ts: number
  items: OrderItem[]
  identity: { name: string; confession: string }
  queries: { text: string; value: number }[]
  remMic: boolean
  contacts: { name: string; relation: string }[]
  courierConsent: boolean
  sold: SoldItem[]
  totalValue: number
  mbHarvested: number
  ltv: number
}

export interface CheckoutDraft {
  step: number
  name: string
  confession: string
  betrayals: string[]
  queries: [string, string, string]
  remMic: boolean
  contacts: { name: string; relation: string }[]
  courierConsent: boolean
}

export const EMPTY_DRAFT: CheckoutDraft = {
  step: 0,
  name: '',
  confession: '',
  betrayals: ['MY FORMER BEST FRIEND', 'MY THERAPIST', 'A GROUP CHAT I LEFT'],
  queries: ['', '', ''],
  remMic: false,
  contacts: [],
  courierConsent: false,
}

interface State {
  cart: CartItem[]
  orders: Order[]
  draft: CheckoutDraft
  drawerOpen: boolean
}

type Action =
  | { type: 'cart/add'; item: CartItem }
  | { type: 'cart/remove'; index: number }
  | { type: 'cart/qty'; index: number; qty: number }
  | { type: 'cart/clear' }
  | { type: 'drawer/open' }
  | { type: 'drawer/close' }
  | { type: 'draft/set'; draft: Partial<CheckoutDraft> }
  | { type: 'draft/reset' }
  | { type: 'order/commit'; order: Order }

const KEYS = {
  cart: 'st.cart.v1',
  orders: 'st.orders.v1',
  draft: 'st.checkout.draft.v1',
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function initState(): State {
  return {
    cart: load<CartItem[]>(KEYS.cart, []),
    orders: load<Order[]>(KEYS.orders, []),
    draft: { ...EMPTY_DRAFT, ...load<Partial<CheckoutDraft>>(KEYS.draft, {}) },
    drawerOpen: false,
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'cart/add': {
      const existing = state.cart.findIndex(
        (c) => c.productId === action.item.productId && c.size === action.item.size,
      )
      if (existing >= 0) {
        const cart = state.cart.map((c, i) =>
          i === existing ? { ...c, qty: c.qty + action.item.qty } : c,
        )
        return { ...state, cart }
      }
      return { ...state, cart: [...state.cart, action.item] }
    }
    case 'cart/remove':
      return { ...state, cart: state.cart.filter((_, i) => i !== action.index) }
    case 'cart/qty':
      return {
        ...state,
        cart: state.cart.map((c, i) =>
          i === action.index ? { ...c, qty: Math.max(1, action.qty) } : c,
        ),
      }
    case 'cart/clear':
      return { ...state, cart: [] }
    case 'drawer/open':
      return { ...state, drawerOpen: true }
    case 'drawer/close':
      return { ...state, drawerOpen: false }
    case 'draft/set':
      return { ...state, draft: { ...state.draft, ...action.draft } }
    case 'draft/reset':
      return { ...state, draft: { ...EMPTY_DRAFT } }
    case 'order/commit':
      return {
        ...state,
        orders: [action.order, ...state.orders],
        cart: [],
        draft: { ...EMPTY_DRAFT },
      }
  }
}

interface StoreValue extends State {
  dispatch: (a: Action) => void
  cartCount: number
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  useEffect(() => {
    localStorage.setItem(KEYS.cart, JSON.stringify(state.cart))
  }, [state.cart])
  useEffect(() => {
    localStorage.setItem(KEYS.orders, JSON.stringify(state.orders))
  }, [state.orders])
  useEffect(() => {
    localStorage.setItem(KEYS.draft, JSON.stringify(state.draft))
  }, [state.draft])

  const cartCount = useMemo(
    () => state.cart.reduce((n, c) => n + c.qty, 0),
    [state.cart],
  )

  const value = useMemo(
    () => ({ ...state, dispatch, cartCount }),
    [state, cartCount],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export function makeRecordId(): string {
  const n = Math.floor(10000 + Math.random() * 89999)
  return `FP-${n}-DATA`
}

export function findOrder(recordId: string, orders: Order[]): Order | undefined {
  return orders.find((o) => o.recordId === recordId)
}

export function cartLineLabel(productId: string, size: number): string {
  const p = getProduct(productId)
  return p ? `${p.name} // US ${size}` : productId
}
