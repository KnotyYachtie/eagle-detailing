export const SITE = {
  name: 'Eagle Detailing Yacht & Aircraft Care LLC',
  shortName: 'Eagle Detailing Yacht & Aircraft Care',
  url: 'https://eagle.knotynetwork.com',
  description:
    'Yacht and aircraft care for discerning owners across South Florida — plus exceptional automotive detailing. Mobile service based in Fort Lauderdale.',
  /** Footer / secondary line — automotive stays on-site without competing with the primary name. */
  tagline: 'Plus exceptional automotive detailing across South Florida',
  phoneDisplay: '(561) 324-9405',
  phoneTel: '+15613249405',
  email: 'info@eagledetailing.com',
  instagramUrl: 'https://www.instagram.com/eagledetailingfl/',
  instagramHandle: '@eagledetailingfl',
  /** Bust browser favicon cache when icons change. */
  faviconVersion: '20260825b',
  owner: 'Brayan Contreras',
  locality: 'Fort Lauderdale',
  region: 'FL',
  country: 'US',
} as const;

/** Shared `theme-color` + `--page-canvas` for `/marine`, `/automotive`, `/aviation` (`ServiceEditorialPage`). */
export const SERVICE_EDITORIAL_SHELL_COLORS = {
  themeColor: '#0a1118',
  canvasColor: '#0a1118',
} as const;

/** Marine / Aviation / Automotive — grouped under “Services” in the site header. */
export const NAV_SERVICES = [
  { href: '/marine', label: 'Marine' },
  { href: '/aviation', label: 'Aviation' },
  { href: '/automotive', label: 'Automotive' },
] as const;

/** Contact — grouped under “About” in the site header. */
export const NAV_ABOUT_CHILDREN = [{ href: '/contact', label: 'Contact' }] as const;

export const NAV_MAIN = [{ href: '/projects', label: 'Projects' }] as const;

/** Flat list for anywhere that expects every destination (header tooling, structured footer uses subsets). */
export const NAV = [
  ...NAV_SERVICES,
  ...NAV_MAIN,
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
