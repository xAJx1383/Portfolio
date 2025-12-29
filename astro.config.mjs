import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // CRITICAL: You must set your production URL for sitemap generation
  site: 'https://xAJx1383.github.io',
  //base : '/Portfolio',
  integrations: [
    react(),
    sitemap({
      // Filter out draft pages or private routes if necessary
      // filter: (page) => page !== 'https://xAJx1383.github.io/private/',
    }),
  ],
  
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  
  prefetch: {
    prefetchAll: true,
  },
});