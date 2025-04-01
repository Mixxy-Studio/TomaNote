// @ts-check
import { defineConfig } from 'astro';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  site: 'https://camiicode.github.io',
  base: '/notepad',
  build: {
    assets: '_assets'
  }
});