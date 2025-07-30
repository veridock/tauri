import { defineConfig, loadEnv } from "vite";

// process is a nodejs global available in Vite config
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Load env file + env vars starting with VITE_
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get port from environment variables with fallback to default
  const vitePort = parseInt(env.VITE_PORT || '1420', 10);
  
  return {
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: vitePort,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: "ws",
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});
