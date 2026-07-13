import { en, vi } from "../../src/data/portfolio-data.js";

const contentByLocale = { en, vi };

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setExistingString(content, path, value) {
  if (typeof value !== "string") return;

  const parts = path.split(".");
  let cursor = content;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = /^\d+$/.test(parts[index]) ? Number(parts[index]) : parts[index];
    if (cursor == null || !(key in cursor)) return;
    cursor = cursor[key];
  }

  const finalPart = parts.at(-1);
  const finalKey = /^\d+$/.test(finalPart) ? Number(finalPart) : finalPart;
  if (cursor != null && typeof cursor[finalKey] === "string") cursor[finalKey] = value;
}

export function resolvePortfolioContent(locale, storedContent = {}) {
  const base = contentByLocale[locale];
  if (!base) throw new Error("Unsupported locale");

  const content = clone(base);
  if (!storedContent || typeof storedContent !== "object" || Array.isArray(storedContent)) return content;

  for (const [path, value] of Object.entries(storedContent)) setExistingString(content, path, value);
  return content;
}

