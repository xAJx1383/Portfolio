import { defineConfig } from 'astro/config';
import react from '@astrojs/react'; // 1. Import the React integration

// https://astro.build/config
export default defineConfig({
  site: 'https://xajx1383.github.io',
  base: '/Portfolio',
  trailingSlash: 'always',
  
  // 2. Add React to the integrations list
  integrations: [react()],
});