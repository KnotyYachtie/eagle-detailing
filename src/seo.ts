import type { ImageMetadata } from 'astro';
import { NAV_SERVICES, SITE } from './site';

/** Absolute URL for Open Graph / Twitter (works with Astro-hashed `/_astro/` paths). */
export function absoluteImageUrl(image: ImageMetadata | string, siteUrl: string = SITE.url): string {
  const path = typeof image === 'string' ? image : image.src;
  return new URL(path, siteUrl).href;
}

export function buildLocalBusinessJsonLd(siteUrl: string = SITE.url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.name,
    image: new URL('/logo-blue-on-white.png', siteUrl).href,
    '@id': siteUrl,
    url: siteUrl,
    telephone: SITE.phoneTel,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: 'South Florida',
    description: SITE.description,
    sameAs: [SITE.instagramUrl],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Detailing services',
      itemListElement: NAV_SERVICES.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.label,
          url: new URL(service.href, siteUrl).href,
        },
      })),
    },
  };
}
