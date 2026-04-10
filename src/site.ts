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

export const NAV = [
  { href: '/marine', label: 'Marine' },
  { href: '/aviation', label: 'Aviation' },
  { href: '/automotive', label: 'Automotive' },
  { href: '/service-area', label: 'Service area' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
