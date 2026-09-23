import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  appType: 'spa',
  plugins: [react()],
  server: {
    host: true,
    port: 3004,
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'axios',
      'react-hot-toast',
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],
  },
});
