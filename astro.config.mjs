// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://tomanote.app';

export default defineConfig({
  site: SITE_URL,
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['sortablejs']
    },
    
    build: {
      assetsDir: 'assets',
      
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug'],
        }
      },
      
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
        }
      }
    }
  }
});