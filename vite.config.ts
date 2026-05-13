import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// base: './' — деплой на Hostinger у будь-яку піддиректорію (відносні шляхи).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // PHP-бекенд адмінки очікується на :8081 (npm run dev:php).
    // Тільки /api проксиюємо — статику /data, /uploads, /cases Vite сам сервить з public/.
    proxy: {
      '/api': 'http://127.0.0.1:8081',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
