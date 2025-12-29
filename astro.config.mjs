import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  /**
   * 1. SITE CONFIGURATION
   * Replace with your actual GitHub Pages URL.
   */
  site: 'https://xAJx1383.github.io',

  /**
   * 2. BASE PATH
   * If your repository is named "Portfolio", set this to '/Portfolio'.
   * If your repository is named "xAJx1383.github.io", set this to '/'.
   */
  base: '/Portfolio/',

  /**
   * 3. INTEGRATIONS
   * react: Required for the InteractiveCanvas and ProjectGrid.
   * sitemap: Generates a sitemap.xml for SEO.
   */
  integrations: [
    react(),
    sitemap({
      // Optional: Filter out specific pages from the sitemap
      filter: (page) => !page.includes('/private/') && !page.includes('/draft/'),
    }),
  ],

  /**
   * 4. IMAGE OPTIMIZATION
   * Using 'sharp' for high-performance image processing (WebP/Avif conversion).
   */
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  /**
   * 5. PREFETCHING
   * Preloads pages in the background for near-instant navigation.
   * 'intent' is better for mobile/data-saving than 'prefetchAll: true'.
   */
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  /**
   * 6. VITE CONFIGURATION
   * Ensures Three.js and other heavy dependencies are handled correctly.
   */
  vite: {
    ssr: {
      noExternal: ['three', 'lenis'],
    },
    optimizeDeps: {
      include: ['three'],
    },
  },
});