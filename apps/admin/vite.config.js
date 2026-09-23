import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
    hmr: { overlay: false },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'react-hot-toast', 'lucide-react', 'clsx', 'tailwind-merge'],
  },
  build: { target: 'esnext', sourcemap: false, minify: 'esbuild' },
});
