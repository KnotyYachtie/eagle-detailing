# Eagle Detailing — marketing site

Astro static site for **Eagle Detailing LLC** (South Florida). MVP deploy target: `https://eagle.knotynetwork.com`.

## Commands

```bash
npm install
npm run dev    # http://localhost:4321
npm run build
npm run preview
```

## Content & design

- Brand / layout spec: [`documentation/design-system/design.md`](documentation/design-system/design.md)
- **Agents:** start with [`docs/design-system/agent-conductor.md`](docs/design-system/agent-conductor.md) then [`docs/design-system/design-prompt.md`](docs/design-system/design-prompt.md); see repo root [`AGENTS.md`](AGENTS.md).
- Business constants & nav: [`src/site.ts`](src/site.ts)
- Hero image: [`public/jet-1.png`](public/jet-1.png) (copy of `assets/jet-1.png`)

## SEO

- [`public/robots.txt`](public/robots.txt)
- [`public/sitemap.xml`](public/sitemap.xml) — update URLs if the production domain changes from `eagle.knotynetwork.com`.

## Deploy (Vercel)

Connect the repo, framework preset **Astro**, build `npm run build`, output `dist`. Set production domain / DNS when ready.

## Contact (v1)

No form POST — phone, Instagram, and `info@eagledetailing.com` only. Wire a form provider later if needed.
