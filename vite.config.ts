/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // e2e/ is Playwright's; Vitest would otherwise try to run those specs.
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/**/*.test.{ts,tsx}'],
      // Thresholds cover logic only. Presentational components are exercised by
      // both layers; a blanket threshold there rewards padding, not safety.
      thresholds: {
        'src/utils/**': { lines: 90, branches: 90 },
        'src/hooks/**': { lines: 90, branches: 90 },
        'src/data/**': { lines: 90, branches: 90 },
      },
    },
  },
})
