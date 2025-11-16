import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // Use relative base for Electron (file:// protocol)
  // Use absolute base for Capacitor (Android/iOS)
  const isElectron = process.env.BUILD_TARGET === 'electron' || mode === 'electron'
  
  return {
    plugins: [vue()],
    base: isElectron ? './' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          store: resolve(__dirname, 'store.html')
        },
        output: {
          manualChunks: undefined
        }
      }
    }
  }
})
