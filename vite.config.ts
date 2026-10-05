import { defineConfig } from 'vite';
export default defineConfig({ build: { rollupOptions: { onwarn(warning, warn) {
 // Client-only directives have no additional meaning in this static React app.
 if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
 warn(warning);
} } } });
