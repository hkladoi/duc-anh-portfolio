# Trịnh Trần Đức Anh - Portfolio

Bilingual English/Vietnamese portfolio built with Astro and TypeScript. The site focuses on a short introduction, contact details, work experience, and the live personal project at `store.hkladoi.tech`.

## Local development

```sh
npm install
npm run dev
```

## Production build

The canonical production origin defaults to `https://portfolio.hkladoi.tech`. To override it, set `PUBLIC_SITE_URL`, then run:

```sh
npm run build
```

Cloudflare Pages settings:

- Build command: `pnpm run build`
- Build output directory: `dist`
- Environment variable: `PUBLIC_SITE_URL=https://portfolio.hkladoi.tech`

## Private inline editor

The production site includes an owner-only inline content editor backed by Cloudflare Pages Functions and KV. The private URL fragment trusts the current browser for 8 hours through a secure HTTP-only cookie. On a trusted browser, press `Ctrl+E`, then `Ctrl+D` within 1.5 seconds to enter edit mode. The editor toolbar can switch between English and Vietnamese without leaving edit mode. The API accepts only the predefined text, contact, experience, technology, and personal-project fields; section structure cannot be added, removed, or changed.

Required production bindings:

- KV namespace: `PORTFOLIO_CONTENT`
- Secret: `EDITOR_KEY_HASH`
- Secret: `EDITOR_SESSION_SECRET`
