import { defineConfig } from 'vite';
export default defineConfig({ build: { rollupOptions: { output: { manualChunks(id) {
 if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
 if (/\/node_modules\/(motion|motion-dom|motion-utils|framer-motion)\//.test(id)) return 'motion';
} }, onwarn(warning, warn) {
 // Client-only directives have no additional meaning in this static React app.
 if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
 warn(warning);
} } } });
