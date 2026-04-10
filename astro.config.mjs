import { defineConfig } from 'astro/config';

// MVP: https://eagle.knotynetwork.com — update when production domain is live
// Static sitemap: public/sitemap.xml (@astrojs/sitemap v3.7+ hooks differ from Astro 4.16)
export default defineConfig({
  site: 'https://eagle.knotynetwork.com',
});
