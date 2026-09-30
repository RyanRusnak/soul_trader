import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { HeaderSpacer, Header } from './Header'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian text-bone">
      <ScrollToTop />
      <Header />
      <HeaderSpacer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
