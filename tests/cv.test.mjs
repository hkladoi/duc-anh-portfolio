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
    "experience.itemCount": "4",
    "experience.items.0.responsibilities": "Nghiệp vụ mới đã lưu",
    "experience.items.3.company": "Công ty mới",
    "experience.items.3.role": ".NET Developer",
    "experience.items.3.period": "2026 — Hiện tại",
    "experience.items.3.projectOverview": "Dự án mới",
    "experience.items.3.responsibilities": "Công việc mới",
    "experience.items.3.technologies.0": "C#",
    "project.itemCount": "2",
    "project.title": "Dự án cũ trong KV",
    "project.url": "https://example.com/updated",
    "project.items.1.title": "Dự án thứ hai",
    "project.items.1.type": "Công cụ",
    "project.items.1.description": "Mô tả dự án thứ hai",
    "project.items.1.url": "https://example.com/second"
  });

  assert.equal(content.introduction.name, "Tên đã cập nhật");
  assert.equal(content.experience.items[0].responsibilities, "Nghiệp vụ mới đã lưu");
  assert.equal(content.project.items[0].url, "https://example.com/updated");
  assert.equal(content.project.items[0].title, "Dự án cũ trong KV");
  assert.equal(content.project.items[1].title, "Dự án thứ hai");
  assert.equal(content.experience.items.length, 4);
  assert.equal(content.project.items.length, 2);
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

test("CV generator paginates added experience and project rows", async () => {
  const fonts = await loadFontBytes();
  const content = resolvePortfolioContent("vi", {
    "experience.itemCount": "4",
    "experience.items.3.company": "Công ty bổ sung",
    "experience.items.3.role": ".NET Developer",
    "experience.items.3.period": "2026 — Hiện tại",
    "experience.items.3.projectOverview": "Một dự án có nội dung động từ editor.",
    "experience.items.3.responsibilities": "Phát triển, kiểm thử và vận hành các tính năng nghiệp vụ.",
    "experience.items.3.technologies.0": "C#",
    "project.itemCount": "2",
    "project.items.1.title": "Dự án bổ sung",
    "project.items.1.type": "Ứng dụng web",
    "project.items.1.description": "Dự án cá nhân được thêm trực tiếp từ portfolio.",
    "project.items.1.url": "https://example.com/project"
  });

  const bytes = await buildCvPdf(content, "vi", fonts);
  const document = await PDFDocument.load(bytes);
  assert.ok(document.getPageCount() >= 2);
  assert.ok(document.getPageCount() <= 4);
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
