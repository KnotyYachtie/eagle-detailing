import { defineConfig } from 'astro/config';

// Production: https://www.eagledetailingcorp.com (apex 308s to www)
// Static sitemap: public/sitemap.xml (@astrojs/sitemap v3.7+ hooks differ from Astro 4.16)
export default defineConfig({
  site: 'https://www.eagledetailingcorp.com',
});
