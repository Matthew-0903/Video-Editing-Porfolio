import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-video-assets',
        configureServer(server) {
          server.middlewares.use('/Shortform', express.static(path.resolve(import.meta.dirname, 'Shortform')));
          server.middlewares.use('/Longform', express.static(path.resolve(import.meta.dirname, 'Longform')));
        },
        configurePreviewServer(server) {
          server.middlewares.use('/Shortform', express.static(path.resolve(import.meta.dirname, 'Shortform')));
          server.middlewares.use('/Longform', express.static(path.resolve(import.meta.dirname, 'Longform')));
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
