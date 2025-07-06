import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      // Configura o atalho '@' para apontar para a pasta 'src'
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
