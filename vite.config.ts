import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({
    include: ['buffer', 'process', 'stream', 'crypto', 'vm', 'path'],
    globals: {
      Buffer: true, // can also be 'build', 'dev', or false
      global: true,
      process: true,
    },
  })],
})
