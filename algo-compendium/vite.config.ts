import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '127.0.0.1', port: 3003, strictPort: true },
  preview: { host: '127.0.0.1', port: 3003, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
