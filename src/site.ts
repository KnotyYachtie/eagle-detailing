export const SITE = {
  name: 'Eagle Detailing LLC',
  shortName: 'Eagle Detailing',
  url: 'https://eagle.knotynetwork.com',
  description:
    'High-end mobile detailing for luxury vessels, private aircraft, and exceptional automobiles across South Florida. Based in Fort Lauderdale.',
  phoneDisplay: '(561) 324-9405',
  phoneTel: '+15613249405',
  email: 'info@eagledetailing.com',
  instagramUrl: 'https://www.instagram.com/eagledetailingfl/',
  instagramHandle: '@eagledetailingfl',
  owner: 'Brayan Contreras',
  locality: 'Fort Lauderdale',
  region: 'FL',
  country: 'US',
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

/** Flat list for footer and anywhere else that expects every destination. */
export const NAV = [
  ...NAV_SERVICES,
  ...NAV_MAIN,
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
