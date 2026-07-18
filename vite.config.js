import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ignore-emsdk',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/emsdk/')) {
            res.statusCode = 404;
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  optimizeDeps: {
    noDiscovery: true,
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      '@react-three/fiber',
      '@react-three/drei',
      'react-reconciler',
      'react-reconciler/constants',
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ['**/emsdk/**'],
    },
  },
});
