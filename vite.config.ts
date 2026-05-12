import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — деплой на Hostinger у будь-яку піддиректорію (відносні шляхи).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
