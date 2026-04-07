import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('recharts')) {
            return 'charts'
          }

          if (
            id.includes('@mui') ||
            id.includes('@emotion')
          ) {
            return 'mui'
          }

          return 'vendor'
        },
      },
    },
  },
})
