import { defineConfig } from 'astro/config';

// Production: https://www.eagledetailingcorp.com (apex 308s to www)
export default defineConfig({
  site: 'https://www.eagledetailingcorp.com',
  trailingSlash: 'never',
});
