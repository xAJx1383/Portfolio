import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  /* BEGIN CHANGES */
  site: 'https://xajx1383.github.io',
  base: '/Portfolio', // No trailing slash here for cleaner joining
  /* END CHANGES */
  integrations: [react(), sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    ssr: { noExternal: ['three', 'lenis'] },
  },
});