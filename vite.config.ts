import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Mapeia a variável de ambiente para process.env para manter compatibilidade com o código
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})