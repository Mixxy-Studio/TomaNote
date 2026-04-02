/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.test.ts'],
    setupFiles: ['./vitest.setup.js']
  }
})