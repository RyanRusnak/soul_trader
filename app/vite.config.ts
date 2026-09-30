import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Base path: dev serves at '/', production builds (and `vite preview`, which
// also resolves in production mode) default to the GitHub Pages project
// subpath. CI can override with BASE_PATH to stay rename-proof.
export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH || (mode === 'production' ? '/stitch_sole_trade_store/' : '/'),
  plugins: [react(), tailwindcss()],
}))
