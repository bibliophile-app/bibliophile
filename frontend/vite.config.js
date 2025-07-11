import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const allowedHosts = env.VITE_ALLOWED_HOST?.split(',').map(h => h.trim()) || []
  const backendTarget = env.KTOR_URL?.trim() || 'http://ktor_backend:8080'
  
  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      allowedHosts: ['localhost', ...allowedHosts],
      proxy: {
        '^/(me|login|logout|register|booklists|quotes|reviews|auth|followers|users)(/.*)?$': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})