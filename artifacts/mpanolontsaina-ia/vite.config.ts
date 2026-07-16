import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// PORT n'est requis qu'en mode dev (server.port / preview.port).
// Pour un build statique (vite build), on utilise 3000 par défaut.
const rawPort = process.env.PORT ?? '3000';
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
    proxy: {
      // Proxies to the external Mpanolontsaina IA API (HTTP-only) so the
      // browser only ever talks to same-origin HTTPS, avoiding mixed-content
      // blocks. See src/api/client.ts (VITE_API_BASE_URL=/ext-api).
      '/ext-api': {
        // Configurable via EXTERNAL_API_URL dans .env (dev uniquement).
        target: process.env.EXTERNAL_API_URL ?? 'http://api.mpanolontsaina-ia.duckdns.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ext-api/, ''),
      },
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
