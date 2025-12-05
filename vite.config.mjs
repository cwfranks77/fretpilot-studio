import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

export default defineConfig(({ mode }) => {
  const isElectron = process.env.BUILD_TARGET === 'electron' || mode === 'electron'
  return {
    plugins: [
      vue(),
      {
        name: 'copy-cname',
        closeBundle() {
          try {
            copyFileSync('CNAME', 'dist/CNAME')
            console.log('✅ CNAME copied to dist/')
          } catch (e) {
            console.warn('⚠️ CNAME not found, skipping')
          }
        }
      }
    ],
    base: isElectron ? './' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        input: {
          main: resolve(process.cwd(), 'index.html')
        },
        output: { manualChunks: undefined }
      }
    }
  }
})
