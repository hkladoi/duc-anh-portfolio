import { buildCvPdf } from "../_lib/cv.js";
import { json } from "../_lib/http.js";
import { resolvePortfolioContent } from "../_lib/portfolio-content.js";
import { parseLocale } from "../_lib/schema.js";

const fontPaths = {
  regular: "/fonts/noto-serif-400.ttf",
  bold: "/fonts/noto-serif-700.ttf"
};

let fontBytesPromise;

async function loadFonts(request) {
  if (!fontBytesPromise) {
    const origin = new URL(request.url).origin;
    fontBytesPromise = Promise.all(Object.entries(fontPaths).map(async ([name, path]) => {
      const response = await fetch(new URL(path, origin));
      if (!response.ok) throw new Error(`Could not load PDF font: ${name}`);
      return [name, new Uint8Array(await response.arrayBuffer())];
    })).then(Object.fromEntries);
  }

  try {
    return await fontBytesPromise;
  } catch (error) {
    fontBytesPromise = undefined;
    throw error;
  }
}

export async function onRequestGet({ request, env }) {
  const locale = parseLocale(new URL(request.url).searchParams.get("locale"));
  if (!locale) return json({ error: "Invalid locale" }, { status: 400 });

  try {
    const storedContent = env.PORTFOLIO_CONTENT
      ? await env.PORTFOLIO_CONTENT.get(`content:${locale}`, { type: "json" })
      : {};
    const content = resolvePortfolioContent(locale, storedContent || {});
    const pdf = await buildCvPdf(content, locale, await loadFonts(request));
    const filename = `trinh-tran-duc-anh-cv-${locale}.pdf`;

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("CV generation failed", error);
    return json({ error: "Could not generate CV" }, { status: 500 });
  }
}
