export const SITE = {
  name: 'Eagle Detailing Yacht & Aircraft Care LLC',
  shortName: 'Eagle Detailing Yacht & Aircraft Care',
  url: 'https://www.eagledetailingcorp.com',
  description:
    'Yacht and aircraft care for discerning owners across South Florida. Mobile service based in Fort Lauderdale — one standard of precision across marine and aviation.',
  /** Footer / secondary line under the logo lockup. */
  tagline: 'One standard. Multiple domains.',
  phoneDisplay: '(561) 324-9405',
  phoneTel: '+15613249405',
  email: 'info@eagledetailingcorp.com',
  instagramUrl: 'https://www.instagram.com/eagledetailingfl/',
  instagramHandle: '@eagledetailingfl',
  /** Bust browser favicon cache when icons change. */
  faviconVersion: '20260825c',
  owner: 'Brayan Contreras',
  locality: 'Fort Lauderdale',
  region: 'FL',
  country: 'US',
} as const;

/** Shared `theme-color` + `--page-canvas` for `/marine` and `/aviation` (`ServiceEditorialPage`). */
export const SERVICE_EDITORIAL_SHELL_COLORS = {
  themeColor: '#0a1118',
  canvasColor: '#0a1118',
} as const;

/** Marine / Aviation — grouped under “Services” in the site header. */
export const NAV_SERVICES = [
  { href: '/marine', label: 'Marine' },
  { href: '/aviation', label: 'Aviation' },
] as const;

/** About + Contact — grouped under “About” in the site header. */
export const NAV_ABOUT_CHILDREN = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const NAV_MAIN = [{ href: '/projects', label: 'Projects' }] as const;

/** Flat list for anywhere that expects every destination (header tooling, structured footer uses subsets). */
export const NAV = [
  ...NAV_SERVICES,
  ...NAV_MAIN,
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;