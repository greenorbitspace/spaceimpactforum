import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://impactorbit.co',
  base: '/',

  integrations: [
    alpinejs(),
    react(),
    tailwind({ applyBaseStyles: true }),
  ],

  vite: {
    server: {
      fs: { strict: false },
    },

    build: {
      target: 'esnext',
      minify: 'esbuild',
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('EarthGlobe')) return 'chunk_earthglobe';
            if (id.includes('SearchableLibrary')) return 'chunk_searchablelibrary';
            if (id.includes('node_modules')) return 'vendor';
          },
        },
      },
    },

    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@styles': '/src/styles',
        '@data': '/src/data',
        '@assets': '/src/assets',
      },
    },

    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
});