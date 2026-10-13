import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { precacheServiceWorker } from './scripts/precache-plugin.mjs';

export default defineConfig({
  plugins: [react(), precacheServiceWorker()],
});
