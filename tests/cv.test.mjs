import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { PDFDocument } from "pdf-lib";
import { buildCvPdf } from "../functions/_lib/cv.js";
import { resolvePortfolioContent } from "../functions/_lib/portfolio-content.js";
import { onRequestGet as getCv } from "../functions/api/cv.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fontFiles = {
  regular: "noto-serif-400.ttf",
  bold: "noto-serif-700.ttf"
};

async function loadFontBytes() {
  return Object.fromEntries(await Promise.all(Object.entries(fontFiles).map(async ([name, filename]) => [
    name,
    new Uint8Array(await readFile(path.join(root, "public", "fonts", filename)))
  ])));
}

function createKv(content) {
  return {
    async get() {
      return content;
    }
  };
}

test("portfolio defaults and saved KV overrides resolve into one CV model", () => {
  const content = resolvePortfolioContent("vi", {
    "introduction.name": "Tên đã cập nhật",
    "experience.items.0.responsibilities": "Nghiệp vụ mới đã lưu",
    "project.url": "https://example.com/updated"
  });

  assert.equal(content.introduction.name, "Tên đã cập nhật");
  assert.equal(content.experience.items[0].responsibilities, "Nghiệp vụ mới đã lưu");
  assert.equal(content.project.url, "https://example.com/updated");
  assert.equal(content.experience.items.length, 3);
});

test("CV generator creates readable Vietnamese and English PDF documents", async () => {
  const fonts = await loadFontBytes();

  for (const locale of ["vi", "en"]) {
    const bytes = await buildCvPdf(resolvePortfolioContent(locale), locale, fonts);
    assert.equal(String.fromCharCode(...bytes.slice(0, 5)), "%PDF-");
    const document = await PDFDocument.load(bytes);
    assert.ok(document.getPageCount() >= 2);
    assert.ok(document.getPageCount() <= 3);
  }
});

test("CV API returns an uncached inline PDF with latest KV content", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const filename = path.basename(new URL(input).pathname);
    const bytes = await readFile(path.join(root, "public", "fonts", filename));
    return new Response(bytes, { status: 200, headers: { "Content-Type": "font/ttf" } });
  };

  try {
    const request = new Request("https://portfolio.example/api/cv?locale=vi");
    const env = {
      PORTFOLIO_CONTENT: createKv({
        "experience.items.0.responsibilities": "Đã cập nhật từ KV"
      })
    };
    const response = await getCv({ request, env });
    const bytes = new Uint8Array(await response.arrayBuffer());

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Content-Type"), "application/pdf");
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("Content-Disposition"), 'inline; filename="trinh-tran-duc-anh-cv-vi.pdf"');
    assert.equal(String.fromCharCode(...bytes.slice(0, 5)), "%PDF-");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("CV API rejects unsupported locales", async () => {
  const response = await getCv({
    request: new Request("https://portfolio.example/api/cv?locale=fr"),
    env: {}
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid locale" });
});
