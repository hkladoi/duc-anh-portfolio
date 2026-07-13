import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://hkladoi.org");
  const urls = [new URL("/", base), new URL("/vi/", base)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((url, index) => `  <url>
    <loc>${url.href}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/", base).href}" />
    <xhtml:link rel="alternate" hreflang="vi" href="${new URL("/vi/", base).href}" />
    <priority>${index === 0 ? "1.0" : "0.9"}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
