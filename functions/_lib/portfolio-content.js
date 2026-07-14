import { en, vi } from "../../src/data/portfolio-data.js";
import { CONTENT_LIMITS } from "./schema.js";

const contentByLocale = { en, vi };
const legacyProjectFields = ["title", "type", "description", "url"];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function emptyExperience() {
  return { company: "", role: "", period: "", projectOverview: "", responsibilities: "", technologies: [""] };
}

function emptyProject() {
  return { title: "", type: "", description: "", url: "" };
}

export function normalizeStoredContent(storedContent = {}) {
  if (!storedContent || typeof storedContent !== "object" || Array.isArray(storedContent)) return {};
  const normalized = { ...storedContent };
  for (const field of legacyProjectFields) {
    const legacyKey = `project.${field}`;
    const currentKey = `project.items.0.${field}`;
    if (typeof normalized[currentKey] !== "string" && typeof normalized[legacyKey] === "string") {
      normalized[currentKey] = normalized[legacyKey];
    }
    delete normalized[legacyKey];
  }
  return normalized;
}

function inferCount(stored, kind, fallback, max) {
  const countValue = stored[`${kind}.itemCount`];
  if (typeof countValue === "string" && /^\d+$/.test(countValue)) {
    return Math.min(max, Math.max(1, Number(countValue)));
  }

  const expression = kind === "experience" ? /^experience\.items\.(\d+)\./ : /^project\.items\.(\d+)\./;
  let highest = -1;
  for (const key of Object.keys(stored)) {
    const match = key.match(expression);
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  return Math.min(max, Math.max(fallback, highest + 1));
}

function resizeContent(content, stored) {
  const experienceCount = inferCount(stored, "experience", content.experience.items.length, CONTENT_LIMITS.experienceItems);
  const projectCount = inferCount(stored, "project", content.project.items.length, CONTENT_LIMITS.projectItems);

  while (content.experience.items.length < experienceCount) content.experience.items.push(emptyExperience());
  content.experience.items.length = experienceCount;
  while (content.project.items.length < projectCount) content.project.items.push(emptyProject());
  content.project.items.length = projectCount;

  for (let index = 0; index < experienceCount; index += 1) {
    let technologyCount = content.experience.items[index].technologies.length;
    const prefix = `experience.items.${index}.technologies.`;
    for (const key of Object.keys(stored)) {
      if (!key.startsWith(prefix)) continue;
      const technologyIndex = Number(key.slice(prefix.length));
      if (Number.isInteger(technologyIndex)) technologyCount = Math.max(technologyCount, technologyIndex + 1);
    }
    technologyCount = Math.min(CONTENT_LIMITS.technologies, Math.max(1, technologyCount));
    while (content.experience.items[index].technologies.length < technologyCount) {
      content.experience.items[index].technologies.push("");
    }
  }
}

function setExistingString(content, path, value) {
  if (typeof value !== "string" || path.endsWith(".itemCount")) return;
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
  const stored = normalizeStoredContent(storedContent);
  resizeContent(content, stored);
  for (const [path, value] of Object.entries(stored)) setExistingString(content, path, value);
  return content;
}
