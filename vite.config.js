import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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
        output: {
          manualChunks: undefined
        }
      }
    }
  }
})
