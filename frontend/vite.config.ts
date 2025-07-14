import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        widget: path.resolve(__dirname, 'widget.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          livekit: ['livekit-client', '@livekit/components-react', '@livekit/components-core']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
  },
}) 