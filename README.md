# Trịnh Trần Đức Anh - Portfolio

Bilingual English/Vietnamese portfolio built with Astro and TypeScript, prepared for Cloudflare Pages.

## Local development

```sh
npm install
npm run dev
```

## Production build

The canonical production origin defaults to `https://hkladoi.org`. To override it, set `PUBLIC_SITE_URL`, then run:

```sh
npm run build
```

Cloudflare Pages settings:

- Build command: `pnpm run build`
- Build output directory: `dist`
- Environment variable: `PUBLIC_SITE_URL=https://hkladoi.org`
