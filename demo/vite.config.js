import { resolve } from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  root: __dirname,
  publicDir: resolve(__dirname, "../public"),
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, "../dist-demo"),
    emptyOutDir: true,
  },
})
