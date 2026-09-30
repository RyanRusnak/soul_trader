import { Link, useNavigate } from 'react-router-dom'
import { getProduct } from '../../data/products'
import { money } from '../../lib/format'
import { useStore } from '../../store/StoreContext'
import { Button } from '../ui/Button'
import { LedDot } from '../ui/LedDot'

export function CartDrawer() {
  const { cart, drawerOpen, dispatch, cartCount } = useStore()
  const navigate = useNavigate()

  const dataCost = cart.reduce((n, c) => {
    const p = getProduct(c.productId)
    return n + (p ? p.forfeits.length * c.qty : 0)
  }, 0)

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-obsidian/70 backdrop-blur-sm transition-opacity duration-200 ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => dispatch({ type: 'drawer/close' })}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-edge bg-carbon transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Acquisition cart"
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between border-b border-edge px-5 py-4">
          <div className="flex items-center gap-2">
            <LedDot tone="lime" fast={cartCount > 0} />
            <span className="font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-bone">
              ACQUISITION CART ({cartCount})
            </span>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'drawer/close' })}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-danger"
          >
            CLOSE [X]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc">
                NO HARDWARE ALLOCATED
              </p>
              <p className="text-sm text-muted">
                Your cart is empty. Your data, however, is not.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  dispatch({ type: 'drawer/close' })
                  navigate('/')
                }}
              >
                BROWSE THE DROP
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-edge/60">
              {cart.map((item, i) => {
                const p = getProduct(item.productId)
                if (!p) return null
                return (
                  <li key={`${item.productId}-${item.size}`} className="flex gap-4 px-5 py-4">
                    <img
                      src={p.cardImage}
                      alt={p.name}
                      className="h-20 w-24 shrink-0 border border-edge object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-sm font-bold uppercase tracking-tight text-bone">
                          {p.name}
                        </span>
                        <span className="font-mono text-[10px] text-zinc">{p.code}</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                        US {item.size} // {p.categoryLabel}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime">
                        {money(0)} CASH // {item.forfeits.length} ASSETS PLEDGED
                      </span>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center border border-edge">
                          <button
                            type="button"
                            className="px-2 py-0.5 font-mono text-[11px] text-muted hover:text-bone"
                            onClick={() =>
                              dispatch({ type: 'cart/qty', index: i, qty: item.qty - 1 })
                            }
                          >
                            −
                          </button>
                          <span className="min-w-8 px-1 text-center font-mono text-[11px] text-bone">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            className="px-2 py-0.5 font-mono text-[11px] text-muted hover:text-bone"
                            onClick={() =>
                              dispatch({ type: 'cart/qty', index: i, qty: item.qty + 1 })
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-danger"
                          onClick={() => dispatch({ type: 'cart/remove', index: i })}
                        >
                          PURGE
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="space-y-3 border-t border-edge bg-panel/40 px-5 py-4">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
            <span className="text-muted">CASH SUBTOTAL</span>
            <span className="text-bone">{money(0)}</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
            <span className="text-muted">DATA OBLIGATION</span>
            <span className="text-amber">{dataCost} ASSETS PLEDGED</span>
          </div>
          <div className="flex items-center justify-between border-t border-edge/60 pt-3 font-mono text-[12px] font-bold uppercase tracking-[0.12em]">
            <span className="text-bone">TOTAL DUE</span>
            <span className="text-lime">{money(0)} // FOREVER</span>
          </div>
          <Button
            className="w-full"
            disabled={cart.length === 0}
            onClick={() => {
              dispatch({ type: 'drawer/close' })
              navigate('/checkout')
            }}
          >
            PROCEED TO SURRENDER
          </Button>
          <Link
            to="/"
            onClick={() => dispatch({ type: 'drawer/close' })}
            className="block text-center font-mono text-[10px] uppercase tracking-[0.14em] text-zinc hover:text-lime"
          >
            CONTINUE EXPOSURE (BROWSING)
          </Link>
        </div>
      </aside>
    </>
  )
}
