import type { APIRoute } from 'astro';
import { SITE } from '../site';

/** Indexable routes — paths without trailing slash (matches `trailingSlash: 'never'`). */
const INDEXABLE_PATHS = [
  '/',
  '/marine',
  '/aviation',
  '/automotive',
  '/about',
  '/contact',
  '/projects',
  '/privacy',
] as const;

export const GET: APIRoute = () => {
  const urls = INDEXABLE_PATHS.map((path) => {
    const loc = new URL(path, SITE.url).href;
    const priority = path === '/' ? '1' : path === '/privacy' ? '0.5' : path.match(/^\/(marine|aviation|automotive|contact)$/) ? '0.9' : '0.7';
    const changefreq = path === '/' ? 'weekly' : 'monthly';
    return `  <url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

export const prerender = true;
